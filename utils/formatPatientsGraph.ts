type patientsArr = {
	リリース日: Date
	曜日: number
	居住地: string
	年代: string
	性別: string
	退院: string
	date: Date
}

type DataType = {
	date: Date
	data: Array<patientsArr>
}

interface DataArrType {
	label: string
	transition: number
	cumulative: number
}

type GraphDataType = {
	label: string
	value: number
	DataArr: Array<DataArrType>
}

export default (data: DataType) => {
	const graphData: GraphDataType[] = [
	{
		label: 'すべて',
		value: 0,
		DataArr: []
	},
	{
		label: '福岡市',
		value: 1,
		DataArr: []
	},
	{
		label: '北九州市',
		value: 2,
		DataArr: []
	},
	{
		label: '福岡県（その他）',
		value: 3,
		DataArr: []
	},
	{
		label: 'それ以外※',
		value: 4,
		DataArr: []
	}
	]
	
	let lastUpdate = new Date(data['date'])
	lastUpdate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate() - 1)
	const cumulDataArr: number[] = [0, 0, 0, 0, 0]
	const diffDayArr: boolean[] = [false, false, false, false, false]
	let date: Date
	data['data'].forEach(d => {
			let address: string
			date = new Date(d['リリース日'])
			let areaNum: number
			switch (true) {
				case d['居住地'].includes('福岡市'):
				address = '福岡市'
				areaNum = 1
				break
				case d['居住地'].includes('北九州市'):
				if(d['居住地'] === '北九州市外') {
				  address = 'それ以外※'
				  areaNum = 4				
				} else {
				  address = '北九州市'
				  areaNum = 2					
				}
				break
				default:
				if (d['居住地'] === '調査中' || d['居住地'] === '海外') {
					address = 'それ以外※'
					areaNum = 4
				} else {
					if (d['居住地'].includes('県') && !d['居住地'].includes('福岡')) {
					  address = 'それ以外※'
				      areaNum = 4						
					} else if(d['居住地'].includes('区')) {
				      let areaArr = ['東区','博多区','中央区','南区','西区','城南区','早良区']
					  let index = areaArr.indexOf( d['居住地'])
					  if(index === -1) {
					    address = '北九州市'
				        areaNum = 2						  
					  } else {
					    address = '福岡市'
				        areaNum = 1						  
					  }
					} else {
			　　　　　　if(d['居住地'].includes('確認中')) {
			  　　　　　　　address = 'それ以外※'
              　　　　　　　areaNum = 4			
			　　　　　　} else {
					  　　address = '福岡県（その他）'
					  　　areaNum = 3
			　　　　　　}
					}
				}
			}
		
		    let tmpArr = [0,areaNum]
		    
			for (let i = 0; i < tmpArr.length; i++) {
			  let num = tmpArr[i]
			  if (lastUpdate.getTime() === (date.getTime() - 32400000)) {
				diffDayArr[num] = true
			  }
						
			  let graphDateNum =  Math.round( date.getTime() / 1000 )
			  const graphDate = String(graphDateNum)
			
			  const ArrIndex = graphData[num].DataArr.findIndex(
				v => v.label === graphDate
			  )
			  cumulDataArr[num] += 1
			
			  if (ArrIndex === -1) {
				graphData[num].DataArr.push({
				  label: graphDate,
				  transition: 1,
				  cumulative: cumulDataArr[num]
				})
			  } else {
				graphData[num].DataArr[ArrIndex].transition += 1
				graphData[num].DataArr[ArrIndex].cumulative = cumulDataArr[num]
			  }	  
            }
	})
		
	graphData.forEach((d,index) => {
			let graphDate = String(Math.round( (lastUpdate.getTime() + 32400000) / 1000 ))
			if(!diffDayArr[index]) {
				d.DataArr.push({
						label: graphDate,
						transition: 0,
						cumulative: d.DataArr.slice(-1)[0].cumulative
				})
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
