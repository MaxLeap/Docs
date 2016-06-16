# 社交分享 [![npm version](https://badge.fury.io/js/maxshare-react-native.svg)](http://badge.fury.io/js/maxshare-react-native)

## 集成 SDK

### 集成 iOS 环境

1. **重要：**先安装 `maxleap-react-native`, 参照 [MaxLeap RN 开发文档](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_REACTNATIVE)

2. 安装 `maxshare-react-native`

	```
	npm install --save maxshare-react-native
	```

3. 打开 Finder，找到本项目的根目录，使用 Xcode 打开 iOS 工程（双击 .xcodeproj 文件即可），然后导航到 `/node_modules/maxshare-react-native/ios/lib` 目录，把该目录下的 frameworks 都拖到 Xcode 工程中

4. 添加 Framework Search Paths

	在 Xcode 中，导航到 Targets -> YourAppName -> "Build Settings"，找到 “Framework Search Paths” 一项，添加下面这个路径：
	
	`$(SRCROOT)/../node_modules/maxshare-react-native/ios/lib`

5. **重要：**此外还需要在 Xcode 中配置各社交平台分享环境，请参阅[MaxLeap 社交分享文档](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SOCIALSHARE_ZH)

### 集成 Android 环境

1. 按照 [MaxLeap 文档](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SOCIALSHARE_ZH) 添加项目依赖。

1. 修改父工程目录下的 `build.gradle` 文件（与 `settings.gradle` 位于同级目录）。

    ```groovy
    repositories {
        flatDir{
            dirs '../../node_modules/maxshare-react-native/dist/android'
        }
    }
    ```

2. 修改应用目录下的 `build.gradle` 文件，添加以下依赖

    ```groovy
    dependencies {
        compile(name:'maxshare-react-native', ext:'aar')
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

## API

### `share([object])`

只接受一个参数，类型为 `object`。
返回一个 promise 对象，如果成功调用了第三方平台的分享接口，返回改平台的 ID


参数键值说明：

键    						| 值类型    | 描述
-----------------------|----------|-------
**`type`**				| `string` | 分享内容的类型，目前支持五种类型：<br>text, image, webpage, music, video
**`title`**				| `string` | 分享内容的标题
**`detail`**				| `string` | 详细描述
**`webpageURL`**			| `string` | 一个网页链接地址
**`previewImagePath`**	| `string` | 预览图片路径，本地文件路径
**`attachmentURL`**		| `string` | 附件链接地址
**`latitude`**			| `number` | 纬度
**`longitude`**			| `number` | 经度
**`rect`**				| `object` | {x: 120, y: 30, width: 20, height: 30}<br>触发分享操作的按钮**在屏幕中的位置**，iPad 上有效，用来在按钮附近以 popover 的形式显示分享界面

## 使用方法

导入模块：

```js
import share from 'maxshare-react-native';
```

- 分享文本

	```js
	let textItem = {
		type: 'text',
		detail: '文字内容', // required
		// for iPad
		rect: {x: 120, y: 30, width: 20, height: 30}
	}

	share(textItem).then(platform => {
	  alert('share text via platform: ' + platform)
	})
	```

- 分享图片

	```js
	let imgItem = {
		type: 'image',
		title: '图片标题', // optional, 只有QQ支持
		detail: '图片描述', // optional, 只有QQ支持
		attachmentURL: '图片链接', // required，支持 fileURL 和 远程图片链接
		previewImagePath: '预览图片文件路径', // optional, 只有QQ支持
		// for iPad
		rect: {x: 120, y: 30, width: 20, height: 30}
	}

	share(imgItem).then(platform => {
	  alert('share an image via platform: ' + platform)
	})
	```

- 分享网页

	```js
	let webItem = {
		type: 'webpage',
		title: '网页标题',
		detail: '网页描述',
		webpageURL: '网页链接',
		previewImagePath: '预览图片文件路径',
		// for iPad
		rect: {x: 120, y: 30, width: 20, height: 30}
	}

	share(webItem).then(platform => {
	  alert('share a webpage via platform: ' + platform)
	})
	```

- 分享音乐

	```js
	let musicItem = {
		type: 'music',
		title: '音乐标题',
		detail: '音乐描述',
		webpageURL: '音乐网页链接', // 微博，微信支持，QQ不支持
		attachmentURL: '音乐数据流链接',
		previewImagePath: '预览图片文件路径',
		// for iPad
		rect: {x: 120, y: 30, width: 20, height: 30}
	}

	share(musicItem).then(platform => {
	  alert('share a music via platform: ' + platform)
	})
	```

- 分享视频

	```js
	let videoItem = {
		type: 'music',
		title: '视频标题',
		detail: '视频描述',
		webpageURL: '视频网页链接',	// 微信，微博支持，QQ 不支持
		attachmentURL: '视频数据流链接', // QQ, 微博支持，微信不支持
		previewImagePath: '预览图片文件路径',
		// for iPad
		rect: {x: 120, y: 30, width: 20, height: 30}
	}

	share(videoItem).then(platform => {
	  alert('share a video via platform: ' + platform)
	})
	```
