import React from 'react';

export default function (props) {
  
  let {title, dec} = props;
  return(
    <div className="text-center">
      <h2 className="sec-tit">{title}</h2>
      <p className="sec-dec">{dec}</p>
    </div>
  )
}