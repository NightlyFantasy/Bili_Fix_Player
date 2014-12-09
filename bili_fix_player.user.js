// ==UserScript==
// @name        bili_fix_player
// @namespace   bili
// @description 修复B站播放器,黑科技,列表页、搜索页弹窗,破乐视限制,提供高清、低清晰源下载,弹幕下载
// @include     /^.*\.bilibili\.(tv|com|cn)\/(video\/|search)?.*$/
// @include     /^.*bilibili\.kankanews\.com\/(video\/|search)?.*$/
// @version     3.8.2
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
2014-12-08重新兼容火狐魔镜，重新修复部分乐视源只播广告，采用改版bili播放器，弹窗分P列表标题显示
2014-11-25 博主太懒啊很多小功能修复不了(技术原因也有),本次只修复了视频下载有分段的情况和治疗下部分乐视源弹窗播放广告不播视频,博主无面向对象编程经验，此次更新尝试了部分类的写法，感觉萌(bu)萌(hui)哒(xie)。
2014-10-31  自动宽屏功能会自动强制替换视频，而且无论何种B站播放器都有效；重写了视频下载功能，因为原来的模糊视频接口坏了，此次修改成更加直观的下载
2014-09-27移除记录弹窗播放器垂直位置功能(因为部分chrome用户老是反应播放器不知所踪),重构弹窗函数，修复弹窗函数多次运行导致分P列表重叠无法选择，博主采用了新的元素点击事件函数，从而使每个弹窗元素只有唯一一个点击事件，并修复了在火狐下视频播放页替换播放器后的网页全屏（chrome下无解，等待大神帮助），重新处理监听ajax产生的新数据，使用了贴吧大花猫的监听函数，因此可以无须点击左下角的【重新渲染按钮】，但是在部分机器可能有卡顿，如果觉得卡顿可以自行删除307行的代码即可，增加按需替换播放器选项【以前是一律强制替换】，自动宽屏在弹窗和视频页大型播放器下并且强制替换选项开启有效，按需替换则部分有效[因为是替换后的视频才有效]
2014-09-15修复专题页导致按钮失效,在左侧下角增加一个【重新渲染弹窗按钮】,当部分地方没有弹窗按钮的时候，可以点击一下，然后应该有弹窗按钮了,新功能【视频页自动定位到播放器位置】,新功能【播放器自动宽屏[包括弹窗和视频页的播放器(大型)]】
2014-09-06由于B站可以自由切换新版旧版的首页，增加对其支持（增加重新渲染弹窗按钮，如果发现部分列表无弹窗按钮则点击），同时恢复记录弹窗播放器垂直位置，为保证播放器不会不知所踪，设置垂直位置有极限值，超过此值域会被自动初始化；
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
	if (GM_getValue('init') == undefined) { //初始化优化，只查询一次数据库
		if (GM_getValue('version') == undefined) GM_setValue('version', 1); //版本号
		if (GM_getValue('auto') == undefined) GM_setValue('auto', 1);
		if (GM_getValue('fix_type') == undefined) GM_setValue('fix_type', 1); //按需修复;强制修复
		if (GM_getValue('fix_firefox') == undefined) GM_setValue('fix_firefox', 0); //默认关闭修复火狐魔镜
		if (GM_getValue('player_size') == undefined) GM_setValue('player_size', 1);
		if (GM_getValue('pagebox_display') == undefined) GM_setValue('pagebox_display', 0);
		if (GM_getValue('pagebox_harm') == undefined) GM_setValue('pagebox_harm', 0);
		if (GM_getValue('init360') == undefined) GM_setValue('init360', 0);
		//if (GM_getValue('player_container')== undefined) GM_setValue('player_container', 1);//弹窗播放器的标签容器（iframe/embed）已经完美解决
		//初始化播放器宽高
		if (GM_getValue('player_width') == undefined) GM_setValue('player_width', 950);
		if (GM_getValue('player_height') == undefined) GM_setValue('player_height', 482);
		//初始化播放器外框位置
		//if (GM_getValue('div_top') == undefined) GM_setValue('div_top', 100);//设置垂直位置的时候，如果是长页而且是浮动播放器时候记录位置，会导致播放器不知所踪
		if (GM_getValue('div_left') == undefined) GM_setValue('div_left', 100);
		//自动定位播放器--来自火狐吧友
		if (GM_getValue('auto_locate') == undefined) GM_setValue('auto_locate', 1);
		//自动宽屏-来自牙刷科技冻猫
		if (GM_getValue('auto_wide') == undefined) GM_setValue('auto_wide', 0);
		GM_setValue('init', 1);
	}
	//欢迎屏幕
	var version = '3.8.2';
	var local_version = GM_getValue('version');
	if (version != local_version) {
	alert('\n\
	1:感谢使用Bili Fix Player版本号3.8.2[20141208]，阅读以下说明将有助于你更好地使用脚本\n\
	2:修复了治疗下部分乐视源弹窗播放广告不播视频[如古剑奇谭]，此时点击下治疗按钮即可(改版播放器来自网络)，注(修复上一版本播放器无效，博主大意了)\n\
	3:给弹窗列表增加标题，方便选择[示例，http://www.bilibili.com/sp/YOU下里面的[修正43P]YOU 合集弹窗]\n\
	4:增加火狐魔镜弹窗兼容，方便缩小窗口看电视剧（泥垢！其实是博主自己看电视剧\(^o^)/~，以前从来不看的，周末不上班啊实在无聊啊没有妹纸啊就看电视剧啊）\n\
	5:如果你发现BUG，可以随时提交给我。谢谢。http://bilili.ml/361.html\n\
	6:感谢您的支持，我们下一版本再见！');
	GM_setValue('version', version);
	}
	/**
-------------------------------用户界面GUI View-------------------------------------
*/
	//函数，插入可视化操作视图

	function insert_html(type) {
		var auto = GM_getValue('auto') ? '已打开' : '已关闭';
		var fix_type = GM_getValue('fix_type') ? '当前按需修复[自动宽屏部分视频有效]' : '当前强制修复[全部B站播放器自动宽屏有效]';
		var player_size = GM_getValue('player_size') ? '大型' : '小型';
		var fix_firefox = GM_getValue('fix_firefox') ? '已开启兼容火狐魔镜' : '已关闭兼容火狐魔镜';
		var display = GM_getValue('pagebox_display') ? '悬浮' : '默认';
		var harm = GM_getValue('pagebox_harm') ? '和谐娘打酱油中' : '默认[和谐娘和谐中]';
		var init360 = GM_getValue('init360') ? '已打开' : '已关闭';
		var auto_locate = GM_getValue('auto_locate') ? '已打开' : '已关闭';
		var auto_wide = GM_getValue('auto_wide') ? '已打开' : '已关闭';
		//var container=GM_getValue('player_container')?'iframe[无滚动条bug]':'embed[无拖放bug]';
		var div = '<div ><a style="color:red" id="bili-fix-player-installed" class="i-link">脚本</a>\
						<ul class="i_num i_num_a blborder" id="bili_fix_script">\
						<li><a>360浏览器兼容[非360勿开]:<bl id="init360" class="bfpbtn">' + init360 + '</bl></a><em></em></li>\
						<li><a>自动修复(修改后请刷新页面):<bl id="bili_fix" class="bfpbtn">' + auto + '</bl></a><em></em></li>\
						<li><a>兼容火狐魔镜[开启后大小播放器将无效且自动开启强制修复]:<bl id="fix_firefox" class="bfpbtn">' + fix_firefox + '</bl></a><em></em></li>\
						<li><a>修复模式(修改后请刷新页面):<bl id="fix-type" class="bfpbtn">' + fix_type + '</bl></a><em></em></li>\
						<li><a target="_blank" href="http://bilili.ml/361.html">若无限小电视则尝试关闭修复-BUG反馈</a><em></em></li>\
						<li><a>本页视频源:<bl style="color:#F489AD">' + type + '</bl></a><em></em></li>\
						<li><a class="font">视频下载[点击后,会产生分段列表,然后点击分段列表即可]</a><div class="m_num" id="av_source" cid="">\
						<a  id="hd_av_download">高清画质</a>\
						<a  id="ld_av_download">渣画质</a>\
						<div id="HD-Down" class="m_num"></div>\
						</div><em></em></li>\
						<li><a id="down_cid_xml" target="_blank">弹幕下载</a><em></em></li>\
						<li><a class="font">播放器大小(小型在火狐弹窗无BUG):<bl id="player_size" class="bfpbtn">' + player_size + '</bl></a><em></em></li>\
						<li><a>评论区分页导航:<bl id="pagebox-display" class="bfpbtn">' + display + '</bl></a><em></em></li>\
						<li><a>评论区和谐娘:<bl id="pagebox-harm" class="bfpbtn">' + harm + '</bl></a><em></em></li>\
						<li><a>视频页自动定位到播放器位置:<bl id="auto-locate" class="bfpbtn">' + auto_locate + '</bl></a><em></em></li>\
						<li><a>播放器自动宽屏[自动切换成强制修复]:<bl id="auto-wide" class="bfpbtn">' + auto_wide + '</bl></a><em></em></li>\
						<li><a id="bili_set_status">就绪中→_→</a><em></em></li>\
						</ul>\
						<span class="addnew_5">+10086</span></div>';
		$('li.m-i:nth-child(1) > a:nth-child(1)').prop('outerHTML', div);
		//监听修复按钮
		event_control.Listener('#bili_fix', 'auto', '已打开', '已关闭');
		//监听兼容火狐魔镜
		event_control.Listener('#fix_firefox', 'fix_firefox', '已开启兼容火狐魔镜', '已关闭兼容火狐魔镜');
		//监听播放器大小按钮
		event_control.Listener('#player_size', 'player_size', '大型', '小型');
		//监听评论分页功能显示切换
		event_control.Listener('#pagebox-display', 'pagebox_display', '悬浮', '默认');
		//监听评论和谐娘功能切换
		event_control.Listener('#pagebox-harm', 'pagebox_harm', '和谐娘打酱油中', '默认[和谐娘和谐中]');
		//360火星
		event_control.Listener('#init360', 'init360', '已打开,请刷新', '已关闭，请刷新');
		//自动定位播放器
		event_control.Listener('#auto-locate', 'auto_locate', '已打开,请刷新', '已关闭，请刷新');
		//自动宽屏
		event_control.Listener('#auto-wide', 'auto_wide', '已打开,且自动开启强制修复模式,请刷新', '已关闭，请按自己需要是否关闭强制修复模式，请刷新');
		//修复模式
		event_control.Listener('#fix-type', 'fix_type', '当前按需修复[自动宽屏部分视频有效],请刷新', '当前强制修复[即使是B站播放器,自动宽屏有效],请刷新');
		//下载高清
		var bfpbtn = document.querySelector("#hd_av_download");
		bfpbtn.addEventListener("click", function() {
			download_bili_av('HD')
		}, false);
		//下载渣画质
		var bfpbtn = document.querySelector("#ld_av_download");
		bfpbtn.addEventListener("click", function() {
			download_bili_av('LD')
		}, false);
	}

	//下载

	function download_bili_av(type) {
		if ($('#av_source').attr('cid') == '') {
			alert('错误，请再试一次，多次错误请报修');
		} else {
			var cid = $('#av_source').attr('cid');
			if (type == 'HD') {
				var url = 'http://interface.bilibili.com/playurl?appkey=0a99fa1d87fdd38c&platform=android&quality=2&cid=' + cid + '&otype=json&platform=android';
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					synchronous: false,
					onload: function(responseDetails) {
						if (responseDetails.status == 200) {
							var content = responseDetails.responseText;
							var c = eval('(' + content + ')');
							var durl = c.durl;
							for (var i in durl) {
								var url = durl[i]['url'];
								insert_download_button('HD', url, parseInt(i) + 1);
							}
						}
					}
				});
			} else {
				var url = 'http://interface.bilibili.com/playurl?platform=android&cid=' + cid + '&quality=1&otype=json&appkey=0a99fa1d87fdd38c&type=mp4';
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					synchronous: false,
					onload: function(responseDetails) {
						if (responseDetails.status == 200) {
							var content = responseDetails.responseText;
							var c = eval('(' + content + ')');
							var durl = c.durl;
							for (var i in durl) {
								var url = durl[i]['url'];
								insert_download_button('LD', url, parseInt(i) + 1);
							}
						}
					}
				});
			}
		}
	}
	//函数，插入下载按钮 20141031 接口更换成json

	function insert_download_button(type, url, count) {
		if (type == 'HD') {
			$('#HD-Down').append('<a href="' + url + '" target="blank">高清分段<bl style="color:purple;display:inline">' + count + '</bl></a>');
		} else {
			$('#HD-Down').append('<a href="' + url + '" target="blank">渣画下载<bl style="color:purple;display:inline>' + count + '</bl></a>');
		}
	}

	/**
-------------------------------函数 Model-------------------------------------
*/
	//函数，替换播放器

	function Replace_player(aid, cid) {
	if (GM_getValue('auto') == '1') {
	var wide = '';
	if (GM_getValue('auto_wide') == 1) var wide = '&as_wide=1';
	if (GM_getValue('fix_firefox') != '1') {
		if (GM_getValue('player_size') == '1') {
			document.getElementById('bofqi').innerHTML = '<iframe class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="482" width="950"></iframe>';
			fix_player_fullwin.fix_page();
		} else {
			document.getElementById('bofqi').innerHTML = '<embed id="bofqi_embed" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + wide + '" src="https://static-s.bilibili.com/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" style="width:100%;height:100%">';
			$('#bofqi').css({
				width: "960px",
				height: "520px"
			});
		}
	} else {
		document.getElementById('bofqi').outerHTML = '<embed id="bofqi_embed" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + wide + '" src="https://static-s.bilibili.com/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" height="520" width="960">';
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
						var cid = lp.cid;
						var type = lp.type;
						insert_html(type); //UI
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
						if (GM_getValue('fix_type') == 1) {
							var need_replace_player = $('#bofqi').html().match(/static\.hdslb\.com\/play\.swf|secure\.bilibili\.com\/secure,cid=/);
							if (!need_replace_player) {
								Replace_player(aid, cid); //按需替换播放器 
								console.log('正在按需替换播放器');
							} else {
								console.log('视频页面使用B站播放器，无需替换');
							}
						} else {
							console.log('正在强制替换播放器');
							Replace_player(aid, cid); //强制替换播放器 
						}
						if (GM_getValue('auto_locate') == 1) $('html,body').animate({
							scrollTop: $("#bofqi_embed,#bofqi").offset().top - 30
						}, 500);
						$('#av_source').attr('cid', cid); //给av_source设置cid
					} else {
						window_player_init(); //执行弹窗函数
						addNodeInsertedListener('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a,.top-list li a,.vidbox.zt  .t', function() {
							window_player_init(); //ajax重新渲染,有可能导致浏览器卡顿，若卡顿请删除此行(仅此一行)
						});
					}
				}
			}
		});
	}

	//在新番页面，通过弹窗，获取aid,cid然后进行播放

	function aid_build_player(aid) {
		//aid=971415;这个aid奇葩出错
		var url = 'http://api.bilibili.com/view?type=json&appkey=0a99fa1d87fdd38c&batch=1&id=' + aid;
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			synchronous: false,
			onload: function(responseDetails) {
				if (responseDetails.status == 200) {
					var Content = eval('(' + responseDetails.responseText + ')');
					var list = Content.list;
					if (list != undefined) {
						//默认播放第一个分P-------------------
						var p = 0;
						var lp = (list[p] == undefined) ? list[0] : list[p];
						var cid = lp.cid;
						if(GM_getValue('fix_firefox') != '1') {
							$('#player_content').html(window_player.
								default (aid, cid));							
						}else{
							$('#player_content').html(window_player.fix_firefox(aid, cid));
						}
						$('#div_fix_letv_button').attr('aid', aid);
						$('#div_fix_letv_button').attr('cid', cid);
						//分P列表和播放器------------------------------
						for (var i in list) {
							var cid = list[i].cid;
							var p = parseInt(i) + 1;
							var title= list[i].part;
							$('#window_play_list').append('<li class="single_play_list" data-field="aid=' + aid + '&cid=' + cid + '"><a  href="javascript:void(0);" style="color:#00A6D8;" >[' + p + 'p]'+title+'</a></li>');
						}
						if (!unsafeWindow.player_fullwin) setTimeout(fix_player_fullwin.fix_window, 0);
						//弹窗的分P播放
						$('.single_play_list').click(
							function() {
								$('#window_play_info').html('正在播放第<span style="color:#DB5140">' + $(this).find('a').html() + '</span>');
								var info = $(this).attr('data-field');
								var pattern = /aid=(\d+)&cid=(\d+)/ig;
								var val = pattern.exec(info);
								var aid = val === null ? '' : val[1];
								var cid = val === null ? '' : val[2];
								$('#div_fix_letv_button').attr('aid', aid);
								$('#div_fix_letv_button').attr('cid', cid);
								setTimeout(function() {
								if(GM_getValue('fix_firefox') != '1') {
									$('#player_content').html(window_player.
										default (aid, cid));							
								}else{
									$('#player_content').html(window_player.
										fix_firefox(aid, cid));
								}
								}, 0);
							});
					} else {
						alert('弹窗解析错误，请关闭弹窗重试，如果再次出现，请直接打开播放页播放');
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
		//新番列表弹窗UI
		$('.vd_list .title').each(
			function() {
				if ($(this).attr('has_window_btn') == undefined) {
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
				if ($(this).attr('has_window_btn') == undefined) {
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
		$('.result li .r a').each(
			function() {
				if ($(this).attr('has_window_btn') == undefined) {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href');
					var pattern = /\/video\/av(\d+)\//ig;
					var content = pattern.exec(href);
					var aid = content ? (content[1]) : '';
					if (aid != '') {
						var title = $(this).find('.t').html();
						$(this).find('.t').prepend('<a class="single_player singleplaybtn searchlist" href="javascript:void(0);" style="color:white;" data-field="' + aid + '">弹▶</a>');
						$(this).find('.t a').click(function() {
							single_player(aid, title)
						});
					}
				}
			});
		//带缩略图弹窗UI、和侧栏新投稿弹窗UI、首页的推荐栏弹窗、侧栏列表弹窗UI
		$('.vidbox.v-list li a,.bgm-calendar.bgmbox li a,.rlist li a,.rm-list li a,.r-list li a,.top-list li a').each(
			function() {
				if ($(this).attr('has_window_btn') == undefined) {
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
				if ($(this).attr('has_window_btn') == undefined) {
					$(this).attr('has_window_btn', 'true');
					var href = $(this).attr('href') == undefined ? $(this).parent('a').attr('href') : $(this).attr('href');
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
				if ($(this).attr('has_window_btn') == undefined) {
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
		var a = '<p id="window_play_title">脚本(｀・ω・´)正在加载中</p><div id="player_content">脚本(｀・ω・´)播放器正在努力加载中....</div>';
		var list_html = '<div class="player-list"><div class="sort"><i>分P列表</i></div><ul id="window_play_list"></ul></div>';
		var title_html = '<a class="mark_my_video singleplaybtn" href="javascript:void(0);" style="color:white;background:none repeat scroll 0% 0% rgb(0, 182, 228) !important;" data-field="' + aid + '" title="收藏该视频">★Mrak</a>&nbsp;&nbsp;&nbsp;<a class="singleplaybtn" href="http://www.bilibili.com/video/av' + aid + '/" style="color:white;background:none repeat scroll 0% 0% #1E344A!important;" target="_blank" title="前往播放页面">Go</a>&nbsp;&nbsp;&nbsp;<span style="color:#8C8983">' + title.replace('弹▶', '') + '</span>&nbsp;&nbsp;&nbsp;▶<span id="window_play_info"></span>';
		setTimeout(function() {
			creat(title_html, a); //创建可视化窗口
			$('.dialogcontainter').after(list_html);
			$('#window_play_info').html('正在播放第<span style="color:#DB5140">1P</span>');
			$('#window_play_title').html('<p><a id="div_positon_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #E54C7E;">固定播放器</a><a id="list_control_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #0CB3EE;">收缩分P列表[在左边]</a><a id="div_fix_letv_button" class="button-small button-flat-action" style="background: none repeat scroll 0% 0% #ED6A4C;">点我专治乐视源不服(乐视源只播广告的情况请点击)</a>[拖动标题可移动播放器，拖动右下角可改变播放器大小，设置后自动保存宽高和位置]。注意：如果需要使用火狐魔镜，需要在设置里面开启兼容火狐魔镜，并在点击魔镜分离播放器前拖拽改变播放器大小，并点击固定播放器，弹窗即可正常</p>');
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
				$('#player_content').html(window_player.fix_letv(aid, cid));
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
	api_get_cid(aid, page); //按照aid和分p获取cid并且替换播放器

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
	
	//设置
	var event_control = {
		Listener: function(selector, config_val, notice1, notice2) {
			var bfpbtn = document.querySelector(selector);
			bfpbtn.addEventListener("click", function() {
				event_control.Control(config_val, selector, notice1, notice2)
			}, false);
		},
		Control: function(config_val, selector, notice1, notice2) {
			GM_getValue(config_val) ? GM_setValue(config_val, 0) : GM_setValue(config_val, 1);
			var s = GM_getValue(config_val) ? notice1 : notice2;
			if ((config_val == 'auto_wide' && GM_getValue('auto_wide'))||(config_val == 'fix_firefox' && GM_getValue('fix_firefox'))) {
				GM_setValue('fix_type', 0);
			}
			$(selector).html(s);
			$(selector).toggleClass("active");
			$('#bili_set_status').html('<bl class="bfpbtn notice font">已更改,刷新生效_(:3」∠)_</bl>');
		}
	};
		
	//弹窗播放器
	var window_player = {
		init: function(aid, cid) {
			this.width = GM_getValue('player_width');
			this.height = GM_getValue('player_height');
			this.wide = '';
			if (GM_getValue('auto_wide') == 1) this.wide = '&as_wide=1';
		},
		default: function(aid, cid) {
			window_player.init(aid, cid);
			return '<iframe  id="window-player" class="player" src="https://secure.bilibili.com/secure,cid=' + cid + '&amp;aid=' + aid + this.wide + '" scrolling="no" border="0" framespacing="0" onload="window.securePlayerFrameLoaded=true" frameborder="no" height="' + this.height + '" width="' + this.width + '"></iframe>';
		},
		fix_firefox: function(aid, cid) {
			window_player.init(aid, cid);
			return '<embed id="window-player" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + this.wide + '" src="https://static-s.bilibili.tv/play.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" height="' + this.height + '" width="' + this.width + '">';
		},
		fix_letv: function(aid, cid) {
			window_player.init(aid, cid);
			return '<embed id="window-player" class="player" allowfullscreeninteractive="true" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" flashvars="cid=' + cid + '&aid=' + aid + this.wide + '" src="https://nightlyfantasy.github.io/Bili_Fix_Player/biliplus/player.swf" type="application/x-shockwave-flash" allowfullscreen="true" quality="high" wmode="window" height="' + this.height + '" width="' + this.width + '">';
		}
	};
	
	var fix_player_fullwin = {
		fix_init: function() {
			setTimeout(function() {
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
					'}());'
				].join('');
			}, 0);
		},
		fix_window: function() {
			fix_player_fullwin.fix_init();
			setTimeout(function() {
				location.href = 'javascript:void(' + function() {
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

	//css插入
	var css = '#load_manual_window,.dialogcontainter{text-align:center;}#load_manual_window{z-index:300;width:30px;cursor: pointer;left:40px;bottom:50px;position:fixed;padding: 0px 0px 10px;transition: all 0.1s linear 0s;background: none repeat scroll 0% 0% rgba(0, 0, 0, 0.5);color: #FFF;border: medium none;}#load_manual_window:hover{background-color: rgba(0, 0, 0, 0.7);}.singleplaybtn{cursor:pointer;box-shadow: 0px 1px 1px rgba(34, 25, 25, 0.4);background:none repeat scroll 0% 0% #684D75!important;border-radius: 4px;line-height: 14px;padding: 1px 3px;text-align: center;font-family: Calibri;font-size: 12px;min-width: 18px;}.bfpbtn{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 2px;transition-property:#000,color;transition-duration:0.3s;box-shadow:none;color:#FFF;text-shadow:none;border:medium none;background:none repeat scroll 0% 0% #00A1CB!important;}.bfpbtn.active{background:none repeat scroll 0% 0%  #F489AD!important;}.bfpbtn.notice{background-color:#A300C0!important;}.font{font-size:11px!important;}#window_play_list li{float:left;position:relative;width:30em;border-bottom:1px solid #B0C4DE;font:100% Verdana,Geneva,Arial,Helvetica,sans-serif;}.ui.corner.label{height:0px;border-width:0px 3em 3em 0px;border-style:solid;border-top:0px solid transparent;border-bottom:3em solid transparent;border-left:0px solid transparent;border-right-color:rgb(217,92,92)!important;transition:border-color 0.2s ease 0s;position:absolute;content:"";right:0px;top:0px;z-index:-1;width:0px;}.ui.corner.label i{display:inline-block;margin:3px 0.25em 0px 17px;width:1.23em;height:1em;font-weight:800!important;}.dialogcontainter *{z-index:9999!important;}.dialogcontainter{height:400px;width:400px;border:1px solid #14495f;position:fixed;font-size:13px;}.dialogtitle{height:26px;width:auto;background-color:#C6C6C6;}.dialogtitleinfo{float:left;height:20px;margin-top:2px;margin-left:10px;line-height:20px;vertical-align:middle;color:#FFFFFF;font-weight:bold;}.dialogtitleico{float:right;height:20px;width:21px;margin-top:2px;margin-right:5px;text-align:center;line-height:20px;vertical-align:middle;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-21px 0px}.dialogbody{padding:10px;width:auto;background-color:#FFFFFF;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");}.dialogbottom{bottom:1px;right:1px;cursor:nw-resize;position:absolute;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.gif");background-position:-42px -10px;width:10px;height:10px;font-size:0;}.button-small{font-size:12px;height:25.6px;line-height:25.6px;padding:0px 5px;}.button-flat-action{transition-duration:0.3s;box-shadow:none;background:none repeat scroll 0% 0% #7DB500;color:#FFF!important;text-shadow:none;border:medium none;border-radius:3px;}.player-list{box-shadow: 3px 3px 13px rgba(34, 25, 25, 0.4);position:fixed;z-index:1000;left:10px;top:50px;width:400px!important;background-image:url("http://nightlyfantasy.github.io/Bili_Fix_Player/bg.png");min-height:200px;max-height:400px;overflow: auto;}#player_content{position:absolute;top:80px;left:10px;right:10px;bottom:10px;}#window-player{bottom:0;height:100%;left:0;right:0;top:0;width:100%;}a.single_player{display:none;}a:hover .single_player{display:inline;}#bofqi_embed.hide,#bofqi.hide,#player_content.hide{margin-left:3000px!important;transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}#bofqi_embed,#bofqi,#player_content{transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;-o-transition:0.5s;}';
	GM_addStyle(css);

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
	if(!this._isdrag)
	this._body.style.height=Math.max(i_y-this.Titleheight,this.Minheight-this.Titleheight)-2*parseInt(CurrentStyle(this._body).paddingLeft)+'px';},Stop:function(){$("#player_content").removeClass("hide");removeListener(document,'mousemove',this._fM);removeListener(document,'mouseup',this._fS);$('#window-player').attr('width',$('.dialogcontainter').width()-20);$('#window-player').css('width',$('.dialogcontainter').width()-20+'px');GM_setValue('player_width',($('.dialogcontainter').width()-20));$('#window-player').attr('height',$('.dialogcontainter').height()-70);$('#window-player').css('height',$('.dialogcontainter').height()-70+'px');GM_setValue('player_height',($('.dialogcontainter').height()-70));GM_setValue('div_left',($('.dialogcontainter').offset().left));if(isIE){removeListener(this._dragobj,"losecapture",this._fS);this._dragobj.releaseCapture();}else{removeListener(window,"blur",this._fS);};}})
	function creat(title,content){$('.dialogcontainter').remove();new Dialog({Info:title=title,Left:GM_getValue('div_left'),Top:50,Width:(GM_getValue('player_width')+20),Height:(GM_getValue('player_height')+70),Content:content,Zindex:(2000)});i++;left+=10;}
	function addNodeInsertedListener(elCssPath,handler,executeOnce,noStyle){var animName="anilanim",prefixList=["-o-","-ms-","-khtml-","-moz-","-webkit-",""],eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};if(!noStyle){var css=elCssPath+"{",css2="";forEach(prefixList,function(prefix){css+=prefix+"animation-duration:.001s;"+prefix+"animation-name:"+animName+";";css2+="@"+prefix+"keyframes "+animName+"{from{opacity:.9;}to{opacity:1;}}";});css+="}"+css2;GM_addStyle(css);}
	if(handler){var bindedFunc=function(e){var els=document.querySelectorAll(elCssPath),tar=e.target,match=false;if(els.length!==0){forEach(els,function(el){if(tar===el){if(executeOnce){removeNodeInsertedListener(bindedFunc);}
	handler.call(tar,e);return;}});}};forEach(eventTypeList,function(eventType){document.addEventListener(eventType,bindedFunc,false);});return bindedFunc;}}
	function removeNodeInsertedListener(bindedFunc){var eventTypeList=["animationstart","webkitAnimationStart","MSAnimationStart","oAnimationStart"],forEach=function(array,func){for(var i=0,l=array.length;i<l;i++){func(array[i]);}};forEach(eventTypeList,function(eventType){document.removeEventListener(eventType,bindedFunc,false);});}
	
})();