// GCJ02转百度坐标db09ll=======================================
'use strict';
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
function marsTobaidu(mars_point) {
  const baidu_point = { x: 0, y: 0 };
  const x = mars_point.x;
  const y = mars_point.y;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  baidu_point.x = z * Math.cos(theta) + 0.0065;
  baidu_point.y = z * Math.sin(theta) + 0.006;
  return baidu_point;
}

// 百度db09ll转百度db9mc=========================================
const LLBAND = [ 75, 60, 45, 30, 15, 0 ];
const LL2MC = [
  [ -0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5 ],
  [ 0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5 ],
  [ 0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5 ],
  [ 0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5 ],
  [ -0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5 ],
  [ -0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45 ],
];
function getRange(cC, cB, T) {
  if (cB != null) {
    cC = Math.max(cC, cB);
  }
  if (T != null) {
    cC = Math.min(cC, T);
  }
  return cC;
}
function getLoop(cC, cB, T) {
  while (cC > T) {
    cC -= T - cB;
  }
  while (cC < cB) {
    cC += T - cB;
  }
  return cC;
}
function convertor(cC, cD) {
  if (!cC || !cD) {
    return null;
  }
  let T = cD[0] + cD[1] * Math.abs(cC.x);
  const cB = Math.abs(cC.y) / cD[9];
  let cE = cD[2] + cD[3] * cB + cD[4] * cB * cB +
        cD[5] * cB * cB * cB + cD[6] * cB * cB * cB * cB +
        cD[7] * cB * cB * cB * cB * cB +
        cD[8] * cB * cB * cB * cB * cB * cB;
  T *= (cC.x < 0 ? -1 : 1);
  cE *= (cC.y < 0 ? -1 : 1);
  return [ T, cE ];
}
function convertLL2MC(T) {
  let cD,
    cC,
    len;
  T.x = getLoop(T.x, -180, 180);
  T.y = getRange(T.y, -74, 74);
  const cB = T;
  for (cC = 0, len = LLBAND.length; cC < len; cC++) {
    if (cB.y >= LLBAND[cC]) {
      cD = LL2MC[cC];
      break;
    }
  }
  if (!cD) {
    for (cC = LLBAND.length - 1; cC >= 0; cC--) {
      if (cB.y <= -LLBAND[cC]) {
        cD = LL2MC[cC];
        break;
      }
    }
  }
  const cE = convertor(T, cD);
  return cE;
}

/**
 * 国测局左边转百度摩卡拖坐标
 * @param {Number} x 火星坐标
 * @param {Number} y 火星坐标
 * @return {Array} 返回百度莫卡托坐标数组
 */
function mars2DBMC(x, y) {
  const bd09XY = marsTobaidu({ x, y });
  //   return convertLL2MC({ x: bd09XY.x, y: bd09XY.y });
  return convertLL2MC(bd09XY);
}


// ==================================================================================
/**
 * 经纬度转距离
 * @param {Object} p1 {lng:x,lat:y } 经纬度
 * @param {Object} p2 {lng:x,lat:y } 经纬度
 */
function getDistance(p1, p2) { // 角度转换为弧度
  const getRad = function(d) {
    return d * Math.PI / 180.0;
  };
  const radLat1 = getRad(p1.lat);
  const radLat2 = getRad(p2.lat);

  const a = radLat1 - radLat2;// 纬度弧度差值
  const b = getRad(p1.lng) - getRad(p2.lng);// 经度弧度差值
  const Haversin = function(c) {
    const v = Math.sin(c / 2);
    return Math.pow(v, 2);
  };
  // 半正矢公式（Haversine公式)
  const h = Haversin(a) + Math.cos(radLat1) * Math.cos(radLat2) * Haversin(b);
  // var distance = 2 * 6378137 * Math.asin(Math.sqrt(h));
  let distance = 2 * 6371393 * Math.asin(Math.sqrt(h));
  distance = Math.round(distance * 10000) / 10000.0;
  return distance;
}


/**
 * 坐标段转成15米一个的坐标点集合  输入国测局坐标
 * @param {*} p1  {lng:x,lat:y } 经纬度 作为起始点
 * @param {*} p2  {lng:x,lat:y } 经纬度 作为结束点
 * @param {*} splitLength  分割距离 30米左右 非精确值
 * @return {Array} 返回分割后国测局 坐标数组 数组项为 经纬度坐标数组
 */
function coordinatesSplit(p1, p2, splitLength = 30) {

  const distance = getDistance(p1, p2);

  const divisionsCount = Number((distance / splitLength).toFixed()); // 中间点的数量
  // 经度总差值
  const x = p2.lng - p1.lng;
  // 纬度总差值
  const y = p2.lat - p1.lat;
  // 每段经度差值 一刀砍两段
  const addX = x / (divisionsCount + 1);
  // 每段纬度度差值
  const addY = y / (divisionsCount + 1);
  const result = [];
  for (let i = 0; i <= divisionsCount; i++) {
    // const item = mars2DBMC((p1.lng + addX * i), (p1.lat + addY * i));
    result.push([ p1.lng + addX * i, p1.lat + addY * i ]);
    // result.push(item);
  }
  // result.push(mars2DBMC((p2.lng), (p2.lat)));
  result.push([ p2.lng, p2.lat ]);
  return result;
}

module.exports = { mars2DBMC, coordinatesSplit };
