<template>
    <scroll-view :style="{ height: height +'px' }" :scrollY="true">
        <view class="rule_warp" v-if="resData">
            <view class="tabbar_nav">
                <view 
                    v-for="(item, index) in ['极限抢购', '极限猜价']"
                    :key="index"
                    class="item"
                    @tap="handleChangeTab(index)"
                    :class="{ active: currentTabIndex==index }">
                    <text>{{item}}</text>
                    <view class="bg"></view>
                </view>
            </view>

            <!-- 抢购规则 -->
            <view v-show="currentTabIndex==0" class="rule_item">
                <view class="rule_content">
                    <view class="list">
                        <view class="rule_image">
                            <view class="number_warp">
                                <text class="price_before ali_font_bold text_size_10"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_12"
                                    >{{ resData.marketValue.int }}</text
                                >
                                <text class="price_after ali_font_bold text_size_10"
                                    >{{ resData.marketValue.decimals }}</text
                                >
                            </view>
                            <view class="number_warp number_warp_b">
                                <text class="price_before ali_font_bold text_size_10"
                                    >￥</text
                                >
                                <text class="price_num ali_font_bold text_size_12"
                                    >????</text
                                >
                                <text class="price_after ali_font_bold text_size_10"
                                    >.?</text
                                >
                            </view>
                        </view>
                        <view class="desc right">
                            抢购开始后，抢购商品从<text class="hightlight ali_font_bold">￥{{ resData.marketValue.int }}{{ resData.marketValue.decimals }}</text>
                            开始降价，每秒降价一次，每分钟累计降价<text class="hightlight ali_font_bold">￥{{ resData.priceDeclineRate.int }}{{ resData.priceDeclineRate.decimals }}</text>。
                        </view>
                    </view>
                    <view class="list">
                        <view class="desc">
                            在商品降价的过程中，你可以在任意时间以当前的价格购买本商品。每场抢购商品的数量未知，商品一经售罄，抢购立即停止。
                        </view>
                        <view class="rule_image rule_02 right">
                        </view>
                    </view>
                    <view class="list">
                        <view class="rule_image rule_03">
                        </view>
                        <view class="desc right">
                            你可以选择在开始库存充足时尽快的拍下你心动的商品，也可以抱着博一博的心态等待商品到达一个令人无法抗拒的价格，这一切取决于你自己。
                        </view>
                    </view>
                    <view class="list">祝你在「极限买手」玩得开心！</view>
                </view>
            </view>

            <!-- 猜价规则 -->
            <view v-show="currentTabIndex==1" class="rule_item">
                <view class="rule_content">
                    <view class="explain">抢购开始前，竞猜本场的极限成交价（本场最后一单的成交价）；所有猜对的人根据以下规则平分竞猜奖金。</view>

                    <view class="list" v-for="(item, index) in guessRules" :key="index">
                        <view class="left">
                            <view class="example">
                                <view class="state" v-for="(block, bIndex) in 6" :key="bIndex">
                                    <view 
                                        class="state_image"
                                        :class="{ state_image_success: item.rule.includes(bIndex) }"
                                    ></view>
                                    <view class="dot" v-if="bIndex == 3">.</view>
                                </view>
                            </view>
                            <view class="success_num">
                                猜对任意<text class="hightlight">{{ item.correctDigit || 0 }}位</text>
                            </view>
                        </view>
                        <view class="bonus">
                            平分<text class="hightlight ali_font_bold">{{ item.award || 0 }}</text>元奖金
                        </view>
                    </view>

                </view>
            </view>

        </view>
    </scroll-view>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
export default {
    props: ['data', 'height'],
    setup(props) {


        const guessRules = computed(() => {
            let rules = []
            if(props.data.guessRules){
                props.data.guessRules.forEach(item => {
                    rules.push({
                        ...item,
                        rule: setPosition(item.correctDigit)
                    })
                });
            }
            return rules
        })

         //猜对的位置 
        const setPosition = (num = 3) => {
            let arr = []
            switch (num) {
                case 1:
                    arr = [2]
                    break;
                case 2:
                    arr = [2, 5]
                    break;
                case 3:
                    arr = [0, 2, 5]
                    break;
                case 4:
                    arr = [0, 2, 3, 5]
                    break;
                case 5:
                    arr = [0, 2, 3, 5, 6]
                    break;
                case 6:
                    arr = [0, 1, 2, 3, 5, 6]
                    break;
                default:
                    break;
            }
            return arr
        }

        const handleChangeTab = (index) => {
            state.currentTabIndex = index
            console.log(index, state.currentTabIndex)
        }

        const state = reactive({
            currentTabIndex: 0,
            resData: props.data,
            guessRules,
            handleChangeTab
        })

        return toRefs(state)
    }
}
</script>


<style lang="less">
    @import url('../variables.less');
    .rule_item{
        padding: 0 24px 24px 24px;

        .rule_content{
            .explain{
                padding-top: 12px;
                font-size: 12px;
                line-height: 16px;
            }

            .list{
                padding: 12px 12px 0 12px;
                font-size: 12px;
                line-height: 16px;

                .hightlight{
                    background: #f3c38e;
                    padding: 0 2px;
                    border-radius: 4px;
                }

                .rule_image{
                    width: 87px;
                    height: 68px;
                    border-radius: 6px;
                    display: inline-block;
                    background: rgba(235,155,66,0.6) url('../image/rule_01.png') no-repeat center;
                    vertical-align: top;

                    .number_warp{
                        padding-left: 8px;
                        line-height: 16px;

                        &.number_warp_b{
                            text-align: right;
                            padding-top: 31px;
                        }
                    }

                    &.rule_02{
                        background-image: url('../image/rule_02.png');
                    }

                    &.rule_03{
                        background-image: url('../image/rule_03.png');
                    }
                }

                .desc{
                    width: 210px;
                    height: 48px;
                    display: inline-block;
                }

                .right{
                    margin-left: 6px;
                }


                .left{
                    width: 50%;
                    display: inline-block;
                    vertical-align: bottom;

                    .example{

                        .state{
                            display: inline-block;
                            margin-right: 3px;
                                
                            .state_image{
                                width: 20px;
                                height: 27px;
                                border-radius: 4px;
                                display: inline-block;
                                background: @color_warning url('../image/error_icon.png') center no-repeat;
                                
                                &.state_image_success{
                                    background: @color_success url('../image/success_icon.png') center no-repeat;
                                }
                            }

                            .dot{
                                display: inline-block;
                                font-size: 40px;
                            }
                        }
                    }
                    
                    .success_num{
                        font-size: 12px;
                        line-height: 16px;
                        margin-top: 8px;
                    }
                }

                .bonus{
                    width: 50%;
                    display: inline-block;
                    font-size: 12px;
                    line-height: 16px;
                    text-align: right;
                }

            }
        }
    }
</style>