'use strict';
const fs = require('fs');
const path = require('path');
const Sharp = require('sharp');


async function saveImg(id, pos, data) {
  const fileName = path.resolve(__dirname, '../originImg', `${id}_${pos}.jpeg`);
  const wStream = fs.createWriteStream(fileName);
  data.pipe(wStream);

  data.on('end', () => {
    wStream.end();
  });
  const result = await new Promise((resolve, reject) => {
    wStream.on('finish', () => {

      resolve(true);
    });
    wStream.on('error', reject);


  });
  return result;
}


async function mergeImgF(id) {
  console.log('开始合并前视图， id：', id);
  const filename14 = path.resolve(__dirname, '../originImg', `${id}_${'1_4'}.jpeg`);
  const filename15 = path.resolve(__dirname, '../originImg', `${id}_${'1_5'}.jpeg`);
  const filename16 = path.resolve(__dirname, '../originImg', `${id}_${'1_6'}.jpeg`);
  const filename17 = path.resolve(__dirname, '../originImg', `${id}_${'1_7'}.jpeg`);
  const filename24 = path.resolve(__dirname, '../originImg', `${id}_${'2_4'}.jpeg`);
  const filename25 = path.resolve(__dirname, '../originImg', `${id}_${'2_5'}.jpeg`);
  const filename26 = path.resolve(__dirname, '../originImg', `${id}_${'2_6'}.jpeg`);
  const filename27 = path.resolve(__dirname, '../originImg', `${id}_${'2_7'}.jpeg`);
  const outputImg = path.resolve(__dirname, '../mergeImg', `${id}_F.jpeg`);
  const base = Sharp({
    create: {
      width: 2048,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  const result = base.composite([
    { input: filename14.split(path.sep).join('/'), top: 0, left: 0 },
    { input: filename15.split(path.sep).join('/'), top: 0, left: 512 },
    { input: filename16.split(path.sep).join('/'), top: 0, left: 1024 },
    { input: filename17.split(path.sep).join('/'), top: 0, left: 1536 },
    { input: filename24.split(path.sep).join('/'), top: 512, left: 0 },
    { input: filename25.split(path.sep).join('/'), top: 512, left: 512 },
    { input: filename26.split(path.sep).join('/'), top: 512, left: 1024 },
    { input: filename27.split(path.sep).join('/'), top: 512, left: 1536 },
  ])
    .toFile(outputImg.split(path.sep).join('/'))
    .catch(err => {
      console.log('前视图合并失败。。。', err);
      return err;
    });

  return result;
}

async function mergeImgE(id) {
  console.log('开始合并后视图， id：', id);
  const filename10 = path.resolve(__dirname, '../originImg', `${id}_${'1_0'}.jpeg`);
  const filename11 = path.resolve(__dirname, '../originImg', `${id}_${'1_1'}.jpeg`);
  const filename12 = path.resolve(__dirname, '../originImg', `${id}_${'1_2'}.jpeg`);
  const filename13 = path.resolve(__dirname, '../originImg', `${id}_${'1_3'}.jpeg`);
  const filename20 = path.resolve(__dirname, '../originImg', `${id}_${'2_0'}.jpeg`);
  const filename21 = path.resolve(__dirname, '../originImg', `${id}_${'2_1'}.jpeg`);
  const filename22 = path.resolve(__dirname, '../originImg', `${id}_${'2_2'}.jpeg`);
  const filename23 = path.resolve(__dirname, '../originImg', `${id}_${'2_3'}.jpeg`);
  const outputImg = path.resolve(__dirname, '../mergeImg', `${id}_E.jpeg`);

  const base = Sharp({
    create: {
      width: 2048,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  const result = await base.composite([
    { input: filename10.split(path.sep).join('/'), top: 0, left: 0 },
    { input: filename11.split(path.sep).join('/'), top: 0, left: 512 },
    { input: filename12.split(path.sep).join('/'), top: 0, left: 1024 },
    { input: filename13.split(path.sep).join('/'), top: 0, left: 1536 },
    { input: filename20.split(path.sep).join('/'), top: 512, left: 0 },
    { input: filename21.split(path.sep).join('/'), top: 512, left: 512 },
    { input: filename22.split(path.sep).join('/'), top: 512, left: 1024 },
    { input: filename23.split(path.sep).join('/'), top: 512, left: 1536 },
  ])
    .toFile(outputImg.split(path.sep).join('/'))
    .catch(err => {
      console.log('后视图合并失败。。。', err);
      return err;
    });

  return result;
}

async function mergeImg(id) {
  try {
    const f = mergeImgF(id);
    const e = mergeImgE(id);

    const result = await Promise.all([ f, e ]);
    return result;
  } catch (e) {
    return e;
  }
}
module.exports = { saveImg, mergeImg };
