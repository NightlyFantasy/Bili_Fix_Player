### Bili_Fix_Player|修复B站播放器

功能:修复B站播放器,黑科技,列表页、搜索页弹窗,破乐视限制,提供高清、低清晰源下载,弹幕下载;注意： 遇到无法播放问题请关闭脚本 

### USO已经挂了，项目托管于github，源码地址

项目主页【安装地址界面】为

### [项目页面](https://nightlyfantasy.github.io/Bili_Fix_Player/)

脚本地址：

### 地址1[推荐]：[github安装](https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player.user.js)

地址2：[greasyfork](https://greasyfork.org/scripts/740-bili-fix-player)

地址3[已经丢弃]：USO已经挂了，无法更新代码3.5.2，请使用下面的地址，顺便吐槽下USO，真是越来越垃圾)

2014-06-03增强弹窗播放器，[拖动窗口标题可移动播放器，拖动右下角可改变播放器大小，设置后自动保存宽高和位置]

![github](https://nightlyfantasy.github.io/Bili_Fix_Player/bili_fix_player_window.gif "github")

2014-05-25感谢吧友lzgptdgj提供BUG，在小型播放器下，屏蔽规则会无效的问题，已经修复

2014-05-14增加首页弹窗播放，基本实现全站可弹窗（首页新番专题列表除外等）

![github](http://bilili.ml/wp-content/uploads/2014/05/20140514093143.png "github")

脚本功能：

1：提供高清画质和低品质画质视频下载，提供xml弹幕下载，可自由切换是否启用脚本和播放器大小

![github](http://bilili.ml/wp-content/uploads/2014/05/QQ%E6%88%AA%E5%9B%BE20140513194058.png "github")

2：提供二级页面的弹窗播放效果，可以自由弹窗播放，如新番页面，MV页面和音乐页面（多P支持并显示当前播放P），乐视番弹窗即可破解

![github](http://bilili.ml/wp-content/uploads/2014/05/QQ%E6%88%AA%E5%9B%BE20140513194604.png "github")

3：提供在搜索页面的多P（多P支持并显示当前播放P），搜索爱奇艺视频时，弹窗播放也无法破解，只能使用海外代理后弹窗，即可正常播放，博主有无弹幕爱奇艺解决方案，但是无弹幕估计没人想要，因此不集成；

![github](http://bilili.ml/wp-content/uploads/2014/05/QQ%E6%88%AA%E5%9B%BE20140513194523.png "github")

### 概况安装方法：

1.火狐浏览器用户，在安装Greasemonkey扩展后安装该脚本即可使用

2.chrome浏览器（包括chrome壳子的诸如360，猎豹，搜狗等等的极速模式）用户，在安装Tampermonkey扩展后安装该脚本即可使用；

### 详细脚本的安装:
		火狐浏览器{
		1.在这个地址安装addons.mozilla.org/zh-CN/firefox/addon/greasemonkey安装这个扩展；
		2.重启火狐；
		3.在本页，点击install即可在B站使用
		}
		chrome(包括chrome壳的浏览器：包括chrome壳子的诸如360，猎豹，搜狗等等的极速模式){
		1.在谷歌应用商店搜索安装Tampermonkey扩展，然后同上；
		2.（chrome壳：包括chrome壳子的诸如360，猎豹，搜狗等等的极速模式）
		在应用商店搜索安装Tampermonkey扩展，然后同上；
		如果搜索不到，那么谷歌搜索Tampermonkey扩展，下载到本地，然后拖到扩展管理器安装扩展即可；
		}

### 出现无法播放情况先关闭自动修复
> 2013-12-14修复B站播放器无法在火狐魔镜弹窗播放

> 2014-01-23替换优酷、爱奇艺、搜狐为B站播放器

> 2014-03-28增加下载视频按钮
> 2014-05-10收益于自己的B站追番计划(http://v.myacg.ga或者http://weiyun.jd-app.com)，代码逻辑重构(不再区分视频源再解析视频，即是替换所有播放器为B站播放器)，并重写UI（将B站首页按钮换成脚本按钮），提高下载链接精准度，增加播放器大小选择

> 2014-05-10受诸多基佬要求，增加除首页外其他分类页面的弹窗播放(初衷是为了弹窗乐视源)

> 2014-05-11还是基佬要求，增加弹窗播放器分P效果，增加弹幕下载功能，在吧友大神田生的建议下，正则表达式加强匹配

> 2014-05-13增加搜索页面的弹窗播放，并且支持多P和显示当前P，增加模糊画质下载按钮，重写弹窗列表UI

### ------------以下信息提供给开发者-----------
> https://static-s.bilibili.tv/play.swf---新版播放器

> http://static.hdslb.com/play.swf---旧版播放器

> https://static-s.bilibili.tv/play_old.swf---考古级别播放器

感谢各位大神和B站爱好者的支持，跑路搬砖走起

### [BUG反馈地址](http://bilili.ml/361.html)
