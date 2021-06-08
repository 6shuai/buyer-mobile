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
            mask: true
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
                    that.showError()
                    break;
                case socketId.pong:        //心跳回应
                    that.pongTime = new Date().getTime()
                    break;
                case socketId.goodsTotalCount:  //抢购列表总条数
                    store.dispatch('setGoodsTotalCount', data.amount)
                    break;
                case socketId.goodsList:   //抢购列表  登录成功后返回  或者  抢购页滑到顶部 或 底部时 加载更多返回
                    if(!data.auctionList || !data.auctionList.length) return
                    store.dispatch('setGoodsPageData', data.auctionList)
                    break;
                case socketId.goodsDetail:   //手机点击卡片  返回的抢购详情
                    store.dispatch('setGoodsDetail', data)
                    break;
                case socketId.panicBuyDetail:  //抢购页的抢购详情
                    store.dispatch('setPanicBuyDetail', data)
                    break;
                case socketId.placeList:      //场所列表
                    store.commit('SET_PLACE_LIST', data.placeList)
                    break;
                case socketId.gameState:      //游戏抢购状态
                    //游戏的状态，0预热阶段，1竞猜阶段，2开始倒计时，3出价阶段
                    store.commit('SET_GAME_PANIC_BUY_STATE', data.gameState)
                    break;
                case socketId.goodsListState:  //抢购列表 当天的游戏开始和结束状态
                    store.commit('SET_CURRENT_DAY_GAME_STATE', data)
                    break;
                case socketId.buyerError:         //返回失败消息
                    that.showError(data.message)
                    break;
                case socketId.previewResponse:   //预览  返回的预览id
                    store.commit('SET_PREVIEW_ID', data.auctionId)
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
    showError(msg = '加载失败'){
        wx.showToast({
            title: msg,
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