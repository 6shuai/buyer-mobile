<template>
    <view 
        v-if="showDialog"
        class="how_to_play_dialog_wrap">
        <view 
            @tap="handleClosePage"
            class="close_btn">
            <image src="../../../../image/close_icon.png" />
        </view>
        <view class="dialog_box">

            <rule :data="data"></rule>

        </view>

    </view>
</template>

<script>
import { reactive, toRefs, nextTick } from 'vue'
import Rule from '../../../../components/Rule'

export default {
    components: {
        Rule
    },
    props: ['data'],
    setup(props) {
        const handleShowPage = () => {
            state.showDialog = true
        }

        const handleClosePage = () => {
            state.showDialog = false
        }

        const state = reactive({
            showDialog: false,
            handleShowPage,
            handleClosePage
        })


        return toRefs(state)
    }
}
</script>

<style lang="less">
    @import url('../../../../variables.less');
    .how_to_play_dialog_wrap{
        width: 100%;
        height: 486px;
        max-height: 80%;
        background: #fff url(../../../../image/dialog_bg_02.png) left bottom no-repeat;
        background-size: 100%;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        box-shadow: 0px 0px 4px rgba(0,0,0,0.2);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9999;

        .close_btn{
            width: 60px;
            height: 60px;
            position: absolute;
            top: -30px;
            right: 0;
        }

        .dialog_box{
            padding-top: 36px;
            height: 450px;

        }

    }
</style>