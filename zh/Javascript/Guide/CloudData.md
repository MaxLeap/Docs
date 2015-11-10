# Javascript 云数据开发指南

##### _Author: Henry
##### _Github: https://github.com/henryybai

## 简介

### 什么是云数据服务
云数据是 MaxLeap 提供的数据存储服务，它建立在对象`MLObject`的基础上，每个`MLObject`包含若干键值对。所有`MLObject`均存储在 MaxLeap 上，您可以通过 Javascript SDK 对其进行操作，也可在 Console 中管理所有的对象。此外 MaxLeap 还提供一些特殊的对象，如`MLUser`(用户)，`MLFile`(文件)，`MLGeoPoint` (地理位置)，他们都是基于 `MLObject` 的对象。

### 为何需要云数据服务
 云数据将帮助您解决数据库基础设施的构建和维护，从而专注于实现真正带来价值的应用业务逻辑。其优势在于：
 
* 解决硬件资源的部署和运维
* 提供标准而又完整的数据访问API
* 可结合 Cloud Code 服务，实现云端数据的 Hook（详情请移步至[Cloud Code引导](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)）

## 对象
存储在云数据的对象称为 `MLObject`，而每个 `MLObject` 被规划至不同的 `class` 中（类似“表”的概念)。`MLObject` 包含若干键值对，且值为兼容 JSON 格式的数据。考虑到数据安全，MaxLeap 禁止客户端修改数据仓库的结构。您需要预先在 MaxLeap 开发者平台上创建需要用到的表，然后仔细定义每个表中的字段和其值类型。

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
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 content、pubUserId、isRead 等属性，那么，新建comment对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **MLObject是Schemaless的:** 您无需事先指定 `MLObject` 存在哪些键，只需在需要的时候增加键值对，后台便会自动储存它们。
* **内建的属性:** 每个 MLObject 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **大小限制：** ML Object的大小被限制在128K以内。
* 键的名称可以包含英文字母，数字和下划线，但是必须以字母开头。值的类型可为字符, 数字, 布尔, 数组或是MLObject，为支持JSON编码的类型即可.
* 您可以在调用 `comment.save()`时，链式调用 .then()，用以检查新建是否成功。

```javascript
comment.save().then(function(){
  console.log('success');
}, function(){
  console.log('fail');
});
```

### 检索
##### 获取 `MLObject `
您可以通过某条数据的ObjectId，用 ML.Query 获取完整的`MLObject`：

```javascript
var query = new ML.Query(Comment);
query.get('563c154ca5ff7f000168964b').then(function(comment){
  console.log(comment);
});
```
##### 获取 `MLObject` 属性值
为了获得 ML.Object 的属性值，应该使用 get 方法：

```javascript
var content = comment.get('content');
```

### 更新
更新 `MLObject` 需要两步：首先获取需要更新的MLObject，然后修改并保存：

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
##### 删除 `MLObject`
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

##### 删除 `MLObject` 属性值
您可以使用 `unset` 方法来删除一个实例中的单个属性：

```javascript
comment.unset('content');
comment.save();
```

### 计数器
计数器是应用常见的功能需求之一。当某一数值类型的字段会被频繁更新，且每次更新操作都是将原有的值增加某一数值，此时，我们可以借助计数器功能，更高效的完成数据操作。并且避免短时间内大量数据修改请求引发冲突和覆盖。

比如记录某用户游戏分数的字段"score"，我们便会频繁地修改，并且当有几个客户端同时请求数据修改时，如果我们每次都在客户端请求获取该数据，并且修改后保存至云端，便很容易造成冲突和覆盖。

#####递增计数器
此时，我们可以利用`increment()`方法(默认增量为1)，高效并且更安全地更新计数器类型的字段。如，为了更新记录用户游戏分数的字段"score"，我们可以使用如下方式：

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

* **add：** 在一个数组的末尾加入一个给定的对象
* **addUnique：** 只会把原本不存在的对象加入数组，所以加入的位置没有保证
* **remove：** 在一个数组中删除所有指定的实例

比如，我们想在一条微博的属性 "tags" 中加入多个属性值:

```javascript
post.addUnique("tags", "Frontend");
post.addUnique("tags", "JavaScript");
post.save();
```
### 数据类型
到现在为止我们使用了 String、Number 和 ML.Object 类型，MaxLeap 同样支持 JavaScript 的 Date 和 null 类型。
你可以用一个 ML.Object 中嵌套 JavaScript 对象和数组来表述更加结构化的数据:

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
### MLFILE的创建和上传
MLFile 可以让您的应用程序将文件存储到服务器中，以应对文件太大或太多，不适宜放入普通 MLObject 的情况。比如常见的文件类型图像文件、影像文件、音乐文件和任何其他二进制数据（大小不超过 100 MB）都可以使用。
在这个例子中，我们用 HTML5 上传一张图片：

```javascript
<input type="file" id="photoFileUpload">
<input type="button" id="fileUploadButton"/>
<script>
  document.querySelector('#fileUploadButton').addEventListener('click', function(){
    var fileUploadControl = document.querySelector("#photoFileUpload");
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var name = "avatar.jpg";
      var mlFile = new ML.File(name, file);
      mlFile.save();
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

