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
        <div />
        <div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
            <a href="http://sd.bnuz.edu.cn/markTable/评分表模版.xlsx">下载评分表模板</a>
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
      @sort-change="sortChange"
    >
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="竞赛名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.matchname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分表名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span class="link-type"><a :href="url+row.path">{{ row.name }}</a></span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="评分表" prop="scoreSheet">
          <el-upload
            action="#"
            :multiple="true"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="评分表名称" prop="priceName" style="width: 80%;">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-alert
          v-show="dialogStatus==='update'"
          title="请重新选择评分表对应的竞赛"
          type="error"
        /><br>
        <el-form-item label="竞赛项目" prop="priceName" style="width: 80%;">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            @change="handleChange"
          />
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
import { getMarktableMes, addMarktable, updateMarktable, getMatchID, search, getMarkTableMesByid, deleteMarktable } from '@/api/Article/scoresheet'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ScoreSheet',
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
        mid: undefined,
        markTableFile: [],
        content: '',
        time: new Date(),
        markName: '',
        value: []
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
        priceName: [{ message: 'reviewer is required', trigger: 'blur' }]
      },
      // 下载excel
      downloadLoading: false,
      // 搜索内容
      searchKey: '',
      searchData: {
        pageNum: 1,
        pageSize: 20,
        id: ''
      },
      checkedSearch: 'id',
      searchOptions: [
        { key: 'id', display_name: 'ID' }
      ],
      options: [],
      options1: [],
      selectedOptions: [],
      fileList: [],
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
    // 网络请求获取表格数据
    getList() {
      getMarktableMes(this.listQuery).then(response => {
        this.list = response.obj.marktableList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
      getMatchID().then(response => {
        response.obj.forEach((item) => {
          const obj = {
            label: item.name,
            value: item.value,
            children: []
          }
          item.project.forEach((item1) => {
            const obj1 = {
              label: item1.name,
              value: item1.value,
              children: []
            }
            item1.type.forEach((item2) => {
              const obj2 = {
                label: item2.name,
                value: item2.value
              }
              obj1.children.push(obj2)
            })
            obj.children.push(obj1)
          })
          this.options.push(obj)
        })
      })
    },
    // 搜索
    handleFilter() {
      this.searchData.id = this.searchKey
      search(this.searchData).then(response => {
        if (response.obj == null) {
          this.$notify({
            title: '对不起！',
            message: '没有您想要的数据',
            type: 'warning',
            duration: 2000
          })
          return
        } else {
          // this.listQuery.page = 1
          this.list = []
          this.list.push(response.obj)
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
        mid: undefined,
        markTableFile: [],
        content: '',
        time: new Date(),
        markName: ''
      }
      this.fileList = []
      this.selectedOptions = []
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
          const formData = new FormData()
          for (const item of this.fileList) {
            formData.append('markTableFile', item)
          }
          formData.append('markName', this.temp.name)
          formData.append('mid', this.temp.mid)
          addMarktable(formData).then(() => {
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
      this.selectedOptions = []
      getMarkTableMesByid(row.id).then(response => {

      })
      this.temp.id = row.id
      if (this.temp.path) {
        // 转化成file对象
        const obj1 = { name: this.temp.name, url: this.temp.path }
        this.fileList.push(obj1)
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
          const formData = new FormData()
          if (this.fileList[0] instanceof File) {
            for (const item of this.fileList) {
              formData.append('markTableFile', item)
            }
          } else {
            formData.append('markTableFile', null)
          }

          formData.append('markName', this.temp.name)
          formData.append('mid', this.temp.mid)
          formData.append('id', this.temp.id)
          updateMarktable(formData).then(() => {
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
    // 删除评分表
    handleDelete(row) {
      deleteMarktable(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    // 下载excel
    handleDownload() {
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
    handlePreview(file) {
    },
    fileChange(file, fileList) {
      this.fileList.push(file.raw)
    },
    handleChange(val) {
      this.temp.mid = val[2]
    },
    clear() {
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
