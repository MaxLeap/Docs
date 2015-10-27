
# MaxLeap云代码使用指南

## 云代码简介

###什么是云代码服务
云代码是部署运行在MaxLeap上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在Web server上的Web Service或RESTful API。它对外提供的接口也是RESTful API，也正是以这种方式被移动应用调用。

###为什么需要云代码服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助云代码服务实现，其优势在于：

* 强大的运算能力：云代码运行在MaxLeap的Docker容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求Cloud Data，大大提升效率
* 同一套代码可以为iOS，Android，web site等提供服务

###云代码如何工作

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

一个云代码项目包含Custom Cloud Code，Cloud Code SDK，3rd Party Libraries。开发完成后，用maven把项目打包成package，然后用云代码命令行工具MaxLeap-CLI上传到MaxLeap，MaxLeap会生成对应的docker image。用maxleap deploy命令可以让MaxLeap启动Docker container运行该Docker image。

目前云代码支持Java环境和Python环境，我们在近期会推出其他开发语言版本。

## 云函数
云函数是运行在MaxLeap上的代码。可以使用它来实现各种复杂逻辑，也可以使用各种第三方类库。

###定义云函数
每个云函数需要实现 com.maxleap.code.MLHandler interface，该interface是典型的Functional Interface。

```Java
public interface MLHandler <T extends com.maxleap.code.Request, R extends com.maxleap.code.Response> {
    R handle(T t);
}
```

用JDK 8 lambda表达式可以如下定义一个function:

```Java
request -> {
    Response<String> response = new Response<String>(String.class);
    response.setResult("Hello, world!");
    return response;
}
```

JDK6和7可以如下定义:

```Java
public class HelloWorldHandler implements MLHandler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Hello, world!");
        return response;
    }
}
```

最后，需要在main class里注册该函数。

```Java
defineFunction("helloWorld", new HelloWorldHandler());
```

### 通过云函数访问Cloud Data

#### 定义Cloud Data Object（在管理中心中，称之为“Class”）
新建一个Cloud Data Object，并继承MLObject类

```java
public class MyObject extends MLObject {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
}
```
定义Cloud Data Object需注意：

* 一个 Cloud Data Object 对应一个 Cloud Data class，Cloud Data Object 的类名必须和管理中心中创建的 class 名字一样
* 须将所有的 Cloud Data Object 放入同一个package中，推荐在/src/main/java下新建一个package，如：“data”
* 须配置global.json文件以识别该package，如：`"packageClasses" : "data"`

#### Cloud Data Object的CRUD

我们可以通过 MLClassManager 操作 Cloud Data：

```java
public void doSomethingToCloudData(){
	MLClassManager<MyObject> myObjectEntityManager = MLClassManagerFactory.getManager(MyObject.class);
	MyObject obj = new MyObject();
	obj.setName("Awesome");
	String name = obj.getName();

	//新增Object
	SaveResult<MyObject> saveMsg = myObjectEntityManager.create(obj);
	String objObjectId = saveMsg.getSaveMessage().objectId().toString();
	
	//复制Object
	obj.setName(name + "_" + 2);
	SaveResult<MyObject> cloneSaveMsg = myObjectEntityManager.create(obj);
	
	//查询Object
	Query sunQuery = Query.instance();
	sunQuery.equalTo("name", name + "_" + 2);
	FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
	MyObject newObj = findMsg.results().get(0);
	
	//更新Object
	Update update = Update.getUpdate();
	update.set("name", name + "_new");
	UpdateMsg updateMsg = myObjectEntityManager.update(newObj.objectIdString(), update);
	
	//删除Object
	DeleteResult deleteResult = ninjaEntityManager.delete(objObjectId);
}
```

#### 使用Cloud Function

##### API方式调用
请求格式如下所示：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.maxleap.cn/2.0/functions/hello
```
	
##### 通过Android/iOS SDK调用：
Android SDK中：

```java
Map<String, Object> params = new HashMap<String, Object>();
params.put("key1", 1);
params.put("key2", "2");

CloudManager.callFunctionInBackground("hello", params, new FunctionCallback<JSONObject>() {
	@Override
	public void done(JSONObject object, Exception exception) {
		assertNull(exception);
	}
});
```
iOS SDK中：

```objective-c
NSDictionary *params = @{@"key1":@1, @"key2":@"2"};
    [MLCloudCode callFunctionInBackground:@"hello" withParameters:params block:^(id object, NSError *error) {
        if (error) {
            // 出现异常
        } else {
            // object
        }
    }];
```

## Background Job
云代码中，您还可以自定义后台任务，它可以很有效的帮助您完成某些重复性的任务，或者定时任务。如深夜进行数据库迁移，每周六给用户发送打折消息等等。您也可以将一些耗时较长的任务通过Job来有条不紊地完成。

###创建和监控Background Job
####在云代码中定义并实现Job Handler
``` java
public class MyJobHandler implements MLHandler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Job done!");
        return response;
    }
}
```

然后进入主程序入口(main函数)，使用defineJob来定义Job

``` java
defineJob("myJob", new MyJobHandler());
```
###测试Background Job
我们可以利用curl测试Job是否可用

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \		
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
https://api.maxleap.cn/2.0/jobs/YOUR_JOBNAME
```

####在管理中心中Schedule Job Plan
img

表单项目|作用 
----|-------|
名称|任务的名字|
函数名|想要执行的后台Job的名字
设置开始|从何时开始执行任务
设置重复|每隔多久重复执行任务
参数|提供数据给后台Job

####在管理中心中查看状态
进入“开发者中心”，点击“云代码” >> “任务状态”，您将能查看所有的任务列表，以及他们的状态概况。
选中您想要查看的任务，便可以查看任务详情。
img

## Hook for Cloud Data
Hook用于在对 Cloud Data 进行任何操作时（包括新建，删除及修改）执行特定的操作。例如，我们在用户注册成功之前，可以通过beforeCreate Hook，来检查其是否重名。也可以在其注册成功之后，通过afterCreate Hook，向其发送一条欢迎信息。Hook能很好地实现与数据操作相关的业务逻辑，它的优势在于，所有的业务在云端实现，而且被不同的应用/平台共享。

###创建和使用Hook
实现MLClassManagerHook接口(建议直接继承MLClassManagerHookBase类，它默认为我们做了实现，我们想要hook操作，只需直接重载对应的方法即可)

```java
@ClassManager("MyObject")
public class MyObjectHook extends MLClassManagerHookBase<MyObject> {
	@Override
	public BeforeResult<MyObject> beforeCreate(MyObject obj, UserPrincipal userPrincipal) {
		MLClassManager<MyObject> myObjectEntityManager = MLClassManagerFactory.getManager(MyObject.class);
		//创建obj前验证是否重名了
		MLQuery sunQuery = MLQuery.instance();
		sunQuery.equalTo("name", obj.getName());
		FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
		if (findMsg.results() != null && findMsg.results().size() > 0)
			return new BeforeResult<>(obj,false,"obj name repeated");
		return new BeforeResult<>(obj, true);
	}
	
	@Override
	public AfterResult afterCreate(BeforeResult<MyObject> beforeResult, SaveMsg saveMessage, UserPrincipal userPrincipal) {
		//创建完obj后在服务器上记录日志，这条日志可以通过console后台查看到
        logger.info("create Ninja complete use " + MLJsonParser.asJson(userPrincipal) + ",saveMsg:"+MLJsonParser.asJson(saveMessage));
        return new AfterResult(saveMessage);
	}
}
```

#####定义Hook需注意：

* 确保目标Cloud Data Object对应的class存在
* Hook类上需要添加`@ClassManager`注解，以便服务器能够识别该Hook是针对哪个实体的
* 须将所有的Hook类放入同一个package中，推荐在/src/main/java下新建一个package，如：“myHooks”
* 须配置global.json文件以识别该package，如：`"packageHook" : "myHooks"`
* 内建class和自定义class均支持Hook，内建class原有的限制（ _User用户名和密码必填， _Installation的deviceToken和installationId二选一）依然有效。

### Hook类型

云代码支持六种类型的Hook：
#### beforeCreate
在对应的 Cloud Data 被创建之前调用，可以用于验证输入的数据是否合法。

例如：在新建好友分组的时候，需要检查组名是否太长。

```java
@Override
public BeforeResult<FriendList> beforeCreate(FriendList list, UserPrincipal userPrincipal) {
	String name = list.getName();
	if (name.length() > 10)
		return new BeforeResult<>(list, false, "Cannot create a friend list with name longer than 10!");
	return new BeforeResult<>(list, true);
}
```

#### afterCreate
在对应的 Cloud Data 被创建后调用，可以用于执行如 User 创建后给客户经理发封邮件这样的逻辑。

#### beforeUpdate
在对应的 Cloud Data 被更新之前调用，可以用于验证输入的数据是否合法。

例如：在修改好友分组的时候，需要检查组名是否已经存在。

```java
@Override
public BeforeResult<FriendList> beforeUpdate(FriendList list, UserPrincipal userPrincipal) {
	//定义查询条件：
	MLQuery sunQuery = MLQuery.instance();
	sunQuery.equalTo("Name", list.getName());
	//在“好友”表中执行查询
	MLClassManager<Friend> friendEntityManager = MLClassManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Update failed because the name of the friend list already exists!");
	return new BeforeResult<>(list, true);
}
```

#### afterUpdate
在对应的 Cloud Data 被更新之后调用，可以用于如用户更新密码后，给用户邮箱发封提醒邮件。

#### beforeDelete
在对应的 Cloud Data 被删除之前调用，可以用于验证删除是否合法。

例如：用户的每位好友都在某个分组下，在删除一个好友分组之前，需要检查这个分组内是否还存在好友。

```java
@Override
public BeforeResult<FriendList> beforeDelelte(FriendList list, UserPrincipal userPrincipal) {
	//定义查询条件：
	MLQuery sunQuery = MLQuery.instance();
	sunQuery.equalTo("listName", list.Name);
	//在“好友”表中执行查询
	MLClassManager<Friend> friendEntityManager = MLClassManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);
	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Cannot delete a friend list if any friend inside!");
	return new BeforeResult<>(list, true);
}
```

#### afterDelete
在对应的 Cloud Data 被删除之后调用，可以用于如清除其他有关的数据。

## Logging
云代码提供Logging功能，以便您能记录Function，Hook或者Job在运行过程中出现的信息。除此之外，云代码的部署过程，也将被记录下来。您可以在管理中心中查看所有的日志。
###在云代码中记录Log
您可以使用logger实例，记录4种级别的日志：Error，Warn，Info和Debug.

```java
public class MyClass {
	com.maxleap.code.Logger logger = com.maxleap.code.LoggerFactory.getLogger(myclass.class);

	public void myMethod(){
		logger.error("Oops! Error, caught you!");
		logger.warn("I'm Warning.");
		logger.info("I'm Information");
	}
}
```
使用Log需注意:

* 你可以在Main, Hook, Handler等任意地方中使用日志功能，只需使用com.maxleap.code包下的日志类即可，而正常的log4j或slf4j日志将不会被远程服务器记录，但可以在本地使用*
* 本地测试不会产生远程数据库记录，但发布后调用会产生记录，你可以在后端界面查看你的日志信息
* 服务器上只会记录info、warn和error级别的日志，如果您的Function调用频率很高，请在发布前尽量去掉不必要的Info级别日志，以避免不必要的日志存储
	
###系统自动记录的Log
除了手动记录的Log外，系统还将自动为您收集一些必要的日志，包括：

* Cloud Function的上传部署信息
* Hook Entities的Cache信息
* 云代码相关的API request信息
	
###查看Log
可以使用命令行工具MaxLeap-CLI查看最近的log

```shell
maxleap log -n 100
```
也进入“管理网站”，点击“开发者中心”－>“日志”，您便可查看该应用的所有日志。

## UserPrincipal
SDK提供使用用户请求原始信息UserPrincipal来访问数据，而不是通过cloudcode的masterKey来实现，这样数据在访问流通过程中可以有效保证key的安全性，而不被人拦截请求截获masterKey信息。

###使用UserPrincipal
SDK在处理hook请求时会默认使用UserPrincipal，在function/job中你可以通过获取Request对象的UserPrincipal来完成你的数据访问

```java
new MLHandler<Request, Response>() {
      @Override
      public Response handle(Request request) {
            UserPrincipal userPrincipal = request.getUserPrincipal();
            MLClassManager<Ninja> ninjaZEntityManager = MLClassManagerFactory.getManager(Ninja.class);
            MLQuery lasQuery = MLQuery.instance().equalTo("name", "123");
            FindMsg<Ninja> findMsg = ninjaZEntityManager.find(lasQuery, userPrincipal);
            Response<FindMsg> response = new MLResponse<FindMsg>(FindMsg.class);
            response.setResult(findMsg);
            return response;
      }
}
```

* 如果你不使用UserPrincipal来访问数据，SDK会默认使用master-key（即配置文件global.json中的applicationKey）来访问数据
* 所有SDK的api都提供了使用UserPrincipal方式来访问数据，除了cloudcode云代码自身发起的请求必须使用masterKey来访问外，其他所有请求我们建议你使用UserPrincipal这种方式来保证你的秘钥安全

## MLC － 云代码命令行工具
MLC命令行工具是为云代码项目的上传，部署，停止及版本管理而设计的。您可以利用它，将Maven项目生成的package上传到MaxLeap，在云端，package将被制作成Docker Image，而部署过程，就是利用Docker Container将这个Image启动。而被上传到云端的每个版本的云代码都将被保存，您可以自由地卸载某一个版本，而后部署另外一个版本的云代码.
###登录:
```shell
maxleap login <用户邮箱> -region <CN or US ...>
```
`<用户邮箱>` 为您登录MaxLeap管理中心的账号邮箱，`<CN or US ...>` 为选择中国区账号还是美国区账号，然后根据提示输入密码
###显示所有app：
```shell
maxleap apps
```
查询账号下的所有应用，显示的信息为：AppId ：AppName
###选择应用:
```shell
maxleap use <应用名>
```
`<应用名>`为目标应用名，如果应用名包含空格，你可以用`maxleap use "应用名"`即使用引号来切换应用。选择之后，接下来的操作（上传/部署/停止/版本管理）都将以此应用为上下文。
###上传云代码:
```shell
maxleap upload <文件路径>
```
`<文件路径>`为你将部署的云代码 package（zip文件，由mvn package命令生成），它将被上传到步骤3指定的应用下。
上传的的代码会被制作成Docker镜像，版本号在云代码项目里的global.json文件中指定：
```
"version": "0.0.1"
```
###显示所有云端云代码版本:
```shell
maxleap lv
```
即显示所有该应用下，用户上传过的云代码的所有版本。
###部署云代码：
```shell
maxleap deploy <版本号>
```
`<版本号>`为想要部署的云代码版本号：如执行maxleap deploy 0.0.1，将部署指定应用下版本号为0.0.1的云代码。如果部署不存在的版本，会提示错误："version of appId not exists"
###停止cloudcode：
```shell
maxleap undeploy <版本号>
```
停止该应用的指定版本云代码：如果之前已经部署过一个版本，需要先停止，再部署新的版本。
###输出最近的日志：
```shell
maxleap log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]

-l 指定输出日志的级别：info或是error
-n 指定log的数量
-s 指定跳过最近的log数量
```
