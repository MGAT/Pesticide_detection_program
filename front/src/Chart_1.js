import React, {useEffect} from "react";
import echarts from 'echarts';
import "echarts/map/js/china";

export default function (props) {
  
  useEffect (() => {
      console.log(props)
        // 初始化echarts实例
        const myChart = echarts.init(document.getElementById('main_1'));
        // 绘制图表
      function randomData() {
          return Math.round(Math.random() * 1000);
      }

      let data = [{
          name: '云南',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '辽宁',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '黑龙江',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '湖南',
          value1: randomData(),
          value2: randomData(),
      },{
          name: '福建',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '贵州',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '广东',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '青海',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '西藏',
          value1: randomData(),
          value2: randomData(),
      }, {
          name: '四川',
          value1: randomData(),
          value2: randomData(),
      }];


      let resultdata0 = [];
      let sum0 = 0;
      let titledata = [];
      for (let i = 0; i < data.length; i++) {
          let d0 = {
              name: data[i].name,
              value: data[i].value1 + data[i].value2
          };
          titledata.push(data[i].name)
          resultdata0.push(d0);
          sum0 += data[i].value1 + data[i].value2;
      }

      function NumDescSort(a,b){
          return a.value-b.value;
      }

      resultdata0.sort(NumDescSort);

      const option = {
          title: [{                   //标题
              text: '销售量统计',
              subtext: '纯属虚构',
              left: 'left'
          },{                         //右上角全部
              text: '全部: ' +sum0,
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
              bottom: 40,
              height:'40%',
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
              data: titledata,
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
              bottom: "35%",
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
              data: resultdata0
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
              data: resultdata0
          }]
      };
      // myChart.setOption(option);

  })
  return <>
    <div id="main_1" style={{ width: 1000, height: 600 }}>

    </div>
  </>
}