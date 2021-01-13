'use strict';
// const fs = require('fs');
// const path = require('path');
// const Sharp = require('sharp');
// const Api = require('./spider/util/api');
const ImgApi = require('./spider/util/mergeImg');

// async function test() {
//   const frontArrs = [ '1_0', '1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7' ];
//   const imgRequests = frontArrs.map(pos => Api.getImageByIdPos('09005700011608231314358109P', pos));
//   // 获取图片流
//   const imgStreams = await Promise.all(imgRequests);
//   const saveImgStatus = imgStreams.map(dataObj => ImgApi.saveImg('09005700011608231314358109P', dataObj.pos, dataObj.data));
//   const saveStatus = await Promise.all(saveImgStatus);
//   console.log(saveStatus);
// }


// function mergeImgF(id) {
//   const filename14 = path.resolve(__dirname, './spider/originImg', `${id}_${'1_4'}.jpeg`);
//   const filename15 = path.resolve(__dirname, './spider/originImg', `${id}_${'1_5'}.jpeg`);
//   const filename16 = path.resolve(__dirname, './spider/originImg', `${id}_${'1_6'}.jpeg`);
//   const filename17 = path.resolve(__dirname, './spider/originImg', `${id}_${'1_7'}.jpeg`);
//   const filename24 = path.resolve(__dirname, './spider/originImg', `${id}_${'2_4'}.jpeg`);
//   const filename25 = path.resolve(__dirname, './spider/originImg', `${id}_${'2_5'}.jpeg`);
//   const filename26 = path.resolve(__dirname, './spider/originImg', `${id}_${'2_6'}.jpeg`);
//   const filename27 = path.resolve(__dirname, './spider/originImg', `${id}_${'2_7'}.jpeg`);
//   const outputImg = path.resolve(__dirname, './spider/mergeImg', `${id}_F.jpeg`);
//   const base = Sharp({
//     create: {
//       width: 2048,
//       height: 1024,
//       channels: 4,
//       background: { r: 255, g: 255, b: 255, alpha: 1 },
//     },
//   });

//   base.composite([
//     { input: filename14.split(path.sep).join('/'), top: 0, left: 0 },
//     { input: filename15.split(path.sep).join('/'), top: 0, left: 512 },
//     { input: filename16.split(path.sep).join('/'), top: 0, left: 1024 },
//     { input: filename17.split(path.sep).join('/'), top: 0, left: 1536 },
//     { input: filename24.split(path.sep).join('/'), top: 512, left: 0 },
//     { input: filename25.split(path.sep).join('/'), top: 512, left: 512 },
//     { input: filename26.split(path.sep).join('/'), top: 512, left: 1024 },
//     { input: filename27.split(path.sep).join('/'), top: 512, left: 1536 },
//   ])
//     .toFile(outputImg.split(path.sep).join('/'))
//     .then(info => { console.log(info); })
//     .catch(err => { console.log(err); });
// }
// test();
ImgApi.mergeImg('01005700001311271109375125M');

