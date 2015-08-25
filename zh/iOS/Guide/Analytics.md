
# 分析

## 简介
### 什么是Leap Cloud分析服务
Leap Cloud分析服务通过客户端及Cloud Data，收集应用及用户的各种数据，并在Leap Cloud中进行专业分析，最终生成面向运营者的报表。

### 为何需要Leap Cloud分析服务
Leap Cloud分析服务是实时、免费、专业的移动应用统计分析服务，它将帮助您全面分析运营状况，深度了解典型用户并优化运营策略。最终实现：

*	**洞察运营概况及趋势**：从产品新增用户、活跃用户、应用启动次数、版本分布，到用户的使用细节、用户属性以及行为特征，你可以洞察到各类数据指标，全面了解产品运营情况和迭代效果。
*	**洞察用户行为**：还原每位用户的使用行为链条，并掌握其活跃度，留存率及转化率。
*	**提升用户体验**：定义用户分群，针对不同用户群体提供个性化体验。
*	**提升应用营收**：跟踪消费行为，制定营销策略，最大化的提升营销效果。


### Leap Cloud分析如何工作
“Leap Cloud分析”SDK，帮助我们跟踪用户行为，为云端的分析服务提供数据。主要包括：

*  自动收集信息（如终端信息，安装信息等）
*  追踪会话，页面访问
*  追踪自定义事件
*  追踪消费

收集到的数据会被保存至云端，Leap Cloud将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助Leap Cloud生成相应的分析报表。

## 启用服务
安装SDK完成后，Leap Cloud服务将自动帮助您追踪应用内的一些数据。自动收集的数据包括：

1.	终端信息
2.	应用启动和退出
3.	应用崩溃等异常信息

Leap Cloud分析服务的默认状态为**开启**。

## 页面访问路径统计

可以统计每个 View 停留时长，请确保配对使用，而且这些 view 之间不要有嵌套关系：

```objective_c
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [LCAnalytics beginLogPageView:@"PageOne"];
}
 
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [LCAnalytics endLogPageView:@"PageOne"];
}
```
 
## 自定义事件
自定义事件可以实现在应用程序中埋点，以纪录用户的点击行为并且采集相应数据。

###字段说明
字段名|类型|描述
---|---|---|---
eventId|String|事件名
key| String |事件参数
value| String|事件参数的值

请注意, 自定义事件名 (event_id) 请尽量保持其为静态值, 否则可能出现数目庞大的自定义事件列表, 而无法达到了解与分析用户行为的目的.
 
### 统计某事件发生次数

```
[LCAnalytics trackEvent:@"event_id"];
```

### 统计事件属性被触发次数
示例：统计电商应用中“购买”事件发生的次数，以及购买的商品类型及数量，那么在购买的函数里调用：

```objective_c
NSDictionary *dict = @{@"type" : @"book", @"quantity" : @"3"};
[LCAnalytics trackEvent:@"purchase" dimensions:dict];
```
