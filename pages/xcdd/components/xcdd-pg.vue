<template>
	<view>
		<view v-for="(item, key) in pgContainer" :key="key">
			<view>
				<text v-if="item.type == 'text'">{{item.content}}</text>
				<view v-if="item.type == 'rater'">
					<uni-rate :value="item.value" :name="item.name" :disabled="!!item.rtype" @change="changeRate"></uni-rate>
				</view>
			</view>
		</view>
		<view class="save">
		  <button @click="saveDdpg">保存</button>
		</view>
	</view>
</template>

<script>
	import ddUtils from '../../../common/plugins/kwz/ddutils.js'
	import {uniRate } from "@dcloudio/uni-ui"
	export default {
		data() {
			return {
				pgbzId: '',
				mxid: '',
				pgContainer: [],
				ywsj: ''
			};
		},
		onLoad(param) {
			if (param.bzid && param.mxid) {
				this.pgbzId = param.bzid
				this.mxid = param.mxid
				this.ywsj = param.ywsj
				this.initDdpg()
			}
		},
		components:{uniRate},
		methods: {
			initDdpg() {
        // 根据bzid取模板数据
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_pgbz/selectTbmbglByKey',
					type: 'POST',
					data: {
						BZID: this.pgbzId
					},
					vue: this,
					then(response) {
						let datas = response.datas
						if (datas && datas.tbmbglData) {
							// 获取评估详情
							this.$kwz.ajax.ajaxUrl({
								url: 'jc_pgbzmx/doSelectByPrimary/DDJL',
								type: 'POST',
								data: {
									MXID: this.mxid
								},
								vue: this,
								then(response) {
									let datas1 = response.datas
									let sj = {}
									if (datas1 && datas1.SJ) {
										try {
											sj = JSON.parse(datas1.SJ)
										} catch (e) {
											console.error(e)
										}
									}
									// 将模板解析成文本+rate器
									let contentArray = ddUtils.formatDdpgMb(datas.tbmbglData.MBNR, sj)
									let contentLength = contentArray.length
									let raterContainer = {}
									// 解析需要计算的框 =》 暂时只支持avg
									for(let i =0 ; i< contentLength; i++){
										if (contentArray[i].type == 'rater' && contentArray[i].rtype ) {
											let rel = contentArray[i].rel.split('-')
											let config = {
												rtype: contentArray[i].rtype,
												rel: rel,
												target: contentArray[i].name
											}
											for (let j = 0; j < rel.length; j++) {
												if (!raterContainer[rel[j]]) {
													raterContainer[rel[j]] = []
												}
												raterContainer[rel[j]].push(config)
											}
										}
									}
									this.raterContainer = raterContainer
									this.pgContainer = contentArray
								}
							})
							this.ddpgShow = true
						} else {
							this.$kwz.alert('未找到模板，请联系管理员')
						}
					}
				})
			},
			// 修改评分
			changeRate (data) {
				// 如果当前rate有其他计算关联
				let name = data.name
				let value = data.value
				if (name && this.raterContainer[name]) {
					let configArray = this.raterContainer[name]
					let length = this.pgContainer.length;
					for(let i = 0; i< configArray.length ;i++) {
						let config = configArray[i]
						let rel = config.rel
						let sum = 0;
						// 计算总数
						for(let j = 0; j < rel.length; j++) {
							for(let k = 0; k < length ; k++) {
								if (this.pgContainer[k].name == rel[j]) {
									if(this.pgContainer[k].name != data.name) {
										sum += parseFloat(this.pgContainer[k].value)
									}else{
										sum += value
									}
									break;
								}
							}
						}
						for(let j = 0; j < length ; j++) {
							if (this.pgContainer[j].name == data.name) {
								this.pgContainer[j].value = value
							}
							if (this.pgContainer[j].name == config.target) {
								// 计算平均并赋值
								this.pgContainer[j].value = Math.round((sum / rel.length))
							}
						}
					}
				}
			},
			// 保存督导评估
			saveDdpg (value) {
				let length = this.pgContainer.length
				let sj = {}
				for(let i = 0;i < length; i++) {
					if(this.pgContainer[i].type=='rater') {
						sj[this.pgContainer[i].name] = this.pgContainer[i].value
					}
				}
				this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doAddOrUpdate/DDJL',
          type: 'POST',
          data: {
            SJ: JSON.stringify(sj),
            FZ: sj.FZ,
            MXID: this.mxid,
            YWSJ: this.ywsj
          },
          vue: this,
          then (response) {
						let $kwz = this.$kwz
            $kwz.alert('保存督导评估成功');
						setTimeout(() => {
							$kwz.back()
						}, 1600)
          }
        })
			}
		}
	}
</script>

<style lang="scss">
	.save{
	  width: 710upx;
	  height: 85upx;
	  border-radius: 42.5upx;
	  border: solid 1upx #e1e1e1;
	  margin: 25upx auto;
	  display: flex;
	  background: white;
	  button{
	    padding: 0;
	    margin: 0;
	    width: 100%;
	    border-radius: 42.5upx;
	    background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
	    color: white;
	    line-height: 83upx;
	  }
	  button:after{
	    border: none;
	  }
	}
</style>