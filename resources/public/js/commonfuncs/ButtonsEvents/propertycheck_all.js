define(function(){

    function appformsubmit_send(item,datares){
        var data=datares.record;
        var checkmsg=Number(data['checkstatus'])<3?'并且财产核定正在进行中':'';
        $.messager.confirm('确定提交申请?', '你正在试图提交申请.<br>'+checkmsg+'.<br>你想继续么?', function(r){
            if (r){
                var callback=function(){
                    $.messager.alert('操作成功','提交申请成功!');
                    var freshgrid=$('#businessgrid');
                    if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                    if($('#mainform').length>0)$('#tabs').tabs('close',1);
                }
                require(['commonfuncs/PropertyCheck'],function(js){
                    js.changeapplystatus(data.fmy001,processdiction.stepone,callback,'changebusinessprocessstatus');
                });

            }
        });

    }
    function appformsubmit_cancelsend(item,datares){
        //cancelsubmitbyfmy001
        var data=datares.record;
        $.messager.confirm('确定取消提交?', '你正在试图取消提交.你想继续么?', function(r){
            if (r){
                var callback=function(){
                    /*$.messager.alert('操作成功','提交申请成功!');
                     var freshgrid=$('#businessgrid');
                     if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                     if($('#mainform').length>0)$('#tabs').tabs('close',1);*/
                }
                require(['commonfuncs/PropertyCheck'],function(js){
                    js.changeapplystatus(data.fmy001,processdiction.stepzero,callback,'cancelsubmitbyfmy001');
                });

            }
        });
    }
    function appformsubmit_del(item,datares){
        var data=datares.record;
        $.messager.confirm('确定删除?', '你正在试图删除.你想继续么?', function(r){
            if (r){
                var callback=function(){
                    $.messager.alert('操作成功','提交申请成功!');
                     var freshgrid=$('#businessgrid');
                     if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                     if($('#mainform').length>0)$('#tabs').tabs('close',1);
                }
                require(['commonfuncs/PropertyCheck'],function(js){
                    js.changeapplystatus(data.fmy001,processdiction.stepzero,callback,'delfamilypropertybyfmy001');
                });

            }
        });
    }
    function appformsubmit_check(item,datares){
        var record=datares.record;
        this.record=record;

        $('#propertycheckwin').dialog('close').parent().remove();
        var propertycheckwindiv=$('#propertycheckwin');
        if(propertycheckwindiv.length>0){
            propertycheckwindiv.window('open');
        }
        else{
            var me=this;
            require(['text!views/propertycheck/propertycheckwin.htm','text!views/propertycheck/propertycheckapplyhistoryfieldset.htm'],
                function(div,table){
                    $('body').append(div);
                    if(!(propertycheckwindiv.length>0)){

                        $('#propertycheckwin').append($(table).find('div .siglecontent').html());
                    }
                    $('#propertycheckwin').dialog({
                        title: '业务审核',
                        width: 650,
                        height: 370,
                        closed: false,
                        cache: false,
                        onOpen:function(){
                            $.parser.parse($('#propertycheckwin').parent());
                            var grid=$('#propertycheckwin').find('.easyui-datagrid');
                            var options = grid.datagrid('options');
                            //console.log(options);
                            grid.datagrid(
                                {   url: 'ajax/sendfamilypropertyinfo.jsp?eventName=getprocesscheckbyfmy001',
                                    onBeforeLoad: function (params) {
                                        params.businessid =me.record.id;
                                        params.fmy001=me.record.fmy001;
                                        params.start = (options.pageNumber - 1) * options.pageSize;
                                        params.limit = options.pageSize;
                                        params.totalname = "total";
                                        params.rowsname = "rows";
                                    }
                                });
                        },
                        buttons:[{
                            text:'确定',
                            handler:function(){

                                require(['jqueryplugin/easyui-form','commonfuncs/AjaxForm'],function(js,AjaxForm){
                                    var form=$('#propertycheckwin').find('form');
                                    var approvalstr=form.form('getValue','approvalresult');

                                    var submit=function(param){
                                        param.userid=userid;
                                        param.eventName='processcheck';
                                        param.fmy001=me.record.fmy001;
                                        //param.businessid=me.record.id;
                                        param.processstatus=me.record['processstatus'];
                                        param.submituid=me.record['approvaluserid']?me.record['approvaluserid']:me.record['userid'];

                                        param.isapproval=(approvalstr==approvalresult.yes);
                                        param.approvalname=$(item).attr('namevalue');
                                        //param.checkresult=approvalstr=='同意'?1:0;
                                        param.approvalresult=approvalstr;
                                        param.approvalopinion=form.form('getValue','approvalopinion');
                                        //param.checkcomment=form.form('getValue','approvalopinion');
                                        param.roleid=roleid;
                                        param.checkitem=me.record.checkitem
                                        param.fm04=JSON.stringify(param);

                                    };

                                    var success=function(res){

                                        resitem=eval('('+res+')');
                                        if(resitem.success){
                                            $.messager.alert('操作成功','审核成功!');
                                            $('#propertycheckwin').dialog('close');
                                            $('#tabs').tabs('close',1);
                                        }else{
                                            $.messager.alert('操作失败',resitem.msg);
                                        }
                                        $('#propertycheckwin').dialog('close').parent().remove();

                                    };
                                    AjaxForm.ajaxform(form,'ajax/sendfamilypropertyinfo.jsp',submit,success);


                                });

                            }
                        },{
                            text:'取消',
                            handler:function(){
                                $('#propertycheckwin').dialog('close');
                            }
                        }],
                        modal: true });


                });
        }

    }
    function appformsubmit_process(item,datares){
        var record=datares.record;
        this.record=record;
        var processswindiv=$('#processwin');
        if(processswindiv.length>0){
            processswindiv.window('open');
        }
        else{
            var me=this;
            require(['text!views/dbgl/dbglprocesswin.htm','text!views/propertycheck/propertycheckapplyhistoryfieldset.htm'],
                function(div,table){
                    $('body').append(div);
                    $('#processwin').prepend($(table).find('div .siglecontent').html());


                    $('#processwin').window({
                        title: '流程状态',
                        width: 650,
                        height: 370,
                        closed: false,
                        cache: false,
                        onOpen:function(){
                            $.parser.parse($('#processwin').parent());
                            var grid=$('#processwin').find('.easyui-datagrid');
                            var options = grid.datagrid('options');
                            $('#process_vector').html('');
                            //console.log(options);
                            grid.datagrid(
                                {
                                    onBeforeLoad: function (params) {
                                        params.fmy001 =me.record.fmy001;
                                        params.start = (options.pageNumber - 1) * options.pageSize;
                                        params.limit = options.pageSize;
                                        params.totalname = "total";
                                        params.rowsname = "rows";
                                    }
                                });

                            require(['jqueryplugin/raphael-min'],function(js){


                                var paper = Raphael("process_vector", $('#process_vector').width(), 100);
                                var ellipse1= paper.ellipse(50, 30, 50, 30);
                                var text1=paper.text(45,30,'开始流程');
                                var path1=paper.path('M100 28  L150 28 L150 25 L155 30 L150 35 L150 32 L100 32 Z');
                                var ellipse2=paper.ellipse(205, 30, 50, 30);
                                var text2=paper.text(208,30,'街道/乡镇审核');
                                var path2=paper.path('M255 28  L305 28 L305 25 L310 30 L305 35 L305 32 L255 32 Z');
                                var ellipse3= paper.ellipse(360, 30, 50, 30);
                                var text3=paper.text(357,30,'区/县/市审批');
                                var path3=paper.path('M410 28  L460 28 L460 25 L465 30 L460 35 L460 32 L410 32 Z');

                                var ellipse4=paper.ellipse(515, 30, 50, 30);
                                var text4=paper.text(510,30,'结束流程');
                                if(me.record['processstatus']==processdiction.stepone){
                                    //alert(1);
                                    var path_process=paper.path('M195 35  L205 45 L220 28');
                                    var split_process=paper.path('M265 60  L265 80 L260 80 L270 90 L280 80 L275 80 L275 60 Z');
                                    var text_process=paper.text(195,80,me.record['displayname']);
                                    //path_process.attr("fill", "red");
                                    path_process.attr("stroke", "red");
                                    split_process.attr("stroke", "red");
                                    split_process.attr("stroke-width", 2);
                                    path_process.attr("stroke-width", 2);

                                    //path_process

                                }else if(me.record['processstatus']==processdiction.steptwo){
                                    var path_process=paper.path('M350 35  L360 45 L375 28');
                                    var split_process=paper.path('M420 60  L420 80 L415 80 L425 90 L435 80 L430 80 L430 60 Z');
                                    var text_process=paper.text(330,80,me.record['displayname']);
                                    //path_process.attr("fill", "red");
                                    path_process.attr("stroke", "red");
                                    split_process.attr("stroke", "red");
                                    split_process.attr("stroke-width", 2);
                                    path_process.attr("stroke-width", 2);

                                }else if(me.record['processstatus']==processdiction.stepthree){
                                    var path_process=paper.path('M505 35  L515 45 L530 28');
                                    path_process.attr("stroke", "red");
                                    path_process.attr("stroke-width", 2);

                                }

                                //var circle = paper.circle(50, 40, 10);
                                //circle.attr("fill", "#f00");
                                //circle.attr("stroke", "#fff");
                            });
                        },
                        modal: true
                    });


                });
        }

    }
    function appformsubmit_print(item,datares){
        var data=datares.record;
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
        require(['commonfuncs/PropertyCheck'],function(js){
            js.getFamilyPropertyInfo(data['fmy001'],sucfun);
        });
    }
    function appformsubmit_save(item,datares){
        require(['commonfuncs/PropertyCheck','jqueryplugin/easyui-form'],
            function(ajaxform){
                var callback=function(){
                    $.messager.confirm('提示信息', '已保存，是否留在该页面?', function(r){
                        if (r){
                        }
                        else{
                            $('#tabs').tabs('close',1);
                        }
                    });
                }
                ajaxform.submitForm('save',datares,callback);
            });

    }
    function appformsubmit_saveapplychange (item,datares){
        var record=datares.record;

        require(['commonfuncs/PropertyCheck'],function(js){
            var callback=function(){
                $.messager.confirm('提示信息', '已保存，是否留在该页面?', function(r){
                    if (r){
                    }
                    else{
                        $('#tabs').tabs('close',1);
                    }
                });
            }
            js.submitForm('savechange',datares,callback);
        });

    }
    function appformsubmit_saveapplylogout (item,datares){
        var record=datares.record;

        require(['commonfuncs/PropertyCheck'],function(js){
            var callback=function(){
                $.messager.confirm('提示信息', '已保存，是否留在该页面?', function(r){
                    if (r){
                    }
                    else{
                        $('#tabs').tabs('close',1);
                    }
                });
            }
            js.submitForm('savelogout',datares,callback);
        });

    }

    var obj0={
        'appformsubmit_send':appformsubmit_send,
        'appformsubmit_del':appformsubmit_del,
        'appformsubmit_check':appformsubmit_check,
        'appformsubmit_process':appformsubmit_process,
        'appformsubmit_print':appformsubmit_print,
        'appformsubmit_save':appformsubmit_save,
        'appformsubmit_saveapplychange':appformsubmit_saveapplychange,
        'appformsubmit_saveapplylogout':appformsubmit_saveapplylogout,
        'appformsubmit_cancelsend':appformsubmit_cancelsend
    }
    function formaddontype0(item,datares,fn){
        obj0[fn](item,datares)
    }
    function formaddontype1(item,datares){
        var record=datares.record;
        this.record=record;
        var approvalname=$(item).attr('namevalue');
        $('#propertycheckwin').dialog('close').parent().remove();
        var checkwindiv=$('#propertycheckwin');
        if(checkwindiv.length>0){
            checkwindiv.window('open');
        }
        else{
            var me=this;
            require(['text!views/propertycheck/propertycheckwin.htm'],
                function(div){
                    $('body').append(div);
                    //$('#checkwin').append($(table).find('div .siglecontent').html());
                    $('#propertycheckwin').dialog({
                        title: '业务核定',
                        width: 550,
                        height: 170,
                        closed: false,
                        cache: false,
                        buttons:[{
                            text:'确定',
                            handler:function(){

                                require(['jqueryplugin/easyui-form','commonfuncs/AjaxForm'],function(js,AjaxForm){
                                    var form=$('#propertycheckwin').find('form');
                                    var approvalstr=form.form('getValue','approvalresult');

                                    var submit=function(param){
                                        param.userid=userid;
                                        param.eventName='checkpropertyitem';
                                        param.fmy001=me.record.fmy001;
                                        param.businessid=me.record.id;
                                        param.processstatus=me.record['processstatus'];
                                        param.submituid=me.record['approvaluserid']?me.record['approvaluserid']:me.record['userid'];

                                        param.isapproval=(approvalstr==approvalresult.yes);
                                        param.approvalname=approvalname;
                                        param.checkresult=approvalstr=='同意'?1:0;
                                        param.checkcomment=form.form('getValue','approvalopinion');
                                        param.roleid=roleid;
                                        param.checkitem=me.record.checkitem
                                        param.fm03=JSON.stringify(param);

                                    };

                                    var success=function(res){
                                        resitem=eval('('+res+')');
                                        if(resitem.success){
                                            $.messager.alert('操作成功',me.record.checkitem+'成功!');
                                            $('#propertycheckwin').dialog('close');
                                            $('#tabs').tabs('close',1);
                                        }else{
                                            $.messager.alert('操作失败',resitem.msg);
                                        }

                                    };
                                    AjaxForm.ajaxform(form,'ajax/sendfamilypropertyinfo.jsp',submit,success);


                                });


                            }
                        },{
                            text:'取消',
                            handler:function(){
                                $('#propertycheckwin').dialog('close');
                            }
                        }],
                        modal: true });


                });
        }

    }
    function gridaddontype(item,datares){
        var data=datares.record;
        var businessid=data['businessid'];
        var fmy001=data['fmy001'];
        var sucfun=function(res){
            res.record=data;
            var widgetname="";
            var folder='views/propertycheck/';
            if(data['addontype']=='1'){   //核定
                widgetname=formwidgettype['propertycheckitemalter'];
            }else{
                if(data['processstatustype']==processstatustype.ok){
                    widgetname=formwidgettype['propertycheckalter'];
                }else if(data['processstatustype']==processstatustype.change){
                    widgetname=formwidgettype['propertycheckchange'];
                }else if(data['processstatustype']==processstatustype.logout){
                    widgetname=formwidgettype['propertychecklogout'];
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
        require(['commonfuncs/PropertyCheck'],function(js){
            js.getFamilyPropertyInfo(fmy001,sucfun);
        });

    }
    var a={
        render:function(item,datares){
            if($(item).attr('addontype')=='1'){
                formaddontype1(item,datares)
            }else if($(item).attr('addontype')+''=='0'){
                formaddontype0(item,datares,$(item).attr('subac'))
            }else{
                gridaddontype(item,datares)
            }
        }

    }

    return a;
});