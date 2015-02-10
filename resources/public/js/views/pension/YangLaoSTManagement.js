define(function(){
    var render = function(local,option){
        var ylstgl = local.find('[opt=yanlaostmanagement]');        //养老食堂管理
        var refresh = local.find('[opt=refresh]');        //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var refreshGrid = function(){
            ylstgl.datagrid("reload")
        }
        addylstFun(local,refreshGrid);    //添加老年食堂
        ylstgl.datagrid({
            url:'pension/getallcanteen',
            type:'post',
            onLoadSuccess:function(data){
                var updates = local.find('[action=update]');           //修改
                var del = local.find('[action=delete]');                //删除
                var rows=data.rows;
                var btns_arr=[updates,del];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                /*修改*/
                                if($(this).attr("action") == "update"){
                                    var data = record;
                                    var departname = record.departname;                         //机构名称
                                    updateylstFun(local,departname,data,refreshGrid)                //修改养老机构
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
                                }
                                /*删除*/
                                if($(this).attr("action") == "delete"){
                                    var testmsg = "是否删除该机构【<label style='color: darkslategrey;font-weight: bold'>"+record.departname+"</label>】?"
                                    $.messager.confirm('温馨提示', testmsg, function(r){
                                        if (r){
                                            $.ajax({
                                                url:'pension/deletecanteen',
                                                type:'post',
                                                data:{
                                                    c_id:record.c_id
                                                },
                                                success:function(data){
                                                    if(data.success){
                                                        cj.slideShow("删除成功")
                                                        ylstgl.datagrid("reload")
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
            ylstgl.datagrid('load',{
                departname:departname.val()
            });
        })


    }

    /*添加老年食堂*/
    var addylstFun = function(local,refreshGrid){
        local.find('[opt=addylst]').click(function(){
            var title = "添加老年人食堂"
            if($("#tabs").tabs('getTab',title)){
                $("#tabs").tabs('select',title)
            }else{
                cj.showContent({                                          //详细信息(tab标签)
                    title:title,
                    htmfile:'text!views/pension/YangLaoSTDlg.htm',
                    jsfile:'views/pension/YangLaoSTDlg',
                    queryParams:{
                        actiontype:'add',         //（处理）操作方式
                        title:title,
                        refresh:refreshGrid
                    }
                })
            }
            /*require(['commonfuncs/popwin/win','text!views/pension/YangLaoSTDlg.htm','views/pension/YangLaoSTDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加老年人食堂',
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
    /*修改老年食堂*/
    var updateylstFun = function(local,departname,data,refreshGrid){
        var title = '<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>'
        if($("#tabs").tabs('getTab',title)){
            $("#tabs").tabs('select',title)
        }else{
            cj.showContent({                                          //详细信息(tab标签)
                title:title,
                htmfile:'text!views/pension/YangLaoSTDlg.htm',
                jsfile:'views/pension/YangLaoSTDlg',
                queryParams:{
                    actiontype:'update',         //（处理）操作方式
                    data:data,
                    title:title,
                    refresh:refreshGrid
                }
            })
        }
        /*require(['commonfuncs/popwin/win','text!views/pension/YangLaoSTDlg.htm','views/pension/YangLaoSTDlg'],
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
                            refresh:refresh,         //刷新按钮
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