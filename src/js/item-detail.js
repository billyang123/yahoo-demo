var $ = require('jquery');
var detailPicShow = require('ui/detailPicShow.js');
import {ajax, URLPARAM, priceInc} from 'core/utils.js';
import {tempToHtml} from 'core/handlebars.js'
//import detailPicShow from 'ui/detailPicShow.js'
var remodal = require('ui/remodal.js');

var showproduct = {
	"boxid":"showbox",
	"sumid":"showsum",
	"boxw":355,//宽度,该版本中请把宽高填写成一样
	"boxh":278,//高度,该版本中请把宽高填写成一样
	"sumw":62,//列表每个宽度,该版本中请把宽高填写成一样
	"sumh":62,//列表每个高度,该版本中请把宽高填写成一样
	"sumi":10,//列表间隔
	"sums":4,//列表显示个数
	"sumsel":"sel",
	"sumborder":1,//列表边框，没有边框填写0，边框在css中修改
	"lastid":"showlast",
	"nextid":"shownext"
};//参数定义
detailPicShow(showproduct);

var inst = $('[data-remodal-id]').remodal();


var itemDetail = function(){
	console.log(URLPARAM);
	this.itemId = URLPARAM.id || 'r235736015';
	this.init();
}
itemDetail.prototype = {
	init() {
		this.getDetail();
	},
	getPriceInc(price) {
		let inc = 0;
		for (var p in priceInc) {
			const curpc = priceInc[p];
			if (curpc[1] < 0) {
				inc = p;
				break;
			} else if (price > curpcp[0] && price > curpcp[1]) {
				inc = p;
				break;
			} else {
				continue;
			}
		}
		return inc;
	},
	getDetail() {
		tempToHtml('#itemDetail', '#itemDetailTemplate', {title: 'asdasdasd',bid:{bid_price: 1123},currency_unit: 'rmb'})
		ajax({
				url: '/spider/api/',
				data: {
					op: '001008',
					item: this.itemId
				},
				type: 'post',
				success(res) {
						res.priceInc = priceInc
						tempToHtml('#itemDetail', '#itemDetailTemplate', res)
						console.log(res);
				}
		})
	}
};
new itemDetail();
//inst.open();
