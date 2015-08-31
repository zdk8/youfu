define(function(){
    var render = function(local,option){
        var yljggl = local.find('[opt=yanlaojgmanagement]');        //养老机构管理
        var refresh = local.find('[opt=query]');        //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var refreshGrid = function(){
            yljggl.datagrid("reload")
        }
        addyljgFun(local,refreshGrid);                     //添加养老机构
        yljggl.datagrid({
            url:'pension/getalldepartment',
            queryParams:{
                deptype:'jigou'
            },
            type:'post',
            onLoadSuccess:function(data){
                var updates = local.find('[action=update]');           //修改
                var viewbtn = local.find('[action=view]');           //查看详细信息
                var del = local.find('[action=delete]');                //删除
                var addrzry = local.find('[action=addrzry]');                //添加入住人员
                var mapbtn = local.find('[action=map]');                //地图
                var rows=data.rows;
                var btns_arr=[updates,viewbtn,del,addrzry,mapbtn];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "update"){             //修改
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    updateyljgFun(local,departname,data,refreshGrid)                //修改养老机构(弹出框)
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
//                                            var data = eval('(' + data + ')');
                                                    if(data.success){
                                                        cj.slideShow("删除成功")
                                                        yljggl.datagrid("reload")
                                                    }else{
                                                        cj.slideShow("<label style='color: red'>该机构下存在入住人员，不能删除！</label>")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }else if(action == "addrzry"){              //添加入住人员
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    addrzryFun(local,departname,data,refreshGrid)                //添加入住人员
                                }else if(action == "map"){
                                    var ywtype = "PT_JLY"
                                    var mapguid = record.mapguid;
                                    window.open (mapURL+'map#task?ywtype='+ywtype+'&'+
                                        'mapguid='+mapguid,
                                        'newwindow', 'height='+window.screen.availHeight+', width='+window.screen.availWidth+', top=0, left=0, toolbar=no, ' +
                                            'menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
            yljggl.datagrid('load',{
                deptype:'jigou',
                departname:departname.val()
            });
        })


    }

    /*添加养老机构*/
    var addyljgFun = function(local,refreshGrid){
        local.find('[opt=addyljg]').click(function(){
            var title = "添加养老机构";
            if($("#tabs").tabs('getTab',title)){
                $("#tabs").tabs('select',title)
            }else{
                cj.showContent({                                          //详细信息(tab标签)
                    title:title,
                    htmfile:'text!views/pension/pensionserviceinfo/YangLaoJGDlg.htm',
                    jsfile:'views/pension/pensionserviceinfo/YangLaoJGDlg',
                    queryParams:{
                        actiontype:'add',         //（处理）操作方式
                        title:title,
                        refresh:refreshGrid
                    }
                })
            }
        })
    }
    /*修改养老机构*/
    var updateyljgFun = function(local,departname,data,refreshGrid){
        var title = '<label style="font-weight: bold;color: rgba(39,42,40,0.83)">编辑-'+departname+'</label>'
        if($("#tabs").tabs('getTab',title)){
            $("#tabs").tabs('select',title)
        }else{
            cj.showContent({                                          //详细信息(tab标签)
                title:title,
                htmfile:'text!views/pension/pensionserviceinfo/YangLaoJGDlg.htm',
                jsfile:'views/pension/pensionserviceinfo/YangLaoJGDlg',
                queryParams:{
                    actiontype:'update',         //（处理）操作方式
                    data:data,
                    title:title,
                    refresh:refreshGrid
                }
            })
        }
    }
    /*添加入住人员*/
    var addrzryFun = function(local,departname,data,refreshGrid){
        var title = '<label style="font-weight: bold;color: rgba(39,42,40,0.83)">添加入住人员-'+departname+'</label>';
        if($("#tabs").tabs('getTab',title)){
            $("#tabs").tabs('select',title)
        }else{
            cj.showContent({                                          //详细信息(tab标签)
                title:title,
                htmfile:'text!views/pension/pensionserviceinfo/RuZhuRYDlg.htm',
                jsfile:'views/pension/pensionserviceinfo/RuZhuRYDlg',
                queryParams:{
                    actiontype:'addrzry',         //（处理）操作方式
                    data:data,
                    title:title,
                    refresh:refreshGrid                //刷新
                }
            })
        }
    }


    return {
        render:render
    }
})