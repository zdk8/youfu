/**
 * Created by weipan on 2014/10/15.
 * desc:下拉菜单维护
 */

define(function(){

    var filepathcombo='manager/CodeMaintenance/combo';
    var filepathcombodt='manager/CodeMaintenance/combodt';

    var combodtd;

    var rendercombo=function(local,option){
        var localDataGrid=
            local.find('.easyui-datagrid-noauto').datagrid({
                url:'getcombo',//cj.getUrl(filepathcombo,'mr','/'),
                loadMsg:'',
                queryParams: {
                    intelligentsp:null
                },
                striped:true,
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var logoutbtns=local.find('[action=logout]');
                    var addbtns=local.find('[action=add]');
                    var codetypes=local.find('[action=codetype]');
                    var btns_arr=[viewbtns,updatebtns,logoutbtns,addbtns,codetypes];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){

                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){

                                    if($(this).attr("action")=='view'){
                                        //view(option,record)
                                    }else if($(this).attr("action")=='add'){
                                        require(['commonfuncs/popwin/win','text!views/manager/code/xt_combodt.htm','views/manager/code/xt_combodt'],function(win,htmfile,jsfile){
                                            win.render({
                                                title:'添加',
                                                width:424,
                                                height:200,
                                                html:$(htmfile),
                                                buttons:[],
                                                renderHtml:function(local,submitbtn,parent){
                                                    jsfile.render(local,{
                                                        submitbtn:submitbtn,
                                                        act:'c',
                                                        queryParams:record,
                                                        localDataGrid:combodtd,
                                                        localDataGrid2:local.trigger('comboclick2'),
                                                        parent:parent,
                                                        onCreateSuccess:function(){
                                                            //parent.trigger('close');
                                                            local.trigger('comboclick2');
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    }else if($(this).attr("action")=='update'){
                                        comboupdate(option,record,local,localDataGrid)
                                    }else if($(this).attr("action")=='logout'){
                                        //logout(option,record,local)
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
        require(['commonfuncs/searchKeyWord'],function(js){
            js.bindEvent(local,localDataGrid,['aaa101'])
        })
        local.find('[opt=addtype]').bind('click',function(){
            require(['commonfuncs/popwin/win','text!views/manager/code/xt_combo.htm','views/manager/code/xt_combo'],function(win,htmfile,jsfile){
                win.render({
                    title:'添加',
                    width:424,
                    height:200,
                    html:htmfile,
                    buttons:[],
                    renderHtml:function(local,submitbtn,parent){
                        jsfile.render(local,{
                            submitbtn:submitbtn,
                            act:'c',
                            localDataGrid:localDataGrid,
                            parent:parent,
                            onCreateSuccess:function(data){
                                parent.trigger('close');
                                localDataGrid.datagrid('reload');
                            }
                        })
                    }
                })
            })
        })
        return localDataGrid;
    }
    var comboupdate=function(option,record,local,localDataGrid){
        require(['commonfuncs/popwin/win','text!views/manager/code/xt_combo.htm','views/manager/code/xt_combo'],function(win,htmfile,jsfile){
            win.render({
                title:'更新',
                width:424,
                height:200,
                html:$(htmfile),
                buttons:[],
                renderHtml:function(local,submitbtn,parent){
                    jsfile.render(local,{
                        submitbtn:submitbtn,
                        act:'u',
                        queryParams:record,
                        localDataGrid:localDataGrid,
                        parent:parent,
                        onCreateSuccess:function(data){
                            parent.trigger('close');
                            localDataGrid.datagrid('reload');
                        }
                    })
                }
            })
        })
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
                                        //logout(option,record,local)
                                    }
                                });

                            })(i);
                        }
                    }
                }
            })
        combodtd = localDataGrid;
        require(['commonfuncs/searchKeyWord'],function(js){
            js.bindEvent(local,localDataGrid,['aaa103'])
        })
        /*local.find('[opt=addcombodt]').bind('click',function(){
            console.log(11)
            var aaa100=local.find('div[tb]>[opt=value]').text();
            if(!local.find('div[tb]>[opt=value]').text().length){
                alert('请选择');return;
            }
            require(['commonfuncs/popwin/win','text!views/manager/code/xt_combodt.htm','views/manager/code/xt_combodt'],function(win,htmfile,jsfile){
                win.render({
                    title:'添加',
                    width:424,
                    height:200,
                    html:$(htmfile),
                    buttons:[],
                    renderHtml:function(local,submitbtn,parent){
                        jsfile.render(local,{
                            submitbtn:submitbtn,
                            act:'c',
                            queryParams:{aaa100:aaa100,aae100:'1',aaa104:'1'},
                            localDataGrid:localDataGrid,
                            parent:parent,
                            onCreateSuccess:function(data){
                                //parent.trigger('close');
                                localDataGrid.datagrid('reload');
                            }
                        })
                    }
                })
            })
        })*/
        return localDataGrid;
    }
    var combodtupdate=function(option,record,local,localDataGrid){
        var parentlocal=local;
        require(['commonfuncs/popwin/win','text!views/manager/code/xt_combodt.htm','views/manager/code/xt_combodt'],function(win,htmfile,jsfile){
            win.render({
                title:'更新',
                width:424,
                height:200,
                html:$(htmfile),
                buttons:[],
                renderHtml:function(local,submitbtn,parent){
                    jsfile.render(local,{
                        submitbtn:submitbtn,
                        act:'u',
                        localDataGrid:localDataGrid,
                        queryParams:record,
                        parent:parent,
                        onUpdateSuccess:function(data){
                            //parent.trigger('close');
                            parentlocal.find('.easyui-datagrid-noauto').datagrid('reload');
                        }
                    })
                }
            })
        })
    }


    return {
        render:function(local,option){
            //option.parent=local;
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