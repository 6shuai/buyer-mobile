<template>
    <view 
        v-if="showDialog"
        class="buy_dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">
            <view class="goods">
                <image :src="resData.goodsCover" />
                <view class="goods_name text_size_16">
                    <view class="name text_size_16">{{ resData.goodsName }}</view>
                    <view class="specification text_size_12_by">{{ resData.goodsDescription }}</view>
                </view>
            </view>


            <view class="content">
                <view class="game_time">
                    <text>{{ resData.beginTime }}</text>
                    <image v-if="resData.status == 0" mode="heightFix" src="../../../image/state_end.png" />
                    <image v-else-if="resData.status == 1" mode="heightFix" src="../../../image/state_not_start.png" />
                    <image v-else-if="resData.status == 2" mode="heightFix" src="../../../image/state_before.png" />
                    <image v-else mode="heightFix" src="../../../image/state_start.png" />
                </view>

                <view class="timeline">
                    <view class="timeline-item">
                        <view class="time">{{ resData.beginTime.split(' ')[1] }}</view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">猜价阶段</view>
                    </view>
                    <view class="timeline-item">
                        <view class="time">{{ resData.beginTime.split(' ')[1] }}</view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">抢购阶段</view>
                    </view>
                    <view class="timeline-item">
                        <view class="time"> </view>
                        <view class="line">
                            <view class="dot"></view>
                        </view>
                        <view class="text">结果公示</view>
                    </view>
                </view>
            </view>

            <view class="rule_box">
                <rule :data="resData"></rule>
            </view>


        </view>

        <!-- 按钮状态 -->
        <view class="btn_state">
            <image 
                v-if="resData.status == 0" 
                mode="heightFix" 
                src="../../../image/btn_subscribe_3.png" 
                @tap.stop.prevent="handleSubscription(resData.id)"
            />
            <image v-else-if="resData.status == 1" mode="heightFix" src="../../../image/btn_subscribe_1.png" />
            <image 
                v-else 
                mode="heightFix" 
                src="../../../image/btn_start.png" 
                @tap.stop.prevent="handleJoin(resData)"
			/>
        </view>

    </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import Rule from '../../../components/Rule'
import { useStore } from 'vuex'

export default {
    components: {
        Rule
    },
    setup(props) {
        const store = useStore()
        onMounted(() => {
            
        })

        const handleShowPage = data => {
            state.resData = data
            state.showDialog = true
        }

        const handleClosePage = () => {
            state.showDialog = false
        }

        //马上参加
		const handleJoin = (item) => {
			store.dispatch('setGoodsDetail', item)
			wx.navigateTo({
				url: './buyer/buyer'
			})
		}

		//订阅
		const handleSubscription = () => {
			wx.showToast({
				title: '订阅成功',
				duration: 2000
			})
		}

        const state = reactive({
            resData: {},
            showDialog: false,
            handleShowPage,
            handleClosePage,
            handleJoin,
            handleSubscription
        })


        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');
    .buy_dialog_wrap{
        width: 100%;
        height: 610px;
        max-height: 80%;
        background: #f2f2f2;
        background-size: 100%;
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


        .goods{
            display: flex;
            padding-left: 12px;

            image{
                width: 118px;
                height: 118px;
                margin-top: -59px;
            }

            .goods_name{
                padding: 3px 3px 0 12px;
                width: calc(100% - 130px);

                .name{
                    line-height: 30px;
                }

                .specification{
                    line-height: 16px;
                }
            }
        }

        .content{
            padding: 7px 24px;

            .game_time{
                font-size: 12px;
                line-height: 24px;

                image{
                    display: inline-block;
                    height: 24px;
                    margin-left: 5px;
                    vertical-align: top;
                }
            }

            .timeline{
                padding-top: 6px;
                width: 100%;
                display: inline-block;

                .timeline-item{
                    float: left;
                    text-align: left;
                    .time{
                        font-size: 10px;
                        color: rgba(0,0,0,0.6);
                        line-height: 13px;
                        display: inline-block;
                    }

                    .line{
                        width: 100%;
                        height: 2px;
                        margin: 12px 0;
                        background: @color_primary;
                        position: relative;

                        .dot{
                            width: 11px;
                            height: 11px;
                            background: @color_primary;
                            border-radius: 50%;
                            left: 0;
                            top: -8rpx;
                            position: absolute;
                        }
                    }

                    .text{
                        font-size: 10px;
                        color: rgba(0,0,0,0.6);
                        line-height: 13px;
                    }

                    &:nth-child(1){
                        width: 20%;
                    }

                    &:nth-child(2){
                        width: 76%;
                    }

                    &:nth-child(3){
                        width: 4%;

                        .line{
                            width: 0;
                        }

                        .text{
                            width: 46px;
                            margin-left: -30px;
                        }
                    }
                }
            }
        }

        .btn_state{
            width: 100%;
            height: 39px;
            position: absolute;
            bottom: 60px;
            left: 0;
            text-align: center;

            image{
                height: 39px;
                border-radius: 12px;
                display: inline-block;
            }
        }

        .rule_box{
            height: 450px;
            background: #fff url('../../../image/dialog_bg_01.png') left bottom no-repeat;
            background-size: 100%;
        }

    }
</style>