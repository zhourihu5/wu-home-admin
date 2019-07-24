import request from '@/utils/request'

// 获取省
export function getAreas(params) {
  return request({
    url: '/v1/area/findArea',
    method: 'get',
    params
  })
}

// 获取所有的省市区
export function getAreasAll(params) {
  return request({
    url: '/v1/area/all',
    method: 'get',
    params
  })
}