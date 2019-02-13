<template>
	<view class="xcdd-select-gzjh child-content">
    <!-- 蒙版 -->
    <view class="xcdd-select-gzjh-mask" @tap="close"></view>
    <!-- 搜索 -->
    <view class="xcdd-select-gzjh-content">
      <kw-search placeholder="请输入随行督学姓名" @confirm="keywordConfirm" ></kw-search>
      <checkbox-group @change="checkboxChange">
        <label class="" v-for="(item, j) in dataList" :key="j" :class="{xcddSelectGzjBorderBottom: j < dataList.length-1}">
          <checkbox :value="item.value" :checked="item.checked" />
          <view class="xcdd-select-gzjh-radio-label">{{item.name}}</view>
        </label>
      </checkbox-group>
      <view class="xcdd-select-gzjh-save" @tap="confirm">
        <button>确定</button>
      </view>
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
        dataList: [
        ],
				// 加载标志
				loadStatus: 'more'
			};
		},
    props:{
      // 默认选中的值 多选所以要传数组
      checkRadio: {
        type: Array,
        default () {
          return [
          ]
        }
      }
    },
    components:{KwSearch,uniLoadMore},
		onLoad() {
			this.loadDataList(true)
    },
    methods:{
			// 数据列表 type => true(全新)/false(增量)
			loadDataList (type) {
				this.page = type ? 1 : this.page
				this.loadStatus = 'loading'
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_group/doDdChoose',
					type: 'POST',
					data: {
						DDJL: 'DDJL',
						page: this.page,
						DXLXM: '',
						U_USERNAME: this.searchKeyword,
						ORG_MC: '',
						EXCEPT: '3'
					},
					vue: this,
					success (data) {
						let datas = data.datas
						this.page ++ 
						if(!datas || datas.length < 1) {
							this.loadStatus = 'noMore'
						}else{
							let dataList = []
							for(let i = 0;i < datas.length; i++) {
								dataList.push({
									value: datas[i].U_ID,
									name: datas[i].U_USERNAME,
									data: datas[i]
								})
							}
							if (type) {
								this.dataList = dataList
							} else {
								this.dataList = this.dataList.concat(dataList)
							}
							this.loadStatus = 'more'
						}
					}
				})				
			},
			// 加载更多
			loadMore () {
				if(this.loadStatus == 'loadStatus') {
					this.loadDataList(false)
				}
			},
			// 从list中取出对象
			getCheckboxValue (ids) {
				let datas = []
				if(this.dataList.length > 0) {
					for(let j = 0; j< ids.length; j++) {
						for(let i = 0; i<this.dataList.length; i++) {
							if(ids[j] == this.dataList[i].value ) {
								datas.push(this.dataList[i])
								break
							}
						}
					}
				}
				return datas
			},
      // 选择时进行改变
      checkboxChange(e) {
        this.checkRadio = e.detail.value;
				this.$emit("change",{
				  data: this.getCheckboxValue(this.checkRadio)
				})
      },
      // 点击确定
      confirm(){
				// this.checkRadio = e.detail.value;
				this.$emit("confirm",{
				  data: this.getCheckboxValue(this.checkRadio)
				})
      },
      // 点击蒙版(取消用的)
      close(){
        this.$emit("close")
      },
			// 关键字输入
			keywordConfirm (e) {
				this.searchKeyword = e.value
				this.loadDataList(true)
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
