/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/23/14
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */

define(function(){


    var addContent=function(local,option,cbfn){
        require(['text!views/pensionweb/SupportQuery.htm','views/pensionweb/SupportQuery'],function(htmfile,jsfile){
            local.append(htmfile);
            jsfile.render(local,option);
            cbfn();
        })

    }

    var render=function(option,record){
        require(['commonfuncs/CmWindow'],function(win){
            win.render({
                addContent:addContent,
                title:record.sys_mname+'('+record.sys_micard+')',
                queryParams:{
                    sys_micard:record.sys_micard
                },
                lparent:option.lparent
            })
        })
    }

    return {
        render:render
    }
})