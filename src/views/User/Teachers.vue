<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download">
            <a :href="downloadExcel">导出Excel</a>
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
      @row-click="clickTable"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名">
              <span>{{ row.username }}</span>
            </el-form-item>
            <el-form-item label="密码">
              <span>{{ row.password }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.tid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="title" align="center" min-width="130px">
        <template slot-scope="{row}">
          <span>{{ row.realname }}</span>
          <el-tag v-if="row.code === 0 || row.isJudge === '0'">教师</el-tag>
          <el-tag v-else>评委</el-tag>
          <el-tag v-if="row.role" type="success">{{ row.role | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学校" prop="title" align="center" min-width="130px">
        <template slot-scope="{row}">
          <span>{{ row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" prop="title" align="center" min-width="130px">
        <template slot-scope="{row}">
          <span>{{ row.college }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button align="center" size="small" type="info" @click.stop="handleSetting(row)">
            设置身份
          </el-button>
          <el-button type="primary" size="small" @click.stop="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该数据吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 95%; margin-left:50px;">
        <el-form-item label="教师姓名" prop="realname" style="width: 70%;">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="登录名" prop="username" style="width: 70%;">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width: 70%;">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="学校" prop="school" style="width: 70%;">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="学院" prop="college" style="width: 70%;">
          <el-input v-model="temp.college" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone" style="width: 70%;">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width: 70%;">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="设置评委" prop="isJudge">
          <el-radio-group v-model="temp.isJudge">
            <el-radio v-for="(value,key) in isJudgeOptions" :key="key" border :label="value.key">{{ value.name }}</el-radio>
          </el-radio-group>
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
    <!-- 设置身份弹框 -->
    <el-dialog title="设置身份" :visible.sync="dialogSetFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 95%; margin-left:50px;">
        <el-form-item label="设置评委" prop="isJudge">
          <el-radio-group v-model="temp.isJudge">
            <el-radio v-for="(value,key) in isJudgeOptions" :key="key" border :label="value.key">{{ value.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设置管理员" prop="isRole">
          <el-radio-group v-model="temp.isRole">
            <el-radio v-for="(value,key) in isRoleOptions" :key="key" border :label="value.key">{{ value.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="parseInt(temp.isRole)" label="管理员角色" prop="role">
          <div class="radio-box">
            <el-radio-group v-model="temp.role">
              <el-radio v-for="(value,key) in calendarTypeOptions" :key="key" border :label="value.key">{{ value.name }}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="setPower">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// getClubs,
import { getTeacher, tobeJudge, addTeacherMes, updateTeacherMes, downloadTeacherMes, getRoles, tobeAdmin, tonotbeJudge, toDelect } from '@/api/User/teacher'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

const calendarTypeOptions = [
  { key: 'admin', name: '数据管理员' },
  { key: 'seniorAdmin', name: '高级管理员' },
  { key: 'clubAdmin', name: '协会管理员' },
  { key: 'specialAdmin', name: '专项管理员' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码至少6位数！'))
  } else {
    callback()
  }
}

export default {
  name: 'Teacher',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      // 搜索内容
      searchKey: '',
      checkedSearch: 'name',
      searchOptions: [
        { key: 'name', display_name: '教师姓名' },
        { key: 'college', display_name: '学院' },
        { key: 'school', display_name: '学校' }
      ],
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        realname: '',
        username: '',
        college: '',
        school: ''
      },
      // 弹框内容
      temp: {
        id: undefined,
        realname: '',
        username: '',
        college: '',
        school: '',
        email: '',
        password: '',
        phone: '',
        code: '',
        isRole: '0',
        isJudge: '0',
        role: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogSetFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        realname: [{ required: true, message: '教师姓名不能为空', trigger: 'change' }],
        username: [{ required: true, message: '登录名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码至少6位数', trigger: 'change', validator: validatePassword }]
      },
      // 下载excel
      downloadLoading: false,
      downloadExcel: '',
      isJudgeOptions: [
        { key: '1', name: '是' },
        { key: '0', name: '否' }
      ],
      isRoleOptions: [
        { key: '1', name: '是' },
        { key: '0', name: '否' }
      ],
      calendarTypeOptions: [
        { key: 'admin', name: '数据管理员' },
        { key: 'seniorAdmin', name: '高级管理员' },
        { key: 'specialAdmin', name: '专项管理员' }
      ],
      clubs: [],
      roles: []
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
    getRoles().then((res) => {
      this.roles = res.obj
    })
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      getTeacher(this.listQuery).then(response => {
        this.list = response.obj.teachList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
      downloadTeacherMes().then(response => {
        this.downloadExcel = response.obj
      })
    },
    handleSetting(row) {
      this.dialogSetFormVisible = true
      this.temp = Object.assign({}, row)
      this.$set(this.temp, 'isJudge', String(row.code))
      this.$set(this.temp, 'isRole', row.role ? '1' : '0')
    },
    setPower() {
      const p1 = new Promise((resolve, reject) => {
        const target = this.list.find(v => v.tid === this.temp.tid)
        const isJudge = parseInt(this.temp.isJudge)
        this.temp.code = isJudge
        const isChange = target.code !== this.temp.code
        if (isJudge && isChange) {
          tobeJudge(this.temp.tid).then(() => {})
        } else if (!isJudge && isChange) {
          tonotbeJudge(this.temp.tid).then(() => {})
        }
        resolve('success1')
      })

      const p2 = new Promise((resolve, reject) => {
        if (parseInt(this.temp.isRole)) {
          this.roles.forEach((item) => {
            if (item.rname === this.temp.role) {
              this.temp.roleId = item.rid
            }
          })
        } else {
          this.temp.roleId = -1
          this.temp.role = ''
        }
        tobeAdmin(this.temp).then(() => {})
        resolve('success2')
      })

      Promise.all([p1, p2]).then(() => {
        this.$notify({
          title: '成功',
          message: '设置身份成功',
          type: 'success',
          duration: 2000
        })
        this.dialogSetFormVisible = false
        const index = this.list.findIndex(v => v.tid === this.temp.tid)
        this.list.splice(index, 1, this.temp)
      })
    },
    // 删除操作
    handleDelete(row, index) {
      toDelect(row.tid).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        realname: '',
        username: '',
        college: '',
        major: ''
      }
      if (this.checkedSearch === 'name') {
        this.listQuery.realname = this.searchKey
      } else if (this.checkedSearch === 'college') {
        this.listQuery.college = this.searchKey
      } else if (this.checkedSearch === 'school') {
        this.listQuery.school = this.searchKey
      }
      this.listQuery.page = 1
      this.getList()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        realname: '',
        username: '',
        college: '',
        school: '',
        email: '',
        password: '',
        phone: '',
        isRole: '0',
        isJudge: '0',
        role: ''
      }
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
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
          addTeacherMes(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.total = this.total + 1
            this.temp.tid = this.total
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
          updateTeacherMes(tempData).then(() => {
            const index = this.list.findIndex(v => v.gid === this.temp.gid)
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
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '姓名', '学院', '专业', '邮箱', '部门', '用户名', '密码']
        const filterVal = ['tid', 'realname', 'college', 'major', 'email', 'match_name', 'username', 'password']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '教师管理'
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
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  .demo-table-expand .el-form-item {
    margin-left: 3%;
    margin-bottom: 0;
    width: 50%;
    /deep/ label {
      font-weight: normal;
      width: 90px;
      color: #99a9bf;
    }
  }
</style>
