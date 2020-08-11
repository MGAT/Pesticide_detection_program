import React, {useState, useEffect} from 'react';

import {upload} from './api'

import Chart_1 from './Chart_1';
import Chart_2 from './Chart_2';
import Chart_3 from './Chart_3';
import Chart_4 from './Chart_4';
import './content.less'


export default function(props){
  let [fileObject, setFileObject] = useState(null)

   useEffect(() => {
    const input = document.querySelector('input');
    input.style.opacity = 0;
    input.addEventListener('change', updateFileDisplay);

    console.log(fileObject)
    if(fileObject){
      let fd = new FormData();
      fd.append("file", fileObject);
      fd.append("filename", fileObject.name);
      console.log({data:fd})
      let res = upload(fd);
      console.log(res)
    }
  })

  const updateFileDisplay = (e) => {
    console.log(e);
    setFileObject(e.target.files[0])
    const input = document.querySelector('input');
    const preview = document.querySelector('.preview');
    
    console.log(preview)
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    const curFiles = input.files;
    console.log(curFiles);
    if(curFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
  
      for(const file of curFiles) {
        const para = document.createElement('p');

        para.textContent = `${file.name}`;

        preview.appendChild(para);

      }
    }
  };

  return(
    <div className="content-container">
      <div className="col-1">
        <div className="content">
          <div className="params">选择参数模块：</div>
          <div className="row-1">
            <select name="crops" id="crops-select">
                <option value="">--请选择作物--</option>
                <option value="peach">桃子</option>
                <option value="其他">其他</option>
            </select>
          </div>
          <div className="row-2">
              <div>
                <label htmlFor ="files">点击上传文件 (.xml)</label>
                <input type="file" id="files" name="files" 
                accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                />
              </div>
              <div className="preview">
                <p>No files for upload</p>
              </div>
          </div>
          <div className="row-3">
            <button>提交</button>
          </div>
        </div>
      </div>
      <div className="col-2">
        <div className="row-1">
          <p className="frp1">数据计算说明</p>
          <hr className="line-wht-short" />
          <p className="frp2">
            借鉴英国兽药残留委员会兽药残留风险排序矩阵。用毒性指标代替药性指标。膳食比例( 水蜜桃占居民总膳食的百分率) 以及农药毒效( 即ADI 值) 、使用频率、高暴露人群、残留水平5项指标均采用原赋值标准，进行风险排序
          </p>
        </div>
        <div className="row-2">
          <div className="charts">
            <div className="head">
              <div>输出结果</div>
              <div>
                <div>图标展示数量</div>
                <div>4</div>
              </div>
            </div>
            <div className="container">
              <div className="c-1"><Chart_1 /></div>
              <div className="c-2"><Chart_2 /></div>
              <div className="c-3"><Chart_3 /></div>
              <div className="c-4"><Chart_4 /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}