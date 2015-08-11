#云数据

## 简介

### 什么是Cloud Data服务
Cloud Data是Leap Cloud提供的数据存储服务，它建立在对象`LCObject`的基础上，每个`LCObject`包含若干键值对。所有`LCObject`均存储在Leap Cloud上，您可以通过iOS/Android Core SDK对其进行操作，也可在Console中管理所有的对象。此外Leap Cloud还提供一些特殊的对象，如`LCUser`(用户)，`LCRole`(角色)，`LCFile`(文件)，`LCGeoPoint`(地理位置)，他们都是基于`LCObject`的对象。

<<<<<<< HEAD
### 为何需要Cloud Data服务
Cloud Data将帮助您解决数据库基础设施的构建和维护，从而专注于实现真正带来价值的应用业务逻辑。其优势在于：

* 解决硬件资源的部署和运维
* 提供标准而又完整的数据访问API
* 不同于传统关系型数据库，向云端存储数据无需提前建表，数据对象以 JSON 格式随存随取，高并发访问轻松无压力
* 可结合Cloud Code服务，实现云端数据的Hook （详情请移步至[Cloud Code引导](。。。)） （！！修改说法！！）

### Cloud Data服务如何工作

Pic

## Cloud Object
存储在Cloud Data的对象称为`LCObject`，而每个`LCObject`被规划至不同的`class`中（类似“表”的概念)。`LCObject`包含若干键值对，且值为兼容JSON格式的数据。您无需预先指定每个 LCObject包含哪些属性，也无需指定属性值的类型。您可以随时向`LCObject`增加新的属性及对应的值，Cloud Data服务会将其存储至云端。

###新建
假设我们要保存一条数据到`Comment`class，它包含以下属性：

属性名|值|值类型
-------|-------|---|
content|"我很喜欢这条分享"|字符
pubUserId|1314520|数字
isRead|false|布尔

添加属性的方法与`Java`中的`Map`类似：

```java
LCObject myComment = new LCObject("Comment");
myComment.put("content", "我很喜欢这条分享");
myComment.put("pubUserId", 1314520);
myComment.put("isRead", false);
LCDataManager.saveInBackground(myComment);
=======
If you haven't installed the SDK yet, please head over to [Android QuickStart](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID) or [Android QuickStart](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS) to get our SDK up and running in Eclipse. You can also check out our [iOS API Reference][LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS] or [Andorid API Reference][LC_DOCS_LINK_PLACEHOLDER_API_REF_ANDROID] for more detailed information about our SDK.

## Objects
### The LCObject

Storing data on LeapCloud is built around the LCObject. Each LCObject contains key-value pairs of JSON-compatible data. This data is schemaless, which means that you don't need to specify ahead of time what keys exist on each LCObjec. You simply set whatever key-value pairs yoou want, and our backend will store it.

For example, let's say you're tracking high scores for a game. A single LCObject could contain:

```java
LCObject gameScore = new LCObject("GameScore");
LCDataManager.saveInBackground(gameScore);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```

注意：

* **Comment表合何时创建:** 在运行以上代码时，如果云端（LeapCloud 的服务器，以下简称云端）不存在 Comment 数据表，那么 LeapCloud 将根据您第一次（也就是运行的以上代码）新建的 Comment 对象来创建数据表，并且插入相应数据。
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 content、pubUserId、isRead 等属性，那么，新建comment对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **LCObject是Schemaless的:** 如果云端的这个应用中已经存在名为 Comment 的数据表，新建comment对象时，您可以向
* **自动创建的属性:** 每个 LCObject 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

<<<<<<< HEAD
	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **大小限制：** LC Object的大小被限制在128K以内。
* **同步操作/异步操作：** 在 Android 平台上，大部分的代码是在主线程上运行的，如果在主线程上进行耗时的阻塞性操作，如访问网络等，您的代码可能会无法正常运行，避免这个问题的方法是把会导致阻塞的同步操作改为异步，在一个后台线程运行，例如 save() 还有一个异步的版本 saveInBackground()，需要传入一个在异步操作完成后运行的回调函数。查询、更新、删除操作也都有对应的异步版本。
* 键的名称必须为英文字母，值的类型可为字符, 数字, 布尔, 数组或是LCObject，为支持JSON编码的类型即可.
* 您可以在调用 `LCDataManager.saveInBackground()`时，传入第二个参数 - SaveCallback实例，用以检查新建是否成功。

	```java
	LCDataManager.saveInBackground(myComment, new SaveCallback() {
	  @Override
	  public void done(LCException e) {
	    if(e==null){
	      // 新建成功
	    } else{
	      // 新建失败
	    }
	  }
	});
```

###查询
#####查询LCObject
您可以通过某条数据的ObjectId，获取完整的`LCObject`。调用`LCQueryManager.getInBackground()`方法需要提供三个参数：第一个为查询对象所属的class名，第二个参数为ObjectId，第三个参数为回调函数，将在getInBackground()方法完成后调用。

```java
String objId="OBJECT_ID";
LCQueryManager.getInBackground("Comment", objId, new GetCallback<LCObject>() {

  @Override
  public void done(LCObject Object, LCException e) {
    // Object即为所查询的对象
=======
Let's say you want to save the GameScore described above to the LC Cloud. The interface is similar to a Map, plus the saveInBackground method:

```java
LCObject gameScore = new LCObject("GameScore");
gameScore.put("score", 1337);
gameScore.put("playerName", "Sean Plott");
gameScore.put("cheatMode", false);
LCDataManager.saveInBackground(gameScore);
```

 After this code runs, you will probably be wondering if anything really happened. To make sure the data was saved, you can look at the Data Browser in your app on LC. You should see something like this:

```java
objectId: "xWMyZ4YEGZ", score: 1337, playerName: "Sean Plott", cheatMode: false,
createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

There are two things to note here. You didn't have to configure or set up a new class called GameScore before running this code. Your LC app lazily creates this class for you when it first encounters it.`

There are also a few fields you don't need to specify that are provided as a convenience. objectId is a unique identifier for each saved object. createdAt and updatedAt represent the time that each object was created and LCt modified in the cloud. Each of these fields is filled in by LC, so they don't exist on a LCObject until a save operation has completed.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

  }
});
```

<<<<<<< HEAD
也可以通过"属性值+LCQuery"方式获取LCObject：

```java
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereMatches("isRead",false);
=======
Saving data to the cloud is fun, but it's even more fun to get that data out again. If you have the objectId, you can retrieve the whole LCObject using a LCQuery:

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
LCQueryManager.getInBackground(query,"xWMyZ4YEGZ", new GetCallback<LCObject>() {
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
  @Override
<<<<<<< HEAD
  public void done(List<LCObject> list, LCException e) {
    // list即为所查询的对象
=======
  public void done(LCObject object, LCException e) {
    if (e == null) {
      // object will be your game score
    } else {
      // something went wrong
    }
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
  }
});
```

<<<<<<< HEAD
如果您只需获取Query结果的第一条，您可以使用`LCQueryManager.getFirstInBackground()`方法：
=======
To get the values out of the LCObject, there's a getX method for each data type:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereMatches("pubUserId","USER_ID");

LCQueryManager.getFirstInBackground(query, new GetCallback<LCObject>() {
  @Override
  public void done(LCObject LCObject, LCException e){
    // LCObject即为所查询的对象
  }
});
```


#####查询LCObject属性值
要从检索到的 LCObject 实例中获取值，可以使用相应的数据类型的 getType 方法：

```java
int pubUserId = comment.getInt("pubUserId");
String content = comment.getString("content");
boolean isRead = comment.getBoolean("isRead");
```

###更新
更新LCObject需要两步：首先获取需要更新的LCObject，然后修改并保存。

```java
<<<<<<< HEAD
// 根据objectId获取LCObject
String objId="OBJECT_ID";
LCQueryManager.getInBackground(query, objId, new GetCallback<LCObject>() {

  @Override
  public void done(LCObject comment, LCException e) {
=======
LCDataManager.fetchInBackground(myObject, new GetCallback<LCObject>() {

  @Override
  public void done(LCObject object, LCException e) {
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
    if (e == null) {
      // 将该评论修改为“已读”
      comment.put("isRead", true);
      LCDataManager.saveInBackground(comment);
    }
  }
});
```

###删除
#####删除LCObject
您可以使用`LCDataManager.deleteInBackground()` 方法删除LCObjcet。确认删除是否成功，您可以使用 DeleteCallback 回调来处理删除操作的结果。

```java
LCDataManager.deleteInBackground(comment);
```

<<<<<<< HEAD
#####批量删除
您可以使用`LCDataManager.deleteInBackground()` 方法删除LCObjcet - 一个`List<LCObject>`实例。

```java
List<LCObject> objects = ...
LCDataManager.deleteAllInBackground(objects);
```

#####删除LCObject实例的某一属性
除了完整删除一个对象实例外，您还可以只删除实例中的某些指定的值。请注意只有调用 saveInBackground() 之后，修改才会同步到云端。

```java
// 移除该实例的isRead属性
comment.remove("isRead");
// 保存
LCDataManager.saveInBackground(comment.remove);
```

### 计数器
=======
Updating an object is simple. Just set some new data on it and call one of the save methods. Assuming you have saved the object and have the objectId, you can retrieve the LCObject using a LCQuery and update its data:

```java
// Retrieve the object by id
LCQueryManager.getInBackground(query, "xWMyZ4YEGZ", new GetCallback<LCObject>() {

  @Override
  public void done(LCObject gameScore, LCException e) {
    if (e == null) {
      // Now let's update it with some new data. In this case, only cheatMode and score
      // will get sent to the LC Cloud. playerName hasn't changed.
      gameScore.put("score", 1338);
      gameScore.put("cheatMode", true);
      LCDataManager.saveInBackground(gameScore);
    }
  }
});
```

LC automatically figures out which data has changed so only "dirty" fields will be transmitted during a save. You don't need to worry about squashing data in the cloud that you didn't intend to update.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

计数器是应用常见的功能需求之一。当某一数值类型的字段会被频繁更新，且每次更新操作都是将原有的值增加某一数值，此时，我们可以借助计数器功能，更高效的完成数据操作。并且避免短时间内大量数据修改请求引发冲突和覆盖。

比如纪录某用户游戏分数的字段"score"，我们便会频繁地修改，并且当有几个客户端同时请求数据修改时，如果我们每次都在客户端请求获取该数据，并且修改后保存至云端，便很容易造成冲突和覆盖。

<<<<<<< HEAD
#####递增计数器
此时，我们可以利用`increment()`方法(默认增量为1)，高效并且更安全地更新计数器类型的字段。如，为了更新记录用户游戏分数的字段"score"，我们可以使用如下方式：
=======
To help with storing counter-type data, LC provides methods that atomically increment (or decrement) any number field. So, the same update can be rewritten as:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
gameScore.increment("score");
LCDataManager.saveInBackground(gameScore);
```
#####指定增量

```java
gameScore.increment("score",1000);
LCDataManager.saveInBackground(gameScore);
```

注意，增量无需为整数，您还可以指定增量为浮点类型的数值。
#####递减计数器

```java
<<<<<<< HEAD
gameScore.decrement("score",1000);
=======
gameScore.addAllUnique("skills", Arrays.asList("flying", "kungfu"));
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
LCDataManager.saveInBackground(gameScore);
```

###数组

您可以通过以下方式，将数组类型的值保存至LCObject的某字段(如下例中的skills字段)下：

<<<<<<< HEAD
#####增加至数组尾部
您可以使用`add()`或`addAll()`向`skills`属性的值的尾部，增加一个或多个值。

```java
gameScore.add("skills", "driving");
gameScore.addAll("skills", Arrays.asList("flying", "kungfu"));
LCDataManager.saveInBackground(gameScore);
=======
To delete an object from the LC Cloud:

```java
LCDataManager.deleteInBackground(myObject);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```

同时，您还可以通过`addUnique()` 及 `addAllUnique()`方法，仅增加与已有数组中所有item都不同的值。

#####使用新数组覆盖
调用`put()`函数，`skills`字段下原有的数组值将被覆盖：

```java
<<<<<<< HEAD
gameScore.put("skills", Arrays.asList("flying", "kungfu"));
LCDataManager.saveInBackground(gameScore);
=======
// After this, the playerName field will be empty
myObject.remove("playerName");
 
// Saves the field deletion to the LC Cloud
LCDataManager.saveInBackground(myObject.remove);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```
#####删除某数组字段的值
调用`removeAll()`函数，`skills`字段下原有的数组值将被清空：

```java
gameScore.removeAll("skills");
LCDataManager.saveInBackground(gameScore);
```

<<<<<<< HEAD
注意：
=======
Objects can have relationships with other objects. To model this behavior, any LCObject can be used as a value in other LCObjects. Internally, the LC framework will store the referred-to object in just one place, to maintain consistency.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

* Remove和Add/Put必需分开调用保存函数，否则数据不能正常上传。

<<<<<<< HEAD
###关联数据
对象可以与其他对象相联系。如前面所述，我们可以把一个 LCObject 的实例 a，当成另一个 LCObject 实例 b 的属性值保存起来。这可以解决数据之间一对一或者一对多的关系映射，就像数据库中的主外键关系一样。

注：Leap Cloud 云端是通过 Pointer 类型来解决这种数据引用的，并不会将数据 a 在数据 b 的表中再额外存储一份，这也可以保证数据的一致性。 

####一对一关联
例如：一条微博信息可能会对应多条评论。创建一条微博信息并对应一条评论信息，您可以这样写：

```JAVA
// 创建微博信息
LCObject myPost = new LCObject("Post");
myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");

// 创建评论信息
LCObject myComment = new LCObject("Comment");
myComment.put("content", "期待您更多的微博信息。");

// 添加一个关联的微博对象
myComment.put("post", myWeibo);

// 这将保存两条数据，分别为微博信息和评论信息
=======
```java
// Create the post
LCObject myPost = new LCObject("Post");
myPost.put("title", "I'm Hungry");
myPost.put("content", "Where should we go for lunch?");
 
// Create the comment
LCObject myComment = new LCObject("Comment");
myComment.put("content", "Let's do Sushirrito.");
 
// Add a relation between the Post and Comment
myComment.put("parent", myPost);
 
// This will save both myPost and myComment
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
LCDataManager.saveInBackground(myComment);
```

您也可以通过 objectId 来关联已有的对象：

```java
<<<<<<< HEAD
// 把评论关联到 objectId 为 1zEcyElZ80 的这条微博上
myComment.put("parent", LCObject.createWithoutData("Post", "1zEcyElZ80"));
```

默认情况下，当您获取一个对象的时候，关联的 LCObject 不会被获取。这些对象除了 objectId 之外，其他属性值都是空的，要得到关联对象的全部属性数据，需要再次调用 fetch 系方法（下面的例子假设已经通过 LCQuery 得到了 Comment 的实例）:
=======
//Add a relation between the Post with objectId "1zEcyElZ80" and the comment
myComment.put("parent", LCObject.createWithoutData("Post", "1zEcyElZ80"));
```

By default, when fetching an object, related LCObjects are not fetched. These objects' values cannot be retrieved until they have been fetched like so:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCObject post = fetchedComment.getLCObject("post");
LCDataManager.fetchInBackground(post, new GetCallback<LCObject>() {

    @Override
    public void done(LCObject post, LCException e) {
          String title = post.getString("title");
          // Do something with your new title variable
        }
});
```

<<<<<<< HEAD
####一对多关联
将两条评论分别关联至一条微博中：

```java
// 创建微博信息
LCObject myPost = new LCObject("Post");
myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");

// 创建评论信息
LCObject myComment = new LCObject("Comment");
myComment.put("content", "期待您更多的微博信息。");

// 创建另一条评论信息
LCObject anotherComment = new LCObject("Comment");
anotherComment.put("content", "期待您更多的微博信息。");

// 将两条评论信息放至同一个List中
List<LCObject> listComment = new ArrayList<>();
listComment.add(myComment);
listComment.add(anotherComment);

// 在微博中关联这两条评论
myPost.put("comment", listComment);

// 这将保存两条数据，分别为微博信息和评论信息
LCDataManager.saveInBackground(myComment);
```

注意：

* Java 6及更低版本请使用`List<LCObject> listComment = new ArrayList<LCObject>()`创建listComment.
* 您也可以选择使用`add()`方法，逐个添加LCObject至属性中：

	```java
	myPost.add("comment", myComment);
	myPost.add("comment", anotherComment);
	```

####使用LCRelation实现关联

您可以使用 LCRelation 来建模多对多关系。这有点像 List 链表，但是区别之处在于，在获取附加属性的时候，LCRelation 不需要同步获取关联的所有 LCRelation 实例。这使得 LCRelation 比链表的方式可以支持更多实例，读取方式也更加灵活。例如，一个 User 可以赞很多 Post。这种情况下，就可以用`getRelation()`方法保存一个用户喜欢的所有 Post 集合。为了新增一个喜欢的 Post，您可以这样做：

```java
LCUser user = LCUser.getCurrentUser();
//在user实例中，创建LCRelation实例 - likes
LCRelation<LCObject> relation = user.getRelation("likes");
//在likes中添加关联 - post
=======
You can also model a many-to-many relation using the LCRelation object. This works similar to List, except that you don't need to download all the LCObjects in a relation at once. This allows LCRelation to scale to many more objects than the List approach. For example, a User may have many Posts that they might like. In this case, you can store the set of Posts that a User likes using getRelation. In order to add a post to the list, the code would look something like:

```java
LCUser user = LCUser.getCurrentUser();
LCRelation<LCObject> relation = user.getRelation("likes");
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
relation.add(post);
LCUserManager.saveInBackground(user);
```

<<<<<<< HEAD
您可以从 LCRelation 中移除一个 Post:
=======
You can remove a post from the LCRelation with something like:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
relation.remove(post);
```

<<<<<<< HEAD
默认情况下，处于关系中的对象集合不会被同步获取到。您可以通过 getQuery 方法返回的 LCQuery 对象，使用它的 findInBackground() 方法来获取 Post 链表，像这样：
=======
By default, the list of objects in this relation are not downloaded. You can get the list of Posts by calling findInBackground on the LCQuery returned by getQuery. The code would look like:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<LCObject>() {

    @Override
    public void done(List<LCObject> results, LCException e) {
         if (e != null) {
          } else {
            // results包含relation中所有的关联对象
          }
    }
});
```

<<<<<<< HEAD
如果您只想获取链表的一个子集合，您可以添加更多的约束条件到 getQuery 返回 LCQuery 对象上（这一点是直接使用 List 作为属性值做不到的），例如：

```java
LCQuery<LCObject> query = relation.getQuery();
// 在 query 对象上可以添加更多查询约束
query.skip(10);
query.limit(10);
```

更多关于 LCQuery 的信息，请查看的[查询指南](..)。查询的时候，一个 LCRelation 对象运作起来像一个对象链表，因此任何您作用在链表上的查询（除了 include），都可以作用在 LCRelation上。

###数据类型
=======
If you want only a subset of the Posts you can add extra constraints to the LCQuery returned by getQuery. The code would look something like:

```java
LCQuery<LCObject> query = relation.getQuery();
LCQuery<LCObject> query = relation.getQuery();
// Add other query constraints.
```

For more details on LCQuery, please look at the query portion of this guide. A LCRelation behaves similar to a List for querying purposes, so any queries you can do on lists of objects (other than include) you can do on LCRelation.

### Data Types

So far we've used values with type String, int, bool, and LCObject. LC also supports java.util.Date, byte[], and JSONObject.NULL.

You can nest JSONObject and JSONArray objects to store more structured data within a single LCObject.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

目前为止，我们支持的数据类型有 String、Int、Boolean 以及 LCObject 对象类型。同时 LeapCloud 也支持 java.util.Date、byte[]数组、JSONObject、JSONArray 数据类型。 您可以在 JSONArray 对象中嵌套 JSONObject 对象存储在一个 LCObject 中。 以下是一些例子：

```java
int myNumber = 42;
String myString = "the number is " + myNumber;
Date myDate = new Date();
 
JSONArray myArray = new JSONArray();
myArray.put(myString);
myArray.put(myNumber);
 
JSONObject myObject = new JSONObject();
myObject.put("number", myNumber);
myObject.put("string", myString);
 
byte[] myData = { 4, 8, 16, 32 };
 
LCObject bigObject = new LCObject("BigObject");
bigObject.put("myNumber", myNumber);
bigObject.put("myString", myString);
bigObject.put("myDate", myDate);
bigObject.put("myData", myData);
bigObject.put("myArray", myArray);
bigObject.put("myObject", myObject);
bigObject.put("myNull", JSONObject.NULL);
LCDataManager.saveInBackground(bigObject);
<<<<<<< HEAD
```

我们不建议存储较大的二进制数据，如图像或文件不应使用 LCObject 的 byte[] 字段类型。LCObject 的大小不应超过 128 KB。如果需要存储较大的文件类型如图像、文件、音乐，可以使用 LCFile 对象来存储，具体使用方法可见 [文件指南](..)。 关于处理数据的更多信息，可查看[数据安全指南](...)。

## 文件
###LCFile的创建和上传
LCFile 可以让您的应用程序将文件存储到服务器中，比如常见的文件类型图像文件、影像文件、音乐文件和任何其他二进制数据都可以使用。 

在这个例子中，我们将图片保存为LCFile并上传到服务器端：

```java
public void UploadFile(Bitmap img){
  // 将Bitmap转换为二进制数据byte[]
  Bitmap bitmap = img;
  ByteArrayOutputStream stream = new ByteArrayOutputStream();
  bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
  byte[] image = stream.toByteArray();
  
  // 创建LCFile对象
  LCFile myFile = new LCFile("myPic.png", image);
  
  // 上传
  LCFileManager.saveInBackground(myFile, new SaveCallback() {
    @Override
    public void done(LCException e) {

    }
  });
}
```

注意：

* 	LCFile 构造函数的第一个参数指定文件名称，第二个构造函数接收一个 byte 数组，也就是将要上传文件的二进制。您可以通过以下代码，获取文件名：

	```java
	String fileName = myFile.getName();
	```
* 	可以将 LCFile 直接存储到其他对象的某个属性里，后续可以取出来继续使用。
 
	```java
	//创建一个LCObject，包含ImageName，ImageFile字段
	LCObject imgupload = new LCObject("ImageUploaded");
	imgupload.put("ImageName", "testpic");
	imgupload.put("ImageFile", file);

	//保存
	LCDataManager.saveInBackground(imgupload, new SaveCallback() {
		@Override
		public void done(LCException e) {
		}
	});
	```

###上传进度
LCFile的 saveInBackground() 方法除了可以传入一个 SaveCallback 回调来通知上传成功或者失败之外，还可以传入第二个参数 ProgressCallback 回调对象，通知上传进度：

```java
LCFileManager.saveInBackground(file, new SaveCallback() {
	@Override
	public void done(LCException e) {
			
        }
	},new ProgressCallback() {
	@Override
	public void done(int i) {
			// 打印进度
          System.out.println("uploading: " + i);
        }
});
```

###下载文件

#####直接下载文件
1. 通过LCObject，指定LCFile
2. 调用 LCFileManager.getDataInBackground() 下载：

```java
LCFile myFile=imgupload.getLCFile("testpic");
LCFileManager.getDataInBackground(myFile, new GetDataCallback() {
	@Override
	public void done(byte[] bytes, LCException e) {

        }
});
```

#####获取文件的 url 自行处理下载：

```java
String url = myFile.getUrl();
```

###删除文件
到目前为止，文件的删除权限暂不开放。


## 查询
=======
```

We do not recommend storing large pieces of binary data like images or documents using byte[] fields on LCObject. LCObjectss should not exceed 128 kilobytes in size. To store more, we recommend you use LCFile. See the guide section for more details.

For more information about how LC handles data, check out our documentation on Data & Security.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

###基本查询

使用LCQuery查询LCObject分三步：

<<<<<<< HEAD
1. 创建一个 LCQuery 对象，并指定对应的"LCObject class"；
2. 为LCQuery添加不同的条件；
3. 执行LCQuery：使用 `LCQueryManager.findAllInBackground()` 方法结合FindCallback 回调类来查询与条件匹配的 LCObject 数据。

例如，查询指定人员的信息，使用 whereEqualTo 方法来添加条件值：
=======
In many cases, getInBackground isn't powerful enough to specify which objects you want to retrieve. The LCQuery offers different ways to retrieve a list of objects rather than just a single object.

The general pattern is to create a LCQuery, put conditions on it, and then retrieve a List of matching LCObjects using the findInBackground method with a FindCallback. For example, to retrieve scores with a particular playerName, use the whereEqualTo method to constrain the value for a key:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Dan Stemkoski");
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
    public void done(List<LCObject> scoreList, LCException e) {
        if (e == null) {
            Log.d("score", "Retrieved " + scoreList.size() + " scores");
        } else {
            Log.d("score", "Error: " + e.getMessage());
        }
    }
});
```

###查询条件

<<<<<<< HEAD
#####设置过滤条件
如果要过滤掉特定键的值时可以使用 whereNotEqualTo 方法。比如需要查询 isRead 不等于true的数据时可以这样写：
=======
### Query Constraints

There are several ways to put constraints on the objects found by a LCQuery. You can filter out objects with a particular key-value pair with whereNotEqualTo:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
query.whereNotEqualTo("isRead", true);
```

当然，您可以在您的查询操作中添加多个约束条件（这些条件是 "与" 的关系），来查询符合您要求的数据。

```java
query.whereNotEqualTo("isRead", true);
query.whereGreaterThan("userAge", 18);
```

#####设置结果数量
您可以使用 setLimit 方法来限制查询结果的数据条数。默认情况下 Limit 的值为 100，最大 1000，在 0 到 1000 范围之外的都强制转成默认的 100。

```java
query.setLimit(10); // 设置query结果不超过10条
```

您也可以使用LCQueryManager.getFirstInBackground()来执行Query，以获取查询的第一条结果。

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.whereEqualTo("playerEmail", "dstemkoski@example.com");
LCQueryManager.getFirstInBackground(query, new GetCallback<LCObject>() {
  public void done(LCObject object, LCException e) {
    if (object == null) {
      Log.d("score", "The getFirst request failed.");
    } else {
      Log.d("score", "Retrieved the object.");
    }
  }
});
```

#####对结果排序
对于类型为数字或字符串的属性，您可以使用升序或降序的方式来控制查询数据的结果顺序：

```java
// Sorts the results in ascending order by the score field
query.orderByAscending("score");
 
// Sorts the results in descending order by the score field
query.orderByDescending("score");
```

#####设置数值大小约束
对于类型为数字的属性，您可以对其值的大小进行筛选：

```java
// Restricts to wins < 50
query.whereLessThan("wins", 50);
 
// Restricts to wins <= 50
query.whereLessThanOrEqualTo("wins", 50);
 
// Restricts to wins > 50
query.whereGreaterThan("wins", 50);
 
// Restricts to wins >= 50
query.whereGreaterThanOrEqualTo("wins", 50);
```

#####设置返回数据包含的属性

您可以通过selectKeys设置返回的数据包含哪些属性(自动包含内建属性，如objectId, createdAt 及 updatedAt)：

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.selectKeys(Arrays.asList("playerName", "score"));
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {

    @Override
    public void done(List<LCObject> objects, LCException exception) {
         // results has the list of objects
    }
});
```

随后对于返回的LCObject，您可以可通过LCDataManager.fetchInBackground()获取该数据其他属性。

```java
LCObject object = results.get(0);
LCDataManager.fetchInBackground(object, new GetCallback<LCObject>() {

    @Override
    public void done(LCObject object, LCException exception) {
        // all fields of the object will now be available here.
    }
});
```

#####设置更多约束
在数据较多的情况下，分页显示数据是比较合理的解决办法，setSkip 方法可以做到跳过首次查询的多少条数据来实现分页的功能。

```java
query.setSkip(10); // skip the first 10 results
```

如果您想查询匹配几个不同值的数据，如：要查询 "Jonathan Walsh", "Dario Wunsch", "Shawn Simon" 三个账号的信息时，您可以使用whereContainedIn（类似SQL中的in查询）方法来实现。

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereContainedIn("playerName", Arrays.asList(names));
```

相反，您想查询"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"这三个账号**以外**的其他人的信息（类似 SQL 中的 not in 查询），您可以使用 whereNotContainedIn 方法来实现。

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereNotContainedIn("playerName", Arrays.asList(names));
```

您可以通过whereExists查询存在指定属性的数据。相应的，您可以通过whereDoesNotExist，查询不存在指定属性的数据。

```java
// 查询具有"score"属性的object
query.whereExists("score");
 
// Finds objects that don't have the score set
query.whereDoesNotExist("score");
```

您可以使用whereMatchesKeyInQuery方法查询一个query中的某属性的值与另一个query中某属性的值相同的数据。 

如：现有一个名为"Team"的class存储篮球队的数据，有一个名为"User"的class存储用户数据。Team中使用"city"存储篮球队所在地，User中使用"hometown"存储其家乡。则您可以通过以下Query，查找家乡与**特定**篮球队所在地相同的用户。

```java
LCQuery<LCObject> teamQuery = LCQuery.getQuery("Team");
<<<<<<< HEAD
//筛选篮球队：选择胜率超过50%的篮球队
=======
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
teamQuery.whereGreaterThan("winPct", 0.5);
LCQuery<LCUser> userQuery = LCUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(userQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
<<<<<<< HEAD
    // results中包含胜率超过50%的篮球队所在地的用户
=======
    // results has the list of users with a hometown team with a winning record
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
  }
});
```

相应的，您可以通过whereDoesNotMatchKeyInQuery方法，获取家乡**不在**指定篮球队所在地的用户。

```java
<<<<<<< HEAD
LCQuery<LCUser> anotherUserQuery = LCUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
    // results中包含家乡不在指定篮球队所在地的用户 
=======
LCQuery<LCUser> losingUserQuery = LCUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(losingUserQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
    // results has the list of users with a hometown team with a losing record
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
  }
});
```

<<<<<<< HEAD
###不同属性值类型的查询
=======
You can restrict the fields returned by calling selectKeys with a collection of keys. To retrieve documents that contain only the score and playerName fields (and also special built-in fields such as objectId, createdAt, and updatedAt):

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.selectKeys(Arrays.asList("playerName", "score"));
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {

    @Override
    public void done(List<LCObject> objects, LCException exception) {
         // results has the list of objects
    }
});
```

The remaining fields can be fetched later by calling one of the fetchIfNeeded variants on the returned objects:

```java
LCObject object = results.get(0);
LCDataManager.fetchInBackground(object, new GetCallback<LCObject>() {

    @Override
    public void done(LCObject object, LCException exception) {
        // all fields of the object will now be available here.
    }
});
```
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

####值类型为数组的查询

如果一个 Key 对应的值是一个数组，您可以查询 Key 的数组包含了数字 208 的所有对象，通过：

```java
// Find objects where the array in arrayKey contains the number 2.
query.whereEqualTo("arrayKey", 2);
```

同样，您可以查询出 Key 的数组同时包含了 2，3 和 4 的所有对象：

```java
// Find objects where the array in arrayKey contains all of the numbers 2, 3, and 4.
ArrayList<Integer> numbers = new ArrayList<Integer>();
numbers.add(2);
numbers.add(3);
numbers.add(4);
query.whereContainsAll("arrayKey", numbers);
```

####值类型为字符串的查询
使用 whereStartsWith 方法来限制字符串的值以另一个字符串开头。非常类似 MySQL 的 LIKE 查询，这样的查询会走索引，因此对于大数据集也一样高效：

```java
// Finds barbecue sauces that start with "Big Daddy's".
LCQuery<LCObject> query = LCQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

####值类型为LCObject查询

#####LCObject类型字段匹配LCObject

<<<<<<< HEAD
如果您想获取某个字段匹配特定 LCObject 的数据，您可以像查询其他数据类型那样使用 whereEqualTo 来查询。例如，如果每个 Comment 对象都包含一个 Post 对象（在 post 字段上），您可以获取特定 Post 的所有 Comment 列表：

```java
// 假设 LCObject myPost 已经在前面创建
=======
There are several ways to issue queries for relational data. If you want to retrieve objects where a field matches a particular LCObject, you can use whereEqualTo just like for other data types. For example, if each Comment has a Post object in its post field, you can fetch comments for a particular Post:

```java
//Assume LCObject myPost was previously created.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
public void done(List<LCObject> commentList, LCException e) {
 // commentList now has the comments for myPost
}
});
```
<<<<<<< HEAD
#####LCObject类型字段匹配Query
如果您想查询的对象的某个字段包含了一个 LCObject，并且这个 LCObject 匹配一个不同的查询，您可以使用 whereMatchesQuery 嵌套查询方法。请注意，默认的 limit 限制 100 也同样作用在内部查询上。因此如果是大规模的数据查询，您可能需要仔细构造您的查询对象来获取想要的行为。例如，为了查询有图片附件的 Post 的评论列表：
=======

If you want to retrieve objects where a field contains a LCObject that matches a different query, you can use whereMatchesQuery. Note that the default limit of 100 and maximum limit of 1000 apply to the inner query as well, so with large data sets you may need to construct queries carefully to get the desired behavior. In order to find comments for posts containing images, you can do:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> innerQuery = LCQuery.getQuery("Post");
innerQuery.whereExists("image");
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereMatchesQuery("post", innerQuery);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
  public void done(List<LCObject> commentList, LCException e) {
    // comments now contains the comments for posts with images.
  }
});
```

<<<<<<< HEAD
反之，不想匹配某个子查询，您可以使用 whereDoesNotMatchQuery 方法。 比如为了查询没有图片的 Post 的评论列表：
=======
If you want to retrieve objects where a field contains a LCObject that does not match a different query, you can use whereDoesNotMatchQuery. In order to find comments for posts without images, you can do:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> innerQuery = LCQuery.getQuery("Post");
innerQuery.whereExists("image");
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereDoesNotMatchQuery("post", innerQuery);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
  public void done(List<LCObject> commentList, LCException e) {
    // comments now contains the comments for posts without images.
  }
});
```
<<<<<<< HEAD
#####返回指定LCObject类型的字段
默认情况下，当您获取一个对象的时候，关联的 LCObject 不会被获取，但您可以使用 include 方法将其返回。例如。您想获取最近的 10 条评论，同时包括它们关联的 post：
=======

In some situations, you want to return multiple types of related objects in one query. You can do this with the include method. For example, let's say you are retrieving the LCt ten comments, and you want to retrieve their related posts at the same time:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> query = LCQuery.getQuery("Comment");

//Retrieve the most recent ones
query.orderByDescending("createdAt");

//Only retrieve the LCt ten
query.setLimit(10);

//Include the post data with each comment
query.include("post");

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
public void done(List<LCObject> commentList, LCException e) {
 // commentList now contains the LCt ten comments, and the "post"
 // field has been populated. For example:
 for (LCObject comment : commentList) {
   // This does not require a network access.
   LCObject post = comment.getLCObject("post");
   Log.d("post", "retrieved a related post");
 }
}
});
```

您可以使用 dot（英语句号）操作符来多层 include 内嵌的对象。比如，您同时想 include 一个 Comment 的 post 里的 author（作者）对象（假设 author 对应的值是 LCUser 实例），您可以这样做：

```java
query.include("post.author");
```
###个数查询

<<<<<<< HEAD
如果您只是想统计有多少个对象满足查询，您并不需要获取所有匹配的对象，可以直接使用 count 替代 find。例如，查询一个账户发了多少微博：
=======
You can issue a query with multiple fields included by calling include multiple times. This functionality also works with LCQuery helpers like getFirst() and getInBackground().
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Sean Plott");
LCQueryManager.countInBackground(query, new CountCallback() {
  public void done(int count, LCException e) {
    if (e == null) {
      // The count request succeeded. Log the count
      Log.d("score", "Sean has played " + count + " games");
    } else {
      // The request failed
    }
  }
});
```

###复合查询

您可以通过LCQuery.or方法查询匹配多个Query中一个的数据。如，您可以通过以下方式，获取胜场超过90场或低于10场的玩家名单：

```java
<<<<<<< HEAD
LCQuery<LCObject> lotsOfWins = LCQuery.getQuery("Player");
lotsOfWins.whereGreaterThan("score", 90);
 
LCQuery<LCObject> fewWins = LCQuery.getQuery("Player");
fewWins.whereLessThan("score", 10);
 
List<LCQuery<LCObject>> queries = new ArrayList<LCQuery<LCObject>>();
queries.add(lotsOfWins);
queries.add(fewWins);
 
LCQuery<LCObject> mainQuery = LCQuery.or(queries);
LCQueryManager.findAllInBackground(mainQuery, new FindCallback<LCObject>() {
  public void done(List<LCObject> results, LCException e) {
    // results包含胜场超过90场或低于10场的玩家。
  }
});
```

###缓存查询
经常需要缓存一些查询的结果到磁盘上，这可以让您在离线的时候，或者应用刚启动，网络请求还没有足够时间完成的时候可以展现一些数据给用户。Leap Cloud 会自动清空缓存，当缓存占用了太多空间的时候。

默认情况下的查询不会使用缓存，除非您使用 setCachePolicy 方法明确设置启用。例如，尝试从网络请求，如果网络不可用则从缓存数据中获取，可以这样设置：

```java
=======
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
query.setCachePolicy(LCQuery.CachePolicy.NETWORK_ELSE_CACHE);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
  public void done(List<LCObject> scoreList, LCException e) {
    if (e == null) {
      // Results were successfully found, looking first on the
      // network and then on disk.
    } else {
      // The network was inaccessible and we have no cached data
      // for this query.
    }
  }
});
```
LeapCloud 提供了几种不同的缓存策略：

<<<<<<< HEAD
缓存策略|介绍
---|---
IGNORE_CACHE | 默认的缓存策略，查询不走缓存，查询结果也不存储在缓存。
CACHE_ONLY | 查询只从缓存获取，不走网络。如果缓存中没有结果，引发一个 LCException。
NETWORK_ONLY | 查询不走缓存，从网路中获取，但是查询结果会写入缓存。
CACHE\_ELSE_NETWORK | 查询首先尝试从缓存中获取，如果失败，则从网络获取，如果两者都失败，则引发一个 LCException。
NETWORK\_ELSE_CACHE | 查询首先尝试从网络获取，如果失败，则从缓存中查找；如果两者都失败，则应发一个 LCException。
CACHE\_THEN_NETWORK | 查询首先尝试从缓存中获取，然后再从网络获取。在这种情况下，FindCallback 会被实际调用两次 -- 首先是缓存的结果，其次是网络查询的结果。这个缓存策略只能用在异步的 findInBackground() 方法中。
=======
LC provides several different cache policies:

IGNORE_CACHE 
The query does not load from the cache or save results to the cache. IGNORE_CACHE is the default cache policy.
CACHE_ONLY 
The query only loads from the cache, ignoring the network. If there are no cached results, that causes a LCException.
NETWORK_ONLY 
The query does not load from the cache, but it will save results to the cache.
CACHE_ELSE_NETWORK 
The query first tries to load from the cache, but if that fails, it loads results from the network. If neither cache nor network succeed, there is a LCException.
NETWORK_ELSE_CACHE 
The query first tries to load from the network, but if that fails, it loads results from the cache. If neither network nor cache succeed, there is a LCException.
CACHE_THEN_NETWORK 
The query first loads from the cache, then loads from the network. In this case, the FindCallback will actually be called twice - first with the cached results, then with the network results. This cache policy can only be used asynchronously with findInBackground.
If you need to control the cache's behavior, you can use methods provided in LCQuery to interact with the cache. You can do the following operations on the cache:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

如果您想控制缓存的行为。您可以使用 LCQuery 提供的方法来操作缓存。您可以在缓存上做如下这些操作：

#####检查查询是否有缓存结果：
```java
boolean isInCache = query.hasCachedResult();
```

#####删除查询的任何缓存结果：

```java
query.clearCachedResult();
```

#####清空所有查询的缓存结果：

```java
LCQuery.clearAllCachedResults();
```

#####控制缓存结果的最大存活时间（毫秒为单位）：

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));
```

<<<<<<< HEAD
##LCObject子类
=======
Query caching also works with LCQuery helpers including getFirstInBackground() and getInBackground().
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

LeapCloud 希望设计成能让人尽快上手并使用。您可以通过 LCDataManager.fetchInBackground() 方法访问所有的数据。但是在很多现有成熟的代码中，子类化能带来更多优点，诸如简洁、可扩展性以及 IDE 提供的代码自动完成的支持等等。子类化不是必须的，您可以将下列代码转化：

```java
<<<<<<< HEAD
=======
LCQuery<LCObject> query = LCQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Sean Plott");
LCQueryManager.countInBackground(query, new CountCallback() {
  public void done(int count, LCException e) {
    if (e == null) {
      // The count request succeeded. Log the count
      Log.d("score", "Sean has played " + count + " games");
    } else {
      // The request failed
    }
  }
});
```

If you want to block the calling thread, you can also use the synchronous query.count() method.

For classes with over 1000 objects, count operations are limited by timeouts. They may routinely yield timeout errors or return results that are only approximately correct. Thus, it is preferable to architect your application to avoid this sort of count operation.

### Compound Queries

If you want to find objects that match one of several queries, you can use LCQuery.or method to construct a query that is an or of the queries passed in. For instance if you want to find players who either have a lot of wins or a few wins, you can do:

```java
LCQuery<LCObject> lotsOfWins = LCQuery.getQuery("Player");
lotsOfWins.whereGreaterThan("score", 150);
 
LCQuery<LCObject> fewWins = LCQuery.getQuery("Player");
fewWins.whereLessThan("score", 5);
 
List<LCQuery<LCObject>> queries = new ArrayList<LCQuery<LCObject>>();
queries.add(lotsOfWins);
queries.add(fewWins);
 
LCQuery<LCObject> mainQuery = LCQuery.or(queries);
LCQueryManager.findAllInBackground(mainQuery, new FindCallback<LCObject>() {
  public void done(List<LCObject> results, LCException e) {
    // results has the list of players that win a lot or haven't won much.
  }
});
```

You can add additional constraints to the newly created LCQuery that act as an 'and' operator.

Note that we do not, however, support non-filtering constraints (e.g. setLimit, skip, orderBy..., include) in the subqueries of the compound query.

## Subclasses

LC is designed to get you up and running as quickly as possible. You can access all of your data using the LCObject class and access any field with get(). In mature codebases, subclasses have many advantages, including terseness, extensibility, and support for autocomplete. Subclassing is completely optional, but can transform this code:

```java
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
LCObject shield = new LCObject("Armor");
shield.put("displayName", "Wooden Shield");
shield.put("fireproof", false);
shield.put("rupees", 50);
```

成这样：

```java
Armor shield = new Armor();
shield.setDisplayName("Wooden Shield");
shield.setFireproof(false);
shield.setRupees(50);
```

<<<<<<< HEAD
###创建LCObject子类

创建一个 LCObject 的子类很简单：

1.   首先声明一个子类继承自 LCObject。
2.   添加@LCclassName注解。它的值必须是一个字符串，也就是您过去传入 LCObject 构造函数的类名。这样以来，后续就不需要再在代码中出现这个字符串类名。
3.   确保您的子类有一个 public 的默认（参数个数为 0）的构造函数。切记不要在构造函数里修改任何 LCObject 的字段。
4.   在调用 LCConfig.initialize() 注册应用之前，注册子类 LCObject.registerSubclass(Yourclass.class).

下列代码成功实现并注册了 LCObject 的子类 Armor:
=======
Subclassing LCObject

To create a LCObject subclass:

Declare a subclass which extends LCObject.
Add a @LCclassName annotation. Its value should be the string you would pass into the LCObject constructor, and makes all future class name references unnecessary.
Ensure that your subclass has a public default (i.e. zero-argument) constructor. You must not modify any LCObject fields in this constructor.
Call LCObject.registerSubclass(Yourclass.class) in your Application constructor before calling LC.initialize().
The following code sucessfully implements and registers the Armor subclass of LCObject:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
// Armor.java
import com.LC.LCObject;
import com.LC.LCclassName;

@LCclassName("Armor")
public class Armor extends LCObject {
}

// App.java
import com.LC.LCConfig;
import android.app.Application;

public class App extends Application {
  @Override
  public void onCreate() {
    super.onCreate();

    LCObject.registerSubclass(Armor.class);
    LCConfig.initialize(this, LC_APPLICATION_ID, LC_CLIENT_KEY);
  }
}
```
 
####字段的访问/修改

添加方法到 LCObject 的子类有助于封装类的逻辑。您可以将所有跟子类有关的逻辑放到一个地方，而不是分成多个类来分别处理商业逻辑和存储/转换逻辑。

<<<<<<< HEAD
您可以很容易地添加访问器和修改器到您的 LCObject 子类。像平常那样声明字段的 getter 和 setter 方法，但是通过 LCObject 的 get 和 put 方法来实现它们。下面是这个例子为 Post 类创建了一个 content 的字段：
=======

### Accessors, Mutators, and Methods

Adding methods to your LCObject subclass helps encapsulate logic about the class. You can keep all your logic about a subject in one place rather than using separate classes for business logic and storage/transmission logic.

You can add accessors and mutators for the fields of your LCObject easily. Declare the getter and setter for the field as you normally would, but implement them in terms of get() and put(). The following example creates a displayName field in the Armor class:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
// Armor.java
@LCclassName("Armor")
public class Armor extends LCObject {
  public String getDisplayName() {
    return getString("displayName");
  }
  public void setDisplayName(String value) {
    put("displayName", value);
  }
}
```

现在您就可以使用 armor.getDisplayName()方法来访问 displayName 字段，并通过 armor.setDisplayName() 来修改它。这样就允许您的 IDE 提供代码自动完成功能，并且可以在编译时发现到类型错误。

<<<<<<< HEAD
各种数据类型的访问器和修改器都可以这样被定义，使用各种 get()方法的变种，例如 getInt()，getLCFile()或getMap().
=======
Accessors and mutators of various types can be easily defined in this manner using the various forms of get() such as getInt(), getLCFile(), or getMap().
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

####定义函数

如果您不仅需要一个简单的访问器，而是有更复杂的逻辑，您可以实现自己的方法，例如：

```java
public void takeDamage(int amount) {
  // Decrease the armor's durability and determine whether it has broken
  increment("durability", -amount);
  if (getDurability() < 0) {
    setBroken(true);
  }
}
```

<<<<<<< HEAD
###创建子类的实例
您可以使用您自定义的构造函数来创建您的子类对象。您的子类必须定义一个公开的默认构造函数，并且不修改任何父类 LCObject 中的字段，这个默认构造函数将会被 SDK 使用来创建子类的强类型的对象。

要创建一个到现有对象的引用，可以使用 LCObject.createWithoutData():
=======
### Initializing Subclasses

You should create new instances of your subclasses using the constructors you have defined. Your subclass must define a public default constructor that does not modify fields of the LCObject, which will be used throughout the LC SDK to create strongly-typed instances of your subclass.

To create a reference to an existing object, use LCObject.createWithoutData():
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
Armor armorReference = LCObject.createWithoutData(Armor.class, armor.getObjectId());
```

<<<<<<< HEAD
###子类的查询
您可以通过静态方法静态方法LCQuery.getQuery()获取特定的子类的查询对象。下面的例子用以查询用户可购买的所有防具：
=======
### Queries

You can get a query for objects of a particular subclass using the static method LCQuery.getQuery(). The following example queries for armors that the user can afford:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCQuery<Armor> query = LCQuery.getQuery(Armor.class);
query.whereLessThanOrEqualTo("rupees", LCUser.getCurrentUser().get("rupees"));
LCQueryManager.findAllInBackground(query, new FindCallback<Armor>() {
  @Override
  public void done(List<Armor> results, LCException e) {
    for (Armor a : results) {
      // ...
    }
  }LCUser
});
```

##用户

LCUser 是一个 LCObject 的子类，它继承了 LCObject 所有的方法，具有 LCObject 相同的功能。不同的是，LCUser 增加了一些特定的关于用户账户相关的功能。

<<<<<<< HEAD
###字段说明
LCUser 除了从 LCObject 继承的属性外，还有几个特定的属性：
=======
At the core of many apps, there is a notion of user accounts that lets users access their information in a secure manner. We provide a specialized user class called LCUser that automatically handles much of the functionality required for user account management.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

属性名|类型|介绍|是否必需或唯一
---|---|---|---
    username|String|用户的用户名|必需
    password|String| 用户的密码|必需
    email|String| 用户的电子邮件地址|可选
    emailVerified|Boolean|电子邮件是否验证|可选
    masterKey| String | 用户注册应用的MasterKey|可选
    installationIds| String | 用户完成的所有安装的InstallationId|可选

<<<<<<< HEAD
注意：
=======
LCUser is a subclass of the LCObject, and has all the same features, such as flexible schema, automatic persistence, and a key value interface. All the methods that are on LCObject also exist in LCUser. The difference is that LCUser has some special additions specific to user accounts.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

* 请确保用户名和电子邮件地址是独一无二的。
* 和其他 LCObject 对象不同的是，在设置 LCUser 这些属性的时候不是使用的 put 方法，而是专门的 setXXX 方法。
* 系统会自动收集masterKey，installationIds的值。

<<<<<<< HEAD
###注册用户
=======
LCUser has several properties that set it apart from LCObject:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

1. 创建LCUser对象，并提供必需的username和password
2. 利用LCUserManager.signUpInBackground()保存至云端。

```java
<<<<<<< HEAD
String mUsername ＝ "userName";
String mPassword = "passWord";
LCUser user = new LCUser();
user.setUserName(mUsername);
user.setPassword(mPassword);

LCUserManager.signUpInBackground(user, new SignUpCallback() {
	public void done(LCException e) {
	        if (e == null) {
	        // 注册成功
	        } else {
	        }
	}
=======
LCUser user = new LCUser();
user.setUserName("my name");
user.setPassword("my pass");
user.setEmail("email@example.com");

// other fields can be set just like with LCObject
user.put("phone", "650-253-0000");

LCUserManager.signUpInBackground(user, new SignUpCallback() {
  public void done(LCException e) {
    if (e == null) {
      // Hooray! Let them use the app now.
    } else {
      // Sign up didn't succeed. Look at the LCException
      // to figure out what went wrong
    }
  }
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
});
```
注意：

<<<<<<< HEAD
* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 signUpInBackground() 方法，而不是 saveInBackground() 方法。另外还有各种不同的 signUp 方法。像往常一样，我们建议在可能的情况下尽量使用异步版本的 signUp 方法，这样就不会影响到应用程序主 UI 线程的响应。您可以阅读 API 中更多的有关这些具体方法的使用。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 Email 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 Email 地址，以后在用户忘记密码的情况下可以使用 LeapCloud 提供的重置密码功能。

###登录
您可以通过LCUserManager.logInInBackground()方法登录。字段说明：第一个参数为用户名，第二个参数为密码，第三个参数为回调方法LogInCallback().

```java
LCUserManager.logInInBackground("userName", "passWord", new LogInCallback<LCUser>() {
=======
This call will asynchronously create a new user in your LC App. Before it does this, it checks to make sure that both the username and email are unique. Also, it securely hashes the password in the cloud. We never store passwords in plaintext, nor will we ever transmit passwords back to the client in plaintext.

Note that we used the signUpInBackground method, not the saveInBackground method. New LCUsers should always be created using the signUpInBackground (or signUp) method. Subsequent updates to a user can be done by calling save.

The signUpInBackground method comes in various flavors, with the ability to pass back errors, and also synchronous versions. As usual, we highly recommend using the asynchronous versions when possible, so as not to block the UI in your app. You can read more about these specific methods in our API docs.

If a signup isn't successful, you should read the error object that is returned. The most likely case is that the username or email has already been taken by another user. You should clearly communicate this to your users, and ask them try a different username.

You are free to use an email address as the username. Simply ask your users to enter their email, but fill it in the username property — LCUser will work as normal. We'll go over how this is handled in the reset password section.

### Logging In

Of course, after you allow users to sign up, you need be able to let them log in to their account in the future. To do this, you can use the class method logInInBackground.

```java
LCUserManager.logInInBackground("Jerry", "showmethemoney", new LogInCallback<LCUser>() {
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
  public void done(LCUser user, LCException e) {
    if (user != null) {
      // 登录成功
    } else {
<<<<<<< HEAD
      // 登录失败
=======
      // Signup failed. Look at the LCException to see what happened.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
    }
  }
});
```

<<<<<<< HEAD
###当前用户
如果用户在每次打开您的应用程序时都要登录，这将会直接影响到您应用的用户体验。为了避免这种情况，您可以使用缓存的 currentUser 对象。

每当您注册成功或是第一次登录成功，都会在本地磁盘中有一个缓存的用户对象，您可以这样来获取这个缓存的用户对象来进行登录：
=======
### Verifying Emails

Enabling email verification in an application's settings allows the application to reserve part of its experience for users with confirmed email addresses. Email verification adds the emailVerified key to the LCUser object. When a LCUser's email is set or modified, emailVerified is set to false. LC then emails the user a link which will set emailVerified to true.

There are three emailVerified states to consider:

true - the user confirmed his or her email address by clicking on the link LC emailed them. LCUsers can never have a true value when the user account is first created.
false - at the time the LCUser object was LCt fetched, the user had not confirmed his or her email address. If emailVerified is false, consider calling fetch() on the LCUser.
missing - the LCUser was created when email verification was off or the LCUser does not have an email.

### Current User

It would be bothersome if the user had to log in every time they open your app. You can avoid this by using the cached currentUser object.

Whenever you use any signup or login methods, the user is cached on disk. You can treat this cache as a session, and automatically assume the user is logged in:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCUser currentUser = LCUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

<<<<<<< HEAD
当然，您也可以使用如下方法清除缓存用户对象：

```java
LCUser.logOut();
LCUser currentUser = LCUser.getCurrentUser(); //此时，crrentUser将为null
=======
You can clear the current user by logging them out:

```java
LCUser.logOut();
LCUser currentUser = LCUser.getCurrentUser(); // this will now be null
```

### Anonymous Users

Being able to associate data and objects with individual users is highly valuable, but sometimes you want to be able to do this without forcing a user to specify a username and password.

An anonymous user is a user that can be created without a username and password but still has all of the same capabilities as any other LCUser. After logging out, an anonymous user is abandoned, and its data is no longer accessible.

You can create an anonymous user using LCAnonymousUtils:

```java
LCAnonymousUtils.logIn(new LogInCallback<LCUser>() {
      @Override
      public void done(LCUser user, LCException e) {
        if (e != null) {
          Log.d("MyApp", "Anonymous login failed.");
    } else {
      Log.d("MyApp", "Anonymous user logged in.");
    }
  }
});
```

You can convert an anonymous user into a regular user by setting the username and password, then calling signUp(), or by logging in or linking with a service like Facebook or Twitter. The converted user will retain all of its data. To determine whether the current user is an anonymous user, you can check LCAnonymousUtils.isLinked():

```java
if (LCAnonymousUtils.isLinked(LCUser.getCurrentUser())) {
  enableSignUpButton();
} else {
  enableLogOutButton();
}
```

Anonymous users can also be automatically created for you without requiring a network request, so that you can begin working with your user immediately when your application starts. When you enable automatic anonymous user creation at application startup, LCUser.getCurrentUser() will never be null. The user will automatically be created in the cloud the first time the user or any object with a relation to the user is saved. Until that point, the user's object ID will be null. Enabling automatic user creation makes associating data with your users painless. For example, in your Application.onCreate() method, you might write:

```java
arseUser.enableAutomaticUser();
LCUser.getCurrentUser().increment("RunCount");
LCUserManager.saveInBackground(LCUser.getCurrentUser);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```

###重置密码

如果用户忘记密码，Leap Cloud提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```java
<<<<<<< HEAD
LCUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LCException e) {
        if (e == null) {
            // 重置密码的邮件已发出
=======
LCUserManager.becomeInBackground("session-token-here", new LogInCallback<LCUser>() {
    
    @Override
    public void done(LCUser user, LCException e) {
        if (user != null) {
            // The current user is now set to user.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
        } else {
        }
    }
});
```
如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

<<<<<<< HEAD
* 用户输入他们的电子邮件，请求重置自己的密码。
* Leap Cloud 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个LC的页面，输入一个新的密码。
* Leap Cloud 将用户的密码重置为新输入的密码。

###查询用户
=======
### Security For User Objects

The LCUser class is secured by default. Data stored in a LCUser can only be modified by that user. By default, the data can still be read by any client. Thus, some LCUser objects are authenticated and can be modified, whereas others are read-only.

Specifically, you are not able to invoke any of the save or delete type methods unless the LCUser was obtained using an authenticated method, like logIn or signUp. This ensures that only the user can alter their own data.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

您可以通过特殊的UserQuery查询用户数据。Leap Cloud对用户数据安全性提供充分的保障，如需获取更多信息，请移步至[用户对象的安全性](..)。

```java
<<<<<<< HEAD
LCQuery<LCUser> query = LCUser.getQuery();
query.whereEqualTo("gender", "female");
LCQueryManager.findAllInBackground(query, new FindCallback<LCUser>() {
  public void done(List<LCUser> objects, LCException e) {
    if (e == null) {
        // The query was successful.
    } else {
        // Something went wrong.
=======
LCUserManager.logInInBackground("my_username", "my_password", new LogInCallback<LCUser>() {
    
    @Override
    public void done(LCUser user, LCException exception) {
        user.setUserName("my_new_username"); // attempt to change username
        LCUserManager.saveInBackground(user); // This succeeds, since the user was authenticated on the device
         
        // Get the user from a non-authenticated manner
        LCQuery<LCUser> query = LCUser.getQuery();
        LCQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<LCUser>() {
          public void done(LCUser object, LCException e) {
            object.setUserName("another_username");
         
            // This will throw an exception, since the LCUser is not authenticated
            LCDataManager.saveInBackground(object);
          }
        });
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
    }
  }
});
```

<<<<<<< HEAD
###邮箱验证
=======
The LCUser obtained from getCurrentUser() will always be authenticated.

If you need to check if a LCUser is authenticated, you can invoke the isAuthenticated() method. You do not need to check isAuthenticated() with LCUser objects that are obtained via an authenticated method.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

Leap Cloud提供强大的邮箱验证服务，您只需在Console >> App Settings >> Email Settings中Enable "Verify user's email address", 系统便会自动在LCUser中添加`emailVerified`字段。并且，当LCUser的email字段被赋值或者修改, 且`emailVerified`字 字段的值为false. Leap Cloud便会自动向用户发送一个链接，用户点击链接后便会将`emailVerified`设置为true.

<<<<<<< HEAD
`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

###匿名用户
匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 Leap Cloud 提供的匿名用户系统来实现您的功能。

您可以通过LCAnonymousUtils获取一个匿名的用户账号：

```java
LCAnonymousUtils.logIn(new LogInCallback<LCUser>() {
      @Override
      public void done(LCUser user, LCException e) {
        if (e != null) {
          Log.d("MyApp", "Anonymous login failed.");
    } else {
      Log.d("MyApp", "Anonymous user logged in.");
    }
  }
});
```
#####自动创建匿名用户
您可以通过注册或者登录，将当前的匿名用户转化为非您民用户，该匿名用户的所有的数据都将保留。您可以通过LCAnonymousUtils.isLinked()来判断当前用户是否为匿名用户。

```java
Boolean isAnonymous = LCAnonymousUtils.isLinked(LCUser.getCurrentUser());
```

您可以选择让系统自动创建匿名用户（本地创建，无需网络连接）, 以便立即开始使用应用. 设置自动创建匿名用户后, LCUser.getCurrentUser()将永远不为null。 然而，当您在存储与该匿名用户相关的LCObject时，Leap Cloud会在云端创建该匿名用户。
=======
The same security model that applies to the LCUser can be applied to other objects. For any object, you can specify which users are allowed to read the object, and which users are allowed to modify an object. To support this type of security, each object has an access control list, implemented by the LCACL class.

The simplest way to use a LCACL is to specify that an object may only be read or written by a single user. To create such an object, there must first be a logged in LCUser. Then, new LCACL(user) generates a LCACL that limits access to that user. An object's ACL is updated when the object is saved, like any other property. Thus, to create a private note that can only be accessed by the current user:

```java
LCObject privateNote = new LCObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LCACL(LCUser.getCurrentUser()));
LCDataManager.saveInBackground(privateNote);
```

This note will then only be accessible to the current user, although it will be accessible to any device where that user is signed in. This functionality is useful for applications where you want to enable access to user data across multiple devices, like a personal todo list.

Permissions can also be granted on a per-user basis. You can add permissions individually to a LCACL using setReadAccess and setWriteAccess. For example, let's say you have a message that will be sent to a group of several users, where each of them have the rights to read and delete that message:

```java
LCObject groupMessage = new LCObject("Message");
LCACL groupACL = new LCACL();
     
// userList is an Iterable<LCUser> with the users we are sending this message to.
for (LCUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
LCDataManager.saveInBackground(groupMessage);
```

You can also grant permissions to all users at once using setPublicReadAccess and setPublicWriteAccess. This allows patterns like posting comments on a message board. For example, to create a post that can only be edited by its author, but can be read by anyone:

```java
LCObject publicPost = new LCObject("Post");
LCACL postACL = new LCACL(LCUser.getCurrentUser());
postACL.setPublicReadAccess(true);
publicPost.setACL(postACL);
LCDataManager.saveInBackground(publicPost);
```

To help ensure that your users' data is secure by default, you can set a default ACL to be applied to all newly-created LCObjects:

```java
LCACL.setDefaultACL(defaultACL, true);
```

In the code above, the second parameter to setDefaultACL tells LC to ensure that the default ACL assigned at the time of object creation allows read and write access to the current user at that time. Without this setting, you would need to reset the defaultACL every time a user logs in or out so that the current user would be granted access appropriately. With this setting, you can ignore changes to the current user until you explicitly need to grant different kinds of access.

Default ACLs make it easy to create apps that follow common access patterns. An application like Twitter, for example, where user content is generally visible to the world, might set a default ACL such as:

```java
LCACL defaultACL = new LCACL();
defaultACL.setPublicReadAccess(true);
LCACL.setDefaultACL(defaultACL, true);
```
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

#####如何自动创建匿名用户
在主Application的onCreate()方法中添加：

```java
<<<<<<< HEAD
LCUser.enableAutomaticUser();
```

### 在Console中管理用户

User 表是一个特殊的表，专门存储 LCUser 对象。在Console >> Users中，您会看到一个 _User 表。更多信息，请移步至[Console用户手册](...)中查看。

##用户角色
随着用户数量的增长，使用角色进行权限管理将更有效。所有赋予某一角色的权限，将被该角色包含的用户所继承。用户角色是一组用户的集合，同时，一个用户角色也可以包含另一个用户角色。在Leap Cloud中有一个对应的`_Role` class来存储用户角色。
=======
LCACL.setDefaultACL(new LCACL(), true);
```

An application that logs data to LC but doesn't provide any user access to that data would instead deny access to the current user while providing a restrictive ACL:

```java
LCACL.setDefaultACL(new LCACL(), false);
```

Operations that are forbidden, such as deleting an object that you do not have write access to, result in a LCException.OBJECT_NOT_FOUND error code. For security purposes, this prevents clients from distinguishing which object ids exist but are secured, versus which object ids do not exist at all.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

###字段说明

属性名|类型|介绍|是否必需或唯一
---|---|---|---
    ACL|ACL|用户角色对象的访问权限|**必需** (需要显式设置)
    roles|Relation|该LCRole包含的其他LCRole|可选
    name|String| 角色名|必需
    user|Relation|该角色包含的用户|可选

###创建角色
创建Role的时候，您需要提供两个参数：第一个为Role的名字(对应name字段)，第二个参数为ACL.

```java
<<<<<<< HEAD
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
```

###向角色中添加用户或角色
您可以通过role.getUsers().add()或role.getRoles().add()方法，向角色中添加用户或其他角色。

```java
LCRole role = new LCRole(roleName, roleACL);
for (LCUser user : usersToAddToRole) {
  role.getUsers().add(user)
}
for (LCRole childRole : rolesToAddToRole) {
  role.getRoles().add(childRole);
}
LCRoleManager.saveInBackground(role);
```

###获取角色对象

您有两种方式获取用户角色对象：

1. 通过角色名查找：

	```java
	LCObject wallPost = new LCObject("WallPost");
	LCACL postACL = new LCACL();
	//指定相应的Role的名字：
	postACL.setRoleWriteAccess("Moderators", true);
	wallPost.setACL(postACL);
	LCDataManager.saveInBackground(wallPost);
	```
2. 通过Query查找：

	```JAVA
	LCQuery<LCRole> query = LCRole.getQuery();
	query.whereEqualTo("name", "roleName");
	LCQueryManager.findAllInBackground(query, new FindCallback<LCRole>() {
		public void done(List<LCRole> roleList, LCException e) {
			if (e == null) {
			
			} else {
			
			}
		}
	});
	```
=======
LCUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LCException e) {
        if (e == null) {
            // An email was successfully sent with reset
            // instructions.
        } else {
            // Something went wrong. Look at the LCException
            // to see what's up.
        }
    }
});
```

This will attempt to match the given email with the user's email or username field, and will send them a password reset email. By doing this, you can opt to have users use their email as their username, or you can collect it separately and store it in the email field.

The flow for password reset is as follows:

User requests that their password be reset by typing in their email.
LC sends an email to their address, with a special password reset link.
User clicks on the reset link, and is directed to a special LC page that will allow them type in a new password.
User types in a new password. Their password has now been reset to a value they specify.
Note that the messaging in this flow will reference your app by the name that you specified when you created this app on LC.

### Querying

To query for users, you need to use the special user query:

```java
LCQuery<LCUser> query = LCUser.getQuery();
query.whereEqualTo("gender", "female");
LCQueryManager.findAllInBackground(query, new FindCallback<LCUser>() {
  public void done(List<LCUser> objects, LCException e) {
    if (e == null) {
        // The query was successful.
    } else {
        // Something went wrong.
    }
  }
});
```

In addition, you can use get to get a LCUser by id.

### Associations

Associations involving a LCUser work right of the box. For example, let's say you're making a blogging app. To store a new post for a user and retrieve all their posts:

```java
//Make a new post
LCObject post = new LCObject("Post");
post.put("title", "My New Post");
post.put("body", "This is some great content.");
post.put("user", user);
LCDataManager.saveInBackground(post);

//Find all posts by the current user
LCQuery<LCObject> query = LCQuery.getQuery("Post");
query.whereEqualTo("user", user);
LCQueryManager.findAllInBackground(query,  new FindCallback<LCObject>() {

    @Override
    public void done(List<LCObject> objects, LCException exception) {
        
    }
});
```
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

##数据安全

<<<<<<< HEAD
### LCObject的安全性
用户在创建LCObject时都存在一个ACL字段，只有在ACL名单上的用户(LCUser)或者角色(LCRole)才能被允许访问。如果用户不显式地设置ACL，系统将自动为其分配默认的ACL.
=======
The User class is a special class that is dedicated to storing LCUser objects. In the data browser, you'll see a little person icon next to the User class:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

#####ACL
ACL相当于为每一个数据创建的允许访问的白名单列表。一个 User 必须拥有读权限（或者属于一个拥有读权限的 Role）才可以获取一个对象的数据，同时，一个 User 需要写权限（或者属于一个拥有写权限的 Role）才可以更改或者删除一个对象。 如，一条典型的ACL数据：

<<<<<<< HEAD
```{"553892e860b21a48a50c1f29":{"read":true,"write":true}}```
=======
As your app grows in scope and user-base, you may find yourself needing more coarse-grained control over access to pieces of your data than user-linked ACLs can provide. To address this requirement, LC supports a form of Role-based Access Control. Roles provide a logical way of grouping users with common access privileges to your LC data. Roles are named objects that contain users and other roles. Any permission granted to a role is implicitly granted to its users as well as to the users of any roles that it contains.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

表明ObjectId为"553892e860b21a48a50c1f29"的用户，可以读取和修改该LCObject.

<<<<<<< HEAD
#####默认访问权限
=======
We provide a specialized class called LCRole that represents these role objects in your client code. LCRole is a subclass of LCObject, and has all of the same features, such as a flexible schema, automatic persistence, and a key value interface. All the methods that are on LCObject also exist on LCRole. The difference is that LCRole has some additions specific to management of roles.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

在没有显式指定的情况下，LeapCloud 中的每一个对象都会有一个默认的 ACL 值。这个值代表了，所有的用户，对这个对象都是可读可写的。此时您可以在数据管理的表中 ACL 属性中看到这样的值:

<<<<<<< HEAD
```{"*":{"read":true,"write":true}}```
=======
LCRole has several properties that set it apart from LCObject:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

您可以根据需要，修改默认ACL的值：

```java
LCACL defaultACL = new LCACL();
defaultACL.setPublicReadAccess(true);
defaultACL.setPublicWriteAccess(false);
LCACL.setDefaultACL(defaultACL, true);
```

<<<<<<< HEAD
`LCACL.setDefaultACL()`的第二个参数设置为true，代表默认将该用户的读取和访问权限添加到该defaultACL上。反之则否。

#####设置仅创建用户可见
您可以将一个LCObject设置为仅创建用户可读取或修改：首先，用户需要登录后创建LCObject，并且为其添加如下ACL属性：

```java
LCObject privateNote = new LCObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LCACL(LCUser.getCurrentUser()));
LCDataManager.saveInBackground(privateNote);
=======
The LCRole uses the same security scheme (ACLs) as all other objects on LC, except that it requires an ACL to be set explicitly. Generally, only users with greatly elevated privileges (e.g. a master user or Administrator) should be able to create or modify a Role, so you should define its ACLs accordingly. Remember, if you give write-access to a LCRole to a user, that user can add other users to the role, or even delete the role altogether.

To create a new LCRole, you would write:

```java
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```
此时，该LCObject - "privateNote"仅该用户可见。且该用户在任何设备上登录，都可以读取或修改该对象。

#####为其他用户设置访问权限
您可以使用setReadAccess 和 setWriteAccess将**指定用户**的读写权限添加到LCObject的ACL中。

<<<<<<< HEAD
如，为一组用户添加读取和修改的权限：

```java
LCObject groupMessage = new LCObject("Message");
LCACL groupACL = new LCACL();
     
// userList 为 Iterable<LCUser>，包含一组LCUser对象.
for (LCUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
LCDataManager.saveInBackground(groupMessage);
=======
You can add users and roles that should inherit your new role's permissions through the "users" and "roles" relations on LCRole:

```java
LCRole role = new LCRole(roleName, roleACL);
for (LCUser user : usersToAddToRole) {
  role.getUsers().add(user)
}
for (LCRole childRole : rolesToAddToRole) {
  role.getRoles().add(childRole);
}
LCRoleManager.saveInBackground(role);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```

#####为角色设置访问权限
您可以使用setRoleWriteAccess 和 setRoleWriteAccess将**指定角色**的读写权限添加到LCObject的ACL中。

<<<<<<< HEAD
如，为一组用户添加读取和修改的权限：
=======
Now that you have created a set of roles for use in your application, you can use them with ACLs to define the privileges that their users will receive. Each LCObject can specify a LCACL, which provides an access control list that indicates which users and roles should be granted read or write access to the object.

Giving a role read or write permission to an object is straightforward. You can either use the LCRole:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCRole moderators = /* Query for some LCRole */;
LCObject wallPost = new LCObject("WallPost");
LCACL postACL = new LCACL();
postACL.setRoleWriteAccess(moderators);
wallPost.setACL(postACL);
LCDataManager.saveInBackground(wallPost);
```

#####同时为用户和角色设置访问权限
LCObject的ACL是可以叠加的。如，在给某一个LCObjcet设置ACL时，您可以为所有用户添加读取权限的同时，为某一个角色添加修改权限：

```java
<<<<<<< HEAD
LCObject myMessage = new LCObject("Message");
LCACL myACL = new LCACL();
// 为所有用户添加读取权限
myACL.setPublicReadAccess(true);
// 为Moderators 角色添加修改权限
myACL.setRoleWriteAccess("Moderators");
myMessage.setACL(myACL);
```	
=======
LCObject wallPost = new LCObject("WallPost");
LCACL postACL = new LCACL();
postACL.setRoleWriteAccess("Moderators", true);
wallPost.setACL(postACL);
LCDataManager.saveInBackground(wallPost);
```

Role-based LCACLs can also be used when specifying default ACLs for your application, making it easy to protect your users' data while granting access to users with additional privileges. For example, a moderated forum application might specify a default ACL like this:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

#####为所有用户设置访问权限
您可以使用setPublicReadAccess 和 setPublicWriteAccess将**所有用户**的读写权限添加到LCObject的ACL中
```java
<<<<<<< HEAD
LCObject publicPost = new LCObject("Post");
LCACL postACL = new LCACL();
postACL.setPublicReadAccess(true);
postACL.setPublicWriteAccess(false);
publicPost.setACL(postACL);
LCDataManager.saveInBackground(publicPost);
=======
LCACL defaultACL = new LCACL();
// Everybody can read objects created by this user
defaultACL.setPublicReadAccess(true);
// Moderators can also modify these objects
defaultACL.setRoleWriteAccess("Moderators");
// And the user can read and modify its own objects
LCACL.setDefaultACL(defaultACL, true);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```

### 用户对象的安全性

Leap Cloud对用户对象的安全性进行了规范。默认情况下，存储在用户对象中的数据，只能被该用户本身修改。客户端可以读取其他用户的数据，但无权限修改或删除。所以，只有用户登录后所获取的用户对象，才能被修改。

以下例子很好的描绘了用户对象的安全性:

```java
<<<<<<< HEAD
LCUserManager.logInInBackground("my_username", "my_password", new LogInCallback<LCUser>() {
    
    @Override
    public void done(LCUser user, LCException exception) {
        user.setUserName("my_new_username"); // 修改用户名
        LCUserManager.saveInBackground(user); // 能成功保存，因为成功登录并获取该用户对象。
         
        // 非登录方式，获取的用户对象，将无法被修改
        LCQuery<LCUser> query = LCUser.getQuery();
        LCQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<LCUser>() {
          public void done(LCUser object, LCException e) {
            object.setUserName("another_username");
         
            // 将抛出异常：用户未被授权
            LCDataManager.saveInBackground(object);
          }
        });
    }
});
=======
LCRole administrators = /* Your "Administrators" role */;
LCRole moderators = /* Your "Moderators" role */;
moderators.getRoles().add(administrators);
LCRoleManager.saveInBackground(moderators);
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```
### 角色对象的安全性

与其他LCObject一样，LCRole对象也使用ACL来控制其访问权限。不同的是，LCRole需要显示地设置ACL. 通常，只有系统管理人员，或其他高权限人员可以有权限创建或修改角色，所以在创建LCRole的同时，您需要设置其访问权限。

<<<<<<< HEAD
如:

```java
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
```
=======
LC provides an easy way to integrate Facebook with your application. The Facebook SDK can be used with our SDK, and is integrated with the LCUser class to make linking your users to their Facebook identities easy.

Using our Facebook integration, you can associate an authenticated Facebook user with a LCUser. With just a few lines of code, you'll be able to provide a "log in with Facebook" option in your app, and be able to save their data to LC.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

##第三方登录

<<<<<<< HEAD
为简化用户的注册及登录流程，并且集成LC应用与Facebook, Twitter等应用，Leap Cloud提供了第三方登录应用的服务。您可以同时使用第三方应用SDK与LC SDK，并将LCUser与第三方应用的用户ID进行连接。

###使用Facebook账号登录
Facebook的Android SDK，帮助应用优化登录体验。对于已经安装Facebook应用的设备，LC应用可通过设备上的Facebook用户凭据，直接实现用户登录。对于未安装Facebook应用的设备，用户可以通过一个标准化的Facebook登录页面，提供相应的登录信息。

使用Facebook账号登录后，如果该Facebook用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Facebook开发者中心](https://developers.facebook.com)创建Facebook应用。点击My Apps >> Add a New App
2. 打开Leap Cloud Console >> App Settings >> User Authentication.勾选Allow Facebook Authentication. 并将步骤一中获取的Facebook Application ID 和 App Secret填写至相应位置。
3. 集成Facebook SDK，添加Facebook Login按钮。详细步骤，请参考[Add Facebook Login to Your App or Website](https://developers.facebook.com/docs/facebook-login/v2.4)
4. 在项目的Application.onCreate()函数中，于LCConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：
=======
To start using Facebook with LC, you need to:

Set up a Facebook app, if you haven't already.
Add your application's Facebook Application ID on your LC application's settings page.
Follow Facebook's instructions for getting started with the Facebook SDK to create an app linked to the Facebook SDK. Once you get to Step 6, stop after linking the Facebook SDK project and configuring the Facebook app ID. You can use our guide to attach your LC users to their Facebook accounts when logging in.
Add the following where you initialize the LC SDK in your Application.onCreate()
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCFacebookUtils.initialize("YOUR FACEBOOK APP ID");
```
5. 	在所有调用Login with Facebook的Activity中的onActivityResult()函数中添加如下代码，已完成验证。

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LCFacebookUtils.finishAuthentication(requestCode, resultCode, data);
}
```
<<<<<<< HEAD
####登录并注册新LCUser
使用Facebook账号登录后，如果该Facebook用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。如：
=======

If your Activity is already using onActivityResult(), you can avoid requestCode collisions by calling the versions of link() and logIn() that take an activityCode parameter and specifying a code you know to be unique. Otherwise, a sensible default activityCode will be used.

If you encounter any issues that are Facebook-related, a good resource is the official Facebook SDK for Android page.

LC is compatible with v3.0 of the Facebook SDK for Android.

There are two main ways to use Facebook with your LC users: (1) logging in as a Facebook user and creating a LCUser, or (2) linking Facebook to an existing LCUser.

### Login & Signup

LCFacebookUtils provides a way to allow your LCUsers to log in or sign up through Facebook. This is accomplished using the logIn() method:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCFacebookUtils.logInInBackground(this, new LogInCallback<LCUser>() {
  @Override
  public void done(LCUser user, LCException err) {
    if (user == null) {
      //用户取消了使用Facebook账号登录
    } else if (user.isNew()) {
      //用户第一次使用Facebook账号登录，成功注册并绑定user用户
    } else {
      //用户使用Facebook账号登录成功。
    }
  }
});
```

<<<<<<< HEAD
详细登录流程为：
=======
When this code is run, the following happens:

The user is shown the Facebook login dialog or a prompt generated by the Facebook app.
The user authenticates via Facebook, and your app receives a callback.
Our SDK receives the Facebook data and saves it to a LCUser. If it's a new user based on the Facebook ID, then that user is created.
Your LogInCallback is called with the user.
In order to display the Facebook login dialogs and activities, the current Activity must be provided (often, the current activity is this when calling logIn() from within the Activity) as we have done above.

You may optionally provide a collection of strings that specifies what read permissions your app requires from the Facebook user. You may specify these strings yourself, or use the constants we've provided for you in the LCFacebookUtils.Permissions class. For example:

```java
LCFacebookUtils.logInInBackground(Arrays.asList("email", Permissions.Friends.ABOUT_ME),
        this, new LogInCallback<LCUser>() {
  @Override
  public void done(LCUser user, LCException err) {
    // Code to handle login.
  }
});
```

LCUser integration doesn't require any permissions to work out of the box (ie. null or specifying no permissions is perfectly acceptable). When logging in, you can only use read permissions. See our documentation below about requesting additional permissions (read or publish). Read more about permissions on Facebook's developer guide.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

* 用户通过Facebook SDK提供的Login with Facebook界面登录Facebook
* Facebook验证登录信息，并返回结果.
* Leap Cloud SDK接受结果，并保存至LCUser. 如果该Facebook用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户.
* 调用LC的LogInCallback登录该LCUser.

<<<<<<< HEAD
####绑定LCUser与Facebook账号
您可以通过以下方式，绑定已有的LC账号和Facebook账号：
=======
### Linking

If you want to associate an existing LCUser to a Facebook account, you can link it like so:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
if (!LCFacebookUtils.isLinked(user)) {
    LCFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCFacebookUtils.isLinked(user)) {
<<<<<<< HEAD
            //绑定成功
=======
            Log.d("MyApp", "Woohoo, user logged in with Facebook!");
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
      }
    }
  });
}
```

<<<<<<< HEAD
绑定成功后，Leap Cloud将会把该Facebook账号的信息更新至该LCUser中。下次再使用该Facebook账号登录应用时，Leap Cloud将检测到其已绑定LCUser，便不会为该Facebook账号添加新的LCUser.
=======
The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing LCUser is updated with the Facebook information. Future logins via Facebook will now log the user into their existing account.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

####解除绑定

```java
LCFacebookUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(LCException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Facebook account.");
    }
  }
});
```
解除绑定成功后，Leap Cloud将会把该Facebook账号的信息从该LCUser中移除。下次再使用该Facebook账号登录应用时，Leap Cloud将检测到其未绑定LCUser，便会为该Facebook账号添加新的LCUser.

<<<<<<< HEAD
###使用Twitter账号登录
与Facebook类似，Twitter的Android SDK，也能帮助应用优化登录体验。对于已经安装Twitter应用的设备，LC应用可通过设备上的Twitter用户凭据，直接实现用户登录。对于未安装Twitter应用的设备，用户可以通过一个标准化的Twitter登录页面，提供相应的登录信息。

使用Twitter账号登录后，如果该Twitter用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Twitter开发者中心](...)创建Twitter应用。点击My Apps >> Add a New App
2. 打开Leap Cloud Console >> App Settings >> User Authentication.勾选Allow Twitter Authentication. 并将步骤一中获取的Twitter consumer Key填写至相应位置。
3. 集成Twitter SDK，添加Twitter Login按钮。详细步骤，请参考[Add Twitter Login to Your App or Website](...)
4. 在项目的Application.onCreate()函数中，于LCConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：

```java
LCTwitterUtils.initialize("YOUR Twitter CUSUMER KEY");
=======
### Requesting Permissions

As of v3.0 of the Facebook SDK, read and publish permissions must be requested separately. LCFacebookUtils.logIn() and LCFacebookUtils.link() only allow you to request read permissions. To request additional permissions, you may call LCFacebookUtils.getSession().requestNewReadPermissions() or LCFacebookUtils.getSession().requestNewPublishPermissions(). For more information about requesting new permissions, please see Facebook's API documentation for these functions.

After successfully retrieving new permissions, please call LCFacebookUtilities.saveLatestSessionData(), which will save any changes to the session token back to the LCUser and ensure that this session data follows the user wherever it logs in.

### Facebook SDK and LC

The Facebook Android SDK provides a number of helper classes for interacting with Facebook's API. Generally, you will use the Request class to interact with Facebook on behalf of your logged-in user. You can read more about the Facebook SDK here.

Our library manages the user's Session object for you. You can simply call LCFacebookUtils.getSession() to access the session instance, which can then be passed to Requests.

## Twitter Users

As with Facebook, LC also provides an easy way to integrate Twitter authentication into your application. The LC SDK provides a straightforward way to authorize and link a Twitter account to your LCUsers. With just a few lines of code, you'll be able to provide a "log in with Twitter" option in your app, and be able to save their data to LC.

Setup

To start using Twitter with LC, you need to:

Set up a Twitter app, if you haven't already.
Add your application's Twitter consumer key on your LC application's settings page.
When asked to specify a "Callback URL" for your Twitter app, please insert a valid URL. This value will not be used by your iOS or Android application, but is necessary in order to enable authentication through Twitter.
Add the following where you initialize the LC SDK in your Application.onCreate()

```java
LCTwitterUtils.initialize("YOUR CONSUMER KEY", "YOUR CONSUMER SECRET");
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
```
5. 	在所有调用Login with Twitter的Activity中的onActivityResult()函数中添加如下代码，已完成验证。

<<<<<<< HEAD
```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LCTwitterUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####登录并注册新LCUser
使用Twitter账号登录后，如果该Twitter用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。如：
=======
If you encounter any issues that are Twitter-related, a good resource is the official Twitter documentation.

There are two main ways to use Twitter with your LC users: (1) logging in as a Twitter user and creating a LCUser, or (2) linking Twitter to an existing LCUser.

### Login & Signup

LCTwitterUtils provides a way to allow your LCUsers to log in or sign up through Twitter. This is accomplished using the logIn() method:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCTwitterUtils.logInInBackground(this, new LogInCallback<LCUser>() {
  @Override
  public void done(LCUser user, LCException err) {
    if (user == null) {
      //用户取消了使用Twitter账号登录
    } else if (user.isNew()) {
      //用户第一次使用Twitter账号登录，成功注册并绑定user用户
    } else {
      //用户使用Twitter账号登录成功。
    }
  }
});
```

<<<<<<< HEAD
详细登录流程为：
=======
When this code is run, the following happens:

The user is shown the Twitter login dialog.
The user authenticates via Twitter, and your app receives a callback.
Our SDK receives the Twitter data and saves it to a LCUser. If it's a new user based on the Twitter handle, then that user is created.
Your LogInCallback is called with the user.
In order to display the Twitter login dialogs and activities, the current Context must be provided (often, the current context is this when calling logIn() from within the Activity) as we have done above.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

* 用户通过Twitter SDK提供的Login with Twitter界面登录Twitter
* Twitter验证登录信息，并返回结果.
* Leap Cloud SDK接受结果，并保存至LCUser. 如果该Twitter用户Id并未与任何LCUser绑定，Leap Cloud将自动为该创建一个用户.
* 调用LC的LogInCallback登录该LCUser.

<<<<<<< HEAD
####绑定LCUser与Twitter账号
您可以通过以下方式，绑定已有的LC账号和Twitter账号：
=======
If you want to associate an existing LCUser with a Twitter account, you can link it like so:
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
if (!LCTwitterUtils.isLinked(user)) {
    LCTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCTwitterUtils.isLinked(user)) {
<<<<<<< HEAD
            //绑定成功
=======
            Log.d("MyApp", "Woohoo, user logged in with Twitter!");
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
      }
    }
  });
}
```

<<<<<<< HEAD
绑定成功后，Leap Cloud将会把该Twitter账号的信息更新至该LCUser中。下次再使用该Twitter账号登录应用时，Leap Cloud将检测到其已绑定LCUser，便不会为该Twitter账号添加新的LCUser.
=======
The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing LCUser is updated with the Twitter information. Future logins via Twitter will now log the user into their existing account.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

####解除绑定

```java
LCTwitterUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(LCException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Twitter account.");
    }
  }
});
```
解除绑定成功后，Leap Cloud将会把该Twitter账号的信息从该LCUser中移除。下次再使用该Twitter账号登录应用时，Leap Cloud将检测到其未绑定LCUser，便会为该Twitter账号添加新的LCUser.

##地理位置

Leap Cloud提供LCGeoPoint对象，帮助用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。

####LCGeoPoint字段说明

<<<<<<< HEAD
####创建LCGeoPoint
LCGeoPoint需要提供两个参数：第一个为纬度(正为北纬)，第二个参数为经度(正为东经)。

```java
//创建北纬40度，西经30度的LCGeoPoint
=======
LC allows you to associate real-world latitude and longitude coordinates with an object. Adding a LCGeoPoint to a LCObject allows queries to take into account the proximity of an object to a reference point. This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.

### LCGeoPoint

To associate a point with an object you first need to create a LCGeoPoint. For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

```java
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
LCGeoPoint point = new LCGeoPoint(40.0, -30.0);
```

该LCGeoPoint对象可悲存储在LCObject中：

```java
myShop.put("location", point);
```
<<<<<<< HEAD
####地理位置查询
#####查询距离某地理位置最近的对象
您可以通过whereNear方法获取A点附近的对象，该方法需要提供两个参数：第一个为目标对象存储地理位置的字段名，第二个参数为A点的地理位置。通过下面的例子，我们可以找到离某用户最近的十家店铺。

```java
LCGeoPoint userLocation = (LCGeoPoint) userObject.get("location");
LCQuery<LCObject> shopQuery = LCQuery.getQuery("Shop");
shopQuery.whereNear("location", userLocation);
query.setLimit(10);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() { ... });
```
#####查询某地理位置一定距离内的对象
您可以使用whereWithinKilometers, whereWithinMiles方法查找某地理位置一定距离内的对象。其用法与上述例子类似。
#####查询一定地理位置范围内对象
您可以通过whereWithinGeoBox方法获取一定地理位置范围内的对象，该方法需要提供三个参数：第一个为目标对象存储地理位置的字段名，后两个参数为LCGeoPoint对象，以这两个点连成的线段为直径的圆，便是whereWithinGeoBox将查询的范围。通过下面的例子，我们可以找到一定地理位置范围内所有店铺。
=======

### Geo Queries

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point. This can be done by adding another restriction to LCQuery using whereNear. Getting a list of ten places that are closest to a user may look something like:

```java
LCGeoPoint userLocation = (LCGeoPoint) userObject.get("location");
LCQuery<LCObject> query = LCQuery.getQuery("PlaceObject");
query.whereNear("location", userLocation);
query.setLimit(10);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() { ... });
```

At this point nearPlaces will be an array of objects ordered by distance (nearest to farthest) from userLocation. Note that if an additional orderByAscending()/orderByDescending() constraint is applied, it will take precedence over the distance ordering.

To limit the results using distance, check out whereWithinKilometers, whereWithinMiles, and whereWithinRadians.

It's also possible to query for the set of objects that are contained within a particular area. To find the objects in a rectangular bounding box, add the whereWithinGeoBox restriction to your LCQuery.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b

```java
LCGeoPoint southwestOfSF = new LCGeoPoint(37.708813, -122.526398);
LCGeoPoint northeastOfSF = new LCGeoPoint(37.822802, -122.373962);
LCQuery<LCObject> query = LCQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
LCQueryManager.findAllInBackground(new FindCallback<LCObject>() { ... });
<<<<<<< HEAD
```
=======
```

### Caveats

At the moment there are a couple of things to watch out for:

Each LCObject class may only have one key with a LCGeoPoint object.
Points should not equal or exceed the extreme ends of the ranges. Latitude should not be -90.0 or 90.0. Longitude should not be -180.0 or 180.0. Attempting to set latitude or longitude out of bounds will cause an error.

## User Interface

## Handling Errors

## Security

We strongly recommend that you build your applications to restrict access to data as much as possible. With this in mind, we recommend that you enable automatic anonymous user creation and specify a default ACL based upon the current user when your application is initialized. Explicitly set public writability (and potentially public readability) on an object-by-object basis in order to protect your data from unauthorized access.

Consider adding the following code to your application startup:

```java
LCUser.enableAutomaticUser();
LCACL defaultACL = new LCACL();
// Optionally enable public read access while disabling public write access.
// defaultACL.setPublicReadAccess(true);
LCACL.setDefaultACL(defaultACL, true);
```

Please keep secure access to your data in mind as you build your applications for the protection of both you and your users.

### Settings

In addition to coding securely, please review the settings pages for your applications to select options that will restrict access to your applications as much as is appropriate for your needs. For example, if users should be unable to log in without a Facebook account linked to their application, disable all other login mechanisms. Specify your Facebook application IDs, Twitter consumer keys, and other such information to enable server-side validation of your users' login attempts.
>>>>>>> 61d6c5ad24498392b8f5138dfd491e9e8b33126b
