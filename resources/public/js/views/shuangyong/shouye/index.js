define(function(){
    function render(local,option){

        local.find('[opt=report]').click(function () {
            //console.log($(this).attr('class'));
            var classval =  $(this).attr('class');
            var sctypeval = classval.substr(0,2);
            if(sctypeval == "xy"){
                require(['text!views/shuangyong/youfuduixiang/ServicemanMgt.htm','views/shuangyong/youfuduixiang/ServicemanMgt'], function (htm,js) {
                    var panel = $('[opt=contents]').panel({
                        content:htm
                    });
                    if(js && js.render){
                        js.render(panel,classval);
                    }
                    $('[opt=content]').fadeIn(1500);
                });
            }else if(sctypeval == "ty"){
                require(['text!views/shuangyong/youfuduixiang/VeteransMgt.htm','views/shuangyong/youfuduixiang/VeteransMgt'], function (htm,js) {
                    var panel = $('[opt=contents]').panel({
                        content:htm
                    });
                    if(js && js.render){
                        js.render(panel,classval);
                    }
                    $('[opt=content]').fadeIn(1500);
                });
            }

        });

        $.ajax({
            url:'hyshy/getofficenumb',
            type:'post',
            data:{
            },
            success: function (data) {
                var on = eval(data);
                local.find('[opt=xybc]')[0].innerHTML=on[0].xybcsum;
                local.find('[opt=xysh]')[0].innerHTML=on[0].xyshsum;
                local.find('[opt=xysp]')[0].innerHTML=on[0].xyspsum;
                local.find('[opt=xyzx]')[0].innerHTML=on[0].xyqssum;
                local.find('[opt=tybc]')[0].innerHTML=on[0].tybcsum;
                local.find('[opt=tysh]')[0].innerHTML=on[0].tyshsum;
                local.find('[opt=tysp]')[0].innerHTML=on[0].tyspsum;
                local.find('[opt=tyzx]')[0].innerHTML=on[0].tyqssum;
            }
        });
    }

    return {
        render:render
    }
})