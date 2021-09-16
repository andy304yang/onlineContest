<template>
  <div class="app-container">
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
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="轮播视频封面" min-width="110px" align="center">
        <template slot-scope="{row}">
          <el-popover v-if="row.image" placement="right" title="" trigger="hover">
            <img :src="url+row.image" style="height: 450px;width: 450px">
            <img slot="reference" :src="url+row.image" :alt="row.image" style="height: 240px;width: 240px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="轮播视频" prop="title" align="center" min-width="110px">
        <template slot-scope="{row}">
          <video width="320" height="240" controls>
            <source :src="url+row.path" type="video/mp4">
          </video>
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
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 85%; margin-left:50px;">
        <el-form-item label="视频封面" prop="title" style="width: 70%;">
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
        <el-form-item label="轮播视频" prop="Mv">
          <el-upload
            action="#"
            :multiple="true"
            :auto-upload="false"
            :on-preview="handlePreviewMv"
            :on-remove="handleRemoveMv"
            :on-change="fileChangeMv"
            :file-list="fileListMv"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
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
import { search } from '@/api/Article/question'
import { getlbVedioMes, deleteVedioMes, addVedioMes, updateVedioMes } from '@/api/Article/carouselmv'
import { getBase64Image, btof, getImageName, getFileName } from '@/utils/change'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
// import lrz from 'lrz'

export default {
  name: 'Question',
  components: { Pagination },
  directives: { waves },
  props: {
    operability: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 视频封面
      limit: 1,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileListMv: [],
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
        title: '',
        path: '',
        pictures: []
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        content: [{ message: 'reviewer is required', trigger: 'blur' }]
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
      url: 'https://sd.bnuz.edu.cn/'
    }
  },
  created() {
    this.getList()
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
        this.temp.image = ''
      }
    },
    // 添加
    imgChange(file, fileList) {
      this.temp.pictures.push(file.raw)
    },
    // 网络请求获取表格数据
    getList() {
      getlbVedioMes().then(response => {
        this.list = response.obj
        this.listLoading = false
      })
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
    // 排序方法
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    // Id排序
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        image: '',
        pictures: []
      }
      this.fileList = []
      this.fileListMv = []
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.id = this.total
          const formdata = new FormData()
          for (const item1 of this.fileListMv) {
            formdata.append('vedioFile', item1)
          }
          for (const item of this.temp.pictures) {
            formdata.append('vedioImage', item)
          }
          addVedioMes(formdata).then(() => {
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
    },
    // 弹出编辑框
    handleUpdate(row) {
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.temp.pictures = []
      // 将后台给的url，转为File对象，否则上传时获取不到原有图片
      if (this.temp.image) {
        const image = new Image()
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
        image.src = this.temp.image
        const obj1 = { url: this.temp.image }
        // 借助this.fileList图片卡片中才对应显示
        this.fileList.push(obj1)
      }
      if (this.temp.path) {
        // 转化成file对象
        const obj = { name: this.temp.vedioName, url: this.temp.path }
        this.fileListMv.push(obj)
      }
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
          const formdata = new FormData()
          if (this.fileList[0] instanceof File) {
            for (const item1 of this.fileListMv) {
              formdata.append('vedioFile', item1)
            }
          } else {
            formdata.append('vedioFile', null)
          }
          for (const item of this.temp.pictures) {
            formdata.append('vedioImage', item)
          }
          formdata.append('id', this.temp.id)
          updateVedioMes(formdata).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    // 删除操作
    handleDelete(row, index) {
      // if (confirm('确定要删除吗？') === true) {
      deleteVedioMes(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
      // }
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '问题内容', '回答']
        const filterVal = ['qid', 'qcontent', 'answer']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '常见问题'
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 上传文件
    handleRemoveMv(file, fileList) {
      console.log(file, fileList)
    },
    handlePreviewMv(file) {
      console.log(file)
    },
    fileChangeMv(file, fileList) {
      this.fileListMv.push(file.raw)
    },
    // 搜索
    search(val) {
      if (val === null) {
        this.$notify({
          title: '对不起！',
          message: '没有您想要的数据',
          type: 'warning',
          duration: 2000
        })
        return
      }
      console.log(val)
      // this.listQuery.page = 1
      // this.list = val.worksList
      // this.total = val.pageTotal
      // this.listLoading = false
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
