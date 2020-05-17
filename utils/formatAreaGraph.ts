type DataType = {
  リリース日: Date
  曜日: number
  居住地: string
  年代: string
  性別: string
  退院: string
  date: Date
}

interface DataArrType {
  label: string
  cumulative: number
}

type GraphDataType = {
  label: string
  cumulative: number
  areaArr: Array<DataArrType>
}

export default (data: DataType[]) => {
  const graphData: GraphDataType[] = [
    {
      label: '福岡市',
      cumulative: 0,
      areaArr: []
    },
    {
      label: '北九州市',
      cumulative: 0,
      areaArr: []
    },
    {
      label: '福岡県（その他）',
      cumulative: 0,
      areaArr: []
    },
    {
      label: 'それ以外※',
      cumulative: 0,
      areaArr: []
    }
  ]
  const latestDate = new Date(data.slice(-1)[0]['リリース日'])
  let date: Date
  data.forEach(d => {
    let address: string
    date = new Date(d['リリース日'])
    let AreaName: string
	let index: number
    let ArrIndex: number
    switch (true) {
      case d['居住地'].includes('福岡市'):
        address = '福岡市'
        if (d['居住地'].includes('区') && !d['居住地'].includes('県')) {
          AreaName = d['居住地'].replace(/福岡市/g, '')
        } else {
          AreaName = '福岡市内'
        }
	    index = 0
        break
      case d['居住地'].includes('北九州市'):
        address = '北九州市'
        if (d['居住地'].includes('区') && !d['居住地'].includes('県')) {
          AreaName = d['居住地'].replace(/北九州市/g, '')  
		  index = 1
        } else {
		  if(d['居住地'] === '北九州市外') {
            address = 'それ以外※'
            AreaName = "それ以外"
            index = 3
		  } else {
			AreaName = '北九州市内'
			index = 1
		  }
        }
        break
      default:
        if (d['居住地'] === '調査中' || d['居住地'] === '海外') {
          address = 'それ以外※'
		  if(d['居住地'] === "調査中") {
		    AreaName = "それ以外"
		  } else {
			AreaName = "海外"
		  }
          index = 3
        } else {
          if (!d['居住地'].includes('県') && !d['居住地'].includes('区')) {
			if(d['居住地'].includes('確認中')) {
			  address = 'それ以外※'
              AreaName = "それ以外"
              index = 3			
			} else {
			  address = '福岡県（その他）'
              AreaName = d['居住地']
              index = 2	
			}
          } else if(d['居住地'].includes('区')) {
		    let cityArr: string[] = ['東区','博多区','中央区','南区','西区','城南区','早良区']
		    let areaIndex = cityArr.indexOf( d['居住地'])
		    if(areaIndex === -1) {
			  AreaName = d['居住地']
			  index = 1						  
			} else {
			  AreaName = d['居住地']
			  index = 0						  
			}
		  } else {
            address = 'それ以外※'
            AreaName = d['居住地']
            index = 3
          }
        }
    }  
	ArrIndex = graphData[index].areaArr.findIndex(v => v.label === AreaName)
    graphData[index].cumulative += 1
    if (ArrIndex === -1) {
      graphData[index].areaArr.push({
        label: AreaName,
        cumulative: 1
      })
    } else {
      graphData[index].areaArr[ArrIndex].cumulative += 1
    }
  })
  
  let removeNum: string[] = []
  let ArrIndex: number
  graphData[3]["areaArr"].forEach((d,index) => {
    switch (true) {
      case d.label === 'それ以外':
        break
      case d.label === '海外':
        break			
      case d.label.replace(/福岡県/g, '').length === 0:
	    graphData[2].areaArr.push({
		  label: '福岡県内',
		  cumulative: d.cumulative
		})
		 graphData[2].cumulative += d.cumulative
		 graphData[3].cumulative -= d.cumulative
		 removeNum.push('福岡県内')
        break
      case !d.label.includes('福岡県'):
		if(d.label.includes('県')) {
		  ArrIndex = graphData[3]["areaArr"].findIndex(v => v.label === "それ以外")
		  graphData[3]["areaArr"][ArrIndex].cumulative  += d.cumulative
		  removeNum.push(d.label)
		} 
        break
      default: 
    }  
  })
  
  for (let i = 0; i < removeNum.length; i++) {
    let ArrIndex = graphData[3]["areaArr"].findIndex(v => v.label === removeNum[i])
	graphData[3]["areaArr"].splice(ArrIndex,1)
  }
  
  graphData.forEach(d => {
    d.areaArr.sort(function(val1, val2) {
      return val1.cumulative < val2.cumulative ? 1 : -1
    })
  })
  return graphData
}
