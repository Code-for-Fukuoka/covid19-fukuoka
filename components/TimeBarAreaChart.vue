<template>
  <data-view :title="title" :category="category" :title-id="titleId" :date="date" :url="url">
    <template v-slot:button>
      <area-selector v-model="areaNum" />
	  <data-selector v-model="dataKind" />
    </template>
    <bar
      :chart-id="chartId"
      :chart-data="displayData"
      :options="displayOption"
      :height="240"
    />
    <template v-slot:infoPanel>
      <data-view-basic-info-panel
        :a-text="displayInfo.aText"
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
	<small v-if="areaNum == 0" class="annotation">※ 居住地が調査中、海外の陽性患者</small>
  </data-view>
</template>

<style>
small.annotation {
  padding-left: 28px;
}
</style>

<script>
import DataView from '@/components/DataView.vue'
import AreaSelector from '@/components/AreaSelector.vue'
import DataSelector from '@/components/DataSelector.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'

export default {
  components: { DataView, AreaSelector, DataSelector,DataViewBasicInfoPanel },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    category: {
      type: String,
      required: false,
      default: ''
    },
    titleId: {
      type: String,
      required: false,
      default: ''
    },
    chartId: {
      type: String,
      required: false,
      default: 'time-bar-chart'
    },
    chartData: {
      type: Array,
      required: false,
      default: () => []
    },
    date: {
      type: String,
      required: true,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    url: {
      type: String,
      required: false,
      default: ''
    },
    AreaData: {
      type: Array,
      required: false,
      default: () => ["すべて"]
    }
  },
  data() {
    return {
	  areaNum: 0,
      dataKind: 'transition',
	  chartDataSelect: [],
      displayData: {},
      displayOption: {},
	  update: String,
	  transitionSum: 0,
	  transitionPreSum: 0,
	  cumulativeSum: 0
    }
  },
  created() {
   this.chartData.forEach(d => {
     this.AreaData.push(d.label.replace(/※/g, ''))
   })
   this.chartData.forEach(d => {
     this.chartDataSelect.push(d)
   })
   this.setAreaData()
  },
  mounted() {
    const cardWidthNum = this.$el.clientWidth
    this.displayOption = this.setDisplayOption(cardWidthNum)
    this.displayData = this.setDisplayData()
  },
  computed: {
    displayCumulativeRatio() {
	  let result
	  if(this.areaNum == 0) {
	   result = this.transitionSum
	  } else if(this.areaNum > 0) {
	   const lastDay = this.chartDataSelect.slice(-1)[0].cumulative
       const lastDayBefore = this.chartDataSelect.slice(-2)[0].cumulative
	   result = lastDay - lastDayBefore
	  }
      return this.formatDayBeforeRatio(result)
    },
    displayTransitionRatio() {
	  let lastDay,lastDayBefore
	  if(this.areaNum == 0) {
       lastDay = this.transitionSum
       lastDayBefore = this.transitionPreSum
	  } else if(this.areaNum > 0){
       lastDay = this.chartDataSelect.slice(-1)[0].transition
       lastDayBefore = this.chartDataSelect.slice(-2)[0].transition
	  }
      return this.formatDayBeforeRatio(lastDay - lastDayBefore)
    },
    displayInfo() {
	  let lText_txt,sText_txt
	  let aTextTxt = `${this.AreaData[this.areaNum]}`
      if (this.dataKind === 'transition') {
	  aTextTxt = aTextTxt + ' (日別) :'
	    if(this.areaNum == 0) {
         lText_txt = `${this.transitionSum.toLocaleString()}`
         sText_txt = `実績値（前日比：${this.displayTransitionRatio} ${this.unit}）`
	    } else if(this.areaNum > 0){
         lText_txt = `${this.chartDataSelect.slice(-1)[0].transition.toLocaleString()}`
         sText_txt = `実績値（前日比：${this.displayTransitionRatio} ${this.unit}）`
	    }
        return {
		  aText: aTextTxt,
          lText: lText_txt,
          sText: sText_txt,
          unit: this.unit
        }
      }
	  aTextTxt = aTextTxt + '(累計) :'
	  if(this.areaNum == 0) {
       lText_txt = this.cumulativeSum.toLocaleString()
       sText_txt = `${this.update} 累計値（前日比：${
          this.displayCumulativeRatio
        } ${this.unit}）`
	  } else if(this.areaNum > 0){
       lText_txt = this.chartDataSelect[
          this.chartDataSelect.length - 1
        ].cumulative.toLocaleString()
       sText_txt = `${this.update} 累計値（前日比：${
          this.displayCumulativeRatio
        } ${this.unit}）`
	  }	  
      return {
	    aText: aTextTxt,
        lText: lText_txt,
        sText: sText_txt,
        unit: this.unit
      }
    }
  },
  methods: {
    formatDayBeforeRatio(dayBeforeRatio) {
      const dayBeforeRatioLocaleString = dayBeforeRatio.toLocaleString()
      switch (Math.sign(dayBeforeRatio)) {
        case 1:
          return `+${dayBeforeRatioLocaleString}`
        case -1:
          return `${dayBeforeRatioLocaleString}`
        default:
          return `${dayBeforeRatioLocaleString}`
      }
    },
    setAreaData() {
      if(this.update != null){
        let date = new Date(this.date)
        let yesterday_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
        this.update =  (1 + yesterday_date.getMonth() ) + "/" + yesterday_date.getDate()
      }
      if(this.transitionSum == 0){
        this.chartDataSelect.map(d => {
         this.transitionSum += d.transition
        })
      }
      if(this.transitionPreSum == 0){
        this.chartDataSelect.map(d => {
		 this.transitionPreSum += d.transitionPre
        })
      }
      if(this.cumulativeSum == 0){
        this.chartDataSelect.map(d => {
		 this.cumulativeSum += d.cumulative
        })
      }
    },
    setDisplayData() {
      if (this.dataKind === 'transition') {
        return {
          labels: this.chartDataSelect.map(d => {
            return d.label
          }),
          datasets: [
            {
              label: this.dataKind,
              data: this.chartDataSelect.map(d => {
                return d.transition
              }),
              backgroundColor: '#4A7BBA',
              borderWidth: 0
            }
          ]
        }
      }
      return {
        labels: this.chartDataSelect.map(d => {
          return d.label
        }),
        datasets: [
          {
            label: this.dataKind,
            data: this.chartDataSelect.map(d => {
              return d.cumulative
            }),
            backgroundColor: '#4A7BBA',
            borderWidth: 0
          }
        ]
      }
    },
    setDisplayOption(cardWidth) {
      const unit = this.unit
      let fontSizeNum, fontStyleNum
      fontSizeNum = 9
      fontStyleNum = 'normal'
      if (cardWidth > 360 && this.areaNum === 0) {
        fontSizeNum = 11
        fontStyleNum = 'bold'
      } 
	  
      return {
        tooltips: {
          displayColors: false,
          callbacks: {
            label(tooltipItem) {
              const labelText =
                parseInt(tooltipItem.value).toLocaleString() + unit
              return labelText
            },
            title(tooltipItem, data) {
              return data.labels[tooltipItem[0].index]
                .replace(/(\w+)\/(\w+)/, '$1月$2日')
                .replace(/※/g, '')
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        onResize(chart, size) {
          if (size.width > 320) {
            chart.options.scales.xAxes[0].ticks.fontSize = 11
            chart.options.scales.xAxes[0].ticks.fontStyle = 'bold'
          } else {
            chart.options.scales.xAxes[0].ticks.fontSize = 9
            chart.options.scales.xAxes[0].ticks.fontStyle = 'normal'
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              id: 'day',
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: fontSizeNum,
                maxTicksLimit: 20,
                fontColor: '#808080',
                fontStyle: fontStyleNum,
                maxRotation: 0,
                minRotation: 0,
                callback: label => {
                  if (label.includes('/')) {
                    return label.split('/')[1]
                  } else {
                    return label
                  }
                }
              }
            },
            {
              id: 'month',
              stacked: true,
              gridLines: {
                drawOnChartArea: false,
                drawTicks: true,
                drawBorder: false,
                tickMarkLength: 10
              },
              ticks: {
                fontSize: 11,
                fontColor: '#808080',
                padding: 3,
                fontStyle: 'bold',
                gridLines: {
                  display: true
                },
                callback: label => {
                  const monthStringArry = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                  ]
                  const month = monthStringArry.indexOf(label.split(' ')[0]) + 1
                  return month + '月'
                }
              },
              type: 'time',
              time: {
                unit: 'month'
              }
            }
          ],
          yAxes: [
            {
              location: 'bottom',
              stacked: true,
              gridLines: {
                display: true,
                color: '#E5E5E5'
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080'
              }
            }
          ]
        }
      }
    }
  },
  watch: {
    dataKind() {
      this.displayData = this.setDisplayData()
    },
    areaNum: function (val) {
	  console.log(val)
	  this.dataKind = 'transition'
	  this.chartDataSelect = []
	  this.transitionSum = 0
	  this.transitionPreSum = 0
	  this.transitionPreSum = 0
	  if(val === 0) {
	   this.chartData.forEach(d => {
        this.chartDataSelect.push(d)
       })
	  } else if(val > 0) {
	   this.chartData[val - 1]["DataArr"].forEach(d => {
        this.chartDataSelect.push(d)
       })
	  }
	  this.setAreaData()
	  
	  this.displayData = this.setDisplayData()
	  this.displayOption = this.setDisplayOption()
    }
  }
}
</script>
