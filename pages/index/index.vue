<template>
	<view class="index main-content">
    <!-- banner -->
		<swiper class="swiper" indicator-dots=true autoplay=true interval="3000">
			<swiper-item v-for="(image, i) in indexImage" :key="i" >
				<view class="swiper-item uni-bg-red">
					<image class="image" mode="aspectFill" :src="image" />
				</view>
			</swiper-item>
		</swiper>
    <!-- 选项卡 -->
    <view class="newBody">
      <!-- 标题栏 -->
     	<scroll-view class="btList" scroll-x="true" >
     		<view v-for="(bt,i) in btList" :key="i" class="bt" @click="isActive = i"
              :class="{active: isActive === i}">{{bt}}</view>
     	</scroll-view>
      <!-- 列表区 -->
      <scroll-view  scroll-y="true" class="newsList">
        <view v-for="(list,i) in newsBtList" :key="i" v-show="i===isActive" class="newsBody">
          <view v-for="(news,j) in list" :key="j" class="news" :class="{newsBorder: j!=0}" @tap="toNews(news.CONTENT_ID)">
            <view class="icon">&bull;</view>
            <view class="newsBt">
              {{news.TITLE}}
            </view>
            <view class="newsDate">{{news.YWSJSJ}}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 登录 -->
    <!-- <kw-login v-if="loginShow"  @closeLogin="closeLogin" @login="login" @toggerVcode="toggerVcode"></kw-login> -->
	</view>
</template>

<script>
  import KwLogin from "@kwz/kw-ui/kw-login.vue"
	export default {
		data() {
			return {
				// loginShow: true, // 登录显示隐藏
				isActive: 0, // 控制标题栏选中样式
				indexImage: [],
				btList: [], // 标题栏文字
				newsBtList:[ // 整个新闻列表数据
				]
			};
		},
		onLoad () {
			this.loadIndexData();
		},
    methods: {
			// 加载首页数据
			loadIndexData () {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_mobile/open/getYkXtsz',
					type: 'POST',
					vue: this,
					then (data) {
						if (data && "200" == data.statusCode) {
							let ykpic = data.datas.YKPIC;
							let ykinfo = data.datas.YKINFO;
							// 首页图片
							if (ykpic && ykpic.length > 0) {
								for(let i =0;i<ykpic.length;i++) {
									this.indexImage.push(this.$kwz.ajax.url('index/visit/doDownload?F_ID=' + ykpic[i].F_ID))
								}
							}
							// 首页新闻
							if (ykinfo && ykinfo.length > 0) {
								for(let i =0;i<ykinfo.length;i++) {
									this.btList.push(ykinfo[i].YWMC)
									this.newsBtList.push(ykinfo[i].CONTENT)
								}
							}
						}
					}
				})
			},
      toNews (newsId) {
        if(newsId) {
				 this.$kwz.router({
         	url: '/pages/news/news?CONTENT_ID=' + newsId
         })
        }
      }
    }
	}
</script>

<style lang="scss">
	.swiper{
		height: 405upx;
    image{
    	width: 100%;
    	height: 405upx;
    }
	}
  .newBody{
    height: calc(100% - 405upx);
  }
  .btList {
  	white-space: nowrap;
    height: 95upx;
    background: white;
    .bt {
      display: inline-block;
      width: 170upx;
      height: 93upx;
      line-height: 93upx;
      border-bottom: #dedede solid 2upx;
    	text-align: center;
    	font-size: 28upx;
      color: #666666;
    }
    .active{
      display: inline-block;
      border-bottom:  #109DEA solid 4upx;
      height: 91upx;
      color: #109dea;
      line-height: 91upx;
    }
  }    
  .newsList{
    height: calc(100% - 95upx);
    padding-top: 16upx;
    background: #f5f5f5;
    .newsBody{
      background: white;
      padding: 0 20upx;
      .news{
        height: 120upx;
        position: relative;
        display: flex;
        flex-direction: row;
        .icon{
          color: #00bdfd;
          font-size: 45upx;
          width: 20upx;
          margin: auto;
        }
        .newsBt{
          width: 540upx;
          margin-left: 20upx;
          align-self:center;
          color:#333333;
          font-size: 28upx;
          flex-shrink: 2;
          -webkit-line-clamp:2;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          overflow:hidden;
          text-overflow: ellipsis;
        }
        .newsDate{
          width: 60upx;
          color: #999999;
          font-size: 26upx;
          height: 20upx;
          line-height: 20upx;
          margin: auto;
        }
      }
      .newsBorder{
        border-top: #d5d4d4 dashed 2upx;
      }
    }
  }
</style>
