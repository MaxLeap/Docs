# 即时通讯

##### _Author: Marvin
##### _Github: https://github.com/zhoucen

## 简介

使用 MaxLeap 的即时通讯服务，可以轻松实现一个实时聊天应用，或者一个联机对战类的游戏。除聊天室外的聊天记录都保存在云端，离线消息会通过消息推送及时送达，推送的消息文本可以灵活定制。

### MaxIMLib

MaxIMLib 是不含界面的基础 IM 通讯能力库，封装了通信能力和会话、消息等对象。引用到 App 工程中后，需要开发者自己实现 UI 界面，相对较轻量，适用于对 UI 有较高订制需求的开发者。

本 SDK 实现轻量、高效、无依赖，其中浏览器支持涵盖了移动终端的浏览器及各种 WebView，包括微信、PhoneGap、Cordova 的 WebView。

## Demo

- 简单聊天 Demo [源码](https://github.com/MaxLeap/MaxIM-JavaScript/tree/master/demo/Chat)

## 安装与配置

### 浏览器环境

下载[SDK](https://github.com/MaxLeap/MaxIM-JavaScript/releases/latest)

下载好之后，在页面中加载 dist/ML.im.js 后即可使用 `ML.im` 全局变量。


## 示例代码

```javascript
// 最简的示例代码，请换成自己的 appId，可以通过浏览器多个标签模拟多用户通信
var appId = '{{appid}}';
// clientId 就是你自己的app 的 Client Key 或者 Javascript Key 或者 REST API Key 或者 Master Key
var clientId = 'Y3FxbHE2aTJmQ2dQazYtQVlvc0NnQQ';
// userId 就是你自己的app里面的用户id
var userId = 'user1';
// installId 是你的设备id
var installId = 'M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw'；
var im;

// 创建实时通信实例（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         userId: userId,
         installId: installId,
         region: 'cn'
       },function(){
				 console.log('login success!');
				 });
// 当前 SDK 版本
console.log('当前 SDK 版本是 ' + ML.im.version);

// 像好友发送消息
im.toFriend('user2').text('hello! user2!').ok();

// 在Group里面发送消息
im.toGroup('group1').text('hello! I'm user1!').ok();

// 在Group里面发送消息
im.toRoom('room1').text('hello! I'm user1!').ok();
```

## 与 iOS、Android 等客户端通信

JavaScript 实时通信 SDK 可以与其他客户端通信。当你不仅仅只是基于 Web 来实现一个实时通信程序，可以通过使用 Maxleap 提供的其他类型（iOS、Android等）的 SDK 实现多端互通。

我们的SDK支持发送多种消息格式，分别为：

- text（文本）
- image（图片）
- audio（声音）
- video (视频)

### 示例

```
// 与 iOS、Android 等 SDK 通信

// 发送文本
im.toFriend('user2').text('hello! user2!').ok();

// 发送图片
// data 是个FormData类型的对象或者是字符流
var data = ...
im.toFriend('user2').image(data).ok();

// 发送声音
// data 是个FormData类型的对象或者是字符流
var data = ...
im.toFriend('user2').audio(data).ok();

// 发送视频
// data 是个FormData类型的对象或者是字符流
var data = ...
im.toFriend('user2').video(data).ok();

```

## 方法列表

### 全局命名空间

Maxleap JavaScript 相关 SDK 都会使用「ML」作为命名空间。

### ML.im

这是创建实时通信对象的方法，会启动实时通信的连接。自动调用 connect 方法，内部与服务器匹配，并建立 WebSocket 连接。内部会自动维持与服务器的链接稳定。

另外，此方法支持多实例，也就是说，你可以在一个页面中，创建多个实例来实现聊天。

```javascript
ML.im(options, callback)
```
#### 输入
目前可以采取两种不同的模式登录

**使用用户已有账号系统**

模式一：使用自己的账号系统，那么只需要提供 userId

**使用 MaxLeap 账号系统**

模式二：通过用户名及密码，则需要 username 和 password

模式三：使用手机号码登录，那么需要 phone 和 password

模式四：使用第三方登录，那么需要 oauth 信息

模式五: 游客登录,那么需要提供 passenger  信息

参数|类型|约束|默认|说明
---|---|---|---|---
**options**|Object|必须||配置实时通信服务所需的必要参数。其中包括：
&nbsp;&nbsp;&nbsp;&nbsp; appId|String|必须||应用的 appId，
&nbsp;&nbsp;&nbsp;&nbsp; clientId|String|必须||app 的 Client Key 或者 Javascript Key 或者 REST API Key 或者 Master Key
&nbsp;&nbsp;&nbsp;&nbsp; userId|String|模式一必须||当前客户的唯一 id，用来标示当前客户。
&nbsp;&nbsp;&nbsp;&nbsp; username|String|模式二必须||当前客户的username。
&nbsp;&nbsp;&nbsp;&nbsp; password|String|模式二或者模式三必须||当前客户的password。
&nbsp;&nbsp;&nbsp;&nbsp; phone|String|模式三必须||当前客户的phone。
&nbsp;&nbsp;&nbsp;&nbsp; oauth|Object|模式四必须||第三方登录的oauth信息。
&nbsp;&nbsp;&nbsp;&nbsp; passenger|Object|模式五必须||游客登录的信息。
&nbsp;&nbsp;&nbsp;&nbsp; installId|String|||当前客户端的设备 id，用来标示当前设备。如果需要离线接收推送消息的话，必须提供。

#### 返回

```Object``` 返回 imObject（实时通信对象），其中有后续调用的方法，支持链式调用。

#### 示例

```javascript
// 最简的示例代码，请换成自己的 appId，可以通过浏览器多个标签模拟多用户通信
var appId = '{{appid}}';
// clientId 就是你自己的app 的 Client Key 或者 Javascript Key 或者 REST API Key 或者 Master Key
var clientId = 'Y3FxbHE2aTJmQ2dQazYtQVlvc0NnQQ';
// (模式一)userId 就是你自己的app里面的用户id
var userId = 'user1';
// (模式二)username
var username = 'username';
// (模式二 或者 模式三)password
var password = 'password';
// (模式三)phone
var phone = '13810001000';
// (模式四)oauth信息
var oauth = {};
//(模式五)passenger信息
var passenger = {}
// installId 是你的设备id
var installId = 'M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw'；
var im;

// 创建实时通信实例--模式一（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         userId: userId,
         installId: installId
       },function(data){
         /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
             {
                 id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
                 success: true,        //  是否登录成功
                 error: 5003        // 错误码，仅当登录失败时
             }
        */
				 });
// 创建实时通信实例--模式二（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         username: username,
         password: password,
         installId: installId
       },function(data){
         /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
         {
             id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
             success: true,        //  是否登录成功
             error: 5003        // 错误码，仅当登录失败时
         }
         */
         });
// 创建实时通信实例--模式三（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         phone: phone,
         password: password,
         installId: installId
       },function(data){
         /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
         {
             id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
             success: true,        //  是否登录成功
             error: 5003        // 错误码，仅当登录失败时
         }
         */
         });

// 创建实时通信实例--模式四（支持单页多实例）
im = ML.im({
        appId: appId,
        clientId: clientId,
        oauth: oauth,
        installId: installId
      },function(data){
        /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
        {
            id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
            success: true,        //  是否登录成功
            error: 5003        // 错误码，仅当登录失败时
        }
        */
        });
// 创建实时通信实例--模式五（支持单页多实例）
im = ML.im({
        appId: appId,
        clientId: clientId,
        passenger: passenger,
        installId: installId
      },function(data){
        /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
        {
            id: 'YOUR_LOGIN_USER_ID',    // 模式五为游客的id 可以在以后成功登录系统,
            success: true,        //  是否登录成功
            error: 5003        // 错误码，仅当登录失败时
        }
        */
    });

```

### ML.im.version

获取当前 SDK 的版本信息。

```javascript
AV.realtime.version
```
#### 返回

```String``` 返回当前版本。

#### 示例

```javascript
// 返回版本号
console.log('当前版本是：' + AV.realtime.version);
```

### ML.im.userInfo

获取指定user的信息

```javascript
ML.im.userInfo(userid, function(err, data){
	})
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id

#### callback 返回

```Object``` 返回指定user的信息。

#### 示例返回值

```javascript
{
 {
     "sessions": 1,
     "installs": ['install1','install2'],
     "friends": [
         "bar"
     ],
     "attributes": {
         "name": "猴哥",
         "description": "我是猴哥我怕誰",
         "power": "3000000"
     },
     "rooms": [
         "da6469c86847458fb4fe82a04cf60424",
         "2a416cb1847d4700b0431f193f6418b7"
     ],
     "groups": [
         "cafe9923f8ce4edaabb6cae9b8333ec6",
         "46b9c7cc4fc6428185a2e3a1c1f9e26e",
         "6cd90bf2c8fc4973af25af02ce13b75b"
     ]
 }
}
```

### ML.im.listFriends

获取指定user的好友列表

```javascript
ML.im.listFriends(userid, function(err, data){
	}, withDetail)
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id
withDetail|Boolean|可选||是否需要返回详细信息

#### callback 返回

```Array``` 返回指定user的好友列表。

#### 示例返回值

```javascript
// 如果withDetail 为false，返回好友id列表
["friend1","friend2","friend3"]
// 如果withDetail 为true，返回好友列表
[{"id": "friend1","online": false},{"id": "friend2","online": false},{"id": "friend3","online": true}]
```

### ML.im.addFriend

将user1和user2加为好友

```javascript
ML.im.addFriend(userid, friendid, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id
friendid|String|必须||用户id

#### callback 返回

```Object```

#### 示例返回值

```javascript
{
  "id": "b9d61d4e80ad1f6d",    // 建立友谊的唯一标识ID
  "from": "foo",    // 谁发起的加好友
  "to": "bar",    // 谁被加的好友
  "ns": "56a86320e9db7300015438f7",   // 命名空间，等价于应用ID
  "ts": 1454655122174   // 创建时间
}
```

### ML.im.rmFriend

将user1和user2解除好友关系

```javascript
ML.im.rmFriend(userid, friendid, function(err, data){
	})
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id
friendid|String|必须||用户id

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.getRecentChat

获取user1和user2的聊天记录在指定时间前的指定条数。

```javascript
ML.im.getRecentChat(userid, friendid, ts, size, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id
friendid|String|必须||用户id
ts|String|必须||时间戳
size|String|必须||聊天记录数

#### callback 返回

```Array``` 聊天记录列表

#### 示例返回值

```javascript
[
  {
    "speaker": "speaker id",    // 发言者
    "content": {    // 消息内容
      "media": 0,    // 媒体类型: 0=纯文本,1=图片,2=音频,3=视频
      "body": "you are sb"    // 媒体body
    },
    "ts": 1454490959094    // 时间戳
  }
]
```

### ML.im.listGroups

获取user的Group列表。

```javascript
ML.im.listGroups(userid, function(err, data){
	}, withDetail)
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户id
withDetail|Boolean|可选||是否需要返回详细信息

#### callback 返回

```Array``` Group列表

#### 示例返回值

```javascript
// 如果withDetail 为false，返回Group id列表
["7c9fb6ca88ed41d58f69bb40b779d5bc"]
// 如果withDetail 为true，返回Group详细信息列表
[
  {
    "id": "7c9fb6ca88ed41d58f69bb40b779d5bc",    // 群组ID
    "name": "dog fucker",    // 群组名称
    "owner": "foo",    // 群组管理员
    "members": ["member1","member2","member3","foo"],    // 群组成员
    "ts": 1456306512958
  }
]
```

### ML.im.addGroup

创建一个新的Group。

```javascript
ML.im.addGroup(data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
data|Object|必须||创建一个Group必须的信息

{
  "owner": "user1",    // 创建人
  "name": "groupName",    // 群组名称
  "members": ["member1","member2"]    // 成员
}

#### callback 返回

```String``` Group ID

#### 示例返回值

```javascript
7c9fb6ca88ed41d58f69bb40b779d5bc
```

### ML.im.getGroup

获取一个Group的信息。

```javascript
ML.im.getGroup(groupid, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group ID

#### callback 返回

```Object``` Group 信息

#### 示例返回值

```javascript
{
  "owner": "jerry", // 群组管理员
  "ts": 1461607141000,
  "members": [
    "jerry"// 群组成员ID
  ],
  "attributes": {
    "name": "美女起来high",
    "description": "聊天交友群"
  }
}
```

### ML.im.updateGroup

修改一个Group的所有者或者群成员信息(群成员要为存在的用户)。

```javascript
ML.im.updateGroup(groupid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group ID
data|Object|必须|| 需要修改的信息

{
  "name": "new group name",    // 可选项
  "owner": "new owner",        // 可选项
  "members": ["new member1"]   // 可选项, 完全覆盖旧成员表
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.rmGroup

删除一个Group。

```javascript
ML.im.rmGroup(groupid, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group ID

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.addGroupMembers

把user添加到group中。

```javascript
ML.im.addGroupMembers(groupid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group ID
data|Object|必须||需要添加的成员

{
  "members":["member1","member2"]
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.rmGroupMembers

把user从group中移除。

```javascript
ML.im.rmGroupMembers(groupid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group ID
data|Object|必须||需要移除的成员

{
  "members":["member1","member2"]
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.getGroupChat

获取group的聊天记录在指定时间前的指定条数。

```javascript
ML.im.getGroupChat(groupid, ts, size, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group id
ts|String|必须||时间戳
size|String|必须||聊天记录数

#### callback 返回

```Array``` 聊天记录列表

#### 示例返回值

```javascript
[
  {
    "speaker": "speaker id",    // 发言者
    "content": {    // 消息内容
      "media": 0,    // 媒体类型: 0=纯文本,1=图片,2=音频,3=视频
      "body": "you are sb"    // 媒体body
    },
    "ts": 1454490959094    // 时间戳
  }
]
```

### ML.im.addRoom

创建一个新的Room。

```javascript
ML.im.addRoom(data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
data|Object|必须||创建一个Room必须的信息

{
  "name": "av room",    // 聊天室名称
  "members": ["user1","user2"]]    // 聊天室成员, 可选项
}

#### callback 返回

```String``` Room ID

#### 示例返回值

```javascript
  "7c9fb6ca88ed41d58f69bb40b779d5bc" // 聊天室ID
```

### ML.im.getRoom

获取一个Room的信息。

```javascript
ML.im.getRoom(roomid, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Room ID

#### callback 返回

```Object``` Room 信息

#### 示例返回值

```javascript
{
  "ts": 1461608237000,
  "members": [
    "foo",
    "bar"
  ],
  "attributes": {
    "name": "test room1"
  }
}
```

### ML.im.updateRoom

修改一个Room的信息。

```javascript
ML.im.updateRoom(roomid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Room ID
data|Object|必须|| 需要修改的信息

{
  "name": "test_group333",
  "members": ["baz"]
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.rmRoom

删除一个Room。

```javascript
ML.im.rmRoom(roomid, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Group ID

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.addRoomMembers

把user添加到room中。

```javascript
ML.im.addRoomMembers(roomid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Group ID
data|Object|必须||需要添加的成员

{
  "members":["member1","member2"]
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.rmRoomMembers

把user从room中移除。

```javascript
ML.im.rmRoomMembers(roomid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Group ID
data|Object|必须||需要移除的成员

{
  "members":["member1","member2"]
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.sysToAll

给所有用户发消息

```javascript
ML.im.sysToAll(data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
data|Object|必须||需要发的消息

{
  "content": {
    "media": 0,
    "body": "YOUR_MESSAGE_BODY"
  },
  "ts": 1455620323804
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.sysToUser

给指定user发消息

```javascript
ML.im.sysToUser(userid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
userid|String|必须||用户 id
data|Object|必须||需要发的消息

{
  "content": {
    "media": 0,
    "body": "YOUR_MESSAGE_BODY"
  },
  "ts": 1455620323804
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.sysToGroup

给指定group发消息

```javascript
ML.im.sysToGroup(groupid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
groupid|String|必须||Group id
data|Object|必须||需要发的消息

{
  "content": {
    "media": 0,
    "body": "YOUR_MESSAGE_BODY"
  },
  "ts": 1455620323804
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.sysToRoom

给指定room发消息

```javascript
ML.im.sysToRoom(roomid, data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
roomid|String|必须||Room id
data|Object|必须||需要发的消息

{
  "content": {
    "media": 0,
    "body": "YOUR_MESSAGE_BODY"
  },
  "ts": 1455620323804
}

#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
```

### ML.im.attachment

上传文件(如果是图片类型，系统将会自动生成缩略图)

```javascript
ML.im.attachment(data, function(err, data){
	})
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
data|FormData|必须||文件对象



#### callback 返回

```String``` 空字符串

#### 示例返回值

```javascript
[
  "http://im.maxleap.cn/b9d61d4e/3dee7932.jpg",    // 原图地址
  "http://im.maxleap.cn/b9d61d4e/3dee7932.sm.jpg"    // 缩略图地址
]
```

### ML.im.onMessage

注册onMessage回调

```javascript
ML.im.onMessage(function(msg){
	})
```

#### msg

```Obejct``` 消息

#### 消息示例

```javascript
{
    from: {
        id: 'FROM_ID',
        type: 0,    // 0=friend,1=group,2=room
        gid: 'GROUP_OR_ROOM_ID'    //require if type is 1 or 2
    },
    content: {
        media: 0,
        body: 'YOUR_MESSAGE_BODY'
    },
    ts: 1455613127766 // send timestamp
}
```

### ML.im.online

注册好友上线事件的回调

```javascript
ML.im.online(function(msg){
	})
```

#### msg

```Obejct``` 消息

#### 消息示例

```javascript
"<onlineUserID>"
```

### ML.im.offline

注册好友下线事件的回调

```javascript
ML.im.offline(function(msg){
	})
```

#### msg

```Obejct``` 消息

#### 消息示例

```javascript
 "<offlineUserID>"
```

### ML.im.sys

注册系统消息的回调

```javascript
ML.im.sys(function(msg){
	})
```

#### msg

```Obejct``` 消息

#### 消息示例

```javascript
{
    content: {
        media: 0,
        body: 'SYSTEM_MESSAGE_BODY'
    },
    ts: 1455620323804
}
```

### ML.im.yourself

当相同账号在不同终端登录后，别的终端发送的消息，当前终端也可以收到。注册此事件的回调。

```javascript
ML.im.yourself(function(msg){
	})
```

#### msg

```Obejct``` 消息

#### 消息示例

```javascript
{
        to: {
            id: 'RECEIVER_ID',
            type: 0
        },
        content: {
            media: 0,
            body: 'MESSAGE_BODY'
        },
        ts: 1455620323804
    }
```

### ML.im.searchUsers

搜索用户

```Javascript
  ML.im.searchUsers(size,skip,name,data, function (error,value) {

  });
```


#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
size|int|可选||显示的条数
skip|int|可选||跳过的条数
name|string|可选||排序的字段(多个字段直接用","隔开)
data|object|可选||自定义的属性字段如{'name':'小不点'}
#### callback 返回

```object``` callback返回

#### 返回示例值

```javascript
[{
    "id":"foo",
    "ts":1461570739830,
    "attributes":{
        "name":"小不点"
    },
    "online":false
},
... ...

]
```

### ML.im.setUserAttributes

设置用户自定义属性

```javascript
    ML.im.setUserAttributes(user,data, function (error,value) {

    });

```


#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
user|string|必须|&ensp;|用户的id
data|object|必须|&ensp;|需要设置的属性(如:{'name':'混世魔王','age':99999})

#### callback返回
````object````空对象

### ML.im.coverSetUserAttributes

覆盖设置用户自定义属性

```javascript
  ML.im.coverSetUserAttributes(user,data, function (error,data) {

  });

```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
user|string|必须|&ensp;|用户的id
data|object|必须|&ensp;|需要设置的属性(如:{'name':'西门吹雪'})

#### callback返回
````object````空对象

### ML.im.getUserAttributes

获取用户自定义属性

```javascript
    ML.im.getUserAttributes(user, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
user|string|必须|&ensp;|用户id

#### callback返回
```object```callback返回

#### 返回值示例

```javascript
{
    "bar": "baz",
    "gender": "male",
    "foo": "bar",
    "name": "隔壁老王",
    "baz": "qux",
    "age": 46
}
```


### ML.im.getUserOneAttribute

获取用户自定义属性

```javascript
    ML.im.getUserOneAttribute(user,data, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
user|string|必须|&ensp;|用户id
data|string|必须|&ensp;|自定义的属性名称

#### callback返回
```string```callback返回字符串


### ML.im.rmUserAttributes

删除用户自定义属性

```javascript
 ML.im.rmUserAttributes(user, function (error,data) {

 });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
user|string|必须|&ensp;|用户id

#### callback返回
```object```callback返回空object


### ML.im.addOrModifyPassenger

新增或修改游客信息

```javascript
  ML.im.addOrModifyPassenger(passenger, function (error,data) {

  });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
passenger|object|必须|&ensp;|游客信息(如:{ 'id':'jessicaZhe',&'desc':'我是游客,我怕谁'  }// 可选项, 如果设置则强制使用该ID, 否则系统会随机分配一个ID)

#### callback返回
```object```callback返回空object


### ML.im.getPassenger

获取游客信息

```javascript
    ML.im.getPassenger(passengerId, function (error,data) {

    });

```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
passengerId|string|必须|&ensp;|游客id

#### callback返回
```object```callback返回
#### 返回值示例

```javascript
    {
        "des": "我是一个游客",
        "tel": 1302013,
        "xxx": "hello"
    }
```

### ML.im.getPassengerRecentChat

获取游客的聊天记录

```javascript
    ML.im.getPassengerRecentChat(passenger,user,ts,size,function (error,data) {

    });
```
#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
passenger|string|必须|&ensp;|游客id
user|string|必须|&ensp;|用户id
ts|string|必须|&ensp;|时间戳
size|int|必须|&ensp;|显示的条数
#### callback返回

```array```callback返回json格式的数组
#### 返回值示例

```javascript
[
    {
        "ts": 1461635974546,
        "speaker": "jerryJone",
        "content": {
            "media": 0,
            "body": "hi"
        }
    },
    {
        "ts": 1461636003006,
        "speaker": "jerry",
        "content": {
            "media": 0,
            "body": "你好！"
        }
    },
    {
        "ts": 1461636016786,
        "speaker": "jerryJone",
        "content": {
            "media": 0,
            "body": "嘿嘿"
        }
    }
]
```


### ML.im.searchGroups

搜索群组

```javascript
    im.searchGroups(size,skip,sort,data, function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
size|int|可选|&ensp;|显示的条数
skip|int|可选|&ensp;|跳过多少条
sort|string|可选|&ensp;|排序字段
data|object|可选|&ensp;|自定义的属性(如:{'description':'搞基'})

#### callback返回
```array``` callback返回一个数组

#### 返回示例
```javascript

    {
        "id": "86f42c3d79f94c1fa65dbb5a54adfabb",
        "owner": "foo",
        "ts": 1460070742000,
        "attributes": {
            "name": "mygroup"
        }
    },
    {
        "id": "4889ccb75c07432e8d6fa653658ea693",
        "owner": "foo",
        "ts": 1461032499000,
        "attributes": {
            "name": "sbsbsbsb"
        }
    },
    ... ...
]
```


### ML.im.setGroupAttributes

设置群组自定义属性

```javascript
    ML.im.setGroupAttributes(group,data,function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
group|string|必须|&ensp;|群组id
data|object|必须|&ensp;|需要设置的属性(如:{name:'专业交流群','description':'专业交流一百年'})

#### callback返回
```object``` callback返回空对象


### ML.im.coverSetGroupAttributes

覆盖设置群组自定义属性

```javascript
    ML.im.coverSetGroupAttributes(group,data, function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
group|string|必须|&ensp;|群组id
data|object|必须|&ensp;|需要设置的属性(如:{name:'专业交流群','description':'专业交流一百年'})

#### callback返回
```object``` callback返回空对象


### ML.im.getGroupAttributes

获取群组自定义属性

```javascript
     im.getGroupAttributes(group, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
group|string|必须|&ensp;|群组id

#### callback
```object```callback返回

#### 返回示例

```javascript
{
    "name": "摄影爱好者群",
    "description": "爱摄影就来吧"
}
```

### ML.im.getGroupOneAttribute

获取群组的某个自定义属性

```javascript
    ML.im.getGroupOneAttribute(group,attr, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
group|string|必须|&ensp;|群组id
attr|string|必须|&ensp;|自定义属性的字段(如:description)

#### callback返回
```string```callback返回字符串

### ML.im.rmGroupAttributes

删除群组自定义属性

```javascript
    im.rmGroupAttributes(group, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
group|string|必须|&ensp;|群组id

#### callback返回
```object```callback返回空对象

### ML.im.searchRooms

搜索聊天室

```javascript
    ML.im.searchRooms(size,skip,name,data, function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
size|int|可选|&ensp;|显示的条数
skip|int|可选|&ensp;|跳过多少条
sort|string|可选|&ensp;|排序字段
data|object|可选|&ensp;|自定义的属性(如:{'description':'搞基'})

#### callback返回
```array``` callback返回一个数组

#### 返回示例
```javascript
    [
        {
            "id": "c0eebb302b1345fd983345336dd4eaa6",
            "attributes": {
                "name": "千年恋",
                "description": "千年等候!"
            }
        },
        {
            "id": "4217fd2d424d47d78907c509b8bc8403",
            "attributes": {
                "name": "天涯阁",
                "description": "天涯共此时!"
            }
        },
        ... ...
    ]
```


### ML.im.setRoomAttributes

设置聊天室自定义属性

```javascript
    ML.im.setRoomAttributes(room,data,function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
room|string|必须|&ensp;|聊天室id
data|object|必须|&ensp;|需要设置的属性(如:{name:'大家来聊天','description':'开心交流'})

#### callback返回
```object``` callback返回空对象

### ML.im.coverSetRoomAttributes

覆盖设置聊天室自定义属性

```javascript
    ML.im.coverSetRoomAttributes(room,data}, function (error,value) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
room|string|必须|&ensp;|聊天室id
data|object|必须|&ensp;|需要设置的属性(如:{name:'大家来聊天二','description':'开心交流二'})

#### callback返回
```object``` callback返回空对象

### ML.im.getRoomAttributes

获取聊天室自定义属性

```javascript
    ML.im.getRoomAttributes(room, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
room|string|必须|&ensp;|聊天室id

#### 返回示例

```javascript
    {
      "name": "大家来聊天二",
    "description": "开心交流二"
    }
```


### ML.im.getRoomOneAttribute

获取聊天室的某个自定义属性

```javascript
    ML.im.getRoomOneAttribute(room,attr, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
room|string|必须|&ensp;|聊天室id
attr|string|必须|&ensp;|自定义属性的字段(如:description)

#### callback返回

```string``` callback返回字符串


### ML.im.rmRoomAttributes

获取聊天室的某个自定义属性

```javascript
    ML.im.rmRoomAttributes(room, function (error,data) {

    });
```

#### 参数
参数|类型|约束|默认|说明
---|---|---|---|---
room|string|必须|&ensp;|聊天室id

#### callback返回
```string``` callback返回字符串


## 错误码
错误码|含义
---|---
5001|非法的参数错误
5002|数据库错误
5003|权限错误
5004|请求的对象不存在
5005|请求参数存在冲突
5006|S3上传错误
5007|图片处理错误

## FAQ
敬请期待
