var detailPicShow = require('ui/detailPicShow.js');

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
