import React, {useState, useEffect} from 'react';
import { Cascader, Button, message } from 'antd';
import {upload, getLocationData, getCountCheck, getCountSample, getWeightData} from './api'
import {options} from './contentData'

import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import Chart4 from './Chart4';
import './content.less';

export default function(props){
  let [fileObject, setFileObject] = useState(null)
  let [locationData, setLocationData] = useState(null)
  let [sampleData, setSampleData] = useState(null)
  let [checkedData, setCheckedData] = useState(null)
  let [weightData, setWeightData] = useState(null)
  let [weightParam, setWeightParam] = useState(0)
  let [isDisabled, setIsDisabled] = useState(true)
  let [filename, setFilename] = useState(null)
  let [downFileName, setDownFileName] = useState(null)

  // const filename = encodeURIComponent('数据修改.xlsx')

   useEffect( () => {
    const input = document.getElementById('files');
    input.style.opacity = 0;
    input.addEventListener('change', updateFileDisplay);

    async function getUploadRes(fd){
      let res = await upload(fd)
      // console.log(res)
    }

    if(fileObject){
      setFilename(fileObject.name)
      let fd = new FormData();
      fd.append("file", fileObject);
      fd.append("filename", fileObject.name);
      getUploadRes(fd);

      // if(res && res.filename){
      //   setDownFileName(res.filename);
      // }
      if(weightParam){
        setIsDisabled(false);
      }
    }
   }, [fileObject, weightParam])

  const updateFileDisplay = (e) => {
    // console.log(e.target.files)
    setFileObject(e.target.files[0])
    const input = document.getElementById('files');
    const preview = document.querySelector('.preview');
    
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    const curFiles = input.files;
    if(curFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files for upload';
      preview.appendChild(para);
    } else {
      for(const file of curFiles) {
        const para = document.createElement('p');
        para.textContent = `${file.name}`;
        preview.appendChild(para);
      }
    }
  };

  async function getMapData() {
    let payload = {filename};
    let payload_wight = {filename, weight:weightParam};

    let [location_data, sample_data, checked_data, weight_data] = await Promise.all([
      getLocationData(payload),
      getCountCheck(payload),
      getCountSample(payload),
      getWeightData(payload_wight),
    ])

     setLocationData(location_data);
     setSampleData(sample_data);
     setCheckedData(checked_data);
     setWeightData(weight_data);
  }

  async function submitParam(){
    if(weightParam && fileObject){
      await getMapData();
    }else{
      if(!weightParam){
        message.info('请选择参数')
      }else if(!fileObject){
        message.info('请点击上传文件按')
      }else{
        message.info('请选择参数')
      }
    }
  }

  function onChange(value) {
    if(value && value.length){
      let data = value[2];
      setWeightParam(data);
      if(fileObject){
        setIsDisabled(false);
      }
    }else{
      setWeightParam(0)
      setIsDisabled(true);
    }
  }

  function downloadFile(){
    // console.log(downFileName)
    window.open(encodeURI("http://127.0.0.1:5000/get/static_file?filename=model_file.xlsx"))

    // if(downFileName){
    //   window.open(encodeURI("http://127.0.0.1:5000/get/static_file?filename=model_file.xlsx"))
    // }else{
    //   message.info('请先上传文件')
    // }
  }

  return(
    <div className="content-container">
      <div className="col-1">
        <div className="content">
          <div className="params">选择参数模块：</div>
          <div className="row-1">
            <Cascader options={options} onChange={onChange} placeholder="请选择"/>
          </div>
          <div className="row-2">
            <div>
              <label htmlFor ="files">点击上传文件 (.xml)</label>
              <input type="file" id="files" name="files"
              accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </div>
            <div className="preview">
              <p style={{color: '#ff9900'}}>*暂无文件上传！</p>
            </div>
          </div>
          <div className="row-3">
            <Button onClick={submitParam} disabled={isDisabled}>提交</Button>
          </div>

          <div className="params">选择参数模块：</div>
          <div className="row-3">
            <Button onClick={downloadFile}>模板文件下载</Button>
          </div>

          <div className="desc">
            <p className="frp1">数据计算说明：</p>
            <hr className="line-wht-short" />
            <p className="frp2">
              借鉴英国兽药残留委员会兽药残留风险排序矩阵。用毒性指标代替药性指标。膳食比例( 水蜜桃占居民总膳食的百分率) 以及农药毒效( 即ADI 值) 、使用频率、高暴露人群、残留水平5项指标均采用原赋值标准，进行风险排序。
            </p>
            <p className="frp2">
            急性风险评估=估计短期摄入量/急性参考计量*100
            <br/>
            %ARfD=ESTI/ARfD*100
            </p>
            <p className="frp2">
            慢性风险评估=（平均残留*居民日均消费量/体重）/（每日允许摄入量*100）
            <br/>
            %ADI=(STMR*0.046/60)/(ADI*100)
            </p>
            <p className="frp2">
            风险得分 = (毒性得分 + 毒效得分)× (膳食比例得分 + 农药使用频率得分 + 高暴露人群得分 + 残留水平得分)
            <br/> 
            S = (A + B)× (C + D + E + F)
            </p>
          </div>
        </div>
        
      </div>
      <div className="col-2">
        <div className="charts">
          <div className="head">
            <div className="left-text">
              <img src={require("./assets/images/fruit.jpg")} alt="图片" width='100'/>
            </div>
            <div className="right-text">
              <div>图表展示数量</div>
              <div>4</div>
            </div>
          </div>
          <div className="border"></div>
          <div className="container">
            <div className="c-1"><Chart1 locationData={locationData}/></div>
            <div className="c-2">
              <Chart2 checkedData={checkedData}/>
              {/* <div className="r-2"><Chart2 checkedData={checkedData}/></div> */}
            </div>
            <div className='c3'>
              <div className="r-3"><Chart3 sampleData={sampleData}/></div>
            </div>
            <div className="c-4"><Chart4 weightData={weightData}/></div>
          </div>
        </div>
      </div>
    </div>
  )
}