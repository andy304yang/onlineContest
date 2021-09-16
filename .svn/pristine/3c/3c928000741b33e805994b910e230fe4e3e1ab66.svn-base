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
          <span>{{ row.wid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWork(row)">{{ row.worksname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人名字" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="handleDetermined(row,$index)">
            评奖
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="评奖" :visible.sync="dialogVisible" width="40%">
      <template>
        <el-date-picker v-model="workInfo.time" type="datetime" placeholder="点击选择日期" /><br><br><br>

        <el-radio-group v-model="radio" @change="handleChangeAward">
          <el-radio v-for="(value, i) in pricelist" :key="i" :label="value.id">{{ value.prize_name }}</el-radio>
        </el-radio-group><br>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAward">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getReadyWorks, advance, getPrizeName } from '@/api/Competition/appear/qualifying'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'Nodetermined',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      pricelist: [],
      radio: 0,
      workInfo: {
        tempRadio: Number,
        wid: '',
        time: new Date()
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getPrice()
  },
  methods: {
    getList() {
      this.workInfo.time = parseTime(this.workInfo.time, '{y}-{m}-{d} {h}:{i}')
      getReadyWorks(this.listQuery).then(response => {
        this.list = response.obj.worksList
        this.total = response.obj.pageTotal
        this.radio = this.list.certificate
        this.listLoading = false
      })
    },
    // 获得奖项信息
    getPrice() {
      getPrizeName().then(response => {
        this.pricelist = response.obj
        this.listLoading = false
      })
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
    handleWork(row) {
      this.$emit('handleWork', row.wid)
    },
    // 弹出评奖
    handleDetermined(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogVisible = true
      this.workInfo.wid = row.wid
    },
    handleChangeAward(label) {
      this.workInfo.tempRadio = label
    },
    handleAward() {
      advance(this.workInfo).then(() => {
        this.dialogVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '评奖成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 关闭时触发清空临时变量
    handleClose() {
      this.dialogFormVisible = false
      this.WorksId = []
      this.checkedWorks = []
      this.makeList = null
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '作品名称', '负责人姓名', '指导老师', '学校']
        const filterVal = ['mid', 'match_name', 'type', 'worksname', 'author1_name', 'teacher', 'school']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '决赛名单'
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
