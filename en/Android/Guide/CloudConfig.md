# Cloud Config
## Introduction
###What is Cloud Config
Every app has a `LASCloudConfig` object in the cloud to store the parameters of that app. Cloud Config can help you access and operate the cloud parameter, config app parameter in Leap Cloud with Console and read cloud parameter with iOS/Android SDK.
###Why is Cloud Config Necessary
The advantages of putting part of configuration in cloud can be summarized as follows:

* **dynamic configuration: **
* **Personalized User Experience: **You can config parameters based on Segment in cloud and customize different experience for different users.


##Add parameters in Cloud Config
You can add parameters in Cloud Config with Console. You need to define following indexes of parameter when you add a new cloud parameter: 

Index|Value
-------|-------
Parameter|Parameter Name
Type|Parameter Type
Value|Parameter Value

You can config different parameter value for different Segments. Please check [Console Guide - Cloud Config](..) for more details about add new Cloud Config Parameter. 

##Get LC Cloud Config Object
You can get latest Cloud Config with `LCCloudConfig.getCurrentCloudConfig()`.

```java
LCCloudConfig currentConfig = LCCloudConfig.getCurrentCloudConfig();
```

##Get LC Cloud Config Parameter Value
For getting a cloud parameter value, you need to know type of the value and then invoke `getType()` method in LC Cloud Config instance. There are two parameters required in this method: the first one is cloud parameter name and the second one is the default value. If there is no parameter in cloud, then the default value will be assigned. 

```java
currentConfig.getString(key, defaultValue)
```

Similarly:

```java
currentConfig.getInt(key, defaultValue)
currentConfig.getList(key, defaultValue)
currentConfig.getBoolean(key, defaultValue)
currentConfig.getDate(key, defaultValue)
```

## Edit Cloud Config

You can get `LCCloudConfig` object with `LCCloudConfigManager.getInBackground()` and then invoke `currentConfig.getInt()` to refresh parameter value. There are two parameters in this method: the first one is cloud parameter name and the second one is new parameter name.

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

## Track Parameter Change
After the track is added and any Activity started or resumed, application will check if there is any update through all cloud parameters trackd. Relative logic will be performed if so. Before adding track, you need to add following code in `onResume()` of Activity to ensure the cloud parameter synchronization:


```java
@Override
protected void onResume() {
    super.onResume();
    LCCloudConfigManager.refereshKeysInBackground();
}
```

###Add Track

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

