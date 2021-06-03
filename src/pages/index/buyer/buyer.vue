<template>
	<view class="buyer_wrap page_bg">
		<page-head />

        <view 
            class="main" 
            :style="{ marginTop: headHeight + 'px' }"
            v-if="resData"
        >
            <view 
                class="play_explain text_size_12"
                @tap="handleClickRuleBtn"
            >
                <image src="../../../image/explain.png" />
                <text>怎么玩</text>
            </view>

            <view class="goods_wrap">
                <tooltip 
                    text="猜价阶段"
                    class="tooltip_wrap"
                ></tooltip> 
                <view class="goods">
                    <view class="tag_wrap">
                        <view class="tag">当前宝贝</view>
                    </view>
                    <view class="goods_card">
                        <view class="goods_image">
                            <image :src="resData.goodsCover" />
                        </view>
                        <view class="goods_desc">
                            <view class="title text_size_16">{{ resData.goodsName }}</view>
                            <view class="specification text_size_12_by">{{ resData.goodsDescription }}</view>
                        </view>
                        <view class="goods_price">
                            <view class="labe text_size_10">市场价</view>
                            <view class="price">
                                <view class="number_warp">
                                    <text class="price_before ali_font_bold text_size_12"
                                        >￥</text
                                    >
                                    <text class="price_num ali_font_bold"
                                        >{{ resData.marketValue.int }}</text
                                    >
                                    <text class="price_after ali_font_bold text_size_12"
                                        >{{ resData.marketValue.decimals }}</text
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="goods_video">
                    <video 
                        :autoplay="false" 
                        :loop="true"
                        src="https://quiz.xfengjing.com/video/2021/05/28/37a2aa0f-827c-4b06-9da9-2c7837b20b38.mp4">
                    </video>
                </view>

            </view>

            <view 
                class="guess_card_box"
                :class="{ 
                    already: currentState == 1,
                    count_down: currentState == 2,
                    buying: currentState == 3,
                    order: currentState == 4
                }"
            >
                <view class="card_bg">
                    <view class="card_content clearfix">


                        <view class="price_box overflow">
                            <view class="buy_watermark" v-if="currentState == 4">已抢到</view>
                            <view class="desc text_size_12_by">
                                <text>{{ 3 > currentState ? '猜价奖金' : currentState == 3 ? '实时价格' : '抢购价格' }}</text>
                            </view>
                            <view class="number_warp">
                                <text class="price_before ali_font_bold text_size_12"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_16"
                                    >{{ guessPriceNum.int || '???' }}</text
                                >
                                <text class="price_after ali_font_bold text_size_12"
                                    >{{ guessPriceNum.decimals }}</text
                                >
                            </view>
                        </view>

                        <view 
                            class="time_box text_overflow">
                            <view class="desc text_size_12_by"><text>{{ 3 > currentState ? '开始抢购' : '已优惠' }}</text></view>
                            <!-- 已优惠 -->
                            <view v-if="currentState >= 3" class="ali_font_bold number_warp text_size_16">10%</view>
                            <view v-else class="ali_font_bold number_warp text_size_16">{{ resData.beginTime.split(' ')[1] }}</view>
                        </view>
                    </view>
                </view>
                <view 
                    @tap="handleClickBuyBtn"
                    class="btn"
                >

                    <image
                        v-if="currentState == 2"
                        class="count_down_img" 
                        :src="countImg" 
                    />

                    <tooltip 
                        v-if="currentState==1"
                        text="稍微一等~抢购就要开始咯！"
                        class="tooltip_wrap"
                        :hasOpcity="true"
                    ></tooltip> 

                </view>
            </view>
            

        </view>

        <!-- 价格进度条 -->
        <price-progress 
            v-if="resData" 
            ref="priceProgress"
            :currentPrice="resData.marketValue"
            :guessPrice="guessPriceNum"
        ></price-progress>

        <!-- 极限猜价 -->
        <guess-price 
            ref="guessPrice"
            @goodsGuessPrice="goodsGuessPrice"

        ></guess-price>

        <!-- 确认支付 -->
        <buy ref="buyPage"></buy>

        <!-- 怎么玩 -->
        <how-to-play 
            ref="panicBuyRule"
            :data="resData"
        ></how-to-play>

	</view>
</template>
<script>
import PageHead from '../../../components/PageHead'
import Tooltip from '../../../components/Tooltip'
import PriceProgress from './components/Progress'
import GuessPrice from './components/GuessPrice'
import Buy from './components/Buy'
import HowToPlay from './components/HowToPlay'
import { reactive, ref, toRefs, computed, onMounted, getCurrentInstance, watch } from "vue"
import { useStore } from "vuex"
import mixin from '../../../mixins'
import { countDown } from './components/CountDown'
import { socketId } from '../../../utils/socketId'

export default {
	setup(props) {
        const buyPage = ref(null)
        const guessPrice = ref(null)
        const panicBuyRule = ref(null)
        const priceProgress = ref(null)
        const store = useStore()
        const { formatTime, priceFormat } = mixin()
        const instance = getCurrentInstance()

		const headHeight = computed(() => {
			return store.state.headerHeight
		})

        //抢购详情
        const panicBuyDetail = computed(() => {
            return store.state.panicBuyDetail
        })

        onMounted(() => {
            methods.init()
        })

        const methods = {
            //参加抢购
            init(){
                wx.showLoading({
                    title: '加载中',
                })
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                let id = currentPage.options.id
                console.log('id-----', id)
                instance.appContext.config.globalProperties.$socket.socketSendMessage({
                    id: socketId.joinBuy,
                    auctionId: id
                })
            },

            //显示猜价 窗口
            handleClickBuyBtn(){
                if(state.currentState == 0){
                    state.guessPrice.handleShowPage()
                }else if(state.currentState == 3){
                    state.buyPage.handleShowPage()
                }else if(state.currentState == 4){
                    wx.navigateTo({
                        url: '/pages/user/order/detail'
                    })
                }
            },

            //猜价
            goodsGuessPrice(price){
                instance.appContext.config.globalProperties.$socket.socketSendMessage({
                    id: socketId.guessPrice,
                    price: price
                })
                state.guessPriceNum = priceFormat(price)

                state.currentState = 1

                setTimeout(() => {
                    methods.buyCountDown()
                }, 2000);
            },

            //开始倒计时
            buyCountDown(){
                state.currentState = 2
                let num = 9;
                var timer = setInterval(() => {
                    num -= 1;
                    if(num == 0) {
                        clearInterval(timer)
                        
                        //倒计时结束 开始抢购
                        state.currentState = 3
                        //实时价格
                        state.guessPriceNum = state.resData.marketValue
                        //抢购进度条
                        state.priceProgress.setProgressHeight()

                        return
                        
                    }
                    state.countImg = countDown['countDown'+num]
                }, 1000);
            },

            //点击怎么玩  显示规则
            handleClickRuleBtn(){
                state.panicBuyRule.handleShowPage()
            }
        }
        
        watch(panicBuyDetail, (newProps, oldProps) => {
            state.resData = {
                ...newProps,
                beginTime:formatTime(newProps.beginTime),
				marketValue:priceFormat(newProps.marketValue),
				priceDeclineRate:priceFormat(newProps.priceDeclineRate)
            }
            wx.hideLoading()
        })

		const state = reactive({
            resData: undefined,
            currentState: 0,          //当前状态 0 猜价   1已猜价  2倒计时  3立即抢购     4查看订单
            guessPriceNum: {},        //猜的价格
            countImg: countDown.countDown9,             //倒计时图片
            buyPage,
            guessPrice,
            panicBuyRule,
            priceProgress,
            headHeight,
            ...methods
		});

		return toRefs(state);
	},
	components: {
		PageHead,
		Tooltip,
        PriceProgress,
        GuessPrice,
        Buy,
        HowToPlay,
	},
};
</script>

<style lang="less">
    @import url('./buyer.less');
    @import url('../../../variables.less');
</style>

