# 应用内社交

## 简介

应用内社交，在应用开发中出现的场景非常多，包括用户间关注（好友）、朋友圈（时间线）、状态广场、互动（评论、点赞）等常用功能，应用内社交可以认为是一个应用基础通用功能。

## 集成

**重要:** `MaxSocial.framework` 依赖于 `MaxLeap.framework`，如果还没集成 `MaxLeap.framework`, 建议先看下[快速开始](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)，先集成并配置好 `MaxLeap.framework`.

### 使用 `Cocoapods` 安装

在 `Podfile` 中加上下面这行:

```
pod 'MaxSocial'
```

打开应用 `终端`，执行以下命令：

```
$ cd your_project_dir
$ pod install
```

### 手动安装

1. [下载并解压最新 SDK](https://github.com/MaxLeap/SDK-iOS/releases)
2. 把解压得到的 `MaxSoical.framework` 拖到项目中。

## 使用方法

首先根据 `userId` 创建一个用户对象：

```
MaxSocialUser *user = [MaxSocialUser userWithId:@"userId"];
```

### 用户关系

关注其他用户：

```
MaxSocialUser *user = [MaxSocialUser userWithId:@"userId"];
NSString *anotherUserId = @"anotherUserId";

// user 关注 anotherUser
// reverse 表示是否要自动反向关注
[user followUser:anotherUserId reverse:YES block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
	// 关注的实现方式是插入一条 relation 数据，表示 A 关注了 B，如果自动反向关注，则创建两条这样的数据
	// 结果数组中会有两个字典对象
    NSLog(@"result: %@, error: %@", objects, error);
}];
```

取消关注：

```
MaxSocialUser *user = [MaxSocialUser userWithId:@"userId"];
NSString *anotherUserId = @"anotherUserId";

[user unfollowUser:anotherUserId block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

查询是否关注了某用户：

```
NSString *a = @"sd";
NSString *b = @"asdgaeesdage";
[MaxSocialUser queryWhetherUser:a isFollowingUser:b resultBlock:^(BOOL isFollowing, BOOL isReverse, NSError * _Nonnull error) {
    // isFollowing 为 YES 表示 a 关注了 b
    // isReverse 为 YES 表示 a 和 b 相互关注了
}];
```

屏蔽某个人，A 屏蔽：

```
// A 屏蔽 B, 假如，B 还未关注 A，调用这个接口后，B 会关注 A，但不能看 A 的动态
NSString *userBId = @"";
BOOL block = YES; // 是否屏蔽 userB，YES 表示屏蔽，NO 表示取消屏蔽
[userA block:block user:userBId completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

获取关注列表，返回的列表是 `MaxSocialRelationInfo` 对象数组：

```
MaxSocialQuery *query = [MaxSocialQuery new]; // 使用默认查询条件，也可以对其属性进行更改
[user getFolloweesWithQuery:query block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"followeeeeeees: %@, error: %@", objects, error);
}];
```

获取粉丝列表，返回的列表是 `MaxSocialRelationInfo` 对象数组：
**注意：**这个接口跟上面的接口只相差一个字母，是 **get followers**。

```
MaxSocialQuery *query = [MaxSocialQuery new]; // 使用默认查询条件，也可以对其属性进行更改
[user getFollowersWithQuery:query block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"followers: %@, error: %@", objects, error);
}];
```

根据 relation 的 `objectId` 获取这条数据:

```
NSString *relationInfoId = @"";
[self.user getRelationInfoWithId:relationInfoId block:^(MaxSocialRelationInfo * _Nullable relation, NSError * _Nullable error) {
	// ...
}];
```

根据 relation 的 `objectId` 删除这条数据：

```
NSString *relationInfoId = nil;
[user deleteRelationInfoWithId:relationInfoId block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

### 位置

更新用户的地理位置：

```
MaxSocialLocation *location = [MaxSocialLocation locationWithLatitude:22 longitude:35];
[user updateLocation:location block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

获取用户的地理位置信息：

```
[user getLocationInfoWithBlock:^(MaxSocialLocationInfo * _Nullable location, NSError * _Nullable error) {
    NSLog(@"user location: %@, error: %@", location, error);
}];
```

删除用户的地理位置信息：

```
NSString *locatioinInfoId = @"";
[self.user deleteLocationInfoWithObjectId:locatioinInfoId block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

查询附近的用户，实际返回的是一个 `MaxSocialLocationInfo` 对象列表，可以通过 
`MaxSocialLocationInfo` 的 `userId` 属性获取附近用户的信息：

```
MaxSocialLocation *location = [MaxSocialLocation locationWithLatitude:22 longitude:35];
[user queryUserNearLocation:location distance:10086 block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"People nearby: %@, error: %@", objects, error);
}];
```

根据 `MaxSocialLocationInfo` 的 `objectId` 获取详细内容：

```
NSString *locationInfoId = @"";
[user fetchLocationInfoWithObjectId:locationInfoId block:^(MaxSocialLocationInfo * _Nullable location, NSError * _Nullable error) {
	 // ...
}];
```

### 说说

发布说说：

可以发表四种类型的说说：1. 纯文字，2. 纯链接，3. 文字 + 链接，4. 文字 + 图片<br>
同时可以控制是否发布说说到广场上，发布到广场上的说说会同时出现在朋友圈和广场，否则说说只会出现在朋友圈

```
// 纯文字
MaxSocialShuoShuoContent *content = [MaxSocialShuoShuoContent contentWithText:@"text"];

// 纯链接
MaxSocialShuoShuoContent *content = [MaxSocialShuoShuoContent contentWithURL:[NSURL URLWithString:@"http://www.google.com"]];

// 文字 + 链接
status.content = [MaxSocialShuoShuoContent contentWithText:@"test" url:[NSURL URLWithString:@"http://www.google.com"]];

// 一条带文字和图片的说说
MaxSocialShuoShuoContent *content = [MaxSocialShuoShuoContent contentWithText:@"text" imagePaths:imagePaths];

// 创建说说对象
MaxSocialShuoShuo *shuoshuo = [MaxSocialShuoShuo new];
shuoshuo.content = content;

// toSquare 控制是否将说说发布到广场。
// YES 表示发布到广场，说说将同时出现在广场和朋友圈；NO 表示只发布到朋友圈，说说将不会出现在广场上
BOOL toSquare = YES;

// 发表说说
[self.user postShuoShuo:shuoshuo toSquare:toSquare block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

根据说说的 `objectId` 获取说说详细数据：

```
NSString *shuoId = @"";
[self.user fetchShuoShuoWithId:shuoId block:^(MaxSocialShuoShuo * _Nullable status, NSError * _Nullable error) {
	// ...
}];
```

删除说说：

```
NSString *shuoId = @"";
[self.user deleteShuoShuoWithId:shuoId block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

获取说说的图片名字列表，图片名字即图片的 ID，可以用来下载图片：

```
NSString *shuoId = @"";
[user getImageNamesOfShuoShuo:shuoId block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"image names: %@, error: %@", objects, error);
}];
```

下载说说中的图片：

```
NSString *shuoId = @"";
NSString *imgName = @"";
[self.user downloadImageWithName:imgName ofShuoShuo:shuoId progress:^(int percentDone) {
    NSLog(@"download progress: %d%%", percentDone);
} completion:^(NSString * _Nullable string, NSError * _Nullable error) {
    NSLog(@"downloaded image path: %@", string);
}];
```

删除说说的图片：

```
NSString *shuoId;
[self.user deleteImagesOfShuoShuo:shuoId block:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

获取用户自己的说说列表：

```
MaxSocialQuery *query = [MaxSocialQuery new]; // default query
[self.user getShuoShuoWithQuery:query block:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
    NSLog(@"self shuoshuo: %@, error: %@", result, error);
}];
```

获取广场上最新的说说：

```
MaxSocialQuery *query = [MaxSocialQuery new]; // default query
[self.user getLatestShuoShuoInSquareWithQuery:query block:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
    NSLog(@"latest shuoshuo on square: %@, error: %@", result, error);
}];
```

获取朋友圈最新的说说：

```
MaxSocialQuery *query = [MaxSocialQuery new]; // default query
[self.user getLatestShuoShuoInFriendCycleWithQuery:query block:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
    NSLog(@"latest shuoshuo on friend cycle: %@, error: %@", result, error);
    fulfill();
}];
```

获取附近的说说：

```
MaxSocialLocation *location = [MaxSocialLocation locationWithLatitude:22 longitude:34];
[self.user getShuoShuoNearLocation:location distance:10086 block:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
    NSLog(@"nearest shuoshuo: %@, error: %@", result, error);
}];
```

获取用户附近的说说列表：

```
MaxSocialLocation *location = [MaxSocialLocation locationWithLatitude:22 longitude:34];
[user getShuoShuoNearLocation:location distance:10086 block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"nearest status: %@, error: %@", objects, error);
}];
```

### 评论

评论分为两种：文字评论和点赞

对说说添加文字评论：

```
[user createCommentForShuoShuo:@"shuoId" withContent:@"hello" block:^(MaxSocialComment * _Nullable comment, NSError * _Nullable error) {
	// ...
}];
```

对说说点赞：

```
[user likeShuoShuo:@"shuoId" block:^(MaxSocialComment * _Nullable comment, NSError * _Nullable error) {
	// comment.isLike 应该为 YES.
	// 可以通过评论对象 comment 的 isLike 属性判断该评论是点赞还是文字评论
}];
```

删除评论：

```
NSString *commentId = @"";
[self.user deleteCommentWithId:commentId block:^(BOOL succeeded, NSError * _Nullable error) {
	// ...
}];
```

根据评论的 `objectId` 获取评论内容:

```
NSString *commentId = @"";
[user getCommentWithId:commentId block:^(MaxSocialComment * _Nullable comment, NSError * _Nullable error) {
	// ...
}];
```

查询某条说说的评论列表：

```
NSString *shuoId = @"";
MaxSocialQuery *query = [MaxSocialQuery new];
[user getCommentOfShuoshuo:shuoId withQuery:query block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
	// ...
}];
```

列出未读评论：

```
[self.user getUnreadCommentWithBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
    NSLog(@"unread comments: %@, error: %@", objects, error);
}];
```

