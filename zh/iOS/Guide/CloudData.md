---
title: iOS 开发指南 | LC

language_tabs:
  - objective_c
  - Swift

search: true
---

# 云数据

如果您尚未安装 SDK，请先查阅[快速入门指南][LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS]，安装 SDK 并使之在 Xcode 中运行。
您还可以查看我们的 [API 参考][LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS]，了解有关我们 SDK 的更多详细信息。

**注意**：我们支持 iOS 6.0 及以上版本。

## 简介

LC 平台为您的移动应用程序提供完整的后台解决方案。我们的目标是彻底消除编写服务器代码或维护服务器的需要。

### 应用

在 LC 平台上，您可以为每个移动应用需求创建一个应用。每个应用均有自己的应用程序 id 以及供您用于 SDK 的客户端密钥。您的 LC 帐户可以容纳多个应用。即使您只有一个应用程序，这也很有用，因为您可以部署不同的版本用于测试和产品运营。

## 对象

### LCObject

LC 上的数据储存建立在 `LCObject` 的基础上。每个 `LCObject` 包含与 JSON 兼容数据的键值对。该数据是 schemaless 的，即您不需要事先指定每个 `LCObject` 上存在的键。您只需在需要的时候增加键值对，我们的后台会储存它们。

例如，假设您要跟踪游戏的高分。单个 `LCObject` 可能包括：

```objective_c
score: 1337, playerName: "Sean Plott", cheatMode: false
```

键必须是由字母和数字组成的字符串。值可以是字符串、数字、布尔值或者数组和字典 － 任何能用 JSON 编码的内容。

每个 `LCObject` 都有一个类名用来区分不同种类的数据。例如，您可以把高分对象称为 `GameScore`。我们建议您使用驼峰式命名法来命名类名和字段名（如：NameYourclassesLikeThis, nameYourKeysLikeThis），让您的代码看起来整齐美观。

### 保存对象

现在讲如何将上述 `GameScore` 保存到 LC 服务器上。

`LCObject` 接口与 `NSMutableDictionary` 类似。我们有一个类 `LCDataManager`保存、删除 `LCObject`s, 和拉取数据。现在我们使用 `LCDataManager` 来保存 `GameScore`:

```objective_c
LCObject *gameScore = [LCObject objectWithclassName:@"GameScore"];
gameScore[@"score"] = @1337;
gameScore[@"playerName"] = @"Sean Plott";
gameScore[@"cheatMode"] = @NO;
[LCDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        // gameScore save succeed
    } else {
        // there was an error
    }
}];
```

该代码运行后，您可能想知道是否真的执行了相关操作。为确保数据正确保存，您可以在 LC 开发中心查看应用中的数据浏览器。您应该会看到类似于以下的内容：

```
objectId: "xWMyZ4YEGZ", score: 1337, playerName: "Sean Plott", cheatMode: false,
createdAt:"2011-06-10T18:33:42Z", updatedAt:"2011-06-10T18:33:42Z"
```

这里要注意两点：

1. 在运行这个代码前，您不需要配置或创建名称为 `GameScore` 的新类别。您的 LC 应用在第一次遇到这个类别时会为您创建该类别。

2. 为方便起见，我们还提供了几个字段，您不需要指定其内容。`objectId` 是各已存对象的唯一标识符。`createdAt` 和 `updatedAt` 分别是各个对象在 LC 中的创建时间和最后修改时间。每个字段都由 LC 填充，所以完成保存操作后，`LCObject` 的这些字段才会有值。

### 对象检索

将数据保存到云中非常有趣，但是更有趣的是从云中获取这些数据。如果您有 `objectId`，您可以用 `LCQueryManager` 获取整个 `LCObject`。这是一个异步方法：

```objective_c
[LCDataManager getObjectInBackgroundWithclass:@"GameScore" objectId:@"xWMyZ4YEGZ" block:^(LCObject *gameScore, NSError *error) {
    // Do something with the returned LCObject in the gameScore variable.
    NSLog(@"%@", gameScore);
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

若要从 `LCObject` 中取值，您可以使用 `objectForKey:` 方法或 `[]` 操作符：

```objective_c
int score = [[gameScore objectForKey:@"score"] intValue];
NSString *playerName = gameScore[@"playerName"];
BOOL cheatMode = [gameScore[@"cheatMode"] boolValue];
```

有三个特殊的值以属性的方式提供：

```objective_c
NSString *objectId = gameScore.objectId;
NSDate *updatedAt = gameScore.updatedAt;
NSDate *createdAt = gameScore.createdAt;
```

若需要刷新已有对象，可以调用 `-[LCDataManager fetchDataOfObjectInBackground:block:]` 方法：

```
[LCDataManager fetchDataOfObjectInBackground:myObject block:^(LCObject *object, NSError *error) {
    // object 就是使用服务器数据填充后的 myObject
}];
```

### 对象更新

进行对象更新非常简单。只需在对象上设置一些新的数据并调用保存方法即可。假设您已保存对象并有 `objectId`，您可以使用 `LCQueryManager` 获取 `LCObject`并更新其数据：

```objective_c
// Retrieve the object by id
[LCQueryManager getObjectInBackgroundWithclass:@"GameScore" objectId:@"xWMyZ4YEGZ" block:^(LCObject *gameScore, NSError *error) {
	// Now let's update it with some new data. In this case only cheatMode and score
	// will get sent to the cloud, playerName hasn't changed.
	gameScore[@"cheatMode"] = @YES;
	gameScore[@"score"] = @3539;
   [LCDataManager saveObjectInBackground:gameScore block:nil];
}];
// The InBackground methods are asynchronous, so any code after this will run
// immediately.  Any code that depends on the query result should be moved
// inside the completion block above.
```

客户端会自动找出被修改的数据，所以只有 “dirty” 字段会被发送到服务器。您不需要担心其中会包含您不想更新的数据。

### 计数器

上面的例子包含一种常见的使用案例。`score` 字段是个计数器，需要不断使用玩家的最新得分进行更新。上面的方法虽然可以工作，但是繁琐。如果您有多个客户端在尝试更新同一个计数器就可能会产生一些问题。

为帮助储存计数器类型的数据，LC 提供了能够以原子递增（或递减）操作任何数字字段的方法。因此，做相同的更新操作可以重写为：

```objective_c
[gameScore incrementKey:@"score"];
[LCDataManager saveObjectInBackground:gameScore block:nil];
```

您还可以使用 `incrementKey:byAmount:` 实现任何数量的递增。

### 数组

为帮助存储数组数据，有三种操作可用于以原子级方式更改数组字段：

- `addObject:forKey:` 和 `addObjectsFromArray:forKey:` 将给定对象附加在数组字段末端。
- `addUniqueObject:forKey:` 和 `addUniqueObjectsFromArray:forKey:` 仅将尚未包含在数组字段中的给定对象添加至该字段。插入位置是不确定的。
- `removeObject:forKey:` 和 `removeObjectsInArray:forKey:` 会从数组字段中删除每个给定对象的所有实例。
例如，我们可以像这样将项目添加到类似于设置的 `skills` 字段中：

```objective_c
[gameScore addUniqueObjectsFromArray:@[@"flying", @"kungfu"] forKey:@"skills"];
[LCDataManager saveObjectInBackground:gameScore block:nil];
```

**注意**：目前不能同时从位于同一保存位置的数组中进行原子级的项目添加和删除操作。在不同类型的数组操作之间，您必须调用 save。

### 删除对象

若要从云端删除对象：

```objective_c
[LCDataManager deleteObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

您可以使用 `removeObjectForKey:` 方法从对象中删除单一字段：

```objective_c
// After this, the playerName field will be empty
[gameScore removeObjectForKey:@"playerName"];
// Saves the field deletion to the LC
[LCDataManager saveObjectInBackground:gameScore block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

### 关系数据

对象之间可以存在一定的关系。为了模仿这一行为，可将任意 `LCObject` 用作其他 `LCObject` 中的值。在内部，LC 框架只将被引用的的对象存储于一个位置，以便保持一致性。

例如，一个博客应用中的许多 `Comment` 可能对应同一个 `Post`。要创建一个带有单一 `Comment` 的 `Post`，您可以这样写：

```objective_c
// Create the post
LCObject *myPost = [LCObject objectWithclassName:@"Post"];
myPost[@"title"] = @"I'm Hungry";
myPost[@"content"] = @"Where should we go for lunch?";
// Create the comment
LCObject *myComment = [LCObject objectWithclassName:@"Comment"];
myComment[@"content"] = @"Let's do Sushirrito.";
// Add a relation between the Post and Comment
myComment[@"parent"] = myPost;
// This will save both myPost and myComment
[LCDataManager saveObjectInBackground:myComment block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

您还可以只用它们的 `objectId` 将多个对象联系起来，如下所示：

```objective_c
// Add a relation between the Post with objectId "1zEcyElZ80" and the comment
myComment[@"parent"] = [LCObject objectWithoutDataWithclassName:@"Post" objectId:@"1zEcyElZ80"];
```

默认在提取对象时不提取相关的 `LCObject`。这些对象的数据在按如下方式提取之前无法检索：

```objective_c
LCObject *post = fetchedComment[@"parent"];
[LCDataManager fetchDataOfObjectIfNeededInBackground:post block:^(LCObject *object, NSError *error) {
    NSString *title = post[@"title"];
    // do something with your title variable
}];
```

您还可以使用 `LCRelation` 对象建立多对多关系模型。其机理与 `LCObject`s 的 `NSArray` 类似，但您不必一次性下载关系中的所有对象。因此 `LCRelation` 可以扩展到比 `LCObject` 的 `NSArray` 多很多的对象上。例如，一个 `User` 可能有很多篇喜欢的 Post。这种情况下，您可以用 `relationforKey:` 储存 `User` 喜欢的 `Post`。要将一个帖子添加至此列表，代码如下所示：

```objective_c
LCUser *user = [LCUser currentUser];
LCRelation *relation = [user relationForKey:@"likes"];
[relation addObject:post];
[LCDataManager saveObjectInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        //
    } else {
        // there was an error
    }
}];
```

您可以从 `LCRelation` 删除一个帖子，代码如下：

```objective_c
[relation removeObject:post];
```

默认情况下，这种关系中的对象列表不会被下载。您可以将 `[relation query]` 返回的 `LCQuery` 传入 `+[LCQueryManager findObjectsInBackgroundWithBlock:]` 获取 `Post` 列表。代码应如下所示：

```objective_c
LCQuery *query = [relation query];
[LCDataManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (error) {
        // There was an error
    } else {
        // objects has all the Posts the current user liked.
    }
}];
```

若您只想要 Post 的一个子集，可以对 `-[LCRelation query]` 返回的 `LCQuery` 添加额外限制条件：

```objective_c
LCQuery *query = [relation query];
[query whereKey:@"title" hasSuffix:@"We"];
// Add other query constraints.
```

若要了解有关 `LCQuery` 的更多详细信息，请查看本指南的查询部分。`LCRelation` 的工作方式类似于 `LCObject` 的 `NSArray`，因此您能对对象数组进行的任何查询（不含 `includeKey:`）均可对 `LCRelation` 执行。

### 数据类型

目前，我们使用的值的数据类型有 `NSString`、`NSNumber` 和 `LCObject`。LC 还支持 `NSDate`、`NSData` 和 `NSNull`。

您可以嵌套 `NSDictionary` 和 `NSArray` 对象，以在单一 `LCObject` 中存储具有复杂结构的数据。

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

LCObject *bigObject = [LCObject objectWithclassName:@"BigObject"];
bigObject[@"myNumber"] = number;
bigObject[@"myString"] = string;
bigObject[@"myDate"] = date;
bigObject[@"myData"] = data;
bigObject[@"myArray"] = array;
bigObject[@"myDictionary"] = dictionary;
bigObject[@"myNull"] = null;
[LCDataManager saveObjectInBackground:bigObject block:^(BOOL succeeded, NSError *error) {
    if (error) {
        // There was an error
    } else {
        // objects has all the Posts the current user liked.
    }
}];
```

我们不建议通过在 `LCObject` 中使用 `NSData` 字段来存储图像或文档等大型二进制数据。`LCObject` 的大小不应超过 128 KB。要存储更多数据，我们建议您使用 `LCFile` 或者 `LCPrivateFile`。更多详细信息请参考本指南的[文件](#文件)部分。

### 子类

LC 的设计能让您尽快上手使用。您可以使用 `LCObject` 类访问所有数据，以及通过 `objectForKey:` 或 `[]` 操作符访问任何字段。在成熟的代码库中，子类具有许多优势，包括简洁性、可扩展性和支持自动完成。子类化纯属可选操作，但它会将以下代码：

```objective_c
LCObject *shield = [LCObject objectWithclassName:@"Armor"];
shield[@"displayName"] = @"Wooden Shield";
shield[@"fireProof"] = @NO;
shield[@"rupees"] = @50;
```

转换为：

```objective_c
Armor *shield = [Armor object];
shield.displayName = @"Wooden Shield";
shield.fireProof = NO;
shield.rupees = 50;
```

### `LCObject` 子类化

创建 `LCObject` 子类的步骤：

1. 声明符合 `LCSubclassing` 协议的子类。
2. 实现子类方法 `LCclassName`。这是您传给 `-initWithclassName:` 方法的字符串，这样以后就不必再传类名了。
3. 将 `LCObject+Subclass.h` 导入您的 .m 文件。该操作导入了 `LCSubclassing` 协议中的所有方法的实现。其中 `LCclassName` 的默认实现是返回类名(指 Objective C 中的类)。
4. 在 `+[LC setApplicationId:clientKey:]` 之前调用 `+[Yourclass registerSubclass]`。一个简单的方法是在类的 [+load][+load api reference] (Obj-C only) 或者 [+initialize][+initialize api reference] (both Obj-C and Swift) 方法中做这个事情。

下面的代码成功地声明、实现和注册了 `LCObject` 的 `Armor` 子类：

```objective_c
// Armor.h
@interface Armor : LCObject<LCSubclassing>
+ (NSString *)LCclassName;
@end

// Armor.m
// Import this header to let Armor know that LCObject privately provides most
// of the methods for LCSubclassing.
#import <LC/LCObject+Subclass.h>
@implementation Armor
+ (void)load {
    [self registerSubclass];
}
+ (NSString *)LCclassName {
    return @"Armor";
}
@end
```

### 属性和方法

向 `LCObject` 子类添加自定义属性和方法有助于封装关于这个类的逻辑。借助 `LCSubclassing`，您可以将与同一个主题的所有相关逻辑放在一起，而不必分别针对事务逻辑和存储/传输逻辑使用单独的类。

`LCObject` 支持动态合成器(dynamic synthesizers)，这一点与 `NSManagedObject` 类似。像平常一样声明一个属性，但是在您的 .m 文件中使用 `@dynamic` 而不用 `@synthesize`。下面的示例在 `Armor` 类中创建了 `displayName` 属性：

```objective_c
// Armor.h
@interface Armor : LCObject<LCSubclassing>
+ (NSString *)LCclassName;
@property (retain) NSString *displayName;
@end

// Armor.m
@dynamic displayName;
```

现在，您可以使用 `armor.displayName` 或 `[armor displayName]` 访问 `displayName` 属性，并使用 `armor.displayName = @"Wooden Shield"` 或 `[armor setDisplayName:@"Wooden Sword"]` 对其进行赋值。动态属性可以让 Xcode 提供自动完成功能和简单的纠错。

`NSNumber` 属性可使用 `NSNumber` 或其相应的基本类型来实现。请看下例：

```objective_c
@property BOOL fireProof;
@property int rupees;
```

这种情况下，`game[@"fireProof"]` 将返回一个 `NSNumber`，可以使用 `boolValue` 访问；`game[@"rupees"]` 将返回一个 `NSNumber`，可以使用 `intValue` 访问。但是，`fireProof` 属性实际上是 `BOOL`，`rupees` 属性实际上是 `int`。动态 `getter` 会自动提取 `BOOL` 或 `int` 值，动态 `setter` 会自动将值装入 `NSNumber` 中。您可以使用任一格式。原始属性类型更易于使用，但是 `NSNumber` 属性类型明显支持 `nil` 值。

如果您需要比简单属性访问更加复杂的逻辑，您也可以声明自己的方法：

```objective_c
@dynamic iconFile;

- (UIImageView *)iconView {
    LCImageView *view = [[LCImageView alloc] initWithImage:kPlaceholderImage];
    view.file = self.iconFile;
    [view loadInBackground];
    return view;
}
```

### 初始化子类

您应该使用类方法 `object` 创建新的对象。这样可以构建一个您定义的类型的实例，并正确处理子类化。要创建现有对象的引用，使用 `objectWithoutDataWithObjectId:`。

## 查询

我们已经知道如何使用 `+[LCQueryManager getObjectInBackgroundWithclass:objectId:block:]` 从 LC 中检索单个 `LCObject`。使用 `LCQuery`，还有其他多种检索数据的方法 —— 您可以一次检索多个对象，设置检索对象的条件等。

### 基本查询

在多数情况下，`getObjectInBackgroundWithclass:objectId:block:` 不够强大，它不能指定您要检索哪些对象。`LCQuery` 提供了不同的方法用于检索一系列对象而非仅仅检索单一对象。

常规模式是创建一个 `LCQuery`，设置查询条件，然后传给 `+[LCQueryManger findObjectsInBackgroundWithQuery:block:]` 方法获取与之相匹配的 `LCObject` 数组。例如，若要检索 `playerName` 的得分，可以使用 `whereKey:equalTo:` 方法限定键值。

```objective_c
LCQuery *query = [LCQuery queryWithclassName:@"GameScore"];
[query whereKey:@"playerName" equalTo:@"Dan Stemkoski"];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (!error) {
        // The find succeeded.
        NSLog(@"Successfully retrieved %d scores.", objects.count);
        // Do something with the found objects
        for (LCObject *object in objects) {
            NSLog(@"%@", object.objectId);
        }
    } else {
        // Log details of the failure
        NSLog(@"Error: %@ %@", error, [error userInfo]);
    }
}];
```

`+[LCQueryManager findObjectsInBackgroundWithQuery:block:]` 方法确保不阻塞当前线程并完成网络请求，然后在主线程执行 block。

### 用 NSPredicate 指定限制条件

为了充分利用 LCQuery，我们建议使用下列方法添加限制条件。但是，若您更喜欢用 NSPredicate，创建 LCQuery 时提供 NSPredicate 即可指定一系列的限制条件。

```objective_c
NSPredicate *predicate = [NSPredicate predicateWithFormat:
@"playerName = 'Dan Stemkosk'"];
LCQuery *query = [LCQuery queryWithclassName:@"GameScore" predicate:predicate];
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

### 查询条件

有几种方法可以对 `LCQuery` 可以查到的对象设置限制条件。您可以用 `whereKey:notEqualTo:` 将具有特定键值对的对象过滤出来：

```objective_c
[query whereKey:@"playerName" notEqualTo:@"Michael Yabuti"];
```

您可以给定多个限制条件，只有满足所有限制条件的对象才会出现在结果中。换句话说，这类似于 AND 类型的限制条件。

```objective_c
[query whereKey:@"playerName" notEqualTo:@"Michael Yabuti"];
[query whereKey:@"playerAge" greaterThan:@18];
```

您可以通过设置 `limit` 来限制结果数量。默认结果数量限制为 100，但是 1 到 1000 之间的任意值都有效：

```objective_c
query.limit = 10; // limit to at most 10 results
```

如果您想要确切的一个结果，更加方便的方法是使用 `[LCQueryManager getFirstObjectInBackgroundWithQuery:block:]` 而不是 `[LCQueryManager findObjectsInBackgroundWithQuery:block:]`。

```objective_c
LCQuery *query = [LCQuery queryWithclassName:@"GameScore"];
[query whereKey:@"playerEmail" equalTo:@"dstemkoski@example.com"];
[LCQueryManager getFirstObjectInBackgroundWithQuery:query block:^(LCObject *object, NSError *error) {
    if (!object) {
        NSLog(@"The getFirstObject request failed.");
    } else {
        // The find succeeded.
        NSLog(@"Successfully retrieved the object.");
    }
}];
```

您可以通过设置 `skip` 跳过前面的结果。这可以用来分页：

```objective_c
query.skip = 10; // skip the first 10 results
```

对于可排序的数据，如数字和字符串，您可以控制结果返回的顺序：

```objective_c
// Sorts the results in ascending order by the score field
[query orderByAscending:@"score"];
// Sorts the results in descending order by the score field
[query orderByDescending:@"score"];
```

您可以在查询中添加更多排序键，如下：

```objective_c
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
[query addAscendingOrder:@"score"];
// Sorts the results in descending order by the score field if the previous sort keys are equal.
[query addDescendingOrder:@"score"];
```

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

若您想要检索与几个不同值匹配的对象，您可以使用 `whereKey:containedIn:`，并提供一组可接受的值。这通常在用单一查询替代多个查询时比较有用。例如，如果您检索某个列表中玩家的得分：

```objective_c
// Finds scores from any of Jonathan, Dario, or Shawn
NSArray *names = @[@"Jonathan Walsh",
@"Dario Wunsch",
@"Shawn Simon"];
[query whereKey:@"playerName" containedIn:names];
```

若您想要检索与几个值都不匹配的对象，您可以使用 `whereKey:notContainedIn:`，并提供一组可接受的值。例如，如果您想检索不在某个列表里的玩家的得分：

```objective_c
// Finds scores from anyone who is neither Jonathan, Dario, nor Shawn
NSArray *names = @[@"Jonathan Walsh",
@"Dario Wunsch",
@"Shawn Simon"];
[query whereKey:@"playerName" notContainedIn:names];
```

若您想要检索有某一特定键集的对象，可以使用 whereKeyExists。相反，若您想要检索没有某一特定键集的对象，可以使用 whereKeyDoesNotExist。

您可以使用 `whereKey:matchesKey:inQuery:` 方法获取符合以下要求的对象：对象中的一个键值与另一查询所得结果的对象集中的某一键值匹配。例如，如果您的一个类包含体育团队，而且您在用户类中储存了用户的家乡，那么您可以查询其家乡团队获奖的用户列表。该查询类似于：

```objective_c
LCQuery *teamQuery = [LCQuery queryWithclassName:@"Team"];
[teamQuery whereKey:@"winPct" greaterThan:@(0.5)];
LCQuery *userQuery = [LCUser query];
[userQuery whereKey:@"hometown" matchesKey:@"city" inQuery:teamQuery];
[LCQueryManager findObjectsInBackgroundWithQuery:userQuery block:^(NSArray *objects, NSError *error) {
    // results will contain users with a hometown team with a winning record
}];
```

类似地，您可以使用 `whereKey:doesNotMatchKey:inQuery:` 获取不符合以下要求的对象：对象中的一个键值与另一查询所得结果的对象集中的某一键值匹配。例如，要查找其家乡团队失利的用户：

```objective_c
LCQuery *losingUserQuery = [LCUser query];
[losingUserQuery whereKey:@"hometown" doesNotMatchKey:@"city" inQuery:teamQuery];
[LCQueryManager findObjectsInBackgroundWithQuery:losingUserQuery block:^(NSArray *objects, NSError *error) {
    // results will contain users with a hometown team with a losing record
}];
```

您可以限制返回的字段，通过调用 `selectKeys:` 并传入一个字段数组来实现。若要检索只包含 `score` 和 `playerName` 字段（以及特殊内建字段，如 `objectId`、`createdAt` 和 `updatedAt`）的对象：

```objective_c
LCQuery *query = [LCQuery queryWithclassName:@"GameScore"];
[query selectKeys:@[@"playerName", @"score"]];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // objects in results will only contain the playerName and score fields
}];
```

稍后，可以通过对返回的对象调用  `[LCDataManager fetchDataOfObjectIfNeededInBackground:block:]` 提取其余的字段：

```objective_c
LCObject *object = (LCObject*)results[0];
[LCDataManager fetchDataOfObjectIfNeededInBackground:object block:^(LCObject *object, NSError *error) {
    // all fields of the object will now be available here.
}];
```

### 数组值查询

对于数组类型的键，您可以查找键的数组值包含 2 的对象，如下所示：

```objective_c
// Find objects where the array in arrayKey contains 2.
[query whereKey:@"arrayKey" equalTo:@2];
```

您还可以查找键数组值包含值 2、3 或 4 的对象，如下所示：

```objective_c
// Find objects where the array in arrayKey contains each of the
// elements 2, 3, and 4.
[query whereKey:@"arrayKey" containsAllObjectsInArray:@[@2, @3, @4]];
```

### 字符串值查询

使用 `whereKey:hasPrefix:` 将结果限制为以某一特定字符串开头的字符串值。与 MySQL `LIKE` 运算符类似，它包含索引，所以对大型数据集很有效：

```objective_c
// Finds barbecue sauces that start with "Big Daddy's".
LCQuery *query = [LCQuery queryWithclassName:@"BarbecueSauce"];
[query whereKey:@"name" hasPrefix:@"Big Daddy's"];
```

### 关系型查询

有几种方法可以用于关系型数据查询。如果您想检索有字段与某一特定 `LCObject` 匹配的对象，可以像检索其他类型的数据一样使用 `whereKey:equalTo:`。例如，如果每个 `Comment` 在 `post` 字段中有一个 `Post` 对象，您可以提取某一特定 `Post` 的评论：

```objective_c
// Assume LCObject *myPost was previously created.
LCQuery *query = [LCQuery queryWithclassName:@"Comment"];
[query whereKey:@"post" equalTo:myPost];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for myPost
}];
```

您还可以用 `objectId` 进行关系型查询：

```objective_c
[query whereKey:@"post"
equalTo:[LCObject objectWithoutDataWithclassName:@"Post" objectId:@"1zEcyElZ80"]];
```

如果想要检索的对象中，有字段包含与其他查询匹配的 `LCObject`，您可以使用 `whereKey:matchesQuery:`。**注意**，默认限值 100 和最大限值 1000 也适用于内部查询，因此在大型数据集中进行查询时，您可能需要谨慎构建查询条件才能按需要进行查询。为了查找包含图像的帖子的评论，您可以这样：

```objective_c
LCQuery *innerQuery = [LCQuery queryWithclassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
LCQuery *query = [LCQuery queryWithclassName:@"Comment"];
[query whereKey:@"post" matchesQuery:innerQuery];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts with images
}];
```

如果想要检索的对象中，有字段包含与其他查询不匹配的 `LCObject`，您可以使用 `whereKey:doesNotMatchQuery:`。为了查找不包含图像的帖子的评论，您可以这样：

```objective_c
LCQuery *innerQuery = [LCQuery queryWithclassName:@"Post"];
[innerQuery whereKeyExists:@"image"];
LCQuery *query = [LCQuery queryWithclassName:@"Comment"];
[query whereKey:@"post" doesNotMatchQuery:innerQuery];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // comments now contains the comments for posts without images
}];
```

在一些情况下，您可能想要在一个查询中返回多种类型的相关对象。您可以用 `includeKey:` 方法达到这个目的。例如，假设您要检索最新的十条评论，并且想要同时检索这些评论的相关帖子：

```objective_c
LCQuery *query = [LCQuery queryWithclassName:@"Comment"];
// Retrieve the most recent ones
[query orderByDescending:@"createdAt"];
// Only retrieve the LCt ten
query.limit = 10;
// Include the post data with each comment
[query includeKey:@"post"];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *comments, NSError *error) {
    // Comments now contains the LCt ten comments, and the "post" field
    // has been populated. For example:
    for (LCObject *comment in comments) {
        // This does not require a network access.
        LCObject *post = comment[@"post"];
        NSLog(@"retrieved related post: %@", post);
    }
}];
```

您也可以使用点标记进行多层级检索。如果您想要包含帖子的评论以及帖子的作者，您可以操作如下：

```objective_c
[query includeKey:@"post.author"];
```

您可以通过多次调用 `includeKey:`，进行包含多个字段的查询。此功能也适用于 `[LCQueryManager getFirstObjectInBackgroundWithQuery:block:]` 和 `[LCQueryManager getObjectInBackgroundWithclass:objectId:block:]` 等 LCQuery 辅助方法。

### 对象计数

计数查询可以对拥有 1000 条以上数据的类返回大概结果。如果您只需要计算符合查询的对象数量，不需要检索匹配的对象，可以使用 `countObjects`，而不是 `findObjects`。例如，要计算某一特定玩家玩过多少种游戏：

```objective_c
LCQuery *query = [LCQuery queryWithclassName:@"GameScore"];
[query whereKey:@"playername" equalTo:@"Sean Plott"];
[LCQueryManager countObjectsInBackgroundWithQuery:query block:^(int count, NSError *error) {
    if (!error) {
        // The count request succeeded. Log the count
        NSLog(@"Sean has played %d games", count);
    } else {
        // The request failed
    }
}];
```

对于含超过 1,000 个对象的类，计数操作受超时设定的限制。这种情况下，可能经常遇到超时错误，或只能返回近似正确的结果。因此，在应用程序的设计中，最好能做到避免此类计数操作。

### 混合查询

如果想要查找与几个查询中的其中一个匹配的对象，您可以使用 `orQueryWithSubqueries:` 方法。例如，如果您想要查找赢得多场胜利或几场胜利的玩家，您可以：

```objective_c
LCQuery *lotsOfWins = [LCQuery queryWithclassName:@"Player"];
[lotsOfWins whereKey:@"wins" greaterThan:@150];
LCQuery *fewWins = [LCQuery queryWithclassName:@"Player"];
[fewWins whereKey:@"wins" lessThan:@5];
LCQuery *query = [LCQuery orQueryWithSubqueries:@[fewWins,lotsOfWins]];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    // results contains players with lots of wins or only a few wins.
}];
```

您可以给新创建的 `LCQuery` 添加额外限制条件，这相当于 “and” 运算符。

但是，请注意：在混合查询结果中查询时，我们不支持非过滤型限制条件（如 `limit`、`skip`、`orderBy...:`、`includeKey:`）。

### 子类查询

您可以使用类方法 `query` 获取对特定子类对象的查询。下面的示例查询了用户可购买的装备：

```objective_c
LCQuery *query = [Armor query];
[query whereKey:@"rupees" lessThanOrEqualTo:LCUser.currentUser.rupees];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *objects, NSError *error) {
    if (!error) {
        Armor *firstArmor = objects[0];
        // ...
    }
}];
```

## 用户

许多应用的核心理念是，用户帐户保护应能让用户安全访问他们的信息。我们专门用于用户管理的类，叫做 `LCUser` 和 `LCUserManager`，可自动处理用户帐户管理需要的很多功能。

您可以使用这个类在您的应用程序中添加用户帐户功能。

`LCUser` 是 `LCObject` 的一个子类，拥有与之完全相同的特性，如灵活架构(flexible schema)、键值对接口。`LCObject` 上的所有方法也存在于 `LCUser` 中。不同的是 `LCUser` 具有针对用户帐户的一些特殊的附加功能。

### 属性

`LCUser` 有几种可以将其与 `LCObject` 区分开的属性：

- `username`：用户的用户名（必填）。
- `password`：用户的密码（注册时必填）。
- `email`：用户的电子邮箱地址（选填）。

我们在浏览用户的各种用例时，会逐条仔细查看这些信息。切记，如果您通过这些属性设置 `username` 和 `email`，则无需使用 `setObject:forKey:` 方法进行设置 － 这是自动设置的。

### 注册

您的应用程序要做的第一件事就是让用户注册。以下代码阐释了典型注册：

```objective_c
- (void)myMethod {
    LCUser *user = [LCUser user];
    user.username = @"my name";
    user.password = @"my pass";
    user.email = @"email@example.com";
    // other fields can be set just like with LCObject
    user[@"phone"] = @"415-392-0202";
    [LCUserManager signUpInBackground:user block:^(BOOL succeeded, NSError *error) {
        if (!error) {
            // Hooray! Let them use the app now.
        } else {
            NSString *errorString = [error userInfo][@"error"];
            // Show the errorString somewhere and let the user try again.
        }
    }];
}
```

这个调用将在您的 LC 应用中异步创建一个新的用户。创建前，它还会检查确保用户名和邮箱唯一。此外，它还将密码安全散列在云中。我们从来不明文储存密码，也不会将密码明文传输回客户端。

**注意**，我们使用的是 `+[LCUserManager signUpInBackground:block:]` 方法，而不是 `+[LCDataManager saveObjectInBackground:block:]` 方法。应始终使用 `+[LCUserManager signUpInBackground:block:]` 方法创建新的 `LCUser`。调用 `+[LCUserManager signUpInBackground:block:]` 可以完成用户的后续更新。

若注册不成功，您应该查看返回的错误对象。最可能的情况就是该用户名或邮箱已被其他用户使用。你应该将这种情况清楚地告诉用户，并要求他们尝试不同的用户名。

您可以使用电子邮箱地址作为用户名。只需让您的用户输入他们的电子邮箱，但是需要将它填写在用户名属性中 － `LCUser` 将可以正常运作。我们将在[重置密码](#重置密码)部分说明是如何处理这种情况的。

### 登录

当然，您让用户注册后，需要让他们以后登录到他们的帐户。为此，您可以使用类方法 `+[LCUserManager logInWithUsernameInBackground:password:block:]`。

```objective_c
[LCUserManager logInWithUsernameInBackground:@"myname" password:@"mypass" block:^(LCUser *user, NSError *error) {
    if (user) {
        // Do stuff after successful login.
    } else {
        // The login failed. Check error to see why.
    }
}];
```

### 验证电子邮箱

在 LC 应用设置中启用电子邮箱验证，可以让应用将部分使用体验提供给验证过电子邮箱地址的用户。电子邮箱验证会将 `emailVerified` 键添加到 `LCUser` 中。`LCUser` 的 `email` 被修改后，`emailVerified` 被设置为 `false`。随后，LC 会向用户发送一个邮件，其中包含一个链接，可将 `emailVerified` 设置为 `true`。

有三种 `emailVerified` 状态需要考虑：

1. `true` － 用户通过点击 LC 发送给他们的链接确认电子邮箱地址。最初创建用户帐户时，`LCUsers` 没有 `true` 值。
2. `false` － `LCUser` 对象最后一次刷新时，用户未确认其电子邮箱地址。若 `emailVerified` 为 `false`，可以考虑调用 `+[LCDataManager fetchDataOfObjectInBackground:block:]`，把 `LCUser` 传递给第一个参数。
3. 缺失 － 电子邮箱验证关闭或 `LCUser` 没有 `email` 时创建了 `LCUser`。

### 当前用户

若用户每次打开您的应用时都要登录，会很麻烦。您可以用缓存的 `currentUser` 对象来避免。

每次您使用任何注册或登录方法时，用户都被缓存到磁盘中。您可以把这个缓存当作一个会话，并假设用户已登录：

```objective_c
LCUser *currentUser = [LCUser currentUser];
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login screen
}
```

您可以通过注销来清除他们的当前登录状态：

```objective_c
[LCUserManager logOut];
LCUser *currentUser = [LCUser currentUser]; // this will now be nil
```

### 匿名用户

能够将数据和对象与具体用户关联非常有价值，但是有时您想在不强迫用户输入用户名和密码的情况下也能达到这种效果。

匿名用户是指能在无用户名和密码的情况下创建的但仍与任何其他 `LCUser` 具有相同功能的用户。登出后，匿名用户将被抛弃，其数据也不能再访问。

您可以使用 `LCAnonymousUtils` 创建匿名用户：

```objective_c
[LCAnonymousUtils logInWithBlock:^(LCUser *user, NSError *error) {
    if (error) {
        NSLog(@"Anonymous login failed.");
    } else {
        NSLog(@"Anonymous user logged in.");
    }
}];
```

您可以通过设置用户名和密码，然后调用 `+[LCUserManager signUpInBackground:block:]` 的方式，或者通过登录或关联 *Facebook* 或 *Twitter* 等服务的方式，将匿名用户转换为常规用户。转换的用户将保留其所有数据。想要判断当前用户是否为匿名用户，可以试试 `+[LCAnonymousUtils isLinkedWithUser:]`:

```objective_c
if ([LCAnonymousUtils isLinkedWithUser:[LCUser currentUser]]) {
    // current user is anonymous
} else {
    // current user is regular
}
```

在无网络请求的情况下，也可以自动为您创建匿名用户，以便您能在应用程序开启之后立即与您的用户互动。如果您启用在应用程序开启时自动创建匿名用户的功能，则 `[LCUser currentUser]` 将不会为 `nil`。首次保存用户或与该用户相关的任何对象时，将在云中自动创建用户。在此之前，该用户的对象 ID 为 nil。启用自动创建用户功能将使得把数据与您的用户关联变得简单。例如，在您的 `application:didFinishLaunchingWithOptions:` 函数中，您可以写：

```objective_c
[LCUser enableAutomaticUser];
[[LCUser currentUser] incrementKey:@"RunCount"];
[LCDataManager saveObjectInBackground:[LCUser currentUser] block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

### 设置当前用户

如果您已经创建了自己的身份验证例程，或以其他方式使用户在服务器端登录，您现在可以将会话令牌传递到客户端并使用 `+[LCUserManager becomeInBackgroundWithSessionToken:block:]` 方法。这种方法将确保会话令牌在设置当前用户之前有效。

```objective_c
[LCUserManager becomeInBackgroundWithSessionToken:@"session-token-here" block:^(LCUser *user, NSError *error) {
    if (error) {
        // The token could not be validated.
    } else {
        // The current user is now set to user.
    }
}];
```

### 用户对象的安全性

`LCUser` 类默认是受保护的。储存在 `LCUser` 中的数据只能由用户自己修改。默认情况下，数据仍然可以被任何客户端读取。因此，一些 LCUser 对象通过身份验证后可以修改，但是另外一些是只读的。

特别地，您不能调用任何保存或删除方法，除非使用验证方法获取了 `LCUser`，如 `+[LCUserManager logInWithUsernameInBackground:password:block:]` 或 `+[LCUserManager signUpInBackground:block:]`。这确保只有用户可以修改他们自己的数据。

以下阐释了这一安全策略：

```objective_c
[LCUserManager logInWithUsernameInBackground:@"my_username" password:@"my_password" block:^(LCUser *user, NSError *error) {
    if (user) {
        
        user.username = @"my_new_username"; // attempt to change username
        [LCDataManager saveObjectInBackground:user block:^(BOOL succeeded, NSError *error) {
            if (succeeded) {
                
            }
        }];
    }
}];

// Get the user from a non-authenticated method
LCQuery *query = [LCUser query];
[LCUserManager getUserObjectWithId:@"userId" block:^(LCUser *userAgain, NSError *error) {
    
    userAgain.username = @"another_username";
    
    // This will throw an exception, since the LCUser is not authenticated
    [LCDataManager saveObjectInBackground:userAgain block:^(BOOL succeeded, NSError *error) {
        
    }];
}];
```

从 `currentUser` 获得的 `LCUser` 始终是已验证的。

若您要检查 `LCUser` 是否已验证，可以调用 `isAuthenticated` 方法。您不需要检查通过验证方法获取的 `LCUser` 对象的 `isAuthenticated`。

### 其他对象的安全性

适用于 `LCUser` 的安全模型同样适用于其他对象。对于任何对象，您都可以指定哪些用户可以查看该对象，哪些用户可以修改该对象。为支持这类安全性，每个对象都有一个*访问控制列表*，由 `LCACL` 类实施。

使用 `LCACL` 的最简单的方法就是规定某个对象只能由某一用户只读或只写。要创建这样一个对象，首先必须有一个已登录的 `LCUser`。然后，`ACLWithUser` 方法生成一个限制用户访问权限的 `LCACL`。像其他属性一样，保存对象时，对象的 ACL 会更新。这样，就会创建一条只能由当前用户访问的私有数据：

```objective_c
LCObject *privateNote = [LCObject objectWithclassName:@"Note"];
privateNote[@"content"] = @"This note is private!";
privateNote.ACL = [LCACL ACLWithUser:[LCUser currentUser]];
[LCDataManager saveObjectInBackground:privateNote block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

随后，该数据仅供当前用户访问，不过用户可以从其登录的所有设备进行访问。对于您希望对用户数据（如个人待办事项列表）启用多设备访问权限的应用程序，这项功能非常有用。

还可以按每个用户进行授权。您可以用 `setReadAccess:forUser:` 和 `setWriteAccess:forUser:` 单独向 `LCACL` 添加权限。例如，假设您要向一组用户发送消息，每个用户都有权限阅读和删除消息：

```objective_c
LCObject *groupMessage = [LCObject objectWithclassName:@"Message"];
LCACL *groupACL = [LCACL ACL];

// userList is an NSArray with the users we are sending this message to.
for (LCUser *user in userList) {
    [groupACL setReadAccess:YES forUser:user];
    [groupACL setWriteAccess:YES forUser:user];
}

groupMessage.ACL = groupACL;
[LCDataManager saveObjectInBackground:groupMessage block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您还可以用 `setPublicReadAccess:` 和 `setPublicWriteAccess:` 一次性向所有用户授权。该操作可实现让众多用户在消息公告板上发表评论的模式。例如，要创建仅作者可以编辑所有人可以阅读的帖子：

```objective_c
LCObject *publicPost = [LCObject objectWithclassName:@"Post"];
LCACL *postACL = [LCACL ACLWithUser:[LCUser currentUser]];
[postACL setPublicReadAccess:YES];
publicPost.ACL = postACL;
[LCDataManager saveObjectInBackground:publicPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

为了有助于确保默认情况下用户数据是受保护的，可以设置一个默认的 ACL 用于所有新建的 `LCObject`s：

```objective_c
[LCACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

在上述代码中，`setDefaultACL` 的第二个参数告诉 LC 须确保创建对象时分配的默认 ACL 允许当时的用户进行读取和写入。无此设置时，每次用户登录或退出时，您都需要重置 `defaultACL`，以便当前用户被适当赋予访问权限。有此设置时，您在无需明确授予不同权限的情况下，可以忽略对当前用户的更改。

默认的 ACL 让您能轻松创建遵循通用访问模式的应用程序。例如，像 Twitter 这样的应用程序，通常其用户内容是向全世界公开的，因此可能要像下面一样设置默认的 ACL：

```objective_c
LCACL *defaultACL = [LCACL ACL];
[defaultACL setPublicReadAccess:YES];
[LCACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

而像 Dropbox 这样的应用程序，除非明确授权，否则只有用户本人才能查看自己数据，所以您需要提供一种默认 ACL，使得只有当前用户才能获得授权：

```objective_c
[LCACL setDefaultACL:[LCACL ACL] withAccessForCurrentUser:YES];
```

对于将数据载入 LC 但是并未向任何用户授权访问这些数据的应用程序而言，您要提供一个拒绝当前用户的 ACL：

```objective_c
[LCACL setDefaultACL:[LCACL ACL] withAccessForCurrentUser:NO];
```

进行被禁止的操作，如删除您没有写权限的对象，会导致 `kLCErrorObjectNotFound` 错误代码。处于安全考虑，这样能阻止客户端区分存在但是受保护的对象 id 和完全不存在的对象 id。

### 修改密码

有时用户可能觉得自己账户的密码不够安全，要换一个。使用 `+[LCUserManager changePasswordWithNewPassword:oldPassword:block:]` 方法可以让用户安全地修改账户密码。

若要修改当前用户的密码，需要让用户填写账户密码(我们会验证改密码与当前账户是否匹配)，并提供一个新密码，然后调用：

```
[LCUserManager changePasswordWithNewPassword:newPwd oldPassword:oldPwd block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        // ...
    } else {
        // handle the error
    }
}];
```

### 重置密码

您刚刚将密码录入系统时就忘记密码的情况是存在的。这种情况下，我们的库提供一种方法让用户安全地重置密码。

若要开始密码重置流程，让用户填写电子邮箱地址，并调用：

```objective_c
[LCUserManager requestPasswordResetForEmailInBackground:@"email@example.com"];
```

该操作将尝试将给定的电子邮箱与用户电子邮箱或用户名字段进行匹配，并向用户发送密码重置邮件。这样，您可以选择让用户使用其电子邮箱作为用户名，或者您可以单独收集它并把它储存在电子邮箱字段。

密码重置流程如下：

1. 用户输入电子邮箱地址，请求重置密码。
2. LC 向其电子邮箱发送一封包含专用密码重置链接的邮件。
3. 用户点击重置链接，进入专用 LC 页面，用户在该页面输入新密码。
4. 用户输入新密码。现在，用户的密码已经被重置为他们指定的值。

**注意**：该流程中的消息传送操作将根据您在 LC 上创建该应用时指定的名称引用您的应用程序。

### 查询

若要查询用户表，您需要使用特殊的用户查询：

```objective_c
LCQuery *query = [LCUser query];
[query whereKey:@"gender" equalTo:@"female"]; // find all the women
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *girls, NSError *error) {
    NSLog(@"%@", girls);
}];
```

此外，您可以使用 `+[LCUserManager getUserObjectWithId:block:]` 通过 id 找到 `LCUser`。

### 关联

关联是让 `LCUser` 立即可用。例如，假设您正在创建一款博客应用程序。若要为用户保存新的帖子并检索其所有帖子：

```objective_c
LCUser *user = [LCUser currentUser];
// Make a new post
LCObject *post = [LCObject objectWithclassName:@"Post"];
post[@"title"] = @"My New Post";
post[@"body"] = @"This is some great content.";
post[@"user"] = user;
[LCDataManager saveObjectInBackground:post block:^(BOOL succeeded, NSError *error) {
    
    if (succeeded) {
        
        // Find all posts by the current user
        LCQuery *query = [LCQuery queryWithclassName:@"Post"];
        [query whereKey:@"user" equalTo:user];
        [LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *usersPosts, NSError *error) {
            NSLog(@"%@", usersPosts);
        }];
    }
}];
```

### Facebook 用户

LC 提供了一种简单的方法，用于将 Facebook 与您的应用程序整合起来。Facebook SDK 可以与我们的 SDK 一起使用，并且与 `LCUser` 类整合，从而使您能轻松将用户与他们的 Facebook 身份关联。

利用我们的 Facebook 整合功能，您可以将通过验证的 Facebook 用户与 `LCUser` 相关联。只需几行代码，您就可以在应用程序中提供“使用 Facebook 登陆”(log in with Facebook)选项，并能够将用户数据保存在 LC 中。

#### 设置

若要通过 LC 使用 Facebook，您需要：

1. [设置 Facebook 应用程序][set up a facebook app], 若您尚未设置。
2. 在您的 LC 应用设置页面添加应用程序的 Facebook 应用 ID。
3. 按照 Facebook 的 [Facebook SDK 入门][getting started with the facebook sdk]提供的说明，创建与 Facebook SDK 关联的应用程序。仔细检查并确认您已经把 FacebookAppID 和 URL Scheme 添加至应用程序的 .plist 文件。
4. 下载解压 [LeapCloud iOS SDK][LC_DOCS_LINK_PLACEHOLDER_SDK_CORE_DOWNLOAD_IOS]，如果您还没有。
5. 把 `LCFacebookUtils.framework` 添加到您的 Xcode 项目中。

还有两步。首先，把下面的代码添加到您引用的 `application:didFinishLaunchingWithOptions:` 方法中。

```objective_c
#import <LCFacebookUtils/LCFacebookUtils.h>

@implementation AppDelegate

- (void)application:(UIApplication *)application didFinishLaunchWithOptions:(NSDictionary *)options {
   	[LC setApplicationId:@"LCAppId" clientKey:@"LCClientKey"];
   	[LCFacebookUtils initializeFacebook];
}

@end
```

然后，在 app delegate 中添加以下处理器。

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

LC 用户可通过以下两种主要方法使用 Facebook：(1) 以 Facebook 用户身份登录（注册），并创建 LCUser，或者 (2) 将 Facebook 与已有的 LCUser 关联。

#### 登录与注册

`LCUser` 提供一种方法让您的用户可以通过 Facebook 登录或注册。这可以通过采用 `logInWithPermissions:` 方法来完成，例如：

```objective_c
[LCFacebookUtils logInWithPermissions:permissions block:^(LCUser *user, NSError *error) {
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
3. 我们的 SDK 会收到 Facebook 数据并将其保存在 LCUser 中。如果是基于 Facebook ID 的新用户，那么该用户随后会被创建。
4. 您的代码块(block)被调用，并传回这个用户对象。

权限(permissions)参数是指定您的应用程序向 Facebook 用户要求什么读取权限的一系列字符串。这些权限必须只能包括读取权限。`LCUser` 整合不要求权限即时可用。[在 Facebook 开发人员指南上阅读关于权限的更多信息][facebook permissions]。

要想获得用户发布权限，以便您的应用程序能执行类似代表用户发布状态更新帖的操作，您必须调用 `+[LCFacebookUtils reauthorizeUser:withPublishPermissions:audience:block]`：

```objective_c
[LCFacebookUtils reauthorizeUser:[LCUser currentUser]
              withPublishPermissions:@[@"publish_actions"]
                            audience:FBSessionDefaultAudienceFriends
                               block:^(BOOL succeeded, NSError *error) {
                                   if (succeeded) {
                                       // Your app now has publishing permissions for the user
                                   }
                               }];
```

您可以自行决定在用户验证后记录从 Facebook 用户处获取的所需的任何数据。要完成这一操作，您需要通过 Facebook SDK 进行一项图表查询。

#### 关联

若您想要将已有的 `LCUser` 与 Facebook 帐户关联起来，您可以按以下方式进行关联：

```objective_c
if (![LCFacebookUtils isLinkedWithUser:user]) {
    [LCFacebookUtils linkUser:user permissions:nil block:^(BOOL succeeded, NSError *error) {
        if (succeeded) {
            NSLog(@"Woohoo, user logged in with Facebook!");
        }
    }];
}
```

关联步骤与登录非常类似。区别在于，成功登陆以后，将会使用来自 Facebook 的信息更新当前的 `LCUser`。今后通过 Facebook 进行登录会使用已有账户。

若您想要取消用户与 Facebook 的关联，操作如下：

```objective_c
[LCFacebookUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"The user is no longer associated with their Facebook account.");
    }
}];
```

#### Facebook SDK 与 LC

Facebook iOS SDK 提供了很多帮助工具类，用来与 Facebook API 互动。通常，您会使用 `FBRequest` 类代表您的登录用户与 Facebook 互动。若要了解有关 Facebook SDK 的更多内容，[请点击这里][facebook sdk reference]。

我们的库为您管理 `FBSession` 对象。您只需调用 `[LCFacebookUtils session]` 来访问会话实例，其随后能传给 `FBRequest`。

### Twitter 用户

与 Facebook 一样，LC 也提供了一种将 Twitter 身份验证与您的应用程序整合起来的简单方法。LC SDK 提供了一种验证 Twitter 帐户并将之与您的 `LCUser` 关联的简单方法。只需几行代码，您就可以在您的应用程序中提供“使用 Twitter 登录"(log in with Twitter)选项，并能够将其数据保存在 LC 中。

#### 设置

若要通过 LC 使用 Twitter，您需要：

1. [设置 Twitter 应用][set up twitter app], 若您尚未设置。
2. 在您的 LC 应用设置页面添加您应用的 Twitter 密钥(consumer key)。
3. 当要求您为 Twitter 应用程序指定 “Callback URL”（回调地址），请插入有效地址。它不会被您的 iOS 或 Android 应用程序使用，但是在通过 Twitter 启用身份验证时非常必要。
4. 将 `Accounts.framework` 和 `Social.framework` 库添加至您的 Xcode 项目。
5. 在初始化 LC SDK 的地方加入以下代码，比如在 `application:didFinishLaunchingWithOptions:` 方法中。

```objective_c
[LCTwitterUtils initializeWithConsumerKey:@"YOUR CONSUMER KEY"
consumerSecret:@"YOUR CONSUMER SECRET"];
```

若您遇到与 Twitter 相关的任何问题，请查阅 [Twitter 官方文档][twitter documentation]。

LC 用户可通过以下两种主要方法使用 Twitter：(1) 以 Twitter 用户身份登录，并创建 LCUser，或者 (2) 将 Twitter 与已有的 `LCUser` 关联。

#### 登录与注册

`LCTwitterUtils` 提供一种方法让您的 `LCUser` 可以通过 `Twitter` 登录或注册。这可以使用 `logInWithBlock` 方法实现：

```objective_c
[LCTwitterUtils logInWithBlock:^(LCUser *user, NSError *error) {
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
3. 我们的 SDK 会收到 Twitter 数据并将其保存在 `LCUser` 中。如果是基于 Twitter 句柄的新用户，那么该用户随后会被创建。
4. 您的 `block` 被调用并带回这个用户对象(user)。

#### 关联

若您想要将已有的 `LCUser` 与 Twitter 帐户关联起来，您可以按以下方式进行关联：

```objective_c
if (![LCTwitterUtils isLinkedWithUser:user]) {
    [LCTwitterUtils linkUser:user block:^(BOOL succeeded, NSError *error) {
        if ([LCTwitterUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user logged in with Twitter!");
        }
    }];
}
```

关联时发生的步骤与登录非常类似。区别是在成功登录中，将会使用来自 Twitter 的信息更新当前的 LCUser。今后通过 Twitter 进行的登录会使用已存在的账户。

若您想要取消用户与 Twitter 的关联，操作如下：

```objective_c
[LCTwitterUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError *error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Twitter account.");
    }
}];
```

#### Twitter API 调用

在您的应用程序有与 Twitter 关联的 `LCUser` 的情况下，我们的 SDK 提供一种将您的 API HTTP 请求注册到 [Twitter REST API][twitter rest api] 的简单方法。若想通过我们的 API 发出请求，您可以使用 `LCTwitterUtils` 提供的 `LC_Twitter` 单元集：

```objective_c
NSURL *verify = [NSURL URLWithString:@"https://api.twitter.com/1/account/verify_credentials.json"];
NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:verify];
[[LCTwitterUtils twitter] signRequest:request];
NSURLResponse *response = nil;
NSError *error = nil;
NSData *data = [NSURLConnection sendSynchronousRequest:request
                                     returningResponse:&response
                                                 error:&error];
```

## 角色

随着应用程序使用范围和用户数量的不断壮大，对于各项数据的访问权限，您可能需要更强硬的控制权，与用户关联的 ACL 所提供的控制并不能符合要求。为满足这种需求，LC 支持[基于角色的访问控制][role-based access control]。根据角色对拥有您 LC 数据的公共访问权限的用户进行分组是一种合乎逻辑的方法。角色是包含用户和其他角色的命名对象。给某一角色授予的任何权限也意味着将权限授予拥有该角色的用户，以及授予拥有该角色所含角色的任何用户。

例如，在含有分类内容的应用程序中，有些用户被设定为“版主”，他们可以修改和删除其他用户创建的内容。还有一些用户是“管理员”，他们与版主拥有相同的权利，但是还可以修改应用程序的全局设置。通过将用户添加到这些角色中，您可以让新用户成为版主或管理员，而不必手动向各用户授予每个资源的权限。

我们提供一个类名为 `LCRole` 的专业类，代表客户端代码中的角色对象。`LCRole` 是 `LCObject` 的一个子类，两者具有完全相同的特性，例如灵活架构(flexible schema)和键值接口。`LCObject` 上的所有方法也存在于 `LCRole` 中。区别是 `LCRole` 有一些专门用于角色管理的附加特性。

### 属性

`LCRole` 有几种可以将其与 `LCObject` 区分开的属性：

- `name`：角色名称。该值为必填，只能在创建角色时设置一次。名称只能包含字母数字字符、空格、- 或 _。该名称用于识别角色，不需要其对象 Id 即可达到这个目的。
- `users`：与用户集的一种*关系*，该用户集将继承其母级角色所拥有的权限。
- `roles`：与角色集的一种*关系*，该角色集所包含的用户和角色将继承该母级角色所拥有的权限。

### 角色对象的安全性

`LCRole` 使用与 LC 上的所有其他对象相同的安全方案 (ACL)，除非它要求特别设置一个 ACL。一般情况下，只有拥有高级权限的用户（如，主用户或管理员）才能创建或修改角色，因此您应该相应地定义其 ACL。请注意，如果您授予用户对 `LCRole` 的写入权，那么该用户可以将其他用户添加到角色中，甚至可以完全删除该角色。

若要创建新的 `LCRole`，您可以编写：

```objective_c
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
LCACL *roleACL = [LCACL ACL];
[roleACL setPublicReadAccess:YES];
LCRole *role = [LCRole roleWithName:@"Administrator" acl:roleACL];
[LCDataManager saveObjectInBackground:role block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您可以通过 `LCRole` 上的“用户”和“角色”关系，添加应该继承新角色权限的用户和角色：

```objective_c
LCRole *role = [LCRole roleWithName:roleName acl:roleACL];
for (LCUser *user in usersToAddToRole) {
    [role.users addObject:user];
}
for (LCRole *childRole in rolesToAddToRole) {
    [role.roles addObject:childRole];
}
[LCDataManager saveObjectInBackground:role block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

给角色指定 ACL 时要格外小心，确保只有拥有相关权限的人才能对它们进行修改。

### 其他对象的安全性

现在您已经创建了在应用程序中使用的角色集，您可以用带 ACL 的角色确定角色所含用户将拥有的特权。每个 `LCObject` 可以指定一个 `LCACL`，从而提供一个访问控制列表，指定应该向哪些用户和角色授予对象读写访问权限。

向对象授予角色读写权限非常简单。您可以使用 `LCRole`：

```objective_c
LCRole *moderators = /* Query for some LCRole */;
LCObject *wallPost = [LCObject objectWithclassName:@"WallPost"];
LCACL *postACL = [LCACL ACL];
[postACL setWriteAccess:YES forRole:moderators];
wallPost.ACL = postACL;
[LCDataManager saveObjectInBackground:wallPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

向 ACL 指定角色名称可以避免查询角色：

```objective_c
LCObject *wallPost = [LCObject objectWithclassName:@"WallPost"];
LCACL *postACL = [LCACL ACL];
[postACL setWriteAccess:YES forRoleWithName:@"Moderators"];
wallPost.ACL = postACL;
[LCDataManager saveObjectInBackground:wallPost block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

向您的应用程序指定默认 ACL 时也能使用基于角色的 `LCACL`，这样可以在向用户授予具有额外特权的访问权限时轻松保护您用户的数据。例如，有版主的论坛应用程序可以指定默认 ACL，如下：

```objective_c
LCACL *defaultACL = [LCACL ACL];
// Everybody can read objects created by this user
[defaultACL setPublicReadAccess:YES];
// Moderators can also modify these objects
[defaultACL setWriteAccess:YES forRoleWithName:@"Moderators"];
// And the user can read and modify its own objects
[LCACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

### 角色层次

如上所述，一个角色可能包含其他角色，两个角色之间可能存在母子关系。这种关系的结果是，授予给母级角色的任何权限实际上也授予给其包含的所有子角色。

这些类型的关系在包含由用户管理的内容的应用程序中很常见，如论坛。一些小的用户子集是“管理员”，拥有最高级别的访问权，可以修改应用程序的设置、创建新论坛、设置全局消息等。另外一个用户集是“版主”，负责确保用户创建的内容适当。拥有管理员权限的任何用户还应被授予任何版主拥有的权限。若要建立这种关系，您应该让“管理员”角色成为“版主”的子角色，如下所示：

```objective_c
LCRole *administrators = /* Your "Administrators" role */;
LCRole *moderators = /* Your "Moderators" role */;
[moderators.roles addObject:administrators];
[LCDataManager saveObjectInBackground:moderators block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

## 文件

### LCFile

`LCFile` 让您可以把应用程序文件储存在云端，以应对文件太大或太多，不适宜放入普通 `LCObject` 的情况。最常见的用例是储存图片，但是您还可以用它储存文件、视频、音乐以及其他任何二进制数据（大小不超过 100 MB）。

`LCFile` 上手很容易。首先，你要由 `NSData` 类型的数据，然后创建一个 `LCFile` 实例。下面的例子中，我们只是使用一个字符串：

```objective_c
NSData *data = [@"Working at LC is great!" dataUsingEncoding:NSUTF8StringEncoding];
LCFile *file = [LCFile fileWithName:@"resume.txt" data:data];
```

**注意**，在这个例子中，我们把文件命名为 resume.txt。这里要注意两点：

- 您不需要担心文件名冲突。每次上传都会获得一个唯一标识符，所以上传多个文件名为 resume.txt 的文件不同出现任何问题。
- 重要的是，您要提供一个带扩展名的文件名。这样 LC 就能够判断文件类型，并对文件进行相应的处理。所以，若您要储存 PNG 图片，务必使文件名以 .png 结尾。

然后，您可以把文件保存到云中。与 `LCObject` 相同，使用 `LCFileManager` 上的 save 方法。

```objective_c
[LCFileManager saveFileInBackground:file block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

最后，保存完成后，您可以像其他数据一样把 `LCFile` 与 `LCObject` 关联起来：

```objective_c
LCObject *jobApplication = [LCObject objectWithclassName:@"JobApplication"]
jobApplication[@"applicantName"] = @"Joe Smith";
jobApplication[@"applicantResumeFile"] = file;
[LCDataManager saveObjectInBackground:jobApplication block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您可以调用 `LCFileManager` 上的 `getDataOfFileInBackground:block:` 重新获取此数据。这里我们从另一 `JobApplication` 对象获取恢复文件：

```objective_c
LCFile *applicantResume = anotherApplication[@"applicantResumeFile"];
[LCFileManager getDataOfFileInBackground:file block:^(NSData *data, NSError *err) {
    if (!error) {
        NSData *resumeData = data;
    }
}];
```

### 图像

通过将图片转换成 `NSData` 然后使用 `LCFile` 就可以轻松地储存图片。假设您有一个文件名为 image 的 `UIImage`，并想把它另存为 `LCFile`：

```objective_c
NSData *imageData = UIImagePNGRepresentation(image);
LCFile *imageFile = [LCFile fileWithName:@"image.png" data:imageData];
 
LCObject *userPhoto = [LCObject objectWithclassName:@"UserPhoto"];
userPhoto[@"imageName"] = @"My trip to Hawaii!";
userPhoto[@"imageFile"] = imageFile;
[userPhoto saveInBackground];
[LCDataManager saveObjectInBackground:userPhoto block:^(BOOL succeeded, NSError *error) {
    // Handle success or failure here ...
}];
```

您的 `LCFile` 将作为保存操作的一部分被上传到 `userPhoto` 对象。还可以跟踪 `LCFile` 的*上传和下载进度*。

您可以调用 `+[LCFileManager getDataOfFileInBackground:block:]` 重新获取此图像。这里我们从另一个名为 `anotherPhoto` 的 `UserPhoto` 获取图像文件：

```objective_c
LCFile *userImageFile = anotherPhoto[@"imageFile"];
[LCFileManager getDataOfFileInBackground:userImageFile block:^(NSData *imageData, NSError *error) {
    if (!error) {
        UIImage *image = [UIImage imageWithData:imageData];
    }
}];
```

### 进度

使用 `+[LCFileManager saveInBackgroundWithBlock:progressBlock:]` 和 `+[LCFileManager getDataInBackgroundWithBlock:progressBlock:]` 可以分别轻松了解 `LCFile` 的上传和下载进度。例如：

您可以用 [REST API][LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS] 删除对象引用的文件。您需要提供主密钥才能删除文件。

如果您的文件未被应用中的任何对象引用，则不能通过 [REST API][LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS] 删除它们。您可以在应用的“设置”页面请求清理未使用的文件。请记住，该操作可能会破坏依赖于访问未被引用文件（通过其地址属性）的功能。当前与对象关联的文件将不会受到影响。

## GeoPoint

LC 让您可以把真实的纬度和经度坐标与对象关联起来。通过在 `LCObject` 中添加 LCGeoPoint，可以在查询时实现将对象与参考点的距离临近性纳入考虑。这可以让您轻松某些事情，如找出距离与某个用户最近的其他用户或者距离某个用户最近的地标。

### LCGeoPoint

要将某个地点与对象联系起来，您首先要创建一个 `LCGeoPoint`。例如，要创建一个纬度为 40.0 度，经度为 -30.0 的点：

```objective_c
LCGeoPoint *point = [LCGeoPoint geoPointWithLatitude:40.0 longitude:-30.0];
```

然后，该点被作为常规字段储存在对象中。

```objective_c
placeObject[@"location"] = point;
```

**注意：**目前，一个类中只有一个键可以是 `LCGeoPoint`。


#### 获取用户当前位置

`LCGeoPoint` 也提供了用于提取用户当前位置的辅助方法。这可以通过 `geoPointForCurrentLocationInBackground:` 实现：

```objective_c
[LCGeoPoint geoPointForCurrentLocationInBackground:^(LCGeoPoint *geoPoint, NSError *error) {
    if (!error) {
        // do something with the new geoPoint
    }
}];
```

该代码运行时，会出现以下情况：

1. 内部 `CLLocationManager` 开始监听位置更新（通过 `startsUpdatingLocation`）。
2. 收到位置后，位置管理器将停止监听位置更新（通过 `stopsUpdatingLocation`），并且将根据新位置创建 `LCGeoPoint`。位置管理器出错时也会停止监听更新，并且返回 `NSError`。
3. 您的 `block` 被 `LCGeoPoint` 调用。

对于直接选择使用 `CLLocationManager` 的用户，我们还提供 `+geoPointWithLocation:` 构造函数，用于将 `CLLocation` 直接转换成 `LCGeoPoint` － 这点对于需要不断轮询的应用程序而言非常有用。

### Geo 查询

有了一些具有空间坐标的对象后，找到哪些对象距离某个点最近将会产生很好的效应。这可以通过使用 whereKey:nearGeoPoint: 对 LCQuery 添加另一限制条件完成。举例而言，找出距离某个用户最近的十个地点的方法如下：

```objective_c
// User's location
LCGeoPoint *userGeoPoint = userObject[@"location"];

// Create a query for places
LCQuery *query = [LCQuery queryWithclassName:@"PlaceObject"];

// Interested in locations near user.
[query whereKey:@"location" nearGeoPoint:userGeoPoint];

// Limit what could be a lot of points.
query.limit = 10;

// Final list of objects
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *placesObjects, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with placesObjects
    }
}];
```

此时，`placesObjects` 是按照与 `userGeoPoint` 的距离（由近及远）排列的一组对象。注意，若应用另一个 `orderByAscending:`/`orderByDescending:` 限制条件，该限制条件将优先于距离顺序。

若要用距离来限定获得哪些结果，请使用 `whereKey:nearGeoPoint:withinMiles:`、`whereKey:nearGeoPoint:withinKilometers:` 和 `whereKey:nearGeoPoint:withinRadians:`。

您还可以查询包含在特定区域内的对象集合。若要查找位于某个矩形区域内的对象，请将 `whereKey:withinGeoBoxFromSouthwest:toNortheast:` 限制条件添加至您的 `LCQuery`。

```objective_c
LCGeoPoint *swOfSF = [LCGeoPoint geoPointWithLatitude:37.708813 longitude:-122.526398];
LCGeoPoint *neOfSF = [LCGeoPoint geoPointWithLatitude:37.822802 longitude:-122.373962];
LCQuery *query = [LCQuery queryWithclassName:@"PizzaPlaceObject"];
[query whereKey:@"location" withinGeoBoxFromSouthwest:swOfSF toNortheast:neOfSF];
[LCQueryManager findObjectsInBackgroundWithQuery:query block:^(NSArray *pizzaPlacesInSF, NSError *error) {
    if (error) {
        // there was an error
    } else {
        // do something with pizzaPlacesInSF
    }
}];
```

### 注意事项

目前需要注意以下几点：

1. 每个 `LCObject` 类仅可能有一个带 `LCGeoPoint` 对象的键。
2. 点不应等于或大于最大范围值。纬度不能为 -90.0 或 90.0。经度不能为 -180.0 或 180.0。若纬度或经度设置超出边界，会引起错误。

## 云函数

可以使用 `+[LCCloudCode callFunctionInBackground:withParameters:block:]` 方法调用云函数。例如，要调用名称为 `hello` 的云函数：

```objective_c
[LCCloudCode callFunctionInBackground:@"hello"
                      	 withParameters:@{} 
                                 block:^(NSString *result, NSError *error) {
   if (!error) {
     // result is @"Hello world!"
   }
}];
```

## 处理错误

LC 有几种简单的模式可以发现您代码中错误并在进行处理。

您可能会遇到两类错误。第一类是关于您在使用 SDK 时的逻辑错误。这类错误会导致异常，同时也会打印出来(有些并不会抛出异常，只是打印出来，而且不对数据进行任何更改)。**请留意 Xcode console 中的日志，这类异常日志会有类似 “<LC> Exception:” 的开头**。相关示例请参阅以下代码：

```objective_c
LCUser *user = [LCUser user];
[LCUserManager signUpInBackground:user block:nil];
```

这将抛出一个 `NSInternalInconsistencyException`，因为要求的属性（`username` 和 `password`）尚未设置就调用了 `signUp`。

第二类是通过网络与 LC 云交互时出现的错误。这些错误要么关乎与云有关的问题，要么关乎与执行所请求操作相关的问题。我们再来看一个示例：

```objective_c
- (void)getMyNote {
    [LCQueryManager getObjectInBackgroundWithclass:@"Note" objectId:@"thisObjectIdDoesntExist" block:^(LCObject *object, NSError *error) {
        [self callbackForGet:object error:error]
    }];
}
```

在上面的代码中，我们尝试用不存在的 `objectId` 提取一个对象。LC 云将返回一个错误，错误代码设置在 `code` 中，错误消息设置在该错误的 `userInfo` 中。可以使用以下代码在您的回调中正确处理错误：

```objective_c
- (void)callbackForGet:(LCObject *)result error:(NSError *)error {
    if (result) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLCErrorObjectNotFound) {
            NSLog(@"Uh oh, we couldn't find the object!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}
```

设备无法连接到 LC 云端也可能造成查询失败。以下是用于处理上述情况的同一组回调代码，但其中包含了一些额外代码：

```objective_c
- (void)callbackForGet:(LCObject *)result error:(NSError *)error {
    if (result) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLCErrorObjectNotFound) {
            NSLog(@"Uh oh, we couldn't find the object!");
            // Now also check for connection errors:
        } else if ([error code] == kLCErrorConnectionFailed) {
            NSLog(@"Uh oh, we couldn't even connect to the LC!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}
```

回调 block 带有一个 BOOL 类型的参数，这个值将告诉您操作成功与否。例如，这可能是 `LCDataManager` 的 `+saveObjectInBackground:block:` 方法的 block 实现：

```objective_c
[LCDataManager saveObjectInBackground:nil block:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        NSLog(@"Everything went fine!");
    } else {
        if ([error code] == kLCErrorConnectionFailed) {
            NSLog(@"Uh oh, we couldn't even connect to the LC!");
        } else if (error) {
            NSLog(@"Error: %@", [error userInfo][@"error"]);
        }
    }
}];
```

默认情况下，所有连接的超时时间是 60 秒。

如需了解所有可能的 `NSError` 类型，请查看 [API Reference][LC_DOCS_LINK_PLACEHOLDER_API_REF_IOS] 的 `LCErrorCode` 部分。

## 安全

我们强烈建议您以尽可能多地限制访问数据的方式创建应用程序。秉承此原则，我们建议您，初始化应用程序之后，启用[自动创建匿名用户功能](#匿名用户)(automatic anonymous user creation)和基于当前用户[指定默认 ACL](#其他对象的安全性)。逐个对象明确设置公共可写性（和潜在公共可读性），以便保护您的数据免遭未经授权的访问。

考虑将以下代码添加到您应用程序启动中：

```objective_c
[LCUser enableAutomaticUser];
LCACL *defaultACL = [LCACL ACL];
// Optionally enable public read access while disabling public write access.
// [defaultACL setPublicReadAccess:YES];
[LCACL setDefaultACL:defaultACL withAccessForCurrentUser:YES];
```

### 设置

除进行安全编码以外，请审核您应用程序的设置页面，以根据您的需求选择关于应用程序访问限制的选项。例如，如果用户应该无法在没有与其应用程序关联的 Facebook 帐户的情况下登录，则禁用所有其他登录机制。指定您的 Facebook 应用程序 ID、Twitter 帐户密钥和其他类似信息，以启用对用户登录的服务器端验证。


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