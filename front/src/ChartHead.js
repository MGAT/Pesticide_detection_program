import React from 'react';

export default function (props) {
  
  let {bgCokor, title} = props;

  return(
    <div className="chart-head" style={{background: props.bgCokor}}>
      <div className="text">{title}</div>

      <style >{`
        .chart-head{
          box-sizing: border-box;          
          width: 100%;
          height: 40px;
          // background: ${bgCokor};
          color: #fff;
          line-height:40px;
          padding-left: 20px;
          border-top-left-radius:5px;
          border-top-right-radius:5px;  
          font-size: 18px;
          // font-weight: 600;
        }
      `}</style>
    </div>
  )
}
