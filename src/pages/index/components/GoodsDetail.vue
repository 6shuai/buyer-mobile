<template>
    <view class="mask" v-if="showDialog"></view>
    <view  
        v-if="showDialog"
        @catchtouchmove="handleCatchtouchmove"
        class="dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">
            <view class="goods">
                <image :src="resData.goodsCover" />
                <view class="goods_name text_size_16">
                    <view class="name text_size_16">{{ resData.goodsName }}</view>
                    <view class="specification text_size_12_by">{{ resData.goodsDescription }}</view>
                </view>
            </view>

            <view class="content">
                <view class="game_time">
                    <text>{{ resData.beginTime }}</text>
                    <image v-if="resData.status == 0" mode="heightFix" src="../../../image/state_end.png" />
                    <image v-else-if="resData.status == 1" mode="heightFix" src="../../../image/state_not_start.png" />
                    <image v-else-if="resData.status == 2" mode="heightFix" src="../../../image/state_before.png" />
                    <image v-else mode="heightFix" src="../../../image/state_start.png" />
                </view>

                <view class="timeline">
                    <view class="timeline-item">
                        <view class="time">{{ resData.beginTime.split(' ')[1] }}</view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">猜价阶段</view>
                    </view>
                    <view class="timeline-item">
                        <view class="time">{{ findNewTime(resData.beginTime.split(' ')[1], resData.guessTime) }}</view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">抢购阶段</view>
                    </view>
                    <view class="timeline-item">
                        <view class="time"> </view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">结果公示</view>
                    </view>
                </view>
            </view>

            <view class="rule_box">
                <rule :data="resData" :height="pageHeight- 290"></rule>
            </view>

        </view>

        <!-- 按钮状态 -->
        <view class="btn_state">
            <image 
                v-if="resData.status == 0 && store.state.goodsDataState.orderedGoods.includes(resData.goodsId)" 
                mode="heightFix" 
                src="../../../image/btn_subscribe_2.png" 
            />
            <image 
                v-else-if="resData.status == 0" 
                mode="heightFix" 
                src="../../../image/btn_subscribe_3.png" 
                @tap.stop.prevent="handleGoBackSubscription(resData.goodsId)"
            />
            <image 
                v-else-if="resData.status == 1 && store.state.goodsDataState.orderedAuctions.includes(resData.id)" 
                mode="heightFix" 
                src="../../../image/btn_subscribe_1.png" 
            />
            <image 
                v-else-if="resData.status == 1" 
                mode="heightFix" 
                src="../../../image/btn_subscribe_1.png" 
                @tap.stop.prevent="handleSubscription(resData.id)"
            />
            <image 
                v-else 
                mode="heightFix" 
                src="../../../image/btn_start.png" 
                @tap.stop.prevent="handleJoin(resData)"
			/>
        </view>

    </view>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance, watch, computed, nextTick } from 'vue'
import Rule from '../../../components/Rule'
import { useStore } from 'vuex'
import { socketId } from '../../../utils/socketId'
import { showToast } from '../../../utils/index'
import mixin from '../../../mixins/index'


export default {
    emits: ['detaileHandleJoin'],
    components: {
        Rule
    },
    setup(props, { emit }) {
        const store = useStore()
        const { proxy } = getCurrentInstance()
        const { findNewTime } = mixin()

        //抢购详情
		const goodsDetail = computed(() => {
			return store.state.goodsDetail
		})

        onMounted(() => {
            
        })

        const handleShowPage = data => {
            proxy.$socket.socketSendMessage({
				id: socketId.getGoodsDetail,
				auctionId: data.id
			})

            wx.showLoading({
                title: '加载中'
            })
            

            state.resData = data
            state.showDialog = true
            
            store.state.showGoodsDetail = true
                
        }

        const handleClosePage = () => {
            state.showDialog = false
            store.state.showGoodsDetail = false
            wx.hideLoading()
        }

        //马上参加
		const handleJoin = (item) => {
			// store.dispatch('setGoodsDetail', item)
			// wx.navigateTo({
			// 	url: './buyer/buyer'
			// })
            emit('detaileHandleJoin', item)
		}

        //返场订阅
		const handleGoBackSubscription = goodsId => {
			proxy.$socket.socketSendMessage({
				id: socketId.goBackSubscribeGoods,
				goodsId: goodsId
			})
			showToast('返场订阅成功', 'success')
		}

		//预约抢购订阅
		const handleSubscription = id => {
			proxy.$socket.socketSendMessage({
				id: socketId.subscribeGoods,
				auctionId: id
			})
			showToast('预约抢购成功', 'success')
		}

        //抢购详情
		watch(goodsDetail, (newProps, oldProps) => {
			console.log('抢购详情的数据------->', newProps)
			wx.hideLoading()
            state.resData.guessRules = newProps.guessRules
            state.resData.guessTime = newProps.guessTime

            nextTick(() => {
                //创建节点选择器
                var query = wx.createSelectorQuery();
                query.select('.dialog_wrap').boundingClientRect()
                query.exec(function (res) {
                    state.pageHeight = res[0].height
                })
            })
		})

        //解决滚动穿透
        const handleCatchtouchmove = e => {
            // console.log(e)
        }

        const state = reactive({
            pageHeight: 600,
            resData: {},
            showDialog: false,
            handleShowPage,
            handleClosePage,
            handleJoin,
            handleGoBackSubscription,
            handleSubscription,
            findNewTime,
            handleCatchtouchmove,
            store
        })


        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');
    .dialog_wrap{
        

        .content{
            padding: 7px 24px;

            .game_time{
                font-size: 12px;
                line-height: 24px;

                image{
                    display: inline-block;
                    height: 24px;
                    margin-left: 5px;
                    vertical-align: top;
                }
            }

            .timeline{
                padding-top: 6px;
                width: 100%;
                display: inline-block;

                .timeline-item{
                    float: left;
                    text-align: left;
                    .time{
                        font-size: 10px;
                        color: rgba(0,0,0,0.6);
                        line-height: 13px;
                        display: inline-block;
                    }

                    .line{
                        width: 100%;
                        height: 2px;
                        margin: 12px 0;
                        background: @color_primary;
                        position: relative;

                        .dot{
                            width: 11px;
                            height: 11px;
                            background: @color_primary;
                            border-radius: 50%;
                            left: 0;
                            top: -8rpx;
                            position: absolute;
                        }
                    }

                    .text{
                        font-size: 10px;
                        color: rgba(0,0,0,0.6);
                        line-height: 13px;
                    }

                    &:nth-child(1){
                        width: 20%;
                    }

                    &:nth-child(2){
                        width: 76%;
                    }

                    &:nth-child(3){
                        width: 4%;

                        .line{
                            width: 0;
                        }

                        .text{
                            width: 46px;
                            margin-left: -30px;
                        }
                    }
                }
            }
        }

        .btn_state{
            width: 100%;
            height: 59px;
            position: absolute;
            bottom: 40px;
            left: 0;
            text-align: center;

            image{
                height: 59px;
                border-radius: 19px;
                display: inline-block;
            }
        }

        .rule_box{
            height: 450px;
            background: #fff url('../../../image/dialog_bg_01.png') left bottom no-repeat;
            background-size: 100%;
        }

    }
</style>