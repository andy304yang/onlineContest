<template>
  <div class="app-container">
    <!-- 功能框分为三部分 -->
    <div class="flex-box">
      <div>
        <el-button v-show="activeName === 'first' && operability" type="primary" icon="el-icon-edit" @click="createPho">
          添加轮播图
        </el-button>
        <el-button v-show="activeName === 'second' && operability" type="primary" icon="el-icon-edit" @click="createMov">
          添加轮播视频
        </el-button>
        <el-button v-waves class="filter-item" type="info" icon="el-icon-download">
          导出Excel
        </el-button>
      </div>
    </div>
    <!-- tab -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="轮播图" name="first">
        <carousel-photo v-if="activeName === 'first'" ref="photo" :operability="operability" />
      </el-tab-pane>
      <el-tab-pane label="轮播视频" name="second">
        <carousel-movie v-if="activeName === 'second'" ref="movie" :operability="operability" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import carouselPhoto from './components/carouselPhoto'
import carouselMovie from './components/carouselMovie'
import { phosearch } from '@/api/Article/carousel'
import { mvsearch } from '@/api/Article/carouselmv'
import waves from '@/directive/waves'

export default {
  name: 'Carousel',
  components: { carouselPhoto, carouselMovie },
  directives: { waves },
  data() {
    return {
      activeName: 'first',
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      // 搜索功能
      checkedSearch: 'id',
      searchOptions: [
        { key: 'id', display_name: 'ID' }
      ],
      searchKey: '',
      searchData: {
        pageNum: 1,
        pageSize: 20,
        id: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  methods: {
    // 父组件弹出子组件添加框
    createPho() {
      this.$refs.photo.handleCreate()
    },
    createMov() {
      this.$refs.movie.handleCreate()
    },
    // 搜索
    handleFilter() {
      if (this.checkedSearch === 'id') {
        this.searchData.id = this.searchKey
        if (this.activeName === 'first') {
          phosearch(this.searchData).then(response => {
            this.$refs.photo.search(response)
          })
        } else {
          mvsearch(this.searchData).then(response => {
            this.$refs.movie.search(response)
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between
  }
   .btnhidden {
    visibility: hidden
  }
  .details-item {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
