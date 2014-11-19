/**
 * Created by Administrator on 2014/11/10.
 */
define(function(){
    return {
        render:function(local,option){
            local.find('[type=button]').bind('click',function(){
                var password1 = local.find('[name=password1]');
                var password2 = local.find('[name=password2]');
                if(password1.val() == password2.val()){
                    local.find('form').form('submit',{
                        url:'updatepassword',
                        onSubmit:function(onSubmit){
                            $password1=password1;
                            $password1.val(CryptoJS.enc.Base64.stringify(CryptoJS.MD5($password1.val())));
                            $password2=password2;
                            $password2.val(CryptoJS.enc.Base64.stringify(CryptoJS.MD5($password2.val())));
                        },
                        success:function(data){
                            option.parent.trigger('close');
                        }
                    });
                }else{
//                    var msg = local.find('[opt=msg]');
                    document.getElementById("msg").innerHTML = "<label style='color: red;font-size: 5px;'>密码不一致！</label>";
                }

            })
        }
    }
})