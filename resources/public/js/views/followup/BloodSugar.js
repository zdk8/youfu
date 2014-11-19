
define(function(){
    var filepath='followup/BloodSugar';
    function render(local,option)
    {


        var validType= ['identityid','minLength[12]'];
        local.find('input[opt=identityid]').validatebox({
            required:true,
            validType:validType
        })
        require(['commonfuncs/CuRecord'],function(cu){
            cu.cfg({
                local:local,
                filepath:filepath,
                data:option.queryParams,
                cparam:option.queryParams,
                uparam:option.queryParams,
                act:option.act

            })
        })

    }



    return {
        render: render
    };
})