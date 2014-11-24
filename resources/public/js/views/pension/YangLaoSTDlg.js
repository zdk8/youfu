define(function(){
    function render(local,option){
        /*确定*/
        local.find('[opt=determine]').click(function(){
            local.find('[opt=yljgdlg]').form('submit',{
                url:'aaaa',
                success:function(data){
                    console.log(data)
                }
            });
        });

        /*取消*/
        local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })
    }

    return {
        render:render
    }

})