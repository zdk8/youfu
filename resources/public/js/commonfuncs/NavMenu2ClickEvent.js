define(function(){

    function arrexist(arr,title){
        for(var i in arr){
            if(arr[i]==title){
                return true;
            }
        }
        return false;
    }
    function arrremove(arr,title){
        var tmp=[];
        for(var i in arr){
            if(arr[i]!=title){
                tmp.push(arr[i])
            }
        }
        return tmp;
    }
    var testalert=function(title,msg){
        $.messager.show({
            title:title,
            msg:msg,
            timeout:5000,
            showType:'slide'
        });
    }

    var mainTab=$('#main');
    mainTab.divarray=[];

    var mainObj={
        exists:function(title){
            return arrexist(mainTab.divarray,title);
        },
        select:function(title){
            if(mainTab.divarray[0]!=title){
                mainTab.divarray=arrremove(mainTab.divarray,title);
                mainTab.divarray.push(title);
            }

            mainTab.find('div[mtitle]').each(function(){
                if($(this).attr('mtitle')==title){
                    $.parser.parse($(this).parent())
                    $(this).show();
                }else{
                    $(this).hide();
                }
            })
        },
        add:function(option){
            if(!option.title||option.title==''){
                alert('title not exists,please add a titile')
            }
            mainTab.find('div[mtitle]').each(function(){
                $(this).hide();
            })
            var $newhtm=$('<div class="easyui-panel" data-options="fit:true" ">'+option.htm+'</div>')
                .attr('mtitle',option.title)
                .show();
            mainTab.append($newhtm);
            mainTab.divarray.push(option.title);
            return $newhtm;
        },
        getTab:function(title){
            return $(this);
        },
        getSelected:function(s){
            return $(this)
        },
        getTabIndex:function(s){
            return $(this)
        },
        close:function(title){
            mainTab.find('div[mtitle='+title+']').remove();
            mainTab.divarray=arrremove(mainTab.divarray,title);
            mainTab.tabs('select',mainTab.divarray.length>0?mainTab.divarray[mainTab.divarray.length-1]:mainTab.divarray[0])
        }

    }

    mainTab.tabs=function(method,param1){
        return mainObj[method].call(mainTab,param1)
    }

    $(window).resize(function (){
        mainTab.find('div[mtitle]').each(function(){
            $.parser.parse($(this))
        })

    });

    var a={
        ShowContent:function(option){

            require([option.htmfile,option.jsfile],function(htm,js){

                if(mainTab.tabs('exists',option.title)==true){

                    testalert('exists',option.title)
                    mainTab.tabs('select',option.title);
                    return;
                }


                var localtab=mainTab.tabs('add',{
                    htm:htm,
                    title:option.title
                })
                /*$.parser.parse(localtab.parent());
                $.parser.parse(localtab);
                return;
*/

                localtab.find('a[action=searchlog]').bind('click',function(){
                    cj.searchLog(option.functionid)
                })
                localtab.bind('searchlog',function(){
                    cj.searchLog(option.functionid)
                })
                localtab.find('div[opt=pensionbutton]').append(
                    '<a opt="close" class="easyui-linkbutton" data-options="iconCls:\'icon-remove\'">close</a>');

                var closeCurrent=function(){
                    mainTab.tabs('close',option.title)
                    /*require(['text!views/pensionweb/Main.htm'],function(mainhtml){
                     localtab.children().remove();
                     var len=mainTab.divarray.length;
                     var index=len>0?len-1:0;
                     mainTab.tabs('select',mainTab.divarray[0])
                     })*/
                }
                localtab.find('div[opt=pensionbutton] a[opt=close]').bind('click',closeCurrent);
                localtab.bind('close',closeCurrent);

                require(['commonfuncs/genFieldTemplate'],function(js){
                    js.render(localtab)
                })
                $.parser.parse(localtab.parent())
                if(option.customaction){
                    if(js[option.customaction]){
                        js[option.customaction](localtab,option)
                    }else{
                        $.messager.alert('Warning',option.jsfile+'未实现'+option.customaction+'接口');
                    }
                }else{
                    if(js&&js.render){
                        js.render(localtab,option);
                    }

                }

            })

        },
        ShowIframe:function(value,jsfile,title,customparam){
            var require_render=function(){
                if(mainTab.tabs('exists',title)){
                    mainTab.tabs('select', title);
                    return;
                }
                mainTab.tabs('add', {
                    title: title,
                    content: '<iframe src="' + value + '" width="100%" height="100%" frameborder="0"></iframe>',
                    closable: true
                });
            };
            require_render();
        },
        closeCurrentTab:function(){
            var pp = mainTab.tabs('getSelected');
            var index = mainTab.tabs('getTabIndex',pp);
            mainTab.tabs('close',index);
        },
        getSelected:function(){
            return mainTab.tabs('getSelected');
        },
        closeTabByTitle:function(t){
            mainTab.tabs('close',t);
        },
        test:function(t){
            alert(t)
        },
        showHtml:function(title,texthtml){
            var logpage=mainTab.tabs('add',{
                title:title,
                content:"<div></div>",
                closable:true
            })
            logpage.tabs('getTab', title).find('div').append(texthtml)
        },getTitleList:function(){
            return mainTab.divarray
        },
        render:function(){
            if(!$('#dg').length){
                $('body').append('<div id="wt"><div></div></div>')
            }
            $('#wt').window({
                width:600,
                height:400,
                modal:true
            });
            $('#dg>div').datagrid({
                url:'datagrid_data1.json',
                columns:[[
                    {field:'code',title:'Code',width:100},
                    {field:'name',title:'Name',width:100},
                    {field:'price',title:'Price',width:100,align:'right'}
                ]]
            });
            $.parser.parse($('#wt'))
            $('#tabs .tabs .tabs-title').each(function(){
                //alert($(this).text())
            })
        }



    }

    return a;
});
