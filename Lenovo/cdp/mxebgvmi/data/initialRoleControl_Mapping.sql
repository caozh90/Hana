/*

Control\Mapping
view name
1.controlcycle					controlCycle					Control Cycle
2.destinationmapping			destinationMapping				Destination Mapping
3.optiondestinationmapping		optionDestinationMapping		Option Destination
4.vmipurchaseproportion			vmiPurchaseProportion			VMI Purchase Proportion
5.sourcingpriority				sourcingPriority				Sourcing Priority
6.urgentmomaintaince			urgentMOMaintaince				Urgent MO Maintaince
7.nocutsopriority				nocutSoPriority					Nocut SO Priority
8.fullBoxSize					fullboxsize						Full Box Size

CALL "SECURITY"."cdp.security.procedures::deleteInfoRoleByName"(
'cdp.mxebgvmi.roles.nocutsopriority::editable'
,'MXEBGVMI',?  );

*/
/**************************************
1.controlcycle					controlCycle					Control Cycle
**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::access'
	,'controlcycle::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::uploadable'
	,'controlcycle::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::exportable'
	,'controlcycle::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::createable'
	,'controlcycle::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::deleteable'
	,'controlcycle::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Control Cycle'
 	,'Control Cycle'
	,'cdp.mxebgvmi.roles.controlcycle::editable'
	,'controlcycle::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::uploadable', 'controllor',?);
       CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::createable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::deleteable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'controlCycle'  ,'cdp.mxebgvmi.roles.controlcycle::editable', 'controllor',?);
       
/**************************************
2.destinationmapping			destinationMapping				Destination Mapping

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::access'
	,'destinationmapping::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::createable'
	,'destinationmapping::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::deleteable'
	,'destinationmapping::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::editable'
	,'destinationmapping::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::uploadable'
	,'destinationmapping::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Destination Mapping'
 	,'Destination Mapping'
	,'cdp.mxebgvmi.roles.destinationmapping::exportable'
	,'destinationmapping::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::uploadable', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'destinationMapping'  ,'cdp.mxebgvmi.roles.destinationmapping::exportable', 'controllor',?);
/**************************************
3.optiondestinationmapping				optionDestinationMapping		Option Destination Mapping

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination Mapping'
 	,'Option Destination Mapping'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::access'
	,'optiondestination::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination'
 	,'Option Destination'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::createable'
	,'optiondestinationmapping::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination'
 	,'Option Destination'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::deleteable'
	,'optiondestinationmapping::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination'
 	,'Option Destination'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::editable'
	,'optiondestinationmapping::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination'
 	,'Option Destination'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::uploadable'
	,'optiondestinationmapping::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Option Destination'
 	,'Option Destination'
	,'cdp.mxebgvmi.roles.optiondestinationmapping::exportable'
	,'optiondestinationmapping::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'optionDestinationMapping'  ,'cdp.mxebgvmi.roles.optiondestinationmapping::editable', 'controllor',?);



/**************************************
4.vmipurchaseproportion			vmiPurchaseProportion			VMI Purchase Proportion

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::access'
	,'vmipurchaseproportion::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::exportable'
	,'vmipurchaseproportion::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::uploadable'
	,'vmipurchaseproportion::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::createable'
	,'vmipurchaseproportion::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::deleteable'
	,'vmipurchaseproportion::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'VMI Purchase Proportion'
 	,'VMI Purchase Proportion'
	,'cdp.mxebgvmi.roles.vmipurchaseproportion::editable'
	,'vmipurchaseproportion::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;
/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::uploadable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::createable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'vmiPurchaseProportion'  ,'cdp.mxebgvmi.roles.vmipurchaseproportion::editable', 'controllor',?);



/**************************************
5.sourcingpriority				sourcingPriority				Sourcing Priority

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::access'
	,'sourcingpriority::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::exportable'
	,'sourcingpriority::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::updateable'
	,'sourcingpriority::updateable'
 	,'updateable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::createable'
	,'sourcingpriority::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::deleteable'
	,'sourcingpriority::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::editable'
	,'sourcingpriority::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Sourcing Priority'
 	,'Sourcing Priority'
	,'cdp.mxebgvmi.roles.sourcingpriority::uploadable'
	,'sourcingpriority::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
5*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::createable', 'controllor',?);              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::editable', 'controllor',?);
 
 CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'sourcingPriority'  ,'cdp.mxebgvmi.roles.sourcingpriority::uploadable', 'controllor',?);
             
/**************************************
6.urgentmomaintaince			urgentMOMaintaince				Urgent MO Maintaince

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::access'
	,'urgentmomaintaince::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::exportable'
	,'urgentmomaintaince::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::uploadable'
	,'urgentmomaintaince::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::createable'
	,'urgentmomaintaince::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::deleteable'
	,'urgentmomaintaince::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::editable'
	,'urgentmomaintaince::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::confirm'
	,'urgentmomaintaince::confirm'
 	,'confirm role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Urgent MO Maintaince'
 	,'Urgent MO Maintaince'
	,'cdp.mxebgvmi.roles.urgentmomaintaince::trigger'
	,'urgentmomaintaince::trigger'
 	,'trigger role '
	,'MXEBGVMI'    
,?             )           ;

/*	
6*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::editable', 'controllor',?);
              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::confirm', 'controllor',?);

              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'urgentMOMaintaince'  ,'cdp.mxebgvmi.roles.urgentmomaintaince::trigger', 'controllor',?);
       
/**************************************
7.nocutsopriority				nocutSoPriority					Nocut SO Priority
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Nocut SO Priority'
 	,'Nocut SO Priority'
	,'cdp.mxebgvmi.roles.nocutsopriority::access'
	,'nocutsopriority::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Nocut SO Priority'
 	,'Nocut SO Priority'
	,'cdp.mxebgvmi.roles.nocutsopriority::exportable'
	,'nocutsopriority::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Nocut SO Priority'
 	,'Nocut SO Priority'
	,'cdp.mxebgvmi.roles.nocutsopriority::uploadable'
	,'nocutsopriority::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Nocut SO Priority'
 	,'Nocut SO Priority'
	,'cdp.mxebgvmi.roles.nocutsopriority::createable'
	,'nocutsopriority::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Nocut SO Priority'
 	,'Nocut SO Priority'
	,'cdp.mxebgvmi.roles.nocutsopriority::deleteable'
	,'nocutsopriority::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
7*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'nocutSoPriority'  ,'cdp.mxebgvmi.roles.nocutsopriority::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'nocutSoPriority'  ,'cdp.mxebgvmi.roles.nocutsopriority::exportable', 'controllor',?);
              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'nocutSoPriority'  ,'cdp.mxebgvmi.roles.nocutsopriority::uploadable', 'controllor',?);
              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'nocutSoPriority'  ,'cdp.mxebgvmi.roles.nocutsopriority::createable', 'controllor',?);
              
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'nocutSoPriority'  ,'cdp.mxebgvmi.roles.nocutsopriority::deleteable', 'controllor',?);
              

              

       
/**************************************
8.fullBoxSize			fullboxsize				Full Box Size

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::access'
	,'fullboxsize::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::exportable'
	,'fullboxsize::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::uploadable'
	,'fullboxsize::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::createable'
	,'fullboxsize::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::deleteable'
	,'fullboxsize::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Full Box Size'
 	,'Full Box Size'
	,'cdp.mxebgvmi.roles.fullboxsize::editable'
	,'fullboxsize::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
8*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'fullBoxSize'  ,'cdp.mxebgvmi.roles.fullboxsize::editable', 'controllor',?);
