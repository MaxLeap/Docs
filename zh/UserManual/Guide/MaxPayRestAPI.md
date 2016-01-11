### Server地址

>MaxPay目前支持北京数据中心，未来会增加国内其它数据中心

域名      | 位置
-------- | ---
https://api.maxleap.cn | 北京

### 支付渠道列表
渠道      	|说明		
-------- 		| ---			
ali_app	|支付宝应用	
ali_web|支付宝页面	
ali_qrcode|支付宝内嵌二维码支付	
wx_app|微信应用	
wx_native|微信公众号扫码支付	
wx_jsapi|微信公众号支付

### 支付接口
**请求路径**

***URL***
>/2.0/maxpay/bill

***Method***
>POST

***头信息***
>Content-Type = application/json
>
>X-ML-AppId = ${应用的ID}
>
>X-ML-Session-Token = ${应用内用户的登录信息}

***公共参数***

属性      	| 类型		|示例数据			|说明
-------- 		| ---			|----					|---
channel 	| String		|'ali'					|必填项，支付渠道
billNum    	| String  	|'00x98987'	|必填项，订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一
totalFee	| Int   	|9900					|必填项，交易金额,单位为分
subject		| String	|'图书-支付战争'	|必填项，订单主题
returnUrl	| String	|'http://maxleap.cn/returnUrl'|选填项,同步自动跳转url

***支付宝渠道的参数***

属性      	| 类型		|示例数据			|说明
-------- 		| ---			|----					|---
showUrl 	| String		|'http://maxleap.cn/showUrl'					|可选，支付宝网页支付(ali_web)的选填参数


***返回公共参数***

属性      	| 类型		|说明			|
-------- 		| ---			|----				
code | Integer |返回码，0为正常
msg | String | 返回信息， OK为正常
err | String | 具体错误信息
id | String | 成功发起支付后返回支付表记录唯一标识

***返回Code的含义***

属性      	| 类型		|说明			|
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

### 查询接口
**请求路径**

***URL***
>/2.0/maxpay/records

***Method***
>POST

***头信息***
>Content-Type = application/json
>
>X-ML-AppId = ${应用的ID}
>
>X-ML-Session-Token = ${应用内用户的登录信息}

***公共参数***

属性      	| 类型		|示例数据			|说明
--------- 		| ---			|----					|---
channel   | String		|'ali'					|选填项，支付渠道
billNum    	| String  	|'00x98987'	|选填项，订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一
status    | String | 'success' |选填，订单状态
startTime | Long | 1451890938648 |选填，订单创建时间的起始时间
endTime ｜Long ｜1451890939648｜选填，订单创建时间的终止时间
skip      |Integer| 0 |选填，分页参数，跳过条数
limit     ｜Integer｜ 100 ｜选填，分页参数，分页大小
order     ｜String | '-createdTime' |选填，排序项，"-"开头表示倒序，后紧跟需要排序的关键字。顺序则直接填写排序关键字


***返回公共参数***

属性      	| 类型		|说明			|
-------- 		| ---			|----				
code | Integer |返回码，0为正常
err | String | 具体错误信息
results:|JsonArray|查询结果

***返回Code的含义***

属性      	| 类型		|说明			|
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

***返回Results中一项的的含义***

属性      	| 类型		|示例数据｜说明			|
-------- 		| ---			|----			|----	
channel 	| String		|'ali'					|支付渠道
billNum    	| String  	|'00x98987'	|订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一
totalFee	| Int   	|9900					|交易金额,单位为分
createdTime | Long | 1451890938648|订单创建时间
endTime   ｜Long ｜1451890939648｜订单交易终止时间
status    | String | 'success' |订单状态
extras    ｜JsonObject|{"1": "2"}|创建订单传入的额外信息

