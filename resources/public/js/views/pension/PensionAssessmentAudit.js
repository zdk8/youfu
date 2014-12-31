/*审核处理*/
define(function(){
    function render(local,option){
        var paaudit = local.find('[opt=paaudit]');               //审核datagrid
        var dealwith = local.find('[opt=dealwith]');             //处理
        var operationlog = local.find('[opt=operationlog]');        //操作日志
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
//                                    showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载
                                    cj.showContent({                                          //详细信息(tab标签)
                                         title:record.messagebrief.substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'服务评估详细信息',
                                         htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                         jsfile:'views/pension/PensionAssessmentInfo',
                                         queryParams:{
                                             actiontype:'view',         //（处理）操作方式
                                             data:record,                   //填充数据
                                             refresh:paaudit                //刷新
                                        }
                                    })
                                }else if(action == "dealwith"){                   //处理
                                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                    var title = record.messagebrief.substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'服务评估处理';
                                    console.log(record)
                                    $.ajax({
                                        url:"audit/getassessbyid",
                                        type:"post",
                                        data:{
                                            jja_id:record.bstablepk
                                        },
                                        dataType: 'json',
                                        success:function(data){
                                            if(data){
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                                    jsfile:'views/pension/PensionAssessmentInfo',
                                                    queryParams:{
                                                        actiontype:'dealwith',         //（处理）操作方式
                                                        data:data[0],
                                                        title:title,
                                                        aulevel:record.aulevel
                                                    }
                                                })
                                                setTimeout(function(){
                                                    showProcess(false);
                                                },1000)
                                            }
                                        }
                                    })
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