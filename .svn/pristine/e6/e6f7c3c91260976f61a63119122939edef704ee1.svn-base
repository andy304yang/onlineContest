<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <el-button
          v-show="activeName === 'first' && operability"
          type="primary"
          icon="el-icon-edit"
          class="filter-item"
          @click="handleSort"
        >
          批量归档
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
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @v-on:downExcel="Download">
          <a v-if="activeName === 'first'||activeName==='fourth'" :href="excelAdress">导出Excel</a>
          <a v-else>导出Excel</a>
        </el-button> -->
      </div>
    </div>
    <!-- tab -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="已归档的竞赛" name="first">
        <competition-sorted v-if="activeName === 'first'" ref="cSort" :is-course-admin="isCourseAdmin" />
      </el-tab-pane>
      <el-tab-pane label="已归档的作品" name="second">
        <works-sorted v-if="activeName === 'second'" ref="wSort" @handleWork="popWorkDetails" />
      </el-tab-pane>
    </el-tabs>
    <!-- 弹出作品框 -->
    <works-details ref="details" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import WorksDetails from '@/components/Acomponents/WorksDetails'
import CompetitionSorted from './components/CompetitionSorted'
import WorksSorted from './components/WorksSorted'

export default {
  name: 'Sort',
  components: { CompetitionSorted, WorksSorted, WorksDetails },
  directives: { waves },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      list: null,
      total: 0,
      // 搜索
      checkedSearch: 'content',
      searchOptions: [
        { key: 'content', display_name: '竞赛名称' },
        { key: 'type', display_name: '竞赛类别' },
        { key: 'work', display_name: '作品名称' },
        { key: 'leader', display_name: '负责人' },
        { key: 'teacher', display_name: '指导老师' },
        { key: 'school', display_name: '学校' },
        { key: 'price', display_name: '奖项' }
      ],
      searchKey: '',
      searchData: {
        pageNum: 1,
        pageSize: 20,
        teacher: '',
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        author1_name: '',
        price_name: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        teacher: '',
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        author1_name: ''
      },
      listLoading: true,
      temp: {
        id: undefined,
        timestart: new Date(),
        timeend: new Date(),
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      excelAdressTemp: '',
      excelAdress: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    ...mapGetters([
      'operability'
    ]),
    isSpAdmin() {
      return this.roles.includes('specialAdmin')
    },
    isCourseAdmin() {
      return this.roles.includes('courseAdmin')
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        teacher: '',
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        author1_name: ''
      }
      if (this.checkedSearch === 'content') {
        this.listQuery.match_project = this.searchKey
      } else if (this.checkedSearch === 'work') {
        this.listQuery.work_name = this.searchKey
      } else if (this.checkedSearch === 'leader') {
        this.listQuery.author1_name = this.searchKey
      } else if (this.checkedSearch === 'type') {
        this.listQuery.type = this.searchKey
      } else if (this.checkedSearch === 'teacher') {
        this.listQuery.teacher = this.searchKey
      } else if (this.checkedSearch === 'school') {
        this.listQuery.school = this.searchKey
      } else {
        this.listQuery.price_name = this.searchKey
      }
      if (this.activeName === 'first') {
        this.$refs.fal.search(this.listQuery)
      } else if (this.activeName === 'third') {
        this.$refs.bound.search(this.listQuery)
      } else if (this.activeName === 'fourth') {
        this.$refs.albound.search(this.listQuery)
      } else {
        this.$refs.enc.search(this.listQuery)
      }
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSort() {
      if (this.$refs.noSort.checkedWorks.length === 0) {
        this.$notify({
          title: '失败',
          message: '请选择要归档的竞赛',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.$refs.noSort.handleSort()
      }
    },
    Download() {
      if (this.activeName === 'first') {
        this.downloadLoading = true
        this.excelAdress = this.excelAdressTemp
        this.downloadLoading = false
      } else if (this.activeName === 'second') {
        this.downloadLoading = true
        this.$refs.enc.handleDownload()
        this.downloadLoading = false
      } else if (this.activeName === 'third') {
        this.downloadLoading = true
        this.$refs.bound.handleDownload()
        this.downloadLoading = false
      } else {
        this.downloadLoading = true
        this.$refs.albound.handleDownload()
        this.downloadLoading = false
      }
    },
    downExcel(excel) {
      this.excelAdressTemp = excel
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    // 父组件弹出子组件作品详情弹框
    popWorkDetails(wid) {
      this.$refs.details.popWorkDetails(wid)
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
  .el-checkbox{
    width: 70px;
  }
</style>
