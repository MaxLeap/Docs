# 如何使用 MaxLeap 快速实现电商应用
## 业务需求
### 一、产品展示及搜索
提供热销产品展示，分类展示，搜索等功能。
### 二、购物车
用于暂存用户选择的产品，便于统一结算。
### 三、创建订单
选择购物车产品或者单件产品，生成订单，选择收货地址、支付方式并结算价格。
### 四、支付
通过支付宝、微信支付或者银联进行支付。
### 五、物流跟踪及评价
产品发货后，进行物流跟踪，用户收到货物进行确认，并进行评价。


## 方案选择

### 传统方案
  传统方案需要服务器端和移动端配合开发。首先要搭建自己的服务器提供数据，移动端根据用户操作与服务器数据进行交互。服务器端负责数据的处理，并提供API供移动端调用。移动端读取后台数据，并根据用户操作与后台数据交互。服务器端与移动端需要协调开发、设计API，进行大量的测试工作。

### MaxLeap 方案
 开发者在MaxLeap云平台创建表格存储数据，MaxLeap提供存储服务，直接使用SDK来操作数据的增删改查。购物车和订单等数据直接由客户端创建并存储在服务器上，MaxLeap后台还集成了在线支付功能，只需要配置好商家的id就可以在客户端调用API完成支付。MaxLeap方案大幅度节约了项目开发中的后台开发工作，提高开发效率.

## MaxLeap 实现
###注：需要注册MaxLeap的appId和clientKey来集成MaxLeap服务，开发者可以到 https://maxleap.cn/ 注册账号并创建APP，记录appId和clientKey用于集成MaxLeap服务。
###一、集成MaxLeap SDK，使用MaxLeap内建用户管理功能进行用户注册，登录和保存用户个人资料。
1、集成方法：根据使用手册 <https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html>，将MaxLeap.framework导入项目中，并在AppDelegate.m中启动MaxLeap SDK：

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    		
    		...
    		
    		[MaxLeap setApplicationId:kMaxLeap_Application_ID clientKey:kMaxLeap_Client_Key site:MLSiteCN];;

		}

2、MaxLeap系统提供多种登陆方式。未注册用户可以使用手机号码短信验证登陆，调用方式如下：

	[MLUser loginWithPhoneNumber:phoneNumber
                         smsCode:smsCode
                           block:^(MLUser * _Nullable user, NSError * _Nullable error) {
        if (user && !error) {
            if (user.isNew) {
                DDLogInfo(@"注册成功:phoneNumber = %@, smsCode = %@", phoneNumber, smsCode);
            } else {
                DDLogInfo(@"登录成功:phoneNumber = %@, smsCode = %@", phoneNumber, smsCode);
            }
            
        } else {
            DDLogInfo(@"用手机验证码登录失败:phoneNumber = %@, smsCode = %@, error: %@", phoneNumber, smsCode, error);
        }
    }];

###二、后台数据库及配置
1、产品相关数据，包括产品类别，列表，热销产品：这类数据用于产品展示，在后台数据库中配置，app端使用MaxLeap SDK中的CloudData相关API下载产品信息并展示。产品相关数据使用管理后台进行维护和修改，app端不进行任何修改。

2、用户订单相关数据，包括购物车、用户订单和用户地址等信息。这类数据主要由app端生成并存储于服务器上。使用MaxLeap SDK中的CloudData相关API可以很方便对这类数据进行增删改查相关操作。

3、支付设置：在支付前，应在MaxLeap管理后台的“应用设置”-“支付设置”中，填写支付宝、微信及银联支付等商家信息以及相关的加密证书等。

4、支付管理：在MaxLeap管理后台的“运营中心”-“支付管理”-“交易管理”中可以查看所有的交易记录。用户发起支付时，价格及订单信息被存储在交易列表中。支付结果在后台服务器中处理，app端只能通过订单号查询结果。


###三、app端进行支付和查询
1、Sample中已经把常用的三种支付方式统一为一条api调用，下面的一段代码展示了使用方法：

    NSString *existSchemeStr = NULL;
    NSDictionary *urlTypeDic = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"]];
    NSArray * urlTypes = urlTypeDic[@"CFBundleURLTypes"];
    if (urlTypes.count) {
        existSchemeStr = [[urlTypes firstObject][@"CFBundleURLSchemes"] firstObject];
        MLPayChannel channel = self.paymentMethod?(self.paymentMethod==1?MLPayChannelWxApp:MLPayChannelUnipayApp):MLPayChannelAliApp;
        [[MaxPaymentManager sharedManager]payWithChannel:channel
                                                 subject:@"支付"
                                                  billNo:self.order.orderId
                                                totalFen:self.order.totalPrice.floatValue
                                                  scheme:existSchemeStr
                                               returnUrl:channel==MLPayChannelUnipayApp?@"http://maxleap.cn/returnUrl":nil
                                              extraAttrs:nil
                                              completion:^(BOOL succeeded, MLPayResult *result) {
                                                  NSLog(@"pay result %@", @(succeeded));
                                              }];
        
    } else {
        NSLog(@"Error: no url scheme, can not pay");
    }
    
2、根据发起支付的billNo参数（order.orderId）来查询支付结果：

    NSString *currentOrderId = order.orderId;
    [MaxLeapPay queryOrderWithBillNo:currentOrderId
                               block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
                               	
                                       BOOL success = NO;
                                       for (MLOrder *billInfo in objects) {
                                           if ([billInfo.billNo isEqualToString:currentOrderId] && [billInfo.status isEqualToString:@"success"]) {
                                               success = YES;
                                           }
                                       }
                                       if (success) {
                                           NSLog(@"bill %@ payed", currentOrderId);
                                       } else {
                                           NSLog(@"bill %@ not payed", currentOrderId);
                                       }
                                   
                               }];
                       
                       
###四、发货
根据MaxLeap管理后台的“运营中心”-“支付管理”-“交易管理”中的交易记录，对已经完成支付的交易进行确认，然后进行下单发货，并开始物流跟踪。

###五、用户收货确认
用户完成收货后，可以在app端进行确认，app端通过调用MaxLeap SDK中CloudData API来存储用户确认信息到服务器上。

## FAQ