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
      <el-table-column label="作品名称" align="center" min-width="180px">
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
      <el-table-column prop="score" width="80px" label="分数">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rank" width="80px" label="名次">
        <template slot-scope="{row}">
          <span>{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center">
        <template slot-scope="{row}">
          <el-button v-if="operability" type="primary" size="mini" @click="handleAudit(row.wid)">
            审核
          </el-button>
          <!-- <el-button type="danger" size="mini">
            退回
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Audit, Return } from '@/api/Competition/works/rise'
import { getWorks } from '@/api/Competition/works/index'
import { getCourseWorkMes } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Noscored',
  directives: { waves },
  components: { Pagination },
  props: {
    listQuery: {
      default: () => {},
      type: Object
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
      downloadLoading: false
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
      if (key && value) {
        this.listQuery[key] = value
      }
      if (this.isCourseAdmin) {
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
    // 将作品id传给父组件展示详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    // 作品审核
    handleAudit(wid) {
      Audit(wid).then(() => {
        this.$notify({
          title: '成功',
          message: '审核成功',
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
    },
    handleReturn(row) {
      Return(row.mid).then(() => {
        this.$notify({
          title: '成功',
          message: '退回成功',
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
