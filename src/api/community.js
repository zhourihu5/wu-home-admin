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
export async function getCommuntityByArea(params) {
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

// 获取每层下的家庭
export function getFamilyByStoreyCode(params) {
    return request({
        url: '/v1/family/getFamilyByStoreyCode',
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

// 绑定用户和家庭关系  (提供物业管理员用)
export function addUserAndFamilyNew(data) {
    return request({
        url: 'v1/family/addUserAndFamilyNew',
        method: 'post',
        data,
    })
}

// 编辑用户和家庭关系
export function updateUserAndFamilyNew(data) {
    return request({
        url: '/v1/family/updateUserAndFamilyNew',
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

export function getByIssue(params) {
    return request({
        url: '/v1/district/findByCode',
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

// 查询单元下所有层
export function getStoreyAll(params) {
    return request({
        url: ' /v1/storey/findAll',
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

// 获取家庭的绑定信息
export function findBindInfo(params) {
    return request({
        url: '/v1/family/bindInfo',
        method: 'get',
        params
    })
}

// 保存社区黄页
export function addCommondityInfo(data) {
    return request({
        url: '/v1/communtity/saveCommondityInfo',
        method: 'post',
        data
    })
}

// 根据社区查询黄页
export function getComInfoList(params) {
    return request({
        url: '/v1/communtity/getComInfoList',
        method: 'get',
        params
    })
}

// 删除社区黄页
export function deleteCommondityInfo(params) {
    return request({
        url: '/v1/communtity/removeCommondityInfo',
        method: 'get',
        params
    })
}

// 根据登录用户查询社区
export function getAllByFlag(params) {
    return request({
        url: '/v1/communtity/findAllByFlag',
        method: 'get',
        params
    })
}

// 批量导入城市家园社区用户与家庭
export function batchBinding(data) {
    return request({
        url: '/v1/family/admin',
        method: 'post',
        data
    })
}



