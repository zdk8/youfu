define(function(){
    function render(local,option){

    }
    //加载已享受资金发放人员
    function lazgrantoldready(local){
        var grantmoneymnggrid = local.find("[opt=grantmoneymnggrid]");
        grantmoneymnggrid.datagrid({
            url:'get-grantmoney',
            onLoadSuccess:function(data){
            },
            onDblClickRow:function(rowindex,rowdata){
                var selected = grantmoneymnggrid.datagrid('getSelected');
                if (selected){
                    var post = grantmoneymnggrid.datagrid("getSelected").name;
                    var id = grantmoneymnggrid.datagrid("getSelected").pg_id;
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
            toolbar:[{
                text:'搜索',
                iconCls:'icon-search',
                handler:function(){
                    searchDig()
                }
            },{
                text:'新增',
                iconCls:'icon-add',
                handler:function(){
                    grantMoneyDig();
                }
            },{
                text:'刷新',
                iconCls:'icon-search',
                handler:function(){
                    lazgrantoldready();
                }
            }
            ]
        });
    }

    return {
        render:render
    }

})