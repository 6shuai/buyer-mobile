// AppID     wxda80a891596389ff
// AppSecret 83349d11fba1703078d576eea70859f8
import store from '../store'
import { socketId } from './socketId'

export default {
    webSocketTask: null,
    heartBeatTimer: undefined,
    pongTime: null,  //收到心跳回复时间
    overtime: 60,   //超时时长
    timer: undefined,

    webSocketCon() {
        let that = this;

        wx.showLoading({
            title: '加载中',
        })

        that.webSocketTask = wx.connectSocket({
    
            url: 'wss://nbb.xfengjing.com/wss/',
    
            header: {
                'content-type': 'application/json'
            },
    
            success: res => {
    
            },
    
            fail: fail => {

            },
    
        });
    
        // 打开连接
        that.webSocketTask.onOpen(res => {
            console.log('打开连接')
            that.login()
            this.heartBeat()
        });
    
    
        // 接收
        that.webSocketTask.onMessage(res => {
            if(!res || !res.data) return
            console.log('收到消息------>', JSON.parse(res.data))
            let data = JSON.parse(res.data)
            let code = data.id
            switch (code) {
                case socketId.userInfo:   //登录成功
                    that.loginSuccess(data.userId)
                    break;
                case socketId.loginError:  //登录失败
                    that.loginError()
                    break;
                case socketId.pong:        //心跳回应
                    that.pongTime = new Date().getTime()
                    break;
                case socketId.goodsTotalCount:  //抢购列表总条数
                    store.dispatch('setGoodsTotalCount', data.amount)
                    break;
                case socketId.goodsList:   //抢购列表  登录成功后返回
                case socketId.goodsPaging:    //抢购页滑到顶部 或 底部时 加载更多返回
                    if(!data.auctionList || !data.auctionList.length) return
                    store.dispatch('setGoodsData', data.auctionList)
                    break;
                default:
                    break;
            }
    
        });
    
        // 关闭
        that.webSocketTask.onClose(err => {
            that.reconnection()
            console.log('socket 连接关闭')
        })
    
        // 错误
        that.webSocketTask.onError(err => {
            that.reconnection()
            console.log('socket 连接失败')
        });

    },

    //关闭 socket
    websocketclose(call) {
        this.webSocketTask.close({
            code: 1000,
            success: ()=> {
                call()
            }
        })
    },

    //发送socket 数据
    socketSendMessage(data) {
        try {
            this.webSocketTask.send({ data: JSON.stringify(data) })
        } catch (error) {
            
        }
    },

    //登录
    login() {
        let loginData = undefined
        let _this = this
        // try {
        //     loginData = wx.getStorageSync('loginData') ? JSON.parse(wx.getStorageSync('loginData')) : undefined
        // } catch (e) {

        // }
        if(loginData){
            this.quickLogin(loginData);
        }else{
            wx.login({
                success (res) {
                    _this.socketSendMessage(
                        {
                            id: socketId.codeLogin, // 消息id，3002
                            platform : 3,
                            token: res.code, 
                            screenId: 29,
                        }                
                    )
                }
            })
        }
    },

    //快捷登录
    quickLogin(loginData) {
        this.socketSendMessage(
            {
                id: socketId.quickLogin,
                screenId: 29,
               ...loginData 
            }                
        )
    },

    //登录成功
    loginSuccess(userId){
        wx.hideLoading()
        wx.setStorage({
            key: 'loginData',
            data: JSON.stringify(userId)
        })
    },

    //登录失败
    loginError(){
        console.log('加载失败')
        wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
        })
    },


    //websocket心跳  20秒一次
    heartBeat() {
        if (this.heartBeatTimer) clearTimeout(this.heartBeatTimer);
        let date = new Date().getTime();
        if(this.pongTime && ((date - this.pongTime) / 1000) > this.overtime){
            console.log('连接超时')
            this.websocketclose(() => {
                this.reconnection()
            });
        }
        this.socketSendMessage({ id: socketId.ping });
        this.heartBeatTimer = setTimeout(() => {
            this.heartBeat();
        }, 20000);
    },

    //websocket断线重连  10秒重连一次
    reconnection() {
        this.pongTime = undefined;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.webSocketCon();
        }, 10000);
    },
}