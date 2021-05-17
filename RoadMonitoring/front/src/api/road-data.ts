import request from '@/util/request';

// class RoadDataService
export function getRoadObserveData(cityId:number, date:string) :Promise<any> {
  const result = request({
    method: 'get',
    url: '/roadinfo/monitorData',
    params: {
      cityId,
      date, // yyyy-mm-dd
    },
  });
  return result;
}
export function getAllCityData():Promise<any> {
  const result = request({
    method: 'get',
    url: '/city-code-info/allcity',
  });
  return result;
}
