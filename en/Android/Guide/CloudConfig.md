# Cloud Config
## Introduction
###What is Cloud Config
Every app has a `LASCloudConfig` object in the cloud to store the parameters of that app. Cloud Config can help you access and operate the cloud parameter, config app parameter in Leap Cloud with Console and read cloud parameter with iOS/Android SDK.
###Why is Cloud Config Necessary
The advantages of putting part of Leap Cloud configuration in cloud can be summarized as follows:

* **dynamic configuration: **
* **Personalized User Experience: **You can config parameters based on Segment in cloud and customize different experience for different users.


##Add Parameters in Cloud Config
You can add parameters in Cloud Config with Console. You need to define following properties of parameter when you add a new cloud parameter: 

Property|Value
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
For getting a cloud parameter value, you need to know type of the value and then invoke `getType()` method in LC Cloud Config instance. There are two parameters required in this method: the first one is cloud parameter name and the second one is the default value. If there is no cloud parameter, then the default value will be assigned to the parameter. 

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

## Modify Cloud Config

You can get `LCCloudConfig` object with `LCCloudConfigManager.getInBackground()` and then invoke `currentConfig.getInt()` to refresh parameter value. There are two parameters in this method: one is cloud parameter name and the other is new parameter name.

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

## Observe Parameter Change
After the observer is added and any Activity started or resumed, application will check if there is any update through all cloud parameters observed. Relative logic will be performed if so. Before adding observer, you need to add following code in `onResume()` in Activity to ensure the cloud parameter synchronization:


```java
@Override
protected void onResume() {
    super.onResume();
    LCCloudConfigManager.refereshKeysInBackground();
}
```

###Add Observer

You can observe cloud paramter change with `LCCloudConfigManager.observeKeyInBackground()` and get latest parameter value in time. There are two parameters in this method: one is cloud parameter name and the other is an instance of the callback class "ValueChangedCallback".

```java
LCCloudConfigManager.observeKeyInBackground("keyX", new ValueChangedCallback() {
    @Override
    public void done(LCCloudConfig cloudConfig) {
       int newKeyX = cloudConfig.get("keyX", null);
    }
});
```

Notice:
A cloud parameter supports multiple observers.

###Remove Observer

You can add following code to remove the observer:

```java
LCCloudConfigManager.removeObserver("keyX",  previousValueChangedCallback);
```

Remove all observers of a cloud parameter:

```java
LCCloudConfigManager.removeObserver("x");
```

Remove all observers of all cloud parameters:

```java
LCCloudConfigManager.removeAllObservers();
```

