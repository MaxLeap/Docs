## CloudConfig

### LAS CloudConfig

With online parameter, you can control your app behavior without re-publishing. SDK will automatically get the latest CloudConfig parameter from server once the app is running.

### Get Current CloudConfig

```java
LASCloudConfig currentConfig = LASCloudConfig.getCurrentCloudConfig();
```

### Get Value of CloudConfig

The data structure in CloudConfig is similar to key->value and the invoking method is similar to SharedPreferences. If the key doesn't exist, it will return with the default value inputted by developer.

```java
cloudConfig.getString(key, defaultValue)
```

There are some similar methods:

```java
cloudConfig.getInt(key, defaultValue)
cloudConfig.getList(key, defaultValue)
cloudConfig.getBoolean(key, defaultValue)
cloudConfig.getDate(key, defaultValue)
```

and so on.

### Refresh CloudConfig

You can refresh CloudConfig promptly with following code:

```java
LASCloudConfigManager.getInBackground(new ConfigCallback() {
    @Override
    public void done(LASCloudConfig cloudConfig, LASException exception) {
        if (exception != null) {
            //do something when error
            return;
        }
        // do something when success
        int y = cloudConfig.getInt("y", 100);
    }
});
```

### Observe CloudConfig Change

#### Add Observer

To take prompt actions towards the CloudConfig parameter value change, please invoke following code:

```java
LASCloudConfigManager.observeKeyInBackground("x", new ValueChangedCallback() {
    @Override
    public void done(LASCloudConfig cloudConfig) {
       int newX = cloudConfig.get("x", null);
    }
});
```

Multiple observers are supported on one Key.

#### Remove Observer

Remove a certain observer

```java
LASCloudConfigManager.removeObserver("x",  previousValueChangedCallback);
```

Remove all observers on a certain key.

```java
LASCloudConfigManager.removeObserver("x");
```

Remove all observers

```java
LASCloudConfigManager.removeAllObservers();
```

#### Refresh Keys in Background

To ensure the validity of observer, please execute following code after the Activity is running. All keys under observation will get the latest parameter value from server and once there's change, it will invoke observer registered.

```java
@Override
protected void onResume() {
    super.onResume();
    LASCloudConfigManager.refereshKeysInBackground();
}
```
