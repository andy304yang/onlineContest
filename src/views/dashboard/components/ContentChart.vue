<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    content: {
      default: () => [],
      type: Array
    },
    contentvalue: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '竞赛类别统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['已退回', '待审核', '待分配', '未得分', '已得分', '已出线']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: '已退回',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#8D98B3' // 柱状颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '待审核',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#B6A2DE' // 柱状颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '待分配',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#D87A80' // 柱状颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '未得分',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#FFB980' // 柱状颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '已得分',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#5AB1EF' // 柱状颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '已出线',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#2EC7C9' // 柱状图颜色
              }
            },
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          }
        ]
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.option.yAxis.data = this.content
      this.option.legend.data.forEach((item, index) => {
        this.option.series[index].data = this.contentvalue[index]
      })
      this.chart.setOption(this.option)
    }
  }
}
</script>
