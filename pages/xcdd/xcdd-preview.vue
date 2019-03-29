<template>
	<view class="child-content">
		<!-- 标题 -->
		<kw-list-cell title="学校" :rightNote="ddjsData.XXMC"></kw-list-cell>
		<kw-list-cell title="督导时间" :rightNote="ddjsData.YWSJ"></kw-list-cell>
		<kw-list-cell title="创建人" :rightNote="ddjsData.AUTHOR"></kw-list-cell>
		<kw-list-cell :show="ddsxCellShow" :isArrow="false" v-if="gzjhData.TXT">
			<view>
				<view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
					<text class="fl">督导事项</text>
					<view class="fr" v-show="!ddsxShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="ddsxShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="ddsxShow" class="ddjs-body">
          <rich-text :nodes="gzjhData.TXT"></rich-text>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" v-if="ddjs">
			<view>
				<view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
					<text class="fl">督导纪实</text>
					<view class="fr" v-show="!ddjsShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="ddjsShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="ddjsShow" class="ddjs-body">
					<kw-editor-preview :content="ddjs"></kw-editor-preview>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" v-if="ddjsData.PGID">
			<view>
				<view class="ddjs-head clearfix" @click="pgjgShow = !pgjgShow">
					<text class="fl">评估结果</text>
					<view class="fr" v-show="!pgjgShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="pgjgShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="pgjgShow" class="ddjs-body">
					<view v-for="(item, key) in pgContainer" :key="key">
						<view>
							<text v-if="item.type == 'text'">{{item.content}}</text>
							<view v-if="item.type == 'rater'">
								<uni-rate :value="item.value" :name="item.name" :disabled="true"></uni-rate>
							</view>
						</view>
					</view>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" v-if="ddjsData.DXJY">
			<view>
				<view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
					<text class="fl">亮点</text>
					<view class="fr" v-show="!jyzfShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="jyzfShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="jyzfShow" class="ddjs-body">
					<view class="ddjs-text">{{ddjsData.DXJY}}</view>
				</view>
			</view>
		</kw-list-cell>
		<kw-list-cell :isArrow="false" v-if="ddjsData.CZWT">
			<view>
				<view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
					<text class="fl">存在问题</text>
					<view class="fr" v-show="!czwtShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="czwtShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="czwtShow" class="ddjs-body">
					<view class="ddjs-text">{{ddjsData.CZWT}}</view>
				</view>
			</view>
		</kw-list-cell>
		<!-- <kw-list-cell :show="zgbgCellShow">
			<view>
				<view class="ddjs-head clearfix" @click="zgbgShow = !zgbgShow">
					<text class="fl">整改报告</text>
					<view class="fr" v-show="!zgbgShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="zgbgShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
				<view v-show="zgbgShow" class="ddjs-body">
					<view class="ddjs-text">这里显示内容</view>
				</view>
			</view>
		</kw-list-cell> -->
		<kw-list-cell :show="ddjsData.STATUS != '1'" :isArrow="false">
			<view>
				<view class="ddjs-head clearfix" @click="hxclyjShow = !hxclyjShow">
					<text class="fl">后续处理意见</text>
					<view class="fr" v-show="!hxclyjShow">
						<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
					</view>
					<view class="fr" v-show="hxclyjShow">
						<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
					</view>
				</view>
        <!-- 处理内容 -->
				<view v-show="hxclyjShow" class="ddjs-body">
          <view class="color-blue">{{ddjsData.STATUS_MC}}</view>
          <!-- 小问题 -->
					<view v-if="ddjsData.STATUS =='4'">
						<view class="text-bold">{{ddjsData.ZGJY}}</view>
					</view>
          <!-- 整改 -->
					<view v-if="ddjsData.STATUS=='2' || ddjsData.STATUS=='5' ">
						<view>经挂牌督导，你单位存在以下问题及建议:</view>
						<view class="text-bold">{{zgxsData.XSNR}}</view>
						<view>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发 
                <text class="text-bold">{{zgxsData.CLQX}}</text>
                日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
            </view>
						<view class="time">{{zgxsData.YWSJ}}</view>
					</view>
          <!-- 协商 -->
					<view v-if="ddjsData.STATUS=='3'">
						<view>我室责任督学于 
                  <text class="text-bold">{{zgxsData.YWSJ}}</text>
                  对
                  <text class="text-bold">{{ddjsData.XXMC}}</text>
                  进行了教育督导，发现该学校(幼儿园)存在以下问题及建议:
            </view>
						<view class="text-bold">{{zgxsData.XSNR}}</view>
						<view>请贵科室（中心）予以支持、配合、协调解决!</view>
						<view class="time">{{zgxsData.YWSJ}}</view>
					</view>
          <!-- 处理状态码==6 整改完成 显示学校整改报告 -->
					<view v-if="zgxsData.CLZTDM == '6' || zgxsData.CLZTDM == '26'">
						<view>处理结果:</view>
            <!-- kw-editor-preview会把处理报告里的html字符串全部屏蔽。然后变成纯文本。顾用rich-text -->
						<kw-editor-preview :content="this.zgxsData.CLBG"></kw-editor-preview>
            <!-- <rich-text :nodes="zgxsData.CLBG"></rich-text> -->
					</view>
				</view>
			</view>
		</kw-list-cell>
	</view>
</template>

<script>
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"
  import ddUtils from '../../common/plugins/kwz/ddutils.js'
  import {uniRate } from "@dcloudio/uni-ui"

	export default {
		data() {
			return {
        // 督导纪实数据
        ddjsData:{
          STATUS_MC:"", // 整改类型名称
          XXMC: '', // 学校名称
				  YWSJ: '', // 督导时间
          AUTHOR: '',	// 创建人
          GZAP_YWID:"", // 工作计划id
          DXJY: '',	// 亮点 督学建议 典型经验和做法
          CZWT: '', // 存在问题
				  ZGJY: '', // 整改意见 小问题
          STATUS: '1', // 是整改还是协商
          PGID:"", // 评估id
        },
        // 工作计划数据
        gzjhData: {
          TXT: "", // 督导事项
          BZID:"", // 评估标准id
        },
        // 评估数据
        pgbzData: {},
        // 整改协商数据
        zgxsData:{
          XSNR: '', // 整改协商内容
          CLQX: '', // 处理期限
          CLBG: {}, // 处理报告
				  YWSJ: '', // 整改协商时间
          CLZTDM: '', // 整改协商处理状态代码
        },
				// 督导纪实
				ddjs: {},
				// 督导纪实id
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
        raterContainer:{},
        // 评估处理后的模板数据
        pgContainer:{}
			};
		},
		components: {uniRate,KwListCell,KwEditorPreview},
		onLoad(param) {
			if (param && param.contentId) {
				this.contentId = param.contentId
				this.loadData()
			}
		},
		methods: {
      // 加载督导纪实数据
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
              this.ddjsData = response.datas
							if (this.ddjsData && this.ddjsData.CONTENT_ID) {
                // 加载工作安排信息
								if(this.ddjsData.GZAP_YWID) {
									this.loadGzjhData()
								}
								// 格式化督导纪实
                this.setDdjs(this.ddjsData.DDJS)
								// this.zgbgCellShow = true
                // 加载整改通知||协商意见
								if(this.ddjsData.STATUS == '2' || this.ddjsData.STATUS == '5' || this.ddjsData.STATUS == '3' ) {
                  this.getZgXs()
								}
							}
						}
					})
				}
			},
      // 加载工作计划信息
      loadGzjhData(){
        this.$kwz.ajax.ajaxUrl({
        	url: 'dd_gzap/doSelectByPrimary/DDGZAP',
        	type: 'POST',
        	data: {
        		CONTENT_ID: this.ddjsData.GZAP_YWID
        	},
        	vue: this,
        	then (response) {
        		let datas = response.datas
        		if(datas && datas.map) {
        			this.ddsxCellShow = true
              this.gzjhData = datas.map
              // 当使用rich-text标签渲染督导事项时，需要加父标签
        			this.gzjhData.TXT = `<div>${datas.map.TXT}</div>`
              this.loadPgData()
        		}
        	}
        })
      },
      // 设置督导纪实内容 将html转成ddjs
      setDdjs (html) {
      	let ddjs = []
      	let ddjsImage = []
      	let ddjsSplit = this.$kwz.splitHtml(html)
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
      	this.ddjs = {
      		content: ddjs.join(''),
      		images: ddjsImage
      	}
      },
      // 获取整改协商数据
      getZgXs(){
        this.$kwz.ajax.ajaxUrl({
        	url: 'dd_zgxs/selectZgxsList',
        	type: 'POST',
        	data: {
        		CONTENT_ID: this.contentId,
        		ZGXSLY: '1'
        	},
        	vue: this,
        	then (response) {
            this.zgxsData = response.datas[0]
        		if(this.zgxsData) {
        			this.zgxsData.YWSJ = this.zgxsData.YWSJ.substr(0, 10)
        			let clgb = []
        			let clgbImage = []
        			let clgbSplit = this.$kwz.splitHtml(this.zgxsData.CLBG)
        			if (clgbSplit && clgbSplit.length > 0) {
        				for (let i in clgbSplit) {
        					let content = clgbSplit[i]
        					if (content.content) {
        						clgb.push(content.content)
        					}
        					if (content.imageUrl) {
        						// if (!content.imageUrl.startsWith('http')) {
        							clgbImage.push({
        								type: 'image',
        								content: content.imageUrl,
        								imageUrl: content.realUrl
        							})
        						// }
        					}
        				}
        			}
        			let attach = this.$kwz.splitAttachHtml(this.zgxsData.CLBG)
        			this.zgxsData.CLBG = {
        				content: clgb.join(''),
        				images: clgbImage,
        				attachs: attach
        			}
        		}
        	}
        })
      },
      // 加载评估数据
      loadPgData(){
        let pgdx = this.ddjsData.USERID ? this.ddjsData.USERID.split(',') : []
        if(this.gzjhData.BZID && this.ddjsData.PGID && pgdx.length > 0){
          // 根据bzid取模板数据
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbz/selectTbmbglByKey',
            type: 'POST',
            data: {
              BZID: this.gzjhData.BZID
            },
            vue: this,
            then (response) {
              let mbnr = response.datas.tbmbglData.MBNR
              if (mbnr) {
                // 根据当前督学获取打分数据
                this.$kwz.ajax.ajaxUrl({
                	url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
                	type: 'POST',
                	data: {
                		PGID: this.ddjsData.PGID,
                		tbr: this.$kwz.getLoginUser().uid,
                		MB_ORG_ID: this.ddjsData.ORG_ID
                	},
                	vue: this,
                	then (response) {
                    let sj = JSON.parse(response.datas.SJ)
                    this.pgContainer = ddUtils.formatDdpgMb(mbnr, sj)
                  }
                })
              }
            }
          })
        }
      },
     
    }
	}
</script>

<style lang="scss">
</style>
