<template>
  <data-view
    :title="title"
    :category="category"
    :title-id="titleId"
    :date="date"
    :url="url"
  >
    <doughnut-chart
      :chart-id="chartId"
      :chart-data="displayData"
      :options="displayOption"
      :height="340"
      class="adjustMargin"
    />
    <template v-slot:infoPanel>
      <data-view-basic-info-panel
        :num-type="'number'"
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <template v-slot:annotation>
      <small>※&nbsp;福岡県は福岡市、北九州市以外の自治体の合計</small>
      <small>※&nbsp;それ以外は居住地が調査中、県外在住、海外の陽性患者</small>
      <small>陽性患者と公表しておりました下記の症例については、関係自治体から
欠番とする旨の発表がありましたので、下記の番号を削除します。
・県1312例目（福岡市695例目）（7/29公表）
・県2248例目（福岡市1276例目）（8/4公表）
・県2250例目（福岡市1278例目）（8/4公表）</small>
    </template>
  </data-view>
</template>

<style>
.adjustMargin {
  margin-top: -15px;
}

#chartjs-tooltip {
  opacity: 1;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  font-size: 12px;
  color: white;
  border-radius: 3px;
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
  pointer-events: none;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}

#chartjs-tooltip .wrapper {
  display: flex;
  margin: 0;
  padding: 0;
}

#chartjs-tooltip ul {
  width: 90px;
  list-style: none;
  padding-left: 0px;
  text-align: right;
}

#chartjs-tooltip ul li {
  padding-left: 0px;
  font-weight: bold;
}

.chartjs-tooltip-key {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 10px;
}
</style>

<script>
import DataView from '@/components/DataView.vue'
import DoughnutChart from '@/components/chart/DoughnutChart.js'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'

export default {
  components: {
    DataView,
    DoughnutChart,
    DataViewBasicInfoPanel
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
    SelectorType: {
      type: Object,
      required: false,
      default: () => ({
        datakind: true,
        area: false
      })
    }
  },
  data() {
    return {
      update: String,
      displayData: {},
      displayOption: {}
    }
  },
  computed: {
    displayInfo() {
      let cumulativeSum = 0
      this.chartData.forEach(d => {
        cumulativeSum += d.cumulative
      })
      const lTextTxt = cumulativeSum.toLocaleString()
      const sTextTxt = `${this.update}の累計 `
      return {
        lText: lTextTxt,
        sText: sTextTxt,
        unit: this.unit
      }
    }
  },
  created() {
    this.settingAreaData()
  },
  mounted() {
    this.displayOption = this.setDisplayOption()
    this.displayData = this.setDisplayData()
  },
  methods: {
    settingAreaData() {
      if (this.update != null) {
        const date = new Date(this.date)
        const yesterdayDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 1
        )
        this.update =
          1 + yesterdayDate.getMonth() + '/' + yesterdayDate.getDate()
      }
    },
    setDisplayData() {
      return {
        labels: this.chartData.map(d => {
          return d.label
        }),
        datasets: [
          {
            label: 'AreaGraph',
            data: this.chartData.map(d => {
              return d.cumulative
            }),
            backgroundColor: ['#80CAFF', '#D9EFFF', '#C1E5FF', '#45c1f0'],
            borderColor: '#7f7f7f',
            borderWidth: 0.3
          }
        ]
      }
    },
    setDisplayOption() {
      const unit = this.unit
      const chartData = this.chartData
      return {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 20,
        tooltips: {
          enabled: false,
          custom(tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip')
            let adjustLeft = 0

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              this._chart.canvas.parentNode.appendChild(tooltipEl)
            }

            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            function getBody(bodyItem) {
              return bodyItem.lines
            }

            if (tooltipModel.body) {
              const bodyLines = tooltipModel.body.map(getBody)
              let index = bodyLines[0][0].indexOf(':')
              index = chartData.findIndex(
                v => v.label === bodyLines[0][0].slice(0, index)
              )
              const dataArr = chartData[index].areaArr

              const ulNum = Math.ceil(dataArr.length / 10)

              if (ulNum > 1) {
                adjustLeft = ulNum * 18
              }

              let innerHtml = "<div class='wrapper'>"

              let loopNum = 0
              let limitNum = 9
              for (let i = 0; i < ulNum; i++) {
                innerHtml += '<ul>'
                for (let j = loopNum; j < dataArr.length; j++) {
                  innerHtml +=
                    '<li>' +
                    dataArr[j].label +
                    ' : ' +
                    dataArr[j].cumulative +
                    unit +
                    '</li>'
                  if (j === limitNum) {
                    loopNum += 10
                    limitNum += 10
                    break
                  }
                }
                innerHtml += '</ul>'
              }

              innerHtml += '</div>'

              tooltipEl.innerHTML = innerHtml
            }

            const positionY = this._chart.canvas.offsetTop
            const positionX = this._chart.canvas.offsetLeft

            tooltipEl.style.opacity = 1
            tooltipEl.style.left =
              positionX + tooltipModel.caretX + adjustLeft + 'px'
            tooltipEl.style.top = positionY + 45 + 'px'
            tooltipEl.style.padding = 10 + 'px'
            tooltipEl.style.pointerEvents = 'none'
          }
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 40,
            left: 15,
            right: 15,
            bottom: 20
          }
        }
      }
    }
  }
}
</script>
