import axios from 'axios';
/* 
*url:请求的url 
*params:请求的参数 
*config:请求时的header信息 
*method:请求方法 
*/ 

export const request = function ({ url, params, config, method }) {  
  console.log( url, params, config, method)
  // 如果是get请求 需要拼接参数  
  let str = '';
  if (method === 'get' && params) {    
    Object.keys(params).forEach(item => {      
      str += `${item}=${params[item]}&`    
    })  
  }

  return new Promise((resolve, reject) => {    
    axios[method](str ? (url + '?' + str.substring(0, str.length - 1)) : url, params, Object.assign({}, config)).then(response => {      
      resolve(response.data)    
    }, 
    err => {      
      if (err.Cancel) {      
      } else {        
        reject(err)      
      }    
    }).catch(err => {      
      reject(err)    
    })  
  }) 
}
