import request from '@/utils/request'

// 保存社区
export function addCommuntity(data) {
    return request({
        url: '/v1/communtity/addCommuntity',
        method: 'post',
        data
    })
}

// 根据ID查询社区
export function getCommuntityById(params) {
    return request({
        url: '/v1/communtity/findById',
        method: 'get',
        params
    })
}



// 获取所有的社区
export function getCommuntityAll(params) {
    return request({
        url: '/v1/communtity/findAll',
        method: 'get',
        params,
    })
}

// 查询区下所属社区
export function getCommuntityByArea(params) {
    return request({
        url: '/v1/communtity/findByArea',
        method: 'get',
        params,
        async: true
    })
}

// 获取所有的楼
export function getFloorAll(params) {
    return request({
        url: '/v1/floor/findAll',
        method: 'get',
        params,
    })
}

// 保存楼
export function addFloor(data) {
    return request({
        url: '/v1/floor/addFloor',
        method: 'post',
        data
    })
}

// 根据社区查询楼
export function getFloorByCommuntity(params) {
    return request({
        url: '/v1/floor/findByFloor',
        method: 'get',
        params,
    })
}

// 添加单元
export function addUnit(data) {
    return request({
        url: '/v1/unit/addUnit',
        method: 'post',
        data
    })
}

// 查询所有单元
export function getUnitAll(params) {
    return request({
        url: '/v1/unit/findAll',
        method: 'get',
        params,
    })

}

// 根据楼宇查询单元
export function getUnitByFloor(params) {
    return request({
        url: '/v1/unit/findByUnit',
        method: 'get',
        params,
    })
}

// 添加家庭
export function addFamily(data) {
    return request({
        url: '/v1/family/addFamily',
        method: 'post',
        data
    })

}

// 查询所有家庭
export function getFamilyAll(params) {
    return request({
        url: '/v1/family/findAll',
        method: 'get',
        params,
    })
}

// 绑定用户和家庭关系
export function addUserAndFamily(data) {
    return request({
        url: '/v1/family/addUserAndFamily',
        method: 'post',
        data,
    })
}

// 删除用户和家庭关系
export function delUserAndFamily(data) {
    return request({
        url: '/v1/family/delUserAndFamily',
        method: 'post',
        data,
    })
}

// 获取家庭下的住户
export function findFamilyUser(params) {
    return request({
        url: '/v1/userFamily/findFamilyUserList',
        method: 'get',
        params,
    })
}

// 添加期
export function addStage(data) {
    return request({
        url: '/v1/issue/addIssue',
        method: 'post',
        data,
    })
}

// 添加区
export function addArea(data) {
    return request({
        url: '/v1/district/addDistrict',
        method: 'post',
        data,
    })
}

// 查询社区下所有区
export function getDistrictByCommuntity(params) {
    return request({
        url: '/v1/district/findByCommuntity',
        method: 'get',
        params
    })
}

// 查询社区下所属期
export function getStageByCommuntity(params) {
    return request({
        url: '/v1/issue/findByCommuntity',
        method: 'get',
        params
    })
}

// 查询社区下所属层
export function getLayerByCommuntity(params) {
    return request({
        url: '/v1/storey/list',
        method: 'get',
        params
    })
}

// 添加层
export function addStorey(data) {
    return request({
        url: '/v1/storey/addStorey',
        method: 'post',
        data
    })
}

// 根据社区查询所有家庭
export function findFamilyListByCode(params) {
    return request({
        url: '/v1/communtity/findFamilyListByCode',
        method: 'get',
        params
    })
}
