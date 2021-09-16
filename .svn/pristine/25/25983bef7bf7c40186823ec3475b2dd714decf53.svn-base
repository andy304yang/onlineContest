<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    autoResize: {
      type: Boolean,
      default: true
    },
    work: {
      default: () => [],
      type: Array
    },
    workvalue: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '作品访问量排行',
          textStyle: {
            color: '#3398DB'
          }
        },
        textStyle: {
          color: '#996600'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#3398DB'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: '访问量',
            type: 'bar',
            barWidth: '60%',
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
      this.option.yAxis.data = this.work
      this.option.series[0].data = this.workvalue
      this.chart.setOption(this.option)
    }
  }
}
</script>
