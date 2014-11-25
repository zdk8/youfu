define(function(){
    var render = function(local,option){
        var yljggl = local.find('[opt=yanlaojgmanagement]');        //养老机构管理
        var refresh = local.find('[opt=refresh]');        //刷新
        addyljgFun(local,refresh);                     //添加养老机构
        yljggl.datagrid({
            url:'pension/getalldepartment',
            queryParams:{
                deptype:'jigou'
            },
            type:'post',
            onLoadSuccess:function(data){
                console.log(data)
                var updates = local.find('[action=update]');           //修改
                var del = local.find('[action=delete]');                //删除
                var addrzry = local.find('[action=addrzry]');                //添加入住人员
                var rows=data.rows;
                var btns_arr=[updates,del,addrzry];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "update"){             //修改
//                                    console.log(record.departname)
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    updateyljgFun(local,departname,data,refresh)                //修改养老机构
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
                                    $.ajax({
                                        url:'pension/deletedepartmentbyid',
                                        type:'post',
                                        data:{
                                            id:record.id
                                        },
                                        success:function(data){
                                            var data = eval('(' + data + ')');
                                            console.log(data)
                                            if(data.success){
                                                alert("删除成功")
                                            }
                                        },
                                        dataType:'json'
                                    })
                                    refresh.trigger('click')
                                }else if(action == "addrzry"){              //添加入住人员
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    addrzryFun(local,departname,data,refresh)                //添加入住人员
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
            yljggl.datagrid('reload');
        })


    }

    /*添加养老机构*/
    var addyljgFun = function(local,refresh){
        local.find('[opt=addyljg]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoJGDlg.htm','views/pension/YangLaoJGDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加养老机构',
                        width:350,
                        height:385,
                        html:htmfile,
                        /*buttons:[
                         {text:'取消',handler:function(html,parent){
                         parent.trigger('close');
                         }},
                         {
                         text:'保存1',
                         handler:function(html,parent){
                         //                                    local.find(html+'[opt=yljgdlg]')
                         console.log(local.find(html+'[opt=yljgdlg]'))
                         }
                         }
                         ],*/
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
            )
        })
    }
    /*修改养老机构*/
    var updateyljgFun = function(local,departname,data,refresh){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoJGDlg.htm','views/pension/YangLaoJGDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>',
                        width:350,
                        height:385,
                        html:htmfile,
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
            )
    }
    /*添加入住人员*/
    var addrzryFun = function(local,departname,data,refresh){
        require(['commonfuncs/popwin/win','text!views/pension/RuZhuRYDlg.htm','views/pension/RuZhuRYDlg'],
            function(win,htmfile,jsfile){
                win.render({
                    title:'<label style="font-weight: bold;color: rgba(39,42,40,0.83)">添加入住人员-'+departname+'</label>',
                    width:660,
                    height:308,
                    html:htmfile,
                    renderHtml:function(local,submitbtn,parent){
                        jsfile.render(local,{
                            submitbtn:submitbtn,
                            act:'c',
                            parent:parent,
                            refresh:refresh,         //刷新按钮
                            actiontype:'addrzry',       //操作方式
                            data:data,                   //填充数据
                            onCreateSuccess:function(data){
                                parent.trigger('close');
                            }
                        })
                    }
                })
            }
        )
    }


    return {
        render:render
    }
})