define(['views/pension/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

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
                                                            refresh:refreshGrid,
                                                            actionType:"view"
                                                        }});
                                                    }else{
                                                        console.log('oops....info1_table is not ready ')
                                                    }
                                                }, 200);
                                            }
                                            /*cj.showContent({                                          //详细信息(tab标签)
                                                title:title,
                                                htmfile:'text!views/pension/PensionServiceApply.htm',
                                                jsfile:'views/pension/PensionServiceApply',
                                                queryParams:{
                                                    actiontype:'information',         //（详细信息）操作方式
                                                    data:record,
                                                    title:title,
                                                    refresh:refreshGrid
                                                }
                                            })*/
                                            //viewRoleInfo(record);
                                        }else if($(this).attr("action")=='logout'){         //注销
                                            var title = "【"+record.name+'】人员注销'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/PensionPeopleLogout.htm',
                                                    jsfile:'views/pension/PensionPeopleLogout',
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
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //变更详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/PensionServiceApply.htm',
                                                    jsfile:'views/pension/PensionServiceApply',
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

            local.find('.searchbtn').click(function(){
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
                var cols = localDataGrid.datagrid('getColumnFields');
                var colsarr = new Array();
                var colstxtarr = new Array();
                for(var i=0;i<cols.length;i++){
                    var colstxt = localDataGrid.datagrid('getColumnOption',cols[i]).title;
                    if(colstxt && colstxt != "操作"){
                        colstxtarr.push(colstxt);
                    }
                    if(cols[i] != "ro"){
                        colsarr.push(cols[i]);
                    }
                }
                $.ajax({
                    url:"report-xls-auto",
                    data:{
                        colstxt:colstxtarr.toString(),
                        colsfield:colsarr.toString()
                    },
                    type:"post",
                    success:function(data){
                        console.log(data)
                        if(data == "true"){
                            window.location.href="reportxls";
                        }
                    }
                })
                //window.location.href="report-xls-auto?colstxt="+colstxtarr+"&colsfield="+colsarr;
                /*require(['commonfuncs/popwin/win','text!views/pension/ReportXlsAuto.htm','views/pension/ReportXlsAuto'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'请选择字段',
                            width:620,
                            height:435,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},{
                                    text:'导出',
                                    handler:function(html,parent){
                                        var selectRadio = ":input[type=radio] + label";
                                        parent.find(selectRadio).each(function () {
                                            if ($(this).prev()[0].checked){
                                                console.log($(this).prev().val())
                                            }
                                        })
                                        pp = parent;
                                        name1 = parent.find('[name=name]')
                                    }
                                }
                            ],
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    parent:parent
                                })
                            }
                        })
                    }
                )*/
                /*require(['text!views/pension/ReportXlsAuto.htm','views/pension/ReportXlsAuto'],
                    function(htmfile,jsfile){
                        var pageii = $.layer({
                            type: 1,   //0-4的选择,（1代表page层）
                            area: ['700px', '500px'],
                            //shade: [0],  //不显示遮罩
                            border: [0], //不显示边框
                            title: [
                                '请选择字段',
                                //自定义标题风格，如果不需要，直接title: '标题' 即可
                                'border:none; background:#61BA7A; color:#fff;'
                            ],
                            bgcolor: '#eee', //设置层背景色
                            page: {
                                html: htmfile
                            },
                            shift: 'top' //从上动画弹出
                        });
                        if(pageii){
                            jsfile.render($(htmfile),{})
                        }
                        //jsfile.render(result2_table,{plocal:local})
                    }
                )*/

                /*if(pageii > 0){
                    lll = local.find('.btns')
                }*/
                //layer.close(pageii);

            })
        }
    }
})