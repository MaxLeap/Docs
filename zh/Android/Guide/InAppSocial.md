# 应用内社交

## 安装

### 安装 SDK

**MaxLeap SDK**

<a class="download-sdk" href="https://github.com/MaxLeap/SDK-Android/releases" target="_blank">下载 MaxLeap SDK</a>

解压后将 `maxleap-social-xxx.jar` 包导入工程的 `libs` 目录下。

### 配置权限

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

### 添加依赖

```gradle
compile "com.squareup.okhttp3:okhttp:3.1.2"
```

## 使用

### MLHerms

MLHerms 是 SDK 的工具类，是一切功能的入口。在使用 MHerms 前需要先进行初始化操作。

```java
MLHermes.initialize(this, APP_ID, API_KEY);
MLHermes.setSessionToken(USER_SESSION_TOKEN);
```

### Constraint

`Constraint` 用于在某些查询 API 中指定排序，分页相关的操作，可以通过以下实例获得一个 `Constraint` 对象。

```java
Constraint constraint = new Constraint.Builder()
	.page(0)
    .asc()
    .desc()
    .orderByTime()
    .orderByUserId()
    .build();
```

所有可以接受 `Constraint` 的 API 中都可以省略 `Constraint` 对象，此时将按照第 0 页，按时间倒序的默认条件进行查询。

### 关系操作

SDK 中使用 `RelationManager` 来进行关系相关的操作，可以通过以下方法获得 `RelationManager` 的实例。

```java
RelationManager relationManager = MLHermes.getRelationManager();
```

#### 创建或更新关系

```java
relationManager.createOrUpdateRelation(userId, followerId, reverse, black,new DataHandler<JSONArray>() {
    @Override
    public void onSuccess(JSONArray relation) {
		String objectId1 = relation.getJSONObject(0).getString("objectId");
        if(reverse){
        	String objectId2 = relation.getJSONObject(1).getString("objectId");
        }
    }

    @Override
    public void onError(HermsException e) {

    }
});
```

- `reverse` 表示是否互相关注，当互相关注时返回两个创建的 Relation 的 ObjectId，否则只返回一个 Relation。
- `black` 表示是否允许对方查看关系。

#### 获得关系

```java
relationManager.getRelation(relationObjectId, new DataHandler<Relation>() {
    @Override
    public void onSuccess(Relation relation) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

其中 `Relation` 表示关系的实体。

#### 删除关系

```java
relationManager.delete(relationObjectId, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

####  获得状态

状态用于描述关系的形式，有以下三种

- `Status.FOLLOW_EACH_OTHER`	互相关注
- `Status.FOLLOWING`	关注
- `Status.UNFOLLOW`		没有关注

```java
relationManager.getStatus(userId, followerId, new DataHandler<Integer>() {
    @Override
    public void onSuccess(Integer status) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得 Followers

```java
relationManager.getFollowers(userId, constraint, new DataListHandler<Relation>() {
    @Override
    public void onSuccess(List<Relation> relations) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得 Follows

```java
relationManager.getFollows(followerId, constraint, new DataListHandler<Relation>() {
    @Override
    public void onSuccess(List<Relation> relations) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```


### 说说

SDK 中使用 `ShuoShuoManager` 来进行说说相关的操作，可以通过以下方法获得 `ShuoShuoManager` 的实例。

```java
ShuoShuoManager shuoShuoManager = MLHermes.getShuoShuoManager();
```

#### 创建或更新说说

在进行网络请求之前首先需要先创建 `ShuoShuo` 的实例对象，目前可以创建以下三种形式的说说：

分享文本

```java
ShuoShuo shuoShuo = new ShuoShuo();
shuoShuo.setUserId(userId);
shuoShuo.setContent("hello world");
```

分享链接

```java
ShuoShuo shuoShuo = new ShuoShuo();
shuoShuo.setUserId(userId);
shuoShuo.setContent("hello world");
shuoShuo.setLink("http://www.github.com");
```

分享图片

```java
ShuoShuo shuoShuo = new ShuoShuo();
shuoShuo.setUserId(userId);
shuoShuo.setContent("hello world");
shuoShuo.setFileName(new File("/Users/SidneyXu/downloads", "foobar.jpg").getAbsolutePath());
```

以上三种形式都可以在创建时传入地理位置信息

```java
shuoShuo.setLongitude(50);
shuoShuo.setLatitude(50);
```

默认说说发送到广场，可以通过以下方式发送到朋友圈

```java
shuoShuo.setFriendCycle(true);
```

创建完后就可以调用以下方法发送请求

```java
shuoShuoManager.createOrUpdateShuoShuo(shuoShuo, new DataHandler<String>() {
    @Override
    public void onSuccess(String objectId) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得说说

```java
shuoShuoManager.getShuoShuo(shushuoObjectId, new DataHandler<ShuoShuo>() {
    @Override
    public void onSuccess(ShuoShuo shuoShuo) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 删除说说

```java
shuoShuoManager.deleteShuoShuo(shushuoObjectId, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得指定用户的说说列表

```java
shuoShuoManager.getShuoShuoList(userId, constraint, black, zan, new DataListHandler<ShuoShuo>() {
    @Override
    public void onSuccess(List<ShuoShuo> shuoshuos) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

其中 `black` 和 `zan` 都是查询条件。

#### 获得最近更新的说说列表

```java
shuoShuoManager.getLatestShuoShuos(constraint, new DataListHandler<ShuoShuo>() {
    @Override
    public void onSuccess(List<ShuoShuo> shuoshuos) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得指定范围内的说说列表

```java
shuoShuoManager.getNearbyShuoShuos(longitude, latitude, distance, new DataListHandler<ShuoShuo>() {
    @Override
    public void onSuccess(List<ShuoShuo> shuoshuos) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得朋友圈的说说列表

```java
shuoShuoManager.getFriendCircleShuoShuos(userId, new DataHandler<Triple<List<ShuoShuo>, List<Comment>, List<Comment>>>() {
    @Override
    public void onSuccess(Triple<List<ShuoShuo>, List<Comment>, List<Comment>> listListListTriple) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

返回值为说说列表，评论列表，赞列表。

#### 获得说说包含的图片列表

```java
shuoShuoManager.getPhotoList(userId, shuoshuoObjectId, new DataListHandler<String>() {
    @Override
    public void onSuccess(List<String> photoPaths) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

以上操作返回的是图片路径的列表。

####  下载说说中的图片

```java
shuoShuoManager.downloadPhoto(userId, shuoshuoObjectId, filePath, targetPath, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

其中 `filePath` 是说说中指定的图片的路径，`targetPath` 是指定的需要下载到的路径。


### 评论

SDK 中使用 `CommentManager` 来进行评论相关的操作，可以通过以下方法获得 `CommentManager` 的实例。

```java
CommentManager commentManager = MLHermes.getCommentManager();
```

#### 创建评论

```java
commentManager.createComment(userId, shuoId, content, new DataHandler<String>() {
    @Override
    public void onSuccess(String objectId) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 更新评论

更新评论只能够更新该评论是否已读。

```java
commentManager.updateComment(commentObjectId, read, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void void) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得评论

```java
commentManager.getComment(commentObjectId, new DataHandler<Comment>() {
    @Override
    public void onSuccess(Comment comment) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

其中 `Comment` 表示评论的实体。


#### 删除评论

```java
commentManager.deleteComment(commentObjectId, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得评论列表

```java
commentManager.getComments(shuoId, constraint, new DataListHandler<Comment>() {
    @Override
    public void onSuccess(List<Comment> comments) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得未读评论列表

```java
commentManager.getUnreadComments(userId, new DataListHandler<Comment>() {
    @Override
    public void onSuccess(List<Comment> comments) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 为评论 + 1

```java
commentManager.favoriteComment(userId, shuoId, new DataHandler<String>() {
    @Override
    public void onSuccess(String objectId) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

### 地理位置

SDK 中使用 `LocationManager` 来进行地理位置相关的操作，可以通过以下方法获得 `LocationManager` 的实例。

```java
LocationManager locationManager = MLHermes.getLocationManager();
```

#### 创建或更新地理位置

```java
locationManager.createOrUpdateLocation(userId, longitude, latitude, new DataHandler<String>() {
    @Override
    public void onSuccess(String objectId) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得地理位置

```java
locationManager.getLocation(locationObjectId, new DataHandler<Location>() {
    @Override
    public void onSuccess(Location location) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

其中 `Location` 表示地理位置的实体。


#### 删除地理位置

```java
locationManager.deleteLocation(locationObjectId, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得用户的地理位置

```java
locationManager.getLocationByUser(userId, new DataListHandler<Location>() {
    @Override
    public void onSuccess(List<Location> locations) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得附近地理位置

```java
locationManager.getNearbyLocation(userId, longitude, latitude, distance, new DataListHandler<Location>() {
    @Override
    public void onSuccess(List<Location> locations) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

### 账号系统

SDK 中使用 `UserManager` 来进行账号相关的操作，可以通过以下方法获得 `UserManager` 的实例。

```java
UserManager userManager = MLHermes.getUserManager();
```

#### 注册用户

```java
userManager.registerInBackground(username, password, new DataHandler<JSONObject>() {
    @Override
    public void onSuccess(JSONObject jsonObject) {
        String objectId = jsonObject.optString("objectId");
    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 登录用户

```java
userManager.loginInBackground(username, password, new DataHandler<JSONObject>() {
    @Override
    public void onSuccess(JSONObject jsonObject) {
        String objectId = jsonObject.optString("objectId");
    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 获得验证码

```java
userManager.getSmsCodeInBackground(phoneNumber, new DataHandler<Void>() {
    @Override
    public void onSuccess(Void aVoid) {

    }

    @Override
    public void onError(HermsException e) {

    }
});
```

#### 使用验证码登录

```java
userManager.loginByMobileNumberInBackground(phoneNumber, smsCode, new DataHandler<JSONObject>() {
    @Override
    public void onSuccess(JSONObject jsonObject) {
        String objectId = jsonObject.optString("objectId");
    }

    @Override
    public void onError(HermsException e) {

    }
});
```