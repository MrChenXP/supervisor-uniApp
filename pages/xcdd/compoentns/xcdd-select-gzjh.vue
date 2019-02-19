<template>
  <!-- 工作计划选择页面 -->
	<view class="xcdd-select-gzjh child-content">
    <!-- 蒙版 -->
    <view class="xcdd-select-gzjh-mask" @tap="close"></view>
    <!-- 搜索 -->
    <view class="xcdd-select-gzjh-content">
      <kw-search placeholder="请输入学校名称" @confirm="keywordConfirm" ></kw-search>
      <checkbox-group @change="radioChange">
        <label class="" v-for="(item, j) in loadDataList" :key="j" :class="{xcddSelectGzjBorderBottom: j < loadDataList.length-1}">
          <radio :value="item.value" />
          <view class="xcdd-select-gzjh-radio-label">{{item.name}}</view>
        </label>
      </checkbox-group>
			<view @tap="loadMore">
				<uni-load-more :status="loadStatus" :content-text="{contentrefresh: '点击加载更多',contentnomore: '加载中...', contentdown: '已无更多数据'}"></uni-load-more>
			</view>
      <!-- <view class="xcdd-select-gzjh-save" @tap="confirm">
        <button>确定</button>
      </view> -->
    </view>
	</view>
</template>

<script>
  import KwSearch from "@kwz/kw-ui/kw-search.vue"
	import uniLoadMore from "@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
        // 搜索学校用的关键字
        searchKeyword: "",
				page: 1,
        // 学校列表
        loadDataList:[
        ],
				// 加载标志
				loadStatus: 'more'
			}
		},
    props:{
      // 默认选中的值 多选所以要传数组
      checkRadio: {
        type: Object,
        default () {
          return [
          ]
        }
      }
    },
    components:{KwSearch,uniLoadMore},
    onLoad() {
			this.loadGzjh(true)
    },
    methods:{
			// 加载工作计划 type => true(全新)/false(增量)
			loadGzjh (type) {
				this.page = type ? 1 : this.page
				this.loadStatus = 'loading'
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_gzap/doList/DDGZAP',
					type: 'POST',
					data: {
						page: this.page,
						SEARCH_TEXT: this.searchKeyword
					},
					vue: this,
					success (data) {
						let datas = data.datas
						this.page ++ 
						if(!datas || datas.length < 1) {
							this.loadStatus = 'noMore'
						}else{
							let loadDataList = []
							for(let i = 0;i < datas.length; i++) {
								loadDataList.push({
									value: datas[i].CONTENT_ID,
									name: `${datas[i].XXMC}/${datas[i].YWSJ}/${datas[i].SD === '1' ? '上午' : '下午'}/${datas[i].AUTHOR}`,
									data: datas[i]
								})
							}
							if (type) {
								this.loadDataList = loadDataList
							} else {
								this.loadDataList = this.loadDataList.concat(loadDataList)
							}
							this.loadStatus = 'more'
						}
					}
				})				
			},
			// 加载更多
			loadMore () {
				if(this.loadStatus == 'loadStatus') {
					this.loadGzjh(false)
				}
			},
			// 从list中取出对象
			getRadioValue (id) {
				if(this.loadDataList.length > 0) {
					for(let i = 0; i<this.loadDataList.length; i++) {
						if(id == this.loadDataList[i].value ) {
							return this.loadDataList[i]
						}
					}
				}
				return {}
			},
      // 选择时进行改变
      radioChange(e) {
        this.checkRadio = e.detail.value;
				this.$emit("confirm",{
				  data: this.getRadioValue(this.checkRadio)
				})
      },
      // 点击确定
//       confirm(){
//       },
      // 点击蒙版(取消用的)
      close(){
        this.$emit("close")
      },
			// 关键字输入
			keywordConfirm (e) {
				this.searchKeyword = e.value
				this.loadGzjh(true)
			}
    }
	}
</script>

<style lang="scss">
  .xcdd-select-gzjh{
    position: fixed;
    top:44upx;
    left: 0;
    width: 750upx;
    padding: 20upx;
    z-index: 1001;
    background: none;
    height: calc(100vh - 44px);
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
    label{
      display: inline-block;
      background: white;
      width: 100%;
      padding: 20upx !important;
      position: relative;
      box-sizing: border-box;
    }
    checkbox-group{
      max-height: calc(100% - 235upx);
      overflow: auto;
    }
    .kw-search,.kw-search-body{
      border-radius:10upx 10upx 0 0;
    }
  }
  .xcdd-select-gzjh-mask{
    z-index: auto;
    position: fixed;
    // background: rgba(0, 0, 0, 0.5);
    height: calc(100vh - 44px);
    width: 100%;
    top: 44px;
    left: 0;
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
  }
  .xcdd-select-gzjh-content{
    z-index: 1001;
    margin: auto;
    width: 100%;
    background: white;
    height: 100%;
    box-shadow: 0 0 15upx 5upx darkgray;
    padding-bottom: 20upx;
    border-radius: 10upx;
  }
  .xcdd-select-gzjh-radio-label{
    text-align: right;
    position: absolute;
    right: 20upx;
    top:20upx;
  }
  .xcddSelectGzjBorderBottom::after{
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    transform: scaleY(.5);
    background-color: #c8c7cc;  
    margin:0 20upx;
  }
  .xcdd-select-gzjh-save{
    width: 670upx;
    height: 85upx;
    border-radius: 42.5upx;
    border: solid 1upx #e1e1e1;
    margin: 0 20upx;
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
