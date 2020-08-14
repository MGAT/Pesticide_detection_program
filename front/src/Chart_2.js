import React, {useEffect} from "react";
import echarts from 'echarts'

export default function (props) {
  
  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_2'));

        // 处理数据
        console.log(props)
        let data = props.checkedData&&props.checkedData.map(item=>({name: item[0]+'种', value: item[1].sample_cnt})) || []
        // 绘制图表
        myChart.setOption({
            title: { text: '检出样品个数' },
            tooltip: {},
            xAxis: {
                data: data.map(item=>item.name)
            },
            yAxis: {},
            series: [{
                name: "销量",
                type: "bar",
                data: data.map(item=>item.value)
            }]
        });
  })
  return <>
    <div id="main_2" style={{ width: 400, height: 400 }}></div>
  </>
}