// ==UserScript==
// @name        bili_fix_player
// @namespace   bili
// @description 修复B站播放器,黑科技,列表页、搜索页弹窗,破乐视限制,提供高清、低清晰源下载,弹幕下载
// @include     /^.*\.bilibili\.(tv|com|cn)\/(video\/|search)?.*$/
// @include     /^.*bilibili\.kankanews\.com\/(video\/|search)?.*$/
// @version     3.7.0
// @updateURL   https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player.meta.js
// @downloadURL https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player.user.js
// @require http://static.hdslb.com/js/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       unsafeWindow
// @author     绯色
// ==/UserScript==
/**
出现无法播放情况先关闭自动修复
2014-09-04B站UI升级导致脚本失效，修复为临时版本，因为B站部分列表变成AJAX，脚本给ajax后的内容添加支持比较麻烦，等博主搬砖活干完，谢谢支持
2014-08-15增加专题弹窗，移除对所有播放器都采用打开菜单时将视频移开的功能，需要360浏览器用户自己设置打开此功能
2014-08-01弹窗网页全屏在田生大神帮助下完美解决（chrome无解），同时博主修复视频播放页面的网页全屏
2014-07-26弹窗因为本人技术问题无法完美解决，使用embed标签替换，可以网页全屏，但是关闭弹窗后会导致鼠标滚轮无效使用iframe标签无滚轮bug，但是因为跨域了，导致无法网页全屏
2014-07-23修复多数BUG
2014-07-20修复小BUG，增加评论区移除和谐娘功能 当出现[此楼层已被用户隐藏 点击查看]时，自动展开，需要到脚本设置页面设置
2014-07-13你造吗？您可以使用一个海外的代理并将http://interface.bilibili.com/playurl?*作为代理规则加入到代理列表中j即可弹窗播放爱奇艺视频（来自田生大神）
					修复弹窗播放时，点击B站FLASH播放器后，若直接点击关闭弹窗，会造成鼠标滚轮无效的问题
					修复360浏览器在脚本设置的时候，被视频君挡住无法设置的问题，方案是（设置的时候先让视频君去火星，设置后再放回来）
2014-06-30按照田生大神建议，增加与其脚本匹配id,在弹窗标题增加打开播放页面的按钮，补充，发现BUG，在弹窗播放时，点击B站FLASH播放器后，若直接点击关闭弹窗，会造成鼠标滚轮无效的问题，这BUG作者暂时无修复方法
					并且使用了田生大神分支里面的弹窗播放器支持网页全屏功能，感谢
2014-06-21修复搜索页面因为作者正则匹配错误（B站把域名换成com但在a标签还是tv域名，坑爹）的问题
2014-06-18修复B站更换域名的BUG，在田生大神的建议下，将所有api域名换成com，弹窗播放器增加收藏按钮
2014-06-08修复小部分bug(样式冲突、弹窗冲突)
2014-06-03增强弹窗播放器，[拖动窗口标题可移动播放器，拖动右下角可改变播放器大小，设置后自动保存宽高和位置]
2014-05-25感谢吧友lzgptdgj提供BUG，在小型播放器下，屏蔽规则会无效的问题，已经修复
2014-05-14增加首页弹窗播放，基本实现全站可弹窗（首页新番专题列表除外等）
2014-05-13增加搜索页面的弹窗播放，并且支持多P和显示当前P，增加模糊画质下载按钮
2014-05-11还是基佬要求，增加弹窗播放器分P效果，增加弹幕下载功能，在吧友大神田生的建议下，正则表达式加强匹配
2014-05-10收益于自己的B站追番计划(http://v.myacg.ga或者http://weiyun.jd-app.com)，代码逻辑重构(不再区分视频源再解析视频)，并重写UI
2014-05-10受诸多基佬要求，增加除首页外其他分类页面的弹窗播放(初衷是为了弹窗乐视源)
2014-03-28增加下载视频按钮
2014-01-23替换优酷、爱奇艺、搜狐为B站播放器
2013-12-14修复B站播放器无法在火狐魔镜弹窗播放
------------以下信息提供给开发者-----------
//https://static-s.bilibili.tv/play.swf---新版播放器
//http://static.hdslb.com/play.swf---旧版播放器
//https://static-s.bilibili.tv/play_old.swf---考古级别播放器
//使用https连接的播放器可以获得屏蔽列表
-------------------------------------------
*/
(function() {
	//初始化 init
	if (GM_getValue('auto') == undefined) GM_setValue('auto', 1);
	if (GM_getValue('player_size') == undefined) GM_setValue('player_size', 1);
	if (GM_getValue('pagebox_display')== undefined) GM_setValue('pagebox_display', 0);
	if (GM_getValue('pagebox_harm')== undefined) GM_setValue('pagebox_harm', 0);
	if (GM_getValue('init360')== undefined) GM_setValue('init360', 0);
	//if (GM_getValue('player_container')== undefined) GM_setValue('player_container', 1);//弹窗播放器的标签容器（iframe/embed）已经完美解决
	//初始化播放器宽高
	if (GM_getValue('player_width') == undefined) GM_setValue('player_width', 950);
	if (GM_getValue('player_height') == undefined) GM_setValue('player_height', 482);
	//初始化播放器外框位置
	//if (GM_getValue('div_top') == undefined) GM_setValue('div_top', 100);//设置垂直位置的时候，如果是长页而且是浮动播放器时候记录位置，会导致播放器不知所踪
	if (GM_getValue('div_left') == undefined) GM_setValue('div_left', 100);
	//初始化jquery支持
	//var $ = unsafeWindow.$;
	/**
-------------------------------用户界面GUI View-------------------------------------
*/
	//函数，插入可视化操作视图

	function insert_html(type) {
		var auto = GM_getValue('auto') ? '已打开' : '已关闭';
		var player_size = GM_getValue('player_size') ? '大型' : '小型';
		var display=GM_getValue('pagebox_display') ? '悬浮' : '默认';
		var harm=GM_getValue('pagebox_harm') ? '和谐娘打酱油中' : '默认[和谐娘和谐中]';
		var init360=GM_getValue('init360') ? '已打开' : '已关闭';
		//var container=GM_getValue('player_container')?'iframe[无滚动条bug]':'embed[无拖放bug]';
		var div = '<div ><a style="color:red" id="bili-fix-player-installed" class="i-link">脚本</a>\
						<ul class="i_num i_num_a blborder" id="bili_fix_script">\
						<li><a>360浏览器兼容[非360勿开]:<bl id="init360" class="bfpbtn">' + init360 + '</bl></a><em></em></li>\
						<li><a target="_blank" href="http://bilili.ml/361.html">若无限小电视则尝试关闭修复-BUG反馈</a><em></em></li>\
						<li><a>本页视频源:<bl style="color:#F489AD">' + type + '</bl></a><em></em></li>\
						<li><a class="font">高清视频下载</a><div class="m_num" id="av_source">\
						</div><em></em></li>\
						<li><a class="font" target="_blank" id="aid_down_av">单文件[模糊]视频下载</a><em></em></li>\
						<li><a id="down_cid_xml" target="_blank">弹幕下载</a><em></em></li>\
						<li><a>自动修复(修改后请刷新页面):<bl id="bili_fix" class="bfpbtn">' + auto + '</bl></a><em></em></li>\
						<li><a class="font">播放器大小(小型在火狐弹窗无BUG):<bl id="player_size" class="bfpbtn">' + player_size + '</bl></a><em></em></li>\
						<li><a>评论区分页导航:<bl id="pagebox-display" class="bfpbtn">' + display + '</bl></a><em></em></li>\
						<li><a>评论区和谐娘:<bl id="pagebox-harm" class="bfpbtn">' + harm + '</bl></a><em></em></li>\
						<li><a id="bili_set_status">就绪中→_→</a><em></em></li>\
						</ul>\
						<span class="addnew_5">+10086</span></div>';
		//$('li.m-i:nth-child(1) > a:nth-child(1)').html(div);
		$('li.m-i:nth-child(1) > a:nth-child(1)').prop('outerHTML',div);
		//$('li.m-i:nth-child(1) > a:nth-child(1)').html(div);
		//监听修复按钮
		var bfpbtn = document.querySelector("#bili_fix");
		bfpbtn.addEventListener("click", set_auto, false);
		//监听播放器大小按钮
		var bfpbtn = document.querySelector("#player_size");
		bfpbtn.addEventListener("click", set_player, false);
		//监听评论分页功能显示切换
		var bfpbtn = document.querySelector("#pagebox-display");
		bfpbtn.addEventListener("click", change_pagebox_display, false);
		//监听评论和谐娘功能切换
		var bfpbtn = document.querySelector("#pagebox-harm");
		bfpbtn.addEventListener("click", change_pagebox_harm, false);		
		//360火星
		var bfpbtn = document.querySelector("#init360");
		bfpbtn.addEventListener("click", init_the_special, false);	
	}

	//函数，插入下载按钮

	function insert_download_button(url, count) {
		$('#av_source').append('<a href="' + url + '" target="blank">分段【' + count + '】</a>');
	}

	//设置参数
	//修复按钮事件

	function set_auto() {
		GM_getValue('auto') ? GM_setValue('auto', 0) : GM_setValue('auto', 1);
		var s = GM_getValue('auto') ? '已打开' : '已关闭';
		document.getElementById('bili_fix').innerHTML = s;
		$("#bili_fix").toggleClass("active");
		$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
	}
	//播放器大小按钮事件

	function set_player() {
		GM_getValue('player_size') ? GM_setValue('player_size', 0) : GM_setValue('player_size', 1);
		var s = GM_getValue('player_size') ? '大型' : '小型';
		document.getElementById('player_size').innerHTML = s;
		$("#player_size").toggleClass("active");
		$('#bili_set_status').html('<bl class="bfpbtn active font">已更改,刷新生效_(:3」∠)_</bl>');
	}
	
	//函数 评论分页功能显示切换（悬浮、原来位置）
	function change_pagebox_display(){
		GM_getValue('pagebox_display') ? GM_setValue('pagebox_display', 0) : GM_setValue('pagebox_display', 1);
		var s = GM_getValue('pagebox_display') ? '悬浮' : '默认';
		document.getElementById('pagebox-display').innerHTML = s;
		$("#pagebox-display").toggleClass("active");
		$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
	}
	
	//函数 评论和谐娘功能切换
	function change_pagebox_harm(){
		GM_getValue('pagebox_harm') ? GM_setValue('pagebox_harm', 0) : GM_setValue('pagebox_harm', 1);
		var s = GM_getValue('pagebox_harm') ?  '和谐娘打酱油中' : '默认[和谐娘和谐中]';
		document.getElementById('pagebox-harm').innerHTML = s;
		$("#pagebox-harm").toggleClass("active");
		$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
	}
	//函数 360兼容
	function init_the_special(){
		GM_getValue('init360') ? GM_setValue('init360', 0) : GM_setValue('init360', 1);
		var s = GM_getValue('init360') ?  '已打开,请刷新' : '已关闭，请刷新';
		document.getElementById('init360').innerHTML = s;
		$("#init360").toggleClass("active");
		$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
	}
	/**
-------------------------------函数 Model-------------------------------------
*/
	//函数，替换播放器

	function Replace_player(aid, cid) {
		if (GM_getValue('auto') == '1') {

			if (GM_getValue('player_size') == '1') {
				document.getElementById('bofqi').innerHTML = '<embed id="bofqi_embed" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&amp;aid=' + aid + '" src="https://static-s.bilibili.com/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window">';
				//document.getElementById('bofqi').innerHTML = '<iframe class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="482" width="950"></iframe><img src="https://secure.bilibili.com/images/grey.gif" id="img_ErrCheck" style="display:none"><script type="text/javascript" src="http://static.hdslb.com/js/page.player_error.js"></script> ';
			} else {
				document.getElementById('bofqi').innerHTML = '<embed id="bofqi_embed" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&amp;aid=' + aid + '" src="https://static-s.bilibili.com/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" style="width:100%;height:100%">';
				$('#bofqi').css({width:"960px",height:"520px"});
			}
		}
	}
	//api获取cid

	function api_get_cid(aid, page) {
		var url = 'http://api.bilibili.com/view?type=json&appkey=0a99fa1d87fdd38c&batch=1&id=' + aid;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var Content = eval('(' + responseDetails.responseText + ')');
					var list = Content.list;
					var p = page - 1;
					if (list != undefined) {
						var lp = (list[p] == undefined) ? list[0] : list[p]; //针对某些aid只有一个cid但是有分P的情况
						//console.log(lp);
						var cid = lp.cid;
						var type = lp.type;
						insert_html(type); //UI
						//修复360浏览器flash霸占脚本设置区域
						if(GM_getValue('init360') ==1){
						$("#bili_fix_script,#bili-fix-player-installed").mouseover(function(){
						$("#bofqi,#bofqi_embed").addClass("hide");
						});
						$("#bili_fix_script,#bili-fix-player-installed").mouseout(function(){
						$("#bofqi,#bofqi_embed").removeClass("hide");
						});
						}
						var cid_xml_url = 'http://comment.bilibili.com/' + cid + '.xml';
						$('#down_cid_xml').attr('href', cid_xml_url); //弹幕下载
						Replace_player(aid, cid); //替换播放器 
						cid_get_videodown_hd(cid); //获取高清下载链接
						aid_down_av(aid, page); //av画质下载（单文件）
					} else {
						window_player_init(); //执行弹窗函数
						reload_spajax_function();//专题专题ajax点击后重新渲染
					}
				}
			}
		});
	}
	//专题弹窗函数重写
	function reload_spajax_function(){
			var spid=unsafeWindow.spid;
			var nocache=unsafeWindow.nocache;
			var lastPage=unsafeWindow.lastPage;
			unsafeWindow.loadSpPage=function (f, h, e) {
			$("#sp_order > a").removeClass("on");
			$("#sp_order_" + h).addClass("on");
			curorder = h;
			f = "/sppage/" + f + "-" + h + "-" + spid + "-" + e + ".html" + (nocache ? "?r=" + Math.random() : "");
			if (f != lastPage) {
				lastPage = f;
				$("#tag_video_container > .loading").remove();
				$('<div class="loading"></div>').prependTo("#tag_video_container");
				var g = new Date;
				$.ajax(lastPage, {
					success: function(b) {
						var d = (new Date).getTime() - g.getTime();
						500 > d ? setTimeout(function() {
							$("#tag_video_container").html(b);
							bindPOCoins2($(".v"))
						}, 0 >= 300 - d ? 10 : 300 - d) : $("#tag_video_container").html(b);
						//ajax_zt_video();//专题专题ajax点击后重新渲染
						$('#tag_video_container .t').each(
						function() {
							var href = $(this).parents('a').attr('href');
							var pattern = /\/video\/av(\d+)\//ig;
							var content = pattern.exec(href);
							var aid = content ? (content[1]) : '';
							$(this).prepend('<a class="single_player singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						});
						single_player();
					}
				})
			}
		}

		unsafeWindow.loadBgmPage=function (f, h) {
			$("#season_selector li.on").removeClass("on");
			$("#season_selector li[season_id=" + (void 0 !== h ? h : 0) + "]").addClass("on");
			var e = "/sppage/bangumi-" + spid + "-" + (void 0 !== h ? h + "-" : "") + f + ".html" + (nocache ? "?r=" + Math.random() : "");
			if (e != lastPage) {
				nocache = !1;
				lastPage = e;
				$("#bgm_video_container > .loading").remove();
				$('<div class="loading"></div>').prependTo("#bgm_video_container");
				var g = new Date;
				$.ajax(lastPage, {
					success: function(b) {
						var d = (new Date).getTime() - g.getTime();
						500 > d ? setTimeout(function() {
							$("#bgm_video_container").html(b)
						}, 0 >= 300 - d ? 10 : 300 - d) : $("#bgm_video_container").html(b);
						//ajax_zt_video();//专题专题ajax点击后重新渲染
						$('#bgm_video_container .t').each(
						function() {
							var href = $(this).parents('a').attr('href');
							var pattern = /\/video\/av(\d+)\//ig;
							var content = pattern.exec(href);
							var aid = content ? (content[1]) : '';
							$(this).prepend('<a class="single_player  singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						});
						single_player();
					}
				})
			}
		}
	}
	//播放器支持页面全屏 来自田生
	function fix_player_fullwin() {
		setTimeout(function () {
		// 代码来自 http://static.hdslb.com/js/page.arc.js 为了兼容性目的添加了 .tv 相关域名
		location.href = ['javascript: void(function () {var c;',
		'window.postMessage?(c=function(a){"https://secure.bilibili.com"!=a.origin',
		'&&"https://secure.bilibili.tv"!=a.origin&&"https://ssl.bilibili.com"!=a.origin',
		'&&"https://ssl.bilibili.tv"!=a.origin||"secJS:"!=a.data.substr(0,6)',
		'||eval(a.data.substr(6));',
		'"undefined"!=typeof console&&console.log(a.origin+": "+a.data)},',
		'window.addEventListener?window.addEventListener("message",c,!1):',
		'window.attachEvent&&window.attachEvent("onmessage",c)):',
		'setInterval(function(){if(evalCode=__GetCookie("__secureJS"))',
		'{__SetCookie("__secureJS",""),eval(evalCode)}},1000);',
		'}());'].join('');
		}, 0);
		setTimeout(function () {
		location.href = 'javascript:void(' + function () {
		player_fullwin = function (is_full) {
		$('#window-player,#bofqi,#bofqi_embed').css({
		'position': is_full ? 'fixed' : 'static'
		});
		$('.z, .header, .z_top, .footer').css({
		'display': is_full ? 'none' : 'block'
		});
		}
		} + '());';
		}, 0); 
	};
	//在新番页面，通过弹窗，获取aid,cid然后进行播放
	function aid_build_player(aid) {
		var url = 'http://api.bilibili.com/view?type=json&appkey=0a99fa1d87fdd38c&batch=1&id=' + aid;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var Content = eval('(' + responseDetails.responseText + ')');
					var list = Content.list;
					//默认播放第一个分P-------------------
					var p = 0;
					var lp = (list[p] == undefined) ? list[0] : list[p];
					//console.log(lp);
					var cid = lp.cid;
					$('#player_content').html(window_player(aid, cid));
					//分P列表和播放器------------------------------
					for (var i in list) {
						//console.log(list[i]);
						var cid = list[i].cid;
						var p = parseInt(i) + 1;
						$('#window_play_list').append('<li class="single_play_list" data-field="aid=' + aid + '&cid=' + cid + '"><a  href="javascript:void(0);" style="color:#00A6D8;" >' + p + 'P</a></li>');
					}
					if (!unsafeWindow.player_fullwin) setTimeout(fix_player_fullwin, 0);
					//弹窗的分P播放
					$('.single_play_list').click(
						function() {
							$('#window_play_info').html('正在播放第<span style="color:#F0CF1D">' + $(this).find('a').html() + '</span>');
							var info = $(this).attr('data-field');
							var pattern = /aid=(\d+)&cid=(\d+)/ig;
							var val = pattern.exec(info);
							var aid = val === null ? '' : val[1];
							var cid = val === null ? '' : val[2];
							// console.log(aid,cid);
							setTimeout(function() {
								$('#player_content').html(window_player(aid, cid));
							},0);
						});
				}
			}
		});
	}
	//弹窗播放器

	function window_player(aid, cid) {
		var width = GM_getValue('player_width');
		var height = GM_getValue('player_height');
		return '<iframe  id="window-player" class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="' + height + '" width="' + width + '"></iframe> ';//
	}
	//cid获取高清视频链接

	function cid_get_videodown_hd(cid) {
		var url = 'http://interface.bilibili.com/playurl?appkey=0a99fa1d87fdd38c&platform=android&quality=2&cid=' + cid;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var pattern = /<\/(?:(?:chunk)?size|length)>[\s\n]*?<url><\!\[CDATA\[(.*?)\]\]><\/url>/ig;
					var c = 1;
					while (content = pattern.exec(responseDetails.responseText)) {
						var url = content ? (content[1]) : 'http://interface.bilibili.cn/playurl?appkey=0a99fa1d87fdd38c&platform=android&quality=2&cid=' + cid;
						insert_download_button(url, c);
						c++;
					}
				}
			}
		});
	}
	//低画质视频下载（单文件）

	function aid_down_av(aid, page) {
		var url = 'http://www.bilibili.com/m/html5?aid=' + aid + '&page=' + page;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var Content = eval('(' + responseDetails.responseText + ')');
					var downlink = Content.src;
					$('#aid_down_av').attr('href', downlink);
				}
			}
		});
	}

	/**
-------------------------------控制 Control-------------------------------------
*/

	function window_player_init() {
		//弹窗------------------------------
		//新番列表弹窗UI
		$('.vd_list .title').each(
			function() {
				var href = $(this).attr('href');
				var pattern = /\/video\/av(\d+)\//ig;
				var content = pattern.exec(href);
				var aid = content ? (content[1]) : '';
				$(this).prepend('<a class="single_player singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
			});
		//搜索列表弹窗UI
		$('.result li .r a').each(
			function() {
				var href = $(this).attr('href');
				var pattern = /\/video\/av(\d+)\//ig;
				var content = pattern.exec(href);
				var aid = content ? (content[1]) : '';
				if (aid != '') {
					$(this).find('.t').prepend('<a class="single_player singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
				}
			});
		//带缩略图弹窗UI、和侧栏新投稿弹窗UI、首页的推荐栏弹窗、侧栏列表弹窗UI
		$('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a').each(
			function() {
				var href = $(this).attr('href');
				var pattern = /\/video\/av(\d+)\//ig;
				var content = pattern.exec(href);
				var aid = content ? (content[1]) : '';
				$(this).find('.t').prepend('<a class="single_player singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
			});
		//专题
		$('.vidbox.zt  .t').each(
			function() {
				var href = $(this).parents('a').attr('href');
				var pattern = /\/video\/av(\d+)\//ig;
				var content = pattern.exec(href);
				var aid = content ? (content[1]) : '';
				$(this).prepend('<a class="single_player singleplaybtn" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
			});
		//弹窗初始化
		single_player();
	}
	
	//弹窗默认的第一P，建立弹窗播放器并建立分P列表===click事件应该在each事件之后执行
		function single_player(){
		$('.single_player').click(
			function() {
				//$('.dialogcontainter').remove();//防止同时播放两个视频
				$('#player-list').remove(); //移除播放列表
				var a = '<p id="window_play_title">脚本(｀・ω・´)正在加载中</p><div id="player_content">脚本(｀・ω・´)播放器正在努力加载中....</div>';
				var list_html = '<div id="player-list"><div class="sort"><i>分P列表</i></div><ul id="window_play_list"></ul></div>';
							
				var title = $(this).parent('.t').html() === null ? $(this).parent('.title').html() : $(this).parent('.t').html();
				var aid = $(this).attr('data-field');
				var title_html = '<a class="mark_my_video singleplaybtn" href="javascript:void(0);" style="color:white;background:none repeat scroll 0% 0% #009900!important;" data-field="' + aid + '">收藏★</a>&nbsp;&nbsp;&nbsp;<a class="singleplaybtn" href="http://www.bilibili.com/video/av' + aid + '/" style="color:white;background:none repeat scroll 0% 0% #FFB901!important;" target="_blank">TO播放页</a>&nbsp;&nbsp;&nbsp;<span style="color:#8C8983">' + title.replace('弹▶', '') + '</span>&nbsp;&nbsp;&nbsp;▶<span id="window_play_info"></span>';			
				setTimeout(function() {
					creat(title_html, a); //创建可视化窗口
					$('.dialogcontainter').after(list_html);
					$('#window_play_info').html('正在播放第<span style="color:#F0CF1D">1P</span>');
					$('#window_play_title').html('<p><a id="div_positon_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #E54C7E;">固定播放器</a><a id="list_control_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #0CB3EE;">收缩分P列表[在左边]</a>[拖动标题可移动播放器，拖动右下角可改变播放器大小，设置后自动保存宽高和位置]</p>');
					//切换分P按钮
					$('#list_control_button').click(function() {
						var flag = $("#player-list").css("display");
						if (flag == "none") {
							$("#player-list").show();
							$('#list_control_button').html('收缩分P列表');
							$('#list_control_button').css('background', 'none repeat scroll 0% 0% #0CB3EE');
						} else {
							$("#player-list").hide();
							$('#list_control_button').html('显示分P列表');
							$('#list_control_button').css('background', 'none repeat scroll 0% 0% #FF2C14');
						}
					});
					//固定播放器按钮
					$('#div_positon_button').click(function() {
						var p = $('.dialogcontainter').css('position');
						if (p == "fixed") {
							$('.dialogcontainter').css('position', 'absolute');
							$('#player-list').css('position', 'absolute');
							$('#div_positon_button').html('浮动播放器');
							$('#div_positon_button').css('background', 'none repeat scroll 0% 0% #FECD3E');
						} else {
							$('.dialogcontainter').css('position', 'fixed');
							$('#player-list').css('position', 'fixed');
							$('#div_positon_button').html('固定播放器');
							$('#div_positon_button').css('background', 'none repeat scroll 0% 0% #E54C7E');
						}
					});
					//弹窗播放器收藏功能
					$('.mark_my_video').click(function() {
						var aid = $(this).attr('data-field');
						$.ajax({
							type: 'POST',
							url: 'http://www.bilibili.com/m/stow',
							data: 'dopost=save&aid=' + aid + '&stow_target=stow&ajax=1',
							success: function(r) {
								//$('#edit_status_bar').html(r);
								alert('收藏成功');
							},
							error: function(r) {
								alert('出错，请重试！');
							},
							dataType: 'text'
						});
					});
				}, 0);
				setTimeout(function() {
					aid_build_player(aid);
				}, 0);
			});
			}
			
	//END弹窗------------------------------



	//替换播放器----------------------------
	//取出aid和分P
	var url = document.location.href;
	var aid_reg = /\/av(\d+)\/(?:index_(\d+)\.html)?/ig;
	var aid_array = aid_reg.exec(url);

	var aid = aid_array === null ? '' : aid_array[1]; //aid
	var page = aid_array === null ? '1' : typeof(aid_array[2]) == 'undefined' ? '1' : aid_array[2]; //分p

	//播放器的html
	var content; //本脚本使用了很多content变量，其中cid_get_videodown函数的while循环content变量全局，如果此处未定义content，火狐会报权限问题
	api_get_cid(aid, page); //按照aid和分p获取cid并且替换播放器
	
	//当设置悬浮评论分页栏时，增加css
	if (GM_getValue('pagebox_display') == 1) {
	if(url.indexOf('video/av')>-1){
		 var css='.pagelistbox.top{z-index:999;position:fixed;bottom:10px;  left:0px;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);}';
		 GM_addStyle(css);}
		}
		
		//当设置评论移除和谐娘时，增加css
	if (GM_getValue('pagebox_harm') == 1) {
	if(url.indexOf('video/av')>-1){
		 var css='.quote{display:block!important;}span.content a,.content>a[href="javascript:;"]{display:none!important;}';
		 GM_addStyle(css);}
		}	
	
	//css插入
	var css = '.blborder{box-shadow: 0px 3px 3px rgba(34, 25, 25, 0.4);}.singleplaybtn{box-shadow: 0px 1px 1px rgba(34, 25, 25, 0.4);background:none repeat scroll 0% 0% #FF6666!important;}.bfpbtn{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 2px;transition-property:#000,color;transition-duration:0.3s;box-shadow:none;color:#FFF;text-shadow:none;border:medium none;background:none repeat scroll 0% 0% #00A1CB!important;}.bfpbtn.active{background:none repeat scroll 0% 0%  #F489AD!important;}.bfpbtn.notice{background-color:#A300C0!important;}.font{font-size:11px!important;}#window_play_list li{float:left;position:relative;width:5em;border:1px solid #B0C4DE;font:80% Verdana,Geneva,Arial,Helvetica,sans-serif;}.ui.corner.label{height:0px;border-width:0px 3em 3em 0px;border-style:solid;border-top:0px solid transparent;border-bottom:3em solid transparent;border-left:0px solid transparent;border-right-color:rgb(217,92,92)!important;transition:border-color 0.2s ease 0s;position:absolute;content:"";right:0px;top:0px;z-index:-1;width:0px;}.ui.corner.label i{display:inline-block;margin:3px 0.25em 0px 17px;width:1.23em;height:1em;font-weight:800!important;}.dialogcontainter{z-index:99999!important;height:400px;width:400px;border:1px solid #14495f;position:fixed;font-size:13px;}.dialogtitle{height:26px;width:auto;background-color:#C6C6C6;}.dialogtitleinfo{float:left;height:20px;margin-top:2px;margin-left:10px;line-height:20px;vertical-align:middle;color:#FFFFFF;font-weight:bold;}.dialogtitleico{float:right;height:20px;width:21px;margin-top:2px;margin-right:5px;text-align:center;line-height:20px;vertical-align:middle;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-21px 0px}.dialogbody{padding:10px;width:auto;background-color:#FFFFFF;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");}.dialogbottom{bottom:1px;right:1px;cursor:nw-resize;position:absolute;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-42px -10px;width:10px;height:10px;font-size:0;}.button-small{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 5px;}.button-flat-action{transition-duration:0.3s;box-shadow:none;background:none repeat scroll 0% 0% #7DB500;color:#FFF!important;text-shadow:none;border:medium none;border-radius:3px;}#player-list{box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);position:fixed;z-index:1000;left:10px;top:50px;width:400px!important;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");min-height:200px!Important;}#player_content{position:absolute;top:60px;left:10px;right:10px;bottom:10px;}#window-player{bottom:0;height:100%;left:0;right:0;top:0;width:100%;}a.single_player{display:none;}a:hover .single_player{display:inline;}#bofqi_embed.hide,#bofqi.hide,#player_content.hide{margin-left:3000px!important;transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}#bofqi_embed,#bofqi,#player_content{transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}';
	GM_addStyle(css);


	//高大上的拖动DIV和改变DIV大小功能，来自互联网脚本之家www.jb51.net
	var z = 1,i = 1,left = 10;
	var isIE = (document.all) ? true : false;
	var Extend = function(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
	}

	var Bind = function(object, fun, args) {
		return function() {
			return fun.apply(object, args || []);
		}
	}

	var BindAsEventListener = function(object, fun) {
		var args = Array.prototype.slice.call(arguments).slice(2);
		return function(event) {
			return fun.apply(object, [event || window.event].concat(args));
		}
	}

	var CurrentStyle = function(element) {
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	}

		function create(elm, parent, fn) {
			var element = document.createElement(elm);
			fn && fn(element);
			parent && parent.appendChild(element);
			return element
		};

	function addListener(element, e, fn) {
		element.addEventListener ? element.addEventListener(e, fn, false) : element.attachEvent("on" + e, fn)
	};

	function removeListener(element, e, fn) {
		element.removeEventListener ? element.removeEventListener(e, fn, false) : element.detachEvent("on" + e, fn)
	};

	var Class = function(properties) {
		var _class = function() {
			return (arguments[0] !== null && this.initialize && typeof(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
		};
		_class.prototype = properties;
		return _class;
	};

	var Dialog = new Class({
		options: {
			Width: 400,
			Height: 400,
			Left: 100,
			Top: 10,
			Titleheight: 26,
			Minwidth: 200,
			Minheight: 200,
			CancelIco: true,
			ResizeIco: true,
			Info: "标题",
			Content: "无内容",
			Zindex: 2
		},
		initialize: function(options) {
			this._dragobj = null;
			this._resize = null;
			this._cancel = null;
			this._body = null;
			this._x = 0;
			this._y = 0;
			this._fM = BindAsEventListener(this, this.Move);
			this._fS = Bind(this, this.Stop);
			this._isdrag = null;
			this._Css = null;
			//////////////////////////////////////////////////////////////////////////////// 
			this.Width = this.options.Width;
			this.Height = this.options.Height;
			this.Left = this.options.Left;
			this.Top = this.options.Top;
			this.CancelIco = this.options.CancelIco;
			this.Info = this.options.Info;
			this.Content = this.options.Content;
			this.Minwidth = this.options.Minwidth;
			this.Minheight = this.options.Minheight;
			this.Titleheight = this.options.Titleheight;
			this.Zindex = this.options.Zindex;
			Extend(this, options);
			Dialog.Zindex = this.Zindex
			//////////////////////////////////////////////////////////////////////////////// 构造dialog 
			var obj = ['dialogcontainter', 'dialogtitle', 'dialogtitleinfo', 'dialogtitleico', 'dialogbody', 'dialogbottom'];
			for (var i = 0; i < obj.length; i++) {
				obj[i] = create('div', null, function(elm) {
					elm.className = obj[i];
				});
			}
			obj[2].innerHTML = this.Info;
			obj[4].innerHTML = this.Content;
			obj[1].appendChild(obj[2]);
			obj[1].appendChild(obj[3]);
			obj[0].appendChild(obj[1]);
			obj[0].appendChild(obj[4]);
			obj[0].appendChild(obj[5]);
			document.body.appendChild(obj[0]);
			this._dragobj = obj[0];
			this._resize = obj[5];
			this._cancel = obj[3];
			this._body = obj[4];
			////////////////////////////////////////////////////////////////////////////////o,x1,x2 
			////设置Dialog的长 宽 ,left ,top 
			with(this._dragobj.style) {
				height = this.Height + "px";
				top = this.Top + "px";
				width = this.Width + "px";
				left = this.Left + "px";
				zIndex = this.Zindex;
			}
			this._body.style.height = this.Height - this.Titleheight - parseInt(CurrentStyle(this._body).paddingLeft) * 2 + 'px';
			/////////////////////////////////////////////////////////////////////////////// 添加事件 
			addListener(this._dragobj, 'mousedown', BindAsEventListener(this, this.Start, true));
			addListener(this._cancel, 'mouseover', Bind(this, this.Changebg, [this._cancel, '0px 0px', '-21px 0px']));
			addListener(this._cancel, 'mouseout', Bind(this, this.Changebg, [this._cancel, '0px 0px', '-21px 0px']));
			addListener(this._cancel, 'mousedown', BindAsEventListener(this, this.Disappear));
			addListener(this._body, 'mousedown', BindAsEventListener(this, this.Cancelbubble));
			addListener(this._resize, 'mousedown', BindAsEventListener(this, this.Start, false));
		},
		Disappear: function(e) {
			this.Cancelbubble(e);
			document.body.removeChild(this._dragobj);
			$('#player-list').remove();
		},
		Cancelbubble: function(e) {
			this._dragobj.style.zIndex = ++Dialog.Zindex;
			document.all ? (e.cancelBubble = true) : (e.stopPropagation())
		},
		Changebg: function(o, x1, x2) {
			o.style.backgroundPosition = (o.style.backgroundPosition == x1) ? x2 : x1;
		},
		Start: function(e, isdrag) {
			if (!isdrag) {
				this.Cancelbubble(e);
			}
			this._Css = isdrag ? {
				x: "left",
				y: "top"
			} : {
				x: "width",
				y: "height"
			}
			this._dragobj.style.zIndex = ++Dialog.Zindex;
			this._isdrag = isdrag;
			this._x = isdrag ? (e.clientX - this._dragobj.offsetLeft || 0) : (this._dragobj.offsetLeft || 0);
			this._y = isdrag ? (e.clientY - this._dragobj.offsetTop || 0) : (this._dragobj.offsetTop || 0);
			if (isIE) {
				addListener(this._dragobj, "losecapture", this._fS);
				this._dragobj.setCapture();
			} else {
				e.preventDefault();
				addListener(window, "blur", this._fS);
			}
			addListener(document, 'mousemove', this._fM);
			addListener(document, 'mouseup', this._fS);
			if(GM_getValue('init360') ==1)$("#player_content").addClass("hide");
		},
		Move: function(e) {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var i_x = e.clientX - this._x,
				i_y = e.clientY - this._y;
			this._dragobj.style[this._Css.x] = (this._isdrag ? Math.max(i_x, 0) : Math.max(i_x, this.Minwidth)) + 'px';
			this._dragobj.style[this._Css.y] = (this._isdrag ? Math.max(i_y, 0) : Math.max(i_y, this.Minheight)) + 'px'
			if (!this._isdrag)
				this._body.style.height = Math.max(i_y - this.Titleheight, this.Minheight - this.Titleheight) - 2 * parseInt(CurrentStyle(this._body).paddingLeft) + 'px';
		},
		Stop: function() {
			$("#player_content").removeClass("hide");
			removeListener(document, 'mousemove', this._fM);
			removeListener(document, 'mouseup', this._fS);
			//实时改变播放器大小，保存播放器大小
			$('#window-player').width($('.dialogcontainter').width() - 20);
			GM_setValue('player_width', ($('.dialogcontainter').width() - 20));
			$('#window-player').height($('.dialogcontainter').height() - 70);
			GM_setValue('player_height', ($('.dialogcontainter').height() - 70));
			//保存位置
			//GM_setValue('div_top', ($('.dialogcontainter').offset().top));//设置垂直位置的时候，如果是长页而且是浮动播放器时候记录位置，会导致播放器不知所踪
			GM_setValue('div_left', ($('.dialogcontainter').offset().left));
			if (isIE) {
				removeListener(this._dragobj, "losecapture", this._fS);
				this._dragobj.releaseCapture();
			} else {
				removeListener(window, "blur", this._fS);
			};
		}
	})

		function creat(title, content) {
			$('.dialogcontainter').remove();
			new Dialog({
				Info: title = title,
				Left: GM_getValue('div_left'),
				Top: 50,
				Width: (GM_getValue('player_width') + 20),
				Height: (GM_getValue('player_height') + 70),
				Content: content,
				Zindex: (2000)
			});
			i++;
			left += 10;
		}
})();