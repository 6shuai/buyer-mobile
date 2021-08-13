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
				:style="{ height: mainHeight + 'px', position: 'relative' }"
				:scrollY="true"
				:upper-threshold="20"
				:scrollWithAnimation="false"
				:scrollTop="scrollTop"
				:enhanced="true"
				:show-scrollbar="false"
				:scroll-into-view="scrollIntoView"
				@scroll="handleChangeScroll"
				@scrolltoupper="handleToUpper"
				@scrolltolower="handleToLower"
			>

				<!-- banner -->
				<banner id="banner" :showBanner="showBanner" />

				<!-- 抢购列表 -->
				<goods 
					ref="goodsList"
					@showLogin="showLogin"
					@setScrollTop="setScrollTop"
				></goods>
				
			</scroll-view>

		</view>
		
	</view>

	<!-- 导航栏 -->
	<!-- <custom-tab-bar 
		@backToTop="backToTop"
		page="home" /> -->
		
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
	setup(props) {
		//设置自定义tabbar 索引
		getCurrentPages()[0].getTabBar().setData({
			selected: 0
		})

		//监听点击回到顶部
		var subscriber = new window.qbian.Subscriber();
		subscriber.subscrib('backTop', function(data) {
			methods.backToTop()
		})


		const store = useStore()
		const goodsList = ref(null)
		const loginDialog = ref(null)

		const headHeight = computed(() => {
			return store.state.headerHeight
		})
		const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight
		})


		//显示登录窗口
		const showLogin = () => {
			state.loginDialog.showLogin = true
		}

		// 商品详情窗口 是否显示了
		const showGoodsDetail = computed(() => {
			return store.state.showGoodsDetail
		})

		let bannerHeight = null
		
		const methods = {
			//监听抢购列表  滚动条
			handleChangeScroll(event){

				if(state.scrollStop) return
				let s = event.target.scrollTop
				
				if(!bannerHeight){
					var query = wx.createSelectorQuery()
					//选择id
					query.select('#banner').boundingClientRect()
					query.exec(function (res) {
						bannerHeight = res[0].height
					})
				}

				//下滑
				if(state.goodsScrollTop > s && s > 10){
					// state.bannerTop = state.touchTop
					// state.bannerTop = state.touchTop >= state.bannerHeight ? -state.bannerHeight + (state.touchTop - s) : -state.touchTop + (state.touchTop - s)
					state.showBanner = 'show'
				}else if(s > bannerHeight && state.showBanner){
					state.showBanner = 'hide'
					//上滑
					// state.touchTop = s
					// state.bannerTop = -s
				}else {
					state.showBanner = ''
				}

				state.goodsScrollTop = s


				if(state.bannerTop >= 0){
					state.bannerTop = 0
				}else if(state.bannerTop <= -state.bannerHeight){
					state.bannerTop = -state.bannerHeight
				}

				//显示回到顶部
				if(s > 0){
					methods.setIconIsBackTop(true)
				}else{
					methods.setIconIsBackTop(false)
				}
			},

			//滚动到顶部时触发
			handleToUpper(){
				console.log('到顶部了')
				// state.bannerTop = 0;
				methods.setIconIsBackTop(false)
				state.goodsList.handleGoodsLoadMore('top')
			},

			//滚动到底部时触发
			handleToLower(){
				state.goodsList.handleGoodsLoadMore('bottom')
				console.log('到底部了')
			},

			//往上加载更多抢购数据后  设置滚动条位置
			setScrollTop(index){
				// state.scrollTop = state.goodsScrollTop + num * 223
				state.scrollStop = true

				//滚动条位置停在最新数据的最后一个item
				state.scrollIntoView = 'goods_item_' + index
				setTimeout(() => {
					state.scrollStop = false
				}, 500)
			},

			//点击回到顶部
			backToTop(){
				state.scrollTop = state.goodsScrollTop;
				nextTick(() => {
					state.scrollTop = 0;
					state.goodsScrollTop = 0;
					state.bannerTop = 0;
					methods.setIconIsBackTop(false)
				})
			},
			
			//设置自定义tabbar抢购图标是否显示 回到顶部
			setIconIsBackTop(state){
				getCurrentPages()[0].getTabBar().setData({
					showGoTopBtn: state
				})
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
			showBanner: '',
			bannerHeight: 142,   //banner  高度
			touchTop: 0,   //上划滚动条位置
			goodsList,
			...methods,
			scrollStop: false,
			showGoodsDetail,
			scrollIntoView: null
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

