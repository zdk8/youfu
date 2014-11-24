/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/30/14
 * Time: 8:01 AM
 * To change this template use File | Settings | File Templates.
 */

define(function () {


    $.extend($.fn.validatebox.defaults.rules, {
        ispostalcode: {
            validator: function (value, param) {
                function isPostalCode(s) {
                    var patrn = /^[a-zA-Z0-9 ]{3,12}$/;
                    if (!patrn.exec(s)) return false
                    return true
                }


                return isPostalCode(value);
            },
            message: '请输入正确的合法的邮政编码.'
        }
    });
})