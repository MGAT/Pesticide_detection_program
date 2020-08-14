import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Content from './Content';
import './index.less';

function Home() {

    const dec = "为评估农药在农作物中的膳食摄入风险。采用急性膳食风险评估、慢性膳食风险评估、安全界限以及最大残留限量估计值进行风险计算。"
    return(
      <div className="main-container"> 
        <div id="case">
          <div className="container">
            <div className="row"><Header title={title} dec={dec}/></div>
            <div className="row"><Content /></div>
          </div>
        </div>
      </div>
    )
}
const title = "膳食污染风险评估";

ReactDOM.render(
  <Home name={title} />,
  document.getElementById('root')
);


