# Cloud Code
##简介

###什么是Cloud Code服务
Cloud Code是部署运行在Leap Cloud上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在Web server上的Web Service或RESTful API。它对外提供的接口也是RESTful API，也正是以这种方式被移动应用调用。

###为什么需要Cloud Code服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助Cloud Code实现。Cloud Code有如下优势：

* 强大的运算能力：Cloud Code运行在Leap Cloud的Docker容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求Cloud Data，大大提升效率
* 同一套代码可以为iOS，Android，web site等提供服务

在应用管理页面中，您可以查看，新建和管理各个版本的云代码及相应的日志。

**您还可以查看[Cloud Code开发指南 － Java](..)，获取更多信息。**

##版本状态
在"版本状态"报表中，我们可以查看上传至该应用下的所有的云代码。该报表包含以下列：

* 版本号：每份上传的云代码，都有一个唯一的版本号标识，定义在云代码项目中的global.json中
* 状态：对应版本号的云代码是否被部署并处于正常运行状态
* 配置：查看云代码的配置文件global.json. 包括 应用名，应用信息(App ID/MasterKey)，Cloud Code项目信息(编写语言/入口函数名/Hook包名/Entity包名)及版本号等信息。
* 上传时间

![imgCCJobList](../../../images/imgCCJobList.png)


##任务安排

####查看任务安排列表
您可以通过“安排任务”，运行云代码中的任务。所有被安排的

* 名称：任务名
* 函数名：云代码中定义的任务名
* 安排时间：设置任务开始运行时间
* 安排重复：设置任务的重复运行模式
* 参数：传递至云代码任务的JSON参数

![imgCCScheduleJob](../../../images/imgCCScheduleJob.png)

####查看任务安排列表
您可以通过“创建任务安排”，运行云代码中的任务。创建时，您需要提供

* 名称：任务名
* 函数名：云代码中定义的任务名
* 安排时间：设置任务开始运行时间
* 安排重复：设置任务的重复运行模式
* 参数：传递至云代码任务的JSON参数

![imgCCScheduleJob](../../../images/imgCCScheduleJob.png)