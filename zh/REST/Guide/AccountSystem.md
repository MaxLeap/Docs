# 账号服务

## API 列表

URL	| HTTP |	功能
------|--------|--------
`/users`|POST|	用户注册
`/users/login`|GET|	用户登录
`/users/logout`|GET|	用户退出登录
`/users/<objectId>`|GET|	获取用户
`/users/<objectId>`	|PUT|	更新用户
`/users`	|GET|	查询用户
`/users/<objectId>`|	DELETE|	删除用户
`/updatePassword`|	POST|更新密码，要求输入旧密码
`/requestPasswordReset`|	POST	|请求密码重设
`/requestLoginSmsCode` | POST | 获取手机登录验证码
`/loginByMobilePhone`	| POST|	使用"手机号码"和"验证码"登录

## API 详解


### 用户注册

注册一个新用户与创建一个新的普通对象之间的不同点在于 username 和 password 字段必填。

为了注册一个新的用户，需要向 user 路径发送一个 POST 请求，你可以加入一个新的字段，例如，创建一个新的用户有一个电话号码:

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"username":"hitest","password":"hitest123","phone":"13587878799"}' \
      https://api.maxleap.cn/2.0/users
```

当创建成功时，HTTP 的返回是 200。
响应的主体是一个 JSON 对象，包含新的对象的 objectId ， createdAt 时间戳，sessionToken 可以被用来认证这名用户随后的请求。

```json
    {
      "username": "hitest",
      "phone": "13587878799",
      "lastLoginTime": 1472175866398,
      "enabled": true,
      "objectId": "57bf9efa1c5de20009e0b27b",
      "createdAt": "2016-08-26T01:44:26.424Z",
      "sessionToken": "NJT-W5xCdxUFtyD98r_fU58o1eBrLhHmmD3KTDeJ2lA"
    }
```

### 用户登录

用自己的用户名和密码登录。发送一个 GET 请求到 /2.0/login，加上 username 和 password 作为参数。

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      https://api.maxleap.cn/2.0/login?username=hitest&password=hitest123
```

返回的主体是一个 JSON 对象包括所有除了 password 以外的自定义字段。它同样包含了 createdAt、updateAt、objectId 和 sessionToken 字段。

```json
    {
      "lastLoginTime": 1472176437185,
      "createdAt": "2016-08-26T01:53:57.190Z",
      "phone": "13587878799",
      "sessionToken": "1ohbwr6l1aZzGnhWstIRJPNcW5BrLxHmpK0CQmhDvSc",
      "enabled": true,
      "objectId": "57bfa135b0d8500007e2ac67",
      "username": "hitest",
      "updatedAt": "2016-08-26T01:53:57.195Z"
    }
```

### 用户退出登录

用自己的用户名和密码登录。发送一个 GET 请求到 /2.0/logout，头里包含 X-ML-Session-Token。


```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-Session-Token: 1ohbwr6l1aZzGnhWstIRJHxr6hBrMxHmmD3KTDeJ2lA" \
      -H "Content-Type: application/json" \
      https://api.maxleap.cn/2.0/logout
      
```

返回的主体是一个 JSON 对象包括所有除了 password 以外的自定义字段。它同样包含了 createdAt、updateAt、objectId 和 sessionToken 字段。

```json
    {
      "success": true
    }
```

### 获取用户信息

发送一个 GET 请求到 URL 以获取用户的账户信息，返回的内容就是当创建用户时返回的内容。参数UserId就是创建和登录时返回的 objectId 。

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-Session-Token: 1ohbwr6l1aZzGnhWstIRJL9ydsBrNBHmmD3KTDeJ2lA" \
      -H "Content-Type: application/json" \
      https://api.maxleap.cn/2.0/users/57bfa135b0d8500007e2ac67
```

返回的主体是一个 JSON 对象包括用户信息相关字段。

```json
    {
      "lastLoginTime": 1472178497581,
      "createdAt": "2016-08-26T01:53:57.190Z",
      "phone": "13587878799",
      "ACL": {
        "creator": {
          "id": "57bfa135b0d8500007e2ac67",
          "type": "AppUser"
        }
      },
      "enabled": true,
      "objectId": "57bfa135b0d8500007e2ac67",
      "username": "hitest",
      "updatedAt": "2016-08-26T02:28:17.581Z"
    }
```

### 修改用户密码

发送一个 GET 请求到 URL 以获取用户的账户信息，返回的内容就是当创建用户时返回的内容。参数UserId就是创建和登录时返回的 objectId 。 password是原密码，newPassword是新密码。

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-Session-Token: 1ohbwr6l1aZzGnhWstIRJL9ydsBrNBHmmD3KTDeJ2lA" \
      -H "Content-Type: application/json" \
      -d '{"password":"hitest123","newPassword":"hitest123"}' \
      https://api.maxleap.cn/2.0/updatePassword
```
返回的主体是一个 JSON 更新成功时返回200。

```json
    {
      "number": 1,
      "updatedAt": "2016-08-26T02:35:05.267Z"
    }
```

### 更改用户信息

为了改动一个用户已经有的数据，需要对这个用户的 URL 发送一个 PUT 请求。任何你没有指定的 key 都会保持不动，比如更新手机信息。

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-Session-Token: 1ohbwr6l1aZzGnhWstIRJL9ydsBrNBHmmD3KTDeJ2lA" \
      -H "Content-Type: application/json" \
      -d '{"phone":"133333333333"}' \
      https://api.maxleap.cn/2.0/users/57bfa135b0d8500007e2ac67
```

返回的主体是一个 JSON 更新成功时返回200。

```json
    {
      "number": 1,
      "updatedAt": "2016-08-26T02:35:05.267Z"
    }
```
### 查询用户

_User表的查询权限是关闭的，需要用MasterKey查询，通常用在云代码和云容器中。MasterKey不能直接暴露出去。

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-MasterKey: 你的MasterKey" \
      -H "Content-Type: application/json" \
      https://api.maxleap.cn/2.0/users
```

返回的主体是用户列表， JSON 格式，查询成功时返回200。

```json
    {
      "results": [
        {
          "lastLoginTime": 1472178497581,
          "createdAt": "2016-08-26T01:53:57.190Z",
          "phone": "133333333333",
          "ACL": {
            "creator": {
              "id": "57bfa135b0d8500007e2ac67",
              "type": "AppUser"
            }
          },
          "enabled": true,
          "objectId": "57bfa135b0d8500007e2ac67",
          "username": "hitest",
          "updatedAt": "2016-08-26T02:46:54.838Z"
        }
      ]
    }
```
### 删除用户

删除权限是关闭的，需要用MasterKey查询，通常用在云代码和云容器中。MasterKey不能直接暴露出去。

```shell
    curl -X DELETE \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-MasterKey: 你的MasterKey" \
      -H "Content-Type: application/json" \
      https://api.maxleap.cn/2.0/users/57bfb8771c5de20009e0cd97
```
返回的主体是用户列表， JSON 格式，查询成功时返回200。

```json
    {
      "number": 1
    }
```

### 申请重置密码

申请重置密码，会发送邮件到指定邮箱。

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@maxleap.com"}
      https://api.maxleap.cn/2.0/requestPasswordReset
```
返回的主体是用户列表， JSON 格式，查询成功时返回200。

```json
    {
      "success": true
    }
```
### 获取手机登录/注册验证码

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"mobilePhone":"你的手机号"}
      https://api.maxleap.cn/2.0/requestLoginSmsCode
```

发送成功时返回200。

```json
    {"success":true}
```

### 用手机和验证码登录/注册

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"mobilePhone":"你的手机号","smsCode":"861293"}
      https://api.maxleap.cn/2.0/loginByMobilePhone
```
如果用户不存在，则自动创建，并返回信息。如果用户存在，则登录成功。

```json
    {
    "createdAt":"2016-08-26T04:09:40.885Z",
    "mobilePhone":"你的手机号",
    "sessionToken":"F1zRm-MSN7BHL46N2VZmpOlhmYBrQhHmpK0CQmhDvSc",
    "isNew":true,
    "mobilePhoneVerified":true,
    "enabled":true,
    "objectId":"57bfc104b0d8500007e2cd2f",
    "username":"你的手机号"
    }
```


## 错误码
参考 [通用错误码](https://github.com/MaxLeap/Docs/blob/d1a8591584e4aa12cbeff533ce64dbdafec540a5/zh/REST/Guide/API.md)

## FAQ
补充说明