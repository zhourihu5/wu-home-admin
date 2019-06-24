import request from '@/utils/request'

export function getMenus(params) {
  
    // return  {
    //     data:[
    //         {
    //             id: 1,
    //             name: 'Example',
    //             path: '/example',
    //             redirect: '/example/table',
    //             meta: {
    //                 title: 'Example', icon: 'example' 
    //             },
    //             pid: 0
    //         },
    //         {
    //             id: 2,
    //             name: 'Table',
    //             path: 'table',
    //             redirect: null,
    //             component: "@/views/table/index",
    //             meta: {
    //                 title: 'Table', icon: 'table'
    //             },
    //             pid: 1
    //         },
    //         {
    //             id: 3,
    //             name: 'Tree',
    //             path: 'tree',
    //             redirect: null,
    //             component: "@/views/tree/index",
    //             meta: {
    //                 title: 'Tree', icon: 'tree'
    //             },
    //             pid: 1
    //         },
    //         {
    //             id: 4,
    //             path: '/form',
    //             redirect: null,
    //             component: "Layout",
    //             pid: 0
    //         },
    //         {
    //             id: 5,
    //             name: 'Form',
    //             path: 'index',
    //             redirect: null,
    //             component: "@/views/form/index",
    //             meta: { 
    //                 title: 'Form', icon: 'form' 
    //             },
    //             pid: 4
    //         }
    //     ]
    // }
}

// {
//     path: '/example',
//     component: Layout,
//     redirect: '/example/table',
//     name: 'Example',
//     meta: { title: 'Example', icon: 'example' },
//     children: [
//       {
//         path: 'table',
//         name: 'Table',
//         component: () => import('@/views/table/index'),
//         meta: { title: 'Table', icon: 'table' }
//       },
//       {
//         path: 'tree',
//         name: 'Tree',
//         component: () => import('@/views/tree/index'),
//         meta: { title: 'Tree', icon: 'tree' }
//       }
//     ]
//   },

//   {
//     path: '/form',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: 'Form',
//         component: () => import('@/views/form/index'),
//         meta: { title: 'Form', icon: 'form' }
//       }
//     ]
//   },

//   {
//     path: '/nested',
//     component: Layout,
//     redirect: '/nested/menu1',
//     name: 'Nested',
//     meta: {
//       title: 'Nested',
//       icon: 'nested'
//     },
//     children: [
//       {
//         path: 'menu1',
//         component: () => import('@/views/nested/menu1/index'), // Parent router-view
//         name: 'Menu1',
//         meta: { title: 'Menu1' },
//         children: [
//           {
//             path: 'menu1-1',
//             component: () => import('@/views/nested/menu1/menu1-1'),
//             name: 'Menu1-1',
//             meta: { title: 'Menu1-1' }
//           },
//           {
//             path: 'menu1-2',
//             component: () => import('@/views/nested/menu1/menu1-2'),
//             name: 'Menu1-2',
//             meta: { title: 'Menu1-2' },
//             children: [
//               {
//                 path: 'menu1-2-1',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//                 name: 'Menu1-2-1',
//                 meta: { title: 'Menu1-2-1' }
//               },
//               {
//                 path: 'menu1-2-2',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//                 name: 'Menu1-2-2',
//                 meta: { title: 'Menu1-2-2' }
//               }
//             ]
//           },
//           {
//             path: 'menu1-3',
//             component: () => import('@/views/nested/menu1/menu1-3'),
//             name: 'Menu1-3',
//             meta: { title: 'Menu1-3' }
//           }
//         ]
//       },
//       {
//         path: 'menu2',
//         component: () => import('@/views/nested/menu2/index'),
//         meta: { title: 'menu2' }
//       }
//     ]
//   },

//   {
//     path: 'external-link',
//     component: Layout,
//     children: [
//       {
//         path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
//         meta: { title: 'External Link', icon: 'link' }
//       }
//     ]
//   },

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }