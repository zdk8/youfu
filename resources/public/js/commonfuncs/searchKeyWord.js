/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/30/14
 * Time: 9:37 AM
 * To change this template use File | Settings | File Templates.
 */

define(function(){
    var searchKeyWord=function(local,localDataGrid,arr,additionalCond){
        var keyword=local.find('.easyui-searchbox').searchbox('getValue');
        keyword='%'+keyword+'%';
        var obj=[
            {name:arr[0],operate:'like',value:keyword,logic:'and'}
        ]
        for(var i in additionalCond){
            obj.push({name:additionalCond[i].name,operate:'=',value:additionalCond[i].value,logic:'and'})
        }
        localDataGrid.datagrid('load',{
            intelligentsp:JSON.stringify(obj)
        });

    }
    var bindEvent=function(local,localDataGrid,arr,additionalCond){
        var f=function(){
            searchKeyWord(local,localDataGrid,arr,additionalCond)
        }
        local.find('.searchbtn').bind('click',f);
        local.find('.searchbox-text').bind('keyup',function(e){
            if(e.keyCode==13){
                f();
            }
        })
    }

    return {
        bindEvent:bindEvent
    }
})