<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分handleFilter -->
      <div class="flex-box">
        <div>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div />
        <div />
      </div>
    </div>
    <!-- 表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="模板名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span v-if="!isCourseAdmin" class="link-type"><a :href="url + row.path">{{ row.file_name }}</a></span>
          <span v-if="isCourseAdmin" class="link-type"><a :href="url + row.path">{{ row.prize_name }}</a></span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCourseAdmin" label="竞赛名称" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCourseAdmin" label="竞赛项目" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_project }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCourseAdmin" label="竞赛类型" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学年/学期" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该数据吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button v-if="operability" slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="RemoveFileList">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
        <div v-if="!isCourseAdmin">
          <el-form-item label="奖状模板" prop="priceModel">
            <el-upload
              action="#"
              accept=".pdf"
              :multiple="true"
              :auto-upload="false"
              :on-remove="handleRemove"
              :on-change="fileChange"
              :file-list="fileList"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-col :span="20">
            <el-form-item :inline="true" label="自定义奖状模板名称" prop="priceName" style="width: 100%;">
              <el-input v-model="temp.file_name" placeholder="无需输入文件后缀" style="display: inline;" />
            </el-form-item>
          </el-col>
          <p style="font-size: 23px;">.PDF</p>
          <el-form-item label="奖项类型" prop="priceType" style="width: 80%;">
            <el-select v-model="temp.prize_type" placeholder="请选择">
              <el-option
                v-for="item in prizeType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="奖状对应的学年/学期" prop="priceName" style="width: 80%;">
            <el-input v-model="temp.number" />
          </el-form-item>
        </div>
        <!-- 课程管理员编辑弹窗 -->
        <div v-else>
          <el-form-item label="奖项名称" prop="priceName" style="width: 80%;">
            <el-input v-model="temp.prize_name" />
          </el-form-item>
          <el-form-item label="赛事" prop="priceName" style="width: 80%;">
            <el-select v-model="temp.mid" placeholder="请选择">
              <el-option
                v-for="item in mid"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="奖状模板" prop="priceName" style="width: 80%;">
            <el-select v-model="temp.pm_id" placeholder="请选择">
              <el-option
                v-for="item in pm_id"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from '@/api/Article/question'
import { getPrizeModelMes, getPriceName, addPrizeModel, deletePrizeModel, updatePrizeModel, getCoursePrizeMes, getCourseMatchMesByCid, getModelNameWithID, addCoursePrize, deleteCoursePrize, updateCoursePrize } from '@/api/Article/rewardtemplate'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'RewardTemplate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      // 弹框内容
      temp: {
        id: undefined,
        priceModel: [],
        time: new Date(),
        value: null,
        level: null,
        prize_name: null,
        prize_type: null,
        mid: null,
        pm_id: null,
        pid: null
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 奖项类型
      prizeType: [
        { value: 1, label: '竞赛类' },
        { value: 2, label: '课程赛类' },
        { value: 3, label: '其他' }
      ],
      // 弹框规则
      rules: {
        priceName: [{ message: '请输入名称', trigger: 'blur' }]
      },
      // 下载excel
      downloadLoading: false,
      // 搜索内容
      searchKey: '',
      searchData: {
        pageNum: 1,
        pageSize: 20,
        qcontent: ''
      },
      // 奖状名
      options: [],
      fileList: [],
      course_fileList: [],
      mid: [{ }],
      pm_id: [{ }],
      url: 'https://sd.bnuz.edu.cn/'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    ...mapGetters([
      'operability'
    ]),
    isCourseAdmin() {
      return this.roles.includes('courseAdmin')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 网络请求获取表格数据
    getList() {
      if (this.isCourseAdmin) {
        getCoursePrizeMes().then(response => {
          this.list = response.obj.prizeList
          console.log(this.list)
          this.total = response.obj.prizeList.length
          for (let i = 0; i < this.total; i++) {
            this.list[i].id = i
          }
          this.listLoading = false
        })
        // 获取赛事id
        getCourseMatchMesByCid().then(response => {
          for (let i = 0; i < response.obj.length; i++) {
            this.mid[i].value = response.obj[0].project[0].type[0].value
            this.mid[i].label = response.obj[0].project[0].type[0].name
          }
        })
        // 获取模板id
        getModelNameWithID().then(response => {
          this.pm_id = response.obj
          for (let i = 0; i < response.obj.length; i++) {
            this.pm_id[i].value = response.obj[i].id
            this.pm_id[i].label = response.obj[i].file_name
          }
        })
      } else {
        getPrizeModelMes().then(response => {
          this.list = response.obj.prizeList
          this.total = response.obj.pageTotal
          this.listLoading = false
          console.log(this.list)
        })
        getPriceName().then(response => {
          this.options = response.obj
        })
      }
    },
    // 搜索
    handleFilter() {
      this.searchData.qcontent = this.searchKey
      search(this.searchData).then(response => {
        if (response.obj.pageTotal === 0) {
          this.$notify({
            title: '对不起！',
            message: '没有您想要的数据',
            type: 'warning',
            duration: 2000
          })
          return
        } else {
          this.listQuery.page = 1
          this.list = response.obj.questionList
          this.total = response.obj.pageTotal
          this.listLoading = false
        }
      })
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        priceModel: [],
        time: new Date(),
        file_name: '',
        value: null,
        level: null,
        prize_name: null,
        mid: null,
        pm_id: null,
        pid: null
      }
      this.fileList = []
      this.course_fileList = []
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      if (this.isCourseAdmin) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.total = this.total + 1
            this.temp.id = this.total
            // this.temp.prize_name = this.temp.file_name
            addCoursePrize(this.temp).then((res) => {
              this.list.push(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      } else {
        if (!this.fileList.length) {
          this.$notify({
            title: '对不起！',
            message: '请选择奖状模板pdf文件',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.total = this.total + 1
            this.temp.id = this.total
            const formData = new FormData()
            for (const item of this.fileList) {
              formData.append('prizeModel', item)
            }
            formData.append('file_name', this.temp.file_name)
            formData.append('prize_type', this.temp.prize_type)
            formData.append('number', this.temp.number)
            addPrizeModel(formData).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      }
    },
    // 弹出编辑框
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.temp.priceModel = []
      if (this.temp.path) {
        // 转化成file对象
        const obj1 = new File([this.temp.path], this.temp.file_name)
        this.fileList.push(obj1)
      }
      // 课程管理员获取文件
      if (this.temp.path && this.isCourseAdmin) {
        // 转化成file对象
        const obj2 = new File([this.temp.path], this.temp.prize_name)
        this.course_fileList.push(obj2)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      if (this.isCourseAdmin) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.prize_name = this.temp.file_name
            updateCoursePrize(this.temp).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      } else {
        if (!this.fileList.length) {
          this.$notify({
            title: '对不起！',
            message: '请选择奖状模板pdf文件',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempEventData = new FormData()
            for (const item of this.fileList) {
              tempEventData.append('prizeModel', item)
            }
            tempEventData.append('pid', this.temp.pid)
            tempEventData.append('file_name', this.temp.file_name)
            tempEventData.append('prize_type', this.temp.prize_type)
            tempEventData.append('number', this.temp.number)
            updatePrizeModel(tempEventData).then(() => {
              const index = this.list.findIndex(v => v.pid === this.temp.pid)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    },
    // 删除操作
    handleDelete(row, index) {
      if (this.isCourseAdmin) {
        // row.pid = 14
        deleteCoursePrize(row.pr_id).then(() => {
          this.$notify({
            title: '成功',
            message: '成功删除',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      } else {
        deletePrizeModel(row.pid).then(() => {
          this.$notify({
            title: '成功',
            message: '成功删除',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 上传文件
    handleRemove(file, fileList) {
      this.fileList = []
    },
    course_handleRemove(file, course_fileList) {
      this.course_fileList = []
    },
    RemoveFileList() { // 解决第二次打开编辑按钮 列表有上次的内容导致 页面出现闪烁
      this.fileList = []
    },
    fileChange(file, fileList) {
      this.fileList.push(file.raw)
    },
    course_fileChange(file, course_fileList) {
      this.course_fileList.push(file.raw)
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
