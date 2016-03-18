# 在线参数

## 简介
### 什么是在线参数
每个应用在云端都有一个对应的`MLCloudConfig`对象，用以存储该应用的参数。Cloud Config 服务帮助您访问和操作云端参数。您可以通过 Console 在 MaxLeap 中配置应用参数，并且使用iOS/Android SDK读取云端的参数。
### 为何需要在线参数
将应用的部分配置放置在云端的优势在于：

* **动态配置：**
* **个性化用户体验：**在云端，您可以根据 Segment 配置参数，使不同用户群有不同的用户体验

## 在线参数中添加参数
您可以通过 Console 向 Cloud Config 中增添应用参数。新建云端参数时，您需要指定该参数的以下属性：

属性名|值
-------|-------
Parameter|参数名
Type|参数类型
Value|参数的值

您还可以为不同的 Segment 设置不同的参数值。

##获取 MLCloudConfig 对象
您可以通过`MLCloudConfig.getCurrentCloudConfig()`方法获取最新的 Cloud Config.

```java
MLCloudConfig currentConfig = MLCloudConfig.getCurrentCloudConfig();
```

##获取 MLCloudConfig 中的参数值
在获取一个云端参数的值时，您需要知道该参数的值类型，然后通过对 MLCloudConfig 实例调用`getType()`方法获取对应参数的值。该方法需要传入两个参数：第一个为云端参数名，第二个为默认值。当云端不存在响应的参数时，系统将会把默认值赋值给该参数。

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

## 更新在线参数

在每次 App 进入前台时，SDK 会自动更新上述方法获取的 currentConfig. 您也可以调用以下代码手动刷新所有云参数：

您可以通过`MLCloudConfigManager.getInBackground()`获取`MLCloudConfig`对象，然后调用`currentConfig.getInt()`更新参数的值。该方法包含两个参数：第一个为云端参数名，第二个为默认值。

```java
MLCloudConfigManager.getInBackground(new ConfigCallback() {
    @Override
    public void done(MLCloudConfig cloudConfig, MLException exception) {
        if (exception == null) {
            int y = currentConfig.getInt("y", 100);
        } else{}
    }
});
```

## 监听
为参数添加跟踪后，系统将在 Activity 开始或继续时，遍历所有被跟踪的云端参数是否有更新，若存在更新，则会执行相应的逻辑。添加跟踪之前，您需要在 Activity 的`onResume()`函数中添加如下代码，以确保参数与云端同步：

```java
@Override
protected void onResume() {
    super.onResume();
    MLCloudConfigManager.refereshKeysInBackground();
}
```

###添加监听

您可以通过`MLCloudConfigManager.observeKeyInBackground()`跟踪云端参数的变化，并且及时获取新的参数值。该函数包含两个参数：第一个为云端参数名，第二个为`ValueChangedCallback`回调类实例。

```java
MLCloudConfigManager.observeKeyInBackground("keyX", new ValueChangedCallback() {
    @Override
    public void done(MLCloudConfig cloudConfig) {
       int newKeyX = cloudConfig.get("keyX", null);
    }
});
```

注意，一个云端参数支持多个跟踪。

###移除监听

移除的办法很简单，您只需添加如下代码：

```java
MLCloudConfigManager.removeObserver("keyX",  previousValueChangedCallback);
```

移除一个云端参数的所有跟踪：

```java
MLCloudConfigManager.removeObserver("x");
```

移除所有参数的所有跟踪：

```java
MLCloudConfigManager.removeAllObservers();
```

## 在线参数值类型

`MaxLeap` 支持绝大多数 `MLObject`支持的值类型:

- `String`
- `Number`
- `Date`
- `Array`
- `Boolean`
- `Object`
