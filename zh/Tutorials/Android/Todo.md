
[对 MaxLeap 的全面介绍]
[对比传统自己开发后台流程]





本文示范使用 MaxLeap 创建一个简单的应用 TODO 的完整流程。

TODO 的需求：

拥有用户系统
每个用户拥有若干个待办事项列表，每个待办事项列表拥有一个名字，用户可以创建、重命名、删除列表
用户可以在每个列表下面创建若干个待办事项，每个事项有一个名字，还有一个状态表示是否完成，用户可以重命名事项，可以标记事项为已完成／未完成，可以删除某个事项


1. 注册／登录
	
	前往 [MaxLeap 官网](https://maxleap.cn) , 如果还没有 MaxLeap 帐号，点击右上角的注册按钮注册；如果已经有 MaxLeap 帐号，点击登录按钮登录
	
2. 创建后台应用

	进入 `我的应用`，点击右侧的创建应用按钮，会弹出下面的界面：
	
	![](./imgs/maxleap_app_creat.jpg)
	
	可以看到有两个选项卡：模版应用和自定义应用, 选择自定义应用，然后记录 AppId 和 ClientKey.
	
	*选择模版应用会创建项目模版和数据模版，可以点击各模版的 查看详情 按钮查看模版的详细信息。
	选择自定义应用会创建一个空白应用，本文使用这个选项。*
	
3. 创建后台表结构

	云数据库控制台的操作可以查阅[这篇文档](https://maxleap.cn/s/web/zh_cn/guide/usermanual/clouddata.html#数据存储-简介)。

	TODO 应用要求拥有用户系统，每个用户拥有若干个待办事项列表，每个列表中拥有若干个待办项目，每个待办项目要能够标记。
	
	用户系统 MaxLeap 已经内置，可以直接使用。那么我们就只需要两个类（数据表）：Lists 和 Items。Lists 类存放所有用户的代表事项列表，Items 类中存放用户的待办事项。
	
	我们先创建 Items 类，并把类权限设置为 `私有(创建者可读可写，其他不可读不可写)`，类结构如下： 
	
	字段名    | 类型                     | 说明
	---------|-------------------------|-------
	name     | String                  | 事项的标题
	completed| Boolean                 | 是否完成
	
	再创建 Lists 类，权限同样设置为`私有`，结构如下：
	
	字段名 | 类型                    | 说明
	------|------------------------|------
	name  | String                 | 列表名
	items | Relation, 目标类：Items | 列表中的待办事项 
	
	上面的设计看不出 Lists 类与用户有什么联系，那怎么把这个类中的数据与用户关联起来呢？一个简单的实现是借助 MaxLeap 的权限管理系统，把表访问权限改成 `私有`，只有创建者可读可写，其他不可读不可写。这样用户查询的时候只能看到自己创建的数据，不用额外的代码就将数据与用户关联起来了，十分简单。而为了关联 Items，我引入了 MaxLeap 平台定义的 [Relation](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#数据存储-cloud-object-关系数据)，它可以关联多条 Item 数据，并且能够很方便地查询到。
	
	
至此，我们拥有了一个可用的强大的后台，接下来就可以进行客户端的开发了。

MaxLeap 提供了 iOS，Android，javascript， react－native 客户端 SDK。 下面以 Android 开发为例讲解客户端与后台交互, 其他平台 SDK 的接口与 Android 类似。

可以参照[MaxLeap Android 新项目环境准备文档](https://maxleap.cn/s/web/zh_cn/quickstart/android/core/new.html)集成 MaxLeap Android SDK。

现在，我们得到了一个可以与 Maxleap 后台通信的 Android 项目。下面示范如何用户登录注册操作，以及从服务器拉取数据和保存数据到服务器。

用户注册示例代码：

```java
MLUser user = new MLUser();
user.setUserName(mUsernameEditText.getText().toString());
user.setPassword(mPasswordEditText.getText().toString());
MLUserManager.signUpInBackground(user, new SignUpCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            // when error
            return;
        }
        // when success
    }
});
```

MaxLeap 后台会保证 username 和 email 的唯一性，对于 username, password 的格式校验都非常宽松，你可以灵活添加自己的密码合法性校验。

登录也很简单：

```java
MLUserManager.logInInBackground(mUsernameEditText.getText().toString(),
    mPasswordEditText.getText().toString(),
    new LogInCallback() {
        @Override
        public void done(final MLUser mlUser, final MLException e) {
            if (e != null) {
                // when error
                return;
            }
            // when success
        }
    });
```

*想要更深入地了解 MaxLeap 内建的用户系统，[请参阅帐号服务文档](https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#账号服务)*

用户刚刚注册，还没有待办事项列表，他可能想创建一个列表：

*注：用户登陆以后，使用 SDK 进行数据操作时，会自动带上用户的身份标识。*

```java
TodoList todoList = new TodoList();
todoList.setName(name);
MLDataManager.saveInBackground(todoList, new SaveCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            // when error
            return;
        }
        // when success
    }
});
```

用户成功登陆以后，需要显示用户的待办事项列表，而拉取这些数据很简单，示例如下：

```java
MLQuery<TodoList> query = TodoList.getQuery();
query.orderByDescending(MLObject.KEY_UPDATED_AT);
MLQueryManager.findAllInBackground(query, new FindCallback<TodoList>() {
    @Override
    public void done(final List<TodoList> list, final MLException e) {
        if (e != null) {
            // when error
            return;
        }
        // when success
    }
});
```

用户点击一个待办事项列表，想要查看里面有哪些项目：

```java
MLQuery<TodoItem> query = mTodoList.getTodoItems().getQuery();
query.orderByDescending(MLObject.KEY_UPDATED_AT);
MLQueryManager.findAllInBackground(query, new FindCallback<TodoItem>() {
    @Override
    public void done(final List<TodoItem> list, final MLException e) {
        if (e != null) {
            // when error
            return;
        }
        // when success
    }
});
```

用户把某个待办事项标记为已完成，需要更新这个 item:

```java
final TodoItem todoItem = mTodoItems.get(position);
final boolean previous = todoItem.isDone();
todoItem.setDone(!previous);
MLDataManager.saveInBackground(todoItem, new SaveCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            // when error
            return;
        }
        // when success
    }
});
```

*想要更深入了解数据存储，可以参阅[MaxLeap 帮助中心的数据存储文档](https://maxleap.cn/s/web/zh_cn/guide/helpcenter.html)*



