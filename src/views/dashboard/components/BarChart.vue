<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
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
    first: {
      default: () => [],
      type: Array
    },
    firstvalue: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '模块访问量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '访问量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration
        }]
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
    change(dataIndex) {
      this.$emit('change', dataIndex)
    },
    initChart() {
      this.option.xAxis[0].data = this.first
      this.option.series[0].data = this.firstvalue
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(this.option)
      this.chart.on('click', (params) => {
        this.change(params.dataIndex)
      })
    }

  }
}
</script>
