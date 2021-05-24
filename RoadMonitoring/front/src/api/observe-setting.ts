import request from '@/util/request';

interface DataType {
    id?: number;
    CityId: number;
    CityName: string;
    MonitorFluctuationRange: number;
    MonitorTimeEnd: string;
    MonitorTimeStart: string;
  }
export function getAllSetting() :Promise<any> {
  const result = request({
    method: 'get',
    url: '/setting',
  });
  return result;
}

export function addNewSttiong(data:DataType):Promise<any> {
  const result = request({
    method: 'post',
    url: '/setting',
    data,
  });
  return result;
}
export function updateSetting(data:DataType):Promise<any> {
  const result = request({
    method: 'put',
    url: '/setting',
    data,
  });
  return result;
}

export function deleteSttiongById(id:number):Promise<any> {
  const result = request({
    method: 'delete',
    url: `/setting/${id}`,
  });
  return result;
}
// export default { getRoadObserveData, getAllCityData };
