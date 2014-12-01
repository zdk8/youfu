define(function(){
    function render(local,option){
        var pensionassessmentquery = local.find('[opt=pensionassessmentquery]');    //人员评估datagrid
        /*加载人员评估信息*/
        pensionassessmentquery.datagrid({
            url:'needs',
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
                console.log(data)
            }
        });
    }

    return {
        render:render
    }

})