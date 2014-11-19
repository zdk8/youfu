/**
 * Created by jack on 14-1-7.
 */
define(function(){

    var a={
       caculatefutrue:function(datares,FilterGridrow,params){
           if($('#familymembersgrid').length>0){
               rows=$('#familymembersgrid').datagrid('getRows');
               var form=datares.form;
               var incomesum=$('#incomesum').length>0?$('#incomesum').val():(form['incomesum']==null?0:form['incomesum']);
               var propertysum=$('#propertysum').length>0?$('#propertysum').val():(form['propertysum']==null?0:form['propertysum']);
               var familyincome=$('#familyincome').length>0?parseFloat($('#familyincome').val()):parseFloat(incomesum)+parseFloat(propertysum);
               var poorstandard=parseFloat($('#poorstandard').length>0?$('#poorstandard').val():form['poorstandard']);
               var incomesumareaperson=parseFloat(incomesum)/12/rows.length;
               var disablednum=FilterGridrow.ByFields(rows,['disabledlevel'],disabledtype.heavy).length;
               //var disablednum =FilterGridrow.ByFields(rows,['isenjoyed'],[isenjoyedtype.yes]).length;
               var totalmoney=poorstandard*disablednum;
               var averageincome=$('#averageincome').length>0?parseFloat($('#averageincome').val()):(familyincome/rows.length/12).toFixed(1);

               var businesstype=$('#tabs').tabs('getSelected').panel('options').businesstype;
               if(businesstype===businessTableType.dbgl){
                   var minpercent=0.4;
                   var helpmomey=poorstandard-averageincome;
                   if(helpmomey<minpercent*poorstandard){
                       totalmoney+=(minpercent*poorstandard)*(rows.length-disablednum);
                   }else{
                       totalmoney+=helpmomey.toFixed(1)*(rows.length-disablednum);
                   }
               }else if(businesstype===businessTableType.dbbyh){
                   totalmoney=poorstandard*disablednum;
                   totalmoney+=poorstandard*0.2*(rows.length-disablednum);
               }else{
                   totalmoney=$('#totalhelpmoney').length>0?parseFloat($('#totalhelpmoney').val()):form['totalhelpmoney'];
               }


               params.disabledpersons=disablednum;
               params.enjoyednum=FilterGridrow.ByFields(rows,['isenjoyed'],[isenjoyedtype.yes]).length;
               params.averageincome=averageincome;
               params.familyincome=familyincome;
               params.incomesumareaperson=incomesumareaperson.toFixed(1);
               params.totalhelpmoney=totalmoney;

               $('#mainform').form('load',{
                   disabledpersons:disablednum,
                   enjoyednum:FilterGridrow.ByFields(rows,['isenjoyed'],[isenjoyedtype.yes]).length,
                   averageincome:averageincome,
                   incomesumareaperson:incomesumareaperson.toFixed(1),
                   totalhelpmoney:totalmoney
               });



           }



       },
       submitForm:function(submitype,datares,callback){

           var me=this;
           var url='';
           if(submitype==='new')url='ajax/sendapply.jsp';
           else if(submitype==='save')url='ajax/updateapply.jsp';
           else if(submitype==='savechange')url='ajax/changeapply.jsp';
           else if(submitype==='savelogout')url='ajax/logoutapply.jsp';
           require(['commonfuncs/FilterGridrow'],function(FilterGridrow){
               var submit= function(param){
                   var isValid = $('#mainform').form('validate');
                   if (!isValid){

                       $.messager.progress('close');	// hide progress bar while the form is invalid
                   }else{

                       var affixfiles=[];
                       var affixitems=$('.affixfile');
                       for(var i=0;i<affixitems.length;i++){
                           if(affixitems[i].formdata&&affixitems[i].formdata.length>0){
                               var formdata=affixitems[i].formdata;
                               var affixfileitem={};
                               affixfileitem[$(affixitems[i]).attr('type')]=formdata;
                               affixfiles.push(affixfileitem);
                           }
                       }
                       affixfiles.push({"accountimgpath":[{'attachmentname':'照片',
                           'attachmentpath':$('#personimg').attr('src')}]});
                       var signatures=[];

                       if(submitype==='new'){
                           var businesstype=$('#tabs').tabs('getSelected').panel('options').businesstype;
                           param.businesstype=businesstype;
                           param.userid=userid;
                           param.processstatustype=processstatustype.ok;
                           param.isprocess=$('#appformsubmit').attr('isprocess');
                       }else if(submitype==='save'){
                           param.businessid=datares.record.id;

                           if($('#signatures').find('image').length>0){
                               var item_obj={};
                               item_obj['businessid']=datares.record.id;
                               item_obj['userid']=userid;

                               item_obj['y']=$('#signatures').offset().top+$('#signatures').parent().scrollTop();
                               item_obj['x']=$('#signatures').offset().left;
                               signatures.push(item_obj);
                           }

                           param.signatures=$.toJSON(signatures);

                           me.caculatefutrue(datares,FilterGridrow,param);
                       }else if(submitype==='savechange'){
                           param.businessid=datares.record.id;
                           param.processstatustype=processstatustype.change;
                           me.caculatefutrue(datares,FilterGridrow,param);
                       }else if(submitype==='savelogout'){
                           param.businessid=datares.record.id;
                           param.processstatustype=processstatustype.logout;
                           me.caculatefutrue(datares,FilterGridrow,param);

                       }
                       if($('#familymembersgrid').length>0){
                           var rowdata=$('#familymembersgrid').datagrid('getRows');
                           if(spatialchildTableType[businesstype]){
                               if(rowdata.length==0){
                                   rowdata.push({relationship:'户主'});
                                   /*$.messager.alert('注意','没有添加对象');
                                   return;*/
                               }else{
                                   rowdata[0].relationship='户主';
                               }
                               param.familymembers=$.toJSON(rowdata);
                               param.familynum=rowdata.length;
                           }else{
                               param.familynum=rowdata.length;
                               param.familymembers=$.toJSON(rowdata);
                           }


                       }else{
                           var rowdata=[];
                           rowdata.push({relationship:'户主'});
                           param.familymembers=$.toJSON(rowdata);
                           param.familynum=rowdata.length;

                       }

                       if($('.affixfile').length>0||affixfiles.length>0)param.affixfiles=$.toJSON(affixfiles);//附件数据

                   }
                   return isValid;
               };
               var sucess=callback;
               me.ajaxform($('#mainform'),url,submit,sucess)

           });




       },
       ajaxform:function(form,url,onsubmit,success){
           $.messager.progress();
           form.form('submit', {
                   url: url,
                   onSubmit:onsubmit,
                   success:function(res){
                       $.messager.progress('close');
                       if(success)success(res);
                   }

           });

       },
       ajaxsend:function(method,type,url,params,success,complete,errorfunc){

           $.messager.progress();
           var compfunc=function(){
               $.messager.progress('close');
               if(complete)complete();
           };
           $.ajax({
               type: method,
               dataType: type,
               url: url,
               data: params,
               complete :compfunc,
               error:errorfunc,
               success: success
           });
       }


    };
    return a;
});
