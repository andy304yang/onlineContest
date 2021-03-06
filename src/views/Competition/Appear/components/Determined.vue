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
      <el-table-column label="ID" prop="id" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总提交作品数量" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalWork }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出线率" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.point }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="出线作品数量" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.promoteNum }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="220px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button size="mini" type="primary" @click="handleUpdate(row,$index)">
            管理
          </el-button> -->
          <el-button size="mini" type="danger" @click="handleReturn(row,$index)">
            退回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog title="管理出线名单" :visible.sync="dialogFormVisible" width="80%">
      <el-tabs>
        <el-tab-pane label="已出线作品">
          <el-table :data="WorkList" stripe style="width: 100%">
            <el-table-column prop="worksname" label="作品名称">
              <template slot-scope="{row}">
                <span>{{ row.worksname }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="teamname" label="学校名称">
              <template slot-scope="{row}">
                <span>{{ row.school }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="teamname" label="团队名">
              <template slot-scope="{row}">
                <span>{{ row.teamname }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="分数">
              <template slot-scope="{row}">
                <span>{{ row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rank" label="名次">
              <template slot-scope="{row}">
                <span>{{ row.rank }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleAudit(row.wid)">
                  审核
                </el-button>
                <el-button type="danger" size="mini">
                  退回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未出线作品">
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="address" label="作品名称" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="name" label="名次" />
            <el-table-column prop="name" label="操作" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFinishMatch, getWorksDetail, Audit, Return } from '@/api/Competition/appear/determined'
import { getCourseRiseWorks } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Determined',
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
      // 请求获取作品信息
      Qualify: {
        mid: '',
        page: 1,
        limit: 20
      },
      // 作品信息
      WorkList: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        sort: '+id'
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
        update: '作品详情',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      downloadLoading: false
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
        getCourseRiseWorks(this.listQuery).then(response => {
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
        getFinishMatch(this.listQuery).then(response => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.Qualify.mid = row.mid
      getWorksDetail(this.Qualify).then(response => {
        this.WorkList = response.obj.worksList
        this.listLoading = false
      })
    },
    // 作品审核
    handleAudit(wid) {
      Audit(wid).then(() => {
        this.$notify({
          title: '成功',
          message: '审核成功',
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
    },
    handleReturn(row) {
      Return(row.mid).then(() => {
        this.$notify({
          title: '成功',
          message: '退回成功',
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '总提交作品数量', '出线率/%', '出线作品数量']
        const filterVal = ['mid', 'match_name', 'type', 'totalWork', 'point', 'promoteNum']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已出线列表'
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
