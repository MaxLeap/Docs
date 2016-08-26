# 账号服务

## 准备

### 安装 SDK

1. 请按第二章 【SDK 集成】步骤，配置项目

2. 将 SDK 添加至项目

    将解压后的 `maxleap-sdk-core-<version>.jar` 文件添加到项目的 `libs` 目录中。

## 用户管理

`MLUser` 是 `MLObject` 的子类，它继承了 `MLObject` 所有的方法，具有 `MLObject` 相同的功能。不同的是，`MLUser` 增加了一些特定的关于用户账户相关的功能。

如果当前应用没有用户时，SDK 会尝试在应用打开时会自动尝试创建一个匿名用户。有关匿名用户的概念请看匿名用户章节的介绍。

### 字段说明

MLUser 除了从 MLObject 继承的属性外，还有几个特定的属性：

属性名|类型|介绍|是否必需或唯一
---|---|---|---
    username|String|用户的用户名|必需
    password|String| 用户的密码|必需
    email|String| 用户的电子邮件地址|可选
    emailVerified|Boolean|电子邮件是否验证|可选
    mobilePhoneVerified| String | 手机号码是否验证|可选
    installationIds| String | 用户完成的所有安装的 InstallationId|可选

注意：

* 请确保用户名和电子邮件地址是独一无二的。
* 这些属性和其它 MLObject 的属性不同，在设置时不是使用的 `put()` 方法，而是使用专门的 `setXXX()` 方法。

### 注册用户

1. 创建 `MLUser` 对象，并提供必需的 `username` 和 `password`。
2. 利用 `MLUserManager.signUpInBackground()` 保存至云端。

```java
MLUser user = new MLUser();
user.setUserName("userName");
user.setPassword("passWord");

MLUserManager.signUpInBackground(user, new SignUpCallback() {
	public void done(MLException e) {
        if (e == null) {
        	// 注册成功
        } else {
        	// 注册失败
        }
	}
});
```
注意：

* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 signUpInBackground() 方法，而不是 saveInBackground() 方法。另外还有各种不同的 signUp 方法。像往常一样，我们建议在可能的情况下尽量使用异步版本的 signUp 方法，这样就不会影响到应用程序主 UI 线程的响应。您可以阅读 API 中更多的有关这些具体方法的使用。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 Email 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 Email 地址，以后在用户忘记密码的情况下可以使用 MaxLeap 提供的重置密码功能。

### 登录

您可以通过 `MLUserManager.logInInBackground()` 方法登录。字段说明：第一个参数为用户名，第二个参数为密码，第三个参数为回调方法 `LogInCallback()`.

```java
MLUserManager.logInInBackground("userName", "passWord", new LogInCallback<MLUser>() {
  public void done(MLUser user, MLException e) {
    if (user != null) {
      // 登录成功
    } else {
      // 登录失败
    }
  }
});
```

### 当前用户

如果用户在每次打开您的应用程序时都要登录，这将会直接影响到您应用的用户体验。为了避免这种情况，您可以使用缓存的 `currentUser` 对象。

每当您注册成功或是登录成功后，当前用户都会被保留在本地存储设备商。您可以使用以下方法来获取这个缓存的用户对象以判断当前应用是否曾经注册过：

```java
MLUser currentUser = MLUser.getCurrentUser();
if (currentUser != null) {
  if (MLAnonymousUtils.isLink(currentUser)) {
  	//	匿名用户
  } else {
  	//	普通用户
  }
} else {
  // 未登录
}
```

注意：SDK 会自动创建匿名用户。

当然，您也可以使用如下方法清除缓存的用户：

```java
MLUser.logOut();
MLUser currentUser = MLUser.getCurrentUser(); //此时，crrentUser 将 为null
```

### 重置密码

如果用户忘记密码，MaxLeap提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```java
MLUserManager.requestPasswordResetInBackground(
        "myemail@example.com", new RequestPasswordResetCallback() {
    public void done(MLException e) {
        if (e == null) {
            // 重置密码的邮件已发出
        } else {
        }
    }
});
```
如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

* 用户输入他们的电子邮件，请求重置自己的密码。
* MaxLeap 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个ML的页面，输入一个新的密码。
* MaxLeap 将用户的密码重置为新输入的密码。

### 查询用户

出于安全性考虑，MaxLeap 目前不允许对用户进行查询操作。

### 邮箱验证

MaxLeap 提供强大的邮箱验证服务，您只需在 控制台 -> 应用设置 -> 电子邮件设置 -> 打开 `验证用户的邮箱`。系统便会自动在 MLUser 中添加 `emailVerified` 字段。并且，当 MLUser 的 `email` 字段被赋值或者修改, 且`emailVerified` 字段的值为 `false`。 MaxLeap 便会自动向用户发送一个链接，用户点击链接后便会将 `emailVerified`设置为 `true`。

`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

### 匿名用户

匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 MaxLeap 提供的匿名用户系统来实现您的功能。

您可以通过 MLAnonymousUtils 获取一个匿名的用户账号：

```java
MLAnonymousUtils.loginInBackground(new LogInCallback<MLUser>() {
      @Override
      public void done(MLUser user, MLException e) {
        if (e != null) {
          Log.d("MyApp", "Anonymous login failed.");
    	} else {
      	  Log.d("MyApp", "Anonymous user logged in.");
 	    }
  }
});
```

### 获取短信验证码

通过获取短信验证码可以有效防止恶意注册。

获得验证码

```java
MLUserManager.requestSmsCodeInBackground("手机号码", new RequestSmsCodeCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

验证获得的验证码是否合法

```java
MLUserManager.verifySmsCodeInBackground("手机号码", "验证码", new VerifySmsCodeCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```


### 在控制台中管理用户

_User 表是一个特殊的表，专门存储 MLUser 对象。在控制台 -> 开发中心 -> 云数据中，您会看到一个 _User 表。

## 第三方登录

为简化用户的注册及登录流程，并且集成 MaxLeap 应用与 Facebook, Twitter 等应用。MaxLeap 提供了第三方登录应用的服务，通过该服务可以将 MLUser 与第三方平台的用户联系起来。。为了减少应用的安装包大小，MaxLeap SDK 将尽可能使用 Web OAuth 认证的方式来实现第三方认证，但是您也可以使用第三方应用的 SDK。

### Facebook 登录


为了尽可能减少您的应用的大小，MaxLeap SDK 目前使用 Web 认证的方式登陆 Facebook 账号。Facebook 账号登录后，如果该 Facebook 用户Id并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。

#### 准备工作

1. 在 [Facebook开发者中心](https://developers.facebook.com) 创建 Facebook应用。点击 My Apps -> Add a New App

2. 选择 Settings -> Advanced -> Client OAuth Settings -> Valid OAuth redirect URIs 一栏填入您的回调地址，MaxLeap SDK 默认使用 `https://www.facebook.com/connect/login_success.html` 作为回调地址。

2. 打开 MaxLeap Console -> App Settings -> User Authentication。勾选 Allow Facebook Authentication. 并将步骤一中获取的 Facebook Application ID 和 App Secret 填写至相应位置。

3. 在项目的 `Application.onCreate()` 函数中，于 `MaxLeap.initialize(this, APP_ID, API_KEY)` 之后，添加如下代码：

    ```java
    MLFacebookUtils.initialize("YOUR FACEBOOK APP ID", "YOUR FACEBOOK SECRET");
    ```

#### 修改回调地址

如果您在填写回调地址时没有使用 SDK 提供的默认地址的话，则需要在调用注册之前先修改回调地址。

```java
MLFacebookUtils.setRedirectUrl(redirectUrl);
```

#### 登录并注册新 MLUser

使用 Facebook 账号登录后，如果该 Facebook 用户Id 并未与任何 MLUser 绑定，MaxLeap将自动为该用户创建一个账号，并与其绑定。如：

```java
MLFacebookUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用Facebook账号登录
    } else if (user.isNew()) {
      //用户第一次使用Facebook账号登录，成功注册并绑定user用户
    } else {
      //用户使用Facebook账号登录成功。
    }
  }
});
```

您也可以在注册时指定所需要申请的 Facebook 权限。有关权限的说明可以参考 Facebook 开发人员指南的 [Permission 章节](https://developers.facebook.com/docs/facebook-login/permissions/v2.0#reference)。

```java
List<String> permissions = Arrays.asList(
            FacebookProvider.Permissions.User.ABOUT_ME,
            FacebookProvider.Permissions.User.RELATIONSHIPS,
            FacebookProvider.Permissions.User.BIRTHDAY,
            FacebookProvider.Permissions.User.LOCATION);
MLFacebookUtils.logInInBackground(permissions, this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用Facebook账号登录
    } else if (user.isNew()) {
      //用户第一次使用Facebook账号登录，成功注册并绑定user用户
    } else {
      //用户使用Facebook账号登录成功。
    }
  }
});
```

#### 绑定 MLUser 与 Facebook 账号

您可以通过以下方式，绑定已有的 MLUser 和 Facebook 账号：

```java
if (!MLFacebookUtils.isLinked(user)) {
    MLFacebookUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLFacebookUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，MaxLeap 将会把该 Facebook 账号的信息更新至该 MLUser中。下次再使用该Facebook 账号登录应用时，MaxLeap 将检测到其已绑定 MLUser，便不会为该 Facebook 账号添加新的 MLUser.

#### 解除绑定

```java
MLFacebookUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Facebook account.");
    }
  }
});
```
解除绑定成功后，MaxLeap 将会把该 Facebook 账号的信息从该 MLUser 中移除。下次再使用该 Facebook 账号登录应用时，MaxLeap 将检测到其未绑定 MLUser，便会为该Facebook 账号添加新的 MLUser.


### Twitter 登录


为了尽可能减少您的应用的大小，MaxLeap SDK 目前使用 Web 认证的方式登陆 Twitter 账号。使用 Twitter 账号登录后，如果该 Twitter 用户Id 并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。

#### 准备工作

1. 在 [Twitter开发者中心](https://apps.twitter.com/) 创建 Twitter 应用，其中 `Callback URL` 一项请填写有效地址，MaxLeap SDK 默认使用 `http://localhost` 作为回调地址。
2. 打开 MaxLeap Console -> App Settings -> User Authentication.勾选 Allow Twitter Authentication，并将步骤一中获取的 Twitter consumer Key 填写至相应位置。
3. 在项目的 `Application.onCreate()` 函数中，于 `MaxLeap.initialize(this, APP_ID, API_KEY)` 之后，添加如下代码：

```java
MLTwitterUtils.initialize("YOUR Twitter CONSUMER KEY", "YOUR Twitter CONSUMER SECRET");
```

#### 修改回调地址

如果您在填写回调地址时没有使用 SDK 提供的默认地址的话，则需要在调用注册之前先修改回调地址。

```java
MLTwitterUtils.setRedirectUrl(redirectUrl);
```

#### 登录并注册新 MLUser

使用 Twitter 账号登录后，如果该 Twitter 用户Id 并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。如：

```java
MLTwitterUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用Twitter账号登录
    } else if (user.isNew()) {
      //用户第一次使用Twitter账号登录，成功注册并绑定user用户
    } else {
      //用户使用Twitter账号登录成功。
    }
  }
});
```

#### 绑定 MLUser 与 Twitter 账号

您可以通过以下方式，绑定已有的 MLUser 账号和 Twitter 账号：

```java
if (!MLTwitterUtils.isLinked(user)) {
    MLTwitterUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLTwitterUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，MaxLeap 将会把该 Twitter 账号的信息更新至该 MLUser 中。下次再使用该Twitter 账号登录应用时，MaxLeap 将检测到其已绑定 MLUser，便不会为该 Twitter账号添加新的 MLUser.

#### 解除绑定

```java
MLTwitterUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Twitter account.");
    }
  }
});
```
解除绑定成功后，MaxLeap 将会把该 Twitter 账号的信息从该 MLUser 中移除。下次再使用该 Twitter 账号登录应用时，MaxLeap 将检测到其未绑定 MLUser，便会为该 Twitter 账号添加新的 MLUser。


### 微信登录


由于微信开发平台只支持 SSO 登录,所以在使用 MaxLeap SDK 登录微信时必须先导入微信的 SDK 才能正常使用.
微信账号登录后，如果该 微信 用户Id并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。

#### 准备工作

1. 在 [微信开放平台](https://open.weixin.qq.com) 创建微信应用.注意按照微信官方的指导务必填写正确的应用签名并且通过微信的开发者认证.

2. 打开 MaxLeap Console -> 应用设置 -> 用户验证。勾选 "允许使用微信登录"。

3. 在项目的 `Application.onCreate()` 函数中，于 `MaxLeap.initialize(this, APP_ID, API_KEY)` 之后，添加如下代码：

    ```java
    MLWechatUtils.initialize("YOUR WEIBO APP ID", "YOUR WEIBO SECRET");
    ```

#### 登录并注册新 MLUser

使用 微信 账号登录后，如果该 微信 用户Id 并未与任何 MLUser 绑定，MaxLeap将自动为该用户创建一个账号，并与其绑定。如：

```java
MLWechatUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用微信账号登录
    } else if (user.isNew()) {
      //用户第一次使用微信账号登录，成功注册并绑定user用户
    } else {
      //用户使用微信账号登录成功。
    }
  }
});
```

#### 绑定 MLUser 与微信 账号

您可以通过以下方式，绑定已有的 MLUser 和 微信 账号：

```java
if (!MLWechatUtils.isLinked(user)) {
    MLWechatUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLWechatUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，MaxLeap 将会把该 微信 账号的信息更新至该 MLUser中。下次再使用该微信 账号登录应用时，MaxLeap 将检测到其已绑定 MLUser，便不会为该 微博 账号添加新的 MLUser.

#### 解除绑定

```java
MLWechatUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Wechat account.");
    }
  }
});
```
解除绑定成功后，MaxLeap 将会把该 微信 账号的信息从该 MLUser 中移除。下次再使用该 微信 账号登录应用时，MaxLeap 将检测到其未绑定 MLUser，便会为该微信账号添加新的 MLUser.



### QQ 登录


使用 MaxLeap SDK 登录QQ时必须先导入QQ的 SDK 才能正常使用.
QQ账号登录后，如果该 QQ 用户Id并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。

#### 准备工作

1. 在 [腾讯开放平台](http://open.qq.com/) 创建移动应用。

2. 打开 MaxLeap Console -> 应用设置 -> 用户验证。勾选 "允许使用QQ登录"。

3. 在项目的 `Application.onCreate()` 函数中，于 `MaxLeap.initialize(this, APP_ID, API_KEY)` 之后，添加如下代码：

    ```java
    MLQQUtils.initialize("YOUR QQ APP ID");
    ```

#### 登录并注册新 MLUser

使用 QQ 账号登录后，如果该 QQ 用户Id 并未与任何 MLUser 绑定，MaxLeap将自动为该用户创建一个账号，并与其绑定。如：

```java
MLQQUtils.logInInBackground(this, new LogInCallback() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用QQ账号登录
    } else if (user.isNew()) {
      //用户第一次使用QQ账号登录，成功注册并绑定user用户
    } else {
      //用户使用QQ账号登录成功
    }
  }
});
```

#### 绑定 MLUser 与QQ 账号

您可以通过以下方式，绑定已有的 MLUser 和 QQ 账号：

```java
if (!MLQQUtils.isLinked(user)) {
    MLQQUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLQQUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，MaxLeap 将会把该 QQ 账号的信息更新至该 MLUser中。下次再使用该QQ 账号登录应用时，MaxLeap 将检测到其已绑定 MLUser，便不会为该 QQ 账号添加新的 MLUser.

#### 解除绑定

```java
MLQQUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their QQ account.");
    }
  }
});
```
解除绑定成功后，MaxLeap 将会把该 QQ 账号的信息从该 MLUser 中移除。下次再使用该 QQ 账号登录应用时，MaxLeap 将检测到其未绑定 MLUser，便会为该微博 账号添加新的 MLUser.




### 新浪微博登录


为了尽可能减少您的应用的大小，MaxLeap SDK 目前 默认使用 Web 认证的方式登陆微博账号,但是如果你在工程中引入了微博 SDK后.MaxLeap SDK 会自动调用微博的接口来完成认证.
微博账号登录后，如果该 微博 用户Id并未与任何 MLUser 绑定，MaxLeap 将自动为该用户创建一个账号，并与其绑定。

#### 准备工作

1. 在 [微博开放平台](http://open.weibo.com/) 创建微博应用。

2. 选择你的应用,点击 应用信息 -> 高级信息,填写授权回调页. MaxLeap SDK 默认使用 `https://api.weibo.com/oauth2/default.html` 作为回调地址。

3. 打开 MaxLeap Console -> 应用设置 -> 用户验证。勾选 "允许使用新浪微博登录"。

4. 在项目的 `Application.onCreate()` 函数中，于 `MaxLeap.initialize(this, APP_ID, API_KEY)` 之后，添加如下代码：

    ```java
    MLWeiboUtils.initialize("YOUR WEIBO APP ID", "YOUR WEIBO SECRET");
    ```

#### 修改回调地址

如果您在填写回调地址时没有使用 SDK 提供的默认地址的话，则需要在调用注册之前先修改回调地址。

```java
MLWeiboUtils.setRedirectUrl(redirectUrl);
```

#### 登录并注册新 MLUser

使用 微博 账号登录后，如果该 微博 用户Id 并未与任何 MLUser 绑定，MaxLeap将自动为该用户创建一个账号，并与其绑定。如：

```java
MLWeiboUtils.logInInBackground(this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用微博账号登录
    } else if (user.isNew()) {
      //用户第一次使用微博账号登录，成功注册并绑定user用户
    } else {
      //用户使用微博账号登录成功。
    }
  }
});
```

您也可以在注册时指定所需要申请的 scope 权限。有关权限的说明可以参考 [scope 说明](http://open.weibo.com/wiki/Scope)。

```java
List<String> scopes = Arrays.asList(
            WeiboProvider.Scope.EMAIL, 
            WeiboProvider.Scope.DIRECT_MESSAGES_READ);
MLWeiboUtils.logInInBackground(scopes, this, new LogInCallback<MLUser>() {
  @Override
  public void done(MLUser user, MLException err) {
    if (user == null) {
      //用户取消了使用微博账号登录
    } else if (user.isNew()) {
      //用户第一次使用微博账号登录，成功注册并绑定user用户
    } else {
      //用户使用微博账号登录成功。
    }
  }
});
```

#### 绑定 MLUser 与微博 账号

您可以通过以下方式，绑定已有的 MLUser 和 微博 账号：

```java
if (!MLWeiboUtils.isLinked(user)) {
    MLWeiboUtils.linkInBackground(user, this, new SaveCallback() {
        @Override
        public void done(MLException ex) {
          if (MLWeiboUtils.isLinked(user)) {
            //绑定成功
      }
    }
  });
}
```

绑定成功后，MaxLeap 将会把该 微博 账号的信息更新至该 MLUser中。下次再使用该微博 账号登录应用时，MaxLeap 将检测到其已绑定 MLUser，便不会为该 微博 账号添加新的 MLUser.

#### 解除绑定

```java
MLWeiboUtils.unlinkInBackground(user, new SaveCallback() {
  @Override
  public void done(MLException ex) {
    if (ex == null) {
      Log.d("MyApp", "The user is no longer associated with their Weibo account.");
    }
  }
});
```
解除绑定成功后，MaxLeap 将会把该 微博  账号的信息从该 MLUser 中移除。下次再使用该 微博 账号登录应用时，MaxLeap 将检测到其未绑定 MLUser，便会为该微博 账号添加新的 MLUser.



## 短信登录

### 手机号码登录

MaxLeap 支持直接使用手机号码进行登录，登录成功后手机号码将作为用户的用户名。

获得登录短信验证码

```java
MLUserManager.requestLoginSmsCodeInBackground("手机号码", new RequestSmsCodeCallback() {
    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

使用登录短信验证码和手机号进行登录

```java
MLUserManager.loginWithSmsCodeInBackground("手机号码", "验证码", new LogInCallback<MLUser>() {
    @Override
    public void done(final MLUser user, final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

### 手机号码验证

在使用用户名和密码登录后手机号码默认是没有验证过的，您可以使用以下方法对手机号码进行验证。

发送验证码

```java
MLUserManager.requestPhoneVerifyInBackground("手机号码", new RequestPhoneVerifyCallback() {

    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

进行验证

```java
MLUserManager.verifyPhoneInBackground("手机号码", "验证码", new VerifyPhoneCallback() {

    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

验证通过后控制台的用户记录的 `mobilePhoneVerified` 属性会变为 `true`。

### 使用短信验证码重置密码

如果用户使用手机号码注册或者验证过手机号码，你也可以通过手机短信来重置密码。

申请获得重置密码的短信验证码

```java
MLUserManager.requestPasswordResetByPhoneNumberInBackground("手机号码", new RequestPasswordResetCallback() {

    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```

重置密码

```java
MLUserManager.requestResetPasswordInBackground("手机号码", "验证码", "新密码",
        new ResetPasswordCallback() {

    @Override
    public void done(final MLException e) {
        if (e != null) {
            //  发生错误
        } else {
            //  成功请求
        }
    }
});
```


## FAQ
