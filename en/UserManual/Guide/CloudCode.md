# Cloud Code
##Introduction

###What is Cloud Code
Cloud Code refers to the code depolyed and executed on Leap Cloud. It can be used to realize the complicated service logic which should be executed in cloud. It is similar to the traditional Web Service or RESTful API that runs in Web Server. It provides access to external data sources through the RESTFul API and is also invoked with the same way by mobile apps.  

###Why is Cloud Code Necessary 

The service logic can be realized in client if the app is simple, while if the app requires more complicated service logic, want to access more data or need a number of multiplication, then Cloud Code is required. The advantages of Cloud Code can be summarized as follows:

* Powerful Computing ability: Cloud Code executes in Docker of Leap Cloud and supports multi-CPU and large memory.
* More Effective: Able to require Cloud Data reepeatedly with high speed network services in an invocation. The efficiency will be much improved. 
* The same set of code can provide services for iOS, Android, Website, etc. 

In App Management page, you can check, create and manage the cloud code and the relevant logs of each version.

**If you want to learn more about LC Cloud Code Service SDK, please check[Java Guide － Cloud Code](LC_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA) for more details.**

##Version Status
In Status report, we can check all cloud code that uploaded to the app. The report contains:

* Version Number: every cloud code has its specific version number which is defined in global.json in cloud code project
* Status: shows whether the relevant cloud code is deployed and running well. 
* Config: check the config file, global.json., of cloud code, including app name, app information (App ID/MasterKey), Cloud Code information (language/entry funciton/Package Hook/Package Entity) and the version info.
* Uploaded time


![imgCCJobList](../../../images/imgCCJobList.png)


##Scheduled Jobs
Schedule a job and set a specific time for it. 

####Check Scheduled Jobs List 
You can check your scheduled jobs and edit the job info by clicking it. 
![imgCCScheduleJob](../../../images/imgCCScheduleJob.png)

####Add Schedule 
Execute the job in Cloud Code by adding a schedule. During the adding, you need to provide:

* Name: the name of your job
* Job Function: the job name defined in Cloud Code
* Schedele TIme: the start time for your job
* Schedule Repeat: set the repeat mode of your job
* Parameter: the JSON parameter sent to cloud code

![imgCCScheduleJob](../../../images/imgCCScheduleJob.png)

##View Status
In Job Status, you can check your job name, function and results, including schedule time, end time and Status.

##Logs
You can check the following information with logs:

* Uploading/deployment information of Cloud Function
* Cache inforamtion of Hook Entities
* API inquiry information of cloud code
* Other logs recorded by log API in Cloud Code

Logs can be divided into three types: Info, Error and Warn.

##Functions
You can check the overview of job invocation in Cloud Code.

* Invoke Count Today
* Average Delay Today: The time difference between actual invoke time and scheduled time
* Action: The total invoke count of a function, including success and failure.

##Instances

##WhiteList
Once a job is added into the whitelist, Leap Cloud will not perform verification for `X-LC-AppId` and `X-LC-APIKey` in `Http Request Head`, while calling that job.

## Next

**If you want to learn more about LC Cloud Code Service SDK, please check [Java Guide － Cloud Code](LC_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA) for more details.**
