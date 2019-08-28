import request from '@/utils/request'

// 保存优惠券
export function addCoupon(data) {
    return request({
        url: '/v1/coupon/save',
        method: 'post',
        data
    })
}

// 查询优惠券
export function findCouponList(params) {
    return request({
        url: '/v1/coupon/list',
        method: 'get',
        params,
    })
}

// 删除优惠券
export function removeCoupon(data) {
    return request({
        url: '/v1/coupon/remove',
        method: 'post',
        data,
    })
}

// 修改优惠券状态
export function updateStatus(data) {
    return request({
        url: '/v1/coupon/updateStatus',
        method: 'post',
        data,
    })
}


