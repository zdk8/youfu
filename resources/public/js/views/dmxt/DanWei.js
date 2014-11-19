/**
 * 单位表单
 * Created by Administrator on 2014/9/24.
 */


define(function()
{
    var filepath='dmxt/DanWei';
    function render(local,option)
    {
        require(['commonfuncs/CuRecord'],function(cu){
            cu.cfg({
                local:local,
                filepath:filepath,
                submitbtn:option.submitbtn,
                data:option.queryParams,
                cparam:option.queryParams,
                uparam:option.queryParams,
                act:option.act,
                parent:option.parent,
                onAjaxDataFn:function(res){
                    var formobj=$res[0];
                    if(formobj.sys_mphoto&&formobj.sys_mphoto.length>1){
                        local.find('[opt=personimg]').attr('src',uploadBase+formobj.sys_mphoto);
                    }
                },
                onCreateSuccess:option.onCreateSuccess||function(data){
                    option.parent.trigger('close');
                },
                bindIdBirthGender:true
            })
        })
    }




    return {
        render: render
    };
})

