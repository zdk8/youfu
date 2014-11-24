define(function () {
    $.extend($.fn.validatebox.defaults.rules, {
        maxLength: {

            validator: function (value, param) {
                var result=value.getBytes() <= param[0];
                if(!result){
                   this.message= '请输入不多于 {0} 个字节.<br>当前字节'+value.getBytes();
                }
                return result;
            },
            message: '请输入不多于 {0} 个字节.'
        }
    });
})
