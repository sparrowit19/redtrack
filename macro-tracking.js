//get data
function replaceMacro(str, macro, value) {
   return str.replace(macro, value);
}
function getSystemInfo() {
   agent = {
      browser: {
         name: null,
         version: null,
         v: null,
         userAgent: null,
         app: null,
         os: null,
      },
      mobile: false,
      pointlock: false,
   };

   var nVer = navigator.appVersion;
   var nAgt = navigator.userAgent;
   var browserName = navigator.appName;
   var fullVersion = "" + parseFloat(navigator.appVersion);
   var majorVersion = parseInt(navigator.appVersion, 10);
   var nameOffset, verOffset, ix;
   agent.pointlock =
      "pointerLockElement" in document ||
      "mozPointerLockElement" in document ||
      "webkitPointerLockElement" in document;

   // In Opera, the true version is after "Opera" or after "Version"
   if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
         fullVersion = nAgt.substring(verOffset + 8);
   }
   // In MSIE, the true version is after "MSIE" in userAgent
   else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
   }
   // In Chrome, the true version is after "Chrome"
   else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
   }
   // In Safari, the true version is after "Safari" or after "Version"
   else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
         fullVersion = nAgt.substring(verOffset + 8);
   }
   // In Firefox, the true version is after "Firefox"
   else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
   }
   // In most other browsers, "name/version" is at the end of userAgent
   else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
   ) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
         browserName = navigator.appName;
      }
   }
   // trim the fullVersion string at semicolon/space if present
   if ((ix = fullVersion.indexOf(";")) != -1)
      fullVersion = fullVersion.substring(0, ix);
   if ((ix = fullVersion.indexOf(" ")) != -1)
      fullVersion = fullVersion.substring(0, ix);

   majorVersion = parseInt("" + fullVersion, 10);
   if (isNaN(majorVersion)) {
      fullVersion = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
   }
   agent.browser.name = browserName;
   agent.browser.version = fullVersion;
   agent.browser.v = majorVersion;
   agent.browser.app = navigator.appName;
   agent.browser.userAgent = navigator.userAgent;
   var OSName = "Unknown OS";
   if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
   if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
   if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
   if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

   agent.browser.os = OSName;
   agent.mobile =
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1;
   return agent;
}
function getParameterByName(url, name) {
   name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
   return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getTrackingLink() {
   // var scripts = document.getElementsByTagName("script");
   // var len = scripts.length;
   // var absoluteAddr = "";
   
   // for (var i = 0; i < len; i++) {
   //    if (
   //       scripts[i].src.indexOf("https://cdn.jsdelivr.net/gh/sparrowit19/redtrack") > -1
   //    ) {
   //       absoluteAddr = scripts[i].src;
   //       break;
   //    }
   // }
   // //console.log(absoluteAddr);
   // return decodeURIComponent(getParameterByName(absoluteAddr, "tracking"));
   return "https://g.jp.miaozhen.com/x/k=3005949&p=6qlmo&dx=0&rt=2&ns=__IP__&ni=__IESID__&v=__LOC__&tr=__REQUESTID__&dv=20&mo=__OS__&m0=__OPENUDID__&m0a=__DUID__&m1=__ANDROIDID1__&m1a=__ANDROIDID__&m2=__IMEI__&m6=__MAC1__&m6a=__MAC__&m4=__AAID__&m5=__IDFA__&o=__TIMESTAMP__";
}
function getUrl() {
   var _document = null;
   try {
      _document = window.top.document;
   } catch (error) {
      _document = document;
   }
   return _document.location.href
      ? encodeURIComponent(_document.location.href)
      : "";
}
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xhttp.responseText);
      var tracking = getTrackingLink();
      //console.log(tracking);
      var agent = getSystemInfo();
      tracking = replaceMacro(tracking, "__IP__", data.ip);
      tracking = replaceMacro(tracking, "__LOC__", getUrl());
      tracking = replaceMacro(tracking, "__OS__", agent.browser.os);
      tracking = replaceMacro(tracking, "__TIMESTAMP__", new Date().getTime());
      //console.log(data);
      //console.log(agent);
      console.log(tracking);
      var img = document.createElement("img");
      img.src = tracking;
   }
};
//https://www.cloudflare.com/cdn-cgi/trace
//https://api.db-ip.com/v2/free/self
xhttp.open("GET", "https://ipinfo.io/json", true);
xhttp.send();
