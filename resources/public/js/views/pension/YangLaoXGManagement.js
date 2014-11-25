define(function(){
    var render = function(local,option){
        var ylxggl = local.find('[opt=yanlaoxgmanagement]');        //养老机构管理
        var refresh = local.find('[opt=refresh]');        //刷新
        addylxgFun(local,refresh);                     //添加养老机构
        ylxggl.datagrid({
            url:'pension/getalldepartment',
            queryParams:{
                type:'xingguang'
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
                                /*修改*/
                                if($(this).attr("action") == "update"){
//                                    console.log(record.departname)
                                    console.log(record)
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    updateylxgFun(local,departname,data)                //修改养老机构
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
//                                        console.log(record.id)
                                    /*$.post(
                                     '',
                                     {
                                     id:record.id,
                                     tablename:wholename
                                     },
                                     function(data){
                                     var data = eval('(' + data + ')');
                                     if(data.success){
                                     alert("删除成功")
                                     //                                                loaddate();
                                     }
                                     }
                                     )*/
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
            console.log("refresh")
            ylxggl.datagrid('reload');
        })


    }

    /*添加养老机构*/
    var addylxgFun = function(local,refresh){
        local.find('[opt=addylxg]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoXGDlg.htm','views/pension/YangLaoXGDlg'],
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
    var updateylxgFun = function(local,departname,data){
        require(['commonfuncs/popwin/win','text!views/pension/YangLaoXGDlg.htm','views/pension/YangLaoXGDlg'],
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


    return {
        render:render
    }
})