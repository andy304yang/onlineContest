<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <div class="filter-item">
          <el-button
            v-show="activeName === 'all'"
            :class="[downbutton]"
            icon="el-icon-download"
            @click="handleBale"
          >
            下载全部作品资源
          </el-button>
          <el-button
            v-show="activeName === 'all' && operability"
            :class="[downbutton]"
            icon="el-icon-edit"
            @click="enterFin"
          >
            批量进入决赛
          </el-button>
          <el-button
            v-show="activeName === 'similar' || activeName === 'noscored' || activeName === 'check' && operability"
            type="primary"
            icon="el-icon-back"
            @click="toBackWork(activeName)"
          >
            批量退回
          </el-button>
          <el-button
            v-show="activeName === 'similar' || activeName === 'check' && operability"
            type="primary"
            icon="el-icon-finished"
            @click="toShenHe(activeName)"
          >
            批量审核
          </el-button>
          <el-button
            v-show="activeName === 'distribute' && operability"
            type="primary"
            icon="el-icon-edit"
            @click="toFenPei"
          >
            批量分配
          </el-button>
        </div>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option
              v-for="item in searchOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="handleClear" />
          <el-button v-waves class="filter-item" :class="[downbutton]" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>
    </div>
    <!-- 协会管理员 -->
    <el-tabs v-if="isClubAdmin" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="已退回作品" name="back">
        <back
          v-if="activeName === 'back'"
          ref="back"
          :list-query="listQuery"
          :is-club-admin="isClubAdmin"
          @handleWork="popWorkDetails"
        />
      </el-tab-pane>
      <el-tab-pane label="待审核作品" name="check">
        <checking
          v-if="activeName === 'check'"
          ref="check"
          :list-query="listQuery"
          :is-club-admin="isClubAdmin"
          @handleWork="popWorkDetails"
        />
      </el-tab-pane>
      <el-tab-pane label="已审核作品" name="distribute">
        <distribute
          v-if="activeName === 'distribute'"
          ref="distribute"
          :list-query="listQuery"
          :is-club-admin="isClubAdmin"
          @handleWork="popWorkDetails"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 课程管理员 -->
    <el-tabs v-else-if="isCourseAdmin" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="全部作品" name="all">
        <reviewed v-if="activeName === 'all'" ref="all" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" @downExcel="downExcel" />
      </el-tab-pane>
      <el-tab-pane label="高度相似作品" name="similar">
        <similar v-if="activeName === 'similar'" ref="similar" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已退回作品" name="back">
        <back v-if="activeName === 'back'" ref="back" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="待审核作品" name="check">
        <checking v-if="activeName === 'check'" ref="check" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="待分配作品" name="distribute">
        <distribute v-if="activeName === 'distribute'" ref="distribute" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="未得分作品" name="noscored">
        <noscored v-if="activeName === 'noscored'" ref="noscored" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已得分作品" name="scored">
        <scored v-if="activeName === 'scored'" ref="scored" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="展示作品" name="final">
        <final v-if="activeName === 'final'" ref="final" :list-query="listQuery" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
    </el-tabs>
    <!-- 其他 -->
    <el-tabs v-else v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="全部作品" name="all">
        <reviewed v-if="activeName === 'all'" ref="all" :list-query="listQuery" @handleWork="popWorkDetails" @downExcel="downExcel" />
      </el-tab-pane>
      <el-tab-pane label="高度相似作品" name="similar">
        <similar v-if="activeName === 'similar'" ref="similar" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已退回作品" name="back">
        <back v-if="activeName === 'back'" ref="back" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="待审核作品" name="check">
        <checking v-if="activeName === 'check'" ref="check" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="待分配作品" name="distribute">
        <distribute v-if="activeName === 'distribute'" ref="distribute" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="未得分作品" name="noscored">
        <noscored v-if="activeName === 'noscored'" ref="noscored" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已得分作品" name="scored">
        <scored v-if="activeName === 'scored'" ref="scored" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="出线管理" name="make_list">制作出线名单</el-tab-pane>

      <el-tab-pane label="未出线作品" name="unrise">
        <unrise v-if="activeName === 'unrise'" ref="unrise" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已出线作品" name="rise">
        <rise v-if="activeName === 'rise'" ref="rise" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="决赛作品" name="final">
        <final v-if="activeName === 'final'" ref="final" :list-query="listQuery" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="获奖作品" name="goto_finalsList">评奖</el-tab-pane>
    </el-tabs>
    <!-- 弹出作品框 -->
    <works-details ref="details" />
    <!-- 导出弹框 -->
    <el-dialog title="请选择导出内容" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="90px" style="width: 450px; margin-left:50px;">
        <el-form-item>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkData" @change="handleCheckedChange">
            <el-checkbox v-for="value in excelData" :key="value" :label="value">{{ value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="Download">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { downAllWork } from '@/api/Competition/works/all'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Reviewed from './components/Reviewed'
import Checking from './components/Checking'
import Similar from './components/Similar'
import Distribute from './components/Distribute'
import Back from './components/Back'
import Noscored from './components/Noscored'
import Scored from './components/Scored'
import Rise from './components/Rise'
import Unrise from './components/Unrise'
import Final from './components/Final'
import WorksDetails from '@/components/Acomponents/WorksDetails'
import { downloadCourseWorksScore, downLoadAllCourseWork } from '@/api/Competition/course'

const excelOption = [
  '竞赛名称',
  '竞赛项目',
  '竞赛类别',
  '作品名称',
  '负责人',
  '指导老师',
  '提交时间',
  '学号',
  '参赛邮箱',
  '参赛学校',
  '专业',
  '联系电话',
  '总成绩',
  '排名',
  '团队成员'
]

const filterVal = [
  'match_name', 'match_project', 'type', 'worksname', 'author1_name', 'teacher',
  'date', 'number', 'email', 'school', 'major', 'phone', 'score', 'rank', 'teamworks'
]

export default {
  name: 'Enroll',
  components: { Reviewed, Similar, Checking, Distribute, WorksDetails, Back, Noscored, Scored, Unrise, Rise, Final },
  directives: { waves },
  data() {
    return {
      workUrl: '',
      activeName: '',
      tableKey: 0,
      list: null,
      total: 0,
      checkedSearch: 'type',
      searchOptions: [
        { key: 'type', display_name: '竞赛类别' },
        { key: 'match_name', display_name: '竞赛名称' },
        { key: 'work_name', display_name: '作品名称' },
        { key: 'author1_name', display_name: '负责人' },
        { key: 'teacher', display_name: '指导老师' }
      ],
      excelData: excelOption,
      checkAll: true,
      isIndeterminate: false,
      checkData: [
        '竞赛名称',
        '竞赛项目',
        '竞赛类别',
        '作品名称',
        '负责人',
        '指导老师',
        '提交时间',
        '学号',
        '参赛邮箱',
        '参赛学校',
        '专业',
        '联系电话',
        '总成绩',
        '排名',
        '团队成员'
      ],
      searchKey: '',
      listQuery: {
        page: 1,
        limit: 20,
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        teacher: '',
        author1_name: '',
        normalization: 0
      },
      dialogFormVisible: false,
      downloadLoading: false,
      excelAdressTemp: '',
      excelAdress: '',
      flag: {
        similar: -2,
        back: -1,
        check: 0,
        distribute: 1,
        noscored: 2,
        scored: 3,
        unrise: 4,
        rise: 5,
        final: 6
      },
      excelbutton: 'excel-button',
      downbutton: 'down-button',
      tagbutton: 'tag-button',
      workname: 'workname'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    ...mapGetters([
      'operability'
    ]),
    isClubAdmin() {
      return this.roles.includes('clubAdmin')
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
    } else {
      this.activeName = this.isClubAdmin ? 'all' : 'all'
      this.activeName = this.isCourseAdmin ? 'all' : 'all'
    }
    this.listQuery.normalization = this.flag[this.activeName]
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        teacher: '',
        match_name: '',
        match_project: '',
        work_name: '',
        type: '',
        teamname: '',
        author1_name: '',
        normalization: this.flag[this.activeName]
      }
    },
    handleCheckAllChange(val) {
      this.checkData = val ? this.excelData : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.excelData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.excelData.length
    },
    handleFilter() {
      this.reset()
      this.listQuery[this.checkedSearch] = this.searchKey
      if (this.activeName !== 'all') {
        this.$refs[this.activeName].getList(this.checkedSearch, this.searchKey)
      } else {
        this.$refs.all.search(this.listQuery)
      }
    },
    handleClear() {
      this.reset()
      if (this.activeName !== 'all') {
        this.$refs[this.activeName].getList(this.checkedSearch, this.searchKey)
      } else {
        this.$refs.all.search(this.listQuery)
      }
    },
    // 父组件弹出子组件作品详情弹框
    popWorkDetails(wid) {
      this.$refs.details.popWorkDetails(wid)
    },
    // 打包全部文件
    handleBale() {
      if (!this.isCourseAdmin) {
        downAllWork().then(response => {
          // window.location.href = 'http://sd.bnuz.edu.cn.' + response.obj
          const url = 'http://sd.bnuz.edu.cn' + response.obj
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          document.body.appendChild(link)
          link.click()
          this.$notify({
            title: '成功',
            message: '文件打包成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        downLoadAllCourseWork().then(response => {
          const url = 'http://sd.bnuz.edu.cn' + response.obj
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          document.body.appendChild(link)
          link.click()
        })
      }
    },
    handleDownload() {
      if (this.activeName === 'scored' && this.isCourseAdmin) {
        downloadCourseWorksScore().then(response => {
          const url = 'http://sd.bnuz.edu.cn' + response.obj
          console.log(url)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          document.body.appendChild(link)
          link.click()
        })
      } else {
        this.dialogFormVisible = !this.dialogFormVisible
      }
    },
    // 下载excel
    Download() {
      this.downloadLoading = true
      const newVal = []
      this.checkData.forEach((item) => {
        const value = this.excelData.findIndex(v => v === item)
        newVal.push(filterVal[value])
      })
      this.$refs[this.activeName].handleDownload(this.checkData, newVal)
      this.downloadLoading = false
    },
    downExcel(excel) {
      this.excelAdressTemp = excel
    },
    enterFin() {
      if (this.$refs.all.checkedWorks.length === 0) {
        this.$notify({
          title: '您要选择哪些作品呢？',
          message: '请勾选作品',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.$refs.all.handleFin()
      }
    },
    toShenHe(activeName) {
      var toComponent
      if (activeName === 'check') {
        toComponent = this.$refs.check
      } else if (activeName === 'similar') {
        toComponent = this.$refs.similar
      }
      if (toComponent.checkedWorks.length === 0) {
        this.$notify({
          title: '您要选择哪些作品呢？',
          message: '请勾选作品',
          type: 'warning',
          duration: 2000
        })
      } else {
        toComponent.handleShenHe()
      }
    },
    toFenPei() {
      if (this.$refs.distribute.checkedWorks.length === 0) {
        this.$notify({
          title: '您要选择哪些作品呢？',
          message: '请勾选作品',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.$refs.distribute.handleDistr()
      }
    },
    toBackWork(activeName) {
      var toComponent
      if (activeName === 'similar') {
        toComponent = this.$refs.similar
      } else if (activeName === 'noscored') {
        toComponent = this.$refs.noscored
      } else if (activeName === 'check') {
        toComponent = this.$refs.check
      }
      if (toComponent.checkedWorks.length === 0) {
        this.$notify({
          title: '您要选择哪些作品呢？',
          message: '请勾选作品',
          type: 'warning',
          duration: 2000
        })
      } else {
        toComponent.backData()
      }
    },
    // 切换标签页恢复检索为空
    tabClick(a) {
      this.reset()
      this.searchKey = ''
      if (a.name === 'make_list') {
        this.$nextTick(() => {
          this.$router.push({ path: '/Competition/Appear' })
        })
      }
      if (a.name === 'goto_finalsList') {
        this.$nextTick(() => {
          this.$router.push({ path: '/Competition/Award' })
        })
      }
    }
  }
}
</script>
<style lang="scss">
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
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .excel-button {
    background-color: #F7AC05;
    color: #252525
    font-weight: bold;
  }
  .down-button {
    background-color: #4F75B3;
    color: #FFFFFF
  }
  .tag-button {
    background-color: #FFF8E8;
    color: #F7AC05;
    border: 1px solid #FFF0CD;
  }
  .workname {
    color: #606266
  }
</style>

