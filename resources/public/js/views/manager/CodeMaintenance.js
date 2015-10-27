/**
 * Created by weipan on 2014/10/15.
 * desc:下拉菜单维护
 */

define(function(){

    var combodtd;

    var rendercombo=function(local,option){
        var localDataGrid=
            local.find('.easyui-datagrid-noauto').datagrid({
                url:'getcombo',
                loadMsg:'',
                queryParams: {
                    intelligentsp:null
                },
                striped:true,
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var addbtns=local.find('[action=add]');
                    var delbtns=local.find('[action=del]');
                    var codetypes=local.find('[action=codetype]');
                    var btns_arr=[viewbtns,updatebtns,delbtns,addbtns,codetypes];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){

                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                    }else if($(this).attr("action")=='add'){
                                        layer.load(2);
                                        require(['text!views/manager/code/xt_combodt.htm','views/manager/code/xt_combodt'],
                                            function(htmfile,jsfile){
                                                layer.open({
                                                    title:'添加',
                                                    type: 1,
                                                    area: ['424px', '200px'], //宽高
                                                    content: htmfile,
                                                    success: function(layero, index){
                                                        jsfile.render(layero,{
                                                            index:index,
                                                            queryParams:{
                                                                actiontype:'add',
                                                                record:record,
                                                                dgrid:combodtd
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        );
                                    }else if($(this).attr("action")=='update'){
                                        comboupdate(option,record,local,localDataGrid)
                                    }else if($(this).attr("action")=='del'){
                                        layer.confirm('确定要删除么？', {icon: 3,title:'温馨提示'}, function(index){
                                            layer.close(index);
                                            layer.load();
                                            $.ajax({
                                                url:'delcombo',
                                                type:'post',
                                                data:{
                                                    aaa100:record.aaa100
                                                },
                                                success: function (data) {
                                                    layer.closeAll('loading');
                                                    if(data == "false"){
                                                        layer.alert('该类别下存在代码值，请先将代码清空再进行删除!', {icon: 6,title:'温馨提示'});
                                                    }else{
                                                        cj.showSuccess('删除成功');
                                                        localDataGrid.datagrid('reload');
                                                    }
                                                }
                                            });
                                        });
                                    }else if($(this).attr("action")=="codetype"){
                                        //option.parent.trigger('comboclick',record);
                                        local.trigger('comboclick',record);
                                    }
                                });

                            })(i);
                        }
                    }
                }
            })
        /*require(['commonfuncs/searchKeyWord'],function(js){
            js.bindEvent(local,localDataGrid,['aaa101'])
        })*/
        local.find('[opt=addtype]').bind('click',function(){
            layer.load(2);
            require(['text!views/manager/code/xt_combo.htm','views/manager/code/xt_combo'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加',
                        type: 1,
                        area: ['424px', '200px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    dgrid:localDataGrid
                                }
                            });
                        }
                    });
                }
            );
        })
        return localDataGrid;
    }
    var comboupdate=function(option,record,local,localDataGrid){
        layer.load(2);
        require(['text!views/manager/code/xt_combo.htm','views/manager/code/xt_combo'],
            function(htmfile,jsfile){
                layer.open({
                    title:'类别信息',
                    type: 1,
                    area: ['424px', '200px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'update',
                                record:record,
                                dgrid:localDataGrid
                            }
                        });
                    }
                });
            }
        );
    }


    var rendercombodt=function(local,option){
        var localDataGrid=
            local.find('.easyui-datagrid-noauto').datagrid({
                url_0:'getcombodt',
                queryParams: {
                    intelligentsp:null,
                    aaa100:0
                },
                striped:true,
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var logoutbtns=local.find('[action=logout]');
                    var memlistbtns=local.find('[action=memlist]');
                    var btns_arr=[viewbtns,updatebtns,logoutbtns,memlistbtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        //view(option,record)
                                    }else if($(this).attr("action")=='memlist'){
                                        //memlist(option,record,local)
                                    }else if($(this).attr("action")=='update'){
                                        combodtupdate(option, record, local,localDataGrid);
                                    }else if($(this).attr("action")=='logout'){
                                        layer.confirm('确定要删除么？', {icon: 3,title:'温馨提示'}, function(index){
                                            layer.close(index);
                                            layer.load();
                                            $.ajax({
                                                url:'delcombodt',
                                                type:'post',
                                                data:{
                                                    aaz093:record.aaz093
                                                },
                                                success: function (data) {
                                                    layer.closeAll('loading');
                                                    cj.showSuccess('删除成功');
                                                    local.find('[opt=dgrid_combodt]').datagrid('reload');
                                                    layer.close(option.index);
                                                }
                                            });
                                        });
                                    }
                                });
                            })(i);
                        }
                    }
                }
            })
        combodtd = localDataGrid;
        /*require(['commonfuncs/searchKeyWord'],function(js){
            js.bindEvent(local,localDataGrid,['aaa103'])
        })*/
        return localDataGrid;
    }
    var combodtupdate=function(option,record,local,localDataGrid){
        layer.load(2);
        require(['text!views/manager/code/xt_combodt.htm','views/manager/code/xt_combodt'],
            function(htmfile,jsfile){
                layer.open({
                    title:'代码信息',
                    type: 1,
                    area: ['424px', '200px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'update',
                                record:record,
                                dgrid:localDataGrid
                            }
                        });
                    }
                });
            }
        );
    }


    return {
        render:function(local,option){
            if(option && option.parent){
                option.parent=local;
            }
            var combo,combodt;
            combo=rendercombo(local.find('div[opt=combo]'), option);
            var localdt=local.find('div[opt=combodt]');
            //combodt=rendercombodt(localdt, option);
            combodt=rendercombodt(localdt, local);
            local.bind('comboclick',function(e,data){
                var options=combodt.datagrid('options');
                options.url=options.url_0;
                combodt.datagrid('load',{
                    name: 'name01',
                    aaa100:data.aaa100
                });
                localdt.find('div[tb]>[opt=text]').text(data.aaa101);
                localdt.find('div[tb]>[opt=value]').text(data.aaa100).hide();
            })
            local.bind('comboclick2',function(e){
                var options=combodt.datagrid('options');
                options.url=options.url_0;
                combodt.datagrid('reload');
            })

        }
    }
})