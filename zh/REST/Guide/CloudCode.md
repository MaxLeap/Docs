# 云代码
下面根据具体 API 在更新

## API 列表

### 云函数

URL |	HTTP|	功能
------|--------|--------
`/functions/<name>`	| POST|	调用云函数
`/jobs/<name>`|	POST|	执行job


## API 详解

### 调用云函数
云函数是运行在 MaxLeap 上的代码,可以使用它来实现各种复杂逻辑。用户在上传完云代码后,可以通过REST API来调用云端定义的函数,以JAVA版本为例,当你使用CloudCode-SDK(如何使用请参考[云代码 SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA#FUNCTION))定义了一个function:

    //定义一个简单的function:返回输入数据
    defineFunction("hello", new MLHandler<Request, Response>() {
        @Override
        public Response handle(Request request) {
            Response<String> response = new MLResponse<>(String.class);
            response.setResult(request.parameter(String.class));
            return response;
        }
    });

部署该云代码后,通过API调用该云函数如下:

    curl -X POST \
          -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
          -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
          -H "Content-Type: application/json" \
          -d '{ "name": "真皮沙发","price": 1000,"producer": "法国巴黎"}' \
          https://api.maxleap.cn/2.0/functions/hello

云函数会返回结果:`{ "name": "真皮沙发","price": 1000,"producer": "法国巴黎"}`

使用云函数,你必须在请求头里指定你的appId和相应的key方可有权限调用,但同时云代码支持白名单模式,你可以将函数的某个调用方式添加至白名单(如何添加至白名单请参阅[云代码-白名单](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_CODE_ZH_WHITELIST)),添加后,当请求调用该函数时,将不进行http请求头中X-ML-AppId和X-ML-APIKey的校验,这一般用于回调请求,比如你调用银联支付接口设置了回调地址为MaxLeap的云函数地址(`http://api.maxleap.cn/2.0/functions/hello?LASAppId=569d84a0169e7d00012c7afe`),这是一个URL,银联方在完成支付请求后会通过GET方式来回调该地址,这个GET请求只需添加query参数LASAppId来标示该请求的云函数所属app即可,这样你可以在不提供相关应用key的安全前提下通过白名单云函数来接受第三方回调请求.

### 执行job
云代码中，您还可以自定义后台任务，它可以很有效的帮助您完成某些重复性的任务，或者定时任务。如深夜进行数据库迁移，每周六给用户发送打折消息等等。您也可以将一些耗时较长的任务通过Job来有条不紊地完成。用户在上传完云代码后,可以通过REST API来调用云端定义的后台任务,以JAVA版本为例,当你使用CloudCode-SDK(如何使用请参考[云代码 SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA#JOB))定义了一个background job:

    //定义一个简单的job
    defineJob("helloJob", new MLHandler<Request, Response>() {
        @Override
        public Response handle(Request request) {
            Response response = new MLResponse(String.class);
            response.setResult("hello job");
            return response;
        }
    });
    
部署该云代码后,通过API调用该任务如下:

    curl -X POST \
          -H "X-ML-AppId: 569d84a0169e7d00012c7afe" \
          -H "X-ML-APIKey: MjVvSjJUMTZveUR2d1hoNlVoQ0R1QQ" \
          -H "Content-Type: application/json" \
          https://api.maxleap.cn/2.0/jobs/helloJob

云函数会返回结果:`hello job`

MaxLeap不建议你通过rest api方式来调用background job,而是通过console界面上创建后台任务来替代,一方面通过rest api调用job这是一个同步接口,如果你的后台任务需要比较长时间执行,你得到的响应可能便是超时,而通过后台界面执行任务是异步方式,你不但可以方便管理你的后台任务,同时也能清楚的追踪你的任务状态,详情请见[云代码-任务](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#CLOUD_CODE_ZH_JOB)

### 补充说明
在调用云函数/执行Job时POST请求所传递数据必须符合application/json格式