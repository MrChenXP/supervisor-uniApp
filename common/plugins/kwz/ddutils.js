import kwz from './kwz.uni'

const formatRater = (html, sj = {}) => {
	let content = []
	let flag = true
	let i = 0
	html.replace(/(i?)<rate\-yo.*?name="?(.*?)"?.*?\/?>/gim, (rater, $1, $2, index) => {
		let name =''
		rater.replace(/name="?([A-Za-z0-9]*)"?/, (str ,$1) =>{
			name = $1;
		})
		let contentHtml = kwz.slitHtmlTag(html.substr(i, index))
		if(contentHtml) {
			content.push({
					type: 'text',
					content: contentHtml
			})
		}
		if (name) {
			let type = ''
			rater.replace(/type="?([A-Za-z0-9]*)"?/, (str ,$1) => {
				type = $1
			})
			let rel = ''
			if (type) {
				rater.replace(/rel="?([A-Za-z0-9\-]*)"?/, (str ,$1) => {
					rel = $1
				})
			}
			let value = (sj && sj[name]) ? sj[name] : 0;
			// content.push(kwz.slitHtmlTag(rater))
			content.push({
				type: 'rater',
				name,
				rtype: type,
				rel,
				value: (sj[name] || 0)
			})
		}
		flag = false
	});
	if(flag) {
		let contentHtml = kwz.slitHtmlTag(html)
		content.push({
			type: 'text',
			content: contentHtml
		})
	}
	return content
}

// <rate-yo name="test" type="avg" rel="xm1-xm2-xm3-xm4-xm5-xm6-xm7-xm8-xm9-xm10" />
const ddutils = {
	// format 督导评估模板
	formatDdpgMb (html, sj) {
		let content = []
		let splitHtml = html.split('</td>')
		for(let i = 0; i<splitHtml.length; i++ ) {
			let sHtml = splitHtml[i]
			let sHtmlArray = sHtml.split('</p>')
			for (let j = 0; j<sHtmlArray.length; j++) {
				content.push(...formatRater(sHtmlArray[j], sj))
			}
		}
		return content
	}
}

export default ddutils;