# 在线参数

## 简介
### 什么是在线参数
每个应用在云端都有一个对应的`MLConfig`对象，用以存储该应用的参数。Cloud Config服务帮助您访问和操作云端参数。您可以通过 Console 在 MaxLeap 中配置应用参数，并且使用 iOS/Android SDK 读取云端的参数。

## 在线参数中添加参数
您可以通过Console向Cloud Config中增添应用参数。新建云端参数时，您需要指定该参数的以下属性：

属性名|值
-------|-------
Parameter|参数名
Type|参数类型
Value|参数的值

您还可以为不同的Segment设置不同的参数值。

## 集成 SDK

> #### 在线参数集成在 `MaxLeap.framework` 中，如果你尚未安装，请先查阅[SDK 集成小节](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SDK_Install)，安装 SDK 并使之在 Xcode 中运行。

你还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS)，了解有关我们 SDK 的更多详细信息。

**注意**：我们支持 iOS 7.0 及以上版本。

## 获取 MLConfig 对象

```objective_c
MLConfig *currentConfig = [MLConfig currentConfig];
```

## 获取MaxLeap中的参数值

```objective_c
// 获取 configname 对应的云参数，可能为 nil
id value1 = [currentConfig objectForKey:@"configname"];
     
// 获取 configname 对应的云参数值并转化为 NSString 返回，如果没有则返回传入的 defaultValue
NSString *stringValue = [currentConfig stringForKey:@"configname" defaultValue:@"default"];
```

 跟上面类似的方法还有：
 
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


## 获取最新的在线参数

在每次 app 进入前台时，SDK 会自动刷新 currentConfig

也可以调用以下代码手动刷新所有云参数

```objective_c
[MLConfig getConfigInBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

或者刷新某几个参数

```objective_c
// keys 传入 nil 等同于上面的方法，刷新全部参数的值
[MLConfig getValuesForKeys:@[@"key1", @"key2"] inBackgroundWithBlock:^(MLConfig *config, NSError *error) {
    // this config is currentConfig
}];
```

刷新后，如果有参数的值发生变化，就会在主线程调用相应的 `valueChangedHandler()`

### 监听

###添加监听

```objective_c
[MLConfig addObserver:anObserver forKey:@"configname" valueChangedHandler:^(id newValue, id oldValue) {
	// the value changed
}];
```

###移除监听

```objective_c
[MLConfig removeObserver:anObserver forKey:@"configname"];
```

在 `anObserver` 销毁之前必须移除监听者

```objective_c
[MLConfig removeObserver:anObserver]; // 一次性移除所有跟 anObserver 相关的监听回调
```

## 在线参数值类型

`MLConfig` 支持大部分 `MLObject` 支持的数据类型:

- `NSString`
- `NSNumber`
- `NSDate`
- `NSArray`
- `NSDictionary`