---
title: Valine 评论系统与 LeanCloud 的结合使用
tag: ["技术", "Valine", "LeanCloud"]
key: 100001
pageview: true
cover: https://pic3.superbed.cn/item/5de8e4acf1f6f81c50ccbe4e.png
---

---

欢迎使用 Valine 评论系统！
<br/> 本站采用 Valine 评论系统，一款基于 [LeanCloud](https://leancloud.cn/) 的快速、简洁且高效的无后端评论系统。
<!--more-->

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

Valine 与 [LeanCloud](https://www.leancloud.cn/) 结合使用。

> LeanCloud 是行业领先的一站式后端云服务提供商，专注于为开发者提供一流的工具、平台和服务。 自 2013 年 9 月发布以来，LeanCloud 已经服务超过 22 万开发团队，其中既包括大量创业公司，也有大型商业项目。

### 获取 APP ID 和 APP KEY

首先[注册](https://leancloud.cn/dashboard/login.html#/signup)或[登录](https://leancloud.cn/dashboard/login.html#/signin)到 [LeanCloud](https://leancloud.cn/)，打开[控制台](https://leancloud.cn/dashboard/applist.html#/apps)。

点击[创建应用](https://leancloud.cn/dashboard/applist.html#/newapp)新建一个应用。
<br/> 填写您的应用名字。个人博客的评论量不会很大，因此`计价方案`选择`开发版`即可（有钱随意）。

![创建应用](https://i.loli.net/2019/12/09/zUkGZQN5d26APxB.png)

在`设置` > `应用`中可查看到 APP ID 和 APP Key。

![获取appid和appkey](https://i.loli.net/2019/12/09/y715gzc9fHuLDOm.png)

### 填写安全域名

> 为了您的数据安全，请填写`应用` > `设置` > `安全设置`中的 Web 安全域名。

由于 App ID 和 App Key 是完全暴露的，任何人都可以访问我们的资源。为了防止他人使用，我们需要配置 Web 安全域名，只有添加的域名才可以使用资源。

在`应用` > `设置` > `安全设置`中`Web 安全域名`一栏填写我们站点的域名后点击保存即可。

![设置安全域名](https://i.loli.net/2019/12/09/ZemSnpCirl5A7PD.png)

**注意：如在网站调试过程中出现关于调用 [api.leancloud.cn](api.leancloud.cn) 的 403 报错，说明服务器理解客户的请求，但拒绝处理它，这是由于服务器上文件或目录的权限设置导致的 WEB 访问错误。**
{:.warning}

![403 error](https://i.loli.net/2019/12/11/xFIKP4BenOtyrid.png)

<span style="color:red;"> **1. 检查填写的安全域名是否正确，或者可以考虑放弃安全域名。** </span>
<br/><span style="color:red;"> **2. 检查并修改`存储` > `Class` 中因设置了相应权限导致无法访问的权限设置。** </span>
{:.warning}

### 添加 Html 片段

为你的页面中添加以下代码，并修改初始化对象中的 `appId` 和 `appKey` 的值为上面刚刚获取到的值（其他可以默认）。

```html
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
            appId: '<YOUR_API_ID>',
            appKey: '<YOU_API_Key>'
        })
    </script>
</body>
```

### 使用 npm 安装（可选）

<a class="button button--primary button--rounded" href="https://www.npmjs.com/package/valine">在 npm 上查看 Valine</a>

如果你需要，你可以通过使用 npm 安装 Valine 。安装后直接将上方你添加的 HTML片段中的 `//unpkg.com/valine` 改为`你托管的 Valine 路径`即可。

新版 Node.js 集成了 npm，前往官方[下载最新版本](https://nodejs.org/en/)。
安装完 Node.js 后，通过在`命令提示符`中输入 `npm -v` 检查 npm 版本号。

直接用命令安装：

```
# Install leancloud's js-sdk
npm install leancloud-storage --save
# Install valine
npm install valine --save
```

```html
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
```

**至此，您可以查看您的页面是否已经出现了评论功能。**
{:.success}

## 配置项

<a class="button button--primary button--rounded" href="https://valine.js.org/configuration.html">查看详情配置</a>

如要对配置进行更多修改，请在刚才填写 APP ID 与 APP KEY 的地方加入并修改相应的配置项。
<br/> 如下，我添加了`notify` `verify` `avatar` 和 `placeholder` 这四个配置项。
```html
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
```

如果你觉得其验证码过于「反人类」，建议将 `verify` 一项改为 `false` 以取消验证码。
{:.warning}

## 评论数据管理

### 在 LeanCloud 应用中直接管理

评论数据都会存储在名为 `Comment` 的 Class 中，需要自行登陆 `LeanCloud 应用` 管理。

进入你的`应用` > `存储` > `Comment`，然后你可以对所有评论进行操作。

![评论数据管理](https://i.loli.net/2019/12/09/CYMLD9ePidywu4v.png)

### Valine-Admin

<a class="button button--primary button--rounded" href="https://deserts.io/valine-admin-document/">查看 Valine Admin 配置手册</a>

建议配合 [@panjunwen](https://github.com/panjunwen) 开发的 [Valine-Admin](https://github.com/DesertsP/Valine-Admin) 食用更佳。

> Valine Admin 是 Valine 评论系统的扩展和增强，主要实现评论邮件通知、评论管理、垃圾评论过滤等功能。支持完全自定义的邮件通知模板。基于Akismet API实现准确的垃圾评论过滤。此外，使用云函数等技术解决了免费版云引擎休眠问题，支持云引擎自动唤醒，漏发邮件自动补发。兼容云淡风轻及Deserts维护的多版本Valine。

## 文章阅读量统计

<a class="button button--primary button--rounded" href="https://valine.js.org/visitor.html">查看文章阅读量统计配置说明</a>

## 在其它博客框架或主题中使用

官方文档中列出了许多在其它博客系统及相应主题中的使用方式，你可以根据自己的需要按相应教程进行配置。

<a class="button button--primary button--rounded" href="https://valine.js.org/jekyll.html">在 Jekyll 中使用</a>
<a class="button button--primary button--rounded" href="https://valine.js.org/hexo.html">在 Hexo 中使用</a>
<a class="button button--primary button--rounded" href="https://valine.js.org/vuepress.html">在 VuePress 中使用</a>

本站使用的是 [@Kitian616](https://github.com/kitian616) 的 [Text Theme](https://github.com/kitian616/jekyll-TeXt-theme)。其[官方文档](https://tianqi.name/jekyll-TeXt-theme/docs/zh/configuration#valine)中介绍了相关用法。

## 使用评论

![Valine Comment.png](https://i.loli.net/2019/12/11/N9RBG2qEHJMPlvj.png)

成功完成以上设置后，你所设置的网站或页面应该有评论输入框，如要对文章进行评论，直接输入信息发送即可。

在未输入昵称时发送的消息将以 `Anonymous` 的代名发送消息。
<br/> 未输入昵称时将只显示默认头像，同时不会受到评论回复邮件通知。
<br/> 输入了网址后点击昵称将跳转到网址。

### 使用 Markdown 语法

本评论系统支持 Markdown，您可以使用 Markdown 语法输入您想发表的评论（具体请参考 [Markdown 详细语法教程](https://segmentfault.com/markdown)）。同时，您可以点击「预览」按钮来查看实时效果。

### 配置个人头像

Valine 目前使用的是 [Gravatar](http://cn.gravatar.com/) 作为评论列表头像。

请自行登录或注册 [Gravatar](http://cn.gravatar.com/)，然后修改自己的头像。

![Gravatar 01](https://i.loli.net/2019/12/11/79LM4kNdnVf8YEs.png)

![Gravatar 02](https://i.loli.net/2019/12/11/NmcxJ83OAYEtguS.png)

评论的时候，留下在 [Gravatar](http://cn.gravatar.com/) 注册时所使用的邮箱即可。

> 感谢 `gravatar.cat.net` 提供的补充服务。

**注意：因 gravatar.cat.net 有七天的缓存期，修改头像后请耐心等待更新。**
{:.warning}

## 部分内容参考

1. [Valine - 快速开始](https://valine.js.org/quickstart.html "快速开始 - Valine")
2. [Valine：独立博客评论系统](https://deserts.io/diy-a-comment-system/ "Valine：独立博客评论系统")
3. [TeXt Theme 配置 - Valine](https://tianqi.name/jekyll-TeXt-theme/docs/en/configuration#valine "TeXt Valine + LeanCloud")

---