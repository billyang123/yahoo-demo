import $ from 'jquery';
import countDown from 'ui/countDown.js'
import {ajax} from 'core/utils.js'
import {template} from 'core/handlebars.js'


window.$  = window.jQuery = $;
function slideFn() {
    /** Main Slider **/
    var timer;
    var box = $('#PromoSlide');
    var slideCount = box.find('.slide-text li').length;
    var currSlide = $('.slide-text li').filter('.curr').index();
    var nextSlide = currSlide + 1;
    var fadeSpeed = 800;
    $('.slide-text li').css({
      width: 100/slideCount +'%'
    })
    //Start slides timer functions
    function startTimer() {
        timer = setInterval(function () {
            box.find('.slide-item').eq(currSlide).fadeOut(fadeSpeed,function(){
              box.find('.slide-item').eq(nextSlide).addClass('curr').fadeIn(fadeSpeed);
              currSlide = nextSlide;
              nextSlide = currSlide + 1 < slideCount ? currSlide + 1 : 0;
            });
            box.find('.slide-item, .slide-text li').removeClass('curr');
            $('.slide-text li').eq(nextSlide).addClass('curr');

        }, 6000);
    }
    $('.slide-text li').click(function () {
        clearInterval(timer);
        startTimer();
        currSlide = $('.slide-text li').index(this);
        nextSlide = currSlide + 1 < slideCount ? currSlide + 1 : 0;;
        box.find('.slide-item').fadeOut(fadeSpeed, function(){
          box.find('.slide-item').eq($('.slide-text li').index(this)).addClass('curr').fadeIn(fadeSpeed);
        });
        box.find('.slide-item, .slide-text li').removeClass('curr');
        $(this).addClass('curr');
    });
    startTimer();
}
function yahooService() {
  var ySBox = $('#yahooService');
  var lisLink = ySBox.find('.service-bd a');
  var ysLBox = ySBox.find('.service-float');
  var ysLItem = ySBox.find('.service-float-item');
  lisLink.mouseenter(function() {
    lisLink.removeClass('hover')
    var index = lisLink.index(this);
    ysLItem.hide();
    lisLink.eq(index).addClass('hover');
    ysLItem.eq(index).show();
    ysLBox.fadeIn(100);
  })
  ySBox.mouseleave(function() {
    lisLink.removeClass('hover')
    ysLBox.fadeOut(100);
  })
}

var mainPage = function() {
  this.init();
}
mainPage.prototype = {
  init() {
    this.getCategory();
    this.getBanner();
    this.getBtBanner();
    this.getItems('c642230331')
  },
  getCategory() {
    ajax({
      url: '/api/category.html',
      dataType: 'json',
      success(res) {
        $('#yahooService').html(template($('#yahooService-template').html(), res));
        yahooService();
      }
    })
  },
  getBanner() {
    ajax({
      url: '/api/banner/c/9.html',
      dataType: 'json',
      success(res) {
        const _html = template($('#yahooPromo-template').html(), res);
        console.log($('#yahooPromo-template').html(), res, _html);
        $('#PromoSlide').html(template($('#yahooPromo-template').html(), res));
        slideFn();
      }
    })
  },
  getBtBanner() {
    ajax({
      url: '/api/banner/c/10.html',
      dataType: 'json',
      success(res) {
        const strs = res.data.map((item) => {
          return `<li><a href="${item.url}"><img src="http://jp.freedaigou.cn/Uploads/pic/ad/${item.img}" alt="${item.title}"></a></li>`
        })
        $('#sellerRecommended ul').html(strs.join(''))
      }
    })
  },
  getItems(itemIds) {
    ajax({
      url: '/spider/api/',
      dataType: 'json',
      type: 'post',
      data: {
        op: '001019',
        item: itemIds
      },
      success(res) {

        console.log(res)
        $('#itemList ul').html(template($('#itemList-template').html(), res));
        $('[data-countdown]').countdown();
      }
    })
  }
};
new mainPage();
