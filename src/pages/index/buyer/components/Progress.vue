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
                <image class="progress" src="../../../../image/progress_02.png" />
                <image 
                    class="bar_light" 
                    src="../../../../image/progress_light.png"
                ></image>
            </view>
        </view>

        <view class="progress_border"> </view>

        <!-- 当前价格 -->
        <view 
            class="current_price">
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
            :style="{ top: 100 - guessPosition + '%' }"
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
import { reactive, toRefs, computed } from 'vue'

export default {
    props: ['currentPrice', 'guessPrice'],
    setup(props) {
        const guessPosition = computed(() => {
            let price = props.currentPrice.int + props.currentPrice.decimals
            let guess = props.guessPrice.int + props.guessPrice.decimals
            if(price && guess){
                let parseInt1 = price.replace(',', '')
                let parseInt2 = guess.replace(',', '')
                
                let num = Number(parseInt2) / Number(parseInt1) * 100
                return num <=3 ? 3 : num >=100 ? 100 : num
            }else{
                return 0
            }
        })

        //设置抢购进度条长度
        const setProgressHeight = () => {
            let animation = wx.createAnimation({
                duration: 50000,
                timingFunction: 'ease-in-out',
            })

            animation.height(0).step()

            state.progressAnim = animation.export()

            let num = 50
            let timer = setInterval(() => {
                num -= 1
                if(num == 0){
                    clearInterval(timer)
                }
                // this.realTimePrice = 
            }, 1000);
        }

        const state = reactive({
            barHeight: 100,
            guessPosition,
            progressAnim: '',     //进度条动画
            realTimePrice: props.currentPrice,  //实时价格
            setProgressHeight
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');

    .progress_wrap{
        position: fixed;
        top: 140px;
        left: 0;
        width: 40px;
        height: 502px;
        background: url('../../../../image/progress_01.png') bottom no-repeat;
        background-size: 100% 100%;
        border-radius: 8px;
        z-index: 99;

        .bar{
            width: 16px;
            height: 502px;
            position: absolute;
            bottom: 0;
            left: 12.5px;
            border-radius: 8px;
            overflow: hidden;

            .bar_image{
                width: 16px;
                height: 502px;
                // background: url('../../../../image/progress_02.png') bottom no-repeat;
                // background-size: 100% 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                transition: all 0.1s ease;
                overflow: hidden;

                .progress{
                    width: 16px;
                    height: 502px;
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
            top: 0;
            left: 0;
            width: 40px;
            height: 502px;
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
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            position: absolute;
            z-index: 0;
            top: 100;
            left: 45px;
            transition: all .1 ease-in;

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
            top: 200px;
            z-index: 99;
            border-top-right-radius: 14px;
            border-bottom-right-radius: 14px;
            padding-right: 5px;

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