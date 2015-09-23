
# MaxLeap CloudCode

## Introduction

###What is CloudCode
CloudCode refers to the code depolyed and executed on MaxLeap. It can be used to implement the complicated service logic which should be executed in cloud. It is similar to the traditional Web Service or RESTful API that runs in Web Server. It provides access to external data sources through the RESTFul API and is also invoked with the same way by mobile apps.  

###Why is CloudCode Necessary 

The service logic can be implemented in client if the app is simple, while if the app requires more complicated service logic, want to access more data or need a number of multiplication, then CloudCode is required. The advantages of CloudCode can be summarized as follows:

* Powerful Computing ability: CloudCode executes in Docker of MaxLeap and supports multi-CPU and large memory.
* More Effective: Able to require Cloud Data reepeatedly with high speed network services in an invocation. The efficiency will be much improved. 
* The same set of code can provide services for iOS, Android, Website, etc. 

###How Does CloudCode Work

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

A CloudCode project contains Custom CloudCode, CloudCode SDK and 3rd Party Libaries. After the development, please package the project with maven and upload it to MaxLeap with CloudCode command line tool lcc and MaxLeap will generate corresponding docker image. MaxLeap can start Docker container to operate the Docker image with lcc deploy.

CloudCode supports Java only currently, Python version is coming soon.
	  
##Preperations
####Install JDK 
CloudCode supports JDK 6, 7, 8 and JDK 8 is recommended.

####Install Maven
######Eclipse:	
1.	Click "Help" >> "Install New Software.."
2.	Enter `http://download.eclipse.org/technology/m2e/releases` in "Work with"，choose "Maven Integration for Eclipse" from the list and then install Maven extension.

####Install CloudCode Command Line Tools（Lcc）
######Linux and Mac OSX
Folliwng command will install "lcc" to `/usr/local/bin/lcc`. You can use lcc in Terminal directly after the installation. 
*［！！待选择！！］*

*	Auto Install 

	```shell
	curl -s https://******/installer.sh | sudo
	```

*	Via git command

	Enter /usr/local/bin and operate git to get: 
		
	```java
	cd /usr/local/bin
	git clone https://gitlab.ilegendsoft.com/zcloudsdk/zcc.git
	```

## Quick Start 
### Create CloudCode Project
Get MaxLeap CloudCode Java Project Templates

```shell
git clone https://gitlab.ilegendsoft.com/zcloudsdk/cloud-code-template-java.git
```

### Modify Configuration
Add global.json in /src/main/resources/config （Please make sure this path exists）and add following configuration in it:

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

Modify following key values according to the key you got from creating the app:
	
Key|Value|
------------|-------|
applicationName|MaxLeap app name
applicationId|Application ID
applicationKey|Master Key
java-main|Name of the main function
package-hook|Name of hook package
package-entity|Name of Class entity package
version|Current CloudCode version number

### Define a Simple Function

```Java
import com.maxleap.code.MLLoader;
import com.maxleap.code.Response;
import com.maxleap.code.impl.GlobalConfig;
import com.maxleap.code.impl.LoaderBase;
import com.maxleap.code.impl.Response;

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

* The main method of main class is the startup entrance of CloudCode (defined in global.json) and it needs to inherit LoaderBase and implement loader interface. All cloud functions and jobs should be registered in main method. 
### Package 

Run Maven command in root directory of current project:

`mvn package`

We can find *xxx-1.0-SNAPSHOT-mod.zip* in target folder in root directory and this is the package we want. 

### Upload and Deploy CloudCode
1. Login: lcc login <UserName>
2. Select the target app to be deployed as the context of subsequent actions: lcc use <AppName>
3. Upload Package： lcc upload <PackageLocation>
4. Deploy CloudCode：lcc deploy <VersionNumber>

**Notice:** 

*	The VersionNumber here is defined in global.json in your CloudCode project (value of version parameter)
* 	If you've already deployed CloudCode of other versions once, please uninstall that version first before the deployment of the new one.
*	Please check [lcc Guide](...) for more details about lcc.

### Test 

Send following POST request towards Cloud Function which is already deployed with curl to test if the Function is deployed well: 

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.leap.as/functions/hello
```
Now, we may get:

```shell
Hello, David Wang!
```
which indicates that the test is passed and the deployment is successful. 

Notice: 

* The value of X-ML-APIKey is the API KEY of application, not the Master Key of CloudCode project. 

## Cloud Function
Cloud Function is the code running in MaxLeap which could be used to implement complicated logic and use various 3rd Party Libs.

###Define Cloud Function
Every Cloud Function should implement com.maxleap.code.Handler interface and this interface is the typical Functional Interface. 

```Java
public interface Handler <T extends com.maxleap.code.Request, R extends com.maxleap.code.Response> {
    R handle(T t);
}
```
Define a function with JDK 8 lambda expression, shown as follows:

```Java
request -> {
    Response<String> response = new Response<String>(String.class);
    response.setResult("Hello, world!");
    return response;
}
```
JDK 6 and 7:

```Java
public class HelloWorldHandler implements Handler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Hello, world!");
        return response;
    }
}
```
At last, you need to register the function in main class.

```Java
defineFunction("helloWorld", new HelloWorldHandler());
```
###Access Cloud Data with Cloud Function

####Define Cloud Data Object（ Called “Class” in Management Interface ）
Create a new Cloud Data Object and inherit CloudObject class 

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

* Every Cloud Data Object corresponds to a Cloud Data class and the class name of Cloud Data Object should be the same as the class name created in Management Console.
* All Cloud Data Objects should be put in one package. Creating a new package in /src/main/java is recommended, such as "data" 
* global.json file configuration is required to identify the package. e.g. `"package-entity" : "data"` 

####CRUD of Cloud Data Object

We can operate Cloud Data with EntityManager: 

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

####Use Cloud Function

#####Invoke with API
The request format is shown as follows:

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.leap.as/functions/hello
```
	
#####Invoke with Android/iOS SDK: 
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
    [MLCloudCode callFunctionInBackground:@"hello" withParameters:params block:^(id object, NSError *error) {
        if (error) {
            // an error occured
        } else {
            // handle the object
        }
    }];
```

## Background Job
You can customize background jobs in CloudCode to help you finish the repetitive or scheduled jobs, like database migration, discount push and etc. You can also accomplish some time-consuming mission with Job. 

###Create and Observe Background Job
####Define and Implement Job Handler in CloudCode
``` java
public class MyJobHandler implements Handler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Job done!");
        return response;
    }
}
```

Enter the entrance of the application (main function) and define Job with defineJob 

``` java
defineJob("myJob", new MyJobHandler());
```
###Test Background Job
We can test with curl to see if the Job works well 

```shell
curl -X POST \
-H "X-ZCloud-AppId: YOUR_APPID" \		
-H "X-ZCloud-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
https://api.leap.as/jobs/YOUR_JOBNAME
```

####Set Job Schedule in Management Console 
img

Items|Description 
----|-------|
Name|Name of the job plan|
Function name |Name of the Backgroud Job
Schedule Time|Time for running the Job
Schedule Repeat|Time interval between repeated Jobs
Parameter|Provide data for Backgroud Job

####Check Status in Management Console
You can see the job plan list and their status in Dev Center>>CloudCode>>Status. 
Click on the job plan, then you can check its details. 
img

## Hook for Cloud Data
Hook is used to implement certain operations when there are operations towards Cloud Data (including creating, deleting and editing). For example, we can check if the username is taken with beforeCreate Hook when the user is signing up; or we can send a welcome message with afterCreateHook when the user finished registration. Hook can implement data-related business logic well and all services can be implemented in cloud and shared among different apps/platforms.


###Create and Use Hook
Implement EntityManagerHook interface (Inheriting EntityManagerHookBase class directly is recommended since there's default implementation already which means if we want to hook a certain operation, we just need to override corresponding methods.)


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

#####Notice for defining Hook:

* Make sure the corresponding class of target Cloud Data Object exists
* `@EntityManager` annotation is required in Hook class for server to identify which entity is this Hook targeting
* All Hook class should be put in the same package. Creating a new package under /src/main/java is recommended, like “myHooks” 
* global.json file configuration is required to identify the package, like `"package-hook" : "myHooks"` 
* Both built-in class and customized class support Hook，and restriction of built-in class still works(username and password of _User is required，either deviceToken or installationId of _Installation is required). 

### Type of Hook

CloudCode supports 6 different types of Hook:
#### beforeCreate
Invoke before the corresponding Cloud Data is created, which could be used to test if the data entered is validate.
For example: test if the list name is too long when creating a new friend list.

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
Invoke after the corresponding Cloud Data is created, which could be used to perform logic like sending an email to product manager after User creation. 

#### beforeUpdate
Invoke before the corresponding Cloud Data is updated, which could be used to test if the data entered is validate.
For example: test if the list name is already taken when editing a friend list.


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
Invoke after the corresponding Cloud Data is updated, which could be used to send emails to users when they changed their password.
#### beforeDelete
Invoke before the corresponding Cloud Data is deleted, which could be used test if the delete is validate.
For example, test if there's any friend in this list before deleting a list.

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
Invoke after the corresponding Cloud Data is deleted, which could be used to clear other relative data.
## Logging
There is Logging function in CloudCode to record the Function, Hook and Job info during the operations. Besides, the deployment of CloudCode will also be recorded. You can check all logs in Management Console.
###Record Log in CloudCode
You can record 3 types of log: Error, Warn and Info with logger instance.

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
Notice for using Log:

* Local test won't generate database records but the one after the deployment would. You can check your log info in backend console.
* If your Function is invoked frequently, please remove the Logs from debugging as much as possible to aviod unneccessary Logs storage.

	
###Log Recorded Automotically
Except for the Logs manually recorded, there are some other neccessary Logs that would be recorded, including: 

* Deployment info of Cloud Function
* Cache info of Hook Entities
* API request info related to CloudCode
	
###Check Log
Check recent log with command line tool lcc

```shell
lcc log -n 100
```
Or you can check all logs of this app by entering Management Console －> Dev Center －> CloudCode. 
img

## LCC － CloudCode Command Line Tool
LCC command line tool is designed for the upload, deployment, undeployment and version management of CloudCode project. You can upload the package generated from Maven to MaxLeap with it and the package will be produced into Docker Image in cloud. As for the deployment, it is about activating the Image with Docker Container. Each version of CloudCode uploaded to cloud will be saved, you can uninstall any version of CloudCode and then deploy another one.

###Login:
```shell
lcc login <username>
```
`<username>` is the account name of MaxLeap Management Console, please enter password then according to the tip.
###Show All Apps：
```shell
lcc apps
```
Check all apps in your account and show with AppId: AppName
###Select an App:
```shell
lcc use <App name>
```
`<App name>` is the name of target app. After the selection, all the following operations (upload/deployment/undeployment/version management) will take this app as the context.
###Upload CloudCode:
```shell
lcc upload <path of the file>
```
`<path of the file>` is the CloudCode package (zip file, generated by mvn package command) you are about to deploy, and it will be uploaded to the app targeted in step 3. 
The code uploaded will be produced into Docker image and the version number is assigned in global.json in CloudCode:
```
"global": {
	"version": "0.0.1"
}
```
###Show All Versions of CloudCode
```shell
lcc lv
```
Show all versions of CloudCode uploaded under this app. 
###Deploy CloudCode：
```shell
lcc deploy <version number>
```
`<version number>` is the CloudCode version number you are about to deploy. For example, CloudCode of version 0.0.1 will be deployed if lcc deploy 0.0.1 is required. There would be a eroor message "version of appId doesn't exist" if the version you are about to deploy is not available.
###Undeploy cloudcode：
```shell
lcc undeploy
```
Undeploy the CloudCode of the app: If you need to deploy a new version while there's an old version, please undeploy the old one first. 
###Export Recent Logs:
```shell
lcc log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]

-l Assign the type: info or error 
-n Assign the log amount 
-s Assign the log amount you want to skip ```

## Advanced CloudCode Usage
### Add CloudCode to Existing Project 
####Config pom.xml
We'll config following items in pom: 

* Get CloudCode SDK
* Get plug-in of testing: JUnit
* Get plug-in of building & packaging

```Java
	//Add dependency, get CloudCode SDK and JUnit(the plug-in of testing)
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
	
	//Get plug-in of building & packaging
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

####Config Package Rule

Create new mod.xml file in /src/main/assembly and add following configuration: 

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

Notice: If you decide to put the package into other path, please update the following content in pom.xml and replace `src/main/assembly/mod.xml` with your customized path: 

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
