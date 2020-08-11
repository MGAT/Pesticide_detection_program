import {request} from './utils/request'

const ApiRootUrl = "http://127.0.0.1:5000/";

const api = {
  Upload: ApiRootUrl + 'file/upload',   // 文件上传Api
  CountSample: ApiRootUrl + 'get/count/sample',  //检测样品api
  CountCheck: ApiRootUrl + 'get/count/check',   //检出频次api
  WeightData: ApiRootUrl + 'get/data/by/weight'   //重量数据api
}

// 文件上传Api
export async function upload(params){
  let url = api.Upload;
  console.log(params)
  let options = {
      method:'POST',
      body:params,
    };
    
  const res = await fetch(url, options);
  console.log(res)
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