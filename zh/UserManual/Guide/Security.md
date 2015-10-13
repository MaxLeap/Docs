
# 数据安全

## 简介

###	MaxLeap的数据安全机制

* MaxLeap提供Class级别和对象级别的权限设置来保障用户数据的安全，不会被非法访问或者修改。


## 设置

### Class级别安全设置

#### 分类和介绍
* `Shared`：在此模式下，每行数据只有该行数据的创建者可以读和写，非创建者只能读，不能写。
* `Full`：在此模式下，每行数据对所有人都开放读写权限。
* `Private`：在此模式下，每行数据只有该行数据的创建者可以读和写，非创建者不能读，不能写。
* `ReadOnly`：在此模式下，每行数据对所有人只开放读权限

注：
* 对于所有类型的表，创建一条新数据的权限是对所有人都开放的。
* 应用开发者拥有所有数据的读写权限，限制只针对应用内用户。

#### 示例
* 在Shared模式下，用户A创建了一条数据，那么A拥有对该条数据的读、修改、删除的权限；其他用户只能读，不能修改和删除。
* 在Full模式下，用户A创建了一条数据，所有的用户都拥有对该条数据的读、修改、删除的权限。
* 在Private模式下，用户A创建了一条数据，那么只有A可以对该条数据读、修改、删除，其他用户不能读、修改、删除该条数据。
* 在ReadOnly模式下，用户A创建了一条数据，所有用户都只能对该条数据进行读操作，不能修改和删除。

### 对象级别安全设置

#### 分类和介绍
* ACL的数据结构
```
{
    "creator":{
        "id":"faf93fah45fa56gs4523dfrt3",
        "type":"AppUser"
    }
}
```
* 类型

字段名|类型|备注
---|---|---
id|string|当类型是AppUser/OrgUser时必须存在
type|string|有APIKey,AppUser,MasterKey,OrgUser四种类型

* ID
    1. type=AppUser：为此应用内用户的唯一标识
    2. type=OrgUser：为此公司用户的唯一标识

#### 示例
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






    
    
