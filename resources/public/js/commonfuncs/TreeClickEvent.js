define(function(){

    var mainTab=$('#tabs');
    var a={
        ShowContent:function(option){
            var myjsfile=option.jsfile;
            if(myjsfile.indexOf('placetype')>-1){
                myjsfile = 'views/Blank';
            }
            require([option.htmfile,myjsfile],function(htm,js){
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

                var localtab;
                if(option.act&&option.act.length>0){
                    localtab=getLocaltab();
                    if(js&&js.render){
                        js.render(localtab,option)
                    }
                }else{
                    localtab=getLocaltab();

                    if(option.title=='Main'){
                        $(localtab).hide();
                        $(localtab).fadeIn();
                    }

                    if(js&&js.render){
                        option.act='c';
                        js.render(localtab,option)
                    }
                }

            /*    localtab.find('div[opt=pensionbutton]').append(
                    '<a opt="close" class="easyui-linkbutton" data-options="iconCls:\'icon-remove\'">close</a>');

                $.parser.parse(localtab.find('div[opt=pensionbutton]').parent())*/
                var closeCurrent=function(){
                    mainTab.tabs('close',option.title)
                }
                localtab.find('div[opt=pensionbutton] a[opt=close]').bind('click',closeCurrent);
                localtab.bind('close',closeCurrent);

                require(['commonfuncs/genFieldTemplate'],function(js){
                    js.render(localtab);

                })


            })
        },
        ShowIframe:function(value,jsfile,title,functionid){
            var require_render=function(){
                if(mainTab.tabs('exists',title)){
                    mainTab.tabs('select', title);
                    return;
                }
                var myurl = value;
                if(value.indexOf(functionid)==-1){
                    myurl=value+"&="+functionid
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
