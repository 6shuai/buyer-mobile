export const socketId = {
    codeLogin: 3002,               //完整身份验证登录
    quickLogin: 3003,              //快捷登录
    ping: 3004,                    //心跳请求
    guessPrice: 3005,              //竞猜价格
    buy: 3006,                     //购买
    getGoodsList: 3008,            //获取抢购列表


    goodsList: 7001,               //抢购列表  登录成功后返回
    goodsTotalCount: 7002,         //抢购列表总数
    goodsPaging: 7003,             //抢购列表  加载更多 分页
    userInfo: 7011,                //登录成功 返回用户信息
    loginError: 7012,              //返回的失败消息
    pong: 7019,                    //心跳回应
    buyerError: 7027,              //竞猜价格 或 返回失败消息
}