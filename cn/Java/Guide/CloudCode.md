
## 开始使用Cloud Code

## Cloud Code简介

####	**什么是Cloud Code服务**
Cloud Code是部署运行在Leap Cloud上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在Web server上的Web Service或RESTful API。它对外提供的接口也是RESTful API，也正是以这种方式被移动应用调用。


####    **为何您需要Cloud Code服务**

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

### 1.	创建Cloud Code项目

#### + 使用Cloud Code项目模版
>
* 	**什么是LAS Cloud Code Java项目模板**
>	
	LAS Cloud Code项目模板是利用Maven构建的Java项目。
	* 架构
  	* 测试项目
>
* 	**如何获取LAS Cloud Code Java项目模板**
  	* Git命令获取
		`git clone https://gitlab.ilegendsoft.com/zcloudsdk/cloud-code-template-java.git`
  	* 其他下载渠道：[Java Template Project](http://www.baidu.com)
>
* 	**如何使用LAS Cloud Code Java项目模板**
>
	* 	**Android Studio**
>
		>	1. 打开Android Studio，点击“Import project”
		>	2. 进入项目模板根目录，选择“pom.xml”
		>
		>	 	<p class="image-wrapper">
		>		![imgAndroidStudioOpenPom](/images/imgAndroidStudioOpenPom.png)
		>	3. 按照默认配置点击下一步，直到完成 
		>
		>	 	<p class="image-wrapper">
		>		![imgAndroidStudioOpenPomFinish](/images/imgAndroidStudioOpenPomFinish.png)
>
	* 	**Eclipse** （需要安装Maven插件）
>
		>	1. 将项目模板（cloud-code-template-java文件夹）移至您的Eclipse Workspace中（若直接获取至此目录中，请忽略该步）
		>	2.	打开Eclipse，点击 "File" -> "Import..."
		>	3. 选择 "???" -> "???"
		>
		>	 	<p class="image-wrapper">
		>		![imgEclipseImportMaven](/images/imgEclipseImportMaven.png)
		>	3. ????		
>	
	  **使用时需注意：** 
	> 1.	第一次Load该项目时，可能需要几分钟时间获取并注册相应的组件 `？？正确的术语？？`
	> 2.	LAS Cloud Code Java项目模板是基于Maven构建的，您使用的IDE需安装Maven插件方可打开

#### + 添加至已有项目
>
* 	**如何获取LAS Cloud Code Java SDK**
>
>	*	打开Maven项目的pom文件，添加如下依赖：
>	
	```Java
	<dependency>
    <groupId>com.ilegendsoft</groupId>
    <artifactId>cloud-code-test-framework</artifactId>
    <version>2.2.1-SNAPSHOT</version>
    </dependency>
	```
>	
>	  **使用时需注意：** 
	> 1.	这个依赖包含了基础的SDK客户端和本地单元测试框架
>
>	*	打开Maven项目的pom文件，添加如下配置：
>	

### 2.	配置Cloud Code项目

* 	**如何连接LAS应用与Cloud Code项目**

	>	1.	在/src/main/resources/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：
	>
	>		```java
	>		{
	>		    "applicationName" : "helloword",              //应用名称
	>		    "applicationId": "YOUR_APPLICATION_ID",       //应用ID
	>		    "applicationKey": "YOUR_MASTER_KEY",          //应用master-key
	>		    "lang" : "java",                              //cloudcode开发语言，支持多种语言
	>		    "java-main": "Main",                          //cloudcode主程序入口
	>		    "package-hook" : "hook",                      //hook目录
	>		    "package-entity" : "bean",                    //Class实体目录
	>		    "global": {                                   //其他参数配置
	>		    "zVersion": "0.2.1"                           //cloudcode当前版本  ??需要修改么??
	>		    }
	>		}
	>
	>		```
	>
	>	根据创建应用时获取的key，修改下列键的值：
	>	
	>	 键|值|
	>  	 ------------|-------|
	>	 applicationName|应用名称
	>	 applicationId|Application ID
	>	 applicationKey|Master Key
	>
	>	2. 打开Maven项目的pom文件，添加如下配置：
	>	
	>	
	>	```Java
	>	<properties>
	        <nexus.develop.host>10.10.10.137:8081</nexus.develop.host>
	        <nexus.production.host>54.164.163.132:8081</nexus.production.host>
	    </properties>
	>
	    <repositories>
	        <repository>
	            <id>public</id>
	            <name>Public Repositories</name>
	            <url>http://${nexus.develop.host}/nexus/content/groups/public</url>
	        </repository>
	        <repository>
	            <id>releases</id>
	            <name>Internal Releases</name>
	            <url>http://${nexus.develop.host}/nexus/content/repositories/releases</url>
	        </repository>
	        <repository>
	            <id>snapshots</id>
	            <name>Internal Releases</name>
	            <url>http://${nexus.develop.host}/nexus/content/repositories/snapshots</url>
	        </repository>
	    </repositories>
	>
	    <pluginRepositories>
	        <pluginRepository>
	            <id>public</id>
	            <name>Public Repositories</name>
	            <url>http://${nexus.develop.host}/nexus/content/groups/public</url>
	        </pluginRepository>
	    </pluginRepositories>
	>
	    <profiles>
	        <profile>
	            <id>dev</id>
	            <distributionManagement>
	                <repository>
	                    <id>releases</id>
	                    <name>Internal Releases</name>
	                    <url>http://${nexus.develop.host}/nexus/content/repositories/releases</url>
	                </repository>
	                <snapshotRepository>
	                    <id>snapshots</id>
	                    <name>Internal Releases</name>
	                    <url>http://${nexus.develop.host}/nexus/content/repositories/snapshots</url>
	                </snapshotRepository>
	            </distributionManagement>
	        </profile>
	        <profile>
	            <id>pro</id>
	            <distributionManagement>
	                <repository>
	                    <id>releases</id>
	                    <name>Internal Releases</name>
	                    <url>http://${nexus.production.host}/content/repositories/releases</url>
	                </repository>
	                <snapshotRepository>
	                    <id>snapshots</id>
	                    <name>Internal Releases</name>
	                    <url>http://${nexus.production.host}/content/repositories/snapshots</url>
	                </snapshotRepository>
	            </distributionManagement>
	        </profile>
	    </profiles>
	>
	    <dependencies>
	    <dependency>
	        <groupId>com.ilegendsoft</groupId>
	        <artifactId>cloud-code-test-framework</artifactId>
	        <version>2.2.1-SNAPSHOT</version>
	    </dependency>
	        <dependency>
	            <groupId>junit</groupId>
	            <artifactId>junit</artifactId>
	            <version>4.11</version>
	            <scope>test</scope>
	        </dependency>
	    </dependencies>
	>
	> 
	    <build>
	        <plugins>
	            <plugin>
	                <groupId>org.apache.maven.plugins</groupId>
	                <artifactId>maven-dependency-plugin</artifactId>
	                <executions>
	                    <execution>
	                        <id>copy-mod-dependencies-to-target</id>
	                        <phase>process-classes</phase>
	                        <goals>
	                            <goal>copy-dependencies</goal>
	                        </goals>
	                        <configuration>
	                            <outputDirectory>target/lib</outputDirectory>
	                            <includeScope>compile</includeScope>
	                        </configuration>
	                    </execution>
	                </executions>
	            </plugin>
	            <plugin>
	                <artifactId>maven-assembly-plugin</artifactId>
	                <configuration>
	                    <descriptors>
	                        <descriptor>src/main/assembly/mod.xml</descriptor>
	                    </descriptors>
	                </configuration>
	                <executions>
	                    <execution>
	                        <id>assemble</id>
	                        <phase>package</phase>
	                        <goals>
	                            <goal>single</goal>
	                        </goals>
	                    </execution>
	                </executions>
	            </plugin>
	            <plugin>
	                <groupId>org.apache.maven.plugins</groupId>
	                <artifactId>maven-compiler-plugin</artifactId>
	                <version>3.0</version>
	                <configuration>
	                    <source>1.8</source>
	                    <target>1.8</target>
	                </configuration>
	            </plugin>
	        </plugins>
	    </build>
	    ```
	>	
		  **使用时需注意：** 
		> 1.	LAS Cloud Code的使命是为LAS应用提供更出色，更高效的业务服务，因此，在开始创建LAS Cloud Code项目前，我们必须拥有LAS应用。[点击此处](...)进入创建应用教程。


## 样例项目

您可以通过样例项目*Hello World*了解Cloud Code的“开发，上传，部署，测试”过程。

#### 1. 开发



#### 2. 上传及部署

#### 3. 测试

## Cloud Function

* 定义Cloud Function：
>1.	进入主程序入口(main函数)
>2.	使用defineFunction来定义你的Function
>
  ``` java
	  defineFunction("hello", request -> {
	      Response<String> response = new ZResponse<String>(String.class);
	      response.setResult(request.parameter(String.class));
	      return response;
	  });
  ```

* 使用Cloud Function：
> 1.	Schedule Job时调用。可直接选择部署在云端的Cloud Function，作为运行Job的运行目标函数
> <p class="image-wrapper">
	![imgScheduleJobs](/images/imgScheduleJobs.png)
>
> 2.	通过API调用
> 
  ```shell
	curl -X POST \
   -H "X-ZCloud-AppId: *YOUR_APPID*" \
   -H "X-ZCloud-APIKey: *YOUR_APIKEY*" \
   -H "Content-Type: application/json" \
   -d '{"name":"HanMeimei"}' \
   http://10.10.10.176:8080/functions/hello
   ```
  
## Job

* 定义Job：
>1.	进入主程序入口(main函数)
>2.	使用defineJob来定义Job
>	
>
  ``` java
  defineJob("helloJob", request -> {
      Response response = new ZResponse(String.class);
      response.setResult("hello job");
      return response;
  });
  ```
> 或者，您可移步至*Console引导*，获取在console中定义Job的方法，以及如何查看Job的运行状态。

* 使用Job：
> *	在Console中手动运行Job
>	<p class="image-wrapper">
	![imgScheduleJobs](/images/imgScheduleJobs.png)
>
> *	通过API调用
>
	```shell
		curl -X POST \
	   	-H "X-ZCloud-AppId: *YOUR_APPID*" \
	   	-H "X-ZCloud-APIKey: *YOUR_APIKEY*" \
	   	-H "Content-Type: application/json" \
	   	http://10.10.10.176:8080/jobs/helloJob
   ```

## Cloud Data ?

*	定义Class：

	>1.	新建一个Class
	>2.	继承自`ZCloudObject`对象
	>
	```java
	public class MyObject extends ZCloudObject {
	    	private String name;
		    public String getName() {
		        return name;
		    }
		    public void setName(String name) {
		        this.name = name;
		    }
		}
	```
> 或者，您可移步至*Console引导*，获取在console中定义Class的方法。

	
	定义Class需注意：
>* 一个Class实体对应后端数据库中的一张表
>* 每张表初始化后都会自动产生几个默认的字段如objectId、createdAt、updatedAt、ACL
>* 所有自定义实体必须在同一个package下，并在global.json配置中标注该package选项，如下：
>	`"package-entity" : "bean"`
	
	
* 使用Class：

	>1. 新建一个函数（包含业务逻辑）实现ZHandler
	>2. 注册服务接口
	
	```java
	//业务逻辑
	public class MyHandler {
		private static final Logger LOGGER = LoggerFactory.getLogger(MyHandler.class);
		public ZHandler<Request, Response> helloMyObject() {
			ZEntityManager<MyObject> myObjectZEntityManager = ZEntityManagerFactory.getManager(MyObject.class);
			return request -> {
				MyObject obj = request.parameter(MyObject.class); //????
				String name = obj.getName();
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
				//返回结果
				Response<String> response = new ZResponse<>(String.class);
				response.setResult(newObj.getName());
				return response;
			};
		}
	}
	```
	```java
	//注册服务接口（在main函数中）
	defineFunction("helloMyObject", new MyHandler(). helloMyObject(console));
	```
	
	使用Class需注意：

	>*	我们可以通过实体工厂，得到要操作的实体对象管理者来完成相关操作
	> `ZEntityManager<Ninja> ninjaZEntityManager = ZEntityManagerFactory.getManager(Ninja.class);`
	> 整个过程中系统会自动捕获并返回异常
	>* 
   
#### Hook

* 定义Hook：
>1.	实现ZEntityManagerHook接口(建议直接继承ZEntityManagerHookBase类，它默认为我们做了实现，我们想要hook操作，只需直接重载对应的方法即可)
>
>```java
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

   	定义Hook需注意：

	>* Hook类上需要添加`@EntityManager`注解，以便服务器能够识别该Hook是针对哪个实体的
	>* 所有Hook必须在同一个package下，并在global.json配置中标注该选项，如下：
	> `"package-hook" : "hook"`
	>* 内建Collection和自定义Collection均支持Hook，内建Collection原有的限制（ _User用户名和密码必填， _Installation的deviceToken和installationId二选一）依然有效。
   
	
## Log

LAS Cloud Code SDK 提供了Console类用来记录日志，你可以在Main, Hook, Handler中使用它。目前我们提供Info, Warn, Error三个级别

* 使用Log:
> *	在Cloud Code中添加Log:
> 
>	<p class="image-wrapper">
	![imgScheduleJobs](/images/imgScheduleJobs.png)
> *	在Console中查看Log:
> 
>	<p class="image-wrapper">
	![imgScheduleJobs](/images/imgScheduleJobs.png)
   
   	使用Log需注意:

	>*	本地测试不会产生数据库记录，但发布后会产生记录，你可以在后端界面查看你的日志信息
	>*	如果您的Function调用频率很高，请在发布前尽量去掉调试测试日志，以避免不必要的日志存储
	>*	在您的Cloud Code项目中，可以添加log4j配置开启debug日志信息，以方便你的本地开发
	