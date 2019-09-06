import request from '@/utils/request'
import axios from "axios";

// 保存设备
export function addDevice(data) {
    return request({
        url: '/v1/device/saveDevice',
        method: 'post',
        data
    })
}

// 查询设备
export function findDevice(params) {
    return request({
        url: '/v1/device/findAll',
        method: 'get',
        params,
    })
}

