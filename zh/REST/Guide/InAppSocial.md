# 应用内社交

## API 列表
###关系

URL	| HTTP |	功能
------|--------|--------
`/relation`|POST|	创建或者更新用户关系表
`/relation/objectId/<objectId>`|GET|	获取用户关系
`/relation/status`|GET|	 获取2个用户之间的关注状态
`/relation/getRelation`|GET| 得到2个用户的关系
`/relation/follows`|	POST| 获取关注列表
`/relation/followers`	|POST|	获取粉丝列表
`/relation/objectId/<objectId>`|	DELETE| 删除关系
`/relation/delete`|	DELETE	| 删除关系
###说说
URL	| HTTP |	功能
------|--------|--------
`/shuo`|POST|	 创建或者更新说说
`/shuo/objectId/<objectId>`|GET|	获取说说
`/shuo/list`|POST| 得到说说列表
`/shuo/near`|	POST| 得到指定区域附近的说说
`/shuo/latest`	|POST|	得到最新的一些说说
`/shuo/getAll`	|POST|	得到一条说说所有内容
`/shuo/friendCircle`	|POST|	得到朋友圈说说
`/shuo/photosdelete `|	DELETE	| 删除说说
###地理位置
URL	| HTTP |	功能
------|--------|--------
`/location`|POST|	创建或者更新用户和地理位置的对应关系
`/location/near`|POST|	得到指定地点指定距离内的人
`/location/<objectId>`|GET|	 获得用户和地理对应关系
`/location/userId/<userId>`|GET| 获取用户的地理信息
`/relation/<objectId>`|	DELETE| 删除用户和地理对应关系
###评论
URL	| HTTP |	功能
------|--------|--------
`/comment`|POST|	创建或者更新评论
`/comment/list`|POST|	获取评论列表
`/comment/update`|POST|	更新评论已读状态
`/comment/objectId/<objectId>`|GET|	 获得评论
`/comment/unread`|GET| 得到未读评论
`/comment/objectId/<objectId>`|	DELETE| 删除评论
###通行证
URL	| HTTP |	功能
------|--------|--------
`/socialpass/register`|POST|	注册
`/socialpass/login`|POST|	登陆（账号密码）
`/socialpass/smsCode`|POST|	获取短信验证码
`/socialpass/loginByMobile`|POST|	 短信验证码登陆

## API 详解

### 关系
####创建或者更新用户关系
创建一个用户关系，或者更新对应的用户关系。请求中reverse字段表示2者是否相互关注:

```json
Request:
{
  "userId": "5641b10b3330920001f1f7b1",
  "followerId": "5641b10b3330920001f1f7a1",
  "reverse": true
}
```
返回创建或者更新结果：

```json
Response:
[{"updateResult":1},{"updateResult":1}]
or
[
    {
        "createdAt": "2016-04-07T03:39:54.460Z",
        "objectId": "5705d68a6b85b3410eaaabcc"
    },
    {
        "createdAt": "2016-04-07T03:39:54.460Z",
        "objectId": "5705d68a6b85b3410eaaabcd"
    }
]
```
####获取用户关系
请求根据objectId获取用户关系:

```json
Response:
{
  "createdAt": "2016-03-22T07:42:07.127Z",
  "black": false,
  "followerId": "5641b10b3330920001f1f7v1",
  "reverse": true,
  "userId": "5641b10b3330920001f1f7b1",
  "objectId": "56f0f74f6b85b309eda7ae53",
  "updatedAt": "2016-03-22T07:42:07.127Z"
}
```
####获取2个用户之间的关注状态
query中根据userId和followerId获取相互之间的关注状态：</br>
status:
1:相互关注
0：已关注
-1：未关注

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/status?followerId=5704e0e9667a2300015c1bd0&userId=5704e0c3667a2300015c1bce"
```
```json
Response:
{"status":1}
```
####得到2个用户的关系
query中根据userId和followerId获取2个用户的关系：

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/relation/getRelation?followerId=5704e0e9667a2300015c1bd0&userId=5704e0c3667a2300015c1bce"
```
返回一条Relation详细信息：

```json
Response:
{
    "results":
        {
            "createdAt": "2016-04-08T09:33:19.123Z",
            "black": false,
            "followerId": "567",
            "reverse": false,
            "userId": "321",
            "objectId": "57077adf6b85b34b67fe4921",
            "updatedAt": "2016-04-08T09:33:19.123Z"
        }
}
```
####获取关注列表
请求followerId，得到其关注的所有人，支持分页(参数详见FAQ)：

```json
Request:
{
    "followerId":"5641b10b3330920001f1f7v1"
}
Response:
{
  "results": [
    {
      "createdAt": "2016-03-22T07:42:07.127Z",
      "black": false,
      "followerId": "5641b10b3330920001f1f7v1",
      "reverse": true,
      "userId": "5641b10b3330920001f1f7b1",
      "objectId": "56f0f74f6b85b309eda7ae53",
      "updatedAt": "2016-03-22T07:42:07.127Z"
    }
  ]
}
```
####获取粉丝列表
请求userId，得到其粉丝列表，支持分页(参数详见FAQ)：

```json
Request:
{
    "userId":"5641b10b3330920001f1f7b1"
}
Response:
{
  "results": [
    {
      "createdAt": "2016-03-22T07:42:07.127Z",
      "black": false,
      "followerId": "5641b10b3330920001f1f7v1",
      "reverse": true,
      "userId": "5641b10b3330920001f1f7b1",
      "objectId": "56f0f74f6b85b309eda7ae53",
      "updatedAt": "2016-03-22T07:42:07.127Z"
    },
    {
      "createdAt": "2016-03-18T07:45:37.349Z",
      "black": false,
      "followerId": "5641b10b3330920001f1f7a1",
      "reverse": true,
      "userId": "5641b10b3330920001f1f7b1",
      "objectId": "56ebb2216b85b356e380daf2",
      "updatedAt": "2016-03-22T07:39:06.345Z"
    }
  ]
}
```
####删除关系
根据关系表的objectId来删除关系

```shell
curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/relation/objectId/{objectId}
```
根据userId来删除关系：

```shell
curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/relation/delete?userId=xxx
```
### 说说
####创建或者更新说说
字段：userId,content,link,longitude,latitude,friendCircle
地理位置字段可选，文件，文字内容和连接不能3者都有也不能都没有，friendCircle字段默认false
采用form-data方式提交

####获取说说
根据objectId获取说说:

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/shuo/objectId/{objectId}
```
返回一条说说信息：

```json
{
            "createdAt": "2016-04-07T08:01:03.645Z",
            "photopath": ["https://s3.cn-north-1.amazonaws.com.cn/social.maxleap.cn/file-uploads/56c5719d654e350001dc6e66/5641b10b3330920001f1f7a4/570613bf6b85b3436e86aa43/338be31c-78dd-479a-9266-8ee150b312f1"],
            "location": [
                40.1,
                20.1
            ],
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa*，*，呵呵呵呵",
            "friendCircle": false,
            "objectId": "570613bf6b85b3436e86aa43",
            "updatedAt": "2016-04-07T08:01:03.645Z"
        }
```
####得到说说列表
根据userId得到说说列表,black字段是从relation中query出来得到，支持分页(参数详见FAQ)，返回说说的同时会把对应的评论和赞一起返回

```json
Request:
{
    "userId":"5641b10b3330920001f1f7b1",
    "black": false
}
Response:
{
    "results": [
        {
            "createdAt": "2016-04-07T08:01:03.645Z",
            "photopath": ["https://s3.cn-north-1.amazonaws.com.cn/social.maxleap.cn/file-uploads/56c5719d654e350001dc6e66/5641b10b3330920001f1f7a4/570613bf6b85b3436e86aa43/338be31c-78dd-479a-9266-8ee150b312f1"],
            "location": [
                40.1,
                20.1
            ],
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa*，*，呵呵呵呵",
            "friendCircle": false,
            "objectId": "570613bf6b85b3436e86aa43",
            "updatedAt": "2016-04-07T08:01:03.645Z"
        }
    ],
    "comments": {
        "5704b2b26b85b33d02184f08": [
            {
                "createdAt": "2016-04-06T06:57:49.037Z",
                "read": false,
                "zan": false,
                "shuoId": "5704b2b26b85b33d02184f08",
                "userId": "5641b10b3330920001f1f7a4",
                "content": "fuck test!",
                "objectId": "5704b36d6b85b33d2cab54b8",
                "updatedAt": "2016-04-06T06:57:49.037Z"
            }
        ]
    },
    "zans": {
        "570608016b85b342ce46b8a8": [
            {
                "createdAt": "2016-04-07T10:58:39.670Z",
                "read": false,
                "zan": true,
                "shuoId": "570608016b85b342ce46b8a8",
                "userId": "56f9f06c667a2300017c706b",
                "objectId": "57063d5f238c8f0001b942bf",
                "updatedAt": "2016-04-07T10:58:39.670Z"
            }
        ]
    }
}
```
####得到指定区域附近的说说
得到指定区域附近的说说，支持分页(参数详见FAQ)，返回说说的同时会把对应的评论和赞一起返回

```json
Request:
{
    "latitude": 40.2,
    "longitude": 20.1,
    "distance": 100000000
}
Response:
{
    "results": [
        {
            "createdAt": "2016-04-07T08:01:03.645Z",
            "photopath": ["https://s3.cn-north-1.amazonaws.com.cn/social.maxleap.cn/file-uploads/56c5719d654e350001dc6e66/5641b10b3330920001f1f7a4/570613bf6b85b3436e86aa43/338be31c-78dd-479a-9266-8ee150b312f1"],
            "location": [
                40.1,
                20.1
            ],
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa*，*，呵呵呵呵",
            "friendCircle": false,
            "objectId": "570613bf6b85b3436e86aa43",
            "updatedAt": "2016-04-07T08:01:03.645Z"
        }
    ],
    "comments": {
        "5704b2b26b85b33d02184f08": [
            {
                "createdAt": "2016-04-06T06:57:49.037Z",
                "read": false,
                "zan": false,
                "shuoId": "5704b2b26b85b33d02184f08",
                "userId": "5641b10b3330920001f1f7a4",
                "content": "fuck test!",
                "objectId": "5704b36d6b85b33d2cab54b8",
                "updatedAt": "2016-04-06T06:57:49.037Z"
            }
        ]
    },
    "zans": {
        "570608016b85b342ce46b8a8": [
            {
                "createdAt": "2016-04-07T10:58:39.670Z",
                "read": false,
                "zan": true,
                "shuoId": "570608016b85b342ce46b8a8",
                "userId": "56f9f06c667a2300017c706b",
                "objectId": "57063d5f238c8f0001b942bf",
                "updatedAt": "2016-04-07T10:58:39.670Z"
            }
        ]
    }
}
```
####得到最新的一些说说
得到最新的一些说说，默认50条,支持分页(参数详见FAQ)，返回说说的同时会把对应的评论和赞一起返回

```shell
curl -X POST \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/shuo/latest
```
返回结果：

```json
Response:
{
    "results": [
        {
            "createdAt": "2016-04-07T08:01:03.645Z",
            "photopath": ["https://s3.cn-north-1.amazonaws.com.cn/social.maxleap.cn/file-uploads/56c5719d654e350001dc6e66/5641b10b3330920001f1f7a4/570613bf6b85b3436e86aa43/338be31c-78dd-479a-9266-8ee150b312f1"],
            "location": [
                40.1,
                20.1
            ],
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa*，*，呵呵呵呵",
            "friendCircle": false,
            "objectId": "570613bf6b85b3436e86aa43",
            "updatedAt": "2016-04-07T08:01:03.645Z"
        }
    ],
    "comments": {
        "5704b2b26b85b33d02184f08": [
            {
                "createdAt": "2016-04-06T06:57:49.037Z",
                "read": false,
                "zan": false,
                "shuoId": "5704b2b26b85b33d02184f08",
                "userId": "5641b10b3330920001f1f7a4",
                "content": "fuck test!",
                "objectId": "5704b36d6b85b33d2cab54b8",
                "updatedAt": "2016-04-06T06:57:49.037Z"
            }
        ]
    },
    "zans": {
        "570608016b85b342ce46b8a8": [
            {
                "createdAt": "2016-04-07T10:58:39.670Z",
                "read": false,
                "zan": true,
                "shuoId": "570608016b85b342ce46b8a8",
                "userId": "56f9f06c667a2300017c706b",
                "objectId": "57063d5f238c8f0001b942bf",
                "updatedAt": "2016-04-07T10:58:39.670Z"
            }
        ]
    }
}
```
####得到一条说说所有内容
返回说说的同时会把对应的评论和赞一起返回

```json
Request:
{
    "userId": "5641b10b3330920001f1f7a4",
    "shuoId": "5704b2b26b85b33d02184f08"
}
response:
{
    "results": {
        "comments": [],
        "zans": [],
        "shuo": {
            "createdAt": "2016-04-08T07:05:58.027Z",
            "photopath": [
                "https://s3.cn-north-1.amazonaws.com.cn/social.maxleap.cn/file-uploads/56c5719d654e350001dc6e66/5641b10b3330920001f1f7a7/570758566b85b349ab08e7bd/828134d3-6bfa-4652-8253-370ba7d94880"
            ],
            "location": [
                40.1,
                20.1
            ],
            "userId": "5641b10b3330920001f1f7a7",
            "content": "just a testaa*，*，呵呵呵呵",
            "friendCircle": false,
            "objectId": "570758566b85b349ab08e7bd",
            "updatedAt": "2016-04-08T07:05:58.027Z"
        }
    }
}
```
####得到朋友圈关注人的说说以及评论和赞
得到朋友圈关注人的说说以及评论和赞,支持分页(参数详见FAQ)

```json
Request:
{
    "userId": "123"
}
Response:
{
    "results": [
        {
            "createdAt": "2016-03-30T07:00:27.647Z",
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa*，*，呵呵呵呵",
            "objectId": "56fb798b6b85b32682580896",
            "updatedAt": "2016-03-30T07:00:27.647Z"
        },
        {
            "createdAt": "2016-03-29T07:51:13.701Z",
            "userId": "5641b10b3330920001f1f7a4",
            "content": "just a testaa",
            "objectId": "56fa33f1238c8f000122a378",
            "updatedAt": "2016-03-29T07:51:13.701Z"
        },
    ],
    "comments": {},
    "zans": {}
}
```
####删除说说
删除说说以及对应的图片

```json
Request:
{
    "userId": "5641b10b3330920001f1f7a7",
    "objectId": "570f13e9238c8f0001d622ef"
}
Response:
{"shuoDeleteRes":1,"photosDelRes":true}
```
###地理位置
####创建或者更新用户和地理位置的对应关系
参数说明：coordinates里面第一行代表经度longitude,第二行代表纬度latitude。

```json
Request:
{
  "userId": "5641b10b3330920001f1f7a5",
  "location": {
    "type": "Point",
    "coordinates": [
      40,
      5
    ]
  }
}
Response:
{
  "objectId": "56f10f3d6b85b30b2463dc76",
  "createdAt": "2016-03-22T09:24:13.079Z"
}
```
####得到指定地点指定距离内的人

```json
Request:
{
  "userId": "5641b10b3330920001f1f7a5",
  "latitude":5,
  "longitude":40,
  "distance": 100000
}
Response:
[
  {
    "createdAt": "2016-03-22T09:24:13.079Z",
    "location": {
      "type": "Point",
      "coordinates": [
        40,
        5
      ]
    },
    "userId": "5641b10b3330920001f1f7a5",
    "objectId": "56f10f3d6b85b30b2463dc76",
    "updatedAt": "2016-03-22T09:24:13.079Z"
  }
]
```
####获得用户和地理对应关系
根据objectId获得用户和地理对应关系:

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/location/objectId/{objectId}
```
####获取用户的地理信息
根据userId获取用户的地理信息：

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/location/userId/{userId}
```
```json
Response:
[
  {
    "createdAt": "2016-03-22T09:24:13.079Z",
    "location": {
      "type": "Point",
      "coordinates": [
        40,
        5
      ]
    },
    "userId": "5641b10b3330920001f1f7a5",
    "objectId": "56f10f3d6b85b30b2463dc76",
    "updatedAt": "2016-03-22T09:24:13.079Z"
  }
]
```
####删除用户和地理对应关系
根据objectId删除用户和地理对应关系：

```shell
curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/location/objectId/{objectId}

```
###评论
####创建或者更新评论
创建或者更新评论，评论id就是objectId：

```json
Request:
{
  "userId": "5641b10b3330920001f1f7a5",
  "content": "waht?",
  "shuoId":"5641b10b3330920001f1f7a2",
  "zan":false
}
Response:
{
  "objectId": "56f116156b85b30b79b20078",
  "createdAt": "2016-03-22T09:53:25.668Z"
}
```
####获取评论列表
获取评论列表,请求可选字段：zan:默认false，支持分页(参数详见FAQ)

```json
Request:
{
  "shuoId":"5641b10b3330920001f1f7a2"
}
Response:
{
  "results": [
    {
      "createdAt": "2016-03-22T09:53:25.668Z",
      "read": false,
      "zan": false,
      "shuoId": "5641b10b3330920001f1f7a2",
      "userId": "5641b10b3330920001f1f7a5",
      "content": "waht?",
      "objectId": "56f116156b85b30b79b20078",
      "updatedAt": "2016-03-22T09:53:25.668Z"
    }
  ]
}
```
####更新评论已读状态
```json
Request:
{
  "objectId": "570620dd238c8f0001b4e85b",
  "read": true
}
Response:
{
    "updateResult": true
}
```
####获得评论
根据objectId获得评论：

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/comment/objectId/{objectId}
```
####得到未读评论
```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/comment/unread?shuoId=xxx
```
```json
Response:
{
  "results": [
    {
      "createdAt": "2016-03-22T09:53:25.668Z",
      "read": false,
      "zan": false,
      "shuoId": "5641b10b3330920001f1f7a2",
      "userId": "5641b10b3330920001f1f7a5",
      "content": "waht?",
      "objectId": "56f116156b85b30b79b20078",
      "updatedAt": "2016-03-22T09:53:25.668Z"
    }
  ]
}
```
####删除评论
```shell
curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "http://api.maxleap.cn/maxsocial/comment/objectId/{objectId}
```
### 通行证
####注册
```json
request:
{
    "username":"yangtan",
    "password":"123456"
}
response:
{
    "username": "yangtan",
    "enabled": true,
    "objectId": "57033c9670c676000110e747",
    "createdAt": "2016-04-05T04:18:30.023Z",
    "sessionToken": "cCq4Ly6jxiaRRJDaFviaWXPw5ND65RHls79WhHr-l5k",
    "isNew": true,
    "ACL": {
        "creator": {
            "id": "57033c9670c676000110e747",
            "type": "AppUser"
        }
    }
}
```
####登陆（账号密码
```json
request:
{
    "username":"yangtan",
    "password":"123456"
}
response:
{
    "createdAt": "2016-04-05T04:18:30.023Z",
    "sessionToken": "cCq4Ly6jxiaRRJDaFviaWXPw5ND65RHls79WhHr-l5k",
    "ACL": {
        "creator": {
            "id": "57033c9670c676000110e747",
            "type": "AppUser"
        }
    },
    "enabled": true,
    "objectId": "57033c9670c676000110e747",
    "username": "yangtan",
    "updatedAt": "2016-04-05T04:18:30.450Z"
}
```
####获取短信验证码
```json
Request
{
 "mobilePhone":"1347919XXXX",
}
  
   
Response
{
  "success": true
}
```
####短信验证码登陆
```json
Request
{
 "mobilePhone":"1347919XXXX",
 "smsCode":"030684"
}
  
   
Response
{
  "sessionToken": "NDRZDwGtbwPmrLM9_3Dz-KZjMnCU0hHljlE8FcK-tXg",
  "enabled": true,
  "isNew": true,
  "objectId": "5657fc5ed9ff8fa4e340c93d",
  "mobilePhoneVerified": true,
  "mobilePhone": "1347919XXXX",
  "createdAt": "2015-11-27T06:46:54.910Z",
  "username": "18602162324"
}
```
	
## 错误码
参考 [通用错误码](https://github.com/MaxLeap/Docs/blob/master/zh%2FREST%2FGuide%2FAPI.md)

## FAQ
###通用的分页过滤参数
| 参数名 | 作用 | 示例 | 备注 |
|----|----|----|----|
| sort | 排序 | sort=1 | 1:按创建时间排序，0:按userId排序。默认是1|
| pageId | 页面id | pageId=1 | 大于=0， 默认是0 |
| asc | 正序还是倒序 | asc=true | 默认false, asc=true时表示倒序 |
