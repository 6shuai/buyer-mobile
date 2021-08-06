import store from '../store'
import { socketId } from './socketId'
import { showToast } from '../utils/index'

export default {
    socketConIng: false,
    socketConnectSuccess: false, //socket 是否连接成功
    webSocketTask: null,
    heartBeatTimer: undefined,
    pongTime: null,  //收到心跳回复时间
    overtime: 60,   //超时时长
    pageShow: true,
    timer: undefined, 

    webSocketCon() {
        this.pageShow = true
        if(this.socketConIng || this.socketConnectSuccess) return
        this.socketConIng = true

        let that = this;
        console.log('socket连接')
        wx.showLoading({
            title: '加载中'
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
            console.log('socket 连接成功')
            that.socketConnectSuccess = true
            that.login()
            that.heartBeat()
        });
    
    
        // 接收
        that.webSocketTask.onMessage(res => {
            if(!res || !res.data) return
            console.log('收到消息------>', JSON.parse(res.data))
            let data = JSON.parse(res.data)
            let code = data.id
            switch (code) {
                //登录成功
                case socketId.userInfo:  
                    that.loginSuccess(data.userId)
                    break;
                 //登录失败
                case socketId.loginError: 
                    that.showError()
                    break;
                //心跳回应
                case socketId.pong:        
                    that.pongTime = new Date().getTime()
                    break;
                //抢购列表总条数
                case socketId.goodsTotalCount:  
                    store.dispatch('setGoodsTotalCount', data.amount)
                    break;
                //抢购列表  登录成功后返回  或者  抢购页滑到顶部 或 底部时 加载更多返回
                case socketId.goodsList:   
                    let { auctionList, orderedGoods, orderedAuctions, today } = data
                    if(!auctionList || !auctionList.length) return
                    store.dispatch('setGoodsPageData', auctionList)
                    if(orderedGoods) store.commit('SET_GOODS_DATA_STATE', { orderedGoods, orderedAuctions, today })
                    wx.hideLoading()
                    break;
                //手机点击卡片  返回的抢购详情
                case socketId.goodsDetail:   
                    store.dispatch('setGoodsDetail', data)
                    break;
                //抢购页的抢购详情
                case socketId.panicBuyDetail:  
                    store.dispatch('setPanicBuyDetail', data)
                    break;
                //场所列表
                case socketId.placeDataResponse:      
                    store.commit('SET_PLACE_LIST', data.place)
                    break;
                //banner列表
                case socketId.bannerList:     
                    store.commit('SET_BANNER_LIST', data.bannerList)
                    break;
                //游戏抢购状态，0预热阶段，1竞猜阶段，2开始倒计时，3出价阶段
                case socketId.gameState:      
                    store.commit('SET_GAME_PANIC_BUY_STATE', data.gameState)
                    break;
                //抢购列表 当天的游戏开始和结束状态
                case socketId.goodsListState:  
                    store.commit('SET_CURRENT_DAY_GAME_STATE', data)
                    break;
                //返回失败消息
                case socketId.buyerError:        
                    that.showError(data.message)
                    break;
                //预览  返回的预览id
                case socketId.previewResponse:   
                    store.commit('SET_PREVIEW_ID', data.auctionId)
                    break;
                //抢购成功通知  返回抢购人的信息
                case socketId.buySuccessMsg:      
                    store.commit('SET_BUY_SUCCESS_MEMBER', data.info)
                    break;
                //调起微信支付
                case socketId.wxPayment:            
                    store.commit('SET_WX_PAYMENT_INFO', data)
                    break;
                //支付成功  返回订单信息
                case socketId.buySuccessOrderInfo:   
                    store.commit('SET_BUY_SUCCESS_ORDER', data)
                    break;
                //已购买的用户列表  抢购结束后 结算页展示
                case socketId.buyMemberList:         
                    store.commit('SET_BUY_MEMBER_LIST', data.result)
                    break;
                //已猜价的用户列表  抢购结束后 结算页展示
                case socketId.guessPriceMemberList:   
                    store.commit('SET_GUESS_PRICE_MEMBER_LIST', data.result)
                    break;
                //完善物流信息 反馈
                case socketId.commitShippingAddressResponse:
                    store.commit('SET_COMMIT_ADDRESS_RESULT', data)
                    break;
                //场所 城市 列表
                case socketId.placeCityResponse:
                    store.commit('SET_CITYP_DATA_LIST', data.regions)
                    break;
                default:
                    break;
            }
    
        });
    
        // 关闭
        that.webSocketTask.onClose(err => {
            that.reconnection()
            that.socketConIng = false
            that.socketConnectSuccess = false
            console.log('socket 连接关闭')
        })
    
        // 错误
        that.webSocketTask.onError(err => {
            that.reconnection()
            that.socketConIng = false
            that.socketConnectSuccess = false
            console.log('socket 连接失败')
        });

    },

    //切到后台
    pageOnHide() {
        this.pageShow = false
        console.log('切到后台')
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
        let _this = this
        wx.login({
            success (res) {
                if(res.code){
                    _this.socketSendMessage(
                        {
                            id: socketId.codeLogin, // 消息id，3002
                            platform : 3,
                            token: res.code, 
                            screenId: 29
                        }                
                    )
                }else{
                    _this.showError('获取登录凭证失败!')
                }
            }
        })
    },

    //登录成功
    loginSuccess(userId){
        store.commit('SET_USER_ID', userId)

        this.socketSendMessage({ 
            id: socketId.placeCityList
        })

    },

    //登录失败
    showError(msg = '加载失败'){
        showToast(msg)
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
        if(!this.pageShow) return
        this.pongTime = undefined;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('重连')
            this.webSocketCon();
        }, 10000);
    },
}