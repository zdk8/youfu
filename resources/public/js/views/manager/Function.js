/**
 * Created by Administrator on 2014/9/28.
 */


define(function(){
    var funObj,$functiontree;


    var refresh=function(){

        if($functiontree.tree('getParent',funObj.target)){
            var parentTarget=$functiontree.tree('getParent',funObj.target).target;
            $functiontree.tree('expand', parentTarget);
            $functiontree.tree('reload', parentTarget);
        }else{
            $functiontree.tree('expand', funObj.target);
        }
    }

    var buttons=[{
        text:'保存',
        iconCls:'icon-save',
        handler:function(local){
            local.find('form').form('submit', {
                url:'saveFunction',
                onSubmit: function(){

                    var isValid = $(this).form('validate');
                    if (!isValid){
                        $.messager.progress('close');	// hide progress bar while the form is invalid
                    }
                    return isValid;	// return false will stop the form submission
                },
                success: function(res){
                    refresh();
                }
            });
        }
    },{
        text:'删除',
        iconCls:'icon-remove',
        handler:function(){
            $.ajax(
                {
                    type: "POST",
                    data: { functionid : funObj.functionid },
                    url:'delFunctionById',
                    success:function(){refresh();}
                }
            )
        }
    },{
        text:'添加新节点',
        iconCls:'icon-add',
        handler:function(local){
            if(!funObj){
                alert('请选择节点!');return;
            }

            if(funObj.nodetype=='1'){
                local.find('form').form('clear').form('load',{
                    parent:funObj.functionid,
                    functionid:'-1',
                    log:'1',
                    developer:'1',
                    auflag:'1',rbflag:'1',param1:'1',param2:'1'
                })
            }
        }
    }];
    return {
        render:function(local,option){

            local.find('[name=title]').bind('change blur',function(){
                local.find('[name=description]').val($(this).val());
            });
            var $btnarea=local.find('div.weboxbuttons ul');
            for(var i in buttons){
                var $li=$('<li><label>'+buttons[i].text+'</label></li>');
                $btnarea.append($li);
                $li.bind('click',(function(index){
                    return function(){
                        buttons[index].handler(local);
                    }
                })(i));
            }
            $functiontree=local.find('[opt=functiontree]').tree({
                checkbox:true,
                url:'allmenutree',
                animate:true,
                dnd:true,
                onClick:function(node){
                    funObj=node;
                    if(node.leaf){
                        //设置按钮
                        //local.find('li').has(":contains('添加新节点')").disable()
                    }
                    local.find('form').form('load','getFunctionById?node='+node.functionid);
                },onDragEnter:function(target, source) {
                    var $targetNode = $functiontree.tree('getNode', target);
                    return $targetNode.nodetype=="1";
                },onStopDrag:function(node) {
                    var $p = $functiontree.tree('getParent', node.target);
                    if($p) {
                        $.post("saveFunction",
                            {functionid:node.functionid,parent:$p.functionid},
                            function(result){
                                /*local.find('a[opt=log]').html('操作成功').show(100,function(){
                                    $(this).hide(5000);
                                });*/
                        });
                    }else{
                        //console.log(node.title + "没有父结点");
                        $.post("saveFunction",
                            {functionid:node.functionid,parent:$functiontree.tree('getRoot').parent},
                            function(result){
                                /*local.find('a[opt=log]').html('操作成功').show(100,function(){
                                    $(this).hide(5000);
                                });*/
                            });
                    }


                }
            });


            local.find('a[opt=expandAll]').bind('click',function(){
                $functiontree.tree('expandAll');
            })
            local.find('a[opt=collapseAll]').bind('click',function(){
                $functiontree.tree('collapseAll');
            })
            local.find('a[opt=refresh]').bind('click',function(){
                alert('noaction');
            })

            /*添加*/
            local.find('[opt=save]').click(function () {
                local.find('form').form('submit', {
                    url:'saveFunction',
                    onSubmit: function(){

                        var isValid = $(this).form('validate');
                        if (!isValid){
                            $.messager.progress('close');	// hide progress bar while the form is invalid
                        }
                        return isValid;	// return false will stop the form submission
                    },
                    success: function(res){
                        refresh();
                    }
                });
            });

            /*删除*/
            local.find('[opt=del]').click(function () {
                $.ajax(
                    {
                        type: "POST",
                        data: { functionid : funObj.functionid },
                        url:'delFunctionById',
                        success:function(){refresh();}
                    }
                )
            })

            /*添加新节点*/
            local.find('[opt=addnode]').click(function () {
                if(!funObj){
                    alert('请选择节点!');return;
                }

                if(funObj.nodetype=='1'){
                    local.find('form').form('clear').form('load',{
                        parent:funObj.functionid,
                        functionid:'-1',
                        log:'1',
                        developer:'1',
                        auflag:'1',rbflag:'1',param1:'1',param2:'1'
                    })
                }
            });

        }
    }
})