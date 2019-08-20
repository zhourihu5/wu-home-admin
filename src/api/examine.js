import request from '@/utils/request'

// 审核列表
export function getApplyAll(params) {
    return request({
        url: '/v1/apply/list',
        method: 'get',
        params
    })
}

// 审核通过
export function audit(params) {
    return request({
        url: '/v1/lock/audit',
        method: 'get',
        params
    })
}
