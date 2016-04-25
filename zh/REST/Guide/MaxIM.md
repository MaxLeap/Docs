# 即时通讯

下面根据具体 API 在更新

## API 列表

### 用户

| URL | HTTP | 功能 |
|-----|------|------|
| /ctx/`<userId>` | GET | [获取用户详情](#获取用户详情) |
| /ctx/`<userId>`/attributes | POST | [设置用户属性](#设置用户属性) |
| /ctx/`<userId>`/attributes | PUT | [覆盖更新用户属性](#覆盖更新用户属性) |
| /ctx/`<userId>`/attributes | GET | [获取用户属性](#获取用户属性) |
| /ctx/`<userId>`/attributes/`<attribute>` | GET | [获取某个用户属性](#获取某个用户属性) |
| /ctx/`<userId>`/attributes | DELETE | [清空用户属性](#清空用户属性) |
| /ctx/`<userId>`/friends/`<friendId>` | POST | [添加用户好友](#添加用户好友) |
| /ctx/`<userId>`/friends/`<friendId>` | GET | [获取友谊信息](#获取友谊信息) |
| /ctx/`<userId>`/friends/`<friendId>` | DELETE | [删除好友](#删除好友) |
| /ctx/`<userId>`/friends/`<friendId>`/chats | GET | [获取好友聊天记录](#获取好友聊天记录) |
| /ctx/`<userId>`/friends | GET | [获取用户好友列表](#获取用户好友列表) |
| /ctx/`<userId>`/groups | GET | [获取用户已经加入的群组列表](#获取用户已经加入的群组列表) |
| /ctx/`<userId>`/rooms | GET | [获取用户已经加入的聊天室列表](#获取用户已经加入的聊天室列表) |

### 群组

| URL | HTTP | 功能 |
|-----|------|------|
| /groups | POST | [创建群组](#创建群组) |
| /groups | GET | [搜索群组](#搜索群组) |
| /groups/`<groupId>` | GET | [获取群组基础信息](#获取群组基础信息) |
| /groups/`<groupId>` | PUT | [更新群组基础信息](#更新群组基础信息) |
| /groups/`<groupId>` | DELETE | [删除群组](#删除群组) |
| /groups/`<groupId>`/attributes | POST | [设置群组属性](#设置群组属性) |
| /groups/`<groupId>`/attributes | PUT | [覆盖更新群组属性](#覆盖更新群组属性) |
| /groups/`<groupId>`/attributes | GET | [获取群组属性](#获取群组属性) |
| /groups/`<groupId>`/attributes/`<attribute>` | GET | [获取某个群组属性](#获取某个群组属性) |
| /groups/`<groupId>`/attributes | DELETE | [清空群组属性](#清空群组属性) |
| /groups/`<groupId>`/members | POST | [追加群组成员](#追加群组成员) |
| /groups/`<groupId>`/members | DELETE | [移除群组成员](#移除群组成员) |
| /groups/`<groupId>`/chats | GET | [获取群组聊天记录](#获取群组聊天记录) |
| /groups/`<groupId>`/chats | DELETE | [清空群组聊天记录](#清空群组聊天记录) |

### 聊天室

| URL | HTTP | 功能 |
|-----|------|------|
| /rooms | POST | 创建聊天室 |
| /rooms | GET | 搜索聊天室 |
| /rooms/`<roomId>` | GET | 获取聊天室基础信息 |
| /rooms/`<roomId>` | DELETE | 删除聊天室 |
| /rooms/`<roomId>`/attributes | POST | 设置聊天室属性 |
| /rooms/`<roomId>`/attributes | PUT | 覆盖更新聊天室属性 |
| /rooms/`<roomId>`/attributes | GET | 获取聊天室属性 |
| /rooms/`<roomId>`/attributes/`<attribute>` | GET | 获取某个聊天室属性 |
| /rooms/`<roomId>`/attributes | DELETE | 清空聊天室属性 |
| /rooms/`<roomId>`/members | POST | 追加聊天室成员 |
| /rooms/`<roomId>`/members | DELETE | 移除聊天室成员 |

### 游客

| URL | HTTP | 功能 |
|-----|------|------|
| /passengers | POST | 创建游客 |
| /passengers/`<passengerId>` | GET | 获取游客基础信息 |
| /passengers/`<passengerId>`/chats/`<userId>` | GET | 获取游客聊天记录 |

### 系统消息

| URL | HTTP | 功能 |
|-----|------|------|
| /system | POST | 给所有人发送系统消息 |
| /system/`<target>` | POST | 给指定对象发送系统消息 |

### 附件

| URL | HTTP | 功能 |
|-----|------|------|
| /attachment | POST | [上传附件](#上传附件) |


## API 详解

### 用户

#### 获取用户详情

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1"
```

#### 设置用户属性

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "隔壁老王","age": 46,"gender": "male"}' \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 覆盖更新用户属性

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "隔壁老李"}' \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 获取用户属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 获取某个用户属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes/name"
```

#### 清空用户属性

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 添加用户好友

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

#### 获取友谊信息

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

#### 删除好友

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

#### 获取好友聊天记录

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2/chats"
```

#### 获取用户好友列表

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends?detail"
```

#### 获取用户已经加入的群组列表

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/groups?detail"
```

#### 获取用户已经加入的聊天室列表

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/rooms?detail"
```

### 群组

#### 创建群组

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"owner": "testuser1","name": "testgroup1","members": ["testuser2"]}' \
    "http://im.maxleap.cn/groups"
```

#### 搜索群组

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542"
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups"
```

#### 获取群组基础信息

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e"
```

#### 更新群组基础信息

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542"
    -H "Content-Type: application/json" \
    -d '{"owner": "baz"}' \
    "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea"
```

#### 删除群组

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/b313c8af604a44f690ff9528b309ca1d"
```

#### 设置群组属性

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"company": "maxleap","star": 5}' \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

#### 覆盖更新群组属性

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"flag": "Game"}' \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

#### 获取群组属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

#### 获取某个群组属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes/name"
```

#### 清空群组属性

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

#### 追加群组成员

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
   "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/members"
```

#### 移除群组成员

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}'
    "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/members"
```

#### 获取群组聊天记录

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/db86cd76326d457da38ab05303722876/chats"
```

#### 清空群组聊天记录

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/chats"
```

### 附件

#### 上传附件

上传附件到服务器使用POST方式

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" \
    -F "attachment=@[YOUR_LOCAL_FILE]" \
    "http://im.maxleap.cn/attachment"
```

### 用户注册
### 用户登录
### 用户退出
### 其他

## FAQ
补充说明
