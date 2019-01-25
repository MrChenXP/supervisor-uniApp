<template>
	<view class="xcdd-select-gzjh child-content">
    <!-- 蒙版 -->
    <view class="xcdd-select-gzjh-mask" @tap="close"></view>
    <!-- 搜索 -->
    <view class="xcdd-select-gzjh-content">
      <kw-search placeholder="请输入学校名称"></kw-search>
      <checkbox-group @change="checkboxChange">
        <label class="" v-for="(item,j) in SchoolList" :key="j" :class="{xcddSelectGzjBorderBottom: j < SchoolList.length-1}">
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
	export default {
		data() {
			return {
        // 搜索学校用的关键字
        searchSchool:"",
        // 学校列表
        SchoolList:[
          {
            value: '11',
            name: '学校名字',
          },{
            value: '22',
            name: '学校名字',
          },{
            value: '33',
            name: '学校名字',
          }
        ]
			};
		},
    props:{
      // 默认选中的值 多选所以要传数组
      checkRadio: {
        type: Object,
        default () {
          return [
            "11","22"
          ]
        }
      }
    },
    components:{KwSearch},
//     onLoad(){
//       // 事先给默认选中 留给专家做
//       for (var i = 0, lenI = SchoolList.length; i < lenI; i++) {
//                 SchoolList[i].checked = false;
//                 for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
//                     if (SchoolList[i].value == values[j]) {
//                         SchoolList[i].checked = true;
//                         break
//                     }
//                 }
//       }
//     },
    methods:{
      // 路由跳转
      goLink(link){
        uni.navigateTo({
          url: link,
        });
      },
      // 选择时进行改变
      checkboxChange(e) {
        this.checkRadio = e.detail.value;
      },
      // 点击确定
      confirm(){
        this.$emit("confirm",{
          checks:"这里返回选中的值 this.checkRadio"
        })
      },
      // 点击蒙版(取消用的)
      close(){
        this.$emit("close")
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
