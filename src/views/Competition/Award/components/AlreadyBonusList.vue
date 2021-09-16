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
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.wid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="160px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWork(row)">{{ row.worksname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖项" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.prize_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人姓名" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖金数额" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reward }}元</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
  </div>
</template>

<script>
import { getWorksRewardMes, downloadRewardMes } from '@/api/Competition/award'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'AlreadyBounsList',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        sort: '+id'
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
        update: '作品详情',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
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
    this.getList()
  },
  methods: {
    getList() {
      getWorksRewardMes(this.listQuery).then(response => {
        if (response.obj === null) {
          this.$notify({
            title: '对不起！',
            message: '没有您想要的数据',
            type: 'warning',
            duration: 2000
          })
        }
        this.list = response.obj.worksList
        this.list.forEach(item => {
          if (item.certificate === 1) {
            item.price = '(Model1-有作品名称)院长特别奖'
          } else if (item.certificate === 0) {
            item.price = '鼓励奖'
          } else if (item.certificate === 2) {
            item.price = '(Model1-有作品名称)一等奖'
          } else if (item.certificate === 3) {
            item.price = '(Model1-有作品名称)二等奖'
          } else if (item.certificate === 4) {
            item.price = '(Model1-有作品名称)三等奖'
          } else if (item.certificate === 5) {
            item.price = '(Model1-有作品名称)优胜奖'
          } else if (item.certificate === 6) {
            item.price = '(Model2-无作品名称)一等奖'
          } else if (item.certificate === 7) {
            item.price = '(Model2-无作品名称)IT二等奖'
          } else if (item.certificate === 8) {
            item.price = '(Model2-无作品名称)IT三等奖'
          } else {
            item.price = '(Model2-无作品名称)IT优胜奖'
          }
        })
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
      downloadRewardMes().then(response => {
        this.$emit('downExcel', response.obj)
      })
    },
    // 搜索
    search(val) {
      this.listQuery = val
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'name') {
        this.sortByTitle(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '作品名称', '奖项', '负责人姓名', '奖金数额/元', '指导老师', '学校']
        const filterVal = ['wid', 'match_name', 'type', 'worksname', 'price', 'author1_name', 'reward', 'teacher', 'school']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已发奖金列表'
        })
        this.downloadLoading = false
      })
    },
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

