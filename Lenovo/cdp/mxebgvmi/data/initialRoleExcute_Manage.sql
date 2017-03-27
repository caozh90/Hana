/*

Excute\Manage
view name
1. balanceFailedDispatches					balancefaileddispatches					'Balance Failed Dispatches'
2. confirmBalanceDispatches					confirmbalancedispatches				'Confirm Balance Dispatches'
3. confirmDispatches						confirmdispatches						'Confirm Dispatches'
4. confirmLinetoExcessDispatches			confirmlinetoexcessdispatches			'Confirm Line to Excess Dispatches'
5. createCycleTime							createcyceltime							'Create Cycel Time'
6. failedDispatches							faileddispatches						'Failed Dispatches'
7. failedPullConfirmationResubmission		failedpullconfirmationresubmission		'Failed Pull Confirmation & Resubmission'
8. failedPullResubmission					failedpullresubmission					'Failed Pull Resubmission'
9. linetoExcessFailedDispatches				linetoexcessfaileddispatches			'Line to Excess Failed Dispatches'
10. loiFailedGR								loifailed								'LOI Failed'
11. soiFailedGR								soifailed								'SOI Failed'


*/
/**************************************
1.balanceFailedDispatches**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Balance Failed Dispatches'
 	,'Balance Failed Dispatches Managerment'
	,'cdp.mxebgvmi.roles.balancefaileddispatches::access'
	,'balancefaileddispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Balance Failed Dispatches'
 	,'Balance Failed Dispatches Managerment'
	,'cdp.mxebgvmi.roles.balancefaileddispatches::exportable'
	,'balancefaileddispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Balance Failed Dispatches'
 	,'Balance Failed Dispatches Managerment'
	,'cdp.mxebgvmi.roles.balancefaileddispatches::confirm'
	,'balancefaileddispatches::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'balanceFailedDispatches'  ,'cdp.mxebgvmi.roles.balancefaileddispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'balanceFailedDispatches'  ,'cdp.mxebgvmi.roles.balancefaileddispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'balanceFailedDispatches'  ,'cdp.mxebgvmi.roles.balancefaileddispatches::confirm', 'controllor',?);
              
/**************************************
2. confirmBalanceDispatches
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Balance Dispatches'
 	,'Confirm Balance Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmbalancedispatches::access'
	,'confirmbalancedispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Balance Dispatches'
 	,'Confirm Balance Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmbalancedispatches::exportable'
	,'confirmbalancedispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Balance Dispatches'
 	,'Confirm Balance Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmbalancedispatches::confirm'
	,'confirmbalancedispatches::exportable'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmBalanceDispatches'  ,'cdp.mxebgvmi.roles.confirmbalancedispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmBalanceDispatches'  ,'cdp.mxebgvmi.roles.confirmbalancedispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmBalanceDispatches'  ,'cdp.mxebgvmi.roles.confirmbalancedispatches::confirm', 'controllor',?);       

/**************************************
3. confirmDispatches						confirmdispatches						'Confirm Dispatches'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Dispatches'
 	,'Confirm Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmdispatches::access'
	,'confirmdispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Dispatches'
 	,'Confirm Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmdispatches::exportable'
	,'confirmdispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Dispatches'
 	,'Confirm Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmdispatches::confirm'
	,'confirmdispatches::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;


/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmDispatches'  ,'cdp.mxebgvmi.roles.confirmdispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmDispatches'  ,'cdp.mxebgvmi.roles.confirmdispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmDispatches'  ,'cdp.mxebgvmi.roles.confirmdispatches::confirm', 'controllor',?);

/**************************************
4. confirmLinetoExcessDispatches			confirmlinetoexcessdispatches			'Confirm Line to Excess Dispatches'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Line to Excess Dispatches'
 	,'Confirm Line to Excess Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::access'
	,'confirmlinetoexcessdispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Line to Excess Dispatches'
 	,'Confirm Line to Excess Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::exportable'
	,'confirmlinetoexcessdispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Confirm Line to Excess Dispatches'
 	,'Confirm Line to Excess Dispatches Managerment'
	,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::confirm'
	,'confirmlinetoexcessdispatches::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmLinetoExcessDispatches'  ,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmLinetoExcessDispatches'  ,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'confirmLinetoExcessDispatches'  ,'cdp.mxebgvmi.roles.confirmlinetoexcessdispatches::confirm', 'controllor',?);



/**************************************
5. createCycleTime							createcyceltime							'Create Cycel Time'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Create Cycel Time'
 	,'Create Cycel Time'
	,'cdp.mxebgvmi.roles.createcyceltime::access'
	,'createcyceltime::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Create Cycel Time'
 	,'Create Cycel Time'
	,'cdp.mxebgvmi.roles.createcyceltime::exportable'
	,'createcyceltime::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Create Cycel Time'
 	,'Create Cycel Time'
	,'cdp.mxebgvmi.roles.createcyceltime::createable'
	,'createcyceltime::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Create Cycel Time'
 	,'Create Cycel Time'
	,'cdp.mxebgvmi.roles.createcyceltime::deleteable'
	,'createcyceltime::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Create Cycel Time'
 	,'Create Cycel Time'
	,'cdp.mxebgvmi.roles.createcyceltime::editable'
	,'createcyceltime::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
5*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'createCycleTime'  ,'cdp.mxebgvmi.roles.createcyceltime::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'createCycleTime'  ,'cdp.mxebgvmi.roles.createcyceltime::exportable', 'controllor',?);
 CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'createCycleTime'  ,'cdp.mxebgvmi.roles.createcyceltime::createable', 'controllor',?);             
 CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'createCycleTime'  ,'cdp.mxebgvmi.roles.createcyceltime::deleteable', 'controllor',?); 
 CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'createCycleTime'  ,'cdp.mxebgvmi.roles.createcyceltime::editable', 'controllor',?); 
       
/**************************************
6. failedDispatches							faileddispatches						'Failed Dispatches'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Dispatches'
 	,'Failed Dispatches'
	,'cdp.mxebgvmi.roles.faileddispatches::access'
	,'faileddispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Dispatches'
 	,'Failed Dispatches'
	,'cdp.mxebgvmi.roles.faileddispatches::exportable'
	,'faileddispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Dispatches'
 	,'Failed Dispatches'
	,'cdp.mxebgvmi.roles.faileddispatches::confirm'
	,'faileddispatches::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
6*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedDispatches'  ,'cdp.mxebgvmi.roles.faileddispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedDispatches'  ,'cdp.mxebgvmi.roles.faileddispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedDispatches'  ,'cdp.mxebgvmi.roles.faileddispatches::confirm', 'controllor',?);
               


/**************************************
7. failedPullConfirmationResubmission		failedpullconfirmationresubmission		'Failed Pull Confirmation & Resubmission'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Confirmation & Resubmission'
 	,'Failed Pull Confirmation & Resubmission'
	,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::access'
	,'failedpullconfirmationresubmission::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Confirmation & Resubmission'
 	,'Failed Pull Confirmation & Resubmission'
	,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::exportable'
	,'failedpullconfirmationresubmission::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Confirmation & Resubmission'
 	,'Failed Pull Confirmation & Resubmission'
	,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::confirm'
	,'failedpullconfirmationresubmission::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
7*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullConfirmationResubmission'  ,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullConfirmationResubmission'  ,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullConfirmationResubmission'  ,'cdp.mxebgvmi.roles.failedpullconfirmationresubmission::confirm', 'controllor',?);
              
              


/**************************************
8. failedPullResubmission					failedpullresubmission					'Failed Pull Resubmission'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Resubmission'
 	,'Failed Pull Resubmission'
	,'cdp.mxebgvmi.roles.failedpullresubmission::access'
	,'failedpullresubmission::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Resubmission'
 	,'Failed Pull Resubmission'
	,'cdp.mxebgvmi.roles.failedpullresubmission::exportable'
	,'failedpullresubmission::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Failed Pull Resubmission'
 	,'Failed Pull Resubmission'
	,'cdp.mxebgvmi.roles.failedpullresubmission::confirm'
	,'failedpullresubmission::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;


/*	
8*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullResubmission'  ,'cdp.mxebgvmi.roles.failedpullresubmission::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullResubmission'  ,'cdp.mxebgvmi.roles.failedpullresubmission::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'failedPullResubmission'  ,'cdp.mxebgvmi.roles.failedpullresubmission::confirm', 'controllor',?);
              


/**************************************
9. linetoExcessFailedDispatches				linetoexcessfaileddispatches			'Line to Excess Failed Dispatches'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Line to Excess Failed Dispatches'
 	,'Line to Excess Failed Dispatches'
	,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::access'
	,'linetoexcessfaileddispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Line to Excess Failed Dispatches'
 	,'Line to Excess Failed Dispatches'
	,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::exportable'
	,'linetoexcessfaileddispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Line to Excess Failed Dispatches'
 	,'Line to Excess Failed Dispatches'
	,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::confirm'
	,'linetoexcessfaileddispatches::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
9*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'linetoExcessFailedDispatches'  ,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'linetoExcessFailedDispatches'  ,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'linetoExcessFailedDispatches'  ,'cdp.mxebgvmi.roles.linetoexcessfaileddispatches::confirm', 'controllor',?);
              

/**************************************
10. loiFailedGR								loifailed								'LOI Failed'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'LOI Failed'
 	,'LOI Failed'
	,'cdp.mxebgvmi.roles.loifailed::access'
	,'loifailed::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'LOI Failed'
 	,'LOI Failed'
	,'cdp.mxebgvmi.roles.loifailed::exportable'
	,'loifailed::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'LOI Failed'
 	,'LOI Failed'
	,'cdp.mxebgvmi.roles.loifailed::confirm'
	,'loifailed::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
10*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'loiFailedGR'  ,'cdp.mxebgvmi.roles.loifailed::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'loiFailedGR'  ,'cdp.mxebgvmi.roles.loifailed::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'loiFailedGR'  ,'cdp.mxebgvmi.roles.loifailed::confirm', 'controllor',?);
              


/**************************************
11. soiFailedGR								soifailed								'SOI Failed'
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SOI Failed'
 	,'SOI Failed'
	,'cdp.mxebgvmi.roles.soifailed::access'
	,'soifailed::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SOI Failed'
 	,'SOI Failed'
	,'cdp.mxebgvmi.roles.soifailed::exportable'
	,'soifailed::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'SOI Failed'
 	,'SOI Failed'
	,'cdp.mxebgvmi.roles.soifailed::confirm'
	,'soifailed::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

/*	
11*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'soiFailedGR'  ,'cdp.mxebgvmi.roles.soifailed::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'soiFailedGR'  ,'cdp.mxebgvmi.roles.soifailed::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'soiFailedGR'  ,'cdp.mxebgvmi.roles.soifailed::confirm', 'controllor',?);
              




