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

```json
    {
      "name": "真皮沙发",
      "price": 1000,
      "producer": "法国巴黎"
    }
```

Key（属性名）必须是字母和数字组成的字符串，Value（属性值）可以是任何可以 JSON 编码的数据。

每个对象都有一个类名，你可以通过类名来区分不同的数据。例如，我们可以把商品对象称之为 Product。

当你从 MaxLeap 中获取对象时，一些字段会被自动加上，如 createdAt、updatedAt 和 objectId。这些字段的名字是保留的，值也不允许修改。我们上面设置的对象在获取时应该是下面的样子：

```json
    {
      "createdAt": "2016-04-21T08:37:30.774Z",
      "price": 1000,
      "name": "真皮沙发",
      "producer": "法国巴黎",
      "objectId": "5718914a169e7d0001a24dec",
      "updatedAt": "2016-04-21T08:37:30.774Z"
    }
```

createdAt 和 updatedAt 都是 UTC 时间https://api.maxleap.cn戳，以 ISO 8601 标准和毫秒级精度储存：YYYY-MM-DDTHH:MM:SS.MMMZ。objectId 是一个字符串，在类中可以唯一标识一个实例。 在 REST API 中，class 级的操作都是通过一个带类名的资源路径（URL）来标识的。例如，如果类名是 Post，那么 class 的 URL 就是：

`https://api.maxleap.cn/2.0/classes/product`

针对于一个特定的对象的操作可以通过组织一个 URL 来做。例如，对 Post 中的一个 objectId 为 5718914a169e7d0001a24dec 的对象的操作应使用如下 URL：

`https://api.maxleap.cn/2.0/classes/product/5718914a169e7d0001a24dec`

#### 创建对象

为了在 MaxLeap 上创建一个新的对象，应该向 class 的 URL 发送一个 POST 请求，其中应该包含对象本身。例如，要创建如上所说的对象：

```shell
    curl -X POST \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{ "name": "真皮沙发","price": 1000,"producer": "法国巴黎"}' \
      https://api.maxleap.cn/2.0/classes/product
```

当创建成功时，HTTP 的返回是 200。
响应的主体是一个 JSON 对象，包含新的对象的 objectId 和 createdAt 时间戳。

```json
    {"objectId":"5718999b169e7d0001a2520a","createdAt":"2016-04-21T09:12:59.585Z"}
```

#### 获取对象

当你创建了一个对象时，你可以通过发送一个 GET 请求到返回的 header 的 Location 以获取它的内容。例如，为了得到我们上面创建的对象：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```
返回的主体是一个 JSON 对象包含所有用户提供的 field 加上 createdAt、updatedAt 和 objectId 字段：

```json
    {
       "createdAt":"2016-04-21T09:12:59.585Z",
       "price":1000,"name":"真皮沙发",
       "ACL":{"creator":{"id":null,"type":"APIKey"}},
       "producer":"法国巴黎",
       "objectId":"5718999b169e7d0001a2520a",
       "updatedAt":"2016-04-21T09:12:59.585Z"
   }
```

#### 更新对象

为了更改一个对象已经有的数据，你可以发送一个 PUT 请求到对象相应的 URL 上，任何你未指定的 key 都不会更改，所以你可以只更新对象数据的一个子集。例如，我们来更改我们对象的一个 content 字段：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"producer": "中国东莞"}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

返回的 JSON 对象会包含一个 updatedAt 字段和 number 字段，表明更新发生的时间和更新数量，这里number是1表示成功更新了这条记录：

```json
    {"number":1,"updatedAt":"2016-04-21T09:19:25.585Z"}
```

##### 计数器

为了存储一个计数器类型的数据, MaxLeap 提供对任何数字字段进行原子增加（或者减少）的功能,比如一个支付账户在同一时间可能进行支付、收款，如果我们每个客户端都先读取值计算后在写回去，毫无疑问，极其容易发生写覆盖，最终结果不准，这个时候，MaxLeap的原子操作就可以派上用场了

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
       -d '{"balance":{"__op":"Increment","amount":20}}' \
      https://api.maxleap.cn/2.0/classes/account/5718999b169e7d0001a2520a
```

这样就将对象里的 balance（表示账户余额）加 1，其中 amount 指定递增的数字大小，如果为负数，就变成递减。

##### 数组

为了存储数组型数据，MaxLeap 提供 3 种操作来原子性地更改一个数组字段：

Add：在一个数组字段的后面添加一些指定的对象（包装在一个数组内）
AddUnique：只会在数组内原本没有这个对象的情形下才会添加入数组，插入的位置不定。
Remove：从一个数组内移除所有的指定的对象
每一种方法都会有一个 key 是 objects 即被添加或删除的对象列表。举个例子，我们可以为每个商品增加一个 tags （标签）属性，然后往里面加入一些标签值：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"tags":{"__op":"AddUnique","objects":["高端","大气"]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

##### 关系

为了更新 Relation 的类型，MaxLeap 提供特殊的操作来原子地添加和删除一个关系，所以我们可以像这样添加一个关系（某个用户关注了这个商品）：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"AddRelation","objects":[{"__type":"Pointer","className":"_User","objectId":"5718a7c5169e7d0001a25911"}]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

或者可以在一个对象中删除一个关系（某个用户取消关注这个商品）

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"RemoveRelation","objects":[{"__type":"Pointer","className":"_User","objectId":"5718a7c5169e7d0001a25911"}]}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

##### 按条件更新对象

假设我们要从某个账户对象 Account 的余额扣除一定金额，但是要求余额要大于等于被扣除的金额，那么就需要在更新的时候加上条件 balance >= amount，并通过 where 查询参数来实现：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"balance":{"__op":"Decrement","amount": 100}}' \
      "https://api.leancloud.cn/1.1/classes/Account/558e20cbe4b060308e3eb36c?where=%7B%22balance%22%3A%7B%22%24gte%22%3A%2030%7D%7D"
```

可以看到 URL 里多了一个 where 查询参数，值是 %7B%22balance%22%3A%7B%22%24gte%22%3A%20100%7D%7D，其实是 {"balance":{"$gte": 100}} 做了 url encode 的结果。更多 where 查询的例子参见下文的 查询 一节。


#### 删除对象

为了在 MaxLeap 上删除一个对象，可以发送一个 DELETE 请求到指定的对象的 URL，比如：

```shell
    curl -X DELETE \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520b
```

你也可以在一个对象中删除一个字段，通过 Delete 操作（注意：这时候 HTTP Method 还是 PUT）：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"follows":{"__op":"Delete"}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

##### 按条件删除对象

为请求增加 where 参数即可以按指定的条件来删除对象：

```shell
    curl -X DELETE \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      "https://api.leancloud.cn/1.1/classes/product/5718999b169e7d0001a2520b?where=%7B%22price%22%3A%2010%7D"
```

可以看到 URL 里多了个参数 where，值是 %7B%price%22%3A%2010%7D，其实是 {"price": 10} 做了 url encode 的结果，这里的意思是我们只有当这个商品的价格 price 为 10 才删除。更多 where 查询的例子参见 查询 一节。


#### 批量操作

为了减少网络交互的次数太多带来的时间浪费，你可以在一个请求中对多个对象进行 create、update、delete 操作。

在一个批次中每一个操作都有相应的方法、路径和主体，这些参数可以代替你通常会使用的 HTTP 方法。这些操作会以发送过去的顺序来执行，比如我们要一次发布一系列的产品：

```shell
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
```

我们对每一批次中所包含的操作数量（requests 数组中的元素个数）暂不设限，但考虑到云端对每次请求的 body 内容大小有限制，因此建议将每一批次的操作数量控制在 100 以内。

批量操作的响应会是一个列表，列表的元素数量和顺序与给定的操作请求是一致的。每一个在列表中的元素都有一个字段是 success 或者 error。

success 的值是通常是进行其他 REST 操作会返回的值：

```json
    [
      {"createdAt":"2016-04-22T01:34:43.683Z","objectId":"57197fb3169e7d0001a2c44e"},
      {"createdAt":"2016-04-22T01:34:43.683Z","objectId":"57197fb3169e7d0001a2c44d"}
    ]
```

#### 数据类型

到现在为止我们只使用了可以被标准 JSON 编码的值，在 REST API 中，这些值都被编码了，同时有一个 __type 字段（注意：前缀是两个下划线）来标示出它们的类型，所以如果你采用正确的编码的话就可以读或者写这些字段。

Date 类型包含了一个 iso 字段，其值是一个 UTC 时间戳，以 ISO 8601 格式和毫秒级的精度来存储的时间值，格式为：YYYY-MM-DDTHH:MM:SS.MMMZ：

```json
    {
      "__type": "Date",
      "iso": "2015-06-21T18:02:52.249Z"
    }
```

MaxLeap CloudData 内置的 createdAt 字段和 updatedAt 字段就是Date类型，举例：找出大于等于某个时间段发布的产品：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"createdAt":{"$gte":{"__type":"Date","iso":"2016-06-21T18:02:52.249Z"}}}' \
      https://api.maxleap.cn/2.0/classes/product
```

Byte 类型包含了一个 base64 字段，这个字段是一些二进制数据编码过的 base64 字符串。base64 是 MIME 使用的标准，不包含空白符：

```json
    {
      "__type": "Bytes",
      "base64": "5b6I5aSa55So5oi36KGo56S65b6I5Zac5qyi5oiR5Lus55qE5paH5qGj6aOO5qC877yM5oiR5Lus5bey5bCGIExlYW5DbG91ZCDmiYDmnInmlofmoaPnmoQgTWFya2Rvd24g5qC85byP55qE5rqQ56CB5byA5pS+5Ye65p2l44CC"
    }
```

Pointer 类型是用来设定 CloudData Object 作为另一个对象的值时使用的，它包含了 className 和 objectId 两个属性值，用来提取目标对象：

```json
    {
      "__type": "Pointer",
      "className": "_User",
      "objectId": "5718998d169e7d0001a25203"
    }
```

指向用户对象的 Pointer 的 className 为 _User，前面加一个下划线表示开发者不能定义的类名，而且所指的类是 MaxLeap CloudData平台内置的。

Relation 类型被用在多对多的类型上，移动端使用 AVRelation 作为值，它有一个 className 字段表示目标对象的类名.

```json
    {
      "__type": "Relation",
      "className": "Post"
    }
```

在进行查询时，Relation 对象的行为很像是 Pointer 的数组，任何针对于 pointer 数组的操作（include 除外）都可以对 Relation 起作用。

当更多的数据类型被加入的时候，它们都会采用 hashmap 加上一个 __type 字段的形式，所以你不应该使用 __type 作为你自己的 JSON 对象的 key。


### 查询

#### 基础查询

通过发送一个 GET 请求到类的 URL 上，不需要任何 URL 参数，你就可以一次获取多个对象。下面就是简单地获取所有产品：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/classes/product
```
返回的主体是一个 JSON 对象列表：

```json
    {
      "results": [
        {
          "createdAt": "2016-04-21T08:37:30.774Z",
          "image": {
            "__type": "File",
            "name": "zcf-00c51b9d-3006-4877-ac95-012a9db82fa4.png",
            "url": "https://cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-00c51b9d-3006-4877-ac95-012a9db82fa4.png"
          },
          "price": 1000,
          "name": "真皮沙发",
          "ACL": {
            "creator": {
              "id": null,
              "type": "APIKey"
            }
          },
          "produce": "法国巴黎",
          "objectId": "5718914a169e7d0001a24dec",
          "updatedAt": "2016-07-21T05:29:34.779Z"
        },
        {
          "createdAt": "2016-04-21T09:12:45.043Z",
          "image": {
            "__type": "File",
            "name": "zcf-739fa899-0aca-423a-82b1-dbca564a439b.png",
            "url": "https://cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-739fa899-0aca-423a-82b1-dbca564a439b.png"
          },
          "price": 1000,
          "name": "真皮沙发",
          "ACL": {
            "creator": {
              "id": null,
              "type": "APIKey"
            }
          },
          "produce": "法国巴黎",
          "objectId": "5718998d169e7d0001a25203",
          "updatedAt": "2016-07-21T05:30:26.370Z"
        }
      ]
    }
```

##### 查询约束

通过 where 参数的形式可以对查询对象做出约束。

where 参数的值应该是 JSON 编码过的。就是说，如果你查看真正被发出的 URL 请求，它应该是先被 JSON 编码过，然后又被 URL 编码过。最简单的使用 where 参数的方式就是包含应有的 key 和 value。

查询所有价格为100的商品。

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"price":100}' \
      https://api.maxleap.cn/2.0/classes/product
```

返回的结果集是一个 JSON 对象列表：

```json
    {
      "results": [
        {
          "createdAt": "2016-04-22T01:34:43.683Z",
          "price": 100,
          "name": "藤椅",
          "producer": "中国广东",
          "objectId": "57197fb3169e7d0001a2c44d",
          "updatedAt": "2016-04-22T01:34:43.683Z"
        }
      ]
    }
```

除了完全匹配一个给定的值以外，where 也支持比较的方式。where 参数支持下面一些选项：

Key	| 操作
------|--------
$lt	| 小于
$lte	| 小于等于
$gt	| 大于
$gte	| 大于等于
$ne	| 不等于
$in	| 包含
$nin	| 不包含
$exists	| 这个Key有值
$select | 匹配另一个查询的返回值
$dontSelect | 排除另一个查询的返回值
$all | 包括所有的给定的值

例如，为了获取在 2016-04-22 前创建的商品，我们应该这样请求：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"createdAt":{"$lt":{"__type":"Date","iso":"2016-04-22T00:00:00.000Z"}}}' \
      https://api.maxleap.cn/2.0/classes/product
```


求价格低于1000，并且产地是荷兰的产品：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"price":{"$lt":1000}, "produce":"荷兰"}' \
      https://api.maxleap.cn/2.0/classes/product
```

产地不是荷兰的产品：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"produce": {"$ne": "荷兰"}}' \
      https://api.maxleap.cn/2.0/classes/product
```

我们假如__User对象有一个hometown字段，现在我们要找出产地是该用户家乡的产品，我们可以这样：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"produce": {"$select":{"query":{"className":"_User","where":{"objectId":"55a39634e4b0ed48f0c1845c"}, "key":"hometown"}}}}' \
      https://api.maxleap.cn/2.0/classes/product
```

你可以用 order 参数来指定一个字段来排序，前面加一个负号的前缀表示逆序。这样返回的微博会按发布时间呈升序排列：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'order=createdAt' \
      https://api.maxleap.cn/2.0/classes/product
```

排序字段加一个减号程降序排列：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'order=-createdAt' \
      https://api.maxleap.cn/2.0/classes/product
```

当然了，你还可以用多个字段排序

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'order=-createdAt, produce' \
      https://api.maxleap.cn/2.0/classes/product
```

你可以用 limit 和 skip 来做分页。limit 的默认值是 100，最大是2000, 在 1 到 2000 范围之外的都强制转成默认的 100。比如为了获取排序在 100 到 500 之间的产品：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'skip=100' \
      --data-urlencode 'limit=400' \
      https://api.maxleap.cn/2.0/classes/product
```

你可以限定返回的字段通过传入 keys 参数和一个逗号分隔列表。为了返回对象只包含 produce、name 和 price 字段（还有特殊的内置字段比如 objectId、createdAt 和 updatedAt都是默认返回的）

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'skip=100' \
      --data-urlencode 'limit=400' \
      --data-urlencode 'keys=produce,name,price' \
      https://api.maxleap.cn/2.0/classes/product
```

keys 还支持反向选择，也就是不返回某些字段，字段名前面加个减号即可，比如我不想查询返回 detail字段：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'skip=100' \
      --data-urlencode 'limit=400' \
      --data-urlencode 'keys=-detail' \
      https://api.maxleap.cn/2.0/classes/product
```

##### 对数组的查询

arrayKey 字段是一个数组类型，你可以使用 $all 操作符来找到 arrayKey 的值中有 1、4 和 7 的对象:

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"arrayKey":{"$all":[1,4,7]}}' \
      https://api.maxleap.cn/2.0/classes/TestObject
```

##### 关系查询

有几种方式来查询对象之间的关系数据。如果你想获取对象，而这个对象的一个字段对应了另一个对象，你可以用一个 where 查询，自己构造一个 Pointer，和其他数据类型一样。例如，每个用户可能有很多订单，我们可以为每一个 Order 保存一个User对象，获取用户下所有订单：


```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"user":{"__type":"Pointer","className":"__User","objectId":"558e20cbe4b060308e3eb36c"}}' \
      https://api.maxleap.cn/2.0/classes/Order
```

user 字段是一个Pointer类型，指向__User类

如果你想获取对象，这个对象的一个字段指向的对象需要另一个查询来指定，你可以使用 $inQuery 操作符。注意 limit 的默认值是 100 且最大值是 2000，这个限制同样适用于内部的查询，所以对于较大的数据集你可能需要细心地构建查询来获得期望的结果。

例如，我们想要有头像的用户订单列表

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'where={"user":{"$inQuery":{"where":{"avatar":{"$exists":true}},"className":"__User"}}}' \
      https://api.maxleap.cn/2.0/classes/Order
```

有时候，你可能需要在一个查询之中返回多种类型，你可以通过传入字段到 include 参数中。比如，我们要获取最新的10个订单，而你想同时得到它们关联的用户信息：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'order=-createdAt' \
      --data-urlencode 'limit=10' \
      --data-urlencode 'include=user' \
      https://api.maxleap.cn/2.0/classes/Order
```

你可以同样做多层的 include，这时要使用点号（.）。如果你要 include 一个 Order 对应的 User 对应的 Address对象：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
      --data-urlencode 'order=-createdAt' \
      --data-urlencode 'limit=10' \
      --data-urlencode 'include=user.address' \
      https://api.maxleap.cn/2.0/classes/Order
```

##### 对象计数

如果你在使用 limit，或者如果返回的结果很多，你可能想要知道到底有多少对象应该返回，而不用把它们全部获得以后再计数，此时你可以使用 count 参数。举个例子，如果你仅仅是关心一个某个用户有多少个订单：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -G \
        --data-urlencode 'count=1' \
        --data-urlencode 'limit=0' \
      https://api.maxleap.cn/2.0/classes/Order
```

因为这个 request 请求了 count 而且把 limit 设为了 0，返回的值里面只有计数，没有 results：

```json
    {
      "results": [

      ],
      "count": 7
    }
```

如果有一个非 0 的 limit 的话，则既会返回 results 也会返回 count。

### 文件

#### 上传文件

上传文件到 MaxLeap 通过 PUT 请求，注意必须指定文件的 content-type，例如上传一个文本文件 hello.txt 包含一行字符串：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -d '[object ArrayBuffer]' "https://api.maxleap.cn/2.0/files/0.jpeg"
```

文件上传成功后，返回 201 Created 的应答和创建的文件对象：

```json
    { 
      "name":"zcf-416e3066-70b3-439a-afca-55fe3ed50195.jpeg",
      "hash":null,"createTime":1461296757167,"region":"cn-north-1",
      "uid":null,"url":"cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-416e3066-70b3-439a-afca-55fe3ed50195.jpeg",
      "size":20,
      "contentType":null
    }
```

其中 url 就是文件下载链接，objectId 是文件的对象 id，name 就是上传的文件名称。



#### 关联文件到对象

一个文件上传后，你可以关联该文件到某个 MLObject 对象上：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{"image":{"__type":"File","name":"zcf-8a953de2-06bc-4210-a4c2-e5c3a7c16b7e.jpeg","url":"https://cscdn.maxleap.cn/2.0/download/NTY5ZDg0YTAxNjllN2QwMDAxMmM3YWZl/zcf-8a953de2-06bc-4210-a4c2-e5c3a7c16b7e.jpeg"}}' \
      https://api.maxleap.cn/2.0/classes/product/5718999b169e7d0001a2520a
```

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

```shell
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
```

当创建成功后，返回的 body 是一个 JSON 对象，包括了 objectId 和 createdAt 这个创建对象的时间戳。

```json
    {"objectId":"571d9d76169e7d0001a4317b","createdAt":"2016-04-25T04:30:46.349Z"}
```

#### 获取安装对象

你可以通过 GET 方法请求创建的时候 Location 表示的 URL 来获取 Installation 对象。比如，获取上面的被创建的对象：

```shell
    curl -X GET \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      https://api.maxleap.cn/2.0/installations/571d9d76169e7d0001a4317b
```

返回的 JSON 对象所有用户提供的字段，加上 createdAt、updatedAt 和 objectId 字段：

```json
    {
      "deviceType":"ios",
      "createdAt":"2016-04-25T04:30:46.349Z",
      "channels":[""],
      "ACL":
         {"creator":{"id":null,"type":"APIKey"}},
     "installationId":"a2188f955d1a4a968ee40e6952b05407",
     "deviceId":"o09f93f6996123c1c2d3d8b9639201be783207360",
     "objectId":"571d9d76169e7d0001a4317b",
     "updatedAt":"2016-04-25T04:30:46.349Z"
    }
```
#### 更新安装对象

安装对象可以向相应的 URL 发送 PUT 请求来更新。例如，更新安装的语言：

```shell
    curl -X PUT \
      -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
      -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
      -H "Content-Type: application/json" \
      -d '{
              "language": "en"
            }' \
      https://api.maxleap.cn/2.0/installations/571d9d76169e7d0001a4317b
```

## 错误码
参考 [通用错误码]()

## FAQ
补充说明
