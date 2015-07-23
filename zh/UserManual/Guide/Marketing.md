# 营销
##简介
###什么是LAS营销服务

营销服务是Leap Cloud提供的营销和信息发布功能。目前提供两种Marketing形式：Push Notification和In-App Message.您可以通过推送消息方式向指定人群推送消息，也可以通过In-App Message，在应用内向有某种行为的用户显示特定内容。您还可以在消息中设置用户点击后的跳转。消息的创建，设置和发送均在Console中完成。

###为何需要LAS营销服务

结合LAS分析服务提供的分析数据，以及LAS Users服务提供的Segment，您可以高效地制定营销策略，并且通过Marketing服务实施您的策略。LAS Marketing服务的优势在于：


* **提高转化率：**随时向用户发布营销活动，维持用户活跃度并提高转化率
* **保障用户体验：**选择向指定Segment发送消息，更具有针对性
* **动态内容管理：**Push Notification和In-App Message中的内容均在Console中设置，用户所见内容可实时更新

如需获取更多信息，请查看 [营销推广 － iOS开发指南](..) 或者 [营销推广 － Android开发指南](..)。
##Class列表
在"营销推广"报表中，我们可以查看该应用下所有的活动（包括应用内消息和活动）的列表：

imgMCampaignList.png

若某个字段的类型为LASRelation，即关联了其他LASObject，该列的值会显示为"View Relations".点击后，便可查看该属性关联的所有LASObject.

![imgCDShowRelation.png](../../../images/imgCDShowRelation.png)

###新建/修改Class
点击"＋添加类"按钮，输入Class名，便可以完成Class的新建：

![imgCDAddClass.png](../../../images/imgCDAddClass.png)

新建Class完毕后，您可以选中改Class后，对其进行如下修改：

* 新建列：添加Class属性
* 新建行：添加一条数据
* 筛选表格数据显示：点击沙漏图标
* 选择表格显示列：点击右上角表格图标

###删除Class
在Claas列表中选中要删除的Class，在右侧选择 更多 >> 删除类，确认即可。

![imgCDDeleteClass](../../../images/imgCDDeleteClass.png)