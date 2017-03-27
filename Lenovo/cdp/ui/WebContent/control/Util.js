// util.js
jQuery.sap.declare("lenovo.control.Util");

Date.prototype.Format = function (fmt) {  
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
},

DateConvert = function(str){
    if(str.indexOf('Date') != -1)
    {
        var dateTime = new Date();
        dateTime.setTime(parseInt(str.substring(6,19)));
    }
    else {
        //str = 'aaa';
        var dateTime = new Date(str);
        if(dateTime == 'Invalid Date')
        {
            dateTime = new Date();
        }
    }
    return dateTime;
}

lenovo.control.Util = {
    sessionTimeout: function(){
        if ($("#timeout-notification").length === 0) {
            var s = encodeURIComponent(location.pathname+location.search+location.hash);
            $("body").append("<div id='timeout-notification'></div>");
                jQuery.sap.require("sap.ui.commons.MessageBox");
                var i = "Your session has expired. You will be forwarded to the logon page.";
                 sap.ui.commons.MessageBox.alert(i,
                    function() {
                        location.replace(location.origin + "/sap/hana/xs/formLogin/login.html?" + "x-sap-origin-location=" + s);
                    });
        }
    }
}