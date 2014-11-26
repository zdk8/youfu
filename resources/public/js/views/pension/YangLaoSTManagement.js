define(function(){
    var render = function(local,option){
        var ylstgl = local.find('[opt=yanlaostmanagement]');        //养老食堂管理
        var refresh = local.find('[opt=refresh]');        //刷新
        addylstFun(local,refresh);                     //添加老年食堂
        ylstgl.datagrid({
            url:'pension/getallcanteen',
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
                                    updateylstFun(local,departname,data,refresh)                //修改养老机构
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
                                    $.ajax({
                                        url:'pension/deletecanteen',
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
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
            ylstgl.datagrid('reload');
        })


    }

    /*添加老年食堂*/
    var addylstFun = function(local,refresh){
        local.find('[opt=addylst]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/YangLaoSTDlg.htm','views/pension/YangLaoSTDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'添加老年人食堂',
                        width:355,
                        height:380,
                        html:htmfile,
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
    /*修改老年食堂*/
    var updateylstFun = function(local,departname,data,refresh){
        require(['commonfuncs/popwin/win','text!views/pension/YangLaoSTDlg.htm','views/pension/YangLaoSTDlg'],
            function(win,htmfile,jsfile){
                win.render({
                    title:'<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>',
                    width:355,
                    height:380,
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


    return {
        render:render
    }
})