import request from '@/utils/request'

// 获取消息列表
export function getMessageAll(params) {
    return request({
        url: '/v1/message/findAll',
        method: 'get',
        params,
    })
}

// 推送消息
export function pushMessage(data) {
    return request({
        url: '/v1/message/pushMessage',
        method: 'post',
        data: data,
    })
}