var $ = require('jquery');
var Paging = require('ui/paging.js');
var p = new Paging();
p.init({target:'#pageBox',pagesize:10,count:100,toolbar:true});