# 应用内社交 [![npm version](https://badge.fury.io/js/maxleap-social-react-native.svg)](http://badge.fury.io/js/maxleap-soical-react-native)

## 集成 SDK

1. **重要：**先安装 `maxleap-react-native`, 参照 [MaxLeap RN 开发文档](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_REACTNATIVE)

2. 安装 `maxleap-social-react-native`

	```bash
	npm install --save maxleap-social-react-native
	```

3. 打开 Finder，找到本项目的根目录，使用 Xcode 打开 iOS 工程（双击 .xcodeproj 文件即可），然后导航到 `/node_modules/maxleap-social-react-native/ios/lib` 目录，把该目录下的 frameworks 都拖到 Xcode 工程中

4. 添加 Framework Search Paths

	在 Xcode 中，导航到 Targets -> YourAppName -> "Build Settings"，找到 “Framework Search Paths” 一项，添加下面这个路径：
	
	`$(SRCROOT)/../node_modules/maxleap-social-react-native/ios/lib`

### 集成 Android 环境

1. 按照 [MaxLeap 文档](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#INAPPSOCIAL_ZH) 添加项目依赖。

1. 修改父工程目录下的 `build.gradle` 文件（与 `settings.gradle` 位于同级目录）。

    ```groovy
    repositories {
        flatDir{
            dirs '../../node_modules/maxleap-social-react-native/dist/android'
        }
    }
    ```

2. 修改应用目录下的 `build.gradle` 文件，添加以下依赖

    ```groovy
    dependencies {
        compile(name:'maxleap-social-react-native', ext:'aar')
    }
    ```

3. 修改工程的主 Activity 文件。

    ```java
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        MaxLeap.initialize(this, APP_ID, API_KEY, MaxLeap.REGION_CN);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new MLInAppSocialReactPackage()
        );
    }
    ```
