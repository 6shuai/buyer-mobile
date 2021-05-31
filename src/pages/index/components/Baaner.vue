<template>
    <view class="banner_box">
        <view class="banner_wrap">
            <swiper
                class="banner_swiper"
                indicator-color="#999"
                indicator-active-color="#333"
                :interval="1000"
                circular
                autoplay
                @change="changeSwiper"
            >
                <swiper-item v-for="(item, index) in bannerData" :key="index">
                    <view class="banner_item">{{ item }}</view>
                </swiper-item>
            </swiper>
            <view class="indicator_dots">
                <view v-for="(d, i) in bannerData" :key="i" class="item" :class="{ active: currentIndex == i }"></view>
            </view>
        </view>
    </view>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
	setup(props) {
        const changeSwiper = e => {
            state.currentIndex = e.target.current
        }

		const state = reactive({
			bannerData: [1, 2, 3, 4, 5],
            currentIndex: 0,
            changeSwiper
		});

		return toRefs(state);
	},
};
</script>

<style lang="less">
.banner_box{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    
    .banner_wrap{
        width: 100%;
        height: 128px;
        position: relative;
        .banner_swiper {
            width: 369px;
            height: 128px;
            margin: 0 3px;
            swiper-item {
                width: 100%;
                height: 100%;
                background: #999;
                border-radius: 12px;
            }

        }
        
        .indicator_dots {
            position: absolute;
            bottom: 2px;
            width: 100%;
            text-align: center;

            .item {
                display: inline-block;
                width: 12px;
                height: 2px;
                background: #31113d;
                border-radius: 3px;
                margin: 0 6px;
                &.active{
                    background: #EB9B42;
                }
            }
        }
    }
}
</style>