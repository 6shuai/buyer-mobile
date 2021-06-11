import { createStore } from 'vuex'

const state = {
	headerHeight: 0,         //顶部导航栏高度
	showGoTopBtn: false,     //首页按钮是否显示回到顶部
	goodsData: [],           //抢购列表
	goodsTotalCount: 0,      //抢购列表总条数
	goodsDetail: {},         //抢购列表 详情
	panicBuyDetail: undefined,      //抢购页 商品详情
	allGoodsList: [],        //抢购列表  全部数据
	placeList: [],           //场所列表
	gamePanicBuyState: null, //游戏抢购阶段状态
	homeGoodsState: {},      //抢购页商品状态通知  某个商品开始 或结束
	realTimePrice: {},        //实时抢购价 
	previewId: null,          //预览id
	goodsGuessPrice: {},      //抢购猜价  价格
	buySuccessMember: {},     //抢购成功的用户信息
	wxPaymentInfo: {},        //微信支付 下单接口返回的prepay_id
}

const mutations = {
	SET_HEADER_HEIGHT(state, num){
		state.headerHeight = num
	},

	SET_SHOW_GOTOP_BTN(state, status){
		state.showGoTopBtn = status
	},

	SET_GOODS_TOTAL_COUNT(state, count){
		state.goodsTotalCount = count
	},

	SET_GOODS_DATA(state, data){
		state.goodsData = data
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
