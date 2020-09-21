/* eslint-disable no-mixed-operators */
import React, {useEffect, useState} from "react";
import echarts from 'echarts';
import "echarts/map/js/china";
import HeadChart from './ChartHead';

export default function (props) {
  let [provinceValue, setProvinceValue] = useState(null);
  let [chartHeight, setChartHeight] = useState(500);

  useEffect (() => {
     // 初始化chart
    initChart()
    // console.log(props)
  })

  function initChart(){
    // 初始化echarts实例
    const myChart = echarts.init(document.getElementById('main_1'));
    
    let provinceData=props.locationData && Object.keys(props.locationData.location_json).map(item=>{
      let num = Object.values(props.locationData.location_json[item]).reduce((a,b)=>(a+b.average), 0)
      return {name:item, value:num.toFixed(2)}
    }) || [];
    
    // console.log(provinceData)
    let initProvinceValue = !!provinceData.length&&provinceData[0].name || null
    let barData = props.locationData&&Object.entries(props.locationData.location_json[provinceValue || initProvinceValue]).map(item=>({name:item[0], value:(item[1].average ? item[1].average.toFixed(2) : 0)})) || [];
    
    if(barData.length && barData.length>24){
        let len = barData.length;
        setChartHeight(len*20)
    }
    let locationArr = props.locationData&&Object.keys(props.locationData.location_json) || []

    const option = {
        title: [{                   //标题
            text: '调查省份统计',
            left: 10,
            top: 10,
            textStyle: {
                color: '#999',
                fontSize: 14
            }
        },{                         //右上角全部
            text: provinceValue || initProvinceValue,
            right: '40%',
            top: 10,
            textStyle: {
                color: '#999',
                fontSize: 14
            }
        }],
        tooltip: {
            // trigger: 'item'
            formatter: (params) => {
                let str='';
                if(locationArr.includes(params.name)){
                    str += `${params.seriesName}` + '<br/>' + `${params.marker} ${params.name}: ${params.value}`
                }
                return str;
            }

        },
        visualMap: {         　　//左下角拉条
            show:true,
            top:(chartHeight/2+50),
            left: 10,
            min: 0,
            max: 1,
            // left: 'left',
            text: ['高', '低'],
            calculable: true,
            colorLightness: [0.2, 100],
            // color: ['#82C4F3','#5CB4F3','#5ab1ef'],
            color: ['#BF6CB2', '#ff9900', '#4FAAD3'],
            dimension: 0
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
        grid: {                 //右边的bar
            right: 50,
            top: 80,
            bottom: 20,
            left: '70%',
            // height:'50%',
            width: '25%'
        },
        xAxis: [{
            position: 'top',
            type: 'value',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLabel:{
                rotate:45, 　　　　//刻度旋转45度角
                textStyle:{
                }
            }
        }],
        yAxis: [{
            type: 'category',
            data: barData.map(item=>item.name),
            axisTick: {
                alignWithLabel: true
            }
        }],
        barWidth:30,
        series: [{              //地图
            z: 1,
            name: '总计',
            type: 'map',
            map: 'china',
            left: '30',
            right: '45%',
            // top: 80,
            // bottom: "15%",
            // bottom: (chartHeight-450),
            zoom: 1,
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            // roam: true,
            data: provinceData
        }, {                //bar
            name: provinceValue || initProvinceValue,
            z: 2,
            type: 'bar',
            barWidth: '%10',
            label: {
                show: true,
                position: 'right',
                textStyle: {
                    color: '#2c6df8',
                }
            },
            itemStyle: {
                emphasis: {
                    color: "rgb(254,153,78)"
                }
            },
            data: barData
        }]
    };
    myChart.setOption(option);

    //点击事件,根据点击某个省份计算出这个省份的数据
   myChart.on('click', function (params) {
    //  console.log(params, provinceData)
     if(provinceData.map(item=>item.name).includes(params.name)){
      setProvinceValue(params.name);      
     }
    });
  };

  const bg = "linear-gradient(90deg, #58DCAF, #4FAAD3)"
  return (
    <div className="location-chart">
        <HeadChart title="农药残留量" bgCokor={bg}/>
        <div id="main_1" style={{ width: 960, height: chartHeight }}>
        </div>

        <style>{`
            .location-chart{
                background:#fff;
                border-bottom-left-radius:5px;
                border-bottom-right-radius:5px;
                display: flex;
                flex-direction:column;
                align-items: center;
                justify-content: center;
            }

            .main_1{
                
            }
        `}</style>
    </div>
  )
  
}