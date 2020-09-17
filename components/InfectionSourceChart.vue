<template>
  <data-view
    :title="title"
    :category="category"
    :title-id="titleId"
    :date="date"
    :url="url"
  >
    <template v-slot:kindButton>
      <data-selector v-model="dataKind" />
    </template>
    <template v-slot:areaButton>
      <area-selector v-model="areaNum" />
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
        :num-type="'percent'"
        :a-text="displayInfo.aText"
        :l-text="displayInfo.lText"
        :r-text="displayInfo.rText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <template v-slot:annotation>
      <small>※&nbsp;福岡県は福岡市、北九州市以外の自治体の合計</small>
      <small>※&nbsp;それ以外は居住地が調査中、県外在住、海外の陽性患者</small>
      <small>
        ※&nbsp;感染経路のラベルをクリックすることで特定のグラフを非表示にできます
      </small>
      <small>※&nbsp;データは、後日修正されることがあります。</small>
    </template>
  </data-view>
</template>

<style></style>

<script>
import DataView from '@/components/DataView.vue'
import DataSelector from '@/components/DataSelector.vue'
import AreaSelector from '@/components/AreaSelector.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'
import DateSelectSlider from '@/components/DateSelectSlider.vue'
import makeRecentData from '@/utils/makeRecentData'

export default {
  components: {
    DataView,
    DataSelector,
    AreaSelector,
    DataViewBasicInfoPanel,
    DateSelectSlider
  },
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
      default: 'infection-source-chart-patients'
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
      unKnownRateNum: [0, 0],
      displayNumArr: [],
      arrKind: 'multi',
      areaNum: 0,
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
    averageRate() {
      if (this.graphRange[1] === 1) {
        return 0
      }
      if (this.unKnownRateNum[0] === 0) {
        return 0
      }
      const num = (this.unKnownRateNum[0] / this.unKnownRateNum[1]) * 100
      const rate = Math.floor(num * 10) / 10
      return rate
    },
    displayInfo() {
      const moment = require('moment')
      const changeLabel = labels => {
        if (labels === undefined) {
          return false
        }
        const date = labels.slice(0, 2) + '-' + labels.slice(3, 5)
        return moment(date).format('M月D日')
      }

      let rateTxt = ''
      if (this.unKnownRateNum[0] > 0) {
        rateTxt =
          ' (' +
          this.unKnownRateNum[0] +
          '人 / ' +
          this.unKnownRateNum[1] +
          '人' +
          ')'
      }

      if (this.dataKind === 'transition') {
        return {
          aText: '感染経路不明者の割合 :',
          lText: this.averageRate.toLocaleString(),
          rText: rateTxt,
          sText: `直近7日間 (${changeLabel(
            this.labels[this.graphRange[1] - 6]
          )} - ${changeLabel(this.labels[this.graphRange[1]])})の移動平均`,
          unit: this.unit
        }
      }
      return {
        aText: '感染経路不明者の割合 :',
        lText: this.averageRate.toLocaleString(),
        rText: rateTxt,
        sText: `${changeLabel(this.labels[0])} - ${changeLabel(
          this.labels[this.graphRange[1]]
        )} の移動平均`,
        unit: this.unit
      }
    },
    displayData() {
      const displayLabel = []
      for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
        displayLabel.push(this.labels[i])
      }
      const displayArr = [[], [], []]
      const showArr = []
      this.chartDataSelect.map((item, index) => {
        if (this.graphRange[1] === 1) {
          return false
        }
        if (this.dataKind === 'transition') {
          for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
            displayArr[index].push(item[i])
            if (i >= this.graphRange[1] - 6 && i <= this.graphRange[1]) {
              if (index === 1) {
                this.unKnownRateNum[0] += item[i]
              }
              this.unKnownRateNum[1] += item[i]
            }
          }
        } else {
          const allItemsArr = this.cumulative(item)
          for (let i = this.graphRange[0]; i <= this.graphRange[1]; i++) {
            displayArr[index].push(allItemsArr[i])
            if (i === this.graphRange[1]) {
              if (index === 1) {
                this.unKnownRateNum[0] += allItemsArr[i]
              }
              this.unKnownRateNum[1] += allItemsArr[i]
            }
          }
        }
        if (this.displayNumArr.includes(index)) {
          showArr.push(false)
        } else {
          showArr.push(true)
        }
      })

      return {
        labels: displayLabel,
        datasets: [
          {
            label: this.items[0],
            data: displayArr[0],
            hidden: showArr[0],
            backgroundColor: '#146cca',
            borderWidth: 0
          },
          {
            label: this.items[1],
            data: displayArr[1],
            hidden: showArr[1],
            backgroundColor: '#cdb3ff',
            borderWidth: 0,
            order: 3
          },
          {
            label: this.items[2],
            data: displayArr[2],
            hidden: showArr[2],
            backgroundColor: '#334863',
            borderWidth: 0,
            order: 4
          }
        ]
      }
    },
    options() {
      const self = this
      const unit = '人'
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
        0: '濃厚接触者',
        1: '感染経路不明',
        2: '海外渡航歴有'
      }

      let totalNum

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
              totalNum = 0
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

                const num = (ItemsArr[labelIndex] / totalNum) * 100
                const percent = Math.floor(num * 10) / 10

                let txt
                if (
                  ItemsArr[labelIndex] !== totalNum &&
                  ItemsArr[labelIndex] > 0
                ) {
                  txt =
                    areaName[item] +
                    ' : ' +
                    ItemsArr[labelIndex] +
                    unit +
                    ' (' +
                    percent +
                    '%)'
                } else {
                  txt = areaName[item] + ' : ' + ItemsArr[labelIndex] + unit
                }
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
  watch: {
    areaNum(val) {
      this.chartDataSelect = []
      this.chartDataSelect = [
        this.chartData[val]['濃厚接触者'],
        this.chartData[val]['感染経路不明'],
        this.chartData[val]['海外渡航歴有']
      ]
      this.unKnownRateNum = [0, 0]
    },
    dataKind() {
      this.unKnownRateNum = [0, 0]
    }
  },
  created() {
    this.chartDataSelect = [
      this.chartData[0]['濃厚接触者'],
      this.chartData[0]['感染経路不明'],
      this.chartData[0]['海外渡航歴有']
    ]
    this.displayNumArr = [0, 1, 2]
  },
  mounted() {
    const cardWidthNum = this.$el.clientWidth
    if (cardWidthNum < 350) {
      this.displayWidth = 'sp'
    }
  },
  methods: {
    sliderUpdate(sliderValue) {
      this.unKnownRateNum = [0, 0]
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
