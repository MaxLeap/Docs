# Cloud Config
## Introduction
###What is Cloud Config
Every app has a `MLCloudConfig` object in the cloud to store the parameters of that app. Cloud Config can help you access and operate the cloud parameter, config app parameter in MaxLeap with Console and read cloud parameter with iOS/Android SDK.
###Why is Cloud Config Necessary
The advantages of putting part of MaxLeap configuration in cloud can be summarized as follows:

* **dynamic configuration: **
* **Personalized User Experience: **You can config parameters based on Segment in cloud and customize different experience for different users.


##Add Parameters in Cloud Config
You can add parameters in Cloud Config with Console. You need to define following properties of parameter when you add a new cloud parameter: 

Property|Value
-------|-------
Parameter|Parameter Name
Type|Parameter Type
Value|Parameter Value

You can config different parameter value for different Segments. Please check [Console Guide - Cloud Config](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL) for more details about add new Cloud Config Parameter. 

##Get MLConfig Object

```objective_c
MLConfig *currentConfig = [MLConfig currentConfig];
```
##Get MaxLeap Parameter Value

```objective_c
// Get cloud parameter of configname，which might be nil
id value1 = [currentConfig objectForKey:@"configname"];
     
// Get cloud parameter value of configname and return as NSString.
If not, then go back to defaultValue
NSString *stringValue = [currentConfig stringForKey:@"configname" defaultValue:@"default"];
```

Similarly:
 
`– dateForKey:defaultValue:`<br>
`– arrayForKey:defaultValue:`<br>
`– dictionaryForKey:defaultValue:`<br>
`– fileForKey:defaultValue:`<br>
`– geoPointForKey:defaultValue:`<br>
`– boolForKey:defaultValue:`<br>
`– numberForKey:defaultValue:`<br>
`– integerForKey:defaultValue:`<br>
`– floatForKey:defaultValue:`<br>
`– doubleForKey:defaultValue:`


## Modify Cloud Config

SDK will update currentConfig automatically everytime the app enters foreground. 

Or, you can invoke following code to refresh all cloud parameters:

```objective_c
[MLConfig getConfigInBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

Or, to refresh some of the parameters

```objective_c
// It will be refreshing all the keys as the method mentioned above, if you pass 'nil' to 'keys'
[MLConfig getValuesForKeys:@[@"key1", @"key2"] inBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

If there's any parameter value change after the update, then it will invoke relative `valueChangedHandler()` in main thread.



### Observer

###Add Observer

```objective_c
[MLConfig addObserver:anObserver forKey:@"configname" valueChangedHandler:^(id newValue, id oldValue) {
	// the value changed
}];
```

###Remove Observer

```objective_c
[MLConfig removeObserver:anObserver forKey:@"configname"];
```

Remove all observers before the destruction of `anObserver`

```objective_c
[MLConfig removeObserver:anObserver]; // Remove all observer callbacks related to anObserver once and for all
```

## Type of Cloud Parameter Value

`MLConfig` supports most parameter value types that is upported by `MLObject`:

- `NSString`
- `NSNumber`
- `NSDate`
- `NSArray`
- `NSDictionary`