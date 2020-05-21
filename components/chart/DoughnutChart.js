import { Doughnut, mixins } from 'vue-chartjs'
import Chart from 'chart.js'
const { reactiveProp } = mixins

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.addPlugin({
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx
        chart.data.datasets.forEach(function(dataset, i) {
          let dataSum = 0
          dataset.data.forEach(element => {
            dataSum += element
          })
          const meta = chart.getDatasetMeta(i)
          if (!meta.hidden) {
            meta.data.forEach(function(element, index) {
              // フォントの設定
              let fontSize = 12
              let fontStyle = 'bold'
              const fontFamily = 'Helvetica Neue'
              ctx.fillStyle = '#4D4D4D'
              // 設定を適用
              ctx.font = Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              )

              // ラベルをパーセント表示に変更
              const labelString =
                chart.data.labels[index] +
                ': ' +
                dataset.data[index].toString() +
                ' 人'
              const dataString =
                Math.round((dataset.data[index] / dataSum) * 100).toString() +
                ' %'
              // positionの設定
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'

              const padding = -2
              const position = element.tooltipPosition()
              let adjustY = 0
              const adjustX = 0
              switch (true) {
                case index === 3:
                  adjustY = 80
                  break
              }

              // ツールチップに変更内容を表示
              ctx.fillText(
                labelString,
                position.x - adjustX,
                position.y - fontSize / 2 - padding - 5 - adjustY
              ) // title
              fontSize = 18
              fontStyle = 'bold'
              ctx.font = Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              )
              ctx.fillText(
                dataString,
                position.x,
                position.y + fontSize / 2 - padding - adjustY
              ) // データの百分率
            })
          }
        })
      }
    })
    this.renderChart(this.chartData, this.options)
  }
}
