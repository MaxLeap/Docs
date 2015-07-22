# Cloud Data

## 简介

### 什么是Cloud Data服务
Cloud Data是Leap Cloud提供的数据存储服务，它建立在对象`LASObject`的基础上，每个`LASObject`包含若干键值对。所有`LASObject`均存储在Leap Cloud上，您可以通过iOS/Android Core SDK对其进行操作，也可在Console中管理所有的对象。此外Leap Cloud还提供一些特殊的对象，如`LASUser`(用户)，`LASRole`(角色)，`LASFile`(文件)，`LASGeoPoint`(地理位置)，他们都是基于`LASObject`的对象。

### 为何需要Cloud Data服务
Cloud Data将帮助您数据库基础设施的构建和维护，从而专注于实现真正带来价值的应用业务逻辑。其优势在于：

* 解决硬件资源的部署和运维
* 提供标准而又完整的数据访问API
* 不同于传统关系型数据库，向云端存储数据无需提前建表，数据对象以 JSON 格式随存随取，高并发访问轻松无压力
* 可结合Cloud Code服务，实现云端数据的Hook （详情请移步至[Cloud Code引导](。。。)） （！！修改说法！！）

### Cloud Data服务如何工作

Pic

## Cloud Object
存储在Cloud Data的对象称为`LASObject`，而每个`LASObject`被规划至不同的`Class`中（类似“表”的概念)。`LASObject`包含若干键值对，且值为兼容JSON格式的数据。您无需预先指定每个 LASObject包含哪些属性，也无需指定属性值的类型。您可以随时向`LASObject`增加新的属性及对应的值，Cloud Data服务会将其存储至云端。

###新建
假设我们要保存一条数据到`Comment`Class，它包含以下属性：

属性名|值|值类型
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

* **Comment表合何时创建:** 在运行以上代码时，如果云端（LeapCloud 的服务器，以下简称云端）不存在 Comment 数据表，那么 LeapCloud 将根据您第一次（也就是运行的以上代码）新建的 Comment 对象来创建数据表，并且插入相应数据。
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 content、pubUserId、isRead 等属性，那么，新建comment对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **LASObject是Schemaless的:** 如果云端的这个应用中已经存在名为 Comment 的数据表，新建comment对象时，您可以向
* **自动创建的属性:** 每个 LASObject 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **同步操作/异步操作:** 在 Android 平台上，大部分的代码是在主线程上运行的，如果在主线程上进行耗时的阻塞性操作，如访问网络等，您的代码可能会无法正常运行，避免这个问题的方法是把会导致阻塞的同步操作改为异步，在一个后台线程运行，例如 save() 还有一个异步的版本 saveInBackground()，需要传入一个在异步操作完成后运行的回调函数。查询、更新、删除操作也都有对应的异步版本。
* 键的名称必须为英文字母，值的类型可为字符, 数字, 布尔, 数组或是LASObject，为支持JSON编码的类型即可.
* 您可以在调用 `LASDataManager.saveInBackground()`时，传入第二个参数 - SaveCallback实例，用以检查新建是否成功。

	```java
	LASDataManager.saveInBackground(myComment, new SaveCallback() {
	  @Override
	  public void done(LASException e) {
	    if(e==null){
	      // 新建成功
	    } else{
	      // 新建失败
	    }
	  }
	});
```

###查询
#####查询LASObject
您可以通过某条数据的ObjectId，获取完整的`LASObject`。调用`LASQueryManager.getInBackground()`方法需要提供三个参数：第一个为查询对象所属的Class名，第二个参数为ObjectId，第三个参数为回调函数，将在getInBackground()方法完成后调用。

```java
String objId="OBJECT_ID";
LASQueryManager.getInBackground("Comment", objId, new GetCallback<LASObject>() {

  @Override
  public void done(LASObject Object, LASException e) {
    // Object即为所查询的对象

  }
});
```
也可以通过"属性值+LASQuery"方式获取LASObject：

```java
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereMatches("isRead",false);

LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
  @Override
  public void done(List<LASObject> list, LASException e) {
    // list即为所查询的对象
  }
});
```

如果您只需获取Query结果的第一条，您可以使用`LASQueryManager.getFirstInBackground()`方法：

```java
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereMatches("pubUserId","USER_ID");

LASQueryManager.getFirstInBackground(query, new GetCallback<LASObject>() {
  @Override
  public void done(LASObject lasObject, LASException e){
    // lasObject即为所查询的对象
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
// 根据objectId获取LASObject
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

#####删除LASObject
您可以使用`LASDataManager.deleteInBackground()` 方法删除LASObjcet。确认删除是否成功，您可以使用 DeleteCallback 回调来处理删除操作的结果。

```java
LASDataManager.deleteInBackground(comment);
```

#####批量删除
您可以使用`LASDataManager.deleteInBackground()` 方法删除LASObjcet - 一个`List<LASObject>`实例。

```java
List<LASObject> objects = ...
LASDataManager.deleteAllInBackground(objects);
```

#####删除LASObject实例的某一属性
除了完整删除一个对象实例外，您还可以只删除实例中的某些指定的值。请注意只有调用 saveInBackground() 之后，修改才会同步到云端。

```java
// 移除该实例的isRead属性
comment.remove("isRead");
// 保存
LASDataManager.saveInBackground(comment.remove);
```

###关联数据
对象可以与其他对象相联系。如前面所述，我们可以把一个 LASObject 的实例 a，当成另一个 LASObject 实例 b 的属性值保存起来。这可以解决数据之间一对一或者一对多的关系映射，就像数据库中的主外键关系一样。

注：Leap Cloud 云端是通过 Pointer 类型来解决这种数据引用的，并不会将数据 a 在数据 b 的表中再额外存储一份，这也可以保证数据的一致性。 

####一对一关联
例如：一条微博信息可能会对应多条评论。创建一条微博信息并对应一条评论信息，您可以这样写：

```JAVA
// 创建微博信息
LASObject myPost = new LASObject("Post");
myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");

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

默认情况下，当您获取一个对象的时候，关联的 LASObject 不会被获取。这些对象除了 objectId 之外，其他属性值都是空的，要得到关联对象的全部属性数据，需要再次调用 fetch 系方法（下面的例子假设已经通过 LASQuery 得到了 Comment 的实例）:

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
####一对多关联
将两条评论分别关联至一条微博中：

```JAVA
// 创建微博信息
LASObject myPost = new LASObject("Post");
myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");

// 创建评论信息
LASObject myComment = new LASObject("Comment");
myComment.put("content", "期待您更多的微博信息。");

// 创建另一条评论信息
LASObject anotherComment = new LASObject("Comment");
anotherComment.put("content", "期待您更多的微博信息。");

// 将两条评论信息放至同一个List中
List<LASObject> listComment = new ArrayList<>();
listComment.add(myComment);
listComment.add(anotherComment);

// 在微博中关联这两条评论
myPost.put("comment", listComment);

// 这将保存两条数据，分别为微博信息和评论信息
LASDataManager.saveInBackground(myComment);
```

注意：

* Java 6及更低版本请使用`List<LASObject> listComment = new ArrayList<LASObject>()`创建listComment.
* 您也可以选择使用`add()`方法，逐个添加LASObject至属性中：

	```java
	myPost.add("comment", myComment);
	myPost.add("comment", anotherComment);
	```

####使用LASRelation实现关联

您可以使用 LASRelation 来建模多对多关系。这有点像 List 链表，但是区别之处在于，在获取附加属性的时候，LASRelation 不需要同步获取关联的所有 LASRelation 实例。这使得 LASRelation 比链表的方式可以支持更多实例，读取方式也更加灵活。例如，一个 User 可以赞很多 Post。这种情况下，就可以用`getRelation()`方法保存一个用户喜欢的所有 Post 集合。为了新增一个喜欢的 Post，您可以这样做：

```java
LASUser user = LASUser.getCurrentUser();
//在user实例中，创建LASRelation实例 - likes
LASRelation<LASObject> relation = user.getRelation("likes");
//在likes中添加关联 - post
relation.add(post);
LASUserManager.saveInBackground(user);
```

您可以从 LASRelation 中移除一个 Post:

```java
relation.remove(post);
```

默认情况下，处于关系中的对象集合不会被同步获取到。您可以通过 getQuery 方法返回的 LASQuery 对象，使用它的 findInBackground() 方法来获取 Post 链表，像这样：

```java
LASQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<LASObject>() {

    @Override
    public void done(List<LASObject> results, LASException e) {
         if (e != null) {
          } else {
            // results包含relation中所有的关联对象
          }
    }
});
```

如果您只想获取链表的一个子集合，您可以添加更多的约束条件到 getQuery 返回 LASQuery 对象上（这一点是直接使用 List 作为属性值做不到的），例如：

```java
LASQuery<LASObject> query = relation.getQuery();
// 在 query 对象上可以添加更多查询约束
query.skip(10);
query.limit(10);
```

更多关于 LASQuery 的信息，请查看的[查询指南](..)。查询的时候，一个 LASRelation 对象运作起来像一个对象链表，因此任何您作用在链表上的查询（除了 include），都可以作用在 LASRelation上。

###数据类型

目前为止，我们支持的数据类型有 String、Int、Boolean 以及 LASObject 对象类型。同时 LeapCloud 也支持 java.util.Date、byte[]数组、JSONObject、JSONArray 数据类型。 您可以在 JSONArray 对象中嵌套 JSONObject 对象存储在一个 LASObject 中。 以下是一些例子：

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

我们不建议存储较大的二进制数据，如图像或文件不应使用 LASObject 的 byte[] 字段类型。LASObject 的大小不应超过 128 KB。如果需要存储较大的文件类型如图像、文件、音乐，可以使用 LASFile 对象来存储，具体使用方法可见 [文件指南](..)。 关于处理数据的更多信息，可查看[数据安全指南](...)。

## 文件
###LASFile的创建和上传
LASFile 可以让您的应用程序将文件存储到服务器中，比如常见的文件类型图像文件、影像文件、音乐文件和任何其他二进制数据都可以使用。 

在这个例子中，我们将图片保存为LASFile并上传到服务器端：

```java
public void UploadFile(Bitmap img){
  // 将Bitmap转换为二进制数据byte[]
  Bitmap bitmap = img;
  ByteArrayOutputStream stream = new ByteArrayOutputStream();
  bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
  byte[] image = stream.toByteArray();
  
  // 创建LASFile对象
  LASFile myFile = new LASFile("myPic.png", image);
  
  // 上传
  LASFileManager.saveInBackground(myFile, new SaveCallback() {
    @Override
    public void done(LASException e) {

    }
  });
}
```

注意：

* 	LASFile 构造函数的第一个参数指定文件名称，第二个构造函数接收一个 byte 数组，也就是将要上传文件的二进制。您可以通过以下代码，获取文件名：

	```java
	String fileName = myFile.getName();
	```
* 	可以将 LASFile 直接存储到其他对象的某个属性里，后续可以取出来继续使用。
 
	```java
	//创建一个LASObject，包含ImageName，ImageFile字段
	LASObject imgupload = new LASObject("ImageUploaded");
	imgupload.put("ImageName", "testpic");
	imgupload.put("ImageFile", file);

	//保存
	LASDataManager.saveInBackground(imgupload, new SaveCallback() {
		@Override
		public void done(LASException e) {
		}
	});
	```

###上传进度
LASFile的 saveInBackground() 方法除了可以传入一个 SaveCallback 回调来通知上传成功或者失败之外，还可以传入第二个参数 ProgressCallback 回调对象，通知上传进度：

```java
LASFileManager.saveInBackground(file, new SaveCallback() {
	@Override
	public void done(LASException e) {
			
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
1. 通过LASObject，指定LASFile
2. 调用 LASFileManager.getDataInBackground() 下载：

```java
LASFile myFile=imgupload.getLASFile("testpic");
LASFileManager.getDataInBackground(myFile, new GetDataCallback() {
	@Override
	public void done(byte[] bytes, LASException e) {

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

###基本查询

使用LASQuery查询LASObject分三步：

1. 创建一个 LASQuery 对象，并指定对应的"LASObject Class"；
2. 为LASQuery添加不同的条件；
3. 执行LASQuery：使用 `LASQueryManager.findAllInBackground()` 方法结合FindCallback 回调类来查询与条件匹配的 LASObject 数据。

例如，查询指定人员的信息，使用 whereEqualTo 方法来添加条件值：

```java
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Dan Stemkoski");
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {您
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
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.selectKeys(Arrays.asList("playerName", "score"));
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {

    @Override
    public void done(List<LASObject> objects, LASException exception) {
         // results has the list of objects
    }
});
```

随后对于返回的LASObject，您可以可通过LASDataManager.fetchInBackground()获取该数据其他属性。

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
// Finds objects that have the score set
query.whereExists("score");
 
// Finds objects that don't have the score set
query.whereDoesNotExist("score");
```

您可以使用whereMatchesKeyInQuery方法查询一个query中的某属性的值与另一个query中某属性的值相同的数据。 

如：现有一个名为"Team"的Class存储篮球队的数据，有一个名为"User"的Class存储用户数据。Team中使用"city"存储篮球队所在地，User中使用"hometown"存储其家乡。则您可以通过以下Query，查找家乡与**特定**篮球队所在地相同的用户。

```java
LASQuery<LASObject> teamQuery = LASQuery.getQuery("Team");
//筛选篮球队：选择胜率超过50%的篮球队
teamQuery.whereGreaterThan("winPct", 0.5);
LASQuery<LASUser> userQuery = LASUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
LASQueryManager.findAllInBackground(userQuery, new FindCallback<LASUser>() {
    
  @Override
  public void done(List<LASUser> results, LASException e) {
    // results中包含胜率超过50%的篮球队所在地的用户
  }
});
```

相应的，您可以通过whereDoesNotMatchKeyInQuery方法，获取家乡**不在**指定篮球队所在地的用户。

```java
LASQuery<LASUser> anotherUserQuery = LASUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LASQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<LASUser>() {
    
  @Override
  public void done(List<LASUser> results, LASException e) {
    // results中包含家乡不在指定篮球队所在地的用户 
  }
});
```

###不同属性值类型的查询

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
LASQuery<LASObject> query = LASQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

####值类型为LASObject查询

#####LASObject类型字段匹配LASObject

如果您想获取某个字段匹配特定 LASObject 的数据，您可以像查询其他数据类型那样使用 whereEqualTo 来查询。例如，如果每个 Comment 对象都包含一个 Post 对象（在 post 字段上），您可以获取特定 Post 的所有 Comment 列表：

```java
// 假设 LASObject myPost 已经在前面创建
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
public void done(List<LASObject> commentList, LASException e) {
 // commentList now has the comments for myPost
}
});
```
#####LASObject类型字段匹配Query
如果您想查询的对象的某个字段包含了一个 LASObject，并且这个 LASObject 匹配一个不同的查询，您可以使用 whereMatchesQuery 嵌套查询方法。请注意，默认的 limit 限制 100 也同样作用在内部查询上。因此如果是大规模的数据查询，您可能需要仔细构造您的查询对象来获取想要的行为。例如，为了查询有图片附件的 Post 的评论列表：

```java
LASQuery<LASObject> innerQuery = LASQuery.getQuery("Post");
innerQuery.whereExists("image");
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereMatchesQuery("post", innerQuery);
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
  public void done(List<LASObject> commentList, LASException e) {
    // comments now contains the comments for posts with images.
  }
});
```

反之，不想匹配某个子查询，您可以使用 whereDoesNotMatchQuery 方法。 比如为了查询没有图片的 Post 的评论列表：

```java
LASQuery<LASObject> innerQuery = LASQuery.getQuery("Post");
innerQuery.whereExists("image");
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereDoesNotMatchQuery("post", innerQuery);
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
  public void done(List<LASObject> commentList, LASException e) {
    // comments now contains the comments for posts without images.
  }
});
```
#####返回指定LASObject类型的字段
默认情况下，当您获取一个对象的时候，关联的 LASObject 不会被获取，但您可以使用 include 方法将其返回。例如。您想获取最近的 10 条评论，同时包括它们关联的 post：

```java
LASQuery<LASObject> query = LASQuery.getQuery("Comment");

//Retrieve the most recent ones
query.orderByDescending("createdAt");

//Only retrieve the last ten
query.setLimit(10);

//Include the post data with each comment
query.include("post");

LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
public void done(List<LASObject> commentList, LASException e) {
 // commentList now contains the last ten comments, and the "post"
 // field has been populated. For example:
 for (LASObject comment : commentList) {
   // This does not require a network access.
   LASObject post = comment.getLASObject("post");
   Log.d("post", "retrieved a related post");
 }
}
});
```

您可以使用 dot（英语句号）操作符来多层 include 内嵌的对象。比如，您同时想 include 一个 Comment 的 post 里的 author（作者）对象（假设 author 对应的值是 LASUser 实例），您可以这样做：

```java
query.include("post.author");
```
###个数查询

如果您只是想统计有多少个对象满足查询，您并不需要获取所有匹配的对象，可以直接使用 count 替代 find。例如，查询一个账户发了多少微博：

```java
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
query.whereEqualTo("playerName", "Sean Plott");
LASQueryManager.countInBackground(query, new CountCallback() {
  public void done(int count, LASException e) {
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

您可以通过LASQuery.or方法查询匹配多个Query中一个的数据。如，您可以通过以下方式，获取胜场超过90场或低于10场的玩家名单：

```java
LASQuery<LASObject> lotsOfWins = LASQuery.getQuery("Player");
lotsOfWins.whereGreaterThan("score", 90);
 
LASQuery<LASObject> fewWins = LASQuery.getQuery("Player");
fewWins.whereLessThan("score", 10);
 
List<LASQuery<LASObject>> queries = new ArrayList<LASQuery<LASObject>>();
queries.add(lotsOfWins);
queries.add(fewWins);
 
LASQuery<LASObject> mainQuery = LASQuery.or(queries);
LASQueryManager.findAllInBackground(mainQuery, new FindCallback<LASObject>() {
  public void done(List<LASObject> results, LASException e) {
    // results包含胜场超过90场或低于10场的玩家。
  }
});
```

###缓存查询
经常需要缓存一些查询的结果到磁盘上，这可以让您在离线的时候，或者应用刚启动，网络请求还没有足够时间完成的时候可以展现一些数据给用户。Leap Cloud 会自动清空缓存，当缓存占用了太多空间的时候。

默认情况下的查询不会使用缓存，除非您使用 setCachePolicy 方法明确设置启用。例如，尝试从网络请求，如果网络不可用则从缓存数据中获取，可以这样设置：

```java
query.setCachePolicy(LASQuery.CachePolicy.NETWORK_ELSE_CACHE);
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
  public void done(List<LASObject> scoreList, LASException e) {
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

缓存策略|介绍
---|---
IGNORE_CACHE | 默认的缓存策略，查询不走缓存，查询结果也不存储在缓存。
CACHE_ONLY | 查询只从缓存获取，不走网络。如果缓存中没有结果，引发一个 LASException。
NETWORK_ONLY | 查询不走缓存，从网路中获取，但是查询结果会写入缓存。
CACHE\_ELSE_NETWORK | 查询首先尝试从缓存中获取，如果失败，则从网络获取，如果两者都失败，则引发一个 LASException。
NETWORK\_ELSE_CACHE | 查询首先尝试从网络获取，如果失败，则从缓存中查找；如果两者都失败，则应发一个 LASException。
CACHE\_THEN_NETWORK | 查询首先尝试从缓存中获取，然后再从网络获取。在这种情况下，FindCallback 会被实际调用两次 -- 首先是缓存的结果，其次是网络查询的结果。这个缓存策略只能用在异步的 findInBackground() 方法中。

如果您想控制缓存的行为。您可以使用 LASQuery 提供的方法来操作缓存。您可以在缓存上做如下这些操作：

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
LASQuery.clearAllCachedResults();
```

#####控制缓存结果的最大存活时间（毫秒为单位）：

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));
```

##LASObject子类

LeapCloud 希望设计成能让人尽快上手并使用。您可以通过 LASDataManager.fetchInBackground() 方法访问所有的数据。但是在很多现有成熟的代码中，子类化能带来更多优点，诸如简洁、可扩展性以及 IDE 提供的代码自动完成的支持等等。子类化不是必须的，您可以将下列代码转化：

```java
LASObject shield = new LASObject("Armor");
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

###创建LASObject子类

创建一个 LASObject 的子类很简单：

1.   首先声明一个子类继承自 LASObject。
2.   添加@LASClassName注解。它的值必须是一个字符串，也就是您过去传入 LASObject 构造函数的类名。这样以来，后续就不需要再在代码中出现这个字符串类名。
3.   确保您的子类有一个 public 的默认（参数个数为 0）的构造函数。切记不要在构造函数里修改任何 LASObject 的字段。
4.   在调用 LASConfig.initialize() 注册应用之前，注册子类 LASObject.registerSubclass(YourClass.class).

下列代码成功实现并注册了 LASObject 的子类 Armor:

```java
// Armor.java
import com.las.LASObject;
import com.las.LASClassName;

@LASClassName("Armor")
public class Armor extends LASObject {
}

// App.java
import com.las.LASConfig;
import android.app.Application;

public class App extends Application {
  @Override
  public void onCreate() {
    super.onCreate();

    LASObject.registerSubclass(Armor.class);
    LASConfig.initialize(this, LAS_APPLICATION_ID, LAS_CLIENT_KEY);
  }
}
```
 
####字段的访问/修改

添加方法到 LASObject 的子类有助于封装类的逻辑。您可以将所有跟子类有关的逻辑放到一个地方，而不是分成多个类来分别处理商业逻辑和存储/转换逻辑。

您可以很容易地添加访问器和修改器到您的 LASObject 子类。像平常那样声明字段的 getter 和 setter 方法，但是通过 LASObject 的 get 和 put 方法来实现它们。下面是这个例子为 Post 类创建了一个 content 的字段：

```java
// Armor.java
@LASClassName("Armor")
public class Armor extends LASObject {
  public String getDisplayName() {
    return getString("displayName");
  }
  public void setDisplayName(String value) {
    put("displayName", value);
  }
}
```

现在您就可以使用 armor.getDisplayName()方法来访问 displayName 字段，并通过 armor.setDisplayName() 来修改它。这样就允许您的 IDE 提供代码自动完成功能，并且可以在编译时发现到类型错误。

各种数据类型的访问器和修改器都可以这样被定义，使用各种 get()方法的变种，例如 getInt()，getLASFile()或getMap().

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

###创建子类的实例
您可以使用您自定义的构造函数来创建您的子类对象。您的子类必须定义一个公开的默认构造函数，并且不修改任何父类 LASObject 中的字段，这个默认构造函数将会被 SDK 使用来创建子类的强类型的对象。

要创建一个到现有对象的引用，可以使用 LASObject.createWithoutData():

```java
Armor armorReference = LASObject.createWithoutData(Armor.class, armor.getObjectId());
```

###子类的查询
您可以通过静态方法静态方法LASQuery.getQuery()获取特定的子类的查询对象。下面的例子用以查询用户可购买的所有防具：

```java
LASQuery<Armor> query = LASQuery.getQuery(Armor.class);
query.whereLessThanOrEqualTo("rupees", LASUser.getCurrentUser().get("rupees"));
LASQueryManager.findAllInBackground(query, new FindCallback<Armor>() {
  @Override
  public void done(List<Armor> results, LASException e) {
    for (Armor a : results) {
      // ...
    }
  }LASUser
});
```

##用户

LASUser 是一个 LASObject 的子类，它继承了 LASObject 所有的方法，具有 LASObject 相同的功能。不同的是，LASUser 增加了一些特定的关于用户账户相关的功能。

###字段说明
LASUser 除了从 LASObject 继承的属性外，还有几个特定的属性：

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
* 和其他 LASObject 对象不同的是，在设置 LASUser 这些属性的时候不是使用的 put 方法，而是专门的 setXXX 方法。
* 系统会自动收集masterKey，installationIds的值。

###注册用户

1. 创建LASUser对象，并提供必需的username和password
2. 利用LASUserManager.signUpInBackground()保存至云端。

```java
String mUsername ＝ "userName";
String mPassword = "passWord";
LASUser user = new LASUser();
user.setUserName(mUsername);
user.setPassword(mPassword);

LASUserManager.signUpInBackground(user, new SignUpCallback() {
	public void done(LASException e) {
	        if (e == null) {
	        // 注册成功
	        } else {
	        }
	}
});
```
注意：

* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 signUpInBackground() 方法，而不是 saveInBackground() 方法。另外还有各种不同的 signUp 方法。像往常一样，我们建议在可能的情况下尽量使用异步版本的 signUp 方法，这样就不会影响到应用程序主 UI 线程的响应。您可以阅读 API 中更多的有关这些具体方法的使用。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 Email 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 Email 地址，以后在用户忘记密码的情况下可以使用 LeapCloud 提供的重置密码功能。

###登录
您可以通过LASUserManager.logInInBackground()方法登录。字段说明：第一个参数为用户名，第二个参数为密码，第三个参数为回调方法LogInCallback().

```java
LASUserManager.logInInBackground("userName", "passWord", new LogInCallback<LASUser>() {
  public void done(LASUser user, LASException e) {
    if (user != null) {
      // 登录成功
    } else {
      // 登录失败
    }
  }
});
```

###当前用户
如果用户在每次打开您的应用程序时都要登录，这将会直接影响到您应用的用户体验。为了避免这种情况，您可以使用缓存的 currentUser 对象。

每当您注册成功或是第一次登录成功，都会在本地磁盘中有一个缓存的用户对象，您可以这样来获取这个缓存的用户对象来进行登录：

```java
LASUser currentUser = LASUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

当然，您也可以使用如下方法清除缓存用户对象：

```java
LASUser.logOut();
LASUser currentUser = LASUser.getCurrentUser(); //此时，crrentUser将为null
```

###重置密码

如果用户忘记密码，Leap Cloud提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```java
LASUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LASException e) {
        if (e == null) {
            // 重置密码的邮件已发出
        } else {
        }
    }
});
```
如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

* 用户输入他们的电子邮件，请求重置自己的密码。
* Leap Cloud 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个LAS的页面，输入一个新的密码。
* Leap Cloud 将用户的密码重置为新输入的密码。

###查询用户

您可以通过特殊的UserQuery查询用户数据。Leap Cloud对用户数据安全性提供充分的保障，如需获取更多信息，请移步至[用户对象的安全性](..)。

```java
LASQuery<LASUser> query = LASUser.getQuery();
query.whereEqualTo("gender", "female");
LASQueryManager.findAllInBackground(query, new FindCallback<LASUser>() {
  public void done(List<LASUser> objects, LASException e) {
    if (e == null) {
        // The query was successful.
    } else {
        // Something went wrong.
    }
  }
});
```

###邮箱验证

Leap Cloud提供强大的邮箱验证服务，您只需在Console >> App Settings >> Email Settings中Enable "Verify user's email address", 系统便会自动在LASUser中添加`emailVerified`字段。并且，当LASUser的email字段被赋值或者修改, 且`emailVerified`字 字段的值为false. Leap Cloud便会自动向用户发送一个链接，用户点击链接后便会将`emailVerified`设置为true.

`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

###匿名用户
匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 Leap Cloud 提供的匿名用户系统来实现您的功能。

您可以通过LASAnonymousUtils获取一个匿名的用户账号：

```java
LASAnonymousUtils.logIn(new LogInCallback<LASUser>() {
      @Override
      public void done(LASUser user, LASException e) {
        if (e != null) {
          Log.d("MyApp", "Anonymous login failed.");
    } else {
      Log.d("MyApp", "Anonymous user logged in.");
    }
  }
});
```
#####自动创建匿名用户
您可以通过注册或者登录，将当前的匿名用户转化为非您民用户，该匿名用户的所有的数据都将保留。您可以通过LASAnonymousUtils.isLinked()来判断当前用户是否为匿名用户。

```java
Boolean isAnonymous = LASAnonymousUtils.isLinked(LASUser.getCurrentUser());
```

您可以选择让系统自动创建匿名用户（本地创建，无需网络连接）, 以便立即开始使用应用. 设置自动创建匿名用户后, LASUser.getCurrentUser()将永远不为null。 然而，当您在存储与该匿名用户相关的LASObject时，Leap Cloud会在云端创建该匿名用户。

#####如何自动创建匿名用户
在主Application的onCreate()方法中添加：

```java
LASUser.enableAutomaticUser();
```

### 在Console中管理用户

User 表是一个特殊的表，专门存储 LASUser 对象。在Console >> Users中，您会看到一个 _User 表。更多信息，请移步至[Console用户手册](...)中查看。

##用户角色
随着用户数量的增长，使用角色进行权限管理将更有效。所有赋予某一角色的权限，将被该角色包含的用户所继承。用户角色是一组用户的集合，同时，一个用户角色也可以包含另一个用户角色。在Leap Cloud中有一个对应的`_Role` Class来存储用户角色。

###字段说明

属性名|类型|介绍|是否必需或唯一
---|---|---|---
    ACL|ACL|用户角色对象的访问权限|**必需** (需要显式设置)
    roles|Relation|该LASRole包含的其他LASRole|可选
    name|String| 角色名|必需
    user|Relation|该角色包含的用户|可选

###创建角色
创建Role的时候，您需要提供两个参数：第一个为Role的名字(对应name字段)，第二个参数为ACL.

```java
LASACL roleACL = new LASACL();
roleACL.setPublicReadAccess(true);
LASRole role = new LASRole("Administrator", roleACL);
LASRoleManager.saveInBackground(role);
```

###向角色中添加用户或角色
您可以通过role.getUsers().add()或role.getRoles().add()方法，向角色中添加用户或其他角色。

```java
LASRole role = new LASRole(roleName, roleACL);
for (LASUser user : usersToAddToRole) {
  role.getUsers().add(user)
}
for (LASRole childRole : rolesToAddToRole) {
  role.getRoles().add(childRole);
}
LASRoleManager.saveInBackground(role);
```

###获取角色对象

您有两种方式获取用户角色对象：

1. 通过角色名查找：

	```java
	LASObject wallPost = new LASObject("WallPost");
	LASACL postACL = new LASACL();
	//指定相应的Role的名字：
	postACL.setRoleWriteAccess("Moderators", true);
	wallPost.setACL(postACL);
	LASDataManager.saveInBackground(wallPost);
	```
2. 通过Query查找：

	```JAVA
	LASQuery<LASRole> query = LASRole.getQuery();
	query.whereEqualTo("name", "roleName");
	LASQueryManager.findAllInBackground(query, new FindCallback<LASRole>() {
		public void done(List<LASRole> roleList, LASException e) {
			if (e == null) {
			
			} else {
			
			}
		}
	});
	```

##数据安全

### LASObject的安全性
用户在创建LASObject时都存在一个ACL字段，只有在ACL名单上的用户(LASUser)或者角色(LASRole)才能被允许访问。如果用户不显式地设置ACL，系统将自动为其分配默认的ACL.

#####ACL
ACL相当于为每一个数据创建的允许访问的白名单列表。一个 User 必须拥有读权限（或者属于一个拥有读权限的 Role）才可以获取一个对象的数据，同时，一个 User 需要写权限（或者属于一个拥有写权限的 Role）才可以更改或者删除一个对象。 如，一条典型的ACL数据：

```{"553892e860b21a48a50c1f29":{"read":true,"write":true}}```

表明ObjectId为"553892e860b21a48a50c1f29"的用户，可以读取和修改该LASObject.

#####默认访问权限

在没有显式指定的情况下，LeapCloud 中的每一个对象都会有一个默认的 ACL 值。这个值代表了，所有的用户，对这个对象都是可读可写的。此时您可以在数据管理的表中 ACL 属性中看到这样的值:

```{"*":{"read":true,"write":true}}```

您可以根据需要，修改默认ACL的值：

```java
LASACL defaultACL = new LASACL();
defaultACL.setPublicReadAccess(true);
defaultACL.setPublicWriteAccess(false);
LASACL.setDefaultACL(defaultACL, true);
```

`LASACL.setDefaultACL()`的第二个参数设置为true，代表默认将该用户的读取和访问权限添加到该defaultACL上。反之则否。

#####设置仅创建用户可见
您可以将一个LASObject设置为仅创建用户可读取或修改：首先，用户需要登录后创建LASObject，并且为其添加如下ACL属性：

```java
LASObject privateNote = new LASObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LASACL(LASUser.getCurrentUser()));
LASDataManager.saveInBackground(privateNote);
```
此时，该LASObject - "privateNote"仅该用户可见。且该用户在任何设备上登录，都可以读取或修改该对象。

#####为其他用户设置访问权限
您可以使用setReadAccess 和 setWriteAccess将**指定用户**的读写权限添加到LASObject的ACL中。

如，为一组用户添加读取和修改的权限：

```java
LASObject groupMessage = new LASObject("Message");
LASACL groupACL = new LASACL();
     
// userList 为 Iterable<LASUser>，包含一组LASUser对象.
for (LASUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
LASDataManager.saveInBackground(groupMessage);
```

#####为角色设置访问权限
您可以使用setRoleWriteAccess 和 setRoleWriteAccess将**指定角色**的读写权限添加到LASObject的ACL中。

如，为一组用户添加读取和修改的权限：

```java
LASRole moderators = /* Query for some LASRole */;
LASObject wallPost = new LASObject("WallPost");
LASACL postACL = new LASACL();
postACL.setRoleWriteAccess(moderators);
wallPost.setACL(postACL);
LASDataManager.saveInBackground(wallPost);
```

#####同时为用户和角色设置访问权限
LASObject的ACL是可以叠加的。如，在给某一个LASObjcet设置ACL时，您可以为所有用户添加读取权限的同时，为某一个角色添加修改权限：

```java
LASObject myMessage = new LASObject("Message");
LASACL myACL = new LASACL();
// 为所有用户添加读取权限
myACL.setPublicReadAccess(true);
// 为Moderators 角色添加修改权限
myACL.setRoleWriteAccess("Moderators");
myMessage.setACL(myACL);
```	

#####为所有用户设置访问权限
您可以使用setPublicReadAccess 和 setPublicWriteAccess将**所有用户**的读写权限添加到LASObject的ACL中
```java
LASObject publicPost = new LASObject("Post");
LASACL postACL = new LASACL();
postACL.setPublicReadAccess(true);
postACL.setPublicWriteAccess(false);
publicPost.setACL(postACL);
LASDataManager.saveInBackground(publicPost);
```

### 用户对象的安全性

Leap Cloud对用户对象的安全性进行了规范。默认情况下，存储在用户对象中的数据，只能被该用户本身修改。客户端可以读取其他用户的数据，但无权限修改或删除。所以，只有用户登录后所获取的用户对象，才能被修改。

以下例子很好的描绘了用户对象的安全性:

```java
LASUserManager.logInInBackground("my_username", "my_password", new LogInCallback<LASUser>() {
    
    @Override
    public void done(LASUser user, LASException exception) {
        user.setUserName("my_new_username"); // 修改用户名
        LASUserManager.saveInBackground(user); // 能成功保存，因为成功登录并获取该用户对象。
         
        // 非登录方式，获取的用户对象，将无法被修改
        LASQuery<LASUser> query = LASUser.getQuery();
        LASQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<LASUser>() {
          public void done(LASUser object, LASException e) {
            object.setUserName("another_username");
         
            // 将抛出异常：用户未被授权
            LASDataManager.saveInBackground(object);
          }
        });
    }
});
```
### 角色对象的安全性

与其他LASObject一样，LASRole对象也使用ACL来控制其访问权限。不同的是，LASRole需要显示地设置ACL. 通常，只有系统管理人员，或其他高权限人员可以有权限创建或修改角色，所以在创建LASRole的同时，您需要设置其访问权限。

如:

```java
LASACL roleACL = new LASACL();
roleACL.setPublicReadAccess(true);
LASRole role = new LASRole("Administrator", roleACL);
LASRoleManager.saveInBackground(role);
```

##第三方登录

为简化用户的注册及登录流程，并且集成LAS应用与Facebook, Twitter等应用，Leap Cloud提供了第三方登录应用的服务。您可以同时使用第三方应用SDK与LAS SDK，并将LASUser与第三方应用的用户ID进行连接。

###使用Facebook账号登录
Facebook的Android SDK，帮助应用优化登录体验。对于已经安装Facebook应用的设备，LAS应用可通过设备上的Facebook用户凭据，直接实现用户登录。对于未安装Facebook应用的设备，用户可以通过一个标准化的Facebook登录页面，提供相应的登录信息。

使用Facebook账号登录后，如果该Facebook用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Facebook开发者中心](https://developers.facebook.com)创建Facebook应用。点击My Apps >> Add a New App
2. 打开LAS Console >> App Settings >> User Authentication.勾选Allow Facebook Authentication. 并将步骤一中获取的Facebook Application ID 和 App Secret填写至相应位置。
3. 集成Facebook SDK，添加Facebook Login按钮。详细步骤，请参考[Add Facebook Login to Your App or Website](https://developers.facebook.com/docs/facebook-login/v2.4)
4. 在项目的Application.onCreate()函数中，于LASConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：

```java
LASFacebookUtils.initialize("YOUR FACEBOOK APP ID");
```
5. 	在所有调用Login with Facebook的Activity中的onActivityResult()函数中添加如下代码，已完成验证。

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LASFacebookUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####登录并注册新LASUser
使用Facebook账号登录后，如果该Facebook用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。如：

```java
LASFacebookUtils.logInInBackground(this, new LogInCallback<LASUser>() {
  @Override
  public void done(LASUser user, LASException err) {
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

详细登录流程为：

* 用户通过Facebook SDK提供的Login with Facebook界面登录Facebook
* Facebook验证登录信息，并返回结果.
* LAS SDK接受结果，并保存至LASUser. 如果该Facebook用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户.
* 调用LAS的LogInCallback登录该LASUser.

####绑定LASUser与Facebook账号
您可以通过以下方式，绑定已有的LAS账号和Facebook账号：

```java
if (!LASFacebookUtils.isLinked(user)) {
    LASFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LASException ex) {
          if (LASFacebookUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，Leap Cloud将会把该Facebook账号的信息更新至该LASUser中。下次再使用该Facebook账号登录应用时，Leap Cloud将检测到其已绑定LASUser，便不会为该Facebook账号添加新的LASUser.

####解除绑定

```java
LASFacebookUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(LASException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Facebook account.");
    }
  }
});
```
解除绑定成功后，Leap Cloud将会把该Facebook账号的信息从该LASUser中移除。下次再使用该Facebook账号登录应用时，Leap Cloud将检测到其未绑定LASUser，便会为该Facebook账号添加新的LASUser.

###使用Twitter账号登录
与Facebook类似，Twitter的Android SDK，也能帮助应用优化登录体验。对于已经安装Twitter应用的设备，LAS应用可通过设备上的Twitter用户凭据，直接实现用户登录。对于未安装Twitter应用的设备，用户可以通过一个标准化的Twitter登录页面，提供相应的登录信息。

使用Twitter账号登录后，如果该Twitter用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Twitter开发者中心](...)创建Twitter应用。点击My Apps >> Add a New App
2. 打开LAS Console >> App Settings >> User Authentication.勾选Allow Twitter Authentication. 并将步骤一中获取的Twitter consumer Key填写至相应位置。
3. 集成Twitter SDK，添加Twitter Login按钮。详细步骤，请参考[Add Twitter Login to Your App or Website](...)
4. 在项目的Application.onCreate()函数中，于LASConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：

```java
LASTwitterUtils.initialize("YOUR Twitter CUSUMER KEY");
```
5. 	在所有调用Login with Twitter的Activity中的onActivityResult()函数中添加如下代码，已完成验证。

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LASTwitterUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####登录并注册新LASUser
使用Twitter账号登录后，如果该Twitter用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户，并与其绑定。如：

```java
LASTwitterUtils.logInInBackground(this, new LogInCallback<LASUser>() {
  @Override
  public void done(LASUser user, LASException err) {
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

详细登录流程为：

* 用户通过Twitter SDK提供的Login with Twitter界面登录Twitter
* Twitter验证登录信息，并返回结果.
* LAS SDK接受结果，并保存至LASUser. 如果该Twitter用户Id并未与任何LASUser绑定，Leap Cloud将自动为该创建一个用户.
* 调用LAS的LogInCallback登录该LASUser.

####绑定LASUser与Twitter账号
您可以通过以下方式，绑定已有的LAS账号和Twitter账号：

```java
if (!LASTwitterUtils.isLinked(user)) {
    LASTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LASException ex) {
          if (LASTwitterUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，Leap Cloud将会把该Twitter账号的信息更新至该LASUser中。下次再使用该Twitter账号登录应用时，Leap Cloud将检测到其已绑定LASUser，便不会为该Twitter账号添加新的LASUser.

####解除绑定

```java
LASTwitterUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(LASException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Twitter account.");
    }
  }
});
```
解除绑定成功后，Leap Cloud将会把该Twitter账号的信息从该LASUser中移除。下次再使用该Twitter账号登录应用时，Leap Cloud将检测到其未绑定LASUser，便会为该Twitter账号添加新的LASUser.

##地理位置

Leap Cloud提供LASGeoPoint对象，帮助用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。

####LASGeoPoint字段说明

####创建LASGeoPoint
LASGeoPoint需要提供两个参数：第一个为纬度(正为北纬)，第二个参数为经度(正为东经)。

```java
//创建北纬40度，西经30度的LASGeoPoint
LASGeoPoint point = new LASGeoPoint(40.0, -30.0);
```

该LASGeoPoint对象可悲存储在LASObject中：

```java
myShop.put("location", point);
```
####地理位置查询
#####查询距离某地理位置最近的对象
您可以通过whereNear方法获取A点附近的对象，该方法需要提供两个参数：第一个为目标对象存储地理位置的字段名，第二个参数为A点的地理位置。通过下面的例子，我们可以找到离某用户最近的十家店铺。

```java
LASGeoPoint userLocation = (LASGeoPoint) userObject.get("location");
LASQuery<LASObject> shopQuery = LASQuery.getQuery("Shop");
shopQuery.whereNear("location", userLocation);
query.setLimit(10);
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() { ... });
```
#####查询某地理位置一定距离内的对象
您可以使用whereWithinKilometers, whereWithinMiles方法查找某地理位置一定距离内的对象。其用法与上述例子类似。
#####查询一定地理位置范围内对象
您可以通过whereWithinGeoBox方法获取一定地理位置范围内的对象，该方法需要提供三个参数：第一个为目标对象存储地理位置的字段名，后两个参数为LASGeoPoint对象，以这两个点连成的线段为直径的圆，便是whereWithinGeoBox将查询的范围。通过下面的例子，我们可以找到一定地理位置范围内所有店铺。

```java
LASGeoPoint southwestOfSF = new LASGeoPoint(37.708813, -122.526398);
LASGeoPoint northeastOfSF = new LASGeoPoint(37.822802, -122.373962);
LASQuery<LASObject> query = LASQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
LASQueryManager.findAllInBackground(new FindCallback<LASObject>() { ... });
```