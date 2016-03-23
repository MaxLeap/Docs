# 数据存储

##### _Author: Henry
##### _Github: https://github.com/henryybai

## 简介

### 什么是数据存储服务
云数据库是 MaxLeap 提供的数据存储服务，它建立在对象 `ML.Object` 的基础上，每个 `ML.Object` 包含若干键值对。所有 `ML.Object` 均存储在 MaxLeap 上，您可以通过 Javascript SDK 对其进行操作，也可在 Console 中管理所有的对象。此外 MaxLeap 还提供一些特殊的对象，如 `ML.User` (用户)，`ML.File` (文件)，`ML.GeoPoint` (地理位置)，他们都是基于 `ML.Object` 的对象。

### 为何需要数据存储服务
 数据存储将帮助您解决数据库基础设施的构建和维护，从而专注于实现真正带来价值的应用业务逻辑。其优势在于：
 
* 解决硬件资源的部署和运维
* 提供标准而又完整的数据访问API
* 可结合代码托管服务，实现云端数据的 Hook （详见 [MaxLeap 云代码](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_CODE_ZH)）

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

## 文件
### ML.File的创建和上传
`ML.File` 可以让您的应用程序将文件存储到服务器中，以应对文件太大或太多，不适宜放入普通 `ML.Object` 的情况。比如常见的文件类型图像文件、影像文件、音乐文件和任何其他二进制数据（大小不超过 100 MB）都可以使用。
在这个例子中，我们用 HTML5 上传一张图片：

```javascript
<input type="file" id="photoFileUpload">
<input type="button" id="fileUploadButton"/>
<script>
  document.querySelector('#fileUploadButton').addEventListener('click', function(){
    var fileUploadControl = document.querySelector('#photoFileUpload');
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var name = 'avatar.jpg';
      var ML.File = new ML.File(name, file);
      ML.File.save();
    }
  });
</script>
```
注意：

* 你不需要担心文件名重复的问题。每一次上传都会有一个独一无二的标识符，所以上传多个文件都叫 avatar.jpg 是没有问题的。

### 获取文件的内容
把上传的文件显示到页面的指定元素中：

```javascript
document.querySelector('#avatarImg').src = file.url();
```

### 删除文件
使用 `destroy` 方法来删除文件：

```javascript
file.destroy();
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

## 用户
`ML.User` 是一个 `ML.Object` 的子类，它继承了 `ML.Object` 所有的方法，具有 `ML.Object` 相同的功能。不同的是，`ML.User` 增加了一些特定的关于用户账户相关的功能。

###字段说明
`ML.User` 除了从 `ML.Object` 继承的属性外，还有几个特定的属性：

属性名|类型|介绍|是否必需或唯一
---|---|---|---
username|String|用户的用户名|必需
password|String| 用户的密码|必需
email|String| 用户的电子邮件地址|可选
emailVerified|Boolean|电子邮件是否验证|可选
masterKey| String | 用户注册应用的MasterKey|可选
installationIds| String | 用户完成的所有安装的InstallationId|可选

注意：

* 请确保用户名和电子邮件地址是独一无二的。
* 系统会自动收集 `masterKey`，`installationIds` 的值。

### 注册用户
1. 创建 `ML.User` 对象，并提供必需的 username 和 password
2. 调用 `user.signUp()` 方法保存至云端。

```javascript
var r = new Date().getTime();
var user = new ML.User();
user.set('username', 'my name' + r);
user.set('password', 'my pass');
user.signUp()
```
注意：

* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 `signUp()` 方法，而不是 `save()` 方法。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 `Email` 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 `Email` 地址，以后在用户忘记密码的情况下可以使用 `MaxLeap` 提供的重置密码功能。

### 登录
您可以通过 `ML.User.logIn()` 方法登录：

```javascript
ML.User.logIn('yourname', 'yourpass');
```
### 邮箱验证

MaxLeap 提供强大的邮箱验证服务，您只需在 Console >> 应用设置 >> 电子邮件设置 中 开启 “验证用户的邮箱”, 系统便会自动在 `ML.User` 中添加 `emailVerified` 字段。并且，当 `ML.User` 的 email 字段被赋值或者修改, 且 `emailVerified` 字 字段的值为 false. MaxLeap 便会自动向用户发送一个链接，用户点击链接后便会将 `emailVerified` 设置为true.

`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

### 当前用户
如果用户在每次打开您的应用程序时都要登录，这将会直接影响到您应用的用户体验。为了避免这种情况，您可以使用缓存的 `currentUser` 对象。

每当您注册成功或是第一次登录成功，都会在本地磁盘中有一个缓存的用户对象，您可以这样来获取这个缓存的用户对象来进行登录：

```javascript
var currentUser = ML.User.current();
```

当然，您也可以使用如下方法清除缓存用户对象：

```javascript
ML.User.logOut();
```

### 重置密码
如果用户忘记密码，MaxLeap提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```javascript
ML.User.requestPasswordReset('youremail@xx.xx');
```

如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

* 用户输入他们的电子邮件，请求重置自己的密码。
* MaxLeap 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个ML的页面，输入一个新的密码。
* MaxLeap 将用户的密码重置为新输入的密码。

### 匿名用户
匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 MaxLeap 提供的匿名用户系统来实现您的功能。

您可以通过 `anonymousSignUp()` 注册一个匿名的用户账号：

```javascript
var user = new ML.User();
user.anonymousSignUp();
```

### 在 Console 中管理用户
User 表是一个特殊的表，专门存储 `ML.User` 对象。在Console >> 开发者中心 >> 云数据，您会看到一个 _User 表。

## 地理位置
MaxLeap 提供 `ML.GeoPoint` 对象，帮助用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。

### 创建 `ML.GeoPoint`
`ML.GeoPoint` 需要提供两个参数：第一个为纬度(正为北纬)，第二个参数为经度(正为东经)。

```javascript
var geoPoint = new ML.GeoPoint(40, -30);
```

该 `ML.GeoPoint` 对象可被存储在 `ML.Object` 中：

```javascript
var post = new Post();
post.set('location', geoPoint);
```

### 地理位置查询
您可以通过 `query.near()` 方法添加一个附近位置查询条件， 然后通过 `query.find()` 方法获取结果：

```javascript
var postGeoPoint = post.get('location');
var query = new ML.Query(Post);
query.near('location', postGeoPoint);
query.limit(10);
query.find();
```
这时会返回一个距离 postGeoPoint 的排序列表。注意如果在 `ML.Query` 上调用了 `ascending()/descending()` 的话，指定的排序属性会取代距离。

为了按距离限制返回的结果，你还可以使用 `withinMiles()`、`withinKilometers()` 和 `withinRadians()`。

同样地，也可以查询在特定地域的对象。为了找到用矩形表示的一块地域中的对象，需要在 `ML.Query` 中加入 `withinGeoBox()` 约束条件：

```javascript
var query = new ML.Query(Post);
var southwest = new ML.GeoPoint(39.97, 116.33);
var northeast = new ML.GeoPoint(39.99, 116.37);
query.withinGeoBox('location', southwest, northeast);
query.limit(10);
query.find();
```
    
