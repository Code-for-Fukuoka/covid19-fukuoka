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
  transition: number
  cumulative: number
}

type GraphDataType = {
  label: string
  transitionPre: number
  transition: number
  cumulative: number
  DataArr: Array<DataArrType>
}

export default (data: DataType[]) => {
  const graphData: GraphDataType[] = [
    {
      label: '福岡市',
      transition: 0,
      transitionPre: 0,
      cumulative: 0,
      DataArr: []
    },
    {
      label: '北九州市',
      transition: 0,
      transitionPre: 0,
      cumulative: 0,
      DataArr: []
    },
    {
      label: '福岡県（それ以外）',
      transition: 0,
      transitionPre: 0,
      cumulative: 0,
      DataArr: []
    },
    {
      label: 'その他※',
      transition: 0,
      transitionPre: 0,
      cumulative: 0,
      DataArr: []
    }
  ]
  const latestDate = new Date(data.slice(-1)[0]['リリース日'])
  const cumulDataArr: number[] = [0, 0, 0, 0]
  let date: Date
  data.forEach(d => {
    let address: string
    let transitionNum: number = 0
    let transitionPreNum: number = 0
    let cumulativeNum: number = 1  
    date = new Date(d['リリース日'])
    if (latestDate.getTime() === date.getTime()) {
      transitionNum++
    }
    if (latestDate.getTime() - 86400000 === date.getTime()) {
      transitionPreNum++
    }
    switch (true) {
      case d['居住地'].includes('福岡市'):
        address = '福岡市'
        break
      case d['居住地'].includes('北九州市'):
        address = '北九州市'
        break
      default:
        if (d['居住地'] === '調査中' || d['居住地'] === '海外') {
          address = 'その他※'
        } else {
          address = '福岡県（それ以外）'
        }
    }

    const index = graphData.findIndex(v => v.label === address)
    graphData[index].transition += transitionNum
    graphData[index].transitionPre += transitionPreNum
    graphData[index].cumulative += cumulativeNum
	  
	let graphDateNum =  Math.round( date.getTime() / 1000 )

    const graphDate = String(graphDateNum)
	
		
    const ArrIndex = graphData[index].DataArr.findIndex(
      v => v.label === graphDate
    )
    cumulDataArr[index] += 1
	  
    if (ArrIndex === -1) {
      graphData[index].DataArr.push({
        label: graphDate,
        transition: 1,
        cumulative: cumulDataArr[index]
      })
    } else {
      graphData[index].DataArr[ArrIndex].transition += 1
      graphData[index].DataArr[ArrIndex].cumulative = cumulDataArr[index]
    }
	
  })
	
  graphData.forEach((d,index) => {
   let DataArr = d["DataArr"]
   let newDataArr: Array<DataArrType> = []
   let checkArr: number[] = []
   let fistDate: number = Number(DataArr[0]["label"])
   let lastDate: number = Number(DataArr.slice(-1)[0]["label"])
   let nowDate: number = fistDate
   let cumulative: number
   while (nowDate <= lastDate) {
	checkArr.push(nowDate)
    nowDate += 86400
   }
   checkArr.forEach(e => {
	  let dateTime: Date
 　　　let data = DataArr.filter(function(item, index){
  　　　if (item.label === String(e)) return item;
　　　 })
	  if(data.length > 0) {
		  let labelStr = data[0]["label"]
		  dateTime = new Date(Number(labelStr) * 1000)
		  data[0]["label"] = dateTime.toLocaleDateString('ja-JP').slice(5)
		  newDataArr.push(data[0])
		  cumulative = data[0]["cumulative"]
	  } else if(data.length === 0) {
		  dateTime = new Date(e * 1000)
		  newDataArr.push({
           label: dateTime.toLocaleDateString('ja-JP').slice(5),
           transition: 0,
           cumulative: cumulative
          })
	  }
   })
   graphData[index].DataArr = []
   graphData[index].DataArr = newDataArr
  })
  
  return graphData
}
