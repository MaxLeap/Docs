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

## 获取 currentConfig 对象

```js
import ML from 'maxleap-react-native'

ML.Config.currentConfig().then(currentConfig => {
	console.log('current config is ' + currentConfig)
})
```

## 手动刷新 currentConfig

在每次 app 进入前台时，SDK 会自动刷新 currentConfig

也可以调用以下代码手动刷新所有云参数

```js
ML.Config.fetchConfig()
.then(config => {
    // this config is currentConfig
});
```

或者刷新某几个参数

```js
ML.Config.fetchConfig(['key1', 'key2'])
.then(config => {
	// this config is currentConfig
})
```

刷新后，如果有参数的值发生变化，就会触发一个 `configValueChangedEvent`.


### 监听在线参数变化

JavaScript 代码可以订阅参数更新事件 `configValueChangedEvent`.

```js
import { NativeAppEventEmitter } from 'react-native';

let subscription = NativeAppEventEmitter.addListener(
  ML.Config.configValueChangedEvent,
  (changes) => console.log(changes)
);
...
// Don't forget to unsubscribe, typically in componentWillUnmount
subscription.remove();
```
