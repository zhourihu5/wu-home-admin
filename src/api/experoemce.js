import request from '@/utils/request'

// 保存体验券
export function addExperoemce(data) {
    return request({
        url: '/v1/experience/save',
        method: 'post',
        data
    })
}

// 查询体验券
export function findExperoemce(params) {
    return request({
        url: '/v1/experience/list',
        method: 'get',
        params,
    })
}

// 删除体验券
export function removeExperoemce(data) {
    return request({
        url: '/v1/experience/remove',
        method: 'post',
        data,
    })
}

// 上架/下架体验券
export function updateIsShow(data) {
    return request({
        url: '/v1/experience/updateIsShow',
        method: 'post',
        data,
    })
}

// 获取体验卷领取人列表
export function receiveUserList(params) {
    return request({
        url: '/v1/experience/receiveUserList',
        method: 'get',
        params,
    })
}

