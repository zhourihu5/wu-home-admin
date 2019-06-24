import request from '@/utils/request'

export function getAdvertList() {
    return new Promise(function (resolve, reject) {
        let data = {
            code: 0,
            data: [
                {
                    id: 1,
                    title: '测试消息1',
                    type: '图片',
                    view: 'http://image.house-keeper.cn/advertisement/2019-04-25/6be68d90-da6a-46ea-8261-906fd9b8f77bWX20190424-12495.png',
                    url: 'https://www.baidu.com/'
                },
                {
                    id: 2,
                    title: '测试消息2',
                    type: '图片',
                    view: 'http://image.house-keeper.cn/advertisement/2019-04-25/6be68d90-da6a-46ea-8261-906fd9b8f77bWX20190424-12495.png',
                    url: 'https://www.baidu.com/'
                },
                {
                    id: 3,
                    title: '测试消息3',
                    type: '图片',
                    view: 'http://image.house-keeper.cn/advertisement/2019-04-25/6be68d90-da6a-46ea-8261-906fd9b8f77bWX20190424-12495.png',
                    url: 'https://www.baidu.com/'
                },
            ]
        }
        resolve(data);
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