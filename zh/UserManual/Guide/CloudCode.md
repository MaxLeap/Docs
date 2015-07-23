# Cloud Code

在"开发者中心"模块中，我们可以管理所有的Cloud Code中定义的Job.

##云代码版本
在左侧"Config"分类中，我们可以查看该应用下所有的云参数的列表。该列表包含以下列：

* 版本号：每份上传的云代码，都有一个唯一的版本号标识，定义在云代码项目中的global.json中
* 状态：对应版本号的云代码是否被部署并处于正常运行状态
* 配置：查看云代码的配置文件global.json. 包括 应用名，应用App ID/MasterKey，Cloud Code编写语言，入口函数名，hook包名，entity包名及版本号等信息。
* 


###新建Job
如果在Cloud Code中新建了Job，您便可以在开发者中心中运行它。点击"＋新建Job"按钮，提供下列数据，便可以完成Job的新建：


列名|描述
-------|-------
Name|Job名
Function Name|Cloud Code中定义的Job名
Schedule Send|设置Job的运行时间
Schedule Repeat|设置Job的重复运行模式
Parameter|传递至Cloud Code的参数

Pic

###修改/删除云参数
在Detail列中选择修改按钮，即可进入修改页面。

在Detail列中选择修改按钮，点击确认，即可删除该云参数。