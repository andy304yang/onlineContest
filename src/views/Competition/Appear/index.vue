<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <el-button style="visibility: hidden" class="filter-item" type="primary" icon="el-icon-edit">
          添加
        </el-button>
        <div>
          <el-select v-model="checkedSearch2" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="Download">
          导出Excel
        </el-button>
      </div>
    </div>
    <!-- 课程赛管理员名单 -->
    <el-tabs v-if="isCourseAdmin" v-model="activeName">
      <el-tab-pane label="未制作出线名单竞赛" name="first">
        <nodetermined v-if="activeName === 'first'" ref="notdet" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已制作出线名单竞赛" name="second">
        <determined v-if="activeName === 'second'" ref="ope" :is-course-admin="isCourseAdmin" @handleWork="popWorkDetails" />
      </el-tab-pane>
    </el-tabs>
    <!-- 全部名单 -->
    <el-tabs v-else v-model="activeName">
      <el-tab-pane label="未制作出线名单竞赛" name="first">
        <nodetermined v-if="activeName === 'first'" ref="notdet" @handleWork="popWorkDetails" />
      </el-tab-pane>
      <el-tab-pane label="已制作出线名单竞赛" name="second">
        <determined v-if="activeName === 'second'" ref="ope" @handleWork="popWorkDetails" />
      </el-tab-pane>
    </el-tabs>
    <!-- 弹出作品框 -->
    <works-details ref="details" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Nodetermined from './components/Nodetermined'
import Determined from './components/Determined'
import WorksDetails from '@/components/Acomponents/WorksDetails'

export default {
  name: 'Appear',
  components: { Nodetermined, Determined, WorksDetails },
  directives: { waves },
  data() {
    return {
      activeName: 'first',
      checkedSearch1: '协会分类',
      checkedSearch2: '竞赛类别',
      searchOptions: [
        // { key: 'club', display_name: '协会分类' },
        // { key: 'match', display_name: '竞赛类别' }
      ],
      searchKey: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    isCourseAdmin() {
      return this.roles.includes('courseAdmin')
    }
  },
  methods: {
    handleFilter() {
    },
    Download() {
      if (this.activeName === 'first') {
        this.downloadLoading = true
        this.$refs.notdet.handleDownload()
        this.downloadLoading = false
      } else if (this.activeName === 'second') {
        this.downloadLoading = true
        this.$refs.ope.handleDownload()
        this.downloadLoading = false
      } else {
        this.downloadLoading = true
        this.$refs.qua.handleDownload()
        this.downloadLoading = false
      }
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

