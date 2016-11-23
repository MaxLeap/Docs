# 支付服务

MaxLeap 支付服务是为移动端应用以及 PC 网页量身打造的下一代支付系统，通过一个 SDK 便可以同时支持移动端以及 PC 端网页的多种主流支付渠道。

简称：MaxPay

## 接入流程
![Pay](../../../images/MaxPayJoinFlow.png "MaxPay 接入流程")

## 交易流程
这里我们将介绍 MaxPay 是如何完成交易的，包括支付和查询两部分。

### 支付
![Pay](../../../images/MaxPayPaymentSequence.png "MaxPay 支付流程")

### 查询
![Query](../../../images/MaxPayQuerySequence.png "MaxPay 查询流程")

## 交易管理
在“交易管理”中，我们可以查看当前 App 中发生的交易记录：

![](../../../images/pay_1.png)

列表提供了组合过滤功能:

* 状态过滤：可以过滤不同状态的订单 （支付成功，退款成功，未支付等）
* 渠道过滤：可以过滤不同渠道的订单 （支付宝移动支付，支付宝PC网页支付，支付宝二维码支付，微信App支付，微信公众号支付，微信公众号扫码支付等）
* 时间过滤：可以选择当天、最近7天、最近30天、最近60天以及自定义时间段的订单

## 配置渠道参数

在“ **应用设置** -> **支付配置** -> **渠道配置** ”中，我们可以配置相应的支付渠道要素信息

### 支付宝

目前支持：**移动支付**、**即时到帐**、**手机网站支付** 等支付宝产品，配置如下图所示

![](../../../images/pay_2.png)

### 微信支付

微信支付目前支持包括

 * 微信 App 支付
 * 微信公众号扫码支付

微信 App 支付的配置

![](../../../images/pay_3.png)

微信公众号支付的配置

![](../../../images/pay_4.png)

### 银联支付
银联支付分为： “银联 App 支付” 和 “银联网页支付”。

银联 App 支付的配置

![](../../../images/pay_5.png)

银联网页支付的配置

![](../../../images/pay_6.png)

### Apple Pay
尽请期待

## WebHook 设置

为了便于客户系统或者第三方系统处理客户的交易信息， MaxLeap 移动支付服务提供 WebHook 功能，可以按照客户要求把特定的事件结果推送到指定的地址以便于客户做后续处理。

假如您的业务在支付成功后无任何其他业务，则不需要配置 WebHook

MaxLeap 支持 **MaxLeap 云函数** 和 **自定义 URL** 两种类型 WebHook

需要强调的是，**WebHook 不是必须配置的**

#### MaxLeap 云函数

您可以使用 MaxLeap 云代码中的云函数来实现您的 WebHook 功能，MaxLeap 云函数会处理来自 移动支付的通知事件。使用 MaxLeap 云函数意味着您将不用自建服务器，详情请参考 [MaxLeap － 云代码](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_CODE_ZH)。
    
#### 自定义URL

  您也可以自建服务器来接收来自移动支付服务的通知事件。
    

### WebHook 列表

![pay_addwebhook.png](../../../images/pay_7.png)

### 配置你的 WebHook

#### 新增 WebHook
登录 MaxLeap 管理平台，在应用设置选项中配置。

新建一个 WebHook 事件的基本操作如下图所示，用户需要设置接收 WebHook 事件的地址、模式和事件类型。

其中，WebHook 的服务器可以选择 MaxLeap 提供的云函数，也可以是自己服务器的 URL。

下图演示使用 MaxLeap 云函数：

![pay_addwebhook.png](../../../images/pay_8.png)

自定义 URL:

![pay_addwebhook_url.png](../../../images/pay_9.png)

* WebHook 的云函数

	当支付事件发生时，MaxLeap 会向用户注册的 WebHook 推送消息，用户可以直接使用 MaxLeap 提供的云函数来处理这些消息，这样就不需要自己建立服务器了。
	
* WebHook 的URL

	MaxLeap 可以向用户自己的服务器推送消息，你也可以根据自己的需要添加特殊的 Http Headers。

* WebHook 的模式

    WebHook 支持 Test 模式和 Live 模式，即事件中包含的数据内容可以源于测试环境也可以源于生产环境。
    
* WebHook 支持的事件

	目前 WebHook 仅支持支付成功事件。

#### 编辑 WebHook
在 WebHook 列表中，点击“编辑”图标可以编辑该条 WebHook。

#### 切换 WebHook 模式
WebHook 支持 Test 模式和 Live 模式，

* Test 模式为测试模式，即可以在 MaxPay 控制台发送测试数据测试接收URL是否正常；
* Live 模式为生产环境，即正常交易记录会通知至该URL。
在 WebHook 列表中， 点击对应的模式按钮即可切换模式：

![pay_changewebhookmode.png](../../../images/pay_7.png)

#### 删除 WebHook
如果一个 WebHook 不再使用，可以点击 WebHook 列表中的“删除”图标来删除它。

### 接收 WebHook 通知
* 当一个支付事件发生后，将 POST 一个 HTTP 请求到 Webhook，数据是以 Json 的形式放到 body 里。
* 你需要接受该请求并处理数据：返回 http 状态码 200 表示成功；返回的状态码不是 200 或者超时未返回，即表示失败
* 失败后 MaxLeap 将尝试发送多达 10 次的 Webhook 通知直到返回 200 的状态码，
* 间隔为 1分钟,5分钟,10分钟,30分钟,1小时,2小时,4小时,8小时,16小时,24小时，若超过该次数，便不再尝试。

### 验证 WebHook 签名（可选）
MaxPay 的 WebHook 通知中包含的签名信息，签名放在了请求的 Json 里 sign中，除此之外还有一个 timestamp 字段。

* 用户需用自己的 MaxLeap 的 Appid，MasterKey 和 timestamp 依次连接成一个字符串。
* 后用 Md5 算法对该字符串加密得到 16 进制表示的字符串。
* 得到的字符串与 sign 进行比较，若内容相同，则验证通过，否则失败。

用户再自行确认金额等订单信息是否正确。

### 测试 WebHook

完成 WebHook 的配置后，你可以使用 WebHook 的测试功能对你填写的地址进行测试。

你可以在已配置的 WebHook 中选择事件类型发起测试，你将看到 MaxLeap 向你填写的 URL 发送的请求内容以及你的服务器向 MaxLeap 服务器返回的内容。

MaxLeap 将根据你返回的 HTTP 状态码判断你的服务器是否接收成功。

在 Webhook 列表中，点击“测试”图标可以测试该条 WebHook 是否配置成功。

![pay_changewebhookmode.png](../../../images/pay_10.png)

MaxLeap 云函数类型的 WebHook 测试：

![pay_testwebhook_cloudfunction.png](../../../images/pay_testwebhook_cloudfunction.png)

自定义 URL 的 WebHook 测试：

![pay_testwebhook.png](../../../images/pay_testwebhook.png)

## 费用
MaxLeap 不收取任何费用，各支付渠道单独收费与 MaxLeap 无关

## FAQ
### 使用 MaxLeap 移动支付有哪些条件

* 申请好第三方支付渠道账户
* 具备基础开发能力

### 是否支持个人开发者？
支持。只要你能在第三方支付渠道（例如支付宝，微信支付等）开通账号。

### MaxLeap 移动支付费用怎么算
MaxLeap 不收取任何费用，各支付渠道收费情况根据对应渠道的要求

### WebHook 是什么东西，是否必须配置
为了便于您的系统处理交易成功信息， MaxLeap 提供 WebHook 功能，可以按照您的要求把特定的事件结果推送到指定的地址以便于您做后续处理

比如您的业务逻辑是，用户支付成功后给需给其发送短信或者邮件，那么您此时需要配置 WebHook；发送短信或者邮件的业务逻辑，您可以自行搭服务器实现或者使用 MaxLeap 云函数

如果您自行搭建服务器还发送短信或者邮件，那您就需要配置自定义 URL 形式 WebHook，来接收 MaxLeap 发送的支付成功事件，成功接收后，发送短信或者邮件

如果您是使用 MaxLeap 云代码来实现发送短信或邮件，那么您只需要选择对应的 MaxLeap 云函数作为 WebHook，来接收支付成功事件，成功接收后，发送短信或者邮件

假如您的业务在支付成功后无任何其他业务，则不需要配置 WebHook

需要强调的是，**WebHook 不是必须配置的**


## SDK 集成

### 基础 API 库 MaxPayLib
MaxPayLib 是不含界面的基础能力库，封装支付、交易查询和第三方渠道调用等API，引用到 App 工程中后，需要开发者自己实现 UI 界面，相对较轻量，适用于对 UI 有较高订制需求的开发者。

[iOS 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#MAXPAY_ZH)

[Android 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#MAXPAY_ZH)

[PHP 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_PHP#MAXPAY_ZH)

### 界面组件 MaxPayKit
MaxPayKit 是将支付渠道选择等功能封装为 UI 组件，通过简短的代码，您就可以直接将以上界面集成到您的 App 产品中，省去大量的开发调试时间，并且您可以修改标准 UI 组件代码。您也可以针对自己界面需求自由设计开发。

#### iOS
[Module-MaxPay-iOS](https://github.com/MaxLeap/Module-MaxPay-iOS)

#### Android
[Module-MaxPay-Android](https://github.com/MaxLeap/Module-MaxPay-Android)

 
<!--
## 开放 REST API
[开放API文档](ML_DOCS_REST_API_MAXPAY)
-->

## 样例应用
### iOS
[Sample-MaxMall-iOS](https://github.com/MaxLeap/Sample-MaxMall-iOS)

<!--
### Android
[Sample-MaxMall-Android](https://github.com/MaxLeap/Sample-MaxMall-Android)
-->
