import request from '@/utils/request'

// 获取版本列表
export function getSystemAll(params) {
    return request({
        url: '/v1/system/list',
        method: 'get',
        params,
    })
}


// 保存版本
export function addVersion(data) {
    return request({
        // url: '/v1/adv/saveAdv',
        url: '/v1/system/save',
        method: 'post',
        data: data,
    })
}
