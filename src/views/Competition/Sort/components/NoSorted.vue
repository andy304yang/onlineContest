<template>
  <div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="clickTable"
      @selection-change="changesWorkId"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="承办单位">
              <span>{{ row.clubname }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ row.number }}</span>
            </el-form-item>
            <el-form-item label="发布单位">
              <span>{{ row.poster }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span v-html="row.content" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="30px" />
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="海报图" min-width="110px" align="center">
        <template slot-scope="{row}">
          <el-popover v-if="row.image" placement="right" title="" trigger="hover">
            <img :src="url+row.image" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image" :alt="row.image" style="height: 100px;width: 100px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛项目" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.project }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click.stop="changeSwitch(row)">
            上线
          </el-button>
          <el-button type="primary" size="mini" @click.stop="handleSort(row)">
            归档
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNoSortCompetitions, sortCompetitions, ShowMatch } from '@/api/Competition/sort/NoSorted'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const club = []

const clubTypeKeyValue = club.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'NoSorted',
  components: { Pagination },
  directives: { waves },
  filters: {
    clubFilter(type) {
      return clubTypeKeyValue[type]
    }
  },
  data() {
    return {
      value: true,
      // 海报图
      limit: 1,
      disabled: false,
      fileList: [],
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      clublist: null,
      // 搜索内容
      searchKey: '',
      checkedSearch: 'project',
      searchOptions: [
        { key: 'project', display_name: '竞赛项目' },
        { key: 'poster', display_name: '承办单位' },
        { key: 'name', display_name: '竞赛名称' },
        { key: 'type', display_name: '竞赛类别' }
      ],
      club: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        project: '',
        type: '',
        poster: ''
      },
      temp: {
        project: '',
        name: '',
        type: '',
        start_date: '',
        end_date: '',
        club_id: '',
        clubname: '',
        number: '',
        poster: '',
        content: '',
        url: '',
        mid: undefined,
        now: '',
        pictures: [],
        image1: '',
        image2: '',
        image3: '',
        image4: ''
      },
      nowTemp: '',
      dialogFormVisible: false,
      dialogStatus: '',
      flag: 1,
      // 下载excel
      downloadLoading: false,
      url: 'https://sd.bnuz.edu.cn',
      checkedWorks: [], // 多选框选中的作品
      workId: {
        mid: []
      } // 传给后台的作品ID数组
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 嵌套弹框预览图片
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getList() {
      getNoSortCompetitions(this.listQuery).then(response => {
        this.list = response.obj.questionList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: '',
        project: '',
        type: '',
        poster: ''
      }
    },
    handleFilter() {
      // 竞赛项目检索后台存在问题
      this.reset()
      this.listQuery[this.checkedSearch] = this.searchKey
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '项目名称', '竞赛项目', '类型', '开始时间', '结束时间', '进度', '负责协会', '联系方式', '发布人', '链接']
        const filterVal = ['mid', 'name', 'project', 'type', 'start_date', 'end_date', 'now', 'club_name', 'number', 'poster', 'url']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '竞赛项目'
        })
        this.downloadLoading = false
      })
    },
    // 多选
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // 多选归档
    handleSort(row) {
      if (this.checkedWorks.length === 0) {
        this.workId.mid.push(row.mid)
      } else {
        this.checkedWorks.forEach(element => {
          this.workId.mid.push(element.mid)
        })
      }
      sortCompetitions(this.workId).then(() => {
        this.$notify({
          title: '成功',
          message: '成功归档',
          type: 'success',
          duration: 2000
        })
      })
      this.workId.mid = []
      setTimeout(this.getList, 300)
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    // 上线竞赛
    changeSwitch(row) {
      ShowMatch(row).then(() => {
        this.$notify({
          title: '成功',
          message: '成功修改',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '请刷新页面再操作哦！',
          type: 'success',
          duration: 2000
        })
      })
      event.stopPropagation()
      setTimeout(this.getList, 300)
    },
    handleClear() {
      this.reset()
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .el-dialog {
    width: 60%;
  }
</style>
