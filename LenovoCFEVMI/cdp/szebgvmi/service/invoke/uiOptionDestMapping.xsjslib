var invoke = $.import('cdp.szebgvmi.service.invoke', 'invoke');

function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,WAREHOUSE_OWNER,SOURCE_LOCATION,SOURCE_TYPE,SOURCE_BIN;
    var DESTINATION_LOCATION,DESTINATION_TYPE,DESTINATION_BIN;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	WAREHOUSE_OWNER = rs.getNString(2);
    	SOURCE_LOCATION = rs.getNString(3);
    	SOURCE_TYPE = rs.getNString(4);
    	SOURCE_BIN = rs.getNString(5);
    	DESTINATION_LOCATION = rs.getNString(6);
    	DESTINATION_TYPE = rs.getNString(7);
    	DESTINATION_BIN = rs.getNString(8);
    }
    
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_option_dest_mapping::validationOptionDestMapping"(?,?,?,?,?,?,?,?,?,?)');
	pStmt.setNString(1,LOGICAL_PLANT);
	if(WAREHOUSE_OWNER===null){
		pStmt.setNull(2,null);
	}else{
		pStmt.setNString(2,WAREHOUSE_OWNER);
	}
	pStmt.setNString(3,SOURCE_LOCATION);
	pStmt.setNString(4,SOURCE_TYPE);
	pStmt.setNString(5,SOURCE_BIN);
	pStmt.setNString(6,DESTINATION_LOCATION);
	pStmt.setNString(7,DESTINATION_TYPE);
	pStmt.setNString(8,DESTINATION_BIN);
	pStmt.setNString(9,oper_type);
    pStmt.execute();
	var error = pStmt.getNString(10);
	if(error !== ''){
		throw error;
	}
}


function insert(param){
	var result=invoke.checkPrivilege('optiondestinationmapping::createable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'insert');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,WAREHOUSE_OWNER,SOURCE_LOCATION,SOURCE_TYPE,SOURCE_BIN;
    var DESTINATION_LOCATION,DESTINATION_TYPE,DESTINATION_BIN;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	WAREHOUSE_OWNER = rs.getNString(2);
    	SOURCE_LOCATION = rs.getNString(3);
    	SOURCE_TYPE = rs.getNString(4);
    	SOURCE_BIN = rs.getNString(5);
    	DESTINATION_LOCATION = rs.getNString(6);
    	DESTINATION_TYPE = rs.getNString(7);
    	DESTINATION_BIN = rs.getNString(8);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_option_dest_mapping::createOptionDestMapping"(?,?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,WAREHOUSE_OWNER);
	pStmt.setNString(3,SOURCE_LOCATION);
	pStmt.setNString(4,SOURCE_TYPE);
	pStmt.setNString(5,SOURCE_BIN);
	pStmt.setNString(6,DESTINATION_LOCATION);
	pStmt.setNString(7,DESTINATION_TYPE);
	pStmt.setNString(8,DESTINATION_BIN);
    pStmt.execute();
}

function update(param){
	var result=invoke.checkPrivilege('optiondestinationmapping::editable');
	if(result!== 'OK' ){
		throw result;
		
	}
	
	validationBefore(param,'update');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,SOURCE_LOCATION,SOURCE_TYPE,SOURCE_BIN;
    var DESTINATION_LOCATION,DESTINATION_TYPE,DESTINATION_BIN;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	//WAREHOUSE_OWNER = rs.getNString(2);
    	SOURCE_LOCATION = rs.getNString(3);
    	SOURCE_TYPE = rs.getNString(4);
    	SOURCE_BIN = rs.getNString(5);
    	DESTINATION_LOCATION = rs.getNString(6);
    	DESTINATION_TYPE = rs.getNString(7);
    	DESTINATION_BIN = rs.getNString(8);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_option_dest_mapping::updateOptionDestMapping"(?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	//pStmt.setNString(2,WAREHOUSE_OWNER);
	pStmt.setNString(2,SOURCE_LOCATION);
	pStmt.setNString(3,SOURCE_TYPE);
	pStmt.setNString(4,SOURCE_BIN);
	pStmt.setNString(5,DESTINATION_LOCATION);
	pStmt.setNString(6,DESTINATION_TYPE);
	pStmt.setNString(7,DESTINATION_BIN);
    pStmt.execute();
}

function remove(param){
	var result=invoke.checkPrivilege('optiondestinationmapping::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var after = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,SOURCE_LOCATION,SOURCE_TYPE,SOURCE_BIN,DESTINATION_LOCATION;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	SOURCE_LOCATION = rs.getNString(3);
    	SOURCE_TYPE = rs.getNString(4);
    	SOURCE_BIN = rs.getNString(5);
    	DESTINATION_LOCATION = rs.getNString(6);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_option_dest_mapping::deleteOptionDestMapping"(?,?,?,?,?)');
	pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,SOURCE_LOCATION);
	pStmt.setNString(3,SOURCE_TYPE);
	pStmt.setNString(4,SOURCE_BIN);
	pStmt.setNString(5,DESTINATION_LOCATION);
    pStmt.execute();
}
