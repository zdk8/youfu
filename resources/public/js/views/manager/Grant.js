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
            var currentroleid=option.queryParams.roleid;
            $functiontree=local.find('[opt=functiontree]').tree({
                checkbox:true,
                url:'grantmenutree',
                animate:true,
                dnd:true,
                onBeforeLoad:function(node, param){
                    param.roleid=currentroleid
                }
            });

            function getChecked(){
                var nodes = $functiontree.tree('getChecked');
                var s = '';
                for(var i=0; i<nodes.length; i++){
                    if(s.indexOf(nodes[i].functionid)<0){
                        if (s != '') s += ',';
                        s += nodes[i].functionid;
                    }
                }
                $functiontree.tree('getChildren').forEach(function (i) {
                    if($(i.target).find('span.tree-checkbox2').size()){
                        s+=','+i.functionid;
                    }
                })
                $.ajax(
                    {
                        type: "POST",
                        data: { functionids : s ,roleid:currentroleid},
                        url:'savegrant',
                        success:function(res){
                            option.parent.trigger('close');
                        }
                    }
                )
            }




            local.find('a[opt=expandAll]').bind('click',function(){
                $functiontree.tree('expandAll');
            })
            local.find('a[opt=collapseAll]').bind('click',function(){
                $functiontree.tree('collapseAll');
            })
            option.submitbtn.bind('click',function(){
                getChecked();
            })

        }
    }
})