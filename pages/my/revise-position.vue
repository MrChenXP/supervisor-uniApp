<template>
	<view class="child-content revise-institution">
		<radio-group>
			<label class="" v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
				<radio :value="item.value" />
				<view class="radio-label">{{item.label}}</view>
			</label>
		</radio-group>
		<view class="save">
		  <button @click="radioChange">签到</button>
		</view>
	</view>
</template>

<script>
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
		components: {
			KwListCell
		},
		data() {
			return {
				userOrgs: [{
					label: '在您附近未找到学校',
					value: ''
				}]
			};
		},
		onLoad() {
			// this.loadUserOrgs()
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.revise-institution {
		width: 100%;
	}

	label {
		display: inline-block;
		background: white;
		width: 100%;
		padding: 20upx !important;
		position: relative;
		box-sizing: border-box;
	}

	.radio-label {
		text-align: right;
		position: absolute;
		right: 20upx;
		top: 20upx;
	}

	.borderBottom::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		transform: scaleY(.5);
		background-color: #c8c7cc;
		margin: 0 20upx;
	}

	.save {
		width: 710upx;
		height: 85upx;
		border-radius: 42.5upx;
		border: solid 1upx #e1e1e1;
		margin: 25upx auto;
		display: flex;
		background: white;

		button {
			padding: 0;
			margin: 0;
			width: 100%;
			border-radius: 42.5upx;
			background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
			color: white;
			line-height: 83upx;
		}

		button:after {
			border: none;
		}
	}
</style>
