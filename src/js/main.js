import $ from 'jquery';
import countDown from 'ui/countDown.js'
import {ajax} from 'core/utils.js'
import {template} from 'core/handlebars.js'
import remodal from 'ui/remodal.js';
import calculation from 'ui/calculation.js';
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
  this.proAllIds = [];
  this.proIds = {};
  this.init();
}
mainPage.prototype = {
  init() {
    var inst = $('[data-remodal-id]').remodal();
    this.getCategory();
    this.getBanner();
    this.getBtBanner();
    this.getHotId();
    $(document).on('opened', '[data-remodal-id]', function () {
      new calculation();
    });
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
  gethotcat(proIds) {
    var proIds = {};
    var _this = this;
    ajax({
      url: '/api/hotcat.html',
      dataType: 'json',
      success(res) {
        const _data = res.data || [];
        let strs = '';
        const result = _data.map((item) => {
          item.productIds = _this.proIds[item.id];
          return item;
        })
        $('#productRecommended').html(template($('#hot-items-template').html(), {data: result}));
        _this.getItems(_this.proAllIds.join(','));
      }
    })
  },
  getHotId() {
    let proIds = {};
    let _this = this;
    ajax({
      url: '/api/hotid.html',
      dataType: 'json',
      success(res) {
        const _data = res.data;
        if (_data) {
          _this.proAllIds = _data.map((item) => {
            if (!_this.proIds[item.type_id]) _this.proIds[item.type_id] = [];
            _this.proIds[item.type_id].push(item.product_id);
            return item.product_id;
          })
        }
        _this.gethotcat(proIds)
      }
    })
  },
  getItems(itemIds, callback) {
    ajax({
      url: '/spider/api/',
      dataType: 'json',
      type: 'post',
      data: {
        op: '001019',
        item: itemIds
      },
      success(res) {
        $.each(res.data, (item) => {
          $(`#productRecommended [data-id=${item.item_id}]`).html(
            template($('#item-template').html(), item)
          )
        })
        $('[data-countdown]').countdown();
        callback && callback()
      }
    })
  }
};
new mainPage();
