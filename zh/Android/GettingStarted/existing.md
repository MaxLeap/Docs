# 安装SDK

1. 下载并解压缩SDK，请确认您的目标平台为Gingerbread (android-9)及之后的版本。

    <a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/Android/v0.6/las-sdk-all.zip">下载SDK</a>

2. 添加SDK至您的应用
    ### Android Studio

    将下载的LAS-*.jar拖至应用的“libs”文件夹下，并添加以下代码到build.gradle

    ```groovy
    dependencies {
        compile fileTree(dir: 'libs', include: 'LAS-*.jar')
    }
    ```

    ### Eclipse
    
    将压缩文件提取到“libs”文件夹并将文件内容导入到已有的安卓项目中。如果您还没有“libs”文件夹，请在项目根目录下右击并选择New>Folder进行创建。
    
# 连接您的App到LAS
继续前，请先从右边的菜单栏选择您的LAS应用。上述步骤是为您的应用“TestLAS”准备的。

从您的Application类调用LASConfig.initialize的Oncreate方法来设定应用程序的ID以及密钥：

```java
public void onCreate() {
  LASConfig.initialize(this, "552747b460b287299ce86caa", "dndaRjhyNDEwZkhyNzc2UXFqWEtBdw");
}
```

如果您的应用未向INTERNET和ACCESS_NETWORK_STATE请求过许可，请先执行请求许可的操作。在AndroidManifest.xml的<application>标签前添加以下代码：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

# 测试SDK
安装好SDK后，拷贝以下代码到您的应用，例如Application.onCreate()中：

```java
LASObject testObject = new LASObject("TestObject");
testObject.put("foo", "bar");
LASDataManager.saveInBackground(testObject);
```

运行应用。一个新的TestObject对象将会被发送并保存到LAS云端。一切就绪后，请点击下面的按钮检测您的数据是否已被发送。