# 云配置

## 简介
###什么是云配置
每个应用在云端都有一个对应的`LCCloudConfig`对象，用以存储该应用的参数。Cloud Config服务帮助您访问和操作云端参数。您可以通过Console在LeapCloud中配置应用参数，并且使用iOS/Android SDK读取云端的参数。
###为何需要云配置
将应用的部分配置放置在云端的优势在于：

* **动态配置：**
* **个性化用户体验：**在云端，您可以根据Segment配置参数，使不同用户群有不同的用户体验

##在云配置中添加参数
您可以通过Console向Cloud Config中增添应用参数。新建云端参数时，您需要指定该参数的以下属性：

属性名|值
-------|-------
Parameter|参数名
Type|参数类型
Value|参数的值

您还可以为不同的Segment设置不同的参数值。新建云配置中参数的详细步骤，请查看[Console使用指南 - 云配置](LC_DOCS_LINK_PLACEHOLDER_USERMANUAL).

## 获取LCConfig对象

```objective_c
LCConfig *currentConfig = [LCConfigManager currentConfig];
```

## 获取LCConfig中的参数值

```objective_c
// 获取 configname 对应的云参数，可能为 nil
id value1 = [currentConfig objectForKey:@"configname"];
     
// 获取 configname 对应的云参数值并转化为 NSString 返回，如果没有则返回传入的 defaultValue
NSString *stringValue = [currentConfig stringForKey:@"configname" defaultValue:@"default"];
```

 跟上面类似的方法还有：
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


## 更新云配置

在每次 app 进入前台时，SDK 会自动更新 currentConfig

也可以调用以下代码手动刷新所有云参数

```objective_c
[LCConfigManager getConfigInBackgroundWithBlock:^(LASConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

或者刷新某几个参数

```objective_c
// keys 传入 nil 等同于上面的方法，刷新全部参数的值
[LCConfigManager getValuesForKeys:@[@"key1", @"key2"] inBackgroundWithBlock:^(LASConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

更新后，如果有参数的值发生变化，就会在主线程调用相应的 valueChangedHandler()

### 监听

###添加监听

	```objective_c
	[LCConfigManager addObserver:anObserver forKey:@"configname" valueChangedHandler:^(id newValue, id oldValue) {
	    // the value changed
	}];
	```

###移除监听

	```objective_c
	[LCConfigManager removeObserver:anObserver forKey:@"configname"];
	```

在 `anObserver` 销毁之前必须移除监听者

	```objective_c
	[LCConfigManager removeObserver:anObserver]; // 一次性移除所有跟 anObserver 相关的监听回调
	```

## 云参数值类型

`LCConfig` supports most of the data types supported by `LCObject`:

- `NSString`
- `NSNumber`
- `NSDate`
- `NSArray`
- `NSDictionary`