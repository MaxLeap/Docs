---
title: Quick Start | ZCloud Javascipt SDK

language_tabs:
  - javascript

search: true
---

# Use AppCloud SDK in Web browser

1. Download the SDK [blank Project](https://appcloud.io/blank-project-js.js), Add the following script tag into the <head> of the main page:

    ```javascript
    <script src="https://appcloud.io/scripts/lib/appcloud.min.js"></script>
    ```

2. Select your app at the top of this page, and initialize the SDK as follow, and then you are ready to create AppCloud Object.

    ```javascirpt
    AC.initialize("appid", "javascript key");
    ```

        - You can find your Application Key in Web Console, go to Settings - [Application Keys](https://console.appcube.io/settings/apps/appid#application)

3. Copy and paste this code in your script, after AC Object initialized.

    ```javascript
    var TestObject = AC.Object.extend("Garguantuan");
    vat testObject = new TestObject();
    testObject.save({genre: "black hole"}, {
      success: function(object) {
        console.log("I'm in high dimension space!");
      }
    });
    ```

4. Run your app, you can check your just-created data in [Web Console](https://console.appcube.io/clouddata)

5. Next: check other features: [Analytics](https://console.appcube.io/analytics), [Preference](https://console.appcube.io/settings)

# Use AppCloud SDK in Node.js

1. add SDK module info in package.json

    ```javascript
    "avoscloud-sdk":"latest"
    ```

2. require the SDK

    ```javascript
    var AC = require('appcloud-sdk').AC;
    AC.initialize("appid", "javascript key");
    ```

3. Copy and paste this code in your script, after AC Object initialized.

    ```javascript
    var TestObject = AC.Object.extend("Garguantuan");
    vat testObject = new TestObject();
    testObject.save({genre: "black hole"}, {
      success: function(object) {
        console.log("I'm in high dimension space!");
      }
    });
    ```

4. Run your app, you can check your just-created data in [Web Console](https://console.appcube.io/clouddata)

5. Next: check other features: [Analytics](https://console.appcube.io/analytics), [Preference](https://console.appcube.io/settings)