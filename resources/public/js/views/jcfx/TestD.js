/**
 * Created by Administrator on 2014/11/4.
 */
define(function(){

    var a=function(local,option){
        var localDataGrid=
            local.find('.easyui-datagrid-noauto')
                .datagrid({
                url:'jsondata/testdata.json?version=1.1.1.1'+new Date().getTime(),
                method:'get',
                striped:true
            });
        console.log('test d .....')
    }


    return {
        render:a
    }
})