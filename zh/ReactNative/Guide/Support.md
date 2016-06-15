
# 用户支持 [![npm version](https://badge.fury.io/js/maxleap-helpcenter-react-native.svg)](http://badge.fury.io/js/maxleap-helpcenter-react-native)

## 简介

用户支持服务是 MaxLeap 为开发者提供的一套标准应用客服方案。在客户端，此方案提供完整的 FAQ 的显示页面及用户反馈对话页面。在Console端，用户支持服务提供FAQ 的管理及用户反馈的处理界面。

## 集成 SDK

### 集成 iOS 环境

1. **重要：**先安装 `maxleap-react-native`, 参照 [MaxLeap 开发文档](http://badge.fury.io/js/maxleap-react-native)

2. 安装 `maxleap-helpcenter-react-native`

	```bash
	npm install --save maxleap-helpcenter-react-native
	```

3. 打开 Finder，找到本项目的根目录，使用 Xcode 打开 iOS 工程（双击 .xcodeproj 文件即可），然后导航到 `/node_modules/maxleap-helpcenter-react-native/ios/lib` 目录，把该目录下的 frameworks 都拖到 Xcode 工程中

4. 添加 Framework Search Paths

	在 Xcode 中，导航到 Targets -> YourAppName -> "Build Settings"，找到 “Framework Search Paths” 一项，添加下面这个路径：
	
	`$(SRCROOT)/../node_modules/maxleap-helpcenter-react-native/ios/lib` 并设置为`recursive`


### 集成 Android 环境

1. 按照 [MaxLeap 文档](https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#用户支持) 添加项目依赖。

1. 修改父工程目录下的 `build.gradle` 文件（与 `settings.gradle` 位于同级目录）。

    ```groovy
    repositories {
        flatDir{
            dirs '../../node_modules/maxleap-helpcenter-react-native/dist/android'
        }
    }
    ```

2. 修改应用目录下的 `build.gradle` 文件，添加以下依赖

    ```groovy
    dependencies {
        compile(name:'maxleap-helpcenter-react-native', ext:'aar')
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
                new MLHelpCenterReactPackage()
        );
    }
    ```

## API



**ShowFAQs()**

弹出 FAQs 界面, 此界面右上角会有一个按钮 `Contact Us`, 点击会跳到用户反馈界面


**showConversation()**

直接弹出用户反馈界面


## 示例

```js
import React, { Component } from 'react';
import ReactNative, { View, Text, TouchableHighlight } from 'react-native';
import HelpCenter from 'maxleap-helpcenter-react-native';

const styles = {
  container: {
    justifyContent: 'center',
    flex: 1
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18
  },
  btn: {
    height: 50,
    justifyContent: 'center'
  }
};

export default class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={()=>HelpCenter.showFAQs()}
                            underlayColor={'#32BE78'}
                            style={styles.btn}>
          <Text style={styles.btnText}>
            Help
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>HelpCenter.showConversation()}
                            underlayColor={'#F2BE78'}
                            style={styles.btn}>
          <Text style={styles.btnText}>
            Contact Us
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
```

## 自定义 UI

请参考 [iOS 用户支持指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_ZH) 与 [Android 用户支持指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH)