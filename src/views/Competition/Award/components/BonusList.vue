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
      <el-table-column v-if="operability" label="操作" align="center" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click.stop="handleReward(row)">
            评发奖金
          </el-button>
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

    <el-dialog
      title="评奖"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="temp" label-width="80px" style="width: 95%; margin-left:50px;">
        <el-form-item label="奖金数额" style="width: 70%;">
          <el-input v-model="temp.reward" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Reward">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWorksNoRewardMes, getReward } from '@/api/Competition/award'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'BounsList',
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
        reward: '',
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
  computed: {
    ...mapGetters([
      'operability'
    ])
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
      getWorksNoRewardMes(this.listQuery).then(response => {
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
    },
    // 搜索
    search(val) {
      this.listQuery = val
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleReward(row) {
      this.dialogVisible = true
      this.temp.wid = row.wid
    },
    Reward() {
      getReward(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '评奖成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '请刷新页面再操作哦！',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogVisible = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '作品名称', '奖项', '负责人姓名', '指导老师', '学校']
        const filterVal = ['wid', 'match_name', 'type', 'worksname', 'price', 'author1_name', 'teacher', 'school']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '未发奖金列表'
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

