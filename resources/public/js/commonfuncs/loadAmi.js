/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 8/11/14
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */


define(function(){
    return {
        start:function(){
            var h = document.body.clientHeight;
            $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:h}).appendTo("body");
            $("<div class=\"datagrid-mask-msg\"></div>").html("正在上传数据，请稍候。。。").appendTo("body").css({display:"block", width:200,
                left:($(document.body).outerWidth(true) - 190) / 2,
                top:(h - 45) / 2});

        },
        end:function(f){
            $('.datagrid-mask-msg').html('上传数据成功');
            window.setTimeout(function(){
                $('.datagrid-mask-msg').remove();
                $('.datagrid-mask').remove();
                if(f){
                    f();
                }
            },300)

        }
    }
})