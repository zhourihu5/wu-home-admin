import request from '@/utils/request'


// 获取服务列表
export function getServiceAll(params) {
  return request({
    url: '/v1/service/findAll',
    method: 'get',
    params,
  })
}

// 添加服务
export function addService(data) {
  return request({
    url: '/v1/service/addService',
    method: 'post',
    data
  })
}

// 获取应用审核专区列表
export function getApplicationAudit() {
  return new Promise(function (resolve, reject) {
    let data = {
      code: 0,
      data: [
        {
          id: 1,
          applyName: '每日优先',
          classify: '生鲜',
          serviceName: '北京XX公司',
          layering: '5%',
          product: 'APP',
          sheifTime: '2019年5月5日',
          state: '审核通过'
        },
        {
          id: 2,
          applyName: '今日头条',
          classify: '新闻',
          serviceName: '北京XX公司',
          layering: '6%',
          product: 'H5',
          sheifTime: '2019年4月5日',
          state: '提交待审核'
        },
        {
          id: 3,
          applyName: '爱回收',
          classify: '维修',
          serviceName: '北京XX公司',
          layering: '2%',
          product: 'H5',
          sheifTime: '2019年9月6日',
          state: '缺少资料'
        },
        {
          id: 4,
          applyName: '乱世王者',
          classify: '游戏',
          serviceName: '北京XX公司',
          layering: '9%',
          product: 'APP',
          sheifTime: '2019年3月6日',
          state: '审核未通过'
        }
      ]
    }
    resolve(data)
  })
}