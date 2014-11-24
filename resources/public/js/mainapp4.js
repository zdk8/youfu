
$.fn.datebox.defaults.parser = function(s){
    var t = Date.parse(s);
    if (!isNaN(t)){
        return new Date(t);
    } else {
        return new Date();
    }
}

requirejs.config({

    urlArgs: "dc_=" +  (new Date()).getTime()

});




require(['router','layoutinit'], function(Router,layoutinit){

    var getData=function(a,t){
        for(var i in a){
            if(t==a[i].title){
                return a[i]
            }
        }
    }

    var dosome=function(items){
        var a=[
            {"title":"老人服务","hiddentitle":"会员服务"},
            {"title":"服务管理","hiddentitle":"服务管理"},
            {"title":"日常帮扶","hiddentitle":"日常帮扶"},
            {"title":"老人管理","hiddentitle":"会员管理"}
        ]
        for(var i in items){
            console.log(items[i].title)
            var obj=getData(a,items[i].title);
            if(obj&&obj.hiddentitle){
                items[i].hiddentitle=obj.hiddentitle;
            }
        }
    }
    var getFun=function(type,f){
        $.ajax({
            url:'http://112.124.50.195:8000/hvitpublic/auth/getfuncsbyrole',
            data:{type:type},
            dataType:'jsonp',
            type:'post',
            async:false,
            success:function(data){
                var items = $.map(data, function(item){
                    return {
                        title:item.text,location:item.value,icon:item.imgcss
                    }
                });
                dosome(items)
                f(items);
            }
        })
    }
    var funArray=[];
    getFun('智慧养老服务平台',function(items){
        funArray=items;
       renderMenu1(items);
        var loopItems=function(items,n){
            if(n==items.length){
                 console.log(JSON.stringify(funArray));
                renderMenu2(funArray);
            }else{
                getFun(items[n].title,function(itemsChildren){
                    getData(funArray,items[n].title).children=itemsChildren;
                    loopItems(items,n+1)
                })
            }
        }
        loopItems(items,0);
    });
    function renderMenu1(data){
        var navdata= data;
        var navul=$('<ul></ul>')
        for(var i in navdata){
            navul.append('<li><a href="#"><span>'+navdata[i].title+'</span></a></li>');
        }
        $('#nav_menu ul').append(navul.html())
    }
    function renderMenu2(data){
        var navdata= data;
        /*var navul=$('<ul></ul>')
        for(var i in navdata){
            navul.append('<li><a href="#"><span>'+navdata[i].title+'</span></a></li>');
        }
        $('#nav_menu ul').append(navul.html())
        */
        $('#nav_menu li').each(function(){
            $(this).bind('click',function(e){
                $(this).parent().find('li.current').removeClass('current');
                $(this).addClass('current');
                var navul2=$('<ul></ul>');
                var navdata2=getData(navdata,$(this).find('span').text()).children;
                for(var i=navdata2.length-1;i>=0;i--){
                    var nav_li =$('<li><a hiddentitle="'+navdata2[i].hiddentitle+'" ' +
                        'icon="'+navdata2[i].icon+'">'+navdata2[i].title+'</a></li>');
                    navul2.append(nav_li);
                }
                $('#nav_menu_2 ul').replaceWith('<ul>'+navul2.html()+'</ul>');
                $('#nav_menu_2 li').each(function(){
                    var d= getData(navdata2,$(this).text());
                    if($(this).children('a').attr('target')=='_blank'){
                        return;
                    }
                    $(this).bind('click',function(){
                        var filelocation= d.location.replace('.','/');
                        var htmlfile='text!views/'+filelocation+'.htm';
                        var jsfle='views/'+ filelocation;
                        var me=$(this);
                        if(d.location.indexOf('http')>-1){
                            /*cj.showContent({
                                htmfile1:htmlfile,
                                htmfile:'text!views/pensionweb/LoveBaMa.htm',
                                jsfile:null,
                                title:me.children('a').text()
                            })*/
                            window.open("http://112.124.50.195:8000/hvitpublic/authcrossdomain/simpleproxy?loginurl=http://www.lovebama.com/&method=post&loginparams={%22txtUsername%22:%22hszh%22,%22txtPassword%22:%22123456%22,%22txtNumber%22:%22000%22,%22btnLogin%22:%22%20%22,%22__VIEWSTATE%22:%22%2FwEPDwUKLTUyMjQxMTEwOWRkd5A1iBBySEkwX8up8OML9i6GKAid9O8AXllurkvRPJQ%3D%22,%22__EVENTVALIDATION%22:%22%2FwEdAAWCsEQSwsb35SpqeupZ1K9IVK7BrRAtEiqu9nGFEI%2BjB3Y2%2BMc6SrnAqio3oCKbxYaAXw7gAm6bM%2FKwTlSTQaWsop4oRunf14dz2Zt2%2BQKDEMy712jkV4LqZs2imwoWR%2FVo3SlaYQYpzA4GYfok1lvA%22}");
                        }else{
                            cj.showContent({
                                htmfile:htmlfile,
                                jsfile:jsfle,
                                title:me.children('a').text(),
                                hiddentitle:me.children('a').attr("hiddentitle")
                            })
                        }


                        $(this).parent().find('li').removeClass('current');
                        $(this).addClass('current');
                    })
                })
                var ulwidth=$(this).offset().left+navdata2.length*135/2;
                var nav2marginright=$(window).width()>ulwidth? $(window).width()-ulwidth:0;
                $('#nav_menu_2 ul').css({marginRight:nav2marginright});
                $('#nav_menu_2 a[icon^=icon]').each(function(){
                    $(this).addClass($(this).attr('icon'))
                })
            })
        })
    }


    window.setTimeout(function(){
        cj.showContent({
            htmfile:'text!views/pensionweb/Main.htm',
            title:'Main'
        })

        require(['commonfuncs/validate/Init'],function(Init){
            new Init();
        })
    },500);


    $('#header [action=help]').bind('click',function(){
        require(['commonfuncs/NavMenu2ClickEvent'],function(js){
             //js.render()
        })

    })

});
