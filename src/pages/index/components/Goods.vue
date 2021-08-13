<template>
	<view class="goods_warp">

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
					<text class="time_text">2020年5月23日，极限买手诞生了。</text>
				</view>				
			</view>
		</view>	 -->

		<view
			class="goods_item clearfix"
			v-for="(item, index) in goodsList"
			:key="index"
			:id="'goods_item_' + index"
			:class="{
				'goods_item_active': item.status >= 2,
				'goods_item_end': item.status == 0
			}"
		>
			<view
				class="goods_item_page"
				v-for="(good, gindex) in item"
				:key="gindex"
				@tap.stop="handleDetail(good)"
			>
				<view 
					class="goods_timeline"
				>
					<view class="goods_timeline_top"></view>
					<view class="goods_timeline_line"></view>
				</view>

				<view class="goods_content">
					<view class="time">
						<text class="time_text">{{ good.beginTime }}</text>
					</view>

					<view class="goods_info">
						<view class="state_wrap">
							<image v-if="good.status == 0" mode="heightFix" src="../../../image/state_end.png" />
							<image v-else-if="good.status == 1" mode="heightFix" src="../../../image/state_not_start.png" />
							<image v-else-if="good.status == 2" mode="heightFix" src="../../../image/state_before.png" />
							<image v-else mode="heightFix" src="../../../image/state_start.png" />
						</view>

						<view class="goods_card">
							<view 
								class="goods_card_content"
								:class="good.status==0 ? 'end' : good.status==1 ? 'not_start' : ''"
							>
								<view class="goods_introduce clearfix">
									<view 
										class="goods_image"
										:style="{ background: `url(${item.goodsCover}) center no-repeat`, backgroundSize: '100% 100%' }"
									></view>
									<view class="goods_right_text">
										<view class="title text_overflow"
											>{{ good.goodsName }}</view
										>
										<view class="desc text_size_12_by text_overflow"
											>{{ good.goodsDescription }}</view
										>
										<view class="bonus_wrap">
											<view 
												class="bonus_btn"
												:class="good.status==0 ? 'end' : good.status==1 ? 'not_start' : ''"
											>
												<text class="font_spacing_06"
													>猜价奖金</text
												>
												<text
													class="ali_font_bold price_num"
													>{{ good.totalGuessAward  || 0 }}</text
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
												v-if="good.status == 0"
												class="end"
											>极限成交价</text>
											<view class="text_overflow" v-else>
												<text class="label"
													>官方售价</text
												>
												<view 
													class="number_warp"
													:class="good.status==0 ? 'end' : good.status==1 ? 'not_start' : ''"
												>
													<text class="price_before ali_font_bold"
														>￥</text
													>
													<text class="price_num ali_font_bold"
														>{{ good.marketValue.int }}</text
													>
													<text class="price_after ali_font_bold"
														>{{ good.marketValue.decimals }}</text
													>
												</view>
												<text class="text_size_10 origin">起</text>
											</view>
										</view>
										<view class="show_price depreciate text_overflow">
											<view 
												v-if="good.status == 0"
												class="end">
												<view class="number_warp">
													<text class="price_before ali_font_bold"
														>￥</text
													>
													<text class="price_num ali_font_bold"
														>{{ good.marketValue.int }}</text
													>
													<text class="price_after ali_font_bold"
														>{{ good.marketValue.decimals }}</text
													>
												</view>
												<view class="number_warp original_price">
													<text class="price_before ali_font_bold"
														>￥</text
													>
													<text class="price_num ali_font_bold"
														>{{ good.marketValue.int }}</text
													>
													<text class="price_after ali_font_bold"
														>{{ good.marketValue.decimals }}</text
													>
												</view>
											</view>
											<view v-else>
												<text class="label"
													>每分钟降</text
												>
												<view 
													class="number_warp"
													:class="good.status==0 ? 'end' : good.status==1 ? 'not_start' : ''"
												>
													<text class="price_before ali_font_bold"
														>￥</text
													>
													<text class="price_num ali_font_bold"
														>{{ good.priceDeclineRate.int }}</text
													>
													<text class="price_after ali_font_bold"
														>{{ good.priceDeclineRate.decimals }}</text
													>
												</view>
											</view>
										</view>
									</view>
									
									<!-- test -->
									<view class="btn_wrap" v-if="gindex == 6">
										<image 
											mode="heightFix" 
											src="../../../image/btn_start.png" 
											@tap.stop.prevent="handleJoin(good, 'preview')"
										/>
									</view>

									<view class="btn_wrap" v-else>
										<!-- 
											status 0 已结束  返场订阅 
											status 1 未开始  预约抢购 
											即将开始 或者 进行中 
										-->
										<!-- 已结束 并且 已订阅 -->
										<image 
											v-if="good.status == 0 && store.state.goodsDataState.orderedGoods.includes(good.goodsId)" 
											mode="heightFix" 
											src="../../../image/btn_subscribe_2.png" 
										/>
										<!-- 已结束 返场订阅 -->
										<image 
											v-else-if="good.status == 0" 
											mode="heightFix" 
											src="../../../image/btn_subscribe_3.png" 
											@tap.stop.prevent="handleGoBackSubscription(good.goodsId)"
										/>
										<!-- 未开始 并且 已预约 -->
										<image 
											v-else-if="good.status == 1 && store.state.goodsDataState.orderedAuctions.includes(good.id)" 
											mode="heightFix" 
											src="../../../image/btn_subscribe_1.png" 
										/>
										<!-- 未开始 预约抢购 -->
										<image 
											v-else-if="good.status == 1" 
											mode="heightFix" 
											src="../../../image/btn_subscribe_1.png" 
											@tap.stop.prevent="handleSubscription(good.id)"
										/>
										<!-- 马上参加 -->
										<image 
											v-else
											mode="heightFix" 
											src="../../../image/btn_start.png" 
											@tap.stop.prevent="handleJoin(good)"
										/>
									</view>

								</view>
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
		</view>

		<!-- <view
			class="goods_item goods_text_item clearfix"
			v-if="goodsList.length"
		>
			<view class="goods_timeline">
				<view class="goods_timeline_top"></view>
			</view>

			<view class="goods_content">
				<view class="time">
					<text class="time_text">运营小姐姐正在加班筹划新活动...先从上面选一个参加吧！</text>
				</view>				
			</view>
		</view> -->

		<view v-if="goodsLoading" class="goods_loading">加载中...</view>

		<!-- 商品详情 -->
		<goods-detail 
			ref="goodsDetail"
			@detaileHandleJoin="handleJoin"
		></goods-detail>

	</view>
</template>

<script>
import { reactive, toRefs, ref, computed, getCurrentInstance, watch } from "vue"
import GoodsDetail  from  './GoodsDetail.vue'
import mixin from '../../../mixins'
import { socketId } from '../../../utils/socketId'
import { useStore } from 'vuex'
import { showToast } from '../../../utils/index'

export default {
	emits: ['setScrollTop', 'showLogin'],
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
		const goodsDetail = ref(null)
		const { findGoodsState, formatTime, priceFormat } = mixin()
		const store = useStore()
	
		const { proxy } = getCurrentInstance()

		const accountInfo = wx.getAccountInfoSync()
		const env = accountInfo .miniProgram.envVersion

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
		const handleJoin = (item, type) => {

			let userInfo = '';
            try {
                userInfo = wx.getStorageSync('userInfo')
            } catch (e) {
            
            }

            if(!userInfo){
                emit('showLogin')
				return
            }


			//预览抢购
			if(type == 'preview'){
				proxy.$socket.socketSendMessage({ 
					id: socketId.preview,
					auctionId: item.id
				})

				return
			}

			wx.navigateTo({
				url: `./buyer/buyer?id=${item.id}`
			})

			// 只允许从相机扫码
			// wx.scanCode({
			// 	onlyFromCamera: true,
			// 	success (res) {
			// 		let { result } = res.result
			// 		console.log(res, res.result)
			// 	}
			// })
		}

		//检查是否已经授权
		const hasAuth = () => {
			let userInfo = wx.getStorageSync('userInfo')
			if(userInfo) {
				return true
			}else{
				return false
			}
		}

		//返场订阅
		const handleGoBackSubscription = goodsId => {
			proxy.$socket.socketSendMessage({
				id: socketId.goBackSubscribeGoods,
				goodsId: goodsId
			})
			showToast('返场订阅成功', 'success')
		}

		//预约订阅
		const handleSubscription = id => {
			proxy.$socket.socketSendMessage({
				id: socketId.subscribeGoods,
				auctionId: id
			})
			showToast('预约抢购成功', 'success')
		}

		//加载更多抢购 
		const handleGoodsLoadMore = (type) => {
			if(state.dataLoading) return

			let data = state.goodsList


			//触顶 并且 第一个抢购的index == 0   retur
			//触底 并且 抢购列表的length == 抢购总数时  return
			// if(type == 'top' && data[0].index == 0){
			// 	return
			// }else if(type == 'bottom' && data.length == store.state.goodsTotalCount){
			// 	return
			// }

			let last = data[data.length - 1]

			proxy.$socket.socketSendMessage({
				id: socketId.getGoodsList,
				baseIndex: type == 'top' ? data[0][0].index : last[last.length - 1].index,   // 基于哪个索引请求
				count: type == 'top' ? -state.pageNum : state.pageNum       // 请求多少个抢购，根据一屏显示的内容来，别一次太多，负数向前，正数向后
			})
			state.goodsLoading = true
		}

		//返回的抢购商品数据
		const goodsPage = data => {
			// state.goodsList = []

			let type = 'top'
			state.goodsLoading = false
			data.forEach(item => {
				let time = JSON.parse(JSON.stringify(item.beginTime))
				item.beginTime = formatTime(time)
				item.status = findGoodsState(time, item.id)
				item.marketValue = priceFormat(item.marketValue)
				item.priceDeclineRate = priceFormat(item.priceDeclineRate)
				state.goodsIds.push(item.index)
			})
			
			//@@ 抢购列表优化   concat 要改成  list[page]:datalist
			if(!state.goodsList[0] || data[0].index > state.goodsList[state.goodsList.length - 1][0].index){
				//滑动到底部加载的数据
				// state.goodsList = state.goodsList.concat(data)
				state.goodsList.push(data)
				type = 'bottom'
			}else{
				//滑动到顶部加载的数据
				// state.goodsList = data.concat(state.goodsList)
				state.goodsList.unshift(data)
				type = 'top'
				//设置滚动条位置
				emit('setScrollTop', data[data.length-1].index)
			}

			//存储抢购列表全部数据
			store.dispatch('setAllGoodsList', { type, data })
			joinLastPanicBuy()
		}

		//抢购状态改变
		const goodsStateChange = data => {
			state.goodsList.forEach((item, index) => {
				if(item.id == data.auctionId){
					//life: // 1表示开始，2表示结束
					state.goodsList[index].status = data.life == 1 ? 3 : 0
				}
			})
		}


		//暂时用 *****  扫码后进入 加载完抢购列表  自动参加最后一个抢购
		const joinLastPanicBuy = () => {
			console.log('自动参加最后一个抢购----->', env)
			if(!state.joinState && env != 'develop'){
				state.joinState = true
				wx.navigateTo({
					url: `./buyer/buyer?id=${state.goodsList[state.goodsList.length-1].id}`
				})
			}
		}
		
		const state = reactive({
			dataLoading: false,     //防止多次请求  2秒钟内不再请求
			goodsLoading: false,
			goodsList: [],          //抢购列表 数据
			goodsIds: [],
			pageNum: 10,            //每次加载的抢购列表数量
 			handleJoin,
			handleGoBackSubscription,
			handleSubscription,
			handleDetail,
			handleGoodsLoadMore,
			goodsDetail,
			store,
			joinState: false,
		})

		//goodsDataPage  列表滑到顶部 或 底部 加载更多的数据
		//homeGoodsState  商品的状态  开始或结束
		//previewId       预览抢购的id
		watch([goodsDataPage, homeGoodsState, previewId], ([newData, newState, newPreviewId], [oldData, oldState, oldPreviewId]) => {
			if(newData.length && JSON.stringify(newData) != JSON.stringify(oldData)){
				//切换场所后 清空抢购列表
				if(store.state.clearGoodsList) {
					state.goodsList = []
					state.goodsIds = []
				}

				if(state.goodsIds.includes(newData[0].index)){
					return
				}
				// newData = newData.splice(0, 10)
				goodsPage(newData)
				store.state.clearGoodsList = false
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
@import '../../../variables.less';
.goods_warp{
    margin: 24px 12px 0 12px;
	// padding-top: 128px;
    padding-bottom: 82px;

    .goods_loading{
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #fff;
    }
    
    .goods_item{
        // height: 223px;

		.goods_item_page{
			height: 223px;
		}
        
        &.goods_item_active{
            .goods_timeline{
                &_top{
                    background: @color_info;
                }
    
                &_line{
                    background: @color_info;
                }
            }
    
            .goods_content .time{
                color: @color_info;
            }
        }

        &.goods_item_end{
            .goods_timeline{
                &_top{
                    background: #919191;
                }
    
                &_line{
                    background: #919191;
                }
            }
    
            .goods_content .time{
                color: #919191;
            }
        }

        .goods_timeline{
            float: left;
            height: 100%;
            width: 11px;
            position: relative;
            text-align: center;

            &_top{
                display: inline-block;
                width: 11px;
                height: 11px;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 66;
            }

            &_line{
                width: 2px;
                height: 100%;
                background: #fff;
                display: inline-block;
            }
        }

        .goods_content{
            float: left;
            width: 334px;
            margin-left: 6px;
            margin-top: -2px;
            .time{
                font-size: 12px;
                padding-left: 5px;
                color: #fff;
                height: 17px;
                // color: @color_info;
            }

            .goods_info{
                padding-top: 3px;

                .state_wrap{
                    height: 24px;
                    padding: 36px 0 6px 0;
                    text-align: right;
                    image{
                        height: 24px;
                        display: inline-block;
                    }
                }

                .goods_card{
                    width: 334px;
                    height: 129px;

                    .goods_card_content{
                        width: 334px;
                        height: 117px;
                        background: url('../../../image/card_before_bottom.png') left bottom no-repeat, url('../../../image/card_before.png') 0 0 no-repeat;
                        box-shadow: 0px 0px 12px 0px rgba(187, 42, 68, 0.6), 0px 0px 36px 0px rgba(235, 155, 66, 0.6), 0px 0px 4px 0px rgba(0, 0, 0, 0.2), 0px 0px 12px 0px rgba(235, 155, 66, 0.6);
                        background-size: 334px 110px, 334px 117px;
                        border-radius: 12px;

                        .goods_introduce{
                            width: 100%;
                            height: 63px;
                            margin: 0 12px;

                            .goods_image{
                                float: left;
                                width: 126px;
                                height: 126px;
                                margin-top: -63px;
                            }

                            .goods_right_text{
                                display: inline-block;
                                width: 181px;
                                height: 63px;
                                padding-left: 3px;

                                .title{
                                    font-size: 16px;
                                    color: @color_primary;
                                    height: 22px;
                                    line-height: 22px;
                                    font-weight: 600;
                                }
                                
                                .desc{
                                    font-size: 12px;
                                    height: 17px;
                                    line-height: 17px;
                                    padding: 4px 0 0 6px;
                                    font-weight: 500;
                                }

                                .bonus_wrap{
                                    width: 100%;
                                    height: 18px;
                                    padding-top: 3px;
                                    text-align: right;

                                    .bonus_btn{
                                        height: 18px;   
                                        line-height: 18px;
                                        padding: 0 12px;
                                        display: inline-block;
                                        background: @color_info;
                                        color: @color_primary;
                                        font-size: 10px;
                                        border-radius: 10px;

                                        &.not_start{
                                            background: @color_primary;
                                            color: @color_info;
                                        }

                                        &.end{
                                            background: #DEDEDE;
                                            color: #000;
                                        }

                                        .price_num{
                                            font-size: 12px;
                                        }
                                    }
                                }

                            }

                        }

                        .goods_card_bottom{
                            padding: 6px 0;
                            margin: 0 12px;
                            height: 42px;
                            
                            .price{
                                float: left;
                                width: 160px;

                                .show_price{
                                    font-size: 12px;
                                    height: 22px;
                                    line-height: 22px;
                                    color: #fff;

                                    text.end{
                                        color: @color_info;
                                    }

                                    view.end{
                                        .number_warp{
                                            color: @color_info;
                                        }
                                        
                                        .original_price{
                                            color: #fff;
                                            padding-left: 3px;
                                            text-decoration:line-through @color_info;

                                            .price_before{
                                                font-size: 10px;
                                            }
        
                                            .price_num{
                                                font-size: 12px;
                                            }
                                            
                                            .price_after{
                                                font-size: 10px;
                                            }
                                        }
                                    }

                                    .label{
                                        font-size: 12px;
                                    }

                                    text.origin{
                                        color: #fff;
                                    }

                                    .number_warp{
                                        display: inline-block;
                                        padding: 0 3px;
                                        color: @color_primary;

                                        &.not_start{
                                            color: @color_info;
                                        }
                                    }

                                    .price_before{
                                        font-size: 12px;
                                    }

                                    .price_num{
                                        font-size: 16px;
                                    }
                                    
                                    .price_after{
                                        font-size: 12px;
                                        padding-right: 3px;
                                    }

                                    &.depreciate{
                                        text-align: right;
                                    }
                                    
                                }
                            }

                            .btn_wrap{
                                width: 143px;
                                height: 39px;
                                float: right;
                                image{
                                    height: 39px;
                                    width: 100%;
                                    margin-top: 21px;
                                    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2), 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
                                    border-radius: 12px;
                                }
                            }
                        }


                        &.not_start{
                            background: url('../../../image/card_default_bottom.png') left bottom no-repeat, url('../../../image/card_before.png') 0 0 no-repeat;
                            background-size: 668rpx 220rpx, 668rpx 234rpx;
                            box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.4), 0px 0px 4px 0px rgba(0, 0, 0, 0.2), 0px 0px 12px 0px rgba(185, 72, 255, 0.4);
                        }

                        &.end{
                            background: url('../../../image/card_end_bottom.png') left bottom no-repeat, url('../../../image/card_end.png') 0 0 no-repeat;
                            background-size: 668rpx 220rpx, 668rpx 234rpx;
                            box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15), 0px 0px 4px 0px rgba(0, 0, 0, 0.4), 0px 0px 12px 0px rgba(185, 72, 255, 0.4);
                        }
                    }
                }
            }
        }

        &.goods_text_item{
            height: 50px;

            .goods_content{
                .time{
                    display: inline-block;
                    border-radius: 4px;
                    padding: 3px 12px;
                    font-size: 10px;
                    height: auto;
                    line-height: 14px;
                    min-width: 10px;
                    word-wrap: break-word;
                    background: #F8A446;
                    color: #31113D;
                    position: relative;
                    border-radius: 6px;
                }
            }
        }

    }
}
</style>



