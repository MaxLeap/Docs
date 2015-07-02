
## 开始使用Cloud Code

## Cloud Code简介

####	**什么是Cloud Code服务**
Cloud Code是部署运行在Leap Cloud上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在Web server上的Web Service或RESTful API。它对外提供的接口也是RESTful API，也正是以这种方式被移动应用调用。

####	**为何您需要Cloud Code服务**

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助Cloud Code实现。Cloud Code有如下优势：

* 强大的运算能力：Cloud Code运行在Leap Cloud的Docker容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求Cloud Data，大大提升效率
* 可以使用各种第三方类库，提升开发效率

####	**Cloud Code如何工作**

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

一个Cloud Code项目包含Custom Cloud Code，Cloud Code SDK，3rd Party Libaries。开发完成后，用maven把项目打包成package，然后用Cloud Code命令行工具lcc上传到Leap Cloud，Leap Cloud会生成对应的docker image。用lcc deploy可以让Leap Cloud启动Docker container运行该Docker image。

目前Cloud Code支持Java，我们在近期会推出Python版本。企业版在下个版本会支持多个Docker container，Failover，Auto scaling等功能。
	  
## 创建和配置Cloud Code项目

###	1.	安装Maven和Cloud Code Command Line Tools

Cloud Code项目需要使用Maven打包，然后通过Cloud Code Command Line Tools上传及部署，而且Cloud Code项目模板是基于Maven构建的。所以，在开始创建Cloud Code项目之前，我们需要安装Maven和Cloud Code Command Line Tools.

* 	**获取Maven**

	1.	Eclipse:	点击"Help" -> "Install New Software.." -> 在"Work with"中输入：`http://download.eclipse.org/technology/m2e/releases`，在列表中选择"Maven Integration for Eclipse"，即可安装Maven插件。
	2. 手动下载配置：	`https://maven.apache.org/download.cgi`，下载解压之后，在您的IDE中将该路径添加至相应的配置中。

* 	**获取Cloud Code Command Line Tools**
	
	通过git命令获取：
	
	```java
	git clone https://gitlab.ilegendsoft.com/zcloudsdk/zcc.git
	```
	
	有关Cloud Code Command Line Tools更多介绍信息，请移步至[Cloud Code Command Line Tools教程](...)

###	2.	创建Cloud Code项目

####	1.	使用Cloud Code项目模版快速创建项目

* 	**获取LAS Cloud Code Java项目模板**
	`git clone https://gitlab.ilegendsoft.com/zcloudsdk/cloud-code-template-java.git`

* 	**打开LAS Cloud Code Java项目**

	* 	**Android Studio**

		1. 打开Android Studio，点击“Import project”
		2. 进入项目模板根目录，选择“pom.xml”
		3. 按照默认配置点击下一步，直到完成 

	* 	**Eclipse**
	
		1.	打开Eclipse，点击 "File" -> "New" -> "Project From Existing Source..."
		2. 进入项目模板根目录，选择“pom.xml”

#### 2. 添加至已有项目

打开Maven项目的pom文件，添加如下依赖：
	
```Java
<dependency>
<groupId>com.ilegendsoft</groupId>
<artifactId>cloud-code-test-framework</artifactId>
<version>2.2.1-SNAPSHOT</version>
</dependency>
```

### 3.	配置Cloud Code项目

在/src/main/resources/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```java
	{
		"applicationName" : "helloword",
		"applicationId": "YOUR_APPLICATION_ID",
		"applicationKey": "YOUR_MASTER_KEY",
		"lang" : "java",
		"java-main": "Main",
		"package-hook" : "YOUR_HOOK_PACKAGE_NAME",
		"package-entity" : "YOUR_ENTITY_PACKAGE_NAME",
		"global": {
			"version": "0.0.1"
		}
	}
```

根据创建应用时获取的key，修改下列键的值：
	
	 键|值|
  	 ------------|-------|
	 applicationName|LAS应用名称
	 applicationId|Application ID
	 applicationKey|Master Key
	 java-main|入口函数名
	 package-hook|Hook目录
	 package-entity|Class实体目录
	 zVersion|当前Cloud Code项目版本号
	



## Hello World

#### 1. 开发
完成上述配置步骤之后，我们便可以向Main函数中定义我们的Cloud Function了：

```Java
import as.leap.code.LASLoader;
import as.leap.code.Response;
import as.leap.code.impl.GlobalConfig;
import as.leap.code.impl.LASLoaderBase;
import as.leap.code.impl.ZResponse;

public class Main extends LASLoaderBase implements LASLoader {
    @Override
    public void main(GlobalConfig globalConfig) {
    
    //定义Cloud Function
        defineFunction("HelloWorld", request -> {
            Response<String> response = new ZResponse<String>(String.class);
            response.setResult("Hello, " + request.parameter(Map.class).get("name") + "!");
            return response;
        });
    }
}
```
> **需注意：** 
>
Main class需要继承LASLoaderBase并实现LASLoader接口

#### 2. 打包

在当前项目根目录下运行Maven命令：

`mvn package`

我们将在项目根目录下的target文件夹中发现 xxx-1.0-SNAPSHOT-mod.zip 文件，这便是我们想要的package.

#### 3. 上传Cloud Code及部署
	1.	登录

	命令： `lcc login <UserName>`

	2.	选择所要部署的目标应用，作为后续操作的上下文

	命令： `lcc use <AppName>`

	3.	上传package

	命令： `lcc upload <PackagePath>`
	
	4.	部署Cloud Code

	命令： `lcc deploy <VersionNumber>`

	注：这里的VersionNumber定义在您Cloud Code项目中的global.json文件中（version字段的值）；您还可以通过`lcc lv`命令，获取该应用下所有Cloud Code的版本号

#### 4. 测试

通过Curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-LAS-AppId: YOUR_APPID" \
-H "X-LAS-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.leap.as/functions/HelloWorld
```
此时，我们将得到如下结果：

```shell
Hello, David Wang!
```
表明测试通过，部署成功。

**Curl测试时需注意：**

*	X-LAS-APIKey的值为应用的API KEY，而非Cloud Code项目中使用的Master Key.

## Cloud Function

* 	**Cloud Function简介：**

	Cloud Function是您使用Cloud Code的一个入口，通过它，我们可以使用定义在Cloud Code中的业务逻辑。
	
* 	**创建Cloud Function：**
	
	Cloud Code可由三部分构成：Cloud Code SDK，Custom Code以及3rd Party Lib。在上述Hello World样例中，我们向您展示了如何定义一个简单的Function。这个部分，我们将向您介绍如何通过Cloud Function使用Cloud Code SDK。
>	
>	**通过Cloud Function访问Cloud Data**
>
>	* 定义Cloud Data Object（在管理界面中，称之为“Class”）
>
>	新建一个Cloud Data Object，并继承ZCloudObject类
>
>	```java
	public class MyObject extends LASCloudObject {
	    	private String name;
		    public String getName() {
		        return name;
		    }
		    public void setName(String name) {
		        this.name = name;
		    }
		}
	```
>	
>	定义Cloud Data Object需注意：
>>	
>>*	一个Class实体对应后端数据库中的一张表
>>*	须将自定义实体放入同一个package中，推荐在/src/main/java下新建一个package，如：“data”
>>*	须配置global.json文件以识别该package，如：
>>	`"package-entity" : "data"`
>>* 每张表初始化后都会自动产生几个默认的字段如objectId、createdAt、updatedAt、ACL
>
>	* Cloud Data Object的CRUD
>
>	```java
	public void DoSomethingToCloudData(){
			ZEntityManager<MyObject> myObjectZEntityManager = ZEntityManagerFactory.getManager(MyObject.class);
			MyObject obj = new MyObject();
			obj.setName("Awesome");
			String name = obj.getName();
>				
			//新增Object
			SaveResult<MyObject> saveMsg = myObjectZEntityManager.create(obj);
			String objObjectId = saveMsg.getSaveMessage().objectId().toString();
			//复制Object
			obj.setName(name + "_" + 2);
			SaveResult<MyObject> cloneSaveMsg = myObjectZEntityManager.create(obj);
			//查询Object
			LASQuery sunQuery = LASQuery.instance();
			sunQuery.equalTo("name", name + "_" + 2);
			FindMsg<MyObject> findMsg = myObjectZEntityManager.find(sunQuery);
			MyObject newObj = findMsg.results().get(0);
			//更新Object
			LASUpdate update = LASUpdate.getUpdate();
			update.set("name", name + "_new");
			UpdateMsg updateMsg = myObjectZEntityManager.update(newObj.objectIdString(), update);
			//删除Object
			DeleteResult deleteResult = ninjaZEntityManager.delete(objObjectId);
	}
	```
>
>	我们可以通过实体工厂，得到要操作的实体对象管理者来完成相关操作：
> 	`ZEntityManager<MyObject> myObjectZEntityManager = ZEntityManagerFactory.getManager(MyObject.class);`
> 	整个过程中系统会自动捕获并返回异常。
> 
> 	最后，我们只需将这个方法添加至Cloud Function中即可：
> 	
> 	```java
		defineFunction("UseCloudData", request -> {
			DoSomethingToCloudData();
			Response<String> response = new ZResponse<String>(String.class);
			response.setResult("Done."));
			return response;
		}
> 	```
> 	
* 	**使用Cloud Function：**

	1.	API方式调用：
	
		Cloud Code服务|API地址|请求方式|
	------------|-------|------|
	function|/functions/{name}|POST|
	job|/jobs/{name}|POST|
	config|/console/config|GET|
	jobNames|/console/jobNames|GET|
	
	2.	通过Android/iOS SDK调用：
	
		Android SDK中：
	
		```java
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("key1", 1);
		params.put("key2", "2");
		LASCloudManager.callFunctionInBackground("hello", params, new FunctionCallback<JSONObject>() {
			@Override
			public void done(JSONObject object, LASException exception) {
				assertNull(exception);
			}
		});
		```
		
		iOS SDK中：
	
		```java
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("key1", 1);
		params.put("key2", "2");
		LASCloudManager.callFunctionInBackground("hello", params, new FunctionCallback<JSONObject>() {
			@Override
			public void done(JSONObject object, LASException exception) {
				assertNull(exception);
			}
		});
		```
	3. 	添加至Background Job中，帮助完成Job逻辑。
	
* 	Cloud Function的测试：
	
	请移步至[Hello World 样例](...)以获取Curl测试引导。

## 后台任务

Cloud Code中，您还可以自定义后台任务，它可以很有效的帮助您完成某些重复性的任务，或者定时任务。如深夜进行数据库迁移，每周六给用户发送打折消息等等。您也可以将一些耗时较长的任务通过Job来有条不紊地完成。

*	**创建和监控Background Job：**

	1.	在Cloud Code中定义

		进入主程序入口(main函数)，使用defineJob来定义Job

	 	``` java
	  		defineJob("helloJob", request -> {
	      	Response response = new ZResponse(String.class);
	      	response.setResult("hello job");
	      	return response;
	  		});
	  	```

	2.	在管理门户中定义

		1.	进入“开发者中心”，点击“任务”－“已设任务”－“新建任务”
		2.	填写任务详情：

			img

			表单项目|作用 
			----|-------|
			名称|任务的名字|
			函数名|想要执行的Backgroud Job的名字
			设置开始|从何时开始执行任务
			设置重复|每隔多久重复执行任务
			参数|提供数据给Backgroud Job
			
	3.	在管理门户中查看状态

		1.	进入“开发者中心”，点击“任务”－“任务状态”，您将能查看所有的任务列表，以及他们的状态概况
		2.	选中您想要查看的任务，便可以查看任务详情

			img

*	**如何测试Background Job：**

	我们可以利用Curl测试Job是否可用

	```shell
		curl -X POST \
		-H "X-ZCloud-AppId: YOUR_APPID" \		
		-H "X-ZCloud-APIKey: YOUR_APIKEY" \
		-H "Content-Type: application/json" \
		http://10.10.10.176:8080/jobs/YOUR_JOBNAME
	```

## Hook for Cloud Data

*	**Hook简介**

	如果说Cloud Data是一座仓库，那么Hook就是仓库管理员。用户对Cloud Data Object进行任何操作时（包括新建，删除及修改），Hook都可在其之前或之后，进行特定的操作。

	例如，我们在用户注册成功之前，可以通过beforeCreate Hook，来检查其是否重名。也可以在其注册成功之后，通过afterCreate Hook，向其发送一条欢迎信息。Hook能很好地实现与数据操作相关的业务逻辑，它的优势在于，所有的业务在云端实现，而且被不同的应用/平台共享。

*	**创建和使用Hook：**
	
	实现ZEntityManagerHook接口(建议直接继承ZEntityManagerHookBase类，它默认为我们做了实现，我们想要hook操作，只需直接重载对应的方法即可)

	```java
	  @EntityManager("MyObject")
	  public class MyObjectHook extends ZEntityManagerHookBase<MyObject> {
	      @Override
	      public BeforeResult<MyObject> beforeCreate(MyObject obj) {
	        ZEntityManager<MyObject> myObjectZEntityManager = ZEntityManagerFactory.getManager(MyObject.class);
	        //创建obj前验证是否重名了
	        LASQuery sunQuery = LASQuery.instance();
	        sunQuery.equalTo("name", obj.getName());
	        FindMsg<MyObject> findMsg = myObjectZEntityManager.find(sunQuery);
	        if (findMsg.results() != null && findMsg.results().size() > 0) return new BeforeResult<>(obj,false,"obj name repeated");
	        return new BeforeResult<>(obj, true);
	      }
	      @Override
	      public AfterResult afterCreate(BeforeResult<MyObject> beforeResult, SaveMsg saveMessage) {
	        ZEntityManager<MyObject> myObjectZEntityManager = ZEntityManagerFactory.getManager(MyObject.class);
	        //创建完obj后修改这个obj的ACL权限
	            Map<String,Map<String,Boolean>> acl = new HashMap<>();
	            Map<String,Boolean> value = new HashMap<>();
	            value.put("read", true);
	            value.put("write", true);
	            acl.put(saveMessage.objectId().toString(), value);
	        LASUpdate update = new LASUpdate().set("ACL", acl);
	        myObjectZEntityManager.update(saveMessage.objectId().toString(), update);
	        AfterResult afterResult = new AfterResult(saveMessage);
	            return afterResult;
	      }
	  }
  ```
  
  定义Hook时，我们需确保目标Cloud Data Object存在，否则会报错。如果Cloud Data Object不存在，我们可以：
  
  1.	在管理门户中，添加Class
  2.	在定义Hook前，新建它：

		```java
		//新增Object
		SaveResult<MyObject> saveMsg = myObjectZEntityManager.create(obj);
		```
   	定义Hook需注意：

	>* 	Hook类上需要添加`@EntityManager`注解，以便服务器能够识别该Hook是针对哪个实体的
	>*	须将自定义实体放入同一个package中，推荐在/src/main/java下新建一个package，如：“hook”
	>* 	须配置global.json文件以识别该package，如：
	> 	`"package-hook" : "hook"`
	>* 	内建Collection和自定义Collection均支持Hook，内建Collection原有的限制（ _User用户名和密码必填， _Installation的deviceToken和installationId二选一）依然有效。
   
	
## Log

*	**Log简介**

	Cloud Code提供Log功能，以便您能记录Function，Hook或者Job在运行过程中出现的信息。除此之外，Cloud Code的部署过程，也将被记录下来。您可以在管理门户中查看所有的日志。

* 	**在Cloud Code中记录Log**:

	1.	在项目主入口Main函数中，获取Logger实例
	2.	您可以使用logger实例，记录3种级别的日志：Error，Warn和Info.
	
	```java
		public class myClass {
			Logger logger = LoggerFactory.getLogger(myClass.class);
    		public void myMethod(){
        		logger.error("Oops! Error, got you!");
        		logger.warn("I'm Warning");
        		logger.info("I'm Information");
    		}
		}
	```	
   	使用Log需注意:

	>*	本地测试不会产生数据库记录，但发布后会产生记录，你可以在后端界面查看你的日志信息
	>*	如果您的Function调用频率很高，请在发布前尽量去掉调试测试日志，以避免不必要的日志存储
	>*	在您的Cloud Code项目中，可以添加log4j配置开启debug日志信息，以方便你的本地开发
	
* 	**系统自动记录的Log**:
	
	除了手动记录的Log外，系统还将自动为您收集一些必要的日志，包括：
	
	>*	Cloud Function的上传部署信息
	>*	Hook Entities的Cache信息
	>* 	Cloud Code相关的API request信息
	
*	**如何查看查看Log**:

   进入“管理门户”，点击“开发者中心”－“日志”，您便可查看该应用的所有日志。
   
   img
   
   您还可通过切换Error，Warn和Info选项，来查看不同类型的日志。
   
## LASCC － Cloud Code 命令行工具

*	**简介**

	LASCC命令行工具是为Cloud Code项目的上传，部署，停止及版本管理而设计的。您可以利用它，将Maven项目生成的package上传到Leap Cloud，在云端，package将被制作成Docker Image，而部署过程，就是利用Docker Container将这个Image启动。而被上传到云端的每个版本的Cloud Code都将被保存，您可以自由地卸载某一个版本，而后部署另外一个版本的Cloud Code.
	
*	**如何获取LASCC**
	
	1.	获取客户端：
	
		```java
	git clone https://gitlab.ilegendsoft.com/zcloudsdk/zcc.git
	```
	2.	将客户端所在路径添加至系统环境变量 $PATH 中：
	
		```java
	export PATH=/Users/awesome/zcc:$PATH
	```
*	**如何使用LASCC**

	1.	登录:
	
		```java
		lascc login <用户名>
		```
		`<用户名>` 为您登录LAS管理门户的账号，然后根据提示输入密码

	2.	显示所有app：
	
		```java
		lascc apps
		```

		查询账号下的所有应用，显示的信息为：AppId ：AppName

	3.	选择应用:
	
		```java
		lascc use <应用名>
		```

		`<应用名>`为目标应用名。选择之后，接下来的操作（上传/部署/停止/版本管理）都将以此应用为上下文。

	4.	上传cloudcode:
	
		```java
		lascc upload <文件路径>
		```

		`<文件路径>`为你将部署的Cloud Code package（zip文件，由mvn package命令生成），它将被上传到步骤3指定的应用下。

		上传的的代码会被制作成Docker镜像，版本号在Cloud Code项目里的global.json文件中指定：
	
		```java
		"global": {
		    "zVersion": "0.0.1"
		}
		```

	5.	显示所有云端Cloud Code版本:
	
		```java
		lascc lv
		```

		即显示所有该应用下，用户上传过的Cloud Code的所有版本号。

	6.	部署cloudcode：
	
		```java
		lascc deploy <版本号>
		```

		`<版本号>`为如zcc deploy 0.0.1，将部署指定应用下版本号为0.0.1的Cloud Code；如果部署不存在的版本，会提示错误："version of appId not exists"

 	7.	停止cloudcode：
	
		```java
		lascc undeploy
		```

		停止该应用的Cloud Code，如果之前已经部署过一个版本，需要先停止，再部署。


	8.	输出最近的日志：
	
		```java
		lascc log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]
		```
>		
>		-l 指定输出日志的级别：info或是error
>		-n 指定log的数量
>		-s 指定跳过最近的log数量


	
