import { constantRoutes } from '@/router'
import { formatRoutes } from './../../utils/base'
const state = {
    routes: [],
    addRoutes: [],
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SET_MENUS: (state, menus) => {
        state.menus = menus;
    }
}

const actions = {
    // 获取菜单数据
    getMenus({ commit }, menus) {
        return new Promise((resolve, reject) => {
            // console.log("menus -- ", menus)
            let accessedRouters = formatRoutes(menus); // 处理菜单信息
            commit('SET_ROUTES', accessedRouters) // 更新state中的菜单信息
            resolve(accessedRouters)
        }).catch(error => {
            reject(error)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}