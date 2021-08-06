<template>
    <view class="mask" v-show="showPlace"></view>
    <view  
        v-show="showPlace"
        @catchtouchmove="handleCatchtouchmove"
        class="dialog_wrap place_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../image/close_icon.png" />
        </view>
        <view class="dialog_box clear">
            <view class="title">切换商场</view>
            <view class="picker_wrap">
                <picker-view 
                    indicator-class="picker_indicator" 
                    class="picker_view city"
                    mask-class="picker_mask"
                    @change="handlePickerCity"
                >
                    <picker-view-column>
                        <view 
                            class="item text_overflow"
                            v-for="(item, index) in cityList"
                            :key="index"
                        >
                            {{ item.name }}
                        </view>
                    </picker-view-column>
                </picker-view>
                <picker-view 
                    indicator-class="picker_indicator" 
                    class="picker_view place"
                    mask-class="picker_mask"
                    @change="handlePickerPlace"
                >
                    <picker-view-column>
                        <view 
                            class="item text_overflow"
                            v-for="(item, index) in placeList"
                            :key="index"
                        >
                            {{ item.placeName }}
                        </view>
                    </picker-view-column>
                </picker-view>
            </view>

            <view 
                v-show="placeInfo"
                @tap="handleSwitchPlace"
                class="btn_wrap result">
                <view class="btn">
                    切换至 
                    {{ placeInfo }}
                </view>
            </view>

        </view>
    </view>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { socketId } from '../../../utils/socketId'

export default {
    setup(props) {
        const store = useStore()
        const { proxy } = getCurrentInstance()

        onMounted(() => {
            wx.showLoading({
                title: '加载中',
            })
        })

        //城市列表
        const cityList = computed(() => {
            return store.state.cityList
        })

        //商场列表
        const placeList = computed(() => {
            return store.state.placeList
        })

        const mainHeight = computed(() => {
			return wx.getSystemInfoSync().windowHeight - store.state.headerHeight
		})
        const headHeight = computed(() => {
			return store.state.headerHeight
		})
        const showPlace = computed(() => {
            return store.state.showPlace
        })

        //关闭
        const handleClosePage = () => {
            store.commit('SET_SHOW_PLACE_LIST', false)
        }

        //选择城市
        const handlePickerCity = e => {
            try {
                state.cityIndex = e.detail.value[0]
                state.placeInfo = ''
                getPlaceList()

                wx.showLoading({
                    title: '加载中',
                })
            } catch (error) {
                
            }
        }

        //根据城市编码 获取场所列表
        const getPlaceList = () => {
            proxy.$socket.socketSendMessage({ 
                id: socketId.placeDataList,
                parentCode: store.state.cityList[state.cityIndex].code
            })
        }

        //选择场所
        const handlePickerPlace = e => {
            if(!e.detail.value && state.cityList.length && state.placeList.length) return
            try {
                state.placeInfo = state.cityList[state.cityIndex].name + '  ' + state.placeList[e.detail.value[0]].placeName
                state.placeId = state.placeList[e.detail.value[0]].placeId
            } catch (error) {
                
            }
        }

        //切换场所
        const handleSwitchPlace = () => {
            proxy.$socket.socketSendMessage({ 
                id: socketId.switchPlaceRequest,
                placeId: state.placeId
            })
            store.state.clearGoodsList = true
            store.state.currentPlace = state.placeInfo
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            handleClosePage()
        }

        watch(cityList, (newData, oldData) => {
            if(newData && newData.length){
                getPlaceList()
            }
        })

        watch(placeList, (newProp, oldProp) => {
            if(newProp && newProp.length){
                wx.hideLoading()
                state.placeInfo = state.cityList[state.cityIndex].name + '  ' +  newProp[0].placeName
                state.placeId = newProp[0].placeId
            }
        })

        const state = reactive({
            cityList,
            placeList,
            mainHeight,
            headHeight,
            showPlace,
            handleClosePage,
            handlePickerPlace,
            handlePickerCity,
            cityIndex: 0,    //选中的城市 索引
            placeInfo: '',   //选择的城市 和 场所信息
            placeId: null,   //选中的场所id
            handleSwitchPlace
        })

        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../variables.less');
    .place_wrap{
        background: #fff url('../../../image/dialog_bg_03.png') left bottom no-repeat;
        background-size: 100%;
        // transition: bottom .3s,opacity .3s;

        // &.active{
        //     opacity: 1;
        //     bottom: 0;
        // }

        .title{
            text-align: center;
            font-size: 16px;
            line-height: 21px;
            padding-top: 24px;
        }
    
        .item{
            height: 44px;
            line-height: 44px;
            padding: 0 7px;
            text-align: center;
        }

        .picker_indicator{
            height: 44px;
            border-top: 1px solid #e5e5e5;
            border-bottom: 1px solid #e5e5e5;
        }

        .picker_wrap{
            margin-top: 25px;
            width: 100%;
            display: inline-block;
            overflow: hidden;
        }

        .picker_view{
            width: 38%; 
            height: 380px;
            float: left;

            &.place{
                width: 62%;
            }
        }


        .btn_wrap{
            position: absolute;
            width: 100%;
            height: 44px;
            left: 0;
            bottom: 70px;
            text-align: center;

            .btn{
                display: inline-block;
                height: 44px;
                line-height: 44px;
                background: @color_info;
                border-radius: 6px;
                padding: 0 40px;
                font-size: 12px;
            }
        }
    }
</style>