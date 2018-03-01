var $ = require('jquery');
var Paging = require('ui/paging.js');
var countDown = require('ui/countDown.js');

import {ajax} from 'core/utils.js'


$('[data-countdown]').countdown();
var p = new Paging();
p.init({target:'#pageBox',pagesize:10,count:100,toolbar:true});


var searchPage = function() {
  this.init();
}
searchPage.prototype = {
  init() {
    console.log(ajax);
    ajax({
      url: '/api/category.html',
      dataType: 'json',
      success(res) {
        console.log(res);
      }
    })
  }
};
new searchPage()
