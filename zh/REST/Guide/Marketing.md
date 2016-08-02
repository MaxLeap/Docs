# 推送营销

## API 列表

| URL                                      | HTTP | 功能                             |
| ---------------------------------------- | ---- | ------------------------------ |
| `/marketing/push/msg/(all|{installId})` | POST | [向用户推送消息](#向用户发送消息)            |
| `/goppush/server/get?k={key}&p={}`       | GET  | [获取可用Android 推送服务器](#)         |
| `/gopush/msg/get?k={key}&m={}`           | GET  | [获取Android离线消息](获取Android离线消息) |
| `/gopush/time/get?cb={}`                 | GET  | [获取初始消息ID](获取初始消息ID)           |

## API 详解

### 向用户发送消息

当 App 安装到用户设备后,如果要使用消息推送功能，MaxLeap SDK 会自动生成一个 Installation 对象。Installation 对象包含了推送所需要的所有信息。你可以使用 REST API，通过 Installation 对象进行消息推送。

通过 POST marketing/push/msg 来推送消息给设备，下面是数据的描述

**对于IOS 设备 推送内容为：**

```javascript
{
  "aps": {
    "alert": "hello",//消息内容
    "badge": 5,//数字类型，未读消息数目，应用图标边上的小红点数字，可以是数字，也可以是字符串 "Increment"（大小写敏感）,
    "sound": "default",//声音文件名，前提在应用里存在
    "content-available": 1 //如果使用 Newsstand，设置为 1 来开始一次后台下载
  }, 
  "customFiled1": "key1",//自定义属性
  "customField2": [
    "bang",
    "whiz"
  ]
}
```

并且 IOS 设备支持 `alert` 本地化消息推送：

```javascript
{ 
    "alert": {
      "title":           "推送标题",
      "title-loc-key":   "",
      "body":            "推送内容",
      "action-loc-key":  "string",
      "loc-key":         "string",
      "loc-args":        ["array of string"],
      "launch-image":    "string"
     }
   
}
```



详情参考 [Apple 文档](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html)

如果是 Android 设备，默认是用的是MaxLeap的推送服务，默认的消息栏通知  支持下列属性：

```javascript
{	
    "alert":      "消息内容",
    "title":      "显示在通知栏的标题",
    "custom-key": "由用户添加的自定义属性"
}
```

MaxLeap 支持一次向多个平台设备进行推送

```javascript
{
  "aps": { //ISO 设备
    "alert": "hello",//消息内容
    "badge": 5,//数字类型，未读消息数目，应用图标边上的小红点数字，可以是数字，也可以是字符串 "Increment"（大小写敏感）,
    "sound": "default",//声音文件名，前提在应用里存在
    "content-available": 1 //如果使用 Newsstand，设置为 1 来开始一次后台下载
  },  
  "alert":"android 设备内容"  // Android 设备
  "title":"android 设备标题" //Android 设备
  "customField": "自定义属性"
}
```

#### IOS 支持测试和生产证书

在发送之前需要上传对应的p12证书，否则消息不能正确的发出去。

```javascript
{
  "certType":"number" //0:使用生产证书 1:测试证书 默认使用生产证书
  "aps": {
    "alert": "hello",//消息内容
    "badge": 5,//数字类型，未读消息数目，应用图标边上的小红点数字，可以是数字，也可以是字符串 "Increment"（大小写敏感）,
    "sound": "default",//声音文件名，前提在应用里存在
    "content-available": 1 //如果使用 Newsstand，设置为 1 来开始一次后台下载
  }, 
  "customFiled1": "key1",//自定义属性
  "customField2": [
    "bang",
    "whiz"
  ]
}
```

下面是向某个特定的 Installation 推送一条消息

```shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe"\
    -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ"\
    -H "Content-Type: application/json"\
    -d ' {     
 	      "alert":"hello maxleap"
         }'\
    "http://api.maxleap.cn/2.0/marketing/push/msg/a2188f955d1a4a968ee40e6952b05407" 
```

也可以向一批设备发送消息

```shell
$ curl -X POST \
-H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
-H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
-H "Content-Type: application/json" \
-d '{
   "installs":["a2188f955d1a4a968ee40e6952b05407","1111111"] ,   
   "alert":"hello maxleap,I'm android",
   "aps": {
          "alert": {
            "title": "Tips",
            "body": "hello maxleap,I'm apple device",
            "action-loc-key": "PLAY",
            "title-loc-key": "abc",
            "title-loc-args": [
              "1",
              "2"
            ],
            "loc-key": "abc",
            "loc-args": [
              "3"
            ],
            "launch-image": "string"
          },
          "badge": 1,
          "sound": "default",
          "content-available": 1
        },
   "customKey":"name"
}' "http://api.maxleap.cn/2.0/marketing/push/msg/all"
```

根据Installation 条件进行推送，下面是发送给中国地区用户的示例：

```shell
$ curl -X POST \
-H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
-H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
-H "Content-Type: application/json" \
-d '{
   "criteria":"{\"local\":\"cn\"}" ,
   "alert":"hello maxleap",
   "aps": {
          "alert": {
            "title": "Tips",
            "body": "hello maxleap,I'm from china",
            "action-loc-key": "PLAY",
            "title-loc-key": "abc",
            "title-loc-args": [
              "1",
              "2"
            ],
            "loc-key": "abc",
            "loc-args": [
              "3"
            ],
            "launch-image": "string"
          },
          "badge": 1,
          "sound": "default",
          "content-available": 1
        },
   "customKey":"name"
}' "http://api.maxleap.cn/2.0/marketing/push/msg/all"
```

`criteria` 为指定推送条件，格式为string 类型。

### 获取可用Android 推送服务器

IOS 设备默认使用苹果的[APNS](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html)服务器，Android 推送使用的是MaxLeap 的推送服务器，用户首先需要根据设备的InstallationId 和AppId 获取可用的服务器，然后进行连接。

```shell
$ curl -X GET \
 -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
 -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ"\
 -H "Content-Type: application/json" \
 "http://api.maxleap.cn/2.0/gopush/server/get?k=a43f00f741b55a231cd25da08413ca3c&p=2"
```

其中`k=Md5(appId+installId).toHexString()`,p为指定使用的协议类型，支持`WebSocket(1)` 和`TCP(2)`,成功返回数据如下：

```json
{
  "data": {
    "server": [
      "push1.maxleap.cn:6031",
      "push1.maxleap.cn:6041"
    ]
  },
  "ret": 0
}
```

ret 返回值为错误码，server 为可以用服务列表。

#### 公共返回码

|  错误码  |  描述  |
| :---: | :--: |
|   0   |  成功  |
| 65534 | 参数错误 |
| 65535 | 内部错误 |

### 获取Android离线消息

* 请求参数

| 参数   | 类型     | 描述                                   |
| ---- | ------ | ------------------------------------ |
| k    | string | k=Md5(appId+installId).toHexString() |
| m    | number | 最新接受的私有消息的ID                         |
| cb   | string | 返回jsonp结构函数名(可选）                     |

```shell
$ curl -X GET \
-H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
-H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
-H "Content-Type: application/json" \
 "http://api.maxleap.cn/2.0/gopush/msg/get?k=a43f00f741b55a231cd25da08413ca3c&m=0"
```



* 返回结果说明

| 参数   | 类型   | 描述     |
| ---- | ---- | ------ |
| msgs | 数组   | 私有离线消息 |



```json
{
  "data": {
    "msgs": [
      {
        "msg": {
          "alert": "hello"
        },
        "mid": 14624164300040908,
        "gid": 0
      }
    ]
  },
  "ret": 0
}
```

### 获取初始消息ID

* 请求参数

| 参数   | 类型     | 描述               |
| ---- | ------ | ---------------- |
| cb   | string | 返回jsonp结构函数名(可选) |

```shell
$ curl -X GET \
-H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
-H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
-H "Content-Type: application/json" \
 "http://api.maxleap.cn/2.0/gopush/time/get"
```

* 返回结果说明

  | 参数     | 类型     | 描述     |
  | ------ | ------ | ------ |
  | timeid | string | 初始消息ID |

  ​

```json
{
  "data": {
    "timeid": 14624168551915608
  },
  "ret": 0
}
```



### 

## FAQ
#### IOS 证书生成

[请参考文档](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#推送营销-推送证书设置指南176)