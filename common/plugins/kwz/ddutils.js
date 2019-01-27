import kwz from './kwz.uni'

const formatRater = (html) => {
	let content = []
	let i = 0
	html.replace(/(i?)<rate\-yo.*?name="?(.*?)"?.*?\/?>/gim, (rater, $1, $2, index) => {
		let name ='';
		console.log(rater)
		console.log(kwz.slitHtmlTag(html.substr(i, index)))
		// content.push(kwz.slitHtmlTag(rater))
		content.push({
			type: 'text',
			content: kwz.slitHtmlTag(html.substr(i, index))
		})
		content.push({
			type: 'rater',
			name: 'xm1'
		})
	});
	return content
}

// <rate-yo name="test" type="avg" rel="xm1-xm2-xm3-xm4-xm5-xm6-xm7-xm8-xm9-xm10" />
const ddutils = {
	// format 督导评估模板
	formatDdpgMb (html) {
		let content = []
		let splitHtml = html.split('</td>')
		for(let i = 0; i<splitHtml.length; i++ ) {
			let sHtml = splitHtml[i]
			let sHtmlArray = sHtml.split('</p>')
			for (let j = 0; j<sHtmlArray.length; j++) {
				content.push(...formatRater(sHtmlArray[j]))
			}
		}
		return content
	}
}

export default ddutils;