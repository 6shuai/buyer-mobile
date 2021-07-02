<template>
    <!--   完善物流地址  -->
    <view class="address_wrap">
        <view class="item">
            <input 
                placeholder-class="placeholder" 
                class="input name text_size_12" 
                maxlength="6" 
                placeholder="姓名" 
                v-model="params.name"
            />
            <input 
                placeholder-class="placeholder" 
                class="input mobile text_size_12" 
                type="number" 
                maxlength="11" 
                placeholder="手机号" 
                v-model="params.mobile"
            />
        </view>
        
        <view class="item region">
            <picker 
                class="input placeholder"
                mode="region" 
                :value="region" 
                custom-item="选择"
                @change="changeRegion"
            >
                <text v-show="!region.length">城市/区域</text>
                <view v-show="region.length" class="text_size_12">
                    <text v-for="(item, index) in region" :key="index">{{ item }}&nbsp;&nbsp;</text> 
                </view>
            </picker>
        </view>

        <view class="item">
            <textarea 
                placeholder-class="placeholder" 
                class="input textarea text_size_12" 
                maxlength="60" 
                auto-height="true"
                placeholder="详细地址" 
                v-model="params.address"
            />
        </view>

        <view 
            class="buy_btn_wrap result">
            <view 
                class="buy_btn"
                :class="{ incomplete: !validate }"
                @tap="handleSubmit"
            >
                {{ validate ? '就发到这里' : '物流信息不完整' }}
            </view>
        </view>
    </view>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance, watch } from 'vue'
import { showToast } from '../../../../utils/index'
import { socketId } from '../../../../utils/socketId'
import { useStore } from 'vuex'


export default {
    props: ['orderNumber'],
    emits: ['commitAddressSuccess'],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance()
        const store = useStore()

        const validate = computed(() => {
            let { name, mobile, address, province, city, district } = state.params
            if(name && mobile && address && province && city && district){
                return true
            }
            return false
        })

        //选择城市
        const changeRegion = e => {
            let { code, value } = e.detail
            state.region = value
            
            state.params = {
                ...state.params,
                orderNumber: props.orderNumber,
                province: code[0],
                city: code[1],
                district: code[2]
            }
        }

        const phoneFun = (phones) => {
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!myreg.test(phones)) {
                return false;
            } else {
                return true;
            }
        }

        //提交物流信息
        const handleSubmit = () => {
            if(!state.validate) return
            if(!phoneFun(state.params.mobile)){
                showToast('手机号格式不正确~')
                return
            }
            proxy.$socket.socketSendMessage({
                id: socketId.commitShippingAddress,
                ...state.params
            })

            wx.showLoading({
                mask: true,
                title: '提交中'
            })
        }

        const commitAddressResult = computed(() => {
            return store.state.commitAddressResult
        })

        watch(commitAddressResult, (newProps, oldProps) => {
            let { result, message } = newProps
            if(result){
                showToast('提交成功~', 'success')
                emit('commitAddressSuccess', state.params)
            }else{
                showToast(message)
            }
        })

        const state = reactive({
            region: [],
            params: {},
            changeRegion,
            validate,
            handleSubmit
        })

        return toRefs(state)
    }
}
</script>

<style lang="less" scop>
    @import url('../../../../variables.less');
    .address_wrap{
        padding-top: 77px;

        .item{
            padding: 0 12px; 
            margin-top: 6px;

            input{
                line-height: 42px;
            }

            .input{
                width: 100%;
                height: 41px;
                border-bottom: 1px solid #8c868f99;
                display: inline-block;

                &.name{
                    width: 120px;
                }

                &.mobile{
                    width: 218px;
                    float: right;
                }


                &.textarea{
                    padding: 12px 0;
                }

            }

            .placeholder {
                color: #8c868f99;
                line-height: 42px;
            }

            &.region{
                background: url('../../../../image/select.png') no-repeat center right 12px;
            }
        }

        .buy_btn_wrap .buy_btn.incomplete{
            background: #e0e0e0;
            color: @color_darkgray;
        }
    }

</style>