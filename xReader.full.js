/*
* xReader.full.js [SD05]
* 2012-11-03

Copyright (c) <2012> <oneiroi@outlook.com, http://bootleg.egloos.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/


(function(g){

var headElement = document.getElementsByTagName("head")[0];
var $ = function(e) { return document.getElementById(e)};


g.xReader = function() {
	var option = {
		id     : _ID()
	}
	for (var i=0; i < arguments.length; i++) {
		var argument = arguments[i];
		switch (typeof argument) {
			case "string" :
				if (option.url) option.css = argument;
				else option.url = (argument.indexOf("http") == 0 ) ? argument : "http://" + argument;
				break;
			case "function" :
				if (option.callback) option.error = argument;
				else option.callback = argument;
				break;
			case "object" :
				for (var i in argument) option[i] = argument[i];
				break;
		}
	}
	option.table = (option.table === false) ? "" : option.table || "http://kincrew.github.com/xClient/xClient.xml";
	option.ua    = (option.ua == "current") ? navigator.userAgent : option.ua;
	option.status = "init";

	g[option.id]  = function(data) {
		option.result = data;
		if (data.error) option.problem = data;
		excute(data, option);
	}
	YQL(option);
	option.timerId = setTimeout(function(){
		option.status = "error";
		option.result = option.problem = {error:{lang:"en-US", description:"timeout"}};
		excute(option.problem, option);
	}, option.timeout || xReader.timeout || 10000); //option.timeout || xReader.timeout || 
}

var query = function(option, encode) {
	var statement = "";
	statement = (option.table) ? "USE '" + option.table + "' AS xReader;" : "";
	if (option.query) {
		statement = option.query + statement;
		return option.statement = (encode) ? encodeURIComponent(statement) : statement;
	}
	statement += option.query || "SELECT * FROM xReader WHERE url='" + option.url + "'";
	if (option.format)  statement += " AND format='" + option.format + "'";
	if (option.ua)      statement += " AND ua='" + option.ua + "'";
	if (option.method)  statement += " AND method='" + option.method + "'";
	if (option.css)     statement += " AND css='" + option.css + "'";
	if (option.tidy)    statement += " AND tidy='1'";
	if (option.charset) statement += " AND charset='" + option.charset + "'";
	if (option.referer) statement += " AND referer='" + option.referer + "'";
	if (option.headers) statement += " AND headers='" + oJSON(option.headers) + "'";
	if (option.cookie)  statement += " AND cookie='" + oJSON(option.cookie) + "'";
	if (option.params)  statement += " AND params='" + oJSON(option.params) + "'";
	if (option.timeout) statement += ' AND timeout="' + option.timeout + '"';
	if (option.content) statement += ' AND content="' + encodeURIComponent(content) + '"';
	option.query = statement;
	return option.statement = (encode) ? encodeURIComponent(statement) : statement;
}

/* JSON */
var oJSON = function(target) {
	if (typeof target != "string") {
		if (oJSON.ecma5) return JSON.stringify(target);
		var result = '{', check;
		for (var key in target) {
			if (!check) check = true;
			else result += ',';
			result += '"'+key+ '" : "' + target[key] +  '" ';
		}
		return result + ' }';
	} else {
		return (oJSON.ecma5) ? JSON.parse(target) : eval('('+target+')');
	}
};
if (window.JSON) oJSON.ecma5 = true;

var _ID = function() {
	return "_" + (new Date()).getTime() + Math.floor(Math.random()*100);
}

var YQL = function(option){
	var script = option.script = document.createElement('script');
	var src = "query.yahooapis.com/v1/public/yql?q=" + query(option, true) + "&format=json&callback="+ option.id;
	src = (option.ssl) ? "http://" + src : "https://" + src;
	script.setAttribute("charset", "utf-8");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("id", "xR" + option.id);
	script.setAttribute("src", src);
	headElement.appendChild(script);
}

var excute = function(data, option) {
	clear(option);
	if (option.problem && option.error) {
		option.error(data, option);
		option.status = "error";
	} else {
		if (option.target) option.target.innerHTML = data.query.results && data.query.results.resources.content;
		if (option.callback) {
			if (option.problem) option.callback(option.problem, option);
			else {
				option.status = "finish";
				if (option.format == "json" || option.format == "jsonp") option.callback(oJSON(data.query.results.resources.content), option);
				else option.callback(data.query.results.resources, option);
			}
		}
	}
}

var clear = function(option) {
	clearTimeout(option.timerId);
	headElement.removeChild(option.script);
	delete g[option.id];
}

})(this);