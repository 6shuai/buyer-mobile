<template>
	<view class="tab_bar">
		<view
			class="tab_bar_item"
			v-for="(item, index) in list"
			:key="index"
			@tap="switchTab(item.pagePath)"
		>
			<view class="tab_bar_img" :class="{'tab_bar_home': item.name=='home'}">
				<view 
					v-if="item.name=='user'"
					class="red_dot"></view>
				
				<image 
					v-if="currentPage == item.name && currentPage == 'home' && showGoTopBtn"
					src="/image/tab_bar_home_goback.png"
					@tap="handleBackToTop"
				/>

				<image
					v-else
					:src="
						currentPage == item.name
							? item.selectedIconPath
							: item.iconPath
					"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { toRefs, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";

export default {
	props: ["page"],
	emits: ["backToTop"],
	setup(props,  { emit }) {
		onMounted(() => {
			state.currentPage = props.page;
		});
		const switchTab = (url) => {
			// state.selected = data.index
			wx.switchTab({
				url: url,
			});
		};

		const store = useStore();

		const showGoTopBtn = computed(() => {
			return store.state.showGoTopBtn;
		})

		//回到顶部
		const handleBackToTop = () => {
			emit('backToTop')
		}

		const state = reactive({
			currentPage: "home", //当前页
			list: [
				{
					name: "home",
					pagePath: "/pages/index/index",
					iconPath: "/image/tab_bar_home.png",
					selectedIconPath: "/image/tab_bar_home_active.png",
					text: "抢购",
				},
				{
					name: "rank",
					pagePath: "/pages/rank/rank",
					iconPath: "/image/tab_bar_rank.png",
					selectedIconPath: "/image/tab_bar_rank_active.png",
					text: "买手榜",
				},
				{
					name: "user",
					pagePath: "/pages/user/user",
					iconPath: "/image/tab_bar_my.png",
					selectedIconPath: "/image/tab_bar_my_active.png",
					text: "我的",
				},
			],
			switchTab,
			showGoTopBtn,
			handleBackToTop
		});

		return toRefs(state);
	},
};
</script>

<style lang="less">
@import url('../../variables.less');

.tab_bar {
	width: 100%;
	height: 82px;
	background: #FFFFFF;
	opacity: 0.8;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	z-index: 9998;
	&_item {
		flex: 1;
		text-align: center;
		margin-top: 3px;
	}
	&_img {
		width: 48px;
		height: 48px;
		display: inline-block;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}

		&.tab_bar_home{
			width: 72px;
			height: 72px;
			margin-top: -25px;
			image {
				width: 100%;
				height: 100%;
			}
		}

		.red_dot{
			width: 6px;
			height: 6px;
			background: @color_warning;
			border-radius: 50%;
			position: absolute;
			top: 0px;
			right: 8px;
			z-index: 999;
		}
	}
}
</style>