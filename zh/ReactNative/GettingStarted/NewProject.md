

# MaxLeap SDK RN [![npm version](https://badge.fury.io/js/maxleap-react-native.svg)](http://badge.fury.io/js/maxleap-react-native)

## 创建 MaxLeap 应用


1. 进入 [MaxLeap](https://maxleap.cn) 注册并登录，然后在 [云数据](https://maxleap.cn/clouddata) 创建class，这里创建一个Post class。
	
	注意：SDK 没有创建 / 删除 class 的权限，所以要先在 [云数据](https://maxleap.cn/clouddata) 中创建好需要用到的 class。
	   

2. 进入 我的应用－应用设置－应用密钥 复制 Application ID，Client Key。

## 创建 react-native 项目

```bash
$ react-native init Demo
```

详细信息请参考 [React Native 入门](http://facebook.github.io/react-native/docs/getting-started.html)

## 安装 SDK

```bash
npm install --save maxleap-react-native
```

### 集成 iOS 环境

1. 打开 Finder, 导航到当前项目根目录，进入 `node_modules/maxleap-react-native/ios/lib` 文件夹，把这个文件夹下的 frameworks 都添加到 Xcode 工程中。
2. 在弹出的对话框中的 `Added folders` 选项上选择 `Create groups`，点击 `Finish`。
3. 添加依赖
	确保“Enable Modules (C and Objective-C)” 和 “Link Frameworks Automatically”的生成设置为 Yes。

	点击 Targets → YourAppName → "Build Phases" 栏。</br>
	展开 “Link Binary With Libraries”
	
	点击 "Link Binary With Libraries" 左下角+号按钮，添加下列框架：
	
	`MobileCoreServices.framework`</br>
	`CoreTelephony.framework`</br>
	`SystemConfiguration.framework`</br>
	`libsqlite3.dylib`</br>
	`libz.dylib`</br>

5. 添加 Framework Search Paths

	在 Xcode 中，导航到 Targets -> YourAppName -> "Build Settings"，找到 “Framework Search Paths” 一项，添加下面这个路径：
	
	`$(SRCROOT)/../node_modules/maxleap-react-native/ios/lib`

6. 修改 `AppDelegate.m` 文件

	加入以下代码：
	
	```objc
	#import <MaxLeap/MaxLeap.h>
	
	- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	
	   [MaxLeap setApplicationId:@"your_maxleap_appId" 
	                   clientKey:@"your_maxleap_clientKey"
	  	  				 	    site:MLSiteCN];
	   // your code ...
	}
	```


### 集成 Android 环境

1. 修改父工程目录下的 `build.gradle` 文件（与 `settings.gradle` 位于同级目录）。

    ```groovy
    repositories {
        flatDir{
            dirs '../../node_modules/maxleap-react-native/dist/android'
        }
    }
    ```

2. 修改应用目录下的 `build.gradle` 文件，添加以下依赖

    ```groovy
    dependencies {
        compile(name:'maxleap-react-native', ext:'aar')
    }
    ```

3. 修改工程的主 Activity 文件。

    ```java
    import android.os.Bundle;
    import com.maxleap.reactnative.MaxLeap;

    private MaxLeap maxLeap;

     @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 确保在 super.onCreate() 之前调用以下代码
        maxLeap = new MaxLeap(this, APP_ID, API_KEY);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                maxLeap.getReactPackage()
        );
    }
    ```

## 开始测试

1. 注册应用内用户并登录：

	```javascript
	var user = new ML.User();
	user.set('username', 'yourname@example.com');
	user.set('password', 'yourpassword');
	user.set('email', 'yourname@example.com');
	
	user.signUp().then(function (user) {
		alert('success');
	});
	```
	注意：
	[云数据](https://maxleap.cn/clouddata) 中的数据操作需要权限认证，所以请确保你在登录状态。

2.  存储数据：

	```javascript
	var Post = ML.Object.extend('Post');
	post.set('title', 'post title');
	post.save().then(function(){
		alert('success');
	});
	```
	
## 下一步

至此，您已经完成 ReactNative SDK 的安装与必要的配置。请移步至 [ReactNative SDK使用指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_REACTNATIVE) 以获取 MaxLeap 的详细功能介绍以及使用方法，开启 MaxLeap 云服务之旅。
