/***
 * where use report
 * **/
$.import('cdp.ebgcfe.service.upload', 'uploadLib');
var lib = $.cdp.ebgcfe.service.upload.uploadLib;


var json=JSON.parse($.request.body.asString());

var data = json.data;
var body = "";
var result = "";
var i;
for(i=0;i<data.length;i++)
{ 
	if ( data[i].PartNumber !== undefined )
	{
		result = result + lib.processData(data[i].PartNumber) + ",";
	}
}
if(result !== "")
{
	result = result.substring(0,result.length-1);
	$.response.status = $.net.http.OK;
	body = result;
}
else
{
	$.response.status = $.net.http.BAD_REQUEST;
	body = "column name should be PartNumber";
}

$.response.contentType = "application/json; charset=UTF-8";
$.response.setBody(body);