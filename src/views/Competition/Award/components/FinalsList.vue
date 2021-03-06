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
      <el-table-column label="作品名称" align="center" min-width="220px">
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
      <el-table-column v-if="!isSpAdmin && operability" label="操作" align="center" width="180px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click.stop="handleAward(row)">
            修改奖项
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="修改奖项" :visible.sync="dialogVisible" width="30%">
      <template>
        <el-date-picker v-model="workInfo.reward_date" type="datetime" placeholder="点击选择日期" /><br><br>
        <!-- <el-select v-if="isCourseAdmin" v-model="workInfo.tempRadio" class="filter-item" placeholder="请选择奖项">
          <el-option v-for="(item, i) in pricelist" :key="i" :label="item.prize_name" :value="item.pr_id" />
        </el-select> -->
        <div class="block">
          <el-cascader
            v-model="workInfo.tempRadio"
            :options="pricelist"
            @change="handleChangeAward"
          />
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateAward">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getJSWorksMes, updateCertificate, getPrizeName } from '@/api/Competition/award'
import { getCourseWorkMes, advanceCourse, getPriceNameByCounrseId } from '@/api/Competition/course'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import checkPermission from '@/utils/permission'
import Pagination from '@/components/Pagination'

export default {
  name: 'FinalsList',
  directives: { waves, permission },
  components: { Pagination },
  props: {
    isSpAdmin: {
      type: Boolean,
      default: false
    },
    isCourseAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pricelist: [],
      radio: Number,
      workInfo: {
        tempRadio: Number,
        wid: '',
        reward_date: ''
      },
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
  mounted() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getList()
  },
  methods: {
    checkPermission(roles) {
      return checkPermission(roles)
    },
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
        getJSWorksMes(this.listQuery).then(response => {
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
    // 搜索
    search(val) {
      this.listQuery = val
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
    handleWork(row) {
      this.$emit('handleWork', row.wid)
    },
    // 奖项修改
    handleAward(row) {
      this.temp = Object.assign({}, row)
      this.workInfo.reward_date = new Date(this.workInfo.reward_date)
      // this.radio = row.certificate
      // this.workInfo.tempRadio = row.certificate
      this.workInfo.tempRadio = null
      this.workInfo.wid = row.wid
      this.dialogVisible = true
      if (!this.isCourseAdmin) {
        getPrizeName(this.workInfo.wid).then(response => {
          this.pricelist = []
          response.obj.forEach(item => {
            var obj = {
              'label': '',
              children: []
            }
            obj['label'] = item.match_type
            item.prizeMap.forEach(item1 => {
              var obj1 = {}
              obj1['value'] = item1.pr_id
              obj1['label'] = item1.prize_name
              obj.children.push(obj1)
            })
            this.pricelist.push(obj)
            console.log(this.pricelist)
          })
          this.listLoading = false
        })
      } else {
        getPriceNameByCounrseId(this.workInfo.wid).then(response => {
          this.pricelist = []
          response.obj.forEach(item => {
            var obj = {
              'label': '',
              children: []
            }
            obj['label'] = item.match_type
            item.prizeMap.forEach(item1 => {
              var obj1 = {}
              obj1['value'] = item1.pm_id
              obj1['label'] = item1.prize_name
              obj.children.push(obj1)
            })
            this.pricelist.push(obj)
          })
          this.listLoading = false
        })
      }
    },
    handleUpdateAward() {
      this.workInfo.reward_date = parseTime(this.workInfo.reward_date, '{y}-{m}-{d}')
      if (!this.isCourseAdmin) {
        updateCertificate(this.workInfo).then(() => {
          this.dialogVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '修改奖项成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        advanceCourse(this.workInfo).then(() => {
          this.dialogVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '修改奖项成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '竞赛名称', '竞赛类型', '作品名称', '奖项', '负责人姓名', '指导老师', '学校']
        const filterVal = ['wid', 'match_name', 'type', 'worksname', 'price_name', 'author1_name', 'teacher', 'school']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '决赛获奖列表'
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

.el-radio-group-ChangeAward {
  display: flex;
  flex-direction: column;
}
.el-radio-group-ChangeAward .el-radio {
  margin-bottom: 20px;
}
</style>
