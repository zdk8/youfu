/**
 * Created by jack on 14-1-6.
 */
//$.messager.alert('提示','我的位置在‘commonfuncs/ButtonsEvents/appformsubmit_print.js’
// 此接口留给魏潘了，参见源程序‘ZSMZJ.view.dbgl.businessPrint’模块!');
define(function(){

    var a={
        render:function(item,datares){
            var data=datares.record;
            var businessid=data['businessid'];
            var sucfun=function(res){
                res.record=data;
                var widgetname="businessformprint";
                var folder='views/dbgl/';
                var title='打印 '+data['owername'];
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
