

# SDK集成

1. 把下面这行代码加入您的测试页面中：

	```javascript
	<script src="https://rawgit.com/MaxLeap/SDK-Javascript/master/dist/ml.js"></script>
	```

2. 进入 [MaxLeap](https://maxleap.cn) 注册并登录，然后在 [云数据](https://maxleap.cn/p/console/clouddata) 创建表，这里创建一个Post 表。
	
	注意：Javascript SDK没有创建 / 删除表的权限，所以要先在 [云数据](https://maxleap.cn/p/console/clouddata) 中创建好需要用到的表。
	   

3. 进入 [应用设置－应用密钥](https://maxleap.cn/p/console/settings#application) 复制 Application ID，Client Key。
 
4. 初始化SDK调用，Javascript SDK 分别为 [中国区](https://maxleap.cn) / [海外区](https://maxleap.com) 用户提供了不同的服务器（默认为美国区服务器）： ML.useCNServer() / ML.useENServer()

	```javascript
	ML.initialize('{{appid}}', '{{restapikey}}');
	ML.useCNServer();
	```

## 开始测试

1. 注册应用内用户并登录：

	```javascript
	var user = new ML.User();
	user.set('username', 'yourname@example.com');
	user.set('password', 'yourpassword');
	user.set('email', 'yourname@example.com');
	
	user.signUp().then(function (user) {
		alert('success');
	});
	```
	注意：
	[云数据](https://maxleap.cn/p/console/clouddata) 中的数据操作需要权限认证，所以请确保您在登录状态。

2.  存储数据：

	```javascript
	var Post = ML.Object.extend('Post');
	post.set('title', 'post title');
	post.save().then(function(){
		alert('success');
	});
	```


至此，您已经完成 Javascript SDK 的安装与必要的配置。	