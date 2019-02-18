<template>
	<view class="child-content">
    <kw-list-cell title="学校" :rightNote="XXMC"></kw-list-cell>
    <kw-list-cell title="督导时段" :rightNote="SDMC"></kw-list-cell>
    <kw-list-cell title="小组成员" :rightNote="SXDXMC"></kw-list-cell>
    <kw-list-cell title="确认参加成员" :rightNote="QRSXDXMC"></kw-list-cell>
		<kw-list-cell :show="pgmcShow" title="规定任务评价" :rightNote="PGMC"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
          <text class="fl">督导事项</text>
          <view class="fr" v-show="!ddsxShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddsxShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddsxShow" class="ddjs-body">
          <kw-editor-preview :content="DDSX"></kw-editor-preview>
        </view>
      </view>
    </kw-list-cell>
	</view>
</template>

<script>
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"
	export default {
		data() {
			return {
				contentId: '',
        XXMC: '',
				SDMC: '',
				SXDXMC: '',
				QRSXDXMC: '',
				PGMC: '',
        // 督导事项显示隐藏
        ddsxShow:false,
				pgmcShow:false,
				DDSX: {}
			};
		},
		onLoad (param) {
			if(param && param.contentId) {
					this.contentId = param.contentId
					this.$kwz.loadVueDms('DM_SD', dms => {
						this.sdList = dms.DM_SD
					
						// 评估标准
						this.$kwz.ajax.ajaxUrl({
							url: 'dd_gzap/doSelectPgbz/DDPGBZ',
							type: 'POST',
							data: {
								'YWLX': 'DDPGBZ',
								'DDPGBZ': 'DDPGBZ'
							},
							vue: this,
							then (response) {
								let datas = response.datas
								let pgbzList = []
								if (datas && datas.length > 0) {
									for (let i = 0; i < datas.length; i++) {
										pgbzList.push({
											name: datas[i].BZMC,
											value: datas[i].BZID
										})
									}
								} else {
									pgbzList.push({
										name: '暂无记录',
										value: ''
									})
								}
								this.pjList = pgbzList
								
								this.loadData()
							}
						})
					}, this)
			}
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell,KwEditorPreview},
    methods:{
      loadData () {
				if(this.contentId) {
					this.$kwz.ajax.ajaxUrl({
					  url: 'dd_gzap/doSelectByPrimary/DDGZAP',
					  type: 'POST',
					  data: {
					    CONTENT_ID: this.contentId
					  },
					  vue: this,
					  then (response) {
					    let datas = response.datas
					    if (datas && datas.map) {
								let map = datas.map
								
								this.XXMC = map.ORG_ID_TARGET_MC
								let sdmc = map.YWSJ
								sdmc = sdmc.length > 10 ? sdmc.substr(0, 9) : sdmc
								for(let i = 0; i < this.sdList.length; i++) {
									if(this.sdList[i].DMMX_CODE == map.SD) {
										sdmc += ' ' + this.sdList[i].DMMX_MC
										break
									}
								}
								this.SDMC = sdmc
								this.SXDXMC = map.JGID_MC
								this.QRSXDXMC = map.CJID_MC
								this.setDdsx(map.TXT)
								
								if(map.BZID) {
									for(let i = 0; i < this.pjList.length; i++) {
										if(this.pjList[i].value == map.BZID) {
											this.PGMC = this.pjList[i].name
											break
										}
									}
									this.pgmcShow = true
								}
								
					    }
					  }
					})
				}
			},
			// 设置编辑器的督导纪实内容
			setDdsx (html) {
				let ddsx = []
				let ddsxImage = []
				let ddsxSplit = this.$kwz.splitHtml(html)
				if (ddsxSplit && ddsxSplit.length > 0) {
					for (let i in ddsxSplit) {
						let content = ddsxSplit[i]
						if (content.content) {
							ddsx.push(content.content)
						}
						if (content.imageUrl) {
							ddsxImage.push({
								type: 'image',
								content: content.imageUrl,
								imageUrl: content.realUrl
							})
						}
					}
				}
				this.DDSX = {
					content: ddsx.join(''),
					images: ddsxImage
				}
			}
    }
	}
</script>

<style lang="scss">
  .ddjs-head{
      height: 55upx;
    }
  .ddjs-body{
      border:#D9D9D9 solid 2upx;
      textarea{
        width: 100%;
      }
  }
</style>
