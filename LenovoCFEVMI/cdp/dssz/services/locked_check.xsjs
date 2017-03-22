/***
 * 检查调用的DS是否locked
 */
var json=JSON.parse($.request.body.asString());

var conn = $.db.getConnection();
var process_name = json.PROCESS_NAME;
//传入的参数：job_name
var job_name = json.JOB_NAME;
var locked = 0;

var locked_sp = 'call "DS_INFO_SZ"."cdp.dssz.procedures::job_locked_re"(?,?)';
var pcall_locked = conn.prepareCall(locked_sp);
try
{
	pcall_locked.setString(1,job_name);
	pcall_locked.execute();
	locked = pcall_locked.getInteger(2);
	pcall_locked.close();
	conn.commit();
	conn.close();
	$.response.setBody(locked);
	$.response.status = $.net.http.OK;
}
catch(e)
{
	$.response.setBody(e.message);
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}


$.response.contentType = "application/json; charset=UTF-8";
