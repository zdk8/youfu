define(function(){

    var mainTab=$('#tabs');
    var a={
        ShowContent:function(option){
            require([option.htmfile,option.jsfile],function(htm,js){
                var title=option.title;
                if(mainTab.tabs('exists',title)){
                    mainTab.tabs('select', title);
                    return;
                }
                var getLocaltab = function () {
                    return mainTab.tabs('add', {
                        title: title,
                        content: htm,
                        closable: true
                    }).tabs('getTab', title);
                }

                if(option.readonly==true){
                    if(js.readonly){
                        js.readonly(getLocaltab(),option)
                    }else{
                        $.messager.alert('Warning',option.jsfile+'未实现readonly接口');
                    }
                }else if(option.customaction){
                    if(js[option.customaction]){
                        js[option.customaction](getLocaltab(),option)
                    }else{
                        $.messager.alert('Warning',option.jsfile+'未实现'+option.customaction+'接口');
                    }
                }else{
                    var localtab=getLocaltab();
                    js.render(localtab,option)
                    localtab.find('a[action=searchlog]').bind('click',function(){
                        cj.searchLog(option.functionid)
                    })
                    localtab.bind('searchlog',function(){
                        cj.searchLog(option.functionid)
                    })
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
        }


    }

    return a;
});
