define(function(){
    var render = function(local,option){
        //addRadioCssComm(local);

        var selectChecked = ":input[type=checkbox] + label";
        local.find(selectChecked).each(function () {
        }).click(function () {                          //为第个元素注册点击事件
            var name = $($(this).prev()[0]).attr('name')
            var s = $($(this).prev()[0]).attr('name')
            s = ":input[name=" + s + "]+label"
            var isChecked=$(this).prev()[0].checked;
            local.find(s).each(function (i) {
                $(this).prev()[0].checked = false;
                $(this).removeClass("checked");
                $($(this).prev()[0]).removeAttr("checked");
            });
            if(isChecked){
                local.find('[opt='+name+'] :input[type=radio] + label').each(function () {
                    $(this).prev()[0].checked = false;
                    $(this).removeClass("checked");
                    $($(this).prev()[0]).removeAttr("checked");
                })
            }else{
                $(this).prev()[0].checked = true;
                $(this).addClass("checked");
                $($(this).prev()[0]).attr("checked","checked");
                local.find('[opt='+name+'] :input[type=radio] + label').each(function () {
                    if (!$(this).prev()[0].checked){
                        $(this).prev()[0].checked = true;
                        $(this).addClass("checked");
                    }
                })
            }
        }).prev().hide();     //原来的圆点样式设置为不可见

    }

    return {
        render:render
    }
})