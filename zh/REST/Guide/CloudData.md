# 数据存储


## API 列表

### 对象
URL	| HTTP	|功能
------|--------|--------
`/classes/<className>`|	POST|	创建对象
`/classes/<className>/<objectId>`|	GET|	获取对象
`/classes/<className>/<objectId>`|	PUT|	更新对象
`/classes/<className>`|	GET|	查询对象
`/classes/<className>/<objectId>`|	DELETE|	删除对象

### 文件

URL	| HTTP |	功能
------|--------|--------
`/files/<filename>`|PUT|	上传文件

### 安装

URL |	HTTP|	功能
------|--------|--------
`/installations` |	POST|	上传安装数据
`/installations/<objectId>`|	GET|	获取安装数据
`/installations/<objectId>`|	PUT|	更新安装数据


## API 详解

### 对象

#### 对象格式

通过 REST API 保存对象需要将对象的数据通过 JSON 来编码。这个数据是无模式化的（Schema Free），这意味着你不需要提前标注每个对象上有哪些 key，你只需要随意设置 key-value 对就可以，后端会保存它。

举个例子，假如我们要实现一个类似于电商 App，主要有三类数据：商品、账号、评论，一个商品可能包含下面几个属性：


    {
      "name": "真皮沙发",
      "price": 1000,
      "producer": "法国巴黎"
    }




Key（属性名）必须是字母和数字组成的字符串，Value（属性值）可以是任何可以 JSON 编码的数据。


每个对象都有一个类名，你可以通过类名来区分不同的数据。例如，我们可以把商品对象称之为 Product。


当你从 MaxLeap 中获取对象时，一些字段会被自动加上，如 createdAt、updatedAt 和 objectId。这些字段的名字是保留的，值也不允许修改。我们上面设置的对象在获取时应该是下面的样子：


    {
      "createdAt": "2016-04-21T08:37:30.774Z",
      "price": 1000,
      "name": "真皮沙发",
      "producer": "法国巴黎",
      "objectId": "5718914a169e7d0001a24dec",
      "updatedAt": "2016-04-21T08:37:30.774Z"
    }



createdAt 和 updatedAt 都是 UTC 时间戳，以 ISO 8601 标准和毫秒级精度储存：YYYY-MM-DDTHH:MM:SS.MMMZ。objectId 是一个字符串，在类中可以唯一标识一个实例。 在 REST API 中，class 级的操作都是通过一个带类名的资源路径（URL）来标识的。例如，如果类名是 Post，那么 class 的 URL 就是：


    http://api.maxleap.cn/2.0/classes/product



针对于一个特定的对象的操作可以通过组织一个 URL 来做。例如，对 Post 中的一个 objectId 为 5718914a169e7d0001a24dec 的对象的操作应使用如下 URL：

    http://api.maxleap.cn/2.0/classes/product/5718914a169e7d0001a24dec


#### 创建对象

为了在 MaxLeap 上创建一个新的对象，应该向 class 的 URL 发送一个 POST 请求，其中应该包含对象本身。例如，要创建如上所说的对象：

    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{ "name": "真皮沙发","price": 1000,"producer": "法国巴黎"}' \
      https://api.maxleap.cn/2.0/classes/product


当创建成功时，HTTP 的返回是 200。
响应的主体是一个 JSON 对象，包含新的对象的 objectId 和 createdAt 时间戳。

    {"objectId":"5718999b169e7d0001a2520a","createdAt":"2016-04-21T09:12:59.585Z"}


#### 获取对象

当你创建了一个对象时，你可以通过发送一个 GET 请求到返回的 header 的 Location 以获取它的内容。例如，为了得到我们上面创建的对象：

    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a

返回的主体是一个 JSON 对象包含所有用户提供的 field 加上 createdAt、updatedAt 和 objectId 字段：

    {"createdAt":"2016-04-21T09:12:59.585Z","price":1000,"name":"真皮沙发","ACL":{"creator":{"id":null,"type":"APIKey"}},"producer":"法国巴黎","objectId":"5718999b169e7d0001a2520a","updatedAt":"2016-04-21T09:12:59.585Z"}


#### 更新对象

为了更改一个对象已经有的数据，你可以发送一个 PUT 请求到对象相应的 URL 上，任何你未指定的 key 都不会更改，所以你可以只更新对象数据的一个子集。例如，我们来更改我们对象的一个 content 字段：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"producer": "中国东莞"}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a

返回的 JSON 对象会包含一个 updatedAt 字段和 number 字段，表明更新发生的时间和更新数量：

    {"number":1,"updatedAt":"2016-04-21T09:19:25.585Z"}

#### 计数器

为了存储一个计数器类型的数据, MaxLeap 提供对任何数字字段进行原子增加（或者减少）的功能。

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
       -d '{"price":{"__op":"Increment","amount":1}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a


这样就将对象里的 price（表示商品价格）加 1，其中 amount 指定递增的数字大小，如果为负数，就变成递减。

#### 数组

为了存储数组型数据，MaxLeap 提供 3 种操作来原子性地更改一个数组字段：

Add：在一个数组字段的后面添加一些指定的对象（包装在一个数组内）
AddUnique：只会在数组内原本没有这个对象的情形下才会添加入数组，插入的位置不定。
Remove：从一个数组内移除所有的指定的对象
每一种方法都会有一个 key 是 objects 即被添加或删除的对象列表。举个例子，我们可以为每个商品增加一个 tags （标签）属性，然后往里面加入一些标签值：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"tags":{"__op":"AddUnique","objects":["高端","大气"]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a

#### 关系

为了更新 Relation 的类型，MaxLeap 提供特殊的操作来原子地添加和删除一个关系，所以我们可以像这样添加一个关系（某个用户关注了这个商品）：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"_User","objectId":"5718a7c5169e7d0001a25911"}]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a


或者可以在一个对象中删除一个关系：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"RemoveRelation","objects":[{"__type":"Pointer","className":"_User","objectId":"5718a7c5169e7d0001a25911"}]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a

#### 删除对象

为了在 MaxLeap 上删除一个对象，可以发送一个 DELETE 请求到指定的对象的 URL，比如：

    curl -X DELETE \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520b

你也可以在一个对象中删除一个字段，通过 Delete 操作（注意：这时候 HTTP Method 还是 PUT）：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"Delete"}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a


#### 批量操作

为了减少网络交互的次数太多带来的时间浪费，你可以在一个请求中对多个对象进行 create、update、delete 操作。

在一个批次中每一个操作都有相应的方法、路径和主体，这些参数可以代替你通常会使用的 HTTP 方法。这些操作会以发送过去的顺序来执行，比如我们要一次发布一系列的产品：

    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{
         "requests": [
            {
              "method": "POST",
              "path": "/2.0/classes/product",
              "body":{ "name": "木质沙发","price": 1000,"producer": "荷兰"}
            },
            {
              "method": "POST",
              "path": "/2.0/classes/product",
              "body":{ "name": "藤椅","price": 100,"producer": "中国广东"}
            }
         ]
      }' \
      https://api.maxleap.cn/2.0/batch

我们对每一批次中所包含的操作数量（requests 数组中的元素个数）暂不设限，但考虑到云端对每次请求的 body 内容大小有限制，因此建议将每一批次的操作数量控制在 100 以内。

批量操作的响应会是一个列表，列表的元素数量和顺序与给定的操作请求是一致的。每一个在列表中的元素都有一个字段是 success 或者 error。

success 的值是通常是进行其他 REST 操作会返回的值：

    [
      {"createdAt":"2016-04-22T01:34:43.683Z","objectId":"57197fb3169e7d0001a2c44e"},
      {"createdAt":"2016-04-22T01:34:43.683Z","objectId":"57197fb3169e7d0001a2c44d"}
    ]


#### 数据类型


### 文件

#### 上传文件

上传文件到 MaxLeap 通过 PUT 请求，注意必须指定文件的 content-type，例如上传一个文本文件 hello.txt 包含一行字符串：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -d '[object ArrayBuffer]' "http://api.maxleap.cn/2.0/files/0.jpeg"


文件上传成功后，返回 201 Created 的应答和创建的文件对象：

    {"name":"zcf-416e3066-70b3-439a-afca-55fe3ed50195.jpeg","hash":null,"createTime":1461296757167,"region":"cn-north-1","uid":null,"url":"cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-416e3066-70b3-439a-afca-55fe3ed50195.jpeg","size":20,"contentType":null}


其中 url 就是文件下载链接，objectId 是文件的对象 id，name 就是上传的文件名称。



#### 关联文件到对象

一个文件上传后，你可以关联该文件到某个 MLObject 对象上：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"image":{"__type":"File","name":"zcf-8a953de2-06bc-4210-a4c2-e5c3a7c16b7e.jpeg","url":"https://cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-8a953de2-06bc-4210-a4c2-e5c3a7c16b7e.jpeg"}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a


### 安装

#### 上传安装数据

一个安装对象表示了一个你的在手机上被安装的 app。

字段	| 描述
------|--------
channels|	数组，可选，表示这个安装对象的频道列表。
deviceToken|	由 Apple 生成的字符串标志，在 deviceType 为 iOS 上的设备是必须的，而且自对象生成开始就不能改动，对于一个 app 来说也是不可重复的。
deviceType|	必须被设置为"ios"、"android"、"wp"、"web"中的一种，而且自这个对象生成以后就不能变化。
installationId|	由 MaxLeap 生成的字符串标志，而且如果 deviceType 是 android 的话是一个必选字段，如果是 iOS 的话则可选。它只要对象被生成了就不能发生改变，而且对一个 app 来说是不可重复的。
timeZone|字符串，表示安装的这个设备的系统时区。

创建一个安装对象时，deviceToken或者installationId必选其中一个，MaxLeap通过installationId和deviceToken来区分不同的安装

    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{
              "deviceType": "ios",
              "installationId": "a2188f955d1a4a968ee40e6952b05407",
              "deviceId": "o09f93f6996123c1c2d3d8b9639201be783207360",
              "channels": [
                ""
              ]
            }' \
      https://api.maxleap.cn/2.0/installations


当创建成功后，返回的 body 是一个 JSON 对象，包括了 objectId 和 createdAt 这个创建对象的时间戳。

    {"objectId":"571d9d76169e7d0001a4317b","createdAt":"2016-04-25T04:30:46.349Z"}


#### 获取安装对象

你可以通过 GET 方法请求创建的时候 Location 表示的 URL 来获取 Installation 对象。比如，获取上面的被创建的对象：

    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/installations/571d9d76169e7d0001a4317b

返回的 JSON 对象所有用户提供的字段，加上 createdAt、updatedAt 和 objectId 字段：

    {"deviceType":"ios","createdAt":"2016-04-25T04:30:46.349Z","channels":[""],"ACL":{"creator":{"id":null,"type":"APIKey"}},"installationId":"a2188f955d1a4a968ee40e6952b05407","deviceId":"o09f93f6996123c1c2d3d8b9639201be783207360","objectId":"571d9d76169e7d0001a4317b","updatedAt":"2016-04-25T04:30:46.349Z"}

#### 更新安装对象

安装对象可以向相应的 URL 发送 PUT 请求来更新。例如，更新安装的语言：

    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{
              "language": "en"
            }' \
      https://api.maxleap.cn/2.0/installations/571d9d76169e7d0001a4317b

## 错误码
参考 [通用错误码](https://github.com/MaxLeap/Docs/blob/master/zh%2FREST%2FGuide%2FAPI.md)

## FAQ
补充说明
