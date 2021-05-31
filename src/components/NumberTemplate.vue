<template>
 	<view class="number-warp">
		<text class="price_before ali_font_bold"
			>￥</text
		>
		<text class="price_num ali_font_bold"
			>1,680</text
		>
		<text class="price_after ali_font_bold"
			>.00</text
		>
		<text class="text_size_10">起</text>
  	</view>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
	props: { data: String },
	setup (props) {

	}
}
</script>

<style>
.title {
  font-size: 40px;
}
</style>
