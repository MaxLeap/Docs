# 数据分析

## 简介

### 什么是 MaxLeap 数据分析服务

MaxLeap 数据分析服务通过客户端及 Cloud Data，收集页面及用户的各种数据，并在 MaxLeap 中进行专业分析，最终生成面向运营者的报表。

## 启用服务
安装SDK完成后，MaxLeap 服务将自动帮助您追踪应用内的一些数据。自动收集的数据包括：

1.	终端信息
2.	应用启动和退出
3.	应用崩溃等异常信息

 MaxLeap 数据分析服务的默认状态为**开启**。

## 页面访问路径统计

可以统计每个 View 停留时长，请确保配对使用，而且这些 view 之间不要有嵌套关系：

```js
ML.Analytics.beginLogPageView(pagename)
ML.Analytics.endLogPageView(pagename)
```
 
## 自定义事件

自定义事件可以实现在应用程序中埋点，以纪录用户的点击行为并且采集相应数据。

### 字段说明

字段名|类型|描述
---|---|---|---
eventId|String|事件名
key| String |事件参数
value| String|事件参数的值

请注意, 自定义事件名 (event_id) 请尽量保持其为静态值, 否则可能出现数目庞大的自定义事件列表, 而无法达到了解与分析用户行为的目的.
 
### 统计某事件发生次数

```
ML.Analytics.trackEvent("event_id");
```

### 统计事件属性被触发次数

考虑事件在不同属性上的取值，可以调用如下方法：

```js
ML.Analytics.trackEvent(eventId, parameters={}, count=1)
```

`parameters` 为当前事件的属性和取值（键值对）
`count` 为事件发生次数，可以用来减少发送的数据量

示例：统计电商应用中“购买”事件发生的次数，以及购买的商品类型及数量，那么在购买的函数里调用：

```objective_c
let parameters = {type: 'book', quantity: '3'}
ML.Analytics.trackEvent('purchase', parameters, 1)
```
