---
title: Android Guide

language_tabs:
  - java
---

# Cloud Data

If you haven't installed the SDK yet, please [head over to the QuickStart guide][android guide quick start] to get our SDK up and running in Eclipse. You can also check out our [API Reference][android guide api reference] for more detailed information about our SDK.

[android guide quick start]: ../../quickstart/android/existing.html
[android guide api reference]: ../../api/android/index.html




## Objects
### The LASObject

Storing data on LAS is built around the LASObject. Each LASObject contains key-value pairs of JSON-compatible data. This data is schemaless, which means that you don't need to specify ahead of time what keys exist on each LASObjec. You simply set whatever key-value pairs yoou want, and our backend will store it.

For example, let's say you're tracking high scores for a game. A single LASObject could contain:

```java
LASObject gameScore = new LASObject("GameScore");
LASDataManager.saveInBackground(gameScore);
```

Keys must be alphanumeric strings. Values can be strings, numbers, booleans, or even arrays and objects - anything that can be JSON-encoded.

### Saving Objects

Let's say you want to save the GameScore described above to the LAS Cloud. The interface is similar to a Map, plus the saveInBackground method:

```java
LASObject gameScore = new LASObject("GameScore");
gameScore.put("score", 1337);
gameScore.put("playerName", "Sean Plott");
gameScore.put("cheatMode", false);
LASDataManager.saveInBackground(gameScore);
```

 After this code runs, you will probably be wondering if anything really happened. To make sure the data was saved, you can look at the Data Browser in your app on LAS. You should see something like this:

```java
objectId: "xWMyZ4YEGZ", score: 1337, playerName: "Sean Plott", cheatMode: false,
createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

There are two things to note here. You didn't have to configure or set up a new Class called GameScore before running this code. Your LAS app lazily creates this Class for you when it first encounters it.`

There are also a few fields you don't need to specify that are provided as a convenience. objectId is a unique identifier for each saved object. createdAt and updatedAt represent the time that each object was created and last modified in the cloud. Each of these fields is filled in by LAS, so they don't exist on a LASObject until a save operation has completed.

### Retrieving Objects

Saving data to the cloud is fun, but it's even more fun to get that data out again. If you have the objectId, you can retrieve the whole LASObject using a LASQuery:

```java
LASQuery<LASObject> query = LASQuery.getQuery("GameScore");
LASQueryManager.getInBackground(query,"xWMyZ4YEGZ", new GetCallback<LASObject>() {

  @Override
  public void done(LASObject object, LASException e) {
    if (e == null) {
      // object will be your game score
    } else {
      // something went wrong
    }
  }
});
```

To get the values out of the LASObject, there's a getX method for each data type:

```java
int score = gameScore.getInt("score");
String playerName = gameScore.getString("playerName");
boolean cheatMode = gameScore.getBoolean("cheatMode");
```

If you don't know what type of data you're getting out, you can call get(key), but then you probably have to cast it right away anyways. In most situations you should use the typed accessors like getString.

The three special values have their own accessors:

```java
String objectId = gameScore.getObjectId();
Date updatedAt = gameScore.getUpdatedAt();
Date createdAt = gameScore.getCreatedAt();
```

If you need to refresh an object you already have with the latest data that is in the cloud, you can call the fetchInBackground method like so:

```java
LASDataManager.fetchInBackground(myObject, new GetCallback<LASObject>() {

  @Override
  public void done(LASObject object, LASException e) {
    if (e == null) {
      // Success!
    } else {
      // Failure!
    }
  }
});
```

The code in the GetCallback will be run on the main thread.

### Updating Objects

Updating an object is simple. Just set some new data on it and call one of the save methods. Assuming you have saved the object and have the objectId, you can retrieve the LASObject using a LASQuery and update its data:

```java
// Retrieve the object by id
LASQueryManager.getInBackground(query, "xWMyZ4YEGZ", new GetCallback<LASObject>() {

  @Override
  public void done(LASObject gameScore, LASException e) {
    if (e == null) {
      // Now let's update it with some new data. In this case, only cheatMode and score
      // will get sent to the LAS Cloud. playerName hasn't changed.
      gameScore.put("score", 1338);
      gameScore.put("cheatMode", true);
      LASDataManager.saveInBackground(gameScore);
    }
  }
});
```

LAS automatically figures out which data has changed so only "dirty" fields will be transmitted during a save. You don't need to worry about squashing data in the cloud that you didn't intend to update.

#### Counters

The above example contains a common use case. The "score" field is a counter that we'll need to continually update with the player's latest score. Using the above method works but it's cumbersome and can lead to problems if you have multiple clients trying to update the same counter.

To help with storing counter-type data, LAS provides methods that atomically increment (or decrement) any number field. So, the same update can be rewritten as:

```java
gameScore.increment("score");
LASDataManager.saveInBackground(gameScore);
```

You can also increment by any amount using increment(key, amount).

#### Arrays

To help with storing array data, there are three operations that can be used to atomically change an array field:

add and addAll append the given objects to the end of an array field.
addUnique and addAllUnique add only the given objects which aren't already contained in an array field to that field. The position of the insert is not guaranteed.
removeAll removes all instances of the given objects from an array field.
For example, we can add items to the set-like "skills" field like so:

```java
gameScore.addAllUnique("skills", Arrays.asList("flying", "kungfu"));
LASDataManager.saveInBackground(gameScore);
```

Note that it is not currently possible to atomically add and remove items from an array in the same save. You will have to call save in between every different kind of array operation.

### Deleting Objects

To delete an object from the LAS Cloud:

```java
LASDataManager.deleteInBackground(myObject);
```

If you want to run a callback when the delete is confirmed, you can provide a DeleteCallback to the deleteInBackground method. If you want to block the calling thread, you can use the delete method.

You can delete a single field from an object with the remove method:

```java
// After this, the playerName field will be empty
myObject.remove("playerName");
 
// Saves the field deletion to the LAS Cloud
LASDataManager.saveInBackground(myObject.remove);
```

### Relational Data

Objects can have relationships with other objects. To model this behavior, any LASObject can be used as a value in other LASObjects. Internally, the LAS framework will store the referred-to object in just one place, to maintain consistency.

For example, each Comment in a blogging app might correspond to one Post. To create a new Post with a single Comment, you could write:

```java
// Create the post
LASObject myPost = new LASObject("Post");
myPost.put("title", "I'm Hungry");
myPost.put("content", "Where should we go for lunch?");
 
// Create the comment
LASObject myComment = new LASObject("Comment");
myComment.put("content", "Let's do Sushirrito.");
 
// Add a relation between the Post and Comment
myComment.put("parent", myPost);
 
// This will save both myPost and myComment
LASDataManager.saveInBackground(myComment);
```

You can also link objects using just their objectIds like so:

```java
//Add a relation between the Post with objectId "1zEcyElZ80" and the comment
myComment.put("parent", LASObject.createWithoutData("Post", "1zEcyElZ80"));
```

By default, when fetching an object, related LASObjects are not fetched. These objects' values cannot be retrieved until they have been fetched like so:

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

You can also model a many-to-many relation using the LASRelation object. This works similar to List, except that you don't need to download all the LASObjects in a relation at once. This allows LASRelation to scale to many more objects than the List approach. For example, a User may have many Posts that they might like. In this case, you can store the set of Posts that a User likes using getRelation. In order to add a post to the list, the code would look something like:

```java
LASUser user = LASUser.getCurrentUser();
LASRelation<LASObject> relation = user.getRelation("likes");
relation.add(post);
LASUserManager.saveInBackground(user);
```

You can remove a post from the LASRelation with something like:

```java
relation.remove(post);
```

By default, the list of objects in this relation are not downloaded. You can get the list of Posts by calling findInBackground on the LASQuery returned by getQuery. The code would look like:

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

If you want only a subset of the Posts you can add extra constraints to the LASQuery returned by getQuery. The code would look something like:

```java
LASQuery<LASObject> query = relation.getQuery();
LASQuery<LASObject> query = relation.getQuery();
// Add other query constraints.
```

For more details on LASQuery, please look at the query portion of this guide. A LASRelation behaves similar to a List for querying purposes, so any queries you can do on lists of objects (other than include) you can do on LASRelation.

### Data Types

So far we've used values with type String, int, bool, and LASObject. LAS also supports java.util.Date, byte[], and JSONObject.NULL.

You can nest JSONObject and JSONArray objects to store more structured data within a single LASObject.

Some examples:

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

We do not recommend storing large pieces of binary data like images or documents using byte[] fields on LASObject. LASObjectss should not exceed 128 kilobytes in size. To store more, we recommend you use LASFile. See the guide section for more details.

For more information about how LAS handles data, check out our documentation on Data & Security.

## Queries

### Basic Queries

In many cases, getInBackground isn't powerful enough to specify which objects you want to retrieve. The LASQuery offers different ways to retrieve a list of objects rather than just a single object.

The general pattern is to create a LASQuery, put conditions on it, and then retrieve a List of matching LASObjects using the findInBackground method with a FindCallback. For example, to retrieve scores with a particular playerName, use the whereEqualTo method to constrain the value for a key:

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

findInBackground works similarly to getInBackground in that it assures the network request is done on a background thread, and runs its callback in the main thread.

### Query Constraints

There are several ways to put constraints on the objects found by a LASQuery. You can filter out objects with a particular key-value pair with whereNotEqualTo:

```java
query.whereNotEqualTo("playerName", "Michael Yabuti");
```

You can give multiple constraints, and objects will only be in the results if they match all of the constraints. In other words, it's like an AND of constraints.

```java
query.whereNotEqualTo("playerName", "Michael Yabuti");
query.whereGreaterThan("playerAge", 18);
```

You can limit the number of results with setLimit. By default, results are limited to 100, but anything from 1 to 1000 is a valid limit:

```java
query.setLimit(10); // limit to at most 10 results
```

If you want exactly one result, a more convenient alternative may be to use getFirst or getFirstBackground instead of using find.

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

You can skip the first results with setSkip. This can be useful for pagination:

```java
query.setSkip(10); // skip the first 10 results
```

For sortable types like numbers and strings, you can control the order in which results are returned:

```java
// Sorts the results in ascending order by the score field
query.orderByAscending("score");
 
// Sorts the results in descending order by the score field
query.orderByDescending("score");
```

You can add more sort keys to the query as follows:

```java
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
query.addAscendingOrder("score");
 
// Sorts the results in descending order by the score field if the previous sort keys are equal.
query.addDescendingOrder("score");
```

For sortable types, you can also use comparisons in queries:

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

If you want to retrieve objects matching several different values, you can use whereContainedIn, providing a collection of acceptable values. This is often useful to replace multiple queries with a single query. For example, if you want to retrieve scores made by any player in a particular list:

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereContainedIn("playerName", Arrays.asList(names));
```

If you want to retrieve objects that do not match any of several values you can use whereKey:notContainedIn:, providing an array of acceptable values. For example, if you want to retrieve scores from players besides those in a list:

```java
String[] names = {"Jonathan Walsh", "Dario Wunsch", "Shawn Simon"};
query.whereNotContainedIn("playerName", Arrays.asList(names));
```

If you want to retrieve objects that have a particular key set, you can use whereExists. Conversely, if you want to retrieve objects without a particular key set, you can use whereDoesNotExist.

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

You can restrict the fields returned by calling selectKeys with a collection of keys. To retrieve documents that contain only the score and playerName fields (and also special built-in fields such as objectId, createdAt, and updatedAt):

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

The remaining fields can be fetched later by calling one of the fetchIfNeeded variants on the returned objects:

```java
LASObject object = results.get(0);
LASDataManager.fetchInBackground(object, new GetCallback<LASObject>() {

    @Override
    public void done(LASObject object, LASException exception) {
        // all fields of the object will now be available here.
    }
});
```

### Queries on Array Values

If a key contains an array value, you can search for objects where the key's array value contains 2 by:

```java
// Find objects where the array in arrayKey contains the number 2.
query.whereEqualTo("arrayKey", 2);
```

You can also search for objects where the key's array value contains each of the values 2, 3, and 4 with the following:

```java
// Find objects where the array in arrayKey contains all of the numbers 2, 3, and 4.
ArrayList<Integer> numbers = new ArrayList<Integer>();
numbers.add(2);
numbers.add(3);
numbers.add(4);
query.whereContainsAll("arrayKey", numbers);
```

### Queries on String Values

Use whereStartsWith to restrict to string values that start with a particular string. Similar to a MySQL LIKE operator, this is indexed so it is efficient for large datasets:

```java
// Finds barbecue sauces that start with "Big Daddy's".
LASQuery<LASObject> query = LASQuery.getQuery("BarbecueSauce");
query.whereStartsWith("name", "Big Daddy's");
```

<aside class="notice">
    <span class="icon"></span>
    <span class="text">
        If you're trying to implement a generic search feature, we recommend taking a look at this blog post: Implementing Scalable Search on a NoSQL Backend.
    </span>
</aside>

### Relational Queries

There are several ways to issue queries for relational data. If you want to retrieve objects where a field matches a particular LASObject, you can use whereEqualTo just like for other data types. For example, if each Comment has a Post object in its post field, you can fetch comments for a particular Post:

```java
//Assume LASObject myPost was previously created.
LASQuery<LASObject> query = LASQuery.getQuery("Comment");
query.whereEqualTo("post", myPost);

LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() {
public void done(List<LASObject> commentList, LASException e) {
 // commentList now has the comments for myPost
}
});
```

If you want to retrieve objects where a field contains a LASObject that matches a different query, you can use whereMatchesQuery. Note that the default limit of 100 and maximum limit of 1000 apply to the inner query as well, so with large data sets you may need to construct queries carefully to get the desired behavior. In order to find comments for posts containing images, you can do:

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

If you want to retrieve objects where a field contains a LASObject that does not match a different query, you can use whereDoesNotMatchQuery. In order to find comments for posts without images, you can do:

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

In some situations, you want to return multiple types of related objects in one query. You can do this with the include method. For example, let's say you are retrieving the last ten comments, and you want to retrieve their related posts at the same time:

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

You can also do multi level includes using dot notation. If you wanted to include the post for a comment and the post's author as well you can do:

```java
query.include("post.author");
```

You can issue a query with multiple fields included by calling include multiple times. This functionality also works with LASQuery helpers like getFirst() and getInBackground().

### Caching Queries

The default query behavior doesn't use the cache, but you can enable caching with setCachePolicy. For example, to try the network and then fall back to cached data if the network is not available:

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

LAS provides several different cache policies:

IGNORE_CACHE 
The query does not load from the cache or save results to the cache. IGNORE_CACHE is the default cache policy.
CACHE_ONLY 
The query only loads from the cache, ignoring the network. If there are no cached results, that causes a LASException.
NETWORK_ONLY 
The query does not load from the cache, but it will save results to the cache.
CACHE_ELSE_NETWORK 
The query first tries to load from the cache, but if that fails, it loads results from the network. If neither cache nor network succeed, there is a LASException.
NETWORK_ELSE_CACHE 
The query first tries to load from the network, but if that fails, it loads results from the cache. If neither network nor cache succeed, there is a LASException.
CACHE_THEN_NETWORK 
The query first loads from the cache, then loads from the network. In this case, the FindCallback will actually be called twice - first with the cached results, then with the network results. This cache policy can only be used asynchronously with findInBackground.
If you need to control the cache's behavior, you can use methods provided in LASQuery to interact with the cache. You can do the following operations on the cache:

Check to see if there is a cached result for the query with:

```java
boolean isInCache = query.hasCachedResult();
```

Remove any cached results for a query with:

```java
query.clearCachedResult();
```

Remove cached results for all queries with:

```java
LASQuery.clearAllCachedResults();
```

Control the maximum age of a cached result with:

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));
```

Query caching also works with LASQuery helpers including getFirstInBackground() and getInBackground().

### Counting Objects

If you just need to count how many objects match a query, but you do not need to retrieve all the objects that match, you can use count instead of find. For example, to count how many games have been played by a particular player:

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

If you want to block the calling thread, you can also use the synchronous query.count() method.

For classes with over 1000 objects, count operations are limited by timeouts. They may routinely yield timeout errors or return results that are only approximately correct. Thus, it is preferable to architect your application to avoid this sort of count operation.

### Compound Queries

If you want to find objects that match one of several queries, you can use LASQuery.or method to construct a query that is an or of the queries passed in. For instance if you want to find players who either have a lot of wins or a few wins, you can do:

```java
LASQuery<LASObject> lotsOfWins = LASQuery.getQuery("Player");
lotsOfWins.whereGreaterThan("score", 150);
 
LASQuery<LASObject> fewWins = LASQuery.getQuery("Player");
fewWins.whereLessThan("score", 5);
 
List<LASQuery<LASObject>> queries = new ArrayList<LASQuery<LASObject>>();
queries.add(lotsOfWins);
queries.add(fewWins);
 
LASQuery<LASObject> mainQuery = LASQuery.or(queries);
LASQueryManager.findAllInBackground(mainQuery, new FindCallback<LASObject>() {
  public void done(List<LASObject> results, LASException e) {
    // results has the list of players that win a lot or haven't won much.
  }
});
```

You can add additional constraints to the newly created LASQuery that act as an 'and' operator.

Note that we do not, however, support non-filtering constraints (e.g. setLimit, skip, orderBy..., include) in the subqueries of the compound query.

## Subclasses

LAS is designed to get you up and running as quickly as possible. You can access all of your data using the LASObject class and access any field with get(). In mature codebases, subclasses have many advantages, including terseness, extensibility, and support for autocomplete. Subclassing is completely optional, but can transform this code:

```java
LASObject shield = new LASObject("Armor");
shield.put("displayName", "Wooden Shield");
shield.put("fireproof", false);
shield.put("rupees", 50);
```

Into this:

```java
Armor shield = new Armor();
shield.setDisplayName("Wooden Shield");
shield.setFireproof(false);
shield.setRupees(50);
```

Subclassing LASObject

To create a LASObject subclass:

Declare a subclass which extends LASObject.
Add a @LASClassName annotation. Its value should be the string you would pass into the LASObject constructor, and makes all future class name references unnecessary.
Ensure that your subclass has a public default (i.e. zero-argument) constructor. You must not modify any LASObject fields in this constructor.
Call LASObject.registerSubclass(YourClass.class) in your Application constructor before calling LAS.initialize().
The following code sucessfully implements and registers the Armor subclass of LASObject:

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



### Accessors, Mutators, and Methods

Adding methods to your LASObject subclass helps encapsulate logic about the class. You can keep all your logic about a subject in one place rather than using separate classes for business logic and storage/transmission logic.

You can add accessors and mutators for the fields of your LASObject easily. Declare the getter and setter for the field as you normally would, but implement them in terms of get() and put(). The following example creates a displayName field in the Armor class:

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

You can now access the displayName field using armor.getDisplayName() and assign to it using armor.setDisplayName("Wooden Sword"). This allows your IDE to provide autocompletion as you develop your app and allows typos to be caught at compile-time.

Accessors and mutators of various types can be easily defined in this manner using the various forms of get() such as getInt(), getLASFile(), or getMap().

If you need more complicated logic than simple field access, you can declare your own methods as well:

```java
public void takeDamage(int amount) {
  // Decrease the armor's durability and determine whether it has broken
  increment("durability", -amount);
  if (getDurability() < 0) {
    setBroken(true);
  }
}
```

### Initializing Subclasses

You should create new instances of your subclasses using the constructors you have defined. Your subclass must define a public default constructor that does not modify fields of the LASObject, which will be used throughout the LAS SDK to create strongly-typed instances of your subclass.

To create a reference to an existing object, use LASObject.createWithoutData():

```java
Armor armorReference = LASObject.createWithoutData(Armor.class, armor.getObjectId());
```

### Queries

You can get a query for objects of a particular subclass using the static method LASQuery.getQuery(). The following example queries for armors that the user can afford:

```java
LASQuery<Armor> query = LASQuery.getQuery(Armor.class);
query.whereLessThanOrEqualTo("rupees", LASUser.getCurrentUser().get("rupees"));
LASQueryManager.findAllInBackground(query, new FindCallback<Armor>() {
  @Override
  public void done(List<Armor> results, LASException e) {
    for (Armor a : results) {
      // ...
    }
  }
});
```

## Files

## Analytics

## Push Notifications

## Users

At the core of many apps, there is a notion of user accounts that lets users access their information in a secure manner. We provide a specialized user class called LASUser that automatically handles much of the functionality required for user account management.

With this class, you'll be able to add user account functionality in your app.

LASUser is a subclass of the LASObject, and has all the same features, such as flexible schema, automatic persistence, and a key value interface. All the methods that are on LASObject also exist in LASUser. The difference is that LASUser has some special additions specific to user accounts.

### Properties

LASUser has several properties that set it apart from LASObject:

username: The username for the user (required).
password: The password for the user (required on signup).
email: The email address for the user (optional).
We'll go through each of these in detail as we run through the various use cases for users. Keep in mind that if you set username and email using the setters, you do not need to set it using the put method.

### Signing Up

The first thing your app will do is probably ask the user to sign up. The following code illustrates a typical sign up:

```java
LASUser user = new LASUser();
user.setUserName("my name");
user.setPassword("my pass");
user.setEmail("email@example.com");

// other fields can be set just like with LASObject
user.put("phone", "650-253-0000");

LASUserManager.signUpInBackground(user, new SignUpCallback() {
  public void done(LASException e) {
    if (e == null) {
      // Hooray! Let them use the app now.
    } else {
      // Sign up didn't succeed. Look at the LASException
      // to figure out what went wrong
    }
  }
});
```

This call will asynchronously create a new user in your LAS App. Before it does this, it checks to make sure that both the username and email are unique. Also, it securely hashes the password in the cloud. We never store passwords in plaintext, nor will we ever transmit passwords back to the client in plaintext.

Note that we used the signUpInBackground method, not the saveInBackground method. New LASUsers should always be created using the signUpInBackground (or signUp) method. Subsequent updates to a user can be done by calling save.

The signUpInBackground method comes in various flavors, with the ability to pass back errors, and also synchronous versions. As usual, we highly recommend using the asynchronous versions when possible, so as not to block the UI in your app. You can read more about these specific methods in our API docs.

If a signup isn't successful, you should read the error object that is returned. The most likely case is that the username or email has already been taken by another user. You should clearly communicate this to your users, and ask them try a different username.

You are free to use an email address as the username. Simply ask your users to enter their email, but fill it in the username property — LASUser will work as normal. We'll go over how this is handled in the reset password section.

### Logging In

Of course, after you allow users to sign up, you need be able to let them log in to their account in the future. To do this, you can use the class method logInInBackground.

```java
LASUserManager.logInInBackground("Jerry", "showmethemoney", new LogInCallback<LASUser>() {
  public void done(LASUser user, LASException e) {
    if (user != null) {
      // Hooray! The user is logged in.
    } else {
      // Signup failed. Look at the LASException to see what happened.
    }
  }
});
```

### Verifying Emails

Enabling email verification in an application's settings allows the application to reserve part of its experience for users with confirmed email addresses. Email verification adds the emailVerified key to the LASUser object. When a LASUser's email is set or modified, emailVerified is set to false. LAS then emails the user a link which will set emailVerified to true.

There are three emailVerified states to consider:

true - the user confirmed his or her email address by clicking on the link LAS emailed them. LASUsers can never have a true value when the user account is first created.
false - at the time the LASUser object was last fetched, the user had not confirmed his or her email address. If emailVerified is false, consider calling fetch() on the LASUser.
missing - the LASUser was created when email verification was off or the LASUser does not have an email.

### Current User

It would be bothersome if the user had to log in every time they open your app. You can avoid this by using the cached currentUser object.

Whenever you use any signup or login methods, the user is cached on disk. You can treat this cache as a session, and automatically assume the user is logged in:

```java
LASUser currentUser = LASUser.getCurrentUser();
if (currentUser != null) {
  // do stuff with the user
} else {
  // show the signup or login screen
}
```

You can clear the current user by logging them out:

```java
LASUser.logOut();
LASUser currentUser = LASUser.getCurrentUser(); // this will now be null
```

### Anonymous Users

Being able to associate data and objects with individual users is highly valuable, but sometimes you want to be able to do this without forcing a user to specify a username and password.

An anonymous user is a user that can be created without a username and password but still has all of the same capabilities as any other LASUser. After logging out, an anonymous user is abandoned, and its data is no longer accessible.

You can create an anonymous user using LASAnonymousUtils:

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

You can convert an anonymous user into a regular user by setting the username and password, then calling signUp(), or by logging in or linking with a service like Facebook or Twitter. The converted user will retain all of its data. To determine whether the current user is an anonymous user, you can check LASAnonymousUtils.isLinked():

```java
if (LASAnonymousUtils.isLinked(LASUser.getCurrentUser())) {
  enableSignUpButton();
} else {
  enableLogOutButton();
}
```

Anonymous users can also be automatically created for you without requiring a network request, so that you can begin working with your user immediately when your application starts. When you enable automatic anonymous user creation at application startup, LASUser.getCurrentUser() will never be null. The user will automatically be created in the cloud the first time the user or any object with a relation to the user is saved. Until that point, the user's object ID will be null. Enabling automatic user creation makes associating data with your users painless. For example, in your Application.onCreate() method, you might write:

```java
arseUser.enableAutomaticUser();
LASUser.getCurrentUser().increment("RunCount");
LASUserManager.saveInBackground(LASUser.getCurrentUser);
```

### Setting the Current User

If you’ve created your own authentication routines, or otherwise logged in a user on the server side, you can now pass the session token to the client and use the become method. This method will ensure the session token is valid before setting the current user.

```java
LASUserManager.becomeInBackground("session-token-here", new LogInCallback<LASUser>() {
    
    @Override
    public void done(LASUser user, LASException e) {
        if (user != null) {
            // The current user is now set to user.
        } else {
            // The token could not be validated.
        }
    }
});
```

### Security For User Objects

The LASUser class is secured by default. Data stored in a LASUser can only be modified by that user. By default, the data can still be read by any client. Thus, some LASUser objects are authenticated and can be modified, whereas others are read-only.

Specifically, you are not able to invoke any of the save or delete type methods unless the LASUser was obtained using an authenticated method, like logIn or signUp. This ensures that only the user can alter their own data.

The following illustrates this security policy:

```java
LASUserManager.logInInBackground("my_username", "my_password", new LogInCallback<LASUser>() {
    
    @Override
    public void done(LASUser user, LASException exception) {
        user.setUserName("my_new_username"); // attempt to change username
        LASUserManager.saveInBackground(user); // This succeeds, since the user was authenticated on the device
         
        // Get the user from a non-authenticated manner
        LASQuery<LASUser> query = LASUser.getQuery();
        LASQueryManager.getInBackground(query, user.getObjectId(), new GetCallback<LASUser>() {
          public void done(LASUser object, LASException e) {
            object.setUserName("another_username");
         
            // This will throw an exception, since the LASUser is not authenticated
            LASDataManager.saveInBackground(object);
          }
        });
    }
});
```

The LASUser obtained from getCurrentUser() will always be authenticated.

If you need to check if a LASUser is authenticated, you can invoke the isAuthenticated() method. You do not need to check isAuthenticated() with LASUser objects that are obtained via an authenticated method.

### Security for Other Objects

The same security model that applies to the LASUser can be applied to other objects. For any object, you can specify which users are allowed to read the object, and which users are allowed to modify an object. To support this type of security, each object has an access control list, implemented by the LASACL class.

The simplest way to use a LASACL is to specify that an object may only be read or written by a single user. To create such an object, there must first be a logged in LASUser. Then, new LASACL(user) generates a LASACL that limits access to that user. An object's ACL is updated when the object is saved, like any other property. Thus, to create a private note that can only be accessed by the current user:

```java
LASObject privateNote = new LASObject("Note");
privateNote.put("content", "This note is private!");
privateNote.setACL(new LASACL(LASUser.getCurrentUser()));
LASDataManager.saveInBackground(privateNote);
```

This note will then only be accessible to the current user, although it will be accessible to any device where that user is signed in. This functionality is useful for applications where you want to enable access to user data across multiple devices, like a personal todo list.

Permissions can also be granted on a per-user basis. You can add permissions individually to a LASACL using setReadAccess and setWriteAccess. For example, let's say you have a message that will be sent to a group of several users, where each of them have the rights to read and delete that message:

```java
LASObject groupMessage = new LASObject("Message");
LASACL groupACL = new LASACL();
     
// userList is an Iterable<LASUser> with the users we are sending this message to.
for (LASUser user : userList) {
  groupACL.setReadAccess(user, true);
  groupACL.setWriteAccess(user, true);  
}
 
groupMessage.setACL(groupACL);
LASDataManager.saveInBackground(groupMessage);
```

You can also grant permissions to all users at once using setPublicReadAccess and setPublicWriteAccess. This allows patterns like posting comments on a message board. For example, to create a post that can only be edited by its author, but can be read by anyone:

```java
LASObject publicPost = new LASObject("Post");
LASACL postACL = new LASACL(LASUser.getCurrentUser());
postACL.setPublicReadAccess(true);
publicPost.setACL(postACL);
LASDataManager.saveInBackground(publicPost);
```

To help ensure that your users' data is secure by default, you can set a default ACL to be applied to all newly-created LASObjects:

```java
LASACL.setDefaultACL(defaultACL, true);
```

In the code above, the second parameter to setDefaultACL tells LAS to ensure that the default ACL assigned at the time of object creation allows read and write access to the current user at that time. Without this setting, you would need to reset the defaultACL every time a user logs in or out so that the current user would be granted access appropriately. With this setting, you can ignore changes to the current user until you explicitly need to grant different kinds of access.

Default ACLs make it easy to create apps that follow common access patterns. An application like Twitter, for example, where user content is generally visible to the world, might set a default ACL such as:

```java
LASACL defaultACL = new LASACL();
defaultACL.setPublicReadAccess(true);
LASACL.setDefaultACL(defaultACL, true);
```

For an application like Dropbox, where a user's data is only accessible by the user itself unless explicit permission is given, you would provide a default ACL where only the current user is given access:

```java
LASACL.setDefaultACL(new LASACL(), true);
```

An application that logs data to LAS but doesn't provide any user access to that data would instead deny access to the current user while providing a restrictive ACL:

```java
LASACL.setDefaultACL(new LASACL(), false);
```

Operations that are forbidden, such as deleting an object that you do not have write access to, result in a LASException.OBJECT_NOT_FOUND error code. For security purposes, this prevents clients from distinguishing which object ids exist but are secured, versus which object ids do not exist at all.

### Resetting Passwords

It's a fact that as soon as you introduce passwords into a system, users will forget them. In such cases, our library provides a way to let them securely reset their password.

To kick off the password reset flow, ask the user for their email address, and call:

```java
LASUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(LASException e) {
        if (e == null) {
            // An email was successfully sent with reset
            // instructions.
        } else {
            // Something went wrong. Look at the LASException
            // to see what's up.
        }
    }
});
```

This will attempt to match the given email with the user's email or username field, and will send them a password reset email. By doing this, you can opt to have users use their email as their username, or you can collect it separately and store it in the email field.

The flow for password reset is as follows:

User requests that their password be reset by typing in their email.
LAS sends an email to their address, with a special password reset link.
User clicks on the reset link, and is directed to a special LAS page that will allow them type in a new password.
User types in a new password. Their password has now been reset to a value they specify.
Note that the messaging in this flow will reference your app by the name that you specified when you created this app on LAS.

### Querying

To query for users, you need to use the special user query:

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

In addition, you can use get to get a LASUser by id.

### Associations

Associations involving a LASUser work right of the box. For example, let's say you're making a blogging app. To store a new post for a user and retrieve all their posts:

```java
//Make a new post
LASObject post = new LASObject("Post");
post.put("title", "My New Post");
post.put("body", "This is some great content.");
post.put("user", user);
LASDataManager.saveInBackground(post);

//Find all posts by the current user
LASQuery<LASObject> query = LASQuery.getQuery("Post");
query.whereEqualTo("user", user);
LASQueryManager.findAllInBackground(query,  new FindCallback<LASObject>() {

    @Override
    public void done(List<LASObject> objects, LASException exception) {
        
    }
});
```

### Users in the Data Browser

The User class is a special class that is dedicated to storing LASUser objects. In the data browser, you'll see a little person icon next to the User class:

## Roles

As your app grows in scope and user-base, you may find yourself needing more coarse-grained control over access to pieces of your data than user-linked ACLs can provide. To address this requirement, LAS supports a form of Role-based Access Control. Roles provide a logical way of grouping users with common access privileges to your LAS data. Roles are named objects that contain users and other roles. Any permission granted to a role is implicitly granted to its users as well as to the users of any roles that it contains.

For example, in your application with curated content, you may have a number of users that are considered "Moderators" and can modify and delete content created by other users. You may also have a set of users that are "Administrators" and are allowed all of the same privileges as Moderators, but can also modify the global settings for the application. By adding users to these roles, you can ensure that new users can be made moderators or administrators, without having to manually grant permission to every resource for each user.

We provide a specialized class called LASRole that represents these role objects in your client code. LASRole is a subclass of LASObject, and has all of the same features, such as a flexible schema, automatic persistence, and a key value interface. All the methods that are on LASObject also exist on LASRole. The difference is that LASRole has some additions specific to management of roles.

### Properties

LASRole has several properties that set it apart from LASObject:

name: The name for the role. This value is required, and can only be set once as a role is being created. The name must consist of alphanumeric characters, spaces, -, or _. This name will be used to identify the Role without needing its objectId.
users: A relation to the set of users that will inherit permissions granted to the containing role.
roles: A relation to the set of roles whose users and roles will inherit permissions granted to the containing role.

### Security for Role Objects

The LASRole uses the same security scheme (ACLs) as all other objects on LAS, except that it requires an ACL to be set explicitly. Generally, only users with greatly elevated privileges (e.g. a master user or Administrator) should be able to create or modify a Role, so you should define its ACLs accordingly. Remember, if you give write-access to a LASRole to a user, that user can add other users to the role, or even delete the role altogether.

To create a new LASRole, you would write:

```java
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
LASACL roleACL = new LASACL();
roleACL.setPublicReadAccess(true);
LASRole role = new LASRole("Administrator", roleACL);
LASRoleManager.saveInBackground(role);
```

You can add users and roles that should inherit your new role's permissions through the "users" and "roles" relations on LASRole:

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

Take great care when assigning ACLs to your roles so that they can only be modified by those who should have permissions to modify them.

### Security for Other Objects

Now that you have created a set of roles for use in your application, you can use them with ACLs to define the privileges that their users will receive. Each LASObject can specify a LASACL, which provides an access control list that indicates which users and roles should be granted read or write access to the object.

Giving a role read or write permission to an object is straightforward. You can either use the LASRole:

```java
LASRole moderators = /* Query for some LASRole */;
LASObject wallPost = new LASObject("WallPost");
LASACL postACL = new LASACL();
postACL.setRoleWriteAccess(moderators);
wallPost.setACL(postACL);
LASDataManager.saveInBackground(wallPost);
```

You can avoid querying for a role by specifying its name for the ACL:

```java
LASObject wallPost = new LASObject("WallPost");
LASACL postACL = new LASACL();
postACL.setRoleWriteAccess("Moderators", true);
wallPost.setACL(postACL);
LASDataManager.saveInBackground(wallPost);
```

Role-based LASACLs can also be used when specifying default ACLs for your application, making it easy to protect your users' data while granting access to users with additional privileges. For example, a moderated forum application might specify a default ACL like this:

```java
LASACL defaultACL = new LASACL();
// Everybody can read objects created by this user
defaultACL.setPublicReadAccess(true);
// Moderators can also modify these objects
defaultACL.setRoleWriteAccess("Moderators");
// And the user can read and modify its own objects
LASACL.setDefaultACL(defaultACL, true);
```

### Role Hierarchy

As described above, one role can contain another, establishing a parent-child relationship between the two roles. The consequence of this relationship is that any permission granted to the parent role is implicitly granted to all of its child roles.

These types of relationships are commonly found in applications with user-managed content, such as forums. Some small subset of users are "Administrators", with the highest level of access to tweaking the application's settings, creating new forums, setting global messages, and so on. Another set of users are "Moderators", who are responsible for ensuring that the content created by users remains appropriate. Any user with Administrator privileges should also be granted the permissions of any Moderator. To establish this relationship, you would make your "Administrators" role a child role of "Moderators", like this:

```java
LASRole administrators = /* Your "Administrators" role */;
LASRole moderators = /* Your "Moderators" role */;
moderators.getRoles().add(administrators);
LASRoleManager.saveInBackground(moderators);
```

## Facebook Users

LAS provides an easy way to integrate Facebook with your application. The Facebook SDK can be used with our SDK, and is integrated with the LASUser class to make linking your users to their Facebook identities easy.

Using our Facebook integration, you can associate an authenticated Facebook user with a LASUser. With just a few lines of code, you'll be able to provide a "log in with Facebook" option in your app, and be able to save their data to LAS.

### Setup

To start using Facebook with LAS, you need to:

Set up a Facebook app, if you haven't already.
Add your application's Facebook Application ID on your LAS application's settings page.
Follow Facebook's instructions for getting started with the Facebook SDK to create an app linked to the Facebook SDK. Once you get to Step 6, stop after linking the Facebook SDK project and configuring the Facebook app ID. You can use our guide to attach your LAS users to their Facebook accounts when logging in.
Add the following where you initialize the LAS SDK in your Application.onCreate()

```java
LASFacebookUtils.initialize("YOUR FACEBOOK APP ID");
```

Facebook's Android SDK provides an enhanced login experience on devices that have Facebook's official Android app installed. This allows users of apps that support Facebook login to sign in directly through the Facebook app, using credentials that are already on the device. If the Facebook app is not installed, the default dialog-based authentication will be used. Facebook calls this feature "Single sign-on," and requires you to override onActivityResult() in your calling Activity to invoke finishAuthentication().

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  LASFacebookUtils.finishAuthentication(requestCode, resultCode, data);
}
```

If your Activity is already using onActivityResult(), you can avoid requestCode collisions by calling the versions of link() and logIn() that take an activityCode parameter and specifying a code you know to be unique. Otherwise, a sensible default activityCode will be used.

If you encounter any issues that are Facebook-related, a good resource is the official Facebook SDK for Android page.

LAS is compatible with v3.0 of the Facebook SDK for Android.

There are two main ways to use Facebook with your LAS users: (1) logging in as a Facebook user and creating a LASUser, or (2) linking Facebook to an existing LASUser.

### Login & Signup

LASFacebookUtils provides a way to allow your LASUsers to log in or sign up through Facebook. This is accomplished using the logIn() method:

```java
LASFacebookUtils.logInInBackground(this, new LogInCallback<LASUser>() {
  @Override
  public void done(LASUser user, LASException err) {
    if (user == null) {
      Log.d("MyApp", "Uh oh. The user cancelled the Facebook login.");
    } else if (user.isNew()) {
      Log.d("MyApp", "User signed up and logged in through Facebook!");
    } else {
      Log.d("MyApp", "User logged in through Facebook!");
    }
  }
});
```

When this code is run, the following happens:

The user is shown the Facebook login dialog or a prompt generated by the Facebook app.
The user authenticates via Facebook, and your app receives a callback.
Our SDK receives the Facebook data and saves it to a LASUser. If it's a new user based on the Facebook ID, then that user is created.
Your LogInCallback is called with the user.
In order to display the Facebook login dialogs and activities, the current Activity must be provided (often, the current activity is this when calling logIn() from within the Activity) as we have done above.

You may optionally provide a collection of strings that specifies what read permissions your app requires from the Facebook user. You may specify these strings yourself, or use the constants we've provided for you in the LASFacebookUtils.Permissions class. For example:

```java
LASFacebookUtils.logInInBackground(Arrays.asList("email", Permissions.Friends.ABOUT_ME),
        this, new LogInCallback<LASUser>() {
  @Override
  public void done(LASUser user, LASException err) {
    // Code to handle login.
  }
});
```

LASUser integration doesn't require any permissions to work out of the box (ie. null or specifying no permissions is perfectly acceptable). When logging in, you can only use read permissions. See our documentation below about requesting additional permissions (read or publish). Read more about permissions on Facebook's developer guide.

<aside class="notice">
    <span class="icon"></span>
    <span class="text">
        It is up to you to record any data that you need from the Facebook user after they authenticate. To accomplish this, you'll need to do a graph query via Facebook's SDK.
    </span>
</aside>

### Linking

If you want to associate an existing LASUser to a Facebook account, you can link it like so:

```java
if (!LASFacebookUtils.isLinked(user)) {
    LASFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LASException ex) {
          if (LASFacebookUtils.isLinked(user)) {
            Log.d("MyApp", "Woohoo, user logged in with Facebook!");
      }
    }
  });
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing LASUser is updated with the Facebook information. Future logins via Facebook will now log the user into their existing account.

If you want to unlink Facebook from a user, simply do this:

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

### Requesting Permissions

As of v3.0 of the Facebook SDK, read and publish permissions must be requested separately. LASFacebookUtils.logIn() and LASFacebookUtils.link() only allow you to request read permissions. To request additional permissions, you may call LASFacebookUtils.getSession().requestNewReadPermissions() or LASFacebookUtils.getSession().requestNewPublishPermissions(). For more information about requesting new permissions, please see Facebook's API documentation for these functions.

After successfully retrieving new permissions, please call LASFacebookUtilities.saveLatestSessionData(), which will save any changes to the session token back to the LASUser and ensure that this session data follows the user wherever it logs in.

### Facebook SDK and LAS

The Facebook Android SDK provides a number of helper classes for interacting with Facebook's API. Generally, you will use the Request class to interact with Facebook on behalf of your logged-in user. You can read more about the Facebook SDK here.

Our library manages the user's Session object for you. You can simply call LASFacebookUtils.getSession() to access the session instance, which can then be passed to Requests.

## Twitter Users

As with Facebook, LAS also provides an easy way to integrate Twitter authentication into your application. The LAS SDK provides a straightforward way to authorize and link a Twitter account to your LASUsers. With just a few lines of code, you'll be able to provide a "log in with Twitter" option in your app, and be able to save their data to LAS.

Setup

To start using Twitter with LAS, you need to:

Set up a Twitter app, if you haven't already.
Add your application's Twitter consumer key on your LAS application's settings page.
When asked to specify a "Callback URL" for your Twitter app, please insert a valid URL. This value will not be used by your iOS or Android application, but is necessary in order to enable authentication through Twitter.
Add the following where you initialize the LAS SDK in your Application.onCreate()

```java
LASTwitterUtils.initialize("YOUR CONSUMER KEY", "YOUR CONSUMER SECRET");
```

If you encounter any issues that are Twitter-related, a good resource is the official Twitter documentation.

There are two main ways to use Twitter with your LAS users: (1) logging in as a Twitter user and creating a LASUser, or (2) linking Twitter to an existing LASUser.

### Login & Signup

LASTwitterUtils provides a way to allow your LASUsers to log in or sign up through Twitter. This is accomplished using the logIn() method:

```java
LASTwitterUtils.logInInBackground(this, new LogInCallback<LASUser>() {
  @Override
  public void done(LASUser user, LASException err) {
    if (user == null) {
      Log.d("MyApp", "Uh oh. The user cancelled the Twitter login.");
    } else if (user.isNew()) {
      Log.d("MyApp", "User signed up and logged in through Twitter!");
    } else {
      Log.d("MyApp", "User logged in through Twitter!");
    }
  }
});
```

When this code is run, the following happens:

The user is shown the Twitter login dialog.
The user authenticates via Twitter, and your app receives a callback.
Our SDK receives the Twitter data and saves it to a LASUser. If it's a new user based on the Twitter handle, then that user is created.
Your LogInCallback is called with the user.
In order to display the Twitter login dialogs and activities, the current Context must be provided (often, the current context is this when calling logIn() from within the Activity) as we have done above.

### Linking

If you want to associate an existing LASUser with a Twitter account, you can link it like so:

```java
if (!LASTwitterUtils.isLinked(user)) {
    LASTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(LASException ex) {
          if (LASTwitterUtils.isLinked(user)) {
            Log.d("MyApp", "Woohoo, user logged in with Twitter!");
      }
    }
  });
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing LASUser is updated with the Twitter information. Future logins via Twitter will now log the user into their existing account.

If you want to unlink Twitter from a user, simply do this:

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

### Twitter API Calls

## Cloud Functions

### GeoPoints

LAS allows you to associate real-world latitude and longitude coordinates with an object. Adding a LASGeoPoint to a LASObject allows queries to take into account the proximity of an object to a reference point. This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.

### LASGeoPoint

To associate a point with an object you first need to create a LASGeoPoint. For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

```java
LASGeoPoint point = new LASGeoPoint(40.0, -30.0);
```

This point is then stored in the object as a regular field.

```java
placeObject.put("location", point);
```

### Geo Queries

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point. This can be done by adding another restriction to LASQuery using whereNear. Getting a list of ten places that are closest to a user may look something like:

```java
LASGeoPoint userLocation = (LASGeoPoint) userObject.get("location");
LASQuery<LASObject> query = LASQuery.getQuery("PlaceObject");
query.whereNear("location", userLocation);
query.setLimit(10);
LASQueryManager.findAllInBackground(query, new FindCallback<LASObject>() { ... });
```

At this point nearPlaces will be an array of objects ordered by distance (nearest to farthest) from userLocation. Note that if an additional orderByAscending()/orderByDescending() constraint is applied, it will take precedence over the distance ordering.

To limit the results using distance, check out whereWithinKilometers, whereWithinMiles, and whereWithinRadians.

It's also possible to query for the set of objects that are contained within a particular area. To find the objects in a rectangular bounding box, add the whereWithinGeoBox restriction to your LASQuery.

```java
LASGeoPoint southwestOfSF = new LASGeoPoint(37.708813, -122.526398);
LASGeoPoint northeastOfSF = new LASGeoPoint(37.822802, -122.373962);
LASQuery<LASObject> query = LASQuery.getQuery("PizzaPlaceObject");
query.whereWithinGeoBox("location", southwestOfSF, northeastOfSF);
LASQueryManager.findAllInBackground(new FindCallback<LASObject>() { ... });
```

### Caveats

At the moment there are a couple of things to watch out for:

Each LASObject class may only have one key with a LASGeoPoint object.
Points should not equal or exceed the extreme ends of the ranges. Latitude should not be -90.0 or 90.0. Longitude should not be -180.0 or 180.0. Attempting to set latitude or longitude out of bounds will cause an error.

## User Interface

## Handling Errors

## Security

We strongly recommend that you build your applications to restrict access to data as much as possible. With this in mind, we recommend that you enable automatic anonymous user creation and specify a default ACL based upon the current user when your application is initialized. Explicitly set public writability (and potentially public readability) on an object-by-object basis in order to protect your data from unauthorized access.

Consider adding the following code to your application startup:

```java
LASUser.enableAutomaticUser();
LASACL defaultACL = new LASACL();
// Optionally enable public read access while disabling public write access.
// defaultACL.setPublicReadAccess(true);
LASACL.setDefaultACL(defaultACL, true);
```

Please keep secure access to your data in mind as you build your applications for the protection of both you and your users.

### Settings

In addition to coding securely, please review the settings pages for your applications to select options that will restrict access to your applications as much as is appropriate for your needs. For example, if users should be unable to log in without a Facebook account linked to their application, disable all other login mechanisms. Specify your Facebook application IDs, Twitter consumer keys, and other such information to enable server-side validation of your users' login attempts.
