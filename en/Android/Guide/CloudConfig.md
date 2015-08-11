# Cloud Config
## Introduction
###What is Cloud Config
Every app has a `LASCloudConfig` object in the cloud to store the parameters of that app. Cloud Config can help you access and operate the cloud parameter, config app parameter in Leap Cloud with Console and read cloud parameter with iOS/Android SDK.
###Why is Cloud Config Necessary
The advantages of putting part of configuration in cloud can be summarized as follows:

* **dynamic configuration: **
* **Personalized User Experience: **You can config parameters based on Segment in cloud and customize different experience for different users.


##Add parameters in Cloud Config向Cloud Config中添加参数
You can add parameters in Cloud Config with Console. You need to define following indexes of parameter when you add a new cloud parameter: 您可以通过Console向Cloud Config中增添应用参数。新建云端参数时，您需要指定该参数的以下属性：

Index|Value
-------|-------
Parameter|Parameter Name
Type|Parameter Type
Value|Parameter Value

You can config different parameter value for different Segments. Please check [Console Guide - Cloud Config](..) for more details about add new Cloud Config Parameter. 您还可以为不同的Segment设置不同的参数值。新建Cloud Config参数的详细步骤，请查看[Console使用指南 - Cloud Config](..).

##Get LC Cloud Config Object 获取LCCloudConfig对象
You can get latest Cloud Config with 您可以通过`LCCloudConfig.getCurrentCloudConfig()`方法获取最新的Cloud Config.

```java
LCCloudConfig currentConfig = LCCloudConfig.getCurrentCloudConfig();
```

##Get LC Cloud Config Parameter Value获取LCCloudConfig中的参数值
For getting a cloud parameter value, you need to know type of the value and then invoke `getType()` method in LC Cloud Config instance. There are two parameters required in this method: the first one is cloud parameter name and the second one is the default value. If there is no parameter in cloud, then the default value will be assigned. 在获取一个云端参数的值时，您需要知道该参数的值类型，然后通过对LCCloudConfig实例调用`getType()`方法获取对应参数的值。该方法需要传入两个参数：第一个为云端参数名，第二个为默认值。当云端不存在响应的参数时，系统将会把默认值赋值给该参数。

```java
currentConfig.getString(key, defaultValue)
```

Similarly:类似地:

```java
currentConfig.getInt(key, defaultValue)
currentConfig.getList(key, defaultValue)
currentConfig.getBoolean(key, defaultValue)
currentConfig.getDate(key, defaultValue)
```

## Edit Cloud Config修改Cloud Config

You can get `LCCloudConfig` object with `LCCloudConfigManager.getInBackground()` and then invoke `currentConfig.getInt()` to refresh parameter value. There are two parameters in this method: the first one is cloud parameter name and the second one is new parameter name.您可以通过`LCCloudConfigManager.getInBackground()`获取`LCCloudConfig`对象，然后调用`currentConfig.getInt()`更新参数的值。该方法包含两个参数：第一个为云端参数名，第二个为新的参数值。

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

## Track Parameter Change跟踪参数变化
After the track is added and any Activity started or resumed, application will check if there is any update through all cloud parameters trackd. Relative logic will be performed if so. Before adding track, you need to add following code in `onResume()` of Activity to ensure the cloud parameter synchronization:
为参数添加跟踪后，系统将在Activity开始或继续时，遍历所有被跟踪的云端参数是否有更新，若存在更新，则会执行相应的逻辑。添加跟踪之前，您需要在Activity的`onResume()`函数中添加如下代码，以确保参数与云端同步：

```java
@Override
protected void onResume() {
    super.onResume();
    LCCloudConfigManager.refereshKeysInBackground();
}
```

###Add Track添加跟踪

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
#### Refresh Keys in Background

To ensure the validity of observer, please execute following code after the Activity is running. All keys under observation will get the latest parameter value from server and once there's change, it will invoke observer registered.

```java
@Override
protected void onResume() {
    super.onResume();
    LCCloudConfigManager.refereshKeysInBackground();
}
```
