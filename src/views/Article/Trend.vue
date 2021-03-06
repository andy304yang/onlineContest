<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分handleFilter -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="标题图" prop="title" align="center" width="260px">
        <template slot-scope="{row}">
          <el-popover v-if="row.image1" placement="right" title="" trigger="hover">
            <img :src="url+row.image1" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image1" :alt="row.image1" style="height: 100px;width: 100px">
          </el-popover>
          <el-popover v-if="row.image2" placement="right" title="" trigger="hover">
            <img :src="url+row.image2" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image2" :alt="row.image2" style="height: 100px;width: 100px">
          </el-popover>
          <el-popover v-if="row.image3" placement="right" title="" trigger="hover">
            <img :src="url+row.image3" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image3" :alt="row.image3" style="height: 100px;width: 100px">
          </el-popover>
          <el-popover v-if="row.image4" placement="right" title="" trigger="hover">
            <img :src="url+row.image4" style="height: 500px;width: 500px">
            <img slot="reference" :src="url+row.image4" :alt="row.image4" style="height: 100px;width: 100px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center" min-width="280px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" min-width="200px" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_project }}</span>
          <el-tag>{{ row.match_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该数据吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 85%; margin-left:50px;">
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
            <div slot="tip" class="el-upload__tip">最多只能上传四张图片</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!-- 借助img和canvas完成转化 -->
          <img id="img1" style="display:none">
          <img id="img2" style="display:none">
          <img id="img3" style="display:none">
          <img id="img4" style="display:none">
        </el-form-item>
        <el-form-item label="标题" prop="title" style="width: 70%;">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="竞赛项目" prop="match_name" style="width: 70%;">
          <el-input v-model="temp.match_project" />
        </el-form-item>
        <el-form-item label="竞赛名称" prop="match_project" style="width: 70%;">
          <el-input v-model="temp.match_name" />
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="作者" prop="name" style="width: 40%;">
          <el-input v-model="temp.name" />
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryDynamicList, addDynamic, deleteDynamic, updateDynamic } from '@/api/Article/trend'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import { getBase64Image, btof, getImageName, getFileName } from '@/utils/change'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import lrz from 'lrz'

export default {
  name: 'Trend',
  components: { Pagination, Tinymce },
  directives: { waves },
  data() {
    return {
      limit: 4,
      disabled: false,
      fileList: [],
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      // 搜索内容
      searchKey: '',
      checkedSearch: 'title',
      searchOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'match_name', display_name: '竞赛名称' }
      ],
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        start_date: '',
        end_date: '',
        match_project: '',
        match_name: '',
        title: ''
      },
      // 弹框内容
      temp: {
        id: undefined,
        title: '',
        match_name: '',
        match_project: '',
        time: new Date(),
        content: '',
        pictures: [],
        image1: '',
        image2: '',
        image3: '',
        image4: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      flag: 1,
      // 弹框规则
      rules: {
        title: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        match_project: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        time: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        match_name: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        name: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        short_content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      // 下载excel
      downloadLoading: false,
      url: 'https://sd.bnuz.edu.cn/'
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
    // 嵌套弹框预览图片
    handlePreview(file) {
      this.dialogImageUrl = this.url + file.url
      console.log(this.dialogImageUrl)
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
    // 网络请求获取表格数据
    getList() {
      queryDynamicList(this.listQuery).then(response => {
        this.list = response.obj.dynamicList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        start_date: '',
        end_date: '',
        match_project: '',
        match_name: '',
        title: ''
      }
      if (this.checkedSearch === 'title') {
        this.listQuery.title = this.searchKey
      } else if (this.checkedSearch === 'match_name') {
        this.listQuery.match_name = this.searchKey
      }
      this.getList()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: '',
        pictures: [],
        image1: '',
        image2: '',
        image3: '',
        image4: ''
      }
      this.fileList = []
    },
    // 弹出新增框
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
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.id = this.total
          this.temp.time = parseTime(this.temp.time, '{y}-{m}-{d} {h}:{i}')
          const formData = new FormData()
          formData.append('content', this.temp.content)
          formData.append('time', this.temp.time)
          formData.append('name', this.temp.name)
          formData.append('title', this.temp.title)
          formData.append('match_name', this.temp.match_name)
          formData.append('match_project', this.temp.match_project)
          formData.append('short_content', this.temp.short_content)
          for (const item of this.temp.pictures) {
            formData.append('pictures', item)
          }
          addDynamic(formData).then(() => {
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
    // 弹出编辑框
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.temp.pictures = []
      // 将后台给的url，转为File对象，否则上传时获取不到原有图片
      if (this.temp.image1) {
        const image1 = new Image()
        image1.setAttribute('crossOrigin', 'Anonymous')
        image1.onload = () => {
          const base64 = getBase64Image(image1)
          // 获取名字
          const imgname = getImageName(image1.src)
          document.getElementById('img1').src = base64
          // 转换base64到file
          const file = btof(base64, imgname)
          this.temp.pictures.push(file)
        }
        image1.src = this.temp.image1
        console.log(image1.src)
        const obj1 = { url: this.url + this.temp.image1 }
        // 借助this.fileList图片卡片中才对应显示
        this.fileList.push(obj1)
      }
      if (this.temp.image2) {
        const image2 = new Image()
        image2.setAttribute('crossOrigin', 'Anonymous')
        image2.onload = () => {
          const base64 = getBase64Image(image2)
          const imgname = getImageName(image2.src)
          document.getElementById('img2').src = base64
          const file = btof(base64, imgname)
          this.temp.pictures.push(file)
        }
        image2.src = this.temp.image2
        const obj2 = { url: this.url + this.temp.image2 }
        this.fileList.push(obj2)
      }
      if (this.temp.image3) {
        const image3 = new Image()
        image3.setAttribute('crossOrigin', 'Anonymous')
        image3.onload = () => {
          const base64 = getBase64Image(image3)
          const imgname = getImageName(image3.src)
          document.getElementById('img3').src = base64
          const file = btof(base64, imgname)
          this.temp.pictures.push(file)
        }
        image3.src = this.temp.image3
        const obj3 = { url: this.url + this.temp.image3 }
        this.fileList.push(obj3)
      }
      if (this.temp.image4) {
        const image4 = new Image()
        image4.setAttribute('crossOrigin', 'Anonymous')
        image4.onload = () => {
          const base64 = getBase64Image(image4)
          const imgname = getImageName(image4.src)
          document.getElementById('img4').src = base64
          const file = btof(base64, imgname)
          this.temp.pictures.push(file)
        }
        image4.src = this.temp.image4
        const obj4 = { url: this.url + this.temp.image4 }
        this.fileList.push(obj4)
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
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.time = parseTime(this.temp.time, '{y}-{m}-{d} {h}:{i}')
          const tempData = new FormData()
          tempData.append('id', this.temp.id)
          tempData.append('content', this.temp.content)
          tempData.append('time', this.temp.time)
          tempData.append('name', this.temp.name)
          tempData.append('title', this.temp.title)
          tempData.append('match_name', this.temp.match_name)
          tempData.append('match_project', this.temp.match_project)
          tempData.append('short_content', this.temp.short_content)
          for (const item of this.temp.pictures) {
            tempData.append('pictures', item)
          }
          updateDynamic(tempData).then(() => {
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
    },
    // 删除操作
    handleDelete(row, index) {
      deleteDynamic(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '标题', '竞赛名称', '竞赛项目', '日期', '作者', '内容']
        const filterVal = ['id', 'title', 'match_name', 'match_project', 'time', 'name', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '竞赛动态'
        })
        this.downloadLoading = false
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
