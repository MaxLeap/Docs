# 云代码
## 简介
### 什么是云代码服务
云代码是部署运行在 MaxLeap 云引擎上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在 Web server上的 Web Service或 RESTful API。它对外提供的接口也是 RESTful API，也正是以这种方式被移动应用调用。

目前支持 Java，其他语言尽请期待。

<!-- 目前支持 Java、Python、Node.js，其他语言尽请期待。 -->
## 准备

如果您尚未安装 SDK，请先查阅[快速入门指南](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_REACTNATIVE)，安装 SDK 并使之在 Xcode 中运行。

**注意**：我们支持 iOS 7.0 及以上版本。

首先，需要开发云代码，实现所需的接口和 HOOK，开发以及发布过程请根据您的需求选择对应服务端语言

[Java 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA#CLOUD_CODE_ZH)

<!--
[Python 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_PYTHON#CLOUD_CODE_ZH)，[Node.js 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_NODEJS#CLOUD_CODE_ZH)
-->
## 云代码调用

发布云代码之后，客户端可以使用 `ML.Cloud.run(name, data, options)` 方法调用云函数。

假如在 CloudCode 中定义了一个名称为 `hello` 的函数，带一个名字为 `name` 的参数，返回值为输入的参数字典。现在调用这个云函数：

```js
import ML from 'maxleap-react-native'

ML.Cloud.run('hello', {name: 'Alex'})
.then(result => {
	console.log('cloud function result is ' + result)
})
```
