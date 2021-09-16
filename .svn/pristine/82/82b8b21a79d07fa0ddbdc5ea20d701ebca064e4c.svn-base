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
      <el-table-column label="竞赛名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛类别" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.worksname }}</span>
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
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-tabs>
        <el-tab-pane label="作品基本信息">
          <span><b>作品名称： {{ temp.worksname }}</b></span><br><br>
          <span><b>团队名字：{{ temp.club_name }}</b></span><br><br>
          <span><b>团队成员：{{ temp.author1_name }}  {{ temp.author2_name }}  {{ temp.author3_name }}</b></span><br><br>
          <span><b>作品指导老师：{{ temp.teacher }}</b></span><br><br>
          <span><b>指导老师单位：{{ temp.unit }}</b></span><br><br>
          <span><b>作品简介：{{ temp.introduce }}</b></span><br><br>
          <span><b>作品类型：{{ temp.match_project }}</b></span><br><br>
        </el-tab-pane>
        <el-tab-pane label="作品设计思路">
          <span><b>作品设计思路：{{ temp.design }}</b></span><br><br>
        </el-tab-pane>
        <el-tab-pane label="作品图片展示">
          <span><b>作品展示：</b></span><br><br>
          <el-image :src="temp.image1" style="max-width: 100%; max-height: 400px" />
          <el-image :src="temp.image2" style="max-width: 100%; max-height: 400px" />
          <el-image :src="temp.image3" style="max-width: 100%; max-height: 400px" />
          <el-image :src="temp.image4" style="max-width: 100%; max-height: 400px" />
          <el-image :src="temp.image5" style="max-width: 100%; max-height: 400px" />
        </el-tab-pane>
        <el-tab-pane label="作品视频展示">
          <span><b>视频观赏：</b></span><br><br>
          <video :src="temp.video" controls autoplay class="video" width="100%" />
        </el-tab-pane>
        <el-tab-pane label="作品评价">
          <span><b>参赛作品的标志性：{{ temp.normalization }}</b></span><br><br>
          <span><b>分数：{{ temp.score }}</b></span><br><br>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getGLWorksMes } from '@/api/Competition/award'
import { getCourseWorkMes } from '@/api/Competition/course'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'EncourageList',
  directives: { waves },
  components: { Pagination },
  props: {
    isCourseAdmin: {
      type: Boolean,
      default: false
    }
  },
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
      if (this.isCourseAdmin) {
        this.listQuery.normalization = 6
        getCourseWorkMes(this.listQuery).then(response => {
          if (response.obj.worksList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      } else {
        getGLWorksMes(this.listQuery).then(response => {
          if (response.obj === null) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    // 搜索
    search(val) {
      this.listQuery = val
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '项目名称', '竞赛项目', '类型', '开始时间', '结束时间', '进度', '负责协会', '联系方式', '发布人', 'url']
        const filterVal = ['mid', 'name', 'project', 'type', 'start_date', 'end_date', 'now', 'club_name', 'number', 'poster', 'url']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '竞赛项目'
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
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

