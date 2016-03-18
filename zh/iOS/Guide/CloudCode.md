# 云函数

如果您尚未安装 SDK，请先查阅[快速入门指南](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)，安装 SDK 并使之在 Xcode 中运行。
您还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS)，了解有关我们 SDK 的更多详细信息。

**注意**：我们支持 iOS 7.0 及以上版本。

首先，需要开发 Cloud Code，实现所需的接口和HOOK，开发以及发布过程请参考 [Cloud Code引导](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)。

发布 Cloud Code 之后，客户端可以使用 `+[MLCloudCode callFunctionInBackground:withParameters:block:]` 方法调用云函数。

假如在 CloudCode 中定义了一个名称为 `hello` 的函数，带一个名字为 `name` 的参数，返回值为输入的参数字典。现在调用这个云函数：

```objc
[MLCloudCode callFunctionInBackground:@"hello"
                       withParameters:@{@"name":@"Alex"} 
                                block:^(id result, NSError *error) {
   if ( ! error ) {
     // result is @{@"name":@"Alex"}
   }
}];
```
