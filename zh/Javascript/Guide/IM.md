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

## 基础概念
### 用户
> 一个用户由用户标识、多个安装ID构成，是构成聊天系统最基本的元素。用户可以收发消息、建立好友关系、加入群组或聊天室进行多人交流等等。

### 消息
> 消息是指由用户或者系统发出，并由另一端用户接收的一段信息。消息支持多种媒体类型，其中包括: 文本，图片，音频和视频。

### 单聊
> 单聊是指两个已经成为好友的用户彼此进行消息收发。单聊具有私密性，仅好友之间可见。

> 当接收端的好友处于离线状态时，系统将会对其进行离线消息推送。

> 后台会保存7天的好友历史聊天记录以供查询。

### 群组
> 群组用于提供多个用户(上限为50个)进行交流的场所，群组聊天信息支持7天历史记录保存以及离线成员消息推送。

### 聊天室
> 聊天室是大型的群组，其人数上限为1000人，但与群组相比，其不支持历史记录保存以及离线成员消息推送

## 注意事项

1. MaxIM 不存储用户详细信息, 开发者维护自己的用户系统, 只需适配用户标识ID进行对接。您可以直接使用 MaxLeap 的账户系统, 这样可以减少开发成本。

2. 离线推送必须在登录时提供应用安装ID。


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
目前可以采取两种不同的模式登录：

模式一：使用自己的账号系统，那么只需要提供userId

模式二：使用Maxleap的账号系统，那么需要username和password

参数|类型|约束|默认|说明
---|---|---|---|---
**options**|Object|必须||配置实时通信服务所需的必要参数。其中包括：
&nbsp;&nbsp;&nbsp;&nbsp; appId|String|必须||应用的 appId，
&nbsp;&nbsp;&nbsp;&nbsp; clientId|String|必须||app 的 Client Key 或者 Javascript Key 或者 REST API Key 或者 Master Key
&nbsp;&nbsp;&nbsp;&nbsp; userId|String|模式一必须||当前客户的唯一 id，用来标示当前客户。
&nbsp;&nbsp;&nbsp;&nbsp; username|String|模式二必须||当前客户的username。
&nbsp;&nbsp;&nbsp;&nbsp; password|String|模式二必须||当前客户的password。
&nbsp;&nbsp;&nbsp;&nbsp; installId|String|||当前客户端的设备 id，用来标示当前设备。如果需要离线接收推送消息的话，必须提供。
&nbsp;&nbsp;&nbsp;&nbsp; region|String||cn|选择服务部署的节点，如果是美国节点，则设置为 `us`，如果是国内节点，则设置为 `cn`。

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
// (模式二)password
var password = 'password';
// installId 是你的设备id
var installId = 'M3pyVEdsSFBBZm5UTDlLMTB3a0xYdw'；
var im;

// 创建实时通信实例--模式一（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         userId: userId,
         installId: installId,
         region: 'cn'
       },function(data){
         /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
             {
                 id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
                 success: true,        //  是否登录成功
                 error: 5003        // 错误码，仅当登录失败时
             }
        */
				 });
// 创建实时通信实例--模式一（支持单页多实例）
im = ML.im({
         appId: appId,
         clientId: clientId,
         username: username,
         password: password,
         installId: installId,
         region: 'cn'
       },function(data){
         /* 处理登录结果,当登录失败时服务器最后会断开连接。消息结构如下:
         {
             id: 'YOUR_LOGIN_USER_ID',    // 模式一为userId。模式二为Maxleap账号系统中的用户的objectId
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
  "installs": ["installation1","installation2"],
  "friends": ["bar"],
  "groups": ["50bd8c3eba4044ca97f099aed0a0efa2"],
  "rooms": ["50bd8c3eba4044ca97f099aed0a0efa3"]
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
  "name":"xxx group",    // 群组名称
  "owner":"foo",    // 群组管理员
  "members": ["ar","az","oo"],    // 群组成员ID
  "ts": 1456306512958
}
```

### ML.im.updateGroup

修改一个Group的信息。

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
  "members": ["bar","foo"],
  "name": "room_test",
  "ts": 1456471029751
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
