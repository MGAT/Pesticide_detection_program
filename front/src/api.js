import qs from 'qs';

const ApiRootUrl = "http://127.0.0.1:5000/";

const api = {
  Upload: ApiRootUrl + 'file/upload',   // 文件上传Api
  LocationData: ApiRootUrl + 'get/location',     //获取地点的api
  CountSample: ApiRootUrl + 'get/count/sample',  //检测样品api
  CountCheck: ApiRootUrl + 'get/count/check',   //检出频次api
  WeightData: ApiRootUrl + 'get/data/by/weight'   //重量数据api
}

// 文件上传Api
export function upload(params){
  let url = api.Upload;
  let options = {
      method:'POST',
      body:params,
    };
  return fetch(url, options).then(res=>{
    return res.json()
  }).then(json => {
    // console.log(json)
    return json
  });
}

//获取地点的api
export async function getLocationData(params) {
  let url = api.LocationData + '?' + qs.stringify(params, { indices: false });
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    cache: "default",
    mode: 'cors',
    method: 'get'
  };
  let res = await fetch(url, options).then(res => res.json())

  return res
}

//检测样品api
export async function getCountCheck(params) {
  let url = api.CountCheck + '?' + qs.stringify(params, { indices: false });
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    cache: "default",
    mode: 'cors',
    method: 'get'
  };
  const res = await fetch(url, options).then(res => res.json())

  return res
}

//检测样品api
export async function getCountSample(params) {
  let url = api.CountSample + '?' + qs.stringify(params, { indices: false });
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    cache: "default",
    mode: 'cors',
    method: 'get'
  };
  const res = await fetch(url, options).then(res => res.json())

  return res
}

//检测样品api
export async function getWeightData(params) {
  let url = api.WeightData + '?' + qs.stringify(params, { indices: false });
  let options = {
    headers: {
      'content-type': 'application/json'
    },
    cache: "default",
    mode: 'cors',
    method: 'get'
  };
  const res = await fetch(url, options).then(res => res.json())

  return res
}

// 文件上传Api
// export async function upload(params){
//   console.log(params)
//   let options = {
//       url: api.Upload,
//       params,
//       config: {},
//       method:'post',
//     };
    
//   const res = await request(options);
//   console.log(res)
//   return res
// }