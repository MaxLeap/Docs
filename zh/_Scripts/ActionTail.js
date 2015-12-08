/**
 * Created by Leo on 2015/11/27.
 */

$(document).ready(function () {

    var pathName=window.location.pathname;
    var registerPathName = /^https:\/\/maxleap.cn\/regnotify\?send_email_flag=success\&verify_email_address=[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(pathName.match(registerPathName)  ) {
        ga('send', 'event', 'Activation', 'RegisterDone', 'Succeed');
    }

});