
# LeapCloud Cloud Code

## Introduction

###What is Cloud Code
Cloud Code refers to the code depolyed and executed on LeapCloud. It can be used to implement the complicated service logic which should be executed in cloud. It is similar to the traditional Web Service or RESTful API that runs in Web Server. It provides access to external data sources through the RESTFul API and is also invoked with the same way by mobile apps.  

###Why is Cloud Code Necessary 

The service logic can be implemented in client if the app is simple, while if the app requires more complicated service logic, want to access more data or need a number of multiplication, then Cloud Code is required. The advantages of Cloud Code can be summarized as follows:

* Powerful Computing ability: Cloud Code executes in Docker of LeapCloud and supports multi-CPU and large memory.
* More Effective: Able to require Cloud Data reepeatedly with high speed network services in an invocation. The efficiency will be much improved. 
* The same set of code can provide services for iOS, Android, Website, etc. 

###How Does Cloud Code Work

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

A Cloud Code project contains Custom Cloud Code, Cloud Code SDK and 3rd Party Libaries. After the development, package the project with maven and upload it to LeapCloud with Cloud Code command line tool lcc and LeapCloud will generate corresponding docker image. LeapCloud can start Docker container and operate the Docker image with lcc deploy.
一个Cloud Code项目包含Custom Cloud Code，Cloud Code SDK，3rd Party Libaries。开发完成后，用maven把项目打包成package，然后用Cloud Code命令行工具lcc上传到LeapCloud，LeapCloud会生成对应的docker image。用lcc deploy可以让LeapCloud启动Docker container运行该Docker image。

Cloud Code support Java only currently, Python version is coming soon.目前Cloud Code支持Java环境，我们在近期会推出Python版本。
	  
##Preperations
####Install JDK 
Cloud Code supports JDK 6, 7, 8 and JDK 8 is recommended.

####Install Maven
######Eclipse:	
1.	Click "Help" >> "Install New Software.."
2.	Enter `http://download.eclipse.org/technology/m2e/releases` in "Work with"，choose "Maven Integration for Eclipse" from the list and then install Maven extension.

####Install Cloud Code Command Line Tools（Lcc）
######Linux and Mac OSX
Folliwng command will install "lcc" to `/usr/local/bin/lcc`. You can user lcc in Terminal directly after the installation. 下述命令将把名为"lcc"的工具安装至`/usr/local/bin/lcc`目录。完成后，您可直接在Terminal中使用lcc。

*［！！待选择！！］*

*	Auto Install 自动安装

	```shell
	curl -s https://******/installer.sh | sudo
	```

*	Via git command

	Enter /usr/local/bin and operate git to get: 进入目录/usr/local/bin，运行git命令获取：
		
	```java
	cd /usr/local/bin
	git clone https://gitlab.ilegendsoft.com/zcloudsdk/zcc.git
	```

## Quick Start 快速入门
### Create Cloud Code Project
Get LC Cloud Code Java Project Templates

```shell
git clone https://gitlab.ilegendsoft.com/zcloudsdk/cloud-code-template-java.git
```

### Modify Configuration修改配置
Add global.json in /src/main/resources/config （Please make sure this path exists）and add following configuration in it: 在/src/main/resources/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

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

Modify following key value according to key got while creating app: 根据创建应用时获取的key，修改下列键的值：
	
Key|Value|
------------|-------|
applicationName|LeapCloud app name
applicationId|Application ID
applicationKey|Master Key
java-main|Name of the main function
package-hook|Name of hook package
package-entity|Name of CLeapClouds entity package
version|Current Cloud Code version number

### Define a Simple Function

```Java
import as.leap.code.LCLoader;
import as.leap.code.Response;
import as.leap.code.impl.GlobalConfig;
import as.leap.code.impl.LoaderBase;
import as.leap.code.impl.Response;

public class Main extends LoaderBase implements Loader {
    @Override
    public void main(GlobalConfig globalConfig) {
    
    	//Define Cloud Function
        defineFunction("hello", request -> {
            Response<String> response = new Response<String>(String.class);
            response.setResult("Hello, " + request.parameter(Map.class).get("name") + "!");
            return response;
        });
    }
}
```
Notice:

* The main method of main class is the entrance of cloud code when started (defined in global.json). It needs to inherit LoaderBase and implement loader interface. All cloud functions and jobs should be registered in main method. Main class的main method是Cloud Code启动的入口（在global.json中指定），需要继承LoaderBase并实现Loader接口，在main方法中需要注册所有的cloud function和job。

### Package 打包

Run Maven command in root directory of current project: 在当前项目根目录下运行Maven命令：

`mvn package`

We can find *xxx-1.0-SNAPSHOT-mod.zip* in target folder in root directory and this is the package we want. 我们将在项目根目录下的target文件夹中发现 *xxx-1.0-SNAPSHOT-mod.zip* 文件，这便是我们想要的package.

### Upload Cloud Code and Deploy 上传Cloud Code及部署
1. Login: lcc login <UserName>登录：lcc login <UserName>
2. Select the targeting app to be deployed as the context of subsequent actions 选择所要部署的目标应用，作为后续操作的上下文：lcc use <AppName>
3. Upload 上传Package： lcc upload <PackageLocation>
4. Deploy 部署Cloud Code：lcc deploy <VersionNumber>

**Notice:** 

*	The VersionNumber here is defined in global.json in your Cloud Code project (value og version parameter)这里的VersionNumber定义在您Cloud Code项目中的global.json文件中（version字段的值）
* 	If you've already deployed Cloud COde of other versions once, please uninstall that version first before the deployment of new version. 若您在部署之前，已经部署过某个版本的Cloud Code，需要先卸载该版本的Cloud Code，才能部署新版本。
*	Please check [lcc Guide](...) for more details about lcc. 请查看[lcc使用向导](...)，以获取lcc的更多信息。

### Test 测试

Send following post request towards Cloud Function deployed with curl to test if the Function is deployed well: 通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-LC-AppId: YOUR_APPID" \
-H "X-LC-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.leap.as/functions/hello
```
Now, we may get:此时，我们将得到如下结果：

```shell
Hello, David Wang!
```
which indicates that the test is passed and the deployment is successful. 表明测试通过，部署成功。

Notice: 注意:

* The value of X-LC-APIKey is the API KEY of application, not the Master Key of Cloud Code project. X-LC-APIKey的值为应用的API KEY，而非Cloud Code项目中使用的Master Key.

## Cloud Function
Cloud Function is the code running in LeapCloud which can be used to implement complicated logic and use various 3rd Party Libs.
Cloud Function是运行在LeapCloud上的代码。可以使用它来实现各种复杂逻辑，也可以使用各种3rd Party Libs。

###Define 定义Cloud Function
Every Cloud Function should implement as.leap.code.Handler interface and this interface is the typical Functional Interface. 每个Cloud Function需要实现 as.leap.code.Handler interface，该interface是典型的Functional Interface。

```Java
public interface Handler <T extends as.leap.code.Request, R extends as.leap.code.Response> {
    R handle(T t);
}
```
Define a function with JDK 8 lambda expression, as follows:用JDK 8 lambda表达式可以如下定义一个function:

```Java
request -> {
    Response<String> response = new Response<String>(String.class);
    response.setResult("Hello, world!");
    return response;
}
```
JDK 6 and 7: JDK6和7可以如下定义:

```Java
public class HelloWorldHandler implements Handler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Hello, world!");
        return response;
    }
}
```
At last, register the function in main class.最后，需要在main class里注册该函数。

```Java
defineFunction("helloWorld", new HelloWorldHandler());
```
###Access Cloud Data with Cloud Function 通过Cloud Function访问Cloud Data

####Define 定义Cloud Data Object（ Called “Class” in Management Interface 在管理界面中，称之为“Class”）
Create a new Cloud Data Object and inherit CloudObject class 新建一个Cloud Data Object，并继承CloudObject类

```java
public class MyObject extends CloudObject {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
}
```
Notice for defining Cloud Data Object:

* Every Cloud Data Object corresponds to a Cloud Data class and the class name of Cloud Data Object should be the same as the class name created in Management page.一个 Cloud Data Object 对应一个 Cloud Data class，Cloud Data Object 的类名必须和管理界面中创建的 class 名字一样
* All Cloud Data Objects should be put in one package. Creating a new package in /src/main/java is recommended, such as "data" 须将所有的 Cloud Data Object 放入同一个package中，推荐在/src/main/java下新建一个package，如：“data”
* global.json file is required to identify the package. e.g. `"package-entity" : "data"` 须配置global.json文件以识别该package，如：`"package-entity" : "data"`

####CRUD of Cloud Data Object

We can run Cloud Data with EntityManager: 我们可以通过 EntityManager 操作 Cloud Data：

```java
public void doSomethingToCloudData(){
	EntityManager<MyObject> myObjectEntityManager = EntityManagerFactory.getManager(MyObject.class);
	MyObject obj = new MyObject();
	obj.setName("Awesome");
	String name = obj.getName();

	//Create Object
	SaveResult<MyObject> saveMsg = myObjectEntityManager.create(obj);
	String objObjectId = saveMsg.getSaveMessage().objectId().toString();
	
	//Clone Object
	obj.setName(name + "_" + 2);
	SaveResult<MyObject> cloneSaveMsg = myObjectEntityManager.create(obj);
	
	//查询Object
	Query sunQuery = Query.instance();
	sunQuery.equalTo("name", name + "_" + 2);
	FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
	MyObject newObj = findMsg.results().get(0);
	
	//Update Object
	Update update = Update.getUpdate();
	update.set("name", name + "_new");
	UpdateMsg updateMsg = myObjectEntityManager.update(newObj.objectIdString(), update);
	
	//Delete Object
	DeleteResult deleteResult = ninjaEntityManager.delete(objObjectId);
}
```

####Use 使用Cloud Function

#####Invoke with API API方式调用
The request format are shown as follows:请求格式如下所示：

```shell
curl -X POST \
-H "X-LC-AppId: YOUR_APPID" \
-H "X-LC-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.leap.as/functions/hello
```
	
#####Invoke with Android/iOS SDK: 通过Android/iOS SDK调用：
In Android SDK：

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
In iOS SDK：

```objective-c
NSDictionary *params = @{@"key1":@1, @"key2":@"2"};
    [LCCloudCode callFunctionInBackground:@"hello" withParameters:params block:^(id object, NSError *error) {
        if (error) {
            // an error occured
        } else {
            // handle the object
        }
    }];
```

## Background Job
You can customize background jobs in Cloud Code to help you finish the repetitive or scheduled job, like database migration, discount push and etc. You can also accomplish some time-consuming mission with job. Cloud Code中，您还可以自定义后台任务，它可以很有效的帮助您完成某些重复性的任务，或者定时任务。如深夜进行数据库迁移，每周六给用户发送打折消息等等。您也可以将一些耗时较长的任务通过Job来有条不紊地完成。

###Create and Observe Background Job创建和监控Background Job
####Define and Implement Job Handler in Cloud Code 在Cloud Code中定义并实现Job Handler
``` java
public class MyJobHandler implements Handler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Job done!");
        return response;
    }
}
```

Enter the entrance of the application (main function) and define Job with defineJob 然后进入主程序入口(main函数)，使用defineJob来定义Job

``` java
defineJob("myJob", new MyJobHandler());
```
###Test Background Job
We can test if Job work well with curl 我们可以利用curl测试Job是否可用

```shell
curl -X POST \
-H "X-ZCloud-AppId: YOUR_APPID" \		
-H "X-ZCloud-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
https://api.leap.as/jobs/YOUR_JOBNAME
```

####Set Job Schedule in Management Console 在管理界面中设置 Job Schedule
img

Items|Description 
----|-------|
Name|Name of the job plan|
Function name |Name of the Backgroud Job
Schedule Time|Time for running the Job
Schedule Repeat|Time interval between repeated Jobs
Parameter|Provide data for Backgroud Job

####Check Status in Management Console在管理门户中查看状态
You can see the job plan list and their status in Dev Center>>Cloud Code>>Status. Click on the job plan, then you can check its details. 进入“开发者中心”，点击“云代码” >> “任务状态”，您将能查看所有的任务列表，以及他们的状态概况。
选中您想要查看的任务，便可以查看任务详情。
img

## Hook for Cloud Data
Hook is used to implement certain operations when there are operations towards Cloud Data (including creating, deleting and editing). For example, we can check if the username is taken with beforeCreate Hook when the user is signing up; or we can send a welcome message with afterCreateHook when the user finished registration. Hook can implement data-related business logic well and all services can be implemented in cloud and shared among different apps/platforms.
Hook用于在对 Cloud Data 进行任何操作时（包括新建，删除及修改）执行特定的操作。例如，我们在用户注册成功之前，可以通过beforeCreate Hook，来检查其是否重名。也可以在其注册成功之后，通过afterCreate Hook，向其发送一条欢迎信息。Hook能很好地实现与数据操作相关的业务逻辑，它的优势在于，所有的业务在云端实现，而且被不同的应用/平台共享。

###Create and Use Hook创建和使用Hook
Implement EntityManagerHook interface (Inheriting EntityManagerHookBase class directly is recommended since there's default implementation already which means if we want to hook a certain operation, we just need to override corresponding methods.)
实现EntityManagerHook接口(建议直接继承EntityManagerHookBase类，它默认为我们做了实现，我们想要hook操作，只需直接重载对应的方法即可)

```java
@EntityManager("MyObject")
public class MyObjectHook extends EntityManagerHookBase<MyObject> {
	@Override
	public BeforeResult<MyObject> beforeCreate(MyObject obj) {
		EntityManager<MyObject> myObjectEntityManager = EntityManagerFactory.getManager(MyObject.class);
		//Test if the obj is taken
		Query sunQuery = Query.instance();
		sunQuery.equalTo("name", obj.getName());
		FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
		if (findMsg.results() != null && findMsg.results().size() > 0)
			return new BeforeResult<>(obj,false,"obj name repeated");
		return new BeforeResult<>(obj, true);
	}
	
	@Override
	public AfterResult afterCreate(BeforeResult<MyObject> beforeResult, SaveMsg saveMessage) {
		EntityManager<MyObject> myObjectEntityManager = EntityManagerFactory.getManager(MyObject.class);
		//Edit the ACL permission of this obj after the creation
		Map<String,Map<String,Boolean>> acl = new HashMap<>();
		Map<String,Boolean> value = new HashMap<>();
		value.put("read", true);
		value.put("write", true);
		acl.put(saveMessage.objectId().toString(), value);
		Update update = new Update().set("ACL", acl);
		myObjectEntityManager.update(saveMessage.objectId().toString(), update);
		AfterResult afterResult = new AfterResult(saveMessage);
		return afterResult;
	}
}
```

#####Notice for defining Hook:定义Hook需注意：

* Make sure the corresponding class of targeting Cloud Data Object exists确保目标Cloud Data Object对应的class存在
* `@EntityManager` annotation is required in Hook class for server to identify which entity is this Hook targeting    Hook类上需要添加`@EntityManager`注解，以便服务器能够识别该Hook是针对哪个实体的
* All Hook class should be put in the same package. Creating a new package under /src/main/java is recommended, like “hook”   须将所有的hook class放入同一个package中，推荐在/src/main/java下新建一个package，如：“myHooks”
* global.json file configuration is required to identify the package, like `"package-hook" : "myHooks"`   须配置global.json文件以识别该package，如：`"package-hook" : "hook"`
* Both built-in class and customized class support Hook and restriction of built-in class still works(username and password of _User is required，either deviceToken or installationId of _Installation is required). 内建class和自定义class均支持Hook，内建class原有的限制（ _User用户名和密码必填， _Installation的deviceToken和installationId二选一）依然有效。

### Type of Hook

Cloud Code supports 6 different types of Hook:
#### beforeCreate
Invoke before the corresponding Cloud Data is created, which could be used test if the data entered is validate.
在对应的 Cloud Data 被创建之前调用，可以用于验证输入的数据是否合法。
For example: test if the list name is too long when creating a new friend list.
例如：在新建好友分组的时候，需要检查组名是否太长。

```java
@Override
public BeforeResult<FriendList> beforeCreate(FriendList list) {
	String name = list.getName();
	if (name.length() > 10)
		return new BeforeResult<>(list, false, "Cannot create a friend list with name longer than 10!");
	return new BeforeResult<>(list, true);
}
```

#### afterCreate
Invoke after the corresponding Cloud Data is created, which could be used to perform logic like sending an email to product manager after creating a User. 在对应的 Cloud Data 被创建后调用，可以用于执行如 User 创建后给客户经理发封邮件这样的逻辑。

#### beforeUpdate
在对应的 Cloud Data 被更新之前调用，可以用于验证输入的数据是否合法。
Invoke before the corresponding Cloud Data is updated, which could be used test if the data entered is validate.
For example: test if the list name is already taken when editing a friend list.
例如：在修改好友分组的时候，需要检查组名是否已经存在。

```java
@Override
public BeforeResult<FriendList> beforeUpdate(FriendList list) {
	//Define query criteria：
	Query sunQuery = Query.instance();
	sunQuery.equalTo("Name", list.getName());
	//Execute query in friend list
	EntityManager<Friend> friendEntityManager = EntityManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Update failed because the name of the friend list already exists!");
	return new BeforeResult<>(list, true);
}
```

#### afterUpdate
在对应的 Cloud Data 被更新之后调用，可以用于如用户更新密码后，给用户邮箱发封提醒邮件。
Invoke before the corresponding Cloud Data is updated, which could be used to send emails to users when they changed their password.
#### beforeDelete
在对应的 Cloud Data 被删除之前调用，可以用于验证删除是否合法。
Invoke before the corresponding Cloud Data is deleted, which could be used test if the delete is validate.
For example, test if there's any friend in this list before deleting a list.
例如：用户的每位好友都在某个分组下，在删除一个好友分组之前，需要检查这个分组内是否还存在好友。

```java
@Override
public BeforeResult<FriendList> beforeDelelte(FriendList list) {
	//Define query criteria：
	Query sunQuery = Query.instance();
	sunQuery.equalTo("listName", list.Name);
	//Execute query in friend list
	EntityManager<Friend> friendEntityManager = EntityManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);
	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Cannot delete a friend list if any friend inside!");
	return new BeforeResult<>(list, true);
}
```

#### afterDelete
在对应的 Cloud Data 被删除之后调用，可以用于如清除其他有关的数据。
Invoke after the corresponding Cloud Data is updated, which could be used to clear other relative data.
## Logging
Cloud Code提供Logging功能，以便您能记录Function，Hook或者Job在运行过程中出现的信息。除此之外，Cloud Code的部署过程，也将被记录下来。您可以在管理界面中查看所有的日志。
###在Cloud Code中记录Log
您可以使用logger实例，记录3种级别的日志：Error，Warn和Info.

```java
public class MyClass {
	Logger logger = LoggerFactory.getLogger(myClass.class);

	public void myMethod(){
		logger.error("Oops! Error, caught you!");
		logger.warn("I'm Warning.");
		logger.info("I'm Information");
	}
}
```
使用Log需注意:

* 本地测试不会产生数据库记录，但发布后会产生记录，你可以在后端界面查看你的日志信息
* 如果您的Function调用频率很高，请在发布前尽量去掉调试测试日志，以避免不必要的日志存储
	
###系统自动记录的Log
除了手动记录的Log外，系统还将自动为您收集一些必要的日志，包括：

* Cloud Function的上传部署信息
* Hook Entities的Cache信息
* Cloud Code相关的API request信息
	
###查看Log
可以使用命令行工具lcc查看最近的log

```shell
lcc log -n 100
```
也进入“管理网站”，点击“开发者中心”－>“日志”，您便可查看该应用的所有日志。
img

## LCC － Cloud Code 命令行工具
LCC命令行工具是为Cloud Code项目的上传，部署，停止及版本管理而设计的。您可以利用它，将Maven项目生成的package上传到LeapCloud，在云端，package将被制作成Docker Image，而部署过程，就是利用Docker Container将这个Image启动。而被上传到云端的每个版本的Cloud Code都将被保存，您可以自由地卸载某一个版本，而后部署另外一个版本的Cloud Code.
###登录:
```shell
lcc login <用户名>
```
`<用户名>` 为您登录LeapCloud管理门户的账号，然后根据提示输入密码
###显示所有app：
```shell
lcc apps
```
查询账号下的所有应用，显示的信息为：AppId ：AppName
###选择应用:
```shell
lcc use <应用名>
```
`<应用名>`为目标应用名。选择之后，接下来的操作（上传/部署/停止/版本管理）都将以此应用为上下文。
###上传Cloud Code:
```shell
lcc upload <文件路径>
```
`<文件路径>`为你将部署的Cloud Code package（zip文件，由mvn package命令生成），它将被上传到步骤3指定的应用下。
上传的的代码会被制作成Docker镜像，版本号在Cloud Code项目里的global.json文件中指定：
```
"global": {
	"version": "0.0.1"
}
```
###显示所有云端Cloud Code版本:
```shell
lcc lv
```
即显示所有该应用下，用户上传过的Cloud Code的所有版本号。
###部署Cloud Code：
```shell
lcc deploy <版本号>
```
`<版本号>`为如lcc deploy 0.0.1，将部署指定应用下版本号为0.0.1的Cloud Code；如果部署不存在的版本，会提示错误："version of appId not exists"
###停止cloudcode：
```shell
lcc undeploy
```
停止该应用的Cloud Code，如果之前已经部署过一个版本，需要先停止，再部署。
###输出最近的日志：
```shell
lcc log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]

-l 指定输出日志的级别：info或是error
-n 指定log的数量
-s 指定跳过最近的log数量
```

## Cloud Code进阶
### 添加 Cloud Code 到已有的项目
####配置pom.xml
在pom中，我们将配置：

* 获取Cloud Code SDK
* 获取测试插件JUnit
* 获取编译打包插件

```Java
	//添加依赖，获取Cloud Code SDK及JUnit测试插件
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
	
	//获取编译打包插件
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

####配置打包规则

在/src/main/assembly中新建mod.xml文件，并在其中添加如下配置：

```Java
	<?xml version="1.0" encoding="UTF-8"?>
	<assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.2"
	          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	          xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.2 http://maven.apache.org/xsd/assembly-1.1.2.xsd">

	    <id>mod</id>
	    <formats>
	        <format>zip</format>
	    </formats>
	    <includeBaseDirectory>false</includeBaseDirectory>
	    <fileSets>
	        <fileSet>
	            <outputDirectory>/config</outputDirectory>
	            <directory>src/main/resources/config</directory>
	            <includes>
	                <include>**</include>
	            </includes>
	        </fileSet>
	        <fileSet>
	            <outputDirectory>/cloud/public</outputDirectory>
	            <directory>src/main/resources/public</directory>
	            <includes>
	                <include>**</include>
	            </includes>
	        </fileSet>
	        <fileSet>
	            <outputDirectory>/cloud/lib</outputDirectory>
	            <directory>target</directory>
	            <includes>
	                <include>${project.artifactId}-${project.version}.jar</include>
	            </includes>
	        </fileSet>
	        <fileSet>
	            <outputDirectory>/cloud/lib</outputDirectory>
	            <directory>target/lib</directory>
	            <excludes>
	                <exclude>jackson-*.jar</exclude>
	                <exclude>vertx-*.jar</exclude>
	                <exclude>log4j-*.jar</exclude>
	                <exclude>slf4j-*.jar</exclude>
	                <exclude>cloud-code-base-*.jar</exclude>
	                <exclude>cloud-code-sdk-client-*.jar</exclude>
	                <exclude>cloud-code-test-framework-*.jar</exclude>
	                <exclude>netty-*.jar</exclude>
	                <exclude>rxBus-*.jar</exclude>
	                <exclude>rxjava-*.jar</exclude>
	                <exclude>sun-client-api-*.jar</exclude>
	                <exclude>hazelcast-*.jar</exclude>
	                <exclude>junit-*.jar</exclude>
	            </excludes>
	        </fileSet>
	    </fileSets>
	</assembly>
```

请注意：如果您选择将打包配置文件放在其他路径下，您则需要更新pom.xml文件中的以下部分，将`src/main/assembly/mod.xml`替换为您自定义的路径：

```java
	<plugin>
		<artifactId>maven-assembly-plugin</artifactId>
		<configuration>
			<descriptors>
				<descriptor>src/main/assembly/mod.xml</descriptor>
			</descriptors>
		</configuration>
	</plugin>	
```
