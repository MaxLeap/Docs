# Cloud Data
## Introduction

### What is Cloud Data
Cloud Data is the data storage service provided by MaxLeap. It is based on the `MLObject` and each `MLObject` contains several key-values. All `MLObject` are stored in MaxLeap, you can perform operations towards them with iOS/Android Core SDK. Besides, MaxLeap  provides some special objects, like `MLUser`, `MLRole`, `MLFile` and `MLGeoPoint`. They are all based on `MLObject`.


### Why is Cloud Data Nccessary
Cloud Data can help you build and maintain the facility of your database, thus focus on the app service logic that brings real value.  The advantages can be summarized as follows:

* Sort out the deployment and maintenance of hardware resourses.
* Provide standard and complete data access API
* Unlike the traditional relational database, there's no class to be created ahead of time before storing data in cloud. Data objects in JSON format can be stored and retrieved easily as you wish.
* Realize the Hook of cloud data with the Cloud Code service.（Please check [Cloud Code Guide](。。。) for more details.）

### How Does Cloud Data Run

## Cloud Object
The object that stored in Cloud Data is called `MLObject` and every `MLObject` is planned in different `class`(like table in database). `MLObject` contains several key-value pairs and the value is data compatible with JSON format.You don't need to assign properties contained by MLObject package, neither does the type of property value. You can add new property and value to `MLObject` at anytime, which could be stored in cloud by Cloud Data service.

###Create New
Suppose that we need to save a piece of data to `Comment` class, it contains following properties: 

Property Name|Value|Value Type
-------|-------|---|
content|"kind of funny"|Character
pubUserId|1314520|Digit
isRead|false|Boolean

The method of adding property is similar to `Map` in `Java`: 

```java
MLObject myComment = new MLObject("Comment");
myComment.put("content", "kind of funny");
myComment.put("pubUserId", 1314520);
myComment.put("isRead", false);
MLDataManager.saveInBackground(myComment);
```

Notices:

* **When was "Comment" Class created:** If there is no Comment Class in Cloud(MaxLeap Server, hereinafter referred to as Cloud) when you run the code above, then MaxLeap will create a data sheet for you according to the Comment object created in the first place(run the code above) and insert relative data.
* **Property Value Type in the Table is consistent:** If there is already a data sheet named Comment in the app in cloud and contains peoperties like content、pubUserId、isRead and etc. Then the data type of relative property value should be consistent with the one you create the property, otherwise you will fail to save data. 
* **MLObject is Schemaless:** You just need to add key-values when neccessary and backend will save them automatically. There's no need to assign `MLObject` ahead of time.
* **Property Created Automatically:** Every MLObeject has following properties for saving metadata that don't need requiring. Their creation and update are accomplished by MaxLeap backend system automatically, please don't save data with those properties in the code.

	Property Name|Value|
	-------|-------|
	objectId|Unique Identifier of the Object
	createdAt|Date Created of the Object 
	updatedAt|Date Last Modified of the Object 

* **Size Limit:** The size limit for ML Object is 128K.
* **synchronous/asynchronous operation:** Most of the code in Android platform works on the main thread while if there is any time-consuming blocking operation, like access to the network, your code may not be working properly. To avoid this, you can change the synchronous operation that may cause blocking into asynchronous operation and run it in a background thread, e.g. saveInBackground() is the asynchronous version of save(), and it requires a parameter - a callback instance - which will be executed once the asynchronous operation is done. There are also corresponding asynchronous versions for operations like query, update and delete. 
* The name of the key should be alphabetic characters while the type can be letters, numbers, Boolean, arrays, MLObject and any other types that support JSON. 
* You can provide the second parameter, SaveCallback instance, when invoking `MLDataManager.saveInBackground()` to check if the creation is succeeded. 

```java
MLDataManager.saveInBackground(myComment, new SaveCallback() {
  @Override
  public void done(MLException e) {
    if(e==null){
      // Succeeded
    } else{
      // Failed
    }
  }
});
```

###Query
#####MLObject Query
You can get the complete `MLObject` with the ObjectId of any piece of data. There are three required parameters for invoking `MLQueryManager.getInBackground()`: class name of the object, ObjectId and callback function, which would be invoked in getInBackground() method.


```java
String objId="OBJECT_ID";
MLQueryManager.getInBackground("Comment", objId, new GetCallback<MLObject>() {

  @Override
  public void done(MLObject Object, MLException e) {
    // Object is the target one

  }
});
```

Or, you can get MLObject with "paramater value + MLQuery": 

```java
MLQuery<MLObject> query = MLQuery.getQuery("Comment");
query.whereMatches("isRead",false);

MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
  @Override
  public void done(List<MLObject> list, MLException e) {
    // list is the target one
  }
});
```

If you only need the first piece of data of Query results, please invoke `MLQueryManager.getFirstInBackground()` method: 

```java
MLQuery<MLObject> query = MLQuery.getQuery("Comment");
query.whereMatches("pubUserId","USER_ID");

MLQueryManager.getFirstInBackground(query, new GetCallback<MLObject>() {
  @Override
  public void done(MLObject MLObject, MLException e){
    // MLObject is the target one
  }
});
```


#####MLObject Parameter Value Query 
MLObject Parameter Value Query
You can invoke getType method in relative with the data type to get value from the MLObject instance:

```java
int pubUserId = comment.getInt("pubUserId");
String content = comment.getString("content");
boolean isRead = comment.getBoolean("isRead");
```

###Update
Two steps are required to update MLObject: the first is to get the target MLObject and the second is to edit and save. 

```java
// Get MLObject with objectId
String objId="OBJECT_ID";
MLQueryManager.getInBackground(query, objId, new GetCallback<MLObject>() {

  @Override
  public void done(MLObject comment, MLException e) {
    if (e == null) {
      // Mark the comment as read
      comment.put("isRead", true);
      MLDataManager.saveInBackground(comment);
    }
  }
});
```

###Delete 
#####Delete MLObject
You can delete MLObject with `MLDataManager.deleteInBackground()` method. To ensure the delete, please use DeleteCallback to handle the delete results.

```java
MLDataManager.deleteInBackground(comment);
```

#####Batch Delete 
You can delete MLObject, a `List<MLObject>` instance, with `MLDataManager.deleteAllInBackground()` method. 

```java
List<MLObject> objects = ...
MLDataManager.deleteAllInBackground(objects);
```

#####Delete a Property of MLObject Instance
Except from deleting a whole object instance, you can delete any target value in the instance. Note that the edition can only be synchronized to cloud with invocation of saveInBackground().

```java
// Remove isRead property from the instance
comment.remove("isRead");
// Save 
MLDataManager.saveInBackground(comment.remove);
```

### Counter

Counter is one of the most regular functional requirements. When the property of a certain parameter value type is updated frequently and each update is about to add up a parameter value, then we can make use of Counter to complete the operation with more efficiency. This will also avoid the conflict and override caused by frequent data edition requirements.

For example, the "score" in a game is modified frequently. If there are multiple clients request the modifications at the same time and we need to request the data from clients and save the modifications to the cloud, there may easily be some conflicts and override.

#####Incremental Counter
At this point, we may use `increment()` method (default increment will be 1) and update counter type properties more efficiently and securely. For example, we can invoke following method to update the "score" in a game: 

```java
gameScore.increment("score");
MLDataManager.saveInBackground(gameScore);
```
#####Specified Increment 

```java
gameScore.increment("score",1000);
MLDataManager.saveInBackground(gameScore);
```

Note that increment doesn't need to be integer, value of a floating-point type is also acceptable. 
#####Decremental Increment 

```java
gameScore.increment("score",-1000);
MLDataManager.saveInBackground(gameScore);
```

###Array

You can save the value of arry type to any parameter of MLObject (like the skills parameter in this instance):

#####Add To the End of the Array
You can add one or more value to the end of the `skills` parameter value with `add()` and `addAll()`.

```java
gameScore.add("skills", "driving");
gameScore.addAll("skills", Arrays.asList("flying", "kungfu"));
MLDataManager.saveInBackground(gameScore);
```

Meanwhile, you can only add values that is different from all current items with `addUnique()` and `addAllUnique()`. 

#####Override with new Array
The value of array under `skills` parameter will be overridden by invoking `put()` function: 

```java
gameScore.put("skills", Arrays.asList("flying", "kungfu"));
MLDataManager.saveInBackground(gameScore);
```
#####Delete the Value of Any Array Property
The value of array under `skills` parameter will be cleared by invoking `removeAll()` function: 

```java
gameScore.removeAll("skills");
MLDataManager.saveInBackground(gameScore);
```

Notices: 

* Remove and Add/Put must be seperated for invoking save function. Or, the data may fail to be saved.

###Associated Data
An object can be associated to other objects. As mentioned before, we can save the instance A of a MLObject as the parameter value of instance B of another MLOject. This will easily solve the data relational mapping of one-to-one and one-to-many, like the relation between primary key & foreign key.

Notices: MaxLeap handles this kind of data reference with Pointer type. For data consistency, it won't save another copy of data A in data B sheet.

####One-to-one Association
For example, a tweet may correspond to many comments. You can create a tweet and a corresponding comment with followign code: 

```JAVA
// Create a Tweet
MLObject myPost = new MLObject("Post");
myPost.put("content", "This is my first tweet, nice meeting you guys.");

// Create a Comment
MLObject myComment = new MLObject("Comment");
myComment.put("content", "This is a good one.");

// Add a relative Tweet
myComment.put("post", myWeibo);

// This will generate two pieces of data: tweet and comment
MLDataManager.saveInBackground(myComment);
```

Or, you can associate existing object with obejctId: 

```java
// Associate the comment with the tweet whose objectId is 1zEcyElZ80 
myComment.put("parent", MLObject.createWithoutData("Post", "1zEcyElZ80"));
```

The relative MLObject won't be got by defalut when you get a object. Aside from the objectId, other parameter values are all blank. You need to invoke fetch method if you want to get all parameter data of relative object (Suppose that Comment instance is already got with MLQuery in following case):

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

####One-to-many Association
Associate two comments to one tweet ：

```java
// Create a Tweet
MLObject myPost = new MLObject("Post");
myPost.put("content", "This is my first tweet, nice meeting you guys.");

// Create a Comment
MLObject myComment = new MLObject("Comment");
myComment.put("content", "This is a good one.");

// Create another Comment
MLObject anotherComment = new MLObject("Comment");
anotherComment.put("content", "This is a good one.");

// Put those two comments into a same list 
List<MLObject> listComment = new ArrayList<>();
listComment.add(myComment);
listComment.add(anotherComment);

// Associate those two comments in a tweet
myPost.put("comment", listComment);

// This will generate two piece of data: tweet and comment
MLDataManager.saveInBackground(myComment);
```

Notices: 

* For java 6 and earlier, please create listComment with `List<MLObject> listComment = new ArrayList<MLObject>()`. 
* You can also add MLObject individually to properties with `add()` method: 

```java
myPost.add("comment", myComment);
myPost.add("comment", anotherComment);
```

####Realize Association with MLRelation

You can create many-to-many modeling with MLRelation. This is similar to chained list while MLRelation doesn't need to get all relative MLRelation instances when getting additional attributes. As a result, MLRelation can support more instances than chained list and the read is more flexible. For example, a user can like many posts. In this case, you can save all posts liked by this user with `getRelation()`. For creating a new liked post:


```java
MLUser user = MLUser.getCurrentUser();
//Create MLRelation instance, likes, in user instance
MLRelation<MLObject> relation = user.getRelation("likes");
//Adding association, post, in likes
relation.add(post);
MLUserManager.saveInBackground(user);
```

You can remove a Post from MLRelation:

```java
relation.remove(post);
```

The object collections in the relation won't be got by default. You can get post chained list with MLQuery objects acquired with get Query as well as its findInBackground() method, as shown below:

```java
MLQueryManager.findAllInBackground(relation.getQuery(), new FindCallback<MLObject>() {

    @Override
    public void done(List<MLObject> results, MLException e) {
         if (e != null) {
          } else {
            // results includes all relative objects in relation
          }
    }
});
```

If what you need is just a subset of the list, you can add more constrains to the MLQuery object returned by getQuery, which will be impossible for taking `List` as property.e.g.

```java
MLQuery<MLObject> query = relation.getQuery();
// Add more query constraints to query object
query.skip(10);
query.limit(10);
```

Please check [Query Guide](..) for more MLQuery information. An operating MLRelation object is similar to the object chained list, so any queries towards the chained list can also be implemented to MLRelation.


###Data Type

We support object type like String, Int, Boolean and MLObject by now; data type like java.util.Date、byte[] array、JSONObject、JSONArray. You can embed a JSONObject in  JSONArray object and save it to MLObject. For instance:


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

Large binary data is not recommended, like the byte[] property type of MLObject is not suitable for images or files. The size limit for MLObject is 128KB. If you need to store large files like images, files and music, MLFile is highly recommended and here is the [Guide](..). Please check [Data Security Guide](...) for more informations on handling data.

## Files
###Creation and Upload of MLFile
MLFile can help your app save the files to server, like the common image, video, audio and any other binary data.

In this instance, we will save the image as MLFile and upload it to server:

```java
public void UploadFile(Bitmap img){
  // transfer the Bitmap into binary data byte[]
  Bitmap bitmap = img;
  ByteArrayOutputStream stream = new ByteArrayOutputStream();
  bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
  byte[] image = stream.toByteArray();
  
  // Create MLFile Object
  MLFile myFile = new MLFile("myPic.png", image);
  
  // Upload
  MLFileManager.saveInBackground(myFile, new SaveCallback() {
    @Override
    public void done(MLException e) {

    }
  });
}
```

Notices:

* 	MLFile construct function use the first parameter to specify FileName, and the seconde parameter to accept a Byte Array, which is the binary format of the file to upload. You can get the file name via following code:

	```java
	String fileName = myFile.getName();
	```
* 	You can save MLFile to the property of other objects and bring it back later. 	 
	
	```java
	//Create a MLObject，including ImageName，ImageFile
	MLObject imgupload = new MLObject("ImageUploaded");
	imgupload.put("ImageName", "testpic");
	imgupload.put("ImageFile", file);

	//Save
	MLDataManager.saveInBackground(imgupload, new SaveCallback() {
		@Override
		public void done(MLException e) {
		}
	});
	```

###Upload Process
Aside from providing a SaveCallback to inform the upload failure or success, the saveInBackground() method of MLFile can also provide a second ProgressCallback object to inform the upload process:


```java
MLFileManager.saveInBackground(file, new SaveCallback() {
	@Override
	public void done(MLException e) {
			
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
1. Assign MLFile with MLObject
2. Invoke MLFileManager.getDataInBackground() to download：

```java
MLFile myFile=imgupload.getMLFile("testpic");
MLFileManager.getDataInBackground(myFile, new GetDataCallback() {
	@Override
	public void done(byte[] bytes, MLException e) {

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

MLQuery towards MLObject can be summarized as 3 steps:

1. Create a MLQuery and assign corresponding "MLObject class";
2. Add different conditions for MLQuery;
3. Execute MLQuery：Inquire matching MLQuery data with `MLQueryManager.findAllInBackground()` and FindCallback callback class.

For example, to inquire target personnel data, you can use whereEqualTo to add conditional values:

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

You can execute Query with MLQueryManager.getFirstInBackground() to get the first result of the query.

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
MLQuery<MLObject> query = MLQuery.getQuery("GameScore");
query.selectKeys(Arrays.asList("playerName", "score"));
MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {

    @Override
    public void done(List<MLObject> objects, MLException exception) {
         // results has the list of objects
    }
});
```

In regard to the MLObject returned, you can get the other properties using MLDataManager.fetchInBackground().

```java
MLObject object = results.get(0);
MLDataManager.fetchInBackground(object, new GetCallback<MLObject>() {

    @Override
    public void done(MLObject object, MLException exception) {
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
MLQuery<MLObject> teamQuery = MLQuery.getQuery("Team");
//Filter basketball team: winning percentage is no less than 50%
teamQuery.whereGreaterThan("winPct", 0.5);
MLQuery<MLUser> userQuery = MLUser.getQuery();
userQuery.whereMatchesKeyInQuery("hometown", "city", teamQuery);
MLQueryManager.findAllInBackground(userQuery, new FindCallback<MLUser>() {
    
  @Override
  public void done(List<MLUser> results, MLException e) {
    // Users from the same place as the basketball team whose winning percentage is no less than 50% in the results
  }
});
```

Relatively, you can find users from other places with whereDoesNotMatchKeyInQuery.

```java
MLQuery<MLUser> anotherUserQuery = MLUser.getQuery();
losingUserQuery.whereDoesNotMatchKeyInQuery("hometown", "city", teamQuery);
MLQueryManager.findAllInBackground(anotherUserQuery, new FindCallback<MLUser>() {
    
  @Override
  public void done(List<MLUser> results, MLException e) {
    // users from other places in the results 
  }
});
```

###Query Towards Different Property Value Types

####Query towards array value type

If the key value is an array, then you can inquire all objects containing "2" from the Key array with:

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
MLQuery<MLObject> query = MLQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

####Query towards MLObject Value Type

#####MLObject-type property matches another MLObject

If you want to get the data whose certain property matches specific MLObject, you can inquire with whereEqualTo like others. For example, if every Comment object includes a Post object (in post property), then you can get all Comment lists of specific Post: 

```java
// suppose that MLObject myPost is created before
MLQuery<MLObject> query = MLQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
public void done(List<MLObject> commentList, MLException e) {
 // commentList now has the comments for myPost
}
});
```
#####MLObject-type property matches Query
If any property of the query object contains a MLObject and this MLObject matches a different query, then you can use the nested query, whereMatchesQuery. Please note that the default limit 100 works on inner query as well. Thus, you need to construct your query object well if there's massive data query. For example, inquire the comment list of post with images: 


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

Conversely, you can use whereDoesNotMatchQuery if you don't want to match some subquery. For example, inquire the comment list of post without images: 

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
#####Return Property of Specified MLObject Type 
The associated MLObject won't be got by default when you got a object, but you can choose to return it with include method. For example, if you want to get most recent 10 comments and the associated posts:

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

You can use dot operator to include multiple embedded objects. For example, if you want to include an author object of a comment (suppose that the corresponding value of the author is MLUser instance), you can do as shown below: 

```java
query.include("post.author");
```
###Count Query

If you don't want to get all matching objects, but just the count, then you can replace the find with count. e.g. inquire how many tweets did an account post:

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

###Compound Query

You can inquire data that matches multiple Query with MLQuery.or. For example, you can get the gamers who win more than 90 times or less than 10 times with following method: 

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
    // win more than 90 times or less than 10 times
  }
});
```

###Cache Query
Some query results should be cached to the disk in order to show data to users while offline, like the app is just opened, netowrk request is not accomplished. MaxLeap will clear cache autmatically if it takes too much space. 
Query will not use cache by default unless you set the option with setCachePolicy. for example, you can do following settings if there's no network available for you to request:
```java
query.setCachePolicy(MLQuery.CachePolicy.NETWORK_ELSE_CACHE);
MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() {
  public void done(List<MLObject> scoreList, MLException e) {
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
MaxLeap provides several cache strategies:

Cache Strategy|Introduction
---|---
IGNORE_CACHE | default cache strategy. The query won't use cache and the query results won't be stored in cache.
CACHE_ONLY | The query is only got from cache, not the network.If the cache has no results, then it will bring about a MLException.
NETWORK_ONLY | The query is only got from network, not the cache, but the query results will be writen into cache.
CACHE\_ELSE_NETWORK | The query is first got from cache, then the network if there's no cache. If both of them fail, then it will bring about a MLException.
NETWORK\_ELSE_CACHE | The query is first got from network, then the cache if there's no network. If both of them fail, then it will bring about a MLException.
CACHE\_THEN_NETWORK | The query is first got from cache, then the network. FindCallback will be invoked twice in this case: first the cache results, then the network query results. This strategy can only be used in asynchronous findInBackground().

You can operate cache with MLQuery if you want to control the cache and you can do following operations towards the cache:

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
MLQuery.clearAlMLachedResults();
```

#####Set Max Cache Age（in milliseconds）：

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));
```

##MLObject Subclass

MaxLeap is easy to start up. You can use MLDataManager.fetchInBackground() to access all data. In lots of mature code, subclass can bring more advantages, like simplicity, expansibility, auto-complete feature supported by IDE, etc. Subclass is not necessary, you can transfer following code:


```java
MLObject shield = new MLObject("Armor");
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

###Create MLObject Subclass

It's easy to create a MLObject subclass: 

1.   Declare that the subclass is inherited from MLObject.
2.   Add @MLclassName annotation. The value must be a string: the class name of the MLObject constructed function you passed in. Thus, this string class name doesn't need to appear in code again.
3.   Make sure that your subclass has a public default (the parameter amount is 0) constructed function. Please don't modify any MLObject property in constructed function. 
4.   Register subclass MLObject.registerSubclass(Yourclass.class) before invoking MaxLeap.initialize() and registering the app.

The following code can sucessfully realize and register the subclass Armor of MLObject:

```java
// Armor.java
import com.ML.MLObject;
import com.ML.MLclassName;

@MLclassName("Armor")
public class Armor extends MLObject {
}

// App.java
import com.ML.MaxLeap;
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
 
####Property Access/Modification

Adding method to MLObject helps encapsulated class logic. You can put the logic that is related to subclass into one place rather than seperate them into multiple classes to process business logic and storage/transformation logic.

You can easily add accessor and modifier to your MLObject subclass, look similar to getter and setter in declared fields, but realized with get and put method of LEObject. Here is the instance of creating a content property for Post class:

```java
// Armor.java
@MLclassName("Armor")
public class Armor extends MLObject {
  public String getDisplayName() {
    return getString("displayName");
  }
  public void setDisplayName(String value) {
    put("displayName", value);
  }
}
```

Now you can access displayName property with armor.getDisplayName() and modify it with armor.setDisplayName(). This enables auto-complete feature supported by IDE, as well as discovering exceptions while compling.

The accessors and modifiers of all data types can be defined like this, using variation of all kinds of get() methods, like getInt()，getMLFile() or getMap().

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
You can create your subclass using your self-defined constructed function. Your subclass must define a public default constructed function and not modify any property in superclass MLObject. This default constructed function will be used to create strongly-typed object of subclass by SDK.

You can create a reference to current object using MLObject.createWithoutData():

```java
Armor armorReference = MLObject.createWithoutData(Armor.class, armor.getObjectId());
```

###Subclass Query
You can get query object of specific subclass with static method MLQuery.getQuery(). The following instance can inquire all boosters user can buy:

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

##MLUser

MLUser is a subclass of MLObject. It inherited all methods of MLObject and has the same features as MLObject. The different is MLUser adds some specific features of user account.

###Property Description
Apart from the properties inherited from MLObject, MLUser has some specific properties:

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
* Unlike other MLObject, MLUser properties are not set by put, but the specific setXXX.
* MaxLeap will collect the value of masterKey，installationIds automatically.

###User Signup

1. Creare MLUser object and provide username and password.
2. Save it to cloud with MLUserManager.signUpInBackground().

```java
String mUsername ＝ "userName";
String mPassword = "passWord";
MLUser user = new MLUser();
user.setUserName(mUsername);
user.setPassword(mPassword);

MLUserManager.signUpInBackground(user, new SignUpCallback() {
	public void done(MLException e) {
	        if (e == null) {
	        // Signup success
	        } else {
	        }
	}
});
```
Notices:

* MaxLeap servre will observe the user info during the signup to make sure that the username and email address is unique. Besides, server will process the password with non-reversible encryption rather than save it. Please don't encrypt the password in clients,it will result in the disorder and disable the password reset.
* Signup uses the signUpInBackground() method rather than saveInBackground(). There are other signup methods as well. We recommend asynchronous signup method as usual and this will not affect the main UI thread. You can check more detailed info in API.
* If the signup failed,you can check the returned error object. The mostly likely case is that the username or email is already taken. In this case, you can remind users to try another username or email.
* You can also ask users to use Email address as username. The username will be taken as Email address and then used for password reset afterwards.

###Signin
You can sign in with MLUserManager.logInInBackground(). Property description: the first one is username, the second one is password and the third one is LogInCallback(), the callback method.

```java
MLUserManager.logInInBackground("userName", "passWord", new LogInCallback<MLUser>() {
  public void done(MLUser user, MLException e) {
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
MLUser currentUser = MLUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

You can clear cached object with following method:

```java
MLUser.logOut();
MLUser currentUser = MLUser.getCurrentUser(); //crrentUser will be null now
```

###Password Reset

MaxLeap provides a method for users to reset the password securely. The procedure is simple, only user's email address is required:

```java
MLUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(MLException e) {
        if (e == null) {
            // Reset Email is Sent
        } else {
        }
    }
});
```
If the email address is same as the email used for signup, then the system will send a reset email. The reset procedure is show as below:

* Users enter their email address and require password reset.
* MaxLeap sends an email to the email address user just provided and this email contains the reset link.
* User click on the reset lins, enter a ML page and set a new password.
* MaxLeap has reset user's password successfully.

###User Query

You can inquire user data with special UserQuery. MaxLeap provides all round protection of user data. More details: [User Object Security](..).

```java
MLQuery<MLUser> query = MLUser.getQuery();
query.whereEqualTo("gender", "female");
MLQueryManager.findAllInBackground(query, new FindCallback<MLUser>() {
  public void done(List<MLUser> objects, MLException e) {
    if (e == null) {
        // The query was successful.
    } else {
        // Something went wrong.
    }
  }
});
```

###Email Verification

MaxLeap provides powerful email verification service, you just need to Enable "Verify user's email address" in Console >> App Settings >> Email Settings and system will add `emailVerified` property in MLUser automatically. When the email property of MLUser is assigned or modified and the value of `emailVerified` is false, then MaxLeap will send a link to users automatically. `emailVerified` will be set as true once users click the link.

Three status of `emailVerified` property:

* true - Successfully verify the email with the link sent by system
* false - Not verify yet or failed to verify
* null - Email verification is not enabled or no email address provided

###Anonymous Users
Anonymous users refers to a special set of users with username and password. They have the same features as other users while once deleted, all data will be no longer accessible. If your app requires a relatively weakened user system, then Anonymous Users of MaxLeap is highly recommended. 

You can get an anonymous user account with MLAnonymousUtils:

```java
MLAnonymousUtils.logIn(new LogInCallback<MLUser>() {
      @Override
      public void done(MLUser user, MLException e) {
        if (e != null) {
          Log.d("MyApp", "Anonymous login failed.");
    } else {
      Log.d("MyApp", "Anonymous user logged in.");
    }
  }
});
```
#####Create Anonymous Users Automatically
You can transfer anonymous users into non-anonymous users by signup or signin and all data of this anonymous user will be saved. You can judge if the current user is anonymous with MLAnonymousUtils.isLinked():

```java
Boolean isAnonymous = MLAnonymousUtils.isLinked(MLUser.getCurrentUser());
```

You can choose to create anonymous users automaticall by system (locally, no network needed) and use app immediately. After the anonymous users auto creation, MLUser.getCurrentUser() will no longer be null. MaxLeap wil create anonymous user in the cloud if you are storing MLObject related to this anonymous user.

#####How to Create Anonymous Users Automatically
Add following code in onCreate() in main Application.

```java
MLUser.enableAutomaticUser();
```

### Manage Users in Console

User class is a specialized class for storing MLUser objects. You'll see a _User class in Console >> Users. More details: [Console UserManual](...).

##User Role
Setting user roles to manage permissions is more effective. The permission assigned to a role will be inherited by users contains in this role. User role is a user collection and a role can also contains another role. There is a corresponding `_Role` class in MaxLeap for storing user roles.

###Property Description

Property Name|Type|Introduction|If Necessary
---|---|---|---
    ACL|ACL|Permission of this Role|**Necessary** (Requires explicit set)
    roles|Relation|MLRoles contained by this MLRole|Optional
    name|String|Role name|Necessary
    user|Relation|Users in this Role|Optional

###Create Roles
There are two parameters required on creating the Role: the first one is the Role name (name property) and the second one is ACL.

```java
MLACL roleACL = new MLACL();
roleACL.setPublicReadAccess(true);
MLRole role = new MLRole("Administrator", roleACL);
MLRoleManager.saveInBackground(role);
```

###Add Users or Roles to the Role
You can add users or roles to the role with role.getUsers().add() or role.getRoles().add().

```java
MLRole role = new MLRole(roleName, roleACL);
for (MLUser user : usersToAddToRole) {
  role.getUsers().add(user)
}
for (MLRole childRole : rolesToAddToRole) {
  role.getRoles().add(childRole);
}
MLRoleManager.saveInBackground(role);
```

###Get Role Object

Here is two ways to get role object:

1. Inquire with role name:

	```java
	MLObject wallPost = new MLObject("WallPost");
	MLACL postACL = new MLACL();
	//assign corresponding Role name：
	postACL.setRoleWriteAccess("Moderators", true);
	wallPost.setACL(postACL);
	MLDataManager.saveInBackground(wallPost);
	```
2. Inquire with Query:

	```JAVA
	MLQuery<MLRole> query = MLRole.getQuery();
	query.whereEqualTo("name", "roleName");
	MLQueryManager.findAllInBackground(query, new FindCallback<MLRole>() {
		public void done(List<MLRole> roleList, MLException e) {
			if (e == null) {
			
			} else {
			
			}
		}
	});
	```

##Data Security

### Security of MLObject
There is a ACL property when user create MLObject. Only MLUser and MLRole in this ACL list has the access. If a user doesn't explicitly set ACL, then system will assign default ACL automatically.

#####ACL
ACL is a white list which contains users that are allowed the access to the data. A User must have the read permission (or belong to the Role that has the read permission) to get the data if an object. Meanwhile, a User must have the write permission (or belong to the Role that has the write permission) to modify or delete an object. e.g. a typical ACL data:

```{"553892e860b21a48a50c1f29":{"read":true,"write":true}}```

indicates that the user whose ObjectId is "553892e860b21a48a50c1f29" has the permission to read and modify the MLObject.

#####Default Permission

Each object in MaxLeap has a default ACL value when there's no explicit designation. This value means that all users have the read and write permission towards this object. You can see following value in ACL property in data manegement class:
```{"*":{"read":true,"write":true}}```

You can modify the value of ACL if needed:

```java
MLACL defaultACL = new MLACL();
defaultACL.setPublicReadAccess(true);
defaultACL.setPublicWriteAccess(false);
MLACL.setDefaultACL(defaultACL, true);
```

The second parameter of `MLACL.setDefaultACL()` is set as true, which means that the read and access permission is added to defaultACL by default, not vice versa.

#####Only Available to Create User
You can set the MLObject as only be read or modified by create users: users need to create MLObject after the signin and then add following ACL properties:

```java
MLObject privateNote = new MLObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new MLACL(MLUser.getCurrentUser()));
MLDataManager.saveInBackground(privateNote);
```
Now, the MLObject - "privateNote" is only available to this user and can be read and modified on any devices signed in by this user.

#####Set Access Permission for Other Users
You can add the read and write permission of **target user** to ACL of MLObject with setReadAccess and setWriteAccess.

For example, add read and modify access for a group of users: 

```java
MLObject groupMessage = new MLObject("Message");
MLACL groupACL = new MLACL();
     
// userList is Iterable<MLUser>, containing a group of MLUser object.
for (MLUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
MLDataManager.saveInBackground(groupMessage);
```

#####Set Access Permission for Roles
You can add the read and write permission of **target Role** to ACL of MLObject with setRoleWriteAccess and setRoleWriteAccess.

For example, add read and modify access for a group of users:

```java
MLRole moderators = /* Query for some MLRole */;
MLObject wallPost = new MLObject("WallPost");
MLACL postACL = new MLACL();
postACL.setRoleWriteAccess(moderators);
wallPost.setACL(postACL);
MLDataManager.saveInBackground(wallPost);
```

#####Set Access Permission for Users and Roles
The ACL of MLObject can be overlapped. For example, when you set ACL for a MLObject, you can add modify permission for a role while adding read permission for all users:


```java
MLObject myMessage = new MLObject("Message");
MLACL myACL = new MLACL();
// add read permission for all users
myACL.setPublicReadAccess(true);
// add modify permission for Moderators
myACL.setRoleWriteAccess("Moderators");
myMessage.setACL(myACL);
```	

#####Set Access Permission for All Users
You can add the read and write permission of **All Users** to ACL of MLObject with setPublicReadAccess and setPublicWriteAccess.
```java
MLObject publicPost = new MLObject("Post");
MLACL postACL = new MLACL();
postACL.setPublicReadAccess(true);
postACL.setPublicWriteAccess(false);
publicPost.setACL(postACL);
MLDataManager.saveInBackground(publicPost);
```

### User Object Security

MaxLeap has normalized the user object security. The data saved in the user object can only be self-modified by default. Clients can read the data but it has no right to modify or delete them. Thus, only the user object got after the signin can be modified. 

This instance is a good example of user obejct security:

```java
MLUserManager.logInInBackground("my_username", "my_password", new LogInCallback<MLUser>() {
    
    @Override
    public void done(MLUser user, MLException exception) {
        user.setUserName("my_new_username"); // Modify Username
        MLUserManager.saveInBackground(user); // Save successfully because of the signin
         
        // not signed in, failed to be modified
        MLQuery<MLUser> query = MLUser.getQuery();
        MLQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<MLUser>() {
          public void done(MLUser object, MLException e) {
            object.setUserName("another_username");
         
            // Error: not authorized
            MLDataManager.saveInBackground(object);
          }
        });
    }
});
```
### Role Object Security

Similar to other MLObjects, MLRole object uses ACL to control the access permission. The different is that MLRole need to set ACL explicitly. Generally speaking, only the admin or other users with elevated permission can create or modify roles, so you need to set access permission when creating MLRole.  

e.g.

```java
MLACL roleACL = new MLACL();
roleACL.setPublicReadAccess(true);
MLRole role = new MLRole("Administrator", roleACL);
MLRoleManager.saveInBackground(role);
```

##Third Party Login

MaxLeap provides 3rd party login service to simplify the signup and signin and integrate ML app as well as apps like Facebook and Twitter. You can use 3rd party app SDK and ML SDK at the same time and connect MLUser and UserId of 3rd party app.

###Log in with Facebook Account
The Android SDK of Facebook helps app optimize the signin experience. As for the devices installed with Facebook app, ML app can realize direct login with Facebook user credential. If there's no Facebook app installed, users can provide signin info in a standard Facebook login page.

If the Facebook UserId is not bound to any MLUser after the Facebook login, MaxLeap will create an account for the user and bind the two.
####Preparations
1. Create Facebook app in [Facebook Dev Center](https://developers.facebook.com). Click My Apps >> Add a New App
2. Open MaxLeap Console >> App Settings >> User Authentication. Check Allow Facebook Authentication and fill the Facebook Application ID and App Secret got from step 1 into relative location.
3. Integrate Facebook SDK, add Facebook Login button. Please check [Add Facebook Login to Your App or Website](https://developers.facebook.com/docs/facebook-login/v2.4) for more details.
4. Add following code after MaxLeap.initialize(this, APP_ID, API_KEY) in Application.onCreate()function:

```java
MLFacebookUtils.initialize("YOUR FACEBOOK APP ID");
```
5. 	Add following code into onActivityResult() function in all Activites invoked Login with Facebook to finish verification.


```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  MLFacebookUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####Sign in and Register New MLUser
If the Facebook UserId is not bound to any MLUser after the Facebook login, MaxLeap will create an account for the user and bind the two. e.g.

```java
MLFacebookUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
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
* MaxLeap SDK accept the result and save it to MLUser. If the Facebook UserId is not bound to any MLUser, then MaxLeap will create an account for the user automatically.
* Invoke LogInCallbackof ML and log in MLUser.

####Bind MLUser and Facebook Account
You can bind ML account and Facebook account with following method:

```java
if (!MLFacebookUtils.isLinked(user)) {
    MLFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLFacebookUtils.isLinked(user)) {
            //Bind Successfully
      }
    }
  });
}
```

MaxLeap will update the Facebook account info to the MLUser after the bind. The next time user logs in with Facebook account, MaxLeap will detect the bind and don't need to add new MLUser to this Facebook account again. 

####Unbind

```java
MLFacebookUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Facebook account.");
    }
  }
});
```
MaxLeap will remove all Facebook account info from the MLUser after the unbind. The next time user logs in with Facebook account, MaxLeap will detect there's no bind and then add new MLUser to this Facebook account.

###Log in with Twitter Account
Similar to Facebook, the Android SDK of Twitter helps app optimize the signin experience. As for the devices installed with Facebook app, ML app can realize direct login with Twitter user credential. If there's no Twitter app installed, users can provide signin info in a standard Twitter login page.

If the Twitter UserId is not bound to any MLUser after the Twitter login, MaxLeap will create an account for the user and bind the two.
####Preparations
1. Create Twitter app in [Twitter Dev Center](...). Click My Apps >> Add a New App
2. Open MaxLeap Console >> App Settings >> User Authentication. Check Allow Twitter Authentication and fill the Twitter consumer Key got from step 1 into relative location.
3. Integrate Twitter SDK, add Twitter Login button. Please check [Add Twitter Login to Your App or Website](...) for more details.
4. Add following code after MaxLeap.initialize(this, APP_ID, API_KEY) in Application.onCreate()function:

```java
MLTwitterUtils.initialize("YOUR Twitter CUSUMER KEY");
```
5. 	Add following code into onActivityResult() function in all Activites invoked Login with Twitter to finish verification.

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  MLTwitterUtils.finishAuthentication(requestCode, resultCode, data);
}
```
####Sign in and Register New MLUser
If the Twitter UserId is not bound to any MLUser after the Twitter login, MaxLeap will create an account for the user and bind the two. e.g.

```java
MLTwitterUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
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
* MaxLeap SDK accept the result and save it to MLUser. If the Twitter UserId is not bound to any MLUser, then MaxLeap will create an account for the user automatically.
* Invoke LogInCallbackof ML and log in MLUser.


####Bind MLUser and Twitter Account
You can bind ML account and Twitter account with following method:

```java
if (!MLTwitterUtils.isLinked(user)) {
    MLTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLTwitterUtils.isLinked(user)) {
            //Bind Successfully
      }
    }
  });
}
```

MaxLeap will update the Twitter account info to the MLUser after the bind. The next time user logs in with Twitter account, MaxLeap will detect the bind and don't need to add new MLUser to this Twitter account again. 


####Unbind

```java
MLTwitterUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Twitter account.");
    }
  }
});
```
MaxLeap will remove all Twitter account info from the MLUser after the unbind. The next time user logs in with Twitter account, MaxLeap will detect there's no bind and then add new MLUser to this Twitter account.


##GeoPoint

MaxLeap provides MLGeoPoint object to help users do location query based on longitude and latitude.

####MLGeoPoint Overview

####Create MLGeoPoint
MLGeoPoint requires two parameters: the first one is Latitude (positive is northern) and the second one is longitude (positive is eastern).

```java
//Create new MLGeoPoint (40.0, -30.0)
MLGeoPoint point = new MLGeoPoint(40.0, -30.0);
```

The MLGeoPoint object can be stored in MLObject：

```java
myShop.put("location", point);
```
####Geolocation Query
#####Inquire the nearest place to target object
You can get adjacent object around A with whereNear method and it requires two parameters: the first one is the property name for storing location of target object and the second one is the location of A. We can find the nearest 10 shops around A with following instance.

```java
MLGeoPoint userLocation = (MLGeoPoint) userObject.get("location");
MLQuery<MLObject> shopQuery = MLQuery.getQuery("Shop");
shopQuery.whereNear("location", userLocation);
query.setLimit(10);
MLQueryManager.findAllInBackground(query, new FindCallback<MLObject>() { ... });
```
#####Inquire objects around a certain location
You can inquire objects within a certain range with whereWithinKilometers and whereWithinMiles. The method is similar to the aforementioned one.
#####Inquire objects within a certain range
You can inquire objects within a certain range with whereWithinGeoBox and it requires three parameters: the first one is the property name for storing location of target object and the next two are MLGeoPoint objects. The circle built with two MLGeoPoints as the endpoints of the diameter is the query range of whereWithinGeoBox. We can find all shops with the certain range with the following instance. 

```java
MLGeoPoint southwestOfSF = new MLGeoPoint(37.708813, -122.526398);
MLGeoPoint northeastOfSF = new MLGeoPoint(37.822802, -122.373962);
MLQuery<MLObject> query = MLQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
MLQueryManager.findAllInBackground(new FindCallback<MLObject>() { ... });
```