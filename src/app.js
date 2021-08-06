import { createApp } from 'vue'
import store from './store'
import socket from './utils/socket.js'
import './app.less'

const App = createApp({
  onShow (options) {
      socket.webSocketCon()
  },
  onHide (options) {
    socket.pageOnHide()
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(store)
App.config.globalProperties.$socket = socket

// socket 连接
// setTimeout(() => {

  
// }, 2000);


const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})

// 新版本下载失败
updateManager.onUpdateFailed(function () {
  wx.showToast({
      title: '新版本下载失败',
      icon: 'none',
      duration: 3000
  })
})

export default App