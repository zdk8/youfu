define(function () {

    function f(node){
        var value=node.value;
        var htmlfile, jsfile;
        var nodelocaltion=node.location;
        if(nodelocaltion){
            var widget=nodelocaltion.replace(/\./g,'/');
            htmlfile='text!views/'+widget+'.htm';
            jsfile='views/'+widget;
        }
        var title=node.text;
        require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
            if(node.type=='1'){ //组件
                TreeClickEvent.ShowContent({
                    htmfile:htmlfile,
                    jsfile:jsfile,
                    title:title,
                    location:nodelocaltion,
                    functionid:node.functionid,
                    readonly:false,
                    viewfolder:'views',
                    currentfolder:'views/'+nodelocaltion.substr(0,nodelocaltion.lastIndexOf('.')).replace('.','/')
                });
            }else if(node.type=='0'){//url
                //console.log(node)
                TreeClickEvent.ShowIframe(value
                    //+'&functionid='+node.functionid
                    ,jsfile,title,node.functionid);
            }
        });
    }
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
                        //alert(node.text)
                        f(node)
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