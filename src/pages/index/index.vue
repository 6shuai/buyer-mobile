<template>
	<view class="home page_bg">
		<page-head page="home" />

		<view class="main" :style="{ marginTop: headHeight + 'px' }">
			<banner :style="{ transform: `translateY(${bannerTop}px)`, transition: 'all .1s ease' }"  />

			<scroll-view
				:style="{ height: mainHeight + 'px' }"
				:scrollY="true"
				:upper-threshold="20"
				:scrollWithAnimation="false"
				:scrollTop="scrollTop"
				@scroll="handleChangeScroll"
				@scrolltoupper="handleToUpper"
				@scrolltolower="handleToLower"
			>
				<goods 
					ref="goodsList"
					@setScrollTop="setScrollTop"
				></goods>
			</scroll-view>

		</view>

		<custom-tab-bar 
			@backToTop="backToTop"
			page="home" />
	</view>
</template>

<script>
import PageHead from "../../components/PageHead.vue";
import Banner from "./components/Baaner.vue";
import Goods from "./components/Goods.vue";
import CustomTabBar from "../../components/custom-tab-bar/index.vue";
import { reactive, ref, toRefs, computed, nextTick } from "vue";
import { useStore } from "vuex";

export default {
	name: "Index",
	setup(props) {
		const store = useStore()
		const goodsList = ref(null)
		const headHeight = computed(() => {
			return store.state.headerHeight;
		})
		const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight;
		})

		
		
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
				console.log('到顶部了')
				state.bannerTop = 0;
				store.dispatch('setShowGoTopBtn', false)
				// state.scrollTop = state.goodsScrollTop + 223
				// state.scrollStop = true;
				state.goodsList.handleGoodsLoadMore('top')
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
			headHeight,
			mainHeight,
			scrollTop: 0,       //滚动条位置
			goodsScrollTop: 0,
			bannerTop: 0,
			bannerHeight: 142,   //banner  高度
			touchTop: 0,   //上划滚动条位置
			goodsList,
			...methods,
			scrollStop: false
		});

		return toRefs(state);
	},
	components: {
		PageHead,
		Banner,
		Goods,
		CustomTabBar,
	},
};
</script>

<style lang="less">
	.main{
		width: 100%;
		overflow: hidden;
		position: absolute;
	}
</style>

