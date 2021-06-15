<template>
    <view 
        v-if="showDialog"
        class="buy_dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../../image/close_icon.png" />
        </view>
        <view class="dialog_box" v-if="goodsData">
            <view class="goods">
                <image :src="goodsData.goods.cover" />
                <view class="goods_name text_size_16">
                    <view class="name text_size_16 text_overflow">{{ goodsData.goods.displayName }}</view>
                    <view class="specification text_size_12_by">{{ goodsData.goods.description }}</view>
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
                    <view 
                        v-for="(item, index) in realTimePrice.int"
                        :key="index"
                        :class="{num_item: item != ','}" 
                    >   
                        <text v-if="item==','">,</text>
                        <text v-else>{{item}}</text>
                    </view>
                   <view 
                        v-for="(item, index) in realTimePrice.decimals"
                        :key="index"
                        :class="{num_item: item != '.'}" 
                    >   
                        <text v-if="item=='.'">.</text>
                        <text v-else>{{item}}</text>
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
                                >{{ price.int }}</text
                            >
                            <text class="price_after ali_font_bold"
                                >{{ price.decimals }}</text
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
                                >{{ economizePrice.int }}</text
                            >
                            <text class="price_after ali_font_bold"
                                >{{ economizePrice.decimals }}</text
                            >
                        </view>
                    </view>

                </view>
            </view>

            <!-- 支付之前 -->
            <scroll-view 
                v-if="!payState"
                :scrollY="true"
                class="buy_before"
                :style="{ height: addressHeight + 'px' }"
            >
                <!-- 领取方式 -->
                <view class="payment_wrap">
                    <view class="text_t" text_size_12_by>请选择该宝贝的领取方式</view>
                    
                    <view class="mode">
                        <view
                            class="item" 
                            v-for="(item, index) in addressList" 
                            :key="item.id"
                            @tap="paymentIndex = index"
                            :class="{ active: paymentIndex==index }"
                        >
                            <view class="checkbox">
                                <view class="checked" v-show="paymentIndex==index"></view>
                            </view>
                            <view class="content">
                                <view class="type text_size_14_by">
                                    <text v-if="item.receiveType == 1">门店领取({{ index + 1 }})</text>
                                    <text v-else>快递寄送</text>
                                </view>
                                <view class="desc text_size_12_by">{{ item.address }}</view>
                            </view>
                            <view class="right_price">
                                <!-- // 支付方式，1全款，2定金 -->
                                <view class="label text_size_10_by">{{ goodsData.paymentMethod == 2 && item.receiveType==1 ? '支付定金' : '支付全款' }}</view>
                                <view class="price">
                                    <view class="number_warp">
                                        <text class="price_before ali_font_bold text_size_10_by"
                                            >￥</text
                                        >
                                        <text class="price_num ali_font_bold text_size_12_by">
                                            <text v-if="goodsData.paymentMethod == 2 && item.receiveType == 1">{{ depositPrice.int }}</text>
                                            <text v-else>{{ realTimePrice.int }}</text>
                                        </text>
                                        <text class="price_after ali_font_bold text_size_10_by">
                                            <text v-if="goodsData.paymentMethod == 2 && item.receiveType == 1">{{ depositPrice.decimals }}</text>
                                            <text v-else>{{ realTimePrice.decimals }}</text>
                                        </text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 说明 -->
                <!-- 线下支付方式  paymentMethod: // 支付方式，1全款，2定金   receiveType 1 线下  2线上  -->
                <view class="buy_desc" v-if="addressList[paymentIndex].receiveType == 1">
                    支付￥{{ goodsData.paymentMethod == 2 ? depositPrice.full : 0 }}定金，以￥{{ realTimePrice.full }}价格预定该宝贝，支付后前往指定门店领取该宝贝，领取时支付剩余尾款。{{ goodsData.orderExpiration }}天内未领取该宝贝则本订单失效，所支付定金不予退还。
                </view>
                <view class="buy_desc" v-else>
                    付款后请尽快完善物流信息。90天内未完善物流信息该订单将失效；所付款项的20%（￥{{ (realTimePrice.full * 0.2).toFixed(2) }}）将作为违约金支付，剩余部分按原支付方式退回。
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
                                <text class="price_num ali_font_bold text_size_12">
                                    <text v-if="addressList[paymentIndex].receiveType == 1 && goodsData.paymentMethod == 2">{{ depositPrice.int }}</text>
                                    <text v-else>{{ realTimePrice.int }}</text>
                                </text>
                                <text class="price_after ali_font_bold text_size_10">
                                    <text v-if="addressList[paymentIndex].receiveType == 1 && goodsData.paymentMethod == 2">{{ depositPrice.decimals }}</text>
                                    <text v-else>{{ realTimePrice.decimals }}</text>
                                </text>
                            </view>
                        </view>
                    </view>
                </view>

            </scroll-view>

            <!-- 支付成功后 订单详情 -->
            <scroll-view 
                v-if="payState == 'success'"
                :scrollY="true"
                class="buy_before"
                :style="{ height: addressHeight + 'px' }"
            >
                <view 
                    class="buy_success_wrap"
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
            </scroll-view>

        </view>

    </view>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { socketId } from '../../../../utils/socketId'
import { useStore } from 'vuex'
import mixin from '../../../../mixins'
import { showToast } from '../../../../utils/index'

export default {
    props: ['goodsData', 'price'],
    emits: ['buyCallFun'],
    setup(props, { emit }) {
        const instance = getCurrentInstance()
        const store = useStore()
        const { priceFormat } = mixin()

        const wxPaymentInfo = computed(() => {
            return store.state.wxPaymentInfo
        })

        onMounted(() => {
            state.addressHeight = wx.getSystemInfoSync().windowHeight * 0.8 - 260

            let temp = false
            state.addressList = []
            props.goodsData.pickUpAddresses.forEach(item => {
                // receiveType, // 领取方式，1线下，2线上
                item.receiveType = 1
                if(item.deliverType == 1){
                    temp = true
                }
                state.addressList.push(item)
            })

            if(temp){
                state.addressList.push({
                    address: '抢购成功后完善快递信息',
                    receiveType: 2
                })
            }
        })

        //实时价格
        const realTimePrice = computed(() => {
            state.economizePrice = priceFormat(props.price.full - store.getters.getRealTimePrice.full)
            return store.getters.getRealTimePrice
        })

        //支付定金
        const depositPrice = computed(() => {
            return priceFormat(state.realTimePrice.full * ( props.goodsData.depositRatio / 100 ))
        })

        const handleShowPage = () => {
            state.showDialog = true
        }

        const handleClosePage = () => {
            state.showDialog = false
        }

        //确认支付  请求购买
        const handlePay = () => {
            let { id, receiveType } = state.addressList[state.paymentIndex]
            let paidPrice = receiveType == 1 && props.goodsData.paymentMethod == 2 ? state.depositPrice.full : state.realTimePrice.full

            instance.appContext.config.globalProperties.$socket.socketSendMessage({
                id: socketId.buy,
                bidPrice:state.realTimePrice.full,// 抢购的金额
                paidPrice: 0.01, // 支付成功的金额
                receiveType: receiveType, // 领取方式，1线下，2线上
                pickUpAddressId: id, // 如果是线下领取，这里发领取地址id
            })

            console.log({
                bidPrice: state.realTimePrice.full,
                paidPrice,
                receiveType,
                pickUpAddressId: id
            })
        }

        //调起微信支付
        const wxRequestPayment = (data) => {
            let { timeStamp, nonceStr, prepayId, paySign } = data
            wx.requestPayment(
				{
					"timeStamp": timeStamp,
					"nonceStr": nonceStr,
					"package": "prepay_id=" + prepayId,
					"signType": "RSA",
					"paySign": paySign,
					"success":function(res){
                        showToast('支付成功', 'success')
                        state.payState = 'success'
                        emit('buyCallFun', state.realTimePrice)
                    },
					"fail":function(res){
                        showToast('支付失败', 'error')
                        state.payState = 'error'
                    },
					"complete":function(res){}
				}
			)
        }

        watch(wxPaymentInfo, (newProps, oldProps) => {
            //调起微信支付
            wxRequestPayment(newProps)
        })

        const state = reactive({
            paymentIndex: 0,      //领取方式
            payState: '',    //支付状态
            realTimePrice,  //实时价格
            economizePrice: {}, //已省金额
            depositPrice,   //定金金额
            showDialog: false,
            addressList: [],   //领取地址列表
            addressHeight: 0,
            params: {},
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
            margin-top: 20px;
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
            height: 360px;
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