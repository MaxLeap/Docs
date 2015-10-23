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
The object that stored in  Cloud Data is called `MLObject` and every `MLObject` is planned in different `class`(like table in database). `MLObject` contains several key-value pairs and the value is data compatible with JSON format.考虑到数据安全，MaxLeap 禁止客户端修改数据仓库的结构。您需要预先在 MaxLeap 开发者平台上创建需要用到的表，然后仔细定义每个表中的字段和其值类型。

###Create New
Suppose that we need to save a piece of data to `Comment` class, it contains following properties: 

Property Name|Value|Value Type
-------|-------|---|
content|"kind of funny"|Character
pubUserId|1314520|Digit
isRead|false|Boolean

We recommend the neat CamelCase for naming class and key (e.g. NameYourclassesLikeThis, nameYourKeysLikeThis).

`MLObject` 接口与 `NSMutableDictionary` 类似，但多了 `saveInBackground` 方法。现在我们保存一条 `Comment`:

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

* **When was "Comment" Class created:** For data security, creating sheet by client is prohibited in MaxLeap. You need to create a Comment sheet in Dev Center before saving the data.
* **Property Value Type in the Table is consistent:** The data type of relative property value should be consistent with the one you create the property, otherwise you will fail to save data. 
* **客户端无法修改后端数据结构：** 例如，如果 Comment 表中没有 `isRead` 这个字段，那么保存将会失败
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

要从检索到的 `MLObject` 实例中获取值，您可以使用 `objectForKey:` 方法或 `[]` 操作符：

```objective_c
int pubUserId = [[myComment objectForKey:@"pubUserId"] intValue];
NSString *content = myComment[@"content"];
BOOL pubUserId = [myComment[@"cheatMode"] boolValue];
```

有三个特殊的值以属性的方式提供：

```objective_c
NSString *objectId = myComment.objectId;
NSDate *updatedAt = myComment.updatedAt;
NSDate *createdAt = myComment.createdAt;
```

若需要刷新已有对象，可以调用 `-fetchInBackgroundWithBlock:` 方法：

```
[myObject fetchInBackgroundWithBlock:^(MLObject *object, NSError *error) {
    // object 就是使用服务器数据填充后的 myObject
}];
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

#####Incremental Counter
At this point, we may use `-incrementKey:` method (default increment will be 1) and update counter type properties more efficiently and securely. For example, we can invoke following method to update the `readCount` of a post: 


```objective_c
[myPost incrementKey:@"readCount"];
[myPost saveInBackgroundWithBlock:nil];
```

#####Specified Increment 
您还可以使用 `-incrementKey:byAmount:` 实现任何数量的递增。Note that increment doesn't need to be integer, value of a floating-point type is also acceptable. 

#####Decremental Increment 

要实现递减计数器，只需要向 `-incrementKey:byAmount:` 接口传入一个负数即可：

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

`-removeObject:forKey:` 和 `-removeObjectsInArray:forKey:` 会从数组字段中删除每个给定对象的所有实例。

请注意 `removeObject:forKey` 与 `removeObjectForKey:` 的区别。 

**Notice: Remove and Add/Put must be seperated for invoking save function. Or, the data may fail to be saved.**

###Associated Data
An object can be associated to other objects. As mentioned before, we can save the instance A of a `MLObject` as the parameter value of instance B of another `MLOject`. This will easily solve the data relational mapping of one-to-one and one-to-many, like the relation between primary key & foreign key.

Notices: MaxLeap handles this kind of data reference with `Pointer` type. For data consistency, it won't save another copy of data A in data B sheet.

#### 使用 `Pointer` 实现

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

我们可以使用 `query` 来获取这条微博所有的评论：

```
MLObject *myPost = ...
MLQuery *query = [MLQuery queryWithClassName:@"Comment"];
[query whereKey:@"parent" equalTo:myPost];
[query findObjectsInBackgroundWithBlock:^(NSArray *allComments, NSError *error) {
    // do something with all the comments of myPost
}];
```

您也可以通过 `objectId` 来关联已有的对象：

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

您可以嵌套 `NSDictionary` 和 `NSArray` 对象，以在单一 `MLObject` 中存储具有复杂结构的数据。

一些示例：

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

我们不建议通过在 `MLObject` 中使用 `NSData` 字段来存储图像或文档等大型二进制数据。`MLObject` 的大小不应超过 128 KB。要存储更多数据，我们建议您使用 `MLFile` 或者 `MLPrivateFile`。更多详细信息请参考本指南的[文件](#文件)部分。

## Files
###Creation and Upload of MLFile

MLFile can help your app save the files to server, like the common image, video, audio and any other binary data (cannot exceed 100MB). It helps you deal with the situation that there's too many files or the file is too large to be stored in regular `MLObject`.

`MLFile` 上手很容易。首先，你要由 `NSData` 类型的数据，然后创建一个 `MLFile` 实例。下面的例子中，我们只是使用一个字符串：

```objective_c
NSData *data = [@"Working at MaxLeap is great!" dataUsingEncoding:NSUTF8StringEncoding];
MLFile *file = [MLFile fileWithName:@"resume.txt" data:data];
```

**注意**，在这个例子中，我们把文件命名为 `resume.txt`。这里要注意两点：

- 您不需要担心文件名冲突。每次上传都会获得一个唯一标识符，所以上传多个文件名为 `resume.txt` 的文件不同出现任何问题。
- 重要的是，您要提供一个带扩展名的文件名。这样 MaxLeap 就能够判断文件类型，并对文件进行相应的处理。所以，若您要储存 PNG 图片，务必使文件名以 .png 结尾。

然后，您可以把文件保存到云中。与 `MLObject` 相同，使用 `-save` 方法。

```objective_c
[file saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

最后，保存完成后，您可以像其他数据一样把 `MLFile` 与 `MLObject` 关联起来：

```objective_c
MLObject *jobApplication = [MLObject objectWithclassName:@"JobApplication"]
jobApplication[@"applicantName"] = @"Joe Smith";
jobApplication[@"applicantResumeFile"] = file;
[jobApplication saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您可以调用 `-getDataInBackgroundWithBlock:` 重新获取此数据。这里我们从另一 `JobApplication` 对象获取恢复文件：

```objective_c
MLFile *applicantResume = anotherApplication[@"applicantResumeFile"];
[applicationResume getDataInBackgroundWithBlock:^(NSData *data, NSError *err) {
    if (!error) {
        NSData *resumeData = data;
    }
}];
```

##### 图像

通过将图片转换成 `NSData` 然后使用 `MLFile` 就可以轻松地储存图片。假设您有一个名为 `image` 的 `UIImage`，并想把它另存为 `MLFile`：

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

您的 `MLFile` 将作为保存操作的一部分被上传到 `userPhoto` 对象。还可以跟踪 `MLFile` 的*上传和下载进度*。

您可以调用 `-getDataInBackgroundWithBlock:` 重新获取此图像。这里我们从另一个名为 `anotherPhoto` 的 `UserPhoto` 获取图像文件：

```objective_c
MLFile *userImageFile = anotherPhoto[@"imageFile"];
[userImageFile getDataInBackgroundWithBlock:^(NSData *imageData, NSError *error) {
    if (!error) {
        UIImage *image = [UIImage imageWithData:imageData];
    }
}];
```

### 进度

使用 `saveInBackgroundWithBlock:progressBlock:` 和 `getDataInBackgroundWithBlock:progressBlock::` 可以分别轻松了解 `MLFile` 的上传和下载进度。例如：

```
NSData *data = [@"MaxLeap is great!" dataUsingEncoding:NSUTF8StringEncoding];
MLFile *file = [MLFile fileWithName:@"resume.txt" data:data];
[file saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
  // 成功或失败处理...
} progressBlock:^(int percentDone) {
  // 更新进度数据，percentDone 介于 0 和 100。
}];
```

您可以用 [REST API](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS) 删除对象引用的文件。您需要提供主密钥才能删除文件。

如果您的文件未被应用中的任何对象引用，则不能通过 [REST API](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS) 删除它们。您可以在应用的“设置”页面请求清理未使用的文件。请记住，该操作可能会破坏依赖于访问未被引用文件（通过其地址属性）的功能。当前与对象关联的文件将不会受到影响。

## Query

我们已经知道如何使用 `getObjectInBackgroundWithId:block:]` 从 MaxLeap 中检索单个 `MLObject`。使用 `MLQuery`，还有其他多种检索数据的方法 —— 您可以一次检索多个对象，设置检索对象的条件等。

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

`findObjectsInBackgroundWithBlock:` 方法确保不阻塞当前线程并完成网络请求，然后在主线程执行 `block`。

###Query Term

为了充分利用 `MLQuery`，我们建议使用下列方法添加限制条件。但是，若您更喜欢用 `NSPredicate`，创建 `MLQuery` 时提供 `NSPredicate` 即可指定一系列的限制条件。

```objective_c
NSPredicate *predicate = [NSPredicate predicateWithFormat:
@"publisher = 'MaxLeap'"];
MLQuery *query = [MLQuery queryWithclassName:@"Post" predicate:predicate];
```

支持以下特性：

- 指定一个字段和一个常数的简单比较操作，比如： `=`、`!=`、`<`、`>`、`<=`、`>=` 和 `BETWEEN`
- 正则表达式，如 `LIKE`、`MATCHES`、`CONTAINS` 或 `ENDSWITH`。
- 限定谓语，如 `x IN {1, 2, 3}`。
- 键存在谓语，如 `x IN SELF`。
- `BEGINSWITH` 表达式。
- 带 `AND`、`OR` 和 `NOT` 的复合谓语。
- 带 `"key IN %@", subquery` 的子查询。

不支持以下类型的谓语：

- 聚合操作，如 ANY、SOME、ALL 或 NONE。
- 将一个键与另一个键比较的谓语。
- 带多个 `OR` 子句的复杂谓语。

##### Set Query Term

有几种方法可以对 `MLQuery` 可以查到的对象设置限制条件。您可以用 `whereKey:notEqualTo:` 将具有特定键值对的对象过滤出来：

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

`skip` 用来跳过返回结果中开头的一些条目，配合 `limit` 可以对结果分页：

```
query.skip = 10; // 跳过前 10 条结果
```

如果您想要确切的一个结果，更加方便的方法是使用 `getFirstObjectInBackgroundWithBlock:` 而不是 `findObjectsInBackgroundWithBlock:`。

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

一个查询可以使用多个排序键，如下：

```objective_c
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
[query orderByAscending:@"score"];
// Sorts the results in descending order by the score field if the previous sort keys are equal.
[query orderByDescending:@"username"];
```

#####Set Numeric Value Limit

对于可排序的数据，你还可以在查询中使用对比：

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

您可以限制返回的字段，通过调用 `selectKeys:` 并传入一个字段数组来实现。若要检索只包含 `score` 和 `playerName` 字段（以及特殊内建字段，如 `objectId`、`createdAt` 和 `updatedAt`）的对象：

```objective_c
MLQuery *query = [MLQuery queryWithclassName:@"Post"];
[query selectKeys:@[@"contents", @"publisher"]];
[query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // objects in results will only contain the contents and publisher fields
}];
```

稍后，可以通过对返回的对象调用  `fetchIfNeededInBackgroundWithBlock:` 提取其余的字段：

```objective_c
MLObject *object = (MLObject*)results[0];
[object fetchIfNeededInBackgroundWithBlock::^(MLObject *object, NSError *error) {
    // all fields of the object will now be available here.
}];
```

##### 设置更多约束

若您想要检索与几个不同值匹配的对象，您可以使用 `whereKey:containedIn:`，并提供一组可接受的值。这通常在用单一查询替代多个查询时比较有用。例如，如果您检索某几个用户发的微博：

```objective_c
// Finds posts from any of Jonathan, Dario, or Shawn
NSArray *names = @[@"Jonathan Walsh", @"Dario Wunsch", @"Shawn Simon"];
[query whereKey:@"publisher" containedIn:names];
```

若您想要检索与几个值都不匹配的对象，您可以使用 `whereKey:notContainedIn:`，并提供一组可接受的值。例如，如果您想检索不在某个列表里的用户发的微博：

```objective_c
// Finds posts from anyone who is neither Jonathan, Dario, nor Shawn
NSArray *names = @[@"Jonathan Walsh", @"Dario Wunsch", @"Shawn Simon"];
[query whereKey:@"playerName" notContainedIn:names];
```

若您想要检索有某一特定键集的对象，可以使用 `whereKeyExists:`。相反，若您想要检索没有某一特定键集的对象，可以使用 `whereKeyDoesNotExist:`。

您可以使用 `whereKey:matchesKey:inQuery:` 方法获取符合以下要求的对象：对象中的一个键值与另一查询所得结果的对象集中的某一键值匹配。例如，获取用户所有粉丝发的微博：

```objective_c
MLQuery *commentQuery = [MLQuery queryWithClassName:@"Comment"];
[commentQuery whereKey:@"parent" equalTo:post];
MLQuery *postsQuery = [MLQuery queryWithClassName:@"Post"];
[postsQuery whereKey:@"author" matchesKey:@"author" inQuery:postsQuery];
[postsQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
    // ...
}];
```

类似地，您可以使用 `whereKey:doesNotMatchKey:inQuery:` 获取不符合以下要求的对象，对象中的一个键值与另一查询所得结果的对象集中的某一键值匹配。


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

您还可以用 `objectId` 进行关系型查询：

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

您也可以使用点标记进行多层级检索。如果您想要包含帖子的评论以及帖子的作者，您可以操作如下：

```objective_c
[query includeKey:@"post.author"];
```

您可以通过多次调用 `includeKey:`，进行包含多个字段的查询。此功能也适用于 `getFirstObjectInBackgroundWithBlock:` 和 `getObjectInBackgroundWithId:block:` 等 `MLQuery` 辅助方法。

###Count Query

计数查询可以对拥有 1000 条以上数据的类返回大概结果。If you don't want to get all matching objects, but just the count, then you can replace the `findObjects` with `countObjects`. e.g. inquire how many games did an gamer played:

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

对于含超过 1,000 个对象的类，计数操作受超时设定的限制。这种情况下，可能经常遇到超时错误，或只能返回近似正确的结果。因此，在应用程序的设计中，最好能做到避免此类计数操作。

###Compound Query

如果想要查找与几个查询中的其中一个匹配的对象，您可以使用 `orQueryWithSubqueries:` 方法。例如，如果您想要查找赢得多场胜利或几场胜利的玩家，您可以：

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

您可以给新创建的 `MLQuery` 添加额外限制条件，这相当于 “and” 运算符。

但是，请注意：在混合查询结果中查询时，我们不支持非过滤型限制条件（如 `limit`、`skip`、`orderBy...:`、`includeKey:`）。

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
2. 实现子类方法 `MLclassName`。这是您传给 `-initWithclassName:` 方法的字符串，这样以后就不必再传类名了。
3. 将 `MLObject+Subclass.h` 导入您的 .m 文件。该操作导入了 `MLSubclassing` 协议中的所有方法的实现。其中 `MLclassName` 的默认实现是返回类名(指 Objective C 中的类)。
4. 在 `+[MaxLeap setApplicationId:clientKey:]` 之前调用 `+[Yourclass registerSubclass]`。一个简单的方法是在类的 [+load][+load api reference] (Obj-C only) 或者 [+initialize][+initialize api reference] (both Obj-C and Swift) 方法中做这个事情。

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

`MLObject` 支持动态合成器(dynamic synthesizers)，这一点与 `NSManagedObject` 类似。像平常一样声明一个属性，但是在您的 .m 文件中使用 `@dynamic` 而不用 `@synthesize`。下面的示例在 `Game` 类中创建了 `displayName` 属性：

```objective_c
// Game.h
@interface Game : MLObject <MLSubclassing>
+ (NSString *)leapClassName;
@property (retain) NSString *displayName;
@end

// Game.m
@dynamic displayName;
```

现在，您可以使用 `game.displayName` 或 `[game displayName]` 访问 `displayName` 属性，并使用 `game.displayName = @"Bird"` 或 `[game setDisplayName:@"Bird"]` 对其进行赋值。动态属性可以让 Xcode 提供自动完成功能和简单的纠错。

`NSNumber` 属性可使用 `NSNumber` 或其相应的基本类型来实现。请看下例：

```objective_c
@property BOOL multiplayer;
@property float price;
```

这种情况下，`game[@"multiplayer"]` 将返回一个 `NSNumber`，可以使用 `boolValue` 访问；`game[@"price"]` 将返回一个 `NSNumber`，可以使用 `floatValue` 访问。但是，`fireProof` 属性实际上是 `BOOL`，`rupees` 属性实际上是 `float`。动态 `getter` 会自动提取 `BOOL` 或 `int` 值，动态 `setter` 会自动将值装入 `NSNumber` 中。您可以使用任一格式。原始属性类型更易于使用，但是 `NSNumber` 属性类型明显支持 `nil` 值。

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

您应该使用类方法 `object` 创建新的对象。这样可以构建一个您定义的类型的实例，并正确处理子类化。要创建现有对象的引用，使用 `objectWithoutDataWithObjectId:`。

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

许多应用的核心理念是，用户帐户保护应能让用户安全访问他们的信息。我们专门用于用户管理的类，叫做 `MLUser`，可自动处理用户帐户管理需要的很多功能。

您可以使用这个类在您的应用程序中添加用户帐户功能。

MLUser is a subclass of MLObject. It inherited all methods of MLObject and has the same features as MLObject, like flexible schema and key-value pair interface. The different is MLUser adds some specific features of user account.


###Property Description

Apart from the properties inherited from `MLObject`, `MLUser` has some specific properties:

- `username`：用户的用户名（必填）。
- `password`：用户的密码（注册时必填）。
- `email`：用户的电子邮箱地址（选填）。

我们在浏览用户的各种用例时，会逐条仔细查看这些信息。切记，如果您通过这些属性设置 `username` 和 `email`，则无需使用 `setObject:forKey:` 方法进行设置 － 这是自动设置的。

###User Signup

您的应用程序要做的第一件事就是让用户注册。以下代码阐释了典型注册：

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

这个调用将在您的 MaxLeap 应用中异步创建一个新的用户。创建前，它还会检查确保用户名和邮箱唯一。此外，MaxLeap 只保存密码的密文。我们从来不明文储存密码，也不会将密码明文传输回客户端。

**Notice**，Signup uses `-[user signUpInBackgroundWithBlock:]` method rather than `-[user saveInBackgroundWithBlock:]` method. 应始终使用 `-[user signUpInBackgroundWithBlock:]` 方法创建新的 `MLUser`。调用 `-[user saveInBackgroundWithBlock:]` 可以完成用户的后续更新。

若注册不成功，您应该查看返回的错误对象。最可能的情况就是该用户名或邮箱已被其他用户使用。你应该将这种情况清楚地告诉用户，并要求他们尝试不同的用户名。

您可以使用电子邮箱地址作为用户名。只需让您的用户输入他们的电子邮箱，但是需要将它填写在用户名属性中 － `MLUser` 将可以正常运作。我们将在*重置密码*部分说明是如何处理这种情况的。

###Signin

当然，您让用户注册后，需要让他们以后登录到他们的帐户。为此，您可以使用类方法 `+[MLUser logInWithUsernameInBackground:password:block:]`。

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

If the app required signin everytime, it will directly affect the user experience. You can use the cached `currentUser` object to avoid this situation.

There would be a cached user object in local disk when you register or signin. You can log in with the cached object with following method:

```objective_c
MLUser *currentUser = [MLUser currentUser];
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login screen
}
```

You can clear cached object with following method:

```objective_c
[MLUser logOut];
MLUser *currentUser = [MLUser currentUser]; // this will now be nil
```

### 修改密码

可以通过更新 `password` 字段来更改密码：

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

为了安全起见，在更改密码前需要让用户输入旧密码并验证是否与当前账户匹配：

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

该操作将尝试将给定的电子邮箱与用户电子邮箱或用户名字段进行匹配，并向用户发送密码重置邮件。这样，您可以选择让用户使用其电子邮箱作为用户名，或者您可以单独收集它并把它储存在电子邮箱字段。

The reset procedure is show as below:

* Users enter their email address and require password reset.
* MaxLeap sends an email to the email address user just provided and this email contains the reset link.
* User click on the reset lins, enter a ML page and set a new password.
* MaxLeap has reset user's password successfully.

**注意**：该流程中的消息传送操作将根据您在 MaxLeap 上创建该应用时指定的名称引用您的应用程序。

###User Query

若要查询用户表，您需要使用特殊的用户查询：

```objective_c
MLQuery *query = [MLUser query];
[query whereKey:@"gender" equalTo:@"female"]; // find all the women
[query findObjectsInBackgroundWithBlock:^(NSArray *girls, NSError *error) {
    NSLog(@"%@", girls);
}];
```

###Email Verification

在 MaxLeap 应用设置中启用电子邮箱验证，可以让应用将部分使用体验提供给验证过电子邮箱地址的用户。电子邮箱验证会将 `emailVerified` 键添加到 `MLUser` 中。`MLUser` 的 `email` 被修改后，`emailVerified` 被设置为 `false`。随后，MaxLeap 会向用户发送一个邮件，其中包含一个链接，可将 `emailVerified` 设置为 `true`。

有三种 `emailVerified` 状态需要考虑：

1. `true` － 用户通过点击 MaxLeap 发送给他们的链接确认电子邮箱地址。最初创建用户帐户时，`MLUsers` 没有 `true` 值。
2. `false` － `MLUser` 对象最后一次刷新时，用户未确认其电子邮箱地址。若 `emailVerified` 为 `false`，可以考虑调用 `+[MLDataManager fetchDataOfObjectInBackground:block:]`，把 `MLUser` 传递给第一个参数。
3. 缺失 － 电子邮箱验证关闭或 `MLUser` 没有 `email` 时创建了 `MLUser`。


###Anonymous Users

能够将数据和对象与具体用户关联非常有价值，但是有时您想在不强迫用户输入用户名和密码的情况下也能达到这种效果。

Anonymous users refers to a special set of users with username and password. They have the same features as other users while all data will be no longer accessible once deleted. 

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

#####自动创建匿名用户
在无网络请求的情况下，也可以自动为您创建匿名用户，以便您能在应用程序开启之后立即与您的用户互动。如果您启用在应用程序开启时自动创建匿名用户的功能，则 `[MLUser currentUser]` 将不会为 `nil`。首次保存用户或与该用户相关的任何对象时，将在云中自动创建用户。在此之前，该用户的对象 ID 为 `nil`。启用自动创建用户功能将使得把数据与您的用户关联变得简单。例如，在您的 `application:didFinishLaunchingWithOptions:` 函数中，您可以写：

```objective_c
[MLUser enableAutomaticUser];
[[MLUser currentUser] incrementKey:@"RunCount"];
[[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您可以通过设置用户名和密码，然后调用 `-[user signUpInBackgroundWithlock:]` 的方式，或者通过登录或关联 *Facebook* 或 *Twitter* 等服务的方式，将匿名用户转换为常规用户。转换的用户将保留其所有数据。想要判断当前用户是否为匿名用户，可以试试 `+[MLAnonymousUtils isLinkedWithUser:]`:

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

若要通过 MaxLeap 使用 Facebook，您需要：

1. [设置 Facebook 应用程序][set up a facebook app], 若您尚未设置。
2. 在您的 MaxLeap 应用设置页面添加应用程序的 Facebook 应用 ID。
3. 按照 Facebook 的 [Facebook SDK 入门][getting started with the facebook sdk]提供的说明，创建与 Facebook SDK 关联的应用程序。仔细检查并确认您已经把 FacebookAppID 和 URL Scheme 添加至应用程序的 .plist 文件。
4. 下载解压 [MaxLeap iOS SDK](https://github.com/MaxLeap/SDK-iOS/releases)，如果您还没有。
5. 如果使用 FacebookSDK v3.x, 把 `MLFacebookUtils.framework` 添加到您的 Xcode 项目中;<br> 如果使用 FacebookSDK v4.x, 把 `MLFacebookUtilsV4.framework` 添加到您的 Xcode 项目中。

还有两步。首先，把下面的代码添加到您引用的 `application:didFinishLaunchingWithOptions:` 方法中。

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

然后，在 app delegate 中添加以下处理器。

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

MaxLeap 用户可通过以下两种主要方法使用 Facebook：(1) 以 Facebook 用户身份登录（注册），并创建 `MLUser`，或者 (2) 将 Facebook 与已有的 `MLUser` 关联。

####Sign in and Register New MLUser

`MLUser` 提供一种方法让您的用户可以通过 Facebook 登录或注册。这可以通过采用 `logInWithPermissions:` 方法来完成，例如：

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

该代码运行时，会出现以下情况：

1. 用户会看到 Facebook 登录对话框。
2. 用户通过 Facebook 验证，您的应用程序会使用 `handleOpenURL` 收到回调。
3. 我们的 SDK 会收到 Facebook 数据并将其保存在 `MLUser` 中。如果是基于 Facebook ID 的新用户，那么该用户随后会被创建。
4. 您的代码块(block)被调用，并传回这个用户对象。

权限(permissions)参数是指定您的应用程序向 Facebook 用户要求什么读取权限的一系列字符串。这些权限必须只能包括读取权限。`MLUser` 整合不要求权限即时可用。[在 Facebook 开发人员指南上阅读关于权限的更多信息][facebook permissions]。

要想获得用户发布权限，以便您的应用程序能执行类似代表用户发布状态更新帖的操作:

在 Facebook SDk 3.x 中，您必须调用 `+[MLFacebookUtils reauthorizeUser:withPublishPermissions:audience:block]`:

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

在 Facebook SDK 4.x 中，调用 `[MLFacebookUtils logInInBackgroundWithPublishPermissions:]`:

```
[MLFacebookUtils logInInBackgroundWithPublishPermissions:@[@"publish_actions"] block:^(MLUser *user, NSError *error) {
    if (!user) {
        // ...
    } else {
    	 NSLog("user now has publish permissions");
    }
}];
```

您可以自行决定在用户验证后记录从 Facebook 用户处获取的所需的任何数据。要完成这一操作，您需要通过 Facebook SDK 进行一项图表查询。

####Bind `MLUser` and Facebook Account

若您想要将已有的 `MLUser` 与 Facebook 帐户关联起来，您可以按以下方式进行关联：

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

关联步骤与登录非常类似。区别在于，成功登陆以后，将会使用来自 Facebook 的信息更新当前的 `MLUser`。今后通过 Facebook 进行登录会使用已有账户。

####Unbind

若您想要取消用户与 Facebook 的关联，操作如下：

```objective_c
[MLFacebookUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"The user is no longer associated with their Facebook account.");
    }
}];
```

Facebook iOS SDK 提供了很多帮助工具类，用来与 Facebook API 互动。通常，您会使用 `FBRequest` 类代表您的登录用户与 Facebook 互动。若要了解有关 Facebook SDK 的更多内容，[请点击这里][facebook sdk reference]。

我们的库为您管理 `FBSession` 对象。您只需调用 `[MLFacebookUtils session]` 来访问会话实例，其随后能传给 `FBRequest`。

###Log in with Twitter Account

Similar to Facebook, the Android SDK of Twitter helps app optimize the signin experience. As for the devices set with Twitter account, ML app can realize direct login with Twitter user credential. If there's no Twitter account set, users can provide signin info in a standard Twitter login page.

If the Twitter UserId is not bound to any MLUser after the Twitter login, MaxLeap will create an account for the user and bind the two.

####Preparations

若要通过 MaxLeap 使用 Twitter，您需要：

1. [设置 Twitter 应用][set up twitter app], 若您尚未设置。
2. 在您的 MaxLeap 应用设置页面添加您应用的 Twitter 密钥(consumer key)。
3. 当要求您为 Twitter 应用程序指定 “Callback URL”（回调地址），请插入有效地址。它不会被您的 iOS 或 Android 应用程序使用，但是在通过 Twitter 启用身份验证时非常必要。
4. 将 `Accounts.framework` 和 `Social.framework` 库添加至您的 Xcode 项目。
5. 在初始化 MaxLeap SDK 的地方加入以下代码，比如在 `application:didFinishLaunchingWithOptions:` 方法中。

```objective_c
[MLTwitterUtils initializeWithConsumerKey:@"YOUR CONSUMER KEY" consumerSecret:@"YOUR CONSUMER SECRET"];
```

若您遇到与 Twitter 相关的任何问题，请查阅 [Twitter 官方文档][twitter documentation]。

MaxLeap 用户可通过以下两种主要方法使用 Twitter：(1) 以 Twitter 用户身份登录，并创建 MLUser，或者 (2) 将 Twitter 与已有的 `MLUser` 关联。

####Sign in and Register New MLUser

`MLTwitterUtils` 提供一种方法让您的 `MLUser` 可以通过 `Twitter` 登录或注册。这可以使用 `logInWithBlock` 方法实现：

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

该代码运行时，会出现以下情况：

1. 用户会看到 Twitter 登录对话框。
2. 用户通过 Twitter 验证，您的应用程序会收到回调。
3. 我们的 SDK 会收到 Twitter 数据并将其保存在 `MLUser` 中。如果是基于 Twitter 句柄的新用户，那么该用户随后会被创建。
4. 您的 `block` 被调用并带回这个用户对象(user)。

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

关联时发生的步骤与登录非常类似。区别是在成功登录中，将会使用来自 Twitter 的信息更新当前的 MLUser。今后通过 Twitter 进行的登录会使用已存在的账户。

####Unbind
若您想要取消用户与 Twitter 的关联，操作如下：

```objective_c
[MLTwitterUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Twitter account.");
    }
}];
```

在您的应用程序有与 Twitter 关联的 `MLUser` 的情况下，我们的 SDK 提供一种将您的 API HTTP 请求注册到 [Twitter REST API][twitter rest api] 的简单方法。若想通过我们的 API 发出请求，您可以使用 `MLTwitterUtils` 提供的 `ML_Twitter` 单元集：

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

MaxLeap 让您可以把真实的纬度和经度坐标与对象关联起来。通过在 `MLObject` 中添加 MLGeoPoint，可以在查询时实现将对象与参考点的距离临近性纳入考虑。这可以让您轻松某些事情，如找出距离与某个用户最近的其他用户或者距离某个用户最近的地标。

#### MLGeoPoint 字段说明

#### 创建 MLGeoPoint

要将某个地点与对象联系起来，您首先要创建一个 `MLGeoPoint`。例如，要创建一个纬度为 40.0 度，经度为 -30.0 的点：

```objective_c
MLGeoPoint *point = [MLGeoPoint geoPointWithLatitude:40.0 longitude:-30.0];
```

然后，该点被作为常规字段储存在对象中。

```objective_c
placeObject[@"location"] = point;
```
####Geolocation Query

#####Inquire the nearest place to target object

有了一些具有空间坐标的对象后，找到哪些对象距离某个点最近将会产生很好的效应。这可以通过使用 `whereKey:nearGeoPoint:` 对 `MLQuery` 添加另一限制条件完成。举例而言，找出距离某个用户最近的十个地点的方法如下：

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

此时，`placesObjects` 是按照与 `userGeoPoint` 的距离（由近及远）排列的一组对象。注意，若应用另一个 `orderByAscending:`/`orderByDescending:` 限制条件，该限制条件将优先于距离顺序。

##### 查询某地理位置一定距离内的对象

若要用距离来限定获得哪些结果，请使用 `whereKey:nearGeoPoint:withinMiles:`、`whereKey:nearGeoPoint:withinKilometers:` 和 `whereKey:nearGeoPoint:withinRadians:`。

##### 查询一定地理位置范围内对象

您还可以查询包含在特定区域内的对象集合。若要查找位于某个矩形区域内的对象，请将 `whereKey:withinGeoBoxFromSouthwest:toNortheast:` 限制条件添加至您的 `MLQuery`。

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