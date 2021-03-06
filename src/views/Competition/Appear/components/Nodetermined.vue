<template>
  <div>
    <!-- 表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.mid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交作品数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalWork }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability || isCourseAdmin" label="操作" align="center" width="140px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="handleDetermined(row,$index)">
            制作出线名单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <div class="filter-container">
        <!-- 功能框分为三部分 -->
        <div class="flex-box">
          <el-button style="visibility: hidden" class="filter-item" type="primary" icon="el-icon-edit">
            添加
          </el-button>
          <div>
            <template>
              <el-radio v-model="radio" label="1">百分比</el-radio>
              <el-radio v-model="radio" label="2">排名</el-radio>
            </template>
            <el-input v-if="radio=='1'" v-model="Qualify.percentage" style="width: 100px;" class="filter-item" @keyup.enter.native="handleGenerate('1')" />
            <el-input v-else v-model="Qualify.ranknum" style="width: 100px;" class="filter-item" @keyup.enter.native="handleGenerate('2')" />&nbsp;
            <el-button v-waves class="filter-item" type="primary" @click="handleGenerate(radio)">
              生成出线名单
            </el-button>
          </div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" style="visibility: hidden" type="primary" icon="el-icon-download" @click="handleDownload">
            导出Excel
          </el-button>
        </div>
      </div>
      <div>
        <el-table :data="makeList" stripe style="width: 100%" @selection-change="changesWorkId">
          <el-table-column type="selection" width="30px" />
          <el-table-column prop="address" label="ID">
            <template slot-scope="{row}">
              <span>{{ row.wid }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="作品名称">
            <template slot-scope="{row}">
              <span>{{ row.worksname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="团队名">
            <template slot-scope="{row}">
              <span>{{ row.teamname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="竞赛项目">
            <template slot-scope="{row}">
              <span>{{ row.match_project }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分数">
            <template slot-scope="{row}">
              <span>{{ row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名次">
            <template slot-scope="{row}">
              <span>{{ row.rank }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">
          取消
        </el-button>
        <el-button v-waves class="filter-item" type="primary" @click="handleSubmit">
          提交出线名单
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toCXForMatch, getCXWorksbyMatch, toChuXian } from '@/api/Competition/appear/nodetermined'
import { getCourseUnriseWorks, getCourseCXWorksbyMatch, CoursetoChuXian } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Nodetermined',
  directives: { waves },
  components: { Pagination },
  props: {
    isCourseAdmin: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      // 制作出线名单
      Qualify: {
        percentage: '',
        mid: '',
        totalWork: '',
        ranknum: 1
      },
      makeList: null,
      // 多选框选中的作品
      checkedWorks: [],
      // 选中作品的id
      WorksId: [],
      makeTotal: 0,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        timestart: new Date(),
        timeend: new Date(),
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '确定生成出线名单',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      radio: '1'
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
    getList() {
      if (this.isCourseAdmin) {
        getCourseUnriseWorks(this.listQuery).then(response => {
          if (response.obj.matchList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.matchList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      } else {
        toCXForMatch(this.listQuery).then(response => {
          if (response.obj.matchList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.matchList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestart: new Date(),
        timeend: new Date(),
        name: '',
        type: ''
      }
    },
    // 制作出线名单
    handleDetermined(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.Qualify.mid = row.mid
      this.Qualify.totalWork = row.totalWork
    },
    // 生成出线名单
    handleGenerate(type) {
      if (type === '1') {
        this.Qualify.ranknum = 0
      } else {
        this.Qualify.percentage = 0
      }
      if (this.isCourseAdmin) {
        getCourseCXWorksbyMatch(this.Qualify).then(response => {
          this.makeList = response.obj
          this.makeTotal = response.obj.length
          this.listLoading = false
        })
      } else {
        getCXWorksbyMatch(this.Qualify).then(response => {
          this.makeList = response.obj
          this.makeTotal = response.obj.length
          this.listLoading = false
        })
      }
    },
    // 提交出线名单
    handleSubmit() {
      this.WorksId = []
      this.checkedWorks.forEach(element => {
        this.WorksId.push(element.wid)
      })
      if (!this.WorksId.length) {
        this.$notify({
          message: '请选择出线作品',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.isCourseAdmin) {
        CoursetoChuXian(this.WorksId, this.Qualify).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.findIndex(v => v.mid === this.Qualify.mid)
          this.list.splice(index, 1)
        })
      } else {
        toChuXian(this.WorksId, this.Qualify).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.findIndex(v => v.mid === this.Qualify.mid)
          this.list.splice(index, 1)
        })
      }
    },
    // 获取多选框的值
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // 关闭时触发清空临时变量
    handleClose() {
      this.dialogFormVisible = false
      this.Qualify = {
        percentage: '',
        mid: '',
        totalWork: ''
      }
      this.WorksId = []
      this.checkedWorks = []
      this.makeList = null
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '出线作品数量']
        const filterVal = ['mid', 'match_name', 'type', 'totalWork']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '未出线列表'
        })
        this.downloadLoading = false
      })
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
</style>
