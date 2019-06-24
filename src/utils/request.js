import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

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
    // do something before request is sent
    console.log("config -- ", config)
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    // console.log("config --- >", config)
    return config
  },
  error => {
    console.log("process.env.VUE_APP_BASE_API -- ", process.env.VUE_APP_BASE_API)
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log("res --- >", res);
    return res;
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(res.message || 'error')
    // } else {
    //   return res
    // }
  },
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
            Message({
              message: '登录过期，请重新登录' || 'error',
              type: 'error',
              onClose: function () {
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
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    }
  }
)

export default service
