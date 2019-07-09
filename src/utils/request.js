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
    console.log("config -- ", config)
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
    const res = response.data
    return res;
Í  },
  error => {
    if (error.response) {
      if (error.response.status) {
        switch (error.response.status) {
          case 500:
            console.log(error.response.data);
            if (error.response.data.code == 500) {
              Message({
                message: error.response.data.message || 'error',
                type: 'error',
                duration: 5 * 1000
              })
            }
            break;
          case 403:
            console.log("dddd")
            Message({
              message: '登录过期，请重新登录' || 'error',
              type: 'error',
              onClose: function () {
                store.dispatch('user/logout')
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath
                  }
                });
              },
              duration: 5 * 1000
            })
            break;
          case 404:
            Message({
              message: '网络请求不存在' || 'error',
              type: 'error',
              duration: 5 * 1000
            })
            break;
          default:
            Message({
              message: '系统异常、请重新登录' || 'error',
              type: 'error',
              duration: 5 * 1000,
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
        duration: 5 * 1000
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
