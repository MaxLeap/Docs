# Config

### ML Cloud Config

With online parameter, you can control your app behavior without re-publishing. You can set up customized online parameters in Config Settings and once the SDK is on, the online parameters will be got from the data table in background automatically.

### Get Value of Cloud Parameter

```objective_c
MLConfig *currentConfig = [MLConfigManager currentConfig];

// Get cloud parameter of configname，which might be nil
id value1 = [currentConfig objectForKey:@"configname"];

// Get cloud parameter value of configname and return as NSString.
If not, then go back to defaultValue
NSString *stringValue = [currentConfig stringForKey:@"configname" defaultValue:@"default"];
```

 There are some similar methods：
– dateForKey:defaultValue:
– arrayForKey:defaultValue:
– dictionaryForKey:defaultValue:
– fileForKey:defaultValue:
– geoPointForKey:defaultValue:
– boolForKey:defaultValue:
– numberForKey:defaultValue:
– integerForKey:defaultValue:
– floatForKey:defaultValue:
– doubleForKey:defaultValue:
 
### Observer

1. Observe the cloud parameter value change：

    ```objective_c
    [MLConfigManager addObserver:anObserver forKey:@"configname" valueChangedHandler:^(id newValue, id oldValue) {
        // the value changed
    }];
    ```

2. Execute following code to remove observer:

    ```objective_c
    [MLConfigManager removeObserver:anObserver forKey:@"configname"];
    ```

3. Observer must be removed before `anObserver` vanishes

    ```objective_c
    [MLConfigManager removeObserver:anObserver]; // Remove all observe callback related to anObserver once and for all
    ```

## Update Current Config

SDK will update currentConfig automatically everytime the app enters foreground

Or, you can invoke following code to manually refresh all cloud parameter

```objective_c
[MLConfigManager getConfigInBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

Manually refresh certain parameters

```objective_c
// Pass nil keys to get all config values.
[MLConfigManager getValuesForKeys:@[@"key1", @"key2"] inBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

MLConfigManager will invoke reletaive valueChangedHandler() in main thread if any cloud parameter value changes after the update

### Type of Cloud Parameter Value

`MLConfig` supports most of the data types supported by `MLObject`:

- `NSString`
- `NSNumber`
- `NSDate`
- `NSArray`
- `NSDictionary`