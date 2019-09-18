import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from "@/router"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
  // baseURL: "192.168.1.141:8081",
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log("process.env.VUE_APP_BASE_API -- ", process.env.VUE_APP_BASE_API)
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log("response --- >", response)
    const res = response.data
    return res;
  },
  error => {
    console.log("异常- - 》", error)
    if (error.response) {
      if (error.response.status) {
        switch (error.response.status) {
          case 500:
            if (error.response.data.code == 500) {
              if(error.response.data.message == "类名不存在或执行表达式错误") {
                Message({
                  message: '定时任务的开始时间必须大于当前时间',
                  type: 'error',
                  duration: 2 * 1000
                })
              } else {
                Message({
                  message: error.response.data.message || 'error',
                  type: 'error',
                  duration: 2 * 1000
                })
              }
            }
            break;
          case 403:
            console.log("dddd")
            Message({
              message: '登录过期，请重新登录' || 'error',
              type: 'error',
              duration: 2 * 1000,
              onClose: function () {
                store.dispatch('user/logout')
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                });
              },
              duration: 2 * 1000
            })
            break;
          case 404:
            Message({
              message: '网络请求不存在' || 'error',
              type: 'error',
              duration: 2 * 1000
            })
            break;
          default:
            Message({
              message: '系统异常、请重新登录' || 'error',
              type: 'error',
              duration: 2 * 1000,
              onClose: function () {
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                });
              }
            })
        }
      }
    } else {
      Message({
        message: '系统接口异常,请联系管理员' || 'error',
        type: 'error',
        duration: 2 * 1000
      })
      // router.replace({
      //   path: '/login',
      //   query: {
      //     redirect: router.currentRoute.fullPath
      //   }
      // });
    }
  }
)

export default service
