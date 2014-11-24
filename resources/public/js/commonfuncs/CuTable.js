/**
 *
 * Created by weipan on 6/23/14.
 */
define(function(){


    var cfg=function(config){
        var fromexp=config.from||'[opt=pensionform]';
        var submitbtnexp=config.submitbtn||'a[opt=pensionsubmit]';
        var local=config.local;
        var url='';
        if(config.filepath){
            url=cj.getUrl(config.filepath,config.act);
        }
        if(config.act=='c'){
            local.find(submitbtnexp).bind('click',function(){
                local.find(fromexp).form('submit',{
                    url:url,
                    onSubmit:function(param){
                        param=config.cparam;
                        var isValid = local.find(fromexp).form('validate');
                        return isValid;
                    },
                    success:function(data){
                        cj.csumbitQest(data,'',function(){
                            var tab=$('#tabs');
                            var pp = tab.tabs('getSelected');
                            var index = tab.tabs('getTabIndex',pp);
                            tab.tabs('close',index);
                        })
                    }
                })
            })
        }else if(config.act=='u'){
             cj.ajaxdata(
                 cj.getUrl(config.filepath,'r'),
                 config.data,
                 function(res){
                     $res= $.evalJSON(res);
                     var formobj=$res[0];
                     local.find(fromexp).form('load', formobj);
                     local.find(submitbtnexp).bind('click',function(){
                         local.find(fromexp).form('submit',{
                             url:url,
                             onSubmit:function(param){
                                 var param=config.uparam;
                                 var isValid = local.find(fromexp).form('validate');
                                 return isValid;
                             },
                             success:function(data){
                                 cj.csumbitQest(data,'',function(){
                                     var tab=$('#tabs');
                                     var pp = tab.tabs('getSelected');
                                     var index = tab.tabs('getTabIndex',pp);
                                     tab.tabs('close',index);
                                 })
                             }
                         })
                     })

                 }
             )
        }

    }


    return {cfg:cfg}
})
