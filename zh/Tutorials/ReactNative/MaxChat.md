# 如何使用 MaxLeap 快速实现仿微信应用
## 业务需求
###一、登录：
1、提供用注册、登录功能；

###二、聊天：
1、添加删除好友，同好友进行聊天；
2、创建并管理群组，进行群组聊天；

## 方案选择

### 传统方案
IM常用的实现方式是基于XMPP/Jabber协议，组建服务器。在客户端集成XMPPFramework实现登录、认证以及消息收发功能。

### MaxLeap 方案
MaxLeap对于每个app，都自动内建支持文件存储、聊天和说说的所有功能，只需要在客户端直接调用SDK就可以进行注册、登录，聊天和信息发布！

## MaxLeap 实现

### 集成 MaxLeap ReactNative SDK

使用 MaxLeap 内建用户管理功能进行用户注册，登录和保存用户个人资料。

1. 根据[使用手册](https://www.npmjs.com/package/maxleap-react-native)安装 MaxLeap ReactNative SDK。

2. 根据[使用手册](https://www.npmjs.com/package/maxlogin-react-native)安装 MaxLeap Login 组件。
		
3. 集成 MaxLeap 注册组件

    ```js
    <MaxLogin.Register
        onSuccess={user=>Actions.login()}
        onFailure={err=>Alert.alert('Error', err.message)}
        style={styles.account}
    />
    ```
        
4. 集成 MaxLeap 登录组件

    ```js
    <MaxLogin.Login
        onSubmit={this.onSubmit}
        style={styles.account}
    />
    ```

### 聊天模块：

1. 执行 `npm insall maxleap-im` 安装 MaxLeap IM SDK。

2. 登录 IM

    ```js
    var data =  {
        appId: 'MAXLEAP_APPID',
        clientId: 'MAXLEAP_CLIENT_ID',
        region: 'cn'
        username: 'your username',
        password: 'your password'
    };
    var im = ML.im(data, (res) => {
        if (res.success) {
            // success
        } else {
            // error
        }
    })
    ```

3. 联系人画面。联系人画面分为好友和群组，通过当前登录用户的 ID 可以很容易得检索该用户所有添加的好友和所有参加的群组。

    ```js
    im.listFriends(userId, (err, res)=> {
        if (err) {
            alert('获取朋友列表失败');
        } else {
            dispatch({
                type: LIST_FRIENDS_REQUEST_SUCCESS,
                res
            });
        }
    }, true)
    ```

4. 聊天窗口基于第三个组件 `react-native-gifted-messenger` 实现。通过监听消息可以实现消息列表。
    
    ```js
    im.onMessage(res=> {
        dispatch({
            type: RECEIVE_MESSAGE_SUCCESS,
            res
        });
    });
    im.yourself(res=> {
        dispatch({
            type: RECEIVE_MESSAGE_SUCCESS,
            res
        });
    });
    ```

    也可以很简单的调用以下方法向特定目标发送消息

    ```js
    im.toFriend(target).text(text).ok();
    ```



