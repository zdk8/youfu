define(function () {

    var a = {
        render: function (panel) {
            $(panel).children('.easyui-tree').tree({
                lines:true,
                animate:true,
                onClick: function (node) {
                    if (!node['leaf'])return;  //如果是不是叶子而是目录文件则返回
                    var title = $((node.target)).text();
                    var tabs = $('#tabs');
                    var isexist = tabs.tabs('exists', title);
                    if (isexist) {
                        tabs.tabs('select', title);
                    } else {
                        require(['views/OpenPage'],function(js){
                            js.open(node);
                        })
                        //f(node)
                    }
                },
                onBeforeLoad: function (node, param) {
                    var p = $(this).parent().parent('[functionid]'); //如果这个tree节点正好在抽屉下面(紧接着的),那么就增加查询参数
                    if (p && !p.attr('isaccessed')) {
                        param.node = p.attr('functionid');
                        p.attr('isaccessed', true);
                    }

                },
                formatter: function (node) {
                    return node.text;
                    //return Number(node['leafcount']) > 0 ? node.text + '(' + node['leafcount'] + ')' : node.text;
                },
                url: 'menutree'
            });




            //默认打开页面
            require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
                var view=defaultPage;
                if(view){
                    TreeClickEvent.ShowContent({
                        htmfile:'text!views/'+view.replace(/\./g,'/')+'.htm',
                        jsfile:onlyPage?'views/Blank':'views/'+view.replace(/\./g,'/'),
                        title:view
                    });
                }
            });
        }





    }
    return a;
})