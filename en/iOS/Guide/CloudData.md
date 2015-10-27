#  Cloud Data
## Introduction

### What is  Cloud Data
 Cloud Data is the data storage service provided by MaxLeap. It is based on the `MLObject` and each `MLObject` contains several key-values. All `MLObject` are stored in MaxLeap, you can perform operations towards them with iOS/Android Core SDK. Besides, MaxLeap  provides some special objects, like `MLUser`, `MLRole`, `MLFile` and `MLGeoPoint`. They are all based on `MLObject`.


### Why is  Cloud Data Nccessary
 Cloud Data can help you build and maintain the facility of your database, thus focus on the app service logic that brings real value.  The advantages can be summarized as follows:

* Sort out the deployment and maintenance of hardware resourses.
* Provide standard and complete data access API
* Unlike the traditional relational database, there's no class to be created ahead of time before storing data in cloud. Data objects in JSON format can be stored and retrieved easily as you wish.
* Realize the Hook of cloud data with the Cloud Code service.（Please check [Cloud Code Guide](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA) for more details.）


## Cloud Object
The object that stored in  Cloud Data is called `MLObject` and every `MLObject` is planned in different `class`(like table in database). `MLObject` contains several key-value pairs and the value is data compatible with JSON format. In consideration of data security, editing structure of the data warehouse by client is prohibited in MaxLeap. You need to create tables ahead of time in MaxLeap Dev Center and define the field as well as the value type in each table.

###Create New
Suppose that we need to save a piece of data to `Comment` class, it contains following properties: 

Property Name|Value|Value Type
-------|-------|---|
content|"kind of funny"|Character
pubUserId|1314520|Digit
isRead|false|Boolean

We recommend the neat CamelCase for naming class and key (e.g. NameYourclassesLikeThis, nameYourKeysLikeThis).

The interface of `MLObject` is similar to `NSMutableDictionary`, but added `saveInBackground` method. You can use following code to save `Comment`:

```objective_c
MLObject *myComment = [MLObject objectWithClassName:@"Comment"];
myComment[@"content"] = @"kind of funny";
myComment[@"pubUserId"] = @1314520;
myComment[@"isRead"] = @NO;
[myComment saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        // myComment save succeed
    } else {
        // there was an error
    }
}];
```
You may wonder if the operation is completed after running the code. You can check the metadata browser in the app in MaxLeap Dev Center and find similar info as shown below:

```
objectId: "xWMyZ4YEGZ", content: "kind of funny", pubUserId: 1314520, isRead: false,
createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

Notices:

* **When Was "Comment" Class Created:** For data security, creating sheet by client is prohibited in MaxLeap. You need to create a Comment sheet in Dev Center before saving the data.
* **Property Value Type in the Table is Consistent:** The data type of relative property value should be consistent with the one you create the property, otherwise you will fail to save data. 
* **Can't Edit Backend Data Struture by Client:** For instance, you may fail to save if there is no `isRead` field in Comment table.
* **Property Created Automatically:** Every MLObeject has following properties for saving metadata that don't need specifying. Their creation and update are accomplished by MaxLeap backend system automatically, please don't save data with those properties in the code.

Property Name|Value|
-------|-------|
`objectId`|Unique Identifier of the Object
`createdAt`|Date Created of the Object 
`updatedAt`|Date Last Modified of the Object 

* **Size Limit:** The size limit for ML Object is 128K.
* The name of the key can include alphabetic character, number and underline while must be started with a letter. The type of the key can be letters, numbers, Boolean, arrays, MLObject and any other types that support JSON. 

### Query

##### Get `MLObject`

You can get the complete `MLObject` with the ObjectId of any piece of data:

```objective_c
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query getObjectInBackgroundWithId:@"objectId" block:^(MLObject *object, NSError *error) {
    // Do something with the returned MLObject in the myComment variable.
    NSLog(@"%@", myComment);
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

##### Get  `MLObject` Paramater Value

You can use `objectForKey:` method or `[]` operator to get value from `MLObject` instance searched.

```objective_c
int pubUserId = [[myComment objectForKey:@"pubUserId"] intValue];
NSString *content = myComment[@"content"];
BOOL pubUserId = [myComment[@"cheatMode"] boolValue];
```

Following three values are provided with Property:

```objective_c
NSString *objectId = myComment.objectId;
NSDate *updatedAt = myComment.updatedAt;
NSDate *createdAt = myComment.createdAt;
```

You can invoke `-fetchInBackgroundWithBlock:` method to refresh existing objects:

```
[myObject fetchInBackgroundWithBlock:^(MLObject *object, NSError *error) {
    // object is myObject filled with server data}];
```

###Update
Two steps are required to update `MLObject`: the first is to get the target `MLObject` and the second is to edit and save.

```objective_c
// Get MLObject with objectId
MLObject *object = [MLObject objectWithClassName:@"Comment"];
[object fetchInBackgroundWithBlock:^(MLObject *myComment, NSError *error) {
    // Now let's update it with some new data. In this case only isRead will get sent to the cloud
    myComment[@"isRead"] = @YES;
    [myComment saveInBackgroundWithBlock:nil];
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

Client will spot the modified data for you. Only the "dirty" field will be sent to server. No extra data included.

###Delete 
#####Delete `MLObject`

```objective_c
[myComment deleteInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
 	     // there was an error
	}
}];
```
##### Batch Delete `MLObject`

```
[MLObject deleteAllInBackground:objectsToDelete block:^(BOOL succeeded, NSError *error) {
	 if (succeeded) {
    	//
    } else {
   	   // there was an error
    }
}];
```

##### Delete a Property of `MLObject` Instance

Except from deleting a whole object instance, you can delete any target value in the instance. Note that the edition can only be synchronized to cloud with invocation of `-saveInBackgroundWithBlock:`.

```objective_c
// After this, the content field will be empty
[myComment removeObjectForKey:@"content"];
// Saves the field deletion to the MaxLeap
[myComment saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

### Counter

Counter is one of the most regular functional requirements. When the property of a certain parameter value type is updated frequently and each update is about to add up a parameter value, then we can make use of Counter to complete the operation with more efficiency. This will also avoid the conflict and override caused by frequent data edition requirements.

For example, the "score" in a game is modified frequently. If there are multiple clients request the modifications at the same time and we need to request the data from clients and save the modifications to the cloud, there may easily be some conflicts and override.

#####Increment Counter
At this point, we may use `-incrementKey:` method (default increment will be 1) and update counter type properties more efficiently and securely. For example, we can invoke following method to update the `readCount` of a post: 


```objective_c
[myPost incrementKey:@"readCount"];
[myPost saveInBackgroundWithBlock:nil];
```

#####Specified Increment 
You can use `-incrementKey:byAmount:` to realize increment of any amount. Note that increment doesn't need to be integer, value of a floating-point type is also acceptable. 

#####Decrement Counter 

You only need to input a negative number to `-incrementKey:byAmount:` to realize decremental increment:

```objective_c
[myPost incrementKey:@"readCount" byAmount:@(-1)];
[myPost saveInBackgroundWithBlock:nil];
```

###Array

You can save the value of arry type to any parameter of `MLObject` (like the `tags` parameter in this instance):


#####Add To the End of the Array
You can add one or more value to the end of the `tags` parameter value with `addObject:forKey:` and `addObjectsFromArray:forKey:`.


```objective_c
[myPost addUniqueObjectsFromArray:@[@"flying", @"kungfu"] forKey:@"tags"];
[myPost saveInBackgroundWithBlock:nil]
```

Meanwhile, you can only add values that is different from all current items with `-addUniqueObject:forKey:` and `addUniqueObjectsFromArray:forKey:`. The insertion position is uncertain.


#####Override with new Array

The value of array under `tags` parameter will be overridden by invoking `setObject:forKey:`  function: 

```
[myPost setObject:@[] forKey:@"tags"]
```

#####Delete the Value of Any Array Property

`-removeObject:forKey:` and `-removeObjectsInArray:forKey:` will delete all instances of the given objects from array property.

Please pay attention to the distinction between `removeObject:forKey` and `removeObjectForKey:`. 

**Notice: Remove and Add/Put must be seperated for invoking save function. Or, the data may fail to be saved.**

###Associated Data
An object can be associated to other objects. As mentioned before, we can save the instance A of a `MLObject` as the parameter value of instance B of another `MLOject`. This will easily solve the data relational mapping of one-to-one and one-to-many, like the relation between primary key & foreign key.

Notices: MaxLeap handles this kind of data reference with `Pointer` type. For data consistency, it won't save another copy of data A in data B sheet.

#### Realize with `Pointer`

For example, a tweet may correspond to many comments. You can create a tweet and a corresponding comment with followign code: 

```objective_c
// Create the post
MLObject *myPost = [MLObject objectWithClassName:@"Post"];
myPost[@"title"] = @"I'm Hungry";
myPost[@"content"] = @"Where should we go for lunch?";
// Create the comment
MLObject *myComment = [MLObject objectWithClassName:@"Comment"];
myComment[@"content"] = @"Let's do Sushirrito.";
// Add a relation between the Post and Comment
myComment[@"parent"] = myPost;
// This will save both myPost and myComment
[myComment saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

You can get all comments of this Twitter with `query`:

```
MLObject *myPost = ...
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query whereKey:@"parent" equalTo:myPost];
[query findObjectsInBackgroundWithBlock:^(NSArray *allComments, NSError *error) {
    // do something with all the comments of myPost
}];
```

You can correlate existing objects with `objectId`:

```objective_c
// Add a relation between the Post with objectId "1zEcyElZ80" and the comment
myComment[@"parent"] = [MLObject objectWithoutDataWithclassName:@"Post" objectId:@"1zEcyElZ80"];
```

The relative `MLObject` won't be got by defalut when you get a object. Aside from the `objectId`, other parameter values are all blank. You need to invoke `fetch` method if you want to get all parameter data of relative object (Suppose that `Comment` instance is already got with `MLQuery` in following case):


```objective_c
MLObject *post = fetchedComment[@"parent"];
[post fetchInBackgroundWithBlock:^(MLObject *post, NSError *error) {
    NSString *title = post[@"title"];
    // do something with your title variable
}];
```

####Realize Association with MLRelation

You can create many-to-many modeling with MLRelation. This is similar to chained list while MLRelation doesn't need to get all relative MLRelation instances when getting additional attributes. As a result, MLRelation can support more instances than chained list and the read is more flexible. For example, a user can like many posts. In this case, you can save all posts liked by this user with `getRelation()`. For creating a new liked post:

```objective_c
MLUser *user = [MLUser currentUser];
MLRelation *relation = [user relationForKey:@"likes"];
[relation addObject:post];
[post saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

You can remove a Post from `MLRelation`:

```objective_c
[relation removeObject:post];
```

The object collections in the relation won't be downloaded by default. You can get `Post` list by passing `MLQuery` objects acquired with `[relation query]` to `-[query findObjectsInBackgroundWithBlock:]`, as shown below:


```objective_c
MLQuery *query = [relation query];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    if (error) {
        // There was an error
    } else {
        // objects has all the Posts the current user liked.
    }
}];
```

If what you need is just a subset of `Post`, you can add more constrains to the `MLQuery` returned by `-[MLRelation query]`:


```objective_c
MLQuery *query = [relation query];
[query whereKey:@"title" hasSuffix:@"We"];
// Add other query constraints.
```

Please check Query Guide for more information about `MLQuery`. The operation of `MLRelation` object is similar to the `NSArray` of `MLObject`, so any queries towards the chained list, except `includeKey:`, can also be implemented to `MLRelation`.

###Data Type

We support object type like `NSString`、`NSNumber` and `MLObject`. MaxLeap supports `NSDate`、`NSData` and `NSNull`.

You can embed `NSDictionary` and `NSArray` object to store data with complex structure in unitary `MLObject`.

e.g.：

```objective_c
NSNumber *number = @42;
NSString *string = [NSString stringWithFormat:@"the number is %@", number];
NSDate *date = [NSDate date];
NSData *data = [@"foo" dataUsingEncoding:NSUTF8StringEncoding];
NSArray *array = @[string, number];
NSDictionary *dictionary = @{@"number": number,
                             @"string": string};

NSNull *null = [NSNull null];

MLObject *bigObject = [MLObject objectWithclassName:@"BigObject"];
bigObject[@"myNumber"] = number;
bigObject[@"myString"] = string;
bigObject[@"myDate"] = date;
bigObject[@"myData"] = data;
bigObject[@"myArray"] = array;
bigObject[@"myDictionary"] = dictionary;
bigObject[@"myNull"] = null;
[bigObject saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (error) {
        // There was an error
    } else {
        // objects has all the Posts the current user liked.
    }
}];
```

`NSData` field is not recommended in `MLObject` for storing large binary data, such as image or text values. The size of `MLObject` should be no more than 128kb. We suggest `MLFile` or `MLPrivateFile` for storing more data. Please check [Doc](#Doc) for more details.

## Files
###Creation and Upload of MLFile

MLFile can help your app save the files to server, like the common image, video, audio and any other binary data (cannot exceed 100MB). It helps you deal with the situation that there's too many files or the file is too large to be stored in regular `MLObject`.

`MLFile` is easy to use. You need `NSData` type data, and then create a `MLFile` instance. We only used a string in following instance:

```objective_c
NSData *data = [@"Working at MaxLeap is great!" dataUsingEncoding:NSUTF8StringEncoding];
MLFile *file = [MLFile fileWithName:@"resume.txt" data:data];
```

**Notices**, we named the file `resume.txt` in this example. Here are two notices:

- You don't need to worry about filename conflict. There is a unique identifier for each upload. Uploading files with the same `resume.txt` name is not a problem.
- It's important to provide a file name with extension for MaxLeap to identify file type and make relative managements. So, if you want to store a PNG image, please end the file name with .png.

Then, you can save the file to cloud using `-save`, the same way with `MLObject`: 

```objective_c
[file saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

At last, you can relate `MLFile` with `MLObject` after saving.

```objective_c
MLObject *jobApplication = [MLObject objectWithclassName:@"JobApplication"]
jobApplication[@"applicantName"] = @"Joe Smith";
jobApplication[@"applicantResumeFile"] = file;
[jobApplication saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can invoke `-getDataInBackgroundWithBlock:` to reacquire this data. In following instance, we get recovery file from another `JobApplication` object:

```objective_c
MLFile *applicantResume = anotherApplication[@"applicantResumeFile"];
[applicationResume getDataInBackgroundWithBlock:^(NSData *data, NSError *err) {
    if (!error) {
        NSData *resumeData = data;
    }
}];
```

##### Image

You can easily save images by converting them to `NSData` and using `MLFile`. Suppose that you have an `UIImage` named `image` and want to save it as `MLFile`:

```objective_c
UIImage *image = ...;
NSData *imageData = UIImagePNGRepresentation(image);
MLFile *imageFile = [MLFile fileWithName:@"image.png" data:imageData];

MLObject *userPhoto = [MLObject objectWithClassName:@"UserPhoto"];
userPhoto[@"imageName"] = @"My trip to Hawaii!";
userPhoto[@"imageFile"] = imageFile;
[userPhoto saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // ...
}];
```

Your `MLFile` will be uploaded to `userPhoto` object as part of the saving operation. *the upload and doanload progress* of `MLFile` are all trackable.

You can invoke `-getDataInBackgroundWithBlock:` to reacquire this data. In following instance, we get recovery file from another `UserPhoto` named `anotherPhoto`:

```objective_c
MLFile *userImageFile = anotherPhoto[@"imageFile"];
[userImageFile getDataInBackgroundWithBlock:^(NSData *imageData, NSError *error) {
    if (!error) {
        UIImage *image = [UIImage imageWithData:imageData];
    }
}];
```

### Progress

`saveInBackgroundWithBlock:progressBlock:` and `getDataInBackgroundWithBlock:progressBlock::` can help you understand the upload and download progress of `MLFile` respectively. e.g.

```
NSData *data = [@"MaxLeap is great!" dataUsingEncoding:NSUTF8StringEncoding];
MLFile *file = [MLFile fileWithName:@"resume.txt" data:data];
[file saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
  // success or fail...
} progressBlock:^(int percentDone) {
  // refresh progress data, percentDone in 0 to 100
}];
```

You can use [REST API](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS) to delete files cited by object and the master key is required for deleting.

You files can't be deleted with [REST API](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS) if they are not cited by any objects in your app. You can make a cleanup request towards the unused files in Settings page of your app. This operation may have effect on the functions relied on the unused files, but not the relative files.

## Query

We already know how to retrieve a single `MLObject` from MaxLeap with `getObjectInBackgroundWithId:block:]`. There are also some query methods for retrieving multiple objects, setting query filters with `MLQuery`.

###Basic Query

`MLQuery` towards `MLObject` can be summarized as 3 steps:

1. Create a `MLQuery` and assign corresponding MLObject class;
2. Add different conditions for `MLQuery`;
3. Execute `MLQuery`: Inquire matching MLQuery data by invoking `findObjectsInBackgroundWithBlock:`.

For example, to inquire target personnel data, you can use `whereKey:equalTo:` to add conditional values:

```objective_c
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query whereKey:@"publisher" equalTo:@"MaxLeap"];
[query findObjectsInBackgroundWithBlock:^(NSArray *posts, NSError *error) {
    if (!error) {
        // The find succeeded.
        NSLog(@"Successfully retrieved %d posts.", psots.count);
        // Do something with the found objects
        for (MLObject *object in posts) {
            NSLog(@"%@", object.objectId);
        }
    } else {
        // Log details of the failure
        NSLog(@"Error: %@ %@", error, [error userInfo]);
    }
}];
```

`findObjectsInBackgroundWithBlock:` can ensure not to block current thread but accomplish network request and execute `block` in main thread.

###Query Term

For full use of `MLQuery`, we suggest following methods for adding query terms. Providing `NSPredicate` while creating `MLQuery` is also available for setting query terms if you prefer `NSPredicate`.

```objective_c
NSPredicate *predicate = [NSPredicate predicateWithFormat:
@"publisher = 'MaxLeap'"];
MLQuery *query = [MLQuery queryWithclassName:@"Post" predicate:predicate];
```

Features supported:

- Simple comparisons such as `=`, `!=`, `<`, `>`, `<=`, `>=`, and `BETWEEN` with a key and a constant.
- Regular expression: `LIKE`、`MATCHES`、`CONTAINS` or `ENDSWITH`
- Containment predicates, such as `x IN {1, 2, 3}`.
- Key-existence predicates, such as `x IN SELF`.
- `BEGINSWITH` expression
- Compound predicate with `AND`、`OR` and `NOT`
- Subquery with `"key IN %@", subquery`

Features not supported:

- Aggregate operations, such as `ANY`, `SOME`, `ALL`, or `NONE`.
- Predicates comparing one key to another.
- Complex predicates with many `OR`ed clauses.

##### Query Constraints

There are several methods to set query terms towards objects acquired by `MLQuery`. You can filter out objects with a particular key-value pair with `whereKey:notEqualTo`:

```objective_c
[query whereKey:@"publisher" notEqualTo:@"xiaoming"];
```

You can add multiple constraints in the query to filter data, similar to the AND relation.

```objective_c
[query whereKey:@"publisher" notEqualTo:@"xiaoming"];
[query whereKey:@"createdAt" greaterThan:[NSDate dateWithTimeIntervalSinceNow:-3600]];
```

You can set the number of your query results by setting limit. The limit is 100 by default, but 1 to 1,000 all works.

```objective_c
query.limit = 10; // limit to at most 10 results
```

`skip` is used to skip first few items in the result, it can also be used for paging with `limit`:

```
query.skip = 10; // skip first 10 results
```

If you want a more precise result, you can use `getFirstObjectInBackgroundWithBlock:` rather than `findObjectsInBackgroundWithBlock:`.

```objective_c
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query whereKey:@"playerEmail" equalTo:@"xiaoming@example.com"];
[query getFirstObjectInBackgroundWithBlock:^(MLObject *object, NSError *error) {
    if (!object) {
        NSLog(@"The getFirstObject request failed.");
    } else {
        // The find succeeded.
        NSLog(@"Successfully retrieved the object.");
    }
}];
```

#####Sort the Results
In regard to the number or string type, you can sort the query results in order:


```objective_c
// Sorts the results in ascending order by the createdAt field
[query orderByAscending:@"createdAt"];
// Sorts the results in descending order by the createdAt field
[query orderByDescending:@"createdAt"];
```

Multiple sort keys can be used for query:

```objective_c
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
[query orderByAscending:@"score"];
// Sorts the results in descending order by the score field if the previous sort keys are equal.
[query orderByDescending:@"username"];
```

#####Set Numeric Value Limit

You can use comparison in query towards sortable data:

```objective_c
// Restricts to wins < 50
[query whereKey:@"wins" lessThan:@50];
// Restricts to wins <= 50
[query whereKey:@"wins" lessThanOrEqualTo:@50];
// Restricts to wins > 50
[query whereKey:@"wins" greaterThan:@50];
// Restricts to wins >= 50
[query whereKey:@"wins" greaterThanOrEqualTo:@50];
```

#####Set Properties of Data Returned

You can set the properties of data returned by invoking `selectKeys:` and inputting a field array. For retrieving objects only contain `score` and `playerName`( and sepcial built-i field: `objectId`、`createdAt`, `updatedAt` and etc.):


```objective_c
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query selectKeys:@[@"contents", @"publisher"]];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // objects in results will only contain the contents and publisher fields
}];
```

You can extract extra fields by invoking `fetchIfNeededInBackgroundWithBlock:` towards objects returned:

```objective_c
MLObject *object = (MLObject*)results[0];
[object fetchIfNeededInBackgroundWithBlock::^(MLObject *object, NSError *error) {
    // all fields of the object will now be available here.
}];
```

#####Set More Constraints

If you want to inquire the objects matching different values, please use `whereKey:containedIn:` method and provide a set of acceptable values. It is useful if multiple queries is replaced by single query. e.g. For retrieving Tweets of several users:

```objective_c
// Finds posts from any of Jonathan, Dario, or Shawn
NSArray *names = @[@"Jonathan Walsh", @"Dario Wunsch", @"Shawn Simon"];
[query whereKey:@"publisher" containedIn:names];
```

If you want to inquire the objects not matching the values, please use `whereKey:notContainedIn:` method and provide a set of acceptable values. e.g. For retrieving Tweets of users not in the list:

```objective_c
// Finds posts from anyone who is neither Jonathan, Dario, nor Shawn
NSArray *names = @[@"Jonathan Walsh", @"Dario Wunsch", @"Shawn Simon"];
[query whereKey:@"playerName" notContainedIn:names];
```

You can use `whereKeyExists:` to inquire data carrying certain properties and `whereKeyDoesNotExist:` to inquire data not carrying certian properties.


You can use the `whereKey:matchesKey:inQuery:` method to get objects where a key matches the value of a key in a set of objects resulting from another query. e.g. For retrieving all Tweets of ones followers:

```objective_c
MLQuery *commentQuery = [MLQuery queryWithClassName:@"Comment"];
[commentQuery whereKey:@"parent" equalTo:post];
MLQuery *postsQuery = [MLQuery queryWithClassName:@"Post"];
[postsQuery whereKey:@"author" matchesKey:@"author" inQuery:postsQuery];
[postsQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // ...
}];
```

Similarly, you can find users not matching the terms with `whereKey:doesNotMatchKey:inQuery:`.


###Query Towards Different Property Value Types

####Query towards array value type

If the key value is an array, then you can inquire all objects containing "2" from the Key array with:

```objective_c
// Find objects where the array in arrayKey contains 2.
[query whereKey:@"arrayKey" equalTo:@2];
```

Similarly, you can inquire all objects containing 2, 3 and 4 from the Key array with:

```objective_c
// Find objects where the array in arrayKey contains each of the
// elements 2, 3, and 4.
[query whereKey:@"arrayKey" containsAllObjectsInArray:@[@2, @3, @4]];
```

####Query towards String Value Type

Use `whereKey:hasPrefix:` method to add constrain that the string begins with another string. Much similar to `LIKE` query in MySQL. Query like this will be executed via indexing, so it will be highly efficient when it comes to big data.


```objective_c
// Finds barbecue sauces that start with "Big Daddy's".
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query whereKey:@"title" hasPrefix:@"Big Daddy's"];
```

####Query towards `MLObject` Value Type

##### `MLObject`-type property matches another `MLObject`

There are several methods for relational data query. If you want to get the data whose certain property matches specific `MLObject`, you can inquire with `whereKey:equalTo:` like others. For example, if every `Comment` object includes a `Post` object in `parent` property, then you can get Comment list of specific `Post`: 


```objective_c
// Assume MLObject *myPost was previously created.
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" equalTo:myPost];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for myPost
}];
```

You can use `objectId` for relational query:

```objective_c
MLObject *object = [MLObject objectWithoutDataWithClassName:@"Post" objectId:@"1zEcyElZ80"];
[query whereKey:@"parent" equalTo:object];
```

##### `MLObject`-type property matches `Query`

If any property of the query object contains a `MLObject` that matches a different query, then you can use `whereKey:matchesQuery:`. **Note that** the default limit 100-1,000 works on inner query as well. Thus, you need to construct your query object well if there's massive data query. For example, inquire the comment list of post with images: 


```objective_c
MLQuery *innerQuery = [MLQuery queryWithClassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" matchesQuery:innerQuery];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts with images
}];
```


Conversely, you can use `whereKey:doesNotMatchQuery:` if you want to find `MLObject` mismatch some subquery. For example, inquire the comment list of post without images: 


```objective_c
MLQuery *innerQuery = [MLQuery queryWithClassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" doesNotMatchQuery:innerQuery];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts without images
}];
```

##### Return Property of Specified `MLObject` Type 
You can use `includeKey:` to get the associated MLObject of multiple types. For example, if you want to get most recent 10 comments and the associated posts:

```objective_c
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
// Retrieve the most recent ones
[query orderByDescending:@"createdAt"];
// Only retrieve the MLt ten
query.limit = 10;
// Include the post data with each comment
[query includeKey:@"post"];
[query findObjectsInBackgroundWithBlock:^(NSArray *comments, NSError *error) {
    // Comments now contains the MLt ten comments, and the "post" field
    // has been populated. For example:
    for (MLObject *comment in comments) {
        // This does not require a network access.
        MLObject *post = comment[@"post"];
        NSLog(@"retrieved related post: %@", post);
    }
}];
```

You can use point marker for multilayer retrieval. For containing comments and author of the post:

```objective_c
[query includeKey:@"post.author"];
```

You can invoke `includeKey:` repeatedly for multi-field query. This also works on `MLQuery` worker method, like `getFirstObjectInBackgroundWithBlock:` and `getObjectInBackgroundWithId:block:`.

###Count Query

Count query can return a rough outcome for classes with over 1,000 data. If you don't want to get all matching objects, but just the count, then you can replace the `findObjects` with `countObjects`. e.g. inquire how many games did an gamer played:

```objective_c
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query whereKey:@"publisher" equalTo:@"Sean"];
[query countObjectsInBackgroundWithBlock:^(int count, NSError *error) {
    if (!error) {
        // The count request succeeded. Log the count
        NSLog(@"Sean has played %d games", count);
    } else {
        // The request failed
    }
}];
```

As for classed with ober 1,000 data, the result may be imprecise because of the timeout. You'd better avoid this in your app.

###Compound Query

You can inquire data that matches multiple Query with  `orQueryWithSubqueries:`. For example, you can get the gamers who won several times with following method: 

```objective_c
MLQuery *fewReader = [MLQuery queryWithClassName:@"Post"];
[fewReader whereKey:@"readCount" lessThan:@10];
MLQuery *lotsOfReader = [MLQuery queryWithClassName:@"Post"];
[lotsOfReader whereKey:@"readCount" greaterThan:@100];
MLQuery *query = [MLQuery orQueryWithSubqueries:@[fewReader, lotsOfReader]];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // results contains players with lots of wins or only a few wins.
}];
```

You can add additional constraints for the newly-added `MLQuery`. It's similar to "and" operator.

Note that we do not, however, support non-filtering constraints (e.g. `limit`, `skip`, `orderBy...:`, `includeKey:`) in the subqueries of the compound query.

###Cache Query

##  `MLObject` Subclass

MaxLeap is easy to start up. You can use `MLObject` to access all data and use `objectForKey:` or `[]` operator to access any field. In lots of mature code, subclass can bring more advantages, like simplicity, expansibility, auto-complete feature supported by IDE, etc. Subclass is not necessary, you can transfer following code:

```objective_c
MLObject *game = [MLObject objectWithclassName:@"Game"];
game[@"displayName"] = @"Bird";
game[@"multiplayer"] = @YES;
game[@"price"] = @0.99;
```

to:

```objective_c
Game *game = [Game object];
game.displayName = @"Bird";
game.multiplayer = @YES;
game.price = @0.99;
```

###Create `MLObject` Subclass

Steps for creating a `MLObject` subclass:

1. Declare subclass that is consistent with the `MLSubclassing` protocol.
2. Add `MLclassName` annotation. This is the string you pass to `-initWithclassName:` method. Thus, this string class name doesn't need to appear in code again.
3. Import `MLObject+Subclass.h` to your .m file. This operation imported realization of all methods in `MLSubclassing` protocol. The default realization of `MLclassName` is to return class name (class in Objective C).
4. Invoke `+[Yourclass registerSubclass]` before `+[MaxLeap setApplicationId:clientKey:]`. The simple way is to do this in [+load][+load api reference] (Obj-C only) or [+initialize][+initialize api reference] (both Obj-C and Swift) of the class.

The following code can sucessfully declare, realize and register the subclass `Game` of `MLObject`:

```objective_c
// Game.h
@interface Game : MLObject <MLSubclassing>
+ (NSString *)leapClassName;
@end

// Game.m
// Import this header to let Armor know that MLObject privately provides most
// of the methods for MLSubclassing.
#import <MaxLeap/MLObject+Subclass.h>
@implementation Game
+ (void)load {
    [self registerSubclass];
}
+ (NSString *)leapClassName {
    return @"Game";
}
@end
```

####Property Access/Modification

Adding method to `MLObject` helps encapsulated class logic. With `MLSubclassing`, you can put the logic that is related to subclass into one place rather than seperate them into multiple classes to process business logic and storage/transformation logic.

`MLObject` supports dynamic synthesizers just like `NSManagedObject`. Declare a property as you normally would, but use `@dynamic` rather than `@synthesize` in your .m file. The following example creates a `displayName` property in the `Game` class:

```objective_c
// Game.h
@interface Game : MLObject <MLSubclassing>
+ (NSString *)leapClassName;
@property (retain) NSString *displayName;
@end

// Game.m
@dynamic displayName;
```

You can access the `displayName` property using `game.displayName` or `[game displayName]` and assign to it using `game.displayName = @"Bird"` or `[game setDisplayName:@"Bird"]`. Dynamic properties allow Xcode to provide autocomplete and catch typos.


`NSNumber` properties can be implemented either as `NSNumber`s or as their relative basic type. Consider the following example:

```objective_c
@property BOOL multiplayer;
@property float price;
```


In this case, `game[@"multiplayer"]` will return an `NSNumber` which is accessed using `boolValue` and `game[@"price"]` will return an `NSNumber` which is accessed using `floatValue`, but the `fireProof` property is an actual `BOOL` and the `rupees` property is an actual `float`. The dynamic `getter` will automatically extract the `BOOL` or `int` value and the dynamic `setter` will automatically wrap the value in an `NSNumber`. You are free to use either format. Primitive property types are easier to use but `NSNumber` property types support `nil` values more clearly.

###Define Functions

If you need more complicated logic but not just a simple accessor, you can define your own methods like shown as follows:

```objective_c

@dynamic iconFile;

- (UIImageView *)iconView {
    MLImageView *view = [[MLImageView alloc] initWithImage:kPlaceholderImage];
    view.file = self.iconFile;
    [view loadInBackground];
    return view;
}
```

###Create Subclass Instance

You should create new object with class method `object`. This will build an instance defined by yourself and result in right processing on subclassing. You can create reference of existing object using `objectWithoutDataWithObjectId:`.

### Subclass Query

You can get query object of specific subclass with class method `query`. The following instance can inquire all equipments user can buy:

```objective_c
MLQuery *query = [Game query];
[query whereKey:@"rupees" lessThanOrEqualTo:@0.99];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    if (!error) {
        Game *firstArmor = objects[0];
        // ...
    }
}];
```

##MLUser

At the core of many apps, there is a notion of user accounts that lets users access their information in a secure manner. We provide a specialized user class called `MLUser` that automatically handles much of the functionality required for user account management.

With this class, you'll be able to add user account functionality in your app.

`MLUser` is a subclass of `MLObject`. It inherited all methods of `MLObject` and has the same features as `MLObject`, like flexible schema and key-value pair interface. The different is `MLUser` adds some specific features of user account.


###Property Description

Apart from the properties inherited from `MLObject`, `MLUser` has some specific properties:

- `username`: The username for the user (required).
- `password`: The password for the user (required on signup).
- `email`: The email address for the user (optional).

We'll go through each of these in detail as we run through the various use cases for users. Keep in mind that if you set `username` and `email` through these properties, you do not need to set it using the `setObject:forKey:` method &mdash; this is set for you automatically.


###User Signup

The first thing your app will do is probably ask the user to sign up. The following code illustrates a typical sign up:

```objective_c
- (void)myMethod {
    MLUser *user = [MLUser user];
    user.username = @"my name";
    user.password = @"my pass";
    user.email = @"email@example.com";
    // other fields can be set just like with MLObject
    user[@"phone"] = @"415-392-0202";
    [user signUpInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
        if (!error) {
            // Hooray! Let them use the app now.
        } else {
            NSString *errorString = [error userInfo][@"error"];
            // Show the errorString somewhere and let the user try again.
        }
    }];
}
```

This call will asynchronously create a new user in your MaxLeap App. Before it does this, it also checks to make sure that both the username and email are unique. Also, it securely hashes the password in the cloud using bcrypt. We never store passwords in plaintext, nor will we ever transmit passwords back to the client in plaintext.

**Notice**: Signup uses `-[user signUpInBackgroundWithBlock:]` method rather than `-[user saveInBackgroundWithBlock:]` method. New `MLUser`s should always be created using the `-[user signUpInBackgroundWithBlock:]` method. Subsequent updates to a user can be done by calling `-[user saveInBackgroundWithBlock:]`.

If a signup isn't successful, you should read the error object that is returned. The most likely case is that the username or email has already been taken by another user. You should clearly communicate this to your users, and ask them try a different username.

You are free to use an email address as the username. Simply ask your users to enter their email, but fill it in the username property &mdash; `MLUser` will work as normal. We'll go over how this is handled in the *reset password* section.


###Signin

Of course, after you allow users to sign up, you need to let them log in to their account in the future. To do this, you can use the class method `+[MLUser logInWithUsernameInBackground:password:block:]`。

```objective_c
[MLUser logInWithUsernameInBackground:@"myname" password:@"mypass" block:^(MLUser *user, NSError *error) {
    if (user) {
        // Do stuff after successful login.
    } else {
        // The login failed. Check error to see why.
    }
}];
```

###Current User 

It would be bothersome if the user had to log in every time they open your app.  You can avoid this by using the cached `currentUser` object.

Whenever you use any signup or login methods, the user is cached on disk. You can treat this cache as a session, and automatically assume the user is logged in:

```objective_c
MLUser *currentUser = [MLUser currentUser];
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login screen
}
```
You can clear the current user by logging them out:

```objective_c
[MLUser logOut];
MLUser *currentUser = [MLUser currentUser]; // this will now be nil
```

### Change Password

You can change password by updating `password` field:

```
[MLUser currentUser].password = @"the new password";
[[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        // ...
    } else {
        // handle the error
    }
}];
```

In consideration of safety, old password is required before entering a new one:

```
NSString *theOldPassword;
NSString *theNewPassword;

[[MLUser currentUser] checkIsPasswordMatchInBackground:theOldPassword block:^(BOOL isMatch, NSError *error) {
    if (isMatch) {
        [MLUser currentUser].password = theNewPassword;
        [[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
            if (succeeded) {
                // ...
            } else {
                // handle the error
            }
        }];
    } else {
        // handle the error
    }
}];
```

###Password Reset

MaxLeap provides a method for users to reset the password securely. The procedure is simple, only user's email address is required:

```objective_c
[MLUser requestPasswordResetForEmailInBackground:@"email@example.com"];
```

This will attempt to match the given email with the user's email or username field, and will send them a password reset email. By doing this, you can opt to have users use their email as their username, or you can collect it separately and store it in the email field.
The reset procedure is show as below:

* Users enter their email address and require password reset.
* MaxLeap sends an email to the email address user just provided and this email contains the reset link.
* Users click on the reset lins, enter a ML page and set a new password.
* MaxLeap has reset user's password successfully.

**Notice**: Note that the messaging in this flow will reference your app by the name that you specified when you created this app on MaxLeap.

###User Query

To query for users, you need to use the special user query:

```objective_c
MLQuery *query = [MLUser query];
[query whereKey:@"gender" equalTo:@"female"]; // find all the women
[query findObjectsInBackgroundWithBlock:^(NSArray *girls, NSError *error) {
    NSLog(@"%@", girls);
}];
```

###Email Verification

Enabling email verification in an MaxLeap  application's settings allows the application to reserve part of its experience for users with confirmed email addresses. Email verification adds the `emailVerified` key to the `MLUser` object. When a `MLUser`'s `email` is set or modified, `emailVerified` is set to `false`. MaxLeap then emails the user a link which will set `emailVerified` to `true`.

There are three `emailVerified` states to consider:

1. `true` － the user confirmed his or her email address by clicking on the link MaxLeap emailed them. `MLUsers` can never have a `true` value when the user account is first created.
2. `false` － at the time the `MLUser` object was last refreshed, the user had not confirmed his or her email address. If `emailVerified` is `false`, consider calling `+[MLDataManager fetchDataOfObjectInBackground:block:]` to pass `MLUser` to the first parameter.
3. missing － the `MLUser` was created when email verification was off or the `MLUser` does not have an `email`.


###Anonymous Users

Being able to associate data and objects with individual users is highly valuable, but sometimes you want to be able to do this without forcing a user to specify a username and password.

Anonymous users refers to a special set of users without username and password. They have the same features as other users while all data will be no longer accessible once deleted. 

You can get an anonymous user account with `MLAnonymousUtils`:

```objective_c
[MLAnonymousUtils logInWithBlock:^(MLUser *user, NSError *error) {
    if (error) {
        NSLog(@"Anonymous login failed.");
    } else {
        NSLog(@"Anonymous user logged in.");
    }
}];
```

#####Create Anonymous Users Automatically
Anonymous users can also be automatically created for you without requiring a network request, so that you can begin working with your user immediately when your application starts.  When you enable automatic anonymous user creation at application startup, `[MLUser currentUser]` will never be `nil`. The user will automatically be created in the cloud the first time the user or any object with a relation to the user is saved.  Until that point, the user's object ID will be `nil`.  Enabling automatic user creation makes associating data with your users painless.  For example, in your `application:didFinishLaunchingWithOptions:` function, you might write:

```objective_c
[MLUser enableAutomaticUser];
[[MLUser currentUser] incrementKey:@"RunCount"];
[[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can convert an anonymous user into a regular user by setting the username and password, then calling `-[user signUpInBackgroundWithlock:]`, or by logging in or linking with a service like *Facebook* or *Twitter*. The converted user will retain all of its data.  To determine whether the current user is an anonymous user, you can check `+[MLAnonymousUtils isLinkedWithUser:]`:

```objective_c
if ([MLAnonymousUtils isLinkedWithUser:[MLUser currentUser]]) {
    // current user is anonymous
} else {
    // current user is regular
}
```

##Third Party Login

MaxLeap provides 3rd party login service to simplify the signup and signin and integrate ML app as well as apps like Facebook and Twitter. You can use 3rd party app SDK and MaxLeap SDK at the same time and connect `MLUser` and UserId of 3rd party app.


###Log in with Facebook Account

As for the devices installed with Facebook app, ML app can realize direct login with Facebook user credential. If there's no Facebook app installed, users can provide signin info in a standard Facebook login page.

If the Facebook UserId is not bound to any `MLUser` after the Facebook login, MaxLeap will create an account for the user and bind the two.

####Preparations

To start using Facebook with Parse, you need to:

1. [Set up a Facebook app](https://developers.facebook.com/apps), if you haven't already.
2. Add your application's Facebook Application ID on your MaxLeap application's settings page.
3. Follow Facebook's instructions for [getting started with the Facebook SDK][getting started with the facebook sdk] to create an app linked to the Facebook SDK. Double-check that you have added FacebookAppID and URL Scheme values to your application's .plist file.
4. Download and unzip[MaxLeap iOS SDK](https://github.com/MaxLeap/SDK-iOS/releases), if you haven't already.
5. Add `MLFacebookUtils.framework`  to your Xcode project if you are using FacebookSDK v3.x;<br> Add `MLFacebookUtilsV4.framework` to your Xcode project if you are using FacebookSDK v4.x.

There's also two code changes you'll need to make. First, add the following to your `application:didFinishLaunchingWithOptions:` method.

FacebookSDK v3.x 

```objective_c
#import <MLFacebookUtils/MLFacebookUtils.h>

@implementation AppDelegate

- (void)application:(UIApplication *)application didFinishLaunchWithOptions:(NSDictionary *)launchOptions {
   	[MaxLeap setApplicationId:@"MaxLeapAppId" clientKey:@"MaxLeapClientKey"];
   	[MLFacebookUtils initializeFacebook];
}

@end
```

FacebookSDK v4.x

```
#import <MLFacebookUtils/MLFacebookUtils.h>

@implementation AppDelegate

- (void)application:(UIApplication *)application didFinishLaunchWithOptions:(NSDictionary *)launchOptions {
   	[MaxLeap setApplicationId:@"MaxLeapAppId" clientKey:@"MaxLeapClientKey"];
   	[MLFacebookUtils initializeFacebookWithApplicationLaunchOptions:launchOptions];
}

@end
```

Then, add following processors in app delegate.

FacebookSDK v3.x 

```
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation 
{
    return [FBAppCall handleOpenURL:url sourceApplication:sourceApplication withSession:[MLFacebookUtils session]];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [FBAppCall handleDidBecomeActiveWithSession:[MLFacebookUtils session]];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    [[MLFacebookUtils session] close];
}
```

FacebookSDK v4.x 

```objective_c
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}
```

There are two main ways to use Facebook with your MaxLeap users: (1) logging in as a Facebook user and creating a `MLUser`, or (2) linking Facebook to an existing `MLUser`.

####Sign in and Register New MLUser

`MLUser` provides a way to allow your users to log in or sign up through Facebook. This is done by using the `logInWithPermissions:` method like so:

FacebookSDK v3.x

```objective_c
[MLFacebookUtils logInWithPermissions:permissions block:^(MLUser *user, NSError *error) {
    if (!user) {
        NSLog(@"Uh oh. The user cancelled the Facebook login.");
    } else if (user.isNew) {
        NSLog(@"User signed up and logged in through Facebook!");
    } else {
        NSLog(@"User logged in through Facebook!");
    }
}];
```

FacebookSDK v4.x

```
[MLFacebookUtils logInInBackgroundWithReadPermissions:readPermissions block:^(MLUser *user, NSError *error) {
    if (!user) {
        NSLog(@"Uh oh. The user cancelled the Facebook login.");
    } else if (user.isNew) {
        NSLog(@"User signed up and logged in through Facebook!");
    } else {
        NSLog(@"User logged in through Facebook!");
    }
}];
```

When this code is run, the following happens:

1. The user is shown the Facebook login dialog.
2. The user authenticates via Facebook, and your app receives a callback using `handleOpenURL`.
3. Our SDK receives the user's Facebook access data and saves it to a `MLUser`. If no `MLUser` exists with the same Facebook ID, then a new `MLUser` is created.
4. Your code block is called with the user and the current user reference will be updated to this user.

The permissions argument is an array of strings that specifies what permissions your app requires from the Facebook user. These permissions must only include read permissions. The `MLUser` integration doesn't require any permissions to work out of the box. [Read more permissions on Facebook's developer guide.][facebook permissions].


To acquire publishing permissions for a user so that your app can, for example, post status updates on their behalf, in Facebook SDk 3.x, you must call

 `+[MLFacebookUtils reauthorizeUser:withPublishPermissions:audience:block]`:

```objective_c
[MLFacebookUtils reauthorizeUser:[MLUser currentUser]
              withPublishPermissions:@[@"publish_actions"]
                            audience:FBSessionDefaultAudienceFriends
                               block:^(BOOL succeeded, NSError *error) {
                                   if (succeeded) {
                                       // Your app now has publishing permissions for the user
                                   }
                               }];
```

in Facebook SDk 4.x, you must call `[MLFacebookUtils logInInBackgroundWithPublishPermissions:]`:

```
[MLFacebookUtils logInInBackgroundWithPublishPermissions:@[@"publish_actions"] block:^(MLUser *user, NSError *error) {
    if (!user) {
        // ...
    } else {
    	 NSLog("user now has publish permissions");
    }
}];
```

You can decide whether or not record the data got from Facebook users after the verification. To complete the operation, you need to conduct a graphic query with Facebook SDK.

####Bind `MLUser` and Facebook Account

If you want to associate an existing `MLUser` to a Facebook account, you can link it like so:

Facebook SDK 3.x

```objective_c
if (![MLFacebookUtils isLinkedWithUser:user]) {
    [MLFacebookUtils linkUser:user permissions:permissions block:^(BOOL succeeded, NSError *error) {
        if (succeeded) {
            NSLog(@"Woohoo, user logged in with Facebook!");
        }
    }];
}
```

Facebook SDK 4.x

```
if (![MLFacebookUtils isLinkedWithUser:user]) {
    [MLFacebookUtils linkUserInBackground:user withReadPermissions:permissions block:^(BOOL succeeded, NSError *error) {
        if (succeeded) {
            NSLog(@"Woohoo, user logged in with Facebook!");
        }
    }];
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing `MLUser` is updated with the Facebook information. Future logins via Facebook will now log in the user to their existing account.

####Unbind

If you want to unlink Facebook from a user, simply do this:

```objective_c
[MLFacebookUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"The user is no longer associated with their Facebook account.");
    }
}];
```

The Facebook iOS SDK provides a number of helper classes for interacting with Facebook's API. Generally, you will use the `FBRequest` class to interact with Facebook on behalf of your logged-in user. [You can read more about the Facebook SDK here][facebook sdk reference]

Our library manage `FBSession` objects for you. You can simply call `[MLFacebookUtils session]` to access the session instance, which can be passed to `FBRequest`.


###Log in with Twitter Account

Similar to Facebook, the Android SDK of Twitter helps app optimize the signin experience. As for the devices set with Twitter account, ML app can realize direct login with Twitter user credential. If there's no Twitter account set, users can provide signin info in a standard Twitter login page.

If the Twitter UserId is not bound to any MLUser after the Twitter login, MaxLeap will create an account for the user and bind the two.

####Preparations

For using Twitter with MaxLeap:

1. [Set up a Twitter app][set up twitter app], if you haven't already.
2. Add your application's Twitter consumer key on your MaxLeap application's settings page.
3. When asked to specify a "Callback URL" for your Twitter app, please insert a valid URL. This value will not be used by your iOS or Android application, but is necessary in order to enable authentication through Twitter.
4. Add the `Accounts.framework` and `Social.framework` libraries to your Xcode project.
5. Add the following where you initialize the Parse SDK, such as in `application:didFinishLaunchingWithOptions:`.

```objective_c
[MLTwitterUtils initializeWithConsumerKey:@"YOUR CONSUMER KEY" consumerSecret:@"YOUR CONSUMER SECRET"];
```

If you encounter any issues that are Twitter-related, a good resource is the [official Twitter documentation][twitter documentation]。

There are two main ways to use Twitter with your MaxLeap users: (1) logging in as a Twitter user and creating a `MLUser`, or (2) linking Twitter to an existing `MLUser`.


####Sign in and Register New MLUser

`MLTwitterUtils` provides a way to allow your `MLUser`s to log in or sign up through Twitter. This is accomplished using the `logInWithBlock` method:

```objective_c
[MLTwitterUtils logInWithBlock:^(MLUser *user, NSError *error) {
    if (!user) {
        NSLog(@"Uh oh. The user cancelled the Twitter login.");
        return;
    } else if (user.isNew) {
        NSLog(@"User signed up and logged in with Twitter!");
    } else {
        NSLog(@"User logged in with Twitter!");
    }
}];
```

When this code is run, the following happens:

1. The user is shown the Twitter login dialog.
2. The user authenticates via Twitter, and your app receives a callback.
3. Our SDK receives the Twitter data and saves it to a `MLUser`. If it's a new user based on the Twitter handle, then that user is created.
4. Your `block` is called with the user and the current user reference will be updated to this user.


####Bind `MLUser` and Twitter Account

You can bind `MLUser` and Twitter account with following method:

```objective_c
if (![MLTwitterUtils isLinkedWithUser:user]) {
    [MLTwitterUtils linkUser:user block:^(BOOL succeeded, NSError *error) {
        if ([MLTwitterUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user logged in with Twitter!");
        }
    }];
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing `MLUser` is updated with the Twitter information. Future logins via Twitter will now log the user into their existing account.


####Unbind
If you want to unlink Twitter from a user, simply do this:

```objective_c
[MLTwitterUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Twitter account.");
    }
}];
```

Our SDK provides a straightforward way to sign your API HTTP requests to the [Twitter REST API][twitter rest api] when your app has a Twitter-linked `MLUser`.  To make a request through our API, you can use the `ML_Twitter` singleton provided by `MLTwitterUtils`:


```objective_c
NSURL *verify = [NSURL URLWithString:@"https://api.twitter.com/1/account/verify_credentials.json"];
NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:verify];
[[MLTwitterUtils twitter] signRequest:request];
NSURLResponse *response = nil;
NSError *error = nil;
NSData *data = [NSURMLonnection sendSynchronousRequest:request
                                     returningResponse:&response
                                                 error:&error];
```



##GeoPoint

MaxLeap allows you to associate real-world latitude and longitude coordinates with an object.  Adding a MLGeoPoint to a `MLObject` allows queries to take into account the proximity of an object to a reference point. This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.


#### MLGeoPoint Field Description

#### Create MLGeoPoint

To associate a point with an object you first need to create a `MLGeoPoint`. For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

```objective_c
MLGeoPoint *point = [MLGeoPoint geoPointWithLatitude:40.0 longitude:-30.0];
```

This point is then stored in the object as a regular field.

```objective_c
placeObject[@"location"] = point;
```
####Geolocation Query

#####Inquire the nearest place to target object

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point. This can be done by adding another restriction to `MLQuery` using `whereKey:nearGeoPoint:`. Getting a list of ten places that are closest to a user may look something like:

```objective_c
// User's location
MLUser *userObject;
MLGeoPoint *userGeoPoint = userObject[@"location"];

// Create a query for places
MLQuery *query = [MLQuery queryWithClassName:@"PlaceObject"];

// Interested in locations near user.
[query whereKey:@"location" nearGeoPoint:userGeoPoint];

// Limit what could be a lot of points.
query.limit = 10;

// Final list of objects
[query findObjectsInBackgroundWithBlock:^(NSArray *placesObjects, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with placesObjects
    }
}];
```

At this point `placesObjects` will be an array of objects ordered by distance (nearest to farthest) from `userGeoPoint`. Note that if an additional `orderByAscending:`/`orderByDescending:` constraint is applied, it will take precedence over the distance ordering.

#####Inquire objects around a certain location

 To limit the results using distance check out  `whereKey:nearGeoPoint:withinMiles:`、`whereKey:nearGeoPoint:withinKilometers:` and `whereKey:nearGeoPoint:withinRadians:`.

#####Inquire objects within a certain range

It's also possible to query for the set of objects that are contained within a particular area. To find the objects in a rectangular bounding box, add the `whereKey:withinGeoBoxFromSouthwest:toNortheast:` restriction to your `MLQuery`.

```objective_c
MLGeoPoint *swOfSF = [MLGeoPoint geoPointWithLatitude:37.708813 longitude:-122.526398];
MLGeoPoint *neOfSF = [MLGeoPoint geoPointWithLatitude:37.822802 longitude:-122.373962];
MLQuery *query = [MLQuery queryWithclassName:@"PizzaPlaceObject"];
[query whereKey:@"location" withinGeoBoxFromSouthwest:swOfSF toNortheast:neOfSF];
[query findObjectsInBackgroundWithBlock:^(NSArray *pizzaPlacesInSF, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with pizzaPlacesInSF
    }
}];
```

Notices:

1. Every `MLObject` class can only have one key with `MLGeoPoint` object.
2. The point should not be below the range. The latitude shouldn't be -90.0 or 90.0, the longitude shouldn't be -180.0 or 180.0. Or, it will return with error.


[+load api reference]: https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/classes/NSObject_class/#//apple_ref/occ/clm/NSObject/load

[+initialize api reference]: https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/classes/NSObject_class/#//apple_ref/occ/clm/NSObject/initialize

[access control list]: http://en.wikipedia.org/wiki/Access_control_list
[role-based access control]: http://en.wikipedia.org/wiki/Role-based_access_control

[set up a facebook app]: https://developers.facebook.com/apps

[getting started with the facebook sdk]: https://developers.facebook.com/docs/getting-started/facebook-sdk-for-ios/

[facebook permissions]: https://developers.facebook.com/docs/reference/api/permissions/

[facebook sdk reference]: https://developers.facebook.com/docs/reference/ios/current/

[set up twitter app]: https://dev.twitter.com/apps

[twitter documentation]: https://dev.twitter.com/docs

[twitter rest api]: https://dev.twitter.com/docs/api