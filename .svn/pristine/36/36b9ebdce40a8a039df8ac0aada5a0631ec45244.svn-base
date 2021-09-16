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
    second: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '页面访问量'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        series: [
          {
            name: '访问量',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
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
    pieChange() {
      this.second.forEach((item) => {
        this.option.legend.data.push(item.name)
      })
      this.option.series[0].data = this.second
      this.chart.setOption(this.option)
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.pieChange()
    }
  }
}
</script>
