import request from '@/utils/request'

// 获取省
export function getAreas(params) {
  return request({
    url: '/v1/area/findArea',
    method: 'get',
    params
  })
}

export function getAreasAll(params) {
  return request({
    url: '/v1/area/findProByPid',
    method: 'get',
    params
  })
}
