/***
 * 从VMI或CFE页面调用DS
 */

var json=JSON.parse($.request.body.asString());

//DB info
var query = '';
var conn = $.db.getConnection();

//获取任务类型和流程名
var job_type = json.JOB_TYPE;
var process_name = json.PROCESS_NAME;
var TABLE_NAME = json.TABLE_NAME;
var SEGMENT_NAME = json.SEGMENT_NAME;
var view_name = json.VIEW_NAME;
var P_KEY = json.P_KEY;

/*
 * 
 * 
 * 2015-2-25 menhaopeng 
	Balance Failed Dispatches  ------------->CONFIRM ---BALANCE_DISPATCH
	Failed Pull Confirmation Resubmission-------------->COMPLETED ---CLEAR_DIFF ..ok
	Failed Pull Resubmission------------------------->COMPLETED ---PULL_LINE ....ok
	Line To Excess Failed Dispatches ----------->CONFIRM --SPECIAL_DISPATCH
	Confirm Balance Dispatches --------------->CONFIRM
	Confirm Line to Excess Dispathes--------------->CONFIRM
	Confirmed Dispatches------------------------>CONFIRM
	Failed Dispatch---------------------------->CONFIRM
	LOI Failed GR------------------------------>NEW
	SOI Failed GR----------------------------->NEW
	UI_URGENT_MO_PULL----------------------------->RUNNING

 */
var status = 'CONFIRM';
var ecc_status = 'XI_IN_PROCESS'; //just for "Failed Pull Resubmission"页面
if(TABLE_NAME==='SZEBGVMI.LOI_GR' || TABLE_NAME === 'SZEBGVMI.SOI_GR')
{
	status = 'NEW';
}
if(TABLE_NAME==='SZEBGVMI.CLEAR_DIFF' || TABLE_NAME==='SZEBGVMI.PULL_LINE')
{
	status = 'COMPLETED';
}
if(TABLE_NAME ==='SZEBGVMI.UI_URGENT_MO_PULL')//目前，这个页面单独调用DS
{
	status = 'RUNNING';
}

var privilegeCheck = 'test';


switch (view_name)
{
	case 'loiFailedGR':
		privilegeCheck = 'loifailed::confirm';
		break;
	case 'soiFailedGR':
		privilegeCheck = 'soifailed::confirm';
		break;
	case 'failedPullConfirmationResubmission':
		privilegeCheck = 'failedpullconfirmationresubmission::confirm';
		break;
	case 'failedPullResubmission':
		privilegeCheck = 'failedpullresubmission::confirm';
		break;
	case 'failedDispatches':
		privilegeCheck = 'faileddispatches::confirm';
		break;
	case 'linetoExcessFailedDispatches':
		privilegeCheck = 'linetoexcessfaileddispatches::access';
		break;
	case 'balanceFailedDispatches':
		privilegeCheck = 'balancefaileddispatches::confirm';
		break;
	case 'confirmBalanceDispatches':
		privilegeCheck = 'confirmbalancedispatches::confirm';
		break;
	case 'confirmDispatches':
		privilegeCheck = 'confirmdispatches::confirm';
		break;
	case 'confirmLinetoExcessDispatches':
		privilegeCheck = 'confirmlinetoexcessdispatches::confirm';
		break;
}



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
var job_name;
var G_JOB_INIT_FLAG;
var G_DEBUG;
var G_STARTFROMSTEP;
var G_IVID;
var G_WFNAME;

var client;
var req;

var log_on_body;
var log_on_response;
var run_body;
var run_response;
var locked; //表示该job是否被锁住
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
	var run_response_string = run_response.body.asString();//获取response的内容
	//Log off
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
	
	/**
	 * 检测调用的DS是否报错，检测errorMessage是否有信息
	 * 如果有错，弹出错误信息
	 */
	var errMsg;
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
	
	var locked_sp = 'call "DS_INFO_SZ"."cdp.dssz.procedures::job_locked"(?,?)';
	var pcall_locked = conn.prepareCall(locked_sp);
	pcall_locked.setString(1,process_name);
	pcall_locked.execute();
	locked = pcall_locked.getInteger(2);
	pcall_locked.close();
	
	$.response.setBody("Finished! You can check the result");
	if(locked ===1)
	{
		$.response.setBody("Finished! A locked TS has been triggered, please contact administrator.");
	}
	$.response.status = $.net.http.OK;
}

//调用DS的主函数
function trigger()
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
		
		//修改表中对应记录的状态值	
		var temp, assignment='';
		var update_query,update_status_sp,pcall_update;
		var pcall_modified_info,modified_info_sp;
		var i;
		for(i=0;i<P_KEY.length;i++)
		{
			//首先，初始化where子句
			assignment='';
			//生成修改目标表状态的update语句
			for(temp in P_KEY[i])
			{	
				if(P_KEY[i].hasOwnProperty(temp)){
				assignment = assignment + temp +' = \'\''+ P_KEY[i][temp] +'\'\' AND ';
				}
			}
			assignment = assignment.substring(0,assignment.length-5);//去掉最后一个AND
			update_query = 'update '+TABLE_NAME+' set '+SEGMENT_NAME+
			'=\'\''+status+'\'\' where '+assignment;
			if(TABLE_NAME==='SZEBGVMI.PULL_LINE')
			{
				update_query = 'update '+TABLE_NAME+' set '+SEGMENT_NAME+
				'=\'\''+status+'\'\',ECC_STATUS=\'\''+ ecc_status +'\'\' where '+assignment;
			}
				
			try
			{
				//更改表中相应记录的状态
				update_status_sp = 'CALL "DS_INFO_SZ"."cdp.dssz.procedures::update_status"(\''
					+ update_query
					+'\')';

				pcall_update = conn.prepareCall(update_status_sp);
				pcall_update.execute();
				conn.commit();
				
				//添加更改用户和更改时间信息
				modified_info_sp = 'CALL "DS_INFO_SZ"."cdp.dssz.procedures::update_modified_info"(\''
					+ TABLE_NAME +'\',\''
					+ assignment
					+'\')';

				pcall_modified_info = conn.prepareCall(modified_info_sp);
				pcall_modified_info.execute();
				conn.commit();
			}
			catch(e)
			{
				$.response.setBody(e.message);
				$.response.status = $.net.http.BAD_REQUEST;
				return;
			}
			
		}
		
		try
		{
			var temp2 = log_on_response.body.asString();
			var pos1 = temp2.indexOf('<SessionID>');
			var pos2 = temp2.indexOf('</SessionID>');
			sessionID = temp2.substring(pos1+11,pos2);
		}
		catch(e)
		{
			$.response.setBody("Logon Failed!");
			$.response.status = $.net.http.BAD_REQUEST;
			return;
		}

		//query = 'select top 1 * from "DS_INFO_SZ"."HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
		query = 'select top 1 * from "_SYS_BIC"."cdp.dssz.models/AT_HANA_DS_JOB_INFO" where PROCESS_NAME=\''+process_name+'\'';
		var pcall_job = conn.prepareStatement(query);
		var rs_job = pcall_job.executeQuery();
		if(rs_job.next())
		{
			job_name = rs_job.getNString(2);
			G_JOB_INIT_FLAG = rs_job.getNString(3);
			G_DEBUG = rs_job.getNString(4);
			G_STARTFROMSTEP = rs_job.getNString(5);
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
				  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
				  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
				  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
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
			 	  +'\n'+'<variable name="G_WFNAME">'+G_WFNAME+'</variable>'
				  +'\n'+'<variable name="G_USERNAME">'+current_user+'</variable>'
				  +'\n'+'<variable name="G_PROCESSNAME">'+process_name+'</variable>'
				  +'\n'+'</globalVariables>'
				  +'\n'+'</ser:RunBatchJobRequest>'
				  +'\n'+'</soapenv:Body>'
				  +'\n'+'</soapenv:Envelope>';
			
			run_job();
			conn.close();
		} 
		else//JOBSERVER和SERVERGROUP至少一个不能为null
		{
			$.response.setBody('JOBSERVER and SERVERGROUP are null');
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		}

	$.response.contentType = "application/json; charset=UTF-8";
	

}

var pcall1;
var privilegeExists;

//验证权限
query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" (?,?)';
pcall1 = conn.prepareCall(query);
pcall1.setNString(1,privilegeCheck);
pcall1.execute();
privilegeExists = pcall1.getNString(2);
if(privilegeExists ==='OK')
{
	//判断任务类型
	if(job_type === 'TS')//调用DS
	{
		trigger();
	}
	else
	{
		$.response.setBody("Bad request!");
		$.response.status = $.net.http.BAD_REQUEST;	
	}
}
else
{
	$.response.setBody("Insufficient privilege!");
	$.response.status = $.net.http.BAD_REQUEST;
}

