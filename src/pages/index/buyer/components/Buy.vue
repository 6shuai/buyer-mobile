<template>
    <view class="mask" v-if="showDialog"></view>
    <view 
        v-if="showDialog"
        class="dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">
            <view class="goods">
                <image :src="goodsData.goods.cover" />
                <view class="goods_name text_size_16">
                    <view class="name text_size_16 text_overflow">{{ goodsData.goods.displayName }}</view>
                    <view class="specification text_size_12_by">{{ goodsData.goods.description }}</view>
                </view>
            </view>

            <view v-if="!showSettleAccounts && !showCompleteAddress">
                <view v-if="payState == 'success'" class="buy_success">抢购成功</view>
                <view v-if="payState == 'error'" class="buy_fail">抢购失败</view>

                <!-- 抢购失败 -->
                <view 
                    v-if="payState == 'error'" 
                    class="text_size_12 fail_info"
                >很遗憾~宝贝已经被抢光了。</view>
                
                <view 
                    v-if="payState != 'error'"
                    class="dialog_price_content">
                    <!-- 抢购成功 显示抢购价格 -->
                    <view class="desc text_size_12">{{ payState ? '抢购价' : '实时抢购价' }}:</view>
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
                        <view class="text_t text_size_12_by">请选择该宝贝的领取方式</view>
                        
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
                        付款后请尽快完善物流信息。{{ goodsData.orderExpiration }}天内未完善物流信息该订单将失效；所付款项的20%（￥{{ (realTimePrice.full * 0.2).toFixed(2) }}）将作为违约金支付，剩余部分按原支付方式退回。
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
                    <view class="alert">
                        <image src="../../../../image/warning.png" />
                        <view class="text" v-if="buySuccessOrder.receiveType == 1">请尽快前往指定门店领取宝贝，领取时支付订单尾款。该订单{{ goodsData.orderExpiration }}天内有效，过期后无法宝贝领取，所支付定金不予退还。</view>
                        <view class="text" v-if="buySuccessOrder.receiveType == 2">请先完善该宝贝的物流信息，否者宝贝将无法正常发货！</view>
                    </view>
                    <view 
                        class="buy_success_wrap"
                    >
                    
                        <view class="item">
                            <view class="label">领取方式</view>
                            <view class="value">{{ buySuccessOrder.receiveType == 1 ? '门店领取' : '快递寄送' }}</view>
                        </view>
                        <view class="item">
                            <view class="label">{{ buySuccessOrder.receiveType == 1 ? '领取地址' : '寄送地址' }}</view>
                            <view class="value" v-if="!receivingInfo">{{ buySuccessOrder.pickUpAddress }}</view>
                            <!-- 完善物流信息后 -->
                            <view class="value" v-if="receivingInfo">
                                <view>{{ receivingInfo.name }} &nbsp;&nbsp; {{ receivingInfo.mobile }}</view>
                                <view>{{ receivingInfo.address }}</view>
                            </view>
                        </view>
                        <view class="item">
                            <view class="label">领取时限</view>
                            <view class="value">{{ buySuccessOrder.expire }}</view>
                        </view>
                        <view class="item">
                            <view class="label">订单编号</view>
                            <view class="value">{{ buySuccessOrder.orderNumber }}</view>
                        </view>
                        <view class="item">
                            <view class="label">订单状态</view>
                            <view class="value">{{ buySuccessOrder.orderState }}</view>
                        </view>
                        <view class="item">
                            <view class="label">创建时间</view>
                            <view class="value">{{ buySuccessOrder.createTime }}</view>
                        </view>
                        <view class="item">
                            <view class="label">已付定金</view>
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

                        <view class="buy_btn_wrap" v-if="!receivingInfo">
                            <view class="buy_btn" v-if="buySuccessOrder.receiveType == 1">
                                查看领取码
                            </view>
                            <view class="buy_btn" v-if="!receiviingInfo && buySuccessOrder.receiveType == 2" @tap="showCompleteAddress = true">
                                <!-- 查看领取码 -->
                                完善物流信息
                            </view>
                        </view>
                    </view>
                </scroll-view>

                <!-- 查看活动结果 -->
                <view 
                    v-if="payState == 'error'"
                    @tap="showSettleAccounts = true"
                    class="buy_btn_wrap result">
                    <view class="buy_btn">
                        查看活动结果
                    </view>
                </view>

            </view>
        </view>
        
        <!-- 结算页 -->
        <settle-accounts v-if="showSettleAccounts"></settle-accounts>
        
        <!-- 完善物流信息 -->
        <complete-address 
            v-if="showCompleteAddress" 
            :orderNumber="orderNumber"
            @commitAddressSuccess="commitAddressSuccess"
        ></complete-address>

    </view>
</template>

<script>
import SettleAccounts from './SettleAccounts.vue'
import CompleteAddress from './Address.vue'
import { reactive, toRefs, getCurrentInstance, computed, watch, onMounted } from 'vue'
import { socketId } from '../../../../utils/socketId'
import { useStore } from 'vuex'
import mixin from '../../../../mixins'

export default {
    props: ['goodsData', 'price'],
    emits: ['buyCallFun'],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance()
        const store = useStore()
        const { priceFormat } = mixin()
        
        //调取微信支付
        const wxPaymentInfo = computed(() => {
            return store.state.wxPaymentInfo
        })

        //支付成功 订单信息
        const buySuccessOrder = computed(() => {
            return store.state.buySuccessOrder
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
            //抢购成功后的价格
            if(state.paidPrice){
                state.economizePrice = priceFormat(props.price.full - state.bidPrice.full)
                return state.bidPrice
            }else{
                state.economizePrice = priceFormat(props.price.full - store.getters.getRealTimePrice.full)
                return store.getters.getRealTimePrice
            }
        })

        //支付定金
        const depositPrice = computed(() => {
            return priceFormat(state.realTimePrice.full * ( props.goodsData.depositRatio / 100 ))
        })

        const handleShowPage = e => {
            //是否显示结算页
            if(e == 'settleAccounts'){
                state.showSettleAccounts = true
            }else{
                state.showSettleAccounts = false
            }
            state.showDialog = true
        }

        const handleClosePage = () => {
            state.showDialog = false
        }

        //确认支付  请求购买
        const handlePay = () => {
            let { id, receiveType } = state.addressList[state.paymentIndex]
            state.bidPrice = JSON.parse(JSON.stringify(state.realTimePrice)) 
            state.paidPrice = receiveType == 1 && props.goodsData.paymentMethod == 2 ? state.depositPrice.full : state.realTimePrice.full

            proxy.$socket.socketSendMessage({
                id: socketId.buy,
                bidPrice: state.bidPrice.full,// 抢购的金额
                paidPrice: state.paidPrice,         // 支付成功的金额
                receiveType: receiveType, // 领取方式，1线下，2线上
                pickUpAddressId: id, // 如果是线下领取，这里发领取地址id
            })

        }

        //调起微信支付
        const wxRequestPayment = (data) => {
            let { timeStamp, nonceStr, prepayId, paySign } = data      
            state.orderNumber = nonceStr
            
            // 测试支付
            wx.showModal({
                title: '微信支付',
                content: `金额: ${state.paidPrice}`,
                success (res) {
                    if (res.confirm) {
                        
                        proxy.$socket.socketSendMessage({
                            id: 3014,// 消息id: 3014
                            openid: store.state.userId.openid,// 玩家的openid
                            amount: state.paidPrice,// 支付的金额
                            orderNumber: nonceStr// 订单号，当服务端也开启支付测试环境时，从抢购反馈消息：7009的nonceStr字段中获取这个数据
                        })

                        state.payState = 'success'
                        emit('buyCallFun', state.bidPrice)

                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            
            // wx.requestPayment(
			// 	{
			// 		"timeStamp": timeStamp,
			// 		"nonceStr": nonceStr,
			// 		"package": "prepay_id=" + prepayId,
			// 		"signType": "RSA",
			// 		"paySign": paySign,
			// 		"success":function(res){
            //             showToast('支付成功', 'success')
            //             state.payState = 'success'
            //             emit('buyCallFun', state.realTimePrice)
            //         },
			// 		"fail":function(res){
            //             showToast('支付失败', 'error')
            //             state.payState = 'error'
            //         },
			// 		"complete":function(res){}
			// 	}
			// )
        }

        //提价完善物流信息 成功
        const commitAddressSuccess = data => {
            console.log('完善物流信息 成功------->', data)
            state.receivingInfo = data
            state.showCompleteAddress = false
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
            bidPrice: {},      //抢购的金额
            paidPrice: null,  //需要支付的金额
            showDialog: false,
            addressList: [],   //领取地址列表
            addressHeight: 0,
            params: {},
            handleShowPage,
            handleClosePage,
            handlePay,
            buySuccessOrder,
            showSettleAccounts: false,   //是否显示结算页
            showCompleteAddress: false,  //显示完善物流信息
            orderNumber: null,            //订单编号
            commitAddressSuccess,
            receivingInfo: undefined,     //完善后的物流信息
        })


        return toRefs(state)
    },
    components: {
        SettleAccounts,
        CompleteAddress
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');

    .dialog_wrap{
        background: #f2f2f2 url(../../../../image/dialog_bg_03.png) left bottom no-repeat;
        background-size: 100%;

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

            .alert{
                background: @color_warning;
                color: @color_lightgray;
                font-size: 12px;
                line-height: 16px;
                padding: 3px 20px;

                image{
                    width: 16px;
                    height: 16px;
                    vertical-align: top;
                    float: left;
                }

                .text{
                    margin-left: 20px;
                }
            }
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

            &.result{
                position: absolute;
                left: 0;
                right: 0;
                bottom: 106px;
            }

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

        .fail_info{
            padding: 12px 24px;
        }
    }

    
</style>