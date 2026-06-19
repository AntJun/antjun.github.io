---
title: Valine 评论系统与 LeanCloud 配置教程
tags: ["技术", "教程", "Code", "Valine", "评论"]
key: 100001
cover: /images/landing-cover/2019-11-01-Valine.png
author: Akira Ant
modify_date: 2020-01-12
article_header:
  type: overlay
  theme: dark
  background_color: "#203028"
  background_image:
    gradient: "linear-gradient(135deg, rgba(34, 139, 87 , .4), rgba(139, 34, 139, .4))"
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

[Valine](https://valine.js.org/){:target="_blank"} 需要配合 [LeanCloud](https://www.leancloud.cn/){:target="_blank"} 使用。

LeanCloud
: 是一站式后端云服务平台。Valine 会把评论数据存储在 LeanCloud 应用的 `Comment` Class 中，因此需要先创建应用并取得应用凭证。

### 获取 AppID 和 AppKey

首先[注册](https://leancloud.cn/dashboard/login.html#/signup){:target="_blank"}或[登录](https://leancloud.cn/dashboard/login.html#/signin){:target="_blank"}到 [LeanCloud](https://leancloud.cn/){:target="_blank"}，打开[控制台](https://leancloud.cn/dashboard/applist.html#/apps){:target="_blank"}。

点击[创建应用](https://leancloud.cn/dashboard/applist.html#/newapp){:target="_blank"}新建一个应用。

填写应用名称。个人博客的评论量通常不大，计价方案可按实际需求选择。

![创建应用](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/create%20app.png){:.shadow}

在 `设置` > `应用凭证` 中可查看到 AppID 和 AppKey。

![获取 AppID 和 AppKey](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/App%20Keys.png){:.shadow}

### 填写安全域名

> 为了您的数据安全，请填写`应用` > `设置` > `安全设置`中的 Web 安全域名。

由于 App ID 和 App Key 是完全暴露的，任何人都可以访问我们的资源。为了防止他人使用，我们需要配置 Web 安全域名，只有添加的域名才可以使用资源。

在 `应用` > `设置` > `安全设置` 中的 `Web 安全域名` 一栏填写站点域名后保存即可。

![设置 Web 安全域名](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/Secure%20domain.png){:.shadow}

**注意：如果调试时调用 `api.leancloud.cn` 返回 403，通常是 Web 安全域名、应用凭证、服务地址或 Class 权限配置不匹配导致的拒绝访问，不要按普通服务器目录权限问题处理。**
{:.warning}

![403 错误示例](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/403.png){:.shadow}

**检查填写的安全域名是否正确，或者可以考虑放弃安全域名。**

**检查并修改 `存储` > `Class` 中因设置了相应权限导致无法访问的权限设置。**
{:.error}

### 添加 HTML 片段

为你的页面添加以下代码，并将初始化对象中的 `appId` 和 `appKey` 改为刚刚获取到的值（其他配置可以先保持默认）。

{% highlight html %}

<head>
    ...
    <!--Valine 的核心代码库-->
    <script src="//unpkg.com/valine/dist/Valine.min.js"></script>
    ...
</head>
<body>
    ...
    <div id="vcomments"></div>
    <script>
        new Valine({
            el: '#vcomments',
            appId: '<AppID>',
            appKey: '<AppKey>'
        })
    </script>
</body>
{% endhighlight %}

### 使用 npm 安装（可选）

[在 npm 上查看 Valine](https://www.npmjs.com/package/valine){:.button .button--primary .button--rounded target="_blank"}

如果需要通过构建工具管理依赖，可以使用 npm 安装 Valine。安装后在打包入口中导入 Valine，而不是继续使用上方的 CDN 脚本。

新版 Node.js 集成了 npm，前往官方[下载最新版本](https://nodejs.org/en/){:target="_blank"}。
安装完 Node.js 后，可以通过在`命令提示符`中输入 `npm -v` 检查 npm 版本号。

直接用命令安装：

{% highlight bash %}

# Install valine

npm install valine --save
{% endhighlight %}

{% highlight javascript %}
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

[查看详细配置](https://valine.js.org/configuration.html){:.button .button--primary .button--rounded target="_blank"}

如要对配置进行更多修改，请在刚才填写 APP ID 与 APP KEY 的地方加入并修改相应的配置项。

如下，我添加了 `placeholder`、`avatar`、`visitor` 和 `recordIP` 这几个常用配置项。

{% highlight html %}

<script>
    new Valine({
        el: '#vcomments' ,
        appId: '<APP_ID>',
        appKey: '<APP_KEY>',
        avatar: 'mp',
        placeholder: '在此处填写评论',
        visitor: true,
        recordIP: false
    });
</script>

{% endhighlight %}

`notify` 和 `verify` 在 Valine `v1.4.0+` 中已经废弃，不建议继续写进新配置。
{:.warning}

## 评论数据管理

### 在 LeanCloud 应用中直接管理

评论数据都会存储在名为 `Comment` 的 Class 中，需要自行登录 `LeanCloud 应用` 管理。

进入你的`应用` > `存储` > `Comment`，之后你可以对所有评论进行操作。

![评论数据管理](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/manage%20comment.png){:.shadow}

### Valine-Admin

[查看 Valine Admin 配置手册](https://deserts.io/valine-admin-document/){:.button .button--primary .button--rounded target="_blank"}

建议配合 [@panjunwen](https://github.com/panjunwen){:target="_blank"} 开发的 [Valine-Admin](https://github.com/DesertsP/Valine-Admin){:target="_blank"} 使用。

> Valine Admin 是 Valine 评论系统的扩展和增强，主要实现评论邮件通知、评论管理、垃圾评论过滤等功能。支持完全自定义的邮件通知模板。基于 Akismet API 实现准确的垃圾评论过滤。此外，使用云函数等技术解决了免费版云引擎休眠问题，支持云引擎自动唤醒，漏发邮件自动补发。兼容云淡风轻及 Deserts 维护的多版本 Valine。

## 文章阅读量统计

注意：需要 `v1.2.0` 及以上版本
{:.warning}

[查看文章阅读量统计配置说明](https://valine.js.org/visitor.html){:.button .button--primary .button--rounded target="_blank"}

## 在其它框架或主题中使用

官方文档中列出了许多在其它博客系统及相应主题中的使用方式，你可以根据自己的需要按相应教程进行配置。

[在 Jekyll 中使用](https://valine.js.org/jekyll.html){:.button .button--primary .button--rounded target="_blank"}
[在 Hexo 中使用](https://valine.js.org/hexo.html){:.button .button--primary .button--rounded target="_blank"}
[在 VuePress 中使用](https://valine.js.org/vuepress.html){:.button .button--primary .button--rounded target="_blank"}

本站使用的是 [@Kitian616](https://github.com/kitian616){:target="_blank"} 的 [TeXt Theme](https://github.com/kitian616/jekyll-TeXt-theme){:target="_blank"}。其[官方文档](https://tianqi.name/jekyll-TeXt-theme/docs/zh/configuration#valine){:target="_blank"}中介绍了相关用法。

## 使用评论

![Valine 评论框](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/valine%20comment.png){:.shadow}

成功完成以上设置后，你所设置的网站或页面应该有评论输入框，如要对文章进行评论，直接输入信息发送即可。

- 未输入昵称时，评论会以 `Anonymous` 作为显示名称。

- 未输入邮箱时只会显示默认头像，同时无法收到评论回复邮件通知。

- 输入了网址后点击昵称将跳转到网址。

### 使用 Markdown 语法

本评论系统支持 Markdown，你可以使用 Markdown 语法输入评论（具体可参考 [Markdown 详细语法教程](https://segmentfault.com/markdown){:target="_blank"}）。同时，你可以点击「预览」按钮查看实时效果。

### 配置个人头像

Valine 默认使用 [Gravatar](https://cn.gravatar.com/){:target="_blank"} 作为评论列表头像。

请自行登录或注册 [Gravatar](https://cn.gravatar.com/){:target="_blank"}，然后修改自己的头像。

![Gravatar 设置](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/gravatar.png){:.shadow}

![添加 Gravatar 头像](https://cdn.jsdelivr.net/gh/AntJun/BlogImageHosting/img/gravatar%20add.png){:.shadow}

评论时，留下在 [Gravatar](https://cn.gravatar.com/){:target="_blank"} 注册时所使用的邮箱即可。

**注意：头像可能受 Gravatar 或镜像源缓存影响，修改后不一定会立即刷新。**
{:.warning}

## 参考

1. **[评论数据管理](#评论数据管理)**：
   - [云淡风轻](https://github.com/xCss){:target="_blank"}. [_"Valine - 快速开始"_](https://valine.js.org/quickstart.html){:target="_blank"}. 2017.
   - [Deserts](https://deserts.io/about/){:target="_blank"}. [_"Valine: 独立博客评论系统"_](https://deserts.io/diy-a-comment-system/){:target="_blank"}. Aug 14, 2017.
1. **[在其它框架或主题中使用](#在其它框架或主题中使用)**：
   - [kitian616](https://github.com/kitian616/jekyll-TeXt-theme){:target="_blank"}. [_"TeXt Theme 配置 - Valine"_](https://tianqi.name/jekyll-TeXt-theme/docs/en/configuration#valine){:target="_blank"}. Apr 12, 2018.

---
