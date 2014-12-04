/**
 * Created by Administrator on 2014/10/16.
 */
define(function(){
    var filepath='manager/CodeMaintenance/combo';

    return {
        render:function(local,option){
            require(['commonfuncs/CuRecord'],function(cu){
                cu.cfg({
                    local:local,
                    filepath:filepath,
                    costomPreFixUrl:'/',
                    url:'/savecombo',
                    data:option.queryParams,
                    cparam:{flag:-1},
                    uparam:option.queryParams,
                    onCreateSuccess:option.onCreateSuccess||function(data){
                        option.parent.trigger('close');
                    },
                    onUpdateSuccess:option.onUpdateSuccess,
                    act:option.act
                })
            })
        }
    }
})