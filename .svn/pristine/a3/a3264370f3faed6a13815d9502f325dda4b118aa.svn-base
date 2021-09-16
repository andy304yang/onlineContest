<template>
  <div class="dashboard-editor-container">
    <panel-group :message="message" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart ref="pie" :second="second" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart ref="line" :work="work" :workvalue="workvalue" />
        </div>
      </el-col>
    </el-row>
    <div class="chart-wrapper">
      <content-chart ref="content" :content="content" :contentvalue="contentvalue" />
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import ContentChart from './components/ContentChart'
import { getMessageQue } from '@/api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    ContentChart,
    PieChart
  },
  data() {
    return {
      message: {},
      first: ['活动报道', '报名参赛', '在线分享', '协会介绍', '个人中心', '常见问题', '作品提交', '评委中心'],
      firstvalue: [],
      work: [],
      workvalue: [],
      content: [],
      contentvalue: [],
      second: [
        { value: 0, name: '活动报道' },
        { value: 0, name: '报名参赛' },
        { value: 0, name: '在线分享' },
        { value: 0, name: '协会介绍' },
        { value: 0, name: '个人中心' },
        { value: 0, name: '常见问题' }
      ]
    }
  },
  mounted() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      getMessageQue().then(res => {
        this.message = res.obj
        // 将0转化为null, 解决图标中显示多余0问题
        const len = this.message.contentvalue.length
        const arr = new Array(6)
        for (let i = 0; i < 6; i++) {
          arr[i] = new Array(len)
        }
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < len; j++) {
            arr[i][j] = this.message.contentvalue[i][j] === 0 ? null : this.message.contentvalue[i][j]
          }
        }
        this.second.forEach((item, index) => {
          item.value = this.message.firstvalue[index]
        })
        this.contentvalue = arr
        this.content = this.message.content
        this.firstvalue = this.message.firstvalue
        this.work = this.message.topTenworks
        this.workvalue = this.message.topTenworksvalue
        this.$nextTick(() => {
          this.$refs.content.initChart()
          this.$refs.line.initChart()
          this.$refs.pie.initChart()
        })
      })
    },
    change(dataIndex) {
      this.$refs.pie.pieChange(dataIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    overflow: auto;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
