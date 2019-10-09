import request from '@/utils/request'
 
// 菜单列表
export function authorityFindAll(params) {
    return request({
        url: '/v1/authority/findAll',
        method: 'get',
        params
    })
}

// 角色列表
export function findRloeList(params) {
    return request({
        url: '/v1/role/findAll',
        method: 'get',
        params
    })
}

// 保存角色 路由
export function saveRoleAuthority(data) {
    return request({
        url: '/v1/roleAuthority/addRoleAuthority',
        method: 'post',
        data
    })
}
