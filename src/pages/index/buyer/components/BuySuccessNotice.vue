<template>
    <!-- 抢购成功的用户 弹幕通知 -->
    <view class="bullet_wrap">
        <view class="bullet_item bullet_animation" 
            v-for="(item, index) in bulletlist" 
            :class="`data_line_${index}`"
            :key="index">
            <view class="buy_success_member">
                <image :src="item.avatar" class="member_head_img" />
                <view class="member_info">
                    <view class="title text_overflow">
                        <text class="text_size_12">{{ item.nickName }}</text>
                        <text class="count">抢到一件</text>
                    </view>
                    <view class="number_warp" v-if="item.price">
                        <text class="price_before ali_font_bold text_size_12"
                            >￥</text
                        >
                        <text class="price_num ali_font_bold text_size_16"
                            >{{ item.price.int }}</text
                        >
                        <text class="price_after ali_font_bold text_size_12"
                            >{{ item.price.decimals }}</text
                        >
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { reactive, toRefs, onMounted, computed, watch, onUnmounted } from 'vue'
import mixin from '../../../../mixins/index'
import { useStore } from 'vuex'
export default {
    setup(props) {
        const store = useStore()
        const { priceFormat } = mixin()
        const windowWidth = wx.getSystemInfoSync().windowWidth
        onMounted(() => {
            danmaku()
        })

        //抢购成功用户   弹幕
        const danmaku = () => {
            clearInterval(state.timer)
            state.timer = setInterval(()=>{
                findLstRightDistance().then(res => {
                    if(!res) return
                    let item = state.list.shift();
                    if(item){
                        state.bulletlist.push(item)
                    }
                })
            }, 200)
        }

        //获取最后一个弹幕 right的距离
        const findLstRightDistance = () => {
            return new Promise((resolve) => {
                if(!state.bulletlist.length) resolve(true)
                let right = 0
                let query = wx.createSelectorQuery();
                query.select(`.data_line_${state.bulletlist.length-1}`).boundingClientRect()
                query.exec(function (res) {
                    if(res[0]){
                        right = res[0].right
                        if(windowWidth - right > 20){
                            resolve(true)
                        }else{
                            resolve(false)
                        }
                    }else{
                        resolve(true)
                    }
                })
                
            })
        }

        const buySuccessData = computed(() => {
            return store.state.buySuccessMember
        })

        //监听抢购成功 通知
        watch(buySuccessData, (newData, oldData) => {
            state.list.push({
                ...newData,
                price: priceFormat(newData.price)
            })
        })

         //页面销毁
        onUnmounted(() => {
            clearTimeout(state.timer)
        })


        const state = reactive({
            timer: undefined,
            list: [],   // 普通的弹幕队列
            bulletlist: [], // 当前正在执行的
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    .bullet_wrap{
        height: 76px;
        position: relative;
        overflow: hidden;
    }
    .bullet_item{
        width: 174px;
        height: 46px;
        white-space: nowrap;
        user-select: none;
        position: absolute;
        top:0;
        left:0;
    }
    .bullet_item.data_line1{
        top: 0px
    }
    .bullet_animation{
        animation: right2left 10s linear both;
    }

    @keyframes right2left {
        0% {transform: translate(100vw)}
        100% {transform: translate(-100%);}
    }


    .buy_success_member{
        height: 42px;
        width: 174px;
        overflow: hidden;
        border-radius: 21px;
        background: #5fb890;
        position: absolute;
        top: 15px;
        left: 0;


        .member_head_img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            margin: 3px;
            display: inline-block;
            border: 1px solid #e5e5e5;
            vertical-align: top;
        }

        .member_info{
            margin-left: 1px;
            display: inline-block;
            width: 115px;
            font-size: 12px;

            .title{
                line-height: 16px;
                padding-top: 2px;

                .count{
                    margin-left: 6px;
                    color: #fff;
                }
            }
            
            .number_warp{
                margin-top: 5px;
            }

        }
    }
</style>