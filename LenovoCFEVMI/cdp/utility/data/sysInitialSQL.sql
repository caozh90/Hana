CALL "SECURITY"."cdp.security.procedures::createModule"(
		'EBGCFE','cdp.ebgcfe','CFE :Cost Forecast Estimation ');


call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST001', 'Password12345'
			,'SAP_TEST001','firstName', 'lastName'
            ,'SAP_TEST001@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST002', 'Password12345'
			,'SAP_TEST002','firstName', 'lastName'
            ,'SAP_TEST002@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);

call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST003', 'Password12345'
			,'SAP_TEST003','firstName', 'lastName'
            ,'SAP_TEST003@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST004', 'Password12345'
			,'SAP_TEST004','firstName', 'lastName'
            ,'SAP_TEST004@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST005', 'Password12345'
			,'SAP_TEST005','firstName', 'lastName'
            ,'SAP_TEST005@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST006', 'Password12345'
			,'SAP_TEST006','firstName', 'lastName'
            ,'SAP_TEST006@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST007', 'Password12345'
			,'SAP_TEST007','firstName', 'lastName'
            ,'SAP_TEST007@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);

call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST008', 'Password12345'
			,'SAP_TEST008','firstName', 'lastName'
            ,'SAP_TEST008@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST009', 'Password12345'
			,'SAP_TEST009','firstName', 'lastName'
            ,'SAP_TEST009@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST010', 'Password12345'
			,'SAP_TEST010','firstName', 'lastName'
            ,'SAP_TEST010@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'EBGCFE',?);

CALL "SECURITY"."cdp.security.procedures::createModule"(
		'MXEBGVMI','cdp.mxebgvmi','VMI ');


call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST101', 'Password12345'
			,'SAP_TEST101','firstName', 'lastName'
            ,'SAP_TEST101@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST102', 'Password12345'
			,'SAP_TEST102','firstName', 'lastName'
            ,'SAP_TEST102@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);

call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST103', 'Password12345'
			,'SAP_TEST103','firstName', 'lastName'
            ,'SAP_TEST103@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST104', 'Password12345'
			,'SAP_TEST104','firstName', 'lastName'
            ,'SAP_TEST104@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST105', 'Password12345'
			,'SAP_TEST105','firstName', 'lastName'
            ,'SAP_TEST105@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST106', 'Password12345'
			,'SAP_TEST106','firstName', 'lastName'
            ,'SAP_TEST106@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST107', 'Password12345'
			,'SAP_TEST107','firstName', 'lastName'
            ,'SAP_TEST107@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);

call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST108', 'Password12345'
			,'SAP_TEST108','firstName', 'lastName'
            ,'SAP_TEST108@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST109', 'Password12345'
			,'SAP_TEST109','firstName', 'lastName'
            ,'SAP_TEST109@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
call  "SECURITY"."cdp.security.procedures::createInfoUser"(
			 'SAP_TEST110', 'Password12345'
			,'SAP_TEST110','firstName', 'lastName'
            ,'SAP_TEST110@emailAddress', 'status' , 'LOCALE' ,'DESIGNATION'
            ,'MXEBGVMI',?);
            
/*  
          
"SECURITY"."cdp.security.procedures::createInfoRole" (
    IN	 aROLE_NAME NVARCHAR(200),
 	IN   aCOMMENT NVARCHAR(200),
	IN   aMODULE_NAME NVARCHAR(200)    
,OUT errorInfo "SECURITY"."cdp.security.data::userManagement.HttpError"
             )
  */
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Base'
 	,'base role '
	,'EBGCFE'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Access'
 	,'open user management view. '
	,'EBGCFE'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::userAdmin'
 	,' user and user group management . '
	,'EBGCFE'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleSetup'
 	,' role and role group management . '
	,'EBGCFE'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleAdmin'
 	,' grant activated role  . '
	,'EBGCFE'   ,?             );
--******************************

  CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Base'
 	,'base role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::Access'
 	,'open user management view. '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::userAdmin'
 	,' user and user group management . '
	,'MXEBGVMI'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleSetup'
 	,' role and role group management . '
	,'MXEBGVMI'   ,?             );
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'cdp.security.roles::roleAdmin'
 	,' grant activated role  . '
	,'MXEBGVMI'   ,?             );
			

			
--分配权限。
/*

CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		aMODULE_NAME NVARCHAR(256),  
    	aROLEGROUP_NAME NVARCHAR(256),	--//rolegroup id	
    	aROLE_NAME NVARCHAR(256),  	--//role id  
    	aUSERGROUP_NAME NVARCHAR(256),  
    	aUSER_NAME NVARCHAR(256),
	?);
	
	*/
	/* 
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::Base',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);	
	*/
	call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.security.roles::Base','SAP_TEST001');
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::Access',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
		
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::userAdmin',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::roleSetup',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'EBGCFE' ,  
    	'',
    	'cdp.security.roles::roleAdmin',  	--//role id  
    	'',
    	'SAP_TEST001',
	?);
	
/*
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'MXEBGVMI' ,  
    	'',
    	'cdp.security.roles::Base',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);	
	*/
		call "_SYS_REPO"."GRANT_ACTIVATED_ROLE"('cdp.security.roles::Base','SAP_TEST101');
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'MXEBGVMI' ,  
    	'',
    	'cdp.security.roles::Access',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);	
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'MXEBGVMI' ,  
    	'',
    	'cdp.security.roles::userAdmin',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'MXEBGVMI' ,  
    	'',
    	'cdp.security.roles::roleSetup',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);
CALL "SECURITY"."cdp.security.procedures::createMapAllByName" ( 
		'MXEBGVMI' ,  
    	'',
    	'cdp.security.roles::roleAdmin',  	--//role id  
    	'',
    	'SAP_TEST101',
	?);
