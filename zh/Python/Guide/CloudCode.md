# Python云代码开发指南

##### _Author: Marvin
##### _Github: https://github.com/zhoucen

## 云代码简介

### 什么是云代码服务
云代码是部署运行在MaxLeap上的代码，您可以用它来实现较复杂的，需要运行在云端的业务逻辑。它类似于传统的运行在Web server上的Web Service或RESTful API。它对外提供的接口也是RESTful API，也正是以这种方式被移动应用调用。

### 为什么需要云代码服务

如果应用非常简单，我们可以将业务逻辑都放在客户端里面实现。然而，当应用需要实现比较复杂的业务逻辑，访问更多的数据或需要大量的运算时，我们便需要借助云代码服务实现，其优势在于：

* 强大的运算能力：云代码运行在MaxLeap的Docker容器中，可以使用多个CPU和大容量内存进行计算
* 更高效：可以在一次调用中通过高速网络多次请求 Cloud Data，大大提升效率
* 同一套代码可以为iOS，Android，web site等提供服务

## 对象

你可以通过子类化 `ML.Object` 来创建自己的类，使用此类生成对象再保存，将会将数据保存到 MaxLeap 数据服务上，类名对应的表中。

```python

from ML import Object

class GameScore(Object):
    def is_cheated(self):
        # 可以像正常 Python 类一样定义方法
        return self.get('cheatMode')

    @property
    def score(self):
        # 可以使用property装饰器，方便获取属性
        return self.get('score')

    @score.setter
    def score(self, value):
        # 同样的，可以给对象的score增加setter
        return self.set('score', value)

# or: GameScore = Object.extend('GameScore')
```

### 保存对象

调用实例对象的save方法，即可保存对象。

```python
game_score = GameScore()
game_score.set('score', 42)  # or game_score.score = 42
game_score.set('cheatMode', False)
game_score.set('playerName', 'Marvin')
game_score.save()

# 还可以通过关键字参数，在创建对象的同时进行赋值
game_score = GameScore(score=42, playerName='Marvin')
```

这时候登陆 MaxLeap 控制台查看，可以看到 GameScore 中新增一条数据。

另外所有 Object 子类对象，都有三个特殊字段，保存之后服务器会自动填充其中的数据。

```python
game_score.id            # 此对象的id，类型为 unicode ，对应控制台的 objectId
game_score.created_at    # 此对象创建的时间，类型为 datetime.datetime ，对应控制台的 createdAt
game_score.updated_at    # 此对象最后更新的时间，类型为 datetime.datetime，对应控制台的 updatedAt
```

### 检索对象

检索对象可以使用 ML.Query 类来进行。

如果事先知道一个对象的 objectId ，可以这样做:

```python
from ML import Query
query = Query(GameScore)
game_score = query.get('5593891b60b29f3f62867196')
print game_score.get('playerName')
```

### 更新对象

更新对象的时候，直接修改对象上对应字段的值，然后再调用`save`方法即可。

```python
from ML import Object
GameScore = Object.extend('GameScore')

game_score.set('score', 42)
game_score.set('cheatMode', False)
game_score.set('playerName', 'Marvin')
game_score.save()

game_score.set('score', 43)
game_score.save()
```

### 计数操作

很多应用场景都需要进行一些计数操作，比如记录游戏分数，论坛帖子回帖数等等。如果直接从服务器获取这些字段的值，然后简单的加减值再进行保存，这个时候很有可能服务器上的数据已经有了更新，会将服务器的数据覆盖掉。这往往不是我们想要的结果。因此可以使用`increment`方法来进行计数操作，我们只需要将需要增减的值传递给服务器就可以了。

```python
from ML import Object
GameScore = Object.extend('GameScore')

game_score.set('score', 42)
game_score.set('cheatMode', False)
game_score.set('playerName', 'Marvin')
game_score.save()

game_score.increment('score', 1)
game_score.save()
```

### 删除字段

有时候需要将对象上的一个字段设置为空，可以使用`unset`方法。

```python
game_score.unset('score')
game_score.save()
```

### 删除对象

如果你想要删除服务器上的一个对象，可以使用`destroy`方法。

```python
game_score.destroy()
```

### 关系数据

ML 后端存储支持一对一，一对多，多对多数据建模。

#### 一对一关系和一对多关系

一对一关系和一对多关系都可以通过在一个`Object`对象内保存另一个对象来实现。比如一个`Post`下可以允许多个`Comment`对象，一个`Comment`只能属于一个`Post`对象，可以这样实现：

```python
Post = Object.extend('Post')
Comment = Object.extend('Comment')

post = Post()
post.set('title', 'I am Hungry')
post.set('content', 'Where should we go for lunch?')

comment = Comment()
comment.set('content', 'Let us do Sushirrito.')

comment.set('parent', post)

comment.save()
```

在`Comment`对象上调用`save`方法，SDK 会同时保存两个对象。

如果想将一个已经保存在了服务器上的对象关联到新对象上，可以只通过现有对象的 `objectId` 来进行关联。

```python
post = Post()
post.id = '520c7e1ae4b0a3ac9ebe326a'
# or: post = Post.create_without_data('520c7e1ae4b0a3ac9ebe326a')
comment.set('parent', post)
```

默认情况下，从服务器上获取一个对象时并不会获取与它关联对象的值。可以这样显式获取：

```python
post = comment.get('parent')
post.fetch()
```

#### 多对多关系

多对多关系可以使用 `ML.Relation` 来建立。比如 `User` 可以将 `Post` 添加进自己 `like` 的列表中，可以这样实现：

```python
relation = user.relation('likes')
relation.add(post)
user.save()
```

可以在 `likes` 中删除一个 `post`:

```python
relation = user.relation('likes')
relation.remove(post)
user.save()
```

`relation` 中关联的对象并不会下载到本地。可以用 `query` 方法来返回一个 `ML.Query` 对象，来获取 `relation` 中的对象列表，比如：

```python
relation = user.relation('likes')
query = relation.query()
posts = query.find()
```

此时 `query` 对象即是 `ML.Query` 的实例，可以增加一些查询条件，比如：

```python
relation = user.relation('likes')
query = relation.query().equal_to('title', 'I am Hungry')
posts = query.find()
```

如果想查询所有 like 了某个 Post 的用户，可以使用 `reverse_query` 方法来进行反向查询：

```python
from ML import Relation

query = Relation.reverse_query('User', 'likes', post)
users = query.find()
```

### 数据类型

MaxLeap Python SDK 支持大部分 Python 内置类型。

```python
from datetime import datetime
from ML import Object

obj = Object.extend('myObject')()
obj.set('myNumber', 2.718)
obj.set('myString', 'foobar')
obj.set('myDate', datetime.now())
obj.set('myArray', [1, 2, 3, 4])
obj.set('myDict', {'string': 'some string', 'number': 1})
obj.set('myNone', None)
obj.save()
```

需要注意的是，Object 对象序列化之后的大小不应该超过 128KB。

## 查询

### 基础查询

我们可以通过构造 `ML.Query` 对象，来进行复杂查询。

```python
from ML import Object
from ML import Query

GameScore = Object.extend('GameScore')
query = Query(GameScore)  # 这里也可以直接传递一个 Class 名字的字符串作为构造参数
query.equal_to('playerName', 'Dan Stemkoski')
gameScores = query.find()
```

### 查询条件

有几种方式来设置查询条件。 你可以用 not_equal_to 方法和一个特定的值来过滤不符合要求的对象:

```python
query.not_equal_to("playerName", "Michael Yabuti")
```

你可以给定更多的条件，只有满足所有条件的对象才会作为结果返回。

```python
query.not_equal_to("playerName", "Michael Yabuti")
query.greater_than("playerAge", 18)
```

你可以用设定 limit 的方法来限定返回的结果数，默认的返回结果数是 100，但是任何 1 到 1000 之间的数值都是合法的，在 0 到 1000 范围之外的都强制转成默认的 100。

```python
query.limit(10) # limit to at most 10 results
```

如果你只想要一个结果，一个更加方便的方法可能是使用 first，而不是 find 方法。

```python
GameScore = Object.extend('GameScore')
query = Query(GameScore)
query.equal_to('playerEmail', 'dstemkoski@example.com')
game_score = query.first()
```

你可以用 skip 跳过前面的结果，这可能对于分页很有用。

```python
query.skip(10)  # skip the first 10 results
```

对于可以排序的类型，比如 int / datetime 和 str，你可以控制返回结果的顺序:

```python
# Sorts the results in ascending order by the score field
query.ascending("score")

# Sorts the results in descending order by the score field
query.descending("score")
```

对于可以排序的类型，你同样可以在查询中进行比较。

```python
# Restricts to wins < 50
query.less_than("wins", 50)

# Restricts to wins <= 50
query.less_than_or_equal_to("wins", 50)

# Restricts to wins > 50
query.greater_than("wins", 50)

# Restricts to wins >= 50
query.greater_than_or_equal_to("wins", 50)
```

如果想让返回的对象的某个属性匹配多个值，你可以使用 contained_in，提供一个数组就可以了。这样通常可以用单个的查询来获取多个结果。比如你想获取某几个玩家的分数:

```python
# Finds scores from any of Jonathan, Dario, or Shawn
query.contained_in("playerName", ["Jonathan Walsh", "Dario Wunsch", "Shawn Simon"])
```

相反地，你可以使用 not_contained_in 方法来查询在集合之外的目标对象。

如果你想要查询含有某一特定属性的对象，你可以使用 exists。相对地，如果你想获取没有这一特定属性的对象，你可以使用 `does_not_exist`。

```python
# Finds objects that have the score set
query.exists("score")

# Finds objects that don't have the score set
query.does_not_exist("score")
```

你可以使用 `matches_key_in_query` 方法来进行嵌套的子查询。举例说，如果你有一个类包含了运动队，而你在用户的类中存储了用户的家乡信息，你可以构造一个查询来查找某地的运动队有赢的记录的用户。查询应该看起来像下面这样:

```python
from ML import Object
from ML import Query
from ML import User

Team = Object.extend("Team")
team_query = Query(Team)
team_query.greater_than("winPct", 0.5)
user_query = Query(User)
user_query.matches_key_in_query("hometown", "city", team_query)

# results has the list of users with a hometown team with a winning record
results = user_query.find()
```

相对地，可以使用 `does_not_match_key_in_query` 来获取属性不在子查询结果中的对象。比如为了获得用户的家乡队输了的情况:

```python
losing_user_query = Query(User)
losing_user_query.does_not_match_key_in_query("hometown", "city", teamQuery)

# results has the list of users with a hometown team with a losing record
results = losingUserQuery.find()
```

你可以用 select 和一个 keys 的列表来限定返回的字段。为了获得只包含 score 和 playername 字段的文档 ( 包括 build-in 的字段，objectId，createdAt，updatedAt):

```python
GameScore = Object.extend("GameScore")
query = Query(GameScore)
query.select("score", "playerName")

# each of results will only have the selected fields available.
results = query.find()
```

剩下的字段可以之后用返回的对象的 fetch 方法来获取:

```python
result = query.first().fetch()
```

### 对数组值做查询

对于 value 是数组的情况，你可以这样查询数组中的值有 2 的情况的对象:

```python
# Find objects where the array in arrayKey contains 2.
query.equal_to("arrayKey", 2)
```

你同样可以用下面的方式找到同时包含元素 2，3，4 的数组:

```python
# Find objects where the array in arrayKey contains all of the elements 2, 3, and 4.
query.contains_all("arrayKey", [2, 3, 4])
```

### 对字符串类型做查询

使用 start_with 来限制属性值以一个特定的字符串开头，这和 MySQL 的 LIKE 操作 符很像，因为有索引所以对于大的数据集这个操作也是很高效的。

```python
# Finds barbecue sauces that start with "Big Daddy's".
query = ML.Query(BarbecueSauce)
query.starts_with("name", "Big Daddy's")
```

### 关系查询

对于查询关系型数据来说有几种不同的方式，如果你想要获取的对象中有某个属性 包含一个特定的 ML.Object，你可以使用 equal_to，就像对于别的数据类型一样。举个例子，如果每一个 Comment 在它的 post 字段都有一个 Post 对象，你可以通过 如下的方式来获取一个 Post 的 comment:

```python
# Assume ML.Object my_post was previously created.
query = ML.Query(Comment)
query.equal_to("post", my_post)
comments = query.find()
# comments now contains the comments for my_post
```

如果你想得到其字段中包含的子对象满足另一个查询的结果，你可以使用 matches_query 操作。**注意默认的结果条数限制 100 和最大 limit 1000 也同样适用于子查询，所以对于大的数据集你可能需要小心构建你的查询，否则可能出现意料之外的状况**。例如，为了找到 post 中有图片的 comment，你可以:

```python
inner_query = ML.Query(Post)
inner_query.exists("image")
query = ML.Query(Comment)
query.matches_query("post", inner_query)
comments = query.find()
# comments now contains the comments for posts with images.
```

如果你想要获取某字段中包含的子对象不满足指定查询的结果，你可以使用 does_not_match_query。例如，为了找到针对不含图片的 post 的 comment，你可以这样:

```python
inner_query = ML.Query(Post)
inner_query.exists("image")
query = ML.Query(Comment)
query.does_not_match_query("post", inner_query)
query.find()
# comments now contains the comments for posts without images.
```

你可以同样用 objectId 来做关系查询

```python
post = Post()
post.id = "520c7e1ae4b0a3ac9ebe326a"
query.equal_to("post", post)
```

在某些情况下，你可能希望查询结果中包含多个相关联的其他数据类型。你可以使用 include 方法。比如: 假设你想获得最新的 10 个 comment，你可能想同时获取它们相关的 post 数据:

```python
query = ML.Query(Comment)

# Retrieve the most recent ones
query.descending("createdAt")

# Only retrieve the last ten
query.limit(10)

# Include the post data with each comment
query.include("post")

comments = query.find()
# Comments now contains the last ten comments, and the "post" field
# has been populated. For example:
for comment in comments:
    # This does not require a network access.
    post = comment.get("post")
```

你同样可以用点操作符来做多级查询，如果你想同时找到 comment 的 post 和相应 post 的 author，你可以这样做:

```python
query.include(["post.author"])
```

你可以多次使用 include 来构建一个有多个字段的查询，这项功能同样适用于 ML.Query 的 helper 函数例如 first 和 get。

### 对象计数

如果你只是想查询满足一个 query 的结果集到底有多少对象，但是你不需要得到它们，你可以使用 count 来取代 find。比如，为了获得某个玩家到底玩过多少局游戏:

```python
query = ML.Query(GameScore)
query.equal_to("playerName", "Sean Plott")
count = query.count()
# The count request succeeded. Show the count
print "Sean has played %d games" % count
```

对于超过 1000 个对象的类来说，count 操作会被时间限制所约束。它们可能会一直 返回超时错误，或者只是返回一个近似正确的值。这样的话你应该更合理地规划你程序的结构来避免这种情况。

### 组合查询

如果你想要查找满足一系列查询的对象，你可以使用 Query.or_ 方法来构建查询，这样得到的结果是所有查询的并集。比如你想要找的玩家或者是有很多或者很少的胜利的时候，你可以这样:

```python
from ML import Query

lots_of_wins = Query("Player")
lots_of_wins.greater_than("wins", 150)

few_wins = Query("Player")
few_wins.less_than("wins", 5)

main_query = Query.or_(lots_of_wins, few_wins)
results = mainQuery.find()
# results contains a list of players that either have won a lot of games or won only a few games.
```

你也可以使用 Query.and_ 对 Query 加入更多的条件，如同 AND 查询一样，这样得到所有查询结果的交集。

请注意 **我们不会在组合查询的子查询中支持非过滤型的条件**（比如:limit, skip, ascending/descending, include）。


## Principal
SDK提供使用用户请求原始信息UserPrincipal来访问数据，而不是通过cloudcode的masterKey来实现，这样数据在访问流通过程中可以有效保证key的安全性，而不被人拦截请求截获masterKey信息。

### 获取用户请求原始信息UserPrincipal

```python
principal = ML.get_principal()
```

### 获取MasterPrincipal

```python
principal = ML.get_master_principal()
```

### 使用Principal
你可以在创建对象和创建查询的时候指定需要使用的Principal

```python
principal = ML.get_master_principal()

GameScore = ML.Object.extend("GameScore")
game_score = GameScore.create_without_data("55d1480960b2430132e9b19e",principal=principal)
game_score = ML.Object.create("GameScore",principal=principal)
query = Query(GameScore，principal=principal)
```



## CloudCode

### 新建一个项目

##### 一个python cloudcode项目的目录树应该如下：

```
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
```

##### global.json 样例

```
{
    "applicationName": "", \\cloudcode名称（必备）
    "applicationId": "",   \\ 应用Id（必备）
    "applicationKey": "",  \\应用Master Key（必备）
    "lang": "python",      \\cloudcode所用语言（必备）
    "version": ""          \\cloudcode版本号（必备）
}
```

##### 目录加载顺序

1. 拷贝lib依赖
2. pip安装requirements.txt
3. 加载程序文件，顺序为：config -> hook -> job -> function


##### *cloudcode 的运行环境内置最新版本的leap-sdk*

### 使用sdk

- 定义你的第一个function

  在文件function/demo.py中

  ```python
  from ML import Server
  from ML import Response
  @Server.Function
  def helloword(request):
      return Response("hello world")

  ```

  使用Server.Function来定义你的function。每个Function都必须返回一个`Response`对象。

- 定义你的第一个job

  在文件job/demo.py中

  ```python
  from ML import Server
  from ML import Response

  @ML.Server.Job
  def helloword(request):
      return Response("hello world")
  ```

  使用Server.Job来定义你的job，job一般用于定时执行或者需要花费较长时间运行的程序。同样，
Job也必须返回一个`Response`对象

### 实现复杂点的Fuction

这里我们简单实现一个业务逻辑，提交一个忍者名称，生成一个忍者本体和它的50个影分身，找出其中第50个分身，击杀其余分身和本体，让它成为新的本体

```python
#coding:utf-8
from ML import Object
from ML import Server
from ML import Log
from ML import Query
from ML import Response

Ninja = Object.extend('Ninja')

@Server.Function
def helloNinja(request):
    #获取param:name
    name = request.json.get('name')

    #产生本体
    ninja = Ninja()
    ninja.set('name',name)
    ninja.save()
    Log.info(u"生成本体，ID为:{}".format(ninja.id))

    #产生50个分身
    clone_ninja_ids = []
    for idx in range(50):
        clone_ninja = Ninja()
        clone_ninja.set('name',u'{0}_{1}'.format(name,idx))
        clone_ninja.save()
        clone_ninja_ids.append(clone_ninja.id)
        Log.info(u"多重影分身:{}".format(clone_ninja.id))

    #找出第50个分身
    query = Query(Ninja)
    query.equal_to('name',u'{}_49'.format(name))
    ninja_50 = query.first()
    clone_ninja_ids.remove(ninja_50.id)
    Log.info(u"找到第50个分身:{}".format(ninja_50.dump()))

    #击杀其余49个分身
    query = Query(Ninja)
    query.contained_in('ObjectId',clone_ninja_ids)
    for item in query.find():
        item.destroy()
    Log.info(u"完成分身击杀数目:{}".format(query.count()))

    #击杀本体
    ninja.destroy()
    Log.info(u"完成本体击杀")

    #让第50分身成为新的本体
    ninja_50.set('name',u'{}_new'.format(name))
    ninja_50.save()
    Log.info(u"第50个分身在{}成为新的本体".format(ninja_50.updated_at));

    #返回新的本体名称
    return Response(ninja_50.get('name'))

```

### 实现HOOK操作
支持before_save、after_save、after_update、before_delete、after_delete
样例如下：

```python
#coding:utf-8
from ML import Log
from ML import Server

@Server.before_save('test_ninja')
def test1(obj):
    Log.info("before_save:{}".format(obj.dump()))

    @Server.after_save('test_ninja')
    def test2(obj):
        Log.info("after_save:{}".format(obj.dump()))

    @Server.after_update('test_ninja')
    def test3(obj):
        Log.info("after_update:{}".format(obj.dump()))

    @Server.before_delete('test_ninja')
    def test4(obj):
        Log.info("before_delete:{}".format(obj.dump()))

    @Server.after_delete('test_ninja')
    def test5(obj):
        Log.info("after_delete:{}".format(obj.dump()))

```

所有的hook方法接收参数为表名

hook的执行顺序为：before hook -> original behavior -> after hook

hook方法可以选择返回一个Response对象，如果hook返回了一个Response对象之后，在这个hook之后的操作都不会执行，这个Response将直接返回给请求者。

## 日志
### 使用日志

*Log实例用来记录日志*

```python
from ML import Log
Log.info("test log!")
```

* 目前有log，warn，error，debug四个级别*

* 本地测试不会产生数据库记录，但发布后会产生记录，你可以在后端界面查看你的日志信息*

* 如果你的function调用频率很高请在发布前尽量去掉调试测试日志以便不必要的日志存储*

### 查看日志
可以使用命令行工具MaxLeap-CLI查看最近的log

```shell
maxleap log -n 100
```
也进入“管理网站”，点击“开发者中心”－>“日志”，您便可查看该应用的所有日志。

## 本地单元测试

`Server`实例提供了`callFunction` 和`callJob` 来测试你的程序。

使用`nose`来测试你的代码：

`nosetests tests/test_ninja.py`

```python
#coding:utf-8

import ML
import function.ninja
import hook.hooks
import job
import json
from nose.tools import with_setup
from ML import Server

def setup_func():
    ML.init(
        "55924bc260b2a70e2a54ae2f",
        master_key="NE85TkVObThsWmk2OW5hcHpKcG5ldw"
        )

@with_setup(setup_func)
def test_helloNinja():
    response = Server.callFunction('helloNinja', data=json.dumps({'name':"test"}))
    assert response.data == 'test_new'
    assert response.status_code == 200

```

*在测试用例里面你需要把你所有的function、job、hook文件全部import进来*

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
`<文件路径>`为你将部署的云代码 package（zip文件），它将被上传到步骤3指定的应用下。
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
