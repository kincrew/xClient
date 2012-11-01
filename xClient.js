/*
* xClient.js [SD05]
* 2012-11-01
* under construction
*/



(function(GLOBAL){


/* Global xClient Object */

var xClient = GLOBAL.xClient = function(a, b, c) {
	if (b) return xCient.create(a, b, c);
	else return xClient.name[a];
}

/* init value */
xClient.length = 0;


/* xClient object */
var _xClient = function(id, option, callback) {

}


/* xClient.utils */
xClient.utils = {};

xClient.utils.JSONP = function(url, callback, charset) {
	var CB = "callback=?",
		CBID = "xJSONP",
		HEAD = document.head;
	if (callback && typeof callback == "string") {
		charset  = callback;
		callback = undefined;
	}
	if (callback && url.indexOf(CB) > -1) {
		CBID += CBID + _RANDOM();
		url = url.replace(CB, "callback="+CBID);
		GLOBAL[CBID] = function(data){
			callback(data);
			delete GLOBAL[CBID];
			HEAD.removeChild(document.getElementById(CBID));
		}
	}
	var script = document.createElement('script');
	if (charset) script.setAttribute("charset", charset);
	script.setAttribute("id", CBID);
	script.setAttribute("src", url);
	HEAD.appendChild(script);
};

xClient.utils.YQL = function (query, callback, ssl) {
	var url = "://query.yahooapis.com/v1/public/yql?q=";
	url = (ssl) ? "http" + url : "https" + url;
}



/* inner Function  */

var _OJSON = {
	stringify : function(object) {
		if (this.enable) return JSON.stringify(object);
		else {
			var startCheck, result = '{';
			for (var key in object) {
				if (!startCheck) startCheck = true;
				else result += ", ";
				result += '"' + key + '" : "' + object[key] + '"';
			}
			return result += '}';
		}
	},
	parse  : function(jsonText) { 
		if (this.enable) return JSON.parse(jsonText);
		else return eval( "(" + jsonText + ")" );
	},
	enable : false 
}
if (GLOBAL.JSON) _JSON.enable = true;

var _RANDOM = function(n){
	return (new Date()).getTime() + "" +Math.floor(Math.random()*Math.pow(10, n || 3));
}

})(this);

