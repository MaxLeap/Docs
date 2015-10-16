##	安装SDK

##	使用模板创建MaxLeap项目

1.	获取项目模板，并解压缩至您的Workspace
		
	<a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-Android" target="_blank">下载 Android 项目模板</a>
	
2.	打开项目模板

Android Studio 

1. 	打开Android Studio，点击“Import project”
2. 	进入项目模板根目录，选择“build.gradle”
3. 	按照默认配置点击下一步，直到完成 

Eclipse
	
1.	打开Eclipse，点击 "File" -> "Import.." 
2. 	选择 "General"-> "Existing Projects into Workspace"
3. 	勾选“Select root directory”，进入workspace目录，在项目列表中，选择MLStarterProject
	
##	配置MaxLeap项目

1. 连接项目与MaxLeap应用
	
	在Application的onCreate()方法中，调用`MaxLeap.initialize`来设置您应用的Application ID 和 REST API Key：
	
```java
import android.app.Application;
import com.maxleap.MaxLeap;

public class MyApplication extends Application {
	@Override
	public void onCreate() {
		super.onCreate();
		MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}");
	}
}
```
	
2. 权限配置

	在AndroidManifest中，给予应用以下权限：
	
```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```
	
权限|用途|是否必需
---|---|---
`ACCESS_NETWORK_STATE`|		检测联网方式，区分用户设备使用的是2G、3G或是WiFi| 必需
`INTERNET`| 	允许应用程序联网，以便向我们的服务器端发送数据| 必需
`READ_PHONE_STATE`| 	获取用户设备的IMEI，通过IMEI来唯一的标识用户| 可选
`ACCESS_WIFI_STATE`| 	获取用户设备的MAC地址，通过MAC地址来唯一的标识用户| 可选
 	
3. 快速测试项目配置

为了测试项目是否已经注连接上MaxLeap应用及其MaxLeap云服务，我们可以向Application的onCreate()方法中添加以下代码：

```java
import android.app.Application;
import com.maxleap.MaxLeap;
import com.maxleap.MLDataManager;
import com.maxleap.MLObject;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}");
        
        //测试项目配置：
        MLObject testObject = new MLObject("People");
        testObject.put("Name", "David Wang");
        MLDataManager.saveInBackground(testObject);
    }
}
```

该段测试代码试图向Cloud Data中创建一个“class” － “People”，并存入一条数据。我们将在管理中心的“开发者中心” -> “云存储” 中发现：

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

表明通过客户端，向应用下的Cloud Data存入数据成功。

## 下一步
至此，您已经完成MaxLeap SDK的安装与必要的配置。请移步至[Android SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID)以获取MaxLeap的详细功能介绍以及使用方法，开启MaxLeap云服务使用之旅。