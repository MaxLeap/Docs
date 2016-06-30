# 如何使用 MaxLeap 快速实现新闻客户端

## 业务需求

###一、登录：
1、提供用户注册、登录功能；
2、支持手机短信验证登录；

###二、发表评论
  浏览News时可以发表评论

###三、收藏News
  可以收藏感兴趣的News

## MaxLeap 实现

**注：需要注册 MaxLeap 的 appId 和 clientKey 来集成 MaxLeap 服务。开发者可以到 https://maxleap.cn/ 注册账号并创建APP，记录 appId 和 clientKey 用于集成 MaxLeap 服务。**

本文示例采用 Redux 架构，[点击这里阅读官方文档](http://redux.js.org/)。<br>
想了解有关 MaxLeap 数据操作更详细的内容，请参阅 [MaxLeap React Native SDK 使用手册](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html)

###一、集成 MaxLeap SDK

MaxLeap 提供了用户登陆界面组件 `maxlogin-react-native`，可以集成使用。


集成核心 SDK `maxleap-react-native`: [参照快速开始手册，安装SDK](https://maxleap.cn/s/web/zh_cn/quickstart/reactnative/core/new.html)。<br>
集成登陆组件 `maxlogin-react-native`: [参照说明文档，安装SDK](https://github.com/MaxLeap/Module-MaxLogin-RN)
	
然后在 AppDelegate.m 中加入 MaxLeap SDK 启动代码：
	
```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	...
	[MaxLeap setApplicationId:MAXLEAP_APPID clientKey:MAXLEAP_CLIENTKEY site:MLSiteCN];
}
```

###二、登录与注册

2. 使用登陆组件：

	注册界面：
	
	```js
	import { Register } from 'maxlogin-react-native'
	
	render() {
     return (
       <ScrollView style={styles.container}>
         <Register 
           onSuccess={user=> Actions.pop()}
           onFailure={e=>alert(e)}/>
       </ScrollView>
     );
   }
	```

	用户名密码登录界面：
	
	```js
	import { Login } from 'maxlogin-react-native'
	
	render() {
     return (
       <ScrollView style={styles.container}>
         <Login onSuccess={user=> Actions.pop()}
           onFailure={e=>alert(e)}/>
       </ScrollView>
     );
   }
	```
	
	手机号登录界面：
	
	```
	import { PhoneLogin } from 'maxlogin-react-native'
	
	render() {
     return (
       <ScrollView style={{flex: 1, marginTop: this.props.navigationBarStyle.height, backgroundColor: '#f5f5f5'}}>
         <PhoneLogin style={Platform.OS === 'android'?formStyle:undefined}
           onSuccess={user=> Actions.pop()} onFailure={e=>alert(e)}/>
       </ScrollView>
     );
   }
	```
	
3. 使用image设置个人图标：

	```js
	// 把当前用户绑定到 AccountCenter 的 props.currentUser 属性上：
	
	function mapStateToProps(state) {
	  return {
	    currentUser: state.maxlogin.currentUser
	  };
	}
	
	export default connect(mapStateToProps)(AccountCenter);
	
	
	// AccountCenter 的 render 方法中就可以访问到当前用户了：
	
	let DefaultAvatar = require('xxx.png')
	let avatarURI = this.props.currentUser && this.props.currentUser.get('iconUrl')
	<Image style={styles.avatar} source={avatarURI ? {uri: avatarURI} : DefaultAvatar} />
	```


###三、获取新闻数据

1. 获取新闻分类信息：

	```js
	// 一个异步 Redux Action 
	
	export function fetchCategories(onSuccess, onFailure) {
	  return dispatch => {
	  
	    dispatch(fetchCategoriesStart()) // 请求开始的 Action
	    
	    let Category = ML.Object.extend('Category');
	    let q = new Query(Category)
	    
	    q.find().then(value => {
	      dispatch(fetchCategoriesSuccess(value)) // 成功的 Action, 会有一个 reducer 来处理 items
	      if (onSuccess) {
	        onSuccess(value)
	      }
	    }).catch(err => {
	      dispatch(fetchCategoriesFailure(err)) // 失败的 Action, 会有一个 reducer 来处理错误数据
	      if (onFailure) {
	        onFailure(err)
	      }
	    })
	  }
	}
	```

2. 获取分类对应的新闻：

	```js
	export function fetchNews(cid, page=0, pageCount=-1) {
	  return dispatch => {
	    dispatch(refreshStart())
	    fetchNews(cid)
	    let News = ML.Object.extend('News');
		 let query = new Query(News)
		 query.equalTo('belongCategoryID', cid)
		 .skip(page*pageCount)
		 .limit(pageCount)
		 .find()
	    .then(value => {
	      dispatch(refreshSuccess(cid, value))
	    }).catch(err => {
	      dispatch(refreshFailure(err))
	    })
	  }
	}
	```

###四、发表评论

1. 发表:

	```js
	export function createComment({
	  user : ML.User, 
	  news : ML.Object, 
	  text : String, 
	  onSuccess : function, 
	  onFailure : function
	}) {
	  return dispatch => {
	    if (!text) {
	      return
	    }
	    dispatch(commentStart(news.id))
	
		 // 新建一个评论对象
	    let Comment = ML.Object.extend('Comment')
	    let cmt = new Comment()
	    cmt.set('commentContent', text)
		
		 // 跟用户关联起来
	    let userPointer = ML.Object.createWithoutData(user.className, user.id)
	    cmt.set('fromUser', userPointer)
	    cmt.set('fromUserId', user.id)
		 
		 // 跟新闻关联起来
	    let newsPointer = ML.Object.createWithoutData(news.className, news.id)
	    cmt.set('commentedNews', newsPointer)
	    cmt.set('belongNewsID', news.id)
	
		 // 保存(创建)评论
	    cmt.save().then(() => {
	      dispatch(commentSuccess(news.id))
	      if (onSuccess) {
	        onSuccess()
	      }
	    }).catch(err => {
	      dispatch(commentFailure(news.id, error))
	      if (onFailure) {
	        onFailure(err)
	      }
	    })
	  }
	}
	```

2. 查找新闻对应的评论:

	```js
	export function fetchCommentsOfNews(news :ML.Object) {
	  return dispatch => {
	    dispatch(fetchCommentsStart(news.id))
	
		 // Query 用来查询数据，可以设置多种过滤条件
	
	    let Comment = ML.Object.extend('Comment')
	    let query = new ML.Query(Comment)
	    .equalTo('belongNewsID', news.id)
	    .include(['fromUser'])              // 同时获取发评论用户的信息，该字段类型为 Pointer
	    .descending('createdAt')
	    
	    // 执行查询操作
	    query.find().then(items => {
	      dispatch(fetchCommentsSuccess(news.id, items))
	    }).catch(err => {
	      dispatch(fetchCommentsFailure(news.id, err))
	    })
	  }
	}
	```
	
###五、收藏新闻

通过把保存新闻和用户的引用保存在同一条数据中实现此功能。

1. 收藏：

	```js
	export function collectNews({
	  user : ML.User, 
	  news : ML.Object, 
	  onSuccess : function, 
	  onFailure : function
	}) {
	  return dispatch => {
	    dispatch(addStart())
		
		 // 新建一个藏品对象
	    let UserCollection = ML.Object.extend('UserCollection')
	    let collection = new UserCollection()
	    
	    // 收藏的新闻
	    let newsPointer = ML.Object.createWithoutData(news.className, news.id)
	    collection.set('collectedNews', newsPointer)
	    
	    // 所属用户
	    collection.set('collectedByUserID', user.id)
	
	    collection.save().then(() => {
	      dispatch(addSuccess())
	      if (onSuccess) {
	        onSuccess()
	      }
	    }).catch(err => {
	      dispatch(addFailure(err))
	      if (onFailure) {
	        onFailure(err)
	      }
	    })
	  }
	}
	```

2. 查找我的收藏：
 
	```js
	export function fetchFavorites({user, onSuccess, onFailure}) {
	  return dispatch => {
	    dispatch(fetchStart())
	
	    let UserCollection = ML.Object.extend('UserCollection')
	    let query = new ML.Query(UserCollection)
	    .equalTo('collectedByUserID', user.id)
	    .include('collectedNews')
	
	    query.find().then(items => {
	      dispatch(fetchSuccess(items))
	      if (onSuccess) {
	        onSuccess()
	      }
	    }).catch(err => {
	      dispatch(fetchFailure(err))
	      if (onFailure) {
	        onFailure(err)
	      }
	    })
	  }
	}
	```


## FAQ
