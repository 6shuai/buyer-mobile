<template>
    <!-- 抢购成功的用户 -->
    <!-- <view class="buy_success_member" :animation="buySuccessNoticeAnim">
        <image src="" class="member_head_img" />
        <view class="member_info">
            <view class="title text_overflow">
                <text class="text_size_12">马冬梅</text>
                <text class="count">抢到一件</text>
            </view>
            <view class="number_warp">
                <text class="price_before ali_font_bold text_size_12"
                    >￥</text
                >
                <text class="price_num ali_font_bold text_size_16"
                    >3680</text
                >
                <text class="price_after ali_font_bold text_size_12"
                    >.00</text
                >
            </view>
        </view>
    </view> -->
    <view class="bullet_wrap">
        <view class="bullet_item bullet_animation" 
            :class="`data_line_${item.id}`"
            v-for="item in bulletlist" 
            @animationend="animationend"
            :key="item.id">{{item.name}}
        </view>
    </view>
</template>

<script>
import { reactive, toRefs, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    setup(props) {
        const store = useStore()
        onMounted(() => {
            setInterval(()=>{
                var item = state.list.shift();

                if(item){
                    item.line = state.idx;
                    state.idx = (state.idx % 1 + 1);
                    state.bulletlist.push(item)
                }else{
                    if(state.clist.length){
                        item = state.clist.shift();
                        item.line = 3;
                        state.idx = 3;
                        state.bulletlist.push(item)
                    }
                }

            }, 2000)


            setTimeout(() => {
                var query = wx.createSelectorQuery();
                query.select('.bullet_item').boundingClientRect()
                query.exec(function (res) {
                    console.log(res)
                })
                
                state.list.push({
                    id: 7, name: '吼吼吼吼'
                })

                setTimeout(() => {
                    state.list.push({
                        id: 8, name: 'hi额hi嗯好IE'
                    })
                }, 2000);
            }, 10000);
        })

        const buySuccessData = computed(() => {
            return store.state.buySuccessMember
        })

        watch(buySuccessData, (newData, oldData) => {
            console.log('购买成功信息------->', newData)
        })


        const state = reactive({
            buySuccessNoticeAnim: undefined,
            list: [
                {id: 1, name: '小帅哥快来玩呀1', line: 0},
                {id: 2, name: '小帅哥快来玩呀2', line: 0},
                {id: 3, name: '小帅哥快来玩呀3', line: 0},
                {id: 4, name: '小帅哥快来玩呀4', line: 0},
                {id: 5, name: '小帅哥快来玩呀5', line: 0},
                {id: 6, name: '小帅哥快来玩呀6', line: 0}
            ], // 普通的弹幕队列
            clist: [], // c位的弹幕队列
            bulletlist: [], // 当前正在执行的
            value: '',
            idx: 1,
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    .bullet_wrap{height: 400px;position: relative;overflow: hidden;font-size: 12px;}
    .bullet_item{text-shadow: 1px 1px #000;color: #ffffff82;white-space: nowrap;user-select: none;position: absolute;top:0;left:0;}
    .bullet_item.data_line1{top: 0px}
    .bullet_item.data_line2{top: 20px}
    .bullet_item.data_line3{top: 40px}
    .bullet_item.data_line4{top: 60px}
    .bullet_item.data_line5{top: 80px}
    .bullet_animation{animation: right2left 10s linear both;}

    @keyframes right2left {
        0% {transform: translate(100vw)}
        100% {transform: translate(-100%);}
    }


    .buy_success_member{
            width: 160px;
            height: 42px;
            border-radius: 21px;
            background: #5fb890;
            position: absolute;
            bottom: -160px;
            left: 0;
            width: 100%;
            height: 100px;


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