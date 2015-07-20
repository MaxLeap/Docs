# Cloud Data

## 简介

### 什么是Cloud Data
Cloud Data是Leap Cloud提供的数据存储服务，它建立在对象`LASObject`的基础上，每个`LASObject`包含若干键值对。所有LASObject均存储在Leap Cloud上，您可以通过iOS/Android Core SDK对其进行操作.

### 为何需要Cloud Data
：

*	数据操作的完整封装
*	灾备
*	MongoDB
*	??TO ASK??
* 	缓存机制

### Cloud Data如何工作

Pic

## Cloud Object
Cloud Data的每个存储的对象称为`LASObject`，而每个`LASObject`被规划至不同的`Class`中（类似“表”的概念)。`LASObject`包含若干键值对，且值为兼容JSON格式的数据。您无需预先指定每个 LASObject包含哪些属性，也无需指定属性值的类型。您可以随时向`LASObject`增加新的键值对，剩下的事情交给CloudData服务即可。

###新建
假设我们要保存一条`Comment`数据到云端，它包含以下属性：

键|值|值类型
-------|-------|---|
content|"我很喜欢这条分享"|字符
pubUserId|1314520|数字
isRead|false|布尔

添加属性的方法与`Java`中的`Map`类似：

```java
LASObject myComment = new LASObject("Comment");
myComment.put("cotent", "我很喜欢这条分享");
myComment.put("pubUserId", 1314520);
myComment.put("isRead", false);
LASDataManager.saveInBackground(myComment);
```

注意：

* **Comment表合何时创建:** 在运行以上代码时，如果云端（LeapCloud 的服务器，以下简称云端）不存在 Comment 数据表，那么 LeapCloud 将根据你第一次（也就是运行的以上代码）新建的 Comment 对象来创建数据表，并且插入相应数据。
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 content、pubUserId、isRead 等属性，那么，新建comment对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **LASObject是Schemaless的:** 如果云端的这个应用中已经存在名为 Comment 的数据表，新建comment对象时，您可以向
* **自动创建的属性:** 每个 LASObject 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **同步操作/异步操作:** 在 Android 平台上，大部分的代码是在主线程上运行的，如果在主线程上进行耗时的阻塞性操作，如访问网络等，你的代码可能会无法正常运行，避免这个问题的方法是把会导致阻塞的同步操作改为异步，在一个后台线程运行，例如 save() 还有一个异步的版本 saveInBackground()，需要传入一个在异步操作完成后运行的回调函数。查询、更新、删除操作也都有对应的异步版本。
* 键的名称必须为英文字母，值的类型可为字符, 数字, 布尔, 数组或是LASObject，只需为支持JSON编码的类型.

###	查询
#####获取LASObject
您可以通过某条数据的ObjectId，获取完整的`LASObject`:

```java
String objId="OBJECT_ID";
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
LASQueryManager.getInBackground(query, objId, new GetCallback<LASObject>() {

  @Override
  public void done(LASObject Object, LASException e) {
    if (e == null) {
      LASObject comment = new LASObject("Comment");
    } else {
      // something went wrong
    }
  }
});
```
#####查询LASObject属性值
要从检索到的 LASObject 实例中获取值，可以使用相应的数据类型的 getType 方法：

```java
int pubUserId = comment.getInt("pubUserId");
String content = comment.getString("content");
boolean isRead = comment.getBoolean("isRead");
```

###更新
更新LASObject需要两步：首先获取需要更新的LASObject，然后修改并保存。

```java
// Retrieve the object by id
String objId="OBJECT_ID";
LASQueryManager.getInBackground(query, objId, new GetCallback<LASObject>() {

  @Override
  public void done(LASObject comment, LASException e) {
    if (e == null) {
      // 将该评论修改为“已读”
      comment.put("isRead", true);
      LASDataManager.saveInBackground(comment);
    }
  }
});
```

###删除
从云端删除对象，请调用该对象的 deleteInBackground() 方法。如果你不在乎会阻塞主线程，也可以使用 delete() 方法。确认删除是否成功，你可以使用 DeleteCallback 回调来处理删除操作的结果。

```java
LASDataManager.deleteInBackground(comment);
```

除了完整删除一个对象实例外，你还可以只删除实例中的某些指定的值。请注意只有调用 saveInBackground() 之后，修改才会同步到云端。

```java
// 移除该实例的isRead属性
comment.remove("isRead");
// 保存
LASDataManager.saveInBackground(comment.remove);
```

批量删除实例可以通过 deleteAll() 方法，删除操作马上生效。

```java
List<AVObject> objects = ...
AVObject.deleteAll(objects);
```

###关联数据
对象可以与其他对象相联系。如前面所述，我们可以把一个 LASObject 的实例 a，当成另一个 LASObject 实例 b 的属性值保存起来。这可以解决数据之间一对一或者一对多的关系映射，就像数据库中的主外键关系一样。
+

注：LeapCloud 云端是通过 Pointer 类型来解决这种数据引用的，并不会将数据 a 在数据 b 的表中再额外存储一份，这也可以保证数据的一致性。 例如：一条微博信息可能会对应多条评论。创建一条微博信息并对应一条评论信息，你可以这样写：

```JAVA
// 创建微博信息
LASObject myWeibo = new LASObject("Post");
myWeibo.put("content", "这是我的第一条微博信息，请大家多多关照。");

// 创建评论信息
LASObject myComment = new LASObject("Comment");
myComment.put("content", "期待您更多的微博信息。");

// 添加一个关联的微博对象
myComment.put("post", myWeibo);

// 这将保存两条数据，分别为微博信息和评论信息
LASDataManager.saveInBackground(myComment);
```

您也可以通过 objectId 来关联已有的对象：

```java
// 把评论关联到 objectId 为 1zEcyElZ80 的这条微博上
myComment.put("parent", LASObject.createWithoutData("Post", "1zEcyElZ80"));
```

默认情况下，当你获取一个对象的时候，关联的 LASObject 不会被获取。这些对象除了 objectId 之外，其他属性值都是空的，要得到关联对象的全部属性数据，需要再次调用 fetch 系方法（下面的例子假设已经通过 LASQuery 得到了 Comment 的实例）:

```java
LASObject post = fetchedComment.getLASObject("post");
LASDataManager.fetchInBackground(post, new GetCallback<LASObject>() {

    @Override
    public void done(LASObject post, LASException e) {
          String title = post.getString("title");
          // Do something with your new title variable
        }
});
```

还有另外一种复杂的情况，你可以使用 LASRelation 来建模多对多关系。这有点像 List 链表，但是区别之处在于，在获取附加属性的时候，LASRelation 不需要同步获取关联的所有 LASRelation 实例。这使得 LASRelation 比链表的方式可以支持更多实例，读取方式也更加灵活。例如，一个 User 可以赞很多 Post。这种情况下，就可以用 getRelation 方法保存一个用户喜欢的所有 Post 集合。为了新增一个喜欢的 Post，你可以这样做：

```java
LASUser user = LASUser.getCurrentUser();
LASRelation<LASObject> relation = user.getRelation("likes");
relation.add(post);
LASUserManager.saveInBackground(user);
```

你可以从 AVRelation 中移除一个 Post:

```java
relation.remove(post);
```

默认情况下，处于关系中的对象集合不会被同步获取到。你可以通过 getQuery 方法返回的 LASQuery 对象，使用它的 findInBackground 方法来获取 Post 链表，像这样：

```java
LASQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<LASObject>() {

    @Override
    public void done(List<LASObject> results, LASException e) {
         if (e != null) {
            // There was an error
          } else {
            // results have all the Posts the current user liked.
          }
    }
});
```

如果你只想获取链表的一个子集合，你可以添加更多的约束条件到 getQuery 返回 AVQuery 对象上（这一点是直接使用 List 作为属性值做不到的），例如：

```java
LASQuery<LASObject> query = relation.getQuery();
// 在 query 对象上可以添加更多查询约束
query.skip(10);
query.limit(10);
```

更多关于 LASQuery 的信息，请看本指南的查询部分。查询的时候，一个 LASRelation 对象运作起来像一个对象链表，因此任何你作用在链表上的查询（除了 include），都可以作用在 LASRelation上。

###计数器

????

###数组

???

###数据类型

目前为止，我们支持的数据类型有 String、Int、Boolean 以及 LASObject 对象类型。同时 LeapCloud 也支持 java.util.Date、byte[]数组、JSONObject、JSONArray 数据类型。 你可以在 JSONArray 对象中嵌套 JSONObject 对象存储在一个 LASObject 中。 以下是一些例子：

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
 
LASObject bigObject = new LASObject("BigObject");
bigObject.put("myNumber", myNumber);
bigObject.put("myString", myString);
bigObject.put("myDate", myDate);
bigObject.put("myData", myData);
bigObject.put("myArray", myArray);
bigObject.put("myObject", myObject);
bigObject.put("myNull", JSONObject.NULL);
LASDataManager.saveInBackground(bigObject);
```

我们不建议存储较大的二进制数据，如图像或文件不应使用 LASObject 的 byte[] 字段类型。LASObject 的大小不应超过 128 KB。如果需要存储较大的文件类型如图像、文件、音乐，可以使用 LASFile 对象来存储，具体使用方法可见 LASFile 指南部分。 关于处理数据的更多信息，可查看开发指南的数据安全部分。

## 查询


###基本查询

使用LASQuery查询LASObject分三步：

1. 创建一个 LASQuery 对象，并指定对应的“LASObject Class”；
2. 为LASQuery添加不同的条件；
3. 执行LASQuery：使用 LASQueryManager.findAllInBackground() 方法结合FindCallback 回调类来查询与条件匹配的 LASObject 数据。

例如，查询指定人员的信息，使用 whereEqualTo 方法来添加条件值：

```java
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Dan Stemkoski");
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
    public void done(List<LASObject> scoreList, LASException e) {
        if (e == null) {
            Log.d("score", "Retrieved " + scoreList.size() + " scores");
        } else {
            Log.d("score", "Error: " + e.getMessage());
        }
    }
});
```

###查询条件

#####设置过滤条件
如果要过滤掉特定键的值时可以使用 whereNotEqualTo 方法。比如需要查询 isRead 不等于true的数据时可以这样写：

```java
query.whereNotEqualTo("isRead", true);
```

当然，你可以在你的查询操作中添加多个约束条件（这些条件是 and 关系），来查询符合你要求的数据。

```java
query.whereNotEqualTo("isRead", true);
query.whereGreaterThan("userAge", 18);
```

#####设置结果数量
您可以使用 setLimit 方法来限制查询结果的数据条数。默认情况下 Limit 的值为 100，最大 1000，在 0 到 1000 范围之外的都强制转成默认的 100。

```java
query.setLimit(10); // limit to at most 10 results
```

您也可以使用LASQueryManager.getFirstInBackground()来执行Query，以获取查询的第一条结果。

```java
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.whereEqualTo("playerEmail", "dstemkoski@example.com");
LASQueryManager.getFirstInBackground(query, new GetCallback<LASObject>() {
  public void done(LASObject object, LASException e) {
    if (object == null) {
      Log.d("score", "The getFirst request failed.");
    } else {
      Log.d("score", "Retrieved the object.");
    }
  }
});
```

#####对结果排序
对于类型为数字或字符串的属性，你可以使用升序或降序的方式来控制查询数据的结果顺序：

```java
// Sorts the results in ascending order by the score field
query.orderByAscending("score");
 
// Sorts the results in descending order by the score field
query.orderByDescending("score");
```

#####设置数值大小约束
对于类型为数字的属性，你可以对其值的大小进行筛选：

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
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.selectKeys(Arrays.asList("playerName", "score"));
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {

    @Override
    public void done(List<LASObject> objects, LASException exception) {
         // results has the list of objects
    }
});
```

随后对于返回的LASObject，您可以可通过LASDataManager.fetchInBackground获取该数据其他属性。

```java
LASObject object = results.get(0);
LASDataManager.fetchInBackground(object, new GetCallback<LASObject>() {

    @Override
    public void done(LASObject object, LASException exception) {
        // all fields of the object will now be available here.
    }
});
```

#####设置更多约束
在数据较多的情况下，分页显示数据是比较合理的解决办法，setSkip 方法可以做到跳过首次查询的多少条数据来实现分页的功能。

```java
query.setSkip(10); // skip the first 10 results
```

如果你想查询匹配几个不同值的数据，如：要查询 "Jonathan Walsh", "Dario Wunsch", "Shawn Simon" 三个账号的信息时，你可以使用whereContainedIn（类似SQL中的in查询）方法来实现。

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereContainedIn("playerName", Arrays.asList(names));
```

相反，你想查询"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"这三个账号**以外**的其他人的信息（类似 SQL 中的 not in 查询），你可以使用 whereNotContainedIn 方法来实现。

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereNotContainedIn("playerName", Arrays.asList(names));
```

您可以通过whereExists查询存在指定属性的数据。相应的，您可以通过whereDoesNotExist，查询不存在指定属性的数据。

```java
// Finds objects that have the score set
query.whereExists("score");
 
// Finds objects that don't have the score set
query.whereDoesNotExist("score");
```

You can use the whereMatchesKeyInQuery method to get objects where a key matches the value of a key in a set of objects resulting from another query. For example, if you have a class containing sports teams and you store a user's hometown in the user class, you can issue one query to find the list of users whose hometown teams have winning records. The query would look like:

```java
LASQuery<LASObject> teamQuery = LASQuery.getQuery("Team");
teamQuery.whereGreaterThan("winPct", 0.5);
LASQuery<LASUser> userQuery = LASUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
LASQueryManager.findAllInBackground(userQuery, new FindCallback<LASUser>() {
    
  @Override
  public void done(List<LASUser> results, LASException e) {
    // results has the list of users with a hometown team with a winning record
  }
});
```

Conversely, to get objects where a key does not match the value of a key in a set of objects resulting from another query, use whereDoesNotMatchKeyInQuery. For example, to find users whose hometown teams have losing records:

```java
LASQuery<LASUser> losingUserQuery = LASUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LASQueryManager.findAllInBackground(losingUserQuery, new FindCallback<LASUser>() {
    
  @Override
  public void done(List<LASUser> results, LASException e) {
    // results has the list of users with a hometown team with a losing record
  }
});
```