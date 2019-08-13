import {xxteaEncrypt64, xxteaDecrypt64} from '../xxtea/xxtea.js'
import Vue from 'vue'

const $products = require('./products.json');

const hasFunc = (comonProductsTree = [], userReadPro = []) => {
	let commonMenu = []
	if(comonProductsTree.length > 0) {
		let workspace = $products.workspace;
		
		if(typeof userReadPro == 'string') {
			userReadPro = userReadPro.split(',')
		}
		for(let i = 0; i< comonProductsTree.length ;i++){
			for(let j = 0; j< workspace.length;j++){
				if(comonProductsTree[i].PRO_ID == workspace[j].proId) {
					let childrenFun = workspace[j].children;
					let comonChildrenFun = comonProductsTree[i].children;
					for(let m = 0; m< childrenFun.length ;m++){
						for(let n = 0; n< comonChildrenFun.length;n++){
							if(childrenFun[m].funId == comonChildrenFun[n].FUN_ID
							 && userReadPro.length > 0) {
								 for(let k = 0; k<userReadPro.length; k++) {
									 if(userReadPro[k] == comonChildrenFun[n].PRO_ID) {
										 comonChildrenFun[n].THUMB = childrenFun[m].icon;
										 comonChildrenFun[n].PRO_MC = childrenFun[m].funMc || comonChildrenFun[n].PRO_MC;
										 comonChildrenFun[n].LINK = childrenFun[m].link;
										 commonMenu.push(comonChildrenFun[n]);
										 break;
									 }
								 }
							}
						}
					}
				}
			}
		}
		
	}
	return commonMenu;
}

const extend = (...args) => {
   let length = args.length;
  
  if(length < 1 ) {
    return {}
  } else if(length <2 ){
    return typeof args[0] === 'object' ? args[0] : {};
  } else {
    let arg1 = args.pop();
    let arg2 = args.pop();
    
    arg1 = typeof(arg1) === 'object' ? arg1 : {};
    arg2 = typeof(arg2) === 'object' ? arg2 : {};
    
    for(let i in arg1) {
      arg2[i] = arg1[i]
    }
    
    return extend(...args, arg2)
  }
}

const kwz = {
	// baseUrl: 'http://www.dd.com:8080/', // 本地
	baseUrl: 'https://app.qgjydd.cn', // 广东省 高新网
  // baseVisit: '/visitlg',  //访问的后缀  龙岗
  // sessionName: 'JSESSIONID', // 本地
  sessionName: 'KSESSIONID1', // 广东 高新 龙岗  
	dev: false, // 开发者模式
	token: '', // token
	jc_isencode: '', // 链接是否编码
	jc_isencrypt: '', // 链接参数是否加密
	sessionId: '',
	// 获取本地缓存的sessionId
	getSessionId () {
		if (!kwz.sessionId) {
			kwz.sessionId = uni.getStorageSync('_sessionid')
		}
		return kwz.sessionId;
	},
	// 将sessionId存到storage中
  setSessionId (sessionId = '') {
		kwz.sessionId = sessionId;
		uni.setStorage({
			key: '_sessionid',
			data: sessionId
		})
	},
  ajax: {
		formatParam(op) {
			if(!op.realUrl) {
				op.realUrl = op.url
			}
			op.url = kwz.ajax.url(op.realUrl)
			// token处理
			if (kwz.token) {
				// data.token = kwz.token
				op.url += op.url.indexOf('?') > 0 ? ('&token=' + kwz.token) : ('?token=' + kwz.token)
			}
			// 参数加密处理
			let data = op.data ? kwz.handleData(op.data) : {}
			// 默认get请求
			op.type = op.type ? op.type.toUpperCase() : 'GET'
			op.data = data
			return op
		},
		ajaxInited: false,
		// ajax
		ajax(op) {
			// 如果ajax还未初始化完成,延迟500ms执行
			if (!kwz.ajax.ajaxInited) {
				setTimeout(() => {
					kwz.ajax.ajaxUrl.apply(this, [op])
				}, 500)
			} else {	
				if (op && op.url) {
					op = kwz.ajax.formatParam(op)
			    
			    let header = extend(op.header || {}, {
			      //#ifdef MP-WEIXIN
						'Cookie': kwz.sessionName + '='+kwz.getSessionId(),
			      //#endif
						'Content-type': 'application/x-www-form-urlencoded'
					})
					// 显示加载效果
					kwz.loadding.show()
					// 返回requestTask可以执行abort方法中断ajax请求
					uni.request({
						url: op.url,
						data: op.data,
						method: op.type,
						header,
						// dataType: 'JSON',
						success (response) {
			        kwz.setCookies(response)
							kwz.ajax.ajaxThen.apply(this, [response, op])
						},
						fail (error) {
							kwz.ajax.ajaxCatch.apply(this, [error, op])
						},
						complete (info) {
			        kwz.setCookies(info)
							if (!info || info.statusCode != 200) {
								kwz.ajax.ajaxCatch.apply(this, [info, op])
							}
							kwz.loadding.hide()
							// kwz.setCookies(info)
						}
					});
				}
			}
		},
		// 执行ajax处理
		ajaxUrl(op) {
			let sc = op.success
			let then = op.then
			delete op.then
			op.success = (data) => {
				if('200' == data.statusCode) {
					if(typeof sc == 'function'){
						sc.apply(op.vue || this, [data])
					}
					if (typeof(then) === 'function') {
						then.apply(op.vue || this, [data])
					}	
				}
			}
			kwz.ajax.ajax(op)
		},
		ajaxThen(response, op, cb) {
			if (200 == response.statusCode && response.data) {
				// 设置sessionId
				kwz.setCookies(response)
				if(response.data.statusCode != '200' && response.data.msg && response.state != 'SUCCESS' ){
					kwz.alert(response.data.msg)
				}
				if (typeof(op.then) === 'function') {
					if (response.data) {
						op.then.apply(op.vue || this, [response.data])
					// 为了兼容editor上传
					} else {
						op.then.apply(op.vue || this, [response])
					}
				}
				cb = cb || op.success
				if (typeof(cb) === 'function') {
					if (response.data) {
						cb.apply(op.vue || this, [response.data])
					// 为了兼容editor上传
					} else {
						cb.apply(op.vue || this, [response])
					}
				}
			}
		},
		ajaxCatch(error, op) {
			// 未登录
			if(error) {
        if(error.statusCode == 402) {
          kwz.logout(true)
        } else if(error.statusCode == 403) {
          kwz.alert('暂无权限进行此项操作')
        } else if(error.statusCode == 401) {
          if(!op.tokenTimes || op.tokenTimes < 5) {
            op.tokenTimes = op.tokenTimes ? (op.tokenTimes + 1) : 1
            kwz.initVisit(()=>{
              kwz.ajax.ajaxUrl(op)
            })
          }
        }
			}
			let errorFlag = true
			if (typeof(op.catch) === 'function') {
				op.catch.apply(op.vue || this, [error])
				errorFlag = false
			}
			if (typeof(op.error) === 'function') {
				op.error.apply(op.vue || this, [error])
				errorFlag = false
			}
			if (errorFlag) {
				console.error(error)
			}
		},
		url(url = '') {
			if(!url.startsWith('http')) {
				url = url.startsWith('/') ? url : ('/' + url);
				url = kwz.dev ? ('api' + url) : url,
				url = kwz.baseUrl + url
			}
			return url
		},
		loadSource (url, cb, vue) {
			url = kwz.ajax.url(url)
			//#ifdef H5
			if(typeof(cb) === 'function'){
				cb.apply(vue || this, [url])
			}
			//#endif
			//#ifndef H5
			uni.downloadFile({
				url,
				header: {
          //#ifdef MP-WEIXIN
          Cookie: kwz.sessionName+'='+kwz.getSessionId(),
          //#endif 
        },
				success (data) {
					if(typeof(cb) === 'function') {
						cb.apply(vue || this, [data.tempFilePath, data])
					}
				},
				fail (data) {
					kwz.msg('加载资源失败')
				}
			})
			//#endif
		}
	},
	// 参数处理
	handleData(data) {
		if (kwz.jc_isencode === 'Y') {
			data = kwz.kwbms(data)
			if (kwz.jc_isencrypt === 'Y') {
				data = kwz.kwfilters(kwz.kwencrypts(data))
			}
		}
		return data
	},
	// 编码==》解决部分中文或字符乱码的问题
	kwbms(data) {
		if (data && typeof(data) === 'object') {
			for (var i in data) {
				data[i] = kwz.kwbm(data[i])
			}
		}
		return data
	},
  // 具体编码方法
	kwbm(str) {
		if (kwz.jc_isencode === 'Y' && str) {
			let regStr = '([^\u0000-\u007F^\u0080-\u00FF]|\u00b7|\u44e3)'
			let reg = new RegExp(regStr, 'gm')
			str = str.toString().replace(reg, (a) => {
				return '&#' + a.charCodeAt(0) + ';'
			})
		}
		return str
	},
	kwfilters(data) {
		if (data && typeof(data) === 'object') {
			for (var i in data) {
				data[i] = kwz.kwfilter(data[i])
			}
		}
		return data
	},
	kwfilter(str) {
		if (str) {
			str = str.replace(/\+/g, '_abc123')
				.replace(/-/g, '_def456')
				.replace(/=/g, '_ghi789')
				.replace(/\//g, '_jkl098')
				.replace(/\*/g, '_mno765')
		}
		return str
	},
	kwencrypts(data) {
		if (data && typeof(data) === 'object') {
			for (var i in data) {
				data[i] = kwz.kwencrypt(data[i])
			}
		}
		return data
	},
	kwencrypt(data) {
		if (kwz.jc_isencrypt === 'Y' && kwz.token && data) {
			data = xxteaEncrypt64(data, kwz.token)
		}
		return data
	},
	// 初始化访问 进入项目第一步就是拿sessionId(tomcat生成的),拿到id后就是拿token id会过期,过期会又会执行一次获取id和token的操作
	initVisit(cb) {
    let url = kwz.baseVisit || 'visit.jsp';
		uni.request({
			url: kwz.ajax.url(url),
			method: 'GET',
			header: {
        //#ifdef MP-WEIXIN
        Cookie: kwz.sessionName + '='+kwz.getSessionId(), // 微信不会自动在请求头加这个cookie关键字,需要我们手动在请求头加这个关键字 后台会检测id,如果为空,就返回新id
        //#endif
      },
			success (data) {
        kwz.setCookies(data)
        // 根据sessionId拿token
				if (data && data.statusCode == 200) {
					kwz.initToken(cb)
				}
			},
			complete (data) {
				kwz.setCookies(data)
			}
		});
	},
  // 初始化token
  initToken(cb = () => {}, vue) {
  	kwz.ajax.ajaxInited = false
  	uni.request({
  		url: kwz.ajax.url('open/loadConfig'),
  		method: 'POST',
  		header: {
        //#ifdef MP-WEIXIN
        Cookie: kwz.sessionName + '=' + kwz.getSessionId(),
        //#endif
      },
  		success (data) {
        kwz.setCookies(data)
  			if (data && 200 == data.statusCode && '200' == data.data.statusCode) {
  				let datas = data.data.datas;
  				kwz.jc_isencode = datas.jc_isencode;
  				kwz.jc_isencrypt = datas.jc_isencrypt;
  				kwz.token = datas.token;
  			
  				cb.apply(vue || this)
  			}
  			kwz.ajax.ajaxInited = true;
  		},
  		complete (data) {
  			kwz.setCookies(data)
  		}
  	});
  
  },
	// 将sessionId设置到stroage中
  setCookies(data) {
    // 将cookies从data中拿出来
		if (data) {
			let cookies ;
			if(data.cookies) {
				cookies = data.cookies
			} else if (data.header && data.header['Set-Cookie']) {
				cookies = []
				let setCookies = data.header['Set-Cookie'].split(';')
				for(let i = 0; i < setCookies.length; i++) {
					let c = setCookies[i].split("=")
					cookies.push({
						name: c[0],
						value: c[1]
					})
				}
			}
      // 将sessionId从cookies中拿出来，存到stroage中去
			if (cookies && cookies.length > 0) {
				for(var i = 0; i < cookies.length; i++){
          // 微信开发工具04090版这个name为undefined,需手动把id从字符串拿出来
					// if(cookies[i].name == kwz.sessionName) { 
					// 	kwz.setSessionId(cookies[i].value);
					// 	break;
					// }
          // 安卓手动从字符串中截取sessionId ios cookies[i]是个对象
          if (typeof cookies[i] == "string"){
            let aCok = cookies[i].split(";")
            for(var j = 0; j < aCok.length; j++){
              let aCokId = aCok[j].split("=")
              if(aCokId[0] == kwz.sessionName){
                kwz.setSessionId(aCokId[1]);
                break;
              }
            }
          } else{
            kwz.setSessionId(cookies[i].value);
            break;
          }
          
				}
			}
		}
	},
	// 弹窗提示 参数：提示文字,callback
	alert(msg='',cb = () => {}){
		kwz.msg({
			title: msg,
			icon: 'none',
			duration: 2000,
			success: cb
		})
	},
	// 确认弹框
	confirm(msg='', sb = () => {}, eb= () => {}, op = {}){
		op.title = op.title || '提示';
		op.content = msg;
		op.success = (res) => {
			if(res.confirm) {
				sb.apply(this)
			}else if(res.cancel){
				eb.apply(this)
			}
		}; 
		// op.fail = eb;
		uni.showModal(op)
	},
  // 显示消息提示框
	msg(op) {
		uni.showToast(op)
	},
	// loadding
	loadding: {
		show (msg='') {
			uni.showLoading({
				title: msg
			})
		},
		hide () {
			uni.hideLoading();
		}
	},
	// 判断是否登陆
	isLogin () {
		return 'success' == uni.getStorageSync('_login');
	},
	// 判断是否有权限
	hasAuth (url = '') {
		if (url) {
			let commonMenus = kwz.getCommonMenus();
			if(commonMenus) {
				if(!commonMenus.writePathList) {
					commonMenus.writePathList = commonMenus.writePath.split(',')
				}
				let length = commonMenus.writePathList.length
				url = url.trim()
				console.log(url)
				for(let i = 0; i < length; i++) {
					if(commonMenus.writePathList[i] == url || (commonMenus.writePathList[i] && commonMenus.writePathList[i].trim() == url)) {
						return true
					}
				}
			}
		}
		return false
	},
	// 根据权限获取工作区的产品
	getProducts () {
		let commonMenus = kwz.getCommonMenus();
		let retMenus = [];
		if(commonMenus && commonMenus._menus_ && commonMenus._menus_.children){
			// 产品树
			let menus = hasFunc(commonMenus._menus_.children, commonMenus.readPro);
			retMenus.push(...menus)
		}
		return retMenus;
	},
	commonMenus : null,
	setCommonMenus (common){
		kwz.commonMenus = common;
		uni.setStorage({
			key: '_commonMenus', 
			data: JSON.stringify(kwz.commonMenus),
		});
	},
	getCommonMenus () {
		if(!kwz.commonMenus || kwz.commonMenus.length < 1 ){
			try{
				kwz.commonMenus = JSON.parse(uni.getStorageSync('_commonMenus'));
			}catch(e){
			}
		}
		return kwz.commonMenus;
	},
	loginMills: null,
	getLoginMills () {
		if(!kwz.loginMills) {
			kwz.loginMills = uni.getStorageSync('_login_mills');
		}
		return kwz.loginMills;
	},
	loginUser: null,
	setLoginUser (datas) {
		if(datas ) {
			kwz.loginUser = datas;
			uni.setStorage({
				key: '_loginuser', 
				data: JSON.stringify(kwz.loginUser),
			});
		}
	},
	getLoginUser () {
		if(!kwz.loginUser ){
			try{
				kwz.loginUser= JSON.parse(uni.getStorageSync('_loginuser'));
			}catch(e){
			}
		}
		return kwz.loginUser;
	},
	// 加载后端产品
	loadProducts (cb = () => {}, vue) {
		kwz.ajax.ajaxUrl({
			url: 'open/loadMenus',
			type: 'POST',
			vue,
			then (response) {
				kwz.setCommonMenus(response.datas);
				cb.apply(this);
			}
		})
	},
	// 加载用户信息
	loadLoginUser (cb = () => {}, vue) {
		kwz.ajax.ajaxUrl({
			url: 'open/loadInfos',
			type: 'POST',
			vue,
			then (response) {
				kwz.setLoginUser(response.datas);
				cb.apply(this);
			}
		})
	},
  htmlPattern: /((<[^>]+>)|(&nbsp;))/g,
	// 去掉所有html标签
	slitHtmlTag (html = '') {
		return html.replace(kwz.htmlPattern, '').trim()
	},
	splitAttachHtml (html = '') {
		let content = []
		let i = 0;
		if(html){
			let flag = true
			html.replace(/(i?)<a.*?href="?(.*?\.(docx|doc|xlsx|xls|txt|pdf))"?.*?>(.*?)<\/a>/gim, (img, $1, $2, $3, $4, index) => {
				flag = false
			  content.push({
			    attach: true,
			    attachUrl: kwz.ajax.url($2),
					attachName: $4,
					realUrl: $2
			  });
			  i = index + img.length;
			})
		}
		return content
	},
  splitHtml (html = '') {
    let content = []
    let i = 0;
    if(html){
			let flag = true
      html.replace(/(i?)<img.*?src="?(.*?\.(jpg|gif|bmp|bnp|png))"?.*?\/?>/gim, (img, $1, $2, $3, index) => {
				flag = false
        content.push({
          content: kwz.slitHtmlTag(html.substr(i, index)),
          image: true,
          imageUrl: kwz.ajax.url($2),
					realUrl: $2
        });
        i = index + img.length;
      })
			if(flag) {
				content.push({
					content: kwz.slitHtmlTag(html)
				})
			}
      return content
    }
  },
  clearLogin (flag) {
    uni.removeStorage({key: '_login'});
    uni.removeStorage({key: '_login_milles'});
    uni.removeStorage({key: '_loginuser'});
    uni.removeStorage({key: '_commonMenus'});
    
    //#ifdef H5
    kwz.alert('登陆已经过期，请重新登陆')
		kwz.reLaunch({
			url: '/pages/my/my.vue'
		})
    //#endif
    //#ifndef H5
		if(flag) {
			kwz.autoLogin()
		}
    //#endif
  },
  logout (flag) {
    uni.removeStorage({key: '_login_token'});
		kwz.clearLogin(flag);
  },
  loginToken: '',
  getLoginToken () {
    if(!kwz.loginToken) {
      kwz.loginToken = uni.getStorageSync('_login_token')
    }
    return kwz.loginToken;
  },
  setLoginToken (loginToken = '') {
    kwz.loginToken = loginToken
    uni.setStorage({
    	key: '_login_token',
      data: loginToken
    })
  },
  // 自动登陆 从本地缓存中拿出_login_token，
  autoLogin (cb = () => {}, vue) {
    let loginToken = kwz.getLoginToken();
    // let _loginToken = uni.getStorageSync('_lk')
    let data = { loginToken }
    kwz.ajax.ajaxUrl({
    	url: 'login/open/loginToken',
      header: {
        '_wx': Math.random() * 100000000
      },
      data,
    	type: 'POST',
    	then (data) {
          if (data.statusCode == '200' && data.datas.state == 200){
            let _loginToken = data.datas._token;
						if(_loginToken) {
							kwz.setLoginToken(_loginToken)
						}
						kwz.loadLoginUser(()=>{
						  kwz.loadProducts(() => {
								cb.apply(vue || this, [data])
							})
						})
          } else {
						if(data.datas.msg) {
							kwz.alert(data.datas.msg, () => {
								uni.switchTab({url: '/pages/my/my'})
								// kwz.router({url: '/pages/my/my'})
							})
						}
					}
    	}
    })
  },
  // 缓存代码
  dms: null,
  setDms (dm) {
    kwz.dms = extend(kwz.dms || {}, dm)
    uni.setStorage({
    	key: '_dms',
      data: JSON.stringify(kwz.dms)
    })
  },
  getDms (dm, cb, vue) {
    let dms = {}
    let unLoadDmKey = []
    let needDmKey = dm.split(',')
    if (!kwz.dms) {
      let localDmsStr = uni.getStorageSync('_dms')
      kwz.dms = localDmsStr ? JSON.parse(localDmsStr) : {}
    }
    for(let i = 0;i < needDmKey.length;i++) {
      let dmKey = needDmKey[i]
      if(kwz.dms[dmKey]) {
        dms[dmKey] = kwz.dms[dmKey]
      }else {
        unLoadDmKey.push(dmKey)
      }
    }
    if (unLoadDmKey.length < 1) {
      cb.apply(vue || this, [dms])
    } else {
      kwz.ajax.ajaxUrl({
        url: 'jc_dmtab/open/selectDmmxData',
        type: 'POST',
        data: {
          DM_CODES: unLoadDmKey.join(',')
        },
        vue,
        success (data) {
          if(data.statusCode == '200') {
            let dmsData = data.datas;
            if (dms) {
              let dmStore = {};
              for (let i in dmsData) {
                dmStore[i] = dmsData[i]
                dms[i] == dmsData[i]
              }
              kwz.setDms(dmStore)
            }
            cb.apply(vue || this, [dms])
          }
        }
      })
    }
  },
  // 加载代码
  loadVueDms (dm = '', cb = () => {}, vue) {
    kwz.getDms(dm, cb, vue)
  },
  // 深拷贝
  deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = kwz.deepCopy(obj[key]);   //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  },
	// 从本地上传图片：imageOp.success 中返回值决定是否上传当前文件
  uploadImage (imageOp = {}, uploadOp = {}, vue) {
		let imageSuccess = imageOp.success;
		imageOp.count = imageOp.count > 0 ? imageOp.count : 1;
		imageOp.fail = () => {
			// kwz.alert('选取文件失败')
		}
		imageOp.success = (tempFilePaths) => {
			let isUpload = true;
			if(typeof imageSuccess == 'function' ){
				isUpload = imageSuccess.apply(vue || this, tempFilePaths.tempFiles)
			}
			if(isUpload) {
				let uploadData = uploadOp.data
				uploadOp = kwz.ajax.formatParam(uploadOp);
				let uploadOpSuccess = uploadOp.success;
				let uploadSuccess = (response) => {
					if (typeof uploadOpSuccess == 'function') {
						if (typeof response == 'string') {
							try{
								response = JSON.parse(response)
							}catch(e){
							}
						}
						uploadOpSuccess.apply(vue || this, [response, tempFilePaths])
					}
				}
				uploadOp.success = (response) => {
					kwz.ajax.ajaxThen.apply(vue || this, [response, uploadOp, uploadSuccess])
				}
				let uploadFail = uploadOp.fail
				uploadOp.fail = (response) => {
					kwz.ajax.ajaxCatch.apply(vue || this, [response, uploadOp, uploadFail])
				}
				uploadOp.formData = uploadData || {}
				delete uploadOp.data
				uploadOp.name = 'file'
				uploadOp.header = extend(uploadOp.header || {}, {
           //#ifdef MP-WEIXIN
					'Cookie': kwz.sessionName + '='+kwz.getSessionId(),
           //#endif
				})
				for(let i = 0;i < tempFilePaths.tempFilePaths.length; i++) {
					uploadOp.filePath = tempFilePaths.tempFilePaths[0]
					uni.uploadFile(uploadOp)
				}
			}
		}
		uni.chooseImage(imageOp);
  },
	// 关闭当前页面栈,跳转
	redirect (op = {}) {
		uni.redirectTo(op)
	},
	// 关闭所有页面栈，打开页面
	reLaunch (op = {}) {
		uni.reLaunch(op)
	},
	// 不关闭当前页面栈,跳转
	router (op = {}) {
		uni.navigateTo(op)
	},
  // 返回上一页面栈 参数: 延迟时间(ms)
	back (miils = 0) {
		if(!miils || miils <= 0) {
			uni.navigateBack({
				delta: 1
			})
		}else{
			setTimeout(()=>{
				uni.navigateBack({
					delta: 1
				})
			},miils)
		}
	},
	// 日期格式化 参数:{日期格式,传入的时间} 参数默认:{yyyy-MM-dd格式,当前时间(月份传的时候要-1 想要12月传11进来)}
  formatDate (fmt = 'yyyy-MM-dd', DefalutDate = new Date()) {
    let date = new Date(DefalutDate)
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  // 返回当天为基准的指定日期 参数：{y,M,d},日期格式 M大写是因为后台传来的是大写M
  getLimdat (impose, format) {
    if(typeof impose !=="object"){
      impose = JSON.parse(impose)
    }
    
    let _y = parseInt(impose.y)
    let _m = parseInt(impose.M)
    let _d = parseInt(impose.d)
    let date = new Date(Date.parse(new Date((new Date().getFullYear() + _y), (new Date().getMonth()) + _m, new Date().getDate())) + (86400000 * _d))
    date = kwz.formatDate(format, date)
    return date
  },
  // 返回功能限制的日期参数 功能id
  dateImpose(url){
    let data = JSON.parse(uni.getStorageSync('_commonMenus'));
    if(data){
//       kwz.loadMenus(kwz.dateImpose,Vue)
//     }else{
      for (let arrs of data._menus_.children) { // arrs代表每个应用
        for (let arr of arrs.children) { // arr代表应用中的每个功能
          if (arr.PRO_ID === url) {
            if (typeof arr.PRO_ATTRS === 'object') { // 没配限制日期返回null,给他加默认前后1年
              arr.PRO_ATTRS = {
                minDate: '{"y":"-1","M":"0","d":"0"}',
                maxDate: '{"y":"1","M":"0","d":"0"}'
              }
              return arr.PRO_ATTRS
            }
            let proAttrs = JSON.parse(arr.PRO_ATTRS)
            proAttrs.minDate = typeof proAttrs.minDate === 'undefined' ? '{"y":"-1","M":"0","d":"0"}' : proAttrs.minDate
            proAttrs.maxDate = typeof proAttrs.maxDate === 'undefined' ? '{"y":"1","M":"0","d":"0"}' : proAttrs.maxDate
            return proAttrs
          }
        }
      }
    }
		return '';
  },
  // 数组对象去重 参数：传入一个数组
  uniq(arr){
    var result = [];
    var obj = {};
    for(var i =0; i<arr.length; i++){
       if(!obj[arr[i].XQ_XN]){
          result.push(arr[i]);
          obj[arr[i].XQ_XN] = true;
       }
   }
   return result
  },
	// 下载文件
	downloadAttach (url, cb=()=>{}, vue) {
		uni.downloadFile({
			url,
			header:{
				//#ifdef MP-WEIXIN
				'Cookie': kwz.sessionName + '='+kwz.getSessionId(),
				//#endif
			},
			success(res) {
				if(res.statusCode == 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success(savedFilePath) {
							if(typeof cb == 'function') {
								cb.apply(vue || this, savedFilePath)
							}
						}
					})
				} else {
					kwz.alert(res.statusCode + '-加载文件失败')
				}
			},
			fail() {
				kwz.alert('加载文件失败')
			}
		})
	},
	loginWxMiniProgram () {
		//#ifndef H5
		uni.login({
			provider: 'weixin',
			success: function (res) {
				console.log('login')
				console.log(res);
			}
		});
		uni.checkSession({
			success: function (res) {
				console.log('check session')
				console.log(res);
			}
		})
// 		uni.getUserInfo({
// 			provider:"weixin",
// 			success (res) {
// 				console.log('get user info')
// 				console.log(res)
// 			}
// 		})
		//#endif
	}
}

kwz.initVisit()

kwz.loginWxMiniProgram()

export default kwz;
