import {xxteaEncrypt64, xxteaDecrypt64} from '../xxtea/xxtea.js'
import Vue from 'vue'

const $products = require('./products.json');

const hasFunc = (comonProductsTree = {}) => {
	let commonMenu = []
	if(comonProductsTree.length > 0) {
		let workspace = $products.workspace;
		
		for(let i = 0; i< comonProductsTree.length ;i++){
			for(let j = 0; j< workspace.length;j++){
				if(comonProductsTree[i].PRO_ID == workspace[j].proId) {
					let childrenFun = workspace[j].children;
					let comonChildrenFun = comonProductsTree[i].children;
					for(let m = 0; m< childrenFun.length ;m++){
						for(let n = 0; n< comonChildrenFun.length;n++){
							if(childrenFun[m].funId == comonChildrenFun[n].FUN_ID) {
								comonChildrenFun[n].THUMB = childrenFun[m].icon;
								comonChildrenFun[n].PRO_MC = childrenFun[m].funMc || comonChildrenFun[n].PRO_MC;
								comonChildrenFun[n].LINK = childrenFun[m].link;
								commonMenu.push(comonChildrenFun[n]);
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
	baseUrl: 'http://192.168.8.35:8080/',
	dev: false, // 开发者模式
	token: '', // token
	jc_isencode: '', // 链接是否编码
	jc_isencrypt: '', // 链接参数是否加密
	sessionId: '',
	sessionName: 'JSESSIONID',
	// 获取本地缓存的sessionId
	getSessionId () {
		if (!kwz.sessionId) {
			kwz.sessionId = uni.getStorageSync('_sessionid')
		}
		return kwz.sessionId;
	},
	setSessionId (sessionId = '') {
		kwz.sessionId = sessionId;
		uni.setStorage({
			key: '_sessionid',
			data: sessionId
		})
	},
	ajax: {
		formatParam(op) {
			// 参数加密处理
			let data = op.data ? kwz.handleData(op.data) : {}
			// 默认get请求
			op.type = op.type ? op.type.toUpperCase() : 'GET'
			// token处理
			if (kwz.token) {
				// data.token = kwz.token
				op.url += op.url.indexOf('?') > 0 ? ('&token=' + kwz.token) : ('?token=' + kwz.token)
			}
			op.url = kwz.ajax.url(op.url)
			op.data = data
			return op
		},
		ajaxInited: false,
		// 执行ajax处理
		ajaxUrl(op) {
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
		ajaxThen(response, op, cb) {
			if (200 == response.statusCode && response.data) {
				// 设置sessionId
				kwz.setCookies(response)
				
				if(response.data.statusCode != '200' && response.data.msg){
					kwz.alert(response.data.msg)
				} else {
					if (typeof(op.then) === 'function') {
						op.then.apply(op.vue || this, [response.data])
					}
					cb = cb || op.success
					if (typeof(cb) === 'function') {
						cb.apply(op.vue || this, [response.data])
					}
				}
			}
		},
		ajaxCatch(error, op) {
			// 未登录
			if(error) {
        if(error.statusCode == 402) {
          kwz.logout(op.vue)
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
			url = url.startsWith('/') ? url : ('/' + url);
			return kwz.baseUrl + (kwz.dev ? 'api' + url : url)
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
	// 初始化访问
	initVisit(cb) {
		uni.request({
			url: kwz.ajax.url('visit.jsp'),
			method: 'GET',
			header: {
        //#ifdef MP-WEIXIN
        Cookie: kwz.sessionName + '='+kwz.getSessionId(),
        //#endif
      },
			success (data) {
        kwz.setCookies(data)
				if (data && data.statusCode == 200) {
					kwz.initToken(cb)
				}
			},
			complete (data) {
				kwz.setCookies(data)
			}
		});
	},
	setCookies(data) {
		if (data && data.cookies){
			let cookies = data.cookies;
			if(cookies && cookies.length > 0) {
				let length = cookies.length;
				for(var i = 0; i< length;i++){
					if(cookies[i].name == kwz.sessionName) {
						kwz.setSessionId(cookies[i].value);
						break;
					}
				}
			}
		}
	},
	// 弹窗提示
	alert(msg=''){
		kwz.msg({
			title: msg,
			icon: 'none',
			duration: 5000
		})
	},
	// 确认框
	confirm(msg='', sb = () => {}, eb= () => {}, op = {}){
		op.title = op.title || '提示';
		op.content = msg;
		op.success = sb;
		op.fail = eb;
		uni.showModal(op)
	},
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
	},
	// 根据权限获取工作区的产品
	getProducts () {
		let commonMenus = kwz.getCommonMenus();
		let retMenus = [];
		if(commonMenus && commonMenus._menus_ && commonMenus._menus_.children){
			// 产品树
			let menus = hasFunc(commonMenus._menus_.children);
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
  htmlPattern: /<[^>]+>/g,
  splitHtml (html = '') {
    let content = []
    let i = 0;
    if(html){
      html.replace(/(i?)<img.*? src="?(.*?\.(jpg|gif|bmp|bnp|png))"?.*?\/>/gim, (img, $1, $2, $3, index) => {
        content.push({
          content: html.substr(i, index).replace(kwz.htmlPattern,''),
          image: true,
          imageUrl: kwz.ajax.url($2)
        });
        i = index + img.length;
      })
      return content
    }
  },
  clearLogin (vue) {
    uni.removeStorage({key: '_login'});
    uni.removeStorage({key: '_login_milles'});
    uni.removeStorage({key: '_loginuser'});
    uni.removeStorage({key: '_commonMenus'});
    
    //#ifdef H5
    kwz.alert('登陆已经过期，请重新登陆')
    // 退回首页
    uni.navigateBack({
        delta: -1
    });
    if(vue && vue instanceof Vue) {
      vue.loginShow = true
    }
    //#endif
    //#ifndef H5
    kwz.autoLogin()
    //#endif
  },
  logout (vue) {
    kwz.clearLogin(vue);
    uni.removeStorage({key: '_login_token'});
    if(vue && vue instanceof Vue) {
      vue.loginShow = true
    }
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
  // 自动登陆
  autoLogin (cb = () => {}, vue) {
    let loginToken = kwz.getLoginToken();
    let _loginToken = uni.getStorageSync('_lk')
    let data = {
      _loginToken
    }
    kwz.ajax.ajaxUrl({
    	url: 'login/open/loginToken',
      header: {
        '_wx': Math.random() * 100000000
      },
      data,
    	type: 'POST',
    	then (data) {
          if (data.statusCode == '200'){
            let loginToken = data.datas._token;
            uni.setStorage({
            	key: '_lk',
              data: loginToken
            });
            cb.apply(vue || this, [data])
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
	// 从本地上传图片：imageOp.success 中返回值决定是否上传当前文件
  uploadImage (imageOp = {}, uploadOp = {}, vue) {
		let imageSuccess = imageOp.success;
		imageOp.count = imageOp.count > 0 ? imageOp.count : 1;
		imageOp.fail = () => {
			kwz.alert('选取文件失败')
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
						uploadOpSuccess.apply(vue || this, [response])
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
	// 不关闭当前页面栈,跳转
	router (op = {}) {
		uni.navigateTo(op)
	},
	// 日期格式化 日期格式 传入的时间 默认:yyyy-MM-dd格式/当前时间(月份传的时候要-1 想要12月传11进来)
  formatDate (fmt = 'yyyy-MM-dd', date = new Date()) {
    date = new Date(date)
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
  }
}

kwz.initVisit()

export default kwz;
