# 如何使用 MaxLeap 快速实现仿微信应用
## 业务需求
###一、登录：
1、提供用注册、登录功能；
2、支持手机短信验证登录；
3、微博、QQ、微信等第三方登录。

###二、聊天：
1、添加删除好友，同好友进行聊天；
2、创建并管理群组，进行群组聊天；
3、关键并管理聊天室，进入聊天室群聊。

###三、说说：
查看说说图文信息，并进行评论或者点赞。
1、广场：获得所有人发布的图文信息；
2、朋友圈：获得自己所有好友发布的图文信息；
3、指定用户发布的说说：或者自己或者其他指定用户所发布的所有图文信息。

## 方案选择

### 传统方案
IM常用的实现方式是基于XMPP/Jabber协议，组建服务器。在客户端集成XMPPFramework实现登录、认证以及消息收发功能。
说说功能目前没有完整的开源框架，需要自己组建服务器并进行服务器软件开发。
IM和聊天中发送的图片、语音和视频等信息，需要使用文件服务器进行存储。
### MaxLeap 方案
MaxLeap对于每个app，都自动内建支持文件存储、聊天和说说的所有功能，只需要在客户端直接调用SDK就可以进行注册、登录，聊天和信息发布！

## MaxLeap 实现
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


###三、聊天模块：
1、集成并登陆MaxLeap聊天SDK：导入MaxIMLib.framework，并使用MAXLEAP_APPID建立一个MLIMClient对象，并实现MLIMClientDelegate协议方法完成实现例如IM实时接收、系统消息接收等功能。在MaxChat中，[MaxChatIMClient sharedInstance]中创建了一个client对象，并实现了常用协议， 例如：


	- (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromFriend:(MLIMFriendInfo *)aFriend {
    	// 更新最近聊天
    	// 把信息发送到同aFriend相对应的聊天窗口中
	}

	- (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromGroup:(MLIMGroup *)group {
    	// 更新最近聊天
    	// 把信息发送到group对应的聊天窗口中
	}

2、登录MLIMClient：MLIMClient直接支持MLUser的用户名、密码登录，也支持手机短信验证或者第三方登录。除此之外，MLIMClient也支持无验证登录。在MaxChat中，在MaxLeap已经登录的情况下，使用MaxLeap的用户名直接无验证登录MLIMClient。代码如下：

	[self.client loginWithUserId:currentUser.username
                              completion:^(BOOL succeeded, NSError * _Nullable error) {
                              }];

2、聊天窗口：MaxChat中聊天窗口基于[JSQMessagesViewController](https://github.com/jessesquires/JSQMessagesViewController)，在项目中通过JSQMessageViewContrller的subclass和MCMessagesModelData来实现MaxIM消息的显示和收发。

3、MCMessagesModelData介绍：用于给JSQMessagesViewController提供数据，并完成MLIMClient消息的实时收发。

3.1、历史消息：在MaxIM服务器上保存了7天的好友或者群组聊天的历史消息，当JSQMessagesViewController弹出后，MCMessagesModelData获取对应的历史消息并转为JSQMessage，在聊天窗口中显示。代码示例如下：


    self.messages = [[NSMutableArray alloc] init];
    // 获取ts前的历史消息
    NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
    if (self.group==nil && self.members.count==1) {
        // 获取好友的历史消息
        [IMCurrentUser getLatestChatsWithFriend:self.members.firstObject
                                beforeTimestamp:ts
                                          limit:10
                                          block:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
                                              if (!error) {
                                                  [messages enumerateObjectsUsingBlock:^(MLIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                                                      [self receiveMessage:obj];
                                                  }];
                                                  
                                                  [self.messagesController finishReceivingMessageAnimated:NO];
                                              }
                                          }];
    } else {
        // 获取群组历史消息
        [self.group getLatestMessagesBefore:ts
                                      limit:10
                                 completion:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
                                     if (!error) {
                                         [messages enumerateObjectsUsingBlock:^(MLIMMessage * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                                             [self receiveMessage:obj];
                                         }];
                                         
                                         [self.messagesController finishReceivingMessageAnimated:NO];
                                     }
                                 }];
        
    }
    
3.2、MaxIM消息转换和存储
MaxIM历史消息消息类型为MLIMMessage，需要转换为JSQMessage，存储在messages数组中，供JSQMessagesViewController进行显示。MLIMClient收到的实时消息也直接转换并存储到messages中。对于图片和音视频消息，MCMessagesModelData需要在后台线程中下载图片或者音视频数据，并刷新JSQMessagesViewController。收取消息的代码示例如下：

    if (obj.mediaType==MLIMMediaTypeVideo) {
        MCVideoMediaItem *videoMediaItem = [[MCVideoMediaItem alloc] initWithVideoURL:nil isReadyToPlay:NO];
        videoMediaItem.appliesMediaViewMaskAsOutgoing = [obj.sender.userId isEqualToString:IMCurrentUserID];
        JSQMessage *mediaMessage = [[JSQMessage alloc]initWithSenderId:obj.sender.userId
                                                     senderDisplayName:obj.sender.userId
                                                                  date:[NSDate dateWithTimeIntervalSince1970:obj.sendTimestamp]
                                                                 media:videoMediaItem];
        [self.messages addObject:mediaMessage];
        
        NSURL *videoURL = [NSURL URLWithString:obj.attachmentUrl];
        NSURL *cacheURL = [MCMessagesModelData cacheURLForMediaURL:obj.attachmentUrl extension:@"mp4"];
        
        if (![[NSFileManager defaultManager]fileExistsAtPath:cacheURL.path]) {
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSData *data = [NSData dataWithContentsOfURL:videoURL];
                if (data) {
                    [data writeToURL:cacheURL atomically:YES];
                    dispatch_async(dispatch_get_main_queue(), ^{
                        videoMediaItem.videoURL = cacheURL;
                        videoMediaItem.isReadyToPlay = YES;
                        [self.messagesController finishReceivingMessageAnimated:NO];
                    });
                }
            });
        } else {
            videoMediaItem.videoURL = cacheURL;
            videoMediaItem.isReadyToPlay = YES;
        }
        
    } else if (obj.mediaType==MLIMMediaTypeAudio){
        MCAudioMediaItem *audioMediaItem = [[MCAudioMediaItem alloc] init];
        audioMediaItem.appliesMediaViewMaskAsOutgoing = [obj.sender.userId isEqualToString:IMCurrentUserID];
        JSQMessage *mediaMessage = [[JSQMessage alloc]initWithSenderId:obj.sender.userId
                                                     senderDisplayName:obj.sender.userId
                                                                  date:[NSDate dateWithTimeIntervalSince1970:obj.sendTimestamp]
                                                                 media:audioMediaItem];
        [self.messages addObject:mediaMessage];
        
        NSURL *audioURL = [NSURL URLWithString:obj.attachmentUrl];
        NSURL *cacheURL = [MCMessagesModelData cacheURLForMediaURL:obj.attachmentUrl extension:nil];
        
        if (![[NSFileManager defaultManager]fileExistsAtPath:cacheURL.path]) {
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSData *data = [NSData dataWithContentsOfURL:audioURL];
                if (data) {
                    [data writeToURL:cacheURL atomically:YES];
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [audioMediaItem setAudioDataWithUrl:cacheURL];
                        [self.messagesController finishReceivingMessageAnimated:NO];
                    });
                }
            });
        } else {
            [audioMediaItem setAudioDataWithUrl:cacheURL];
        }
        
    } else if (obj.mediaType==MLIMMediaTypeImage) {
        JSQPhotoMediaItem *photoMediaItem = [[JSQPhotoMediaItem alloc] initWithImage:nil];
        photoMediaItem.appliesMediaViewMaskAsOutgoing = [obj.sender.userId isEqualToString:IMCurrentUserID];
        
        JSQMessage *mediaMessage = [[JSQMessage alloc]initWithSenderId:obj.sender.userId
                                                     senderDisplayName:obj.sender.userId
                                                                  date:[NSDate dateWithTimeIntervalSince1970:obj.sendTimestamp]
                                                                 media:photoMediaItem];
        [self.messages addObject:mediaMessage];
        
        NSURL *photoURL = [NSURL URLWithString:obj.attachmentUrl];
        [[SDWebImageManager sharedManager]downloadImageWithURL:photoURL
                                                       options:kNilOptions
                                                      progress:nil
                                                     completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
                                                         if (image) {
                                                             photoMediaItem.image = image;
                                                             [self.messagesController finishReceivingMessageAnimated:NO];
                                                         }
                                                     }];
        
    } else if (obj.mediaType==MLIMMediaTypeText) {
        [self.messages addObject: [[JSQMessage alloc] initWithSenderId:obj.sender.userId
                                                     senderDisplayName:obj.sender.userId
                                                                  date:[NSDate dateWithTimeIntervalSince1970:obj.sendTimestamp]
                                                                  text:obj.text]
         ];
    }

3.3、消息发送：只需要将JSQMessagesViewController中生成的JSQMessage转换为对应的MLIMMessage，并调用MLIMClient的sendMessage方法即可把消息发送给对应的好友或者群组。对于图片和音视频消息，只需要使用本地文件创建MLIMMessage，MLIMClient sendMessage会把文件上传到云服务器，并把链接发送给接收端。


###四、社交模块：
1、集成MaxLeap社交SDK：导入MaxSocial.framework，使用 [MaxSocialUser userWithId: uid] 即可创建MaxSocial用户。在MaxChat中使用当前已经登录的MLUser的用户名来创建默认的MaxSocialUser，直接调用宏定义MaxSocialCurrentUser就可以使用。

2、发布说说：使用当前MaxSocialUser的postShuoShuo方法可以发布包括图文信息的说说，代码如下：

    // 一条带文字和图片的说说，contentString为文字信息，imageURLs是图片的本地路径，sendToSquare表示十分同时发布到广场
    MaxSocialShuoShuoContent *content = [MaxSocialShuoShuoContent contentWithText:contentString imageURLs:imageURLs];
    MaxSocialShuoShuo *shuoshuo = [[MaxSocialShuoShuo alloc]init];
    shuoshuo.content = content;
    [MaxSocialCurrentUser postShuoShuo:shuoshuo toSquare:sendToSquare block:^(BOOL succeeded, NSError * _Nullable error) {
        if (succeeded) {
				// 发布成功
        } else {
        		// 发布失败，根据错误进行检查
        }
    }];

3、获取说说列表，MaxSocial提供了getLatestShuoShuoInSquareWithQuery、getLatestShuoShuoInFriendCycleWithQuery和getShuoShuoWithQuery等方法获取广场，朋友圈和个人的说说列表，返回的数据格式一样，包括了说说列表，每个说说对应的评论和赞。代码示例如下：

    MaxSocialQuery *query = [MaxSocialQuery new]; // default query
    query.page = page;
    query.limit = 10;
    
    MLDictionaryResultBlock block = ^(NSDictionary * _Nullable result, NSError * _Nullable error) {
        NSDictionary *likes = result[@"zans"];
        NSDictionary *comments = result[@"comments"];
        
        NSArray<MaxSocialShuoShuo *> *shuoshuos = result[@"shuoshuos"];
        NSMutableArray *remoteShuoshuos = [NSMutableArray arrayWithCapacity:shuoshuos.count];
        // 创建MaxSocialRemoteShuoShuo对象，每个说说信息中包括了对应的comments和zans列表。
        for (MaxSocialShuoShuo *s in shuoshuos) {
            MaxSocialRemoteShuoShuo *rs = [[MaxSocialRemoteShuoShuo alloc]initWithMaxSocialShuoShuo:s];
            rs.zans = [NSMutableArray array];
            rs.comments = [NSMutableArray array];
            
            [likes enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                if ([key isEqualToString:rs.objectId]) {
                    [rs.zans addObjectsFromArray:obj];
                }
            }];
            
            [comments enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                if ([key isEqualToString:rs.objectId]) {
                    [rs.comments addObjectsFromArray:obj];
                }
            }];
            
            [remoteShuoshuos addObject:rs];
        }

    };
    
    if (isSquare) {
    	  // 获取广场说说
        [MaxSocialCurrentUser getLatestShuoShuoInSquareWithQuery:query block:block];
    } else {
        
        if (self.isCycle) {
        		// 获取timelineUser的朋友圈说说
            [MaxSocialUserWithId(timelineUser) getLatestShuoShuoInFriendCycleWithQuery:query block:block];
        } else {
        		// 获取timelineUser发布的说说
            [MaxSocialUserWithId(timelineUser) getShuoShuoWithQuery:query block:block];
        }
        
    }
