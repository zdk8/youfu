/**
 * Created by jack on 13-12-31.
 */
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
    require(['text!../jsondata/functiontree3.json'],function(json){

        var navdata= $.evalJSON(json);
        var navul=$('<ul></ul>')
        for(var i in navdata){
            navul.append('<li><a href="#"><span>'+navdata[i].title+'</span></a></li>');
        }
        $('#nav_menu ul').append(navul.html())

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
                    $(this).bind('click',function(){
                        var filelocation= d.location.replace('.','/');
                        var htmlfile='text!views/'+filelocation+'.htm';
                        var jsfle='views/'+ filelocation;
                        var me=$(this);
                        if(d.location.indexOf('http')>-1){
                            cj.showIframe('http://112.124.50.195:8000/hvitpublic/authcrossdomain/simpleproxy?loginurl=http://www.lovebama.com/&method=post&loginparams={%22txtUsername%22:%22hszh%22,%22txtPassword%22:%22123456%22,%22txtNumber%22:%22000%22,%22btnLogin%22:%22%20%22,%22__VIEWSTATE%22:%22%2FwEPDwUKLTUyMjQxMTEwOWRkd5A1iBBySEkwX8up8OML9i6GKAid9O8AXllurkvRPJQ%3D%22,%22__EVENTVALIDATION%22:%22%2FwEdAAWCsEQSwsb35SpqeupZ1K9IVK7BrRAtEiqu9nGFEI%2BjB3Y2%2BMc6SrnAqio3oCKbxYaAXw7gAm6bM%2FKwTlSTQaWsop4oRunf14dz2Zt2%2BQKDEMy712jkV4LqZs2imwoWR%2FVo3SlaYQYpzA4GYfok1lvA%22}',
                                '',me.children('a').text())

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
        //$('#nav_menu li:first').trigger('click');


        window.setTimeout(function(){
            cj.showContent({
                htmfile:'text!views/pensionweb/Main.htm',
                title:'Main'
            })

            require(['commonfuncs/validate/Init'],function(Init){
                new Init();
            })
        },500);
    })

    $('#header [action=help]').bind('click',function(){
        require(['commonfuncs/NavMenu2ClickEvent'],function(js){
             //js.render()
        })

    })

});
