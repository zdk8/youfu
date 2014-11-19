/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        initProcessFromRole:function(roleid,type){
            var me=this;
            var params = {
                roleid:roleid,
                type:type
            };
            var successFunc = function (response) {
                processRoleBtn=response;
            };

            $.ajax({
                type: "post",        //使用get方法访问后台
                dataType: "json",       //返回json格式的数据
                url: "ajax/getallfuncsbyrule.jsp",   //要访问的后台地址
                data: params,         //要发送的数据
                complete :function(){},      //AJAX请求完成时
                success: successFunc
            });


        }

    }

    return a;
});
