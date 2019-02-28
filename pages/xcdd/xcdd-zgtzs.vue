<template>
  <view class="child-content">
    <kw-list-cell title="编号" :rightNote="BH"></kw-list-cell>
    <kw-list-cell title="单位" :rightNote="XXMC"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view>经挂牌督导，你单位存在以下问题:</view>
        <view class="text-bold">{{XSNR}}</view>
        <view>
          对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
          <text class="text-bold">{{CLQX}}</text>
          日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" :rightNote="YWSJ"></kw-list-cell>
    <kw-list-cell title="状态" :rightNote="STATUSMC"></kw-list-cell>
    <kw-list-cell :show="cljgCellShow">
      <view>
        <view class="cljg-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow">
            <uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
          </view>
          <view class="fr" v-show="cljgShow">
            <uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
          </view>
        </view>
        <view v-show="cljgShow" class="cljg-body">
          <view class="cljg-text">
            <kw-editor-preview :content="CLBG"></kw-editor-preview>
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
      cljgShow: false,
      cljgCellShow: false,
      zgxsId: '',
      BH: '',
      XXMC: '',
      XSNR: '',
      CLQX: '',
      YWSJ: '',
      STATUSMC: '',
      zgxszt: {
        1: '督学发送整改建议',
        2: '督导委员会发送整改通知书',
        3: '学校已签收整改中',
        5: '督学已签收待确认',
        4: '学校整改完成',
        6: '整改完成'
      },
      CLBG: {}
    };
  },
  components: {
    KwListCell,
    KwEditorPreview
  },
  onLoad(param) {
    if (param && param.zgxsId) {
      this.zgxsId = param.zgxsId
      this.initData()
    }
  },
  methods: {
    initData() {
      if (this.zgxsId) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doSelectByPrimary',
          type: 'POST',
          data: {
            ZGXSID: this.zgxsId
          },
          vue: this,
          then(response) {
            let datas = response.datas
            if (datas && datas.ZGXSID) {
              console.log(datas)
              this.BH = datas.BH
              this.XXMC = datas.XXMC
              this.XSNR = datas.XSNR
              this.CLQX = datas.CLQX
              this.YWSJ = datas.YWSJ.length > 10 ? datas.YWSJ.substr(0, 10) : datas.YWSJ
              this.STATUSMC = this.zgxszt[datas.CLZTDM]

              if (datas.CLZTDM == '4' || datas.CLZTDM == '5' || datas.CLZTDM == '4') {
                this.cljgCellShow = true
                let clgb = []
                let clgbImage = []
                let clgbSplit = this.$kwz.splitHtml(datas.CLBG)
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
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .cljg-head {
    height: 55upx;
  }
  .cljg-body {
    padding: 0 20upx;
    .time {
      text-align: right;
    }
  }
</style>
