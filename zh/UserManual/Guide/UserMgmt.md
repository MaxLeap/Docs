# 用户管理
在用户管理中，您可以实现用户，用户角色以及用户分群的管理。同时您还可以查看并且维护所有的安装纪录。

**如果您希望进一步了解LAS用户服务服务SDK，请参考[iOS开发指南 － 用户管理](LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#USER_ZH)或[Android开发指南 － 用户管理](LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_ZH)。**

##用户
####查看用户列表

![imgUMUserList.png](../../../images/imgUMUserList.png)

####新建用户

![imgUMAddUser.png](../../../images/imgUMAddUser.png)

此处，您还可以选择“电子邮件验证”。勾选后，系统将在创建完成后发送验证邮件至用户邮箱，并且纪录验证结果。

####编辑用户
选中用户后，您可以进入该用户的编辑页面，修改其密码，邮箱及头像。

##用户角色
角色是一组用户的集合，用以灵活地控制批量用户的权限。
####查看角色列表

![imgUMRoleList.png](../../../images/imgUMRoleList.png)

####新建角色

点击新建角色，提供角色名，便可添加角色。

####编辑角色
选中角色，进入角色编辑页面后，您便可以向其中添加用户：

![imgUMRoleAddUser.png](../../../images/imgUMRoleAddUser.png)

##用户分群

####查看用户分群列表

![imgUMSegmentList.png](../../../images/imgUMSegmentList.png)

系统将默认为您提供5个用户分群：

####创建用户分群

![imgUMAddSegment.png](../../../images/imgUMAddSegment.png)

创建用户分群时，您需要过滤器用户，即指定加入该用户分群的用户属性。包括以下类别：

* 常用：重度付费用户，中度付费用户，轻度付费用户，流失用户，注册用户
* 行为：使用，付款，事件
* 用户信息：国家，语言，创建时间，最近使用时间，渠道等

添加上述过滤条件（每个过滤条件之间的关系为“与”）之后，系统会将所有符合条件的用户加入到该分群中。

####查看/修改用户分群
选中用户分群，进入用户分群编辑页面后，您便可以修改改用户分群。与此同时，您将看到此分群下，用户的总数及其他统计情况：

![imgUMSegmentEdit.png](../../../images/imgUMSegmentEdit.png)

此外，您还可以在这里，直接向该用户分群发送推送消息或应用内消息。

## 下一步
**如果您希望进一步了解LAS用户服务服务SDK，请参考[iOS开发指南 － 用户管理](LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#USER_ZH)或[Android开发指南 － 用户管理](LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_ZH)。**
