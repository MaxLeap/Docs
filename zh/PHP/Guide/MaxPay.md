# MaxPay
## 简介

目前支持支付宝即时到帐支付功能，以及根据订单号查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用
请使用php5.4以上版本,并安装php-curl等相关模块

首先请<a class="download-sdk" href="https://github.com/MaxLeap/SDK-MaxPay-PHP/tree/1.0" target="_blank">下载php-sdk</a>

###一、 支付
####1. require "MLPay.php";
####2. 填充数组 $data ，内容包括
#####必填: 
*  appid: 由MaxLeap 后台获取,类型:String
*  token: 由MaxLeap 后台获取,类型:String
*  billNum: 订单号，需要保证唯一，由客户端提供，需请自行确保在商户系统中唯一,类型:String
*  channel: 支付渠道, 目前支持 ali_web,类型:String
*  totalFee: 整数,单位为分,类型:Integer
*  subject: 订单主题,类型:String
#####可选:
*  extras: 附加数据, 类型:Array
*  returnUrl: 同步自动跳转url类型:String
####3. 静态调用 $result = MLPayApi::bill($data);
####4. 返回值包含在$result中,结构如下:
```
    {
        code:0,
        msg:"OK",
        err:"",
        id:"",
        ali_app:"",
        ali_web:""
     }
```
#####说明:
*  code: 类型: Integer; 含义:返回码，0为正常
*  msg: 类型: String; 含义: 返回信息， OK为正常
*  err: 类型: String; 含义: 具体错误信息
*  id: 类型: String; 含义: 成功发起支付后返回支付表记录唯一标识
#####返回code 定义:
*  0 | OK | 成功
*  1 | APP_INVALID | 根据app_id找不到对应的APP或者app_sign不正确
*  2 | PAY_FACTOR_NOT_SET | 支付要素在后台没有设置
*  3 | CHANNEL_INVALID | channel参数不合法
*  4 | MISS_PARAM | 缺少必填参数
*  5 | PARAM_INVALID | 参数不合法
*  6 | CERT_FILE_ERROR | 证书错误
*  7 | CHANNEL_ERROR | 渠道内部错误
*  14 | RUN_TIME_ERROR | 实时未知错误，请与技术联系帮助查看

###二、订单查询
####1. require "MLPay.php";
####2. 填充数组$data, 内容包括
#####必填: 
*  appid: 由MaxLeap 后台获取,类型:String
*  token: 由MaxLeap 后台获取,类型:String
*  billNum: 订单号,类型:String
####3. 静态调用 $result = MLPayApi::record($data);
####4. 返回值包含在$result中,结构如下:
```
    {
     code:0,//0为正常，1为appid不存在
     results:[{
        "billNum": "a0afb0d7-e26f-4e94-bb7b-8265fc1492b7",
        "channel": "ali_web“,
        status:"created",//string,分别为created未支付，sucess已支付，refund已退款。
        "createdTime":121111121121,//timstamp
        "endTime":12132132131231,//timstamp
        "totalFee": 1,
        "extras":{
            "1": "2"
        }
      }]
    }
```  
参考程序可运行testMLpay.php, 运行方式 php testMLpay.php
