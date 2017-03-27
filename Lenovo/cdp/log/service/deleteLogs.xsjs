var start_time=$.request.parameters.get("start_time");
var end_time=$.request.parameters.get("end_time");
var logs=$.request.parameters.get("logs");
var pCount=$.request.parameters.length; // the number of parameters

var result,conn,callSql,cstmt,start,end;
var type_start_time = typeof start_time;
var type_end_time = typeof end_time;

var returns={};
if(Number(start_time)>Number(end_time)){
	result='start time is later than end time';
	returns.success=false;
	returns.message=result;
	
}else{
	
	try{
		conn = $.db.getConnection();
		if(logs==="TRANS"){
			if( type_start_time ==="undefined" & type_end_time ==="undefined"){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteTransactionLog\"(o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				
			}else if(type_start_time ==="undefined" ){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteTransactionLog\"(end_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(end_time));
				
			}else if( type_end_time==="undefined"){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteTransactionLog\"(start_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(start_time));
				
			}else{
				callSql="call EX_LOG.\"cdp.log.procedures::deleteTransactionLog\"(start_time=>?,end_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(start_time));
				cstmt.setString(2,String(end_time));

			}
		}else if(logs==="MONITOR"){
			if(type_start_time ==="undefined" & type_end_time ==="undefined"){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteHttpLog\"(o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				
			}else if(type_start_time ==="undefined"){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteHttpLog\"(end_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(end_time));
				
			}else if(type_end_time  ==="undefined"){
				callSql="call EX_LOG.\"cdp.log.procedures::deleteHttpLog\"(start_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(start_time));
				
			}else{
				callSql="call EX_LOG.\"cdp.log.procedures::deleteHttpLog\"(start_time=>?,end_time=>?,o_start_time=>?,o_end_time=>?)";
				cstmt=conn.prepareCall(callSql) ;
				cstmt.setString(1,String(start_time));
				cstmt.setString(2,String(end_time));

			}
			
			
		}


		cstmt.execute();
		start=cstmt.getString(pCount); //start time
		end=cstmt.getString(pCount+1);//end time
		result='success delete logs from '.concat(start).concat(' to ').concat(end);
		
		conn.commit();
		cstmt.close();
		conn.close();
		
		returns.success=true;
		returns.message=result;
		
		
	}catch(e){
		returns.success=false;
		returns.message=e.toString();
		
	}
			
}


$.response.setBody(JSON.stringify(returns));
