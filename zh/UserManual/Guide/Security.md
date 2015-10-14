
# 数据安全

## 简介

###	MaxLeap的数据安全机制

* MaxLeap提供类级别和行级别的权限设置来保障用户数据的安全，不会被非法访问或者修改。


## 设置

### 类级别安全设置

#### 分类和介绍

类级别\应用内用户|创建者|非创建者
---|---|---
`Shared`|读/创建/修改/删除|读/创建
`Full`|读/创建/修改/删除|读/创建/修改/删除
`Private`|读/创建/修改/删除|创建
`ReadOnly`|读/创建|读/创建

注：
* 应用开发者和公司用户拥有所有数据的所有权限。
* 是否为创建者是根据该条数据中`ACL.creator`字段判断的。

#### 示例
* `Shared`:论坛的帖子，回复，文章，共享图片等
* `Full`:公共编辑的问题等
* `Private`:备忘录，个人敏感信息等
* `ReadOnly`:对话信息等

### 行级别安全设置

#### 分类和介绍

每行数据都有一个`ACL`的字段，用来记录行级别的权限信息。

* `ACL`的数据结构
```
{
    "creator":{
        "id":"faf93fah45fa56gs4523dfrt3",
        "type":"AppUser"
    }
}
```

* `ACL`的创建和修改
    * 创建：当创建一行数据时，根据创建者的身份信息去构造`ACL`。
    * 修改：需要有修改的权限，即为数据的创建者。

* `creator`类型

字段名|类型|备注
---|---|---
`type`|string|APIKey,AppUser,MasterKey,OrgUser
`id`|string|当type为AppUser/OrgUser时必须存在，值为当前用户id

#### 四种`ACL`示例
* APIKey:
```
{
    "creator":{
        "type":"APIKey"
    }
}
```
* AppUser:
```
{
    "creator":{
        "type":"AppUser",
        "id":"faf93fah45fa56gs4523dfrt3"
    }
}
```
* MasterKey:
```
{
    "creator":{
        "type":"MasterKey"
    }
}
```
* OrgUser:
```
{
    "creator":{
        "type":"OrgUser",
        "id":"bdf93fah45fa56gs4523dfde3"
    }
}
```

### Class安全设置和ACL组合效果

Class级别\访问者-creator类型|公司用户-所有|应用开发者-所有|应用内用户-AppUser(此用户是creator)&APIKey|应用内用户-其他|APIKey-APIKey|APIKey-其他
---|---|---|---|---|---|---
Shared|rw|rw|rw|r|rw|r
Full|rw|rw|rw|rw|rw|rw
Private|rw|rw|rw|-|rw|-
ReadOnly|rw|rw|r|r|r|r

### CloudCode中的安全机制

#### 介绍
#### 示例代码






    
    
