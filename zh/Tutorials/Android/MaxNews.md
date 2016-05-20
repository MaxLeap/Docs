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
 


## FAQ
