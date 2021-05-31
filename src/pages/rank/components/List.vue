<template>
    <view class="rank_list_wrap">
        <view 
            v-for="(item, index) in 20"
            :key="index"
            class="rank_item"
            :class="index % 2 ? 'rank_item_a' : 'rank_item_b'"
        >
            <view class="left">
                <view class="serial_number" v-if="index > 2">{{ index + 1 }}</view>
                <image class="head_image" src="" />
                <text class="name">马冬梅</text>
            </view>
            <view class="count">
                <view class="label" v-if="index <= 2">下单量</view>
                <view class="value ali_font_bold"><text class="ali_font_bold count_number">105</text>单</view>
            </view>
            <view class="consume">
                <view class="label" v-if="index <= 2">总计消费</view>
                <view class="number_warp">
                    <text class="price_before ali_font_bold"
                        >￥</text
                    >
                    <text class="price_num ali_font_bold"
                        >1,680</text
                    >
                    <text class="price_after ali_font_bold"
                        >.00</text
                    >
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
            resData: []
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');

    .rank_list_wrap{
        .rank_item{
            height: 33px;
            padding: 8px 12px 8px 12px;
            background: #C1A6DC;
            color: @color_primary;

            &.active{
                box-shadow: 0px 0px 18px rgba(248,164,70,0.4), 
                            0px 2px 12px 2px rgba(236,206,173,0.8), 
                            0px 0px 0.5px 0.5px rgba(236,225,213,0.6), 
                            inset 0px 0px 18px 4px rgba(248,164,70,0.4), 
                            inset 0px 0px 12px 2px rgba(236,206,173,0.8), 
                            inset 0px 0px 0.5px 0.5px rgba(243,233,222,0.6);
            }

            .left{
                width: 130px;
                display: inline-block;

                .serial_number{
                    display: inline-block;
                    font-size: 18px;
                    font-weight: bold;
                    width: 22px;
                    text-align: center;
                    padding-right: 3px;
                    line-height: 33px;
                    vertical-align: top;
                }

                .head_image{
                    width: 33px;
                    height: 33px;
                    border-radius: 50%;
                    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
                }
    
                .name{
                    font-size: 12px;
                    font-weight: 600;
                    padding-left: 6px;
                    vertical-align: top;
                    width: 60px;
                    display: inline-block;
                    line-height: 33px;
                }
            }

            .count{
                width: 70px;
                text-align: center;
                display: inline-block;
                vertical-align: top;
                
                .label{
                    color: #705B79;
                    font-size: 10px;
                    line-height: 14px;
                }
                
                .value{
                    font-size: 12px;
                    line-height: 22px;
                    font-weight: bold;
                    padding-top: 6px;

                    .count_number{
                        font-size: 16px;
                    }
                }
            }

            .consume{
                width: 120px;
                display: inline-block;
                text-align: right;
                vertical-align: top;
                .label{
                    color: #705B79;
                    font-size: 10px;
                    line-height: 14px;
                }

                .number_warp{
                    padding-top: 6px;
                    .price_before{
                        font-size: 12px;
                    }

                    .price_num{
                        font-size: 16px;
                    }
                    
                    .price_after{
                        font-size: 12px;
                    }
                }
            }

            &.rank_item_a{
                background: #4C1E6F;
                color: @color_info;
            }

            &.rank_item_b{
                background: #C1A6DC;
            }

            &:nth-child(1){
                height: 62px;
                padding: 12px 12px 12px 18px;
                background: linear-gradient(181deg, #F89346, #FCD17C, #F89346);
                box-shadow: inset 0.5px 0.5px rgba(255,255,255,0.6);

                .head_image{
                    width: 62px;
                    height: 62px;
                }

                .name{
                    line-height: 62px;
                    font-size: 16px;
                }

                .count{
                    padding-top: 8px;
                    .label{
                        font-size: 12px;
                        line-height: 17px;
                    }

                    .value{
                        padding-top: 5px;
                    }
                }

                .consume{
                    padding-top: 8px;
                    .label{
                        font-size: 12px;
                        line-height: 17px;
                    }
                    .number_warp{
                        padding-top: 0;
                        .price_before{
                            font-size: 18px;
                        }

                        .price_num{
                            font-size: 22px;
                        }
                        
                        .price_after{
                            font-size: 18px;
                        }
                    }
                }

            }

            &:nth-child(2), &:nth-child(3){
                color: @color_primary;
                height: 39px;
                padding: 7px 12px 7px 18px;
                background:  linear-gradient(135deg, #F5F5F5 0%, #A8A8A8 100%), linear-gradient(146deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);

                .head_image{
                    width: 39px;
                    height: 39px;
                    margin-left: 12px;
                }

                .name{
                    line-height: 39px;
                    font-size: 16px;
                }

                .count{
                    padding-top: 1px;
                    .label{
                        font-size: 10px;
                        line-height: 14px;
                    }

                    .value{
                        padding-top: 3px;
                    }
                }

                .consume{
                    padding-top: 1px;
                    .label{
                        font-size: 10px;
                        line-height: 14px;
                    }

                    .number_warp{
                        padding-top: 0;
                        .price_before{
                            font-size: 16px;
                        }

                        .price_num{
                            font-size: 20px;
                        }
                        
                        .price_after{
                            font-size: 16px;
                        }
                    }
                }

            }

            &:nth-child(3){
                background: linear-gradient(135deg, #E3906D 0%, #CC6529 100%), linear-gradient(49deg, rgba(255, 255, 255, 0.5) 0%, rgba(153, 153, 153, 0.5) 100%, rgba(153, 153, 153, 0.5) 100%);
            }
        }

    }
</style>
    