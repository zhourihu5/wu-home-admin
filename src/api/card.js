import request from '@/utils/request'
import { deepCopy } from '@/utils/base'
import qs from 'qs'

// 获取首页卡片数据
export function getHomeCardAll(params) {
    return request({
        url: '/v1/card/list',
        method: 'get',
        params,
    })
}

// 添加卡片
export function addCard(data) {
    return request({
        url: '/v1/card/save',
        method: 'post',
        data: data,
    })
}

// 获取内链卡片模块
export function getModule(params) {
    return request({
        url: '/v1/card/module',
        method: 'get',
        params,
    })
}

// 停止推送
export function removePush(data) {
    return request({
        url: '/v1/card/remove',
        method: 'post',
        data: data,
    })
}










export function getCardList(page) {
    console.log("page --- >", page);
    return new Promise(function (resolve, reject) {
        let data = {
            code: 0,
            isNext: true,
            data: [
                {
                    id: 1,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 2,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://img.pchouse.com.cn/images/upload/upc/tx/houselib/1503/19/c6/4119994_1426770572040_690x460.jpg'
                },
                {
                    id: 3,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559629733919&di=a3b971a389e81c3f46e90f876357770e&imgtype=0&src=http%3A%2F%2Fimg153.ph.126.net%2F086QXcgyxfmPS3CXdYjNgg%3D%3D%2F1644658288921583413.jpg'
                },
                {
                    id: 4,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559629733919&di=4f931386c5e9726301f32fd3058c22e4&imgtype=0&src=http%3A%2F%2Fs2.sinaimg.cn%2Fbmiddle%2F537ea6ae463ce1f404e31'
                },
                {
                    id: 5,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 6,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 7,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 1,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 8,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 9,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                },
                {
                    id: 10,
                    title: '每日优先',
                    content: '让生活更美好',
                    icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
                }
            ]
        }
        if (page.pageNum == 1) {
            resolve(data)
        } else {
            if (page.pageNum < 3) {
                let newData = deepCopy(data);
                let result = newData.data.map(function (v, i, a) {
                    v.id = v.id * page.pageNum * 10;
                    return v
                })
                newData.isNext = false;
                newData.data = result;
                resolve(newData)
            } else {
                data.isNext = false;
                data.data = [];
                resolve(data);
            }
        }
    })
}