import { createStore } from 'vuex'

const state = {
	userId: {},				 //userid
	headerHeight: 0,         //顶部导航栏高度
	showGoTopBtn: false,     //首页按钮是否显示回到顶部
	goodsData: [],           //抢购列表
	goodsDataState: {
		orderedGoods: [],
		orderedAuctions: [],
		today: []
	},      //抢购列表里面 所有的状态
	
	goodsTotalCount: 0,      //抢购列表总条数
	goodsDetail: {},         //抢购列表 详情
	showGoodsDetail: false,   		//抢购页是否打开了抢购详情
	panicBuyDetail: undefined,      //抢购页 商品详情
	allGoodsList: [],        		//抢购列表  全部数据
	placeList: [],           		//场所列表
	showPlace: undefined,        	//是否显示场所列表
	bannerList: [{}, {}],    		//banner列表
	currentPlace: undefined,        //当前场所
	gamePanicBuyState: null, 		//游戏抢购阶段状态
	homeGoodsState: undefined,      //抢购页商品状态通知  某个商品开始 或结束
	realTimePrice: {},		        //实时抢购价 
	previewId: null,          		 //预览id
	goodsGuessPrice: {}, 		     //抢购猜价  价格
	buySuccessMember: undefined,     //抢购成功的用户信息
	wxPaymentInfo: undefined,        //微信支付 下单接口返回的prepay_id
	buySuccessOrder: undefined,      //支付成功返回订单信息

	buyMemberList: [],        		  //抢购用户列表
	guessPriceMemberList: [],		  //猜价用户列表

	commitAddressResult: undefined,   //完善物流信息  返回的状态

	cityList: [],                     //场所 城市列表
	currentPlace: '北京市 通州万达广场',

	clearGoodsList: false,            //是否清空 抢购列表
}

const mutations = {
	//设置userid  openid
	SET_USER_ID(state, data){
		state.userId = data
	},

	SET_HEADER_HEIGHT(state, num){
		state.headerHeight = num
	},

	SET_SHOW_GOTOP_BTN(state, status){
		state.showGoTopBtn = status
	},

	SET_GOODS_TOTAL_COUNT(state, count){
		state.goodsTotalCount = count
	},

	//抢购列表
	SET_GOODS_DATA(state, data){
		state.goodsData = data
	},

	//抢购列表  已返场订阅的商品    已预约的抢购   当天的抢购
	SET_GOODS_DATA_STATE(state, data){
		state.goodsDataState = data
	},

	SET_GOODS_DETAIL(state, data){
		state.goodsDetail = data
	},

	SET_PANIC_BUY_DETAIL(state, data){
		state.panicBuyDetail = data
	},

	//抢购列表 全部数据
	SET_ALL_GOODS_LIST(state, data){
		state.allGoodsList = data
	},

	//场所列表
	SET_PLACE_LIST(state, data){
		state.placeList = data

		//获取本地存储的场所信息
		wx.getStorage({
			key: 'currentPlace',
			success (res) {
				state.currentPlace = JSON.parse(res.data)
			}
		})
	},

	//打开 或 关闭 场所列表
	SET_SHOW_PLACE_LIST(state, data){
		state.showPlace = data
	},

	//banner列表
	SET_BANNER_LIST(state, data){
		state.bannerList = data
	},

	//选择场所 设置当前场所
	SET_CURRENT_PLACE(state, data){
		state.currentPlace = data
		wx.setStorage({
			key: "currentPlace",
			data: JSON.stringify(data)
		})
	},

	//抢购页 游戏状态
	SET_GAME_PANIC_BUY_STATE(state, data) {
		state.gamePanicBuyState = data
	},

	//抢购列表  当天开始抢购的商品 开始或结束通知消息
	SET_CURRENT_DAY_GAME_STATE(state, data) {
		state.homeGoodsState = data
	},

	//设置实时价格
	SET_REAL_TIME_PRICE(state, data) {
		state.realTimePrice = data
	},

	//设置预览id
	SET_PREVIEW_ID(state, data) {
		state.previewId = data
	},

	//抢购的 猜价 价格
	SET_GOODS_GUESS_PRICE(state, data){
		state.goodsGuessPrice = data
	},

	//抢购成功 信息
	SET_BUY_SUCCESS_MEMBER(state, data){
		state.buySuccessMember = data
	},

	//抢购返回 微信支付id
	SET_WX_PAYMENT_INFO(state, data){
		state.wxPaymentInfo = data
	},

	//支付成功后 返回的订单信息
	SET_BUY_SUCCESS_ORDER(state, data){
		state.buySuccessOrder = data
	},

	//抢购的用户列表
	SET_BUY_MEMBER_LIST(state, data){
		state.buyMemberList = data
	},

	//猜价的用户列表
	SET_GUESS_PRICE_MEMBER_LIST(state, data){
		state.guessPriceMemberList = data
	},

	//完善物流信息 反馈内容
	SET_COMMIT_ADDRESS_RESULT(state, data){
		state.commitAddressResult = data
	},

	//场所 城市列表
	SET_CITYP_DATA_LIST(state, data){
		state.cityList = data
	}
}

const actions = {
	//设置顶部导航栏高度
	setHeaderHeight(context, number) {
		context.commit('SET_HEADER_HEIGHT', number)
	},

	//是否显示回到顶部
	setShowGoTopBtn(context, status) {
		context.commit('SET_SHOW_GOTOP_BTN', status)
	},

	//抢购列表总条数
	setGoodsTotalCount(context, count) {
		context.commit('SET_GOODS_TOTAL_COUNT', count)
	},

	//抢购列表 分页数据
	setGoodsPageData(context, data) {
		context.commit('SET_GOODS_DATA', data)
	},

	//抢购列表 点击卡片返回的抢购详情
	setGoodsDetail(context, data) {
		context.commit('SET_GOODS_DETAIL', data)
	},

	//参加抢购 返回的抢购页详情
	setPanicBuyDetail(context, data) {
		context.commit('SET_PANIC_BUY_DETAIL', data)
	},

	//抢购列表 全部数据
	setAllGoodsList(context, obj) {
		if(obj.type == 'top'){
			context.commit('SET_ALL_GOODS_LIST', obj.data.concat(context.state.allGoodsList))
		}else{
			context.commit('SET_ALL_GOODS_LIST', context.state.allGoodsList.concat(obj.data))
		}
	},

	//抢购猜价
	setGoodsGuessPrice(context, data) {
		let obj = JSON.parse(JSON.stringify(context.state.goodsGuessPrice))
		obj[data.id] = data.price
		context.commit('SET_GOODS_GUESS_PRICE', obj)
	},

	//当前抢购 实时价格
	setRealTimePrice(context, data) {
		context.commit('SET_REAL_TIME_PRICE', data)
	}

}

const getters = {
	getNumbers(state) {
		return state.numbers
	},

	getRealTimePrice(state) {
		return state.realTimePrice
	}
}

const store = createStore({
	state,
	mutations,
	actions,
	getters
})

export default store
