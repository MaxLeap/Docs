---
title: iOS Developer Guide

language_tabs:
  - objective_c
  - Swift

---

# Cloud Data

If you haven't installed the SDK yet, please head over to the [QuickStart guide](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS) to get our SDK up and running in Xcode. Note that we support iOS 6.0 and higher. You can also check out our [API Reference](LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS) for more detailed information about our SDK.

## Introduction
	
The LAS platform provides a complete backend solution for your mobile application. Our goal is to totally eliminate the need for writing server code or maintaining servers.

### Apps

On LAS, you create an App for each of your moboile applicatins. Each App has its own application id and client key that you apply to your SDK install. Your account on LAS can accommodate multiple Apps. This is useful even if you have one application, since you can deploy different versions for test and production.

## Objects

### The LASObject

Storing data on LAS is built around the `LASObject`. Each `LASObject` contains key-value pairs of JSON-compatible data. This data is schemaless, which means that you don't need to specify ahead of time what keys exist on each `LASObject`. You simply set whatever key-value pairs you want, and our backend will store it.

For example, let's say you're tracking high scores for a game. A single `LASObject` could contain:

```objective_c
score: 1337, playerName: "Sean Plott", cheatMode: false
```

Keys must be alphanumeric strings. Values can be strings, numbers, booleans, or even arrays and dictionaries - anything that can be JSON-encoded.

Each `LASObject` has a class name that you can use to distinguish different sorts of data. For example, we could call the high score object a `GameScore`. We recommend that you NameYourClassesLikeThis and nameYourKeysLikeThis, just to keep your code looking pretty.

### Saving Objects

Let's say you want to save the `GameScore` described above to the LAS. The interface is similar to a `NSMutableDictionary`, plus the `[LASDataManager saveObjectInBackground:block:]` method:

```objective_c
LASObject *gameScore = [LASObject objectWithClassName:@"GameScore"];
gameScore[@"score"] = @1337;
gameScore[@"playerName"] = @"Sean Plott";
gameScore[@"cheatMode"] = @NO;
[LASDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

After this code runs, you will probably be wondering if anything really happened. To make sure the data was saved, you can look at the Data Browser in your app on LAS. You should see something like this:

```objective_c
objectId: "xWMyZ4YEGZ", score: 1337, playerName: "Sean Plott", cheatMode: false,
createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

There are two things to note here. You didn't have to configure or set up a new Class called `GameScore` before running this code. Your LAS app lazily creates this Class for you when it first encounters it.

There are also a few fields you don't need to specify that are provided as a convenience. `objectId` is a unique identifier for each saved object. `createdAt` and `updatedAt` represent the time that each object was created and last modified in the LAS. Each of these fields is filled in by LAS, so they don't exist on a `LASObject` until a save operation has completed.

### Retrieving Objects

Saving data to the cloud is fun, but it's even more fun to get that data out again. If you have the `objectId`, you can retrieve the whole `LASObject` using `LASQueryManager `. This is an asynchronous method, with a block to run after the retrieve complete:

```objective_c
[LASQueryManager getObjectInBackgroundWithClass:@"GameScore" objectId:@"xWMyZ4YEGZ" block:^(LASObject *gameScore, NSError *error) {
    // Do something with the returned LASObject in the gameScore variable.
    NSLog(@"%@", gameScore);
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

To get the values out of the `LASObject`, you can use either the `objectForKey:` method or the `[]` subscripting operator:

```objective_c
int score = [[gameScore objectForKey:@"score"] intValue];
NSString *playerName = gameScore[@"playerName"];
BOOL cheatMode = [gameScore[@"cheatMode"] boolValue];
```

The three special values are provided as properties:

```objective_c
NSString *objectId = gameScore.objectId;
NSDate *updatedAt = gameScore.updatedAt;
NSDate *createdAt = gameScore.createdAt;
```

### Updating Objects

Updating an object is simple. Just set some new data on it and call one of the save methods. Assuming you have saved the object and have the `objectId`, you can retrieve the `LASObject` using the `+[LASQueryManager getObjectInBackgroundWithClass:objectId:]` method and update its data:

```objective_c
// Retrieve the object by id
[LASQueryManager getObjectInBackgroundWithClass:@"GameScore" objectId:@"xWMyZ4YEGZ" block:^(LASObject *gameScore, NSError *error) {
    // Now let's update it with some new data. In this case only cheatMode and score
	// will get sent to the cloud, playerName hasn't changed.
	gameScore[@"cheatMode"] = @YES;
	gameScore[@"score"] = @3539;
   [LASDataManager saveObjectInBackground:gameScore block:nil];
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

The client automatically figures out which data has changed so only "dirty" fields will be sent to LAS. You don't need to worry about squashing data that you didn't intend to update.

#### Counters

The above example contains a common use case. The "score" field is a counter that we'll need to continually update with the player's latest score. Using the above method works but it's cumbersome and can lead to problems if you have multiple clients trying to update the same counter.

To help with storing counter-type data, LAS provides methods that atomically increment (or decrement) any number field. So, the same update can be rewritten as:

```objective_c
[gameScore incrementKey:@"score"];
[LASDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can also increment by any amount using `incrementKey:byAmount:`.

#### Arrays

To help with storing array data, there are three operations that can be used to atomically change an array field:

- `addObject:forKey:` and `addObjectsFromArray:forKey:` append the given objects to the end of an array field.
- `addUniqueObject:forKey:` and `addUniqueObjectsFromArray:forKey:` add only the given objects which aren't already contained in an array field to that field. The position of the insert is not guaranteed.
- `removeObject:forKey:` and `removeObjectsInArray:forKey:` remove all instances of each given object from an array field.

For example, we can add items to the set-like "skills" field like so:

```objective_c
[gameScore addUniqueObjectsFromArray:@[@"flying", @"kungfu"] forKey:@"skills"];
[LASDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Note that it is not currently possible to atomically add and remove items from an array in the same save. You will have to call save in between every different kind of array operation.

### Deleting Objects

To delete an object from the cloud:

```objective_c
[LASDataManager deleteObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can delete a single field from an object with the `removeObjectForKey:` method:

```objective_c
// After this, the playerName field will be empty
[gameScore removeObjectForKey:@"playerName"];
// Saves the field deletion to the LAS
[LASDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

### Relational Data

Objects can have relationships with other objects. To model this behavior, any `LASObject` can be used as a value in other `LASObject`s. Internally, the LAS framework will store the referred-to object in just one place, to maintain consistency.

For example, each `Comment` in a blogging app might correspond to one `Post`. To create a new `Post` with a single `Comment`, you could write:

```objective_c
// Create the post
LASObject *myPost = [LASObject objectWithClassName:@"Post"];
myPost[@"title"] = @"I'm Hungry";
myPost[@"content"] = @"Where should we go for lunch?";
// Create the comment
LASObject *myComment = [LASObject objectWithClassName:@"Comment"];
myComment[@"content"] = @"Let's do Sushirrito.";
// Add a relation between the Post and Comment
myComment[@"parent"] = myPost;
// This will save both myPost and myComment
[LASDataManager saveObjectInBackground:myComment block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can also link objects using just their `objectId`s like so:

```objective_c
// Add a relation between the Post with objectId "1zEcyElZ80" and the comment
myComment[@"parent"] = [LASObject objectWithoutDataWithClassName:@"Post" objectId:@"1zEcyElZ80"];
```

By default, when fetching an object, related `LASObject`s are not fetched. These objects' values cannot be retrieved until they have been fetched like so:

```objective_c
LASObject *post = fetchedComment[@"parent"];
[LASDataManager fetchDataOfObjectIfNeededInBackground:post block:^(LASObject *object, NSError *error) {
    NSString *title = post[@"title"];
    // do something with your title variable
}];
```

You can also model a many-to-many relation using the `LASRelation` object. This works similar to an `NSArray` of `LASObject`s, except that you don't need to download all the Objects in a relation at once. This allows `LASRelation` to scale to many more objects than the `NSArray` of `LASObject` approach. For example, a `User` may have many `Posts` that they might like. In this case, you can store the set of `Posts` that a `User` likes using `relationForKey:`. In order to add a post to the list, the code would look something like:

```objective_c
LASUser *user = [LASUser currentUser];
LASRelation *relation = [user relationForKey:@"likes"];
[relation addObject:post];
[LASDataManager saveObjectInBackground:user block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can remove a post from the `LASRelation` with something like:

```objective_c
[relation removeObject:post];
```

By default, the list of objects in this relation are not downloaded. You can get the list of `Posts` by using calling `[LASQueryManager findObjectsInBackgroundWithQuery:block:]` with a `LASQuery` returned by `query`. The code would look like:

```objective_c
LASQuery *query = [relation query];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (error) {
        // There was an error
    } else {
        // objects has all the Posts the current user liked.
    }
}];
```

If you want only a subset of the `Posts` you can add extra constraints to the `LASQuery` returned by query like this:

```objective_c
LASQuery *query = [relation query];
[query whereKey:@"title" hasSuffix:@"We"];
// Add other query constraints.
```

For more details on `LASQuery` please look at the query portion of this guide. A `LASRelation` behaves similar to an `NSArray` of `LASObject`, so any queries you can do on arrays of objects (other than `includeKey:`) you can do on `LASRelation`.

### Data Types

So far we've used values with type `NSString`, `NSNumber`, and `LASObject`. LAS also supports `NSDate`, `NSData`, and `NSNull`.

You can nest `NSDictionary` and `NSArray` objects to store more structured data within a single `LASObject`.

Some examples:

```objective_c
NSNumber *number = @42;
NSString *string = [NSString stringWithFormat:@"the number is %@", number];
NSDate *date = [NSDate date];
NSData *data = [@"foo" dataUsingEncoding:NSUTF8StringEncoding];
NSArray *array = @[string, number];
NSDictionary *dictionary = @{@"number": number,
                             @"string": string};

NSNull *null = [NSNull null];

LASObject *bigObject = [LASObject objectWithClassName:@"BigObject"];
bigObject[@"myNumber"] = number;
bigObject[@"myString"] = string;
bigObject[@"myDate"] = date;
bigObject[@"myData"] = data;
bigObject[@"myArray"] = array;
bigObject[@"myDictionary"] = dictionary;
bigObject[@"myNull"] = null;
[LASDataManager saveObjectInBackground:bigObject block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

We do not recommend storing large pieces of binary data like images or documents using `NSData` fields on `LASObject`. `LASObject`s should not exceed 128 kilobytes in size. To store more, we recommend you use `LASFile` or `LASPrivateFile`. 

For more information about how LAS handles data, check out our documentation on *Data&Security*.

### Subclasses

LAS is designed to get you up and running as quickly as possible. You can access all of your data using the `LASObject` class and access any field with `objectForKey:` or the `[]` subscripting operator. In mature codebases, subclasses have many advantages, including terseness, extensibility, and support for autocomplete. Subclassing is completely optional, but can transform this code:

```objective_c
LASObject *shield = [LASObject objectWithClassName:@"Armor"];
shield[@"displayName"] = @"Wooden Shield";
shield[@"fireProof"] = @NO;
shield[@"rupees"] = @50;
```

Into this:

```objective_c
Armor *shield = [Armor object];
shield.displayName = @"Wooden Shield";
shield.fireProof = NO;
shield.rupees = 50;
```

### Subclassing LASObject

To create a `LASObject` subclass:

1. Declare a subclass which conforms to the `LASSubclassing` protocol.
2. Implement the class method `lasClassName`. This is the string you would pass to `initWithClassName:` and makes all future class name references unnecessary. Note: It must return '_User' in subclasses of LASUser and '_Passport' in subclasses of LASPassport.
3. Import `LASObject+Subclass.h` in your .m file. This implements all methods in `LASSubclassing` beyond `lasClassName`.
4. Call `[YourClass registerSubclass]` before `[LAS setApplicationId:clientKey:]`. An easy way to do this is with your class [+load][+load api reference](Obj-C only) or with [+initialize][+initialize api reference](both Obj-C and Swift) methods.


The following code sucessfully declares, implements, and registers the `Armor` subclass of `LASObject`:

```objective_c
// Armor.h
@interface Armor : LASObject<LASSubclassing>
+ (NSString *)lasClassName;
@end

// Armor.m
// Import this header to let Armor know that LASObject privately provides most
// of the methods for LASSubclassing.
#import <LAS/LASObject+Subclass.h>
@implementation Armor
+ (void)load {
    [self registerSubclass];
}
+ (NSString *)lasClassName {
    return @"Armor";
}
@end
```

### Properties & Methods

Adding custom properties and methods to your `LASObject` subclass helps encapsulate logic about the class. With `LASSubclassing`, you can keep all your logic about a subject in one place rather than using separate classes for business logic and storage/transmission logic.

`LASObject` supports dynamic synthesizers just like `NSManagedObject`. Declare a property as you normally would, but use `@dynamic` rather than `@synthesize` in your .m file. The following example creates a `displayName` property in the `Armor` class:

```objective_c
// Armor.h
@interface Armor : LASObject<LASSubclassing>
+ (NSString *)lasClassName;
@property (retain) NSString *displayName;
@end

// Armor.m
@dynamic displayName;
```

You can access the `displayName` property using `armor.displayName` or `[armor displayName]` and assign to it using `armor.displayName = @"Wooden Shield"` or `[armor setDisplayName:@"Wooden Sword"]`. Dynamic properties allow Xcode to provide autocomplete and catch typos.

`NSNumber` properties can be implemented either as `NSNumber`s or as their primitive counterparts. Consider the following example:

```objective_c
@property BOOL fireProof;
@property int rupees;
```

In this case, `game[@"fireProof"]` will return an `NSNumber` which is accessed using `boolValue` and `game[@"rupees"]` will return an `NSNumber` which is accessed using `intValue`, but the `fireProof` property is an actual `BOOL` and the rupees property is an actual int. The dynamic getter will automatically extract the `BOOL` or `int` value and the dynamic setter will automatically wrap the value in an `NSNumber`. You are free to use either format. Primitive property types are easier to use but `NSNumber` property types support nil values more clearly.

If you need more complicated logic than simple property access, you can declare your own methods as well:

```objective_c
@dynamic iconFile;

- (UIImageView *)iconView {
    LASImageView *view = [[LASImageView alloc] initWithImage:kPlaceholderImage];
    view.file = self.iconFile;
    [view loadInBackground];
    return view;
}
```

### Initializing Subclasses

You should create new objects with the `object` class method. This constructs an autoreleased instance of your type and correctly handles further subclassing. To create a reference to an existing object, use `objectWithoutDataWithObjectId:`.

## Queries

We've already seen how `LASQueryManager` with `getObjectInBackgroundWithClass:objectId:block:` can retrieve a single `LASObject` from LAS. There are many other ways to retrieve data with `LASQuery` - you can retrieve many objects at once, put conditions on the objects you wish to retrieve, cache queries automatically to avoid writing that code yourself, and more.

### Basic Queries

In many cases, `getObjectInBackgroundWithClass:objectId:block:` isn't powerful enough to specify which objects you want to retrieve. The `LASQueryManager` offers different ways to retrieve a list of objects rather than just a single object.

The general pattern is to create a `LASQuery`, put conditions on it, and then retrieve a `NSArray` of matching `LASObject`s using `[LASQueryManager findObjectsInBackgroundWithQuery:block:]`. For example, to retrieve scores with a particular playerName, use the `whereKey:equalTo:` method to constrain the value for a key.

```objective_c
LASQuery *query = [LASQuery queryWithClassName:@"GameScore"];
[query whereKey:@"playerName" equalTo:@"Dan Stemkoski"];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (!error) {
        // The find succeeded.
        NSLog(@"Successfully retrieved %d scores.", objects.count);
        // Do something with the found objects
        for (LASObject *object in objects) {
            NSLog(@"%@", object.objectId);
        }
    } else {
        // Log details of the failure
        NSLog(@"Error: %@ %@", error, [error userInfo]);
    }
}];
```

`[LASQueryManager findObjectsInBackgroundWithQuery:block:]` works in that it assures the network request is done without blocking, and runs the block in the main thread.

### Specifying Constraints with NSPredicate

To get the most out of `LASQuery` we recommend using its methods listed below to add constraints. However, if you prefer using `NSPredicate`, a subset of the constraints can be specified by providing an `NSPredicate` when creating your `LASQuery`.

```objective_c
NSPredicate *predicate = [NSPredicate predicateWithFormat:
@"playerName = 'Dan Stemkosk'"];
LASQuery *query = [LASQuery queryWithClassName:@"GameScore" predicate:predicate];
```

These features are supported:

- Simple comparisons such as `=`, `!=`, `<`, `>`, `<=`, `>=`, and `BETWEEN` with a key and a constant.
- Regular expressions, such as `LIKE`, `MATCHES`, `CONTAINS`, or `ENDSWITH`.
- Containment predicates, such as `x IN {1, 2, 3}`.
- Key-existence predicates, such as `x IN SELF`.
- `BEGINSWITH` expressions.
- Compound predicates with `AND`, `OR`, and `NOT`.
- Sub-queries with `"key IN %@", subquery`.

The following types of predicates are not supported:

- Aggregate operations, such as `ANY`, `SOME`, `ALL`, or `NONE`.
- Predicates comparing one key to another.
- Complex predicates with many `OR`ed clauses.

### Query Constraints

There are several ways to put constraints on the objects found by a `LASQuery`. You can filter out objects with a particular key-value pair with `whereKey:notEqualTo:`

```objective_c
[query whereKey:@"playerName" notEqualTo:@"Michael Yabuti"];
```

You can give multiple constraints, and objects will only be in the results if they match all of the constraints. In other words, it's like an AND of constraints.

```objective_c
[query whereKey:@"playerName" notEqualTo:@"Michael Yabuti"];
[query whereKey:@"playerAge" greaterThan:@18];
```

You can limit the number of results by setting `limit`. By default, results are limited to 100, but anything from 1 to 1000 is a valid limit:

```objective_c
query.limit = 10; // limit to at most 10 results
```

If you want exactly one result, a more convenient alternative may be to use `[LASQueryManager getFirstObjectInBackgroundWithQuery:block:]` instead of using `[LASQueryManager findObjectsInBackgroundWithQuery:block:]`.

```objective_c
LASQuery *query = [LASQuery queryWithClassName:@"GameScore"];
[query whereKey:@"playerEmail" equalTo:@"dstemkoski@example.com"];
[LASQueryManager getFirstObjectInBackgroundWithQuery:query block:^(LASObject *object, NSError *error) {
    if (!object) {
        NSLog(@"The getFirstObject request failed.");
    } else {
        // The find succeeded.
        NSLog(@"Successfully retrieved the object.");
    }
}];
```

You can skip the first results by setting `skip`. This can be useful for pagination:

```objective_c
query.skip = 10; // skip the first 10 results
```

For sortable types like numbers and strings, you can control the order in which results are returned:

```objective_c
// Sorts the results in ascending order by the score field
[query orderByAscending:@"score"];
// Sorts the results in descending order by the score field
[query orderByDescending:@"score"];
```

You can add more sort keys to the query as follows:

```objective_c
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
[query addAscendingOrder:@"score"];
// Sorts the results in descending order by the score field if the previous sort keys are equal.
[query addDescendingOrder:@"score"];
```

For sortable types, you can also use comparisons in queries:

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

If you want to retrieve objects matching several different values, you can use `whereKey:containedIn:`, providing an array of acceptable values. This is often useful to replace multiple queries with a single query. For example, if you want to retrieve scores made by any player in a particular list:

```objective_c
// Finds scores from any of Jonathan, Dario, or Shawn
NSArray *names = @[@"Jonathan Walsh",
@"Dario Wunsch",
@"Shawn Simon"];
[query whereKey:@"playerName" containedIn:names];
```

If you want to retrieve objects that do not match any of several values you can use `whereKey:notContainedIn:`, providing an array of acceptable values. For example, if you want to retrieve scores from players besides those in a list:

```objective_c
// Finds scores from anyone who is neither Jonathan, Dario, nor Shawn
NSArray *names = @[@"Jonathan Walsh",
@"Dario Wunsch",
@"Shawn Simon"];
[query whereKey:@"playerName" notContainedIn:names];
```

If you want to retrieve objects that have a particular key set, you can use `whereKeyExists`. Conversely, if you want to retrieve objects without a particular key set, you can use `whereKeyDoesNotExist`.

```objective_c
// Finds objects that have the score set
[query whereKeyExists:@"score"];
// Finds objects that don't have the score set
[query whereKeyDoesNotExist:@"score"];
```

You can use the `whereKey:matchesKey:inQuery:` method to get objects where a key matches the value of a key in a set of objects resulting from another query. For example, if you have a class containing sports teams and you store a user's hometown in the user class, you can issue one query to find the list of users whose hometown teams have winning records. The query would look like:

```objective_c
LASQuery *teamQuery = [LASQuery queryWithClassName:@"Team"];
[teamQuery whereKey:@"winPct" greaterThan:@(0.5)];
LASQuery *userQuery = [LASUser query];
[userQuery whereKey:@"hometown" matchesKey:@"city" inQuery:teamQuery];
[LASQueryManager findObjectsInBackgroundWithQuery:userQuery block:^(NSArray *objects, NSError *error) {
    // results will contain users with a hometown team with a winning record
}];
```

Conversely, to get objects where a key does not match the value of a key in a set of objects resulting from another query, use `whereKey:doesNotMatchKey:inQuery:`. For example, to find users whose hometown teams have losing records:

```objective_c
LASQuery *losingUserQuery = [LASUser query];
[losingUserQuery whereKey:@"hometown" doesNotMatchKey:@"city" inQuery:teamQuery];
[LASQueryManager findObjectsInBackgroundWithQuery:losingUserQuery block:^(NSArray *objects, NSError *error) {
    // results will contain users with a hometown team with a losing record
}];
```

You can restrict the fields returned by calling `selectKeys:` with an `NSArray` of keys. To retrieve documents that contain only the `score` and `playerName` fields (and also special built-in fields such as `objectId`, `createdAt`, and `updatedAt`):

```objective_c
LASQuery *query = [LASQuery queryWithClassName:@"GameScore"];
[query selectKeys:@[@"playerName", @"score"]];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // objects in results will only contain the playerName and score fields
}];
```

The remaining fields can be fetched later by calling one of the `[LASDataManager fetchDataOfObjectIfNeededInBackground:block:]` variants on the returned objects:

```objective_c
LASObject *object = (LASObject*)results[0];
[LASDataManager fetchDataOfObjectIfNeededInBackground:object block:^(LASObject *object, NSError *error) {
    // all fields of the object will now be available here.
}];
```

### Queries on Array Values

For keys with an array type, you can find objects where the key's array value contains 2 by:

```objective_c
// Find objects where the array in arrayKey contains 2.
[query whereKey:@"arrayKey" equalTo:@2];
```

You can also find objects where the key's array value contains each of the values 2, 3, and 4 with the following:

```objective_c
// Find objects where the array in arrayKey contains each of the
// elements 2, 3, and 4.
[query whereKey:@"arrayKey" containsAllObjectsInArray:@[@2, @3, @4]];
```

### Queries on String Values

Use `whereKey:hasPrefix:` to restrict to string values that start with a particular string. Similar to a MySQL `LIKE` operator, this is indexed so it is efficient for large datasets:

```objective_c
// Finds barbecue sauces that start with "Big Daddy's".
LASQuery *query = [LASQuery queryWithClassName:@"BarbecueSauce"];
[query whereKey:@"name" hasPrefix:@"Big Daddy's"];
```

### Relational Queries

There are several ways to issue queries for relational data. If you want to retrieve objects where a field matches a particular `LASObject`, you can use `whereKey:equalTo:` just like for other data types. For example, if each `Comment` has a `Post` object in its `post` field, you can fetch comments for a particular `Post`:

```objective_c
// Assume LASObject *myPost was previously created.
LASQuery *query = [LASQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" equalTo:myPost];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for myPost
}];
```

You can also do relational queries by `objectId`:

```objective_c
[query whereKey:@"post"
equalTo:[LASObject objectWithoutDataWithClassName:@"Post" objectId:@"1zEcyElZ80"]];
```

If you want to retrieve objects where a field contains a `LASObject` that match a different query, you can use `whereKey:matchesQuery:`. Note that the default limit of 100 and maximum limit of 1000 apply to the inner query as well, so with large data sets you may need to construct queries carefully to get the desired behavior. In order to find comments for posts with images, you can do:

```objective_c
LASQuery *innerQuery = [LASQuery queryWithClassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
LASQuery *query = [LASQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" matchesQuery:innerQuery];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts with images
}];
```

If you want to retrieve objects where a field contains a `LASObject` that does not match a different query, you can use `whereKey:doesNotMatchQuery:`. In order to find comments for posts without images, you can do:

```objective_c
LASQuery *innerQuery = [LASQuery queryWithClassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
LASQuery *query = [LASQuery queryWithClassName:@"Comment"];
[query whereKey:@"post" doesNotMatchQuery:innerQuery];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts without images
}];
```

In some situations, you want to return multiple types of related objects in one query. You can do this with the `includeKey:` method. For example, let's say you are retrieving the last ten comments, and you want to retrieve their related posts at the same time:

```objective_c
LASQuery *query = [LASQuery queryWithClassName:@"Comment"];
// Retrieve the most recent ones
[query orderByDescending:@"createdAt"];
// Only retrieve the last ten
query.limit = 10;
// Include the post data with each comment
[query includeKey:@"post"];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *comments, NSError *error) {
    // Comments now contains the last ten comments, and the "post" field
    // has been populated. For example:
    for (LASObject *comment in comments) {
        // This does not require a network access.
        LASObject *post = comment[@"post"];
        NSLog(@"retrieved related post: %@", post);
    }
}];
```

You can also do multi level includes using dot notation. If you wanted to include the post for a comment and the post's author as well you can do:

```objective_c
[query includeKey:@"post.author"];
```

You can issue a query with multiple fields included by calling `includeKey:` multiple times. This functionality also works with `LASQuery` helpers like `[LASQueryManager getFirstObjectInBackgroundWithQuery:block:]` and `[LASQueryManager getObjectInBackgroundWithClass:objectId:block:]`


### Counting Objects

Count queries can return inaccurate results for classes with more than 1,000 objects. If you just need to count how many objects match a query, but you do not need to retrieve the objects that match, you can use `[LASQueryManager countObjectsInBackgroundWithQuery:block:]` instead of `[LASQueryManager findObjectsInBackgroundWithQuery:block:]`. For example, to count how many games have been played by a particular player:

```objective_c
LASQuery *query = [LASQuery queryWithClassName:@"GameScore"];
[query whereKey:@"playername" equalTo:@"Sean Plott"];
[LASQueryManager countObjectsInBackgroundWithQuery:query block:^(int count, NSError *error) {
    if (!error) {
        // The count request succeeded. Log the count
        NSLog(@"Sean has played %d games", count);
    } else {
        // The request failed
    }
}];
```

For classes with over 1,000 objects, count operations are limited by timeouts. They may routinely yield timeout errors or return results that are only approximately correct. Thus, it is preferable to architect your application to avoid this sort of count operation.

### Compound Queries

If you want to find objects that match one of several queries, you can use `orQueryWithSubqueries:` method. For instance, if you want to find players with either have a lot of wins or a few wins, you can do:

```objective_c
LASQuery *lotsOfWins = [LASQuery queryWithClassName:@"Player"];
[lotsOfWins whereKey:@"wins" greaterThan:@150];
LASQuery *fewWins = [LASQuery queryWithClassName:@"Player"];
[fewWins whereKey:@"wins" lessThan:@5];
LASQuery *query = [LASQuery orQueryWithSubqueries:@[fewWins,lotsOfWins]];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // results contains players with lots of wins or only a few wins.
}];
```

You can add additional constraints to the newly created `LASQuery` that act as an 'and' operator.

Note that we do not, however, support non-filtering constraints (e.g. `limit`, `skip`, `orderBy...:`, `includeKey:`) in the subqueries of the compound query.

### Subclass Queries

You can get a query for objects of a particular subclass using the class method `query`. The following example queries for armors that the user can afford:

```objective_c
LASQuery *query = [Armor query];
[query whereKey:@"rupees" lessThanOrEqualTo:LASUser.currentUser.rupees];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (!error) {
        Armor *firstArmor = objects[0];
        // ...
    }
}];
```

## Users

At the core of many apps, there is a notion of user accounts that lets users access their information in a secure manner. We provide a specialized user class called `LASUser` that automatically handles much of the functionality required for user account management.

With this class, you'll be able to add user account functionality in your app.

`LASUser` is a subclass of `LASObject` and has all the same features, such as flexible schema, and a key value interface. All the methods that are on `LASObject` also exist in `LASUser`. The difference is that `LASUser` has some special additions specific to user accounts.

### Properties

`LASUser` has several properties that set it apart from `LASObject`:

- `username`: The username for the user (required).
- `password`: The password for the user (required on signup).
- `email`: The email address for the user (optional).

We'll go through each of these in detail as we run through the various use cases for users. Keep in mind that if you set `username` and `email` through these properties, you do not need to set it using the `setObject:forKey:` method — this is set for you automatically.

### Signing Up

The first thing your app will do is probably ask the user to sign up. The following code illustrates a typical sign up:

```objective_c
- (void)myMethod {
    LASUser *user = [LASUser user];
    user.username = @"my name";
    user.password = @"my pass";
    user.email = @"email@example.com";
    // other fields can be set just like with LASObject
    user[@"phone"] = @"415-392-0202";
    [LASUserManager signUpInBackground:user block:^(BOOL succeeded, NSError *error) {
        if (!error) {
            // Hooray! Let them use the app now.
        } else {
            NSString *errorString = [error userInfo][@"error"];
            // Show the errorString somewhere and let the user try again.
        }
    }];
}
```

This call will asynchronously create a new user in your LAS App. Before it does this, it also checks to make sure that both the `username` and `email` are unique. Also, it securely hashes the `password` in the cloud. We never store passwords in plaintext, nor will we ever transmit passwords back to the client in plaintext.

Note that we used the `+[LASUserManager signUpInBackground:block:]` method, not the `+[LASDataManager saveObjectInBackground:block:]` method. New `LASUser`s should always be created using the `+[LASUserManager signUpInBackground:block:]` method. Subsequent updates to a user can be done by calling `+[LASDataManager saveObjectInBackground:block:]`.

If a signup isn't successful, you should read the error object that is returned. The most likely case is that the username or email has already been taken by another user. You should clearly communicate this to your users, and ask them try a different username.

You are free to use an email address as the username. Simply ask your users to enter their email, but fill it in the username property — `LASUser` will work as normal. We'll go over how this is handled in the *reset password* section.

### Logging In

Of course, after you allow users to sign up, you need to let them log in to their account in the future. To do this, you can use the class method `+[LASUserManager logInWithUsernameInBackground:password:block:]`.

```objective_c
[LASUserManager logInWithUsernameInBackground:@"myname" password:@"mypass" block:^(LASUser *user, NSError *error) {
    if (user) {
        // Do stuff after successful login.
    } else {
        // The login failed. Check error to see why.
    }
}];
```

### Verifying Emails

Enabling email verification in an application's settings allows the application to reserve part of its experience for users with confirmed email addresses. Email verification adds the `emailVerified` key to the `LASUser` object. When a `LASUser`'s `email` is set or modified, `emailVerified` is set to false. LAS then emails the user a link which will set `emailVerified` to `true`.

There are three `emailVerified` states to consider:

1. `true` - the user confirmed his or her email address by clicking on the link LAS emailed them. `LASUser`s can never have a `true` value when the user account is first created.
2. `false` - at the time the `LASUser` object was last refreshed, the user had not confirmed his or her email address. If `emailVerified` is `false`, consider calling `+[LASDataManager fetchDataOfObjectInBackground:block:]` and passing the `LASUser` as the first argument.
3. missing - the `LASUser` was created when email verification was off or the `LASUser` does not have an `email`.

### Current User

It would be bothersome if the user had to log in every time they open your app. You can avoid this by using the cached `currentUser` object.

Whenever you use any signup or login methods, the user is cached on disk. You can treat this cache as a session, and automatically assume the user is logged in:

```objective_c
LASUser *currentUser = [LASUser currentUser];
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login screen
}
```

You can clear the current user by logging them out:

```objective_c
[LASUserManager logOut];
LASUser *currentUser = [LASUser currentUser]; // this will now be nil
```

### Anonymous Users

Being able to associate data and objects with individual users is highly valuable, but sometimes you want to be able to do this without forcing a user to specify a username and password.

An anonymous user is a user that can be created without a username and password but still has all of the same capabilities as any other `LASUser`. After logging out, an anonymous user is abandoned, and its data is no longer accessible.

You can create an anonymous user using `LASAnonymousUtils`:

```objective_c
[LASAnonymousUtils logInWithBlock:^(LASUser *user, NSError *error) {
    if (error) {
        NSLog(@"Anonymous login failed.");
    } else {
        NSLog(@"Anonymous user logged in.");
    }
}];
```

You can convert an anonymous user into a regular user by setting the username and password, then calling `+[LASUserManager signUpInBackground:block:]`, or by logging in or linking with a service like *Facebook* or *Twitter*. The converted user will retain all of its data. To determine whether the current user is an anonymous user, you can check `[LASAnonymousUtils isLinkedWithUser:]`

```objective_c
if ([LASAnonymousUtils isLinkedWithUser:[LASUser currentUser]]) {
    // current user is anonymous
} else {
    // current user is regular
}
```

Anonymous users can also be automatically created for you without requiring a network request, so that you can begin working with your user immediately when your application starts. When you enable automatic anonymous user creation at application startup, `[LASUser currentUser]` will never be `nil`. The user will automatically be created in the cloud the first time the user or any object with a relation to the user is saved. Until that point, the user's object ID will be `nil`. Enabling automatic user creation makes associating data with your users painless. For example, in your `application:didFinishLaunchingWithOptions:` function, you might write:

```objective_c
[LASUser enableAutomaticUser];
[[LASUser currentUser] incrementKey:@"RunCount"];
[LASDataManager saveObjectInBackground:[LASUser currentUser] block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

### Setting the Current User

If you’ve created your own authentication routines, or otherwise logged in a user on the server side, you can now pass the session token to the client and use the `becomeInBackgroundWithSessionToken:block:` method. This method will ensure the session token is valid before setting the current user.

```objective_c
[LASUserManager becomeInBackgroundWithSessionToken:@"session-token-here" block:^(LASUser *user, NSError *error) {
    if (error) {
        // The token could not be validated.
    } else {
        // The current user is now set to user.
    }
}];
```

### Security For User Objects

The `LASUser` class is secured by default. Data stored in a `LASUser` can only be modified by that user. By default, the data can still be read by any client. Thus, some `LASUser` objects are authenticated and can be modified, whereas others are read-only.

Specifically, you are not able to invoke any of the save or delete methods unless the `LASUser` was obtained using an authenticated method, like `+[LASUserManager logInWithUsernameInBackground:password:block:]` or `+[LASUserManager signUpInBackground:block:]`. This ensures that only the user can alter their own data.

The following illustrates this security policy:

```objective_c
[LASUserManager logInWithUsernameInBackground:@"my_username" password:@"my_password" block:^(LASUser *user, NSError *error) {
    if (user) {
        
        user.username = @"my_new_username"; // attempt to change username
        [LASDataManager saveObjectInBackground:user block:^(BOOL succeeded, NSError *error) {
            if (succeeded) {
                
            }
        }];
    }
}];

// Get the user from a non-authenticated method
LASQuery *query = [LASUser query];
[LASUserManager getUserObjectWithId:@"userId" block:^(LASUser *userAgain, NSError *error) {
    
    userAgain.username = @"another_username";
    
    // This will throw an exception, since the LASUser is not authenticated
    [LASDataManager saveObjectInBackground:userAgain block:^(BOOL succeeded, NSError *error) {
        
    }];
}];
```

The `LASUser` obtained from `currentUser` will always be authenticated.

If you need to check if a `LASUser` is authenticated, you can invoke the `isAuthenticated` method. You do not need to check `isAuthenticated` with `LASUser` objects that are obtained via an authenticated method.

### Security For Other Objects

The same security model that applies to the `LASUser` can be applied to other objects. For any object, you can specify which users are allowed to read the object, and which users are allowed to modify an object. To support this type of security, each object has an [access control list][access control list], implemented by the `LASACL` class.

The simplest way to use a `LASACL` is to specify that an object may only be read or written by a single user. To create such an object, there must first be a logged in `LASUser`. Then, the `ACLWithUser` method generates a `LASACL` that limits access to that user. An object's ACL is updated when the object is saved, like any other property. Thus, to create a private note that can only be accessed by the current user:

```objective_c
LASObject *privateNote = [LASObject objectWithClassName:@"Note"];
privateNote[@"content"] = @"This note is private!";
privateNote.ACL = [LASACL ACLWithUser:[LASUser currentUser]];
[LASDataManager saveObjectInBackground:privateNote block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

This note will then only be accessible to the current user, although it will be accessible to any device where that user is signed in. This functionality is useful for applications where you want to enable access to user data across multiple devices, like a personal todo list.

Permissions can also be granted on a per-user basis. You can add permissions individually to a `LASACL` using `setReadAccess:forUser:` and `setWriteAccess:forUser:`. For example, let's say you have a message that will be sent to a group of several users, where each of them have the rights to read and delete that message:

```objective_c
LASObject *groupMessage = [LASObject objectWithClassName:@"Message"];
LASACL *groupACL = [LASACL ACL];

// userList is an NSArray with the users we are sending this message to.
for (LASUser *user in userList) {
    [groupACL setReadAccess:YES forUser:user];
    [groupACL setWriteAccess:YES forUser:user];
}

groupMessage.ACL = groupACL;
[LASDataManager saveObjectInBackground:groupMessage block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can also grant permissions to all users at once using `setPublicReadAccess:` and `setPublicWriteAccess:`. This allows patterns like posting comments on a message board. For example, to create a post that can only be edited by its author, but can be read by anyone:

```objective_c
LASObject *publicPost = [LASObject objectWithClassName:@"Post"];
LASACL *postACL = [LASACL ACLWithUser:[LASUser currentUser]];
[postACL setPublicReadAccess:YES];
publicPost.ACL = postACL;
[LASDataManager saveObjectInBackground:publicPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

To help ensure that your users' data is secure by default, you can set a default ACL to be applied to all newly-created `LASObject`s:

```objective_c
[LASACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

In the code above, the second parameter to `setDefaultACL` tells LAS to ensure that the default ACL assigned at the time of object creation allows read and write access to the current user at that time. Without this setting, you would need to reset the defaultACL every time a user logs in or out so that the current user would be granted access appropriately. With this setting, you can ignore changes to the current user until you explicitly need to grant different kinds of access.

Default ACLs make it easy to create apps that follow common access patterns. An application like Twitter, for example, where user content is generally visible to the world, might set a default ACL such as:

```objective_c
LASACL *defaultACL = [LASACL ACL];
[defaultACL setPublicReadAccess:YES];
[LASACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

For an app like Dropbox, where a user's data is only accessible by the user itself unless explicit permission is given, you would provide a default ACL where only the current user is given access:

```objective_c
[LASACL setDefaultACL:[LASACL ACL] withAccessForCurrentUser:YES];
```

For an application that logs data to LAS but doesn't provide any user access to that data, you would deny access to the current user while providing a restrictive ACL:

```objective_c
[LASACL setDefaultACL:[LASACL ACL] withAccessForCurrentUser:NO];
```

Operations that are forbidden, such as deleting an object that you do not have write access to, result in a `kLASErrorObjectNotFound` error code. For security purposes, this prevents clients from distinguishing which object ids exist but are secured, versus which object ids do not exist at all.

### Resetting Passwords

It's a fact that as soon as you introduce passwords into a system, users will forget them. In such cases, our library provides a way to let them securely reset their password.

To kick off the password reset flow, ask the user for their email address, and call:

```objective_c
[LASUserManager requestPasswordResetForEmailInBackground:@"email@example.com"];
```

This will attempt to match the given email with the user's email or username field, and will send them a password reset email. By doing this, you can opt to have users use their email as their username, or you can collect it separately and store it in the email field.

The flow for password reset is as follows:

1. User requests that their password be reset by typing in their email.
2. LAS sends an email to their address, with a special password reset link.
3. User clicks on the reset link, and is directed to a special LAS page that will allow them type in a new password.
4. User types in a new password. Their password has now been reset to a value they specify.

Note that the messaging in this flow will reference your app by the name that you specified when you created this app on LAS.

### Querying

To query for users, you need to use the special user query:

```objective_c
LASQuery *query = [LASUser query];
[query whereKey:@"gender" equalTo:@"female"]; // find all the women
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *girls, NSError *error) {
    NSLog(@"%@", girls);
}];
```

In addition, you can use `+[LASUserManager getUserObjectWithId:block:]` to get a `LASUser` by id.

### Associations

Associations involving a `LASUser` work right out of the box. For example, let's say you're making a blogging app. To store a new post for a user and retrieve all their posts:

```objective_c
LASUser *user = [LASUser currentUser];
// Make a new post
LASObject *post = [LASObject objectWithClassName:@"Post"];
post[@"title"] = @"My New Post";
post[@"body"] = @"This is some great content.";
post[@"user"] = user;
[LASDataManager saveObjectInBackground:post block:^(BOOL succeeded, NSError *error) {
    
    if (succeeded) {
        
        // Find all posts by the current user
        LASQuery *query = [LASQuery queryWithClassName:@"Post"];
        [query whereKey:@"user" equalTo:user];
        [LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *usersPosts, NSError *error) {
            NSLog(@"%@", usersPosts);
        }];
    }
}];
```

### Facebook Users

LAS provides an easy way to integrate Facebook with your application. The Facebook SDK can be used with our SDK, and is integrated with the `LASUser` class to make linking your users to their Facebook identities easy.

Using our Facebook integration, you can associate an authenticated Facebook user with a `LASUser`. With just a few lines of code, you'll be able to provide a "log in with Facebook" option in your app, and be able to save the user's data to LAS.

**Note:** LAS SDK is compatible both with Facebook SDK 3.x and 4.x for iOS. These instructions are for Facebook SDK 4.x.

#### Setup

To start using Facebook with LAS, you need to:

1. Set up a Facebook app, if you haven't already.
2. Add your application's Facebook Application ID on your LAS application's settings page.
3. Follow Facebook's instructions for getting started with the Facebook SDK to create an app linked to the Facebook SDK. Double-check that you have added FacebookAppID and URL Scheme values to your application's .plist file.
4. Download and unzip LAS iOS SDK, if you haven't already.
5. Add `LASFacebookUtils.framework` to your Xcode project, by dragging it into your project folder target.

There's also two code changes you'll need to make. First, add the following to your `application:didFinishLaunchingWithOptions:` method, after you've initialized LAS SDK.

```objective_c
#import <LASFacebookUtils/LASFacebookUtils.h>

@implementation AppDelegate

- (void)application:(UIApplication *)application didFinishLaunchWithOptions:(NSDictionary *)options {
   	[LAS setApplicationId:@"lasAppId" clientKey:@"lasClientKey"];
   	[LASFacebookUtils initializeFacebook];
}

@end
```
	
Next, add the following handlers in your app delegate.

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

There are two main ways to use Facebook with your LAS users: (1) to log in (or sign up) as a Facebook user and creating a `LASUser`, or (2) linking Facebook to an existing `LASUser`.

#### Log In & Sign Up

`LASUser` provides a way to allow your users to log in or sign up through Facebook. This is done by using the `logInWithPermissions` method like so:

```objective_c
[LASFacebookUtils logInWithPermissions:permissions block:^(LASUser *user, NSError *error) {
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
3. Our SDK receives the Facebook data and saves it to a `LASUser`. If it's a new user based on the Facebook ID, then that user is created.
4. Your code block is called with the user.

The permissions argument is an array of strings that specifies what permissions your app requires from the Facebook user. These permissions must only include read permissions. The `LASUser` integration doesn't require any permissions to work out of the box. [Read more permissions on Facebook's developer guide][facebook permissions].

To acquire publishing permissions for a user so that your app can, for example, post status updates on their behalf, you must call `[LASFacebookUtils reauthorizeUser:withPublishPermissions:audience:block:]`

```objective_c
[LASFacebookUtils reauthorizeUser:[LASUser currentUser]
              withPublishPermissions:@[@"publish_actions"]
                            audience:FBSessionDefaultAudienceFriends
                               block:^(BOOL succeeded, NSError *error) {
                                   if (succeeded) {
                                       // Your app now has publishing permissions for the user
                                   }
                               }];
```

#### Linking

If you want to associate an existing `LASUser` to a Facebook account, you can link it like so:

```objective_c
if (![LASFacebookUtils isLinkedWithUser:user]) {
    [LASFacebookUtils linkUser:user permissions:nil block:^(BOOL succeeded, NSError *error) {
        if (succeeded) {
            NSLog(@"Woohoo, user logged in with Facebook!");
        }
    }];
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing `LASUser` is updated with the Facebook information. Future logins via Facebook will now log in the user to their existing account.

If you want to unlink Facebook from a user, simply do this:

```objective_c
[LASFacebookUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"The user is no longer associated with their Facebook account.");
    }
}];
```

#### Facebook SDK and LAS

The Facebook iOS SDK provides a number of helper classes for interacting with Facebook's API. Generally, you will use the `FBRequest` class to interact with Facebook on behalf of your logged-in user. [You can read more about the Facebook SDK here][facebook sdk reference].

Our library manages the user's `FBSession` object for you. You can simply call `[LASFacebookUtils session]` to access the session instance, which can then be passed to `FBRequest`s.

### Twitter Users

As with Facebook, LAS also provides an easy way to integrate Twitter authentication into your application. The LAS SDK provides a straightforward way to authorize and link a Twitter account to your `LASUser`s. With just a few lines of code, you'll be able to provide a "log in with Twitter" option in your app, and be able to save their data to LAS.

#### Setup

To start using Twitter with LAS, you need to:

1. [Set up a Twitter app][set up twitter app], if you haven't already.
2. Add your application's Twitter consumer key on your LAS application's settings page.
3. When asked to specify a "Callback URL" for your Twitter app, please insert a valid URL. This value will not be used by your iOS or Android application, but is necessary in order to enable authentication through Twitter.
4. Add the `Accounts.framework` and `Social.framework` libraries to your Xcode project.
5. Add the following where you initialize the LAS SDK, such as in `application:didFinishLaunchingWithOptions:`.

```objective_c
[LASTwitterUtils initializeWithConsumerKey:@"YOUR CONSUMER KEY"
consumerSecret:@"YOUR CONSUMER SECRET"];
```

If you encounter any issues that are Twitter-related, a good resource is the [official Twitter documentation][twitter documentation].

There are two main ways to use Twitter with your LAS users: (1) logging in as a Twitter user and creating a `LASUser`, or (2) linking Twitter to an existing `LASUser`.

#### Login & Signup

`LASTwitterUtils` provides a way to allow your `LASUser`s to log in or sign up through Twitter. This is accomplished using the `logInWithBlock:`  message:

```objective_c
[LASTwitterUtils logInWithBlock:^(LASUser *user, NSError *error) {
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
3. Our SDK receives the Twitter data and saves it to a `LASUser`. If it's a new user based on the Twitter handle, then that user is created.
4. Your `block` is called with the user.

#### Linking

If you want to associate an existing `LASUser` with a Twitter account, you can link it like so:

```objective_c
if (![LASTwitterUtils isLinkedWithUser:user]) {
    [LASTwitterUtils linkUser:user block:^(BOOL succeeded, NSError *error) {
        if ([LASTwitterUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user logged in with Twitter!");
        }
    }];
}
```

The steps that happen when linking are very similar to log in. The difference is that on successful login, the existing `LASUser` is updated with the Twitter information. Future logins via Twitter will now log the user into their existing account.

If you want to unlink Twitter from a user, simply do this:

```objective_c
[LASTwitterUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Twitter account.");
    }
}];
```

#### Twitter API Calls

Our SDK provides a straightforward way to sign your API HTTP requests to the [Twitter REST API][twitter rest api] when your app has a Twitter-linked `LASUser`. To make a request through our API, you can use the `LAS_Twitter` singleton provided by `LASTwitterUtils`:

```objective_c
NSURL *verify = [NSURL URLWithString:@"https://api.twitter.com/1/account/verify_credentials.json"];
NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:verify];
[[LASTwitterUtils twitter] signRequest:request];
NSURLResponse *response = nil;
NSError *error = nil;
NSData *data = [NSURLConnection sendSynchronousRequest:request
                                     returningResponse:&response
                                                 error:&error];
```

## Roles

As your app grows in scope and user-base, you may find yourself needing more coarse-grained control over access to pieces of your data than user-linked ACLs can provide. To address this requirement, LAS supports a form of [Role-based Access Control][role-based access control]. Roles provide a logical way of grouping users with common access privileges to your LAS data. Roles are named objects that contain users and other roles. Any permission granted to a role is implicitly granted to its users as well as to the users of any roles that it contains.

For example, in your application with curated content, you may have a number of users that are considered "Moderators" and can modify and delete content created by other users. You may also have a set of users that are "Administrators" and are allowed all of the same privileges as Moderators, but can also modify the global settings for the application. By adding users to these roles, you can ensure that new users can be made moderators or administrators, without having to manually grant permission to every resource for each user.

We provide a specialized class called `LASRole` that represents these role objects in your client code. `LASRole` is a subclass of `LASObject`, and has all of the same features, such as a flexible schema and a key value interface. All the methods that are on `LASObject` also exist on `LASRole`. The difference is that `LASRole` has some additions specific to management of roles.

### Properties

`LASRole` has several properties that set it apart from `LASObject`:

- name: The name for the role. This value is required, and can only be set once as a role is being created. The name must consist of alphanumeric characters, spaces, -, or _. This name will be used to identify the Role without needing its objectId. 
- users: A [relation](#relational-data) to the set of users that will inherit permissions granted to the containing role. 
- roles: A [relation](#relational-data) to the set of roles whose users and roles will inherit permissions granted to the containing role.

### Security for Role Objects

The `LASRole` uses the same security scheme (ACLs) as all other objects on LAS, except that it requires an ACL to be set explicitly. Generally, only users with greatly elevated privileges (e.g. a master user or Administrator) should be able to create or modify a Role, so you should define its ACLs accordingly. Remember, if you give write-access to a `LASRole` to a user, that user can add other users to the role, or even delete the role altogether.

To create a new `LASRole`, you would write:

```objective_c
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
LASACL *roleACL = [LASACL ACL];
[roleACL setPublicReadAccess:YES];
LASRole *role = [LASRole roleWithName:@"Administrator" acl:roleACL];
[LASDataManager saveObjectInBackground:role block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can add users and roles that should inherit your new role's permissions through the "users" and "roles" relations on `LASRole`:

```objective_c
LASRole *role = [LASRole roleWithName:roleName acl:roleACL];
for (LASUser *user in usersToAddToRole) {
    [role.users addObject:user];
}
for (LASRole *childRole in rolesToAddToRole) {
    [role.roles addObject:childRole];
}
[LASDataManager saveObjectInBackground:role block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Take great care when assigning ACLs to your roles so that they can only be modified by those who should have permissions to modify them.

### Security for Other Objects

Now that you have created a set of roles for use in your application, you can use them with ACLs to define the privileges that their users will receive. Each `LASObject` can specify a `LASACL`, which provides an access control list that indicates which users and roles should be granted read or write access to the object.

Giving a role read or write permission to an object is straightforward. You can either use the `LASRole`:

```objective_c
LASRole *moderators = /* Query for some LASRole */;
LASObject *wallPost = [LASObject objectWithClassName:@"WallPost"];
LASACL *postACL = [LASACL ACL];
[postACL setWriteAccess:YES forRole:moderators];
wallPost.ACL = postACL;
[LASDataManager saveObjectInBackground:wallPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

You can avoid querying for a role by specifying its name for the ACL:

```objective_c
LASObject *wallPost = [LASObject objectWithClassName:@"WallPost"];
LASACL *postACL = [LASACL ACL];
[postACL setWriteAccess:YES forRoleWithName:@"Moderators"];
wallPost.ACL = postACL;
[LASDataManager saveObjectInBackground:wallPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Role-based `LASACL`s can also be used when specifying default ACLs for your application, making it easy to protect your users' data while granting access to users with additional privileges. For example, a moderated forum application might specify a default ACL like this:

```objective_c
LASACL *defaultACL = [LASACL ACL];
// Everybody can read objects created by this user
[defaultACL setPublicReadAccess:YES];
// Moderators can also modify these objects
[defaultACL setWriteAccess:YES forRoleWithName:@"Moderators"];
// And the user can read and modify its own objects
[LASACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

### Role Hierarchy

As described above, one role can contain another, establishing a parent-child relationship between the two roles. The consequence of this relationship is that any permission granted to the parent role is implicitly granted to all of its child roles.

These types of relationships are commonly found in applications with user-managed content, such as forums. Some small subset of users are "Administrators", with the highest level of access to tweaking the application's settings, creating new forums, setting global messages, and so on. Another set of users are "Moderators", who are responsible for ensuring that the content created by users remains appropriate. Any user with Administrator privileges should also be granted the permissions of any Moderator. To establish this relationship, you would make your "Administrators" role a child role of "Moderators", like this:

```objective_c
LASRole *administrators = /* Your "Administrators" role */;
LASRole *moderators = /* Your "Moderators" role */;
[moderators.roles addObject:administrators];
[LASDataManager saveObjectInBackground:moderators block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

## Files

### The LASFile

`LASFile` lets you store application files in the cloud that would otherwise be too large or cumbersome to fit into a regular `LASObject`. The most common use case is storing images but you can also use it for documents, videos, music, and any other binary data (up to 100 megabytes).

Getting started with `LASFile` is easy. First, you'll need to have the data in `NSData` form and then create a `LASFile` with it. In this example, we'll just use a string:

```objective_c
NSData *data = [@"Working at LAS is great!" dataUsingEncoding:NSUTF8StringEncoding];
LASFile *file = [LASFile fileWithName:@"resume.txt" data:data];
```

Notice in this example that we give the file a name of `resume.txt`. There's two things to note here:

- You don't need to worry about filename collisions. Each upload gets a unique identifier so there's no problem with uploading multiple files named `resume.txt`.
- It's important that you give a name to the file that has a file extension. This lets LAS figure out the file type and handle it accordingly. So, if you're storing PNG images, make sure your filename ends with `.png`.

Next you'll want to save the file up to the cloud. As with `LASObject`, there is 'save' method on `LASFileManager` you can use.

```objective_c
[LASFileManager saveFileInBackground:file block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Finally, after the save completes, you can associate a `LASFile` onto a `LASObject` just like any other piece of data:

```objective_c
LASObject *jobApplication = [LASObject objectWithClassName:@"JobApplication"]
jobApplication[@"applicantName"] = @"Joe Smith";
jobApplication[@"applicantResumeFile"] = file;
[LASDataManager saveObjectInBackground:jobApplication block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Retrieving it back involves calling the `getDataOfFileInBackground:block:` on the `LASFileManager`. Here we retrieve the resume file off another `JobApplication` object:

```objective_c
LASFile *applicantResume = anotherApplication[@"applicantResumeFile"];
[LASFileManager getDataOfFileInBackground:file block:^(NSData *data, NSError *err) {
    if (!error) {
        NSData *resumeData = data;
    }
}];
```

### Images

You can easily store images by converting them to `NSData` and then using `LASFile`. Suppose you have a `UIImage` named image that you want to save as a `LASFile`:

```objective_c
NSData *imageData = UIImagePNGRepresentation(image);
LASFile *imageFile = [LASFile fileWithName:@"image.png" data:imageData];
 
LASObject *userPhoto = [LASObject objectWithClassName:@"UserPhoto"];
userPhoto[@"imageName"] = @"My trip to Hawaii!";
userPhoto[@"imageFile"] = imageFile;
[userPhoto saveInBackground];
[LASDataManager saveObjectInBackground:userPhoto block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

Your `LASFile` will be uploaded as part of the save operation on the `userPhoto` object. It's also possible to track a `LASFile`'s [upload and download progress](#progress).

Retrieving the image back involves calling the `getDataOfFileInBackground:block:` on the `LASFileManager`. Here we retrieve the image file off another `UserPhoto` named `anotherPhoto`:

```objective_c
LASFile *userImageFile = anotherPhoto[@"imageFile"];
[LASFileManager getDataOfFileInBackground:userImageFile block:^(NSData *imageData, NSError *error) {
    if (!error) {
        UIImage *image = [UIImage imageWithData:imageData];
    }
}];
```

### Progress

It's easy to get the progress of both uploads and downloads using `LASFileManager` using `saveFileInBackground:block:progressBlock:` and `getDataOfFileInBackground:block:progressBlock:` respectively. For example:

```objective_c
NSData *data = [@"Working at LAS is great!" dataUsingEncoding:NSUTF8StringEncoding];
LASFile *file = [LASFile fileWithName:@"resume.txt" data:data];
[LASFileManager saveFileInBackground:file block:^(BOOL succeeded, NSError *error) {
  // Handle success or failure here ...
} progressBlock:^(int percentDone) {
  // Update your progress spinner here. percentDone will be between 0 and 100.
}];
```

You can delete files that are referenced by objects using the [REST API][rest api]. You will need to provide the master key in order to be allowed to delete a file.

If your files are not referenced by any object in your app, it is not possible to delete them through the [REST API][rest api]. You may request a cleanup of unused files in your app's Settings page. Keep in mind that doing so may break functionality which depended on accessing unreferenced files through their URL property. Files that are currently associated with an object will not be affected.

## GeoPoints

LAS allows you to associate real-world latitude and longitude coordinates with an object. Adding a `LASGeoPoint` to a `LASObject` allows queries to take into account the proximity of an object to a reference point. This allows you to easily do things like find out what user is closest to another user or which places are closest to a user.

### LASGeoPoint

To associate a point with an object you first need to create a `LASGeoPoint`. For example, to create a point with latitude of 40.0 degrees and -30.0 degrees longitude:

```objective_c
LASGeoPoint *point = [LASGeoPoint geoPointWithLatitude:40.0 longitude:-30.0];
```

This point is then stored in the object as a regular field.

```objective_c
placeObject[@"location"] = point;
```

Note: Currently only one key in a class may be a `LASGeoPoint`.

#### Getting the User's Current Location

`LASGeoPoint` also provides a helper method for fetching the user's current location. This is accomplished via `geoPointForCurrentLocationInBackground:`

```objective_c
[LASGeoPoint geoPointForCurrentLocationInBackground:^(LASGeoPoint *geoPoint, NSError *error) {
    if (!error) {
        // do something with the new geoPoint
    }
}];
```

When this code is run, the following happens:

1. An internal `CLLocationManager` starts listening for location updates (via `startsUpdatingLocation`).
2. Once a location is received, the location manager stops listening for location updates (via `stopsUpdatingLocation`) and a `LASGeoPoint` is created from the new location. If the location manager errors out, it still stops listening for updates, and returns an NSError instead.
3. Your `block` is called with the `LASGeoPoint`.

For those who choose to use `CLLocationManager` directly, we also provide a `+geoPointWithLocation:` constructor to transform `CLLocation`s directly into `LASGeoPoint`s - great for apps that require constant polling.

### Geo Queries

Now that you have a bunch of objects with spatial coordinates, it would be nice to find out which objects are closest to a point. This can be done by adding another restriction to `LASQuery` using `whereKey:nearGeoPoint:`. Getting a list of ten places that are closest to a user may look something like:

```objective_c
// User's location
LASGeoPoint *userGeoPoint = userObject[@"location"];

// Create a query for places
LASQuery *query = [LASQuery queryWithClassName:@"PlaceObject"];

// Interested in locations near user.
[query whereKey:@"location" nearGeoPoint:userGeoPoint];

// Limit what could be a lot of points.
query.limit = 10;

// Final list of objects
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *placesObjects, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with placesObjects
    }
}];
```

At this point `placesObjects` will be an array of objects ordered by distance (nearest to farthest) from `userGeoPoint`. Note that if an additional `orderByAscending:`/`orderByDescending:` constraint is applied, it will take precedence over the distance ordering.

To limit the results using distance check out `whereKey:nearGeoPoint:withinMiles:`, `whereKey:nearGeoPoint:withinKilometers:`, and `whereKey:nearGeoPoint:withinRadians:`.

It's also possible to query for the set of objects that are contained within a particular area. To find the objects in a rectangular bounding box, add the `whereKey:withinGeoBoxFromSouthwest:toNortheast:` restriction to your `LASQuery`.

```objective_c
LASGeoPoint *swOfSF = [LASGeoPoint geoPointWithLatitude:37.708813 longitude:-122.526398];
LASGeoPoint *neOfSF = [LASGeoPoint geoPointWithLatitude:37.822802 longitude:-122.373962];
LASQuery *query = [LASQuery queryWithClassName:@"PizzaPlaceObject"];
[query whereKey:@"location" withinGeoBoxFromSouthwest:swOfSF toNortheast:neOfSF];
[LASQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *pizzaPlacesInSF, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with pizzaPlacesInSF
    }
}];
```

### Caveats

At the moment there are a couple of things to watch out for:

1. Each `LASObject` class may only have one key with a `LASGeoPoint` object.
2. Points should not equal or exceed the extreme ends of the ranges. Latitude should not be -90.0 or 90.0. Longitude should not be -180.0 or 180.0. Attempting to set latitude or longitude out of bounds will cause an error.

## Cloud Code

Cloud Functions can be called from iOS using `LASCode`. For example, to call the Cloud Function named `hello`:

```objective_c
[LASCloudCode callFunctionInBackground:@"hello"
                      	 withParameters:@{} 
                                 block:^(NSString *result, NSError *error) {
   if (!error) {
     // result is @"Hello world!"
   }
}];
```

## Handling Errors

LAS has a few simple patterns for surfacing errors and handling them in your code.

There are two types of errors you may encounter. The first is those dealing with logic errors in the way you're using the SDK. These types of errors result in an `NSException` being raised, and log detail of the exception. **Please take attention of logs beginning with something like "<LAS> Exception:" in Xcode console.** For an example take a look at the following code:

```objective_c
LASUser *user = [LASUser user];
[LASUserManager signUpInBackground:user block:nil];
```

This will throw an `NSInternalInconsistencyException` because `signUp` was called without first setting the required properties (`username` and `password`).

The second type of error is one that occurs when interacting with the LAS over the network. These errors are either related to problems connecting to the cloud or problems performing the requested operation. Let's take a look at another example:

```objective_c
- (void)getMyNote {
    [LASQueryManager getObjectInBackgroundWithClass:@"Note" objectId:@"thisObjectIdDoesntExist" block:^(LASObject *object, NSError *error) {
        [self callbackForGet:object error:error]
    }];
}
```

In the above code, we try to fetch an object with a non-existent `objectId`. The LAS will return an error with an error code set in `code` and `message` in the error's `userInfo`. Here's how to handle it properly in your callback:

```objective_c
- (void)callbackForGet:(LASObject *)result error:(NSError *)error {
    if (result) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLASErrorObjectNotFound) {
            NSLog(@"Uh oh, we couldn't find the object!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}
```

The query might also fail because the device couldn't connect to the LAS. Here's the same callback but with a bit of extra code to handle that scenario explicitly:

```objective_c
- (void)callbackForGet:(LASObject *)result error:(NSError *)error {
    if (result) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLASErrorObjectNotFound) {
            NSLog(@"Uh oh, we couldn't find the object!");
            // Now also check for connection errors:
        } else if ([error code] == kLASErrorConnectionFailed) {
            NSLog(@"Uh oh, we couldn't even connect to the LAS!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}
```

The callback block expects a `BOOL` argument, its value tells you whether the operation succeeded or not. For example, this is how you might implement the block for `LASDataManager`'s `+saveObjectInBackground:block:` method:

```objective_c
[LASDataManager saveObjectInBackground:nil block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLASErrorConnectionFailed) {
            NSLog(@"Uh oh, we couldn't even connect to the LAS!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}];
```

By default, all connections have a timeout of 10 seconds.

For a list of all possible `NSError` types, see the Error Codes section of the [API][ios api reference].

## Security

We strongly recommend that you build your applications to restrict access to data as much as possible. With this in mind, we recommend that you enable [automatic anonymous user creation](#anonymous-users) and [specify a default ACL](#security-for-other-objects) based upon the current user when your application is initialized. Explicitly set public writability (and potentially public readability) on an object-by-object basis in order to protect your data from unauthorized access.

Consider adding the following code to your application startup:

```objective_c
[LASUser enableAutomaticUser];
LASACL *defaultACL = [LASACL ACL];
// Optionally enable public read access while disabling public write access.
// [defaultACL setPublicReadAccess:YES];
[LASACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

Please keep secure access to your data in mind as you build your applications for the protection of both you and your users.

Our [Data & Security][data & security guide] Guide has detailed descriptions of the various ways LAS can help keep your app's data safe.

### Settings

In addition to coding securely, please review the settings pages for your applications to select options that will restrict access to your applications as much as is appropriate for your needs. For example, if users should be unable to log in without a Facebook account linked to their application, disable all other login mechanisms. Specify your Facebook application IDs, Twitter consumer keys, and other such information to enable server-side validation of your users' login attempts.



[ios quick start]: ../../quickstart/ios/core/existing.html
[data & security guide]: about:blank
[ios api reference]: ../../api/ios/index.html
[las ios/ox sdk]: http://cf.appfra.com/X2WTe8-sS878AirEjM9KLA/zcf-005fe580-8256-401d-adad-9824d0028a55.zip
[rest api]: ../../api/ios/index.html




[+load api reference]: https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSObject_Class/#//apple_ref/occ/clm/NSObject/load

[+initialize api reference]: https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSObject_Class/#//apple_ref/occ/clm/NSObject/initialize

[access control list]: http://en.wikipedia.org/wiki/Access_control_list
[role-based access control]: http://en.wikipedia.org/wiki/Role-based_access_control

[set up a facebook app]: https://developers.facebook.com/apps

[getting started with the facebook sdk]: https://developers.facebook.com/docs/getting-started/facebook-sdk-for-ios/

[facebook permissions]: https://developers.facebook.com/docs/reference/api/permissions/

[facebook sdk reference]: https://developers.facebook.com/docs/reference/ios/current/

[set up twitter app]: https://dev.twitter.com/apps

[twitter documentation]: https://dev.twitter.com/docs

[twitter rest api]: https://dev.twitter.com/docs/api
