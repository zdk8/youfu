define(['views/pension/serviceassinfo/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            //local.find('.datagrid-header-rownumber').html('<a href="javascript:void(0)" opt="addfield">添加</a>');

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getauditdata',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var logoutbtns=local.find('[action=logout]');
                        var changebtns=local.find('[action=change]');
                        var btns_arr=[viewbtns,logoutbtns,changebtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            var title = "【"+record.name+'】服务申请详细信息'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                $("#tabs").tabs('add', {
                                                    title: title,
                                                    href: 'getPensionServiceAssHtml?jja_id='+record.jja_id,
                                                    closable: true
                                                })
                                                var timer = window.setInterval(function () {
                                                    var local=$("#tabs").tabs('getTab',title)
                                                    if (local && local.find('[opt=info1_table]').length) {
                                                        window.clearInterval(timer);
                                                        psafile.render(local,{queryParams:{
                                                            title:title,
                                                            data:data,
                                                            record:record,
                                                            refresh:refreshGrid,
                                                            actionType:"view"
                                                        }});
                                                    }else{
                                                        //console.log('oops....info1_table is not ready ')
                                                    }
                                                }, 200);
                                            }
                                        }else if($(this).attr("action")=='logout'){         //注销
                                            var title = "【"+record.name+'】人员注销'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                layer.load();
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/PensionPeopleLogout.htm',
                                                    jsfile:'views/pension/serviceassinfo/PensionPeopleLogout',
                                                    queryParams:{
                                                        actiontype:'logout',         //（处理）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })
                                            }
                                        }else if($(this).attr("action")=='change'){               //变更
                                            var title = "【"+record.name+'】信息变更'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                layer.load();
                                                cj.showContent({                                          //变更详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/PensionServiceApply.htm',
                                                    jsfile:'views/pension/serviceassinfo/PensionServiceApply',
                                                    queryParams:{
                                                        actiontype:'change',         //（处理）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })
                                            }
                                        }
                                    });
                                })(i);
                            }

                            //check
                            if(rows[i].userid) {
                                localDataGrid.datagrid('checkRow', i);
                            }
                        }
                    },
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            /*老人类型选择*/
            var ppselect = local.find('[opt=ppselect]');
            ppselect.change(function () {
                localDataGrid.datagrid('load',{
                    datatype:ppselect.val()
                })
            })

            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    datatype:local.find('[opt=ppselect]').val(),
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val(),
                    minage:local.find('[opt=minage]').val(),
                    maxage:local.find('[opt=maxage]').val()
                })
            })

            /*导出xls*/
            local.find('[opt=exportexcel]').click(function(){
                var closobj = localDataGrid.datagrid('options').columns[0];
                var colsfieldarr = new Array();
                var colstxtarr = new Array();
                colsfieldarr.push('name');
                colstxtarr.push('姓名');
                for(var o=0;o<closobj.length;o++){
                    if(closobj[o].field != "ro"){
                        if(!closobj[o].hidden){
                            colsfieldarr.push(closobj[o].field);
                            colstxtarr.push(closobj[o].title);
                        }
                    }
                }
                //layer.load(1);
                window.location.href="report-xls-auto?colstxt="+colstxtarr+"&colsfield="+colsfieldarr+
                    "&datatype="+local.find('[opt=ppselect]').val()+
                    "&name="+local.find('[opt=name]').val()+
                    "&identityid="+local.find('[opt=identityid]').val()+
                    "&minage="+local.find('[opt=minage]').val()+
                    "&maxage="+local.find('[opt=maxage]').val()+
                    "&title="+local.find('[opt=ppselect] option:selected').text()+
                    "&implfunc=fwpg";
            })

            /*添加字段*/
            local.find('[opt=addfield]').click(function(){
                var closobj = localDataGrid.datagrid('options').columns[0];
                require(['commonfuncs/popwin/win','text!views/pension/serviceassinfo/PensionServiceXlsFields.htm','views/pension/serviceassinfo/PensionServiceXlsFields'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'选择字段',
                            width:620,
                            height:235,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},{
                                    text:'确定',
                                    handler:function(html,parent){
                                        var selectRadio = ":input[type=radio] + label";
                                        parent.find(selectRadio).each(function () {
                                            if ($(this).prev()[0].checked){
                                                for(var o=0;o<closobj.length;o++){
                                                    if(closobj[o].hidden){
                                                        localDataGrid.datagrid('showColumn',$(this).prev().val()); //显示
                                                    }
                                                }
                                            }else{
                                                for(var o=0;o<closobj.length;o++){
                                                    if(!closobj[o].hidden){
                                                        localDataGrid.datagrid('hideColumn',$(this).prev().val()); //隐藏
                                                    }
                                                }
                                            }
                                            parent.trigger('close');
                                        })
                                    }
                                }
                            ],
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    parent:parent,
                                    closobj:closobj
                                })
                            }
                        })
                    }
                )
            })
        }
    }
})