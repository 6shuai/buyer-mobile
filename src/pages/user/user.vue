<template>
    <view class="page_bg">
        <page-head />
        <view :style="{ marginTop: headHeight + 'px' }">
            
            <view  
                class="user_wrap"
                :style="{ height: mainHeight + 'px' }">

                <view class="user_content">
                    <tooltip 
                        text="哈喽，祝你在「极限买手」玩得开心~"
                        class="tooltip_wrap"
                        :hasOpcity="true"
                    ></tooltip> 

                    <view 
                        class="user_card"
                        :style="{ height: mainHeight-220 + 'px' }"
                    >
                        <view class="top_user_info">
                            <view class="head_img">
                                <open-data type="userAvatarUrl"></open-data>
                            </view>
                            <open-data class="name" type="userNickName"></open-data>
                        </view>

                        <view class="wallet">
                            <view class="item">
                                <view class="title">
                                    <image src="../../image/wallet.png" />
                                    钱包余额
                                </view>
                                <view class="btn ali_font_bold">￥13.34</view>
                            </view>
                            <view class="item">
                                <view class="title">
                                    <image src="../../image/order.png" />
                                    活跃订单
                                    <view class="red_dot"></view>
                                </view>
                                <view 
                                    @tap="handleNavigateTo('./order/order')" 
                                    class="btn ali_font_bold"
                                >3</view>
                            </view>
                        </view>

                        <view class="list">
                            <view class="item" @tap="handleNavigateTo('./order/order')">
                                <view class="title">
                                    <image src="../../image/my_icon_01.png" />
                                    抢购订单
                                </view>
                                <view class="desc">
                                    你有3个订单需要完善信息
                                </view>
                            </view>
                            <view class="border"></view>
                            <view class="item" @tap="handleNavigateTo('./subscription/subscription')">
                                <view class="title">
                                    <image src="../../image/my_icon_02.png" />
                                    商品订阅
                                </view>
                            </view>
                            <view class="border"></view>
                            <view class="item" @tap="handleNavigateTo('./help/help')">
                                <view class="title">
                                    <image src="../../image/my_icon_03.png" />
                                    服务帮助
                                </view>
                            </view>
                            <view class="border"></view>
                            <view class="item" @tap="handleNavigateTo('./about/about')">
                                <view class="title">
                                    <image src="../../image/my_icon_04.png" />
                                    关于我们
                                </view>
                            </view>
                        </view>

                    </view>   
                    
                </view>

            </view>

        </view>
    </view>

    <!-- 自定义导航栏 -->
    <!-- <custom-tab-bar page="user" /> -->

</template>

<script>
import { toRefs, reactive, onMounted, computed } from 'vue'
import PageHead from "../../components/PageHead.vue"
import CustomTabBar from '../../components/custom-tab-bar/index.vue'
import Tooltip from '../../components/Tooltip'
import { useStore } from "vuex"

export default {
    setup(props) {
        getCurrentPages()[0].getTabBar().setData({
			selected: 2
		})
        const store = useStore()
        const loginData = wx.getStorageSync('loginData') ? JSON.parse(wx.getStorageSync('loginData')) : {}
        const headHeight = computed(() => {
			return store.state.headerHeight
		})
        const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight
		})

        onMounted(() => {

        })

        //跳转页面
        const handleNavigateTo = (page) => {
            wx.navigateTo({
                url: page
            })
        }

        const state = reactive({
            headHeight,
            mainHeight,
            handleNavigateTo,
            userInfo: loginData
        })

        return toRefs(state)
    },
    components: {
        PageHead,
        CustomTabBar,
        Tooltip
    }
}
</script>

<style lang="less">
    @import url('./user.less');
    @import url('../../variables.less');
</style>