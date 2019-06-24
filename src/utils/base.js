
import Layout from '@/layout'
// const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
const _import = require('./../../src/router/_import_' + process.env.NODE_ENV)//获取组件的方法

// 将菜单数据转换成树结构数据
export function buildMenus(menus) {
    // console.log("menus - ", menus)
    return createTreeData(menus, '0')
    // 传入的数组有id和父节点pid字段，通过它们的关联构造成一棵或多棵树结构
    function createTreeData(nodes, treeRootPid) {
        var groups = {};
        // 按父节点将节点分组
        for (var i in nodes) {
            if (!groups[nodes[i].pid]) {
                groups[nodes[i].pid] = [];
            }
            groups[nodes[i].pid].push(nodes[i]);
            if (treeRootPid && treeRootPid === nodes[i].id) { // 发现传入的根节点id作为节点id时，将根节点设置为该节点的父节点
                treeRootPid = nodes[i].pid;
            }
        }
        var rootNodes = groups[treeRootPid];
        groups[treeRootPid] = null; // [SAFEGUARD]防止自为父节点或互为父节点（有环图结构）导致的死循环
        function traverseTreeNodeGroup(treeNodeGroup) {
            for (var i in treeNodeGroup) {
                var node = treeNodeGroup[i];
                if (groups[node.id]) {
                    node.children = groups[node.id];
                    groups[node.id] = null; // [SAFEGUARD]防止自为父节点或互为父节点（有环图结构）导致的死循环
                    traverseTreeNodeGroup(node.children);
                }
            }
        }
        traverseTreeNodeGroup(rootNodes);
        return rootNodes;
    }
}

// 格式化菜单树
export function formatRoutes(asyncRouterMap) {
    console.log("asyncRouterMap -- ", asyncRouterMap)
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            // 将数据库中返回component的字符串组件赋值成真正的组件
            if (route.component === 'Layout') {//Layout组件特殊处理
                route.component = Layout
            } else {
                route.component = _import(route.component)
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    // console.log(" --- ", buildMenus(accessedRouters))
    return buildMenus(accessedRouters);
}

// js 对象深copy
export function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        // hasOwnProperty （has o na pao p ti） 判断对象是否包含特定的自身（非继承）属性
        if(obj.hasOwnProperty(key)) {
            if(typeof obj[key] === "object") {
                result[key] = deepCopy(obj[key]); //递归复制
            } else {
                result[key] = obj[key]; 
            }
        }
    }
    return result;
}