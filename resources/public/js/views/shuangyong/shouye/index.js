define(function(){
    function render(local,option){
        local.find('[opt=report]').click(function () {
            require(['text!views/shuangyong/youfuduixiang/ServicemanMgt.htm','views/shuangyong/youfuduixiang/ServicemanMgt'], function (htm,js) {
                var panel = $('[opt=contents]').panel({
                    content:htm
                });
                if(js && js.render){
                    js.render(panel);
                }
                $('[opt=content]').fadeIn(1500);
            });
        });
    }

    return {
        render:render
    }
})