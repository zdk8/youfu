/*审核处理*/
define(function(){
    function render(local,option){
        var ppaudit = local.find('.easyui-datagrid-noauto');               //审核datagrid
        var dealwith = local.find('[opt=dealwith]');                        //处理
        var operationlog = local.find('[opt=operationlog]');                //操作日志
        var refreshGrid=function() {
            ppaudit.datagrid('reload');
        };
        /*加载审核人员*/
        local.find('.easyui-datagrid-noauto').datagrid({
            url:"pension/get-auditpeople",
            type:'post',
            onLoadSuccess:function(data){
                var info = local.find('[action=view]');           //详细信息
                var dealwith = local.find('[action=dealwith]');           //处理
                var rows=data.rows;
                var btns_arr=[info,dealwith];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "view"){                                       //详细信息
                                    var title = "【"+record.name+'】详细信息';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
//                                        showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载
                                        layer.load();
                                        $.ajax({
                                            url:"searchid",                                //查询老人表
                                            data:{
                                                id:record.lr_id
                                            },
                                            type:"post",
                                            dataType:"json",
                                            success:function(data){
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/pensioninfo/PensionPeopleInfo.htm',
                                                    jsfile:'views/pension/pensioninfo/PensionPeopleInfo',
                                                    queryParams:{
                                                        actiontype:'info',         //（处理）操作方式
                                                        data:data,                   //填充数据
                                                        record:record,
                                                        title:title,
                                                        refresh:refreshGrid                //刷新
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }else if(action == "dealwith"){                   //处理
                                    var userlength = cj.getUserMsg().regionid.length;
                                    var aul = record.aulevel;
                                    require(['commonfuncs/popwin/win','text!views/pension/pensioninfo/PensionPeopleAuditDlg.htm','views/pension/pensioninfo/PensionPeopleAuditDlg'],
                                        function(win,htmfile,jsfile){
                                            win.render({
                                                title:'处理',
                                                width:395,
                                                height:250,
                                                html:htmfile,
                                                buttons:[
                                                    {text:'取消',handler:function(html,parent){
                                                        parent.trigger('close');
                                                    }},
                                                    {
                                                        text:'保存',
                                                        handler:function(html,parent){ }}
                                                ],
                                                renderHtml:function(local,submitbtn,parent){
                                                    jsfile.render(local,{
                                                        submitbtn:submitbtn,
                                                        act:'c',
                                                        refresh:refreshGrid,
                                                        title:null,
                                                        data:record,
                                                        parent:parent,
                                                        onCreateSuccess:function(data){
                                                            parent.trigger('close');
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    )
                                    //showDlg(refreshGrid,record)
                                    /*if(userlength == 12){
                                        $.messager.alert('温馨提示','对不起,你没有该权限!','info');
                                    }else if(userlength == 9){
                                        if(aul == 1 || aul == 4 || aul == 5){
                                            showDlg(refreshGrid,record)
                                        }else{
                                            $.messager.alert('温馨提示','对不起,你没有审批权限!','info');
                                        }
                                    }else if(userlength == 6){
                                        showDlg(refreshGrid,record)
                                    }*/
                                }
                            });
                        })(i)
                    }
                }
            },
            toolbar:local.find('div[tb]')
        })
//        operationlogFunc(operationlog);             //操作日志

        var name = local.find('[opt=name]');                        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        /*搜索*/
        local.find('[opt=query]').click(function(){
            ppaudit.datagrid('load',{
                name:name.val(),
                identityid:identityid.val()
            })
        })

    }

    var showDlg = function(refreshGrid,record){
        require(['commonfuncs/popwin/win','text!views/pension/pensioninfo/PensionPeopleAuditDlg.htm','views/pension/pensioninfo/PensionPeopleAuditDlg'],
            function(win,htmfile,jsfile){
                win.render({
                    title:'处理',
                    width:395,
                    height:250,
                    html:htmfile,
                    buttons:[
                        {text:'取消',handler:function(html,parent){
                            parent.trigger('close');
                        }},
                        {
                            text:'保存',
                            handler:function(html,parent){ }}
                    ],
                    renderHtml:function(local,submitbtn,parent){
                        jsfile.render(local,{
                            submitbtn:submitbtn,
                            act:'c',
                            refresh:refreshGrid,
                            title:null,
                            data:record,
                            parent:parent,
                            onCreateSuccess:function(data){
                                parent.trigger('close');
                            }
                        })
                    }
                })
            }
        )
    }


    /*操作日志*/
    var operationlogFunc = function(operationlog){
        operationlog.click(function(){
            console.log(2)
        })
    }

    return {
        render:render
    }

})