<template>
	<view 
        class="page_head_wrap" 
        :class="{ 'home_page_head': currentPage=='home' }"
        :style="{  height: headHeight + 'px' }"
    >
		<view :style="{ paddingTop: headTop + 'px' }">
            <view v-if="currentPage=='home'" class="location">
                <view class="current_location text_overflow">
                    <image class="icon_location" src="../image/icon_location.png" />
                    <text>{{ currentPlace }}</text>
                </view>
                <view 
                    class="toggle_location"
                    @tap="handleShowPlaceList"
                >
                    <image
                        class="icon_location_change"
                        src="../image/icon_location_change.png"
                    />
                    切换
                </view>
            </view>

            <view 
                v-else 
                class="logo"
                @tap="gotoHomePage"
            >
                <image src="../image/logo.png" />
            </view>

		</view>
	</view>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['page'],
    setup(props) {
        const store = useStore()

        onMounted(() => {
			state.currentPage = props.page;
		})
        
        //当前场所
        const currentPlace = computed(() =>{
            return store.state.currentPlace
        })

        //回到首页
        const gotoHomePage = () => {
			wx.switchTab({
				url: '/pages/index/index'
			})
		}

        //点击切换 显示场所列表
        const handleShowPlaceList = () => {
            store.commit('SET_SHOW_PLACE_LIST', true)
        }

        //获取胶囊信息
        let { width, height, top, bottom } = wx.getMenuButtonBoundingClientRect()
        const state = reactive({
            headHeight: bottom + 8,  //胶囊高度 加上距离顶部高度
            headTop: top + 6,        //胶囊距离顶部高度
            currentPage: '',
            gotoHomePage,
            handleShowPlaceList,
            currentPlace
        })

        store.dispatch('setHeaderHeight', state.headHeight)
        return toRefs(state)
    }
};
</script>

<style lang="less">
.page_head_wrap {
	width: 100%;
	// height: 94px;
    position: fixed;
    top: 0;
    left: 0;

    &.home_page_head{
        background: rgba(0, 0, 0, 0.2);
    }

	.location {
		height: 20px;
        padding-left: 6px;
		line-height: 20px;
		color: #ffffff;
		font-size: 12px;

		.current_location {
			display: inline-block;
            width: 130px;
			.icon_location {
				width: 16px;
				height: 16px;
				margin-right: 3px;
				vertical-align: middle;
				margin-top: -4px;
			}
		}

        .toggle_location{
            display: inline-block;
            margin-left: 10px;
            width: 51px;
            height: 20px;
            background: rgba(49, 17, 61, 0.2);
            vertical-align: top;
            color: #F2F2F2;
            border-radius: 10px;
            text-align: center;
            .icon_location_change{
                width: 12px;
                height: 12px;
                display: inline-block;
                vertical-align: middle;
                margin-top: -3px;
            }
        }
	}

    .logo{
        width: 123px;
        height: 36px;
        padding-left: 22px;
        font-size: 25px;
        line-height: 25px;
        font-weight: bold;
        color: #fff;
        
        image{
            width: 123px;
            height: 36px;
        }
    }
}
</style>