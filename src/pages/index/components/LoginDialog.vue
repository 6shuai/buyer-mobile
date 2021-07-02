<template>
    <view 
        class="auth_wrap"
        v-show="showLogin"
    >
        <view class="auth_box">
            <view class="title text_size_12">需要先登录「极限买手」，以便你参与接下来抢购活动。</view>
            <view class="btn_wrap">
                <button class="login text_size_14" @tap="getUserProfile">登录</button>
                <button class="cancel" @tap="cancelLogin">暂不登录</button>
            </view>
        </view>
    </view>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { showToast } from '../../../utils/index'
export default {
    setup(props) {
        const { proxy } = getCurrentInstance()
 
        // 这个弹窗是点「马上参加」时进入抢购前弹出 点登录就进行授权然后进主游戏 点暂不登陆就返回首页 无法进入抢购
        // 返回的时候可以toast提示「不登录无法参与抢购」

        onMounted(() => {
            // let userInfo = '';
            // try {
            //     userInfo = wx.getStorageSync('userInfo')
            // } catch (e) {
            
            // }
            // if(!userInfo){
            //     state.showLogin = true
            // }
        })

        //登录
        const getUserProfile = () => {
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    wx.setStorage({
                        key:"userInfo",
                        data:res.rawData
                    })
                    state.showLogin = false
                }
            })
        }

        //暂不登录
        const cancelLogin = () => {
            state.showLogin = false
            showToast('不登录无法参与抢购')
        }

        const state = reactive({
            showLogin: false,
            getUserProfile,
            cancelLogin
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');
    .auth_wrap{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999999;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);

        .auth_box{
            width: 327px;
            height: 150px;
            position: fixed;
            top: 50%;
            left: 50%;
            margin-top: -75px;
            margin-left: -160px;
            border-radius: 12px;
            background: @color_lightgray;

            .title{
                padding: 12px 24px;
                line-height: 16px;
            }
        }

        .btn_wrap{
            padding: 26px 24px 24px 24px;
            display: flex;

            button{
                width: 126px;
                height: 44px;
                line-height: 44px;
                border-radius: 6px;
                font-size: 14px;

                &.login{
                    background: @color_info;
                }

                &.cancel{
                    color: #c9c7ca;
                    background: @color_darkgray;
                    opacity: 0.3;
                }
            }
        }
    }
</style>