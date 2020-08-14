import React, {useEffect} from "react";
import echarts from 'echarts'

export default function (props) {
  
  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_3'));
        
        // 处理数据
        console.log(props)

        let data = props.sampleData || [];

        myChart.setOption({
            title: { text: 'ECharts 入门示例' },
            tooltip: {},
            xAxis: {
                data: data.map(item => item.name)
            },
            yAxis: {},
            series: [{
                name: "销量",
                type: "bar",
                data: data.map(item => item.cnt)
            }]
        });
  })
  return <>
    <div id="main_3" style={{ width: 1000, height: 400 }}></div>
  </>
}