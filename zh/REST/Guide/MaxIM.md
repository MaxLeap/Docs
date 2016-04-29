# 即时通讯

下面根据具体 API 在更新

## API 列表

### 用户

| URL | HTTP | 功能 |
|-----|------|------|
| /ctx | GET | [搜索用户](#搜索用户) |
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

#### 搜索用户

自定义搜索用户, 您可以使用自定义用户属性作为搜索过滤条件, 另外还支持基础的分页过滤条件, 分页条件请参考[FAQ](#FAQ)。

以下示例搜索`city`为`shanghai`的用户:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx?city=shanghai"
```

如果搜索到结果, 则返回匹配列表, 如:

``` json
[
  {
    "id": "testuser1",
    "online": false,
    "ts": 1461827422054,
    "attributes": {
      "name": "隔壁老王",
      "gender": "male",
      "age": 46,
      "city": "shanghai"
    }
  }
]
```
其中id表示用户标识, online表示用户当前是否在线, ts表示最后更新时间戳, attributes表示用户属性。

#### 获取用户详情

根据**用户标识**来获取详细的用户信息。
用户标识用于标识应用内全局唯一的某个用户, 由字母、数字、下划线或中横线组成, 且长度不能超过128位。
以下举例标识为`testuser1`的用户详情:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
  "sessions": 1,
  "friends": [ "friendid1", "friendid2" ],
  "groups": [ "groupid1", "groupid2" ],
  "rooms": [ "roomid1", "roomid2" ]
}
```

其中attributes表示用户属性, installs表示用户的APP安装ID, sessions表示该用户当前在线数, friends表示该用户的好友列表, groups表示该用户已加入的群组列表, rooms表示该用户已加入的聊天室列表。

#### 设置用户属性

对系统中已存在的用户进行一些属性设置。本操作为追加形式写入, 当写入的属性已存在时则覆盖, 不存在时则新建。如果您需要完全覆盖重置, 请使用[覆盖更新用户属性](#覆盖更新用户属性)。
用户属性可以被用来读取或进行搜索。
以下举例为标识为`testuser1`的用户设置一些属性:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"name": "隔壁老李"}' \
    "http://im.maxleap.cn/ctx/testuser2/attributes"
```

当设置成功时, 系统会返回201状态码。

#### 获取用户属性

查询当前的用户属性。
以下示例查询标识为`testuser1`的用户属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes"
```

#### 获取某个用户属性

查询单个的用户属性。
以下示例查询用户标识为`testuser1`的`name`属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/attributes/name"
```

查询成功则返回属性值。无此属性则返回HTTP状态码404及错误信息。

#### 清空用户属性

强制清空用户的所有属性。
以下示例清空用户标识`testuser1`的所有属性:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser3/attributes"
```

清空成功则返回HTTP状态码204。

#### 添加用户好友

使两个用户彼此成为好友, 该调用为幂等操作, 可以顺序颠倒或多次调用。
以下示例让用户标识为`testuser1`和`testuser2`的用户彼此成为好友。

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

成功调用则返回友谊(friendship)信息:

``` json
{
  "id": "b9d61d4e80ad1f6d",
  "from": "testuser1",
  "to": "testuser2",
  "ns": "569d84a0169e7d00012c7afe",
  "ts": 1461824615892
}
```
其中, id唯一标识友谊, from表示建立友谊的发起人, to表示接受人, ns表示命名空间(等价于ApplicationID), ts表示最后更新时间戳。


#### 获取友谊信息

查询两个用户彼此的友谊信息。如果彼此不是好友或者用户标识不存在则返回错误信息。
以下示例尝试获取用户标识为`testuser1`和`testuser2`的友谊信息。

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser1/friends/testuser2"
```

成功调用则返回友谊(friendship)详情:

``` json
{
  "id": "b9d61d4e80ad1f6d",
  "from": "testuser1",
  "to": "testuser2",
  "online": false,
  "ts": 1461824615892
}
```
其中, id唯一标识友谊, from表示建立友谊的发起人, to表示接受人, online表示好友是否在线, ts表示最后更新时间戳。


#### 删除好友

擦除友谊信息, 令两人彼此不再是好友。本操作为幂等操作: 用户标识不存在, 顺序置换或者多次调用均可成功执行。
以下实例尝试删除用户标识为`testuser3`和`testuser4`之间的好友关系(友谊小船说翻就翻):

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/ctx/testuser3/friends/testuser4"
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
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
其中speaker表示发言者, content表示消息体(具体请参考FAQ), ts表示发言时间戳。


#### 获取用户好友列表

根据用户标识获取该用户的所有好友信息。默认仅返回每个好友的用户标识, 如需返回更详细的信息, 可追加过滤条件detail。

以下示例返回用户标识`testuser1`的所有好友详情:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
  }
]
```
其中id为好友的用户标识, online表示好友当前是否在线, recent为彼此的最近一条聊天记录。


#### 获取用户已经加入的群组列表

根据用户标识获取该用户已经加入的群组信息。默认仅返回每个群组的标识ID, 如需返回更详细的信息, 可追加过滤条件detail。

以下示例返回用户标识`testuser1`的所有群组信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"owner": "testuser1","members": ["testuser2"]}' \
    "http://im.maxleap.cn/groups"
```

调用成功将会返回该群的标识ID, 如:

``` json
"7c9fb6ca88ed41d58f69bb40b779d5bc"
```

#### 搜索群组

自定义搜索群组, 您可以使用自定义群组属性作为搜索过滤条件, 另外还支持基础的分页过滤条件, 分页条件请参考FAQ。

以下操作搜索company属性为maxleap的群组:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
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
    },
    "ts": 1458153453000
  }
]
```

#### 获取群组基础信息

根据群组标识ID获取群组信息。
以下示例获取群组标识为`11e930016e2e48d8b5faa6fd0ee90517`的群组信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/11e930016e2e48d8b5faa6fd0ee90517"
```

查询成功则返回群组信息, 范例如下:

``` json
{
  "owner": "testuser1",
  "members": [ "testuser2" ],
  "attributes": {
    "name": "我的测试群",
    "description": "专业测试一百年",
    "company": "maxleap"
  },
  "ts": 1456306512958
}
```

如果群组不存在则返回HTTP状态码404以及错误信息。

#### 更新群组基础信息

更新群组基础属性, 基础属性包括owner, members。当前版本系统只会处理这两个属性。

以下示例将群组`11e930016e2e48d8b5faa6fd0ee90517`的管理员设置为`testuser2`

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"owner": "testuser2"}' \
    "http://im.maxleap.cn/groups/11e930016e2e48d8b5faa6fd0ee90517"
```

更新成功则返回HTTP状态码201。

#### 删除群组

根据群组标识ID彻底删除群组。**该操作不可逆, 请谨慎调用**!

以下示例将删除标识为`b313c8af604a44f690ff9528b309ca1d`的群组:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/b313c8af604a44f690ff9528b309ca1d"
```

删除成功返回HTTP状态码204。

#### 设置群组属性

为某个群组自定义一些属性, 群组属性可以被用来作为搜索条件。具体请参考参考[搜索群组](#搜索群组)。

本操作为追加形式写入, 对已存在的属性进行覆写, 不存在的属性则新建并写入。如果您需要完全覆盖重置, 请使用[覆盖更新群组属性](#覆盖更新群组属性)。

以下示例为标识为`11e930016e2e48d8b5faa6fd0ee90517`的群组设置一些属性:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"company": "maxleap","star": 5}' \
    "http://im.maxleap.cn/groups/11e930016e2e48d8b5faa6fd0ee90517/attributes"
```

设置成功则返回HTTP状态码201。如果群组不存在则返回HTTP状态码404以及错误信息。

#### 覆盖更新群组属性

参考上文, 本API为上述的强制覆盖版本。

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"flag": "Game"}' \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

#### 获取群组属性

根据群组标识获取该群组的所有自定义属性。

以下示例返回群组标识为`11e930016e2e48d8b5faa6fd0ee90517`的所有属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/11e930016e2e48d8b5faa6fd0ee90517/attributes"
```

如果调用成功, 将返回类似如下格式的消息体:

``` json
{
  "name": "周杰伦粉丝群",
  "description": "这里是周杰伦粉丝的基地",
  "score": 5
}
```

#### 获取某个群组属性

获取单个的群组自定义属性。

以下示例返回群组标识为`11e930016e2e48d8b5faa6fd0ee90517`的`name`属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/11e930016e2e48d8b5faa6fd0ee90517/attributes/name"
```

调用成功则返回:

``` json
"周杰伦粉丝群"
```

如果属性不存在则返回HTTP状态码404及错误信息。


#### 清空群组属性

用于擦除群组所有自定义属性。本操作不可逆, 请谨慎调用。

以下示例擦除群组标识为`46b9c7cc4fc6428185a2e3a1c1f9e26e`的所有自定义属性:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/46b9c7cc4fc6428185a2e3a1c1f9e26e/attributes"
```

调用成功则返回HTTP状态码204。

#### 追加群组成员

为某个群组添加新的群组成员, 请确保群组标识和您要加入的成员标识在系统中存在! 否则系统会返回错误提示!

以下示例为标识为`35802e7cc8b546f2b51558f44fecc0ea`的群组添加新成员`testuser3`:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
   "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/members"
```

成功添加后返回HTTP状态码201。

#### 移除群组成员

为群组移除某些成员。调用前请确保群组标识存在, 并且**将要移除的成员标识不能为管理员**! 否则系统会返回错误消息。

以下示例为标识为`46b9c7cc4fc6428185a2e3a1c1f9e26e`的群组移除`testuser3`成员:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}'
    "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/members"
```

成功调用后返回HTTP状态码204。

#### 获取群组聊天记录

根据群组标识查询获取7天内的群组聊天记录。
您可以追加过滤字段:
 - **ts**: 标识截止时间戳, 默认为当前时间戳。
 - **limit**: 返回记录数, 默认为20条, 最大支持100。

以下示例返回群组标识为`db86cd76326d457da38ab05303722876`的聊天记录:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/db86cd76326d457da38ab05303722876/chats"
```

查询成功则返回聊天记录消息体:

``` json
[
  {
    "speaker": "testuser1",
    "content": {
      "media": 0,
      "body": "大家都在吗?"
    },
    "ts": 1454490959094
  }
]
```


#### 清空群组聊天记录

擦除保存在云端的群组聊天记录。该操作不可逆, 请谨慎调用!

以下示例擦除群组标识为`35802e7cc8b546f2b51558f44fecc0ea`的所有云端聊天记录:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/groups/35802e7cc8b546f2b51558f44fecc0ea/chats"
```

擦除成功返回HTTP状态码204。

### 聊天室

#### 创建聊天室

创建一个全新的聊天室。您可以额外指定初始化成员表(members)。

以下示例新建一个聊天室并初始化两位成员`testuser1`和`testuser2`:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser1","testuser2"]}' \
    "http://im.maxleap.cn/rooms"
```

调用成功系统将返回新建聊天室的标识ID, 如:

``` json
"7c9fb6ca88ed41d58f69bb40b779d5bc"
```

#### 搜索聊天室

自定义搜索聊天室, 您可以使用自定义聊天室属性作为搜索过滤条件, 另外还支持基础的分页过滤条件, 分页条件请参考FAQ。

以下操作搜索company属性为maxleap的聊天室:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms?company=maxleap"
```

成功调用后返回匹配的聊天室详情列表, 范例如下:

``` json
[
  {
    "id": "2a416cb1847d4700b0431f193f6418b7",
    "members": [ "testuser2", "testuser3" ],
    "attributes": {
      "company": "maxleap",
      "name": "test room",
      "description": "this is a test room",
      "city": "shanghai"
    },
    "ts": 1458153453000
  }
]
```

其中id为聊天室标识, members为聊天室当前成员列表, attributes为聊天室属性, ts为聊天室最后更新日期时间戳。


#### 获取聊天室基础信息

根据聊天室标识ID获取聊天室信息。 以下示例获取群组标识为`c0eebb302b1345fd983345336dd4eaa6`的聊天室信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6"
```

查询成功则返回聊天室信息, 范例如下:

``` json
{
  "members": [ "testuser1", "testuser2" ],
  "attributes": {
    "company": "maxleap",
    "name": "test room",
    "description": "this is a test room",
    "city": "shanghai"
  },
  "ts": 1458153453000
}
```

如果聊天室不存在则返回HTTP状态码404及错误信息。

#### 删除聊天室

根据聊天室标识ID彻底删除聊天室, 该操作不可逆,请谨慎调用!

以下示例将会彻底删除标识为`c0eebb302b1345fd983345336dd4eaa6`的聊天室:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6"
```

删除成功则返回HTTP状态码204。

#### 设置聊天室属性

为某个聊天室自定义一些属性, 聊天室属性可以被用来作为搜索条件。具体请参考参考[搜索聊天室](#搜索聊天室)。

本操作为追加形式写入, 对已存在的属性进行覆写, 不存在的属性则新建并写入。如果您需要完全覆盖重置, 请使用[覆盖更新聊天室属性](#覆盖更新聊天室属性)。

以下示例为标识为`c0eebb302b1345fd983345336dd4eaa6`的聊天室设置一些属性:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"city": "shanghai","score": 5}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

设置成功则返回HTTP状态码201。

#### 覆盖更新聊天室属性

参考上文, 本API为上述的强制覆盖版本。

``` shell
$ curl -X PUT \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"rate": "100%"}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

#### 获取聊天室属性

根据聊天室标识获取该聊天室的所有自定义属性。

以下示例返回群组标识为`c0eebb302b1345fd983345336dd4eaa6`的所有属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

如果调用成功, 将返回类似如下格式的消息体:

``` json
{
  "city": "shanghai",
  "score": 5
}
```

#### 获取某个聊天室属性

获取单个的聊天室自定义属性。

以下示例返回群组标识为`c0eebb302b1345fd983345336dd4eaa6`的`city`属性:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes/city"
```

调用成功则返回属性值, 如本例:

``` json
"shanghai"
```

如果属性不存在则返回HTTP状态码404及错误信息。

#### 清空聊天室属性

用于擦除聊天室所有自定义属性。本操作不可逆, 请谨慎调用。

以下示例擦除聊天室标识为`c0eebb302b1345fd983345336dd4eaa6`的所有自定义属性:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/attributes"
```

调用成功则返回HTTP状态码204。

#### 追加聊天室成员

为某个聊天室添加新的成员, 请确保聊天室标识和您要加入的成员标识在系统中存在! 否则系统会返回错误提示!

以下示例为标识为`c0eebb302b1345fd983345336dd4eaa6`的聊天室添加新成员`testuser3`:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/members"
```

#### 移除聊天室成员

为聊天室移除某些成员。调用前请确保聊天室标识存在, 否则系统会返回错误提示。

以下示例为标识为`c0eebb302b1345fd983345336dd4eaa6`的聊天室移除成员`testuser3`:

``` shell
$ curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"members": ["testuser3"]}' \
    "http://im.maxleap.cn/rooms/c0eebb302b1345fd983345336dd4eaa6/members"
```

成功调用后返回HTTP状态码204。

### 游客

#### 创建游客

创建一个游客, 您可以初始化一些自定义属性, 系统将会在创建时保存这些属性。

另外您可以指定一个游客标志(id), 用于唯一标志该游客, 如果不指定, 系统会随机分配一个标志。

以下示例创建一个包含`name`,`qq`和`age`属性的游客:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"name": "王尼玛","qq": 88888888,"age": 28}' \
    "http://im.maxleap.cn/passengers"
```

调用成功将会返回该游客的标志ID:

``` json
"58550388f9434168bf2019317b649265"
```

#### 获取游客基础信息

根据游客标志获取该游客的信息。

以下示例获取标志为`58550388f9434168bf2019317b649265`的游客信息:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://imuat.maxleap.cn/passengers/58550388f9434168bf2019317b649265"
```

成功获取后, 将返回该游客的所有属性:

``` json
{
  "name": "王尼玛",
  "qq": 88888888,
  "age": 28
}
```

如果该游客不存在, 则会返回HTTP状态码404及错误消息。


#### 获取游客聊天记录

根据游客标志和用户标志, 获取两者的云端历史聊天记录 ( 历史聊天记录最长保存1年 )。

以下示例返回游客`58550388f9434168bf2019317b649265`和用户`testtuser1`之间的云端聊天记录:

``` shell
$ curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://im.maxleap.cn/passengers/58550388f9434168bf2019317b649265/chats/testuser1"
```

成功调用后返回:

``` json
[
  {
    "speaker": "58550388f9434168bf2019317b649265",
    "content": {
      "media": 0,
      "body": "这个能包邮吗?"
    },
    "ts": 1460969109145
  },
  {
    "speaker": "testuser1",
    "content": {
      "media": 0,
      "body": "包邮的哦亲!"
    },
    "ts": 1460969109380
  }
]
```

### 系统消息

#### 给所有人发送系统消息

给应用内的所有在线用户发送系统消息。

以下示例发送内容为`hello all!`的文本消息:

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"content": {"media": 0,"body": "hello all!"}}' \
    "http://im.maxleap.cn/system"
```

发送成功则返回HTTP状态码202。

#### 给指定对象发送系统消息

给应用内的单个对象发送系统消息。仅当对象为用户或者群组时, 系统会尝试推送离线消息。

您可以指定对象类型, 默认为普通用户, 例如:
 - http://im.maxleap.cn/system/35802e7cc8b546f2b51558f44fecc0ea?group 发送对象为群组, 群组标识为`35802e7cc8b546f2b51558f44fecc0ea`
 - http://im.maxleap.cn/system/c0eebb302b1345fd983345336dd4eaa6?room 发送对象为聊天室, 聊天室标识为`c0eebb302b1345fd983345336dd4eaa6`


以下示例对标识为`testuser1`的用户发送系统消息。

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    -d '{"content":{"media": 0,"body": "hello!"}}' \
    "http://im.maxleap.cn/system/testuser1"
```

发送成功则返回HTTP状态码202。

### 附件

#### 上传附件

上传附件到服务器使用POST表单方式。当上传的文件为图片时, 系统会自动生成最大尺寸为128*128的缩略图。
使用时请注意:
 - **附件仅会在云端保存7天**
 - **附件大小限制为20MB**

``` shell
$ curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: multipart/form-data;" \
    -F "attachment=@[YOUR_LOCAL_FILE]" \
    "http://im.maxleap.cn/attachment"
```

如果上传成功且为图片文件, 则返回原图和缩略图的URL(其他格式则只有原文件URL), 例如:

``` json
[
  "http://s3.cn-north-1.amazonaws.com.cn/im.maxleap.cn/b9d61d4e/6bee2996.png",
  "http://s3.cn-north-1.amazonaws.com.cn/im.maxleap.cn/b9d61d4e/6bee2996.sm.png"
]
```

## FAQ

### 通用的请求头

| 名称 | 作用 | 示例 | 备注 |
|----|----|----|----|
| X-ML-AppId | 应用ID | X-ML-AppId: 569d84a0169e7d00012c7afe | 头名称大小写不敏感 |
| X-ML-Request-Sign | 应用签名 | X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060 | 头名称大小写不敏感, 值可以为MaxLeap的任意类型密钥 |
| X-Parrot-Version | 请求的聊天服务版本 | X-Parrot-Version: 2 | 头名称大小写不敏感, 可选项, 默认使用最新版本的API |

### 通用的分页过滤参数

| 参数名 | 作用 | 示例 | 备注 |
|----|----|----|----|
| _sort | 排序 | _sort=score,-age | 前缀`-`表示倒序 |
| _skip | 跳过记录数 | _skip=10 | 大于0 |
| _limit | 分页记录数 | _limit=30 | 最大为100 |

### 通用的消息内容格式

消息内容包含在一个消息的`content`字段中, 拥有两个字段:
 - **media**: 媒体类型(int)
   - 0: 文本
   - 1: 图片
   - 2: 音频
   - 3: 视频
   - 其他: 待扩展
 - **body**: 消息体(string), 一般除了文本之外, 其他可以设置为URL链接。
