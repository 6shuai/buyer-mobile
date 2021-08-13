<template>
    <view class="page_bg">
        <page-head />
        <view :style="{ marginTop: headHeight + 'px' }">
            <view class="rank_tab">
                <view 
                    v-for="(item, index) in rankText"
                    :key="index"
                    class="rank_tab_item"
                    @tap="currentTabIndex = index"
                    :class="{ rank_tab_active: currentTabIndex == index }"
                >
                    <image v-if="index==0" src="../../image/rank_jixian.png" />
                    <image v-if="index==1" src="../../image/rank_tuhao.png" />
                    <image v-if="index==2" src="../../image/rank_caijia.png" />
                </view>
            </view>
            
            <tooltip 
                :text="rankText[currentTabIndex].tip"
                class="tooltip_wrap"
                :hasOpcity="true"
            ></tooltip>    

            <view class="rank_wrap">
                <scroll-view
                    class="scroll_view"
                    :style="{ height: mainHeight + 'px' }"
                    scrollY="true"
                    :showScrollbar="false"
                    :enhanced="true"
                    :scrollTop="scrollTop"
                >
                    
                    <rank-list :rankText="rankText[currentTabIndex]"></rank-list>
                </scroll-view>


                <!-- 当前用户排名位置 -->
                <view 
                    @tap="handleToPosition"
                    class="current_position">
                    <image src="" />
                    <view class="rank_number">12</view>
                </view>

            </view>

        </view>

    </view>

    <!-- 自定义导航栏 -->
    <!-- <custom-tab-bar page="rank" /> -->

</template>

<script>
import { toRefs, reactive, onMounted, computed, nextTick } from 'vue'
import PageHead from "../../components/PageHead.vue"
import CustomTabBar from '../../components/custom-tab-bar/index.vue'
import RankList from './components/List'
import Tooltip from '../../components/Tooltip'
import { useStore } from "vuex"

export default {
    setup(props) {
        getCurrentPages()[0].getTabBar().setData({
			selected: 1
		})
        const store = useStore();
        const headHeight = computed(() => {
			return store.state.headerHeight;
		})
        const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight - 220;
		})
 
		
        onMounted(() => {

        })

        const rankText = [
            {
                tip: '这里聚集着「极限买手」最能省钱的宝宝~',
                countText: '下单量', 
                priceText: '总计节省'
            },
            {
                tip: '围观一下「极限买手」的土豪霸霸们！',
                countText: '下单量', 
                priceText: '总计消费'
            },
            {
                tip: '「极限买手」运气最好的孩纸都在这里...',
                countText: '中奖次数', 
                priceText: '总奖金'
            }
        ]

        //点击 自动滚动到自己排名位置
        const handleToPosition = () => {
            state.scrollTop = 699
            nextTick(() => {
                state.scrollTop = 700
            })
        }

        const state = reactive({
            headHeight,
            mainHeight,
            currentTabIndex: 0,           //当前tabbar index
            scrollTop: 0,                 //滚动条位置
            rankText,
            handleToPosition,
        })

        return toRefs(state)
    },
    components: {
        PageHead,
        RankList,
        CustomTabBar,
        Tooltip
    }
}
</script>

<style lang="less">
    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
    }
    .tooltip_wrap{
        margin-left: 24px;
        margin-bottom: 7px;
    }

    .rank_wrap{
        margin: 0 12px;
        border-radius: 25px;
        overflow: hidden;
        backface-visibility: hidden;
        transform-style: preserve-3d;
        position: relative;

        .scroll_view{
            border-radius: 25px;
            overflow: hidden;
        }
    }

    .rank_tab{
        height: 30px;
        line-height: 30px;
        padding: 18px 12px 12px 12px;

        .rank_tab_item{
            display: inline-block;
            font-size: 24px;
            color: #fff;
            opacity: .6;
            margin-left: 12px;

            &.rank_tab_active{
                opacity: 1;

                image{
                    width: 85px;
                    height: 34px;
                }
            }

            image{
                width: 68px;
                height: 27px;
            }
        }
    }

    .current_position{
        width: 90px;
        height: 102px;
        background: url('../../image/position_bg.png') center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 20px;
        right: 7px;
        z-index: 99999;
        text-align: center;

        image{
            width: 54px;
            height: 54px;
            border-radius: 50%;
            display: block;
            margin: 19px 10px 0 18px;
        }

        .rank_number{
            min-width: 20px;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            background: #31113D;
            padding: 0 2px;
            color: #F8A446;
            border-radius: 50%;
            display: inline-block;
            vertical-align: top;
            margin-top: -15px;
        }

    }
</style>