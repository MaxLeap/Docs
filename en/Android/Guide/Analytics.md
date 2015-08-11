
# Analytics

### Install SDK

Please make sure that you have integrated LeapCloud Core lib. If not, please check [Android QuickStart](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID) or [Android QuickStart](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)to integrate it.

### Set AndroidManifest.xml File

```xml
<application>
    <meta-data
        android:name="LC_channel"
        android:value="your channel id">
    </meta-data>
    ...
</application>
```

Enter the cunstomized Channle name in `LC_channel` ,such as google_play and etc.

### Count Session

Add following code in `nPause()`  and  `onResume()` of each Activity：

```java
@Override
protected void onPause() {
  super.onPause();
  LCAnalytics.onPause(this);
}
@Override
protected void onResume() {
  super.onResume();
  LCAnalytics.onResume(this);
}
```

If sessions are running at over 30 seconds intervals, then those two sessions will be considered as two seperated ones. For example, users may keep the app in background, try another app and go back after a while.

### Analyze Page View

Add following code at the start of each page

```java
LCAnalytics.onPageStart(pageName);
```
Add following code at the end of each page

```java
LCAnalytics.onPageEnd(pageName);
```

The pageName refers to the pagename customized by users.

It should be noted that there should be no linear crossing contained in all invocations we just mentioned. Every start matches an end.

### How to count Session and Page View at the same time

#### Apps only Composed of Activities

Add following code in each Activity

```java
@Override
protected void onPause() {
  super.onPause();

  LCAnalytics.onPause(this); //Count Session Duration
  LCAnalytics.onPageEnd(pageName); //Count Page View
}
@Override
protected void onResume() {
  super.onResume();

  LCAnalytics.onResume(this);
  LCAnalytics.onPageStart(pageName);
}
```

#### Apps composed of Activity and Fragment

Add following code in each Activity

```java
@Override
protected void onPause() {
  super.onPause();

  LCAnalytics.onPause(this); //Count Session Duration
}
@Override
protected void onResume() {
  super.onResume();

  LCAnalytics.onResume(this);
}
```

Add following code in each Fragment

```java
@Override
protected void onPause() {
  super.onPause();

  LCAnalytics.onPageEnd(pageName); //Count Page View
}
@Override
protected void onResume() {
  super.onResume();

  LCAnalytics.onPageStart(pageName);
}
```

### Customized Events

```java
LCAnalytics.logEvent(eventId, eventCount, dimensions);
```

- `eventId` is the name of the event
- `eventCount` is the frequency of the event
- `dimensions` belongs to `Map<String, String>`，it refers to other informations related to this event

e.g.

```java
Map<String, String> dimensions = new HashMap<String, String>();
dimensions.put("code", "404");
dimensions.put("message", "page not found");
int count = 1;
LCAnalytics.logEvent("error", count, dimensions);
```
