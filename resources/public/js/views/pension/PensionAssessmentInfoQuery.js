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
//                console.log(data)
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