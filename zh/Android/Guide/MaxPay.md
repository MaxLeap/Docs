# MaxPay

## 简介

目前支持支付宝App支付功能，以及根据订单号查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用

### 配置支付管理信息

1. 在各支付平台创建进行支付的应用

2. 打开 [MaxLeap 控制台](https://maxleap.cn) -> 支付管理 -> 渠道配置, 配置上一步获得的各平台的相关支付信息

### 添加项目依赖

MaxLeap SDK

<a class="download-sdk" href="https://github.com/MaxLeap/SDK-Android/releases" target="_blank">下载 MaxLeap SDK</a>

解压后将以下 Jar 包导入工程的 `libs` 目录下：

- 核心 Jar 包: `maxleap-core-xxx.jar`
- 支付 Jar 包: `maxleap-pay-xxx.jar`

各第三方平台的 SDK

- 支付宝 Jar 包: `alipaySdk.jar`


### 配置应用权限

在 `AndroidManifest.xml` 中添加 `permission`

```xml
<!--共通-->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
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
```

### 进行支付

```java
MLPayManager.doAliPayInBackground(
		MainActivity.this,
        "a toy",
        1,
        "" + System.currentTimeMillis(),
        null,
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
- `subject : String` 订单主题
- `totalFee : int` 订单金额,单位为分,必须大于 0
- `billNum : String` 订单流水号,每个渠道需要自行保证唯一性
- `extras : Map<String,String>` 可选，当前订单的附加参数
- `payCallback : PayCallback` 支付完成后的回调


### 订单查询

SDK 仅支持单笔账单的查询

```java
MLPayManager.doAliOrderQueryInBackground(billNum, new QueryOrderCallback() {
    @Override
    public void done(MLOrder order, MLException e) {
        if (e != null) {
            Log.e(TAG, "查询失败,错误信息为 " + e.getMessage());
            return;
        }
        Log.i(TAG, "完成查询,订单信息为 " + order);
    }
});
```

参数依次为

- `billNum : String` 订单流水号
- `queryOrderCallback : QueryOrderCallback` 查询完成后的回调

获得订单对象 `MLOrder` 的实例后可以调用 `getTotalFee()`，`getBillNum()` 等方法获得对应的订单信息。
