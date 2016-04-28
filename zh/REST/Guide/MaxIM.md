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
| /rooms | POST | [创建聊天室](#创建聊天室) |
| /rooms | GET | [搜索聊天室](#搜索聊天室) |
| /rooms/`<roomId>` | GET | [获取聊天室基础信息](#获取聊天室基础信息) |
| /rooms/`<roomId>` | DELETE | [删除聊天室](#删除聊天室) |
| /rooms/`<roomId>`/attributes | POST | [设置聊天室属性](#设置聊天室属性) |
| /rooms/`<roomId>`/attributes | PUT | [覆盖更新聊天室属性](#覆盖更新聊天室属性) |
| /rooms/`<roomId>`/attributes | GET | [获取聊天室属性](#获取聊天室属性) |
| /rooms/`<roomId>`/attributes/`<attribute>` | GET | [获取某个聊天室属性](#获取某个聊天室属性) |
| /rooms/`<roomId>`/attributes | DELETE | [清空聊天室属性](#清空聊天室属性) |
| /rooms/`<roomId>`/members | POST | [追加聊天室成员](#追加聊天室成员) |
| /rooms/`<roomId>`/members | DELETE | [移除聊天室成员](#移除聊天室成员) |

### 游客

| URL | HTTP | 功能 |
|-----|------|------|
| /passengers | POST | [创建游客](#创建游客) |
| /passengers/`<passengerId>` | GET | [获取游客基础信息](#获取游客基础信息) |
| /passengers/`<passengerId>`/chats/`<userId>` | GET | [获取游客聊天记录](#获取游客聊天记录) |

### 系统消息

| URL | HTTP | 功能 |
|-----|------|------|
| /system | POST | [给所有人发送系统消息](#给所有人发送系统消息) |
| /system/`<target>` | POST | [给指定对象发送系统消息](#给指定对象发送系统消息) |

### 附件

| URL | HTTP | 功能 |
|-----|------|------|
| /attachment | POST | [上传附件](#上传附件) |


## API 详解

### 用户

#### 获取用户详情

根据**用户标识**来获取详细的用户信息。
用户标识用于标识应用内全局唯一的某个用户, 由字母、数字、下划线或中横线组成, 且长度不能超过128位。
以下举例标识为`testuser1`的用户详情:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1"
```

获取成功时, 将返回用户详情:

``` json
{
  "attributes": {
    "key1": "value1",
    "key2": "value2"
  },
  "installs": [ "installid1", "installid2" ],
  "sessions": 1,    // 当前会话数
  "friends": [ "friendid1", "friendid2" ],
  "groups": [ "groupid1", "groupid2" ],
  "rooms": [ "roomid1", "roomid2" ]
}
```

#### 设置用户属性

对系统中已存在的用户进行一些属性设置。本操作为追加形式写入, 当写入的属性已存在时则覆盖, 不存在时则新建。如果您需要完全覆盖重置, 请使用[覆盖更新用户属性](#覆盖更新用户属性)。
用户属性可以被用来读取或进行搜索。
以下举例为标识为`testuser1`的用户设置一些属性:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "隔壁老王","age": 46,"gender": "male"}' \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

当设置成功时, 系统会返回201状态码。

#### 覆盖更新用户属性

类似[设置用户属性](#设置用户属性), 但本操作会强制重置并覆盖所有属性。
以下举例为标识为`testuser1`的用户设置一些属性:

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "隔壁老李"}' \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

当设置成功时, 系统会返回201状态码。

#### 获取用户属性

查询当前的用户属性。
以下示例查询标识为`testuser1`的用户属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 获取某个用户属性

查询单个的用户属性。
以下示例查询用户标识为`testuser1`的`name`属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes/name"
```

查询成功则返回属性值。无此属性则返回HTTP状态码404及错误信息。

#### 清空用户属性

强制清空用户的所有属性。
以下示例清空用户标识`testuser1`的所有属性:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

清空成功则返回HTTP状态码204。

#### 添加用户好友

使两个用户彼此成为好友, 该调用为幂等操作, 可以顺序颠倒或多次调用。
以下示例让用户标识为`testuser1`和`testuser2`的用户彼此成为好友。

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

成功调用则返回友谊(friendship)信息:

``` json
{
  "id": "b9d61d4e80ad1f6d",
  "from": "testuser1",
  "to": "testuser2",
  "ns": "56a86320e9db7300015438f7",
  "ts": 1461824615892
}
```
其中, id唯一标识友谊, from表示建立友谊的发起人, to表示接受人, ns表示命名空间(等价于ApplicationID), ts表示最后更新时间戳。


#### 获取友谊信息

查询两个用户彼此的友谊信息。如果彼此不是好友或者用户标识不存在则返回错误信息。
以下示例尝试获取用户标识为`testuser1`和`testuser2`的友谊信息。

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

返回的消息体参考上文。

#### 删除好友

擦除友谊信息, 令两人彼此不再是好友。本操作为幂等操作: 用户标识不存在, 顺序置换或者多次调用均可成功执行。
以下实例尝试删除用户标识为`testuser1`和`testuser2`之间的好友关系(友谊小船说翻就翻):

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

成功调用后返回HTTP状态码204。

#### 获取好友聊天记录

查询最近7天的两位好友之间的聊天记录。

您可以额外添加过滤参数:
 - ts: 查询截止时间戳, 默认为当前时间戳。
 - limit: 返回记录数, 默认为20条, 最大可设置为100。

以下示例返回用户标识`testuser1`和`testuser2`最近的20条聊天记录:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2/chats"
```

请求成功会返回聊天记录数组, 以下为范例:

``` json
[
  {
    "speaker": "testuser1",
    "content": {
        "media": 0,
        "body": "Hello!"
    },
    "ts": 1454490959094
  }
]
```
其中speaker表示发言者, content表示消息体(具体请参考附录), ts表示发言时间戳。


#### 获取用户好友列表

根据用户标识获取该用户的所有好友信息。默认仅返回每个好友的用户标识, 如需返回更详细的信息, 可追加过滤条件detail。

以下示例返回用户标识`testuser1`的所有好友详情:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends?detail"
```

成功调用后会返回好友信息列表, 以下范例为追加detail后的返回格式:

``` json
[
  {
    "id": "testuser2",
    "online": false,
    "recent": {
      "speaker": "testuser1",
      "content": {
        "media": 0,
        "body": "Hello!",
    },
    "ts": 1454490959094
  }
]
```
其中id为好友的用户标识, online表示好友当前是否在线, recent为彼此的最近一条聊天记录。


#### 获取用户已经加入的群组列表

根据用户标识获取该用户已经加入的群组信息。默认仅返回每个群组的标识ID, 如需返回更详细的信息, 可追加过滤条件detail。

以下示例返回用户标识`testuser1`的所有群组信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/groups?detail"
```

成功调用后会返回群组信息列表, 以下范例为追加detail后的返回格式:

``` json
[
  {
    "id": "7c9fb6ca88ed41d58f69bb40b779d5bc",
    "owner": "testuser1",
    "attributes": {
        "name": "周杰伦粉丝群",
        "description": "这里是周杰伦粉丝的基地!"
    },
    "members": [ "testuser2", "testuser3" ],
    "ts": 1456306512958,
    "recent": {
      "speaker": "testuser1",
      "content": {
        "media": 0,
        "body": "hello everyone."
      },
      "ts": 1454490959094
    }
  }
]
```
其中id为群组标识, owner为群管理员的用户标识, attributes为群属性, members为群成员表, recent为该群的最近一条聊天信息, ts表示群创建日期时间戳。

#### 获取用户已经加入的聊天室列表

根据用户标识获取该用户已经加入的聊天室信息。默认仅返回每个聊天室的标识ID, 如需返回更详细的信息, 可追加过滤条件detail。

以下示例返回用户标识`testuser1`的所有聊天室信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/rooms?detail"
```

成功调用后会返回聊天室信息列表, 以下范例为追加detail后的返回格式:

``` json
[
  {
    "id": "7c9fb6ca88ed41d58f69bb40b779d5bc",
    "attributes": {
        "name": "周杰伦粉丝群",
        "description": "这里是周杰伦粉丝的基地!"
    },
    "members": [ "testuser2", "testuser3" ],
    "ts": 1456306512958
  }
]
```

其中id为聊天室标识, attributes为聊天室属性, members为聊天室成员表, ts表示聊天室创建日期时间戳。


### 群组

#### 创建群组

新建一个群组, 调用时您必须指定一个群管理员(owner)。另外您也可以指定初始化成员(members)。

以下提交将会创建一个群, 管理员用户标识为`testuser1`, 额外的初始化成员为`testuser2`:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"owner": "testuser1","members": ["testuser2"]}' \
    "http://im.maxleap.cn/groups"
```

调用成功将会返回该群的标识ID, 如:

``` json
"7c9fb6ca88ed41d58f69bb40b779d5bc"
```

#### 搜索群组

自定义搜索群组, 您可以使用自定义群组属性作为搜索过滤条件, 另外还支持基础的分页过滤条件, 分页条件请参考附录。

以下操作搜索company属性为maxleap的群组:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542"
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups?company=maxleap"
```

成功调用后返回匹配的群组详情列表, 范例如下:

``` json
[
  {
    "id": "4fced5ee96ac438bbf56b4a1fd87d330",
    "owner": "testuser1",
    "members": [ "testuser2", "testuser3" ],
    "attributes": {
      "name": "test group",
      "description": "this is a test group",
      "company": "maxleap"
    }
    "ts": 1458153453000
  }
]
```


#### 获取群组基础信息

根据群组标识ID获取群组信息。
以下示例获取群组标识为`46b9c7cc4fc6428185a2e3a1c1f9e26e`的群组信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e"
```

查询成功则返回群组信息, 范例如下:

``` json
{
  "owner": "testuser1",
  "members": [ "testuser2", "testuser3" ],
  "attributes": {
    "name": "test group",
    "description": "this is a test group",
    "company": "maxleap"
  },
  "ts": 1456306512958
}
```

如果群组不存在则返回HTTP状态码404以及错误信息。

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

### 聊天室

#### 创建聊天室

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "room_test","members": ["testuser1","testuser2"]}' \
    "http://im.maxleap.cn/rooms"
```

#### 搜索聊天室

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms"
```

#### 获取聊天室基础信息

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6"
```

#### 删除聊天室

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6"
```

#### 设置聊天室属性

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"company": "maxleap","star": 5}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

#### 覆盖更新聊天室属性

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"rate": "100%"}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

#### 获取聊天室属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

#### 获取某个聊天室属性

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes/company"
```

#### 清空聊天室属性

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

#### 追加聊天室成员

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/members"
```

#### 移除聊天室成员

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/members"
```

### 游客

#### 创建游客

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"name": "王尼玛"}' \
    "http://im.maxleap.cn/passengers"
```

#### 获取游客基础信息

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://imuat.maxleap.cn/passengers/58550388f9434168bf2019317b649265"
```

#### 获取游客聊天记录

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/passengers/58550388f9434168bf2019317b649265/chats/testuser1"
```

### 系统消息

#### 给所有人发送系统消息

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"content": {"media": 0,"body": "hello all!"}}' \
    "http://im.maxleap.cn/system"
```

#### 给指定对象发送系统消息

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: application/json" \
    -d '{"content":{"media": 0,"body": "hello!"}}' \
    "http://im.maxleap.cn/system/testuser1"
```

### 附件

#### 上传附件

上传附件到服务器使用POST表单方式。

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 56a86320e9db7300015438f7" \
    -H "X-ML-Request-Sign: aa2cdfc982f44a770b4be0dec7d3a1df,1456373078542" \
    -H "Content-Type: multipart/form-data;" \
    -F "attachment=@[YOUR_LOCAL_FILE]" \
    "http://im.maxleap.cn/attachment"
```

## FAQ
补充说明
