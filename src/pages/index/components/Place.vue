<template>
    <view 
        class="place_wrap"
        :class="{ 'active': showPlace }"
    >
        <view 
            class="close"
            :style="{ height: headHeight + 'px'}"
        >
            <text @tap="handleClose">关闭</text>
        </view>
        <scroll-view 
            :scrollY="true"
            :style="{ height: mainHeight + 'px' }"
        >
            <view 
                class="item"
                v-for="(item, index) in 100"
                :key="index"
                @tap="handleSelectPlace(item)"
            >
                {{ item }}
            </view>
        </scroll-view>
    </view>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    setup(props) {
        const store = useStore()
        const placeList = computed(() => {
            return store.state.placeList
        })
        const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight;
		})
        const headHeight = computed(() => {
			return store.state.headerHeight
		})
        const showPlace = computed(() => {
            return store.state.showPlace
        })

        //关闭
        const handleClose = () => {
            store.commit('SET_SHOW_PLACE_LIST', false)
        }

        //选择场所
        const handleSelectPlace = data => {
            console.log('选择场所-->', data)
            handleClose()
        }
		
        const state = reactive({
            placeList,
            mainHeight,
            headHeight,
            showPlace,
            handleClose,
            handleSelectPlace
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    .place_wrap{
        position: absolute;
        bottom: -100%;
        left: 0;
        z-index: 999999999;
        width: 100%;
        height: 100%;
        background: #fff;
        opacity: 0;
        transition: bottom .3s,opacity .3s;

        &.active{
            opacity: 1;
            bottom: 0;
        }
        
        .close{
            width: 100%;
            padding-left: 50px;
            display:flex;
            align-items:flex-end;

            text{
                padding-bottom: 10px;
            }
        }
        
        .item{
            margin: 10px 20px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border-bottom: 1px solid #e5e5e5;
        }
    }
</style>