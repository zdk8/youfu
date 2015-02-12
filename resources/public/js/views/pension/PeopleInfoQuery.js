define(function(){
    function searcholdpeople(local,func,oldtype){
        var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
        peopleinfodatarid.datagrid({
            url:func,
            method:'post',
            queryParams: {
                oldtype:oldtype
            },
            onLoadSuccess:function(data){
                var viewbtns=local.find('[action=view]');
                var deletebtns=local.find('[action=delete]');
                var grantbtns=local.find('[action=grant]');
                var mapbtn = local.find('[action=map]');                //地图
                var btns_arr=[viewbtns,deletebtns,grantbtns,mapbtn];
                var rows=data.rows;
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                if($(this).attr("action")=='view'){
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title:record.name+'详细信息',
                                        htmfile:'text!views/pension/PensionPeopleInfo.htm',
                                        jsfile:'views/pension/PensionPeopleInfo',
                                        queryParams:{
                                            actiontype:'update',         //（处理）操作方式
                                            data:record,                   //填充数据
                                            refresh:peopleinfodatarid                //刷新
                                        }
                                    })
                                    //viewRoleInfo(record);
                                }else if($(this).attr("action")=='map'){
                                    var ywtype = "PT_LNR"
                                    //var mapguid = record.mapguid;
                                    window.open (mapURL+'map#task?ywtype='+ywtype+'&'+
                                        'mapguid='+record.mapguid,
                                        'newwindow', 'height='+window.screen.availHeight+', width='+window.screen.availWidth+', top=0, left=0, toolbar=no, ' +
                                        'menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

                                }else if($(this).attr("action")=='grant'){
                                    //grant(record);
                                }
                            });
                        })(i);
                    }
                }
            },
            striped:true,
            toolbar:local.find('div[tb]')
        })
    }
    return {
        render:function(local,option){
            var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            localDataGrid=searcholdpeople(local,'old/search-oldpeople','');



            /*老人类型选择*/
            var ppselect = local.find('[opt=ppselect]');
            ppselect.change(function () {
                peopleinfodatarid.datagrid('load',{
                    oldtype:ppselect.val()
                })
            })

            var name = local.find('[opt=name]');                        //姓名
            var identityid = local.find('[opt=identityid]');        //身份证
            /*搜索*/
            local.find('.searchbtn').click(function(){
                peopleinfodatarid.datagrid('load',{
                    oldtype:ppselect.val(),
                    name:name.val(),
                    identityid:identityid.val(),
                    minage:local.find('[opt=minage]').val(),
                    maxage:local.find('[opt=maxage]').val()
                })
            })


            /*导出xls*/
            local.find('[opt=exportexcel]').click(function(){
                var closobj = peopleinfodatarid.datagrid('options').columns[0];
                var colsfieldarr = new Array();     //列头字段
                var colstxtarr = new Array();       //列头文本
                for(var o=0;o<closobj.length;o++){
                    if(closobj[o].field != "ro"){
                        if(!closobj[o].hidden){
                            colsfieldarr.push(closobj[o].field);
                            colstxtarr.push(closobj[o].title);
                        }
                    }
                }
                layer.load(1);
                window.location.href="report-xls-auto?colstxt="+colstxtarr+"&colsfield="+colsfieldarr+
                "&datatype="+local.find('[opt=ppselect]').val()+
                "&name="+local.find('[opt=name]').val()+
                "&identityid="+local.find('[opt=identityid]').val()+
                "&minage="+local.find('[opt=minage]').val()+
                "&maxage="+local.find('[opt=maxage]').val()+
                "&title="+local.find('[opt=ppselect] option:selected').text()+
                "&implfunc=sjk";
            });

            local.find('[opt=addfield]').click(function(){
                var closobj = peopleinfodatarid.datagrid('options').columns[0];
                var colsfieldarr = new Array();     //列头字段
                var colstxtarr = new Array();       //列头文本
                for(var o=0;o<closobj.length;o++){
                    if(closobj[o].field != "ro"){
                        //if(!closobj[o].hidden){
                            colsfieldarr.push(closobj[o].field);
                            colstxtarr.push(closobj[o].title);
                        //}
                    }
                }
                require(['commonfuncs/popwin/win','text!views/pension/ReportXlsAuto.htm','views/pension/ReportXlsAuto'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'选择字段',
                            width:620,
                            height:435,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},{
                                    text:'确定',
                                    handler:function(html,parent){
                                        pp = parent;
                                        //peopleinfodatarid.datagrid('hideColumn','name'); //隐藏
                                        var selectRadio = ":input[type=radio] + label";
                                        parent.find(selectRadio).each(function () {
                                            if ($(this).prev()[0].checked){
                                                for(var o=0;o<closobj.length;o++){
                                                    if(closobj[o].hidden){
                                                        peopleinfodatarid.datagrid('showColumn',$(this).prev().val()); //显示
                                                    }
                                                }
                                            }else{
                                                for(var o=0;o<closobj.length;o++){
                                                    if(!closobj[o].hidden){
                                                        peopleinfodatarid.datagrid('hideColumn',$(this).prev().val()); //隐藏
                                                    }
                                                }
                                            }
                                        })
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
                )
            })
        }
    }
})