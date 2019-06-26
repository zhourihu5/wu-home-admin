import request from '@/utils/request'

// 获取屏保列表
export function getScreemAll(params) {
    return request({
        url: '/v1/screen/findAll',
        method: 'get',
        params,
    })
}

// 保存屏保
export function addScreen(data) {
    return request({
        url: '/v1/screen/saveScreen',
        method: 'post',
        data
    })
}
