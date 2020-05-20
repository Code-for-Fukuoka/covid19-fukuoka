<template>
  <data-view :title="title" :title-id="titleId" :date="date" :url="url">
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
        :data-kind="dataKind"
        :a-text="displayInfo.aText"
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <small class="annotation">※ 居住地が調査中、海外の陽性患者</small>
  </data-view>
</template>

<style>
small.annotation {
  padding-left: 28px;
  font-weight: 'bold';
}
</style>

<script>
import DataView from '@/components/DataView.vue'
import AreaSelector from '@/components/AreaSelector.vue'
import DataSelector from '@/components/DataSelector.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'

export default {
  components: { DataView, AreaSelector, DataSelector, DataViewBasicInfoPanel },
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
      default: () => ['すべて']
    }
  },
  data() {
    return {
      areaNum: 0,
      dataKind: 'transition',
      chartDataSelect: []
    }
  },
  computed: {
    displayCumulativeRatio() {
      const lastDay = this.chartDataSelect.slice(-1)[0].cumulative
      const lastDayBefore = this.chartDataSelect.slice(-2)[0].cumulative
      return this.formatDayBeforeRatio(lastDay - lastDayBefore)
    },
    displayTransitionRatio() {
      const lastDay = this.chartDataSelect.slice(-1)[0].transition
      const lastDayBefore = this.chartDataSelect.slice(-2)[0].transition
      return this.formatDayBeforeRatio(lastDay - lastDayBefore)
    },
    displayInfo() {
      if (this.dataKind === 'transition') {
        return {
          aText: '新規感染者 :',
          lText: `${this.chartDataSelect
            .slice(-1)[0]
            .transition.toLocaleString()}`,
          sText: `${this.chartDataSelect.slice(-1)[0].label} 実績値（前日比：${
            this.displayTransitionRatio
          } ${this.unit}）`,
          unit: this.unit
        }
      }
      return {
        aText: '累計感染者 :',
        lText: this.chartDataSelect[
          this.chartDataSelect.length - 1
        ].cumulative.toLocaleString(),
        sText: `${this.chartDataSelect.slice(-1)[0].label} 累計値（前日比：${
          this.displayCumulativeRatio
        } ${this.unit}）`,
        unit: this.unit
      }
    },
    displayData() {
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
    displayOption() {
      const unit = this.unit
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
              return data.labels[tooltipItem[0].index].replace(
                /(\w+)\/(\w+)/,
                '$1月$2日'
              )
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
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
                fontSize: 9,
                maxTicksLimit: 20,
                fontColor: '#808080',
                maxRotation: 0,
                minRotation: 0,
                callback: label => {
                  return label.split('/')[1]
                }
              }
            },
            {
              display: true,
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
    areaNum(val) {
      this.chartDataSelect = []
      this.chartData[val].DataArr.forEach(d => {
        this.chartDataSelect.push(d)
      })
    }
  },
  created() {
    this.chartData.forEach(d => {
      this.AreaData.push(d.label)
    })
    this.chartData[0].DataArr.forEach(d => {
      this.chartDataSelect.push(d)
    })
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
    }
  }
}
</script>
