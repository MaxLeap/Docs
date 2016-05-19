
# 数据分析

下面根据具体 API 在更新

## API 列表

URL	| HTTP |	功能
------|--------|--------
`/analytics/at`|POST|	发送分析数据


## API 详解

### 发送分析数据
发送需要统计的数据到对应的Topic.(Topic对应指标名称)

```json
{
  "Session": [
    {   "uuid":"asdasdasdasdasdasdas3",
        "appId": "5730353d667a230001e5649a",
        "national":"us",
        "state": null,
        "channel": "appStore",
        "os": "ios",
        "osVersion": "1.0",
        "deviceId":"deviceId",
        "appUserId": "wills",
        "network": "wifi",
        "carrier": "China Mobile",
        "appVersion": "1.0",
        "language": "en",
        "resolution": "1024*768",
        "sdkVersion": "1.0",
        "ip": null,
        "duration": 1,
        "push": true,
        "upgrade": false,
        "userId": "5684ceaf6e912100017707a1",
        "timestamp": 1460952234000,
        "userCreateTime": 1460952234000,
        "startTime": 1460952234000 
    }  ]
}
```
其中"Session"代表统计的Topic名称。
成功返回：

```json
{"errorCode":0,"errorMessage":null,"data":null}
```

失败返回：

```json
{"errorCode":400,"errorMessage":"something error","data":null}
```	

## 错误码
参考 [通用错误码](https://github.com/MaxLeap/Docs/blob/master/zh%2FREST%2FGuide%2FAPI.md)

## FAQ
发送数据指标的数据结构和补充说明：
###应用数据
####Session
| key            | type    | desc                                     | sample                              | option | source                                         | SDK | WEB        |
|----------------|---------|------------------------------------------|-------------------------------------|--------|------------------------------------------------|-----|------------|
| uuid           | string  | 记录唯一标示(合法UUID)                   | f811bf891d66468da012b055fe66e681    | N      | SDK                                            | Y   | Y          |
| appId          | string  | 应用Id                                   | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                                            | Y   | Y          |
| national       | string  | 国家(cn,jp等小写字母)                    | cn                                  | Y      | 服务器，通过IP获取                             | N   | N          |
| state          | string  | 州                                       | fda                                 | Y      | 服务器，通过IP获取                             | N   | N          |
| channel        | string  | 渠道                                     | app store                           | N      | SDK                                            | Y   | Y          |
| os             | string  | 操作系统                                 | ios                                 | N      | SDK                                            | Y   | Y          |
| osVersion      | string  | 操作系统版本                             | 8.1                                 | N      | SDK                                            | Y   | Y          |
| userId         | string  | 注册用户Id(数据服务提供的字符串)         | f811bf8fdsfdas6468da012b055fe66e681 | Y      | SDK                                            | Y   | Y          |
| deviceId       | string  | 设备Id(数据服务提供的字符串)             | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                                            | Y   | Y          |
| appUserId      | string  | 用户唯一Id(数据服务提供的字符串)         | f811bf891                           | N      | SDK                                            | Y   | Y          |
| language       | string  | 用户语言                                 | zh                                  | N      | SDK                                            | Y   | Y          |
| appVersion     | string  | 应用版本                                 | 1.0.1                               | N      | SDK                                            | Y   | Y          |
| network        | string  | 网络类型                                 | wifi                                | N      | SDK                                            | Y   |            |
| userCreateTime | long    | 用户创建时间秒数                         | 1375718400                          | N      | SDK                                            | Y   | Y          |
| startTime      | long    | Session启动时间(1980年到现在的秒数)      | 1333322322                          | N      | SDK                                            | Y   | Y          |
| duration       | long    | Session持续时间(秒)                      | 5                                   | N      | SDK                                            | Y   | N 后面研究 |
| push           | boolean | 是否通过push打开                         | true                                | N      | SDK                                            | Y   | N 无意义   |
| carrier        | string  | 运营商(mcc+mnc)                          | 460,00                              | N      | SDK                                            | Y   | 几乎不可以 |
| resolution     | string  | 设备分辨率                               | 800*600                             | N      | SDK                                            | Y   | Y          |
| deviceModel    | string  | 设备型号                                 | M3                                  | N      | SDK                                            | Y   |            |
| upgrade        | boolean | 是否升级,用户第一次升级到某app版本时发送 | true                                | N      | SDK                                            | Y   | N 无意义   |
| sdkVersion     | string  | 数据分析SDK 版本                         | 1.0.0                               | N      | SDK                                            | Y   | Y          |
| ip             | string  | 请求IP                                   | 233.23.1.4                          | Y      | 服务器，从Rest请求头中获取                     | Y   | Y          |
| gps            | string  | 用户地理位置                             |                                     | Y      | SDK，暂时当做sessionId来用，存放的是当前会话Id | Y   | Y          |
| timestamp      | long    | 数据到达服务器时间戳                     |                                     | Y      | 服务器                                         | Y   | Y          |

####NewUser
| key         | type   | desc                             | sample                              | option | source                     | SDK | WEB          |
|-------------|--------|----------------------------------|-------------------------------------|--------|----------------------------|-----|--------------|
| uuid        | string | 记录唯一标示(合法UUID)           | f811bf891d66468da012b055fe66e681    | N      | SDK                        | Y   | Y            |
| appId       | string | 应用Id                           | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | Y            |
| national    | string | 国家(cn,jp等小写字母)            | cn                                  | Y      | 服务器，通过IP获取         | N   | N            |
| state       | string | 州                               | fda                                 | Y      | 服务器，通过IP获取         | N   | N            |
| channel     | string | 渠道                             | app store                           | N      | SDK                        | Y   | Y            |
| os          | string | 操作系统                         | ios                                 | N      | SDK                        | Y   | Y            |
| osVersion   | string | 操作系统版本                     | 8.1                                 | N      | SDK                        | Y   | Y            |
| deviceId    | string | 设备Id(数据服务提供的字符串)     | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | Y            |
| appUserId   | string | 用户唯一Id(数据服务提供的字符串) | f811bf891                           | N      | SDK                        | Y   | Y            |
| language    | string | 用户语言                         | zh                                  | N      | SDK                        | Y   | Y            |
| appVersion  | string | 应用版本                         | 1.0.1                               | N      | SDK                        | Y   | Y            |
| network     | string | 网络类型                         | wifi                                | N      | SDK                        | Y   | N 不支持     |
| carrier     | string | 运营商(mcc+mnc)                  | 460,00                              | N      | SDK                        | Y   | N 不支持     |
| resolution  | string | 设备分辨率                       | 800*600                             | N      | SDK                        | Y   | Y            |
| deviceModel | string | 设备型号                         | M3                                  | N      | SDK                        | Y   | Y user-agent |
| sdkVersion  | string | 数据分析SDK 版本                 | 1.0.0                               | N      | SDK                        | Y   | Y            |
| ip          | string | 请求IP                           | 233.23.1.4                          | Y      | 服务器，从Rest请求头中获取 | N   | N            |
| gps         | string | 用户地理位置                     | gps                                 | Y      | SDK                        | Y   | Y            |
| timestamp   | long   | 数据到达服务器时间戳             | timestamp                           | Y      | 服务器                     | Y   | Y            |
####PageView
| key         | type    | desc                                     | sample                              | option | source                     | SDK | WEB |
|-------------|---------|------------------------------------------|-------------------------------------|--------|----------------------------|-----|-----|
| uuid        | string  | 记录唯一标示(合法UUID)                   | f811bf891d66468da012b055fe66e681    | N      | SDK                        | Y   | Y   |
| appId       | string  | 应用Id                                   | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | Y   |
| sessionId   | string  | 会话Id                                   | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | Y   |
| national    | string  | 国家(cn,jp等小写字母)                    | cn                                  | Y      | 服务器，通过IP获取         | N   | N   |
| state       | string  | 州                                       | fda                                 | Y      | 服务器，通过IP获取         | N   | N   |
| channel     | string  | 渠道                                     | app store                           | N      | SDK                        | Y   | N   |
| os          | string  | 操作系统                                 | ios                                 | N      | SDK                        | Y   | N   |
| osVersion   | string  | 操作系统版本                             | 8.1                                 | N      | SDK                        | Y   | N   |
| userId      | string  | 注册用户Id(数据服务提供的字符串)         | f811bf8fdsfdas6468da012b055fe66e681 | Y      | SDK                        | Y   | N   |
| deviceId    | string  | 设备Id(数据服务提供的字符串)             | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | N   |
| appUserId   | string  | 用户唯一Id(数据服务提供的字符串)         | f811bf891                           | N      | SDK                        | Y   | N   |
| language    | string  | 用户语言                                 | zh                                  | N      | SDK                        | Y   | N   |
| appVersion  | string  | 应用版本                                 | 1.0.1                               | N      | SDK                        | Y   | N   |
| network     | string  | 网络类型                                 | wifi                                | N      | SDK                        | Y   | N   |
| duration    | long    | Session持续时间(秒)                      | 5                                   | N      | SDK                        | Y   | N   |
| push        | boolean | 是否通过push打开                         | true                                | N      | SDK                        | Y   | N   |
| carrier     | string  | 运营商(mcc+mnc)                          | 460,00                              | N      | SDK                        | Y   | N   |
| resolution  | string  | 设备分辨率                               | 800*600                             | N      | SDK                        | Y   | N   |
| deviceModel | string  | 设备型号                                 | M3                                  | N      | SDK                        | Y   | N   |
| upgrade     | boolean | 是否升级,用户第一次升级到某app版本时发送 | true                                | N      | SDK                        | Y   | N   |
| sdkVersion  | string  | 数据分析SDK 版本                         | 1.0.0                               | N      | SDK                        | Y   | N   |
| ip          | string  | 请求IP                                   | 233.23.1.4                          | Y      | 服务器，从Rest请求头中获取 | N   | N   |
| url         | string  | 当前访问的url                            | www.test.com                        | N      | SDK                        | Y   | Y   |
| referer     | string  | 下一个url，跳转过去的url                 | www.referer.com                     | N      | SDK                        | Y   | Y   |
| gps         | string  | 用户地理位置                             | gps                                 | Y      | SDK                        | Y   | Y   |
| timestamp   | long    | 数据到达服务器时间戳                     | timestamp                           | Y      | 服务器                     | Y   | Y   |

####Event
| key         | type    | desc                                     | sample                              | option | source                     | SDK | WEB |
|-------------|---------|------------------------------------------|-------------------------------------|--------|----------------------------|-----|-----|
| uuid        | string  | 记录唯一标示(合法UUID)                   | f811bf891d66468da012b055fe66e681    | N      | SDK                        | Y   | Y   |
| appId       | string  | 应用Id                                   | f811bf8fdsfdas6468da012b055fe66e681 | N      | SDK                        | Y   | Y   |
| national    | string  | 国家(cn,jp等小写字母)                    | cn                                  | Y      | 服务器，通过IP获取         | N   | N   |
| state       | string  | 州                                       | fda                                 | Y      | 服务器，通过IP获取         | N   | N   |
| channel     | string  | 渠道                                     | app store                           | N      | SDK                        | Y   | N   |
| os          | string  | 操作系统                                 | ios                                 | N      | SDK                        | Y   | N   |
| eventId     | string  | 事件Id                             |    Event1                                | N      | SDK                        | Y   | Y   |
| userId      | string  | 注册用户Id(数据服务提供的字符串)         | f811bf8fdsfdas6468da012b055fe66e681 | Y      | SDK                        | Y   | N   |
| count    | string  | 数值型参数的值，一个事件只能统计一个数值型参数             | 123                     | N      | SDK                        | Y   | Y   |
| appUserId   | string  | 用户唯一Id(数据服务提供的字符串)         | f811bf891                           | N      | SDK                        | Y   | N   |
| appVersion  | string  | 应用版本                                 | 1.0.1                               | N      | SDK                        | Y   | N   |
| userCreateTime     | long  | 安装app的时间(1980年到现在的秒数)      | 1333322322                             | N      | SDK                        | Y   | N   |
| attrs    | map    | 事件包含的key,value全部为string类型                     | {"sex":"man","age":"18"}      | N      | SDK                        | Y   | N   |
| timestamp   | long    | 数据到达服务器时间戳                     | timestamp                           | Y      | 服务器                     | Y   | Y   |
| ctimestamp   | long    | 客户端timestamp                    | timestamp                           | Y      | 服务器                     | Y   | Y   |
###TimeLine
####TimeLineEvent
| field         | type   | option             | desc                                 | SDK | WEB |
|---------------|--------|--------------------|--------------------------------------|-----|-----|
| appId         | string |                    |                                      | Y   |     |
| appUserId     | string |                    |                                      | Y   |     |
| appVersion    | string |                    |                                      | Y   |     |
| channel       | string |                    |                                      | Y   |     |
| ctimestamp    | long   |                    | 客户端timestamp                      | Y   |     |
| deviceId      | string |                    |                                      | Y   |     |
| eventId       | string |                    |                                      | Y   | Y   |
| eventName     | string |                    |                                      | Y   | Y   |
| eventNickName | string |                    | 事件别名                             | Y   | Y   |
| eventType     | long   |                    | 参考 eventType枚举                   | Y   | Y   |
| keyvalues     |        |                    |                                      |     |     |
| string        |        | 用户自定义事件会有 | Y                                    | Y   |     |
| national      | string |                    |                                      | Y   |     |
| os            | string |                    |                                      | Y   |     |
| payMoney      | string |                    | only Payment时间                     | Y   | N   |
| paySource     | string |                    | 参考 PaySource枚举(only Payment时间) | Y   | N   |
| state         | string |                    |                                      | Y   |     |
| timestamp     | long   |                    |                                      | Y   |     |
| userId        | string |                    |                                      | Y   |     |
| uuid          | string |                    |                                      | Y   |     |
###支付数据
####Payment
| key                                                | value                               | type    | option | remarks                                                                                                                                        | WEB |
|----------------------------------------------------|-------------------------------------|---------|--------|------------------------------------------------------------------------------------------------------------------------------------------------|-----|
| appId                                              | yyyyyy                              | string  | N      |                                                                                                                                                |     |
| appVersion                                         |                                     | string  | N      | app version                                                                                                                                    |     |
| channel                                            |                                     | string  | N      | 用户渠道                                                                                                                                       |     |
| ctimestamp                                         |                                     | long    |        | 客户端timestamp                                                                                                                                |     |
| description                                        | Gold                                | string  | N      | 商品描述                                                                                                                                       |     |
| historyPayment                                     |                                     | double  | N/A    | (服务器端添加) 历史消费金额,由appuser中记录的消费金额进行填充                                                                                  |     |
| installationId                                     | xxxxxx                              | string  | N      |                                                                                                                                                |     |
| isJailbroken                                       |                                     | boolean |        |                                                                                                                                                |     |
| language                                           |                                     | string  | N      |                                                                                                                                                |     |
| national                                           |                                     | string  | N      |                                                                                                                                                |     |
| os                                                 | ios/android                         | string  | N      |                                                                                                                                                |     |
| paySource                                          | app store/google play/alipay/palpay | string  | N      | 支付渠道                                                                                                                                       |     |
| priceAmount                                        | 7990000                             | long    | N      |  |     |
| priceCurrency                                      | GBP                                 | string  | N      |                                                                                                                                                |     |
| android 是 ISO 4217 的货币码, 参考:                |                                     |         |        |                                                                                                                                                |     |
| http://en.wikipedia.org/wiki/ISO_4217#Active_codes |                                     |         |        |                                                                                                                                                |     |
| iOS 传 Tier                                        |                                     |         |        |                                                                                                                                                |     |
| 发送到数据分析 统一用美元                          |                                     |         |        |                                                                                                                                                |     |
| priceDollar                                        | 0.99                                | double  | N/A    | (服务器端添加) 通过汇率转换的                                                                                                                  |     |
| productId                                          |                                     | string  | N      |                                                                                                                                                |     |
| sessionId                                          |                                     | string  | N      | 所在session的id                                                                                                                                |     |
| state                                              |                                     | string  | N/A    | (服务器端通过ip库解析)                                                                                                                         |     |
| status                                             | 0-3                                 | string  | N      | 开始 / 取消 / 失败 / 成功                                                                                                                      |     |
| timestamp                                          |                                     | long    | N/A    | (服务器端添加)                                                                                                                                 |     |
| title                                              | Gold                                | string  | N      | 商品标题                                                                                                                                       |     |
| transactionDate                                    |                                     | long    |        |                                                                                                                                                |     |
| transactionId                                      |                                     | string  |        |                                                                                                                                                |     |
| type                                               | inapp / subs / none                 | string  | N      | android 只有两种, iOS 可能取不到, 暂时传 none                                                                                                  |     |
| userCreateTime                                     |                                     | long    | N      | 用户创建时间（秒）                                                                                                                             |     |
| userId                                             | zzzzzz                              | string  | N      | 注册用户                                                                                                                                       |     |
| uuid                                               |                                     | string  | N      | 请求唯一标示                                                                                                                                   |     |
