/**
 * Created by Leo on 2015/11/27.
 */

$(document).ready(function () {

    var pathName=window.location.pathname;
    var registerPathName = /^\/regnotify\?send_email_flag=success\&verify_email_address=[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(pathName.test(registerPathName)  ) {
        ga('send', 'event', 'Activation', 'Register', 'Done');
    }

    var homePathName = /^\/zh_cn\/index\.html$/;
    if(pathName.test(homePathName)  ) {
        ga('send', 'event', 'Acquisition', 'HomeVisit', 'Enter');
    }

});