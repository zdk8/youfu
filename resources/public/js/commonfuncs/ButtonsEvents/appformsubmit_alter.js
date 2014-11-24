/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var data=datares.record;
            var businessid=data['businessid'];
            var sucfun=function(res){
                res.record=data;
                var widgetname="";
                var folder='';
                if(data['processstatustype']==processstatustype.ok){
                    if(data['businesstype']==businessTableType.dbgl){
                        widgetname='dbglbusinessalterform';
                        folder='views/dbgl/';
                    }else if(data['businesstype']==businessTableType.dbbyh){
                        folder='views/dbedge/';
                        widgetname='dbedgebusinessalterform';
                    }
                    else if(data['businesstype']==businessTableType.temporaryhelp){
                        folder='views/temporaryhelp/';
                        widgetname='temporaryhelpbusinessalterform';
                    }else if(data['businesstype']==businessTableType.charitablehelp){
                        folder='views/charitablehelp/';
                        widgetname='charitablehelpbusinessalterform';
                    }else if(data['businesstype']==businessTableType.medicalhelp){
                        folder='views/medicalhelp/';
                        widgetname='medicalhelpbusinessalterform';

                    }else if(data['businesstype']==businessTableType.studyhelp){
                        folder='views/studyhelp/';
                        widgetname='studyhelpbusinessalterform';
                    }else if(data['businesstype']==businessTableType.disasterware){
                        folder='views/disaster/';
                        widgetname='disasterhelpwarealterform';
                    }else if(data['businesstype']==businessTableType.disasterplace){
                        folder='views/disaster/';
                        widgetname='disasterhelpbusinessalterform';
                    }else if(data['businesstype']==businessTableType.rangershelp){
                        folder='views/rangers/';
                        widgetname='rangershelpbusinessalterform';
                    }else if(data['businesstype']==businessTableType.charitableinstitutionhelp){
                        widgetname='charitablehelpinstitutionalterform';
                    }else if(data['businesstype']==businessTableType.disasterhelp){
                        folder='views/disaster/'
                        widgetname='disasterhelpcalamitybusinessalterform';
                    }

                }else if(data['processstatustype']==processstatustype.change){
                    if(data['businesstype']==businessTableType.dbgl){
                        folder='views/dbgl/';
                        widgetname='dbglbusinesschangeform';
                    }else if(data['businesstype']==businessTableType.dbbyh){
                        folder='views/dbedge/';
                        widgetname='dbedgebusinesschangeform';
                    }else if(data['businesstype']==businessTableType.disasterhelp){
                        folder='views/disaster/';
                        widgetname='disasterhelpcalamitybusinesschangeform';
                    }

                }else if(data['processstatustype']==processstatustype.logout){
                    if(data['businesstype']==businessTableType.dbgl){
                        folder='views/dbgl/'
                        widgetname='dbglbusinesslogoutform';
                    }else if(data['businesstype']==businessTableType.dbbyh){
                        folder='views/dbedge/';
                        widgetname='dbedgebusinesslogoutform';
                    }else if(data['businesstype']==businessTableType.disasterhelp){
                        folder='views/disaster/';
                        widgetname='disasterhelpcalamitybusinesslogoutform';
                    }
                }
                var title=data['owername'];
                var htmlfile='text!'+folder+widgetname+'.htm';
                var jsfile=folder+widgetname;

                require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
                    var businesstype=$('#tabs').tabs('getSelected').panel('options').businesstype;
                    TreeClickEvent.ShowContent(htmlfile,jsfile,title,widgetname,
                        folder,res,null,businesstype);

                });
                //console.log(res);
            };
            require(['commonfuncs/GetFormData'],function(GetFormData){
                //alert(businessid);
                GetFormData.getValueBybusinessid(businessid,sucfun);
            });
        }

    }

    return a;
});
