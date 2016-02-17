# REST API 使用详解

## API 版本

最新稳定版本是2.0

## API 域名

REST请求访问域名为:
https://api.maxleap.cn
域名后需要增加版本号，当前最新版本为2.0，完整的请求路径示例：
https://api.maxleap.cn/2.0/classes/books

## API 请求


#### 对象

URL	| HTTP	|功能
------|--------|--------
`/classes/<className>`|	POST|	创建对象
`/classes/<className>/<objectId>`|	GET|	获取对象
`/classes/<className>/<objectId>`|	PUT|	更新对象
`/classes/<className>`|	GET|	查询对象
`/classes/<className>/<objectId>`|	DELETE|	删除对象

#### 用户

URL	| HTTP |	功能
------|--------|--------
`/users`|POST|	用户注册
`/users/login`|GET|	用户登录
`/users/logout`|GET|	用户退出登录
`/users/<objectId>`|GET|	获取用户
`/users/<objectId>/updatePassword`|	POST|更新密码，要求输入旧密码。
`/users/<objectId>`	|PUT|	更新用户
`/users`	|GET|	查询用户
`/users/<objectId>`|	DELETE|	删除用户
`/users/requestPasswordReset`|	POST	|请求密码重设
`/users/requestEmailVerify`|	POST	|请求验证用户邮箱
`/users/verifyMobilePhone`	| POST|	验证"手机号码"和"验证码"
`/users/loginByMobilePhone`	| POST|	使用"手机号码"和"验证码"登录
`/users/resetPasswordBySmsCode`|	POST|	通过短信重设密码。

#### 文件

URL	| HTTP |	功能
------|--------|--------
`/files/<filename>`|PUT|	上传文件
`/files`|DELETE|	删除文件，头中包含X-ML-Fid
`/files`|GET|	获取文件元信息，头中包含X-ML-Fid

#### 安装

URL |	HTTP|	功能
------|--------|--------
`/installations` |	POST|	上传安装数据
`/installations/<objectId>`|	GET|	获取安装数据
`/installations/<objectId>`|	PUT|	更新安装数据
`/installations`|	GET|	查询安装数据
`/installations/<objectId>`|	DELETE|	删除安装数据

#### 云函数

URL |	HTTP|	功能
------|--------|--------
`/functions/<name>`	| POST|	调用云函数
`/jobs/<name>`|	POST|	执行job

#### 请求格式

对于 POST 和 PUT 请求，请求的主体必须是 JSON 格式，而且 HTTP header 的 Content-Type 需要设置为 application/json。

用户验证通过 HTTP header 来进行，X-ML-AppId 标明正在运行的是哪个应用，X-ML-APIKey 用来授权鉴定

#### 更安全的授权方式

我们还支持一种新的 API 鉴权方式，即在 HTTP header 中使用 X-ML-Request-Sign 来代替 X-LC-APIKey，以降低 App Key 的泄露风险。例如：

#### 响应格式

对于所有的请求，响应格式都是一个 JSON 对象。

一个请求是否成功是由 HTTP 状态码标明的。一个 2XX 的状态码表示成功，而一个 4XX 表示请求失败。当一个请求失败时响应的主体仍然是一个 JSON 对象，但是总是会包含 code 和 error 这两个字段，你可以用它们来进行调试。举个例子，如果尝试用非法的属性名来保存一个对象会得到如下信息：

    {
      "code": 105,
      "error": "invalid field name: bl!ng"
    }



## 对象

## 查询

## 用户

## 文件

## 推送

## 云函数