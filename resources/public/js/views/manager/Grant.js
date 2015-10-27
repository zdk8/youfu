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

    return {
        render:function(local,option){
            layer.closeAll('loading');
            var li = '<li><input type="button" value="授权" class="btns" opt="grant"></li>';
            cj.addToolBar(local,option,li);


            var currentroleid=option.queryParams.record.roleid;
            $functiontree=local.find('[opt=functiontree]').tree({
                checkbox:true,
                url:'grantmenutree',
                animate:true,
                dnd:true,
                onBeforeLoad:function(node, param){
                    param.roleid=currentroleid
                }
            });

            function getChecked($this){
                var nodes = $functiontree.tree('getChecked');
                var s = [];
                for(var i=0; i<nodes.length; i++){
                    if(s.indexOf(nodes[i].functionid)<0){
                        s.push(nodes[i].functionid);
                    }
                }
                $functiontree.tree('getChildren').forEach(function (i) {
                    if($(i.target).find('span.tree-checkbox2').size()){
                        s.push(i.functionid);
                    }
                })
                $.ajax(
                    {
                        type: "POST",
                        data: { functionids : s.toString() ,roleid:currentroleid},
                        url:'savegrant',
                        success:function(res){
                            layer.closeAll('loading');
                            layer.close(option.index);
                            cj.showSuccess('授权完成');
                            $this.attr("disabled",false);//按钮启用
                        }
                    }
                )
            }

            /*授权*/
            local.find('[opt=grant]').click(function(){
                layer.load(2);
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                getChecked($this);
            });




            local.find('a[opt=expandAll]').bind('click',function(){
                $functiontree.tree('expandAll');
            })
            local.find('a[opt=collapseAll]').bind('click',function(){
                $functiontree.tree('collapseAll');
            })

        }
    }
})