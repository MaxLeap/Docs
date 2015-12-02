## 云数据离线分析
##### _Authors: <a href="https://github.com/jjeffcaii">Jeff Tsai</a> , <a href="https://github.com/wbye">wbye</a>
### 简介
MaxLeap 云数据离线分析旨在为用户提供一种处理自有应用数据的方式，用户可以使用类SQL的查询语句对自己的数据进行高效的查询和导出。该功能的数据源为截止今日凌晨的历史数据。
### 背景及目标
现有的云数据功能无法完成一些超大规模数据量下的聚合统计型的查询，不同的表之间也是相互隔离，无法相互连接。很多用户渴望能以一种熟悉的查询方式来分析自己的数据，比如：一个音乐类的应用，想查询最火热的歌手Top10，其在我们的云数据离线分析平台上可以轻松快捷地获取。
为了达到易用和高效的平衡，我们致力于实现以下目标：

- 提供类SQL的业界通用查询方式
- 鲁棒性，确保我们的系统是稳定健壮的
- 查询结果的优雅展示
- 丰富的文件格式导出
- 人性化的服务 （比如耗时长的任务我们会邮件通知，避免您不必要的等待）
 
### 技术架构
- 基于业界比较成熟的解决方案，采用[SparkSQL](http://spark.apache.org/sql/)作为查询引擎，[SparkSQL](http://spark.apache.org/sql/)对比[Hive](http://hive.apache.org/)拥有巨大的性能优势，我们在小型的测试环境中对千万级数据的聚合查询仅2分钟。
- 我们的攻城狮实现了一套自有的ETL工具用于数据的转换，通过监视数据库日志到[Kafka](http://kafka.apache.org/)，再合并到[HBase](http://hbase.apache.org/)形成全量数据，最后转换成高效的列式存储格式文件。
- 对于SQL的请求和响应，我们基于[RabbitMQ](https://www.rabbitmq.com/)定制了一套小型的消息系统。
- 以下是大致的系统架构图


![Offline Arch](../../../images/imgOfflineArch.png "Offline Arch")

### 启用设置
- 第一次使用，请进入应用设置页面，打开“云数据离线分析”开关，系统会在后台导入您的云数据，泡杯咖啡，耐心等待

![Offline Arch](../../../images/imgOfflineStep1.png "Offline Arch")

- 打开“开发者中心”-“云数据离线分析”页面，如果您的数据已经导入完成，页面会在左侧列出当前的所有表结构，如果未完全导入，底部会出现目前导入表的信息

![Offline Arch](../../../images/imgOfflineStep2.png "Offline Arch")

- 在右侧的编辑器中撰写您的LeapQL语句，点击执行，等待片刻后，页面将会返回执行结果。

![Offline Arch](../../../images/imgOfflineStep3. "Offline Arch")


### 使用我的查询
- 点击右下角的保存按钮，可以将编辑器中的SQL语句保存，以方便以后的查询
![Offline Arch](../../../images/imgOfflineSaveQuery1.png "Offline Arch")
- 填写相关的名称和描述，名称必填
![Offline Arch](../../../images/imgOfflineSaveQuery2.png "Offline Arch")
- 保存后，编辑器的顶部即出现关于当前查询的信息
![Offline Arch](../../../images/imgOfflineSaveQuery3.png "Offline Arch")
- 你可以通过右下角的新查询按钮，清空编辑器，并将上面的查询信息清空

- 点击编辑器上方的我的查询标签，查看到我的查询，在这里你可以运行，编辑，复制，删除已经存在的查询语句（支持多个删除）
![Offline Arch](../../../images/imgOfflineQueryOperate1.png "Offline Arch")
- 以点击运行按钮为例：点击运行后，将切换到LeapQL编辑器标签页，同时运行相关查询语句，并且在编辑器顶部显示 当前的SQL语句的名称和描述，点击名称和描述可以编辑
![Offline Arch](../../../images/imgOfflineQueryOperate2.png "Offline Arch")


### 查询历史
- 查询历史包含了用户所有的成功查询的SQL语句，支持关键字搜索
![Offline Arch](../../../images/imgOfflineQueryHistory.png "Offline Arch")

### 功能介绍

#### 查询结果
查询结果包含实时和离线查询

- 实时：页面上直接渲染
- 离线：系统会自动在完成查询后将查询结果以邮件方式发送到您的邮箱。（当然您也可以重复提交您的查询直至页面返回查询结果）

##### 实时结果
当您的查询表数据规模比较小，或者您的数据已经被预热，此时您的查询速度快速，会在几秒至几十秒内返回响应。
##### 离线结果
当您的查询表数据规模比较大，或者您的数据为第一次加载的冷数据，此时您的查询有可能会需要几分钟的处理时间，为了避免浪费您宝贵的时间，我们推荐耐心等待系统将查询结果发送到您的邮箱。
#### 我的查询
用户可以用将常用的查询SQL语句，保存起来，达到下次快速的进行查询
#### 查询历史
包含了用户所有的成功查询的SQL语句，支持关键字搜索
#### LeapQL 支持语法
##### 基础SQL
请参考基础SQL语法。支持`select`,`join`,`group by`,`order by`,`limit`等

##### UDFs
- 入门基础

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| = | 等值比较 | select * from tbl where age = 18 | |
| > | 大于比较 | select * from tbl where age > 18 | |
| < | 小于比较 | select * from tbl where age < 18 | |
| >= | 大于等于比较 | select * from tbl where age >= 18 | |
| <= | 小于等于比较 | select * from tbl where age <= 18 | |
| <>,!= | 不等值比较 | select * from tbl where age <> 18 | |
| is null | 空值判断 | select * from tbl where name is null | |
| is not null | 非空判断 | select * from tbl where name is not null | |
| like | 相似比较 | select * from tbl where name like '\_abc%' | 占位符说明: '%'表示任意数量的字符，而'\_'表示单个任意字符 |
| regexp | 正则比较 | select * from tbl where name regexp '^T.*my$' | |

- 数组

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| array[0] | 数组访问 | select favorites[0] from tbl | |
| size | 获取大小 | select size(playlists) from tbl | |
| sort_array | 数组排序 | select sort_array(my_arr) from tbl | |
| array_contains | 数组是否包含元素 | select array_contains(arr,'a') from tbl | 返回值为布尔型 |

- 日期

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| unix_timestamp | 日期字符串转时间戳 | select unix_timestamp(date_str,'yyyy-MM-dd HH:mm:ss') as ts from tbl | |
| from_unixtime | 日期格式化 | select from_unixtime(datetime_mills,'yyyy-MM-dd HH:mm:ss') as date_str from tbl | 强制为UTC时区 |
| to_date | 返回字符串的日期部分(年月日) | selet to_date(date_str) from tbl | 备注: '2015-01-01 12:25:00' 将会被转换成 '2015-01-01' |
| year | 返回字符串的年份 | select year(date_str) from tbl | |
| month | 返回字符串的月份 | select month(date_str) from tbl | |
| day | 返回字符串的天 | select day(date_str) from tbl | |
| hour | 返回字符串的小时 | select hour(date_str) from tbl | |
| minute | 返回字符串的分钟 | select minute(date_str) from tbl | |
| second | 返回字符串的秒 | select second(date_str) from tbl | |
| weekofyear | 返回一年中的星期数 | select weekofyear(date_str) from tbl | |
| datediff | 返回两个日期天数之差 | select datediff(end_date,start_date) from tbl | |
| date_add | 增加天数 | select date_add(origin_date_str,7) from tbl | |
| date_sub | 减少天数 | select date_sub(origin_date_str,7) from tbl | |

- 字符串

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| length | 获取长度 | select length(name) from tbl |  |
| substr,substring | 子字符串 | select substr(name,3,2) from tbl |  |
| instr | 是否包含字符串 | select instr(name,'a') from tbl | 返回值为索引位置，起始位置为1 |
| concat | 拼接字符串 | select concat(\_id,name) from tbl | |
| concat_ws | 带分隔符拼接字符串 | select concat_ws(':',_id,name) from tbl | |
| reverse | 反转字符串 | select reverse(name) from tbl | |
| upper,ucase | 转大写 | select upper(name) from tbl | |
| lower,lcase | 转小写 | select lower(name) from tbl | |
| trim,ltrim,rtrim | 去除(两边\|左\|右)空白 | select trim(title) from tbl | |
| regexp_replace | 正则替换 | select regexp_replace(title,'abc\|xyz','XYZ') from tbl | |
| regexp_extract | 正则抽取 | select regexp_extract(title,'group_([a-f0-9]+)',1) from tbl | regexp_extract(origin,regex,group) |
| split | 分割字符串为数组 | select split(names,',') from tbl | 返回为array类型 |
| format_number | 格式化数字 | select format_number(number,2) from tbl | eg: format(1234.321,2) -> 1,234.32 |
| repeat | 重复字符串 | select repeat(str,8) from tbl | |
| space | 返回n个空格字符串 | select space(8) from tbl | |
| ascii | 返回首字符ASCII码 | select ascii('a') from tbl | |
| lpad,rpad | 左,右补足 | select lpad(str,10,'\_') from tbl | lpad('abc',10,'\_') -> _______abc |


- JSON

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| get_json_object | JSON解析 | select get_json_object(file,'$.name') from tbl | |

- 聚合

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| count | 计数 | select count(1) from tbl | |
| sum | 求和 | select sum(score) from tbl | |
| avg | 求平均值 | select avg(age) from tbl | |
| max,min | 求最大，最小值 | select max(age) from tbl | |

- 数学运算

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| round | 指定精度 | select round(payment,2) from tbl | round(double) 为取整 |
| floor | 向下取整 | select floor(payment,2) from tbl | |
| ceil,ceiling | 向上取整 | select ceil(payment,2) from tbl | |
| exp | 自然指数 | select exp(number) from tbl | |
| ln | 自然对数 | select ln(number) from tbl | |
| log10 | 以10为底的对数 | select log10(number) from tbl | |
| log2 | 以2为底的对数 | select log2(number) from tbl | |
| log | 自定义对数 | select log(3,number) from tbl | |
| pow,power | 幂运算 | select pow(number,3) from tbl | |
| sqrt | 平方根 | select sqrt(number) from tbl | |
| bin | 转2进制 | select bin(number) from tbl | |
| hex | 16进制表示 | select hex(number) from tbl | 如果变量是int类型，那么返回a的十六进制表示；如果变量是string类型，则返回该字符串的十六进制表示 |
| unhex | 将字符串以16进制编码 | select unhex(num_str) from tbl | 如unhex('616263') -> 'abc' |
| conv | 进制转换 | select conv(number,10,16) from tbl | 示例为10进制转16进制 |
| abs | 绝对值 | select abs(number) from tbl | |
| pmod | 取余 | select pmod(number,3) from tbl | |
| positive,negative | 取正反数 | select negative(number) from tbl | |
| sin,asin,cos,acos | 三角函数 | select sin(number) from tbl | |

- 其他

| 函数名 | 功能 | 示例 | 备注 |
|--------|--------|--------|--------|
| cast | 类型转换 | select cast(foobar as STRING) from tbl | 转换失败返回空 |



更多的语法手册请参考：[Hive官网文档](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF), [Spark官网文档](http://spark.apache.org/docs/latest/sql-programming-guide.html)


#### 查询样例
##### 简单样例
查询位于上海市区的用户

```sql
    select
        * 
    from
        _User 
    where
        timezone='Asia/Shanghai'

```

##### 一般样例
查询Top10的安装语言

```sql
    select
        language,
        count(1) as totals 
    from
        _Installation 
    group by
        language 
    order by
        totals limit 10

```

##### 复杂样例
查询Top50的最受欢迎的艺人（假设已经存在艺人和歌曲两张表）

```sql
    select
        Artist.name as artist_name,
        count(1) as track_num 
    from
        Artist 
    left join
        Track 
            on Track.artist=Artist.name 
    group by
        Artist.name 
    order by
        track_num desc,
        artist_name asc limit 50
        

```
