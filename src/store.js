import { createStore } from 'vuex'

const state = {
  headerHeight: 0,         //顶部导航栏高度
  showGoTopBtn: false,     //首页按钮是否显示回到顶部
  goodsData: [],           //抢购列表
  goodsTotalCount: 0,      //抢购列表总条数
  goodsDetail: {},         //抢购详情
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

  //抢购列表
  setGoodsData(context, data) {
    console.log('data------------->', data)
    context.commit('SET_GOODS_DATA', data)
  },

  //抢购详情
  setGoodsDetail(context, data) {
    context.commit('SET_GOODS_DETAIL', data)
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
