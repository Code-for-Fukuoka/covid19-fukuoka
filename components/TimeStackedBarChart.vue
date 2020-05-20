<template>
  <data-view :title="title" :title-id="titleId" :date="date" :url="url">
    <template v-slot:button>
      <data-selector v-model="dataKind" />
    </template>
    <bar
      :chart-id="chartId"
      :chart-data="displayData"
      :options="options"
      :height="240"
    />
    <template v-slot:infoPanel>
      <data-view-basic-info-panel
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <small>※ 福岡県は福岡市、北九州市以外の自治体の合計</br>
           ※ 自治体のラベルをクリックすることで特定の自治体のグラフを非表示にできます</br>
           ※ 民間検査実施分を含まない</small>
  </data-view>
</template>

<style>
small.annotation {
  padding-left: 28px;
}
</style>

<script>
import DataView from '@/components/DataView.vue'
import DataSelector from '@/components/DataSelector.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'

export default {
  components: { DataView, DataSelector, DataViewBasicInfoPanel },
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
      default: 'time-stacked-bar-chart'
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
      dataKind: 'transition',
      hiddenDataSum: [],  // 各区域毎に可視化しないデータの合計値を計算し、格納するための配列
      cumulativeData: []  // 各区域毎に可視化するデータの累積データを格納するための配列（二次元配列）
    }
  },
  created () {
    
    // 最新の日付から2ヶ月前の日付を mm/dd の文字列で取得（05/18 => 03/18）
    const TwoMonthsAgo = (() => {
      let tmpDate = new Date(this.date)
      tmpDate.setMonth(tmpDate.getMonth() - 2)
      const m = ('00' + (tmpDate.getMonth() + 1)).slice(-2)
      const d = ('00' + tmpDate.getDate()).slice(-2)
      return m + '/' + d
    })()
    // 可視化する最初（最古）のデータが入っているインデックスを取得
    // 例：最新の日付が05/18 => 03/19のデータが入っているインデックスを取得
    const startIndex = this.labels.findIndex(dateStr => {
      return dateStr > TwoMonthsAgo
    })
    
    // 可視化しないラベルを削除
    this.labels.splice(0, startIndex)
    // 区域の毎にループ
    for (const i in this.chartData) {
      // 可視化しないデータを削除しつつ、可視化しないデータの累計値を計算
      this.hiddenDataSum.push(this.sum(this.chartData[i].splice(0, startIndex)))
      // 累積データを計算
      this.cumulativeData.push(this.cumulative(this.chartData[i], i))
    }
  },
  computed: {
    displayInfo() {
      if (this.dataKind === 'transition') {
        return {
          lText: this.sum(this.pickLastNumber(this.chartData)).toLocaleString(),
          sText: `${this.labels[this.labels.length - 1]} の合計`,
          unit: this.unit
        }
      }
      return {
        lText: this.sum(this.pickLastNumber(this.cumulativeData)).toLocaleString(),
        sText: `${this.labels[this.labels.length - 1]} の全体累計`,
        unit: this.unit
      }
    },
    displayData() {
      const colorArray = ['#325685', '#81A3CF', '#B8CBE4']
      if (this.dataKind === 'transition') {
        return {
          labels: this.labels,
          datasets: this.chartData.map((item, index) => {
            return {
              label: this.items[index],
              data: item,
              backgroundColor: colorArray[index],
              borderWidth: 0
            }
          })
        }
      }
      return {
        labels: this.labels,
        datasets: this.cumulativeData.map((item, index) => {
          return {
            label: this.items[index],
            data: item,
            backgroundColor: colorArray[index],
            borderWidth: 0
          }
        })
      }
    },
    options() {
      const unit = this.unit
      const sumArray = this.eachArraySum(this.chartData)
      const data = this.chartData
      const cumulativeSumArray = this.eachArraySum(this.cumulativeData)
      return {
        tooltips: {
          displayColors: false,
          callbacks: {
            label: tooltipItem => {
              const labelText =
                this.dataKind === 'transition'
                  ? `${sumArray[tooltipItem.index]}${unit}（福岡市: ${data[0][tooltipItem.index]}/北九州市: ${data[1][tooltipItem.index]}/福岡県※: ${data[2][tooltipItem.index]}）`
                  : `${cumulativeSumArray[tooltipItem.index]}${unit}（福岡市: ${this.cumulativeData[0][tooltipItem.index]}/北九州市: ${this.cumulativeData[1][tooltipItem.index]}/福岡県※: ${this.cumulativeData[2][tooltipItem.index]}）`
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
          display: true
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
  methods: {
    cumulative(array, index) {
      const cumulativeArray = []
      let patSum = this.hiddenDataSum[index]
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
    cumulativeSum(chartDataArray) {
      return chartDataArray.map(array => {
        return array.reduce((acc, cur) => {
          return acc + cur
        })
      })
    },
    eachArraySum(chartDataArray) {
      const sumArray = []
      for (let i = 0; i < chartDataArray[0].length; i++) {
        sumArray.push(chartDataArray[0][i] + chartDataArray[1][i] + chartDataArray[2][i])
      }
      return sumArray
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
