<template>
    <view class="dialog_wrap" v-if="showDialog">
        <view class="close_btn" @tap="showDialog = false">
            <image src="../../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">
            <view class="title">
                <text class="introduce">怎么玩</text>
                <text class="title_name text_size_16">极限猜价</text>
            </view>
            
            <view class="dialog_content">
                <view class="desc text_size_12">竞猜本场的极限秒杀价：</view>
                <view class="price_wrap">
                    <view class="price_before ali_font_bold"
                        >￥</view
                    >
                    <view 
                        v-for="(item, index) in 6"
                        :key="index"
                        class="num_wrap">
                        <view 
                            class="num_item"
                            :class="{ num_item_active: currentInputNum(index), input_focus: currentFocusIndex==index }">
                            <text class="input_number">
                                {{ iptValue.length >= index+1 ? iptValue[index] : '' }}
                            </text>
                        </view>
                        <text v-if="index==0" :class="{ show_comma: iptValue[0] === '0' ? true : false }">,</text>
                        <text v-if="index==3">.</text>
                    </view>

                    <input 
                        class="input_hide" 
                        maxlength="6" 
                        @input="handleChangeInput" 
                        @focus="hangdleInputFocus"
                        type="number" 
                        focus 
                    />

                </view>

                <view 
                    class="dialog_btn"
                >
                    <view class="btn" v-show="iptValue.length != 6">会是什么价格呢...</view>
                    <view 
                        class="btn btn_active" 
                        v-show="iptValue.length == 6"
                        @tap="handleGuessPrice"
                    >猜这个，不改了</view>
                </view>

            </view>
        </view>

    </view>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
export default {
    emits: ['goodsGuessPrice'], 
    setup(props, { emit }) {
        const inputNumber = ref(null)
        const handleShowPage = () => {
            state.showDialog = true
        }

        //input 输入
        const handleChangeInput = (e) => {
            state.iptValue = e.target.value
            state.currentFocusIndex = e.target.cursor
        }

        //input 获得焦点
        const hangdleInputFocus = (e) => {
            let len = e.target.value
            state.currentFocusIndex = len.length 
        }

        //当前input 位置数字是否为0
        const currentInputNum = (index) => {
            let str = state.iptValue.substring(0, index+1)
            if(Number(str) && state.iptValue[index]){
                return true
            }
            return false
        }

        //猜价  确定
        const handleGuessPrice = () => {
            let str = String(state.iptValue)
            let price = str.slice(0, 4) + '.' + str.slice(4)
            emit('goodsGuessPrice', Number(price))
            state.showDialog = false
        }



        const state = reactive({
            showDialog: false,
            priceNumber: [],
            iptValue: '',
            currentFocusIndex: null,    //当前聚焦的input 
            inputNumber,
            handleShowPage,
            handleChangeInput,
            hangdleInputFocus,
            currentInputNum,
            handleGuessPrice
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');

    .dialog_wrap{
        width: 100%;
        height: 222px;
        background: #ffffff;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        box-shadow: 0px 0px 4px rgba(0,0,0,0.2);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9999;

        .close_btn{
            width: 60px;
            height: 60px;
            position: absolute;
            top: -30px;
            right: 0;
        }

        .dialog_box{
            padding: 12px 24px;
        }

        .title{
            line-height: 21px;
            text-align: center;
            
            .introduce{
                color: #f2f2f2;
                font-size: 12px;
                float: left;
                width: 60px;
            }
            
            .title_name{
                width: 70px;
                padding: 0 60px 0 0;
                display: inline-block;
            }
        }

        .dialog_content{
            padding-top: 18px;

            .desc{
                line-height: 16px;
            }

            .price_wrap{
                margin-top: 7px;
                font-weight: bold;
                font-size: 36px;
                display: flex;
                justify-content: center;
                position: relative;

                .price_before{
                    font-size: 28px;
                    color: @color_primary;
                }

                .num_item{
                    width: 33px;
                    height: 50px;
                    border-radius: 6px;
                    background: #dad8d8;
                    margin: 0 3px;
                    display: inline-block;
                    vertical-align: top;
                    color: rgba(72, 61, 76, .1);

                    &.input_focus{
                        background: @color_info;
                    }
                    
                    &.num_item_active{
                        background: @color_primary;
                        color: @color_info;
                    }


                    .input_number{
                        display: inline-block;
                        width: 33px;
                        height: 50px;
                        text-align: center;
                        font-size: 36px;
                    }
                }

                .show_comma{
                    opacity: 0;
                }

                .input_hide{
                    position: absolute;
                    width: 200%;
                    height: 100%;
                    top: 0;
                    left: -100%;
                    opacity: 0;
                    color: rgba(0,0,0,0);
                    caret-color: rgba(0,0,0,0.1);
                }
            }

            .dialog_btn{
                padding-top: 24px;
                text-align: center;

                .btn{
                    display: inline-block;
                    width: 179px;
                    height: 44px;
                    line-height: 44px;
                    font-size: 14px;
                    background: #f2f2f2;
                    padding: 0 10px;
                    border-radius: 6px;

                    &.btn_active{
                        background: @color_info;
                    }
                }
            }
        }
    }
</style>