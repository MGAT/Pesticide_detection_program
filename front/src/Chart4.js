import React, {useEffect, useState} from "react";
import echarts from 'echarts'
import HeadChart from './ChartHead';

export default function (props) {
let [chartHeight, setChartHeight] = useState(750);

  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_4'));
        // 处理数据
        // console.log(props)
        // let data1 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.adi.toExponential(1)})) || [];
        let data1 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.adi.toFixed(2)})) || [];
        let data2 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.arfd.toFixed(2)})) || [];
        let data3 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.average_score.toFixed(2)})).sort((a,b)=>a.value-b.value) || [];

        if(data1.length && data1.length>24){
            let len = data1.length;
            setChartHeight(len*30)
        };

        // console.log(data1, data2, data3)

        var builderJson = {
          "all": 10887,
          "charts": {
            "map": 3237,
            "lines": 2164,
            "bar": 7561,
            "line": 7778,
            "pie": 7355,
            "scatter": 2405,
            "candlestick": 1842,
            "radar": 2090,
            "heatmap": 1762,
            "treemap": 1593,
            "graph": 2060,
            "boxplot": 1537,
            "parallel": 1908,
            "gauge": 2107,
            "funnel": 1692,
            "sankey": 1568
          },
          "components": {
            "geo": 2788,
            "title": 9575,
            "legend": 9400,
            "tooltip": 9466,
            "grid": 9266,
            "markPoint": 3419,
            "markLine": 2984,
            "timeline": 2739,
            "dataZoom": 2744,
            "visualMap": 2466,
            "toolbox": 3034,
            "polar": 1945
          },
          "haha": {
            "geo": 2788,
            "title": 9575,
            "legend": 9400,
            "tooltip": 9466,
            "grid": 9266,
            "markPoint": 3419,
            "markLine": 2984,
            "timeline": 2739,
            "dataZoom": 2744,
            "visualMap": 2466,
            "toolbox": 3034,
            "polar": 1945
          },
          "ie": 9743
        };
        
        let option = {
            title: [
                {text: '慢性风险', left: '5%', top:10, textStyle: {
                    color: '#999',
                    fontSize: 14
                }},
                {text: '急性风险', left: '35%', top:10, textStyle: {
                    color: '#999',
                    fontSize: 14
                }},
                {text: '风险排序',  left: '70%', top:10, textStyle: {
                    color: '#999',
                    fontSize: 14
                }},
            ],
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
            tooltip: {},
            barWidth: 15,
            grid: [{
                top: '5%',
                width: '30%',
                bottom: '5%',
                left: 10,
                containLabel: true
            }, {
                top: '5%',
                width: '30%',
                bottom: '5%',
                left: '33%',
                containLabel: true
            },
            {
              top: '5%',
              width: '30%',
              left: '66%',
              bottom:'5%',
              containLabel: true
          }],
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45,
                    show: true,
                    textStyle: {
                        color: '#000',
                        fontSize:'12'
                    }
                  },
            }, {
                type: 'value',
                gridIndex: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45,
                    show: true,
                    textStyle: {
                        color: '#000',
                        fontSize:'12'
                    }
                  },
            },
            {
              type: 'value',
              gridIndex: 2,
              splitLine: {
                  show: false
              },
              axisLabel: {
                rotate: 45,
                show: true,
                textStyle: {
                    color: '#000',
                    fontSize:'12'
                }
              },
          }],
            yAxis: [{
                type: 'category',
                data: data1.map(item=>item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                },
                splitLine: {
                    show: false
                }
            }, {
                gridIndex: 1,
                type: 'category',
                data: data2.map(item=>item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                },
                splitLine: {
                    show: false
                }
            },
            {
              gridIndex: 2,
              type: 'category',
              data: data3.map(item=>item.name),
              axisLabel: {
                  interval: 0,
                  rotate: 30
              },
              splitLine: {
                  show: false
              }
          }],
            series: [{
                type: 'bar',
                stack: 'chart',
                z: 3,
                label: {
                    normal: {
                        position: 'right',
                        show: true
                    }
                },
                data: data1.map(item=>item.value),
            }, {
                type: 'bar',
                stack: 'component',
                xAxisIndex: 1,
                yAxisIndex: 1,
                z: 3,
                label: {
                    normal: {
                        position: 'right',
                        show: true
                    }
                },
                data: data2.map(item=>item.value),
            }, 

            {
              type: 'bar',
              stack: 'haha',
              xAxisIndex: 2,
              yAxisIndex: 2,
              z: 3,
              label: {
                  normal: {
                      position: 'right',
                      show: true
                  }
              },
              data: data3.map(item=>item.value),
          }, 
  
          
]
        };
        myChart.setOption(option);
  })

  const bg = "linear-gradient(90deg, #8DC8FE, #876FF1)"

  return (
    <div className="weight-chart">
        <HeadChart title="农药风险得分排序" bgCokor={bg}/>
        <div id="main_4" style={{ width: "100%", height: chartHeight }}></div>

        <style >{`
          .weight-chart{
              width:100%;
              background:#fff;
              border-bottom-left-radius:5px;
              border-bottom-right-radius:5px;
              margin-bottom: 20px;
          }
        `}</style>
    </div>
  )
}