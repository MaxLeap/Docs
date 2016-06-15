# 账号服务

## 用户
`ML.User` 是一个 `ML.Object` 的子类，它继承了 `ML.Object` 所有的方法，具有 `ML.Object` 相同的功能。不同的是，`ML.User` 增加了一些特定的关于用户账户相关的功能。

### 字段说明
`ML.User` 除了从 `ML.Object` 继承的属性外，还有几个特定的属性：

属性名|类型|介绍|是否必需或唯一
---|---|---|---
username|String|用户的用户名|必需
password|String| 用户的密码|必需
email|String| 用户的电子邮件地址|可选
emailVerified|Boolean|电子邮件是否验证|可选
masterKey| String | 用户注册应用的MasterKey|可选
installationIds| String | 用户完成的所有安装的InstallationId|可选

注意：

* 请确保用户名和电子邮件地址是独一无二的。
* 系统会自动收集 `masterKey`，`installationIds` 的值。

## 注册用户
1. 创建 `ML.User` 对象，并提供必需的 username 和 password
2. 调用 `user.signUp()` 方法保存至云端。

```javascript
var r = new Date().getTime();
var user = new ML.User();
user.set('username', 'my name' + r);
user.set('password', 'my pass');
user.signUp()
```
注意：

* 在注册过程中，服务器会进行注册用户信息的检查，以确保注册的用户名和电子邮件地址是独一无二的。此外，服务端还会对用户密码进行不可逆的加密处理，不会明文保存任何密码，应用切勿再次在客户端加密密码，这会导致重置密码等功能不可用。
* 注册使用的是 `signUp()` 方法，而不是 `save()` 方法。
* 如果注册不成功，您可以查看返回的错误对象。最有可能的情况是，用户名或电子邮件已经被另一个用户注册。这种情况您可以提示用户，要求他们尝试使用不同的用户名进行注册。
* 您也可以要求用户使用 `Email` 做为用户名注册，这样做的好处是，您在提交信息的时候可以将输入的“用户名“默认设置为用户的 `Email` 地址，以后在用户忘记密码的情况下可以使用 `MaxLeap` 提供的重置密码功能。

## 登录
您可以通过 `ML.User.logIn()` 方法登录：

```javascript
ML.User.logIn('yourname', 'yourpass');
```
## 邮箱验证

MaxLeap 提供强大的邮箱验证服务，您只需在 Console >> 应用设置 >> 电子邮件设置 中 开启 “验证用户的邮箱”, 系统便会自动在 `ML.User` 中添加 `emailVerified` 字段。并且，当 `ML.User` 的 email 字段被赋值或者修改, 且 `emailVerified` 字 字段的值为 false. MaxLeap 便会自动向用户发送一个链接，用户点击链接后便会将 `emailVerified` 设置为true.

`emailVerified`字段有三种状态:

* true - 用户通过点击系统发送的链接验证邮箱成功
* false - 用户还未验证邮箱，或者验证失败
* 空 - 邮箱验证功能未开，或者用户未提供邮箱

## 当前用户
如果用户在每次打开您的应用程序时都要登录，这将会直接影响到您应用的用户体验。为了避免这种情况，您可以使用缓存的 `currentUser` 对象。

每当您注册成功或是第一次登录成功，都会在本地磁盘中有一个缓存的用户对象，您可以这样来获取这个缓存的用户对象来进行登录：

```javascript
ML.User.currentAsync().then(currentUser => {
	// ...
});
```

当然，您也可以使用如下方法清除缓存用户对象：

```javascript
ML.User.logOut();
```

## 重置密码
如果用户忘记密码，MaxLeap提供了一种方法，让用户安全地重置起密码。 重置密码的流程很简单，开发者只要求用户输入注册的电子邮件地址即可：

```javascript
ML.User.requestPasswordReset('youremail@xx.xx');
```

如果邮箱与用户注册时提供的邮箱匹配，系统将发出密码重置邮件。密码重置流程如下：

* 用户输入他们的电子邮件，请求重置自己的密码。
* MaxLeap 向用户提供的邮箱发送一封电子邮件，该邮件提供密码重置链接。
* 用户根据向导点击重置密码链接，打开一个ML的页面，输入一个新的密码。
* MaxLeap 将用户的密码重置为新输入的密码。

## 匿名用户
匿名用户是指提供用户名和密码，系统为您创建的一类特殊用户，它享有其他用户具备的相同功能。不过，一旦注销，匿名用户的所有数据都将无法访问。如果您的应用需要使用一个相对弱化的用户系统时，您可以考虑 MaxLeap 提供的匿名用户系统来实现您的功能。

您可以通过 `anonymousSignUp()` 注册一个匿名的用户账号：

```javascript
var user = new ML.User();
user.anonymousSignUp();
```

## ** 注意：SDK 会自动创建匿名用户**

因为一些特殊原因，SDK 中有一个逻辑：它会在没有用户登录的情况下自动创建一个匿名用户，有关匿名用户，请查看匿名用户介绍。

	- 启动应用程序时，若 currentUser 为空，则会创建一个匿名用户
	- 用户登出后，SDK 会自动创建一个匿名用户
	- 这个过程是定时器驱动的，有一定的延迟，如果应用在某个时刻需要匿名登录，却发现当前用户为空，就需要手动创建匿名用户

**注意：**还需要特别注意的是，假如当前用户是一个匿名用户，这个时候直接调用注册接口，sdk 会把这个匿名用户更新成为一个普通用户，而不会创建一个新用户。


## 在 Console 中管理用户
User 表是一个特殊的表，专门存储 `ML.User` 对象。在Console >> 开发中心 >> 云数据库，您会看到一个 **`_User`** 表。

## FAQ