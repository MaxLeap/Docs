# SDK 集成

## 新项目集成

### 环境依赖
- JDK安装:云代码 SDK支持 JDK6, 7, 8，推荐使用JDK8。
- IDE Maven插件安装

  Eclipse:
  
  1.	点击"Help" >> "Install New Software.."
  2.	在"Work with"中输入：`http://download.eclipse.org/technology/m2e/releases`，在列表中选择"Maven Integration for Eclipse"，即可安装Maven插件。


###	SDK安装

1. 使用模板创建 MaxLeap 云代码项目

获取 MaxLeap 云代码 Java项目模板(注意：你的云代码项目请确保放置在英文目录下，否则本地单元测试可能会引起文件解析错误)

```shell
git clone https://github.com/MaxLeap/Demo-CloudCode-Java.git
```

2. 修改配置

打开模板项目,在/src/main/resources/config（请确保此路径存在）中，修改global.json文件配置：

```java
{
	"applicationName" : "YOUR_APPLICATION_NAME",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "java",
	"javaMain": "YOUR_JAVA_MAIN_CLASS_NAME",
	"packageHook" : "YOUR_HOOK_PACKAGE_NAME",
	"packageClasses" : "YOUR_ENTITY_PACKAGE_NAME",
	"version": "YOUR_VERSION"
}
```

根据创建应用时获取的key，修改下列键的值：
	
键|值|
------------|-------|
applicationName|MaxLeap应用名称
applicationId|Application ID
applicationKey|Master Key
javaMain|入口main函数类名
packageHook|Hook包名
packageClasses|Class实体包名
version|当前云代码项目版本号

### 定义一个简单的function

```Java
import com.maxleap.code.*;
import com.maxleap.code.impl.GlobalConfig;
import com.maxleap.code.impl.MLResponse;
import com.maxleap.code.impl.LoaderBase;

public class Main extends LoaderBase implements Loader {
    @Override
    public void main(GlobalConfig globalConfig) {

    	//定义Cloud Function
        defineFunction("hello", request -> {
            Response<String> response = new Response<String>(String.class);
            response.setResult("Hello, " + request.parameter(Map.class).get("name") + "!");
            return response;
        });
    }
}
```

注意：

* Main class的main method是云代码项目启动的入口（在global.json中指定），需要继承LoaderBase并实现Loader接口，在main方法中需要注册所有的cloud function和job。

### 本地测试

定义完成您的函数任务后应最先在本地测试,以防程序出现异常导致发布云代码失败,你可以编写一个测试类如MainTest(该类需要继承`com.maxleap.code.test.framework.TestCloudCode`类),测试方法如Junit测试

```Java
	@Test
	public void hello(){
		String json = "{\"name\":\"jack\",\"ids\":[\"aa\",\"bb\"]}";
		Response response = runFunction("hello", json);
		if (response.succeeded()){
			System.out.println(response.getResult());
		} else {
			Assert.fail(response.getError());
		}
	}
```

注意:在发布云代码前请确保您的每个function和job的单元测试都通过

### 打包

在当前项目根目录下运行Maven命令：

`mvn package`

我们将在项目根目录下的target文件夹中发现 *xxx-1.0-SNAPSHOT-mod.zip* 文件，这便是我们想要的package。

### 云代码的上传及部署
登录MaxLeap后台，进入您的应用，选择[开发中心->云代码->版本->上传云代码]，在弹出的文件选择框中选中生成的zip文件，点击上传。

上传完成后在版本列表中选中当前版本执行操作[部署]，选择相应的部署策略后点击确定执行部署。


### 测试

通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.maxleap.cn/2.0/functions/hello
```

此时，我们将得到如下结果：

```shell
Hello, David Wang!
```

表明测试通过，部署成功。

注意:

* X-ML-APIKey的值为应用的API KEY，而非云代码项目中使用的Master Key.

### 下一步
 至此，您已经完成 MaxLeap SDK 的安装与必要的配置。请移步至[云代码 SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)以获取 MaxLeap 云代码 SDK 的详细功能介绍以及使用方法。

## 已有项目集成

### 添加云代码至已有的项目

注意：你的云代码项目请确保放置在英文目录下，否则本地测试可能会引起文件解析错误

####配置maven项目的pom.xml

* 获取云代码 SDK
* 获取测试插件JUnit
* 获取编译打包插件

添加依赖，获取云代码 SDK(sdk.version最新版本为2.4.8，你可以通过[这里](https://github.com/MaxLeap/SDK-CloudCode-Java/releases)查看最新版本)及JUnit测试插件

```xml
    <dependencies>
        <dependency>
            <groupId>com.maxleap</groupId>
            <artifactId>cloud-code-base</artifactId>
            <version>${sdk.version}</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>com.maxleap</groupId>
            <artifactId>cloud-code-sdk</artifactId>
            <version>${sdk.version}</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>com.maxleap</groupId>
            <artifactId>cloud-code-test</artifactId>
            <version>${sdk.version}</version>
            <scope>test</scope>
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

```xml
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
                    <exclude>log4j-*.jar</exclude>
                    <exclude>slf4j-*.jar</exclude>
                    <exclude>cloud-code-*.jar</exclude>
                    <exclude>sdk-data-api*.jar</exclude>
                    <exclude>junit-*.jar</exclude>
                </excludes>
	        </fileSet>
	    </fileSets>
	</assembly>
```

请注意：如果您选择将打包配置文件放在其他路径下，您则需要更新pom.xml文件中的以下部分，将`src/main/assembly/mod.xml`替换为您自定义的路径：

```xml
	<plugin>
		<artifactId>maven-assembly-plugin</artifactId>
		<configuration>
			<descriptors>
				<descriptor>src/main/assembly/mod.xml</descriptor>
			</descriptors>
		</configuration>
	</plugin>	
```

当然你也可以自己打包zip，只需按照我们的目录结构来打包你的应用即可
![imgCloudCodeStructure](../../../images/imgCloudcodeZipStructure.png)

需要注意的是:您的云代码打包后不应包括cloud-code-*.jar以及jackson-*.jar,这些在我们云端服务器已经默认为您添加了这些依赖,并且本地依赖的cloud-code-*.jar并不适合在云端运行(你可以把他们看成同一套接口不同的实现).

#### 配置 global.json
在/src/main/resources/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```java
{
	"applicationName" : "YOUR_APPLICATION_NAME",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "java",
	"javaMain": "YOUR_JAVA_MAIN_CLASS_NAME",
	"packageHook" : "YOUR_HOOK_PACKAGE_NAME",
	"packageClasses" : "YOUR_ENTITY_PACKAGE_NAME",
	"version": "YOUR_VERSION"
}
```

根据创建应用时获取的key，修改下列键的值：

键|值|
------------|-------|
applicationName|MaxLeap应用名称
applicationId|Application ID
applicationKey|Master Key
javaMain|入口main函数类名
packageHook|Hook包名
packageClasses|Class实体包名
version|当前云代码项目版本号

### 定义一个简单的function

```Java
import com.maxleap.code.MLLoader;
import com.maxleap.code.Response;
import com.maxleap.code.impl.GlobalConfig;
import com.maxleap.code.impl.LoaderBase;
import com.maxleap.code.impl.Response;

public class Main extends LoaderBase implements Loader {
    @Override
    public void main(GlobalConfig globalConfig) {

    	//定义Cloud Function
        defineFunction("hello", request -> {
            Response<String> response = new Response<String>(String.class);
            response.setResult("Hello, " + request.parameter(Map.class).get("name") + "!");
            return response;
        });
    }
}
```

注意：

* Main class的main method是云代码项目启动的入口（在global.json中指定），需要继承LoaderBase并实现Loader接口，在main方法中需要注册所有的cloud function和job。

### 打包

在当前项目根目录下运行Maven命令：

`mvn package`

我们将在项目根目录下的target文件夹中发现 *xxx-1.0-SNAPSHOT-mod.zip* 文件，这便是我们想要的package.

### 云代码的上传及部署
登录MaxLeap后台，进入您的应用，选择[开发中心->云代码->版本->上传云代码]，在弹出的文件选择框中选中生成的zip文件，点击上传。

上传完成后在版本列表中选中当前版本执行操作[部署]，选择相应的部署策略后点击确定执行部署。


### 测试

通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.maxleap.cn/2.0/functions/hello
```

此时，我们将得到如下结果：

```shell
Hello, David Wang!
```

表明测试通过，部署成功。

注意:

* X-ML-APIKey的值为应用的API KEY，而非云代码项目中使用的Master Key.

### 下一步
 至此，您已经完成 MaxLeap SDK 的安装与必要的配置。请移步至[云代码 SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)以获取 MaxLeap 云代码 SDK 的详细功能介绍以及使用方法。

