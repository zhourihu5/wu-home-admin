import request from '@/utils/request'

// 获取首页卡片数据
export function getSystemAll(params) {
    return request({
        url: '/v1/system/list',
        method: 'get',
        params,
    })
}
