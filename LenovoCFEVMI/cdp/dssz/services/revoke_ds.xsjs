/***
 * DS的monitor页面，出错时重新调用DS
 */
var json=JSON.parse($.request.body.asString());
var body;//记录response的返回值

//获取任务类型和流程名
var job_type = json.JOB_TYPE;
var process_name = json.PROCESS_NAME;
//重新调用时需要传入的参数：job_name和G_STARTFROMSTEP
var job_name = json.JOB_NAME;
var G_STARTFROMSTEP = json.G_STARTFROMSTEP;
//并行任务的stepid
var G_STARTFROMSUBSTEP = json.G_STARTFROMSUBSTEP;
 


//DB info
var query = '';
var conn = $.db.getConnection();

//DS info
var host;
var webserver_port;
var url_path_postfix;
var url; // host + webserver_port + url_path_postfix
var cms_port;
var cms_authentication;
var cms_system;
var repo_name;
var job_server;
var server_group;
var DS_server;
var userName;
var passwd;

//DS job info
var G_JOB_INIT_FLAG;
var G_DEBUG;
var G_IVID;
var G_WFNAME;

var client;
var req;

var log_on_body;
var log_on_response;
var run_body;
var run_response;

var sessionID='';
var current_user;
//获取session的user
var user_sql = 'select session_user from dummy';
var pcall_user = conn.prepareStatement(user_sql);
var rs_user = pcall_user.executeQuery();
if(rs_user.next())
{
	current_user = rs_user.getNString(1);
}
rs_user.close();
pcall_user.close();


function run_job()
{
	req.setBody(run_body);
	req.headers.set('SOAPAction','jobAdmin=Run_Batch_Job');
	
	client.request(req,url);
	run_response = client.getResponse();
	
	
	/**
	 * 检测调用的DS是否报错，检测errorMessage是否有信息
	 * 如果有错，弹出错误信息
	 *
	var errMsg;

	var run_response_string = run_response.body.asString();
	var sig1 = run_response_string.indexOf('<errorMessage></errorMessage>');
	var sig2 = run_response_string.indexOf('<errorMessage/>');
	if(sig1<0 && sig2<0)
	{
		try
		{
			var msg1 = run_response_string.indexOf('<errorMessage>');
			var msg2 = run_response_string.indexOf('</errorMessage>');
			if(msg1>0)//以第一种的方式显示。错误信息在两个“<>”之间
			{
				errMsg = run_response_string.substring(msg1+14,msg2);//14是“<errorMessage>”的长度
			}
			else
			{
				msg1 = run_response_string.indexOf('<errorMessage');
				run_response_string = run_response_string.substring(msg1);
				msg2 = run_response_string.indexOf('/');
				errMsg = run_response_string.substring(13,msg2);
				
			}
			$.response.setBody("Invoke Failed:"+errMsg);
			$.response.status = $.net.http.BAD_REQUEST;
			return;
		}
		catch(e)
		{
			$.response.setBody("Invoke Failed!");
			$.response.status = $.net.http.BAD_REQUEST;
			return;
		}
	}
	
	 */
	var logoff_body='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		+'\n'+'<soapenv:Header>'
		+'\n'+'<ser:session>'
		+'\n'+'<SessionID>'+sessionID+'</SessionID>'
		+'\n'+'</ser:session>'
		+'\n'+'</soapenv:Header>'
		+'\n'+'<soapenv:Body>'
		+'\n'+'<ser:Logout_Input/>'
		+'\n'+'</soapenv:Body>'
		+'\n'+'</soapenv:Envelope>';
	
	req.setBody(logoff_body);
	req.headers.set('SOAPAction','function=Logout');
	
	client.request(req,url);
//	var off_response = client.getResponse();
	
	body = 'Finished! You can check the result';
	$.response.status = $.net.http.OK;
}
    
//重新调用DS的主函数
function retrigger()
{ 
	query = 'select top 1 * from "_SYS_BIC"."cdp.dssz.models/AT_HANA_DS_CON_INFO"';
	var pcall = conn.prepareStatement(query); 
	var rs = pcall.executeQuery();
	
	if(rs.next())
	{
		//Step1. 拼写URL
		host = rs.getNString(1);
		webserver_port = rs.getNString(2);
		url_path_postfix = rs.getNString(3);
		url = 'http://'+ host +':'+ webserver_port + url_path_postfix;
		//Step2.拼写cms_system
		cms_port = rs.getNString(4);
		cms_system = host+':'+cms_port;
		userName = rs.getNString(5);
		passwd = rs.getNString(6);
		cms_authentication = rs.getNString(8);
		repo_name = rs.getNString(9);
		job_server = rs.getNString(10);
		server_group = rs.getNString(11);
		//JOBSERVER和SERVERGROUP任选一个
	}
	
	//Log on
	log_on_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		   +'\n'+'<soapenv:Header/>'
	   +'\n'+'<soapenv:Body>'
	   +'\n'+'<ser:LogonRequest>'
	   +'\n'+'<username>'+userName+'</username>'
	   +'\n'+' <password>'+passwd+'</password>'
	   +'\n'+'<cms_system>'+cms_system+'</cms_system>'
	   +'\n'+' <cms_authentication>'+cms_authentication+'</cms_authentication>'
	   +'\n'+'</ser:LogonRequest>'
	   +'\n'+'</soapenv:Body>'
	   +'\n'+'</soapenv:Envelope>';
	
	client = new $.net.http.Client();
	req =new $.web.WebRequest($.net.http.POST,'');
	req.setBody(log_on_body);
	req.headers.set('SOAPAction','function=Logon');
	client.request(req,url);
	
	log_on_response = client.getResponse();
	var temp = log_on_response.body.asString();
	var pos1 = temp.indexOf('<SessionID>');
	var pos2 = temp.indexOf('</SessionID>');
	
	if(pos1>0 && pos2>0)
	{
		sessionID = temp.substring(pos1+11,pos2);
	}
	else
	{
		body = 'Log on failed!';
		$.response.status = $.net.http.BAD_REQUEST;	
		return;
	}
	
	query = 'select top 1 * from "_SYS_BIC"."cdp.dssz.models/AT_HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
	var pcall_job = conn.prepareStatement(query);
	var rs_job = pcall_job.executeQuery();
	if(rs_job.next())
	{
		G_JOB_INIT_FLAG = rs_job.getNString(3);
		G_DEBUG = rs_job.getNString(4);
		G_IVID = rs_job.getNString(6);
		G_WFNAME = rs_job.getNString(7);
	}
	
if(server_group !== null && server_group.length >0)
{	
	 run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
		  +	'xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		  +'\n'+'<soapenv:Header>'
		  +'\n'+'<ser:session>'
		  +'\n'+'<SessionID>'+sessionID+'</SessionID>'
		  +'\n'+'</ser:session>'
		  +'\n'+'</soapenv:Header>'
		  +'\n'+'<soapenv:Body>'
		  +'\n'+'<ser:RunBatchJobRequest>'
		  +'\n'+'<jobName>'+job_name+'</jobName>'
		  +'\n'+'<!--Optional:-->'
		  +'\n'+'<repoName>'+repo_name+'</repoName>'
		  +'\n'+'<!--You have a CHOICE of the next 2 items at this level-->'
		  +'\n'+'<serverGroup>'+server_group+'</serverGroup>'
		  +'\n'+'<!--Optional:-->'
		  +'\n'+'<globalVariables>'
		  +'\n'+'<!--Zero or more repetitions:-->'
		  +'\n'+'<variable name="G_JOB_INIT_FLAG">'+G_JOB_INIT_FLAG+'</variable>'
		  +'\n'+'<variable name="G_DEBUG">'+G_DEBUG+'</variable>'
		  +'\n'+'<variable name="G_IVID">'+G_IVID+'</variable>'
		  +'\n'+'<variable name="G_STARTFROMSTEP">'+G_STARTFROMSTEP+'</variable>'
		  +'\n'+'<variable name="G_STARTFROMSUBSTEP">'+G_STARTFROMSUBSTEP+'</variable>'
		  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
		  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
		  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
		  +'\n'+'</globalVariables>'
		  +'\n'+'</ser:RunBatchJobRequest>'
		  +'\n'+'</soapenv:Body>'
		  +'\n'+'</soapenv:Envelope>';
	
	run_job();
	conn.close();
}
else if(job_server !== null || job_server.length >0)
{
	run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
		  +	'xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
		  +'\n'+'<soapenv:Header>'
		  +'\n'+'<ser:session>'
		  +'\n'+'<SessionID>'+sessionID+'</SessionID>'
		  +'\n'+'</ser:session>'
		  +'\n'+'</soapenv:Header>'
		  +'\n'+'<soapenv:Body>'
		  +'\n'+'<ser:RunBatchJobRequest>'
		  +'\n'+'<jobName>'+job_name+'</jobName>'
		  +'\n'+'<!--Optional:-->'
		  +'\n'+'<repoName>'+repo_name+'</repoName>'
		  +'\n'+'<!--You have a CHOICE of the next 2 items at this level-->'
		  +'\n'+'<jobServer>'+job_server+'</jobServer>'
		  +'\n'+'<!--Optional:-->'
		  +'\n'+'<globalVariables>'
		  +'\n'+'<!--Zero or more repetitions:-->'
		  +'\n'+'<variable name="G_JOB_INIT_FLAG">'+G_JOB_INIT_FLAG+'</variable>'
		  +'\n'+'<variable name="G_DEBUG">'+G_DEBUG+'</variable>'
		  +'\n'+'<variable name="G_IVID">'+G_IVID+'</variable>'
		  +'\n'+'<variable name="G_STARTFROMSTEP">'+G_STARTFROMSTEP+'</variable>'
		  +'\n'+'<variable name="G_STARTFROMSUBSTEP">'+G_STARTFROMSUBSTEP+'</variable>'
		  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
	 	  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
		  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
		  +'\n'+'</globalVariables>'
		  +'\n'+'</ser:RunBatchJobRequest>'
		  +'\n'+'</soapenv:Body>'
		  +'\n'+'</soapenv:Envelope>';
	if(G_STARTFROMSTEP ===0)
	{
		run_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
			  +	'xmlns:ser="http://www.businessobjects.com/DataServices/ServerX.xsd">'
			  +'\n'+'<soapenv:Header>'
			  +'\n'+'<ser:session>'
			  +'\n'+'<SessionID>'+sessionID+'</SessionID>'
			  +'\n'+'</ser:session>'
			  +'\n'+'</soapenv:Header>'
			  +'\n'+'<soapenv:Body>'
			  +'\n'+'<ser:RunBatchJobRequest>'
			  +'\n'+'<jobName>'+job_name+'</jobName>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<repoName>'+repo_name+'</repoName>'
			  +'\n'+'<!--You have a CHOICE of the next 2 items at this level-->'
			  +'\n'+'<jobServer>'+job_server+'</jobServer>'
			  +'\n'+'<!--Optional:-->'
			  +'\n'+'<globalVariables>'
			  +'\n'+'<!--Zero or more repetitions:-->'
			  +'\n'+'<variable name="G_JOB_INIT_FLAG">'+G_JOB_INIT_FLAG+'</variable>'
			  +'\n'+'<variable name="G_DEBUG">'+G_DEBUG+'</variable>'
			  +'\n'+'<variable name="G_IVID">'+G_IVID+'</variable>'
			  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
		 	  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
			  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
			  +'\n'+'</globalVariables>'
			  +'\n'+'</ser:RunBatchJobRequest>'
			  +'\n'+'</soapenv:Body>'
			  +'\n'+'</soapenv:Envelope>';
		
		
		
	}
	
	run_job();
	conn.close();
}
else//JOBSERVER和SERVERGROUP至少一个不能为null
{
	body = 'JOBSERVER and SERVERGROUP are both null';
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	return;
}

}
 
function unlock()
{
	var unlock_sp = 'call "DS_INFO_SZ"."cdp.dssz.procedures::unlock"(?)'; 
	var pcall_unlock = conn.prepareCall(unlock_sp);
	pcall_unlock.setString(1,job_name);
	pcall_unlock.execute();
	pcall_unlock.close();
	conn.commit();

}
 
var pcall1;
var privilegeExists;
//验证权限
query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
	+'\'dsmonitor::admin\',?)';
pcall1 = conn.prepareCall(query);
pcall1.execute();
privilegeExists = pcall1.getNString(1);
if(privilegeExists ==='OK')
{
	if(job_type === 'REVOKE')
	{
		try
		{
			unlock();//先解锁
			retrigger();
		}
		catch(e)
		{
			body = e.message;
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		}
		$.response.setBody(body);
		$.response.contentType = "application/json; charset=UTF-8";
	}	
	else 
	{
		body = 'Bad request!';
		$.response.status = $.net.http.BAD_REQUEST;	
	}
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}
