# 移动支付

## API 列表
URL	| HTTP	|功能
------|--------|--------
`maxpay/bill`|	POST |	支付
`maxpay/records`| POST | 支付查询


## API 详解

### 支付

#### 支付渠道说明
渠道      	|说明
-------- 		| ---
ali_app	|支付宝移动支付
ali_web|支付宝网页支付
ali_wap|支付宝手机网页支付
wx_app|微信移动支付
wx_native|微信扫码支付
unipay_app|银联移动支付
unipay_web|银联网页支付


#### 头信息说明
属性      	| 值
------		| ---
Content-Type | application/json
X-ML-AppId | ${应用的ID}
X-ML-Session-Token | ${应用的SessionToken}

#### 公共参数信息说明
属性      	| 类型		|示例数据			|说明
-------- 		| ---			|----					|---
channel 	| String		|'ali'					|必填项，支付渠道
billNum    	| String  	|'00x98987'	|必填项，订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一
totalFee	| Int   	|9900					|必填项，交易金额,单位为分
subject		| String	|'图书-支付战争'	|必填项，订单主题
extras    | Object  |{"key1":"value1","key2":"value2"}|选填项,附加数据,JsonObject类型
returnUrl	| String	|'http://maxleap.cn/returnUrl' |选填项,同步自动跳转url,若为支付宝网页支付则必填
showUrl 	| String		|'http://maxleap.cn/showUrl'					|可选，支付宝网页支付(ali_web)的选填参数


#### 返回公共数据说明
属性      	| 类型		|说明
-------- 		| ---			|----
code | Integer |返回码，0为正常
msg | String | 返回信息， OK为正常
err | String | 具体错误信息
id | String | 成功发起支付后返回支付表记录唯一标识

#### 返回alipay的特有数据
属性      	| 类型		|说明
-------- 		| ---			|----
ali_web | String | 跳转到用户支付的连接
ali_app | String | app使用的string
ali_wap | String | 跳转到用户支付的连接

#### 返回wxpay_native的特有数据
属性      	| 类型		|说明
-------- 		| ---			|----
prepayid|String|微信prepay_id
codeUrl|String|微信二维码

#### 返回wxpay_app的特有数据
属性      	| 类型		|说明
-------- 		| ---			|----
appid|String|微信应用id
noncestr|String|随机字符串
package|String|微信package参数
partnerid|String|微信商户id
prepayid|String|支付id
sign|String|签名
timestamp|String|时间戳

#### 返回unipay_web的特有数据

属性      	| 类型		|说明
-------- 		| ---			|----
html  | String |包含一个自动提交表单的html

#### 返回unipay_app的特有数据
属性      	| 类型		|说明
-------- 		| ---			|----
tn    | String |支付流水号，用于手机sdk


#### 返回Code的含义
属性      	| 类型		|说明
-------- 		| ---			|----
0 | OK | 成功
1 | APP_INVALID | 根据app_id找不到对应的APP或者app_sign不正确
2 | PAY_FACTOR_NOT_SET | 支付要素在后台没有设置
3 | CHANNEL_INVALID | channel参数不合法
4 | MISS_PARAM | 缺少必填参数
5 | PARAM_INVALID | 参数不合法
6 | CERT_FILE_ERROR | 证书错误
7 | CHANNEL_ERROR | 渠道内部错误
14 | RUN_TIME_ERROR | 实时未知错误，请与技术联系帮助查看

#### 示例
调用支付请求,前提是你已经为你的应用配置了相关渠道支付参数(如何配置请参考[支付服务-配置渠道参数](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#MAXPAY_CHANNEL)),如果你已经配置完你的渠道参数,你可以这样发起一个`支付宝网页支付`请求:

    curl -X POST \
          -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
          -H "X-ML-Session-Token: U9_sVnH_MRfmXYDRnug-jtF_FtD65RHlrNxWhHr-l5k" \
          -H "Content-Type: application/json" \
          -d '{ "channel": "ali_web","billNum": "5721d724bee82c77290c29e9","totalFee": 1,"subject":"test","extras":{"t":"2"},"returnUrl":"http://maxleap.cn/returnUrl","showUrl":"http://maxleap.cn/showUrl"}' \
          https://api.maxleap.cn/2.0/maxpay/bill

返回结果:

    {
        "id":"5721d724bee82c77290c29e9",
        "ali_app":"_input_charset=\"utf-8\"&notify_url=\"http://101.95.153.34:8888/maxpay/alinotify\"&out_trade_no=\"5721d724bee82c77290c29e9\"&partner=\"2088121305224121\"&payment_type=\"1\"&seller_id=\"2088121305224121\"&service=\"mobile.securitypay.pay\"&sign=\"n9Nk%2BshO%2BuhFOUxIgCLerbYnrMCcSe26ZNVcHxVgaX7yHfzv4EeeIAYCLzQkoYHL0zPLtmaHR8Gg0IXuyt1ANCTxM%2B8L3Femvq%2FUw22WCmOwR6ZWmv3ESrQ6uOuwekNa4uXK9SihmQQBYWKgsbJWdAhGo62dmMzBu2RNyE5wdTA%3D\"&sign_type=\"RSA\"&subject=\"test\"&total_fee=\"0.01\"",
        "ali_web":"https://mapi.alipay.com/gateway.do?_input_charset=utf-8&notify_url=http://101.95.153.34:8888/maxpay/alinotify&out_trade_no=5721d724bee82c77290c29e9&partner=2088121305224121&payment_type=1&seller_id=2088121305224121&service=create_direct_pay_by_user&sign=7d8515a7d3ba68ebbfafc1236a487c0b&sign_type=MD5&subject=test&total_fee=0.01",
        "ali_wap":"https://mapi.alipay.com/gateway.do?_input_charset=utf-8&notify_url=http://101.95.153.34:8888/maxpay/alinotify&out_trade_no=5721d724bee82c77290c29e9&partner=2088121305224121&payment_type=1&seller_id=2088121305224121&service=alipay.wap.create.direct.pay.by.user&sign=2e02ab9c76c1efcd0e72ddaad88b1d91&sign_type=MD5&subject=test&total_fee=0.01",
        "msg":"OK",
        "code":0
    }


需要注意的是,返回结果里包含了`ali_web`,`ali_app`等多个返回参数URL,你应该根据请求里的channel值来选择对应的URL来完成支付

你可以这样发起一个`微信移动支付`请求:

    curl -X POST \
          -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
          -H "X-ML-Session-Token: U9_sVnH_MRfmXYDRnug-jtF_FtD65RHlrNxWhHr-l5k" \
          -H "Content-Type: application/json" \
          -d '{ "channel": "wx_app","billNum": "5721d724bee82c77290c29e9","totalFee": 1,"subject":"test","extras":{"t":"2"}}' \
          https://api.maxleap.cn/2.0/maxpay/bill
          
返回结果:

    {
        "appid":"wx85fcd0162fdd8c11",
        "noncestr":"acc7a298fa3e4693a43886932ccb0497",
        "package":"Sign=WXPay",
        "partnerid":"1301506401",
        "prepayid":"wx20160428173420f12d329a3f0305120260",
        "sign":"A560ED5DFA0721913E598E4DC4C5AD36",
        "timestamp":"1461836061",
        "id":"5721d91bbee82c77290c29ea",
        "code":0
    }
    
这个结果都是微信支付的特有数据,拿到这些数据你可以完成你后续的微信支付了

你可以这样发起一个`银联移动支付`请求:

    curl -X POST \
        -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
        -H "X-ML-Session-Token: U9_sVnH_MRfmXYDRnug-jtF_FtD65RHlrNxWhHr-l5k" \
        -H "Content-Type: application/json" \
        -d '{ "channel": "unipay_app","billNum": "5721d724bee82c77290c29e9","totalFee": 1,"subject":"test","extras":{"t":"2"}}' \
        https://api.maxleap.cn/2.0/maxpay/bill
        
返回结果:

    {
        "tn":"201604281737505105498",
        "id":"5721d9eebee82c77290c29eb",
        "code":0
    }

得到返回结果中的tn支付流水号,你便可以通过手机SDK完成后续的银联支付了

### 支付查询

#### 头信息说明
属性      	| 值
------		| ---
Content-Type |application/json
X-ML-AppId | ${应用的ID}
X-ML-MasterKey | ${应用的MasterKey}

#### 参数说明
属性      	| 类型		|示例数据			|说明
------		| ---			|----					|---
channel   | String		|'ali'					|选填项，支付渠道
billNum    	| String  	|'00x98987'	|选填项，订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一
status    | String | 'success' |选填，订单状态
startTime | Long | 1451890938648 |选填，订单创建时间的起始时间
endTime   |Long | 1451890939648 |选填，订单创建时间的终止时间
skip      |Integer| 0 |选填，分页参数，跳过条数
limit     |Integer|100 |选填，分页参数，分页大小
order     |String |'-createdTime' |选填，排序项，"-"开头表示倒序，后紧跟需要排序的关键字。顺序则直接填写排序关键字

#### 返回数据
属性      	| 类型		|说明
-------- 		| ---			|----
code | Integer |返回码，0为正常
err | String | 具体错误信息
results:|JsonArray|查询结果

#### 返回Code的含义
属性      	| 类型		|说明
-------- 		| ---			|----
0 | OK | 成功
1 | APP_INVALID | 根据app_id找不到对应的APP或者app_sign不正确
2 | PAY_FACTOR_NOT_SET | 支付要素在后台没有设置
3 | CHANNEL_INVALID | channel参数不合法
4 | MISS_PARAM | 缺少必填参数
5 | PARAM_INVALID | 参数不合法
6 | CERT_FILE_ERROR | 证书错误
7 | CHANNEL_ERROR | 渠道内部错误
14 | RUN_TIME_ERROR | 实时未知错误，请与技术联系帮助查看

#### 返回Results中一项的的含义
属性      	| 类型		|示例数据|说明			|
-------- 		| ---			|----	|----
id|String|568a18fad4c6062dcda477b2|订单纪录的唯一id
channel 	| String		|'ali'					|支付渠道
billNum    	| String  	|'00x98987'	|商户传入订单号
totalFee	| Int   	|9900					|交易金额,单位为分
createdTime | Long | 1451890938648|订单创建时间
endTime   |Long |1451890939648|订单交易终止时间
status    |String |'success' |订单状态
extras    |JsonObject|{"1": "2"}|创建订单传入的额外信息




下面举例发起一个查询4月22日-四月28日内所有支付宝网页支付的交易列表请求:

    curl -X POST \
        -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
        -H "X-ML-MasterKey: NkZCeHprbjlKN2ZIOEtVOTBiLU5GQQ" \
        -H "Content-Type: application/json" \
        -d '{ "channel":"ali_web","startTime": 1461254400000,"endTime": 1461859199000,"skip": 0,"limit": 21}' \
        https://api.maxleap.cn/2.0/maxpay/bill

返回结果:

    {
        "results":[
            {
                "billNum":"5721df20bee8bb1b17703533",
                "channel":"ali_web",
                "createdTime":1461837602028,
                "currency":"CNY",
                "extras":{"t":"2"},
                "id":"5721df21bee87096cb665f6a",
                "money":"ï¿¥ 0.01",
                "status":"created",
                "totalFee":1
            }
        ],
        "code":0
    }
    
    