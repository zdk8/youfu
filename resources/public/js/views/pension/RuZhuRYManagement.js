define(function(){
    var render = function(local,option){
        var rzrygl = local.find('[opt=ruzhurymanagement]');        //入住人员管理
        var refresh = local.find('[opt=refresh]');               //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var name = local.find('[opt=name]');                     //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        var refreshGrid = function(){
            rzrygl.datagrid("reload")
        }
        rzrygl.datagrid({
            url:'pension/getalloldpeopledepart',
            queryParams:{
                deptype:'jigou'
            },
            type:'post',
            onLoadSuccess:function(data){
                var viewbtn = local.find("[action=view]")
                var cancellation = local.find('[action=cancellation]');     //注销入住人员
                var rows=data.rows;
                var btns_arr=[viewbtn,cancellation];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "cancellation"){             //注销
                                    var departname = record.departname;         //机构名称
                                    var testmsg = "是否注销人员【<label style='color: darkslategrey;font-weight: bold'>"+record.name+"</label>】?"
                                    $.messager.confirm('温馨提示', testmsg, function(r){
                                        if (r){
                                            $.ajax({
                                                url:'pension/oldpeoplecheckout',
                                                type:'post',
                                                data:{
                                                    opd_id:record.opd_id
                                                },
                                                success:function(data){
                                                    if(data.success){
                                                        cj.slideShow('人员注销成功');
                                                        rzrygl.datagrid("reload")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }else if(action == "view"){
                                    var title = "【"+record.name+'】详细信息';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:title,
                                            htmfile:'text!views/pension/RuZhuRYDlg.htm',
                                            jsfile:'views/pension/RuZhuRYDlg',
                                            queryParams:{
                                                actiontype:'view',         //（处理）操作方式
//                                                data:data,                   //填充数据
                                                record:record,
                                                title:title,
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }
                                }else if(action == "sign"){
                                   console.log("签到")
                                }
                            });
                        })(i)
                    }
                }
            },
            toolbar:local.find('div[tb]')
        })
        refresh.click(function(){
            rzrygl.datagrid('load',{
                deptype:'jigou',
                departname:departname.val(),
                name:name.val(),
                identityid:identityid.val()
            });
        })

        /*导出xls*/
        local.find('[opt=exportexcel]').click(function(){
            var closobj = rzrygl.datagrid('options').columns[0];
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
            "&datatype=jigou"+
            "&departname="+departname.val()+
            "&identityid="+local.find('[opt=identityid]').val()+
            "&name="+name.val()+
            "&title=入住人员"+
            "&implfunc=rzry";
        });

        /*添加字段*/
        local.find('[opt=addfield]').click(function(){
            var closobj = rzrygl.datagrid('options').columns[0];
            require(['commonfuncs/popwin/win','text!views/pension/RuZhuRYXlsFields.htm','views/pension/RuZhuRYXlsFields'],
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
                                                    rzrygl.datagrid('showColumn',$(this).prev().val()); //显示
                                                }
                                            }
                                        }else{
                                            for(var o=0;o<closobj.length;o++){
                                                if(!closobj[o].hidden){
                                                    rzrygl.datagrid('hideColumn',$(this).prev().val()); //隐藏
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

        /*全部签到*/
        local.find('[opt=signbtn]').click(function () {
            console.log("全部签到")
        })
    }

    return {
        render:render
    }
})