import React, {useEffect} from "react";
import echarts from 'echarts'

export default function (props) {
  
  useEffect (() => {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main_4'));
        // 处理数据
        console.log(props)
        let data1 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.adi})) || [];
        let data2 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.arfd})) || [];
        let data3 = props.weightData&&props.weightData.map(item=>({name:item.name, value: item.average_score})) || [];

        console.log(data1, data2, data3)

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
          
            tooltip: {},
            title: [{
                text: '在线构建',
                subtext: '总计 ' + builderJson.all,
                left: '25%',
                textAlign: 'center'
            }],
            grid: [{
                top: 50,
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
              bottom: 0,
              containLabel: true
          }],
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                }
            }, {
                type: 'value',
                gridIndex: 1,
                splitLine: {
                    show: false
                }
            },
            {
              type: 'value',
              gridIndex: 2,
              splitLine: {
                  show: false
              }
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
  return <>
    <div id="main_4" style={{ width: 1000, height: 400 }}></div>
  </>
}