/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/31/14
 * Time: 9:43 AM
 * To change this template use File | Settings | File Templates.
 */
define(function () {

    var a=function (val) {
        var gender;
        var birthdateValue;
        if (15 == val.length) { //15位身份证号码
            birthdateValue = val.charAt(6) + val.charAt(7);
            if (parseInt(birthdateValue) < 10) {
                birthdateValue = '20' + birthdateValue;
            }
            else {
                birthdateValue = '19' + birthdateValue;
            }
            birthdateValue = birthdateValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
            if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14))
                gender = '1';
            else
                gender = '0';
        }
        if (18 == val.length) { //18位身份证号码
            birthdateValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11)

                + '-' + val.charAt(12) + val.charAt(13);
            if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16))
                gender = '1';
            else
                gender = '0';


        }
        return {
            birthdate:birthdateValue,
            gender:gender
        }
    }

    var render=function(local,option){
        local.find('input[opt='+(option.identityid||'identityid')+']').bind('keyup',function(){
            if($(this).val().length<15){
                return;
            }
            var result=a($(this).val());

            var $birthdate=local.find('input[opt='+(option.birthdate||'birthdate')+']');
            var $gender=local.find('input[opt='+(option.gender||'gender')+']');

            if($birthdate.hasClass('easyui-datebox')){
                $birthdate.datebox('setValue',result.birthdate);
            }else{
                $birthdate.val(result.birthdate)
            }

            $gender.combobox('setValue',result.gender)

        })
    }

    return {
        render:render
    }
});
