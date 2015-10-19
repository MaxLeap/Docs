##	安装 SDK

HelpCenter 是依赖于 MaxLeap Core SDK 之上的服务，在安装和使用 HelpCenter SDK 之前，请确保您的项目已经安装 MaxLeap Core SDK. 您可以在 [MaxLeap Core SDK 安装向导](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID) 中获取更多信息。

1. 获取SDK

    <a class="download-sdk" href="https://github.com/MaxLeap/Demo-Support-Android" target="_blank">下载 MaxLeap HelpCenter SDK</a>

2. 添加SDK

    **Android Studio**

    1. 	打开 Android Studio，点击 “File” -> "New.." -> "Import Module"，选择所下载 SDK 的 "MaxLeap HelpCenter" 目录
    2. 	打开需要使用 HelpCenter 的 Module，在其 `build.gradle` 中添加如下依赖：

    ```gradle
    dependencies {
      compile project(':MLHelpcenter')
    }
    ```

##	连接项目与 MaxLeap 应用

在 `Application` 的 `onCreate()` 方法中，调用 `MaxLeap.initialize` 来设置您应用的 `Application ID` 和 `REST API Key`：

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

##	权限配置

在 `AndroidManifest.xml `中，给予应用以下权限：

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

##	快速测试

1. 测试 MaxLeap Core SDK

    为了测试项目是否已经注册至 MaxLeap，我们可以向 `Application` 的 `onCreate()` 方法中添加以下代码：

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

    该段测试代码试图向 Cloud Data 中插入一条 `class` 为 `People` 的数据。我们将在管理中心的“开发者中心” -> “云存储” 中发现：

    ![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

    表明通过客户端已经向应用下的 Cloud Data 成功插入数据。至此，MaxLeap SDK的安装与配置完成。

2. 测试 MaxLeap HelpCenter SDK

    为了测试项目能否使用 MaxLeap HelpCenter 服务，我们可以向 `Application` 的`onCreate()` 方法中添加以下代码：

    ```java
    MLHelpCenter.openFaqs(MainActivity.this);
    ```

    运行后，您将在安卓测试设备中看见：

    ![imgSupportHome](../../../images/imgSupportHome.png)

    点击右上角“提交反馈”按钮，填写反馈信息：

    ![imgSupportAddMsg](../../../images/imgSupportAddMsg.png)

    最后，点击右上角 “发送” 按钮，您将收到来自 MaxLeap 的回应消息：

    ![imgSupportConversation](../../../images/imgSupportConversation.png)

    表明，MaxLeap 已经成功接受您的反馈信息。测试成功。

## 下一步

至此，HelpCenter SDK 的安装与配置完成。请移步至 [HelpCenter SDK 使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH) 以获取 HelpCenter 的详细功能介绍以及使用方法，开启 MaxLeap 云服务使用之旅。