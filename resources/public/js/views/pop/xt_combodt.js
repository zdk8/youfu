/**
 * Created by Administrator on 2014/10/16.
 */
define(function(){
    var filepath='manager/CodeMaintenance/combodt';

    return {
        render:function(local,option){
            require(['commonfuncs/CuRecord'],function(cu){
                cu.cfg({
                    local:local,
                    filepath:filepath,
                    costomPreFixUrl:'/',
                    url:'/savecombodt',
                    data:option.queryParams,
                    cparam: $.extend({flag:-1},option.queryParams),
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