# 快速开始
LAS Core SDK支持 Android 2.3 或以上版本。

##	安装SDK

####	1.	获取SDK

[下载LAS SDK](https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/Android/v0.6/las-sdk-all.zip)，并解压缩。

####	2.	将SDK添加至项目

将解压后的所有"LAS-*.jar"文件，拖拽至项目的libs目录中。如果你们的项目没有 libs 目录，那么就在项目的根目录下创建一个：通过右键点击项目 Project，选择 New，接下来点击 Folder 菜单即可创建新目录。

#####	Android Studio

在"build.gradle"文件中添加下述依赖：

```java
dependencies {
    compile fileTree(dir: 'libs', include: 'LAS-*.jar')
}
```
	
##	配置LAS项目

###	连接项目与LAS应用
	
如果您还没有在Application的onCreate()方法中，调用`LASConfig.initialize`来设置您应用的Application ID 和 REST API Key：
	
```java
	import android.app.Application;
	import as.leap.LASConfig;

	public class MyApplication extends Application {
	    @Override
	    public void onCreate() {
	        super.onCreate();
	        LASConfig.initialize(this, "{{appid}}", "{{restapikey}}");
	    }
	}
```
	
###	权限配置

在AndroidManifest中，给予应用以下权限：
	
```java
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```
	
权限|用途|是否必需
---|---|---
`ACCESS_NETWORK_STATE`|		检测联网方式，区分用户设备使用的是2G、3G或是WiFi| 必需
`READ_PHONE_STATE`| 	获取用户设备的IMEI，通过IMEI和mac来唯一的标识用户| 必需
`INTERNET`| 	允许应用程序联网，以便向我们的服务器端发送数据| 必需
	
##	快速测试项目配置

为了测试项目是否已经注连接上LAS应用及其LAS云服务，我们可以向Application的onCreate()方法中添加以下代码：

```java
import android.app.Application;
import as.leap.LASConfig;
import as.leap.LASDataManager;
import as.leap.LASObject;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        LASConfig.initialize(this, "{{appid}}", "{{restkey}}");
        
        //测试项目配置：
        LASObject testObject = new LASObject("People");
        testObject.put("Name", "David Wang");
        LASDataManager.saveInBackground(testObject);
    }
}
```

该段测试代码试图向Cloud Data中创建一个“CLASS” － “People”，并存入一条数据。我们将在管理界面的“开发者中心” -> “云存储” 中发现：

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

表明通过客户端，向应用下的Cloud Data存入数据成功。

至此，恭喜您已经完成LAS SDK的安装与必要的配置。请移步至[SDK使用教程](...)以获取LAS的详细功能介绍以及使用方法，开启LAS云服务使用之旅。