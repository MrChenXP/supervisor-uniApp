<template>
	<view class="xcdd-select-gzjh child-content">
    <!-- 搜索 -->
    <kw-search placeholder="请输入学校名称"></kw-search>
    <checkbox-group @change="checkboxChange">
      <label class="" v-for="(item,j) in SchoolList" :key="j" :class="{xcddSelectGzjBorderBottom: j < SchoolList.length-1}">
        <checkbox :value="item.value" :checked="item.checked" />
        <view class="xcdd-select-gzjh-radio-label">{{item.name}}</view>
      </label>
    </checkbox-group>
    <view class="xcdd-select-gzjh-save">
      <button>确定</button>
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
//       // 事先给默认选中
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
      }
    }
	}
</script>

<style lang="scss">
  .xcdd-select-gzjh{
    position: fixed;
    top:0;
    left: 0;
    width: 750upx;
    background: white;
    z-index: 1001;
    height: 100%;
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
