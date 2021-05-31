<template>
    <view class="tooltip_box" :class="{ popper_opcity: hasOpcity }">
        {{ text }}
        <view class="popper_arrow"></view>
    </view>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
    props: ['text', 'hasOpcity'],
    setup(props) {
        let msg = ref('')
        onMounted(() => {
		    msg = props.text
		});

        return { msg }
    }
}
</script>
