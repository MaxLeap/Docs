# SDK 简介

## 云代码介绍

### 什么是云代码服务
云代码是部署运行在 MaxLeap 云引擎上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在 Web server上的 Web Service或 RESTful API。它对外提供的接口也是 RESTful API，也正是以这种方式被移动应用调用。 

###为什么需要云代码服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助云代码服务实现，其优势在于：

* 强大的运算能力：云代码运行在 MaxLeap 的 Docker 容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求 Cloud Data，大大提升效率
* 同一套代码可以为 iOS，Android，Web Site 等提供服务

###云代码如何工作

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

一个 Java 云代码项目包含 Custom Cloud Code，Cloud Code SDK，3rd Party Libraries。开发完成后，用maven把项目打包成package，然后用云代码命令行工具 MaxLeap-CLI 上传到 MaxLeap，MaxLeap 会生成对应的 Docker image。用 maxleap deploy命令可以让 MaxLeap 启动 Docker container运行该 Docker image。

## SDK介绍

云代码SDK主要包含三个依赖包,他们的依赖关系如下:

- cloud-code-base
  - sdk-data-api
  - jackson-*
- cloud-code-sdk
  - cloud-code-bask
- cloud-code-test
  - cloud-code-sdk
  - jetty-server
  - jetty-webapp

#### cloud-code-base
基础SDK,云代码的云端和开发者本地都依赖的同一套基础SDK,提供基础数据功能

#### cloud-code-sdk
开发者本地SDK,云代码的云端和开发者本地基于cloud-code-base实现的不同环境的功能SDK,主要实现功能：数据存储服务、云函数、后台任务、Hook操作、消息推送、分布式计数器/锁、日志.

#### cloud-code-test
开发者本地SDK测试框架,本地环境SDK基于cloud-code-sdk实现的单元测试和集成测试框架,主要实现功能：提供本地单元测试框架、提供本地Http Server方便用户本地调用API测试

完成的结构如下:

![imgWhatsCloudCodeSDK](../../../images/java_cloudcode_sdk_relation.png)