import request from '@/utils/request'

// 活动列表
export function getActivityAll(params) {
    return request({
        url: '/v1/activity/list',
        method: 'get',
        params
    })
}

// 上架下架
export function modityIsShow(params) {
    return request({
        url: '/v1/activity/modityIsShow',
        method: 'get',
        params
    })
}

// 保存活动
export function saveActivity(data) {
    return request({
        url: '/v1/activity/save',
        method: 'post',
        data
    })
}

// 商品标签列表
export function getLablesAll(params) {
    return request({
        url: '/v1/lables/list',
        method: 'get',
        params
    })
}

// 商品标签添加
export function addLables(data) {
    return request({
        url: '/v1/lables/save',
        method: 'post',
        data
    })
}

// 保存商品
export function addCommodity(data) {
    return request({
        url: '/v1/commodity/save',
        method: 'post',
        data
    })
}

// 查询商品
export function getCommodityAll(params) {
    return request({
        url: '/v1/commodity/list',
        method: 'get',
        params
    })
}

// 查询订单列表
export function getOrderAll(params) {
    return request({
        url: '/v1/order/list',
        method: 'get',
        params
    })
}







