define(function(){
    return {
        render:function(local,option){
            /*var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            localDataGrid=searcholdpeople(local,'old/getenpeople','');*/


            var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            peopleinfodatarid.datagrid({
                url:'old/getenpeople',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var deletebtns=local.find('[action=delete]');
                    var grantbtns=local.find('[action=grant]');
                    var btns_arr=[viewbtns,deletebtns,grantbtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:record.name+'详细信息',
                                            htmfile:'text!views/pension/EmptynestOldMan.htm',
                                            jsfile:'views/pension/EmptynestOldMan',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:peopleinfodatarid                //刷新
                                            }
                                        })
                                    }else if($(this).attr("action")=='delete'){
                                        $.messager.confirm('是否删除',
                                            '确定删除？',
                                            function(r){
                                                if (r){
                                                    $.ajax({
                                                        url:"old/delenpeople",
                                                        data:{
                                                            kc_id:record.kc_id
                                                        },
                                                        type:"post",
                                                        success:function(data){
                                                            if(data == "success"){
                                                                peopleinfodatarid.datagrid('reload');
                                                                cj.slideShow('删除成功!')
                                                            }else{
                                                                cj.slideShow('<label style="color: red">删除失败!</label>')
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        );
                                    }
                                });
                            })(i);
                        }
                    }
                },
                striped:true,
                toolbar:local.find('div[tb]')
            })



            var name = local.find('[opt=name]');                        //姓名
            var gender = local.find('[opt=gender]');        //性别
            /*搜索*/
            local.find('.searchbtn').click(function(){
                peopleinfodatarid.datagrid('load',{
                    name:name.val(),
                    gender:gender.combobox('getValue'),
                    minage:local.find('[opt=minage]').val(),
                    maxage:local.find('[opt=maxage]').val()
                })
            })


            /*导出xls*/
            /*local.find('[opt=exportexcel]').click(function(){
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
            });*/
            /*添加字段*/
            /*local.find('[opt=addfield]').click(function(){
                var closobj = peopleinfodatarid.datagrid('options').columns[0];
                require(['commonfuncs/popwin/win','text!views/pension/PeopleInfoXlsFields.htm','views/pension/PeopleInfoXlsFields'],
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
            })*/
        }
    }
})