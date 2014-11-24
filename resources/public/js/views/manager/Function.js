/**
 * Created by Administrator on 2014/9/28.
 */


define(function(){
    var funObj;
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
                    $.messager.progress('close');	// hide progress bar while submit successfully
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
                    success:function(){$.messager.alert('提示','操作成功!','info');}
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
                var $li=$('<li><a>'+buttons[i].text+'</a></li>');
                $btnarea.append($li);
                $li.bind('click',(function(index){
                    return function(){
                        buttons[index].handler(local);
                    }
                })(i));
            }
            $('#functiontree').tree({
                checkbox:true,
                url:'menutree',
                onClick:function(node){
                    funObj=node;
                    if(node.leaf){
                        //设置按钮
                        //local.find('li').has(":contains('添加新节点')").disable()
                    }
                    local.find('form').form('load','getFunctionById?node='+node.functionid);
                }
            });


        }
    }
})