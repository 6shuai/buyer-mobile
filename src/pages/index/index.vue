<template>
	<view class="home page_bg">
		<!-- 选择城市 -->
		<place></place>

		<page-head page="home" />

		<!-- 登录窗口 -->
		<login-dialog ref="loginDialog"></login-dialog>

		<view class="main" 
			:style="{ 
				marginTop: headHeight + 'px',
				zIndex: showGoodsDetail ? '9999' : '1'
			}"
		>
			<scroll-view
				:style="{ height: mainHeight + 'px' }"
				:scrollY="true"
				:upper-threshold="20"
				:scrollWithAnimation="false"
				:scrollTop="scrollTop"
				:enhanced="true"
				:show-scrollbar="false"
				@scroll="handleChangeScroll"
				@scrolltoupper="handleToUpper"
				@scrolltolower="handleToLower"
			>
				<banner :style="{ transform: `translateY(${bannerTop}px)`, transition: 'all .5s ease' }"  />

				<goods 
					ref="goodsList"
					@showLogin="showLogin"
					@setScrollTop="setScrollTop"
				></goods>
				
			</scroll-view>

		</view>
		
		<!-- 导航栏 -->
		<custom-tab-bar 
			@backToTop="backToTop"
			page="home" />

	</view>
</template>

<script>
import PageHead from '../../components/PageHead.vue'
import Banner from './components/Baaner.vue'
import Goods from './components/Goods.vue'
import CustomTabBar from '../../components/custom-tab-bar/index.vue'
import Place from './components/Place.vue'
import LoginDialog from './components/LoginDialog.vue'
import { reactive, ref, toRefs, computed, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
	name: "Index",
	setup(props) {
		const store = useStore()
		const goodsList = ref(null)
		const loginDialog = ref(null)

		const headHeight = computed(() => {
			return store.state.headerHeight;
		})
		const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight;
		})

		//显示登录窗口
		const showLogin = () => {
			state.loginDialog.showLogin = true
		}

		// 商品详情窗口 是否显示了
		const showGoodsDetail = computed(() => {
			return store.state.showGoodsDetail
		})

		//获取地理位置
		// wx.getLocation({
		// 	type: 'wgs84',
		// 	success (res) {
		// 		console.log(res)
		// 	}
		// })
		
		const methods = {
			handleChangeScroll(event){
				if(state.scrollStop) return
				// console.log(event.target.scrollTop)
				let s = event.target.scrollTop

				//下滑
				if(state.goodsScrollTop > s){
					// state.bannerTop = state.touchTop;
					state.bannerTop = state.touchTop >= state.bannerHeight ? -state.bannerHeight + (state.touchTop - s) : -state.touchTop + (state.touchTop - s)
				}else{
					//上滑
					state.touchTop = s;
					state.bannerTop = -s;
				}

				state.goodsScrollTop = s

				if(state.bannerTop >= 0){
					state.bannerTop = 0;
				}else if(state.bannerTop <= -state.bannerHeight){
					state.bannerTop = -state.bannerHeight;
				}

				//显示回到顶部
				if(s > 0){
					store.dispatch('setShowGoTopBtn', true)
				}else{
					store.dispatch('setShowGoTopBtn', false)
				}
			},

			//滚动到顶部时触发
			handleToUpper(){
				// console.log('到顶部了')
				// state.bannerTop = 0;
				// store.dispatch('setShowGoTopBtn', false)
				// state.goodsList.handleGoodsLoadMore('top')
			},

			//滚动到底部时触发
			handleToLower(){
				state.goodsList.handleGoodsLoadMore('bottom')
				console.log('到底部了')
			},

			//点击回到顶部
			backToTop(){
				state.scrollTop = state.goodsScrollTop;
				nextTick(() => {
					state.scrollTop = 0;
					state.goodsScrollTop = 0;
					state.bannerTop = 0;
					store.dispatch('setShowGoTopBtn', false)
				})
			},

			//加载更多抢购数据后  设置滚动条位置
			setScrollTop(num){
				// state.scrollTop = state.goodsScrollTop + num * 223
			}

		}


		const state = reactive({
			loginDialog,
			showLogin,
			headHeight,
			mainHeight,
			scrollTop: 0,       //滚动条位置
			goodsScrollTop: 0,
			bannerTop: 0,
			bannerHeight: 142,   //banner  高度
			touchTop: 0,   //上划滚动条位置
			goodsList,
			...methods,
			scrollStop: false,
			showGoodsDetail
		});

		return toRefs(state);
	},
	components: {
		PageHead,
		Banner,
		Goods,
		CustomTabBar,
		Place,
		LoginDialog
	}
};
</script>

<style lang="less">
	.main{
		width: 100%;
		overflow: hidden;
		position: absolute;
		z-index: 99;
	}
</style>

