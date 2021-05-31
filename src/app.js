import { createApp } from 'vue'
import store from './store'
import socket from './utils/socket.js'

import './app.less'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(store)
App.config.globalProperties.$socket = socket

// socket 连接
// setTimeout(() => {
  socket.webSocketCon()
// }, 2000);

export default App