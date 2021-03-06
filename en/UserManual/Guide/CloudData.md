
## Introduction

### What is  Cloud Data
 Cloud Data is the data storage service provided by MaxLeap. It is based on the `MLObject` and each `MLObject` contains several key-values. All `MLObject` are stored in MaxLeap, you can perform operations towards them with iOS/Android Core SDK. Besides, MaxLeap  provides some special objects, like `MLUser`, `MLRole`, `MLFile` and `MLGeoPoint`. They are all based on `MLObject`.


### Why is  Cloud Data Nccessary
 Cloud Data can help you build and maintain the facility of your database, thus focus on the app service logic that brings real value.  The advantages can be summarized as follows:

* Sort out the deployment and maintenance of hardware resourses.
* Provide standard and complete data access API
* Unlike the traditional relational database, there's no class to be created ahead of time before storing data in cloud. Data objects in JSON format can be stored and retrieved easily as you wish.
* Realize the Hook of cloud data with the Cloud Code service（Please check [Cloud Code Guide](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA) for more details.） 

**If you want to learn more about MaxLeap Data Service SDK, please check [iOS Guide －  Cloud Data](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_EN) or [Android Guide －  Cloud Data](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_EN) for more details.**

##Class List
In Data of Dev Center, you can check the class list of your app:

![imgCDClassList.png](../../../images/imgCDClassList.png)

If the type of a property is MLRelation, then it is related to other MLObject. The value of this column will show as "View Relations". You can check all MLObject related to this property by clicking it.

![imgCDShowRelation.png](../../../images/imgCDShowRelation.png)

###Create/Edit Class
Click "+ Add Class" button, enter the Class name and then you've created the new class:

![imgCDAddClass.png](../../../images/imgCDAddClass.png)

After the creation of new Class, you can select the Class and do modifications as shown below:

* Add new column: add Class property
* Add new row: add new data
* Filter the data: click the hourglass icon 
* Choose column: click the Table button on the top right corner

###Delete Class 
Select the Class you want to delete in the Class table, choose More>>Del Class and then click Apply.

![imgCDDeleteClass](../../../images/imgCDDeleteClass.png)

## Next

**If you want to learn more about MaxLeap Data Service SDK, please check [iOS Guide －  Cloud Data](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_EN) or [Android Guide －  Cloud Data](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_EN) for more details.**
