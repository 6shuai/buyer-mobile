<template>
    <view 
        v-if="showDialog"
        class="buy_dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">
            <view class="goods">
                <image src="" />
                <view class="goods_name text_size_16">
                    <view class="name text_size_16 text_overflow">任天堂 Swich</view>
                    <view class="specification text_size_12_by">国行红蓝版</view>
                </view>
            </view>

            <view v-if="payState == 'success'" class="buy_success">抢购成功</view>
            <view v-if="payState == 'error'" class="buy_fail">抢购失败</view>
            
            <view class="dialog_price_content">
                <view class="desc text_size_12">实时抢购价：</view>
                <view class="price_wrap">
                    <view class="price_before ali_font_bold"
                        >￥</view
                    >
                    <view class="num_item">
                        <text>9</text>
                    </view>
                    ,
                    <view class="num_item">
                        <text>9</text>
                    </view>
                    <view class="num_item">
                        <text>9</text>
                    </view>
                    <view class="num_item">
                        <text>9</text>
                    </view>
                    .
                    <view class="num_item">
                        <text>9</text>
                    </view>
                    <view class="num_item">
                        <text>9</text>
                    </view>
                </view>

                <view class="original_price">
                    <view class="original text_size_10_by">
                        <text class="label">原价</text>
                        <view class="number_warp">
                            <text class="price_before ali_font_bold"
                                >￥</text
                            >
                            <text class="price_num ali_font_bold text_size_12_by"
                                >1,680</text
                            >
                            <text class="price_after ali_font_bold"
                                >.00</text
                            >
                        </view>
                    </view>

                    <view class="economize text_size_10">
                        <text class="label">已省</text>
                        <view class="number_warp">
                            <text class="price_before ali_font_bold"
                                >￥</text
                            >
                            <text class="price_num ali_font_bold text_size_12"
                                >1,680</text
                            >
                            <text class="price_after ali_font_bold"
                                >.00</text
                            >
                        </view>
                    </view>

                </view>
            </view>

            <!-- 支付之前 -->
            <view class="buy_before">
                <!-- 领取方式 -->
                <view class="payment_wrap">
                    <view class="text_t" text_size_12_by>请选择该宝贝的领取方式</view>
                    
                    <view class="mode">
                        <view
                            class="item" 
                            v-for="item in 2" 
                            :key="item"
                            @tap="payment = item"
                            :class="{ active: payment==item }"
                        >
                            <view class="checkbox">
                                <view class="checked" v-show="payment==item"></view>
                            </view>
                            <view class="content">
                                <view class="type text_size_14_by">门店领取</view>
                                <view class="desc text_size_12_by">五角场合生汇 3F 顺电</view>
                            </view>
                            <view class="right_price">
                                <view class="label text_size_10_by">支付定金</view>
                                <view class="price">
                                    <view class="number_warp">
                                        <text class="price_before ali_font_bold text_size_10_by"
                                            >￥</text
                                        >
                                        <text class="price_num ali_font_bold text_size_12_by"
                                            >1,680</text
                                        >
                                        <text class="price_after ali_font_bold text_size_10_by"
                                            >.00</text
                                        >
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 说明 -->
                <view class="buy_desc">
                    支付￥384.73定金，以￥1923.64价格预定该宝贝，支付后前往指定门店领取该宝贝，领取时支付剩余尾款。90天内未领取该宝贝则本订单失效，所支付定金不予退还。
                </view>
                
                <view class="buy_tip text_size_10_by">确认支付表示同意以上购买规则</view>
                <view class="buy_btn_wrap">
                    <view class="buy_btn" @tap="handlePay">
                        <view class="btn_text">确认支付</view>
                        <view class="price">
                            <view class="number_warp">
                                <text class="price_before ali_font_bold text_size_10"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_12"
                                    >1,680</text
                                >
                                <text class="price_after ali_font_bold text_size_10"
                                    >.00</text
                                >
                            </view>
                        </view>
                    </view>
                </view>

            </view>

            <!-- 支付成功后 -->
            <view 
                class="buy_success_wrap"
                v-if="payState == 'success'"
            >
                <view class="item" v-for="item in 11" :key="item">
                    <view class="label">领取方式</view>
                    <view class="value">门店领取</view>
                </view>

                <view class="buy_btn_wrap">
                    <view class="buy_btn">
                        查看领取码
                    </view>
                </view>
            </view>

        </view>

    </view>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { socketId } from '../../../../utils/socketId'

export default {
    setup(props) {
        const instance = getCurrentInstance()

        const handleShowPage = () => {
            state.showDialog = true
        }

        const handleClosePage = () => {
            state.showDialog = false
        }

        //确认支付
        const handlePay = () => {
            // instance.appContext.config.globalProperties.$socket.socketSendMessage({
            //     id: socketId.buy,
            //     bidPrice: 100,// 抢购的金额
            //     paidPrice: 100, // 支付成功的金额
            // })

            wx.showToast({
                title: '支付成功'
            })
        }

        const state = reactive({
            payment: 1,      //领取方式
            payState: '',    //支付状态
            showDialog: false,
            handleShowPage,
            handleClosePage,
            handlePay
        })


        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');

    .buy_dialog_wrap{
        width: 100%;
        height: 80%;
        background: #f2f2f2 url(../../../../image/card_default_bottom.png) left bottom no-repeat;
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

        .buy_success, .buy_fail{
            width: 100%;
            height: 60px;
            line-height: 60px;
            background: radial-gradient(ellipse, #fadc6d, #e59052);
            background-blend-mode: overlay;
            box-shadow: inset 0px 0px 12px #eb9b42;
            font-size: 30px;
            color: #fff;
            text-align: center;
        }

        .buy_fail{
            background: radial-gradient(ellipse, #6d5d74, #483D4C);
            box-shadow: 0px 0px 4px #ffffff, inset 0px 0px 4px rgba(0,0,0,0.6);
        }

        .goods{
            display: flex;
            margin-left: 24px;

            image{
                width: 118px;
                height: 118px;
                margin-top: -59px;
            }

            .goods_name{
                padding: 3px 3px 0 3px;
                width: calc(100% - 130px);

                .name{
                    line-height: 30px;
                }

                .specification{
                    line-height: 16px;
                }
            }
        }

        .dialog_price_content{
            padding: 24px 42px 0px 24px;

            .desc{
                line-height: 16px;
            }

            .price_wrap{
                margin-top: 7px;
                font-weight: bold;
                font-size: 36px;
                display: flex;
                justify-content: center;
                color: @color_info;

                .price_before{
                    font-size: 28px;
                }

                .num_item{
                    width: 33px;
                    height: 50px;
                    border-radius: 6px;
                    background: @color_primary;
                    margin: 0 3px;

                    text{
                        width: 33px;
                        height: 50px;
                        display: inline-block;
                        text-align: center;
                        font-size: 36px;
                        color: @color_info;
                    }
                }
            }

            .original_price{
                padding-top: 6px;
                text-align: right;

                .number_warp{
                    display: inline-block;
                }

                .original{
                    margin-right: 6px;
                    display: inline-block;
                }

                .economize{
                    display: inline-block;
                }
            }
        }

        .buy_before{
            padding-top: 22px;
        }

        .payment_wrap{
            padding-top: 22px;

            .text_t{
                line-height: 16px;
                padding: 0 0 6px 12px;
            }

            .mode{
                width: 100%;

                .item{
                    height: 40px;
                    margin-top: 3px;
                    background: #fff;
                    display: flex;
                    padding: 12px 24px;
                    border-top: 1px solid #c7c7c7;
                    border-bottom: 1px solid #c7c7c7;

                    .checkbox{
                        margin: 13px 12px 9px 0;
                        width: 18px;
                        height: 18px;
                        background: @color_primary;
                        border-radius: 50%;
                        text-align: center;

                        .checked{
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background: @color_info;
                            display: inline-block;
                            vertical-align: top;
                            margin-top: 7px;
                        }
                    }

                    .content{
                        width: 240px;

                        .type{
                             line-height: 19px;
                        }

                        .desc{
                            line-height: 16px;
                            padding-top: 4px;
                        }
                    }

                    .right_price{
                        width: 65px;
                        text-align: right;

                        .label{
                            line-height: 13px;
                        }


                    }

                    &.active{
                        .content view{
                            opacity: 1;
                        }   
                        .right_price view, .right_price text{
                            opacity: 1;
                        }
                    }
                }
            }
        }

        .buy_desc{
            padding: 6px 24px 15px 24px;
            font-size: 10px;
            color: #000;
            line-height: 13px;
        }

        .buy_tip{
            text-align: center;
            line-height: 13px;
        }

        .buy_btn_wrap{
            padding-top: 4px;
            text-align: center;

            .buy_btn{
                display: inline-block;
                width: 327px;
                height: 63px;
                font-size: 16px;
                line-height: 63px;
                background: @color_info;
                border-radius: 12px;
                color: #fff;
                text-align: center;

                .btn_text{
                    font-size: 16px;
                    line-height: 21px;
                    padding-top: 12px;
                }

                .price{
                    padding-top: 1px;
                    line-height: 1;
                    text{
                        color: #fff;
                    }
                }
            }
        }

        .buy_success_wrap{
            padding: 12px 20px;
            
            .item{
                height: 17px;
                margin-bottom: 6px;
                display: flex;
                color: @color_primary;

                .label{
                    width: 62px;
                    font-size: 10px;
                    text-align: right;
                    line-height: 16px;
                }

                .value{
                    width: calc(100% - 68px);
                    padding-left: 6px;
                    font-size: 12px;
                    line-height: 16px;
                }
            }
        }
    }
</style>