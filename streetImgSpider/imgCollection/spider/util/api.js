'use strict';
const Axios = require('axios');


// 百度地图鉴权token
const authToken = 'CMdXcONx9PNSdVz5ZP2=Tw8Ia4vKQKD7uxLxVTBxxERtDpnSCE@@By1uVt1GgvPUDZYOYIZuVt1cv3uVtGccZcuVtPWv3GuztQZ3wWvUvhgMZSguxzBEHLNRTVtcEWe1GD8zv7u@ZPuVteuztexZFTHrwzDvqs2osGIVIdbLII3@Flp55C@BrZZWuz';

// 获取路信息 根据坐标
const UrlHasStreetInfo = 'https://mapsv0.bdimg.com/';
const UrlGetImg = 'https://mapsv0.bdimg.com/';

/**
 * 根据dbmc获得 对应街景id
 * @param {*} X dnmc经度
 * @param {*} Y 纬度
 * @return {Array} 返回xy 的数组
 */
async function getRoadInfoByXY(X, Y) {
  try {
    const params = {
      udt: '20200825',
      qt: 'qsdata', // 猜测 请求类型
      x: X,
      y: Y,
      l: 16,
      action: 0,
      mode: 'day',
      t: (Date.now()),
      auth: authToken,
    };
    const result = await Axios.get(UrlHasStreetInfo, {
      params,
      headers: {
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
        Accept: '*/*',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Dest': 'script',
        Referer: 'https://map.baidu.com/',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });
    if (result.data.content) {
      return result.data.content.id;
    }
    return '';

  } catch (error) {
    console.log(error);
    return '';
  }

}

/**
 * 根据SID获得信息（包含时间）
 * @param {*} id 百度街景的Sid
 * @return {*} 时间符合规则 返回时间不符合返回false
 */
async function getRoadDetalInfoById(id) {

  const params = {
    qt: 'sdata',
    sid: id,
    pc: 1,
    auth: authToken,
    udt: 20200825,
  };
  const result = await Axios.get(UrlHasStreetInfo, {
    params,
    headers: {
      Connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
      Accept: '*/*',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Dest': 'script',
      Referer: 'https://map.baidu.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
  });
  if (result.data.content[0] && typeof result.data.content[0].Time === 'string') {

    return result.data.content[0].Time.substring(0, 4) >= 2019 ? result.data.content[0].Time : false;
  }
  return false;

}

// 获取具体位置图像
// const frontArrs = [ '1_0', '1_1', '1_2', '1_3', '1_4', '1_5', '1_7', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7' ];

async function getImageByIdPos(id, pos) {
  const params = {
    qt: 'pdata',
    sid: id,
    pos,
    z: 4,
    auth: authToken,
    udt: 20200825,
  };
  const result = await Axios.get(UrlGetImg, {
    params,
    headers: {
      Connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
      Accept: '*/*',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Dest': 'script',
      Referer: 'https://map.baidu.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    responseType: 'stream', // 使用返回的数据是字节流的形式。
  });
  return { pos, data: result.data };
}


module.exports = { getRoadInfoByXY, getRoadDetalInfoById, getImageByIdPos }
;
