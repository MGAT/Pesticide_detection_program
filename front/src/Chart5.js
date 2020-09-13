import React, {useEffect} from "react";
import echarts from 'echarts'
import HeadChart from './ChartHead';

export default function (props) {
  
  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_5'));

        // let averageItem = props.locationData && Object.values(props.locationData).map(item => {
        //   let value = {};
        //   return Object.values(item).map(val => val.average)
        //   sum = 0;
        //   Object.keys(item).map(val => {
        //     value[val] = Number(value[val]) item[val].average
        //   })
        // }) || []

        // console.log(averageItem)
        
        // 处理数据
        console.log(props)

        let data = props.sampleData || [];

        myChart.setOption({
            tooltip: {},
            toolbox: {                  //右边工具栏
              show: true,
              // orient: 'vertical',
              // left: 'right',
              right:20,
              top: 10,
              feature: {
                  saveAsImage: {}
              }
            },
            grid:{
              bottom: 20,
              left:50,
              right:70,
              containLabel: true
            },
            color: '#876FF1',
            xAxis: {
                // data: data.map(item => item.degree + " -- " + item.name),
                data: data.map(item => item.name),
                axisLabel: {
                  rotate: 60,
                  show: true,
                  textStyle: {
                      color: '#000',
                      fontSize:'12'
                  }
                },
            },
            yAxis: {},
            series: [{
                name: "检出频次",
                type: "bar",
                data: data.map(item => item.cnt),
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                      color: '#876FF1',
                      fontSize: 14,
                  },
                },
            }]
        });
  })

  const bg = "linear-gradient(90deg, #F9897C, #BF6CB2)"

  return (
    <div className="sample-chart">
        <HeadChart title="地区农药检测平均值" bgCokor={bg}/>
        <div id="main_5" style={{ width: "100%", height: 400 }}></div>

        <style >{`
          .sample-chart{
              width:100%;
              background:#fff;
              border-bottom-left-radius:5px;
              border-bottom-right-radius:5px;
          }
        `}</style>
    </div>
  )
}