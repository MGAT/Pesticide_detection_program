  import React, {useEffect, useState} from "react";
import echarts from 'echarts';
import "echarts/map/js/china";

export default function (props) {
  let [provinceValue, setProvinceValue] = useState(null);
  // let [provinceData, setProvinceData] = useState([]);
  // let [barData, setBarData] = useState([]);

  useEffect (() => {
     // 初始化chart
    initChart()
  })

  function initChart(){
    // 初始化echarts实例
    const myChart = echarts.init(document.getElementById('main_1'));

    // console.log(props)
    
    let provinceData=props.locationData&&Object.keys(props.locationData).map(item=>{
      let num = Object.values(props.locationData[item]).reduce((a,b)=>(a+b.average), 0)
      return {name:item, value:num.toFixed(2)}
    }) || [];

    // console.log(provinceData)

    let initProvinceValue = !!provinceData.length&&provinceData[0].name || null

    let barData = props.locationData&&Object.entries(props.locationData[provinceValue || initProvinceValue]).map(item=>({name:item[0], value:item[1].average.toFixed(2)})) || [];

    // const getBarData = () => {
    //   let res = props.locationData&&Object.entries(props.locationData[provinceValue || initProvinceValue]).map(item=>({name:item[0], value:item[1].average.toFixed(2)})) || [];
    //   setBarData(res)
    // }

    // // getBarData();

    const option = {
        title: [{                   //标题
            text: '销售量统计',
            subtext: '纯属虚构',
            left: 'left'
        },{                         //右上角全部
            text: '全部: ',
            right: '54%',
            top: 40,
            width: 100,
            textStyle: {
                color: '#555',
                fontSize: 16
            }
        }],
        tooltip: {
            trigger: 'item'
        },
        visualMap: {             　　//左下角拉条
            show:false,
            min: 0,
            max: 2500,
            left: 'left',
            top: '50',
            text: ['高', '低'],
            calculable: true,
            colorLightness: [0.2, 100],
            color: ['#c05050','#e5cf0d','#5ab1ef'],
            dimension: 0
        },
        toolbox: {                  //右边工具栏
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                saveAsImage: {}
            }
        },
        grid: {                 //右边的bar
            right: '10%',
            top: 100,
            bottom: 0,
            height:'50%',
            width: '30%'
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
            name: '全部',
            type: 'map',
            map: 'china',
            left: '10',
            right: '60%',
            top: 100,
            bottom: "45%",
            zoom: 1,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            // roam: true,
            data: provinceData
        }, {                //bar
            name: '全部',
            z: 2,
            type: 'bar',
            barWidth: '%10',
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true,
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

  return <>
    <div id="main_1" style={{ width: 1000, height: 600 }}>

    </div>
  </>
}