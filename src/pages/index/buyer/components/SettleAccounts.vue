<template>
    <!-- 结算 -->
    <view class="settle_accounts">
        <view class="settle_accounts_tab">
            <view
                v-for="(item, index) in 2"
                :key="index"
                @tap="activeIndex = index"
                class="tab_item"
                :class="{ active: index == activeIndex }"
            ></view>
        </view>
        <scroll-view
            :style="{ height: '900rpx' }"
            :showScrollbar="false"
			:scrollY="true"
        >
            <view class="member_list" v-if="activeIndex==0">
                <view class="tip" v-show="buyMemberList.length">极限秒杀价</view>
                <view 
                    class="member_item" 
                    v-for="(item, index) in buyMemberList"
                    :key="index"
                >
                    <view class="index text_size_18">{{index+1}}</view>
                    <view class="member_info">
                        <image :src="item.avatar" />
                        <text class="name text_size_12">{{ item.nickName }}</text>
                    </view>
                    <view class="price">
                        <view class="number_warp">
                            <text class="price_before ali_font_bold text_size_12"
                                >￥</text
                            >
                            <text class="price_num ali_font_bold text_size_16"
                                >{{ priceFormat(item.price)['int'] }}</text
                            >
                            <text class="price_after ali_font_bold text_size_12"
                                >{{ priceFormat(item.price)['decimals'] }}</text
                            >
                        </view>
                    </view>
                </view>
            </view>
            
            <view class="member_list" v-if="activeIndex==1">
                <view 
                    class="member_item" 
                    v-for="(item, index) in guessPriceMemberList"
                    :key="index"
                >
                    <view class="member_info">
                        <image :src="item.avatar" />
                        <text class="name text_size_12">{{ item.nickName }}</text>
                    </view>
                    <view class="price">
                        <view class="count text_size_10_by">猜对{{ item.correctDigit }}位</view>
                        <view class="number_warp">
                            <text class="price_before ali_font_bold text_size_12"
                                >￥</text
                            >
                            <text class="price_num ali_font_bold text_size_16"
                                >{{ priceFormat(item.award)['int'] }}</text
                            >
                            <text class="price_after ali_font_bold text_size_12"
                                >{{ priceFormat(item.award)['decimals'] }}</text
                            >
                        </view>
                    </view>
                </view>
            </view>

        </scroll-view>

    </view>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import mixin from '../../../../mixins'
export default {
    setup(props) {
        const store = useStore()
        const { priceFormat } = mixin()

        //抢购的用户列表
        const buyMemberList = computed(() => {
            return store.state.buyMemberList
        })

        //猜价的用户列表
        const guessPriceMemberList = computed(() => {
            return store.state.guessPriceMemberList
        })

        const state = reactive({
            activeIndex: 0,
            buyMemberList,
            guessPriceMemberList,
            priceFormat
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');
    .settle_accounts{
        margin: 24px;

        .settle_accounts_tab{
            height: 32px;
            font-size: 24px;

            .tab_item{
                display: inline-block;
                margin-right: 19px;
                width: 66px;
                height: 27px;
                background: url('../../../../image/jiesuan_maishou.png') no-repeat center;
                background-size: 100%;
                opacity: 0.6;

                &:last-child{
                    background: url('../../../../image/jiesuan_caijia.png') no-repeat center;
                    background-size: 100%;
                }

                &.active{
                    width: 80px;
                    height: 32px;   
                    opacity: 1;
                }
            }
        }

        .member_list{
            padding-top: 20px;
            position: relative;

            .tip{
                font-size: 10px;
                height: 18px;
                line-height: 18px;
                background: @color_info;
                color: #fff;
                border-radius: 3px;
                display: inline-block;
                padding: 0 4px;
                position: absolute;
                right: 0;
                top: 0;
            }

            .member_item{
                width: 100%;
                height: 33px;
                line-height: 33px;
                margin-bottom: 12px;
                display: flex;

                .index{
                    width: 35px;
                    text-align: left;
                    font-weight: 700;
                }

                .member_info{
                    width: 165px;
                    
                    image{
                        width: 32px; 
                        height: 32px;
                        border-radius: 50%;
                        border: 1px solid #eb9b42;
                    }

                    .name{
                        padding-left: 5px;
                    }

                }

                .price{
                    width: 175px;
                    float: right;
                    text-align: right;

                    .count{
                        display: inline-block;
                        padding-right: 7px;
                    }

                    .number_warp{
                        display: inline-block;
                    }
                    
                }
            }
        }
    }
</style>