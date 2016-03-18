# 云函数

如果您尚未安装 SDK，请先查阅[快速入门指南](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID)。
您还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_ANDROID)，了解有关我们 SDK 的更多详细信息。

首先，需要开发 Cloud Code，实现所需的接口和 HOOK，开发以及发布过程请参考 [Cloud Code引导](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)。

调用云函数

只需要使用 `MLCloudManager.callFunctionInBackground()` 方法就可以调用部署在云端的代码，该方法接收两个参数，第一个参数为方法名，第二个参数为方法的参数列表（参数名：参数值）。

例

```java
MLCloudManager.callFunctionInBackground("hello", new HashMap<String, Object>(),
    new FunctionCallback<JSONObject>() {
        @Override
        public void done(JSONObject result,
                LASException exception) {
            if (e == null) {
                // when success
            } else {
                // something went wrong
            }
        }
    });
```