---
title: Valine 评论系统与 LeanCloud 的结合使用
tag: ["技术", "教程", "Code", "Valine", "评论"]
key: 100001
cover: /images/landing-cover/2019-11-01-Valine.png
author: Akira Ant
modify_date: 2020-01-12
article_header:
  type: overlay
  theme: dark
  background_color: '#203028'
  background_image:
    gradient: 'linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))'
    src: /images/post/2019-11-01-valine.png
---

欢迎使用 Valine 评论系统！一款基于 LeanCloud 的快速、简洁且高效的无后端评论系统。
<!--more-->
{:.info}

---

## 为什么选择 Valine

- 安全、简洁
- 快速且高效
- 开源，自定义程度高
- 无后端实现
- Emoji 支持 🎅
- 支持安全验证码
- 支持邮件提醒
- 支持 Markdown 语法

## 在你的网站上使用 Valine

[Valine](https://leancloud.cn/){:target="_blank"} 与 [LeanCloud](https://www.leancloud.cn/){:target="_blank"} 结合使用。

LeanCloud
: 是行业领先的一站式后端云服务提供商，专注于为开发者提供一流的工具、平台和服务。 自 2013 年 9 月发布以来，LeanCloud 已经服务超过 22 万开发团队，其中既包括大量创业公司，也有大型商业项目。

### 获取 APP ID 和 APP KEY

首先[注册](https://leancloud.cn/dashboard/login.html#/signup){:target="_blank"}或[登录](https://leancloud.cn/dashboard/login.html#/signin){:target="_blank"}到 [LeanCloud](https://leancloud.cn/){:target="_blank"}，打开[控制台](https://leancloud.cn/dashboard/applist.html#/apps){:target="_blank"}。

点击[创建应用](https://leancloud.cn/dashboard/applist.html#/newapp){:target="_blank"}新建一个应用。

填写您的应用名字。个人博客的评论量不会很大，因此`计价方案`选择`开发版`即可（有钱随意）。

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/create app.png" alt="Create application" />{:.shadow}

在`设置` > `应用`中可查看到 APP ID 和 APP Key。

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/App Keys.png" alt="Get AppId and AppKey" />{:.shadow}

### 填写安全域名

> 为了您的数据安全，请填写`应用` > `设置` > `安全设置`中的 Web 安全域名。

由于 App ID 和 App Key 是完全暴露的，任何人都可以访问我们的资源。为了防止他人使用，我们需要配置 Web 安全域名，只有添加的域名才可以使用资源。

在`应用` > `设置` > `安全设置`中 `Web 安全域名`一栏填写我们站点的域名后点击保存即可。

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/Secure domain.png" alt="Set up a secure domain name" />{:.shadow}

**注意：如在网站调试过程中出现关于调用 `api.leancloud.cn` 的 403 报错，说明服务器理解客户的请求，但拒绝处理它，这是由于服务器上文件或目录的权限设置导致的 WEB 访问错误。**
{:.warning}

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/403.png" alt="403 Error" />{:.shadow}

**检查填写的安全域名是否正确，或者可以考虑放弃安全域名。**
<br/> **检查并修改`存储` > `Class` 中因设置了相应权限导致无法访问的权限设置。**
{:.error}

### 添加 Html 片段

为你的页面中添加以下代码，并修改初始化对象中的 `AppId` 和 `AppKey` 的值为上面刚刚获取到的值（其他可以默认）。

{% highlight html %}
<head>
    ...
    <!--LeanCloud 操作库-->
    <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
    <!--Valine 的核心代码库-->
    <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
    ...
</head>
<body>
    ...
    <div id="vcomments"></div>
    <script>
        new Valine({
            av: AV,
            el: '#vcomments',
            appId: '<AppID>',
            appKey: '<AppKey>'
        })
    </script>
</body>
{% endhighlight %}

### 使用 npm 安装（可选）

<a class="button button--primary button--rounded" href="https://www.npmjs.com/package/valine" target="_blank">在 npm 上查看 Valine</a>

如果你需要，你可以通过使用 npm 安装 Valine 。安装后直接将上方你添加的 HTML 片段中的 `//unpkg.com/valine`（CDN 路径） 改为`你托管的 Valine 路径`便可食用。

新版 Node.js 集成了 npm，前往官方[下载最新版本](https://nodejs.org/en/){:target="_blank"}。
安装完 Node.js 后，可以通过在`命令提示符`中输入 `npm -v` 检查 npm 版本号。

直接用命令安装：

{% highlight bash %}
# Install leancloud's js-sdk
npm install leancloud-storage --save
# Install valine
npm install valine --save
{% endhighlight %}

{% highlight javascript %}
// Register AV objects to the global
window.AV = require('leancloud-storage');

// Use import
import Valine from 'valine';
// or Use require
const Valine = require('valine');

new Valine({
    el:'#vcomments',
    // other config
})
{% endhighlight %}

**至此，您可以查看您的页面是否已经出现了评论功能。**
{:.success}

## 配置项

<a class="button button--primary button--rounded" href="https://valine.js.org/configuration.html" target="_blank">查看详情配置</a>

如要对配置进行更多修改，请在刚才填写 APP ID 与 APP KEY 的地方加入并修改相应的配置项。

如下，我添加了`notify` `verify` `avatar` 和 `placeholder` 这四个配置项。

{% highlight html %}
<script>
    new Valine({
        el: '#vcomments' ,
        appId: '<APP_ID>',
        appKey: '<APP_KEY>',
        notify: true,
        verify: true,
        avatar: 'mp',
        placeholder: '在此处填写评论'
    });
</script>
{% endhighlight %}

如果你觉得其验证码过于「反人类」，建议将 `verify` 一项改为 `false` 以取消验证码。
{:.warning}

## 评论数据管理

### 在 LeanCloud 应用中直接管理

评论数据都会存储在名为 `Comment` 的 Class 中，需要自行登陆 `LeanCloud 应用` 管理。

进入你的`应用` > `存储` > `Comment`，之后你可以对所有评论进行操作。

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/manage comment.png" alt="Comment Data Management" />{:.shadow}


### Valine-Admin

<a class="button button--primary button--rounded" href="https://deserts.io/valine-admin-document/" target="_blank">查看 Valine Admin 配置手册</a>

建议配合 [@panjunwen](https://github.com/panjunwen){:target="_blank"} 开发的 [Valine-Admin](https://github.com/DesertsP/Valine-Admin){:target="_blank"} 食用更佳。

> Valine Admin 是 Valine 评论系统的扩展和增强，主要实现评论邮件通知、评论管理、垃圾评论过滤等功能。支持完全自定义的邮件通知模板。基于Akismet API实现准确的垃圾评论过滤。此外，使用云函数等技术解决了免费版云引擎休眠问题，支持云引擎自动唤醒，漏发邮件自动补发。兼容云淡风轻及Deserts维护的多版本Valine。

## 文章阅读量统计

注意：需要 `v1.2.0` 及以上版本
{:.warning}

<a class="button button--primary button--rounded" href="https://valine.js.org/visitor.html" target="_blank">查看文章阅读量统计配置说明</a>

## 在其它框架或主题中使用

官方文档中列出了许多在其它博客系统及相应主题中的使用方式，你可以根据自己的需要按相应教程进行配置。

<a class="button button--primary button--rounded" href="https://valine.js.org/jekyll.html" target="_blank">在 Jekyll 中使用</a>
<a class="button button--primary button--rounded" href="https://valine.js.org/hexo.html" target="_blank">在 Hexo 中使用</a>
<a class="button button--primary button--rounded" href="https://valine.js.org/vuepress.html" target="_blank">在 VuePress 中使用</a>

本站使用的是 [@Kitian616](https://github.com/kitian616){:target="_blank"} 的 [Text Theme](https://github.com/kitian616/jekyll-TeXt-theme){:target="_blank"}。其[官方文档](https://tianqi.name/jekyll-TeXt-theme/docs/zh/configuration#valine){:target="_blank"}中介绍了相关用法。

## 使用评论

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/valine comment.png" alt="Valine Comment" />{:.shadow}

成功完成以上设置后，你所设置的网站或页面应该有评论输入框，如要对文章进行评论，直接输入信息发送即可。

- 在未输入昵称时发送的消息将以 `Anonymous` 的代名发送消息。

- 未输入昵称时将只显示默认头像，同时不会受到评论回复邮件通知。

- 输入了网址后点击昵称将跳转到网址。

### 使用 Markdown 语法

本评论系统支持 Markdown，您可以使用 Markdown 语法输入您想发表的评论（具体请参考 [Markdown 详细语法教程](https://segmentfault.com/markdown){:target="_blank"}）。同时，您可以点击「预览」按钮来查看实时效果。

### 配置个人头像

Valine 目前使用的是 [Gravatar](https://cn.gravatar.com/){:target="_blank"} 作为评论列表头像。

请自行登录或注册 [Gravatar](https://cn.gravatar.com/){:target="_blank"}，然后修改自己的头像。

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/gravatar.png" alt="Gravatar 01" />{:.shadow}

<img src="https://cdn.jsdelivr.net/gh/AntJun/Personal-Blog-Image-Storage/img/gravatar add.png" alt="Gravatar 02" />{:.shadow}

评论的时候，留下在 [Gravatar](https://cn.gravatar.com/){:target="_blank"} 注册时所使用的邮箱即可。

**注意：因 gravatar.cat.net 有七天的缓存期，修改头像后请耐心等待更新。**
{:.warning}

## 参考

1. **[评论数据管理](#评论数据管理)**：
	- [云淡风轻](https://github.com/xCss){:target="_blank"}. [*"Valine - 快速开始"*](https://valine.js.org/quickstart.html){:target="_blank"}. 2017.
	- [Deserts](https://deserts.io/about/){:target="_blank"}. [*"Valine: 独立博客评论系统"*](https://deserts.io/diy-a-comment-system/){:target="_blank"}. Aug 14, 2017.
1. **[在其它框架或主题中使用](#在其它框架或主题中使用)**：
	- [kitian616](https://github.com/kitian616/jekyll-TeXt-theme){:target="_blank"}. [*"TeXt Theme 配置 - Valine"*](https://tianqi.name/jekyll-TeXt-theme/docs/en/configuration#valine){:target="_blank"}. Apr 12, 2018.

---