/*审核处理*/
define(['views/pension/PensionServiceAudit','views/pension/PensionServiceAss'],function(auditfile,assfile){
    function render(local,option){
        var paaudit = local.find('[opt=paaudit]');               //审核datagrid
        var dealwith = local.find('[opt=dealwith]');             //处理
        var operationlog = local.find('[opt=operationlog]');        //操作日志
        var refreshGrid=function() {
            paaudit.datagrid('reload');
        };
        /*加载审核人员*/
        paaudit.datagrid({
            url:"audit/getassessaudit",
            /*queryParams:{
                functionid:'mHLcDiwTflgEshNKIiOV'
            },*/
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var dealwith = local.find('[action=dealwith]');           //处理
                var rows=data.rows;
                var btns_arr=[view,dealwith];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "view"){                                       //详细信息(处理)
                                    var title = "【"+record.messagebrief.
                                                            substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'】服务评估详细信息'
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        $("#tabs").tabs('add', {
                                            title: title,
                                            href: 'getPensionServiceAssHtml?jja_id='+record.bstablepk,
                                            closable: true
                                        })
                                        var timer = window.setInterval(function () {
                                            var local=$("#tabs").tabs('getTab',title)
                                            if (local && local.find('[opt=info1_table]').length) {
                                                window.clearInterval(timer);
                                                assfile.render(local,{queryParams:{
                                                    title:title,
                                                    data:data,
                                                    refresh:refreshGrid,
                                                    actionType:"view"
                                                }});
                                            }else{
                                                console.log('oops....info1_table is not ready ')
                                            }
                                        }, 200);
                                        /*getassessbyidFunc({jja_id:record.bstablepk,title:title,record:record,
                                                            aulevel:record.aulevel,refresh:refreshGrid})*/
                                    }
                                }else if(action == "dealwith"){                   //处理
                                    var title = "【"+record.messagebrief.
                                                    substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'】服务评估处理';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        $("#tabs").tabs('add', {
                                            title: title,
                                            href: 'getPensionServiceAuditHtml?jja_id='+record.bstablepk,
                                            closable: true
                                        })
                                        var timer = window.setInterval(function () {
                                            var local=$("#tabs").tabs('getTab',title)
                                            if (local && local.find('[opt=result1]').length) {
                                                window.clearInterval(timer);
                                                auditfile.render(local,{queryParams:{
                                                    title:title,
                                                    data:data,
                                                    record:record,
                                                    refresh:refreshGrid,
                                                    actionType:"dealwith"
                                                }});
                                            }else{
                                                console.log('oops....result1 is not ready ')
                                            }
                                        }, 200);
                                        /*getassessbyidFunc({jja_id:record.bstablepk,title:title,record:record,
                                            aulevel:record.aulevel,refresh:refreshGrid})*/
                                    }
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        operationlogFunc(operationlog);             //操作日志

    }
    /*获取评估人员信息*/
    function getassessbyidFunc(params){
//        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
        $.ajax({
            url:"audit/getassessbyid",
            type:"post",
            data:{
                jja_id:params.jja_id
            },
            dataType: 'json',
            success:function(data){
                if(data){
                    cj.showContent({                                          //详细信息(tab标签)
                        title:params.title,
                        htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                        jsfile:'views/pension/PensionAssessmentInfo',
                        queryParams:{
                            actiontype:'view',         //（处理）操作方式
                            data:data[0],
                            title:params.title,
                            record:params.record,                  //具体数据
                            aulevel:params.aulevel,
                            refresh:params.refresh                //刷新
                        }
                    })
                    /*setTimeout(function(){
                        showProcess(false);
                    },1000)*/
                }
            }
        })
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