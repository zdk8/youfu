define(function(){
    $.extend($.fn.validatebox.defaults.rules, {
        minLength: {
            validator: function(value, param){
                return value.length >= param[0];
            },
            message: '请输入不少于 {0} 个字符.'
        }
    });
})
