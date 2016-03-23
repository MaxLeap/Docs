# 云代码
## 简介
### 什么是云代码服务
云代码是部署运行在 MaxLeap 云引擎上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在 Web server上的 Web Service或 RESTful API。它对外提供的接口也是 RESTful API，也正是以这种方式被移动应用调用。

目前支持 Java、Python、Node.js，其他语言尽请期待。

## 准备

如果您尚未安装 SDK，请先查阅[快速入门指南](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID)。
您还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_ANDROID)，了解有关我们 SDK 的更多详细信息。

首先，需要开发云代码，实现所需的接口和 HOOK，开发以及发布过程请根据您的需求选择对应服务端语言

[Java 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA#CLOUD_CODE_ZH)，
[Python 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_PYTHON#CLOUD_CODE_ZH)，[Node.js 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_NODEJS#CLOUD_CODE_ZH)

## 云代码调用

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