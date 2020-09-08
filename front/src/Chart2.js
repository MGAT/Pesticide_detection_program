import React, {useEffect} from "react";
import echarts from 'echarts'
import HeadChart from './ChartHead';

export default function (props) {
  
  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_2'));

        // 处理数据
        // console.log(props)
        let data = props.checkedData&&props.checkedData.map(item=>({name: item[0]+'种', value: item[1].sample_cnt})) || []
        // 绘制图表
        myChart.setOption({
            backgroundColor: '#fff',
            tooltip: {},
            xAxis: {
                data: data.map(item=>item.name)
            },
            grid:{
              // bottom: 20,
              left: 50,
              right:70,
              containLabel: true,
            },
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
            yAxis: {},
            barWidth:30,
            color: '#4FAAD3',
            series: [{
                name: "残留农药",
                type: "bar",
                data: data.map(item=>item.value),
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                      color: '#4FAAD3',
                      fontSize: 14,
                  },
                },
            }]
        });
  })

  const bg = "linear-gradient(90deg, #FFC826, #ff9900)"

  return (
    <div className="checked-chart">
        <HeadChart title="检出样品数量" bgCokor={bg}/>
        <div id="main_2" style={{ width: "100%", height: 400 }}></div>

        <style >{`
          .checked-chart{
              width:100%;
              background:#fff;
              border-bottom-left-radius:5px;
              border-bottom-right-radius:5px;
          }
        `}</style>
    </div>
  )
}