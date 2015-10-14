
### 兼容性

目前 MaxLeap Python SDK 基于 Python 2.x 开发，在 Python 3.x 环境下使用仍然有一些兼容性问题。我们会尽快改善这一问题的。

### 安装 MaxLeap命令行工具（MaxLeap-CLI）
#### 下载MaxLeap-CLI
下载地址：[https://github.com/LeapCloud/MaxLeap-CLI/releases](https://github.com/LeapCloud/MaxLeap-CLI/releases)

根据平台选择对应的客户端：

1.  Windows：[maxleap.exe](https://github.com/LeapCloud/MaxLeap-CLI/releases/download/v0.1/maxleap.exe)
2.  Linux/Mac OSX：[maxleapformac.tar](https://github.com/LeapCloud/MaxLeap-CLI/releases/download/v0.1/maxleapformac.tar)

下载完成后，您可直接在终端中使用 MaxLeap-CLI。进入下载目录(macos版本需要解压后使用)，查看MaxLeap-CLI版本

```shell
./maxleap -v
```

显示`zcc version 0.1`表示MaxLeap客户端安装成功

*	maxleap命令添加到环境变量

每次执行maxleap命令都需要进入下载安装目录才能执行命令，你可以将maxleap添加到环境变量，这样你可以随时随地使用maxleap了

1.  LINUX和MAC：

    ```
    vim ~/.bash_profile
    ```

    编辑profile文件，将MaxLeap安装目录追加到PATH中，比如你的MaxLeap安装目录为`/usr/local/maxleap-cli`

    `export PATH=/usr/local/maxleap-cli:$PATH`

    最后让profile生效：`source ~/.bash_profile`

2.  WINDOWS：

    //TODO:

##	安装SDK

你可以使用 `pip` 或者 `easy_install` 安装 Python SDK

```sh
pip install maxleap-sdk
```

or

```sh
easy_install maxleap-sdk
```

根据你的环境，命令之前可能还需要加上 `sudo` 。

**注意**：如果您的 Python 版本低于 2.7.9，您可能会遇到如下的 Warning：ML

```
/usr/lib/python2.7/site-packages/requests-2.6.0-py2.7.egg/requests/packages/urllib3/util/ssl_.py:79: InsecurePlatformWarning: A true SSLContext object is not available. This prevents urllib3 from configuring SSL appropriately and may cause certain SSL connections to fail. For more information, see https://urllib3.readthedocs.org/en/latest/security.html#insecureplatformwarning.
InsecurePlatformWarning
```

建议您升级您的 Python 版本，或者通过安装 PyOpenSSL 来解决：

```sh
pip install pyopenssl ndg-httpsclient pyasn1
```

### 使用模板创建 MaxLeap 云代码项目

获取 MaxLeap 云代码 Python项目模板

```shell
git clone https://github.com/MaxLeap/Demo-CloudCode-Python.git
```

### 一个python cloudcode项目的目录树应该如下：

    ├── app                     #cloudcode主目录 (必备)
    │   ├── requirements.txt    #cloudcode所依赖的pip库（可选）
    │   ├── function            #function目录（可选）
    │   │   └── demo.py
    │   ├── hook                #hook目录（可选）
    │   ├── job                 #job目录（可选）
    |   └── tests               #tests目录（可选）
    ├── config                  #cloudcode配置文件目录（必备）
    │   └── global.json         #cloudcode配置文件（必备）
    └── lib                     #cloudcode所依赖的lib（可选）

### 目录加载顺序

1. 拷贝lib依赖
2. pip安装requirements.txt
3. 加载程序文件，顺序为：config -> hook -> job -> function

### 修改配置
在/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```python
{
	"applicationName" : "HelloWorld",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "python",
	"version": "0.0.1"
}
```

根据创建应用时获取的key，修改下列键的值：

键|值|
------------|-------|
applicationName|MaxLeap应用名称
applicationId|Application ID
applicationKey|Master Key
version|当前云代码项目版本号

### 定义一个简单的function
在`/function`目录下新建文件demo.py中
```python
from ML import Server
from ML import Response
@Server.Function
def helloword(request):
    return Response("hello world")

```

### 打包

在当前项目根目录下运行zip命令：

`zip -r <ProjectLocation> ./*`

我们将在项目根目录下的target文件夹中发现 *xxx-1.0-SNAPSHOT-mod.zip* 文件，这便是我们想要的package.

## 云代码的上传及部署
1. 登录：`maxleap login <UserName> -region <CN or US ...>`
2. 选择所要部署的目标应用，作为后续操作的上下文：`maxleap use <AppName>` ,如果你不记得你的AppName，可以通过`maxleap apps`来枚举你的所有应用列表
3. 上传Package： `maxleap upload <ProjectLocation>`
4. 部署云代码：`maxleap deploy <VersionNumber>`

**注意：**

*	这里的VersionNumber定义在您云代码项目中的global.json文件中（version字段的值）
* 	若您在部署之前，已经部署过某个版本的云代码，需要先卸载该版本的云代码，才能部署新版本。
*	使用`maxleap help`来获取所有相关命令帮助，你也可以查看[lcc使用向导](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)，以获取lcc的更多信息。

### 测试

通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
https://api.leap.as/functions/helloword
```
此时，我们将得到如下结果：

```shell
hello world
```
表明测试通过，部署成功。

注意:

* X-ML-APIKey的值为应用的API KEY，而非云代码项目中使用的Master Key.

## 下一步
 至此，您已经完成 MaxLeap SDK 的安装与必要的配置。请移步至[云代码 SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA)以获取 MaxLeap 云代码 SDK 的详细功能介绍以及使用方法。
