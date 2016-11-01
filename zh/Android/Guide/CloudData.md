# 数据存储

## 简介

### 什么是 Cloud Data 服务

 Cloud Data 是 MaxLeap 提供的数据存储服务，它建立在对象 `MLObject` 的基础上，每个 `MLObject` 包含若干键值对。所有` MLObject` 均存储在 MaxLeap 上，您可以通过 iOS/Android Core SDK 对其进行操作，也可在 Console 中管理所有的对象。此外 MaxLeap 还提供一些特殊的对象，如 `MLUser`(用户)，`MLFile`(文件)，`MLGeoPoint`(地理位置)，他们都是基于 `MLObject` 的对象。
 
## SDK 集成

请按第二章【SDK 集成】步骤完成 SDK 集成。

## Cloud Object

存储在 Cloud Data 的对象称为 `MLObject`，而每个 `MLObject` 被规划至不同的 `class` 中（类似“表”的概念)。`MLObject` 包含若干键值对，且值为兼容 JSON 格式的数据。您无需预先指定每个 MLObject 包含哪些属性，也无需指定属性值的类型。您可以随时向 `MLObject` 增加新的属性及对应的值， Cloud Data 服务会将其存储至云端。

### 新建

假设我们要保存一条数据到 `Comment` 类，它包含以下属性：

属性名|值|值类型
-------|-------|---|
content|"我很喜欢这条分享"|字符
pubUserId|1314520|数字
isRead|false|布尔

我们建议您使用驼峰式命名法来命名类名和字段名（如：NameYourclassesLikeThis, nameYourKeysLikeThis），让您的代码看起来整齐美观。

首先，需要在云端数据仓库中添加 `Comment` 类，才能够往里面插入数据。
有关添加类等操作的说明，请查阅：[控制台用户手册 － 云数据](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_DATA_ZH)

添加属性的方法与 `Java` 中的 `Map` 类似：

```java
    MLObject myComment = new MLObject("Comment");
    myComment.put("content", "我很喜欢这条分享");
    myComment.put("pubUserId", 1314520);
    myComment.put("isRead", false);
    MLDataManager.saveInBackground(myComment);
```

该代码运行后，您可能想知道是否真的执行了相关操作。为确保数据正确保存，您可以在 MaxLeap 开发中心查看应用中的数据浏览器。您应该会看到类似于以下的内容：

```
    objectId: "xWMyZ4YEGZ", content: "我很喜欢这条分享", pubUserId: 1314520, isRead: false,
    createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

注意：

* **Comment表合何时创建:** 出于数据安全考虑，MaxLeap 禁止客户端创建表，所以在使用前必须先登录 MaxLeap 的控制台并手动创建 Comment 表。这样在运行代码后这条数据才会被成功插入。
* **表中同一属性值类型一致:** 如果云端的这个应用中已经存在名为 Comment 的数据表，而且也包括 content、pubUserId、isRead 等属性，那么，新建 comment 对象时，对应属性的值的数据类型要和创建该属性时一致，否则保存数据将失败。
* **数据结构:** 为了数据的安全性，您必须事先在控制台指定好所需要的所有属性及其类型，然后 `MLObject` 才能被正常保存。
* **内建的属性:** 每个 MLObject 对象有以下几个保存元数据的属性是不需要开发者指定的。这些属性的创建和更新是由系统自动完成的，请不要在代码里使用这些属性来保存数据。

	属性名|值|
	-------|-------|
	objectId|对象的唯一标识符
	createdAt|对象的创建时间
	updatedAt|对象的最后修改时间

* **大小限制：** MLObject的大小被限制在 128K 以内。
* 键的名称可以包含英文字母，数字和下划线，但是必须以字母开头。值的类型可为字符, 数字, 布尔, 数组或是MLObject，为支持JSON编码的类型即可.
* 您可以在调用 `MLDataManager.saveInBackground()`时，传入第二个参数 - SaveCallback 实例，用以检查新建是否成功。

```java
    MLDataManager.saveInBackground(myComment, new SaveCallback() {
      @Override
      public void done(MLException e) {
        if(e==null){
          // 新建成功
        } else{
          // 新建失败
        }
      }
    });
```

### 查询

#### 查询 MLObject

##### 获取单条数据

您可以通过某条数据的ObjectId，获取完整的`MLObject`。调用`MLQueryManager.getInBackground()`方法需要提供三个参数：第一个为查询对象所属的 class 名，第二个参数为 ObjectId，第三个参数为回调函数，将在 `getInBackground()` 方法完成后调用。

```java
    String className = "Comment";
    String objId = "OBJECT_ID";
    MLQueryManager.getInBackground(className, objId, new GetCallback<MLObject>() {
    
      @Override
      public void done(MLObject object, MLException e) {
        // Object 即为所查询的对象
    
      }
    });
```

也可以通过 "属性值 + MLQuery" 方式获取 MLObject：

```java
    String className = "Comment";
    String objId = "OBJECT_ID";
    MLQuery query = MLQuery.getQuery(className);
    
    MLQueryManager.getInBackground(query, objId, new GetCallback() {
        @Override
        public void done(MLObject mlObject, MLException e) {

        }
    });
```


##### 获取多条数据

您可以通过`MLQueryManager.findAllInBackground()`的方式获取多条数据：

```java
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    query.whereEqualTo("isRead",false);
    
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
      @Override
      public void done(List<MLObject> list, MLException e) {
        // list即为所查询的对象集合
      }
    });
```

- 当获取的数据量较大的时候，您可以通过配置`MLQuery`的`setLimit()`参数来设置每次请求的条数，进行分页：


```java
    query.setLimit(20);//每次最多返回的条数
    
    query.setSkip(page*20);//page 为已请求的页数，此处表示跳过之前已经获取的总条数
```

提示：MLQuery默认每次返回的最大条数为100。若您自行设置了返回的条数，最大条数不能超过1000。如果数据较多，建议您以分页的方式多次获取。

- 当自定义的表中包含的字段比较多时，您可以通过配置`MLQuery`的`selectKeys()`来获取关注的字段：

```java
    List<String> keyList = new ArrayList<>();
    keyList.add("name");
    keyList.add("age");
    
    query.selectKeys(keyList);
```

- 根据指定的字段对查询的结果进行升序或降序进行排列：

```java
    query.orderByAscending(MLObject.KEY_UPDATED_AT);
    
    query.orderByDescending(MLObject.KEY_UPDATED_AT);
```


更多条件查询，您可以查询api进行了解。


##### 获取第一条数据

如果您只需获取 Query 结果的第一条，您可以使用 `MLQueryManager.getFirstInBackground()`方法：

```java
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    query.whereMatches("pubId","USER_ID");
    
    MLQueryManager.getFirstInBackground(query, new GetCallback<MLObject>() {
      @Override
      public void done(MLObject object, MLException e){
        // MLObject即为所查询的对象
      }
    });
```


#### 获取 MLObject 属性值

要从检索到的 MLObject 实例中获取值，可以使用相应的数据类型的 getType 方法：

```java
    MLQueryManager.getInBackground(query, objId, new GetCallback() {
        @Override
        public void done(MLObject mlObject, MLException e) {
            if (e != null) {
                //获取结果失败
                return;
            }

            int age = mlObject.getInt("age");
            String name = mlObject.getString("name");
            boolean isRead = mlObject.getBoolean("isRead");

        }
    });
```

若需要刷新已有对象，可以调用 `MLDataManager.fetchInBackground()` 方法：

```java
    MLDataManager.fetchInBackground(object, new GetCallback<MLObject>() {
      @Override
      public void done(MLObject object, MLException e){
        // object即为所更新后的对象
      }
    });
```

### 更新

更新 MLObject 需要两步：首先获取需要更新的 MLObject，然后修改并保存。

```java
    // 根据objectId获取MLObject
    String objId="OBJECT_ID";
    MLQueryManager.getInBackground(query, objId, new GetCallback<MLObject>() {
    
      @Override
      public void done(MLObject comment, MLException e) {
        if (e == null) {
          // 将该评论修改为“已读”
          comment.put("isRead", true);
          MLDataManager.saveInBackground(comment);
        }
      }
    });
```

客户端会自动找出被修改的数据，所以只有 “isRead” 字段会被发送到服务器。您不需要担心其中会包含您不想更新的数据。

### 删除

##### 删除MLObject

您可以使用`MLDataManager.deleteInBackground()` 方法删除MLObjcet。确认删除是否成功，您可以使用 DeleteCallback 回调来处理删除操作的结果。

```java
    MLDataManager.deleteInBackground(mlObject);
```

##### 批量删除

您可以使用`MLDataManager.deleteAllInBackground()` 方法删除多个MLObjcet。

```java
    List<MLObject> objects = ...
    MLDataManager.deleteAllInBackground(objects);
```

##### 删除MLObject实例的某一属性

除了完整删除一个对象实例外，您还可以只删除实例中的某些指定的值。请注意只有调用 saveInBackground() 之后，修改才会同步到云端。

```java
    // 移除该实例的isRead属性
    comment.remove("isRead");
    // 保存
    MLDataManager.saveInBackground(comment.remove);
```

### 计数器

计数器是应用常见的功能需求之一。当某一数值类型的字段会被频繁更新，且每次更新操作都是将原有的值增加某一数值，此时，我们可以借助计数器功能，更高效的完成数据操作。并且避免短时间内大量数据修改请求引发冲突和覆盖。

比如记录某用户游戏分数的字段"score"，我们便会频繁地修改，并且当有几个客户端同时请求数据修改时，如果我们每次都在客户端请求获取该数据，并且修改后保存至云端，便很容易造成冲突和覆盖。

##### 递增计数器

此时，我们可以利用`increment()`方法(默认增量为1)，高效并且更安全地更新计数器类型的字段。如，为了更新记录用户游戏分数的字段"score"，我们可以使用如下方式：

```java
    gameScore.increment("score");
    MLDataManager.saveInBackground(gameScore);
```
##### 指定增量

```java
    gameScore.increment("score",1000);
    MLDataManager.saveInBackground(gameScore);
```

注意，增量无需为整数，您还可以指定增量为浮点类型的数值。

##### 递减计数器

```java
    gameScore.increment("score",-1000);
    MLDataManager.saveInBackground(gameScore);
```

### 数组

您可以通过以下方式，将数组类型的值保存至MLObject的某字段(如下例中的skills字段)下：

##### 增加至数组尾部

您可以使用`add()`或`addAll()`向`skills`属性的值的尾部，增加一个或多个值。

```java
    gameScore.add("skills", "driving");
    gameScore.addAll("skills", Arrays.asList("flying", "kungfu"));
    MLDataManager.saveInBackground(gameScore);
```

同时，您还可以通过`addUnique()` 及 `addAllUnique()`方法，仅增加与已有数组中所有item都不同的值。插入位置是不确定的。

##### 使用新数组覆盖

调用`put()`函数，`skills`字段下原有的数组将被覆盖：

```java
    gameScore.put("skills", Arrays.asList("flying", "kungfu"));
    MLDataManager.saveInBackground(gameScore);
```

##### 删除某数组字段的值

调用`removeAll()`函数，`skills`字段下原有的数组将被清空：

```java
    gameScore.removeAll("skills");
    MLDataManager.saveInBackground(gameScore);
```

注意：

* Remove和Add/Put必需分开调用保存函数，否则数据不能正常上传和保存。

###关联数据
对象可以与其他对象相联系。如前面所述，我们可以把一个 MLObject 的实例 a，当成另一个 MLObject 实例 b 的属性值保存起来。这可以解决数据之间一对一或者一对多的关系映射，就像数据库中的主外键关系一样。

注：MaxLeap Services是通过 Pointer 类型来解决这种数据引用的，并不会将数据 a 在数据 b 的表中再额外存储一份，这也可以保证数据的一致性。

#### 一对一关联

例如：一条微博信息可能会对应多条评论。创建一条微博信息并对应一条评论信息，您可以这样写：

```JAVA
    // 创建微博信息
    MLObject myPost = new MLObject("Post");
    myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");
    
    // 创建评论信息
    MLObject myComment = new MLObject("Comment");
    myComment.put("content", "期待您更多的微博信息。");
    
    // 添加一个关联的微博对象
    myComment.put("post", myPost);
    
    // 这将保存两条数据，分别为微博信息和评论信息
    MLDataManager.saveInBackground(myComment);
```

您也可以通过 objectId 来关联已有的对象：

```java
    // 把评论关联到 objectId 为 1zEcyElZ80 的这条微博上
    myComment.put("parent", MLObject.createWithoutData("Post", "1zEcyElZ80"));
```

默认情况下，当您获取一个对象的时候，关联的 MLObject 不会被获取。这些对象除了 objectId 之外，其他属性值都是空的，要得到关联对象的全部属性数据，需要再次调用 fetch 方法（下面的例子假设已经通过 MLQuery 得到了 Comment 的实例）:

```java
    MLObject post = fetchedComment.getMLObject("post");
    MLDataManager.fetchInBackground(post, new GetCallback<MLObject>() {
    
        @Override
        public void done(MLObject post, MLException e) {
              String title = post.getString("title");
              // Do something with your new title variable
            }
    });
```

#### 一对多关联

将两条评论分别关联至一条微博中：

```java
    // 创建微博信息
    MLObject myPost = new MLObject("Post");
    myPost.put("content", "这是我的第一条微博信息，请大家多多关照。");
    
    // 创建评论信息
    MLObject myComment = new MLObject("Comment");
    myComment.put("content", "期待您更多的微博信息。");
    
    // 创建另一条评论信息
    MLObject anotherComment = new MLObject("Comment");
    anotherComment.put("content", "期待您更多的微博信息。");
    
    // 将两条评论信息放至同一个List中
    List<MLObject> listComment = new ArrayList<>();
    listComment.add(myComment);
    listComment.add(anotherComment);
    
    // 在微博中关联这两条评论
    myPost.put("comment", listComment);
    
    // 这将保存两条数据，分别为微博信息和评论信息
    MLDataManager.saveInBackground(myComment);
```

注意：

* Java 6及更低版本请使用`List<MLObject> listComment = new ArrayList<MLObject>()`创建listComment.
* 您也可以选择使用`add()`方法，逐个添加MLObject至属性中：

```java
    myPost.add("comment", myComment);
    myPost.add("comment", anotherComment);
```

#### 使用 MLRelation 实现关联

您可以使用 MLRelation 来建模多对多关系。这有点像 List 链表，但是区别之处在于，在获取附加属性的时候，MLRelation 不需要同步获取关联的所有 MLRelation 实例。这使得 MLRelation 比链表的方式可以支持更多实例，读取方式也更加灵活。例如，一个 User 可以赞很多 Post。这种情况下，就可以用`getRelation()`方法保存一个用户喜欢的所有 Post 集合。为了新增一个喜欢的 Post，您可以这样做：

```java
    MLUser user = MLUser.getCurrentUser();
    //在user实例中，创建MLRelation实例 - likes
    MLRelation<MLObject> relation = user.getRelation("likes");
    //在likes中添加关联 - post
    relation.add(post);
    MLUserManager.saveInBackground(user);
```

您可以从 MLRelation 中移除一个 Post:

```java
    relation.remove(post);
```

默认情况下，处于关系中的对象集合不会被同步获取到。您可以通过 getQuery 方法返回的 MLQuery 对象，使用它的 findInBackground() 方法来获取 Post 链表，像这样：

```java
    MLQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<MLObject>() {
    
        @Override
        public void done(List<MLObject> results, MLException e) {
             if (e != null) {
              } else {
                // results包含relation中所有的关联对象
              }
        }
    });
```

如果您只想获取链表的一个子集合，您可以添加更多的约束条件到 getQuery 返回 MLQuery 对象上（这一点是直接使用 List 作为属性值做不到的），例如：

```java
    MLQuery<MLObject> query = relation.getQuery();
    // 在 query 对象上可以添加更多查询约束
    query.skip(10);
    query.limit(10);
```

更多关于 MLQuery 的信息，请查看的*查询*部分。查询的时候，一个 MLRelation 对象运作起来像一个对象链表，因此任何您作用在链表上的查询（除了 include），都可以作用在 MLRelation上。

### 数据类型

目前为止，我们支持的数据类型有 String、Int、Boolean 以及 MLObject 对象类型。同时 MaxLeap 也支持 java.util.Date、byte[]数组、JSONObject、JSONArray 数据类型。 您可以在 JSONArray 对象中嵌套 JSONObject 对象存储在一个 MLObject 中。 以下是一些例子：

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
    
    MLObject bigObject = new MLObject("BigObject");
    bigObject.put("myNumber", myNumber);
    bigObject.put("myString", myString);
    bigObject.put("myDate", myDate);
    bigObject.put("myData", myData);
    bigObject.put("myArray", myArray);
    bigObject.put("myObject", myObject);
    bigObject.put("myNull", JSONObject.NULL);
    MLDataManager.saveInBackground(bigObject);
```

我们不建议存储较大的二进制数据，如图像或文件不应使用 MLObject 的 byte[] 字段类型。MLObject 的大小不应超过 128 KB。如果需要存储较大的文件类型如图像、文件、音乐，可以使用 MLFile 对象来存储，具体使用方法可见[文件](#文件)部分。 关于处理数据的更多信息，可查看[数据安全](#数据安全)。

## 文件

### MLFile 的创建和上传

MLFile 可以让您的应用程序将文件存储到服务器中，以应对文件太大或太多，不适宜放入普通 `MLObject` 的情况。比如常见的文件类型图像文件、影像文件、音乐文件和任何其他二进制数据（大小不超过 100 MB）都可以使用。

在这个例子中，我们将图片保存为MLFile并上传到服务器端：

```java
    public void UploadFile(Bitmap img){
      // 将Bitmap转换为二进制数据byte[]
      Bitmap bitmap = img;
      ByteArrayOutputStream stream = new ByteArrayOutputStream();
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
      byte[] image = stream.toByteArray();
    
      // 创建MLFile对象
      MLFile myFile = new MLFile("myPic.png", image);
    
      // 上传
      MLFileManager.saveInBackground(myFile, new SaveCallback() {
        @Override
        public void done(MLException e) {
    
        }
      });
    }
```

注意：

* 	MLFile 构造函数的第一个参数指定文件名称，第二个构造函数接收一个 byte 数组，也就是将要上传文件的二进制。您可以通过以下代码，获取文件名：

```java
    String fileName = myFile.getName();
```

* 	可以将 MLFile 直接存储到其他对象的某个属性里，后续可以取出来继续使用。

```java
    //创建一个MLObject，包含ImageName，ImageFile字段
    MLObject imgupload = new MLObject("ImageUploaded");
    imgupload.put("ImageName", "testpic");
    imgupload.put("ImageFile", file);
    
    //保存
    MLDataManager.saveInBackground(imgupload, new SaveCallback() {
        @Override
        public void done(MLException e) {
        }
    });
```

### 上传进度

MLFile 的 `saveInBackground()` 方法除了可以传入一个 SaveCallback 回调来通知上传成功或者失败之外，还可以传入第二个参数 ProgressCallback 回调对象，通知上传进度：

```java
    MLFileManager.saveInBackground(file, new SaveCallback() {
        @Override
        public void done(MLException e) {
    
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
1. 通过MLObject，指定MLFile
2. 调用 MLFileManager.getDataInBackground() 下载：

```java
    MLFile myFile=imgupload.getMLFile("testpic");
    MLFileManager.getDataInBackground(myFile, new GetDataCallback() {
        @Override
        public void done(byte[] bytes, MLException e) {
    
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

使用MLQuery查询MLObject分三步：

1. 创建一个 MLQuery 对象，并指定对应的"MLObject class"；
2. 为MLQuery添加过滤条件；
3. 执行MLQuery：使用 `MLQueryManager.findAllInBackground()` 方法结合FindCallback 回调类来查询与条件匹配的 MLObject 数据。

例如，查询指定人员的信息，使用 whereEqualTo 方法来添加条件：

```java
    MLQuery<MLObject> query = MLQuery.getQuery("GameScore");
    query.whereEqualTo("playerName", "Dan Stemkoski");
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
        public void done(List<MLObject> scoreList, MLException e) {
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

当然，您可以在您的查询操作中添加多个约束条件（这些条件是 "and" 的关系），来查询符合您要求的数据。

```java
    query.whereNotEqualTo("isRead", true);
    query.whereGreaterThan("userAge", 18);
```

#####设置结果数量
您可以使用 setLimit 方法来限制查询结果的数据条数。默认情况下 Limit 的值为 100，最大 1000，在 0 到 1000 范围之外的都强制转成默认的 100。

```java
    query.setLimit(10); // 设置query结果不超过10条
```

您也可以使用MLQueryManager.getFirstInBackground()来执行Query，以获取查询的第一条结果。

```java
    MLQuery<MLObject> query = MLQuery.getQuery("GameScore");
    query.whereEqualTo("playerEmail", "dstemkoski@example.com");
    MLQueryManager.getFirstInBackground(query, new GetCallback<MLObject>() {
      public void done(MLObject object, MLException e) {
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

#####设置数值范围
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
    MLQuery<MLObject> query = MLQuery.getQuery("GameScore");
    query.selectKeys(Arrays.asList("playerName", "score"));
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
    
        @Override
        public void done(List<MLObject> objects, MLException exception) {
             // results has the list of objects
        }
    });
```

随后对于返回的MLObject，您可以可通过MLDataManager.fetchInBackground()获取该数据其他属性。

```java
    MLObject object = results.get(0);
    MLDataManager.fetchInBackground(object, new GetCallback<MLObject>() {
    
        @Override
        public void done(MLObject object, MLException exception) {
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
    // 查询包含"score"属性的对象
    query.whereExists("score");
    
    // 查询不包含"score"属性的对象
    query.whereDoesNotExist("score");
```

您可以使用whereMatchesKeyInQuery方法查询一个query中的某属性的值与另一个query中某属性的值相同的数据。

如：现有一个名为"Team"的class存储篮球队的数据，有一个名为"User"的class存储用户数据。Team中使用"city"存储篮球队所在地，User中使用"hometown"存储其家乡。则您可以通过以下Query，查找家乡与**特定**篮球队所在地相同的用户。

```java
    MLQuery<MLObject> teamQuery = MLQuery.getQuery("Team");
    //筛选篮球队：选择胜率超过50%的篮球队
    teamQuery.whereGreaterThan("winPct", 0.5);
    MLQuery<MLUser> userQuery = MLUser.getQuery();
    userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
    MLQueryManager.findAllInBackground(userQuery, new FindCallback<MLUser>() {
    
      @Override
      public void done(List<MLUser> results, MLException e) {
        // results中包含胜率超过50%的篮球队所在地的用户
      }
    });
```

相应的，您可以通过whereDoesNotMatchKeyInQuery方法，获取家乡**不在**指定篮球队所在地的用户。

```java
    MLQuery<MLUser> anotherUserQuery = MLUser.getQuery();
    losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
    MLQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<MLUser>() {
    
      @Override
      public void done(List<MLUser> results, MLException e) {
        // results中包含家乡不在指定篮球队所在地的用户
      }
    });
```

### 不同属性值类型的查询

#### 值类型为数组的查询

如果一个 Key 对应的值是一个数组，您可以查询 Key 的数组包含了数字 2 的所有对象，通过：

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

#### 值类型为字符串的查询

使用 `whereStartsWith` 方法来限制字符串的值以另一个字符串开头。非常类似 MySQL 的 LIKE 查询，这样的查询会走索引，因此对于大数据集也一样高效：

```java
    // Finds barbecue sauces that start with "Big Daddy's".
    MLQuery<MLObject> query = MLQuery.getQuery("BarbecueSauce");
    query.whereStartsWith("name", "Big Daddy's");
```

####值类型为MLObject查询

#####MLObject类型字段匹配MLObject

如果您想获取某个字段匹配特定 MLObject 的数据，您可以像查询其他数据类型那样使用 whereEqualTo 来查询。例如，如果每个 Comment 对象都包含一个 Post 对象（在 post 字段上），您可以获取特定 Post 的所有 Comment 列表：

```java
    // 假设 MLObject myPost 已经在前面创建
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    query.whereEqualTo("post", myPost);
    
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
    public void done(List<MLObject> commentList, MLException e) {
     // commentList now has the comments for myPost
    }
    });
```
##### MLObject 类型字段匹配 Query

如果您想查询的对象的某个字段包含了一个 MLObject，并且这个 MLObject 匹配一个不同的查询，您可以使用 whereMatchesQuery 嵌套查询方法。请注意，默认的 limit 限制 100 也同样作用在内部查询上。因此如果是大规模的数据查询，您可能需要仔细构造您的查询对象来获取想要的行为。例如，为了查询有图片附件的 Post 的评论列表：

```java
    MLQuery<MLObject> innerQuery = MLQuery.getQuery("Post");
    innerQuery.whereExists("image");
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    query.whereMatchesQuery("post", innerQuery);
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
      public void done(List<MLObject> commentList, MLException e) {
        // comments now contains the comments for posts with images.
      }
    });
```

反之，不想匹配某个子查询，您可以使用 whereDoesNotMatchQuery 方法。 比如为了查询没有图片的 Post 的评论列表：

```java
    MLQuery<MLObject> innerQuery = MLQuery.getQuery("Post");
    innerQuery.whereExists("image");
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    query.whereDoesNotMatchQuery("post", innerQuery);
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
      public void done(List<MLObject> commentList, MLException e) {
        // comments now contains the comments for posts without images.
      }
    });
```

##### 返回指定 MLObject 类型的字段

默认情况下，当您获取一个对象的时候，关联的 MLObject 不会被获取，但您可以使用 include 方法将其返回。例如。您想获取最近的 10 条评论，同时包括它们关联的 post：

```java
    MLQuery<MLObject> query = MLQuery.getQuery("Comment");
    
    //Retrieve the most recent ones
    query.orderByDescending("createdAt");
    
    //Only retrieve the MLt ten
    query.setLimit(10);
    
    //Include the post data with each comment
    query.include("post");
    
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
    public void done(List<MLObject> commentList, MLException e) {
     // commentList now contains the MLt ten comments, and the "post"
     // field has been populated. For example:
     for (MLObject comment : commentList) {
       // This does not require a network access.
       MLObject post = comment.getMLObject("post");
       Log.d("post", "retrieved a related post");
     }
    }
    });
```

您可以使用 dot（英语句号）操作符来多层 include 内嵌的对象。比如，您同时想 include 一个 Comment 的 post 里的 author（作者）对象（假设 author 对应的值是 MLUser 实例），您可以这样做：

```java
    query.include("post.author");
```
###个数查询

如果您只是想统计有多少个对象满足查询，您并不需要获取所有匹配的对象，可以直接使用 count 替代 find。例如，查询一个账户发了多少微博：

```java
    MLQuery<MLObject> query = MLQuery.getQuery("GameScore");
    query.whereEqualTo("playerName", "Sean Plott");
    MLQueryManager.countInBackground(query, new CountCallback() {
      public void done(int count, MLException e) {
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

您可以通过 MLQuery.or 方法查询匹配多个 Query 中一个的数据。如，您可以通过以下方式，获取胜场超过90场或低于10场的玩家名单：

```java
    MLQuery<MLObject> lotsOfWins = MLQuery.getQuery("Player");
    lotsOfWins.whereGreaterThan("score", 90);
    
    MLQuery<MLObject> fewWins = MLQuery.getQuery("Player");
    fewWins.whereLessThan("score", 10);
    
    List<MLQuery<MLObject>> queries = new ArrayList<MLQuery<MLObject>>();
    queries.add(lotsOfWins);
    queries.add(fewWins);
    
    MLQuery<MLObject> mainQuery = MLQuery.or(queries);
    MLQueryManager.findAllInBackground(mainQuery, new FindCallback<MLObject>() {
      public void done(List<MLObject> results, MLException e) {
        // results包含胜场超过90场或低于10场的玩家。
      }
    });
```

##MLObject子类

MaxLeap 希望设计成能让人尽快上手并使用。您可以通过 MLDataManager.fetchInBackground() 方法访问所有的数据。但是在很多现有成熟的代码中，子类化能带来更多优点，诸如简洁、可扩展性以及 IDE 提供的代码自动完成的支持等等。子类化不是必须的，您可以将下列代码转化：

```java
    MLObject shield = new MLObject("Armor");
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

###创建 MLObject 子类

创建一个 MLObject 的子类很简单：

1.   首先声明一个子类继承自 MLObject。
2.   添加 `@MLClassName` 注解。它的值必须是一个字符串，也就是您过去传入 MLObject 构造函数的类名，该值与你在控制台创建的表名相同。这样一来，后续就不需要再在代码中出现这个字符串类名。
3.   确保您的子类有一个 public 的默认（参数个数为 0）的构造函数。切记不要在构造函数里修改任何 MLObject 的字段。
4.   在调用 MaxLeap.initialize() 注册应用之前，注册子类 MLObject.registerSubclass(Yourclass.class).

下列代码成功实现并注册了 MLObject 的子类 Armor:

```java
    // Armor.java
    import com.maxleap.MLObject;
    import com.maxleap.MLClassName;
    
    @MLclassName("t_armor")
    public class Armor extends MLObject {
    }
    
    // App.java
    import com.maxleap.MaxLeap;
    import android.app.Application;
    
    public class App extends Application {
      @Override
      public void onCreate() {
        super.onCreate();
    
        MLObject.registerSubclass(Armor.class);
        MaxLeap.initialize(this, ML_APPLICATION_ID, ML_CLIENT_KEY);
      }
    }
```

####	属性的访问/修改

添加方法到 MLObject 的子类有助于封装类的逻辑。您可以将所有跟子类有关的逻辑放到一个地方，而不是分成多个类来分别处理商业逻辑和存储/转换逻辑。

您可以很容易地添加访问器和修改器到您的 MLObject 子类。像平常那样声明字段的 getter 和 setter 方法，但是通过 MLObject 的 get 和 put 方法来实现它们。下面是这个例子为 Post 类创建了一个 content 的字段：

```java
    // Armor.java
    @MLClassName("t_armor")
    public class Armor extends MLObject {
      public String getDisplayName() {
        return getString("displayName");
      }
      public void setDisplayName(String value) {
        put("displayName", value);
      }
    }
```

现在您就可以使用 armor.getDisplayName()方法来访问 displayName 字段，并通过 armor.setDisplayName() 来修改它。这样就允许您的 IDE 提供代码自动完成功能，并且可以在编译时发现到类型错误。

各种数据类型的访问器和修改器都可以这样被定义，使用各种 get()方法的变种，例如 getInt()，getMLFile()或getMap().

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

### 创建子类的实例

您可以使用您自定义的构造函数来创建您的子类对象。您的子类必须定义一个公开的默认构造函数，并且不修改任何父类 MLObject 中的字段，这个默认构造函数将会被 SDK 使用来创建子类的强类型的对象。

要创建一个到现有对象的引用，可以使用 MLObject.createWithoutData():

```java
    Armor armorReference = MLObject.createWithoutData(Armor.class, armor.getObjectId());
```

### 子类的查询

您可以通过静态方法 `MLQuery.getQuery()` 获取特定的子类的查询对象。下面的例子用以查询用户可购买的所有防具：

```java
    MLQuery<Armor> query = MLQuery.getQuery(Armor.class);
    query.whereLessThanOrEqualTo("rupees", MLUser.getCurrentUser().get("rupees"));
    MLQueryManager.findAllInBackground(query, new FindCallback<Armor>() {
      @Override
      public void done(List<Armor> results, MLException e) {
        for (Armor a : results) {
          // ...
        }
      }MLUser
    });
```


## 地理位置

MaxLeap 提供 MLGeoPoint对象，帮助用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。

#### MLGeoPoint 字段说明

#### 创建 MLGeoPoint

MLGeoPoint需要提供两个参数：第一个为纬度(正数表示北纬)，第二个参数为经度(正数表示东经)。

```java
    //创建北纬40度，西经30度的MLGeoPoint
    MLGeoPoint point = new MLGeoPoint(40.0, -30.0);
```

该MLGeoPoint对象可被存储在MLObject中：

```java
    myShop.put("location", point);
```

#### 地理位置查询

##### 查询距离某地理位置最近的对象

您可以通过 `whereNear` 方法获取A点附近的对象，该方法需要提供两个参数：第一个为目标对象存储地理位置的字段名，第二个参数为A点的地理位置。通过下面的例子，我们可以找到离某用户最近的十家店铺。

```java
    MLGeoPoint userLocation = (MLGeoPoint) userObject.get("location");
    MLQuery<MLObject> shopQuery = MLQuery.getQuery("Shop");
    shopQuery.whereNear("location", userLocation);
    query.setLimit(10);
    MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() { ... });
```

##### 查询某地理位置一定距离内的对象

您可以使用 `whereWithinKilometers`, `whereWithinMiles` 方法查找某地理位置一定距离内的对象。其用法与上述例子类似。

##### 查询一定地理位置范围内对象

您可以通过 `whereWithinGeoBox` 方法获取一定地理位置范围内的对象，该方法需要提供三个参数：第一个为目标对象存储地理位置的字段名，后两个参数为 `MLGeoPoint` 对象，以这两个点连成的线段为直径的圆，便是` whereWithinGeoBox` 将查询的范围。通过下面的例子，我们可以找到一定地理位置范围内所有店铺。

```java
    MLGeoPoint southwestOfSF = new MLGeoPoint(37.708813, -122.526398);
    MLGeoPoint northeastOfSF = new MLGeoPoint(37.822802, -122.373962);
    MLQuery<MLObject> query = MLQuery.getQuery("PizzaPlaceObject");
    query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
    MLQueryManager.findAllInBackground(new FindCallback<MLObject>() { ... });
```

请注意：

1. 每个 `MLObject` 类仅可能有一个带 `MLGeoPoint` 对象的键。
2. `GeoPoint` 的纬度必须在 `-90.0` 和 `90.0` 之间。经度必须在 `-180.0` 和 `180.0` 之间。若纬度或经度设置超出边界，会引起错误。

## 数据安全

每个到达 MaxLeap 云服务的请求是由移动端 SDK，管理后台，云代码或其他客户端发出，每个请求都附带一个 security token。MaxLeap 后台可以根据请求的 security token 确定请求发送者的身份和授权，并在处理数据请求的时候，根据发送者的授权过滤掉没有权限的数据。

具体的介绍及操作方法，请参考 [数据存储-使用指南](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_DATA_ZH)
