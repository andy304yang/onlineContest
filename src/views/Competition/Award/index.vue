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
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @v-on:downExcel="Download">
          <a v-if="activeName === 'first'||activeName==='fourth'" :href="excelAdress">导出Excel</a>
          <a v-else>导出Excel</a>
        </el-button>
      </div>
    </div>
    <!-- tab -->
    <el-tabs v-if="isSpAdmin" v-model="activeName">
      <el-tab-pane label="决赛获奖列表" name="first">
        <finals-list v-if="activeName === 'first'" ref="fal" :is-sp-admin="isSpAdmin" @handleWork="popWorkDetails" @downExcel="downExcel" />
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-else v-model="activeName">
      <el-tab-pane v-if="isCourseAdmin" label="获奖列表" name="first">
        <finals-list v-if="activeName === 'first'" ref="fal" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" @downExcel="downExcel" />
      </el-tab-pane>
      <el-tab-pane v-if="!isCourseAdmin" label="决赛获奖列表" name="first">
        <finals-list v-if="activeName === 'first'" ref="fal" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" @downExcel="downExcel" />
      </el-tab-pane>
      <el-tab-pane v-if="!isCourseAdmin" label="鼓励奖列表" name="second">
        <encourage-list v-if="activeName === 'second'" ref="enc" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane v-if="!isCourseAdmin" label="未发奖金列表" name="third">
        <bonus-list v-if="activeName === 'third'" ref="bound" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane v-if="!isCourseAdmin" label="已发奖金列表" name="fourth">
        <already-bonus-list v-if="activeName === 'fourth'" ref="albound" @handleWork="popWorkDetails" />
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
import FinalsList from './components/FinalsList'
import EncourageList from './components/EncourageList'
import BonusList from './components/BonusList'
import AlreadyBonusList from './components/AlreadyBonusList'

export default {
  name: 'Award',
  components: { FinalsList, EncourageList, BonusList, AlreadyBonusList, WorksDetails },
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
