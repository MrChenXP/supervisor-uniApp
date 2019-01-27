<template>
	<view>
		11111111111111111
	</view>
</template>

<script>
	import ddUtils from '../../../common/plugins/kwz/ddutils.js'
	export default {
		data() {
			return {
				pgbzId: '',
				mxid: ''
			};
		},
		onLoad(param) {
			if (param.bzid && param.mxid) {
				this.pgbzId = param.bzid
				this.mxid = param.mxid
				this.initDdpg()
			}
		},
		methods: {
			initDdpg() {
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
							// this.pgbzTemplate = this.$kwz.formatPgbz(datas.tbmbglData.MBNR)
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
									let contentArray = ddUtils.formatDdpgMb(datas.tbmbglData.MBNR)
									// console.log(datas)
									// 										let pgbzCom = this.$kwz.formatPgbz(datas.tbmbglData.MBNR, sj)
									// 										this.pgbzVm = pgbzCom
									// 										document.getElementById('pgbzContainer').appendChild(pgbzCom.$mount().$el)
								}
							})
							this.ddpgShow = true
						} else {
							this.$kwz.alert('未找到模板，请联系管理员')
						}
					}
				})
			}
		}
	}
</script>
