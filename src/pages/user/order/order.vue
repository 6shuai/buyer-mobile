<template>
    <view class="order_wrap">
        <view class="tabbar_nav">
            <view 
                v-for="(item, index) in tabbarList"
                :key="index"
                class="item"
                @tap="currentTabIndex=index"
                :class="{ active: currentTabIndex==index }">
                <text>{{item}}</text>
                <view class="bg"></view>
            </view>
        </view>

        <view class="order_list">
            <view class="order_item">
                <view class="message text_size_10">
                    订单将在5天12小时13分21秒后失效，请尽快完善物流信息
                </view>
                <view class="content">
                    <view class="goods clearfix">
                        <view class="goods_info">
                            <image src="" />
                            <view class="label">
                                <view class="goods_title overflow text_size_16">任天堂 Swich</view>
                                <view class="specification text_size_10">国行红蓝版</view>
                            </view>
                        </view>

                        <view class="right_price">
                            <view class="original text_size_12">￥2,099</view>
                            <view class="price_b">
                                <view class="discounts">
                                    已优惠
                                    <text class="ali_font">￥663.58</text>
                                </view>
                                <view class="number_warp text_size_16">
                                    <text class="price_num ali_font_bold"
                                        >1,680</text
                                    >
                                    <text class="price_after ali_font_bold text_size_14"
                                        >.00</text
                                    >
                                </view>
                            </view>
                        </view>

                    </view>

                    <view class="btn_wrap">
                        <view class="btn">
                            <text>完善物流信息</text>
                            <text class="desc">已支付343.32元订金</text>
                        </view>
                    </view>

                </view>
            </view>

            <view class="order_item">
                <view class="message text_size_10">
                    订单将在5天12小时13分21秒后失效，请尽快完善物流信息
                </view>
                <view class="content">
                    <view class="goods clearfix">
                        <view class="goods_info">
                            <image src="" />
                            <view class="label">
                                <view class="goods_title overflow text_size_16">任天堂 Swich</view>
                                <view class="specification text_size_10">国行红蓝版</view>
                            </view>
                        </view>

                        <view class="right_price">
                            <view class="original text_size_12">￥2,099</view>
                            <view class="price_b">
                                <view class="discounts">
                                    已优惠
                                    <text class="ali_font">￥663.58</text>
                                </view>
                                <view class="number_warp text_size_16">
                                    <text class="price_num ali_font_bold"
                                        >1,680</text
                                    >
                                    <text class="price_after ali_font_bold text_size_14"
                                        >.00</text
                                    >
                                </view>
                            </view>
                        </view>

                    </view>

                    <view class="btn_wrap">
                        <view class="btn">
                           支付尾款
                        </view>
                    </view>

                </view>
            </view>


        </view>

    </view>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    setup(){
        const state = reactive({
            tabbarList: ['全部', '待完善', '待领取/收货', '已完成'],
            currentTabIndex: 0,
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');

    .order_wrap{
        .tabbar{
            width: 100%;
            height: 46px;
            background: #fff;
            
            .item{
                line-height: 46px;
                font-size: 12px;
                margin-left: 12px;
                display: inline-block;
                opacity: .6;

                &.tab_active{
                    font-size: 16px;
                    color: @color_primary;
                    opacity: 1;
                }
            }
        }

        .order_list{
            width: 100%;

            .order_item{
                margin-top: 6px;
                background: #fff;

                .message{
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    color: @color_lightgray;
                    background: @color_warning;

                    image{
                        width: 13px;
                        height: 13px;
                        margin-right: 3px;
                    }
                }                

                .content{
                    height: 111px;
                    padding: 9px 12px;

                    .goods{

                        &_info{
                            width: 50%;
                            float: left;

                            image{
                                width: 54px;
                                height: 54px;
                                margin-top: 2px;
                                margin-right: 6px;
                            }

                            .label{
                                width: calc(100% - 60px);
                                display: inline-block;
                            }
                            .goods_title{
                                color: @color_primary;
                                line-height: 22px;
                            }

                            .specification{
                                color: @color_primary;
                                opacity: .6;
                                line-height: 14px;
                            }

                        }

                        .right_price{
                            width: 50%;
                            float: left;
                            padding-top: 17px;
                            text-align: right;

                            .original{
                                color: @color_primary;
                                opacity: .6;
                                line-height: 17px;
                                text-decoration: line-through
                            }

                            .price_b{

                                .discounts{
                                    display: inline-block;
                                    color: @color_primary;
                                    opacity: .6;
                                    font-size: 10px;
                                    vertical-align: bottom;

                                    .ali_font{
                                        padding-left: 3px;
                                    }
                                }

                                .number_warp{
                                    padding-left: 6px;
                                    display: inline-block;
                                    color: @color_primary;
                                    line-height: 22px;
                                }
                            }
                        }
                    }

                    .btn_wrap{
                        padding-top: 12px;
                        text-align: right;

                        .btn{
                            width: 143px;
                            height: 36px;
                            line-height: 36px;
                            text-align: center;
                            color: @color_lightgray;
                            font-size: 16px;
                            padding: 3px 0;
                            background: @color_primary;
                            border-radius: 12px;
                            display: inline-block;

                            text{
                                display: block;
                                line-height: 22px;
                            }

                            .desc{
                                font-size: 10px;
                                opacity: .6;
                                line-height: 14px;
                            }
                        }
                    }

                }
            }
        }
    }
</style>