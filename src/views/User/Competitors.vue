<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <el-button style="visibility: hidden" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download">
          <a :href="Excel">导出Excel</a>
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
      <!-- 下拉框内容 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
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
      <el-table-column label="ID" prop="id" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参赛姓名" prop="title" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type" @click.stop="handleLook(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参赛注册时间" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.register_date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="180" class-name="small-padding fixed-width">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 450px; margin-left:50px;">
        <el-form-item label="参赛姓名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model="temp.number" />
        </el-form-item>
        <el-form-item label="参赛邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="参赛学校" prop="school">
          <el-input v-model="temp.school" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="temp.major" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="注册日期" prop="time">
          <el-date-picker v-model="temp.register_date" type="datetime" placeholder="请选择日期" />
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

    <!--选手信息 -->
    <el-dialog
      title="选手信息"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div style="margin-top: 20px">
        <span class="font-small">基本信息</span>
      </div>
      <el-card class="mine-layout">
        <div style="text-align: center">
          <img width="150px" height="150px" :src="CompetitoreDel.head">
        </div>
      </el-card>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">姓名</el-col>
          <el-col :span="6" class="table-cell-title">学号</el-col>
          <el-col :span="6" class="table-cell-title">专业</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.username }}</el-col>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.number }}</el-col>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.major }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">联系方式</el-col>
          <el-col :span="6" class="table-cell-title">电子邮箱</el-col>
          <el-col :span="6" class="table-cell-title">学校</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.phone }}</el-col>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.email }}</el-col>
          <el-col :span="6" class="table-cell">{{ CompetitoreDel.school }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <span class="font-small">参赛记录</span>
      </div>
      <div class="table-layout">
        <el-card v-for="(i,index) in CompetitoreDel.userMes" :key="index">
          <el-row>
            <el-col :span="4" class="table-cell-title">竞赛名称</el-col>
            <el-col :span="4" class="table-cell-title">竞赛项目</el-col>
            <el-col :span="6" class="table-cell-title">作品名称</el-col>
            <el-col :span="5" class="table-cell-title">竞赛类别</el-col>
            <el-col :span="5" class="table-cell-title">指导老师</el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="table-cell">{{ i.name }}</el-col>
            <el-col :span="4" class="table-cell">{{ i.project }}</el-col>
            <el-col :span="6" class="table-cell">{{ i.worksname }}</el-col>
            <el-col :span="5" class="table-cell">{{ i.type }}</el-col>
            <el-col :span="5" class="table-cell">{{ i.teacher }}</el-col>
          </el-row>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateCompetitors, deleteCompetitors, getCompetitors, getUserMesByid, getUserListExcel } from '@/api/User/competitors'
import { addNotice } from '@/api/Article/notice'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Notice',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      CompetitoreDel: [],
      // Excel地址
      Excel: '',
      // 搜索内容
      isSearch: false,
      searchKey: '',
      checkedSearch: 'username',
      searchOptions: [
        { key: 'username', display_name: '选手姓名' },
        { key: 'major', display_name: '选手专业' },
        { key: 'school', display_name: '参赛学校' }
      ],
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        username: '',
        school: '',
        college: '',
        major: ''
      },
      // 弹框内容
      temp: {
        id: undefined,
        username: '',
        match_name: '',
        time: new Date(),
        number: '',
        school: '',
        major: '',
        phone: '',
        match_project: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        match_name: [{ required: true, message: '竞赛不能为空', trigger: 'change' }],
        number: [{ required: true, message: '学号不能为空', trigger: 'change' }],
        school: [{ required: true, message: '学校不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'change' }],
        major: [{ required: true, message: '专业不能为空', trigger: 'change' }]
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
    this.getExcel()
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      getCompetitors(this.listQuery).then(response => {
        console.log(response)
        this.list = response.obj.userList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    getExcel() {
      getUserListExcel().then(res => {
        this.Excel = res.obj
      })
    },
    // 清空搜索框
    resetSearch() {
      this.searchData.major = ''
      this.searchData.username = ''
      this.searchData.school = ''
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
      if (this.checkedSearch === 'username') {
        this.listQuery.username = this.searchKey
      } else if (this.checkedSearch === 'major') {
        this.listQuery.major = this.searchKey
      } else if (this.checkedSearch === 'school') {
        this.listQuery.school = this.searchKey
      }
      this.listQuery.page = 1
      this.getList()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: ''
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
          this.total = this.total + 1
          this.temp.uid = this.total
          addNotice(this.temp).then(() => {
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
      this.temp.timestamp = new Date(this.temp.time)
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
          updateCompetitors(tempData).then(() => {
            const index = this.list.findIndex(v => v.uid === this.temp.uid)
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
      deleteCompetitors(row.uid).then(() => {
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
        const tHeader = ['ID', '参赛选手名称', '学号', '竞赛名称', '竞赛项目', '竞赛类别', '参赛作品', '参赛注册时间', '选手邮箱', '选手所在学校', '专业', '联系电话']
        const filterVal = ['uid', 'username', 'number', 'match_name', 'match_project', 'type', 'match_project', 'register_date', 'email', 'school', 'major', 'phone']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '选手管理'
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
    },
    // 展开选手详细信息
    handleLook(row) {
      this.dialogVisible = true
      getUserMesByid(row.uid).then(response => {
        this.CompetitoreDel = response.obj
      })
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
    .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }

  .mine-layout {
    position: absolute;
    right: 60px;
    top: 140px;
    width: 180px;
    height: 190px;
  }
</style>
