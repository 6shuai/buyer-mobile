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
                            <image :src="resData.goods.cover" />
                        </view>
                        <view class="goods_desc">
                            <view class="title text_size_16">{{ resData.goods.displayName }}</view>
                            <view class="specification text_size_12_by">{{ resData.goods.description }}</view>
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
                    <image 
                        v-if="!currentState || currentState >= 3 "
                        :src="resData.goods.showPicture" />
                    <video 
                        v-else
                        x5-video-player-type="h5"
                        :src="videoUrl"
                        :controls="false"
                        :autoplay="currentState < 3"
                        :show-center-play-btn="false"
                        @ended="handleVideoEnded">
                    </video>
                </view>

                <!-- 已抢购成功的用户 -->
                <buy-success-notice></buy-success-notice>
                
            </view>

            <view 
                class="guess_card_box"
                :class="{ 
                    'already': (currentState == 1 || !currentState) && guessPriceNum.int || guessPriceNum.decimals,
                    'count_down': currentState == 2,
                    'buying': currentState == 3,
                    'order': currentState == 4,
                    'sell_out': currentState == 5
                }"
            >
                <view class="card_bg">
                    <view class="card_content clearfix">


                        <view class="price_box overflow">
                            <view class="buy_watermark" v-if="currentState == 4 && buySuccess">已抢到</view>
                            <view class="buy_watermark" v-else-if="currentState == 4 && !buySuccess">已售罄</view>
                            <view class="desc text_size_12_by">
                                <text>{{ 3 > currentState ? '猜价奖金' : currentState == 3 ? '实时价格' : '抢购价格' }}</text>
                            </view>
                            <!-- 实时价格 -->
                            <view class="number_warp" v-if="currentState == 3 || currentState == 4">
                                <text class="price_before ali_font_bold text_size_12"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_16"
                                    >{{ realTimePrice.int }}</text
                                >
                                <text class="price_after ali_font_bold text_size_12"
                                    >{{ realTimePrice.decimals }}</text
                                >
                            </view>
                            <!-- 猜价价格 -->
                            <view class="number_warp" v-else>
                                <text class="price_before ali_font_bold text_size_12"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_16"
                                    >{{ guessPriceNum.int || '--' }}</text
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
                            <view v-if="currentState >= 3" class="ali_font_bold number_warp text_size_16">{{(100 - realTimePrice.full / resData.marketValue.full * 100).toFixed(2) }}%</view>
                            <view v-else class="ali_font_bold number_warp text_size_16">{{ resData.beginTime.split(' ')[1] }}</view>
                        </view>
                    </view>
                </view>
                <view 
                    @tap="handleClickBuyBtn"
                    class="btn"
                >
                    <view v-if="currentState == 2">
                        <image
                            class="count_down_img" 
                            :src="countImg" 
                        />
                    </view>

                    <tooltip 
                        v-if="currentState==1 && (guessPriceNum.int || guessPriceNum.decimals)"
                        text="稍微一等~抢购就要开始咯！"
                        class="tooltip_wrap"
                        :hasOpcity="true"
                    ></tooltip> 

                </view>
            </view>
            
            <!-- 价格进度条 -->
            <price-progress 
                ref="priceProgress"
                :goodsData="resData"
                :guessPrice="guessPriceNum"
            ></price-progress>

            <!-- 极限猜价 -->
            <guess-price 
                ref="guessPriceRef"
                :price="resData.marketValue"
                @goodsGuessPrice="goodsGuessPrice"

            ></guess-price>

            <!-- 确认支付 -->
            <buy 
                ref="buyPage"
                :price="resData.marketValue"
                @buyCallFun="buyCallFun"
                :goodsData="resData"
            ></buy>

            <!-- 怎么玩 -->
            <how-to-play 
                ref="panicBuyRule"
                :data="resData"
            ></how-to-play>
     
        </view>

	</view>
</template>
<script>
import PageHead from '../../../components/PageHead'
import Tooltip from '../../../components/Tooltip'
import PriceProgress from './components/Progress'
import GuessPrice from './components/GuessPrice'
import Buy from './components/Buy'
import HowToPlay from './components/HowToPlay'
import BuySuccessNotice from './components/BuySuccessNotice.vue'
import { reactive, ref, toRefs, computed, onMounted, getCurrentInstance, watch, nextTick } from "vue"
import { useStore } from "vuex"
import mixin from '../../../mixins'
import { showToast } from '../../../utils/index'
import { countDown } from './components/CountDown'
import { socketId } from '../../../utils/socketId'

export default {
	setup(props) {
        const buyPage = ref(null)
        const guessPriceRef = ref(null)
        const panicBuyRule = ref(null)
        const priceProgress = ref(null)
        const store = useStore()
        const { formatTime, priceFormat } = mixin()
        const { proxy } = getCurrentInstance()

		const headHeight = computed(() => {
			return store.state.headerHeight
		})

        //抢购详情
        const panicBuyDetail = computed(() => {
            return store.state.panicBuyDetail
        })

        //抢购状态
        const gamePanicBuyState = computed(() => {
            return store.state.gamePanicBuyState
        })
        
        //实时价格
        const realTimePrice = computed(() => {
            //抢购成功后 显示抢购价格, 不再显示实时价格
            if(state.buySuccess){
                return state.buySuccessPrice
            }
            return store.getters.getRealTimePrice
        })

        //抢购是否结束
        const gameIsEnd = computed(() => {
            return store.state.homeGoodsState
        })

        onMounted(() => {
            methods.init()

            //清空订单信息
            store.commit('SET_BUY_SUCCESS_ORDER', {})
        })

        const methods = {
            //参加抢购
            init(){
                // if(store.state.panicBuyDetail){
                //     this.getGoodsDetail(store.state.panicBuyDetail)
                //     return
                // }
                wx.showLoading({
                    title: '加载中',
                })

                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                let id = currentPage.options.id

                let userInfo = wx.getStorageSync('userInfo')
                let { nickName, avatarUrl } = JSON.parse(userInfo)

                //发送获取抢购详情请求
                proxy.$socket.socketSendMessage({
                    id: socketId.joinBuy,
                    auctionId: id,
                    nickname: nickName,
                    avatar: avatarUrl// 头像

                })
            },

            //抢购详情数据
            getGoodsDetail(data){
                state.resData = {
                    ...data,
                    beginTime: formatTime(data.beginTime),
                    marketValue: priceFormat(data.marketValue),
                    currentPrice: priceFormat(data.currentPrice),
                    priceDeclineRate: priceFormat(data.priceDeclineRate)
                }
                this.gameState(data.gameStateId)
                wx.hideLoading()
            },

            //播放抢购视频
            playGoodsVideo(){
                state.videoUrl = state.resData.goods.video[state.currentVideoIndex].url
            },

            //视频播放结束
            handleVideoEnded(){
                let videoTotal = state.resData.goods.video.length
                state.currentVideoIndex = state.currentVideoIndex + 1 >= videoTotal ? 0 : state.currentVideoIndex + 1
                this.playGoodsVideo()
            },

            //显示猜价 窗口
            handleClickBuyBtn(){
                switch (state.currentState) {
                    case 0:
                    case 1:
                        if(!state.guessPriceNum.full) state.guessPriceRef.handleShowPage()
                        break;
                    case 2:
                        console.log('开始倒计时')
                        break;                    
                    case 3:
                        state.buyPage.handleShowPage()
                        break;
                    case 4:
                        // wx.navigateTo({
                        //     url: '/pages/user/order/detail'
                        // })
                        state.buyPage.payState = state.buySuccess ? 'success' : 'error'
                        state.buyPage.handleShowPage()
                        break;
                    default:
                        break;
                }
            },

            //猜价
            goodsGuessPrice(price){
                proxy.$socket.socketSendMessage({
                    id: socketId.guessPrice,
                    price: price
                })
                state.guessPriceNum = priceFormat(price)

                //当前抢购id 对应的猜价就价格 存起来, 下次进入抢购页直接获取
                store.dispatch('setGoodsGuessPrice', {
                    id: state.resData.auctionId,
                    price
                })

                // state.currentState = 1
            },

            //开始倒计时
            buyCountDown(countNum = state.resData.countdown){
                let num = countNum
                if(num > 9) state.currentState = 1
                state.timer = setInterval(() => {
                    num -= 1;
                    if(num == 0) {
                        clearInterval(state.timer)
                        //倒计时结束 开始抢购
                        return
                        
                    }
                    console.log('num----------->', num)
                    if(num <= 9) {
                        state.currentState = 2
                        state.countImg = countDown['countDown'+num]
                    }
                }, 1000);
            },

            //开始抢购
            gameStart(){
                try {
                    if(state.guessPriceRef.showDialog){
                        state.guessPriceRef.showDialog = false
                        showToast('猜价阶段已结束')
                    }
                } catch (error) {
                    
                }
                //抢购进度条
                nextTick(() => {
                    state.priceProgress.setProgressHeight()
                })
            },

            //点击怎么玩  显示规则
            handleClickRuleBtn(){
                state.panicBuyRule.handleShowPage()
            },

            //抢购状态
            gameState(status){
                clearInterval(state.timer)
                state.currentState = status
                console.log(state.currentState, status)
                switch (status) {
                    //0预热阶段，1竞猜阶段，2开始倒计时，3出价阶段, 4查看订单 5抢购结束
                    case 0:
                        
                        break;
                    case 1:
                        if(state.resData.goods.video && state.resData.goods.video.length) this.playGoodsVideo()
                        break;
                    case 2:
                        this.buyCountDown(state.resData.countdown)
                        break;
                    case 3:
                        this.gameStart()
                        break;
                    default:
                        break;
                }
            },

            //支付后 回调    price 抢购成功的价格
            buyCallFun(price){
                state.currentState = 4
                state.buySuccessPrice = price
                state.buySuccess = true
            }
        }
        
        watch([panicBuyDetail, gamePanicBuyState, gameIsEnd], ([newDetail, newState, newIsEnd], [oldDetail, oldState, oldIsEnd]) => {
            //抢购详情
            if(!state.resData){
                methods.getGoodsDetail(newDetail)

                //抢购猜价 价格
                console.log(store.state.goodsGuessPrice)
                if(store.state.goodsGuessPrice[newDetail.auctionId]){
                    state.guessPriceNum = priceFormat(store.state.goodsGuessPrice[newDetail.auctionId])
                }
            }

            //抢购状态
            if(newState != oldState){
                console.log('游戏状态--------->', newState)
                methods.gameState(newState)
            }

            //抢购是否结束 
            //life 1 开始   2结束
            if(newIsEnd && newIsEnd.auctionId == state.resData.auctionId && newIsEnd.life == 2){
                state.currentState = 4
                state.priceProgress.gameOver()
                if(!state.buyPage.showDialog){
                    state.buyPage.handleShowPage('settleAccounts')
                }
            }
        })

		const state = reactive({
            resData: undefined,
            timer: undefined,
            videoUrl: '',
            currentVideoIndex: 0,     //当前播放的视频索引
            currentState: 0,          //当前状态 0 猜价   1已猜价  2倒计时  3立即抢购     4查看订单
            guessPriceNum: {},        //猜的价格
            buySuccess: false,         
            buySuccessPrice: null,    //支付成功的价格
            countImg: countDown.countDown9,             //倒计时图片
            buyPage,
            guessPriceRef,
            realTimePrice,
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
        BuySuccessNotice,
	},
};
</script>

<style lang="less">
    @import url('./buyer.less');
    @import url('../../../variables.less');
</style>

