// ==UserScript==
// @name        bili_fix_player
// @namespace   bili
// @description 修复B站播放器,黑科技,列表页、搜索页弹窗,破乐视限制,提供高清、低清晰源下载,弹幕下载
// @include     /^.*\.bilibili\.(tv|com|cn)\/(video|search|sp).*$/
// @include     /^.*bilibili\.kankanews\.com\/(video|search|sp).*$/
// @include     /http://www.bilibili.com/(#page=*)?/
// @include     http://www.bilibili.com/bangumi/*
// @include  	  http://search.bilibili.com*
// @version     3.9.4.b1
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
3.9.4.b1试运行版：1:增加了一个B站官方的弹幕播放器！
2:修复HTML5播放器的弹窗，该播放器在火狐下有异常，即暂停和播放异常，需要点击屏幕并按下空格键，但在chrome下完全正常，233我本人不太会修复权限之类的BUG；
3:html5播放器在搜索页面无法使用，原因是搜索页面的二级域名与主域名不同导致脚本请求跨域，偷懒不修复233
B站官方的弹幕播放器摘自http://tieba.baidu.com/p/4355490187谷歌卫士
*/
(function() {
	//初始化 init
	if (GM_getValue('init') == undefined || GM_getValue('version') != '3.9.4.b1') { //初始化优化，只查询一次数据库
		if (GM_getValue('version') == undefined)
			GM_setValue('version', 1); //版本号
		if (GM_getValue('auto') == undefined)
			GM_setValue('auto', 1);
		//if (GM_getValue('fix_type') == undefined)
		GM_setValue('fix_type', 1); //按需修复;强制修复
		if (GM_getValue('pagebox_display') == undefined)
			GM_setValue('pagebox_display', 0);
		if (GM_getValue('pagebox_harm') == undefined)
			GM_setValue('pagebox_harm', 0);
		if (GM_getValue('init360') == undefined)
			GM_setValue('init360', 0);
		//初始化播放器宽高
		if (GM_getValue('player_width') == undefined)
			GM_setValue('player_width', 950);
		if (GM_getValue('player_height') == undefined)
			GM_setValue('player_height', 482);
		//初始化播放器外框位置
		//if (GM_getValue('div_top') == undefined) GM_setValue('div_top', 100);//设置垂直位置的时候，如果是长页而且是浮动播放器时候记录位置，会导致播放器不知所踪
		if (GM_getValue('div_left') == undefined)
			GM_setValue('div_left', 100);
		//自动定位播放器--来自火狐吧友
		if (GM_getValue('auto_locate') == undefined)
			GM_setValue('auto_locate', 1);
		//自动宽屏-来自牙刷科技冻猫
		if (GM_getValue('auto_wide') == undefined)
			GM_setValue('auto_wide', 0);
		//是否启用视频弹窗功能--ajax重新渲染会导致渲染卡顿
		if (GM_getValue('window_play') == undefined)
			GM_setValue('window_play', 1);
		GM_setValue('init', 1);
	}
	//欢迎屏幕
	var version = '3.9.4.b1';
	var local_version = GM_getValue('version');
	if (version != local_version) {
		alert('\n\
				1:感谢使用Bili Fix Player版本号3.9.4.b1试运行版：增加了一个B站官方的弹幕播放器;\n2:修复HTML5播放器的弹窗，该播放器在火狐下有异常，即暂停和播放异常，需要点击屏幕并按下空格键，但在chrome下完全正常，233我本人不太会修复权限之类的BUG；\n3:html5播放器在搜索页面无法使用，原因是搜索页面的二级域名与主域名不同导致脚本请求跨域，偷懒不修复233');
		GM_setValue('version', version);
	}
	fix_player_fullwin = {
		fix_init: function() {
			setTimeout(function() {
				// 代码来自 http://static.hdslb.com/js/page.arc.js 为了兼容性目的添加了 .tv 相关域名
				unsafeWindow.location.href = ['javascript: void(function () {var c;',
					'window.postMessage?(c=function(a){"https://secure.bilibili.com"!=a.origin',
					'&&"https://secure.bilibili.tv"!=a.origin&&"https://ssl.bilibili.com"!=a.origin',
					'&&"https://ssl.bilibili.tv"!=a.origin||"secJS:"!=a.data.substr(0,6)',
					'||eval(a.data.substr(6));',
					'"undefined"!=typeof console&&console.log(a.origin+": "+a.data)},',
					'window.addEventListener?window.addEventListener("message",c,!1):',
					'window.attachEvent&&window.attachEvent("onmessage",c)):',
					'setInterval(function(){if(evalCode=__GetCookie("__secureJS"))',
					'{__SetCookie("__secureJS",""),eval(evalCode)}},1000);',
					'}());'
				].join('');
			}, 0);
		},
		fix_window: function() {
			fix_player_fullwin.fix_init();
			setTimeout(function() {
				unsafeWindow.location.href = 'javascript:void(' + function() {
					player_fullwin = function(is_full) {
						$('.z, .header, .z_top, .footer').css({
							'display': is_full ? 'none' : 'block'
						});
						$('#window-player,#bofqi,#bofqi_embed').css({
							'position': is_full ? 'fixed' : 'static'
						});
					}
				} + '());';
			}, 0);
		},
		fix_page: function() {
			fix_player_fullwin.fix_init();
			setTimeout(function() {
				location.href = 'javascript:void(' + function() {
					player_fullwin = unsafeWindow.player_fullwin
				} + '());';
			}, 0);
		}
	};
	
	/**
	-------------------------------用户界面GUI View-------------------------------------
	 */
	//函数，插入可视化操作视图

	function insert_html(type, mode) {
		var auto = GM_getValue('auto') ? '已打开' : '已关闭';
		switch (GM_getValue('fix_type')) {
			case 2:
				var fix_type = '大型默认B站播放器';
				break;
			case 3:
				var fix_type = '小型默认B站播放器[兼容火狐魔镜]';
				break;
			case 4:
				var fix_type = '原版B站HTML5弹幕播放器[谷歌卫士提供]';
				break;
			case 5:
				var fix_type = 'HTML5无弹幕播放器';
				break;
			default:
				var fix_type = '按需替换[替换非B站播放器,此时自动宽屏功能无效]';
		}
		var display = GM_getValue('pagebox_display') ? '悬浮' : '默认';
		var harm = GM_getValue('pagebox_harm') ? '和谐娘打酱油中' : '默认[和谐娘和谐中]';
		var init360 = GM_getValue('init360') ? '已打开' : '已关闭';
		var auto_locate = GM_getValue('auto_locate') ? '已打开' : '已关闭';
		var auto_wide = GM_getValue('auto_wide') ? '已打开' : '已关闭';
		var window_play = GM_getValue('window_play') ? '已打开' : '已关闭';
		var div = '<li class="m-i home" id="bili-fix-player-installed"><a class="i-link"><em style="color:red;font-weight:bold">脚本</em></a><div >\
									<ul class="i_num i_num_a blborder" id="bili_fix_script">\
									<li><a>360浏览器兼容[非360勿开]:<bl id="init360" class="bfpbtn">' + init360 + '</bl></a><em></em></li>\
									<li><a>自动修复(修改后请刷新页面):<bl id="bili_fix" class="bfpbtn">' + auto + '</bl></a><em></em></li>\
									<li><a>修复类型选择:<bl id="fix-type" class="bfpbtn">' + fix_type + '</bl></a><em></em></li>\
									<li><a>弹窗播放功能[如果卡顿请关闭]:<bl id="window_play" class="bfpbtn">' + window_play + '</bl></a><em></em></li>\
									<li><a target="_blank" href="http://bangumi.ga/361.html">若无限小电视则尝试关闭修复-BUG反馈</a><em></em></li>\
									<li><a>评论区分页导航:<bl id="pagebox-display" class="bfpbtn">' + display + '</bl></a><em></em></li>\
									<li><a>评论区和谐娘:<bl id="pagebox-harm" class="bfpbtn">' + harm + '</bl></a><em></em></li>\
									<li><a>视频页自动定位到播放器位置:<bl id="auto-locate" class="bfpbtn">' + auto_locate + '</bl></a><em></em></li>\
									<li><a>播放器自动宽屏[自动切换成强制修复]:<bl id="auto-wide" class="bfpbtn">' + auto_wide + '</bl></a><em></em></li>\
									<li><a id="bili_set_status">就绪中→_→</a><em></em></li>';
		if (mode == 'video_page') { //视频页面专有的设置
			div += '<li><a>本页视频源:<bl style="color:#F489AD">' + type + '</bl></a><em></em></li>\
									<li><a class="font">视频下载[点击后,会产生分段列表,然后点击分段列表即可]</a><div class="m_num" id="av_source" cid="">\
									<a  id="hd_av_download">高清[原画]</a>\
									<a  id="ld_av_download">手机[720P]</a>\
									<div id="HD-Down" class="m_num"></div>\
									</div><em></em></li>\
									<li><a id="down_cid_xml" target="_blank">弹幕下载</a><em></em></li>';
		}
		div += '</ul>\
				</div>';
		$('.m-i.home').prop('outerHTML', div);
		//下载高清
		$('#hd_av_download').click(function() {
			download_bili_av('HD');
		});
		//下载渣画质
		$('#ld_av_download').click(function() {
			download_bili_av('LD');
		});
		//设置
		var event_control = {
			Listener: function(selector, config_val, notice1, notice2) {
				$(selector).click(function() {
					event_control.Control(config_val, selector, notice1, notice2);
				});
			},
			Control: function(config_val, selector, notice1, notice2) {
				if (config_val == 'fix_type') {
					if (GM_getValue('fix_type') >= 5 || typeof(GM_getValue('fix_type')) == 'undefined') { //超过4自动复位成按需替换
						GM_setValue('fix_type', 1);
					} else {
						GM_setValue('fix_type', GM_getValue('fix_type') + 1);
					}
					var s = '当前设置为-';
					switch (GM_getValue('fix_type')) {
						case 2:
							s += '大型默认B站播放器';
							break;
						case 3:
							s += '小型默认B站播放器[兼容火狐魔镜]';
							break;
						case 4:
							s += '原版B站HTML5弹幕播放器[谷歌卫士提供]';
							break;
						case 5:
							s += 'HTML5无弹幕播放器';
							break;
						default:
							s += '按需替换[替换非B站播放器,此时自动宽屏功能无效]';
					}

				} else {
					GM_getValue(config_val) ? GM_setValue(config_val, 0) : GM_setValue(config_val, 1);
					var s = GM_getValue(config_val) ? notice1 : notice2;
				}
				$(selector).html(s);
				$(selector).toggleClass("active");
				$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
				ac_alert('normal', s, 3000);
			}
		};

		//监听修复按钮
		event_control.Listener('#bili_fix', 'auto', '已打开自动修复', '已关闭自动修复');
		//监听评论分页功能显示切换
		event_control.Listener('#pagebox-display', 'pagebox_display', '已设置评论分页悬浮', '已设置评论分页默认');
		//监听评论和谐娘功能切换
		event_control.Listener('#pagebox-harm', 'pagebox_harm', '已设置和谐娘打酱油中', '已设置默认[和谐娘和谐中]');
		//360火星
		event_control.Listener('#init360', 'init360', '360兼容已打开,请刷新', '360兼容已关闭，请刷新');
		//自动定位播放器
		event_control.Listener('#auto-locate', 'auto_locate', '自动定位播放器已打开,请刷新', '自动定位播放器已关闭，请刷新');
		//自动宽屏
		event_control.Listener('#auto-wide', 'auto_wide', '已打开', '已关闭');
		//修复模式
		event_control.Listener('#fix-type', 'fix_type', '', '');
		//弹窗播放功能
		event_control.Listener('#window_play', 'window_play', '当前打开弹窗播放功能,请刷新', '当前关闭弹窗播放功能,请刷新');
	}

	//弹窗播放器
	var window_player = {
		init: function(aid, cid) {
			this.width = GM_getValue('player_width');
			this.height = GM_getValue('player_height');
			this.wide = '';
			if (GM_getValue('auto_wide') == 1)
				this.wide = '&as_wide=1';
		},
		fix_letv: function(aid, cid) {
			window_player.init(aid, cid);
			ac_alert('info', '修复乐视专用弹窗播放中....', 3000);
			return '<embed id="window-player" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + this.wide + '" src="https://nightlyfantasy.github.io/Bili_Fix_Player/biliplus/player.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" height="' + this.height + '" width="' + this.width + '">';
		}
	};

	//下载

	function download_bili_av(type) {
		if ($('#av_source').attr('cid') == '') {
			//alert('错误，请再试一次，多次错误请报修');
			ac_alert('info', '错误，请再试一次，多次错误请报修....', 3000);
		} else {
			var cid = $('#av_source').attr('cid');
			if (type == 'HD') {
				if (!$('#HD-Down').attr('HD')) {
					ac_alert('info', '正在解析高清下载地址....', 3000);
					var url = 'http://interface.bilibili.com/playurl?appkey=8e9fc618fbd41e28&platform=android&quality=2&cid=' + cid + '&otype=json&platform=android';
					GM_xmlhttpRequest({
						method: 'GET',
						url: url,
						synchronous: false,
						onload: function(responseDetails) {
							if (responseDetails.status == 200) {
								var content = responseDetails.responseText;
								var c = eval('(' + content + ')');
								var durl = c.durl;
								if (typeof(durl) == 'undefined') {
									ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法下载....', 3000);
								} else {
									for (var i in durl) {
										var url = durl[i]['url'];
										insert_download_button('HD', url, parseInt(i) + 1);
									}
								}
							}
						}
					});
				} else {
					ac_alert('warn', '已经解析过<高清>下载地址....', 3000);
				}
			} else {
				if (!$('#HD-Down').attr('LD')) {
					ac_alert('info', '正在解析手机良心画质[最大720P]下载地址....', 3000);
					var url = 'http://interface.bilibili.com/playurl?platform=android&cid=' + cid + '&quality=3&otype=json&appkey=8e9fc618fbd41e28&type=mp4';
					GM_xmlhttpRequest({
						method: 'GET',
						url: url,
						synchronous: false,
						onload: function(responseDetails) {
							if (responseDetails.status == 200) {
								var content = responseDetails.responseText;
								var c = eval('(' + content + ')');
								var durl = c.durl;
								if (typeof(durl) == 'undefined') {
									ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法下载....', 3000);
								} else {
									for (var i in durl) {
										if (!isNaN(i)) { //擦，遍历这个数组居然跑出多两个bsearch和binsert字段，明明是数字，处理掉
											var url = durl[i]['url'];
											insert_download_button('LD', url, parseInt(i) + 1);
										}
									}
								}
							}
						}
					});
				} else {
					ac_alert('warn', '已经解析过<手机良心画质[最大720P]>下载地址....', 3000);
				}
			}
		}
	}
	//函数，插入下载按钮 20141031 接口更换成json

	function insert_download_button(type, url, count) {
		if (type == 'HD') {
			$('#HD-Down').append('<a href="' + url + '" target="blank">高清分段<bl style="color:purple;display:inline">' + count + '</bl></a>');
			$('#HD-Down').attr('HD', '1');
		} else {
			$('#HD-Down').append('<a href="' + url + '" target="blank">720P分段<bl style="color:purple;display:inline>' + count + '</bl></a>');
			$('#HD-Down').attr('LD', '1');
		}
	}

	/**
	-------------------------------函数 Model-------------------------------------
	 */
	//函数，替换播放器

	function Replace_player(aid, cid, div,page,type) {
		var wide = '';
		var w = 0;
		if (GM_getValue('auto_wide') == 1) {
			var wide = '&as_wide=1'; //自动宽屏
			var w = 1;
		}
		if(type){
		var width=1160;var height=650;//类型1在视频页面。宽度高度固定不变
		}else{
		var width=GM_getValue('player_width');var height=GM_getValue('player_height');//弹窗模式，类型0，宽度高度是自己设置的
		}
		switch (GM_getValue('fix_type')) {
			case 2:
				$(div).html('<iframe class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="'+height+'" width="'+width+'" style="width:'+width+'px;height:'+height+'px"></iframe>');
				fix_player_fullwin.fix_page();
				ac_alert('normal', '正在强制替换->[大型默认B站播放器]', 3000);
				break;
			case 3:
				$(div).html('<embed id="bofqi_embed" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + wide + '" src="https://static-s.bilibili.com/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" style="width:100%;height:100%">');
				$(div).css({
					width: width+"px",
					height: height+"px"
				});
				ac_alert('normal', '正在强制替换->小型默认B站播放器[兼容火狐魔镜]', 3000);
				break;
			case 4:
				html5_cm_play(aid,cid, div, 1, page,width,height,type);
				window.location.hash = "page=" + page;
				//$(div).css('height', "600px");
				ac_alert('normal', '正在强制替换->原版B站HTML5弹幕播放器[谷歌卫士提供]', 3000);
				break;
			case 5:
				html5_cm_play(aid,cid, div, 0, page,width,height,type);
				ac_alert('normal', '正在强制替换->HTML5无弹幕播放器', 3000);
				break;
			default:
				if (div == '#bofqi') { // $(div).html().match
					var need_replace_player = (/static\.hdslb\.com\/play\.swf|secure\.bilibili\.com\/secure,cid=/).test($(div).html());
				}
				if (!need_replace_player || div == '#player_content #bofqi') {
					$(div).html('<iframe class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="'+height+'" width="'+width+'" style="width:'+width+'px;height:'+height+'px"></iframe>');
					fix_player_fullwin.fix_page();
					ac_alert('normal', '正在按需替换->[替换非B站播放器,此时自动宽屏功能无效]', 3000);
				}
		}
	}
	
	//特殊！当用户不能登录的情况下获取cid，途径，从http://www.bilibilijj.com/
	function special_get_cids(aid,page){
		GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.bilibilijj.com/video/av'+aid,
		synchronous: false,
		onload: function(responseDetails) {
			if (responseDetails.status == 200) {
				var Content = responseDetails.responseText;
				var patt =/<span class='Width-2 Box PBox' data-cid='(\d+)' data-p='\d+'>/g;
				var result;var arr=new Array();
				while ((result = patt.exec(Content)) != null)  {
				 arr.push(result[1]);
				 }
				 if(arr.length==0){
				 ac_alert('error', 'bili脚本提示：特殊API返回错误，无法继续执行脚本', 5000);
				 }else{
				 ac_alert('success', '请求特殊api成功重构播放器', 3000);
				 var div='';
				 for(var i in arr){
				 div+='<a href="/video/av'+aid+'/index_'+(parseInt(i)+1)+'.html">'+(parseInt(i)+1)+'P</a>';
				 }
				 $('div.z').html('<div class="main-inner"><div id="heimu"></div><div class="viewbox"> <div class="alist"><div class="alist-content clearfix" id="alist">'+div+'</div></div>    </div>    </div><div class="player-wrapper"><div class="scontent" id="bofqi"></div></div>');	
				 var cid=arr[(parseInt(page)-1)];
				 Replace_player(aid, cid, '#bofqi',page,1); //自动修复--在视频页面，宽度高度是固定值
				 }
			}
		}
	});
	}
	
	//api获取cid

	function api_get_cid(aid, cid, page) {
		if ($("#bofqi_embed,#bofqi").size() == 0) {
			special_get_cids(aid, page);
			init_video_page('未获取[本页面使用了特殊替换功能]', aid, cid, page);
			ac_alert('success', '本页面使用了特殊替换功能[比如原本需要登录才能查看的视频]', 3000);
		} else {
			if (cid) { //cid已知的情况下不请求api
				init_video_page('未获取[由于已知cid不请求api]', aid, cid, page);
				ac_alert('success', '此页面cid已知的情况下不请求api', 3000);
			} else { //cid无法获取的时候请求api
				var url = 'http://api.bilibili.com/view?type=json&appkey=8e9fc618fbd41e28&batch=1&id=' + aid;
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					synchronous: false,
					onload: function(responseDetails) {
						if (responseDetails.status == 200) {
							var Content = eval('(' + responseDetails.responseText + ')');
							var list = Content.list;
							var p = page - 1;
							if (typeof(list) != 'undefined') {
								var lp = (typeof(list[p]) == 'undefined') ? list[0] : list[p]; //针对某些aid只有一个cid但是有分P的情况
								var cid = lp.cid;
								var type = lp.type;
								init_video_page(type, aid, cid, page);
								ac_alert('success', '请求api得到了相关信息', 3000);
							} else {
								//alert('bili脚本提示：API返回错误');
								ac_alert('error', 'bili脚本提示：API返回错误', 3000);
							}
						}
					}
				});
			}
			if (GM_getValue('auto_locate') == 1) { //自动滚动功能前置，以便api缓慢的时候也能及时响应
				$('html,body').animate({
					scrollTop: $("#bofqi_embed,#bofqi").offset().top - 30
				}, 500);
			}
		}
	}

	function init_video_page(type, aid, cid,page) {
		insert_html(type, 'video_page'); //UI
		//修复360浏览器flash霸占脚本设置区域
		if (GM_getValue('init360') == 1) {
			$("#bili_fix_script,#bili-fix-player-installed").mouseover(function() {
				$("#bofqi,#bofqi_embed").addClass("hide");
			});
			$("#bili_fix_script,#bili-fix-player-installed").mouseout(function() {
				$("#bofqi,#bofqi_embed").removeClass("hide");
			});
		}
		var cid_xml_url = 'http://comment.bilibili.com/' + cid + '.xml';
		$('#down_cid_xml').attr('href', cid_xml_url); //弹幕下载
		if (GM_getValue('auto') == '1') { //如果打开了自动修复
			Replace_player(aid, cid, '#bofqi',page,1); //自动修复--在视频页面，宽度高度是固定值
		}
		$('#av_source').attr('cid', cid); //给av_source设置cid
		$("#app_qrcode_box").before('<div class="block">视频不能播时<b style="color:red"><a href="javascript:void(0)" id="div_fix_letv_button">点我尝试治疗</a></b></div>');
		$('#div_fix_letv_button').click(function() {
			$('#bofqi').html(window_player.fix_letv(aid, cid));
		});
	}

	//在新番页面，通过弹窗，获取aid,cid然后进行播放

	function aid_build_player(aid) {
		//aid=971415;这个aid奇葩出错
		var url = 'http://api.bilibili.com/view?type=json&appkey=8e9fc618fbd41e28&batch=1&id=' + aid;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var Content = eval('(' + responseDetails.responseText + ')');
					var list = Content.list;

					if (typeof(list) != 'undefined') {
						//默认播放第一个分P-------------------
						var p = 0;
						var lp = (typeof(list[p]) == 'undefined') ? list[0] : list[p];
						var cid = lp.cid;
						Replace_player(aid, cid, '#player_content #bofqi',1,0);
						$('#div_fix_letv_button').attr('aid', aid);
						$('#div_fix_letv_button').attr('cid', cid);
						//分P列表和播放器------------------------------
						for (var z in list) {
							if (!isNaN(z)) { //擦，遍历这个数组居然跑出多两个bsearch和binsert字段，明明是数字，处理掉
								var cid = list[z].cid;
								var p = parseInt(z) + 1;
								var title = list[z].part;
								if(p==1){
								var lclass="on";
								}else{
								var lclass="";
								}
								$('#window_play_list').append('<li class="single_play_list '+lclass+'" data-field="aid=' + aid + '&cid=' + cid + '&page='+p+'"><a  href="javascript:void(0);" style="color:#00A6D8;" >[' + p + 'p]' + title + '</a></li>');
							}
						}
						if (!unsafeWindow.player_fullwin)
							setTimeout(fix_player_fullwin.fix_window, 0);
						//弹窗的分P播放
						$('.single_play_list').click(
							function() {
								$('#window_play_info').html('正在播放第<span style="color:#DB5140">' + $(this).find('a').html() + '</span>');
								var info = $(this).attr('data-field');
								var pattern = /aid=(\d+)&cid=(\d+)&page=(\d+)/ig;
								var val = pattern.exec(info);
								var aid = val === null ? '' : val[1];
								var cid = val === null ? '' : val[2];
								var page=val === null ? '' : val[3];
								window.location.hash = "page=" + page;
								$('#div_fix_letv_button').attr('aid', aid);
								$('#div_fix_letv_button').attr('cid', cid);
								Replace_player(aid, cid, '#player_content #bofqi',page,0);
							});
					} else {
						ac_alert('info', '弹窗解析错误，请关闭弹窗重试，如果再次出现，请直接打开播放页播放', 3000);
					}
				}
			}
		});
	}
	/**
			-------------------------------控制 Control-------------------------------------
			 */

	function window_player_init() {
		//弹窗------------------------------
		//2015-09-24番剧bangumi页面的弹窗
		$('#episode_list li .t').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).parent('a').attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).html();
						$(this).prepend('<a class="single_player singleplaybtn fjlist" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//新番列表弹窗UI
		$('.vd_list .title').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).html();
						$(this).prepend('<a class="single_player singleplaybtn xflist" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});

		//搜索列表专题List
		$('.s_bgmlist li a').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)/ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					$('.s_v_l li .s_bgmlist ul li a').css('display', 'inline'); //防止A标签换行导致无法点击
					if (aid != '') {
						var title = '第<' + $(this).html() + '>P';
						$(this).parent('li').prepend('<bl class="single_player singleplaybtn searchlistzt" style="color:white;" data-field="' + aid + '">弹▶</bl>&nbsp;&nbsp;');
						$(this).parent('li').find('bl').click(function() {
							single_player(aid, title)
						});
					}
				}
			});

		//搜索列表弹窗UI
		$('#video-list li .title').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).html();
						$('#video-list li .title').css('display', 'inline'); //不换行
						$(this).prepend('<a class="single_player singleplaybtn searchlist" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//带缩略图弹窗UI、和侧栏新投稿弹窗UI、首页的推荐栏弹窗、侧栏列表弹窗UI
		$('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a,.top-list li a').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).find('.t').html();
						$(this).find('.t').prepend('<a class="single_player singleplaybtn suoluotu" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//专题
		$('.vidbox.zt  .t').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = typeof($(this).attr('href')) == 'undefined' ? $(this).parent('a').attr('href') : $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					//$('.vidbox.zt li a').css('display','inline');//防止A标签换行导致无法点击
					if (aid != '') {
						var title = $(this).html();
						$(this).prepend('<a class="single_player singleplaybtn zttc" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//旧版首页分区列表
		$('.video  li a,.video-wrapper li a').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).find('.t').html();
						$(this).find('.t').prepend('<a class="single_player singleplaybtn oldlifenqu" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('.t a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
			
		//2016新列表
		$('.v-list li a').each(
			function() {
				if (typeof($(this).attr('has_window_btn')) == 'undefined') {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).find('.t').html();
						$(this).find('.t').prepend('<a class="single_player singleplaybtn oldlifenqu" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('.t a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//弹窗初始化
	}
	//弹窗默认的第一P，建立弹窗播放器并建立分P列表===click事件应该在each事件之后执行

	function single_player(aid, title) {
		$('.player-list').remove(); //移除播放列表
		window.location.hash = "page=1" ;
		var a = '<p id="window_play_title">脚本(｀・ω・´)正在加载中</p><div id="player_content"><div id="bofqi">脚本(｀・ω・´)播放器正在努力加载中....</div></div>';
		var list_html = '<div id="part_list" class="player-list"><div class="sort"><i>分P列表</i></div><ul id="window_play_list" class="lst unselectable"></ul></div>';
		var title_html = '<a class="mark_my_video singleplaybtn" href="javascript:void(0);" style="color:white;background:none repeat scroll 0% 0% rgb(0, 182, 228) !important;" data-field="' + aid + '" title="收藏该视频">★Mrak</a>&nbsp;&nbsp;&nbsp;<a class="singleplaybtn" href="http://www.bilibili.com/video/av' + aid + '/" style="color:white;background:none repeat scroll 0% 0% #1E344A!important;" target="_blank" title="前往播放页面">Go</a>&nbsp;&nbsp;&nbsp;<span style="color:#8C8983">' + title.replace('弹▶', '') + '</span>&nbsp;&nbsp;&nbsp;▶<span id="window_play_info"></span>';
		setTimeout(function() {
			creat(title_html, a); //创建可视化窗口
			$('.dialogcontainter').after(list_html);
			$('#window_play_info').html('正在播放第<span style="color:#DB5140">1P</span>');
			$('#window_play_title').html('<p><a id="div_positon_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #E54C7E;">固定播放器</a><a id="list_control_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #0CB3EE;">收缩分P列表[在左边]</a><a id="div_fix_letv_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #ED6A4C;">点我专治乐视、搜狐源(乐视源或者搜狐源无法播放的情况请点击)</a>');
			//切换分P按钮
			$('#list_control_button').click(function() {
				var flag = $(".player-list").css("display");
				if (flag == "none") {
					$(".player-list").show();
					$('#list_control_button').html('收缩分P列表');
					$('#list_control_button').css('background', 'none repeat scroll 0% 0% #0CB3EE');
				} else {
					$(".player-list").hide();
					$('#list_control_button').html('显示分P列表');
					$('#list_control_button').css('background', 'none repeat scroll 0% 0% #FF2C14');
				}
			});
			//固定播放器按钮
			$('#div_positon_button').click(function() {
				var p = $('.dialogcontainter').css('position');
				if (p == "fixed") {
					$('.dialogcontainter').css('position', 'absolute');
					$('.player-list').css('position', 'absolute');
					$('#div_positon_button').html('浮动播放器');
					$('#div_positon_button').css('background', 'none repeat scroll 0% 0% #FECD3E');
				} else {
					$('.dialogcontainter').css('position', 'fixed');
					$('.player-list').css('position', 'fixed');
					$('#div_positon_button').html('固定播放器');
					$('#div_positon_button').css('background', 'none repeat scroll 0% 0% #E54C7E');
				}
			});
			//专治乐视
			$('#div_fix_letv_button').click(function() {
				var aid = $('#div_fix_letv_button').attr('aid');
				var cid = $('#div_fix_letv_button').attr('cid');
				$('#player_content #bofqi').html(window_player.fix_letv(aid, cid));
			});
			//弹窗播放器收藏功能
			$('.mark_my_video').click(function() {
				var aid = $(this).attr('data-field');
				$.ajax({
					type: 'POST',
					url: 'http://www.bilibili.com/m/stow',
					data: 'dopost=save&aid=' + aid + '&stow_target=stow&ajax=1',
					success: function(r) {
						ac_alert('success', '收藏成功！！！！("▔□▔)/', 3000);
					},
					error: function(r) {
						//alert('出错，请重试！');
						ac_alert('error', '出错，请重试！', 3000);
					},
					dataType: 'text'
				});
			});
		}, 0);
		setTimeout(function() {
			aid_build_player(aid);
		}, 0);
	}

	//END弹窗------------------------------

	//模仿AC娘的消息通知效果

	function ac_alert(type, text, time) {
		switch (type) {
			case 'success':
				$('#notice_area').append('<div class=" notice_item notice_success"><i class="icon icon-ok icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			case 'error':
				$('#notice_area').append('<div class=" notice_item notice_error"><i class="icon icon-remove icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			case 'info':
				$('#notice_area').append('<div class=" notice_item notice_info"><i class="icon icon-info-sign icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			case 'warn':
				$('#notice_area').append('<div class=" notice_item notice_warn"><i class="icon icon-warning-sign icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			case 'inverse':
				$('#notice_area').append('<div class=" notice_item notice_inverse"><i class="icon icon-certificate icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			case 'normal':
				$('#notice_area').append('<div class=" notice_item notice_normal"><i class="icon icon-bullhorn icon-white"></i>&nbsp;' + text + '</div>');
				element_action(time);
				break;

			default:
				return false;
		}
	}

	function element_action(time) {
		$(".notice_item:last-child").each(function() {
			var t = $(this);
			setTimeout(function() {
				t.css({
					'margin-left': 0,
					'margin-bottom': '8px'
				});
			}, 10);
			setTimeout(function() {
				t.css({
					'margin-left': '-' + t.width() - 40 + "px",
					opacity: "0.3"
				});
			}, time);
			setTimeout(function() {
				t.remove();
			}, time + 1000);
		});
	}

	//替换播放器----------------------------
	//取出aid和分P
	var url = document.location.href;
	var aid_reg = /\/av(\d+)\/(?:index_(\d+)\.html)?/ig;
	var aid_array = aid_reg.exec(url);

	var aid = aid_array === null ? '' : aid_array[1]; //aid
	var page = aid_array === null ? '1' : typeof(aid_array[2]) == 'undefined' ? '1' : aid_array[2]; //分p

	//模仿AC娘的消息通知效果
	var html = '<div id="notice_area"><div class=" notice_item notice_success" style="display: none">NOTICE-AREA-BASIC-BEGIN</div></div>';
	$('body').append(html);

	//播放器的html
	if (aid == '') {
		insert_html('', '');
		if (GM_getValue('window_play')) {
			//ac_alert('info', '弹窗使能初始化...', 3000);
			window_player_init(); //执行弹窗函数
			addNodeInsertedListener('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a,.top-list li a,.vidbox.zt  .t,#video-list li a', function() {
				window_player_init(); //ajax重新渲染,有可能导致浏览器卡顿，若卡顿请删除此行(仅此一行)
			});
		}
	} else { //cid=3841639
		//ac_alert('info', '视频页面使能初始化...', 3000);
		var content = $('#bofqi').html();
		var cid_reg = /cid=(\d+)/;
		var cid_array = cid_reg.exec(content);
		var cid = cid_array === null ? '' : cid_array[1]; //cid
		api_get_cid(aid, cid, page); //按照aid和分p获取cid并且替换播放器
		//当设置悬浮评论分页栏时，增加css
		if (GM_getValue('pagebox_display') == 1) {
			if (url.indexOf('video/av') > -1) {
				var css = '.pagelistbox.top{z-index:999;position:fixed;bottom:10px;  left:0px;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);}';
				GM_addStyle(css);
			}
		}

		//当设置评论移除和谐娘时，增加css
		if (GM_getValue('pagebox_harm') == 1) {
			if (url.indexOf('video/av') > -1) {
				var css = '.quote{display:block!important;}span.content a,.content>a[href="javascript:;"]{display:none!important;}';
				GM_addStyle(css);
			}
		}
	}

	//HTML5弹幕播放

	function html5_cm_play(aid,cid, div, cm, page,width,height,type) {
		if (typeof(cid) == 'undefined') {
			cid = $('#div_fix_letv_button').attr('cid');
		}
		//ac_alert('inverse', 'HTML5弹幕播放', 3000);
		var url = 'http://interface.bilibili.com/playurl?platform=android&cid=' + cid + '&quality=3&otype=json&appkey=8e9fc618fbd41e28&type=mp4';
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var content = responseDetails.responseText;
					var c = eval('(' + content + ')');
					console.log(c);
					var durl = c.durl;
					if (typeof(durl) == 'undefined') {
						ac_alert('error', 'bili脚本提示：API返回错误：api调用失败，无法解析，请重试一次！', 3000);
					} else {
						var url = durl[0]['url'];
						if (cm) { //HTML5弹幕播放
							if(div=='#bofqi'){//视频页面
							//摘自http://tieba.baidu.com/p/4355490187
 							unsafeWindow.location.href = ['javascript:(function(d){window.loadHTML5=function(g,f){var h=1==Number(f)?"":"#page="+f;$.getJSON("http://www.bilibili.com/m/html5?aid="+g+"&page="+f+"&sid="+__GetCookie("sid"),function(a){a.src&&(window.html5data=a,$("#bofqi").html(\'<link type="text/css" href="http://static.hdslb.com/css/simple.v2.min.css" rel="stylesheet"/>\'),$.getScript("http://static.hdslb.com/js/simple.v2.min.js",function(){(new BiliH5Player).create({get_from_local:!0,comment:window.html5data.cid,image:window.html5data.img,video_url:\''+url+'\'})}))})};d&&loadHTML5(d[0].split(\'=\')[1],d[1].split(\'=\')[1])})(document.querySelector(\'[itemprop="embedURL"]\').content.match(/(aid=[^&]*|page=[^&]*)/g));void(0)'].join('');
							}else{//弹窗页面
							unsafeWindow.location.href = ['javascript:function loadHTML5(){$.getJSON("http://www.bilibili.com/m/html5?aid='+aid+'&page='+page+'&sid="+__GetCookie("sid"),function(a){a.src&&(window.html5data=a,$("#bofqi").html(\'<link type="text/css" href="http://static.hdslb.com/css/simple.v2.min.css" rel="stylesheet"/>\'),$.getScript("http://static.hdslb.com/js/simple.v2.min.js",function(){(new BiliH5Player).create({get_from_local:!0,comment:\'http://comment.bilibili.com/'+cid+'.xml\',image:window.html5data.img,video_url:\''+url+'\'})}))})};loadHTML5();void(0)'].join('');
							//console.log('javascript:function loadHTML5(){$.getJSON("http://www.bilibili.com/m/html5?aid='+aid+'&page='+page+'&sid="+__GetCookie("sid"),function(a){a.src&&(window.html5data=a,$("#bofqi").html(\'<link type="text/css" href="http://static.hdslb.com/css/simple.v2.min.css" rel="stylesheet"/>\'),$.getScript("http://static.hdslb.com/js/simple.v2.min.js",function(){(new BiliH5Player).create({get_from_local:!0,comment:\'http://comment.bilibili.com/'+cid+'.xml\',image:window.html5data.img,video_url:\''+url+'\'})}))})};loadHTML5();void(0)');
							$(div).css({
							width: width+"px",
							height: height+"px"
							});
							}
						} else { //html5无弹幕播放
							if(!type){
							$(div).css({
							width: width+"px",
							height: height+"px"
							});										
							}
							$(div).html('<video src="' + url + '" controls="controls" style="width:100%;height:100%"></video>');
						}
					}
				}
			}
		});
	}
	
								
	//css插入
	var css = '#load_manual_window{z-index:300;width:30px;cursor: pointer;left:40px;bottom:50px;position:fixed;padding: 0px 0px 10px;transition: all 0.1s linear 0s;background: none repeat scroll 0% 0% rgba(0, 0, 0, 0.5);color: #FFF;border: medium none;}#load_manual_window:hover{background-color: rgba(0, 0, 0, 0.7);}.singleplaybtn{cursor:pointer;box-shadow: 0px 1px 1px rgba(34, 25, 25, 0.4);background:none repeat scroll 0% 0% #684D75!important;border-radius: 4px;line-height: 14px;padding: 1px 3px;text-align: center;font-family: Calibri;font-size: 12px;min-width: 18px;}.bfpbtn{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 2px;transition-property:#000,color;transition-duration:0.3s;box-shadow:none;color:#FFF;text-shadow:none;border:medium none;background:none repeat scroll 0% 0% #00A1CB!important;}.bfpbtn.active{background:none repeat scroll 0% 0%  #F489AD!important;}.bfpbtn.normal{background:none repeat scroll 0% 0%  #B9B9B9!important;}.bfpbtn.notice{background-color:#A300C0!important;}.font{font-size:11px!important;}#window_play_list li{float:left;position:relative;width:30em;border-bottom:1px solid #B0C4DE;font:100% Verdana,Geneva,Arial,Helvetica,sans-serif;}.ui.corner.label{height:0px;border-width:0px 3em 3em 0px;border-style:solid;border-top:0px solid transparent;border-bottom:3em solid transparent;border-left:0px solid transparent;border-right-color:rgb(217,92,92)!important;transition:border-color 0.2s ease 0s;position:absolute;content:"";right:0px;top:0px;z-index:-1;width:0px;}.ui.corner.label i{display:inline-block;margin:3px 0.25em 0px 17px;width:1.23em;height:1em;font-weight:800!important;}.dialogcontainter{z-index:20000!important;}.dialogcontainter{height:400px;width:400px;border:1px solid #14495f;position:fixed;font-size:13px;}.dialogtitle{height:26px;width:auto;background-color:#C6C6C6;}.dialogtitleinfo{float:left;height:20px;margin-top:2px;margin-left:10px;line-height:20px;vertical-align:middle;color:#FFFFFF;font-weight:bold;}.dialogtitleico{float:right;height:20px;width:21px;margin-top:2px;margin-right:5px;text-align:center;line-height:20px;vertical-align:middle;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-21px 0px}.dialogbody{padding:10px;width:auto;background-color:#FFFFFF;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");}.dialogbottom{bottom:1px;right:1px;cursor:nw-resize;position:absolute;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-42px -10px;width:10px;height:10px;font-size:0;}.button-small{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 5px;}.button-flat-action{transition-duration:0.3s;box-shadow:none;background:none repeat scroll 0% 0% #7DB500;color:#FFF!important;text-shadow:none;border:medium none;border-radius:3px;}.player-list{box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);position:fixed;z-index:1000;left:10px;top:50px;width:400px!important;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");min-height:200px;max-height:400px;overflow: auto;}#player_content #bofqi{position:absolute;top:65px;left:10px;right:10px;bottom:10px;}#window-player{bottom:0;height:100%;left:0;right:0;top:0;width:100%;}.title:hover .single_player{display:inline;}.t:hover .single_player{display:inline;}a.single_player{display:none;}#bofqi_embed.hide,#bofqi.hide,#player_content.hide{margin-left:3000px!important;transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}#bofqi_embed,#bofqi,#player_content{transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}';
	var css1='#notice_area{position:fixed;bottom:24px;left:0;z-index:10;margin:0;padding:0;width:auto;text-align:left;z-index:9999}.notice_item{position:relative;z-index:11;display:table;margin:0 -500px 0;padding:0 8px 0 2px;width:auto;height:auto;border-left:4px solid #288ECF;border-radius:1px;background-color:#3A9BD9;box-shadow:0 1px 3px rgba(0,0,0,.302);color:#FFF;white-space:pre-wrap;word-break:break-all;font-weight:700;font-size:12px;line-height:24px;transition:all .5s ease 0s}.notice_success{background:#54A954 none repeat scroll 0 0;border-left:4px solid #54A954}.notice_error{background:#C13932 none repeat scroll 0 0;border-left:4px solid #C13932}.notice_info{background:#58BDDB none repeat scroll 0 0;border-left:4px solid #58BDDB}.notice_warn{background:#F9A125 none repeat scroll 0 0;border-left:4px solid #F9A125}.notice_inverse{background:#262626 none repeat scroll 0 0;border-left:4px solid #262626}.notice_normal{background:#004FCC none repeat scroll 0 0;border-left:4px solid #004FCC}';//这是仿ac娘消息框的UI
	GM_addStyle(css);GM_addStyle(css1);

	//高大上的拖动DIV和改变DIV大小功能，来自互联网脚本之家www.jb51.net，还有大花猫的元素监听
var z=1,i=1,left=10;var isIE=(document.all)?true:false;var Extend=function(destination,source){for(var property in source){destination[property]=source[property];}}
var Bind=function(object,fun,args){return function(){return fun.apply(object,args||[]);}}
var BindAsEventListener=function(object,fun){var args=Array.prototype.slice.call(arguments).slice(2);return function(event){return fun.apply(object,[event||window.event].concat(args));}}
var CurrentStyle=function(element){return element.currentStyle||document.defaultView.getComputedStyle(element,null);}
function create(elm,parent,fn){var element=document.createElement(elm);fn&&fn(element);parent&&parent.appendChild(element);return element};function addListener(element,e,fn){element.addEventListener?element.addEventListener(e,fn,false):element.attachEvent("on"+e,fn)};function removeListener(element,e,fn){element.removeEventListener?element.removeEventListener(e,fn,false):element.detachEvent("on"+e,fn)};var Class=function(properties){var _class=function(){return(arguments[0]!==null&&this.initialize&&typeof(this.initialize)=='function')?this.initialize.apply(this,arguments):this;};_class.prototype=properties;return _class;};var Dialog=new Class({options:{Width:400,Height:400,Left:100,Top:10,Titleheight:26,Minwidth:200,Minheight:200,CancelIco:true,ResizeIco:true,Info:"标题",Content:"无内容",Zindex:2},initialize:function(options){this._dragobj=null;this._resize=null;this._cancel=null;this._body=null;this._x=0;this._y=0;this._fM=BindAsEventListener(this,this.Move);this._fS=Bind(this,this.Stop);this._isdrag=null;this._Css=null;this.Width=this.options.Width;this.Height=this.options.Height;this.Left=this.options.Left;this.Top=this.options.Top;this.CancelIco=this.options.CancelIco;this.Info=this.options.Info;this.Content=this.options.Content;this.Minwidth=this.options.Minwidth;this.Minheight=this.options.Minheight;this.Titleheight=this.options.Titleheight;this.Zindex=this.options.Zindex;Extend(this,options);Dialog.Zindex=this.Zindex
var obj=['dialogcontainter','dialogtitle','dialogtitleinfo','dialogtitleico','dialogbody','dialogbottom'];for(var i=0;i<obj.length;i++){obj[i]=create('div',null,function(elm){elm.className=obj[i];});}
obj[2].innerHTML=this.Info;obj[4].innerHTML=this.Content;obj[1].appendChild(obj[2]);obj[1].appendChild(obj[3]);obj[0].appendChild(obj[1]);obj[0].appendChild(obj[4]);obj[0].appendChild(obj[5]);document.body.appendChild(obj[0]);this._dragobj=obj[0];this._resize=obj[5];this._cancel=obj[3];this._body=obj[4];with(this._dragobj.style){height=this.Height+"px";top=this.Top+"px";width=this.Width+"px";left=this.Left+"px";zIndex=this.Zindex;}
this._body.style.height=this.Height-this.Titleheight-parseInt(CurrentStyle(this._body).paddingLeft)*2+'px';addListener(this._dragobj,'mousedown',BindAsEventListener(this,this.Start,true));addListener(this._cancel,'mouseover',Bind(this,this.Changebg,[this._cancel,'0px 0px','-21px 0px']));addListener(this._cancel,'mouseout',Bind(this,this.Changebg,[this._cancel,'0px 0px','-21px 0px']));addListener(this._cancel,'mousedown',BindAsEventListener(this,this.Disappear));addListener(this._body,'mousedown',BindAsEventListener(this,this.Cancelbubble));addListener(this._resize,'mousedown',BindAsEventListener(this,this.Start,false));},Disappear:function(e){this.Cancelbubble(e);document.body.removeChild(this._dragobj);$('.player-list').remove();},Cancelbubble:function(e){this._dragobj.style.zIndex=++Dialog.Zindex;document.all?(e.cancelBubble=true):(e.stopPropagation())},Changebg:function(o,x1,x2){o.style.backgroundPosition=(o.style.backgroundPosition==x1)?x2:x1;},Start:function(e,isdrag){if(!isdrag){this.Cancelbubble(e);}
this._Css=isdrag?{x:"left",y:"top"}:{x:"width",y:"height"}
this._dragobj.style.zIndex=++Dialog.Zindex;this._isdrag=isdrag;this._x=isdrag?(e.clientX-this._dragobj.offsetLeft||0):(this._dragobj.offsetLeft||0);this._y=isdrag?(e.clientY-this._dragobj.offsetTop||0):(this._dragobj.offsetTop||0);if(isIE){addListener(this._dragobj,"losecapture",this._fS);this._dragobj.setCapture();}else{e.preventDefault();addListener(window,"blur",this._fS);}
addListener(document,'mousemove',this._fM);addListener(document,'mouseup',this._fS);if(GM_getValue('init360')==1)$("#player_content").addClass("hide");},Move:function(e){window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();var i_x=e.clientX-this._x,i_y=e.clientY-this._y;this._dragobj.style[this._Css.x]=(this._isdrag?Math.max(i_x,0):Math.max(i_x,this.Minwidth))+'px';this._dragobj.style[this._Css.y]=(this._isdrag?Math.max(i_y,0):Math.max(i_y,this.Minheight))+'px'
if(!this._isdrag)this._body.style.height=Math.max(i_y-this.Titleheight,this.Minheight-this.Titleheight)-2*parseInt(CurrentStyle(this._body).paddingLeft)+'px';},Stop:function(){$("#player_content").removeClass("hide");removeListener(document,'mousemove',this._fM);removeListener(document,'mouseup',this._fS);$('#player_content #bofqi').attr('width',$('.dialogcontainter').width()-20);$('#player_content #bofqi').css('width',$('.dialogcontainter').width()-20+'px');$('#player_content .player').css('width',$('.dialogcontainter').width()-20);GM_setValue('player_width',($('.dialogcontainter').width()-20));$('#player_content #bofqi').attr('height',$('.dialogcontainter').height()-70);$('#player_content #bofqi').css('height',$('.dialogcontainter').height()-70+'px');$('#player_content .player').css('height',$('.dialogcontainter').height()-70);GM_setValue('player_height',($('.dialogcontainter').height()-70));GM_setValue('div_left',($('.dialogcontainter').offset().left));if(isIE){removeListener(this._dragobj,"losecapture",this._fS);this._dragobj.releaseCapture();}else{removeListener(window,"blur",this._fS);};}})
function creat(title,content){$('.dialogcontainter').remove();new Dialog({Info:title=title,Left:GM_getValue('div_left'),Top:50,Width:(GM_getValue('player_width')+20),Height:(GM_getValue('player_height')+90),Content:content,Zindex:(2000)});i++;left+=10;}

	function addNodeInsertedListener(elCssPath,handler,executeOnce,noStyle){var animName="anilanim",prefixList=["-o-","-ms-","-khtml-","-moz-","-webkit-",""],eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};if(!noStyle){var css=elCssPath+"{",css2="";forEach(prefixList,function(prefix){css+=prefix+"animation-duration:.001s;"+prefix+"animation-name:"+animName+";";css2+="@"+prefix+"keyframes "+animName+"{from{opacity:.9;}to{opacity:1;}}";});css+="}"+css2;GM_addStyle(css);}
	if(handler){var bindedFunc=function(e){var els=document.querySelectorAll(elCssPath),tar=e.target,match=false;if(els.length!==0){forEach(els,function(el){if(tar===el){if(executeOnce){removeNodeInsertedListener(bindedFunc);}
	handler.call(tar,e);return;}});}};forEach(eventTypeList,function(eventType){document.addEventListener(eventType,bindedFunc,false);});return bindedFunc;}}
	function removeNodeInsertedListener(bindedFunc){var eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};forEach(eventTypeList,function(eventType){document.removeEventListener(eventType,bindedFunc,false);});}
})();