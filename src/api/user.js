import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login/checking',
    method: 'post',
    data
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/v1/user/findUserInfoByName',
    method: 'get',
    params
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/v1/user/addUser',
    method: 'post',
    data
  })
}

// 获取用户名称是否存在 
export function getUserByUserName(params) {
  return request({
    url: '/v1/user/getUserByUserName',
    method: 'get',
    params
  })
}

// 删除用户
export function removeUser(data) {
  return request({
    url: '/v1/user/delUser',
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList() {
  return new Promise(function (resolve, reject) {
    let data = {
      code: 0,
      data: [
        {
          id: 1,
          roleName: '管理员',
          createTime: '2019年5月3日',
          addUser: 'admin',
        },
        {
          id: 2,
          roleName: '编辑',
          createTime: '2019年5月5日',
          addUser: 'admin',
        },
        {
          id: 3,
          roleName: '运营',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 4,
          roleName: '产品',
          createTime: '2019年5月2日',
          addUser: 'admin',
        },
        {
          id: 5,
          roleName: '技术',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 6,
          roleName: '编辑1',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 7,
          roleName: '编辑2',
          createTime: '2019年5月0日',
          addUser: 'admin',
        },
        {
          id: 8,
          roleName: '运营1',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 9,
          roleName: '运营2',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 10,
          roleName: '市场专员',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 11,
          roleName: '市场扩展',
          createTime: '2019年5月9日',
          addUser: 'admin',
        },
        {
          id: 12,
          roleName: '财务',
          createTime: '2019年6月9日',
          addUser: 'admin',
        },
      ]
    }
    resolve(data)
  })
}

// 获取权限列表
export function getPermission() {
  return new Promise(function (resolve, reject) {
    let data = {
      code: 0,
      data: [
        {
          id: 1,
          path: '/service',
          component: 'Layout',
          name: 'Service',
          redirect: '/service/find',
          meta: { title: 'service', icon: 'star' },
          pid: 0
        },
        {
          id: 2,
          redirect: null,
          path: 'discover',
          name: 'Discover',
          component: 'service/discover/index',
          meta: { title: 'discover', icon: '' },
          pid: 1
        },
        {
          id: 3,
          redirect: null,
          path: 'affair',
          name: 'Affair',
          component: 'service/affair/index',
          meta: { title: 'affair', icon: '' },
          pid: 1
        },
        {
          id: 4,
          redirect: null,
          path: 'subscribe',
          name: 'Subscribe',
          component: 'service/subscribe/index',
          meta: { title: 'subscribe', icon: '' },
          pid: 1
        },
        {
          id: 5,
          redirect: null,
          path: 'index',
          name: 'Index',
          component: 'service/index/index',
          meta: { title: 'serviceIndex', icon: '' },
          pid: 1
        },
        {
          id: 6,
          path: '/operate',
          component: 'Layout',
          name: 'Operate',
          redirect: '/operate/screen',
          meta: { title: 'operate', icon: 'international' },
          pid: 0
        },
        {
          id: 7,
          redirect: null,
          path: 'screen',
          name: 'Screen',
          component: 'operate/screen/index',
          meta: { title: 'screen', icon: '' },
          pid: 6
        },
        {
          id: 8,
          redirect: null,
          path: 'homeCard',
          name: 'HomeCard',
          component: 'operate/homeCard/index',
          meta: { title: 'homeCard', icon: '' },
          pid: 6
        },
        {
          id: 9,
          path: '/news',
          component: 'Layout',
          name: 'News',
          redirect: '/news/property',
          meta: { title: 'news', icon: 'message' },
          pid: 0
        },
        {
          id: 10,
          redirect: null,
          path: 'property',
          name: 'Property',
          component: 'news/property/index',
          meta: { title: 'property', icon: '' },
          pid: 9
        },
        {
          id: 11,
          redirect: null,
          path: 'systemNews',
          name: 'SystemNews',
          component: 'news/system/index',
          meta: { title: 'systemNews', icon: '' },
          pid: 9
        },
        {
          id: 12,
          redirect: null,
          path: 'community',
          name: 'Community',
          component: 'news/community/index',
          meta: { title: 'community', icon: '' },
          pid: 9
        },
        {
          id: 13,
          path: '/system',
          component: 'Layout',
          name: 'System',
          redirect: '/system/up',
          meta: { title: 'system', icon: 'nested' },
          pid: 0
        },
        {
          id: 14,
          redirect: null,
          path: 'up',
          name: 'Up',
          component: 'system/up/index',
          meta: { title: 'up', icon: '' },
          pid: 13
        },
        {
          id: 15,
          path: '/user',
          component: 'Layout',
          name: 'User',
          redirect: '/user/index',
          meta: { title: 'user', icon: 'user' },
          pid: 0
        },
        {
          id: 16,
          redirect: null,
          path: 'index',
          name: 'Index',
          component: 'user/index/index',
          meta: { title: 'userIndex', icon: '' },
          pid: 15
        },
        {
          id: 17,
          redirect: null,
          path: 'permission',
          name: 'Permission',
          component: 'user/permission/index',
          meta: { title: 'permission', icon: '' },
          pid: 15
        },
        {
          id: 18,
          redirect: null,
          path: 'role',
          name: 'Role',
          component: 'user/role/index',
          meta: { title: 'role', icon: '' },
          pid: 15
        },
        {
          id: 19,
          path: '/advert',
          component: 'Layout',
          name: 'Advert',
          redirect: '/advert/index',
          meta: { title: 'advert', icon: 'example' },
          pid: 0
        },
        {
          id: 20,
          redirect: null,
          path: 'push',
          name: 'Push',
          component: 'advert/push/index',
          meta: { title: 'push', icon: '' },
          pid: 19
        },
        {
          id: 21,
          redirect: null,
          path: 'index',
          name: 'Index',
          component: 'advert/index/index',
          meta: { title: 'advertIndex', icon: '' },
          pid: 19
        },
      ]
    }
    resolve(data)
  })
}
