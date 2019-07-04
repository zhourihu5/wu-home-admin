import request from '@/utils/request'

// 获取轮播图类型
export function getBannerType(params) {
    return request({
        url: '/v1/banner/findBannerTypeList',
        method: 'get',
        params
    })
}

// 根据type获取轮播图
export function getBannerAll(params) {
    return request({
        url: '/v1/banner/findAll',
        method: 'get',
        params
    })
}

// 保存
export function addBanner(data) {
    return request({
        url: '/v1/banner/saveBanner',
        method: 'post',
        data: data,
    })
}


