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
      @row-click="clickTable"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="登录名">
              <span>{{ row.username }}</span>
            </el-form-item>
            <el-form-item label="密码">
              <span>{{ row.password }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.gid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="130">
        <template slot-scope="{row}">
          <span>{{ row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roles[0].chname }}</span>
          <el-tag v-if="row.clubname" type="info">{{ row.clubname }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="195" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click.stop="handleUpdate(row)">
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
    <el-dialog v-loading="loading" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 80%; margin-left:50px;">
        <el-form-item label="姓名" prop="realname" style="width: 60%;">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="登录名" prop="username" style="width: 60%;">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width: 60%;">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-radio-group v-if="temp.clubname !== 'teacher'" v-model="temp.roles">
            <el-radio v-for="item in roles" :key="item.rid" border :label="item.rid">{{ item.chname }}</el-radio>
          </el-radio-group>
          <el-radio-group v-if="temp.clubname == 'teacher'" v-model="temp.roles">
            <el-radio v-for="item in roles.slice(0, 2)" :key="item.rid" border :label="item.rid">
              {{ item.chname }}
            </el-radio>
            <el-radio v-for="item in roles.slice(3, 4)" :key="item.rid" border :label="item.rid">
              {{ item.chname }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.roles === 4 || temp.roles === 7" label="赛事组织" prop="cid">
          <el-select v-model="temp.cid" class="filter-item">
            <el-option v-for="item in clubs" :key="item.cid" :label="item.clubname" :value="item.cid" />
          </el-select>
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
import { getAdministrators, addAdministrators, updateAdministrators, deleteAdministrators, search, getRoles, getClubs } from '@/api/User/administrator'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const calendarTypeOptions = []

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
  name: 'Administrators',
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
      searchData: {
        pageNum: 1,
        pageSize: 20,
        realname: '',
        username: ''
      },
      checkedSearch: 'realname',
      searchOptions: [
        { key: 'realname', display_name: '管理员姓名' },
        { key: 'username', display_name: '登录名' }
      ],
      checkAll: false, // 全选状态
      isIndeterminate: true,
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20
      },
      calendarTypeOptions,
      // 弹框内容
      temp: {
        gid: undefined,
        roleList: 0,
        realname: '',
        username: '',
        password: '',
        roles: '',
        cid: 0
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则 type: 'number',
      rules: {
        realname: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        username: [{ required: true, message: '登录名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码至少6位数', trigger: 'change', validator: validatePassword }],
        roles: [{ required: true, message: '角色不能为空', trigger: 'change' }],
        cid: [{ required: true, message: '协会不能为空', trigger: 'change', validator: this.validateCid }]
      },
      roles: [],
      clubs: [],
      loading: true,
      permissions: '',
      // 下载excel
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      getAdministrators(this.listQuery).then(response => {
        this.list = response.obj.gserList
        this.list.forEach(item => {
          item.roles.forEach(value => {
            switch (value.rname) {
              case 'admin':
                value.chname = '数据管理员'
                break
              case 'specialAdmin':
                value.chname = '专项管理员'
                break
              case 'seniorAdmin':
                value.chname = '高级管理员'
                break
              case 'clubAdmin':
                value.chname = '协会管理员'
                break
              case 'courseAdmin':
                value.chname = '课程管理员'
                break
            }
          })
        })
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    validateCid(rule, value, callback) {
      if (this.temp.roles === 'clubAdmin' && !value) {
        callback(new Error('协会不能为空'))
      } else {
        callback()
      }
      if (this.temp.roles === 'courseAdmin' && !value) {
        callback(new Error('课程不能为空'))
      } else {
        callback()
      }
    },
    // 搜索
    handleFilter() {
      const isRealname = this.checkedSearch === 'realname'
      this.searchData.realname = isRealname ? this.searchKey : ''
      this.searchData.username = isRealname ? '' : this.searchKey
      search(this.searchData).then(response => {
        if (response.obj.pageTotal === 0) {
          this.$notify({
            title: '对不起！',
            message: '没有您想要的数据',
            type: 'warning',
            duration: 2000
          })
          return
        } else {
          this.listQuery.page = 1
          this.list = response.obj.gserList
          this.list.forEach(item => {
            item.roles.forEach(value => {
              switch (value.rname) {
                case 'admin':
                  value.chname = '数据管理员'
                  break
                case 'specialAdmin':
                  value.chname = '专项管理员'
                  break
                case 'seniorAdmin':
                  value.chname = '高级管理员'
                  break
                case 'clubAdmin':
                  value.chname = '协会管理员'
                  break
                case 'courseAdmin':
                  value.chname = '课程管理员'
                  break
              }
            })
          })
          this.total = response.obj.pageTotal
          this.listLoading = false
        }
      })
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        gid: undefined,
        roleList: 0,
        realname: '',
        username: '',
        password: '',
        roles: '',
        cid: ''
      }
    },
    getMessage() {
      getRoles().then((res) => {
        this.roles = res.obj
        this.roles.forEach(item => {
          switch (item.rname) {
            case 'admin':
              item.chname = '数据管理员'
              break
            case 'specialAdmin':
              item.chname = '专项管理员'
              break
            case 'seniorAdmin':
              item.chname = '高级管理员'
              break
            case 'clubAdmin':
              item.chname = '协会管理员'
              break
            case 'courseAdmin':
              item.chname = '课程管理员'
              break
          }
        })
      })
      getClubs().then((res) => {
        this.clubs = res.obj
        console.log(res.obj)
      })
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getMessage()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.roles.forEach((item) => {
            if (item.rname === this.temp.roles) {
              this.temp.roleList = item.rid
            }
          })
          addAdministrators(this.temp).then(() => {
            this.total = this.total + 1
            this.temp.gid = this.total
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
      this.temp.roles = row.roles[0].rid
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getMessage()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.roles.forEach((item) => {
            if (item.rname === this.temp.roles) {
              this.temp.roleList = item.rid
            }
            // 如果不是协会，则传一个空的cid值
            if (typeof (this.temp.cid) === 'undefined') {
              var key = 'cid'
              var value = ''
              this.temp[key] = value
            }
          })
          updateAdministrators(this.temp).then(() => {
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
    // 删除操作
    handleDelete(row, index) {
      deleteAdministrators(row.gid).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '姓名', '角色']
        const filterVal = ['id', 'realname', 'roles']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '管理员'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'roles') {
          return (v[j])[0].rname
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
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
</style>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .el-dialog {
    min-width: 750px;
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
  .el-radio.is-bordered+.el-radio.is-bordered {
    margin-left: 0;
    margin-bottom: 20px;
  }

</style>
