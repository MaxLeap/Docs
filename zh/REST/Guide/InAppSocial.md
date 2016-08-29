# 应用内社交

## API 列表
###关系

URL	| HTTP |	功能
------|--------|--------
`/maxsocial/relation`|POST|	创建或者更新用户关系表
`/maxsocial/relation/objectId/<objectId>`|GET|	获取用户关系
`/maxsocial/relation/status`|GET|	 获取2个用户之间的关注状态
`/maxsocial/relation/getRelation`|GET| 得到2个用户的关系
`/maxsocial/relation/follows`|	POST| 获取关注列表
`/maxsocial/relation/followers`	|POST|	获取粉丝列表
`/maxsocial/relation/objectId/<objectId>`|	DELETE| 删除关系
`/maxsocial/relation/delete`|	DELETE	| 删除关系
###说说
URL	| HTTP |	功能
------|--------|--------
`/maxsocial/shuo`|POST|	 创建或者更新说说
`/maxsocial/shuo/objectId/<objectId>`|GET|	获取说说
`/maxsocial/shuo/list`|POST| 得到说说列表
`/maxsocial/shuo/near`|	POST| 得到指定区域附近的说说
`/maxsocial/shuo/latest`	|POST|	得到最新的一些说说
`/maxsocial/shuo/getAll`	|POST|	得到一条说说所有内容
`/maxsocial/shuo/friendCircle`	|POST|	得到朋友圈说说
`/maxsocial/shuo/photosdelete `|	DELETE	| 删除说说
###地理位置
URL	| HTTP |	功能
------|--------|--------
`/maxsocial/location`|POST|	创建或者更新用户和地理位置的对应关系
`/maxsocial/location/near`|POST|	得到指定地点指定距离内的人
`/maxsocial/location/<objectId>`|GET|	 获得用户和地理对应关系
`/maxsocial/location/userId/<userId>`|GET| 获取用户的地理信息
`/maxsocial/relation/<objectId>`|	DELETE| 删除用户和地理对应关系
###评论
URL	| HTTP |	功能
------|--------|--------
`/maxsocial/comment`|POST|	创建或者更新评论
`/maxsocial/comment/list`|POST|	获取评论列表
`/maxsocial/comment/update`|POST|	更新评论已读状态
`/maxsocial/comment/objectId/<objectId>`|GET|	 获得评论
`/maxsocial/comment/unread`|GET| 得到未读评论
`/maxsocial/comment/objectId/<objectId>`|	DELETE| 删除评论
###通行证
URL	| HTTP |	功能
------|--------|--------
`/maxsocial/socialpass/register`|POST|	注册
`/maxsocial/socialpass/login`|POST|	登陆（账号密码）
`/maxsocial/socialpass/smsCode`|POST|	获取短信验证码
`/maxsocial/socialpass/loginByMobile`|POST|	 短信验证码登陆

## API 详解

### 关系
####创建或者更新用户关系
创建一个用户关系，或者更新对应的用户关系。请求中reverse字段表示2者是否相互关注:

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 4bbfe81d-bf4c-3a83-2aeb-c3130ff8e23b" -d '{
  "userId": "5641b10b3330920001f1f7b1",
  "followerId": "5641b10b3330920001f1f7a1",
  "reverse": true
}' "http://api.maxleap.cn/2.0/maxsocial/relation"
```

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

```shell
curl -X GET -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: ba97ada1-d483-520e-507b-4d6d28fa0cb9" "http://api.maxleap.cn/2.0/maxsocial/relation/objectId/5705d68a6b85b3410eaaabcd"
```

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
    "https://api.maxleap.cn/maxsocial/status?followerId=5704e0e9667a2300015c1bd0&userId=5704e0c3667a2300015c1bce"
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
    "https://api.maxleap.cn/maxsocial/relation/getRelation?followerId=5704e0e9667a2300015c1bd0&userId=5704e0c3667a2300015c1bce"
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

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 0a55dfda-ce83-cbdf-cca2-71b2bec8c937" -d '{
    "followerId":"5641b10b3330920001f1f7v1"
}' "http://api.maxleap.cn/2.0/maxsocial/relation/follows"
```

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

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 04778a3d-1570-fc28-4f15-fe6503274abf" -d '{
    "userId":"5641b10b3330920001f1f7b1"
}' "http://api.maxleap.cn/2.0/maxsocial/relation/followers"
```

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
    "https://api.maxleap.cn/maxsocial/relation/objectId/{objectId}
```
根据userId来删除关系：

```shell
curl -X DELETE \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "https://api.maxleap.cn/maxsocial/relation/delete?userId=xxx
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
    "https://api.maxleap.cn/maxsocial/shuo/objectId/{objectId}
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

curl:
```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 5aaeba19-e5b0-04d2-bd6d-3429d3bb2ab3" -d '{
    "userId":"5641b10b3330920001f1f7b1",
    "black": false
}' "http://api.maxleap.cn/2.0/maxsocial/shuo/list"
```

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

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: c0128465-b63d-20a2-83bf-df0c43661731" -d '{
    "latitude": 40.2,
    "longitude": 20.1,
    "distance": 100000000
}' "http://api.maxleap.cn/2.0/maxsocial/shuo/near"
```

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
    "https://api.maxleap.cn/maxsocial/shuo/latest
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

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 4ff155d4-ef16-d710-0aa6-327f6f80f6e4" -d '{
    "userId": "5641b10b3330920001f1f7a4",
    "shuoId": "5704b2b26b85b33d02184f08"
}' "http://api.maxleap.cn/2.0/maxsocial/shuo/getAll"
```

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

curl:

```json
curl -X POST -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: c7c62f8b-a6b0-ccb4-5b33-5a3b00712f61" -d '{
    "userId": "123"
}' "http://api.maxleap.cn/2.0/maxsocial/shuo/friendCircle"
```

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

curl:

```json
curl -X DELETE -H "X-ML-appid: 5609fe7da5ff7f00012ce481" -H "X-ML-Session-Token: MuI3kNXYF1Jt8Ueb8RZvH5viI2CcehHlin5WhHr-l5k" -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: e058afd2-35f4-1737-127a-52cf34075bca" -d '{
    "userId": "5641b10b3330920001f1f7a7",
    "objectId": "570f13e9238c8f0001d622ef"
}' "http://api.maxleap.cn/2.0/maxsocial/photosdelete"
```

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
    "https://api.maxleap.cn/maxsocial/location/objectId/{objectId}
```
####获取用户的地理信息
根据userId获取用户的地理信息：

```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "https://api.maxleap.cn/maxsocial/location/userId/{userId}
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
    "https://api.maxleap.cn/maxsocial/location/objectId/{objectId}

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
    "https://api.maxleap.cn/maxsocial/comment/objectId/{objectId}
```
####得到未读评论
```shell
curl -X GET \
    -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
    -H "X-ML-Request-Sign: da1bb6b56200c84995127c784de90445,1461920236060" \
    -H "Content-Type: application/json" \
    "https://api.maxleap.cn/maxsocial/comment/unread?shuoId=xxx
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
    "https://api.maxleap.cn/maxsocial/comment/objectId/{objectId}
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
