<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability || isCourseAdmin" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
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
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
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
          <span>{{ row.cj_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="title" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛项目" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.match_project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.match_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability || isCourseAdmin" label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click.stop="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" type="info" size="small" @click.stop="handleDelete(row,$index)">
            取消评委
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="title">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="登录名" prop="match_name">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="time">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="学校" prop="name">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="temp.major" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="name">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="name">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item v-if="operability " label="赛事组织" prop="cid">
          <el-select v-model="temp.mid" class="filter-item">
            <el-option v-for="item in clubs" :key="item.mid" :label="item.clubname" :value="item.mid" />
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
import { getJudges, delCoursejudge, getCourseId, AddjudgeCourse, upjudgeCourse } from '@/api/User/judge'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Judge',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 搜索内容
      searchKey: '',
      checkedSearch: 'name',
      searchOptions: [
        { key: 'name', display_name: '评委姓名' },
        { key: 'college', display_name: '学院' },
        { key: 'school', display_name: '学校' }
      ],
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      clubs: [],
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        realname: '',
        username: '',
        college: '',
        major: '',
        mid: 0
      },
      // 弹框内容
      temp: {
        realname: '',
        username: '',
        password: '',
        school: '',
        major: '',
        email: '',
        phone: '',
        mid: 0
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        match_name: [{ message: 'reviewer is required', trigger: 'blur' }]
      },
      // 下载excel
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'operability',
      'roles'
    ]),
    isCourseAdmin() {
      return this.roles.includes('courseAdmin')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      if (this.isCourseAdmin) {
        this.listQuery.mid = 0
      } else {
        this.listQuery.mid = 1
      }
      getJudges(this.listQuery).then(response => {
        // this.list = response.obj.teachList
        this.list = response.obj.gserList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
      getCourseId().then((res) => {
        this.clubs = res.obj
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
        major: '',
        mid: 0
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
    // 添加
    createData() {
      AddjudgeCourse(this.temp).then(() => {
        this.list.unshift(this.temp)
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (this.isCourseAdmin) {
        this.temp.mid = 0
        upjudgeCourse(this.temp).then(() => {
          this.$notify({
            title: '成功',
            message: '取消评委成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        })
      } else {
        upjudgeCourse(this.temp).then(() => {
          this.$notify({
            title: '成功',
            message: '修改评委消息成功',
            type: 'success',
            duration: 2000
          })
        })
        this.dialogFormVisible = false
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
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        realname: '',
        username: '',
        password: '',
        school: '',
        major: '',
        email: '',
        phone: '',
        mid: 0
      }
    },
    // 删除操作
    handleDelete(row, index) {
      if (this.isCourseAdmin) {
        delCoursejudge(row.cj_id, 0).then(() => {
          this.$notify({
            title: '成功',
            message: '取消评委成功',
            type: 'success',
            duration: 2000
          })
        })
        this.list.splice(index, 1)
      } else {
        delCoursejudge(row.cj_id, row.mid).then(() => {
          this.$notify({
            title: '成功',
            message: '取消评委成功',
            type: 'success',
            duration: 2000
          })
        })
        this.list.splice(index, 1)
      }
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '姓名', '学校', '学院', '联系方式', '邮箱']
        const filterVal = ['tid', 'realname', 'school', 'college', 'phone', 'email']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '评委管理'
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
