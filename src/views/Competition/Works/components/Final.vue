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
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学号">
              <span>{{ row.number }}</span>
            </el-form-item>
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
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="竞赛名称" min-width="280px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
          <el-tag>{{ row.match_project }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWork(row.wid)">{{ row.worksname }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability || isCourseAdmin" label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleAward(row)">
            评奖
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog title="评奖" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 85%; margin-left:50px;">
        <el-form-item label="颁奖日期">
          <el-date-picker v-model="workInfo.time" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="奖项">
          <div class="block">
            <el-cascader v-model="workInfo.tempRadio" :options="pricelist" @change="handleChangeAward" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="award">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPrizeName, advance } from '@/api/Competition/works/final'
import { getWorks } from '@/api/Competition/works/index'
import { getCourseWorkMes, advanceCourse, getPriceNameByCounrseId } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'Final',
  directives: { waves },
  components: { Pagination },
  props: {
    listQuery: {
      default: () => {},
      type: Object
    },
    isClubAdmin: {
      default: false,
      type: Boolean
    },
    isCourseAdmin: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        id: undefined,
        name: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '作品详情'
      },
      downloadLoading: false,
      workInfo: {
        tempRadio: 0,
        wid: 0,
        time: new Date(),
        reward_date: []
      },
      pricelist: [],
      radio: 0
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
    this.getPrice()
  },
  methods: {
    getList(key = '', value = '') {
      if (key) {
        this.listQuery[key] = value
      }
      if (this.isCourseAdmin) {
        this.listQuery.normalization = 5
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
        getWorks(this.listQuery).then(response => {
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
      }
    },
    // 弹出评奖
    handleAward(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.workInfo.time = parseTime(this.workInfo.time, '{y}-{m}-{d} {h}:{i}')
      this.workInfo.reward_date = this.workInfo.time
      this.workInfo.wid = row.wid
      this.dialogVisible = true
      if (this.isCourseAdmin) {
        getPriceNameByCounrseId().then(response => {
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
      } else {
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
          })
          this.listLoading = false
        })
      }
    },
    handleChangeAward(label) {
      this.workInfo.tempRadio = label
    },
    award() {
      if (this.isCourseAdmin) {
        advanceCourse(this.workInfo).then(() => {
          const index = this.list.findIndex(v => v.wid === this.temp.wid)
          this.list.splice(index, 1)
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '评奖成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        advance(this.workInfo).then(() => {
          const index = this.list.findIndex(v => v.wid === this.temp.wid)
          this.list.splice(index, 1)
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '评奖成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    // 将作品id传给父组件展示详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    handleDownload(header, filterVal) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header,
          data,
          filename: '作品列表'
        })
      })
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
  .radio-box{
    width: 100px;
    .el-radio{
      margin-top: 10px;
    }
  }
</style>
