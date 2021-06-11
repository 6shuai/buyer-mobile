<template>
    <view class="progress_wrap">
        <view 
            class="bar"
        >
            <view 
                class="bar_image"
                :animation="progressAnim"
                :style="{ height: barHeight + '%' }"
            >
                <image 
                    class="progress" 
                    src="../../../../image/progress_02.png"
                    :style="{ height: progressBarHeight ? progressBarHeight + 'px' : '100%' }"
                />
                <image 
                    class="bar_light" 
                    src="../../../../image/progress_light.png"
                ></image>
            </view>
        </view>

        <view class="progress_border"> </view>

        <!-- 当前价格 -->
        <view 
            class="current_price"
            :style="{ top: currentPriceTop + '%' }"
        >
            <view class="arrow"></view>
            <view class="number_warp">
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
        </view>


        <!-- 猜的价格 -->
        <view 
            class="guess_price" 
            :style="{ top: 100 - guessPosition < 0 ? 0 : 100 - guessPosition + '%' }"
            v-if="guessPrice.int">
            <view class="arrow"></view>
            <view class="number_warp">
                <text class="price_before ali_font_bold text_size_12"
                    >￥</text
                >
                <text class="price_num ali_font_bold text_size_16"
                    >{{ guessPrice.int }}</text
                >
                <text class="price_after ali_font_bold text_size_12"
                    >{{ guessPrice.decimals }}</text
                >
            </view>
            <view class="cai text_size_10_by">猜</view>
        </view>

    </view>
</template>

<script>
import { reactive, toRefs, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import mixin from '../../../../mixins'

export default {
    props: ['goodsData', 'guessPrice'],
    setup(props) {
        const store = useStore()
        const { priceFormat } = mixin()
        //currentPrice              抢购价格
        //priceDeclineRate          每分钟下降金额
        //priceDecline              每次下降多少钱
        //priceDeclineFrequency     多少时间下降一次
        let { currentPrice, priceDeclineRate, priceDeclineFrequency, priceDecline, marketValue } = props.goodsData 
        priceDecline = priceDecline
        priceDeclineRate.full = priceDeclineRate.full
        priceDeclineFrequency = priceDeclineFrequency ? priceDeclineFrequency : 1

        //猜价价格  在进度条出现的位置
        const guessPosition = computed(() => {
            let price = currentPrice.full
            let guess = props.guessPrice.full
            if(price && guess){
                let num = Number(guess) / Number(price) * 100
                return num
            }else{
                return 0
            }
        })

        //设置抢购进度条长度
        const setProgressHeight = () => {
            state.barHeight = (currentPrice.full / marketValue.full) * 100
            setTimeout(() => {
                let animation = wx.createAnimation({
                    duration: (currentPrice.full / priceDeclineRate.full) * 60000,
                    timingFunction: 'ease-in-out',
                })
                animation.height(0).step()
    
                state.progressAnim = animation.export()

                var query = wx.createSelectorQuery();
                query.select('.bar').boundingClientRect()
                query.exec(function (res) {
                    state.progressBarHeight = res[0].height
                })
            }, 200);


            setRealTimePrice(currentPrice.full, priceDeclineFrequency)
        }

        //实时价格
        const setRealTimePrice = (price, priceDeclineFrequency) => {
            clearTimeout(state.timer)
            let newPrice = price - priceDecline
            console.log(price, priceDecline)
            if(newPrice <=0 ) {
                newPrice = 0
                return
            }
            state.realTimePrice = priceFormat(newPrice)
            store.dispatch('setRealTimePrice', state.realTimePrice)

            //实时价格 标签 位置
            var query = wx.createSelectorQuery();
            query.select('.bar_image').boundingClientRect()
            query.exec(function (res) {
                if(!res[0] || !res[0].height) return
                state.currentPriceTop = 100 - res[0].height / state.progressBarHeight * 100
            })


            state.timer = setTimeout(() => {
                setRealTimePrice(newPrice, priceDeclineFrequency)
            }, priceDeclineFrequency * 1000);
        }

        //抢购结束
        const gameOver = () => {
            clearInterval(state.timer)
            let animation = wx.createAnimation({
                duration: 1000,
            })
            animation.height(100 - state.currentPriceTop + '%').step()
            state.progressAnim = animation.export()
        }

        //页面销毁
        onUnmounted(() => {
            clearTimeout(state.timer)
        })

        const state = reactive({
            barHeight: 100,
            guessPosition,
            progressBarHeight: 0,  //进度条原始高度 px
            progressAnim: '',      //进度条动画
            realTimePrice: currentPrice,  //实时价格
            currentPriceTop: 0,
            timer: undefined,
            setProgressHeight,
            gameOver
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');

    .progress_wrap{
        position: fixed;
        top: 18%;
        left: 0;
        width: 40px;
        height: 60%;
        background: url('../../../../image/progress_01.png') bottom no-repeat;
        background-size: 100% 100%;
        border-radius: 8px;
        z-index: 99;

        .bar{
            width: 16px;
            height: 100%;
            position: absolute;
            bottom: 0;
            left: 12.5px;
            border-radius: 8px;
            overflow: hidden;

            .bar_image{
                width: 16px;
                height: 100%;
                // background: url('../../../../image/progress_02.png') bottom no-repeat;
                // background-size: 100% 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                transition: all 0.1s ease;
                overflow: hidden;

                .progress{
                    width: 16px;
                    height: 100%;
                    position: absolute;
                    bottom: 0;
                    z-index: -1;
                }
            }

            .bar_light{
                width: 30px;
                height: 19px;
                display: block;
                margin-left: -6px;
                margin-top: -7px;
            }
        }

        .progress_border{
            position: absolute;
            top: -1px;
            left: 0;
            width: 40px;
            height: 100%;
            background: url('../../../../image/progress_03.png') bottom no-repeat;
            background-size: 100% 100%;
        }

        .current_price, .guess_price{
            display: inline-block;
            min-width: 60px;
            height: 22px;
            line-height: 22px;
            padding: 3px 12px;
            background: #5FB890;
            border-radius: 4px;
            position: absolute;
            z-index: 0;
            top: 0;
            left: 45px;
            transition: all .1 ease-in;
            margin-top: -15px;

            text{
                color: #fff;
            }

            .arrow{
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border: 14px solid #00000000;
                border-right-color: #5FB890;
                top: 0;
                left: -27px;
            }
        }

        .guess_price{
            display: flex;
            background: @color_darkgray;
            top: 0;
            z-index: 99;
            border-top-right-radius: 14px;
            border-bottom-right-radius: 14px;
            padding: 3px 5px;

            .arrow{
                border-right-color: @color_darkgray;
            }

            .cai{
                display: inline-block;
                width: 17px;
                height: 17px;
                line-height: 17px;
                background: #AEA9AF;
                border-radius: 50%;
                font-size: 10px;
                margin-top: 2px;
                margin-left: 3px;
                text-align: center;
            }
        }
    }
</style>