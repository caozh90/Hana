var json=JSON.parse($.request.body.asString());
var job_name = json.JOB_NAME;
var body;//记录response的返回值
var conn = $.db.getConnection();


var pcall1;
var privilegeExists;
//验证权限
var query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
	+'\'dsmonitor::admin\',?)';
pcall1 = conn.prepareCall(query);
pcall1.execute();
privilegeExists = pcall1.getNString(1);
if(privilegeExists ==='OK')
{

	var unlock_sp = 'call "DS_INFO"."cdp.ds.procedures::unlock"(?)'; 
	var pcall_unlock = conn.prepareCall(unlock_sp);
	try
	{
		pcall_unlock.setString(1,job_name);
		pcall_unlock.execute();
		pcall_unlock.close();
		$.response.setBody('The job has been released.');
		$.response.status = $.net.http.OK;
	}
	catch(e)
	{
		$.response.setBody('Released failed!');
		$.response.status = $.net.http.BAD_REQUEST;
	}
	conn.commit();
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}
pcall1.close();
conn.close();