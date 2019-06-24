import request from '@/utils/request'

// 获取消息列表
export function getMessageAll(params) {
    return request({
        url: '/v1/message/findAll',
        method: 'get',
        params,
    })
}
