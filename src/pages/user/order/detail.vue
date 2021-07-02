<template>
    <view class="order_detail">
        <view class="item">
            <view class="label">领取方式</view>
            <view class="value">{{ buySuccessOrder.receiveType == 1 ? '门店领取' : '快递寄送' }}</view>
        </view>
        <view class="item">
            <view class="label">领取地址</view>
            <view class="value">{{ buySuccessOrder.pickUpAddress }}</view>
        </view>
        <view class="item">
            <view class="label">领取时限</view>
            <view class="value">{{ buySuccessOrder.expire }}</view>
        </view>
        <view class="item">
            <view class="label">订单编号</view>
            <view class="value">
                <text>{{ buySuccessOrder.orderNumber }}</text>
                <image @tap="handleCopy" src="../../../image/copy.png" />
            </view>
        </view>
        <view class="item">
            <view class="label">订单状态</view>
            <view class="value">{{ buySuccessOrder.orderState }}</view>
        </view>
        <view class="item">
            <view class="label">创建时间</view>
            <view class="value">{{ buySuccessOrder.createTime }}</view>
        </view>
        <!-- <view class="item">
            <view class="label">领取时间</view>
            <view class="value">2021-6-1 14:00</view>
        </view> -->
        <view class="item">
            <view class="label">已付订金</view>
            <view class="value">{{ buySuccessOrder.paidAmount }}</view>
        </view>
        <view class="item">
            <view class="label">待付尾款</view>
            <view class="value">{{ buySuccessOrder.toBePaid }}</view>
        </view>
        <view class="item">
            <view class="label">支付交易号</view>
            <view class="value">{{ buySuccessOrder.transactionNumber }}</view>
        </view>
    </view>

    <view class="order_alert" v-if="buySuccessOrder.receiveType == 1">
        请尽快前往指定门店领取宝贝，领取时支付订单尾款。该订单90天内有效，过期后无法宝贝领取，所支付定金不予退还。
    </view>

</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    setup(){
        const store = useStore()

        //支付成功 订单信息
        const buySuccessOrder = computed(() => {
            return store.state.buySuccessOrder
        })

        //复制订单编号
        const handleCopy = () => {
            wx.setClipboardData({
                data: buySuccessOrder.orderNumber,
                success (res) {
                    wx.getClipboardData({
                        success (res) {
                            console.log(res.data) // data
                        }
                    })
                }
            })
        }

        const state = reactive({
            handleCopy,
            buySuccessOrder
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
   .order_detail{
        padding: 12px 20px;
        
        .item{
            height: 17px;
            padding-bottom: 6px;
            display: flex;

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

                image{
                    display: inline-block;
                    margin-left: 9px;
                    width: 13px;
                    height: 13px;
                    vertical-align: top;
                }
            }
        }
        
    }

    .order_alert{
        background: #BB2A44;
        padding: 12px 24px;
        font-size: 10px;
        color: #000;
    }
</style>