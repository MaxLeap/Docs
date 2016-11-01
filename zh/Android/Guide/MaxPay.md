# 移动支付

## 简介

目前支持支付宝、微信、银联支付等渠道，支持支付及查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用

### 配置支付管理信息

1. 在各支付平台创建进行支付的应用

2. 打开 [MaxLeap 控制台](https://maxleap.cn) -> 支付管理 -> 渠道配置, 配置上一步获得的各平台的相关支付信息

### 添加项目依赖

请按第二章【SDK 集成】步骤完成 SDK 下载，

解压后将以下 Jar 包导入工程的 `libs` 目录下：

- 核心 Jar 包: `maxleap-sdk-core-xxx.jar`
- 支付 Jar 包: `maxleap-sdk-pay-xxx.jar`

**支付宝和微信平台的 SDK**

- [支付宝 Jar 包](https://doc.open.alipay.com/doc2/detail?treeId=54&articleId=103419&docType=1): `alipaySdk-xxx.jar`
- [微信 Jar 包](https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=11_1)：`libammsdk.jar`

**银联 SDK**
1. 下载 [手机控件支付开发包安卓版](https://open.unionpay.com/ajweb/help/file/techFile?productId=3)
2. 解压后依次进行以下目录 "手机控件支付产品入网材料" -> "手机控件支付产品技术开发包" -> "开发包" -> "app开发包" -> "控件开发包" -> "upmp_android" -> "sdkPro"
3. 将 `UPPayAssistEx.jar` 和 `jar/UPPayPluginExPro.jar` 放入 `libs` 目录下。
4. 将 `data.bin` 放入 `assets` 目录下。
5. 将 `arm64-v8a`,`mips`,`x86` 等含有 *.so 文件的目录放入 `jniLibs` 目录下。


### 配置应用权限

在 `AndroidManifest.xml` 中添加 `permission`

```xml
    <!--共通-->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    
    <!--银联-->
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.NFC" />
```

在 `AndroidManifest.xml` 中注册 `activity`

```xml
    <!--支付宝-->
    <activity
            android:name="com.alipay.sdk.app.H5PayActivity"
            android:configChanges="orientation|keyboardHidden|navigation|screenSize"
            android:exported="false"
            android:screenOrientation="behind"
            android:windowSoftInputMode="adjustResize|stateHidden">
    </activity>
    
    <!--银联-->
    <activity android:name="com.maxleap.MLUnionPaymentActivity"
                      android:configChanges="orientation|keyboardHidden"
                      android:excludeFromRecents="true"
                      android:launchMode="singleTop"
                      android:screenOrientation="portrait"/>
    <activity
            android:name="com.unionpay.uppay.PayActivity"
            android:configChanges="orientation|keyboardHidden"
            android:excludeFromRecents="true"
            android:screenOrientation="portrait"
            android:windowSoftInputMode="adjustResize" />
```

### 初始化平台

- **支付宝，银联不需要初始化**

- **微信**

```java
    MLPayManager.initializeWechatPay(context, "your wechat appId");
```

### 处理回调

- **支付宝和银联不需要**

- **微信**

    第一种
    
    由于微信的回调机制，在支付完成后会调用：包名+.wxapi.WXPayEntryActivity,所以需要自己在工程中实现`WXPayEntryActivity`类
    在 `onCreate()` 方法中调用以下方法：
    
     `MLPayManager.onCreate(getIntent());`
     
     在 `onNewIntent` 方法中调用以下方法：
     
     `setIntent(intent);`
     `MLPayManager.onNewIntent(intent);`
     
     示例如下：

```java
    public class WXPayEntryActivity extends Activity {
        @Override
        protected void onCreate(final Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            MLPayManager.onCreate(getIntent());
            finish();
        }
    
        @Override
        protected void onNewIntent(Intent intent) {
            super.onNewIntent(intent);
            setIntent(intent);
            MLPayManager.onNewIntent(intent);
        }
    }
```

并在`AndroidManifest.xml`中相应的进行配置：

- 如果在`Gradle.build`中您修改过`applicationId`，即`applicationId`与`AndroidManifest.xml`中`package`不一致，您需要如下设置
    
```xml
    <activity
        android:name=".wxapi.WXPayEntryActivity"
        android:launchMode="singleTop" />

    <activity-alias
        android:name="${applicationId}.wxapi.WXPayEntryActivity"
        android:enabled="true"
        android:exported="true"
        android:targetActivity=".wxapi.WXPayEntryActivity" />
```

- 反之，如果一致。您需要如下配置
    
```xml
    <activity
        android:name=".wxapi.WXPayEntryActivity"
        android:enabled="true"
        android:launchMode="singleTop" />
```
    


第二种

由于在`maxleap-sdk-pay-xxx.jar`中已经对WXPayEntryActivity回调做了处理，您只需要在 `AndroidManifest.xml` 中加入以下内容

```xml
    <activity android:name="com.maxleap.MLWechatPayEntryActivity"
              android:launchMode="singleTop"/>
    <activity-alias android:name="${applicationId}.wxapi.WXPayEntryActivity"
                    android:targetActivity="com.maxleap.MLWechatPayEntryActivity"
                    android:enabled="true"
                    android:exported="true"/>
```

### 进行支付

```java
    MLPayParam payParam = new MLPayParam();
    payParam.setChannel(MLPayParam.Channel.ALIPAY_APP);
    payParam.setSubject("a toy");
    payParam.setBillNum("" + System.currentTimeMillis());
    payParam.setTotalFee(1);
    MLPayManager.doPayInBackground(MainActivity.this, payParam,
        new PayCallback() {
                @Override
                public void done(String id, MLException e) {
                    if (e != null) {
                        Log.e(TAG, "支付失败,错误信息为 " + e.getMessage());
                        return;
                    }
                    Log.i(TAG, "完成支付,订单号为 " + id);
                }
            });
```

参数依次为

- `activity : Activity` 调用支付的 Android Activity
- `payParam : MLPayParam` 调用支付的相关参数
- `payCallback : PayCallback` 支付完成后的回调

MLPayParam.Channel 表示支付渠道，目前支持两种

- `ALIPAY_APP` 支付宝
- `WECHAT_APP` 微信

如果应用只集成了一个第三方平台的话可以省略渠道参数，SDK 会自动根据应用当前集成的第三方平台的情况自动调用对应的支付请求。

>注意
>
>使用银联支付时控制台会打印 `java.lang.ClassNotFoundException:org.simalliance.openmobileapi.SEService` 之类的异常信息，此时无视即可。

### 订单查询

SDK 仅支持单笔账单的查询

```java
    MLPayManager.queryOrderInBackground(billNum, new QueryOrderCallback() {
        @Override
        public void done(List<MLOrder> orders, MLException e) {
            if (e != null) {
                Log.e(TAG, "查询失败,错误信息为 " + e.getMessage());
                return;
            }
            Log.i(TAG, "完成查询, 订单数量为 " + orders.size());
            Log.i(TAG, "订单信息为 " + Arrays.toString(orders.toArray()));
        }
    });
```

参数依次为

- `billNum : String` 订单流水号
- `queryOrderCallback : QueryOrderCallback` 查询完成后的回调

获得订单对象 `MLOrder` 的实例后可以调用 `getTotalFee()`，`getBillNum()` 等方法获得对应的订单信息。

需要注意的是，以上方法由于没有传入渠道参数，所以如果没有保证所有平台上的订单流水号的唯一性的话可能会获得多条记录。
除了以上方法外还存在可以传入渠道的版本 `queryOrderInBackground(channel, billNum, queryOrderCallback)`。
