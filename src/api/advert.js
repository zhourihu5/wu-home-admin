import request from '@/utils/request'

// 获取广告列表
export function getAdvertList(params) {
    return request({
        url: '/v1/adv/findAll',
        method: 'get',
        params
    })
}

// 保存广告
export function addAdver(data) {
    return request({
        url: '/v1/adv/saveAdv',
        method: 'post',
        data: data,
    })

}

// 删除广告
export function deleteAdver(data) {
    return request({
        url: '/v1/adv/delAdv',
        method: 'post',
        data: data,
    })
}

export function getFloorList() {
    return new Promise(function (resolve, reject) {
        let data = {
            code: 0,
            data: [
                {
                    id: 1,
                    name: '1号楼',
                    children: [
                        {
                            id: 101,
                            name: '1单元',
                            children: [
                                {
                                    id: 1011,
                                    name: 101
                                },
                                {
                                    id: 1012,
                                    name: 102
                                },
                                {
                                    id: 1013,
                                    name: 103
                                },
                                {
                                    id: 1014,
                                    name: 104
                                },
                                {
                                    id: 1015,
                                    name: 105
                                },
                                {
                                    id: 1016,
                                    name: 106
                                }
                            ]
                        },
                        {
                            id: 102,
                            name: '2单元',
                        },
                        {
                            id: 103,
                            name: '3单元',
                        },
                        {
                            id: 104,
                            name: '4单元',
                        },
                        {
                            id: 105,
                            name: '5单元',
                        }
                    ]
                },
                {
                    id: 2,
                    name: '2号楼',
                    children: [
                        {
                            id: 201,
                            name: '1单元',
                        },
                        {
                            id: 202,
                            name: '2单元',
                        },
                        {
                            id: 203,
                            name: '3单元',
                        },
                        {
                            id: 204,
                            name: '4单元',
                        },
                        {
                            id: 205,
                            name: '5单元',
                        }
                    ]
                }
            ]
        }
        resolve(data);
    })
}