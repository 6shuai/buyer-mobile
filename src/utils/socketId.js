export const socketId = {
    codeLogin: 3002,               //完整身份验证登录
    quickLogin: 3003,              //快捷登录
    ping: 3004,                    //心跳请求
    guessPrice: 3005,              //竞猜价格
    buy: 3006,                     //购买
    getGoodsList: 3008,            //获取抢购列表
    switchPlaceRequest: 3009,      //切换场所
    
    getGoodsDetail: 3010,          //获取抢购详情
    joinBuy: 3011,                 //参加抢购请求
    goBackSubscribeGoods: 3012,    //返场订阅请求
    preview: 3013,                 //预览抢购
    subscribeGoods: 3015,          //预约抢购
    commitShippingAddress: 3020,   //提交物流信息
    placeCityList: 3021,           //获取商场城市列表
    placeDataList: 3022,           //根据城市编码获取场所列表


    // 返回的消息
    goodsList: 7001,               //抢购列表  登录成功后返回
    goodsTotalCount: 7002,         //抢购列表总数
    placeList: 7003,               //场所列表通知
    goodsDetail: 7004,             //首页点击卡片 显示抢购详情 奖励规则
    panicBuyDetail: 7005,          //抢购详情
    goodsListState: 7006,          //抢购列表 当天的抢购开始或者结束会通知
    buySuccessMsg: 7007,           //抢购成功通知  返回抢购人的信息
    wxPayment: 7009,               //调起微信支付
    buySuccessOrderInfo: 7010,     //当前用户 支付成功 返回订单信息
    
    userInfo: 7011,                //登录成功 返回用户信息
    loginError: null,              //返回的失败消息

    buyMemberList: 7012,                 //抢购列表
    guessPriceMemberList: 7013,          //猜价列表

    pong: 7019,                    //心跳回应
    gameState: 7023,               //游戏抢购页的状态
    previewResponse: 7024,         //预览抢购 返回的消息
    buyerError: 7027,              //竞猜价格 或 返回失败消息

    commitShippingAddressResponse: 7031, //提交物流信息 反馈信息
    placeCityResponse: 7032,             //商场城市列表 反馈
    placeDataResponse: 7033,             //商场列表 反馈
}