var invoke = $.import('cdp.szebgvmi.service.invoke', 'invoke');



function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var tpl_id,pull_type,entity_type,cycle_time;
    while (rs.next()) {
    	tpl_id = rs.getString(1);  	
    	pull_type = rs.getString(2);
    	entity_type = rs.getString(3);
    	cycle_time = rs.getDecimal(4);
    }
    
    pStmt = param.connection.prepareCall('call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_create_cycle_time::validationUiCreateCycleTime"(?,?,?,?,?,?)');
	pStmt.setString(1,tpl_id);
	pStmt.setString(2,pull_type);
	pStmt.setString(3,entity_type);
	
	
	if( cycle_time!== null){
		pStmt.setDecimal(4,cycle_time);
	}else{
		pStmt.setNull(4);
	}
	
	pStmt.setString(5,oper_type);

    pStmt.execute();
	var result = pStmt.getNString(6);
	if(result !== ''){
		throw result;
	}
}

function insert(param){
	var result=invoke.checkPrivilege('createcyceltime::createable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'INSERT');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var tpl_id,pull_type,entity_type,cycle_time;
    while (rs.next()) {
    	tpl_id = rs.getString(1);  	
    	pull_type = rs.getString(2);
    	entity_type = rs.getString(3);
    	cycle_time = rs.getDecimal(4);
    }
    
    pStmt = param.connection.prepareCall('call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_create_cycle_time::createUiCreateCycleTime"(?,?,?,?)');
	pStmt.setString(1,tpl_id);
	pStmt.setString(2,pull_type);
	pStmt.setString(3,entity_type);
	
	if( cycle_time!== null){
		pStmt.setDecimal(4,cycle_time);
	}else{
		pStmt.setNull(4);
	}

    pStmt.execute();
}

function update(param){
	var result=invoke.checkPrivilege('createcyceltime::editable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'UPDATE');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var tpl_id,pull_type,entity_type,cycle_time;
    while (rs.next()) {
    	tpl_id = rs.getString(1);  	
    	pull_type = rs.getString(2);
    	entity_type = rs.getString(3);
    	cycle_time = rs.getDecimal(4);
    }
    
    pStmt = param.connection.prepareCall('call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_create_cycle_time::updateUiCreateCycleTime"(?,?,?,?)');
	pStmt.setString(1,tpl_id);
	pStmt.setString(2,pull_type);
	pStmt.setString(3,entity_type);
	pStmt.setDecimal(4,cycle_time);

    pStmt.execute();
}

function remove(param){
	var result=invoke.checkPrivilege('destinationmapping::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var before = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + before + '"');
    var rs = pStmt.executeQuery();
    var tpl_id,pull_type,entity_type,cycle_time;
    while (rs.next()) {
    	tpl_id = rs.getString(1);  	
    	pull_type = rs.getString(2);
    	entity_type = rs.getString(3);
    	cycle_time = rs.getDecimal(4);
    }
    
    pStmt = param.connection.prepareCall('call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_create_cycle_time::deleteUiCreateCycleTime"(?,?,?,?)');
	pStmt.setString(1,tpl_id);
	pStmt.setString(2,pull_type);
	pStmt.setString(3,entity_type);
	
	if( cycle_time!== null){
		pStmt.setDecimal(4,cycle_time);
	}else{
		pStmt.setNull(4);
	}

    pStmt.execute();
}