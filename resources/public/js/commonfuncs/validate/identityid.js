define(function(){
    /*身份证号验证*/
    require(['commonfuncs/PersonidValidator'],function(PersonidValidator){
        $.extend($.fn.validatebox.defaults.rules, {
            identityid: {
                validator: PersonidValidator.IdentityCodeValid,
                message: '身份证不合法,请确认身份证是否正确输入!'
            }
        });

    })
})
