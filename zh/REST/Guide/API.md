# REST API 使用详解

## API 版本

最新稳定版本是2.0

## API 域名

REST请求访问域名为:
https://api.maxleap.cn
域名后需要增加版本号，当前最新版本为2.0，完整的请求路径示例：
https://api.maxleap.cn/2.0/classes/books

## API 请求

### 请求格式

对于 POST 和 PUT 请求，请求的主体必须是 JSON 格式，而且 HTTP header 的 Content-Type 需要设置为 application/json。

用户验证通过 HTTP header 来进行，X-ML-AppId 标明正在运行的是哪个应用，X-ML-APIKey 用来授权鉴定


    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"content": "这是一条测试"}' \
      https://api.maxleap.cn/2.0/classes/test


### 响应格式

对于所有的请求，响应格式都是一个 JSON 对象。

一个请求是否成功是由 HTTP 状态码标明的。一个 2XX 的状态码表示成功，而一个 4XX 表示请求失败。当一个请求失败时响应的主体仍然是一个 JSON 对象，但是总是会包含 code 和 error 这两个字段，你可以用它们来进行调试。举个例子，如果尝试用非法的属性名来保存一个对象会得到如下信息：

    {
      "code": 105,
      "error": "invalid field name: bl!ng"
    }
    
## 通用错误码
补充
