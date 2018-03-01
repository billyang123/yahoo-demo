var $ = require('jquery');
var config = require('./config.js');
var getEnv = function() {
	if (window.location.protocol == 'file:') {
		return 'file'
	} else {
		var local = ['http://127.0.0.1/', 'localhost'];
		if (local.indexOf(window.location.origin)) {
			return 'local'
		} else {
			return 'publish'
		}
	}
}
var doParams = function(data) {
	var result = {};
	for(var key in  data) {
		if (data[key] == '' || typeof(data[key]) == 'undefined' || data[key] == null) {
			continue;
		}
		result[key] = data[key];
	}
	return result;
}
var env = getEnv();
var _ajax = function(options, isfilter) {
	var _setting = $.extend({},options,{
		complete:function(XMLHttpRequest, textStatus) {
			options.complete && options.complete(XMLHttpRequest, textStatus)
		},
		success:function(res) {
			options.success && options.success(res);
		}
	})
	console.log(_setting)
	return $.ajax(_setting);
}
var _getApi = function(api) {
	if (typeof(api) == 'string') {
		return api;
	}
	if (api instanceof Array) {

		if (env == 'local' || env == 'file') {
			return api[0]
		} else {
			return api[1]
		}
	} else {
		return api;
	}

}
var _getUrlParam = function(name, url) {
	var rUl = '',r = null,resJson = {};
	if (!url) {
		rUl = window.location.search.substr(1);
	} else {
		rUl = url.split('?')[1]
	}
	if (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		r = rUl.match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	} else {
		var arrStr = rUl.split('&');
		for (var i = 0, len = arrStr.length; i < len; i++) {
			var str = arrStr[i];
			var _arr = str.split('=');
			if (!_arr[0]) continue;
			resJson[_arr[0]] = _arr[1];
		}
		return resJson
	}
}
var _setUrlParam = function(obj, url) {
	var curParams = _getUrlParam(false, url);
   	var newParams = $.extend({},curParams,obj);
   	var str = $.param(newParams);
   	if (!url) {
   		url = window.location.href;
   	}
   	var ors = url.split('?')[0];
	if (ors) {
		return ors + '?' + str;
	} else {
		return url + '?' + str;
	}
}
var utils = {
	getUrlParam: _getUrlParam,
	setUrlParam: _setUrlParam,
	api: config.api,
	env: env,
	doParams: doParams,
	ajax: _ajax,
	getApi: _getApi
}

module.exports = utils
