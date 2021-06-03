import { createStore } from 'vuex'

const state = {
  headerHeight: 0,         //顶部导航栏高度
  showGoTopBtn: false,     //首页按钮是否显示回到顶部
  goodsData: [],           //抢购列表
  goodsTotalCount: 0,      //抢购列表总条数
  goodsDetail: {},         //抢购列表 详情
  panicBuyDetail: {},      //抢购页 商品详情
  allGoodsList: [],        //抢购列表  全部数据
  placeList: [],           //场所列表
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

  //场所列表
  setPlaceList(context, data) {
    context.state.placeList = data
  }

}

const getters = {
  getNumbers(state) {
    return state.numbers
  }
}

const store = createStore({
  state,
  mutations,
  actions,
  getters
})

export default store
