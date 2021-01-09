'use strict'
const Axios = require('axios')
// 百度地图鉴权token
const authToken = 'QJJJMcUNGR1zDgXx%403LxTAKEvWUORI%3DyuxLVRNNRHTHtykiOxAXXwy1uVt1GgvPUDZYOYIZuVt1cv3uztHee%40ewWvPWv3GuRtVcOC%40BUvhgMZSguxzBEHLNRTVtcEWe1GD8zv7u%40ZPuVtcvY1SGpuxztpFcEegvcguxLVRNNLTLxtfiKKv7urZZWuB'

// 获取路信息 根据坐标
const UrlHasStreetInfo = 'https://mapsv0.bdimg.com/'
const UrlGetImg = 'https://mapsv0.bdimg.com/'

/**
 * 根据dbmc获得 对应街景id
 * @param {*} X 
 * @param {*} Y 
 * @return 返回
 */
async function getRoadInfoByXY(X, Y) {
    try {
        const params = {
            udt: '20200825',
            qt: 'qsdata',//猜测 请求类型
            x: X,
            y: Y,
            l: 16,
            action: 0,
            mode: 'day',
            t: (Date.now()),
            auth: authToken
        }
        let result = await Axios.get(UrlHasStreetInfo, {
            params: params,
            headers: {
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
                'Accept': '*/*',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'script',
                'Referer': 'https://map.baidu.com/',
                'Accept-Language': 'zh-CN,zh;q=0.9'
            }
        })
        if (result.data.content) {
            return result.data.content.id
        } else {
            return ''
        }
    } catch (error) {
        console.log(error)
        return ''
    }

}

/**
 * 根据SID获得信息（包含时间）
 * @param {*} id 
 */
async function getRoadDetalInfoById(id) {

    const params = {
        qt: 'sdata',
        sid: id,
        pc: 1,
        auth: authToken,
        udt: 20200825
    }
    let result = await Axios.get(UrlHasStreetInfo, {
        params: params,
        headers: {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
            'Accept': '*/*',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Dest': 'script',
            'Referer': 'https://map.baidu.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9'
        }
    })
    if (result.data.content[0] && typeof result.data.content[0].Time === 'string') {
        return result.data.content[0].Time.substring(0, 4) >= 2019 ? true : false
    } else {
        return false
    }
}

// 获取前/后图像
function getImageById(id, pos) {
    let frontArrs = ['1_0', '1_1', '1_2', '1_3', '1_4', '1_5', '1_7', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7']
    let params = {
        qt: 'pdata',
        sid: id,
        pos: pos,
        z: 4,
        auth: authToken,
        udt: 20200825
    }
    let result = Axios.get(UrlGetImg, {
        params: params,
        headers: {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
            'Accept': '*/*',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Dest': 'script',
            'Referer': 'https://map.baidu.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9'
        }

    })
    return result.data
}

//

// getInfoByXY('12694958.162865594', '2572923.21752623').then(data => console.log(data))



module.exports = { getRoadInfoByXY, getRoadDetalInfoById }