/**
 * 通用的查看view，创建create或者更新update一个表单(v,c,u)
 * Created by weipan on 6/23/14.
 * config各属性说明
 * config.local 当前tab页签 也可能是外部容器
 * config.parent为外部容器，用做回调时关闭外部容器
 * config.submitbtn外部按钮
 * config.uparam 更新数据时额外的参数
 * config.cparam 新建数据时额外的参数
 * config.onCreateSubmit(local,param) 新建数据提交之前可以进行的额外操作
 * config.onUpdateSubmit(local,param) 更新数据提交之前可以进行的额外操作
 * config.onCreateSuccess(data)      新建数据成功的事件
 * config.onCreateSuccess(data)      更新数据成功的事件
 */
define(function(){


    var cfg=function(config){
        var local=config.local;

        //初始化checkbox和下方的工具条
        local.cssCheckBox();
        if(local.find('div[opt=form_btns]').length){
            local.find('div[opt=pensionformpanel]').panel({
                onResize:function(width, height){
                    $(this).height($(this).height()-30);
                    local.find('div[opt=form_btns]').height(30);
                }
            });
        }

        //如果有数据则显示数据，form中加载好的数据可以在后面的步骤中进行必要的覆盖
        if(config.data){
            local.find('form').form('load', config.data);
        }


        //表单和提交按钮
        var fromexp=config.from||local.find('[opt=pensionform]');
        var submitbtnexp=config.submitbtn||local.find('a[opt=pensionsubmit]');
        var url='';

        //根据文件路径和要进行的操作来获得后台对应的接口url
        if(config.filepath){
            url=config.url||cj.getUrl(config.filepath,config.act);
        }

        //根据动作来作一些细节上的调整
        if(config.act=='c'){
            $(submitbtnexp).bind('click',function(){
                $(fromexp).form('submit',{
                    url:url,
                    onSubmit:function(param){
                        var lparam=config.cparam;
                        for(var p in lparam){
                            var $p=local.find('input[name='+p+']');
                            var pval=$p?$p.val():null;
                            if(pval){
                                continue;
                            }
                            param[p]=lparam[p]
                        }
                        if(config.onCreateSubmit){
                            config.onCreateSubmit(local,param)
                        }
                        var isValid = $(fromexp).form('validate');
                        return isValid;
                    },
                    success:function(data){
                        if(config.onCreateSuccess){
                            config.onCreateSuccess(data);
                        }else{
                            cj.csumbitQest(data,'',function(){
                                if(config.parent){
                                    config.parent.trigger('close');
                                }else{
                                    var tab=$('#tabs');
                                    var pp = tab.tabs('getSelected');
                                    var index = tab.tabs('getTabIndex',pp);
                                    tab.tabs('close',index);
                                }
                            })
                        }

                    }
                })
            })
        }else if(config.act=='u'){
             cj.ajaxdata(
                 cj.getUrl(config.filepath,'r'),
                 config.data,
                 function(res){
                     $res= $.evalJSON(res);
                     if(config.onAjaxDataFn){
                         config.onAjaxDataFn(res)
                     }
                     var formobj=$res[0];
                     $(fromexp).form('load', formobj);
                     $(submitbtnexp).bind('click',function(){
                         $(fromexp).form('submit',{
                             url:url,
                             onSubmit:function(param){
                                 var lparam=config.uparam;
                                 for(var p in lparam){
                                     var $p=local.find('input[name='+p+']');
                                     var pval=$p?$p.val():null;
                                     if(pval){
                                         continue;
                                     }
                                     param[p]=lparam[p]
                                 }
                                 if(config.onUpdateSubmit){
                                     config.onUpdateSubmit(local,param)
                                 }
                                 var isValid = $(fromexp).form('validate');
                                 return isValid;
                             },
                             success:function(data){
                                 if(config.onUpdateSuccess){
                                     config.onUpdateSuccess(data);
                                 }else{
                                     cj.csumbitQest(data,'',function(){
                                         if(config.parent){
                                             config.parent.trigger('close');
                                         }else{
                                             var tab=$('#tabs');
                                             var pp = tab.tabs('getSelected');
                                             var index = tab.tabs('getTabIndex',pp);
                                             tab.tabs('close',index);
                                         }
                                     })
                                 }

                             }
                         })
                     })

                 }
             )
        }else if(config.act=='v'){
            $(submitbtnexp).hide();
            cj.ajaxdata(
                cj.getUrl(config.filepath,'r'),
                config.data,
                function(res){
                    $res= $.evalJSON(res);
                    if(config.onAjaxDataFn){
                        config.onAjaxDataFn(res)
                    }
                    var formobj=$res[0];
                    $(fromexp).form('load', formobj);
                    local.find('input').attr('disabled',true);
                }
            )
        }


        if(config.bindIdBirthGender==true){
            require(['commonfuncs/BirthGender'],function(js){
                js.render(local,config.bindIdBirthGenderOption||{})
            })
        }



        return function(){}

    }


    return {cfg:cfg}
})
