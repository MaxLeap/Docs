
# 云代码
##### _Author: David Young
##### _Github: https://github.com/sdyy321

## 简介
### 什么是云代码服务
云代码是部署运行在 MaxLeap 云引擎上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在 Web server上的 Web Service或 RESTful API。它对外提供的接口也是 RESTful API，也正是以这种方式被移动应用调用。 

###为什么需要云代码服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助云代码服务实现，其优势在于：

* 强大的运算能力：云代码运行在 MaxLeap 的 Docker 容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求 Cloud Data，大大提升效率
* 同一套代码可以为 iOS，Android，Web Site 等提供服务

###云代码如何工作

<p class="image-wrapper">
![imgWhatsCloudCode](../../../images/imgCloudCodeWorkflow.png)

一个 Java 云代码项目包含 Custom Cloud Code，Cloud Code SDK，3rd Party Libraries。开发完成后，用maven把项目打包成package，然后用云代码命令行工具 MaxLeap-CLI 上传到 MaxLeap，MaxLeap 会生成对应的 Docker image。用 maxleap deploy命令可以让 MaxLeap 启动 Docker container运行该 Docker image。


## 云函数
云函数是运行在 MaxLeap 上的代码。可以使用它来实现各种复杂逻辑，也可以使用各种第三方类库。

###定义云函数
每个云函数需要实现 com.maxleap.code.MLHandler interface，该interface是典型的Functional Interface。

```Java
public interface MLHandler <T extends com.maxleap.code.Request, R extends com.maxleap.code.Response> {
    R handle(T t);
}
```

用JDK 8 lambda表达式可以如下定义一个function:

```Java
request -> {
    Response<String> response = new Response<String>(String.class);
    response.setResult("Hello, world!");
    return response;
}
```

JDK6和7可以如下定义:

```Java
public class HelloWorldHandler implements MLHandler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Hello, world!");
        return response;
    }
}
```

最后，需要在main class里注册该函数。

```Java
defineFunction("helloWorld", new HelloWorldHandler());
```

### 通过云函数访问 Cloud Data

#### 定义 Cloud Data Object（在管理中心中，称之为“Class”）
新建一个 Cloud Data Object，并继承MLObject类

```java
public class MyObject extends MLObject {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
}
```
定义 Cloud Data Object需注意：

* 一个  Cloud Data Object 对应一个  Cloud Data class， Cloud Data Object 的类名必须和管理中心中创建的 class 名字一样
* 须将所有的  Cloud Data Object 放入同一个package中，推荐在/src/main/java下新建一个package，如：“data”
* 须配置global.json文件以识别该package，如：`"packageClasses" : "data"`

####  Cloud Data Object的CRUD

我们可以通过 MLClassManager 操作  Cloud Data：

```java
public void doSomethingToCloudData(){
	MLClassManager<MyObject> myObjectEntityManager = MLClassManagerFactory.getManager(MyObject.class);
	MyObject obj = new MyObject();
	obj.setName("Awesome");
	String name = obj.getName();

	//新增Object
	SaveResult<MyObject> saveMsg = myObjectEntityManager.create(obj);
	String objObjectId = saveMsg.getSaveMessage().objectId().toString();
	
	//复制Object
	obj.setName(name + "_" + 2);
	SaveResult<MyObject> cloneSaveMsg = myObjectEntityManager.create(obj);
	
	//查询Object
	Query sunQuery = Query.instance();
	sunQuery.equalTo("name", name + "_" + 2);
	FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
	MyObject newObj = findMsg.results().get(0);
	
	//更新Object
	Update update = Update.getUpdate();
	update.set("name", name + "_new");
	UpdateMsg updateMsg = myObjectEntityManager.update(newObj.objectIdString(), update);
	
	//删除Object
	DeleteResult deleteResult = ninjaEntityManager.delete(objObjectId);
}
```

上面例子是基本的增删改查操作，更多详细的参见下面章节

#### 使用Cloud Function

##### API方式调用
请求格式如下所示：

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
-d '{"name":"David Wang"}' \
https://api.maxleap.cn/2.0/functions/hello
```
	
##### 通过Android/iOS SDK调用：
Android SDK中：

```java
Map<String, Object> params = new HashMap<String, Object>();
params.put("key1", 1);
params.put("key2", "2");

CloudManager.callFunctionInBackground("hello", params, new FunctionCallback<JSONObject>() {
	@Override
	public void done(JSONObject object, Exception exception) {
		assertNull(exception);
	}
});
```
iOS SDK中：

```objective-c
NSDictionary *params = @{@"key1":@1, @"key2":@"2"};
    [MLCloudCode callFunctionInBackground:@"hello" withParameters:params block:^(id object, NSError *error) {
        if (error) {
            // 出现异常
        } else {
            // object
        }
    }];
```

## Cloud Data Object的查询
我们可以通过构造MLQuery对象`MLQuery query = MLQuery.instance();`，来进行基础或相对比较复杂的查询，MaxLeap SDK为我们提供了一系列的api来辅助我们构建自身需要的查询。

### 等值判断查询(=,!=,>,>=,<,<=)
`equalTo`用来返回某字段为指定值的结果集(=)

```java
    //返回字段field1=value1的结果集
    query.equalTo("field1", "value1");
```

`notEqualTo`用来返回某字段不为指定值的结果集(!=)

```java
    //返回字段field1!=value2的结果集
    query.notEqualTo("field1","value1");
```

`greaterThan`用来返回某个字段值大于指定值的结果集(>)

```java
    //返回字段field1值>100的的结果集
    query.greaterThan("field1",100);
```

`greaterThanOrEqualTo`用来返回某个字段值大于等于指定值的结果集(>=)

```java
    //返回字段field2值>=99的结果集
    query.greaterThanOrEqualTo("field2",99);
```

`lessThan`用来返回某个字段值小于指定值的结果集(<)

```java
    //返回字段field1值<100的结果集
    query.lessThan("field1",100);
```

`lessThanOrEqualTo`用来返回某个字段值小于等于指定值的结果集(<=)

```java
    //返回字段field2值<=99的结果集
    query.lessThanOrEqualTo("field2",99);
```

### 范围包含查询(exists、notExist、in、notIn、arrayAll、arraySize、nearSpherePoint)
exists用来返回某个字段存在值的结果集

```java
    //返回存在字段field1的结果集
    query.exists("field1");
```

notExist用来返回某个字段不存在值的结果集

```java
    //返回不存在字段field2的结果集
    query.notExist("field2");
```

`in`用来返回某个字段在指定枚举范围里的结果集

```java
    //返回字段field1在["value1","value2","value3"]枚举范围内的结果集
    query.in("field1","value1","value2","value3");
    //上面代码等效于下面方式：
    List<String> list = new ArrayList<String>();
    list.add("value1");
    list.add("value2");
    list.add("value3");
    query.in("field1",list);
```

`notIn`用来返回某个字段不在指定枚举范围里的结果集

```java
    //返回字段field1不在["value1","value2","value3"]枚举范围内的结果集
    query.notIn("field1","value1","value2","value3");
    //上面代码等效于下面方式：
    List<String> list = new ArrayList<String>();
    list.add("value1");
    list.add("value2");
    list.add("value3");
    query.notIn("field1",list);
```

`arrayAll`用来返回某个数组类型字段包含指定值的结果集(针对数组的查询)

```java
    //返回字段field1的值包含了value1且包含value2且包含value3的结果集，字段field1必须是一个array类型
    query.arrayAll("field1","value1","value2","value3");
    //上面参数你可以追加任意数量的值，等效于下面方式：
    List<String> list = new ArrayList<String>();
    list.add("value1");
    list.add("value2");
    list.add("value3");
    query.arrayAll("field1",list);
```

`arraySize`用来返回某个数组类型字段长度为指定值的结果集(针对数组长度的查询)

```java
    //返回数组类型字段field1长度为0的结果集
    query.arraySize("field1",0);
    //返回数组类型字段field1长度为10的结果集
    query.arraySize("field1",10);
```

`nearSpherePoint`用来返回某个字段在指定经度、纬度方圆范围内的结果集(针对MLGeoPoint类型的查询)

```java
    //返回字段field1值在经度(121.10013)纬度(31.11339)方圆500米范围内的结果集
    MLGeoPoint geoPoint = new MLGeoPoint(31.11339, 121.10013);
    query.nearSpherePoint("field1", geoPoint, 500);
```

### 复合查询(and、or、not)
在我们的业务逻辑中，可能存在非常复杂的查询组合，我们在一个query中可能无法满足，此时我们需要复合查询来达到组合效果

`and`与操作，多个条件同时成立返回结果集

```java
    //与操作，返回字段field1等于value1并且字段field2等于value2并且字段field3等于value3同时成立的结果集
    query.equalTo("field1", "value1").equalTo("field2","value2").equalTo("field3","value3");
    //上面代码等同于下面效果：
    MLQuery query = MLQuery.instance();
    query.equalTo("field1","value1");
    MLQuery query2 = MLQuery.instance();
    query2.equalTo("field2","value2");
    MLQuery query3 = MLQuery.instance();
    query3.equalTo("field3","value3");
    query.and(query2).and(query3);//通过and来实现与操作
```

`or`或操作，多个条件其中任意一个成立返回结果集

```java
    //或操作，返回字段field1等于value1或者value2的结果集
    MLQuery query = MLQuery.instance();
    query.equalTo("field1","value1");
    MLQuery query2 = MLQuery.instance();
    query2.equalTo("field1","value2");
    query.or(query2);//通过or来实现或操作
```

`not`非操作，某个条件不成立返回结果集

```java
    //返回数组类型字段field1长度不为0，即field1字段不为空数组的结果集
    query.exists("field1").not("field1",new MLQuery.SingleElemMatcher().$size(0));
    //返回数组类型字段field1为空或者长度为0的结果集
    query.notExist("field1").or(MLQuery.instance().arraySize("field1",0));
```

### 结果集显示限定查询(addKeys、excludeKeys、sort、skip、limit)
可能我们的表结构很臃肿，比如订单结构超过上百的字段，查询的结果里我们可能只想关注特别的几个字段，我们可以通过限定结果集来实现

`addKey`用来指定我们的结果集需要收集的字段

```java
    //返回结果集里只有field1字段
    query.addKey("field1");
```

`addKeys`用来指定我们的结果集需要收集的字段列表

```java
    //返回结果集里只有field1、field2、field3字段
    List<String> keys = new ArrayList();
    keys.add("field1");
    keys.add("field2");
    keys.add("field3");
    query.addKeys(keys);
```

你可以通过多次调用addKey来达到addKeys的效果

当然你也可以指定不收集的字段

`excludeKey`用来指定我们的结果集不需要收集的字段

```java
    //返回结果集中不包含field1字段
    query.excludeKey("field1");
```

`excludeKeys`用来指定我们的结果集不需要收集的字段列表

```java
    //返回结果集中不包含field1、field2、field3字段
    query.excludeKeys(new String[]{"field1","field2","field3"});
```

你可以通过多次调用excludeKey来达到excludeKeys的效果

在查询的结果集中，我们一般都会用到排序功能

`sort`用来按照指定字段升序(MLQuery.SORT_ASC)/降序(MLQuery.SORT_DESC)来排序

```java
    //结果集依次按照field1升序、field2升序、field3升序来排序
    query.sort(MLQuery.SORT_ASC,"field1","field2","field3");
    //上面代码的参数顺序不同返回的结果可能便不同，排序优先级从前到后，等效于下面：
    query.sort(MLQuery.SORT_ASC,"field1").sort(MLQuery.SORT_ASC,"field2").sort(MLQuery.SORT_ASC,"field2")
    //你也可以先预定排序规则（通过LinkedHashMap来保证顺序，请不要使用HashMap），然后统一执行sort操作：
    Map<String,Integer> sort = new LinkedHashMap<String, Integer>();
    sort.put("field1",MLQuery.SORT_ASC);
    sort.put("field2",MLQuery.SORT_DESC);
    sort.put("field3",MLQuery.SORT_DESC);
    query.setSort(sort);
```

排序一般适用于数字类型或日期类型的字段

除了排序功能，我们很多时候也会用到分页功能，特别是MLQuery限制了返回的结果集条数(最大2000)，在大量结果查询情况下，我们必须通过分页来实现业务逻辑

`setLimit`用来设置返回的记录最大条数，`setSkip`用来设置忽略指定的前面行数

```java
    //返回的数据记录数最大为100条数据，如果不指定默认为2000条
    query.setLimit(100);
    //忽略前面10行记录，如果不指定默认为-1，即不忽略
    query.setSkip(10);
```

通过setLimit和setSkip我们便很容易实现自己想要的分页功能，下面提供实现的一种方式，供大家参考：

```java
  /**
   * 分页实现，每次返回100条数据
   * @param query 基础查询语句，预先定义好的
   * @param skip  动态忽略行数
   * @return 最终结果集，包含全部分页结果
   */
  private List<Ninja> paging(MLQuery query,AtomicInteger skip){
    query.setLimit(100);//设置返回最大记录条数为100条
    query.setSkip(skip.get());//动态设置忽略前面N条记录
    FindMsg<Ninja> findMsg = ninjaMLClassManager.find(query);//执行查询
    if (findMsg.results() == null || findMsg.results().size() == 0) return new ArrayList<>();//结果集为空，退出
    if (findMsg.results().size() < 100) return findMsg.results();//没有下一页退出
    //有下一页
    skip.addAndGet(100);//忽略前面已经查询过的条数
    findMsg.results().addAll(paging(query, skip));//递归查询
    return findMsg.results();
  }
  //有了上面的分页函数，你就可以直接调用实现分页了，如下面：
  List<Ninja> result = paging(MLQuery.instance(), new AtomicInteger());
```

上面的分页实现可能会造成多查询一次，因为返回了100记录后就没有下一页，不过不影响，当然如果除了这种方式，你还可以有别的分页方式，比如每次实际多获取一条数据，比如101条，如果返回条数为101即表示有下一页，然后再做递归查询，不赘述了。

### 关联子查询(select、inQuery)
在实际应用中，我们也许会用到类似关系型数据库子查询的功能，我们假设有表User（用户）和表Article（文章）,文章表Article外键为uid关联用户，如果我们想要查询出张三写的所有文章，关系型数据库的查询语句有：

关联查询语句：

`SELECT * FROM article,user WHERE article.uid = user.id AND user.username='张三'` 

 或者

`SELECT * FROM article JOIN user ON article.uid = user.id WHERE user.username='张三'`

子查询语句：

`SELECT * FROM article WHERE uid IN(SELECT id FROM user WHERE username='张三')`

而在MaxLeap中我们可以通过`select`操作到达类似效果：

```java
//构建User子查询SelectOperator
MLQuery.SelectOperator selectOperator = new MLQuery.SelectOperator("User","id");
selectOperator.$eq("username","张三");
//构建Article查询
query.select("uid",selectOperator);
```

如果我们想查询除不是张三写的所有文章，我们可以使用`notSelect`实现：

```java
//构建User子查询SelectOperator
MLQuery.SelectOperator selectOperator = new MLQuery.SelectOperator("User","id");
selectOperator.$eq("username","张三");
//构建Article查询
query.notSelect("uid",selectOperator);
```

因为Article的uid关联到User，在JAVA的POJO里表现为Article类有个字段author，类型为Pointer，指向User类，类似下面：

```java
public class Article extends MLObject {
  private String title;
  private MLPointer author;
}
```

我们除了用`select`、`notSelect`操作来实现关联子查询外，还可以通过`inQuery`和`notInQuery`来达到相同的目的，而且更方便，这就是MaxLeap sdk为我们提供的关系查询：

```java
//查询张三写的所有文章
MLQuery.InQueryOperator inQueryOperator = new MLQuery.InQueryOperator("User");
inQueryOperator.$eq("username","张三");
query.inQuery("author",inQueryOperator);
//查询非张三写的所有文章
query.notInQuery("author",inQueryOperator);
```

### 关系查询(relationTo、setIncludes)
在我们的表结构中，很多情况下都存在着一对多、多对多的关系，如果想通过这种关系来查询我们想要的数据用普通的查询比较繁琐，MaxLeap sdk为我们提供了relatedTo操作

`relatedTo`关联查询操作

我们还是以User表和Article表为例，User表有个字段articles关联了文章列表，在java的POJO里表现如下：

```java
public class User extends MLObject {
  private String username;//用户名
  private MLRelation articles;//文章列表，关联Article类
}
public class Article extends MLObject {
  private String title;//文章标题
  private MLPointer author;//文章作者，关联User类
}
```

如果我们任然想查询张三的所有文章，我们可以先查询出用户为张三的User记录，然后通过relationTo关联查询到张三的所有文章

```java
    //获取张三User记录，得到张三的ObjectId
    MLQuery userQuery = MLQuery.instance();
    userQuery.equalTo("username", "张三");
    FindMsg<User> userFindMsg = MLClassManagerFactory.getManager(User.class).find(userQuery);
    ObjectId userObjectId = findMsg.results().get(0).objectId();
    //查询Article表并设置关联对象，关联刚查询到的张三ObjectId
    MLQuery articleQuery = MLQuery.instance();
    MLPointer pointer = new MLPointer(userObjectId, "User");
    articleQuery.relatedTo("articles", pointer);
    FindMsg<Article> articleFindMsg = MLClassManagerFactory.getManager(Article.class).find(articleQuery);
```

这对我们一对多，多对多查询非常简便有效。

有时候，你可能需要在一个查询中返回多种类型，做到类似显示结构树的效果，我们可以使用`setIncludes()`来设置需要包含查询的字段。

比如，我们想获得某篇文章，同时得到它关联的用户信息

```
    //返回的文章结果集中包含作者详细信息
    query.setIncludes("author");
```

需要注意的是setIncludes只针对MLPointer类型或者它的数组类型字段才有效(MLRelation类型的无效)，同时你可以做递归include，比如
`query.setIncludes("author.posts.comments")`，多个字段include可以按逗号分隔。


## Cloud Data Object的更新
我们可以通过构造MLUpdate对象`MLUpdate update = MLQuery.getUpdate();`，来实现记录的更新操作，MaxLeap SDK为我们提供了一系列的api来辅助我们构建自身需要的更新。

### 基本类型字段更新(set、setMany、unset、unsetMany、inc)
`set`用来为指定字段赋值

```java
    //更新字段field1
    update.set("field1","value1");
    //更新字段field2
    update.set("field2",123);
    //更新字段field3
    update.set("field3",false);
```

`setMany`用来为多个字段赋值，即同时更新多个字段，你可以通过多次调用`set`来达到`setMany`的效果

```java
    //更新字段field1,field2,field3
    Map<String,Object> map = new HashMap<String, Object>();
    map.put("field1","value1");
    map.put("field2",123);
    map.put("field3",true);
    update.setMany(map);
```

`unset`用来删除指定字段

```java
    //删除字段field1
    update.unset("field1");
```

`unsetMany`用来删除多个字段，你可以通过多次调用`unset`来达到`setMany`的效果

```java
    //删除字段field1,field2,field3
    update.unsetMany("field1","field2","field3");
    //上面代码等效于下面：
    List<String> list = new ArrayList<String>();
    list.add("field1");
    list.add("field2");
    list.add("field3");
    update.unsetMany(list);
```

`inc`用来对数字类型字段增加指定数值(注意该值可以为负数，若为负数表示减少值)

```java
    //更新数字类型字段，数值递增1
    update.inc("field1",1);
    //更新数字类型字段，数值增加10.5
    update.inc("field1",10.5);
    //更新数字类型字段，数值递减1
    update.inc("field1",-1);
    //更新数字类型字段，数值递减10.5
    update.inc("field1",-10.5);
```

注意，上面所有操作都可以针对子对象属性，通过`属性A.属性B.属性C...`这种实现递归更新，这样就会只更新到我们想要的子对象属性，而不会覆盖已经存在的子对象，比如我们有个POJO

```java
    public class A extends MLObject {
      private B b;
    }
    public class B extends MLObject {
      private int c;
    }
```

如果我们想更新对象A的属性b的属性c的值可以做下面这些操作：

```java
    更新对象A的子对象b的属性c
    update.set("b.c",5);
    删除对象A的子对象b的属性c
    update.unset("b.c");
    对象A的子对象b的属性c的数值递增10
    update.inc("b.c",10);
```

### MLRelation类型字段更新(addRelation、removeRelation)
`addRelation`用来为MLRelation类型字段添加关联对象

我们以用户表为例，用户类的articles关联了文章类，属于一对多的关系

```java
public class User extends MLObject {
  private String username;//用户名
  private MLRelation articles;//文章列表，关联Article类
}
```

为某个用户添加关联的文章，假设我们已经知晓了需要添加的文章的ObejctId：

```java
    //更新用户文章列表，添加用户关联的文章
    update.addRelation("articles",new MLPointer(articleObjectId,"Article"));
```

当然，我们可以一次性关联多个对象，比如为某个用户批量添加关联的文章

```java
    //更新用户文章列表，添加用户关联的文章
    update.addRelation("articles",new MLPointer(articleObjectId1,"Article"),new MLPointer(articleObjectId2,"Article"),new MLPointer(articleObjectId3,"Article"));
    //上面代码等效于下面：
    List<MLPointer> articlePointers = new ArrayList<MLPointer>();
    articlePointers.add(new MLPointer("articleObjectId1","Article"));
    articlePointers.add(new MLPointer("articleObjectId2","Article"));
    articlePointers.add(new MLPointer("articleObjectId3","Article"));
    update.addRelation("articles",articlePointers);
```

有添加关联就有删除关联，MaxLeap sdk为我们提供了相应的删除管理功能

`removeRelation`用来为MLRelation类型字段删除关联对象

任然以上面的用户文章为例，我们如果想删除某个用户关联的文章

```java
    //更新用户文章列表，删除用户关联的文章
    update.removeRelation("articles",new MLPointer(articleObjectId,"Article"));
    //更新用户文章列表，删除用户关联的多个文章
    update.removeRelation("articles",new MLPointer(articleObjectId1,"Article"),new MLPointer(articleObjectId2,"Article"),new MLPointer(articleObjectId3,"Article"));
    //上面代码等效于下面：
    List<MLPointer> articlePointers = new ArrayList<MLPointer>();
    articlePointers.add(new MLPointer("articleObjectId1","Article"));
    articlePointers.add(new MLPointer("articleObjectId2","Article"));
    articlePointers.add(new MLPointer("articleObjectId3","Article"));
    update.removeRelation("articles",articlePointers);
```

### 数组类型字段更新(arrayAdd、arrayAddUnique、arrayRemove)
`arrayAdd`用来向数组类型字段里添加元素

```java
     //更新数组类型字段field1，添加元素value1
     update.arrayAdd("field1","value1");
     //更新数组类型字段field2，添加元素1
     update.arrayAdd("field2",1);
     //更新数组类型字段field3，添加多个元素1、2、3
     update.arrayAdd("field3",1,2,3);
     //上面代码等效于下面：
     List<Integer> list = new ArrayList<Integer>();
     list.add(1);
     list.add(2);
     list.add(3);
     update.arrayAdd("field3",list);  
```

`arrayAddUnique`用来向数组类型字段里添加不重复的元素，即在数组中添加元素前会先判断该元素是否已经存在，如果存在则忽略这次添加操作，否则添加该元素

```java
    //更新数组类型字段field1，如果数组里已经存在value1则忽略，否则添加value1
    update.arrayAddUnique("field1","value1");
    //更新数组类型字段field2，如果数组里已经存在1则忽略，否则添加1
    update.arrayAddUnique("field2",1);
    //更新数组类型字段field3，添加多个不重复元素1、2、3
    update.arrayAddUnique("field3",1,2,3);
    //上面代码等效于下面：
    List<Integer> list = new ArrayList<Integer>();
    list.add(1);
    list.add(2);
    list.add(3);
    update.arrayAddUnique("field3",list); 
```

`arrayRemove`用来向数组类型字段里删除元素

```java
     //更新数组类型字段field1，删除元素value1
     update.arrayRemove("field1","value1");
     //更新数组类型字段field2，删除元素1
     update.arrayRemove("field2",1);
     //更新数组类型字段field3，删除多个元素1、2、3
     update.arrayRemove("field3",1,2,3);
     //上面代码等效于下面：
     List<Integer> list = new ArrayList<Integer>();
     list.add(1);
     list.add(2);
     list.add(3);
     update.arrayRemove("field3",list);  
```

## Background Job
云代码中，您还可以自定义后台任务，它可以很有效的帮助您完成某些重复性的任务，或者定时任务。如深夜进行数据库迁移，每周六给用户发送打折消息等等。您也可以将一些耗时较长的任务通过Job来有条不紊地完成。

###创建和监控Background Job
####在云代码中定义并实现Job Handler
``` java
public class MyJobHandler implements MLHandler {
    public Response handle(Request request) {
        Response<String> response = new ResponseImpl<String>(String.class);
        response.setResult("Job done!");
        return response;
    }
}
```

然后进入主程序入口(main函数)，使用defineJob来定义Job

``` java
defineJob("myJob", new MyJobHandler());
```
###测试Background Job
我们可以利用curl测试Job是否可用

```shell
curl -X POST \
-H "X-ML-AppId: YOUR_APPID" \		
-H "X-ML-APIKey: YOUR_APIKEY" \
-H "Content-Type: application/json" \
https://api.maxleap.cn/2.0/jobs/YOUR_JOBNAME
```

####在管理中心中Schedule Job Plan
img

表单项目|作用 
----|-------|
名称|任务的名字|
函数名|想要执行的后台Job的名字
设置开始|从何时开始执行任务
设置重复|每隔多久重复执行任务
参数|提供数据给后台Job

####在管理中心中查看状态
进入“开发者中心”，点击“云代码” >> “任务状态”，您将能查看所有的任务列表，以及他们的状态概况。
选中您想要查看的任务，便可以查看任务详情。
img

## Hook for Cloud Data
Hook用于在对  Cloud Data 进行任何操作时（包括新建，删除及修改）执行特定的操作。例如，我们在用户注册成功之前，可以通过beforeCreate Hook，来检查其是否重名。也可以在其注册成功之后，通过afterCreate Hook，向其发送一条欢迎信息。Hook能很好地实现与数据操作相关的业务逻辑，它的优势在于，所有的业务在云端实现，而且被不同的应用/平台共享。

###创建和使用Hook
实现MLClassManagerHook接口(建议直接继承MLClassManagerHookBase类，它默认为我们做了实现，我们想要hook操作，只需直接重载对应的方法即可)

```java
@ClassManager("MyObject")
public class MyObjectHook extends MLClassManagerHookBase<MyObject> {
	@Override
	public BeforeResult<MyObject> beforeCreate(MyObject obj, UserPrincipal userPrincipal) {
		MLClassManager<MyObject> myObjectEntityManager = MLClassManagerFactory.getManager(MyObject.class);
		//创建obj前验证是否重名了
		MLQuery sunQuery = MLQuery.instance();
		sunQuery.equalTo("name", obj.getName());
		FindMsg<MyObject> findMsg = myObjectEntityManager.find(sunQuery);
		if (findMsg.results() != null && findMsg.results().size() > 0)
			return new BeforeResult<>(obj,false,"obj name repeated");
		return new BeforeResult<>(obj, true);
	}
	
	@Override
	public AfterResult afterCreate(BeforeResult<MyObject> beforeResult, SaveMsg saveMessage, UserPrincipal userPrincipal) {
		//创建完obj后在服务器上记录日志，这条日志可以通过console后台查看到
        logger.info("create Ninja complete use " + MLJsonParser.asJson(userPrincipal) + ",saveMsg:"+MLJsonParser.asJson(saveMessage));
        return new AfterResult(saveMessage);
	}
}
```

#####定义Hook需注意：

* 确保目标 Cloud Data Object对应的class存在
* Hook类上需要添加`@ClassManager`注解，以便服务器能够识别该Hook是针对哪个实体的
* 须将所有的Hook类放入同一个package中，推荐在/src/main/java下新建一个package，如：“myHooks”
* 须配置global.json文件以识别该package，如：`"packageHook" : "myHooks"`
* 内建class和自定义class均支持Hook，内建class原有的限制（ _User用户名和密码必填， _Installation的deviceToken和installationId二选一）依然有效。

### Hook类型

云代码支持六种类型的Hook：
#### beforeCreate
在对应的  Cloud Data 被创建之前调用，可以用于验证输入的数据是否合法。

例如：在新建好友分组的时候，需要检查组名是否太长。

```java
@Override
public BeforeResult<FriendList> beforeCreate(FriendList list, UserPrincipal userPrincipal) {
	String name = list.getName();
	if (name.length() > 10)
		return new BeforeResult<>(list, false, "Cannot create a friend list with name longer than 10!");
	return new BeforeResult<>(list, true);
}
```

#### afterCreate
在对应的  Cloud Data 被创建后调用，可以用于执行如 User 创建后给客户经理发封邮件这样的逻辑。

#### beforeUpdate
在对应的  Cloud Data 被更新之前调用，可以用于验证输入的数据是否合法。

例如：在修改好友分组的时候，需要检查组名是否已经存在。

```java
@Override
public BeforeResult<FriendList> beforeUpdate(FriendList list, UserPrincipal userPrincipal) {
	//定义查询条件：
	MLQuery sunQuery = MLQuery.instance();
	sunQuery.equalTo("Name", list.getName());
	//在“好友”表中执行查询
	MLClassManager<Friend> friendEntityManager = MLClassManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Update failed because the name of the friend list already exists!");
	return new BeforeResult<>(list, true);
}
```

#### afterUpdate
在对应的  Cloud Data 被更新之后调用，可以用于如用户更新密码后，给用户邮箱发封提醒邮件。

#### beforeDelete
在对应的  Cloud Data 被删除之前调用，可以用于验证删除是否合法。

例如：用户的每位好友都在某个分组下，在删除一个好友分组之前，需要检查这个分组内是否还存在好友。

```java
@Override
public BeforeResult<FriendList> beforeDelelte(FriendList list, UserPrincipal userPrincipal) {
	//定义查询条件：
	MLQuery sunQuery = MLQuery.instance();
	sunQuery.equalTo("listName", list.Name);
	//在“好友”表中执行查询
	MLClassManager<Friend> friendEntityManager = MLClassManagerFactory.getManager(Friend.class);
	FindMsg<Friend> findMsg = friendEntityManager.find(sunQuery);
	
	if (findMsg.results() != null && findMsg.results().size() > 0)
		return new BeforeResult<>(list, false, "Cannot delete a friend list if any friend inside!");
	return new BeforeResult<>(list, true);
}
```

#### afterDelete
在对应的  Cloud Data 被删除之后调用，可以用于如清除其他有关的数据。

## 消息推送
在移动应用中，为每个客户端用户推送系统消息或定制消息必不可少，MaxLeap sdk为我们提供了消息推送功能，只需简单一步便可将消息推送到客户端

```java
//推送消息到指定终端设备
PushMsg pushMsg = new PushMsg();
pushMsg.withInstallationId("yourInstallationId").withMsg("hello").push();
//推送消息到指定终端设备
PushMsg pushMsg = new PushMsg();
pushMsg.withDeviceToken("yourDeviceToken").withMsg("hello").push();
//推送消息到所有终端设备
PushMsg pushMsg = new PushMsg();
pushMsg.withMsg("hello").push();
```

## 分布式计数器、分布式锁
在云端，随着用户的增多，一个单个的实例应用可能再也无法支撑，扩容是必要的，这样一个应用可能同时有多个容器实例来提供服务，类似一个分布式的集群在后端为用户提供所有的云端服务.
在分布式系统中，MaxLeap SDK也为我们提供了计数器、锁相关的功能以便多个实例之间可以共享同一份数据。

使用分布式计数器功能，你只需要实例化`Themis`接口，便可调用相关API

分布式计数器API：

```java
//实例化Themis
Themis themis = new ThemisImpl();
//计数器名称，全局唯一，所有实例共享同一个名称的计数器
String counterEntity = "myCount";
//生成计数器
themis.generateCounter(counterEntity);
//获取当前计数器值
themis.get(counterEntity);
//计数器递增并返回递增后的值
themis.incrementAndGet(counterEntity);
//返回当前计数器值并递增
themis.getAndIncrement(counterEntity);
//计数器递减并返回递减后的值
themis.decrementAndGet(counterEntity);
//计数器增加指定值(如果为负数则表示减少)并返回更新后的值
themis.addAndGet(counterEntity, 1);
//返回当前计数器值并增加指定值(如果为负数则表示减少)
themis.getAndAdd(counterEntity, 1);
```

分布式锁API:

```java
//实例化Themis
Themis themis = new ThemisImpl();
//锁名称，全局唯一，所有实例共享同一个名称的锁，同一时间有且只会有一个请求可以得到锁，直到主动释放锁
String lockEntity = "myLock";
//获取锁，一旦获取锁成功，其他任何实例或地方获取锁都将会失败
themis.getLock(lockEntity);
//TOTO:your service code
//释放锁
themis.lockRelease();
```

## Logging
云代码提供Logging功能，以便您能记录Function，Hook或者Job在运行过程中出现的信息。除此之外，云代码的部署过程，也将被记录下来。您可以在管理中心中查看所有的日志。
###在云代码中记录Log
您可以使用logger实例，记录4种级别的日志：Error，Warn，Info和Debug.

```java
public class MyClass {
	com.maxleap.code.Logger logger = com.maxleap.code.LoggerFactory.getLogger(myclass.class);

	public void myMethod(){
		logger.error("Oops! Error, caught you!");
		logger.warn("I'm Warning.");
		logger.info("I'm Information");
	}
}
```
使用Log需注意:

* 你可以在Main, Hook, Handler等任意地方中使用日志功能，只需使用com.maxleap.code包下的日志类即可，而正常的log4j或slf4j日志将不会被远程服务器记录，但可以在本地使用*
* 本地测试不会产生远程数据库记录，但发布后调用会产生记录，你可以在后端界面查看你的日志信息
* 服务器上只会记录info、warn和error级别的日志，如果您的Function调用频率很高，请在发布前尽量去掉不必要的Info级别日志，以避免不必要的日志存储
	
###系统自动记录的Log
除了手动记录的Log外，系统还将自动为您收集一些必要的日志，包括：

* Cloud Function的上传部署信息
* Hook Entities的Cache信息
* 云代码相关的API request信息
	
###查看Log
可以使用命令行工具MaxLeap-CLI查看最近的log

```shell
maxleap log -n 100
```
也进入“管理网站”，点击“开发者中心”－>“日志”，您便可查看该应用的所有日志。

## UserPrincipal
SDK提供使用用户请求原始信息UserPrincipal来访问数据，而不是通过cloudcode的masterKey来实现，这样数据在访问流通过程中可以有效保证key的安全性，而不被人拦截请求截获masterKey信息。

###使用UserPrincipal
SDK在处理hook请求时会默认使用UserPrincipal，在function/job中你可以通过获取Request对象的UserPrincipal来完成你的数据访问

```java
new MLHandler<Request, Response>() {
      @Override
      public Response handle(Request request) {
            UserPrincipal userPrincipal = request.getUserPrincipal();
            MLClassManager<Ninja> ninjaZEntityManager = MLClassManagerFactory.getManager(Ninja.class);
            MLQuery lasQuery = MLQuery.instance().equalTo("name", "123");
            FindMsg<Ninja> findMsg = ninjaZEntityManager.find(lasQuery, userPrincipal);
            Response<FindMsg> response = new MLResponse<FindMsg>(FindMsg.class);
            response.setResult(findMsg);
            return response;
      }
}
```

* 如果你不使用UserPrincipal来访问数据，SDK会默认使用master-key（即配置文件global.json中的applicationKey）来访问数据
* 所有SDK的api都提供了使用UserPrincipal方式来访问数据，除了cloudcode云代码自身发起的请求必须使用masterKey来访问外，其他所有请求我们建议你使用UserPrincipal这种方式来保证你的秘钥安全

## MLC － 云代码命令行工具
MLC命令行工具是为云代码项目的上传，部署，停止及版本管理而设计的。您可以利用它，将Maven项目生成的package上传到MaxLeap，在云端，package将被制作成Docker Image，而部署过程，就是利用Docker Container将这个Image启动。而被上传到云端的每个版本的云代码都将被保存，您可以自由地卸载某一个版本，而后部署另外一个版本的云代码.
###登录:
```shell
maxleap 或者maxleap -username <用户邮箱> -region <CN or US ...>
```
`<用户邮箱>` 为您登录MaxLeap管理中心的账号邮箱，`<CN or US ...>` 为选择中国区账号还是美国区账号，然后根据提示输入密码
###显示所有app：
```shell
apps
```
查询账号下的所有应用，显示的信息为：AppId ：AppName
###选择应用:
```shell
use <应用名>
```
`<应用名>`为目标应用名，如果应用名包含空格，你可以用`use "应用名"`即使用引号来切换应用。选择之后，接下来的操作（上传/部署/停止/版本管理）都将以此应用为上下文。
###上传云代码:
```shell
upload <文件路径>
```
`<文件路径>`为你将部署的云代码 package（zip文件，由mvn package命令生成），它将被上传到步骤3指定的应用下。
上传的的代码会被制作成Docker镜像，版本号在云代码项目里的global.json文件中指定：
```
"version": "0.0.1"
```
###显示所有云端云代码版本:
```shell
lv
```
即显示所有该应用下，用户上传过的云代码的所有版本。
###部署云代码：
```shell
deploy <版本号>
```
`<版本号>`为想要部署的云代码版本号：如执行deploy 0.0.1，将部署指定应用下版本号为0.0.1的云代码。如果部署不存在的版本，会提示错误："version of appId not exists"
###停止cloudcode：
```shell
undeploy <版本号>
```
停止该应用的指定版本云代码：如果之前已经部署过一个版本，需要先停止，再部署新的版本。
###输出最近的日志：
```shell
log [-l <info|error>] [-n <number of log>] [-s <number of skipped log>]

-l 指定输出日志的级别：info或是error
-n 指定log的数量
-s 指定跳过最近的log数量
```
