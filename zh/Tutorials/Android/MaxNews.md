# 如何使用 MaxLeap 快速实现新闻客户端
## 业务需求
###一、登录：
1、提供用注册、登录功能；
2、支持手机短信验证登录；
3、微博、QQ、微信等第三方登录。

###二、发表评论
  浏览News时可以发表评论

###三、收藏News
  可以收藏感兴趣的News

## 方案选择

### 传统方案
 传统方案需要服务器端和移动端配合开发。首先要搭建自己的服务器提供数据，移动端根据用户操作与服务器数据进行交互。服务器端负责数据的处理，并提供API供移动端调用。移动端读取后台数据，并根据用户操作与后台数据交互。服务器端与移动端需要协调开发、设计API等。
 
### MaxLeap 方案
 开发者在MaxLeap云平台创建表格存储数据，我们提供存储服务，直接使用SDK来操作数据的增删改查。开发者只需要将新闻数据整理到云平台表格中，需要处理表格数据时直接调用SDK就能轻松完成。MaxLeap方案省去了项目开发中的后台开发工作，提高开发效率.

## MaxLeap 实现
###注：需要注册MaxLeap的appId和clientKey来集成MaxLeap服务，开发者可以到 https://maxleap.cn/ 注册账号并创建APP，记录appId和clientKey用于集成MaxLeap服务。
###一、集成MaxLeap SDK，使用MaxLeap内建用户管理功能进行用户注册，登录和保存用户个人资料。
1、集成方法：根据使用手册 <https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html>，将MaxLeap.framework导入项目中，并在AppDelegate.m中启动MaxLeap SDK：

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    		
    		...
    		
    		[MaxLeap setApplicationId:MAXLEAP_APPID clientKey:MAXLEAP_CLIENTKEY site:MLSiteCN];

		}
		
2、注册MaxLeap用户：

        MLUser *user = [MLUser user];
        user.username = username;
        user.password = password;
        [user signUpInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
            if (succeeded) {
                // 注册成功 
            } else {
                // 注册失败，请检查错误，例如网络错误，同名用户等等
            }
        }];
        
3、MaxLeap用户登录
 
         [MLUser logInWithUsernameInBackground: username
                                      password: password
                                         block: ^(MLUser *user, NSError *error) {
                                            if (user) {
                                               // 登录成功
                                            } else {
                                               // 登录失败
                                            }
          }];
4、使用image设置个人图标：

            NSData *data = UIImageJPEGRepresentation(image, 0.8);
            MLFile *file = [MLFile fileWithName:@"icon.jpg" data:data];
            [file saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
                if (succeeded) {
                    NSString *urlString = file.url;
                    [[MLUser currentUser]setObject:urlString forKey:@"iconUrl"];
                    [[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
                        if (succeeded) {
                            // 设置个人图标成功
                        } else {
                            // 失败
                        }
                    }];
                } else {
                    // 文件上传失败，请检查网络
                }
            }];
###二、使用手机验证码登录，或者使用微博、QQ、微信等第三方登录：
1、根据需要导入项目的framework：MLWeiboUtils.framework支持微博登录，MLQQUtils.framework支持QQ登录，MLWeChatUtils.framework支持微信登录。

2、下载微博、QQ及微信的第三方登录SDK并导入项目中。MaxChat中的第三方登录SDK目录分别是：微博：libWeiboSDK.a、WeiboSDK.bundle及相关头文件；QQ：TencentOpenAPI.framework和TecentOpenApi_IOS_Bundle.bundle；微信：libWeChatSDK.a及相关头文件。
		
3、在AppDelegate.m中启动第三方登录支持：

		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    		
    		...
    		
    		[MaxLeap setApplicationId:MAXLEAP_APPID clientKey:MAXLEAP_CLIENTKEY site:MLSiteCN];
			
    		[MLWeChatUtils initializeWeChatWithAppId:WECHAT_APPID appSecret:WECHAT_SECRET wxDelegate:self];
    		[MLWeiboUtils initializeWeiboWithAppKey:WEIBO_APPKEY redirectURI:WEIBO_REDIRECTURL];
    		[MLQQUtils initializeQQWithAppId:QQ_APPID qqDelegate:self];
		}
3、在AppDelegate.m中实现第三方登录SDK的回调，以下代码包括了微博、QQ及微信的所有回调方法:
	
	@interface AppDelegate () <WXApiDelegate, WeiboSDKDelegate, TencentSessionDelegate>
	@end
	
	#pragma mark TencentLoginDelegate TencentSessionDelegate

	// 以下三个方法保持空实现就可以，MLQQUtils 会置换这三个方法，但是会调用这里的实现

	- (void)tencentDidLogin {
    
	}

	- (void)tencentDidNotLogin:(BOOL)cancelled {
    
	}

	- (void)tencentDidNotNetWork {
    
	}

	#pragma mark - WeiboSDKDelegate
	- (void)didReceiveWeiboRequest:(WBBaseRequest *)request {
    	NSLog(@"didReceiveWeiboRequest %@", request);
	}

	- (void)didReceiveWeiboResponse:(WBBaseResponse *)response {
    	if ([response isKindOfClass:WBAuthorizeResponse.class]) {
        	[MLWeiboUtils handleAuthorizeResponse:(WBAuthorizeResponse *)response];
    	}
	}

	#pragma mark WXApiDelegate

	- (void)onResp:(BaseResp *)resp {
    	if ([resp isKindOfClass:[SendAuthResp class]]) {
        	[MLWeChatUtils handleAuthorizeResponse:(SendAuthResp *)resp];
    	} else {
        	// 处理其他请求的响应
   		}
	}

	- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation {
   	 	if ([url.absoluteString hasPrefix:@"tencent"]) {
        	return [TencentOAuth HandleOpenURL:url];
    	}
    	if ([url.absoluteString hasPrefix:@"wb"]) {
        	return [WeiboSDK handleOpenURL:url delegate:self];
    	}
    	if ([url.absoluteString hasPrefix:@"wx"]) {
        	return [WXApi handleOpenURL:url delegate:self];
    	}
    
    	return YES;
	}

	- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    	if ([url.absoluteString hasPrefix:@"tencent"]) {
        	return [TencentOAuth HandleOpenURL:url];
    	}
    	if ([url.absoluteString hasPrefix:@"wb"]) {
        	return [WeiboSDK handleOpenURL:url delegate:self];
    	}
    	if ([url.absoluteString hasPrefix:@"wx"]) {
        	return [WXApi handleOpenURL:url delegate:self];
    	}
    
    	return YES;
	}

	- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options {
    	if ([url.absoluteString hasPrefix:@"tencent"]) {
        	return [TencentOAuth HandleOpenURL:url];
    	}
    	if ([url.absoluteString hasPrefix:@"wb"]) {
        	return [WeiboSDK handleOpenURL:url delegate:self];
    	}
    	if ([url.absoluteString hasPrefix:@"wx"]) {
        	return [WXApi handleOpenURL:url delegate:self];
    	}
    
    	return YES;
	}

###三、获取新闻数据
 1. 获取新闻分类信息：
 
        // 查询 MaxLeap 云平台数据
        // 方法1. 不子类化 MLObject
        MLQuery *cateQuery = [MLQuery queryWithClassName:@"Category"];
        [cateQuery findObjectsInBackgroundWithBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
           if (error && objects.count <= 0) {
              [SVProgressHUD showErrorWithStatus:@"获取分类信息失败"];
           } else {
               ...
           }
        }];
 
 2. 获取分类对应的新闻：
    
         - (void)fetchNewsWithCategoryID:(NSString *)categoryID {
            // 方法2: 子类化 MLObject, News 对应MaxLeap云平台数据库表格News
            MLQuery *newsQuery = [News query]; // News : NSObject <MLSubclassing> 
            [newsQuery whereKey:@"belongCategoryID" equalTo:categoryID];
            [newsQuery findObjectsInBackgroundWithBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
                if (error) {
                   [SVProgressHUD showErrorWithStatus:@"获取新闻数据失败"];
                } else {
                    ...
               }
            }];
         }

###四、发表评论
 1.发表:
 
      - (void)commentTheNews:(NSString *)comment {
         // 保存comment到云平台数据库，在云平台上有一张Comment表格 objectWithClassName 的时候传入表格对应的名字
         MLObject *commentObj = [MLObject objectWithClassName:@"Comment"];
         commentObj[@"belongNewsID"] = self.newsToShow.objectId;   // 设置表格字段
         commentObj[@"commentedNews"] = self.newsToShow;
         commentObj[@"commentContent"] = comment;
         commentObj[@"fromUserId"] = currentUser.objectId;
         commentObj[@"fromUser"] = currentUser; // Comment 表格中有一个Pointer->MLUser 字段
         [commentObj saveInBackgroundWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
             if (succeeded) {
                 [SVProgressHUD showSuccessWithStatus:@"评论成功！"];
             } else {
                 [SVProgressHUD showErrorWithStatus:@"评论失败，请稍后再试!"];
             }
         }];
      }
      
2.查找新闻对应的评论:

     - (void)loadCommentsForTheNews:(MLObject *)news {
         // MLQuery 负责查找，可以设置各种查找条件
         MLQuery *commentQuery = [MLQuery queryWithClassName:@"Comment"];
         [commentQuery includeKey:@"fromUser"]; // Comment表格中的fromUser字段为 Point属性，查找时需要用includeKey指明
         [commentQuery includeKey:@"commentedNews"];
         [commentQuery whereKey:@"belongNewsID" equalTo:news.objectId];
         [commentQuery findObjectsInBackgroundWithBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
             ...
         }];
     }

###五、收藏新闻
 1.收藏：
 
      - (void)collectTheNews {
         // UserCollection 表格
         MLObject *collectionObj = [MLObject objectWithClassName:@"UserCollection"];
         collectionObj[@"collectedNews"] = self.newsToShow; // 在表格该字段为 Point 类型
         collectionObj[@"collectedByUserID"] = currentUser.objectId;
         [collectionObj saveInBackgroundWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
             if (succeeded) {
                [SVProgressHUD showSuccessWithStatus:@"收藏成功，可以在个人收藏列表中查看!"];
            } else {
                 [SVProgressHUD showErrorWithStatus:@"收藏失败，请稍后再试!"];
             }
         }];
     }
 2.查找我的收藏：
 
      - (void)fetchMyCollections {
         MLUser *currentUser = [MLUser currentUser];
         MLQuery *collectQuery = [MLQuery queryWithClassName:@"UserCollection"];
         [collectQuery whereKey:@"collectedByUserID" equalTo:currentUser.objectId];
         [collectQuery includeKey:@"collectedNews"];
         [SVProgressHUD showWithStatus:@"Loading..."];
         [collectQuery findObjectsInBackgroundWithBlock:^(NSArray * _Nullable objects, NSError * _Nullable error) {
             if (error) {
                 dispatch_async(dispatch_get_main_queue(), ^{
                     [SVProgressHUD showErrorWithStatus:@"获取收藏失败，请稍后再试!"];
                 });
             } else {
                 ...           
             }
         }];
       }


## FAQ
