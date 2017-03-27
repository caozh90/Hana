/*

PM Report
view name --- ROLE NAME --- COMMENTS
1.confirmedPullShortage               confirmedpullshortage                 'Confirmed Pull Shortage'
2.dispatchShortage                    dispatchshortage                      'Dispatch Shortage'
3.inventoryComparisonReport           inventorycomparisonreport             'Inventory Comparison Report'
4.moCutbackMaterialReturnReport       mocutbackmaterialreturnreport         'MO Cutback Material Return Report'
5.moCutbackReport                     mocutbackreport                       'MO Cutback Report'
6.moDestinationChangeError            modestinationchangeerror              'MO Destination Change Error'
7.moPullSignalSummary                 mopullsignalsummary                   'MO pull signal Summary'
8.moPulledInformation                 mopulledinformation                   'MO Pulled Information'
9.onHoldMOLines                       onholdmolines                         'ON HOLD MO LINES'
10.poComparisonReport                 pocomparisonreport                    'PO Comparison Report'
11.saForVMI                           saformexicovmi                        'SA for Mexico VMI'


CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.confirmedpullshortage::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.dispatchshortage::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.inventorycomparisonreport::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.mocutbackmaterialreturnreport::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.mocutbackreport::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.modestinationchangeerror::exportable','MXEBGVMI',?  );


CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.mopullsignalsummary::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
	'cdp.mxebgvmi.roles.mopulledinformation::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
	'cdp.mxebgvmi.roles.onholdmolines::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
	'cdp.mxebgvmi.roles.pocomparisonreport::exportable','MXEBGVMI',?  );

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
	'cdp.mxebgvmi.roles.saformexicovmi::exportable','MXEBGVMI',?  );
       
*/
/**************************************
1.confirmedPullShortage               confirmedpullshortage                 'Confirmed Pull Shortage'
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirmed Pull Shortage'
 	,'Confirmed Pull Shortage'
	,'cdp.mxebgvmi.roles.confirmedpullshortage::access'
	,'confirmedpullshortage::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirmed Pull Shortage'
 	,'Confirmed Pull Shortage'
	,'cdp.mxebgvmi.roles.confirmedpullshortage::exportable'
	,'confirmedpullshortage::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmedPullShortage'  ,'cdp.mxebgvmi.roles.confirmedpullshortage::access', 'view',?);

--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'confirmedPullShortage'  ,'cdp.mxebgvmi.roles.confirmedpullshortage::exportable', 'controllor',?);
       
/**************************************
2.dispatchShortage                    dispatchshortage                      'Dispatch Shortage'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Dispatch Shortage'
 	,'Dispatch Shortage'
	,'cdp.mxebgvmi.roles.dispatchshortage::access'
	,'dispatchshortage::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Dispatch Shortage'
 	,'Dispatch Shortage'
	,'cdp.mxebgvmi.roles.dispatchshortage::exportable'
	,'dispatchshortage::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'dispatchShortage'  ,'cdp.mxebgvmi.roles.dispatchshortage::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'dispatchShortage'  ,'cdp.mxebgvmi.roles.dispatchshortage::exportable', 'controllor',?);
       

/**************************************
3.inventoryComparisonReport           inventorycomparisonreport             'Inventory Comparison Report'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Inventory Comparison Report'
 	,'Inventory Comparison Report'
	,'cdp.mxebgvmi.roles.inventorycomparisonreport::access'
	,'inventorycomparisonreport::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Inventory Comparison Report'
 	,'Inventory Comparison Report'
	,'cdp.mxebgvmi.roles.inventorycomparisonreport::exportable'
	,'inventorycomparisonreport::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'inventoryComparisonReport'  ,'cdp.mxebgvmi.roles.inventorycomparisonreport::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'inventoryComparisonReport'  ,'cdp.mxebgvmi.roles.inventorycomparisonreport::exportable', 'controllor',?);


/**************************************
4.moCutbackMaterialReturnReport       mocutbackmaterialreturnreport         'MO Cutback Material Return Report'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Cutback Material Return Report'
 	,'MO Cutback Material Return Report'
	,'cdp.mxebgvmi.roles.mocutbackmaterialreturnreport::access'
	,'mocutbackmaterialreturnreport::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;
/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Cutback Material Return Report'
 	,'MO Cutback Material Return Report'
	,'cdp.mxebgvmi.roles.mocutbackmaterialreturnreport::exportable'
	,'mocutbackmaterialreturnreport::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/
/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'moCutbackMaterialReturnReport'  ,'cdp.mxebgvmi.roles.mocutbackmaterialreturnreport::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'moCutbackMaterialReturnReport'  ,'cdp.mxebgvmi.roles.mocutbackmaterialreturnreport::exportable', 'controllor',?);


/**************************************
5.moCutbackReport                     mocutbackreport                       'MO Cutback Report'

'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Cutback Report'
 	,'MO Cutback Report'
	,'cdp.mxebgvmi.roles.mocutbackreport::access'
	,'mocutbackreport::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Cutback Report'
 	,'MO Cutback Report'
	,'cdp.mxebgvmi.roles.mocutbackreport::exportable'
	,'mocutbackreport::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'moCutbackReport'  ,'cdp.mxebgvmi.roles.mocutbackreport::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'moCutbackReport'  ,'cdp.mxebgvmi.roles.mocutbackreport::exportable', 'controllor',?);
       
/**************************************
6.moDestinationChangeError            modestinationchangeerror              'MO Destination Change Error'


************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Destination Change Error'
 	,'MO Destination Change Error'
	,'cdp.mxebgvmi.roles.modestinationchangeerror::access'
	,'modestinationchangeerror::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Destination Change Error'
 	,'MO Destination Change Error'
	,'cdp.mxebgvmi.roles.modestinationchangeerror::exportable'
	,'modestinationchangeerror::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'moDestinationChangeError'  ,'cdp.mxebgvmi.roles.modestinationchangeerror::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'moDestinationChangeError'  ,'cdp.mxebgvmi.roles.modestinationchangeerror::exportable', 'controllor',?);
       

/**************************************
7.moPullSignalSummary                 mopullsignalsummary                   'MO pull signal Summary'


************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO pull signal Summary'
 	,'MO pull signal Summary'
	,'cdp.mxebgvmi.roles.mopullsignalsummary::access'
	,'mopullsignalsummary::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO pull signal Summary'
 	,'MO pull signal Summary'
	,'cdp.mxebgvmi.roles.mopullsignalsummary::exportable'
	,'mopullsignalsummary::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'moPullSignalSummary'  ,'cdp.mxebgvmi.roles.mopullsignalsummary::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'moPullSignalSummary'  ,'cdp.mxebgvmi.roles.mopullsignalsummary::exportable', 'controllor',?);


/**************************************
8.moPulledInformation                 mopulledinformation                   'MO Pulled Information'


************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Pulled Information'
 	,'MO Pulled Information'
	,'cdp.mxebgvmi.roles.mopulledinformation::access'
	,'mopulledinformation::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'MO Pulled Information'
 	,'MO Pulled Information'
	,'cdp.mxebgvmi.roles.mopulledinformation::exportable'
	,'mopulledinformation::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/
/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'moPulledInformation'  ,'cdp.mxebgvmi.roles.mopulledinformation::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'moPulledInformation'  ,'cdp.mxebgvmi.roles.mopulledinformation::exportable', 'controllor',?);


/**************************************
9.onHoldMOLines                       onholdmolines                         'ON HOLD MO LINES'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ON HOLD MO LINES'
 	,'ON HOLD MO LINES'
	,'cdp.mxebgvmi.roles.onholdmolines::access'
	,'onholdmolines::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ON HOLD MO LINES'
 	,'ON HOLD MO LINES'
	,'cdp.mxebgvmi.roles.onholdmolines::exportable'
	,'onholdmolines::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'onHoldMOLines'  ,'cdp.mxebgvmi.roles.onholdmolines::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'onHoldMOLines'  ,'cdp.mxebgvmi.roles.onholdmolines::exportable', 'controllor',?);
       

/**************************************

10.poComparisonReport                 pocomparisonreport                    'PO Comparison Report'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'PO Comparison Report'
 	,'PO Comparison Report'
	,'cdp.mxebgvmi.roles.pocomparisonreport::access'
	,'pocomparisonreport::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'PO Comparison Report'
 	,'PO Comparison Report'
	,'cdp.mxebgvmi.roles.pocomparisonreport::exportable'
	,'pocomparisonreport::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

*/
/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'poComparisonReport'  ,'cdp.mxebgvmi.roles.pocomparisonreport::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'poComparisonReport'  ,'cdp.mxebgvmi.roles.pocomparisonreport::exportable', 'controllor',?);


/**************************************

11.saForVMI                           saformexicovmi                        'SA for Mexico VMI'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SA for Mexico VMI'
 	,'SA for Mexico VMI'
	,'cdp.mxebgvmi.roles.saformexicovmi::access'
	,'saformexicovmi::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

/*
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SA for Mexico VMI'
 	,'SA for Mexico VMI'
	,'cdp.mxebgvmi.roles.saformexicovmi::exportable'
	,'saformexicovmi::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;
*/
/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'saForVMI'  ,'cdp.mxebgvmi.roles.saformexicovmi::access', 'view',?);
--CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
--       'MXEBGVMI' ,'saForVMI'  ,'cdp.mxebgvmi.roles.saformexicovmi::exportable', 'controllor',?);



