#SDK 集成

目前 MaxLeap Nodejs CloudCode 的 Nodejs 版本为 5.3.0，请你最好使用此版本进行开发。至少不要低于 0.12。

## 全新项目

### 安装SDK

你可以使用 `npm` 安装 Nodejs SDK

```sh
npm install mlcloudcode
```

### 使用模板创建 MaxLeap 云代码项目

获取 MaxLeap 云代码 Nodejs项目模板

[下载模板项目](https://github.com/MaxLeap/Demo-CloudCode-Nodejs/archive/master.zip)

### 一个Nodejs cloudcode项目的目录树应该如下：

```
├── app                     #cloudcode主目录 (必备)
│   ├── package.json        #cloudcode的环境依赖（可选）
│   ├── function            #function目录（可选）
│   │   └── demo.py
│   ├── hook                #hook目录（可选）
│   ├── job                 #job目录（可选）
|   └── tests               #tests目录（可选）
├── config                  #cloudcode配置文件目录（必备）
│   └── global.json         #cloudcode配置文件（必备）
└── node_modules            #cloudcode的环境依赖（可选）
```

### 目录加载顺序

1. npm安装package.json
2. 拷贝node_modules依赖
3. 加载程序文件，顺序为：config -> hook -> job -> function

### 修改配置
在/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```python
{
	"applicationName" : "HelloWorld",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "nodejs",
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

```nodejs
ML.Cloud.function('helloworld',function(req, res){
	res.end("helloworld")
});
```

### 打包

在当前项目根目录下运行zip命令：

`zip -r <ProjectLocation> ./*`

`ProjectLocation`便是我们想要的package.


### 云代码的上传及部署


### 测试

通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
 https://api.maxleap.cn/2.0/functions/helloword
```
此时，我们将得到如下结果：

```shell
hello world
```
表明测试通过，部署成功。

注意:

* X-ML-APIKey的值为应用的API KEY，而非云代码项目中使用的Master Key.


 至此，您已经完成 MaxLeap SDK 的安装与必要的配置。

## 已有项目
### 安装SDK

你可以使用 `npm` 安装 Nodejs SDK

```sh
npm install mlcloudcode
```

### 一个Nodejs cloudcode项目的目录树应该如下：

```
├── app                     #cloudcode主目录 (必备)
│   ├── package.json        #cloudcode的环境依赖（可选）
│   ├── function            #function目录（可选）
│   │   └── demo.py
│   ├── hook                #hook目录（可选）
│   ├── job                 #job目录（可选）
|   └── tests               #tests目录（可选）
├── config                  #cloudcode配置文件目录（必备）
│   └── global.json         #cloudcode配置文件（必备）
└── node_modules            #cloudcode的环境依赖（可选）
```

### 目录加载顺序

1. npm安装package.json
2. 拷贝node_modules依赖
3. 加载程序文件，顺序为：config -> hook -> job -> function


### 集成已有项目
1. 你可以把以后的项目按照module的形式copy到node_modules目录。这样你可以在你的function、job、hook中访问它。
2. 你也可以在`/app`目录下面添加你已有的项目。然后在function、job、hook中访问它。

### 修改配置
在/config（请确保此路径存在）中，添加global.json文件，并在其中添加如下配置：

```python
{
	"applicationName" : "HelloWorld",
	"applicationId": "YOUR_APPLICATION_ID",
	"applicationKey": "YOUR_MASTER_KEY",
	"lang" : "nodejs",
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

```nodejs
ML.Cloud.function('helloworld',function(req, res){
	res.end("helloworld")
});
```

### 打包

在当前项目根目录下运行zip命令：

`zip -r <ProjectLocation> ./*`

`ProjectLocation`便是我们想要的package.


### 云代码的上传及部署




### 测试

通过 curl，我们向部署好的Cloud Function发送如下POST请求，以测试我们的Function是否部署成功：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
 https://api.maxleap.cn/2.0/functions/helloword
```
此时，我们将得到如下结果：

```shell
hello world
```
表明测试通过，部署成功。

注意:

* X-ML-APIKey的值为应用的API KEY，而非云代码项目中使用的Master Key.

 至此，您已经完成 MaxLeap SDK 的安装与必要的配置。