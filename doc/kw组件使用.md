### kw-login 登录页

* 引用：

  在 `script` 中引用组件

```javascript
import KwLogin from "@dcloudio/kw-ui/kw-login.vue"
export default {
    components: {KwLogin}
}
```

* 		用法

```html
<kw-login @closeLogin="closeLogin" @login="login" @toggerVcode="toggerVcode"></kw-login>
```

* 		事件：

|  事件名称   |      说明      |                   返回参数                   |
| :---------: | :------------: | :------------------------------------------: |
|    login    |  点击登录按钮  | {userName:用户名,passWord:密码,vcode:验证码} |
| toggerVcode | 点击验证码图片 |                      -                       |
| closeLogin  |  点击关闭图标  |                      -                       |

#### kw-list-cell列表单元

- 引用：

  在 `script` 中引用组件

```javascript
import KwLoginCell from "@dcloudio/kw-ui/kw-list-cell.vue"
export default {
    components: {KwLoginCell}
}
```

- 用法

  ```html
  <kw-login-cell title="退出" :redDot="true" :border="{bottom:false}"
            thumb="../../static/images/icons/close.png"></kw-login-cell>
  ```

- 属性：

|  属性名称  |  类型   |           默认值           |                             说明                             |
| :--------: | :-----: | :------------------------: | :----------------------------------------------------------: |
|   title    | String  |             -              |                             标题                             |
|    note    | String  |             -              |                        描述(标题下方)                        |
| right-note | String  |             -              |                        描述(列表右方)                        |
| extraIcon  | Object  |             -              | 左侧扩展图标{color:'#fff',type: 'spinner'}，参考 [Iocn 图标](https://ext.dcloud.net.cn/plugin?id=28) |
|   thumb    | String  |             -              |    左侧缩略图在(图片链接),若thumb有值，则不会显示扩展图标    |
|  red-dot   | Boolean |           false            |                          右侧小红点                          |
|  isArrow   | Boolean |            true            |                          右侧灰箭头                          |
|   border   | Object  | {top : false,bottom: true} |                上下边框{bottom:true,top:true}                |
|    link    | String  |             -              |            链接,加此属性点击组件会跳转到对应路由             |


- 事件：

| 事件名称 |   说明   | 返回参数 |
| :------: | :------: | :------: |
|  click   | 点击组件 |    -     |

- 插槽：

|   名称    |                         说明                          |
| :-------: | :---------------------------------------------------: |
| 默认插槽  | 中间(标题，描述)不能与title，note，right-note属性同用 |
| rightNote |      列表右方描述位置，不能与right-note属性同用       |

#### kw-search

- 引用：

  在 `script` 中引用组件

```javascript
import KwSearch from "@dcloudio/kw-ui/kw-search.vue"
export default {
    components: {KwSearch}
}
```

- 用法

  ```html
  <kw-Search value="好" placeholder="请输入学校"></kw-Search>
  ```

- 属性：

|  属性名称   |  类型  | 默认值 |     说明     |
| :---------: | :----: | :----: | :----------: |
|    value    | String |   -    |   搜索框值   |
| placeholder | String | 请输入 | 搜索框占位符 |

- 事件：

| 事件名称 |   说明   |       返回参数       |
| :------: | :------: | :------------------: |
|  cancel  | 点击取消 |          -           |
| confirm  | 点击确定 | {value:'搜索框的值'} |

- 插槽：

|   名称   |           说明           |
| :------: | :----------------------: |
| 默认插槽 | 搜索框下面，确定按钮上面 |

#### kw-alert-input

- 引用：

  在 `script` 中引用组件

```javascript
import KwAlertInput from "@dcloudio/kw-ui/kw-alert-input.vue"
export default {
    components: {KwAlertInput}
}
```

- 用法

  ```html
  <kw-alert-input :input-list="inputList" @confirm="confirmAlert" @close="alertinputShow=false"></kw-alert-input>
  <kw-alert-input :check-list="checkList" :isCheck="true"></kw-alert-input>
  <kw-alert-input :textarea-list="textareaList" :isTextarea="true"></kw-alert-input>
  ```

- 属性：

|   属性名称   |  类型   |             默认值             |                       说明                        |
| :----------: | :-----: | :----------------------------: | :-----------------------------------------------: |
|  inputList   | Object  | {value:"请输入",info:"请输入"} | 输入框数据(value==输入框的值，info==下方提示信息) |
|   isCheck    | Boolean |             false              |                  是否单项选择器                   |
|  checkList   | Object  |  {value:"22",label:"选择一"}   | 选择器值(value==选择项的id，label==选择项的文字)  |
|  checkRadio  | String  |               1                |    选择器事先选中的值（对应checkList的value）     |
|  isTextarea  | Boolean |             false              |                    是否文本域                     |
| textareaList | Object  | {value:"请输入",info:"请输入"} |     文本域值(value==输入框的值，info==占位符)     |

- 事件：

| 事件名称 |   说明   |       返回参数       |
| :------: | :------: | :------------------: |
|  cancel  | 点击取消 |          -           |
| confirm  | 点击确定 | if(input){ return value:'输入框的值'} else if(isCheck){ return value:'选择项的id'} else(isTextarea){ return value:'文本域的值'}|

