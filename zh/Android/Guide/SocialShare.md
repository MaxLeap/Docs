# 社交分享

社交分享目前支持五种平台：微信朋友圈，微信好友，QQ 好友，QQ 空间和新浪微博。

## 安装

### 安装 SDK

请按第二章【SDK 集成】完成 SDK 下载，

解压后将 `maxleap-sdk-social-xxx.jar` 包导入工程的 `libs` 目录下。

**第三方平台 SDK**

- [微信 SDK](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419319167&token=&lang=zh_CN)：下载解压后将 `libammsdk.jar` 放入 `libs` 目录下。
- [QQ SDK](http://wiki.open.qq.com/wiki/mobile/SDK%E4%B8%8B%E8%BD%BD)：下载解压后将 `open_sdk_r5509_lite.jar` 放入 `libs` 目录下。
- [微博 SDK](http://open.weibo.com/wiki/SDK)：下载解压后将 `weiboSDKCore_xxx.jar` 放入 `libs` 目录下，将各平台的 `*.so` 文件放入 `jniLibs` 目录下。

### 申请AppID和配置签名

下载完第三方平台的 SDK 后请按照各平台的规定申请应用，注意第三方平台上填写的应用`包名`和`签名`必须确保正确，否则您将无法跳转到分享界面。



### 配置权限

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.READ_PHONE_STATE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
```

### 添加依赖

```gradle
compile "com.squareup.okhttp3:okhttp:3.1.2"
compile 'com.android.support:support-v4:24.2.0'
```

### 配置appID到应用

将申请的appid等信息，在res->values->`string.xml`中配置如下：

```xml
<string name="ml_sina_weibo_app_id">your weibo appid</string>
<string name="qq_app_id">tencent+your qq appid</string>
<string name="ml_qq_app_id">your qq appid</string>
<string name="ml_wechat_app_id">your wechat appid</string>
<string name="ml_wechat_app_secret">your wechat secret</string>
```

### 配置AndroidManifest.xml

将以下平台对应的组件配置到您项目的`AndroidManifest.xml`中

#### 微信

```xml
<activity
    android:name="com.maxleap.social.thirdparty.WXEntryActivity"
    android:launchMode="singleTop"/>
<activity-alias
    android:name="${applicationId}.wxapi.WXEntryActivity"
    android:targetActivity="com.maxleap.social.thirdparty.WXEntryActivity"
    android:enabled="true"
    android:exported="true"/>
```

#### QQ

```xml
<activity
        android:name="com.tencent.tauth.AuthActivity"
        android:launchMode="singleTask"
        android:noHistory="true"
        android:screenOrientation="portrait">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>

        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>

        <data android:scheme="@string/qq_app_id"/>
    </intent-filter>
</activity>
<activity
        android:name="com.tencent.connect.common.AssistActivity"
        android:configChanges="orientation|keyboardHidden|screenSize"
        android:screenOrientation="portrait"
        android:theme="@android:style/Theme.Translucent.NoTitleBar"/>
```

#### weibo

```xml
<activity
        android:name="com.sina.weibo.sdk.component.WeiboSdkBrowser"
        android:configChanges="keyboardHidden|orientation"
        android:windowSoftInputMode="adjustResize"
        android:exported="false">
</activity>
```


## 使用


### MLHermes

首先在`Application`中对MLHermes进行初始化

```java
//maxleap上申请的appid和apikey
private String APP_ID = "your appid";
private String API_KEY = "your apikey";

@Override
public void onCreate() {
    super.onCreate();

    MLHermes.initialize(this, APP_ID, API_KEY);
    
}
```

### Platform

Platform 在 SDK 中是一个代表第三方平台的抽象类。目前有三个直接子类 `QQPlatform`，`WechatPlatform` 和 `WeiboPlatform`，分别表示 QQ 平台，微信平台和新浪微博平台。

Platform 负责存储第三方平台的相关数据，如应用 ID，应用 Secret，Access Token 等。

在 SDK 中可以任意创建 Platform 的实例，或者调用以下实例中的 `MLHermes` 的静态方法获得缓存在 SDK 中的实例。

```java
Platform platform = MLHermes.getPlatform(Platform.Type.WEIBO);
```

其中参数为 `Platform.Type`类型，共有以下三种：
- `Type.WEIBO`
- `Type.QQ`
- `Type.WECHAT`

### ShareItem

ShareItem 在 SDK 中代表需要分享的内容。你可以直接创建 ShareItem 的实例也可以使用 ShareItemBuilder 的 Fluent API 来进行创建。

文本分享

```java
ShareItem shareItem = ShareItem.newBuilder()
        .text(editText.getText().toString())
        .actionUrl("http://www.github.com")
        .createShareItem();
```

图文分享

```java
ShareItem shareItem = ShareItem.newBuilder()
        .text("image message")
        .description("this is a simple image test message")
        .imageUrl("http://www.demo.com/avatar.jpg")
        .bitmap(bitmap)
        .actionUrl("http://www.github.com")
        .createShareItem();
```

以上通用分享可以用于各个平台，但是由于平台的差异性实际行为会有一些差别。

除了以上通用方法你也可以根据第三方平台的 API 直接创建对应的 ShareItem 来实现更强的自定义功能。

例：自定义微信 ShareItem

```java
// 根据微信 API 创建 Req 对象
SendMessageToWX.Req req = new SendMessageToWX.Req();
WXTextObject textObject = new WXTextObject();
WXMediaMessage message = new WXMediaMessage();
message.title = "custom title";
message.mediaObject = textObject;
req.transaction = "" + System.currentTimeMillis();
req.message = message;

// 建立微信对应的 ShareItem 对象
WechatShareItem wechatShareItem = new WechatShareItem(req);
```


### ShareProvider

ShareProvider 在 SDK 中代表分享的行为。一个 ShareProvider 由 Platform 提供对应的平台信息，有 ShareItem 提供需要分享的信息。

创建 ShareProvider

```java
shareProvider = new WeiboShareProvider(activity, platform);
```

ShareProvider 目前共有以下四个子类：

- `WeiboShareProvider`	微博分享
- `QQShareProvider`	QQ 好友分享
- `QZoneShareProvider`	QZone 分享
- `WechatShareProvider`	微信分享，默认分享到微信好友，如果需要分享到朋友圈需要 `mShareItem.isTimeLine = true`。

进行分享

```java
shareProvider.shareItem(shareItem, new EventListener() {
    @Override
    public void onSuccess() {
        // 分享成功
    }

    @Override
    public void onError(HermsException e) {
        // 分享失败
    }

    @Override
    public void onCancel() {
        // 取消分享
    }
});
```

### 分享后回调监听

- 微信

微信分享后监听已经在sdk中做了实现，您无需在做处理。

- QQ

 QQ分享或者QQ ZONE分享需要在`onActivityResult()`中加入回调方法。
 
 示例如下：

```
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if(shareProvider != null){
        shareProvider.onActivityResult(requestCode, resultCode, data);
    }
}
```



- 微博

 微博分享需要在`onNewIntent()`中加入回调方法
 
 示例如下：
 
```
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    if (shareProvider != null) {
        shareProvider.onNewIntent(intent);
    }
}
```


您可参考开源组件 [MaxShare](https://github.com/MaxLeap/Module-MaxShare-Android) 中的相关调用实现。
