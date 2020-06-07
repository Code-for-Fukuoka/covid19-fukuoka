<template>
  <data-view :title="title" :title-id="titleId" :date="date" :url="url">
    <template v-slot:kindButton>
      <data-selector v-model="dataKind" />
    </template>
    <template v-slot:selectDate>
      <v-switch
        v-model="switch1"
        label="表示期間を指定する"
        color="secondary"
        value="primary"
        hide-details
      />
      <div v-show="switch1">
        <date-select-slider
          :arr-type="arrKind"
          :chart-data="labels"
          :value="[sliderMin, sliderMax]"
          :slider-min="sliderMin"
          :slider-max="sliderMax"
          @sliderInput="sliderUpdate"
        />
      </div>
    </template>
    <bar
      :chart-id="chartId"
      :chart-data="displayData"
      :options="options"
      :height="300"
    />
    <template v-slot:infoPanel>
      <data-view-basic-info-panel
        :data-kind="dataKind"
        :a-text="displayInfo.aText"
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <template v-slot:annotation>
      <small>※&nbsp;福岡県は福岡市、北九州市以外の自治体の合計</small>
      <small>※&nbsp;それ以外は居住地が調査中、県外在住、海外の陽性患者</small>
      <small>※&nbsp;自治体のラベルをクリックすることで特定の自治体のグラフを非表示にできます</small>
    </template>
  </data-view>
</template>

<style></style>

<script>
import DataView from '@/components/DataView.vue'
import DataSelector from '@/components/DataSelector.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'
import DateSelectSlider from '@/components/DateSelectSlider.vue'
import makeRecentData from '@/utils/makeRecentData'

export default {
  components: {
    DataView,
    DataSelector,
    DataViewBasicInfoPanel,
    DateSelectSlider
  },
  props: {
    title: {
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
      default: 'time-bar-chart-patients'
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
    items: {
      type: Array,
      required: false,
      default: () => []
    },
    labels: {
      type: Array,
      required: false,
      default: () => []
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
    }
  },
  data() {
    return {
      chartDataSelect: [],
      displayNumArr: [],
      arrKind: 'multi',
      dataKind: 'transition',
      switch1: false,
      graphRange: [0, 1],
      displayWidth: 'normal'
    }
  },
  computed: {
    sliderMin() {
      if (!this.labels || this.labels.length === 0) {
        return 1
      }
      const graphData = {
        date: this.date,
        graphData: this.labels
      }
      const twoMonthAgo = makeRecentData(graphData)
      return twoMonthAgo
    },
    sliderMax() {
      if (!this.labels || this.labels.length === 0) {
        return 1
      }
      this.sliderUpdate([this.sliderMin, this.labels.length - 1])
      return this.labels.length - 1
    },
    transitionSum() {
      let totalNum = 0
      this.chartDataSelect.forEach((d, index) => {
        if (this.displayNumArr.includes(index)) {
          totalNum += d[this.graphRange[1]]
        }
      })
      return totalNum
    },
    cumulativeSum() {
      let totalNum = 0
      this.chartDataSelect.forEach((d, index) => {
        if (this.displayNumArr.includes(index)) {
          for (let i = 0; i <= this.graphRange[1]; i++) {
            totalNum += d[i]
          }
        }
      })
      return totalNum
    },
    displayCumulativeRatio() {
      let lastDay = 0
      let lastDayNum = 0
      let lastDayBefore = 0
      this.chartDataSelect.forEach((d, index) => {
        if (this.displayNumArr.includes(index)) {
          for (let i = 0; i <= this.graphRange[1]; i++) {
            lastDay += d[i]
          }
          lastDayNum += d[this.graphRange[1]]
        }
      })
      lastDayBefore = lastDay - lastDayNum
      return this.formatDayBeforeRatio(lastDay - lastDayBefore)
    },
    displayTransitionRatio() {
      let lastDay = 0
      let lastDayBefore = 0
      this.chartDataSelect.forEach((d, index) => {
        if (this.displayNumArr.includes(index)) {
          lastDay += d[this.graphRange[1]]
          lastDayBefore += d[this.graphRange[1] - 1]
        }
      })
      return this.formatDayBeforeRatio(lastDay - lastDayBefore)
    },
    displayInfo() {
      if (this.dataKind === 'transition') {
        return {
          aText: '新規感染者 :',
          lText: this.transitionSum.toLocaleString(),
          sText: `${this.labels[this.graphRange[1]]} 実績値（前日比：${
            this.displayTransitionRatio
          } ${this.unit}）`,
          unit: this.unit
        }
      }
      return {
        aText: '累計感染者 :',
        lText: this.cumulativeSum.toLocaleString(),
        sText: `${this.labels[0]} - ${
          this.labels[this.graphRange[1]]
        } 累計値（前日比：${this.displayCumulativeRatio} ${this.unit}）`,
        unit: this.unit
      }
    },
    displayData() {
      const colorArray = ['#80caff', '#95e7ec', '#0e98da', '#8fc1e3']
      const displayLabel = []
      for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
        displayLabel.push(this.labels[i])
      }
      if (this.dataKind === 'transition') {
        return {
          labels: displayLabel,
          datasets: this.chartDataSelect.map((item, index) => {
            const displayArr = []
            for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
              displayArr.push(item[i])
            }
            let show
            if (this.displayNumArr.includes(index)) {
              show = false
            } else {
              show = true
            }
            return {
              label: this.items[index],
              data: displayArr,
              hidden: show,
              backgroundColor: colorArray[index],
              borderWidth: 0
            }
          })
        }
      }
      return {
        labels: displayLabel,
        datasets: this.chartDataSelect.map((item, index) => {
          const allItemsArr = this.cumulative(item)
          const displayArr = []
          for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
            displayArr.push(allItemsArr[i])
          }
          let show
          if (this.displayNumArr.includes(index)) {
            show = false
          } else {
            show = true
          }
          return {
            label: this.items[index],
            data: displayArr,
            hidden: show,
            backgroundColor: colorArray[index],
            borderWidth: 0
          }
        })
      }
    },
    options() {
      const self = this
      const unit = this.unit
      const data = this.chartDataSelect
      const labels = this.labels
      const displayNumArr = this.displayNumArr
      const dataKind = this.dataKind
      const newLegendClickHandler = function(e, legendItem) {
        const index = legendItem.datasetIndex
        const ci = this.chart
        const meta = ci.getDatasetMeta(index)
        meta.hidden =
          meta.hidden === null ? !ci.data.datasets[index].hidden : null
        ci.update()

        const arrIndex = self.displayNumArr.indexOf(index)
        if (!legendItem.hidden) {
          if (arrIndex >= 0) {
            self.displayNumArr.splice(arrIndex, 1)
          }
        } else {
          if (arrIndex === -1) {
            self.displayNumArr.push(index)
          }
          if (self.displayNumArr.length > 0) {
            self.displayNumArr.sort(function(a, b) {
              if (a < b) return -1
              if (a > b) return 1
              return 0
            })
          }
        }
      }

      let maxLimitNum = 20
      if (this.displayWidth === 'sp') {
        maxLimitNum = 10
      }

      const areaName = {
        0: '福岡市',
        1: '北九州市',
        2: '福岡県',
        3: 'それ以外'
      }

      return {
        tooltips: {
          displayColors: false,
          callbacks: {
            title(tooltipItem, data) {
              return data.labels[tooltipItem[0].index].replace(
                /(\w+)\/(\w+)/,
                '$1月$2日'
              )
            },
            label: tooltipItem => {
              let totalNum = 0
              let beforeTxt = ''
              const labelIndex = labels.indexOf(tooltipItem.label)
              displayNumArr.forEach(item => {
                let ItemsArr = []
                if (dataKind === 'transition') {
                  ItemsArr = data[item]
                } else {
                  ItemsArr = this.cumulative(data[item])
                }
                if (ItemsArr[labelIndex] > 0) {
                  totalNum += ItemsArr[labelIndex]
                }
                if (displayNumArr.length > 1) {
                  beforeTxt = '合計 : '
                }
              })
              return beforeTxt + totalNum + '人'
            },
            afterLabel: tooltipItem => {
              const returnArr = []
              const labelIndex = labels.indexOf(tooltipItem.label)
              displayNumArr.forEach(item => {
                let ItemsArr = []
                if (dataKind === 'transition') {
                  ItemsArr = data[item]
                } else {
                  ItemsArr = this.cumulative(data[item])
                }

                const txt = areaName[item] + ' : ' + ItemsArr[labelIndex] + unit
                returnArr.push(txt)
              })
              if (returnArr.length > 1) {
                return returnArr
              } else {
                return false
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        onResize(chart, size) {
          if (size.width > 350) {
            self.displayWidth = 'normal'
            chart.options.scales.xAxes[0].ticks.maxTicksLimit = 20
          } else {
            self.displayWidth = 'sp'
            chart.options.scales.xAxes[0].ticks.maxTicksLimit = 10
          }
        },
        legend: {
          display: true,
          onClick: newLegendClickHandler
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
                fontSize: 9,
                maxTicksLimit: maxLimitNum,
                fontColor: '#808080',
                maxRotation: 0,
                minRotation: 0,
                callback: label => {
                  return label.split('/')[1]
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
                unit: 'month',
                parser: 'M/D',
                displayFormats: {
                  month: 'MMM'
                }
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
  created() {
    this.chartData.forEach((d, index) => {
      this.chartDataSelect.push(d)
      this.displayNumArr.push(index)
    })
  },
  mounted() {
    const cardWidthNum = this.$el.clientWidth
    if (cardWidthNum < 350) {
      this.displayWidth = 'sp'
    }
  },
  methods: {
    sliderUpdate(sliderValue) {
      this.graphRange = sliderValue
    },
    cumulative(array) {
      const cumulativeArray = []
      let patSum = 0
      array.forEach(d => {
        patSum += d
        cumulativeArray.push(patSum)
      })
      return cumulativeArray
    },
    sum(array) {
      return array.reduce((acc, cur) => {
        return acc + cur
      })
    },
    pickLastNumber(chartDataArray) {
      return chartDataArray.map(array => {
        return array[array.length - 1]
      })
    },
    eachArraySum(chartDataArray) {
      const sumArray = []
      for (let i = 0; i < chartDataArray[0].length; i++) {
        sumArray.push(
          chartDataArray[0][i] +
            chartDataArray[1][i] +
            chartDataArray[2][i] +
            chartDataArray[3][i]
        )
      }
      const selectSumArray = sumArray.slice(
        this.graphRange[0],
        this.graphRange[1] + 1
      )
      return selectSumArray
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.Graph-Desc {
  margin: 10px 0;
  font-size: 12px;
  color: $gray-3;
}
</style>
