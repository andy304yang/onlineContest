<template>
  <div>
    <!-- 表格内容 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="changesWorkId"
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
      <el-table-column type="selection" width="30px" />
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="竞赛名称" min-width="240px" align="center">
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
      <el-table-column label="负责人" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCourseAdmin" label="评分" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="score(row,$index)">
            直接评分
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="operability || isCourseAdmin" label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="handleDistr(row,$index)">
            指定评委
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible_score" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible_score = false">确 定</el-button>
        <el-button @click="dialogVisible_score = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="指定评委" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 85%; margin-left:50px;">
        <el-form-item label="选中作品">
          <div v-for="(item, index) in workName" :key="index">
            {{ item }}
          </div>
        </el-form-item>
        <!-- 课程赛分配评委 -->
        <el-form-item v-if="isCourseAdmin" label="评委" prop="checkedJudges">
          <div class="checkbox-box">
            <el-checkbox-group v-model="temp.checkedJudges">
              <el-checkbox
                v-for="value in judges"
                :key="value.cj_id"
                :label="value.cj_id"
                name="checkedJudges"
                style="width:60px;"
              >
                {{ value.realname }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <!-- 其他 -->
        <el-form-item v-else label="评委" prop="checkedJudges">
          <div class="checkbox-box">
            <el-checkbox-group v-model="temp.checkedJudges">
              <el-checkbox
                v-for="value in judges"
                :key="value.tid"
                :label="value.tid"
                name="checkedJudges"
                style="width:60px;"
              >
                {{ value.realname }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="评分截止时间" prop="start_date">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="点击选择日期" :picker-options="pickerOptions" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <score />
        <el-button @click="handleClose">
          取消
        </el-button>
        <el-button type="primary" @click="distrData">
          确定
        </el-button>
      </div>
    </el-dialog>
    <score ref="child" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toDistributed, getJudges } from '@/api/Competition/works/undistributed'
// import { getJudges } from '@/api/User/judge'
import { getWorks, getClubWorks } from '@/api/Competition/works/index'
import { getCourseWorkMes, getJudgesCourse, toDistributedCourse } from '@/api/Competition/course'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import score from '@/components/Acomponents/WorksDetails/score'
export default {
  name: 'Undistributed',
  directives: { waves },
  components: { Pagination, score },
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
      dialogVisible_score: false,
      total: 0,
      listLoading: true,
      judges: [], // 所有评委
      temp: {
        checkedJudges: [], // 指定弹框选中的评委
        time: null
      },
      checkedWorks: [], // 多选框选中的作品
      workId: [], // 传给后台的作品ID数组
      workName: [], // 作品名字，用于呈现在弹框
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      rules: {
        checkedJudges: [{ type: 'array', required: true, message: '请至少选择一个评委', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= (Date.now() - (24 * 60 * 60 * 1000))
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 网络请求事件
    // 获取未分配数据
    getList(key = '', value = '') {
      if (key) {
        this.listQuery[key] = value
      }
      if (this.isClubAdmin) {
        getClubWorks(this.listQuery).then(response => {
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
      } else if (this.isCourseAdmin) {
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
          console.log(response)
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
    // 获取评委列表
    getJudgesList() {
      if (this.isCourseAdmin) {
        getJudgesCourse(this.listQuery).then(response => {
          this.judges = response.obj
        })
      } else {
        getJudges(this.listQuery).then(response => {
          console.log(response)
          this.judges = response.obj
        })
      }
    },
    // 直接评分
    score(val, index) {
      this.$refs.child.popWorkDetails(val.wid)
    },
    // 弹出指定评委框
    handleDistr(val, index) {
      this.getJudgesList()
      this.dialogStatus = 'distr'
      this.dialogFormVisible = true
      // 单个指定
      // if (val) {
      if (this.checkedWorks.length === 0) {
        this.workId.push(val.wid)
        this.workName.push(val.worksname)
        this.singleDistrIndex = index
      } else {
      // 批量指定
        this.checkedWorks.forEach(element => {
          this.workId.push(element.wid)
          this.workName.push(element.worksname)
        })
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 关闭时触发清空临时变量
    handleClose() {
      this.dialogFormVisible = false
      this.workId = []
      this.temp.checkedJudges = []
      this.workName = []
    },
    // 确认分配
    distrData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.time = parseTime(this.temp.time, '{y}-{m}-{d} {h}:{i}')
          if (this.isCourseAdmin) {
            // console.log(this.workId)
            toDistributedCourse(this.workId, this.temp.checkedJudges, this.temp.time).then(response => {
              this.$notify({
                title: '成功',
                message: '分配成功',
                type: 'success',
                duration: 2000
              })
              // if (this.workId.length === 1) {
              //   this.list.splice(this.singleDistrIndex, 1)
              // } else {
              //   this.getUndistributedList()
              // }
              this.$refs.refTable.clearSelection()
              this.handleClose()
              setTimeout(this.getList, 300)
            })
          } else {
            toDistributed(this.workId, this.temp.checkedJudges, this.temp.time).then(response => {
              this.$notify({
                title: '成功',
                message: '分配成功',
                type: 'success',
                duration: 2000
              })
              // if (this.workId.length === 1) {
              //   this.list.splice(this.singleDistrIndex, 1)
              // } else {
              //   this.getUndistributedList()
              // }
              this.$refs.refTable.clearSelection()
              this.handleClose()
              setTimeout(this.getList, 300)
            })
          }
          setTimeout(this.getList, 300)
        } else {
          this.$notify({
            title: '失败',
            message: '请检查信息是否填写规范',
            type: 'warning',
            duration: 2000
          })
          return false
        }
      })
    },
    // 多选
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // 将作品id传给父组件展示详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    // 搜索
    search(val) {
      this.listQuery = val
      this.getUndistributedList()
    },
    // 下载excel
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
<style scoped>
  .checkbox-box{
    width: 300px;
  }
</style>
