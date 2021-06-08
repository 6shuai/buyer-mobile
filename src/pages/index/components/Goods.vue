<template>
	<view class="goods_warp">
		
		<view v-if="goodsLoading" class="goods_loading">加载中...</view>

		<!-- 纯文字内容 -->

		<!-- <view
			class="goods_item goods_text_item clearfix"
		>
			<view class="goods_timeline">
				<view class="goods_timeline_top"></view>
				<view class="goods_timeline_line"></view>
			</view>

			<view class="goods_content">
				<view class="time">
					<text class="time_text">一行白鹭上青天</text>
				</view>				
			</view>
		</view> -->	

		<view
			class="goods_item clearfix"
			v-for="(item, index) in goodsList"
			:key="index"
			:id="'goods_item_' + index"
			@tap.stop="handleDetail(item)"
		>
			<view class="goods_timeline">
				<view class="goods_timeline_top"></view>
				<view class="goods_timeline_line"></view>
			</view>

			<view class="goods_content">
				<view class="time">
					<text class="time_text">{{ item.beginTime }}</text>
				</view>

				<view class="goods_info">
					<view class="state_wrap">
						<image v-if="item.status == 0" mode="heightFix" src="../../../image/state_end.png" />
						<image v-else-if="item.status == 1" mode="heightFix" src="../../../image/state_not_start.png" />
						<image v-else-if="item.status == 2" mode="heightFix" src="../../../image/state_before.png" />
						<image v-else mode="heightFix" src="../../../image/state_start.png" />
					</view>

					<view class="goods_card">
						<view 
							class="goods_card_content"
							:class="item.status==0 ? 'end' : item.status==1 ? 'not_start' : ''"
						>
							<view class="goods_introduce clearfix">
								<view class="goods_image">
									<image :src="item.goodsCover" />
								</view>
								<view class="goods_right_text">
									<view class="title text_overflow"
										>{{ item.goodsName }}</view
									>
									<view class="desc text_size_12_by text_overflow"
										>{{ item.goodsDescription }}</view
									>
									<view class="bonus_wrap">
										<view 
											class="bonus_btn"
											:class="item.status==0 ? 'end' : item.status==1 ? 'not_start' : ''"
										>
											<text class="font_spacing_06"
												>猜价奖金</text
											>
											<text
												class="ali_font_bold price_num"
												>{{ item.totalGuessAward  || 0 }}</text
											>
											<text>元</text>
										</view>
									</view>
								</view>
							</view>

							<view class="goods_card_bottom clearfix">
								<view class="price">
									<view class="show_price">
										<text
											v-if="item.status == 0"
											class="end"
										>极限成交价</text>
										<view class="text_overflow" v-else>
											<text class="label"
												>官方售价</text
											>
											<view 
												class="number_warp"
												:class="item.status==0 ? 'end' : item.status==1 ? 'not_start' : ''"
											>
												<text class="price_before ali_font_bold"
													>￥</text
												>
												<text class="price_num ali_font_bold"
													>{{ item.marketValue.int }}</text
												>
												<text class="price_after ali_font_bold"
													>{{ item.marketValue.decimals }}</text
												>
											</view>
											<text class="text_size_10 origin">起</text>
										</view>
									</view>
									<view class="show_price depreciate text_overflow">
										<view 
											v-if="item.status == 0"
											class="end">
											<view class="number_warp">
												<text class="price_before ali_font_bold"
													>￥</text
												>
												<text class="price_num ali_font_bold"
													>{{ item.marketValue.int }}</text
												>
												<text class="price_after ali_font_bold"
													>{{ item.marketValue.decimals }}</text
												>
											</view>
											<view class="number_warp original_price">
												<text class="price_before ali_font_bold"
													>￥</text
												>
												<text class="price_num ali_font_bold"
													>{{ item.marketValue.int }}</text
												>
												<text class="price_after ali_font_bold"
													>{{ item.marketValue.decimals }}</text
												>
											</view>
										</view>
										<view v-else>
											<text class="label"
												>每分钟降</text
											>
											<view 
												class="number_warp"
												:class="item.status==0 ? 'end' : item.status==1 ? 'not_start' : ''"
											>
												<text class="price_before ali_font_bold"
													>￥</text
												>
												<text class="price_num ali_font_bold"
													>{{ item.priceDeclineRate.int }}</text
												>
												<text class="price_after ali_font_bold"
													>{{ item.priceDeclineRate.decimals }}</text
												>
											</view>
										</view>
									</view>
								</view>

								<view class="btn_wrap">
									<!-- 
										status 0 已结束  返场订阅 
										status 1 未开始  预约抢购 
										即将开始 或者 进行中 
									-->
									<image 
										v-if="item.status == 0" 
										mode="heightFix" 
										src="../../../image/btn_subscribe_3.png" 
										@tap.stop.prevent="handleGoBackSubscription(item.id)"
									/>
									<image 
										v-else-if="item.status == 1" 
										mode="heightFix" 
										src="../../../image/btn_subscribe_1.png" 
										@tap.stop.prevent="handleSubscription(item.id)"
									/>
									<image 
										v-else
										mode="heightFix" 
										src="../../../image/btn_start.png" 
										@tap.stop.prevent="handleJoin(item)"
									/>
									<!-- <image 
										mode="heightFix" 
										src="../../../image/btn_start.png" 
										@tap.stop.prevent="handleJoin(item)"
									/> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>

		<!-- 商品详情 -->
		<goods-detail ref="goodsDetail"></goods-detail>

	</view>
</template>

<script>
import { reactive, toRefs, ref, computed, getCurrentInstance, watch } from "vue"
import GoodsDetail from './GoodsDetail'
import mixin from '../../../mixins'
import { socketId } from '../../../utils/socketId'
import { useStore } from 'vuex';

export default {
	emits: ['setScrollTop'],
	mounted(){
		setTimeout(() => {
			var query = wx.createSelectorQuery();
			//选择id
			query.select('#goods_item_2').boundingClientRect()
			query.exec(function (res) {
				//获取元素距离顶部的距离
				// console.log(res[0].top);
			})
		}, 100);
	},

	setup(props, { emit }) {
		const { findGoodsState, formatTime, priceFormat } = mixin()
		const store = useStore()

		const instance = getCurrentInstance()

		//商品列表 加载更多
		const goodsDataPage = computed(() => {
			return store.state.goodsData
		})

		//某个商品开始 或 结束消息
		const homeGoodsState = computed(() => {
			return store.state.homeGoodsState
		})

		// 预览id
		const previewId = computed(() => {
			return store.state.previewId
		})

		// 商品详情
		const handleDetail = data => {
			state.goodsDetail.handleShowPage(data)
		}


		//马上参加
		const handleJoin = (item) => {
			// store.dispatch('setGoodsDetail', item)

			//预览抢购
			// instance.appContext.config.globalProperties.$socket.socketSendMessage({
			// 	id: socketId.preview,
			// 	auctionId: item.id
			// })

			wx.navigateTo({
				url: `./buyer/buyer?id=${item.id}`
			})
		}

		//返场订阅
		const handleGoBackSubscription = () => {
			wx.showToast({
				title: '返场订阅成功',
				duration: 2000
			})
		}

		//预约订阅
		const handleSubscription = () => {
			wx.showToast({
				title: '预约抢购成功',
				duration: 2000
			})
		}

		const goodsDetail = ref(null)		

		//加载更多抢购 
		const handleGoodsLoadMore = (type) => {
			let data = state.goodsList

			//触顶 并且 第一个抢购的index == 0   retur
			//触底 并且 抢购列表的length == 抢购总数时  return
			if(type == 'top' && data[0].index == 0){
				return
			}else if(type == 'bottom' && data.length == store.state.goodsTotalCount){
				return
			}

			instance.appContext.config.globalProperties.$socket.socketSendMessage({
				id: socketId.getGoodsList,
				baseIndex: type == 'top' ? data[0].index : data[data.length-1].index,   // 基于哪个索引请求
				count: type == 'top' ? -state.pageNum : state.pageNum       // 请求多少个抢购，根据一屏显示的内容来，别一次太多，负数向前，正数向后
			})
			state.goodsLoading = true
		}

		//返回的抢购商品数据
		const goodsPage = data => {
			let type = 'top'
			state.goodsLoading = false
			data.forEach(item => {
				item.beginTime = formatTime(item.beginTime)
				item.status = findGoodsState(item.beginTime)
				item.marketValue = priceFormat(item.marketValue)
				item.priceDeclineRate = priceFormat(item.priceDeclineRate)
			})

			if(!state.goodsList[0] || data[0].index > state.goodsList[0].index){
				//滑动到底部加载的数据
				state.goodsList = state.goodsList.concat(data)
				type = 'bottom'
			}else{
				//滑动到顶部加载的数据
				state.goodsList = data.concat(state.goodsList)
				type = 'top'
				//设置滚动条位置
				emit('setScrollTop', data.length)
			}

			//存储抢购列表全部数据
			store.dispatch('setAllGoodsList', { type, data })
		}

		//抢购状态改变
		const goodsStateChange = data => {
			state.goodsList.forEach((item, index) => {
				if(item.id == data.auctionId){
					//life: // 1表示开始，2表示结束
					setate[index].status = data.life == 1 ? 3 : 0
				}
			});
		}
		
		const state = reactive({
			goodsLoading: false,
			goodsList: [],          //抢购列表 数据
			pageNum: 10,            //每次加载的抢购列表数量
 			handleJoin,
			handleGoBackSubscription,
			handleSubscription,
			goodsDetail,
			handleDetail,
			handleGoodsLoadMore,
		})

		//goodsDataPage  列表滑到顶部 或 底部 加载更多的数据
		//homeGoodsState  商品的状态  开始或结束
		//previewId       预览抢购的id
		watch([goodsDataPage, homeGoodsState, previewId], ([newData, newState, newPreviewId], [oldData, oldState, oldPreviewId]) => {
			if(JSON.stringify(newData) != JSON.stringify(oldData)){
				goodsPage(newData)
			}
			
			if(JSON.stringify(newState) != JSON.stringify(oldState)){
				goodsStateChange(newState)
			}

			if(newPreviewId != oldPreviewId){
				wx.navigateTo({
					url: `./buyer/buyer?id=${newPreviewId}`
				})
			}
		})

		return toRefs(state)
	},
	components: {
		GoodsDetail
	}
};

</script>

<style lang="less">
@import "./goods.less";
</style>



