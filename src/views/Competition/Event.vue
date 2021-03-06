<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability" class="filter-item" type="info" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="handleClear" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
            导出Excel
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="clickTable"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="承办单位">
              <span>{{ row.clubname }}</span>
            </el-form-item>
            <el-form-item label="进度">
              <span>{{ row.now | developFilter }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ row.number }}</span>
            </el-form-item>
            <el-form-item label="发布单位">
              <span>{{ row.poster }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span v-html="row.content" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="海报图" min-width="110px" align="center">
        <template slot-scope="{row}">
          <el-popover v-if="row.image" placement="right" title="" trigger="hover">
            <img :src="url+row.image" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image" :alt="row.image" style="height: 100px;width: 100px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛项目" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.project }}</span>
          <el-tag type="info">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_date }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="是否归档" width="150px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isSort"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="changeSort(row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="是否上线" width="150px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.onTime"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch(row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="是否为作品赛" width="150px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isProject"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="changeProject(row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="是否为课程赛" width="150px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isCourse"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="changeCourse(row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click.stop="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="110px" style="width: 95%; margin-left:50px;">
        <el-form-item label="标题图" prop="title" style="width: 70%;">
          <el-upload
            action="#"
            :limit="limit"
            :multiple="true"
            :auto-upload="false"
            :file-list="fileList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="imgChange"
            list-type="picture"
          >
            <el-button size="small" type="primary">选择图片</el-button>
            <div slot="tip" class="el-upload__tip">最多只能上传一张图片</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!-- 借助img和canvas完成转化 -->
          <img id="img1" style="display:none">
        </el-form-item>
        <el-form-item label="竞赛名称" prop="name" style="width: 70%;">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="竞赛项目" prop="project" style="width: 70%;">
          <el-input v-model="temp.project" />
        </el-form-item>
        <el-form-item label="类别" prop="type" style="width: 70%;">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker v-model="temp.start_date" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="报名截止时间" prop="end_date">
          <el-date-picker v-model="temp.end_date" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="项目状态" prop="now">
          <el-select v-model="temp.now" class="filter-item" placeholder="请选择进度">
            <el-option v-for="item in developOptions" :key="item.key+'-label'" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="承办单位" prop="clubname">
          <el-select v-model="temp.clubname" class="filter-item" placeholder="请选择协会">
            <el-option v-for="item in club" :key="item.key+''" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布单位" prop="type" style="width: 70%;">
          <el-input v-model="temp.poster" />
        </el-form-item>
        <el-form-item label="联系方式" prop="number" style="width: 50%;">
          <el-input v-model="temp.number" />
        </el-form-item>
        <el-form-item label="摘要" prop="short_content" style="width: 80%;">
          <el-input v-model="temp.short_content" />
        </el-form-item>
        <el-form-item label="内容" prop="content" style="width: 100%;">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="operability" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMatchtableList, addMatch, deleteMatch, updateMatch, getClubName, ShowMatch, isProjectMatch, isCourseMatch, isSortMatch } from '@/api/Article/event'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import { getBase64Image, btof, getImageName, getFileName } from '@/utils/change'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import lrz from 'lrz'
// import { forEach } from 'jszip/lib/object'

const club = []

const clubTypeKeyValue = club.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const developOptions = [
  { key: '0', display_name: '报名' },
  { key: '1', display_name: '初赛' },
  { key: '2', display_name: '复赛' },
  { key: '3', display_name: '决赛' },
  { key: '4', display_name: '已结束' }
]

const developTypeKeyValue = developOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Event',
  components: { Pagination, Tinymce },
  directives: { waves },
  filters: {
    developFilter(type) {
      return developTypeKeyValue[type]
    },
    clubFilter(type) {
      return clubTypeKeyValue[type]
    }
  },
  data() {
    return {
      value: true,
      // 海报图
      limit: 1,
      disabled: false,
      fileList: [],
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      clublist: null,
      // 搜索内容
      searchKey: '',
      checkedSearch: 'project',
      searchOptions: [
        { key: 'project', display_name: '竞赛项目' },
        { key: 'poster', display_name: '承办单位' },
        { key: 'name', display_name: '竞赛名称' },
        { key: 'type', display_name: '竞赛类别' }
      ],
      club: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        project: '',
        type: '',
        poster: ''
      },
      developOptions,
      temp: {
        project: '',
        name: '',
        type: '',
        start_date: '',
        end_date: '',
        club_id: '',
        clubname: '',
        number: '',
        poster: '',
        content: '',
        url: '',
        mid: undefined,
        now: '',
        pictures: [],
        image1: '',
        image2: '',
        image3: '',
        image4: ''
      },
      nowTemp: '',
      dialogFormVisible: false,
      dialogStatus: '',
      flag: 1,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        name: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        project: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        type: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        start_date: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        end_date: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        now: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        short_content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      // 下载excel
      downloadLoading: false,
      // 计数上线个数
      count: 0,
      url: ''
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
    this.url = this.BASEURL
  },
  methods: {
    // 嵌套弹框预览图片
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 移除
    handleRemove(file) {
      // 更新弹框需借助filename判断，因为新增和更新获取的file不一致
      const filename = getFileName(file.url)
      let findIndex
      for (let i = 0; i < this.temp.pictures.length; i++) {
        if (file.name === this.temp.pictures[i].name || filename === this.temp.pictures[i].name) {
          findIndex = i
        }
      }
      this.temp.pictures.splice(findIndex, 1)
      // 为了提交后呈现图片对应
      if (findIndex === 0) {
        this.temp.image1 = ''
      } else if (findIndex === 1) {
        this.temp.image2 = ''
      } else if (findIndex === 2) {
        this.temp.image3 = ''
      } else {
        this.temp.image4 = ''
      }
    },
    // 添加
    imgChange(file, fileList) {
      lrz(file.raw).then((res) => {
        this.temp.pictures.push(res.file)
        // 为了提交后呈现图片对应
        if (this.temp.image1 === '') {
          this.temp.image1 = file.url
        } else if (this.temp.image2 === '') {
          this.temp.image2 = file.url
        } else if (this.temp.image3 === '') {
          this.temp.image3 = file.url
        } else {
          this.temp.image4 = file.url
        }
      })
    },
    getList() {
      getMatchtableList(this.listQuery).then(response => {
        this.list = response.obj.questionList
        this.total = response.obj.pageTotal
        this.listLoading = false
        this.count = 0
        this.list.forEach((item) => {
          if (item.onTime === 1) {
            this.count++
          }
        })
      })
      getClubName().then(response => {
        this.clublist = response
        this.club = []
        var that = this
        this.clublist.obj.forEach(function(item, index) {
          that.club.push({ key: String(item.cid), display_name: item.clubname })
        })
      })
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: '',
        project: '',
        type: '',
        poster: ''
      }
    },
    handleFilter() {
      // 竞赛项目检索后台存在问题
      this.reset()
      this.listQuery[this.checkedSearch] = this.searchKey
      this.getList()
    },
    resetTemp() {
      this.temp = {
        project: '',
        name: '',
        type: '',
        start_date: '',
        end_date: '',
        club_id: '',
        clubname: undefined,
        number: '',
        poster: '',
        content: '',
        url: '',
        mid: undefined,
        now: '',
        pictures: [],
        image1: '',
        image2: '',
        image3: '',
        image4: ''
      }
      this.fileList = []
    },
    handleCreate() {
      this.resetTemp()
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent('')
        })
      }
      this.flag++
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.start_date = parseTime(this.temp.start_date, '{y}-{m}-{d} {h}:{i}')
          this.temp.end_date = parseTime(this.temp.end_date, '{y}-{m}-{d} {h}:{i}')
          this.temp.club_id = this.temp.clubname
          this.temp.clubname = clubTypeKeyValue[this.temp.clubname]
          var id = parseInt(this.temp.club_id)
          const formData = new FormData()
          formData.append('name', this.temp.name)
          formData.append('project', this.temp.project)
          formData.append('now', this.temp.now)
          formData.append('type', this.temp.type)
          formData.append('start_date', this.temp.start_date)
          formData.append('end_date', this.temp.end_date)
          formData.append('club_id', id)
          formData.append('number', this.temp.number)
          formData.append('content', this.temp.content)
          formData.append('poster', this.temp.poster)
          formData.append('short_content', this.temp.short_content)
          for (const item of this.temp.pictures) {
            formData.append('pictures', item)
          }
          addMatch(formData).then(() => {
            this.list.unshift(this.temp)
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
    },
    // 更新
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.nowTemp = this.temp.now
      this.temp.now = developTypeKeyValue[this.temp.now]
      this.temp.pictures = []
      // 将后台给的url，转为File对象，否则上传时获取不到原有图片
      if (this.temp.image) {
        var image = new Image()
        image.setAttribute('crossOrigin', 'Anonymous')
        image.onload = () => {
          const base64 = getBase64Image(image)
          // 获取名字
          const imgname = getImageName(image.src)
          document.getElementById('img1').src = base64
          // 转换base64到file
          const file = btof(base64, imgname)
          this.temp.pictures.push(file)
        }
        image.src = this.url + this.temp.image
        const obj1 = { url: this.url + this.temp.image }
        // 借助this.fileList图片卡片中才对应显示
        this.fileList.push(obj1)
      }
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent(this.temp.content)
        })
      }
      this.flag++
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.start_date = parseTime(tempData.start_date, '{y}-{m}-{d} {h}:{i}')
          tempData.end_date = parseTime(tempData.end_date, '{y}-{m}-{d} {h}:{i}')
          // if (tempData.clubname === this.temp.clubname) {
          //   tempData.club_id = this.temp.club_id
          //   // console.log(tempData.clubname)
          // } else {
          //   tempData.club_id = tempData.clubname
          //   tempData.clubname = clubTypeKeyValue[tempData.clubname]
          // }
          if (tempData.now === '报名') {
            tempData.now = '0'
          } else if (tempData.now === '初赛') {
            tempData.now = '1'
          } else if (tempData.now === '复赛') {
            tempData.now = '2'
          } else if (tempData.now === '决赛') {
            tempData.now = '3'
          }
          var id = parseInt(tempData.club_id)
          const tempEventData = new FormData()
          tempEventData.append('mid', tempData.mid)
          tempEventData.append('name', tempData.name)
          tempEventData.append('project', tempData.project)
          tempEventData.append('now', tempData.now)
          tempEventData.append('type', tempData.type)
          tempEventData.append('start_date', tempData.start_date)
          tempEventData.append('end_date', tempData.end_date)
          tempEventData.append('club_id', id)
          tempEventData.append('number', tempData.number)
          tempEventData.append('poster', tempData.poster)
          tempEventData.append('content', tempData.content)
          tempEventData.append('short_content', tempData.short_content)
          for (const item of tempData.pictures) {
            tempEventData.append('pictures', item)
          }
          updateMatch(tempEventData).then(() => {
            const index = this.list.findIndex(v => v.mid === this.temp.mid)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteMatch(row.mid).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '请刷新页面再操作哦！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '项目名称', '竞赛项目', '类型', '开始时间', '结束时间', '进度', '负责协会', '联系方式', '发布人', '链接']
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
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    },
    changeSort(row) {
      isSortMatch(row).then(() => {
        this.$notify({
          title: '成功',
          message: '成功修改',
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
      event.stopPropagation()
    },
    changeSwitch(row) {
      if (row.onTime === 0) {
        this.count--
      }
      if (this.count < 8) {
        ShowMatch(row).then(() => {
          this.$notify({
            title: '成功',
            message: '成功修改',
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
        event.stopPropagation()
      } else {
        this.$notify({
          title: '失败',
          message: '超过了八个上线竞赛，请刷新页面再操作！',
          type: 'fail',
          duration: 2000
        })
        event.stopPropagation()
      }
    },
    changeProject(row) {
      isProjectMatch(row).then(() => {
        this.$notify({
          title: '成功',
          message: '成功修改',
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
      event.stopPropagation()
    },
    changeCourse(row) {
      isCourseMatch(row).then(() => {
        this.$notify({
          title: '成功',
          message: '成功修改',
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
      event.stopPropagation()
    },
    handleClear() {
      this.reset()
      this.getList()
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
  .flex-box {
    display: flex;
    justify-content: space-between
  }
  /deep/ .el-dialog {
    width: 60%;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
  .uploadhidden {
    /deep/ .el-upload--picture-card {
      display: none;
    }
  }
</style>
