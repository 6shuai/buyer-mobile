<template>
    <view 
        class="banner_box"
        :class="{ sticky: showBanner == 'show' }"
    >
        <view 
            class="banner_wrap"
            :class="showBanner == 'show' ? 'show_banner' :  showBanner == 'hide' ? 'hide_banner' : ''"
        >
            <swiper
                class="banner_swiper"
                indicator-color="#999"
                indicator-active-color="#333"
                :interval="1000"
                circular
                autoplay
                @change="changeSwiper"
            >
                <swiper-item v-for="(item, index) in bannerList" :key="index">
                    <view 
                        class="banner_item"
                        @tap="handleClickBanner(index)"
                    >
                        <image :src="item.image" />
                    </view>
                </swiper-item>
            </swiper>
            <view class="indicator_dots">
                <view 
                    v-for="(d, i) in bannerList" 
                    :key="i" 
                    class="item" 
                    :class="{ active: currentIndex == i }"
                ></view>
            </view>
        </view>
    </view>
</template>

<script>
import { reactive, toRefs, computed } from "vue"
import { useStore } from 'vuex'
export default {
    props: ['showBanner'],
	setup(props) {
        const store = useStore()
        const bannerList = computed(() => {
            return store.state.bannerList
        })

        //监听banner切换
        const changeSwiper = e => {
            state.currentIndex = e.target.current
        }

        //点击banner
        const handleClickBanner = index => {
            console.log('点击了', index)
        }

		const state = reactive({
            currentIndex: 0,
            changeSwiper,
            bannerList,
            handleClickBanner
		});

		return toRefs(state);
	},
};
</script>

<style lang="less">
.banner_box{
    height: 128px;
    overflow: hidden;
    
    .banner_wrap{
        width: 100%;
        height: 128px;
        overflow: hidden;
        position: relative;
        opacity: 1;
        transition: opacity .5s ease;

        &.show_banner{
            opacity: 1;
            position: fixed;
            z-index: 99;
        }

        &.hide_banner{
            opacity: 0;
            position: fixed;
            // top: -128px;
            z-index: 99;
        }

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

            .banner_item,  .banner_item image{
                width: 100%;
                height: 100%;
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