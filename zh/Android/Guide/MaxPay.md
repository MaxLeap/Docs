# MaxPay

## 简介

目前支持支付宝App支付功能，以及根据订单号查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用

### 配置支付管理信息

1. 在各支付平台创建进行支付的应用

2. 打开 [MaxLeap 控制台](https://maxleap.cn) -> 支付管理 -> 渠道配置, 配置上一步获得的各平台的相关支付信息

### 添加项目依赖

**MaxLeap SDK**

<a class="download-sdk" href="https://github.com/MaxLeap/SDK-Android/releases" target="_blank">下载 MaxLeap SDK</a>

解压后将以下 Jar 包导入工程的 `libs` 目录下：

- 核心 Jar 包: `maxleap-core-xxx.jar`
- 支付 Jar 包: `maxleap-pay-xxx.jar`

**各第三方平台的 SDK**

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

如果应用只集成了一个第三方平台的话可以省略渠道参数，SDK 会自动根据应用当前集成的第三方平台的情况自动调用对应的支付请求。

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
