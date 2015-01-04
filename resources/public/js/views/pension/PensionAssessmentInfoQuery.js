define(function(){
    function render(local,option){
        var pensionassessmentquery = local.find('[opt=pensionassessmentquery]');    //人员评估datagrid
        /*加载人员评估信息*/
        pensionassessmentquery.datagrid({
            url:'need/search-oldassessment',
            method:'post',
            onDblClickRow: function(){
                var selected = $('#need').datagrid('getSelected');
                if (selected){
                    var post = $("#need").datagrid("getSelected").name;
                    var id = $("#need").datagrid("getSelected").pg_id;
//                    alert("ok"+post+"id:"+id);
                    var jq = top.jQuery;
                    if (jq('#tabs').tabs('exists', post+'评估信息'))
                        jq('#tabs').tabs('select', post+'评估信息');
                    else {
                        var content = '<iframe scrolling="auto" frameborder="0"  src="'+"tneed?id=" + id+'" style="width:100%;height:100%;"></iframe>';
                        jq('#tabs').tabs('add',{
                            title:post+'评估信息',
                            content:content,
                            closable:true
                        });
                    }
                }
            },
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
                                        htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                        jsfile:'views/pension/PensionAssessmentInfo',
                                        queryParams:{
                                            actiontype:'update',         //（处理）操作方式
                                            data:record,                   //填充数据
                                            refresh:pensionassessmentquery                //刷新
                                        }
                                    })
                                    //viewRoleInfo(record);
                                }else if($(this).attr("action")=='delete'){
                                    //deleteRoleInfo(record);
                                }else if($(this).attr("action")=='grant'){
                                    //grant(record);
                                }
                            });
                        })(i);
                    }
                }
            }
        });

        var name = local.find('[opt=name]');                        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        /*搜索*/
        local.find('.searchbtn').click(function(){
            pensionassessmentquery.datagrid('load',{
                name:name.searchbox('getValue'),
                identityid:identityid.searchbox('getValue')
            })
        })
    }

    return {
        render:render
    }

})