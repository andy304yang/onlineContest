<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分handleFilter -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div />
        <div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
            导出Excel
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格内容 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80px" type="index" />
      <el-table-column label="客户名称" prop="title" align="center" min-width="220px">
        <template slot-scope="{row}">
          <span v-if="row.clubname" class="link-type">{{ row.clubname }}</span>
          <span v-else>起个标题</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="220" align="center">
        <template slot-scope="{row}">
          <span v-if="row.phone" class="link-type">{{ row.phone }}</span>
          <span v-else>竞赛名称</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该数据吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <!-- <el-button slot="reference" size="mini" type="danger" disabled>删除</el-button> -->
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 90%; margin-left:50px;">
        <el-form-item label="协会名称" prop="clubname" style="width: 70%;">
          <el-input v-model="temp.clubname" />
        </el-form-item>
        <el-form-item label="协会负责人" prop="leader" style="width: 70%;">
          <el-input v-model="temp.leader" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone" style="width: 70%;">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width: 70%;">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="temp.date" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="学校" prop="college" style="width: 70%;">
          <el-input v-model="temp.college" />
        </el-form-item>
        <el-form-item label="协会简介" prop="content" style="width: 100%;">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getClubMes, addClubMes, updateClubMes, deleteClub } from '@/api/Society/societylist'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'SocietyList',
  components: { Pagination, Tinymce },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      // 弹框内容
      temp: {
        cid: '',
        page: 1,
        limit: 20,
        phone: '',
        leader: '',
        clubname: '',
        content: '',
        email: '',
        date: new Date(),
        college: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      flag: 1,
      // 弹框规则
      rules: {
        phone: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        leader: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        date: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        email: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        clubname: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        college: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      // 下载excel
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
    // 网络请求获取表格数据
    getList() {
      getClubMes(this.listQuery).then(response => {
        this.list = response.obj.clubList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        phone: '',
        leader: '',
        clubname: '',
        content: '',
        email: '',
        date: new Date(),
        college: ''
      }
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent('')
        })
      }
      this.flag++
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.date = parseTime(this.temp.date, '{y}-{m}-{d} {h}:{i}')
          this.temp.cid = this.total
          addClubMes(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 弹出编辑框
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.cid = row.cid
      this.temp.timestamp = new Date(this.temp.time)
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent(this.temp.content)
        })
      }
      this.flag++
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateClubMes(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row, index) {
      deleteClub(row.cid).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '请刷新页面再操作哦！',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '协会名称', '联系人', '联系方式', '协会简介']
        const filterVal = ['cid', 'clubname', 'leader', 'phone', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '协会列表'
        })
        this.downloadLoading = false
      })
    },
    // 转换时间戳呈现效果
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
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
