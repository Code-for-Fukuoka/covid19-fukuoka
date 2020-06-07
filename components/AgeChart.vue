<template>
  <data-view
    :title="title"
    :category="category"
    :title-id="titleId"
    :date="date"
    :url="url"
  >
    <template v-slot:areaButton>
      <area-selector v-model="areaNum" />
    </template>
    <bar
      :chart-id="chartId"
      :chart-data="displayData"
      :options="displayOption"
      :height="300"
    />
    <template v-slot:infoPanel>
      <data-view-basic-info-panel
        :l-text="displayInfo.lText"
        :s-text="displayInfo.sText"
        :unit="displayInfo.unit"
      />
    </template>
    <template v-slot:annotation>
      <small>※&nbsp;福岡県は福岡市、北九州市以外の自治体の合計</small>
      <small>※&nbsp;それ以外は居住地が調査中、県外在住、海外の陽性患者</small>
      <small>※&nbsp;性別のラベルをクリックすることで選択した性別のグラフを非表示にできます</small>
    </template>
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
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'

export default {
  components: { DataView, AreaSelector, DataViewBasicInfoPanel },
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
      default: () => ['すべて']
    },
    SelectorType: {
      type: Object,
      required: false,
      default: () => ({
        datakind: false,
        area: true
      })
    }
  },
  data() {
    return {
      update: String,
      areaNum: 0,
      chartDataSelect: [],
	  displayWidth: 'normal'
    }
  },
  mounted() {
    const cardWidthNum = this.$el.clientWidth
    if (cardWidthNum < 350) {
      this.displayWidth = 'sp'
    }
  },
  computed: {
    displayInfo() {
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
      const cumulative = this.chartData[this.areaNum].cumulative
      const lTextTxt = cumulative.toLocaleString()
      const sTextTxt = `${this.update}の累計 `
      return {
        lText: lTextTxt,
        sText: sTextTxt,
        unit: this.unit
      }
    },
    displayData() {
      return {
        labels: this.chartDataSelect.map(d => {
          return d.label
        }),
        datasets: [
          {
            label: '男性',
            data: this.chartDataSelect.map(d => {
              return d.male
            }),
            backgroundColor: '#51acc4',
            borderWidth: 0
          },
          {
            label: '女性',
            data: this.chartDataSelect.map(d => {
              return d.female
            }),
            backgroundColor: '#bdd38f',
            borderWidth: 0
          }
        ]
      }
    },
    displayOption() {
	　const self = this
      const unit = this.unit
      let fontsize = 9
      if (this.displayWidth === 'sp') {
        fontsize = 7
      }
	  
      return {
        tooltips: {
		  mode: 'index',
          displayColors: false,
          callbacks: {
            title(tooltipItem, data) {
              return data.labels[tooltipItem[0].index]
            },
			beforeBody(tooltipItem, data) {
			  if(tooltipItem.length > 1) {
			    let totalNum = Number(tooltipItem[0].value) + Number(tooltipItem[1].value)
			    return "合計 : " + totalNum + "人"
			  } else {
			    return false
			  }
			},
			label() {
			  return false
			},
            afterBody(tooltipItem, data)  {
			　if(tooltipItem.length > 1) {
			   let returnArr = []
			   tooltipItem.forEach((d, index) => {
			     if(index === 0) {
				   returnArr.push("男性 : " + d.value + "人")
				 } else {
				   returnArr.push("女性 : " + d.value + "人")
				 }
			   })
			   return returnArr
			 } else {
			   return Number(tooltipItem[0].value) + "人"
			 }
			  
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        onResize(chart, size) {
          if (size.width > 350) {
            self.displayWidth = 'normal'
            chart.options.scales.xAxes[0].ticks.fontSize = 9
          } else {
            self.displayWidth = 'sp'
            chart.options.scales.xAxes[0].ticks.fontSize = 7
          }
        },
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              id: 'age',
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: fontsize,
                maxTicksLimit: 9,
                fontColor: '#808080',
                fontStyle: 'bold',
                maxRotation: 0,
                minRotation: 0,
                callback: label => {
                  return label
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
                maxTicksLimit: 10,
                fontColor: '#808080'
              }
            }
          ]
        },
        layout: {
          padding: {
            top: 0,
            bottom: 0
          }
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
      this.lText = this.chartData[val].cumulative
      this.sText = this.chartData[val].update + 'の累計'
    }
  },
  created() {
    this.chartData.forEach(d => {
      this.AreaData.push(d.label.replace(/※/g, ''))
    })
    this.chartData[this.areaNum].DataArr.forEach(d => {
      this.chartDataSelect.push(d)
    })
    this.lText = this.chartData[this.areaNum].cumulative
    this.sText = this.chartData[this.areaNum].update + 'の累計'
  }
}
</script>
