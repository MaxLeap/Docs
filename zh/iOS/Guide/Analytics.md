
# 数据分析

## 简介
### 什么是 MaxLeap 数据分析服务
 MaxLeap 数据分析服务通过客户端及 Cloud Data，收集应用及用户的各种数据，并在 MaxLeap 中进行专业分析，最终生成面向运营者的报表。

### 为何需要 MaxLeap 数据分析服务
 MaxLeap 数据分析服务是实时、免费、专业的移动应用统计分析服务，它将帮助您全面分析运营状况，深度了解典型用户并优化运营策略。最终实现：

* **洞察运营概况及趋势**：从产品新增用户、活跃用户、应用启动次数、版本分布，到用户的使用细节、用户属性以及行为特征，你可以洞察到各类数据指标，全面了解产品运营情况和迭代效果。
* **洞察用户行为**：还原每位用户的使用行为链条，并掌握其活跃度，留存率及转化率。
* **提升用户体验**：定义用户分群，针对不同用户群体提供个性化体验。
* **提升应用营收**：跟踪消费行为，制定营销策略，最大化的提升营销效果。


###  MaxLeap 数据分析如何工作
“ MaxLeap 分析” SDK，帮助我们跟踪用户行为，为云端的分析服务提供数据。主要包括：

*  自动收集信息（如终端信息，安装信息等）
*  追踪会话，页面访问
*  追踪自定义事件
*  追踪消费

收集到的数据会被保存至云端，MaxLeap 将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助 MaxLeap  生成相应的分析报表。

## 启用服务
安装SDK完成后，MaxLeap 服务将自动帮助您追踪应用内的一些数据。自动收集的数据包括：

1.	终端信息
2.	应用启动和退出
3.	应用崩溃等异常信息

 MaxLeap 数据分析服务的默认状态为**开启**。

## 页面访问路径统计

可以统计每个 View 停留时长，请确保配对使用，而且这些 view 之间不要有嵌套关系：

```objective_c
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [MLAnalytics beginLogPageView:@"PageOne"];
}
 
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [MLAnalytics endLogPageView:@"PageOne"];
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
[MLAnalytics trackEvent:@"event_id"];
```

### 统计事件属性被触发次数
示例：统计电商应用中“购买”事件发生的次数，以及购买的商品类型及数量，那么在购买的函数里调用：

```objective_c
NSDictionary *dict = @{@"type" : @"book", @"quantity" : @"3"};
[MLAnalytics trackEvent:@"purchase" dimensions:dict];
```

## 应用内支付统计

- 统计开始支付事件

```
// transaction 不能为空
[MLAnalytics onPurchaseRequest:transaction isSubscription:NO];
```

- 统计支付成功事件

```
// transaction 不能为空
[MLAnalytics onPurchaseSuccess:transaction isSubscription:NO];
```

- 统计支付失败事件

```
// transaction 不能为空
[MLAnalytics onPurchaseFailed:transaction isSubscription:NO];
```

- 统计支付支付取消事件

```
// transaction 不能为空
[MLAnalytics onPurchaseCancelled:transaction isSubscription:NO];
```

<!--
## 游戏统计

### 跟踪玩家充值

**【用途和用法】**

跟踪玩家充值现金而获得虚拟币的行为，充入的现金将反映至游戏收入中。

充值过程可以跟踪四个状态：1、发出有效的充值请求；2、确认某次充值请求已完成充值；3、充值失败；4、充值被用户取消。

您可在玩家发起充值请求时（例如玩家选择了某个充值包，进入支付流程那一刻）调用 `onChargeRequest`，并传入该笔交易的唯一订单ID和详细信息；在确认玩家支付成功时调用`onChargeSuccess`；在玩家支付失败时调用 `onChargeFailed`；在玩家取消支付时调用 `onChargeCancelled`。所有状态均需要传入订单ID。

**注意：**

1、orderID是标识交易的关键，每一次的充值请求都需要是不同的orderID，否则会被认为重复数据而丢弃，造成收入数据偏差的情况。

2、orderID由您自己构造和管理，可以使用类似 userID+时间戳+随机数 的方式来自己定义orderID，来保障其唯一性。

3、收入数据以调用了onChargeSuccess为准，Success调用时的orderID要与Request中orderID对应，才可追溯到交易内容，有效计量。 Request必须调用，且需要早于Success，否则可能影响收入数据的金额计数。


**【接口说明：（MLGAVirtualCurrency类）】**
 
```
//充值请求
+ (void)onChargeRequest:(SKPaymentTransaction *)transaction 
				   orderId:(NSString *)orderId
		   currencyAmount:(double)currencyAmount 
		     currencyType:(NSString *)currencyType
   virtualCurrencyAmount:(double)virtualCurrencyAmount
   				 paySource:(NSString *)paySource;

//充值成功
+ (void)onChargeSuccess:(SKPaymentTransaction *)transaction orderId:(NSString *)orderId;

// 充值失败
+ (void)onChargeFailed:(SKPaymentTransaction *)transaction orderId:(NSString *)orderId;

// 充值取消
+ (void)onChargeCancelled:(SKPaymentTransaction *)transaction orderId:(NSString *)orderId;
```

**参数说明：**

参数  |类型  |	描述
------------|------|-------
transaction | SKPaymentTransaction | 用来进行支付的对象，不能为空
orderId	  | NSString | 订单ID，最多64个字符。用于唯一标识一次交易。<br>*如果多次充值成功的orderID重复，将只算首次成功的数据，其他数据会认为重复数据丢弃。<br>\*如果Success调用时传入的orderID在之前Request没有对应orderID，则记录充值次数，但不会有收入金额体现。
currencyAmount | double | 现金金额或现金等价物的额度。
currencyType	| NSString | 请使用国际标准组织ISO 4217中规范的3位字母代码标记货币类型。点击查看参考 例：人民币CNY；美元USD；欧元EUR（如果您使用其他自定义等价物作为现金，亦可使用ISO 217中没有的3位字母组合传入货币类型，我们会在报表页面中提供汇率设定功能）
virtualCurrencyAmount | double | 虚拟币金额
paymentSource	| NSString | 支付的途径，最多16个字符。例如：“支付宝”“苹果官方”“XX支付SDK”

示例1：

玩家使用支付宝方式成功购买了“大号宝箱”（实际为100元人民币购入1000元宝的礼包），该笔操作的订单编号为account123-0923173248-11。可以如下调用：

```
//1）在向支付宝支付SDK发出请求时，同时调用：
[MLGAVirtualCurrencyonChargeRequst:transaction orderId:@"account123-0923173248-11" currencyAmount:100 currencyType@"CNY" virtualCurrencyAmount:1000 paymentType: @"Alipay"];

//2）订单account123-0923173248-11充值成功后调用：
[MLGAVirtualCurrency onChargeSuccess:transaction orderId:@"account123-0923173248-11"];
```

示例2：

在一款与91联运的游戏中，游戏使用了91的支付聚合SDK，玩家购买一个“钻石礼包1”（10个91豆购买60钻石），该笔操作的订单号为“7837331”。由于此类聚合SDK往往要求使用其自有的“代币”（91使用91豆，兑换人民币比例1：1）做充值依据，建议将“代币”折算为人民币后再调用统计：
 
```
//1）在向91支付SDK发出请求时，进行调用
[MLGAVirtualCurrency onChargeRequst:transaction orderId:@"7837331" iapId: @"钻石礼包1" currencyAmount:10 currencyType@”CNY” virtualCurrencyAmount:60 paymentType: @"91 SDK "];
//2）订单order001充值成功：
[MLGAVirtualCurrency onChargeSuccess:transaction orderId: @"7837331"];
```

**【用途和用法】**

- 游戏中除了可通过充值来获得虚拟币外，可能会在任务奖励、登录奖励、成就奖励等环节免费发放给玩家虚拟币，来培养他们使用虚拟币的习惯。开发者可通过此方法跟踪全部免费赠予虚拟币的数据。
- 在成功向玩家赠予虚拟币时调用onReward方法来传入相关数据。
- 只获得过赠予虚拟币的玩家不会被记为付费玩家。赠予的虚拟币会计入到所有的虚拟币产出中，也计入到留存虚拟币中。
【接口说明：（MLGAVirtualCurrency类）】
 

//赠予虚拟币
+ (void)onReward:(double)virtualCurrencyAmount reason:(NSString *)reason;
 

**参数说明：**

参数|类型|描述
---|----|----
virtualCurrencyAmount|double|虚拟币金额。
reason|NSString|赠送虚拟币原因/类型。格式：32个字符内的中文、空格、英文、数字。不要带有任何开发中的转义字符，如斜杠<br>**注意：最多支持100种不同原因。**

示例1：玩家在完成了新手引导后，成功获得了免费赠送的5个钻石：
 
```
[MLGAVirtualCurrency onReward:5 reason:@"新手奖励"];
```

示例2：玩家在游戏竞技场中排名较高，而获得了100消费券奖励：

```
[MLGAVirtualCurrency onReward:100reason:@"竞技场Top2"];
```

### 跟踪游戏消费点

**【用途和用法】**

- 跟踪游戏中全部使用到虚拟币的消费点，如购买虚拟道具、VIP服务、复活等
- 跟踪某物品或服务的耗尽
- 在任意消费点发生时尽快调用onPurchase，在某个道具/服务被用掉（消失）时尽快调用onUse
- 消费点特指有价值的虚拟币的消费过程，如果游戏中存在普通游戏金币可购买的虚拟物品，不建议在此处统计。

**【接口说明：（MLGAItem类）】**
 
```
//记录付费点
+ (void)onPurchase:(NSString *)item itemNumber:(int) number priceInVirtualCurrency:(double) price;
//消耗物品或服务等
+ (void) onUse:(NSString *)item itemNumber:(int)number;
```

**参数说明：**

参数|类型|描述
---|---|---
item|NSString|某个消费点的编号，最多32个字符。
number|int|消费数量
price|double|虚拟币单价

示例1：
玩家以25元宝/个的单价购买了两个类别号为“helmet1”的头盔，可以调用：

```
[MLGAItem onPurchase: @"helmet1" itemNumber:2 priceInVirtualCurrency:25];
```

其中一个头盔在战斗中由于损坏过度而消失。

```
[MLGAItem onUse: @"helmet1" itemNumber:1];
```

示例2：
玩家在某关卡中死亡，使用5个钻石进行复活。可调用：

```
[MLGAItem onPurchase: @"revival" itemNumber:1 priceInVirtualCurrency:5];
```

### 任务、关卡或副本

**【用途和用法】**

- 跟踪玩家任务/关卡/副本的情况。

**【接口说明：（MLGAMission类）】**


```
//接到任务
+ (void)onBegin:(NSString *)missionId;
//完成任务
+ (void)onCompleted:(NSString *)missionId;
//任务失败
+ (void)onFailed:(NSString *)missionId failedCause:(NSString *)cause;
```

**参数说明：**

参数|类型|是否必填|描述
missionId|NSString|必填|任务、关卡或副本的编号，最多32个字符。
cause|NSString|必填|失败原因，最多16个字符。共支持100种原因，此处可填写ID，别名可在报表编辑。

示例1：
玩家进入名称为“蓝色龙之领地”的关卡。可调用：

```
[MLGAMission onBegin:@"蓝色龙之领地"];
```

游戏进入了后台，如果再次进入游戏时，关卡可继续，可调用:

```
// 暂停 `蓝色龙之领地` 任务计时
[MLGAMission onPause:@"蓝色龙之领地"];

// 暂停对所有任务的计时
[MLGAMission pauseAll];
```

玩家重新进入游戏，如果关卡可继续，可调用：

```
// 继续对某个任务计时
[MLGAMission onResume:@"aMission"];

// 继续所有任务的计时
[MLGAMission resumeAll];
```

**说明：** 在应用触发 `UIApplicationWillResignActiveNotification` 消息时，SDK 会调用 `[MLGAMission pauseAll];` 暂停所有任务/关卡的计时。在应用触发 `UIApplicationDidBecomeActiveNotification` 消息时，SDK 会调用 `[MLGAMission resumeAll];` 恢复所有任务/关卡的计时。

玩家成功打过了关卡：

```
[MLGAMission onCompleted:@"蓝色龙之领地"];
```

示例2：
玩家接到了“主线任务5”后，又接受了某个主线任务“赚钱1”，之后他在赚钱任务1进行中因为觉得任务过难，放弃任务而失败。

```
[MLGAMission onBegin:@"主线任务5"];
[MLGAMission onBegin:@"赚钱1"];
[MLGAMission onFailed:@"赚钱1" failedCause:@"quit"];
```

-->