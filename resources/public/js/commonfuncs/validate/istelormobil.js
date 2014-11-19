/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/30/14
 * Time: 8:12 AM
 * To change this template use File | Settings | File Templates.
 */

define(function () {


    $.extend($.fn.validatebox.defaults.rules, {
        ispostalcode: {
            validator: function (value, param) {
                function isTel(s)
                {
                    var patrn=/^(([0+]d{2,3}-)?(0d{2,3})-)?(d{7,8})(-(d{3,}))?$/;
                    if (!patrn.exec(s)) return false
                    return true
                }
                function isMobil(s)
                {
                    var patrn=/^[+]{0,1}(d){1,3}[ ]?([-]?((d)|[ ]){1,12})+$/;
                    if (!patrn.exec(s)) return false
                    return true
                }

                if(isTel(s)||isMobil(s)){
                    return true;
                }else{
                    return false;
                }

            },
            message: '请输入正确的合法的号码.'
        }
    });
})