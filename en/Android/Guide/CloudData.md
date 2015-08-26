# Cloud Data
## Introduction

### What is Cloud Data
Cloud Data is the data storage service provided by Leap Cloud. It is based on the `LCObject` and each `LCObject` contains several key-values. All `LCObject` are stored in Leap Cloud, you can perform operations towards them with iOS/Android Core SDK. Besides, Leap Cloud  provides some special objects, like `LCUser`, `LCRole`, `LCFile` and `LCGeoPoint`. They are all based on `LCObject`.


### Why is Cloud Data Nccessary
Cloud Data can help you build and maintain the facility of your database, thus focus on the app service logic that brings real value.  The advantages can be summarized as follows:

* Sort out the deployment and maintenance of hardware resourses.
* Provide standard and complete data access API
* Unlike the traditional relational database, there's no class to be created ahead of time before storing data in cloud. Data objects in JSON format can be stored and retrieved easily as you wish.
* Realize the Hook of cloud data with the Cloud Code service.（Please check [Cloud Code Guide](。。。) for more details.）（！！修改说法！！）

### How Does Cloud Data Run

## Cloud Object
The object that stored in Cloud Data is called `LCObject` and every `LCObject` is planned in different `class`(like table in database). `LCObject` contains several key-value pairs and the value is data compatible with JSON format.You don't need to assign properties contained by LCObject package, neither does the type of property value. You can add new property and value to `LCObject` at anytime, which could be stored in cloud by Cloud Data service.

###Create New
Suppose that we need to save a piece of data to `Comment` class, it contains following properties: 

Property Name|Value|Value Type
-------|-------|---|
content|"kind of funny"|Character
pubUserId|1314520|Digit
isRead|false|Boolean

The method of adding property is similar to `Map` in `Java`: 

```java
LCObject myComment = new LCObject("Comment");
myComment.put("content", "kind of funny");
myComment.put("pubUserId", 1314520);
myComment.put("isRead", false);
LCDataManager.saveInBackground(myComment);
```

Notice:

* **When was "Comment" Class created:** If there is no Comment Class in Cloud(Leap Cloud Server, hereinafter referred to as Cloud) when you run the code above, then Leap Cloud will create a data sheet for you according to the Comment object created in the first place(run the code above) and insert relative data.
* **Property Value Type in the Table is consistent:** If there is already a data sheet named Comment in the app in cloud and contains peoperties like content、pubUserId、isRead and etc. Then the data type of relative property value should be consistent with the one you create the property, otherwise you will fail to save data. 
* **LCObject is Schemaless:** You just need to add key-values when neccessary and backend will save them automatically. There's no need to assign `LCObject` ahead of time.
* **Property Created Automatically:** Every LCObeject has following properties for saving metadata that don't need requiring. Their creation and update are accomplished by Leap Cloud backend system automatically, please don't save data with those properties in the code.

	Property Name|Value|
	-------|-------|
	objectId|Unique Identifier of the Object
	createdAt|Date Created of the Object 
	updatedAt|Date Last Modified of the Object 

* **Size Limit:** The size limit for LC Object is 128K.
* **synchronous/asynchronous operation:** Most of the code in Android platform works on the main thread while if there is any time-consuming blocking operation, like access to the network, your code may not be working properly. To avoid this, you can change the synchronous operation that may cause blocking into asynchronous operation and run it in a background thread, e.g. saveInBackground() is the asynchronous version of save(), and it requires a parameter - a callback instance - which will be executed once the asynchronous operation is done. There are also corresponding asynchronous versions for operations like query, update and delete. 
* The name of the key should be alphabetic characters while the type can be letters, numbers, Boolean, arrays, LCObject and any other types that support JSON. 
* You can provide the second parameter, SaveCallback instance, when invoking `LCDataManager.saveInBackground()` to check if the creation is succeeded. 

	```java
	LCDataManager.saveInBackground(myComment, new SaveCallback() {
	  @Override
	  public void done(LCException e) {
	    if(e==null){
	      // Succeeded
	    } else{
	      // Failed
	    }
	  }
	});
```

###Query
#####LCObject Query
You can get the complete `LCObject` with the ObjectId of any piece of data. There are three required parameters for invoking `LCQueryManager.getInBackground()`: class name of the object, ObjectId and callback function, which would be invoked in getInBackground() method.


```java
String objId="OBJECT_ID";
LCQueryManager.getInBackground("Comment", objId, new GetCallback<LCObject>() {

  @Override
  public void done(LCObject Object, LCException e) {
    // Object is the target one

  }
});
```

Or, you can get LCObject with "paramater value + LCQuery": 

```java
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereMatches("isRead",false);

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
  @Override
  public void done(List<LCObject> list, LCException e) {
    // list is the target one
  }
});
```

If you only need the first piece of data of Query results, please invoke `LCQueryManager.getFirstInBackground()` method: 

```java
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereMatches("pubUserId","USER_ID");

LCQueryManager.getFirstInBackground(query, new GetCallback<LCObject>() {
  @Override
  public void done(LCObject LCObject, LCException e){
    // LCObject is the target one
  }
});
```


#####LCObject Parameter Value Query 
LCObject Parameter Value Query
You can invoke getType method in relative with the data type to get value from the LCObject instance:

```java
int pubUserId = comment.getInt("pubUserId");
String content = comment.getString("content");
boolean isRead = comment.getBoolean("isRead");
```

###Update
Two steps are required to update LCObject: the first is to get the target LCObject and the second is to edit and save. 

```java
// Get LCObject with objectId
String objId="OBJECT_ID";
LCQueryManager.getInBackground(query, objId, new GetCallback<LCObject>() {

  @Override
  public void done(LCObject comment, LCException e) {
    if (e == null) {
      // Mark the comment as read
      comment.put("isRead", true);
      LCDataManager.saveInBackground(comment);
    }
  }
});
```

###Delete 
#####Delete LCObject
You can delete LCObject with `LCDataManager.deleteInBackground()` method. To ensure the delete, please use DeleteCallback to handle the delete results.

```java
LCDataManager.deleteInBackground(comment);
```

#####Batch Delete 
You can delete LCObject, a `List<LCObject>` instance, with `LCDataManager.deleteInBackground()` method. 

```java
List<LCObject> objects = ...
LCDataManager.deleteAllInBackground(objects);
```

#####Delete a Property of LCObject Instance
Except from deleting a whole object instance, you can delete any target value in the instance. Note that the edition can only be synchronized to cloud with invocation of saveInBackground().

```java
// Remove isRead property from the instance
comment.remove("isRead");
// Save 
LCDataManager.saveInBackground(comment.remove);
```

### Counter

Counter is one of the most regular functional requirements. When the property of a certain parameter value type is updated frequently and each update is about to add up a parameter value, then we can make use of Counter to complete the operation with more efficiency. This will also avoid the conflict and override caused by frequent data edition requirements.

For example, the "score" in a game is modified frequently. If there are multiple clients request the modifications at the same time and we need to request the data from clients and save the modifications to the cloud, there may easily be some conflicts and override.

#####Incremental Counter
At this point, we may use `increment()` method (default increment will be 1) and update counter type properties more efficiently and securely. For example, we can invoke following method to update the "score" in a game: 

```java
gameScore.increment("score");
LCDataManager.saveInBackground(gameScore);
```
#####Specified Increment 

```java
gameScore.increment("score",1000);
LCDataManager.saveInBackground(gameScore);
```

Note that increment doesn't need to be integer, value of a floating-point type is also acceptable. 
#####Decremental Increment 

```java
gameScore.decrement("score",1000);
LCDataManager.saveInBackground(gameScore);
```

###Array

You can save the value of arry type to any parameter of LCObject (like the skills parameter in this instance):

#####Add To the End of the Array
You can add one or more value to the end of the `skills` parameter value with `add()` and `addAll()`.

```java
gameScore.add("skills", "driving");
gameScore.addAll("skills", Arrays.asList("flying", "kungfu"));
LCDataManager.saveInBackground(gameScore);
```

Meanwhile, you can only add values that is different from all current items with `addUnique()` and `addAllUnique()`. 

#####Override with new Array
The value of array under `skills` parameter will be overridden by invoking `put()` function: 

```java
gameScore.put("skills", Arrays.asList("flying", "kungfu"));
LCDataManager.saveInBackground(gameScore);
```
#####Delete the Value of Any Array Property
The value of array under `skills` parameter will be cleared by invoking `removeAll()` function: 

```java
gameScore.removeAll("skills");
LCDataManager.saveInBackground(gameScore);
```

Notice: 

* Remove and Add/Put must be seperated for invoking save function. Or, the data may fail to be saved.

###Associated Data
An object can be associated to other objects. As mentioned before, we can save the instance A of a LCObject as the parameter value of instance B of another LCOject. This will easily solve the data relational mapping of one-to-one and one-to-many, like the relation between primary key & foreign key.

Notice: Leap Cloud handles this kind of data reference with Pointer type. For data consistency, it won't save another copy of data A in data B sheet.

####One-to-one Association
For example, a tweet may correspond to many comments. You can create a tweet and a corresponding comment with followign code: 

```JAVA
// Create a Tweet
LCObject myPost = new LCObject("Post");
myPost.put("content", "This is my first tweet, nice meeting you guys.");

// Create a Comment
LCObject myComment = new LCObject("Comment");
myComment.put("content", "This is a good one.");

// Add a relative Tweet
myComment.put("post", myWeibo);

// This will generate two pieces of data: tweet and comment
LCDataManager.saveInBackground(myComment);
```

Or, you can associate existing object with obejctId: 

```java
// Associate the comment with the tweet whose objectId is 1zEcyElZ80 
myComment.put("parent", LCObject.createWithoutData("Post", "1zEcyElZ80"));
```

The relative LCObject won't be got by defalut when you get a object. Aside from the objectId, other parameter values are all blank. You need to invoke fetch method if you want to get all parameter data of relative object (Suppose that Comment instance is already got with LCQuery in following case):

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

####One-to-many Association
Associate two comments to one tweet ：

```java
// Create a Tweet
LCObject myPost = new LCObject("Post");
myPost.put("content", "This is my first tweet, nice meeting you guys.");

// Create a Comment
LCObject myComment = new LCObject("Comment");
myComment.put("content", "This is a good one.");

// Create another Comment
LCObject anotherComment = new LCObject("Comment");
anotherComment.put("content", "This is a good one.");

// Put those two comments into a same list 
List<LCObject> listComment = new ArrayList<>();
listComment.add(myComment);
listComment.add(anotherComment);

// Associate those two comments in a tweet
myPost.put("comment", listComment);

// This will generate two piece of data: tweet and comment
LCDataManager.saveInBackground(myComment);
```

Notice: 

* For java 6 and earlier, please create listComment with `List<LCObject> listComment = new ArrayList<LCObject>()`. 
* You can also add LCObject individually to properties with `add()` method: 

	```java
	myPost.add("comment", myComment);
	myPost.add("comment", anotherComment);
	```

####Realize Association with LCRelation

You can create many-to-many modeling with LCRelation. This is similar to chained list while LCRelation doesn't need to get all relative LCRelation instances when getting additional attributes. As a result, LCRelation can support more instances than chained list and the read is more flexible. For example, a user can like many posts. In this case, you can save all posts liked by this user with `getRelation()`. For creating a new liked post:


```java
LCUser user = LCUser.getCurrentUser();
//Create LCRelation instance, likes, in user instance
LCRelation<LCObject> relation = user.getRelation("likes");
//Adding association, post, in likes
relation.add(post);
LCUserManager.saveInBackground(user);
```

You can remove a Post from LCRelation:

```java
relation.remove(post);
```

The object collections in the relation won't be got by default. You can get post chained list with LCQuery objects acquired with get Query as well as its findInBackground() method, as shown below:

```java
LCQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<LCObject>() {

    @Override
    public void done(List<LCObject> results, LCException e) {
         if (e != null) {
          } else {
            // results includes all relative objects in relation
          }
    }
});
```

If you only want to get a subset of the chained list, please add more constraints to getQuery 
如果您只想获取链表的一个子集合，您可以添加更多的约束条件到 getQuery 返回 LCQuery 对象上（这一点是直接使用 List 作为属性值做不到的），例如：

```java
LCQuery<LCObject> query = relation.getQuery();
// Add more query constraints to query object
query.skip(10);
query.limit(10);
```

Please check [Query Guide](..) for more LCQuery information. An operating LCRelation object is similar to the object chained list, so any queries towards the chained list can also be implemented to LCRelation.


###Data Type

We support object type like String, Int, Boolean and LCObject by now; data type like java.util.Date、byte[] array、JSONObject、JSONArray. You can embed a JSONObject in  JSONArray object and save it to LCObject. For instance:


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
```

Large binary data is not recommended, like the byte[] property type of LCObject is not suitable for images or files. The size limit for LCObject is 128KB. If you need to store large files like images, files and music, LCFile is highly recommended and here is the [Guide](..). Please check [Data Security Guide](...) for more informations on handling data.

## Files
###Creation and Upload of LCFile
LCFile can help your app save the files to server, like the common image, video, audio and any other binary data.

In this instance, we will save the image as LCFile and upload it to server:

```java
public void UploadFile(Bitmap img){
  // transfer the Bitmap into binary data byte[]
  Bitmap bitmap = img;
  ByteArrayOutputStream stream = new ByteArrayOutputStream();
  bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
  byte[] image = stream.toByteArray();
  
  // Create LCFile Object
  LCFile myFile = new LCFile("myPic.png", image);
  
  // Upload
  LCFileManager.saveInBackground(myFile, new SaveCallback() {
    @Override
    public void done(LCException e) {

    }
  });
}
```

Notice:

* 	LCFile 构造函数的第一个参数指定文件名称，第二个构造函数接收一个 byte 数组，也就是将要上传文件的二进制。您可以通过以下代码，获取文件名：

	```java
	String fileName = myFile.getName();
	```
* 	You can save LCFile to the property of other objects and bring it back later. 	 
	
	```java
	//Create a LCObject，including ImageName，ImageFile
	LCObject imgupload = new LCObject("ImageUploaded");
	imgupload.put("ImageName", "testpic");
	imgupload.put("ImageFile", file);

	//Save
	LCDataManager.saveInBackground(imgupload, new SaveCallback() {
		@Override
		public void done(LCException e) {
		}
	});
	```

###Upload Process
Aside from providing a SaveCallback to inform the upload failure or success, the saveInBackground() method of LCFile can also provide a second ProgressCallback object to inform the upload process:


```java
LCFileManager.saveInBackground(file, new SaveCallback() {
	@Override
	public void done(LCException e) {
			
        }
	},new ProgressCallback() {
	@Override
	public void done(int i) {
			// print process
          System.out.println("uploading: " + i);
        }
});
```

###Download Files

#####Download Directly
1. Assign LCFile with LCObject
2. Invoke LCFileManager.getDataInBackground() to download：

```java
LCFile myFile=imgupload.getLCFile("testpic");
LCFileManager.getDataInBackground(myFile, new GetDataCallback() {
	@Override
	public void done(byte[] bytes, LCException e) {

        }
});
```

#####Get URL of a File for Auto Downlaod:

```java
String url = myFile.getUrl();
```

###Delete Files
Deleting files is not available by now.


## Query

###Basic Query

使用LCQuery查询LCObject分三步：

1. 创建一个 LCQuery 对象，并指定对应的"LCObject class"；
2. 为LCQuery添加不同的条件；
3. 执行LCQuery：使用 `LCQueryManager.findAllInBackground()` 方法结合FindCallback 回调类来查询与条件匹配的 LCObject 数据。

例如，查询指定人员的信息，使用 whereEqualTo 方法来添加条件值：

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
//筛选篮球队：选择胜率超过50%的篮球队
teamQuery.whereGreaterThan("winPct", 0.5);
LCQuery<LCUser> userQuery = LCUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(userQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
    // results中包含胜率超过50%的篮球队所在地的用户
  }
});
```

相应的，您可以通过whereDoesNotMatchKeyInQuery方法，获取家乡**不在**指定篮球队所在地的用户。

```java
LCQuery<LCUser> anotherUserQuery = LCUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
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
LCQuery<LCObject> query = LCQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

####值类型为LCObject查询

#####LCObject类型字段匹配LCObject

如果您想获取某个字段匹配特定 LCObject 的数据，您可以像查询其他数据类型那样使用 whereEqualTo 来查询。例如，如果每个 Comment 对象都包含一个 Post 对象（在 post 字段上），您可以获取特定 Post 的所有 Comment 列表：

```java
// 假设 LCObject myPost 已经在前面创建
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
public void done(List<LCObject> commentList, LCException e) {
 // commentList now has the comments for myPost
}
});
```
#####LCObject类型字段匹配Query
如果您想查询的对象的某个字段包含了一个 LCObject，并且这个 LCObject 匹配一个不同的查询，您可以使用 whereMatchesQuery 嵌套查询方法。请注意，默认的 limit 限制 100 也同样作用在内部查询上。因此如果是大规模的数据查询，您可能需要仔细构造您的查询对象来获取想要的行为。例如，为了查询有图片附件的 Post 的评论列表：

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

反之，不想匹配某个子查询，您可以使用 whereDoesNotMatchQuery 方法。 比如为了查询没有图片的 Post 的评论列表：

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
#####返回指定LCObject类型的字段
默认情况下，当您获取一个对象的时候，关联的 LCObject 不会被获取，但您可以使用 include 方法将其返回。例如。您想获取最近的 10 条评论，同时包括它们关联的 post：

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

如果您只是想统计有多少个对象满足查询，您并不需要获取所有匹配的对象，可以直接使用 count 替代 find。例如，查询一个账户发了多少微博：

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
经常需要缓存一些查询的结果到磁盘上，这可以让您在离线的时候，或者应用刚启动，网络请求还没有足够时间完成的时候可以展现一些数据给用户。LeapCloud 会自动清空缓存，当缓存占用了太多空间的时候。

默认情况下的查询不会使用缓存，除非您使用 setCachePolicy 方法明确设置启用。例如，尝试从网络请求，如果网络不可用则从缓存数据中获取，可以这样设置：

```java
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

缓存策略|介绍
---|---
IGNORE_CACHE | 默认的缓存策略，查询不走缓存，查询结果也不存储在缓存。
CACHE_ONLY | 查询只从缓存获取，不走网络。如果缓存中没有结果，引发一个 LCException。
NETWORK_ONLY | 查询不走缓存，从网路中获取，但是查询结果会写入缓存。
CACHE\_ELSE_NETWORK | 查询首先尝试从缓存中获取，如果失败，则从网络获取，如果两者都失败，则引发一个 LCException。
NETWORK\_ELSE_CACHE | 查询首先尝试从网络获取，如果失败，则从缓存中查找；如果两者都失败，则应发一个 LCException。
CACHE\_THEN_NETWORK | 查询首先尝试从缓存中获取，然后再从网络获取。在这种情况下，FindCallback 会被实际调用两次 -- 首先是缓存的结果，其次是网络查询的结果。这个缓存策略只能用在异步的 findInBackground() 方法中。

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

##LCObject子类

LeapCloud 希望设计成能让人尽快上手并使用。您可以通过 LCDataManager.fetchInBackground() 方法访问所有的数据。但是在很多现有成熟的代码中，子类化能带来更多优点，诸如简洁、可扩展性以及 IDE 提供的代码自动完成的支持等等。子类化不是必须的，您可以将下列代码转化：

```java
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

###创建LCObject子类

创建一个 LCObject 的子类很简单：

1.   首先声明一个子类继承自 LCObject。
2.   添加@LCclassName注解。它的值必须是一个字符串，也就是您过去传入 LCObject 构造函数的类名。这样以来，后续就不需要再在代码中出现这个字符串类名。
3.   确保您的子类有一个 public 的默认（参数个数为 0）的构造函数。切记不要在构造函数里修改任何 LCObject 的字段。
4.   在调用 LCConfig.initialize() 注册应用之前，注册子类 LCObject.registerSubclass(Yourclass.class).

下列代码成功实现并注册了 LCObject 的子类 Armor:

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

您可以很容易地添加访问器和修改器到您的 LCObject 子类。像平常那样声明字段的 getter 和 setter 方法，但是通过 LCObject 的 get 和 put 方法来实现它们。下面是这个例子为 Post 类创建了一个 content 的字段：

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

各种数据类型的访问器和修改器都可以这样被定义，使用各种 get()方法的变种，例如 getInt()，getLCFile()或getMap().

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
您可以使用您自定义的构造函数来创建您的子类对象。您的子类必须定义一个公开的默认构造函数，并且不修改任何父类 LCObject 中的字段，这个默认构造函数将会被 SDK 使用来创建子类的强类型的对象。

要创建一个到现有对象的引用，可以使用 LCObject.createWithoutData():

```java
Armor armorReference = LCObject.createWithoutData(Armor.class, armor.getObjectId());
```

###子类的查询
您可以通过静态方法静态方法LCQuery.getQuery()获取特定的子类的查询对象。下面的例子用以查询用户可购买的所有防具：

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

###字段说明
LCUser 除了从 LCObject 继承的属性外，还有几个特定的属性：

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
* 和其他 LCObject 对象不同的是，在设置 LCUser 这些属性的时候不是使用的 put 方法，而是专门的 setXXX 方法。
* 系统会自动收集masterKey，installationIds的值。

###注册用户

1. 创建LCUser对象，并提供必需的username和password
2. 利用LCUserManager.signUpInBackground()保存至云端。

```java
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
});
```
注意：

* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 signUpInBackground() 方法，而不是 saveInBackground() 方法。另外还有各种不同的 signUp 方法。像往常一样，我们建议在可能的情况下尽量使用异步版本的 signUp 方法，这样就不会影响到应用程序主 UI 线程的响应。您可以阅读 API 中更多的有关这些具体方法的使用。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 Email 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 Email 地址，以后在用户忘记密码的情况下可以使用 LeapCloud 提供的重置密码功能。

###登录
您可以通过LCUserManager.logInInBackground()方法登录。字段说明：第一个参数为用户名，第二个参数为密码，第三个参数为回调方法LogInCallback().

```java
LCUserManager.logInInBackground("userName", "passWord", new LogInCallback<LCUser>() {
  public void done(LCUser user, LCException e) {
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
LCUser currentUser = LCUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

当然，您也可以使用如下方法清除缓存用户对象：

```java
LCUser.logOut();
LCUser currentUser = LCUser.getCurrentUser(); //此时，crrentUser将为null
```

###重置密码

如果用户忘记密码，LeapCloud提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```java
LCUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LCException e) {
        if (e == null) {
            // 重置密码的邮件已发出
        } else {
        }
    }
});
```
如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

* 用户输入他们的电子邮件，请求重置自己的密码。
* LeapCloud 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个LC的页面，输入一个新的密码。
* LeapCloud 将用户的密码重置为新输入的密码。

###查询用户

您可以通过特殊的UserQuery查询用户数据。LeapCloud对用户数据安全性提供充分的保障，如需获取更多信息，请移步至[用户对象的安全性](..)。

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

###邮箱验证

LeapCloud提供强大的邮箱验证服务，您只需在Console >> App Settings >> Email Settings中Enable "Verify user's email address", 系统便会自动在LCUser中添加`emailVerified`字段。并且，当LCUser的email字段被赋值或者修改, 且`emailVerified`字 字段的值为false. LeapCloud便会自动向用户发送一个链接，用户点击链接后便会将`emailVerified`设置为true.

`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

###匿名用户
匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 LeapCloud 提供的匿名用户系统来实现您的功能。

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

您可以选择让系统自动创建匿名用户（本地创建，无需网络连接）, 以便立即开始使用应用. 设置自动创建匿名用户后, LCUser.getCurrentUser()将永远不为null。 然而，当您在存储与该匿名用户相关的LCObject时，LeapCloud会在云端创建该匿名用户。

#####如何自动创建匿名用户
在主Application的onCreate()方法中添加：

```java
LCUser.enableAutomaticUser();
```

### 在Console中管理用户

User 表是一个特殊的表，专门存储 LCUser 对象。在Console >> Users中，您会看到一个 _User 表。更多信息，请移步至[Console用户手册](...)中查看。

##用户角色
随着用户数量的增长，使用角色进行权限管理将更有效。所有赋予某一角色的权限，将被该角色包含的用户所继承。用户角色是一组用户的集合，同时，一个用户角色也可以包含另一个用户角色。在LeapCloud中有一个对应的`_Role` class来存储用户角色。

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

##数据安全

### LCObject的安全性
用户在创建LCObject时都存在一个ACL字段，只有在ACL名单上的用户(LCUser)或者角色(LCRole)才能被允许访问。如果用户不显式地设置ACL，系统将自动为其分配默认的ACL.

#####ACL
ACL相当于为每一个数据创建的允许访问的白名单列表。一个 User 必须拥有读权限（或者属于一个拥有读权限的 Role）才可以获取一个对象的数据，同时，一个 User 需要写权限（或者属于一个拥有写权限的 Role）才可以更改或者删除一个对象。 如，一条典型的ACL数据：

```{"553892e860b21a48a50c1f29":{"read":true,"write":true}}```

表明ObjectId为"553892e860b21a48a50c1f29"的用户，可以读取和修改该LCObject.

#####默认访问权限

在没有显式指定的情况下，LeapCloud 中的每一个对象都会有一个默认的 ACL 值。这个值代表了，所有的用户，对这个对象都是可读可写的。此时您可以在数据管理的表中 ACL 属性中看到这样的值:

```{"*":{"read":true,"write":true}}```

您可以根据需要，修改默认ACL的值：

```java
LCACL defaultACL = new LCACL();
defaultACL.setPublicReadAccess(true);
defaultACL.setPublicWriteAccess(false);
LCACL.setDefaultACL(defaultACL, true);
```

`LCACL.setDefaultACL()`的第二个参数设置为true，代表默认将该用户的读取和访问权限添加到该defaultACL上。反之则否。

#####设置仅创建用户可见
您可以将一个LCObject设置为仅创建用户可读取或修改：首先，用户需要登录后创建LCObject，并且为其添加如下ACL属性：

```java
LCObject privateNote = new LCObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LCACL(LCUser.getCurrentUser()));
LCDataManager.saveInBackground(privateNote);
```
此时，该LCObject - "privateNote"仅该用户可见。且该用户在任何设备上登录，都可以读取或修改该对象。

#####为其他用户设置访问权限
您可以使用setReadAccess 和 setWriteAccess将**指定用户**的读写权限添加到LCObject的ACL中。

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
```

#####为角色设置访问权限
您可以使用setRoleWriteAccess 和 setRoleWriteAccess将**指定角色**的读写权限添加到LCObject的ACL中。

如，为一组用户添加读取和修改的权限：

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
LCObject myMessage = new LCObject("Message");
LCACL myACL = new LCACL();
// 为所有用户添加读取权限
myACL.setPublicReadAccess(true);
// 为Moderators 角色添加修改权限
myACL.setRoleWriteAccess("Moderators");
myMessage.setACL(myACL);
```	

#####为所有用户设置访问权限
您可以使用setPublicReadAccess 和 setPublicWriteAccess将**所有用户**的读写权限添加到LCObject的ACL中
```java
LCObject publicPost = new LCObject("Post");
LCACL postACL = new LCACL();
postACL.setPublicReadAccess(true);
postACL.setPublicWriteAccess(false);
publicPost.setACL(postACL);
LCDataManager.saveInBackground(publicPost);
```

### 用户对象的安全性

LeapCloud对用户对象的安全性进行了规范。默认情况下，存储在用户对象中的数据，只能被该用户本身修改。客户端可以读取其他用户的数据，但无权限修改或删除。所以，只有用户登录后所获取的用户对象，才能被修改。

以下例子很好的描绘了用户对象的安全性:

```java
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
```
### 角色对象的安全性

与其他LCObject一样，LCRole对象也使用ACL来控制其访问权限。不同的是，LCRole需要显示地设置ACL. 通常，只有系统管理人员，或其他高权限人员可以有权限创建或修改角色，所以在创建LCRole的同时，您需要设置其访问权限。

如:

```java
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
```

##第三方登录

为简化用户的注册及登录流程，并且集成LC应用与Facebook, Twitter等应用，LeapCloud提供了第三方登录应用的服务。您可以同时使用第三方应用SDK与LC SDK，并将LCUser与第三方应用的用户ID进行连接。

###使用Facebook账号登录
Facebook的Android SDK，帮助应用优化登录体验。对于已经安装Facebook应用的设备，LC应用可通过设备上的Facebook用户凭据，直接实现用户登录。对于未安装Facebook应用的设备，用户可以通过一个标准化的Facebook登录页面，提供相应的登录信息。

使用Facebook账号登录后，如果该Facebook用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Facebook开发者中心](https://developers.facebook.com)创建Facebook应用。点击My Apps >> Add a New App
2. 打开LeapCloud Console >> App Settings >> User Authentication.勾选Allow Facebook Authentication. 并将步骤一中获取的Facebook Application ID 和 App Secret填写至相应位置。
3. 集成Facebook SDK，添加Facebook Login按钮。详细步骤，请参考[Add Facebook Login to Your App or Website](https://developers.facebook.com/docs/facebook-login/v2.4)
4. 在项目的Application.onCreate()函数中，于LCConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：

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
####登录并注册新LCUser
使用Facebook账号登录后，如果该Facebook用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户，并与其绑定。如：

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

详细登录流程为：

* 用户通过Facebook SDK提供的Login with Facebook界面登录Facebook
* Facebook验证登录信息，并返回结果.
* LeapCloud SDK接受结果，并保存至LCUser. 如果该Facebook用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户.
* 调用LC的LogInCallback登录该LCUser.

####绑定LCUser与Facebook账号
您可以通过以下方式，绑定已有的LC账号和Facebook账号：

```java
if (!LCFacebookUtils.isLinked(user)) {
    LCFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCFacebookUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，LeapCloud将会把该Facebook账号的信息更新至该LCUser中。下次再使用该Facebook账号登录应用时，LeapCloud将检测到其已绑定LCUser，便不会为该Facebook账号添加新的LCUser.

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
解除绑定成功后，LeapCloud将会把该Facebook账号的信息从该LCUser中移除。下次再使用该Facebook账号登录应用时，LeapCloud将检测到其未绑定LCUser，便会为该Facebook账号添加新的LCUser.

###使用Twitter账号登录
与Facebook类似，Twitter的Android SDK，也能帮助应用优化登录体验。对于已经安装Twitter应用的设备，LC应用可通过设备上的Twitter用户凭据，直接实现用户登录。对于未安装Twitter应用的设备，用户可以通过一个标准化的Twitter登录页面，提供相应的登录信息。

使用Twitter账号登录后，如果该Twitter用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户，并与其绑定。
####准备工作
1. 在[Twitter开发者中心](...)创建Twitter应用。点击My Apps >> Add a New App
2. 打开LeapCloud Console >> App Settings >> User Authentication.勾选Allow Twitter Authentication. 并将步骤一中获取的Twitter consumer Key填写至相应位置。
3. 集成Twitter SDK，添加Twitter Login按钮。详细步骤，请参考[Add Twitter Login to Your App or Website](...)
4. 在项目的Application.onCreate()函数中，于LCConfig.initialize(this, APP_ID, API_KEY)之后，添加如下代码：

```java
LCTwitterUtils.initialize("YOUR Twitter CUSUMER KEY");
```
5. 	在所有调用Login with Twitter的Activity中的onActivityResult()函数中添加如下代码，已完成验证。

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LCTwitterUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####登录并注册新LCUser
使用Twitter账号登录后，如果该Twitter用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户，并与其绑定。如：

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

详细登录流程为：

* 用户通过Twitter SDK提供的Login with Twitter界面登录Twitter
* Twitter验证登录信息，并返回结果.
* LeapCloud SDK接受结果，并保存至LCUser. 如果该Twitter用户Id并未与任何LCUser绑定，LeapCloud将自动为该创建一个用户.
* 调用LC的LogInCallback登录该LCUser.

####绑定LCUser与Twitter账号
您可以通过以下方式，绑定已有的LC账号和Twitter账号：

```java
if (!LCTwitterUtils.isLinked(user)) {
    LCTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCTwitterUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，LeapCloud将会把该Twitter账号的信息更新至该LCUser中。下次再使用该Twitter账号登录应用时，LeapCloud将检测到其已绑定LCUser，便不会为该Twitter账号添加新的LCUser.

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
解除绑定成功后，LeapCloud将会把该Twitter账号的信息从该LCUser中移除。下次再使用该Twitter账号登录应用时，LeapCloud将检测到其未绑定LCUser，便会为该Twitter账号添加新的LCUser.

##地理位置

LeapCloud提供LCGeoPoint对象，帮助用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。

####LCGeoPoint字段说明

####创建LCGeoPoint
LCGeoPoint需要提供两个参数：第一个为纬度(正为北纬)，第二个参数为经度(正为东经)。

```java
//创建北纬40度，西经30度的LCGeoPoint
LCGeoPoint point = new LCGeoPoint(40.0, -30.0);
```

该LCGeoPoint对象可悲存储在LCObject中：

```java
myShop.put("location", point);
```
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

```java
LCGeoPoint southwestOfSF = new LCGeoPoint(37.708813, -122.526398);
LCGeoPoint northeastOfSF = new LCGeoPoint(37.822802, -122.373962);
LCQuery<LCObject> query = LCQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
LCQueryManager.findAllInBackground(new FindCallback<LCObject>() { ... });
```