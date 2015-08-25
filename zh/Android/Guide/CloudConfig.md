# 云配置

## 简介
###什么是Cloud Config
每个应用在云端都有一个对应的`LCCloudConfig`对象，用以存储该应用的参数。Cloud Config服务帮助您访问和操作云端参数。您可以通过Console在LeapCloud中配置应用参数，并且使用iOS/Android SDK读取云端的参数。
###为何需要Cloud Config
将应用的部分配置放置在云端的优势在于：

* **动态配置：**
* **个性化用户体验：**在云端，您可以根据Segment配置参数，使不同用户群有不同的用户体验

##向Cloud Config中添加参数
您可以通过Console向Cloud Config中增添应用参数。新建云端参数时，您需要指定该参数的以下属性：

属性名|值
-------|-------
Parameter|参数名
Type|参数类型
Value|参数的值

您还可以为不同的Segment设置不同的参数值。新建云配置中参数的详细步骤，请查看[Console使用指南 - 云配置](LC_DOCS_LINK_PLACEHOLDER_USERMANUAL).

##获取LCCloudConfig对象
您可以通过`LCCloudConfig.getCurrentCloudConfig()`方法获取最新的Cloud Config.

```java
LCCloudConfig currentConfig = LCCloudConfig.getCurrentCloudConfig();
```

##获取LCCloudConfig中的参数值
在获取一个云端参数的值时，您需要知道该参数的值类型，然后通过对LCCloudConfig实例调用`getType()`方法获取对应参数的值。该方法需要传入两个参数：第一个为云端参数名，第二个为默认值。当云端不存在响应的参数时，系统将会把默认值赋值给该参数。

```java
currentConfig.getString(key, defaultValue)
```

类似地:

```java
currentConfig.getInt(key, defaultValue)
currentConfig.getList(key, defaultValue)
currentConfig.getBoolean(key, defaultValue)
currentConfig.getDate(key, defaultValue)
```

## 修改Cloud Config

您可以通过`LCCloudConfigManager.getInBackground()`获取`LCCloudConfig`对象，然后调用`currentConfig.getInt()`更新参数的值。该方法包含两个参数：第一个为云端参数名，第二个为新的参数值。

```java
LCCloudConfigManager.getInBackground(new ConfigCallback() {
    @Override
    public void done(LCCloudConfig cloudConfig, LCException exception) {
        if (exception == null) {
            int y = currentConfig.getInt("y", 100);
        } else{}
    }
});
```

## 跟踪参数变化
为参数添加跟踪后，系统将在Activity开始或继续时，遍历所有被跟踪的云端参数是否有更新，若存在更新，则会执行相应的逻辑。添加跟踪之前，您需要在Activity的`onResume()`函数中添加如下代码，以确保参数与云端同步：

```java
@Override
protected void onResume() {
    super.onResume();
    LCCloudConfigManager.refereshKeysInBackground();
}
```

###添加跟踪

您可以通过`LCCloudConfigManager.observeKeyInBackground()`跟踪云端参数的变化，并且及时获取新的参数值。该函数包含两个参数：第一个为云端参数名，第二个为`ValueChangedCallback`回调类实例。

```java
LCCloudConfigManager.observeKeyInBackground("keyX", new ValueChangedCallback() {
    @Override
    public void done(LCCloudConfig cloudConfig) {
       int newKeyX = cloudConfig.get("keyX", null);
    }
});
```

注意，一个云端参数支持多个跟踪。

###移除跟踪

移除的办法很简单，您只需添加如下代码：

```java
LCCloudConfigManager.removeObserver("keyX",  previousValueChangedCallback);
```

移除一个云端参数的所有跟踪：

```java
LCCloudConfigManager.removeObserver("x");
```

移除所有参数的所有跟踪：

```java
LCCloudConfigManager.removeAllObservers();
```

