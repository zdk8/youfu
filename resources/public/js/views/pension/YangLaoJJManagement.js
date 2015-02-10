define(function(){
    var render = function(local,option){
        var yljjgl = local.find('[opt=yanlaojjmanagement]');        //居家养老设施管理
        var refresh = local.find('[opt=refresh]');                  //刷新
        var departname = local.find('[opt=departname]');            //机构名称
        var refreshGrid = function(){
            yljjgl.datagrid("reload")
        }
        addyljjFun(local,refreshGrid);                                       //添加居家养老设施
        yljjgl.datagrid({
            url:'pension/getalldepartment',
            queryParams:{
                deptype:'jujia'
            },
            type:'post',
            onLoadSuccess:function(data){
                console.log(data)
                var updates = local.find('[action=update]');           //修改
                var del = local.find('[action=delete]');                //删除
                var rows=data.rows;
                var btns_arr=[updates,del];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "update"){         //修改
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    updateyljjFun(local,departname,data,refreshGrid)        //修改居家养老服务设施
                                    /*cj.showContent({
                                     title:record.biaozhunmingcheng+'修改',
                                     htmfile:'text!views/dmxt/PlaceCommon.htm',
                                     jsfile:'views/dmxt/PlaceCommon',
                                     queryParams:{
                                     id:record.id,
                                     actionType:"update"*//*,
                                     tablename:tablename,
                                     wholename:wholename,
                                     headname:record.leibiemingcheng*//*
                                     }
                                     })*/
                                }else if(action == "delete"){           //删除
                                    var testmsg = "是否删除该机构【<label style='color: darkslategrey;font-weight: bold'>"+record.departname+"</label>】?"
                                    $.messager.confirm('温馨提示', testmsg, function(r){
                                        if (r){
                                            $.ajax({
                                                url:'pension/deletedepartmentbyid',
                                                type:'post',
                                                data:{
                                                    dep_id:record.dep_id
                                                },
                                                success:function(data){
                                                    if(data.success){
                                                        cj.slideShow("删除成功")
                                                        yljjgl.datagrid("reload")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }
                            });
                        })(i)
                    }
                }
            }
        })

        refresh.click(function(){
            yljjgl.datagrid('load',{
                deptype:'jujia',
                departname:departname.val()
            });
        })
    }

    /*添加居家养老设施*/
    var addyljjFun = function(local,refreshGrid){
        local.find('[opt=addyljj]').click(function(){
            var title = "添加养老设施"
            if($("#tabs").tabs('getTab',title)){
                $("#tabs").tabs('select',title)
            }else{
                cj.showContent({                                          //详细信息(tab标签)
                    title:title,
                    htmfile:'text!views/pension/YangLaoJJDlg.htm',
                    jsfile:'views/pension/YangLaoJJDlg',
                    queryParams:{
                        actiontype:'add',         //（处理）操作方式
                        title:title,
                        refresh:refreshGrid
                    }
                })
            }
            /*require(['commonfuncs/popwin/win','text!views/pension/YangLaoJJDlg.htm','views/pension/YangLaoJJDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加养老设施',
                        width:700,
                        height:258,
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
                                parent:parent,
                                refresh:refresh,         //刷新按钮
                                actiontype:'add',       //操作方式
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                }
                            })
                        }
                    })
                }
            )*/
        })
    }
    /*修改居家养老设施*/
    var updateyljjFun = function(local,departname,data,refreshGrid){
        var title = '<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>'
        if($("#tabs").tabs('getTab',title)){
            $("#tabs").tabs('select',title)
        }else{
            cj.showContent({                                          //详细信息(tab标签)
                title:title,
                htmfile:'text!views/pension/YangLaoJJDlg.htm',
                jsfile:'views/pension/YangLaoJJDlg',
                queryParams:{
                    actiontype:'update',         //（处理）操作方式
                    data:data,
                    title:title,
                    refresh:refreshGrid
                }
            })
        }
        /*require(['commonfuncs/popwin/win','text!views/pension/YangLaoJJDlg.htm','views/pension/YangLaoJJDlg'],
            function(win,htmfile,jsfile){
                win.render({
                    title:'<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>',
                    width:700,
                    height:258,
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
                            parent:parent,
                            refresh:refresh,             //刷新按钮
                            actiontype:'update',       //操作方式
                            data:data,                   //填充数据
                            onCreateSuccess:function(data){
                                parent.trigger('close');
                            }
                        })
                    }
                })
            }
        )*/
    }

    return {
        render:render
    }
})