type patientsArr = {
  リリース日: Date
  曜日: number
  居住地: string
  年代: string
  性別: string
  退院: string
  感染経路: string
  date: Date
}

type DataType = {
  date: Date
  data: Array<patientsArr>
}

interface DataArrType {
  [key: string]: number[]
}

type GraphDataType = {
  DataArr: Array<DataArrType>
  labels: string[]
}

export default (data: DataType) => {
  const graphData: GraphDataType = {
    DataArr: [
      {
        濃厚接触者: [],
        感染経路不明: [],
        海外渡航歴有: []
      },
      {
        濃厚接触者: [],
        感染経路不明: [],
        海外渡航歴有: []
      },
      {
        濃厚接触者: [],
        感染経路不明: [],
        海外渡航歴有: []
      },
      {
        濃厚接触者: [],
        感染経路不明: [],
        海外渡航歴有: []
      },
      {
        濃厚接触者: [],
        感染経路不明: [],
        海外渡航歴有: []
      }
    ],
    labels: []
  }

  const moment = require('moment')
  const dateFirst = data.data[0]['リリース日']
  const dateLast = data.data.slice(-1)[0]['リリース日']
  const diff = moment(dateLast).diff(dateFirst)
  const duration = moment.duration(diff)
  const days = Math.floor(duration.asDays())

  const categoryArr = ['濃厚接触者', '感染経路不明', '海外渡航歴有']

  for (let i = 0; i <= days; i++) {
    const date = moment
      .utc(dateFirst)
      .add('days', i)
      .format()
    graphData.labels.push(moment(date).format('MM/DD'))
    const result = data.data.filter(data => data['リリース日'] === date)
    const countArr = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    if (result.length > 0) {
      result.forEach(d => {
        let areaIndex = 0
        switch (true) {
          case d['居住地'].includes('福岡市'):
            areaIndex = 1
            break
          case d['居住地'].includes('北九州市'):
            if (d['居住地'] === '北九州市外') {
              areaIndex = 4
            } else {
              areaIndex = 2
            }
            break
          default:
            if (d['居住地'] === '調査中' || d['居住地'] === '海外') {
              areaIndex = 4
            } else if (
              d['居住地'].includes('県') &&
              !d['居住地'].includes('福岡')
            ) {
              areaIndex = 3
            } else if (d['居住地'].includes('区')) {
              const areaArr = [
                '東区',
                '博多区',
                '中央区',
                '南区',
                '西区',
                '城南区',
                '早良区'
              ]
              const index = areaArr.indexOf(d['居住地'])
              if (index === -1) {
                areaIndex = 2
              } else {
                areaIndex = 1
              }
            } else if (d['居住地'].includes('確認中')) {
              areaIndex = 4
            } else {
              areaIndex = 3
            }
        }
        switch (true) {
          case d['感染経路'].includes('濃厚接触者'):
            countArr[0][0] += 1
            countArr[areaIndex][0] += 1
            break
          case d['感染経路'].includes('感染経路不明'):
            countArr[0][1] += 1
            countArr[areaIndex][1] += 1
            break
          case d['感染経路'].includes('海外渡航歴有'):
            countArr[0][2] += 1
            countArr[areaIndex][2] += 1
            break
          default:
        }
      })
    }

    countArr.forEach((d, index) => {
      const areaIndex = index
      d.forEach((e, index02) => {
        const category: keyof DataArrType = categoryArr[index02]
        graphData.DataArr[areaIndex][category].push(Number(e))
      })
    })
  }

  return graphData
}
