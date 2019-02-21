<template>
	<view class="child-content">
		<!-- 标题 -->
		<kw-list-cell title="学校" :rightNote="XXMC"></kw-list-cell>
		<kw-list-cell title="督导时间" :rightNote="YWSJ"></kw-list-cell>
		<kw-list-cell title="创建人" :rightNote="AUTHOR"></kw-list-cell>
		<kw-list-cell :show="ddsxCellShow" :isArrow="false">
			<view>
				<view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
					<text class="fl">督导事项</text>
					<view class="fr" v-show="!ddsxShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="ddsxShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="ddsxShow" class="ddjs-body">
					<view class="ddjs-text">{{DDSX}}</view>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" >
			<view>
				<view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
					<text class="fl">督导纪实</text>
					<view class="fr" v-show="!ddjsShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="ddjsShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="ddjsShow" class="ddjs-body">
					<kw-editor-preview :content="DDJS"></kw-editor-preview>
					<!-- <view class="ddjs-text">这里显示内容</view> -->
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" >
			<view>
				<view class="ddjs-head clearfix" @click="pgjgShow = !pgjgShow">
					<text class="fl">评估结果</text>
					<view class="fr" v-show="!pgjgShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="pgjgShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="pgjgShow" class="ddjs-body">
					<view class="ddjs-text">这里显示内容</view>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false">
			<view>
				<view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
					<text class="fl">亮点</text>
					<view class="fr" v-show="!jyzfShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="jyzfShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="jyzfShow" class="ddjs-body">
					<view class="ddjs-text">{{DXJY}}</view>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false">
			<view>
				<view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
					<text class="fl">存在问题</text>
					<view class="fr" v-show="!czwtShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="czwtShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="czwtShow" class="ddjs-body">
					<view class="ddjs-text">{{CZWT}}</view>
				</view>
			</view>
		</kw-list-cell>
		<!-- <kw-list-cell :show="zgbgCellShow">
			<view>
				<view class="ddjs-head clearfix" @click="zgbgShow = !zgbgShow">
					<text class="fl">整改报告</text>
					<view class="fr" v-show="!zgbgShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="zgbgShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="zgbgShow" class="ddjs-body">
					<view class="ddjs-text">这里显示内容</view>
				</view>
			</view>
		</kw-list-cell> -->
		<kw-list-cell :show="hxclyjCellShow" :isArrow="false">
			<view>
				<view class="ddjs-head clearfix" @click="hxclyjShow = !hxclyjShow">
					<text class="fl">后续处理意见</text>
					<view class="fr" v-show="!hxclyjShow">
						<uni-icon type="arrowdown" size="25"></uni-icon>
					</view>
					<view class="fr" v-show="hxclyjShow">
						<uni-icon type="arrowup" size="25"></uni-icon>
					</view>
				</view>
				<view v-show="hxclyjShow" class="ddjs-body">
					<view v-if="zgxsdm=='4'">
						<view>{{ZGJY}}</view>
					</view>
					<view v-if="zgxsdm=='2' || zgxsdm=='5' ">
						<view>经挂牌督导，你单位存在以下问题及建议:</view>
						<view>{{ZGXSNR}}</view>
						<view>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发 {{ZGCLQX}} 日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。</view>
						<view class="time">{{ZGYWSJ}}</view>
					</view>
					<view v-if="zgxsdm=='3'">
						<view>我室责任督学于 {{ZGYWSJ}} 对 {{XXMC}} 进行了教育督导，发现该学校(幼儿园)存在以下问题及建议:</view>
						<view>{{ZGXSNR}}</view>
						<view>请贵科室（中心）予以支持、配合、协调解决!</view>
						<view class="time">{{ZGYWSJ}}</view>
					</view>
					<view v-if="ZGCLZTDM == '6' ">
						<view>处理结果:</view>
						<kw-editor-preview :content="ZGCLBG"></kw-editor-preview>
					</view>
				</view>
			</view>
		</kw-list-cell>

	</view>
</template>

<script>
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"
	export default {
		data() {
			return {
				// 学校名称
				XXMC: '',
				// 督导时间
				YWSJ: '',
				// 创建人
				AUTHOR: '',
				// 督导事项
				DDSX: '',
				// 督导纪实
				DDJS: {},
				// 亮点
				DXJY: '',
				// 存在问题
				CZWT: '',
				// 小问题整改意见
				ZGJY: '',
				// contentId
				contentId: '',
				// 督导事项显示隐藏
				ddsxShow: false,
				// 督导事项cell显示隐藏
				ddsxCellShow: false,
				// 督导纪实显示隐藏
				ddjsShow: false,
				//评估结果显示隐藏
				pgjgShow: false,
				// 亮点(典型经验和做法)显示隐藏
				jyzfShow: false,
				// 存在问题显示隐藏
				czwtShow: false,
				// 整改报告显示隐藏
				// zgbgShow: false,
				// 整改报告Cell显示隐藏
				// zgbgCellShow: false,
				// 后续处理意见显示隐藏
				hxclyjShow: false,
				// 后续处理意见Cell显示隐藏
				hxclyjCellShow: false,
				// 是整改还是协商
				zgxsdm: '1',
				// 整改业务时间
				ZGYWSJ: '',
				ZGCLQX: '',
				ZGXSNR: '',
				ZGCLZTDM: '',
				ZGCLBG: {}
			};
		},
		components: {
			KwListCell,
			KwEditorPreview
		},
		onLoad(param) {
			if (param && param.contentId) {
				this.contentId = param.contentId
				this.loadData()
			}
		},
		methods: {
			loadData() {
				if (this.contentId) {
					this.$kwz.ajax.ajaxUrl({
						url: 'ddjl/doSelectByPrimaryKey',
						type: 'POST',
						data: {
							CONTENT_ID: this.contentId
						},
						vue: this,
						then(response) {
							let datas = response.datas
							console.log(datas)
							if (datas && datas.CONTENT_ID) {
								this.XXMC = datas.XXMC
								this.YWSJ = datas.YWSJ
								this.AUTHOR = datas.AUTHOR
								
								if(datas.GZAP_YWID) {
									// 加载工作安排信息
									this.$kwz.ajax.ajaxUrl({
										url: 'dd_gzap/doSelectByPrimary/DDGZAP',
										type: 'POST',
										data: {
											CONTENT_ID: datas.GZAP_YWID
										},
										vue: this,
										then (response) {
											let datas = response.datas
											if(datas && datas.map) {
												this.ddsxCellShow = true
												this.DDSX = datas.map.TXT
											}
										}
									})
								}
								// 格式化督导纪实
								let ddjs = []
								let ddjsImage = []
								let ddjsSplit = this.$kwz.splitHtml(datas.DDJS)
								if (ddjsSplit && ddjsSplit.length > 0) {
									for (let i in ddjsSplit) {
										let content = ddjsSplit[i]
										if (content.content) {
											ddjs.push(content.content)
										}
										if (content.imageUrl) {
											ddjsImage.push({
												type: 'image',
												content: content.imageUrl,
												imageUrl: content.realUrl
											})
										}
									}
								}
								this.DDJS = {
									content: ddjs.join(''),
									images: ddjsImage
								}
								
								this.DXJY = datas.DXJY
								this.CZWT = datas.CZWT
								
								// this.zgbgCellShow = true
								this.zgxsdm = datas.STATUS
								this.ZGJY = datas.ZGJY
								this.hxclyjCellShow = datas.STATUS != '1';
								
								if(datas.STATUS == '2' || datas.STATUS == '5') {
									// 整改通知	|| 协商意见
									this.$kwz.ajax.ajaxUrl({
										url: 'dd_zgxs/selectZgxsList',
										type: 'POST',
										data: {
											CONTENT_ID: datas.CONTENT_ID,
											ZGXSLY: '1'
										},
										vue: this,
										then (response) {
											let datas = response.datas
											if(datas && datas.length > 0) {
												let zgxs = datas[0]
												this.ZGXSNR = zgxs.XSNR
												this.ZGCLQX = zgxs.CLQX
												this.ZGYWSJ = zgxs.YWSJ
												this.ZGCLZTDM = zgxs.CLZTDM
												
												let clgb = []
												let clgbImage = []
												let clgbSplit = this.$kwz.splitHtml(zgxs.CLBG)
												if (clgbSplit && clgbSplit.length > 0) {
													for (let i in clgbSplit) {
														let content = clgbSplit[i]
														if (content.content) {
															clgb.push(content.content)
														}
														if (content.imageUrl) {
															if (!content.imageUrl.startsWith('http')) {
																clgbImage.push({
																	type: 'image',
																	content: content.imageUrl,
																	imageUrl: content.realUrl
																})
															}
														}
													}
												}
												let attach = this.$kwz.splitAttachHtml(zgxs.CLBG)
												this.ZGCLBG = {
													content: clgb.join(''),
													images: clgbImage,
													attachs: attach
												}
											}
										}
									})
								// } else if(datas.STATUS == '3') {
									// 协商意见
								}
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.ddjs-head {
		height: 55upx;
	}

	.ddjs-body {
		padding: 0 20upx;

		.time {
			text-align: right;
		}
	}
</style>
