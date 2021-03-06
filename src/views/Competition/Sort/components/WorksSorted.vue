<template>
  <div>
    <el-collapse accordion @change="changeYear">
      <el-collapse-item v-for="item in yearList" :key="item.lable" :title="item.name + '年'" :name="item.lable">
        <!-- 表格内容 -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="changesWorkId"
        >
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="学号">
                  <span>{{ row.number }}</span>
                </el-form-item>
                <el-form-item label="参赛邮箱">
                  <span>{{ row.email }}</span>
                </el-form-item>
                <el-form-item label="参赛学校">
                  <span>{{ row.school }}</span>
                </el-form-item>
                <el-form-item label="专业">
                  <span>{{ row.major }}</span>
                </el-form-item>
                <el-form-item label="联系电话">
                  <span>{{ row.phone }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="30px" />
          <el-table-column label="ID" width="55px" align="center" type="index" />
          <el-table-column label="竞赛名称" min-width="200px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.match_name }}</span>
              <el-tag>{{ row.match_project }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="作品名称" align="center" min-width="200px">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleWork(row.wid)">{{ row.worksname }}</span>
              <el-tag>{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="负责人" width="120px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.author1_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="指导老师" width="120px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.teacher }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="220px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="作品状态" width="120px" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.normalization === -2" type="warning">高度相似</el-tag>
              <el-tag v-if="row.normalization === -1" type="danger">已退回作品</el-tag>
              <el-tag v-if="row.normalization === 0">待审核</el-tag>
              <el-tag v-if="row.normalization === 1" type="warning">待分配</el-tag>
              <el-tag v-if="row.normalization === 2">已分配</el-tag>
              <el-tag v-if="row.normalization === 3">已评分</el-tag>
              <el-tag v-if="row.normalization === 5 || row.normalization === 4" type="success">出线</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="作品资源" align="center" width="180px" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="primary" size="small" icon="el-icon-download" @click.stop="handleDownloadOne(row)">
                下载
              </el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="operability" label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.normalization === 5" type="danger" size="small" disabled @click="handleFin(row,$index)">
                进入决赛
              </el-button>
              <el-button v-else type="primary" size="small" @click="handleFin(row,$index)">
                进入决赛
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { downAllWork, downOneWork, overAcccess } from '@/api/Competition/works/all'
import { downAllWorkCourse } from '@/api/Competition/course'
import { getSortWorks } from '@/api/Competition/sort/WorksSorted'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Reviewed',
  directives: { waves },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    isCourseAdmin: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      workUrl: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        teacher: '',
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        author1_name: '',
        year: ''
      },
      temp: {
        id: undefined,
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '作品详情'
      },
      downloadLoading: false,
      checkedWorks: [], // 多选框选中的作品
      workId: [], // 传给后台的作品ID数组
      downExcel: '',
      searchData: {
        pageNum: 1,
        pageSize: 20
      },
      yearList: [
        { name: '2021', lable: 1 },
        { name: '2020', lable: 2 }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  // created() {
  //   this.getList()
  // },
  methods: {
    getList() {
      if (this.isCourseAdmin) {
        getSortWorks(this.listQuery).then(response => {
          if (response.obj.worksList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      } else {
        getSortWorks(this.listQuery).then(response => {
          if (response.obj.worksList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      }
    },
    changeYear(val) {
      this.listQuery.year = this.yearList[val - 1].name
      console.log(this.listQuery.year)
      this.getList()
    },
    handleDownloadAll() {
      if (this.isCourseAdmin) {
        downAllWorkCourse().then(response => {
          this.$emit('workUrl', response)
        })
      } else {
        downAllWork().then(response => {
          this.$emit('workUrl', response)
        })
      }
    },
    handleDownloadOne(row) {
      downOneWork(row.wid).then(response => {
        window.location.href = response.obj
        this.$notify({
          title: '成功',
          message: '文件打包成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 搜索
    search(val) {
      this.listQuery = val
      this.getList()
    },
    handleFilter() {
      this.$parent.handleFilter()
    },
    // 作品详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    handleDownload(header, filterVal) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header,
          data,
          filename: '作品列表'
        })
      })
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 获取多选框的值
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // 直接进入决赛
    handleFin(val, index) {
      if (this.checkedWorks.length === 0) {
        this.workId.push(val.wid)
        overAcccess(this.workId).then(response => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.workId = []
        this.checkedWorks.forEach(element => {
          this.workId.push(element.wid)
        })
        overAcccess(this.workId).then(response => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      }
      setTimeout(this.getList, 300)
    }
  }
}
</script>
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  .el-collapse {
    border-top: 0;
  }
  .el-table::before {
    height: 0;
  }
</style>

