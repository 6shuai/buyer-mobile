<template>
    <view class="page_bg">
        <page-head />
        <view :style="{ marginTop: headHeight + 'px' }">
            <view class="rank-tab">
                <view 
                    v-for="(item, index) in tabList"
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
                text="围观一下「极限买手」的土豪霸霸们！"
                class="tooltip_wrap"
                :hasOpcity="true"
            ></tooltip>    

            <view class="rank_wrap">
                <scroll-view
                    class="scroll-view"
                    :style="{ height: mainHeight + 'px' }"
                    scrollY="true"
                    :scrollTop="0"
                >
                    
                
                    <rank-list></rank-list>
                </scroll-view>
            </view>

            <view class="current_position">
                <image src="" />
                <view class="rank_number">12</view>
            </view>



            <CustomTabBar  page="rank" />
        </view>

    </view>
</template>

<script>
import { toRefs, reactive, onMounted, computed } from 'vue'
import PageHead from "../../components/PageHead.vue"
import CustomTabBar from '../../components/custom-tab-bar/index.vue'
import RankList from './components/List'
import Tooltip from '../../components/Tooltip'
import { useStore } from "vuex"

export default {
    setup(props) {
        const store = useStore();
        const headHeight = computed(() => {
			return store.state.headerHeight;
		})
        const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight - 220;
		})

		
        onMounted(() => {

        })

        const state = reactive({
            headHeight,
            mainHeight,
            currentTabIndex: 0,           //当前tabbar index
            tabList: ['../../image/rank_jixian.png', '../../image/rank_tuhao.png', '../../image/rank_caijia.png'],
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

        .scroll-view{
            min-height: 500px;
        }
    }

    .rank-tab{
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
        position: fixed;
        bottom: 110px;
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