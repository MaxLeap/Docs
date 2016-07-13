# 云代码

##### _Author: Marvin
##### _Github: https://github.com/zhoucen

## 简介
### 什么是云代码服务
云代码是部署运行在 MaxLeap 云引擎上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在 Web server上的 Web Service或 RESTful API。它对外提供的接口也是 RESTful API，也正是以这种方式被移动应用调用。 

### 为什么需要云代码服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助云代码服务实现，其优势在于：

* 强大的运算能力：云代码运行在 MaxLeap 的 Docker 容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求 Cloud Data，大大提升效率
* 同一套代码可以为 iOS，Android，Web Site 等提供服务


## 对象
存储在云数据的对象称为 `ML.Object`，而每个 `ML.Object` 被规划至不同的 `class` 中（类似“表”的概念)。`ML.Object` 包含若干键值对，且值为兼容 JSON 格式的数据。考虑到数据安全，MaxLeap 禁止客户端修改数据仓库的结构。您需要预先在 MaxLeap 开发者平台上创建需要用到的表，然后仔细定义每个表中的字段和其值类型。

### 新建
假设我们要保存一条数据到 `Comment` class，它包含以下属性：

属性名|值|值类型
-------|-------|---|
content|"我很喜欢这条分享"|字符
pubUserId|1314520|数字
isRead|false|布尔

我们建议您使用驼峰式命名法来命名类名和字段名（如：NameYourclassesLikeThis, nameYourKeysLikeThis），让您的代码看起来整齐美观。

```javascript
var Comment = ML.Object.extend('Comment');
var comment = new Comment();
comment.set('content', '我很喜欢这条分享');
comment.set('pubUserId', 1314520);
comment.set('isRead', false);

comment.save();
```
该代码运行后，您可能想知道是否真的执行了相关操作。为确保数据正确保存，您可以在 MaxLeap 开发中心查看应用中的数据。您应该会看到类似于以下的内容：

```
objectId: "563c154ca5ff7f000168964b", content: "我很喜欢这条分享", pubUserId: 1314520, isRead: false,
createdAt:"2015-11-06T02:49:48.235Z", updatedAt:"2015-11-06T02:49:48.235Z"
```

注意：

* **Comment表合何时创建:** 出于数据安全考虑，MaxLeap 禁止客户端创建表，所以在使用前必须先登录 MaxLeap 的控制台并手动创建 Comment 表。这样在运行代码后这条数据才会被成功插入。
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 `content`、`pubUserId`、`isRead` 等属性，那么，新建 comment 对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **`ML.Object`是Schemaless的:** 您无需事先指定 `ML.Object` 存在哪些键，只需在需要的时候增加键值对，后台便会自动储存它们。
* **内建的属性:** 每个 `ML.Object` 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **大小限制：** `ML.Object` 的大小被限制在128K以内。
* 键的名称可以包含英文字母，数字和下划线，但是必须以字母开头。值的类型可为字符, 数字, 布尔, 数组或是 `ML.Object`，为支持 JSON 编码的类型即可.
* 您可以在调用 `comment.save()`时，链式调用 `.then()`，用以检查新建是否成功。

```javascript
comment.save().then(function(){
  console.log('success');
}, function(){
  console.log('fail');
});
```
### 检索
##### 获取 `ML.Object `
您可以通过某条数据的 `ObjectId`，用 `ML.Query` 获取完整的 `ML.Object`：

```javascript
var query = new ML.Query(Comment);
query.get('563c154ca5ff7f000168964b').then(function(comment){
  console.log(comment);
});
```
##### 获取 `ML.Object` 属性值
为了获得 `ML.Object` 的属性值，应该使用 `get()` 方法：

```javascript
var content = comment.get('content');
```

### 更新
更新 `ML.Object` 需要两步：首先获取需要更新的 `ML.Object`，然后修改并保存：

```javascript
var query = new ML.Query(Comment);
query.get('563c154ca5ff7f000168964b').then(function(comment){
  comment.set('isRead', true);
  
  comment.save().then(function(comment){
    console.log(comment);
  }, function(error){
    console.log(error);
  });
});
```

### 删除
##### 删除 `ML.Object`
调用如下代码会在 MaxLeap 中删除一个实例：

```javascript
comment.destroy().then(function(result){
//success
}, function(){
//error
});
```

##### 批量删除
批量删除一批对象可以这样：

```javascript
ML.Object.destroyAll(objects);
```

其中 `objects` 是一个对象集合，且其中的每个对象的 `className` 必须一样。

##### 删除 `ML.Object` 属性值
您可以使用 `unset` 方法来删除一个实例中的单个属性：

```javascript
comment.unset('content');
comment.save();
```

### 关联数据
对象可能与别的对象有关系。比如对于微博来说，一条微博信息(Post 对象)可能有很 多评论(Comment 对象)。MaxLeap 支持各种关系，包括一对一、一对多和多对多。

##### 一对一关联
一对一关系和一对多关系都可以通过在一个 ML.Object 内保存另一个对象的实例来实现。 比如，每一个 Comment 都对应了一个 Post，创建一个带一条 Comment 的 Post, 你可以这样写：

```javascript
var post = new Post();
var comment = new Comment();
post.set('content', '这是我的第一条微博信息，请大家多多关照。');
comment.set('content', '期待您更多的微博信息。');
comment.add('post', post);
comment.save()
```
MaxLeap 内部会自动处理，调用 Comment 的 save 方法就可以同时保存两个新对象。

如果是现有对象想要关联到新对象，你同样可以通过只用它们的 `objectId` 来连接彼此。 请注意，不能直接像上面的例子那样将现有对象设置进去，而是必须 new 一个新对象并只设置 `objectId` 属性：

```javascript
var post = ML.Object.createWithoutData('Post', '5652ae2ba5ff7f00011d1c0b');
var comment = new Comment();
comment.add('post', post);
comment.save();
```
或者：

```javascript
var post = new Post();
post.id = '5652ae2ba5ff7f00011d1c0b';
var comment = new Comment();
comment.add('post', post);
comment.save();
```
##### 一对多关联
把两条评论关联至一条微博中：

```javascript
var post = new Post();
post.set('content', '这是我的第一条微博信息，请大家多多关照。');

var comment1 = new Comment();
comment1.set('content', '期待您更多的微博信息。');
var comment2 = new Comment();
comment2.set('content', '我也期待。');

post.add('comment', comment1);
post.add('comment', comment2);
post.save()
```

##### 多对多关联
多对多关系是通过 `ML.Relation` 来建模的。这样很像在一个 key 中存储一个 `ML.Object` 数组。但是区别之处在于，在获取附加属性的时候，`ML.Relation` 不需要同步获取关联的所有 `ML.Object` 实例。这使得 `ML.Relation` 比数组的方式可以支持更多实例，读取方式也更加灵活。例如，一个 User 可以喜欢很多 Post。这种情况下，就可以用 `relation()` 方法保存一个用户喜欢的所有 Post 集合。为了新增一个喜欢的 Post，你可以这样做：

```javascript
var relation = user.relation('likes');
relation.add(post);
user.save()
```
仅可以从一个 `ML.Relation` 中删除一个 post:
```javascript
relation.remove(post);
```

默认情况下，`relation` 关联的对象不回被同步获取到，您可以通过使用 `query` 方法返回的 `ML.Query` 对象来获取 `ML.Object` 的列表，比如：

```javascript
query.first().then(function(result){
  var relation = result.relation('likes');
  relation.query().find();
});
```
### 计数器
计数器是应用常见的功能需求之一。当某一数值类型的字段会被频繁更新，且每次更新操作都是将原有的值增加某一数值，此时，我们可以借助计数器功能，更高效的完成数据操作。并且避免短时间内大量数据修改请求引发冲突和覆盖。

比如记录某用户游戏分数的字段 "score"，我们便会频繁地修改，并且当有几个客户端同时请求数据修改时，如果我们每次都在客户端请求获取该数据，并且修改后保存至云端，便很容易造成冲突和覆盖。

#####递增计数器
此时，我们可以利用`increment()`方法(默认增量为 1)，高效并且更安全地更新计数器类型的字段。如，为了更新记录用户游戏分数的字段 "score"，我们可以使用如下方式：

```javascript
gameScore.increment('score');
gameScore.save();
```

#####指定增量
```javascript
gameScore.increment('score', 3);
gameScore.save();
```

#####递减计计数器
```javascript
gameScore.increment('score', -3);
gameScore.save();
```
注意：
增量无需为整数，您还可以指定增量为浮点类型的数值。

### 数组
为了帮你存储数组类数据，MaxLeap 提供了三种操作让你可以原子地改动一个数组的值（当然，他们都需要一个给定的 key）:

* **`add`：** 在一个数组的末尾加入一个给定的对象
* **`addUnique`：** 只会把原本不存在的对象加入数组，所以加入的位置没有保证
* **`remove`：** 在一个数组中删除所有指定的实例

比如，我们想在一条微博的属性 "tags" 中加入多个属性值:

```javascript
post.addUnique('tags', 'Frontend');
post.addUnique('tags', 'JavaScript');
post.save();
```
### 数据类型
到现在为止我们使用了 `String`、`Number` 和 `ML.Object` 类型，MaxLeap 同样支持 JavaScript 的 `Date` 和 `null` 类型。
你可以用一个 `ML.Object` 中嵌套 JavaScript 对象和数组来表述更加结构化的数据:

```javascript
var number = 123, date = new Date(), array = ['a', 'b'], object = {name: 'test'};
var post = new Post();
post.set('number', number);
post.set('date', date);
post.set('array', array);
post.set('object', object);
post.save();
```

## 查询
### 基本查询
使用MLQuery查询 `ML.Object ` 分三步：

1. 创建一个 `ML.Query ` 对象，并指定对应的 "`ML.Object` class"；
2. 为 `MLQuery` 添加过滤条件；
3. 执行 `MLQuery `：使用 `query.find()` 方法查询与条件匹配的 `ML.Object ` 数据。

例如，查询存在 `objectId` 的 GameScore：

```javascript
var GameScore = ML.Object.extend('GameScore');
var query = new ML.Query(GameScore);
query = new ML.Query(GameScore);
query.exists('name');
query.equalTo('score', 13);
query.find();
```
### 查询条件
`equalTo` 方法用来过滤符合要求的对象：

```javascript
query.equalTo('pubUser', 'MaxLeap 官方客服');
```

`notEqualTo` 方法用来过滤不符合要求的对象，`equalTo` 正好相反：

```javascript
query.equalTo('pubUser', 'MaxLeap 官方客服');
```

对于类型为数字的属性，您可以对其值的大小进行筛选：

```javascript
query.greaterThan('score', 7);
query.greaterThanOrEqualTo('score', 7);
query.lessThan('score', 11);
query.lessThanOrEqualTo('score', 11);
```
您可以使用 `select` 和一个 `keys` 的列表来限定返回的字段，比如只获取 “name” 和 “score” 字段(自动包含内建属性， 如 objectId，createdAt 及 updatedAt)：

```javascript
query.select('name', 'score');
```
剩下的字段可以之后用返回的对象的 fetch 方法来获取：

```javascript
query.first().then(function(result){
  result.fetch();
});
```

如果想让返回的对象的某个属性匹配多个值，您可以使用 `containedIn`，提供一个数组就可以了。比如查询名字为「henry，frank」的 GameScore ：

```javascript
query.containedIn('name',['henry', 'zhou']);
```

相反地，您可以使用 `notContainedIn` 方法来查询在集合之外的目标对象。

如果你只想要一个结果，一个更加方便的方法可能是使用 `first()`，而不是 `find()` 方法:

```javascript
query.first()
```

使用 `skip` 跳过前面的结果，这可能对分业很有用： 

```javascript
query.skip(10); // 跳过前 10 条结果
```

你可以用设定 limit 的方法来限定返回的结果数，默认的返回结果数是 100，但是任 何 1 到 1000 之间的数值都是合法的，在 0 到 1000 范围之外的都强制转成默认的 100。

```javascript
query.limit(10); // 最多返回 10 条结果
```

对于可以排序的类型，比如 `number` 和 `string`，你可以控制返回结果的顺序：

```javascript
query.ascending('pubUser'); // 升序

query.descending('pubTimestamp'); // 降序
```
### 对数组值做查询
对于属性值是数组的情况，您可以这样查询数组的值中有 “henry” 的游戏记录：

```javascript
query.equalTo('developer', 'henry');
```
您同样可以用下面的方式找到属性值中同时包含 “henry”，“frank” 的游戏记录：

```javascript
query.containsAll('developer', ['henry', 'frank']);
```
此外，您还可以根据数组长度来查询，比如查询 developer 人数为 2 的游戏记录：

```javascript
query.sizeEqualTo('developer', 2);
```

### 对字符串类型做查询
使用 `startsWith()` 来限制属性值以一个特定的字符串开头，比如找出 name 以 “bai” 开头的游戏记录：

```javascript
query.startsWith('name', 'bai');
```

### 关系查询
对于查询关系型数据来说有几种不同的方式，如果您想要获取的对象中有某个属性包含一个特定的 `ML.Object`，您可以使用 `equalTo()`，就像对于别的数据类型一样。

例如，如果每条 Comment 的 post 字段都有一个 Post 对象，那么找出指定 post 下的 comment：

```javascript
// 假设 myPost 是已经创建的对象。
var query = new ML.Query(Comment);
query.equalTo('post', myPost);
query.find();
```
如果想得到其字段中包含的子对象满足另一个查询的结果，你可以使用 `matchesQuery()` 操作。 注意默认的结果条数限制 100 和最大值 1000 也同样适用于子查询，所以对于大的数据集您可能需要小心构建查询条件，否则可能出现意料之外的状 况。例如，为了找到有图片的 post 的 comment，您可以：

```javascript
var innerQuery = new AV.Query(Post);
innerQuery.exists('image');
var query = new AV.Query(Comment);
query.matchesQuery('post', innerQuery);
query.find().then(function(comments) {
    // comments 包含有所有带图片 post 的 comment.
  });
```
如果您想要获取某字段中包含的子对象不满足指定查询的结果，你可以使用 `doesNotMatchQuery()`。例如，为了找到针对不含图片的 post 的 comment，可以这样：

```javascript
var innerQuery = new AV.Query(Post);
innerQuery.exists('image');
var query = new AV.Query(Comment);
query.doesNotMatchQuery('post', innerQuery);
query.find().then(function(comments) {
    // comments 包含所有不带图片 post 的 comment.
  })
```


## UserPrincipal
SDK提供使用用户请求原始信息UserPrincipal来访问数据，而不是通过cloudcode的masterKey来实现，这样数据在访问流通过程中可以有效保证key的安全性，而不被人拦截请求截获masterKey信息。

###使用UserPrincipal
SDK在处理hook请求时会默认使用UserPrincipal，在function/job中你可以通过获取Request对象的UserPrincipal来完成你的数据访问。

```javascript
ML.Cloud.function('hello',function(req, res){
	var Comment = ML.Object.extend('Comment');
	var comment = new Comment();
	comment.UseUserPrincipal(req);
	comment.set('title','hello');
	comment.save().then(function(result){
		res.end(result.id);
	});
});
```
* 如果你不使用UserPrincipal来访问数据，SDK会默认使用master-key（即配置文件global.json中的applicationKey）来访问数据
* 所有SDK的api都提供了使用UserPrincipal方式来访问数据，除了cloudcode云代码自身发起的请求必须使用masterKey来访问外，其他所有请求我们建议你使用UserPrincipal这种方式来保证你的秘钥安全。


## 云代码 项目

### 新建一个项目

### 一个Nodejs CloudCode项目的目录树应该如下：

```
├── app                     #cloudcode主目录 (必备)
│   ├── package.json        #cloudcode的环境依赖（可选）
│   ├── function            #function目录（可选）
│   │   └── demo.py
│   ├── hook                #hook目录（可选）
│   ├── job                 #job目录（可选）
|   └── tests               #tests目录（可选）
├── config                  #cloudcode配置文件目录（必备）
│   └── global.json         #cloudcode配置文件（必备）
└── node_modules            #cloudcode的环境依赖（可选）
```

温馨提示: 如果你需要手动 zip 打包项目,请保持目录结构如上图所示,请勿再外套一层目录.

### 目录加载顺序

1. npm安装package.json
2. 拷贝node_modules依赖 (包括 mlcloudcode)
3. 加载程序文件，顺序为：config -> hook -> job -> function

### 修改配置
在/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```python
{
	"applicationName" : "HelloWorld",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "nodejs",
	"version": "0.0.1"
}
```

根据创建应用时获取的key，修改下列键的值：

键|值|
------------|-------|
applicationName|MaxLeap应用名称
applicationId|Application ID
applicationKey|Master Key
version|当前云代码项目版本号


##### *cloudcode 的运行环境内置最新版本的mlcloudcode*

### 使用sdk

- 定义你的第一个function

  在文件function/demo.py中

  ```javascript
  var ML = require('mlcloudcode');
  ML.Cloud.function("helloword", function(req, res){
  		res.end("helloword");
  }
  ```

  使用Cloud.function来定义你的function。每个function都调用res.end返回一个Response。

- 定义你的第一个job

  在文件job/demo.py中

  ```javascript
  var ML = require('mlcloudcode');
  ML.Cloud.job("helloword", function(req, res){
  		res.end("helloword");
  }
  ```

  使用Cloud.job来定义你的job。每个job都调用res.end返回一个Response。

### 实现复杂点的Fuction

这里我们简单实现一个业务逻辑，提交一个忍者名称，生成一个忍者本体和它的50个影分身，找出其中第50个分身，击杀其余分身和本体，让它成为新的本体

```javascript
var ML = require('mlcloudcode');
ML.serverURL = "http://apidev.leap.as";

var Ninja = ML.Object.extend('Ninja');

ML.Cloud.function("helloNinja", function(req, res){
    // 获取name
    var name = req.body.name;
    var promise = ML.Promise.as();
    var ninja = null;
    var ninja_50 = null;

    // 产生本体
    promise = promise.then(function(){
        ninja = new Ninja();
        ninja.set('name', name);
        return ninja.save().then(function(ninja){
            ML.Log.info("生成本体，ID为："+ninja.id);
        })
    });

    // 产生50个分身
    var clone_ninja_ids = [];
    for(var i = 0; i < 50; i++){
        promise = promise.then(function(){
            var idx = i;
            return function(){
                var clone_ninja = new Ninja();
                clone_ninja.set('name', name + '_' + idx);
                return clone_ninja.save().then(function(clone_ninja){
                    ML.Log.info("多重隐分身："+clone_ninja.id);
                    clone_ninja_ids.push(clone_ninja.id);
                });
            }
        }());
    }

    // 找出第50个分身
    promise = promise.then(function(){
        var query = new ML.Query(Ninja);
        query.equalTo('name',name + '_49');
        return query.first().then(function(result){
            ML.Log.info("找到第50个分身:"+result.id);
            clone_ninja_ids = ML._.without(clone_ninja_ids, result.id);
            ninja_50 = result;
        });
    });

    // 击杀其余49个分身
    promise = promise.then(function(){
        var query = new ML.Query(Ninja);
        query.containedIn('objectId',clone_ninja_ids);
        return query.find().then(function(results){
            var del_promise = ML.Promise.as();
            ML._.each(results, function(result){
                del_promise = del_promise.then(function(){
                    return result.destroy().then(function(){
                        ML.Log.info("击杀分身:"+result.id);
                    });
                });
            });
            del_promise = del_promise.then(function(){
                ML.Log.info("完成分身击杀数目:"+results.length);
            });
            return del_promise;
        });
    });

    // 击杀本体
    promise = promise.then(function(){
        return ninja.destroy().then(function(){
            ML.Log.info("完成本体击杀");
        })
    })

    // 让第50个分身成为新的本体
    promise = promise.then(function(){
        ninja_50.set('name',name + '_new');
        return ninja_50.save().then(function(result){
            ML.Log.info("第50个分身在"+ninja_50.updatedAt.toISOString()+"成为新的本体");
        });
    });

    // 返回新的本体名称
    promise.then(function(){
        res.end(ninja_50.get('name'));
    }).catch(function(err){
        res.end(JSON.stringify(err));
    });

});

```

### 实现HOOK操作
支持before_save、after_save、after_update、before_delete、after_delete
样例如下：

```javascript
var ML = require('mlcloudcode');

//测试hook
ML.Cloud.beforeSave('Ninja', function(obj, res){
    ML.Log.info("beforeSave:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterSave('Ninja', function(obj, res){
    ML.Log.info("afterSave:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterUpdate('Ninja', function(obj, res){
    ML.Log.info("afterUpdate:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.beforeDelete('Ninja', function(obj, res){
    ML.Log.info("beforeDelete:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterDelete('Ninja', function(obj, res){
    ML.Log.info("afterDelete:" + JSON.stringify(obj));
    res.success();
});
```

所有的hook方法接收参数为表名

hook的执行顺序为：before hook -> original behavior -> after hook

hook方法可以选择调用res.success()或者res.error({"msg":"error"})，如果hook里面调用了res.error({"msg":"error"})，在这个hook之后的操作都不会执行，方法res.error的参数将直接返回给请求者。

## 日志
### 使用日志

*Log实例用来记录日志*

```javascript
ML.Log.info("test log");
```

* 目前有log，warn，error，debug四个级别*

* 本地测试不会产生数据库记录，但发布后会产生记录，你可以在后端界面查看你的日志信息*

* 如果你的function调用频率很高请在发布前尽量去掉调试测试日志以便不必要的日志存储*

### 查看日志
可以使用命令行工具MaxLeap-CLI查看最近的log

```shell
maxleap log -n 100
```
也进入“管理网站”，点击“开发者中心”－>“日志”，您便可查看该应用的所有日志。

## 本地单元测试

`ML.Cloud`实例提供了`callFunction` 和`callJob` 来测试你的程序。

使用`mocha`来测试你的代码：

`mocha tests/test_ninja.js`

```javascript
'use strict';
var ML = require('mlcloudcode');
var expect = require('expect.js'),
    should = require('should'),
    fs = require('fs'),
    request = require('supertest'),
    assert = require('assert');

require('../function/ninja.js');

var appId = '56273907169e7d0001bd5c92';
var appkey = 'TXV4MFB2SFFQdVpPSjJKYnFtSVdlUQ';
ML.initialize(appId, appkey);
ML.useCNServer();

describe('function', function(){
    it('helloNinja',function(done){
      ML.Cloud.callFuction('helloNinja',{'name':'test'},function(res){
         assert(res.body, 'test_new');
      }, done);
  });
});

```

*在测试用例里面你需要把你所有的function、job、hook文件全部require进来*

## MLC － 云代码命令行工具
MLC命令行工具是为云代码项目的上传，部署，停止及版本管理而设计的。您可以利用它，将Maven项目生成的package上传到MaxLeap，在云端，package将被制作成Docker Image，而部署过程，就是利用Docker Container将这个Image启动。而被上传到云端的每个版本的云代码都将被保存，您可以自由地卸载某一个版本，而后部署另外一个版本的云代码.
###登录:
```shell
maxleap 或者maxleap -username <用户邮箱> -region <CN or US ...>
```
`<用户邮箱>` 为您登录MaxLeap管理中心的账号邮箱，`<CN or US ...>` 为选择中国区账号还是美国区账号，然后根据提示输入密码
###显示所有app：
```shell
apps
```
查询账号下的所有应用，显示的信息为：AppId ：AppName
###选择应用:
```shell
use <应用名>
```
`<应用名>`为目标应用名，如果应用名包含空格，你可以用`use "应用名"`即使用引号来切换应用。选择之后，接下来的操作（上传/部署/停止/版本管理）都将以此应用为上下文。
###上传云代码:
```shell
upload <文件路径>
```
`<文件路径>`为你将部署的云代码 package（zip文件），它将被上传到步骤3指定的应用下。
上传的的代码会被制作成Docker镜像，版本号在云代码项目里的global.json文件中指定：
```
"version": "0.0.1"
```
###显示所有云端云代码版本:
```shell
lv
```
即显示所有该应用下，用户上传过的云代码的所有版本。
###部署云代码：
```shell
deploy <版本号>
```
`<版本号>`为想要部署的云代码版本号：如执行deploy 0.0.1，将部署指定应用下版本号为0.0.1的云代码。如果部署不存在的版本，会提示错误："version of appId not exists"
###停止cloudcode：
```shell
undeploy <版本号>
```
停止该应用的指定版本云代码：如果之前已经部署过一个版本，需要先停止，再部署新的版本。
###输出最近的日志：
```shell
log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]

-l 指定输出日志的级别：info或是error
-n 指定log的数量
-s 指定跳过最近的log数量
```
