# 快速开始

##	安装SDK

####	使用项目模板，快速使用LAS SDK

#####	1.	获取项目模板

[下载Android项目模板](...)，并解压缩至您的Workspace.
	
####	2.	打开项目模板

#####	Android Studio 

	1. 	打开Android Studio，点击“Import project”
	2. 	进入项目模板根目录，选择“build.gradle”
	3. 	按照默认配置点击下一步，直到完成 

#####	Eclipse
	
	1.	打开Eclipse，点击 "File" -> "Import.." 
	2. 	选择 "General"-> "Existing Projects into Workspace"
	3. 	勾选“Select root directory”，进入workspace目录，在项目列表中，选择LASStarterProject
	
##	配置LAS项目

###	连接项目与LAS应用
	
	在Application的onCreate()方法中，调用`LASConfig.initialize`来设置您应用的Application ID 和 REST API Key：
	
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