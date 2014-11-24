/**
 * Created by jack on 13-12-31.
 */
define(function(){

    var a={

        render:function(parameters){
            $('#menu_pension .navigation-tree').tree({
                //url:'tree_data.json'
                onClick: function (node){

                    var tree=$(this);
                    var businesstype=tree.attr('businesstype');

                    var me=this;
                    if(tree.tree('isLeaf', node.target)){
                        var isnew=false;
                        if($('#tabs').tabs('exists',1)){
                            $('#tabs').tabs('select',1);
                            isnew=$('#tabs').tabs('getSelected').panel('options').id!=node.id;
                        }
                        if(!$('#tabs').tabs('exists',1)||me.nodeid!=node.id||isnew){
                            var folder=tree.attr('folder');
                            var htmlfile='text!'+folder+node.value+'.htm';
                            var jsfile=folder+node.value;
                            var value=node.value;
                            var title=node.text;
                            require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
                                if(spatialchildTableType[title]) businesstype=title;
                                TreeClickEvent.ShowContent(htmlfile,jsfile,title,value,folder,null,node.id,businesstype);
                                me.nodeid=node.id;
                            });

                        }

                    }

                },
                onBeforeExpand:function(node){
                    this.searchtype=node.text;

                },
                onLoadSuccess:function(node, data){

                },
                onBeforeLoad:function(node, param){
                    param.roleid=roleid;
                    //param.leaf=true;
                    if(this.searchtype){
                        param.leaf=true;
                    }else{
                        this.searchtype="";
                    }
                    param.type=$(this).attr('name')+this.searchtype;
                },
                url:'ajax/gettreefuncsbyrule.json'

            });

        }
    }

    return a;
});