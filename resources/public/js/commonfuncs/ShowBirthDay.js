/**
 * Created by jack on 14-1-6.
 */

define(function () {
    var a = {
        showBirthday: function (val) {
            var sex;
            var birthdayValue;
            if (15 == val.length) { //15位身份证号码
                birthdayValue = val.charAt(6) + val.charAt(7);
                if (parseInt(birthdayValue) < 10) {
                    birthdayValue = '20' + birthdayValue;
                }
                else {
                    birthdayValue = '19' + birthdayValue;
                }
                birthdayValue = birthdayValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
                if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14))
                    sex = '男';
                else
                    sex = '女';
            }
            if (18 == val.length) { //18位身份证号码
                birthdayValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11)

                    + '-' + val.charAt(12) + val.charAt(13);
                if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16))
                    sex = '男';
                else
                    sex = '女';


            }
            return {
                birthday:birthdayValue,
                sex:sex
            }
        }
    }
    return a;
});
