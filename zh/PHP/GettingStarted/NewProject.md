##### _Author: Kevin
##### _Github: https://github.com/lalamini

### 兼容性

目前MaxLeap的php-SDK 运行于php 5.4以上版本,您也可以对库文件进行适当修改，以符合您所使用的php环境。就目前所知的兼容性问题包括但不仅限于函数数组的使用,譬如$ret_array()[]。

### 安装SDK

php pay sdk仅包含一个库文件，您可以直接去github上下载该文件即可。

### 获取SDK

git clone https://github.com/MaxLeap/SDK-MaxPay-PHP.git

有效文件为 MLPay.php


### 测试SDK
#### bill 测试
通过内部文件testMLpay.php，可以对MLPay.php库文件进行简单的测试

##### 支付宝支付

```
php testMLpay.php bill ali_web
```
此时，我们将得到如下结果：

```
stdClass Object
(
    [id] => 56930318e4b0018057291132
    [ali_app] => _input_charset="utf-8"&notify_url="http://101.95.153.34:7777/maxpay/alinotify"&out_trade_no="56930318e4b0018057291132"&partner="2088121305224121"&payment_type="1"&return_url="http://www.qq.com"&seller_id="2088121305224121"&service="mobile.securitypay.pay"&sign="mlwsJRkiiEdkGKjteE3gVNQP8ZT8BlxvE2yK7AAsHXAu1N33MZcTMKxXxnTcMBdMsSa%2FIta6c21LTjtOFVouCttHEzrJxmi60CRsJGtj4Wx1eqqAozjDfR%2BWA%2B5MC0CHIAv%2FTGLN%2BWJxcQrivFsTDqh%2Fapwv6uO8jlJPLOLxkOU%3D"&sign_type="RSA"&subject="it will be ok!"&total_fee="0.01"
    [ali_web] => https://mapi.alipay.com/gateway.do?_input_charset=utf-8&notify_url=http://101.95.153.34:7777/maxpay/alinotify&out_trade_no=56930318e4b0018057291132&partner=2088121305224121&payment_type=1&return_url=http://www.qq.com&seller_id=2088121305224121&service=create_direct_pay_by_user&sign=0791e8812c3c16729ba45bd009e2f257&sign_type=MD5&subject=it will be ok!&total_fee=0.01
    [msg] => OK
    [code] => 0
)
```

表明支付宝支付接口测试通过。

注意:

* 返回的数据对象所包含的内容以用户提交的数据为准。

##### 微信支付

```
php testMLpay.php bill wx_native
```
此时，我们将得到如下结果：

```
stdClass Object
(
    [prepayid] => wx20160119104319f0f91df8b90436948052
    [codeUrl] => weixin://wxpay/bizpayurl?pr=IysMGTv
    [code] => 0
)
```
表明微信支付接口测试通过。

注意:

* 返回的数据对象所包含的内容以用户提交的数据为准。

#### record 测试

```
php testMLpay.php record
```

此时，系统会给出所有关于billNum='112233'的所有付款内容

```
stdClass Object
(
    [results] => Array
        (
            [0] => stdClass Object
                (
                    [billNum] => 112233
                    [channel] => ali_web
                    [createdTime] => 1451963296736
                    [currency] => CNY
                    [endTime] => 1451963326237
                    [id] => 568b33a0f7e4beba9244a8e0
                    [money] => 0.01 CNY
                    [status] => success
                    [totalFee] => 1
                )

            [1] => stdClass Object
                (
                    [billNum] => 112233
                    [channel] => ali_web
                    [createdTime] => 1451963799276
                    [currency] => CNY
                    [id] => 568b3577f7e4826974829ef6
                    [money] => 0.01 CNY
                    [status] => created
                    [totalFee] => 1
                )
  ...
  }
```
表明查询接口测试通过。

至此表明该SDK部署全部成功。

#### 注:

微信支付返回的codeUrl可以生成一个二维码进行扫码支付，代码参考如下
```
$widhtHeight = 200;
$EC_level='L';
$margin='0';
$chl=$codeUrl;
$size="xxxx";
echo '<img src="http://chart.apis.google.com/chart?chs='.$widhtHeight.'x'.$widhtHeight.'&cht=qr&chld='.$EC_level.'|'.$margin.'&chl='.$chl.'" alt="QR code" widhtHeight="'.$size.'" widhtHeight="'.$size.'"/>';
```

## 下一步
 至此，您已经完成 MaxLeap PHP-PAY-SDK 的安装与必要的配置。请移步至[php-pay-sdk 使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_PHPPAYSDK)以获取 PHP-PAY-SDK 的详细功能介绍以及使用方法。
