/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/23/14
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */

define(function(){

    var width=570;
    var height=320;
    var addContent=function(local,option,cbfn){
        require(['text!views/pensionweb/Support.htm','views/pensionweb/Support'],function(htmfile,jsfile){
            local.append(htmfile);
            local.bind('close',function(){
                local.parents('window').trigger('close');
            })
            jsfile.render(local,option);
            cbfn();
        })

    }

    var render=function(option,record){
        require(['commonfuncs/CmWindow'],function(win){
            if(option.act=='v'){
                win.render({
                    addContent:addContent,
                    title:'日常帮扶',
                    queryParams:record,
                    record:record,
                    width:width,
                    height:height,
                    lparent:option.lparent
                })
            }
            else if(record){
                win.render({
                    addContent:addContent,
                    title:'日常帮扶',
                    queryParams:record,
                    record:record,
                    width:width,
                    height:height,
                    btns:[
                        {text:'保存',action:'add',iconCls:'icon-add-pl16'}
                    ],
                    lparent:option.lparent
                })
            }else{

                win.render({
                    addContent:addContent,
                    title:'日常帮扶',
                    width:width,
                    height:height,
                    queryParams:option.data,
                    btns:[
                        {text:'保存',action:'add',iconCls:'icon-add-pl16'}
                    ],
                    lparent:option.lparent
                })
            }

        })
    }

    return {
        render:render
    }
})