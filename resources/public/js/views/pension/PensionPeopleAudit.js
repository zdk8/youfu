/*审核处理*/
define(function(){
    function render(local,option){
        var ppaudit = local.find('[opt=ppaudit]');               //审核datagrid
        var dealwith = local.find('[opt=dealwith]');             //处理
        var operationlog = local.find('[opt=operationlog]');        //操作日志
        /*加载审核人员*/
        ppaudit.datagrid({
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
                                if(action == "info"){                                       //详细信息
                                    cj.showContent({                                          //修改养老机构(tab标签)
                                         title:record.departname+'修改',
                                         htmfile:'text!views/pension/PensionPeopleInfo.htm',
                                         jsfile:'views/pension/PensionPeopleInfo',
                                         queryParams:{
                                             actiontype:'update',       //操作方式
                                             data:record                   //填充数据
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
//                                                        submitbtn:submitbtn1,
                                                        act:'c',
                                                        data:record,
                                                        parent:parent,
                                                        actiontype:'add',       //操作方式
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
            console.log(2)
        })
    }

    return {
        render:render
    }

})