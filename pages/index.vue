<template>
  <div class="MainPage">
    <page-header
      :icon="headerItem.icon"
      :title="headerItem.title"
      :date="headerItem.date"
    />
    <whats-new class="mb-4" :items="newsItems" />
    <static-info
      class="mb-4"
      :url="'/flow'"
      :text="'自分や家族の症状に不安や心配があればまずは電話でご相談下さい'"
      :btn-text="'相談の手順を見る'"
    />
    <v-row class="DataBlock">
      <v-col cols="12" md="6" class="DataCard">
        <svg-card
          title="検査陽性者の状況"
          :title-id="'details-of-confirmed-cases'"
          :date="Data.inspections_summary.date"
        >
          <confirmed-cases-table v-bind="confirmedCases" />
        </svg-card>
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <time-bar-patients-chart
          title="陽性患者数"
          :title-id="'number-of-confirmed-cases'"
          :chart-id="'time-bar-chart-patients'"
          :chart-data="patientsGraph"
          :date="Data.patients.date"
          :items="patientsItems"
          :labels="patientsLabels"
          :unit="'人'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <infection-source-chart
          title="陽性患者数"
          category="感染経路別"
          :title-id="'type-of-infection-cases'"
          :chart-id="'infection-source-chart-patients'"
          :chart-data="infectionTypeGraph"
          :date="Data.patients.date"
          :items="infectionTypeItems"
          :labels="infectionTypeLabels"
          :unit="'%'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <area-chart
          title="陽性患者数の累計"
          category="居住地別"
          :title-id="'area-of-confirmed-cases'"
          :chart-id="'area-chart-patients'"
          :chart-data="areaGraph"
          :date="Data.patients.date"
          :unit="'人'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <age-chart
          title="陽性患者数の累計"
          category="年代・性別"
          :title-id="'age-of-confirmed-cases'"
          :chart-id="'age-chart-patients'"
          :chart-data="ageGraph"
          :date="Data.patients.date"
          :unit="'人'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <data-table
          :title="'陽性患者の属性'"
          :title-id="'attributes-of-confirmed-cases'"
          :chart-data="patientsTable"
          :chart-option="{}"
          :date="Data.patients.date"
          :info="sumInfoOfPatients"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <time-stacked-bar-chart
          title="検査実施数"
          :title-id="'number-of-tested'"
          :chart-id="'time-stacked-bar-chart-inspections'"
          :chart-data="inspectionsGraph"
          :date="Data.inspections_summary.date"
          :items="inspectionsItems"
          :labels="inspectionsLabels"
          :unit="'件'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_exam'
          "
        />
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <time-bar-chart
          title="新型コロナウイルス感染症 帰国者・接触者相談センター相談件数"
          :title-id="'number-of-reports-to-covid19-consultation-desk'"
          :chart-id="'time-bar-chart-querents'"
          :chart-data="querentsGraph"
          :date="Data.querents.date"
          :unit="'件'"
          :url="
            'https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_kikokusyasessyokusya'
          "
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import TimeBarChart from '@/components/TimeBarChart.vue'
import TimeBarPatientsChart from '@/components/TimeBarPatientsChart.vue'
import InfectionSourceChart from '@/components/InfectionSourceChart.vue'
import AreaChart from '@/components/AreaChart.vue'
import AgeChart from '@/components/AgeChart.vue'
import MetroBarChart from '@/components/MetroBarChart.vue'
import TimeStackedBarChart from '@/components/TimeStackedBarChart.vue'
import WhatsNew from '@/components/WhatsNew.vue'
import StaticInfo from '@/components/StaticInfo.vue'
import Data from '@/data/data.json'
import MetroData from '@/data/metro.json'
import DataTable from '@/components/DataTable.vue'
import formatGraph from '@/utils/formatGraph'
import formatPatientsGraph from '@/utils/formatPatientsGraph'
import formatInfectionType from '@/utils/formatInfectionType'
import formatAreaGraph from '@/utils/formatAreaGraph'
import formatAgeGraph from '@/utils/formatAgeGraph'
import formatTable from '@/utils/formatTable'
import formatConfirmedCases from '@/utils/formatConfirmedCases'
import News from '@/data/news.json'
import SvgCard from '@/components/SvgCard.vue'
import ConfirmedCasesTable from '@/components/ConfirmedCasesTable.vue'

export default {
  components: {
    PageHeader,
    TimeBarChart,
    TimeBarPatientsChart,
    InfectionSourceChart,
    AreaChart,
    AgeChart,
    MetroBarChart,
    TimeStackedBarChart,
    WhatsNew,
    StaticInfo,
    DataTable,
    SvgCard,
    ConfirmedCasesTable
  },
  data() {
    // 感染者数グラフ
    const patientsData = formatPatientsGraph(Data.patients)
    const patientsGraph = [
      patientsData.data['福岡市'],
      patientsData.data['北九州市'],
      patientsData.data['福岡県※'],
      patientsData.data['それ以外※']
    ]
    const patientsItems = ['福岡市', '北九州市', '福岡県※', 'それ以外※']
    const patientsLabels = patientsData.labels
    // 感染者数グラフ（感染経路別）
    const infectionTypeData = formatInfectionType(Data.patients)
    const infectionTypeGraph = infectionTypeData.DataArr
    const infectionTypeItems = ['濃厚接触者', '感染経路不明', '海外渡航歴有']
    const infectionTypeLabels = infectionTypeData.labels
    // 感染者数グラフ（地区別）
    const areaGraph = formatAreaGraph(Data.patients.data)
    // 感染者数グラフ（年齢・性別）
    const ageGraph = formatAgeGraph(Data.patients.data)
    // 感染者数
    const patientsTable = formatTable(Data.patients.data)
    // 退院者グラフ
    const dischargesGraph = formatGraph(Data.discharges_summary.data)

    // 検査件数
    const testedGraph = formatGraph(Data.tested.data)
    // 相談件数
    const contactsGraph = formatGraph(Data.contacts.data)
    // 帰国者・接触者電話相談センター相談件数
    const querentsGraph = formatGraph(Data.querents.data)
    // 福岡県営地下鉄の利用者数の推移
    const metroGraph = MetroData
    // 検査実施日別状況
    const inspectionsGraph = [
      Data.inspections_summary.data['福岡市'],
      Data.inspections_summary.data['北九州市'],
      Data.inspections_summary.data['福岡県※']
    ]
    const inspectionsItems = ['福岡市', '北九州市', '福岡県※']
    const inspectionsLabels = Data.inspections_summary.labels
    // 死亡者数
    // #MEMO: 今後使う可能性あるので一時コメントアウト
    // const fatalitiesTable = formatTable(
    //   Data.patients.data.filter(patient => patient['備考'] === '死亡')
    // )
    // 検査陽性者の状況
    const confirmedCases = formatConfirmedCases(Data.main_summary)

    const PatientsInfo = Data.patients.data
    const moment = require('moment')

    const sumInfoOfPatients = {
      lText: PatientsInfo.length.toLocaleString(),
      sText:
        moment(PatientsInfo[PatientsInfo.length - 1]['リリース日']).format(
          'MM/DD'
        ) + 'の累計',
      unit: '人'
    }

    const data = {
      Data,
      patientsTable,
      patientsData,
      patientsGraph,
      patientsItems,
      patientsLabels,
      infectionTypeData,
      infectionTypeGraph,
      infectionTypeItems,
      infectionTypeLabels,
      areaGraph,
      ageGraph,
      dischargesGraph,
      testedGraph,
      contactsGraph,
      querentsGraph,
      metroGraph,
      inspectionsGraph,
      inspectionsItems,
      inspectionsLabels,
      confirmedCases,
      sumInfoOfPatients,
      headerItem: {
        icon: 'mdi-chart-timeline-variant',
        title: '福岡県内の感染動向',
        date: Data.lastUpdate
      },
      newsItems: News.newsItems,
      metroGraphOption: {
        responsive: true,
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              position: 'bottom',
              stacked: false,
              gridLines: {
                display: true
              },
              ticks: {
                fontSize: 10,
                maxTicksLimit: 20,
                fontColor: '#808080'
              }
            }
          ],
          yAxes: [
            {
              stacked: false,
              gridLines: {
                display: true
              },
              ticks: {
                fontSize: 12,
                maxTicksLimit: 10,
                fontColor: '#808080',
                callback(value) {
                  return value.toFixed(2) + '%'
                }
              }
            }
          ]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title(tooltipItems, _) {
              const label = tooltipItems[0].label
              return `期間: ${label}`
            },
            label(tooltipItem, data) {
              const currentData = data.datasets[tooltipItem.datasetIndex]
              const percentage = `${currentData.data[tooltipItem.index]}%`

              return `${metroGraph.base_period}の利用者数との相対値: ${percentage}`
            }
          }
        }
      }
    }
    return data
  },
  head() {
    return {
      title: '福岡県内の感染動向'
    }
  }
}
</script>

<style lang="scss" scoped>
.MainPage {
  .DataBlock {
    margin: 20px -8px;
    .DataCard {
      @include largerThan($medium) {
        padding: 10px;
      }
      @include lessThan($small) {
        padding: 4px 8px;
      }
    }
  }
}
</style>
