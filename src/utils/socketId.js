export const socketId = {
    codeLogin: 3002,               //完整身份验证登录
    quickLogin: 3003,              //快捷登录
    ping: 3004,                    //心跳请求
    guessPrice: 3005,              //竞猜价格
    buy: 3006,                     //购买
    getGoodsList: 3008,            //获取抢购列表
    getGoodsDetail: 3010,          //获取抢购详情
    joinBuy: 3011,                 //参加抢购请求


    // 返回的消息
    goodsList: 7001,               //抢购列表  登录成功后返回
    goodsTotalCount: 7002,         //抢购列表总数
    placeList: 7003,               //场所列表通知
    goodsDetail: 7004,             //首页点击卡片 显示抢购详情 奖励规则
    panicBuyDetail: 7005,          //抢购详情
    
    userInfo: 7011,                //登录成功 返回用户信息
    loginError: 7012,              //返回的失败消息
    pong: 7019,                    //心跳回应
    gameState: 7023,               //游戏抢购页的状态
    buyerError: 7027,              //竞猜价格 或 返回失败消息
}