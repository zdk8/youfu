/*审核处理*/
define(function(){
    function render(local,option){
        var paaudit = local.find('[opt=paaudit]');               //审核datagrid
        var dealwith = local.find('[opt=dealwith]');             //处理
        var operationlog = local.find('[opt=operationlog]');        //操作日志
        /*加载审核人员*/
        paaudit.datagrid({
            url:"pension/get-auditpeople",
            /*queryParams:{
                functionid:'mHLcDiwTflgEshNKIiOV'
            },*/
            type:'post',
            onLoadSuccess:function(data){
                var info = local.find('[action=info]');           //详细信息
                var dealwith = local.find('[action=dealwith]');           //处理
                var rows=data.rows;
                var btns_arr=[info,dealwith];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "info"){                                       //详细信息(处理)
//                                    showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载
                                    cj.showContent({                                          //详细信息(tab标签)
                                         title:record.name+'服务评估详细信息',
                                         htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                         jsfile:'views/pension/PensionAssessmentInfo',
                                         queryParams:{
                                             actiontype:'info',         //（处理）操作方式
                                             data:record,                   //填充数据
                                             refresh:paaudit                //刷新
                                        }
                                    })
                                }else if(action == "dealwith"){                   //处理
                                    require(['commonfuncs/popwin/win','text!views/pension/PensionPeopleAuditDlg.htm','views/pension/PensionPeopleAuditDlg'],
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
                                                        refresh:paaudit,
                                                        data:record,
                                                        parent:parent,
//                                                        actiontype:'add',       //操作方式
                                                        onCreateSuccess:function(data){
                                                            parent.trigger('close');
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    )
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        operationlogFunc(operationlog);             //操作日志

    }


    /*操作日志*/
    var operationlogFunc = function(operationlog){
        operationlog.click(function(){
            cj.showContent({                                          //操作日志(tab标签)
                title:'操作日志',
                htmfile:'text!views/pension/OperationLog.htm',
                jsfile:'views/pension/OperationLog',
                queryParams:{
                    actiontype:'info'         //（处理）操作方式
//                    data:record,                   //填充数据
//                    refresh:paaudit                //刷新
                }
            })
        })
    }

    return {
        render:render
    }

})