<template>
	<view>
  <!-- 这是备份-->
		<kw-editor></kw-editor>
	</view>
</template>

<script>
	import KwEditor from "@kwz/kw-ui/kw-editor.vue"
	export default {
		data() {
			return {
        contentId: '',
				news: {
        },
        newsContent: [
          {
            content: '',
            image: false,
            imageUrl: ''
          }
        ]
			};
		},
		components:{
			KwEditor
		},
    methods:{
    }
	}
</script>

<style lang="scss">
  .news{
    padding: 20upx;
    background: white;
  }
  .head{
    .title{
      font-size: 38upx;
      font-weight: 900;
    }
    .time{
      color: #999999;
      font-size: 24upx;
    }
    .time-title{
      margin-left: 5px;
    }
  }
  .main-text{
    margin-top: 20upx;
    text-indent: 56upx;
  }
</style>
