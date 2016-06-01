// ==UserScript==
// @name        bili_fix_player
// @namespace   bili
// @description B站播放器增强脚本，下载视频，可使用另外两种H5播放器，可弹窗播放等
// @include     /^.*\.bilibili\.(tv|com|cn)\/(video|search|sp).*$/
// @include     /^.*bilibili\.kankanews\.com\/(video|search|sp).*$/
// @include     /http://www.bilibili.com/(#page=*)?/
// @include     http://www.bilibili.com/bangumi/*
// @include  	  http://search.bilibili.com*
// @version     4.0.1
// @updateURL   https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player.meta.js
// @downloadURL https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player.user.js
// @require http://static.hdslb.com/js/jquery.min.js
// @require https://greasyfork.org/scripts/19694-abplayer/code/ABPlayer.js?version=125788
// @require https://greasyfork.org/scripts/19695-commentcorelibrary/code/CommentCoreLibrary.js?version=125789
// @grant       GM_xmlhttpRequest
// @grant       get_bfp_config
// @grant       set_bfp_config
// @grant       GM_addStyle
// @grant       unsafeWindow
// @author     绯色
// ==/UserScript==