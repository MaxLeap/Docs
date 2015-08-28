# Cloud Data
## Introduction

### What is Cloud Data
Cloud Data is the data storage service provided by Leap Cloud. It is based on the `LCObject` and each `LCObject` contains several key-values. All `LCObject` are stored in Leap Cloud, you can perform operations towards them with iOS/Android Core SDK. Besides, Leap Cloud  provides some special objects, like `LCUser`, `LCRole`, `LCFile` and `LCGeoPoint`. They are all based on `LCObject`.


### Why is Cloud Data Nccessary
Cloud Data can help you build and maintain the facility of your database, thus focus on the app service logic that brings real value.  The advantages can be summarized as follows:

* Sort out the deployment and maintenance of hardware resourses.
* Provide standard and complete data access API
* Unlike the traditional relational database, there's no class to be created ahead of time before storing data in cloud. Data objects in JSON format can be stored and retrieved easily as you wish.
* Realize the Hook of cloud data with the Cloud Code service.（Please check [Cloud Code Guide](。。。) for more details.）

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

Notices:

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

Notices: 

* Remove and Add/Put must be seperated for invoking save function. Or, the data may fail to be saved.

###Associated Data
An object can be associated to other objects. As mentioned before, we can save the instance A of a LCObject as the parameter value of instance B of another LCOject. This will easily solve the data relational mapping of one-to-one and one-to-many, like the relation between primary key & foreign key.

Notices: Leap Cloud handles this kind of data reference with Pointer type. For data consistency, it won't save another copy of data A in data B sheet.

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

Notices: 

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

If what you need is just a subset of the list, you can add more constrains to the LCQuery object returned by getQuery, which will be impossible for taking `List` as property.e.g.

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

Notices:

* 	LCFile construct function use the first parameter to specify FileName, and the seconde parameter to accept a Byte Array, which is the binary format of the file to upload. You can get the file name via following code:

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

LCQuery towards LCObject can be summarized as 3 steps:

1. Create a LCQuery and assign corresponding "LCObject class";
2. Add different conditions for LCQuery;
3. Execute LCQuery：Inquire matching LCQuery data with `LCQueryManager.findAllInBackground()` and FindCallback callback class.

For example, to inquire target personnel data, you can use whereEqualTo to add conditional values:

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

###Query Term

#####Set Query Term
You can use whereNotEqualTo method to filter values of specific keys. For example, you can invoking following code to inquire data whose isRead is not true:
```java
query.whereNotEqualTo("isRead", true);
```

You can add multiple constraints in the query (the relation is "and") to filter data.

```java
query.whereNotEqualTo("isRead", true);
query.whereGreaterThan("userAge", 18);
```

#####Set Results Number Limit
You can set the number of your query results using setLimit method. The limit is 100 by default and the maxmium number is 1,000. All number outside the scope of 0 to 1,000 will be forcibly set to 100.

```java
query.setLimit(10); // Set the max query results number as 10
```

You can execute Query with LCQueryManager.getFirstInBackground() to get the first result of the query.

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

#####Sort the Results
In regard to the number or string type, you can sort the query results in ascending or descending order:

```java
// Sorts the results in ascending order by the score field
query.orderByAscending("score");
 
// Sorts the results in descending order by the score field
query.orderByDescending("score");
```

#####Set Numeric Value Limit
In regard to the number type, you can filter the data based on the numeric value.

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

#####Set Properties of Data Returned

You can set the properties of data returned using selectKeys (stock properties are included automatically, like objectId, createdAt and updatedAt):

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

In regard to the LCObject returned, you can get the other properties using LCDataManager.fetchInBackground().

```java
LCObject object = results.get(0);
LCDataManager.fetchInBackground(object, new GetCallback<LCObject>() {

    @Override
    public void done(LCObject object, LCException exception) {
        // all fields of the object will now be available here.
    }
});
```

#####Set More Constraints
Paging display is an acceptable solution if there are too much data. setSkip can skip first part of data and realize the paging display.

```java
query.setSkip(10); // skip the first 10 results
```

If you want to inquire the data matching different values, like the account info of "Jonathan Walsh", "Dario Wunsch", "Shawn Simon" (similar to the in query in SQL), please use whereContainedIn method.

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereContainedIn("playerName", Arrays.asList(names));
```

Conversely, if you want to inquire the account info apart from "Jonathan Walsh", "Dario Wunsch" and "Shawn Simon" (similar to the not in query in SQL), please use the whereNotContainedIn method.

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereNotContainedIn("playerName", Arrays.asList(names));
```

You can use whereExists to inquire data carrying certain properties and whereDoesNotExist to inquire data not carrying certian properties.

```java
// Inquire objects with "score" property 
query.whereExists("score");
 
// Inquire objects without "score" property
query.whereDoesNotExist("score");
```

You can use the whereMatchesKeyInQuery method to get objects where a key matches the value of a key in a set of objects resulting from another query.

For example, there is a class named "Team" for storing the basketball team info and another class name "User" for storing user info. “city” in the Team is the location of the basketball team and the "hometown" in the User refers to their hometowns. Then you can search the users from the same place as the basketball team with following Query.


```java
LCQuery<LCObject> teamQuery = LCQuery.getQuery("Team");
//Filter basketball team: winning percentage is no less than 50%
teamQuery.whereGreaterThan("winPct", 0.5);
LCQuery<LCUser> userQuery = LCUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(userQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
    // Users from the same place as the basketball team whose winning percentage is no less than 50% in the results
  }
});
```

Relatively, you can find users from other places with whereDoesNotMatchKeyInQuery.

```java
LCQuery<LCUser> anotherUserQuery = LCUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
LCQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<LCUser>() {
    
  @Override
  public void done(List<LCUser> results, LCException e) {
    // users from other places in the results 
  }
});
```

###Query Towards Different Property Value Types

####Query towards array value type

If the key value is an array, then you can inquire all objects containing "208" from the Key array with:

```java
// Find objects where the array in arrayKey contains the number 2.
query.whereEqualTo("arrayKey", 2);
```

Similarly, you can inquire all objects containing 2, 3 and 4 from the Key array with:

```java
// Find objects where the array in arrayKey contains all of the numbers 2, 3, and 4.
ArrayList<Integer> numbers = new ArrayList<Integer>();
numbers.add(2);
numbers.add(3);
numbers.add(4);
query.whereContainsAll("arrayKey", numbers);
```

####Query towards String Value Type
Use whereStartsWith method to add constrain that the string begins with another string. Much similar to LIKE query in MySQL. Query like this will be executed via indexing, so it will be highly efficient when it comes to big data.

```java
// Finds barbecue sauces that start with "Big Daddy's".
LCQuery<LCObject> query = LCQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

####Query towards LCObject Value Type

#####LCObject-type property matches another LCObject

If you want to get the data whose certain property matches specific LCObject, you can inquire with whereEqualTo like others. For example, if every Comment object includes a Post object (in post property), then you can get all Comment lists of specific Post: 

```java
// suppose that LCObject myPost is created before
LCQuery<LCObject> query = LCQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() {
public void done(List<LCObject> commentList, LCException e) {
 // commentList now has the comments for myPost
}
});
```
#####LCObject-type property matches Query
If any property of the query object contains a LCObject and this LCObject matches a different query, then you can use the nested query, whereMatchesQuery. Please note that the default limit 100 works on inner query as well. Thus, you need to construct your query object well if there's massive data query. For example, inquire the comment list of post with images: 


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

Conversely, you can use whereDoesNotMatchQuery if you don't want to match some subquery. For example, inquire the comment list of post without images: 

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
#####Return Property of Specified LCObject Type 
The associated LCObject won't be got by default when you got a object, but you can choose to return it with include method. For example, if you want to get most recent 10 comments and the associated posts:

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

You can use dot operator to include multiple embedded objects. For example, if you want to include an author object of a comment (suppose that the corresponding value of the author is LCUser instance), you can do as shown below: 

```java
query.include("post.author");
```
###Count Query

If you don't want to get all matching objects, but just the count, then you can replace the find with count. e.g. inquire how many tweets did an account post:

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

###Compound Query

You can inquire data that matches multiple Query with LCQuery.or. For example, you can get the gamers who win more than 90 times or less than 10 times with following method: 

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
    // win more than 90 times or less than 10 times
  }
});
```

###Cache Query
Some query results should be cached to the disk in order to show data to users while offline, like the app is just opened, netowrk request is not accomplished. Leap Cloud will clear cache autmatically if it takes too much space. 
Query will not use cache by default unless you set the option with setCachePolicy. for example, you can do following settings if there's no network available for you to request:
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
Leap Cloud provides several cache strategies:

Cache Strategy|Introduction
---|---
IGNORE_CACHE | default cache strategy. The query won't use cache and the query results won't be stored in cache.
CACHE_ONLY | The query is only got from cache, not the network.If the cache has no results, then it will bring about a LCException.
NETWORK_ONLY | The query is only got from network, not the cache, but the query results will be writen into cache.
CACHE\_ELSE_NETWORK | The query is first got from cache, then the network if there's no cache. If both of them fail, then it will bring about a LCException.
NETWORK\_ELSE_CACHE | The query is first got from network, then the cache if there's no network. If both of them fail, then it will bring about a LCException.
CACHE\_THEN_NETWORK | The query is first got from cache, then the network. FindCallback will be invoked twice in this case: first the cache results, then the network query results. This strategy can only be used in asynchronous findInBackground().

You can operate cache with LCQuery if you want to control the cache and you can do following operations towards the cache:

#####Check if there's any cached results: 
```java
boolean isInCache = query.hasCachedResult();
```

#####Delete cached results:

```java
query.clearCachedResult();
```

#####Delete cached results of all queries:

```java
LCQuery.clearAllCachedResults();
```

#####Set Max Cache Age（in milliseconds）：

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));
```

##LCObject Subclass

Leap Cloud is easy to start up. You can use LCDataManager.fetchInBackground() to access all data. In lots of mature code, subclass can bring more advantages, like simplicity, expansibility, auto-complete feature supported by IDE, etc. Subclass is not necessary, you can transfer following code:


```java
LCObject shield = new LCObject("Armor");
shield.put("displayName", "Wooden Shield");
shield.put("fireproof", false);
shield.put("rupees", 50);
```

into:

```java
Armor shield = new Armor();
shield.setDisplayName("Wooden Shield");
shield.setFireproof(false);
shield.setRupees(50);
```

###Create LCObject Subclass

It's easy to create a LCObject subclass: 

1.   Declare that the subclass is inherited from LCObject.
2.   Add @LCclassName annotation. The value must be a string: the class name of the LCObject constructed function you passed in. Thus, this string class name doesn't need to appear in code again.
3.   Make sure that your subclass has a public default (the parameter amount is 0) constructed function. Please don't modify any LCObject property in constructed function. 
4.   Register subclass LCObject.registerSubclass(Yourclass.class) before invoking LCConfig.initialize() and registering the app.

The following code can sucessfully realize and register the subclass Armor of LCObject:

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
 
####Property Access/Modification

Adding method to LCObject helps encapsulated class logic. You can put the logic that is related to subclass into one place rather than seperate them into multiple classes to process business logic and storage/transformation logic.

You can easily add accessor and modifier to your LCObject subclass, look similar to getter and setter in declared fields, but realized with get and put method of LEObject. Here is the instance of creating a content property for Post class:

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

Now you can access displayName property with armor.getDisplayName() and modify it with armor.setDisplayName(). This enables auto-complete feature supported by IDE, as well as discovering exceptions while compling.

The accessors and modifiers of all data types can be defined like this, using variation of all kinds of get() methods, like getInt()，getLCFile() or getMap().

####Define Functions

If you need more complicated logic but not just a simple accessor, you can define your own methods like shown as follows:

```java
public void takeDamage(int amount) {
  // Decrease the armor's durability and determine whether it has broken
  increment("durability", -amount);
  if (getDurability() < 0) {
    setBroken(true);
  }
}
```

###Create Subclass Instance
You can create your subclass using your self-defined constructed function. Your subclass must define a public default constructed function and not modify any property in superclass LCObject. This default constructed function will be used to create strongly-typed object of subclass by SDK.

You can create a reference to current object using LCObject.createWithoutData():

```java
Armor armorReference = LCObject.createWithoutData(Armor.class, armor.getObjectId());
```

###Subclass Query
You can get query object of specific subclass with static method LCQuery.getQuery(). The following instance can inquire all boosters user can buy:

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

##LCUser

LCUser is a subclass of LCObject. It inherited all methods of LCObject and has the same features as LCObject. The different is LCUser adds some specific features of user account.

###Property Description
Apart from the properties inherited from LCObject, LCUser has some specific properties:

Property|Type|Introduction|If necessary
---|---|---|---
    username|String|Username|Necessary
    password|String|Password|Necessary
    email|String| Email Address|Optional
    emailVerified|Boolean|Verify email or not|Optional
    masterKey| String | MasterKey for signup|Optional
    installationIds| String | InstallationId of all installation|Optional

Notices:

* Please make sure that username and email is unique.
* Unlike other LCObject, LCUser properties are not set by put, but the specific setXXX.
* Leap Cloud will collect the value of masterKey，installationIds automatically.

###User Signup

1. Creare LCUser object and provide username and password.
2. Save it to cloud with LCUserManager.signUpInBackground().

```java
String mUsername ＝ "userName";
String mPassword = "passWord";
LCUser user = new LCUser();
user.setUserName(mUsername);
user.setPassword(mPassword);

LCUserManager.signUpInBackground(user, new SignUpCallback() {
	public void done(LCException e) {
	        if (e == null) {
	        // Signup success
	        } else {
	        }
	}
});
```
Notices:

* Leap Cloud servre will observe the user info during the signup to make sure that the username and email address is unique. Besides, server will process the password with non-reversible encryption rather than save it. Please don't encrypt the password in clients,it will result in the disorder and disable the password reset.
* Signup uses the signUpInBackground() method rather than saveInBackground(). There are other signup methods as well. We recommend asynchronous signup method as usual and this will not affect the main UI thread. You can check more detailed info in API.
* If the signup failed,you can check the returned error object. The mostly likely case is that the username or email is already taken. In this case, you can remind users to try another username or email.
* You can also ask users to use Email address as username. The username will be taken as Email address and then used for password reset afterwards.

###Signin
You can sign in with LCUserManager.logInInBackground(). Property description: the first one is username, the second one is password and the third one is LogInCallback(), the callback method.

```java
LCUserManager.logInInBackground("userName", "passWord", new LogInCallback<LCUser>() {
  public void done(LCUser user, LCException e) {
    if (user != null) {
      // Signin success
    } else {
      // Signin failure
    }
  }
});
```

###Current User 
If the app required signin everytime, it will directly affect the user experience. You can use the cached currentUser object to avoid this situation.

There would be a cached user object in local disk when you register or signin. You can log in with the cached object with following method:

```java
LCUser currentUser = LCUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

You can clear cached object with following method:

```java
LCUser.logOut();
LCUser currentUser = LCUser.getCurrentUser(); //crrentUser will be null now
```

###Password Reset

Leap Cloud provides a method for users to reset the password securely. The procedure is simple, only user's email address is required:

```java
LCUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LCException e) {
        if (e == null) {
            // Reset Email is Sent
        } else {
        }
    }
});
```
If the email address is same as the email used for signup, then the system will send a reset email. The reset procedure is show as below:

* Users enter their email address and require password reset.
* Leap Cloud sends an email to the email address user just provided and this email contains the reset link.
* User click on the reset lins, enter a LC page and set a new password.
* Leap Cloud has reset user's password successfully.

###User Query

You can inquire user data with special UserQuery. Leap Cloud provides all round protection of user data. More details: [User Object Security](..).

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

###Email Verification

Leap Cloud provides powerful email verification service, you just need to Enable "Verify user's email address" in Console >> App Settings >> Email Settings and system will add `emailVerified` property in LCUser automatically. When the email property of LCUser is assigned or modified and the value of `emailVerified` is false, then Leap Cloud will send a link to users automatically. `emailVerified` will be set as true once users click the link.

Three status of `emailVerified` property:

* true - Successfully verify the email with the link sent by system
* false - Not verify yet or failed to verify
* null - Email verification is not enabled or no email address provided

###Anonymous Users
Anonymous users refers to a special set of users with username and password. They have the same features as other users while once deleted, all data will be no longer accessible. If your app requires a relatively weakened user system, then Anonymous Users of Leap Cloud is highly recommended. 

You can get an anonymous user account with LCAnonymousUtils:

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
#####Create Anonymous Users Automatically
You can transfer anonymous users into non-anonymous users by signup or signin and all data of this anonymous user will be saved. You can judge if the current user is anonymous with LCAnonymousUtils.isLinked():

```java
Boolean isAnonymous = LCAnonymousUtils.isLinked(LCUser.getCurrentUser());
```

You can choose to create anonymous users automaticall by system (locally, no network needed) and use app immediately. After the anonymous users auto creation, LCUser.getCurrentUser() will no longer be null. Leap Cloud wil create anonymous user in the cloud if you are storing LCObject related to this anonymous user.

#####How to Create Anonymous Users Automatically
Add following code in onCreate() in main Application.

```java
LCUser.enableAutomaticUser();
```

### Manage Users in Console

User class is a specialized class for storing LCUser objects. You'll see a _User class in Console >> Users. More details: [Console UserManual](...).

##User Role
Setting user roles to manage permissions is more effective. The permission assigned to a role will be inherited by users contains in this role. User role is a user collection and a role can also contains another role. There is a corresponding `_Role` class in Leap Cloud for storing user roles.

###Property Description

Property Name|Type|Introduction|If Necessary
---|---|---|---
    ACL|ACL|Permission of this Role|**Necessary** (Requires explicit set)
    roles|Relation|LCRoles contained by this LCRole|Optional
    name|String|Role name|Necessary
    user|Relation|Users in this Role|Optional

###Create Roles
There are two parameters required on creating the Role: the first one is the Role name (name property) and the second one is ACL.

```java
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
```

###Add Users or Roles to the Role
You can add users or roles to the role with role.getUsers().add() or role.getRoles().add().

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

###Get Role Object

Here is two ways to get role object:

1. Inquire with role name:

	```java
	LCObject wallPost = new LCObject("WallPost");
	LCACL postACL = new LCACL();
	//assign corresponding Role name：
	postACL.setRoleWriteAccess("Moderators", true);
	wallPost.setACL(postACL);
	LCDataManager.saveInBackground(wallPost);
	```
2. Inquire with Query:

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

##Data Security

### Security of LCObject
There is a ACL property when user create LCObject. Only LCUser and LCRole in this ACL list has the access. If a user doesn't explicitly set ACL, then system will assign default ACL automatically.

#####ACL
ACL is a white list which contains users that are allowed the access to the data. A User must have the read permission (or belong to the Role that has the read permission) to get the data if an object. Meanwhile, a User must have the write permission (or belong to the Role that has the write permission) to modify or delete an object. e.g. a typical ACL data:

```{"553892e860b21a48a50c1f29":{"read":true,"write":true}}```

indicates that the user whose ObjectId is "553892e860b21a48a50c1f29" has the permission to read and modify the LCObject.

#####Default Permission

Each object in Leap Cloud has a default ACL value when there's no explicit designation. This value means that all users have the read and write permission towards this object. You can see following value in ACL property in data manegement class:
```{"*":{"read":true,"write":true}}```

You can modify the value of ACL if needed:

```java
LCACL defaultACL = new LCACL();
defaultACL.setPublicReadAccess(true);
defaultACL.setPublicWriteAccess(false);
LCACL.setDefaultACL(defaultACL, true);
```

The second parameter of `LCACL.setDefaultACL()` is set as true, which means that the read and access permission is added to defaultACL by default, not vice versa.

#####Only Available to Create User
You can set the LCObject as only be read or modified by create users: users need to create LCObject after the signin and then add following ACL properties:

```java
LCObject privateNote = new LCObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LCACL(LCUser.getCurrentUser()));
LCDataManager.saveInBackground(privateNote);
```
Now, the LCObject - "privateNote" is only available to this user and can be read and modified on any devices signed in by this user.

#####Set Access Permission for Other Users
You can add the read and write permission of **target user** to ACL of LCObject with setReadAccess and setWriteAccess.

For example, add read and modify access for a group of users: 

```java
LCObject groupMessage = new LCObject("Message");
LCACL groupACL = new LCACL();
     
// userList is Iterable<LCUser>, containing a group of LCUser object.
for (LCUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
LCDataManager.saveInBackground(groupMessage);
```

#####Set Access Permission for Roles
You can add the read and write permission of **target Role** to ACL of LCObject with setRoleWriteAccess and setRoleWriteAccess.

For example, add read and modify access for a group of users:

```java
LCRole moderators = /* Query for some LCRole */;
LCObject wallPost = new LCObject("WallPost");
LCACL postACL = new LCACL();
postACL.setRoleWriteAccess(moderators);
wallPost.setACL(postACL);
LCDataManager.saveInBackground(wallPost);
```

#####Set Access Permission for Users and Roles
The ACL of LCObject can be overlapped. For example, when you set ACL for a LCObject, you can add modify permission for a role while adding read permission for all users:


```java
LCObject myMessage = new LCObject("Message");
LCACL myACL = new LCACL();
// add read permission for all users
myACL.setPublicReadAccess(true);
// add modify permission for Moderators
myACL.setRoleWriteAccess("Moderators");
myMessage.setACL(myACL);
```	

#####Set Access Permission for All Users
You can add the read and write permission of **All Users** to ACL of LCObject with setPublicReadAccess and setPublicWriteAccess.
```java
LCObject publicPost = new LCObject("Post");
LCACL postACL = new LCACL();
postACL.setPublicReadAccess(true);
postACL.setPublicWriteAccess(false);
publicPost.setACL(postACL);
LCDataManager.saveInBackground(publicPost);
```

### User Object Security

Leap Cloud has normalized the user object security. The data saved in the user object can only be self-modified by default. Clients can read the data but it has no right to modify or delete them. Thus, only the user object got after the signin can be modified. 

This instance is a good example of user obejct security:

```java
LCUserManager.logInInBackground("my_username", "my_password", new LogInCallback<LCUser>() {
    
    @Override
    public void done(LCUser user, LCException exception) {
        user.setUserName("my_new_username"); // Modify Username
        LCUserManager.saveInBackground(user); // Save successfully because of the signin
         
        // not signed in, failed to be modified
        LCQuery<LCUser> query = LCUser.getQuery();
        LCQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<LCUser>() {
          public void done(LCUser object, LCException e) {
            object.setUserName("another_username");
         
            // Error: not authorized
            LCDataManager.saveInBackground(object);
          }
        });
    }
});
```
### Role Object Security

Similar to other LCObjects, LCRole object uses ACL to control the access permission. The different is that LCRole need to set ACL explicitly. Generally speaking, only the admin or other users with elevated permission can create or modify roles, so you need to set access permission when creating LCRole.  

e.g.

```java
LCACL roleACL = new LCACL();
roleACL.setPublicReadAccess(true);
LCRole role = new LCRole("Administrator", roleACL);
LCRoleManager.saveInBackground(role);
```

##Third Party Login

Leap Cloud provides 3rd party login service to simplify the signup and signin and integrate LC app as well as apps like Facebook and Twitter. You can use 3rd party app SDK and LC SDK at the same time and connect LCUser and UserId of 3rd party app.

###Log in with Facebook Account
The Android SDK of Facebook helps app optimize the signin experience. As for the devices installed with Facebook app, LC app can realize direct login with Facebook user credential. If there's no Facebook app installed, users can provide signin info in a standard Facebook login page.

If the Facebook UserId is not bound to any LCUser after the Facebook login, Leap Cloud will create an account for the user and bind the two.
####Preparations
1. Create Facebook app in [Facebook Dev Center](https://developers.facebook.com). Click My Apps >> Add a New App
2. Open Leap Cloud Console >> App Settings >> User Authentication. Check Allow Facebook Authentication and fill the Facebook Application ID and App Secret got from step 1 into relative location.
3. Integrate Facebook SDK, add Facebook Login button. Please check [Add Facebook Login to Your App or Website](https://developers.facebook.com/docs/facebook-login/v2.4) for more details.
4. Add following code after LCConfig.initialize(this, APP_ID, API_KEY) in Application.onCreate()function:

```java
LCFacebookUtils.initialize("YOUR FACEBOOK APP ID");
```
5. 	Add following code into onActivityResult() function in all Activites invoked Login with Facebook to finish verification.


```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LCFacebookUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####Sign in and Register New LCUser
If the Facebook UserId is not bound to any LCUser after the Facebook login, Leap Cloud will create an account for the user and bind the two. e.g.

```java
LCFacebookUtils.logInInBackground(this, new LogInCallback<LCUser>() {
  @Override
  public void done(LCUser user, LCException err) {
    if (user == null) {
      //Facebook login is canceled
    } else if (user.isNew()) {
      //Facebook login for the first time, registered and bound successfully
    } else {
      //Facebook login succeeded
    }
  }
});
```

Detailed login process:

* Login Facebook in Login with Facebook page provided by Facebook SDK.
* Facebook verifies the login info, then return.
* Leap Cloud SDK accept the result and save it to LCUser. If the Facebook UserId is not bound to any LCUser, then Leap Cloud will create an account for the user automatically.
* Invoke LogInCallbackof LC and log in LCUser.

####Bind LCUser and Facebook Account
You can bind LC account and Facebook account with following method:

```java
if (!LCFacebookUtils.isLinked(user)) {
    LCFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCFacebookUtils.isLinked(user)) {
            //Bind Successfully
      }
    }
  });
}
```

Leap Cloud will update the Facebook account info to the LCUser after the bind. The next time user logs in with Facebook account, Leap Cloud will detect the bind and don't need to add new LCUser to this Facebook account again. 

####Unbind

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
Leap Cloud will remove all Facebook account info from the LCUser after the unbind. The next time user logs in with Facebook account, Leap Cloud will detect there's no bind and then add new LCUser to this Facebook account.

###Log in with Twitter Account
Similar to Facebook, the Android SDK of Twitter helps app optimize the signin experience. As for the devices installed with Facebook app, LC app can realize direct login with Twitter user credential. If there's no Twitter app installed, users can provide signin info in a standard Twitter login page.

If the Twitter UserId is not bound to any LCUser after the Twitter login, Leap Cloud will create an account for the user and bind the two.
####Preparations
1. Create Twitter app in [Twitter Dev Center](...). Click My Apps >> Add a New App
2. Open Leap Cloud Console >> App Settings >> User Authentication. Check Allow Twitter Authentication and fill the Twitter consumer Key got from step 1 into relative location.
3. Integrate Twitter SDK, add Twitter Login button. Please check [Add Twitter Login to Your App or Website](...) for more details.
4. Add following code after LCConfig.initialize(this, APP_ID, API_KEY) in Application.onCreate()function:

```java
LCTwitterUtils.initialize("YOUR Twitter CUSUMER KEY");
```
5. 	Add following code into onActivityResult() function in all Activites invoked Login with Twitter to finish verification.

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LCTwitterUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####Sign in and Register New LCUser
If the Twitter UserId is not bound to any LCUser after the Twitter login, Leap Cloud will create an account for the user and bind the two. e.g.

```java
LCTwitterUtils.logInInBackground(this, new LogInCallback<LCUser>() {
  @Override
  public void done(LCUser user, LCException err) {
    if (user == null) {
      //Twitter login is canceled
    } else if (user.isNew()) {
      //Twitter login for the first time, registered and bound successfully
    } else {
      //Twitter login succeeded
    }
  }
});
```
Detailed login process:

* Login Twitter in Login with Twitter page provided by Twitter SDK.
* Twitter verifies the login info, then return.
* Leap Cloud SDK accept the result and save it to LCUser. If the Twitter UserId is not bound to any LCUser, then Leap Cloud will create an account for the user automatically.
* Invoke LogInCallbackof LC and log in LCUser.


####Bind LCUser and Twitter Account
You can bind LC account and Twitter account with following method:

```java
if (!LCTwitterUtils.isLinked(user)) {
    LCTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LCException ex) {
          if (LCTwitterUtils.isLinked(user)) {
            //Bind Successfully
      }
    }
  });
}
```

Leap Cloud will update the Twitter account info to the LCUser after the bind. The next time user logs in with Twitter account, Leap Cloud will detect the bind and don't need to add new LCUser to this Twitter account again. 


####Unbind

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
Leap Cloud will remove all Twitter account info from the LCUser after the unbind. The next time user logs in with Twitter account, Leap Cloud will detect there's no bind and then add new LCUser to this Twitter account.


##GeoPoint

Leap Cloud provides LCGeoPoint object to help users do location query based on longitude and latitude.

####LCGeoPoint Overview

####Create LCGeoPoint
LCGeoPoint requires two parameters: the first one is Latitude (positive is northern) and the second one is longitude (positive is eastern).

```java
//Create new LCGeoPoint (40.0, -30.0)
LCGeoPoint point = new LCGeoPoint(40.0, -30.0);
```

The LCGeoPoint object can be stored in LCObject：

```java
myShop.put("location", point);
```
####Geolocation Query
#####Inquire the nearest place to target object
You can get adjacent object around A with whereNear method and it requires two parameters: the first one is the property name for storing location of target object and the second one is the location of A. We can find the nearest 10 shops around A with following instance.

```java
LCGeoPoint userLocation = (LCGeoPoint) userObject.get("location");
LCQuery<LCObject> shopQuery = LCQuery.getQuery("Shop");
shopQuery.whereNear("location", userLocation);
query.setLimit(10);
LCQueryManager.findAllInBackground(query, new FindCallback<LCObject>() { ... });
```
#####Inquire objects around a certain location
You can inquire objects within a certain range with whereWithinKilometers and whereWithinMiles. The method is similar to the aforementioned one.
#####Inquire objects within a certain range
You can inquire objects within a certain range with whereWithinGeoBox and it requires three parameters: the first one is the property name for storing location of target object and the next two are LCGeoPoint objects. The circle built with two LCGeoPoints as the endpoints of the diameter is the query range of whereWithinGeoBox. We can find all shops with the certain range with the following instance. 

```java
LCGeoPoint southwestOfSF = new LCGeoPoint(37.708813, -122.526398);
LCGeoPoint northeastOfSF = new LCGeoPoint(37.822802, -122.373962);
LCQuery<LCObject> query = LCQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
LCQueryManager.findAllInBackground(new FindCallback<LCObject>() { ... });
```