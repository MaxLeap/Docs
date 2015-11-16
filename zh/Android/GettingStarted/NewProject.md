##	安装 SDK

##	使用模板创建 MaxLeap 项目

1.	获取项目模板，并解压缩至您的 Workspace

    <a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-Android" target="_blank">下载 Android 项目模板</a>

2.	打开项目模板

    **Android Studio**

    1. 	打开 Android Studio，点击 “Import project”
    2. 	进入项目模板根目录，选择 `setting.gradle`
    3. 	按照默认配置点击下一步，直到完成

##	配置 MaxLeap 项目

1. 连接项目与 MaxLeap 应用

	在 `Application` 的 `onCreate()` 方法中，调用 `MaxLeap.initialize` 来设置您应用的 `Application ID` 和 `REST API Key`：

    ```java
    import android.app.Application;
    import com.maxleap.MaxLeap;

    public class MyApplication extends Application {
        @Override
        public void onCreate() {
            super.onCreate();
            MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}", MaxLeap.REGION_CN);
        }
    }
    ```

2. 权限配置

	在 `AndroidManifest.xml` 中，给予应用以下权限：

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

3. 配置用户渠道

	在 `AndroidManifest.xml` 中配置用户渠道，渠道名可以是 `google_play` 之类的任意字符串。

    ```xml
	<application>
       <meta-data
            android:name="ml_channel"
            android:value="google_play"/>
    </application>
	```

4. 快速测试项目配置

    为了测试项目是否已经注册至 MaxLeap，我们可以向 `Application` 的 `onCreate()` 方法中添加以下代码：

    ```java
    import android.app.Application;
    import com.maxleap.MaxLeap;
    import com.maxleap.MLQueryManager;
    import com.maxleap.MLQuery
    import com.maxleap.MLObject;

    public class MyApplication extends Application {
        @Override
        public void onCreate() {
            super.onCreate();
            MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}", MaxLeap.REGION_CN);

            //测试项目配置：
    		MLQuery<MLObject> query = MLQuery.getQuery("foo");
            query.whereEqualTo(MLObject.KEY_OBJECT_ID, "bar");
            MLQueryManager.getFirstInBackground(query, new GetCallback<MLObject>() {
                @Override
                public void done(final MLObject object, final MLException e) {
                    if (e != null && e.getCode() == 90000) {
                        Log.d("MaxLeap", "SDK 成功连接到你的云端应用！");
                    } else {
                        Log.d("MaxLeap", "应用访问凭证不正确，请检查。");
                    }
                }
            });
        }
    }
    ```

    运行应用，查看 Logcat 的输出日志。

## 下一步

至此，您已经完成 MaxLeap SDK 的安装与必要的配置。请移步至 [Android SDK 使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID) 以获取 MaxLeap 的详细功能介绍以及使用方法，开启 MaxLeap 云服务使用之旅。
