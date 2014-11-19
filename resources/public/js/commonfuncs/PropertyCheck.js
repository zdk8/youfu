
var propertyCheckRoleBtn;
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
define(function(){
        var checkItemMap={
            propertycheckfamilyhousefieldset:'核定住房',
            propertycheckfamilyinputfieldset:'核定收入',
            propertycheckfamilymoneyfieldset:'核定现有资产'
        }

        function initCheckItemCmp(array){
            var o=applyformviews.propertycheckitemalter;
            var b=new Array();
            b.push(o[0]);
            for(var i=0;i<array.length;i++){
                for(var j=1;j< o.length;j++){
                    for(var p in checkItemMap){
                        if(checkItemMap[p]==array[i].name&&p==o[j]){
                            b.push(p);
                        }
                    }
                }
            }
            applyformviews.propertycheckitemalter= b;
        }
        function initPropertyCheckFromRole(){
            var me=this;
            var params = {
                roleid:roleid,
                type:"家庭财产核定"
            };
            var successFunc = function (response) {
                propertyCheckRoleBtn=eval(response);
                initCheckItemCmp(propertyCheckRoleBtn)  ;
            };
            $.ajax({
                url:'ajax/getallfuncsbyrule.jsp',
                data:params,
                type:'POST',
                success:successFunc
            })
        }
        function initPropertyCheckFromRole2(){
            var me=this;
            var params = {
                id:userid,
                roleid:roleid,
                type:'财产核定核定系统'
            };
            var successFunc = function (response) {
                propertyCheckRoleBtn=eval(response);
                initCheckItemCmp(propertyCheckRoleBtn)  ;
            };
            $.ajax({
                url:'ajax/gettreefuncsbyrule.jsp',
                data:params,
                type:'POST',
                success:successFunc
            })
        }
    initPropertyCheckFromRole2();
    var a={
        submitForm:function(submitype,datares,callback){

            var me=this;
            var vprocessstatustype;
            var url='ajax/sendfamilypropertyinfo.jsp';
            var eventName='';
            var vprocessstatus;
            if(submitype==='new'){
                vprocessstatustype=processstatustype.ok;
                eventName='registerfamilyinfo';
            }
            else if(submitype==='save'){

                eventName='updatefamilyinfo';
            }//url='ajax/updateapply.jsp';
            else if(submitype==='savechange'){
                vprocessstatustype=processstatustype.change;
                vprocessstatus=processdiction.stepzero;
                eventName='changefamilyinfo';
            }//url='ajax/changeapply.jsp';
            else if(submitype==='savelogout'){
                vprocessstatustype=processstatustype.logout;
                vprocessstatus=processdiction.stepzero;
                eventName='changefamilyinfo';
            }//url='ajax/logoutapply.jsp';
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
                            param.fmy001=datares.record.fmy001;

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
                            param.fmy001=datares.record.fmy001;
                            me.caculatefutrue(datares,FilterGridrow,param);
                        }else if(submitype==='savelogout'){
                            param.businessid=datares.record.id;
                            param.fmy001=datares.record.fmy001;
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


                        }

                        if($('.affixfile').length>0||affixfiles.length>0)param.affixfiles=$.toJSON(affixfiles);//附件数据
                        var obj=$('#mainform').serializeObject();
                        obj.userid=userid;
                        obj.processstatustype=vprocessstatustype;
                        if(vprocessstatus){
                            obj.processstatus=vprocessstatus;
                        }
                        if(datares){
                            obj.fmy001=datares.record.fmy001;
                        }

                        param.fm01=JSON.stringify(obj);
                    }
                    return isValid;
                };
                var sucess=callback;
                me.ajaxform($('#mainform'),url+'?eventName='+eventName,submit,sucess)

            });




        },
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
       },
        getFamilyPropertyInfo:function(fmy001,callback){
            var me=this;
            var params = {
                fmy001:fmy001,
                eventName:'getFamilyPropertyInfoByFmy001',
                addontype:0
            };
            var successFunc = callback;

            $.ajax({
                type: "post",        //使用get方法访问后台
                dataType: "json",       //返回json格式的数据
                url: "ajax/sendfamilypropertyinfo.jsp",   //要访问的后台地址
                data: params,         //要发送的数据
                complete :function(){},      //AJAX请求完成时
                success: successFunc
            });


        },
        changeapplystatus:function(fmy001,status,callfunc,en){
            var params = {
                fmy001:fmy001,
                status:status,
                eventName:en,
                processstatus:status
            };
            params.rc=JSON.stringify(params);
            var successFunc = function(){
                if(callfunc)callfunc();
            };

            require(['commonfuncs/AjaxForm'],function(ajaxform){
                ajaxform.ajaxsend("post","json","ajax/sendfamilypropertyinfo.jsp",params,successFunc,null);
            });


        },
        propertycheckfieldsetaddstyle:function(){
            var ppitems=$('#checkdetailinfo').val()
            $.each($.find('#formcontentpanel fieldset[checkitemname]'),function(i,v){
                if(ppitems.indexOf($(v).attr('checkitemname'))!=-1){
                    $(v).attr('disabled','disabled');
                    $(v).css('color','green');
                }
            })
        }


    };
    return a;
});
