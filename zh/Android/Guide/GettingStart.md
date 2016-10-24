# SDK 集成

## 全新项目

###	使用模板创建 MaxLeap 项目

1.	获取项目模板，并解压缩至您的 Workspace

    <a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-Android/archive/master.zip" target="_blank">下载 Android 项目模板</a>

2.	打开项目模板

    **Android Studio**

    1. 	打开 Android Studio，点击 “Import project”
    2. 	进入项目模板根目录，选择 `setting.gradle`
    3. 	按照默认配置点击下一步，直到完成

###	配置 MaxLeap 项目

1. 连接项目与 MaxLeap 应用

	在 `Application` 的 `onCreate()` 方法中，调用 `MaxLeap.initialize` 来设置您应用的 `Application ID` 和 `REST API Key`：

    ```java
    import android.app.Application;
    import com.maxleap.MaxLeap;

    public class MyApplication extends Application {
        @Override
        public void onCreate() {
            super.onCreate();
            MaxLeap.initialize(this, "appid", "restapikey", MaxLeap.REGION_CN);
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
            MaxLeap.initialize(this, "appid", "restapikey", MaxLeap.REGION_CN);

            //测试项目配置：
            MLDataManager.fetchInBackground(MLObject.createWithoutData("foobar", "123"),
                        new GetCallback<MLObject>() {
                            @Override
                            public void done(MLObject mlObject, MLException e) {
                                if (e != null && e.getCode() == MLException.INVALID_OBJECT_ID) {
                                    Log.d("MaxLeap", "SDK 成功连接到你的云端应用！");
                                } else {
                                    Log.d("MaxLeap", "应用访问凭证不正确，请检查。");
                                }
                            }
                        });
        }
    }
    ```

    
    运行应用，查看 Logcat 的输出日志，没有错误的话，您已经完成 MaxLeap SDK 的安装与必要的配置。


## 已有项目

1. 安装 SDK
	[下载 SDK](https://cscdn.maxleap.cn/2.0/download/NTdhM2ZiZGIxNjllN2QwMDAxNjBhZGM0/zcf-49dfea97-9ca7-49d6-8068-1856d088a306.zip)

2. 将 SDK 添加至项目

    将解压后的所有 `maxleap-*.jar` 文件，拖拽至项目的 `libs` 目录中。如果你们的项目没有 `libs` 目录，那么就在项目的根目录下创建一个：通过右键点击项目 `Project`，选择 `New`，接下来点击 `Directory` 菜单即可创建新目录。

    **Android Studio**

    在 `build.gradle` 文件中添加下述依赖：

    ```gradle
    dependencies {
      compile fileTree(dir: 'libs', include: 'maxleap-*.jar')
    }
    ```

###	配置 MaxLeap 项目

1. 连接项目与 MaxLeap 应用

	在 `Application` 的 `onCreate()` 方法中，调用 `MaxLeap.initialize` 来设置您应用的 `Application ID` 和 `REST API Key`：

    ```java
    import android.app.Application;
    import com.maxleap.MaxLeap;

    public class MyApplication extends Application {
        @Override
        public void onCreate() {
            super.onCreate();
            MaxLeap.initialize(this, "appid", "restapikey", MaxLeap.REGION_CN);
        }
    }
    ```

2. 权限配置

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
            MaxLeap.initialize(this, "appid", "restapikey", MaxLeap.REGION_CN);

            //测试项目配置：
            MLDataManager.fetchInBackground(MLObject.createWithoutData("foobar", "123"),
                        new GetCallback<MLObject>() {
                            @Override
                            public void done(MLObject mlObject, MLException e) {
                                if (e != null && e.getCode() == MLException.INVALID_OBJECT_ID) {
                                    Log.d("MaxLeap", "SDK 成功连接到你的云端应用！");
                                } else {
                                    Log.d("MaxLeap", "应用访问凭证不正确，请检查。");
                                }
                            }
                        });
        }
    }
    ```

    运行应用，查看 Logcat 的输出日志，没有错误的话，您已经完成 MaxLeap SDK 的安装与必要的配置。
    
### 更多集成配置
    
除了快速集成的方式来连接项目与maxleap应用，您也可以通过如下几种方式更灵活的配置

1. 在**AndroidManifest.xml**中配置相应的meta-data所对应的value

    ```xml
	<application>
              <meta-data
                   android:name="com.maxleap.APPLICATION_ID"
                   android:value="appid" />
               <meta-data
                   android:name="com.maxleap.CLIENT_KEY"
                   android:value="restapikey" />
               <meta-data
                   android:name="ml_region"
                   android:value="CN" />
    </application>
	```
在自定义的**Application**中调用：


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
            MaxLeap.initialize(this);

            //测试项目配置：
            MLDataManager.fetchInBackground(MLObject.createWithoutData("foobar", "123"),
                        new GetCallback<MLObject>() {
                            @Override
                            public void done(MLObject mlObject, MLException e) {
                                if (e != null && e.getCode() == MLException.INVALID_OBJECT_ID) {
                                    Log.d("MaxLeap", "SDK 成功连接到你的云端应用！");
                                } else {
                                    Log.d("MaxLeap", "应用访问凭证不正确，请检查。");
                                }
                            }
                        });
        }
    }
    ```
    
    
    注：代码中配置的优先级会高于**AndroidManifest.xml**中配置的有限级。如果您同时在xml和代码中配置，将以代码配置为准。
    
2. 使用Options参数的方式初始化

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
            
            MaxLeap.Options options = new MaxLeap.Options();
            options.appId = "appid";
            options.clientKey = "restapikey";
            options.serverRegion = MaxLeap.REGION_CN;     
            
            options.apiTimeout = 15*1000;//默认请求超时为15秒
            options.retryTimes = 4;//请求重试次数，默认为4次
            options.analyticsEnable = true;//是否开启页面的访问行为分析，默认为true
            options.marketingEnable = false;//是否开启应用内消息，默认为false。详见：推送营销-应用内消息
    
            //是否自动对activity页面的访问行为进行分析，默认为disable。
            //如果设置为MaxLeap.AUTO_TRACK_SESSION_AND_PAGEVIEW,需要Android sdk不小于14。
            //自动分析与手动分析互斥，如果您手动在activity的生命周期中调用过MLAnalytics.onResume()
            //或者MLAnalytics.onPause()等，需要设置为disable。
            options.autoTrackStrategy = MaxLeap.AUTO_TRACK_DISABLE;
            
            MaxLeap.setLogLevel(MaxLeap.LOG_LEVEL_NONE);//设置log输出的等级，默认不输出
            
            MaxLeap.initialize(this, options);
             
        }
    }
    ```
使用Options参数的方式初始化，灵活度更高。您可根据实际的项目需求进行配置。 
    
