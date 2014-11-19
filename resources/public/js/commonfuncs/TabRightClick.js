define(function(){
    var mainPage="主页";
    var loadValidated=false;
    (function(){

        //关闭当前
        $('#mm-tabclose').click(function(){
            var currtab_title = $('#mm').data("currtab");
            $('#tabs').tabs('close',currtab_title);
        })
        //全部关闭
        $('#mm-tabcloseall').click(function(){
            $('.tabs-inner span').each(function(i,n){
                var t = $(n).text();
                if(t!=mainPage){
                    $('#tabs').tabs('close',t);
                }
            });
        });
        //关闭除当前之外的TAB
        $('#mm-tabcloseother').click(function(){
            var currtab_title = $('#mm').data("currtab");
            $('.tabs-inner span').each(function(i,n){
                var t = $(n).text();
                if(t!=currtab_title&& t!=mainPage)
                    $('#tabs').tabs('close',t);
            });
        });
        //关闭当前右侧的TAB
        $('#mm-tabcloseright').click(function(){
            var nextall = $('.tabs-selected').nextAll();
            if(nextall.length==0){
                return false;
            }
            nextall.each(function(i,n){
                var t=$('a:eq(0) span',$(n)).text();
                $('#tabs').tabs('close',t);
            });
            return false;
        });
        //关闭当前左侧的TAB
        $('#mm-tabcloseleft').click(function(){
            var prevall = $('.tabs-selected').prevAll();
            if(prevall.length==0){
                return false;
            }
            prevall.each(function(i,n){
                var t=$('a:eq(0) span',$(n)).text();
                if(t!=mainPage){
                    $('#tabs').tabs('close',t);
                }
            });
            return false;
        });
    })();
    var init=function(){
        $('#tabs').tabs({
            onContextMenu:function(e, title,index){
                e.preventDefault();
                if(title==mainPage){
                    return;
                }
                //$(this).tabs('select',title);
                $('#mm').menu('show', { left: e.pageX, top: e.pageY });
                $('#mm').data("currtab",title);
            },
            onAdd:function(){
                /*if(!loadValidated){
                    require(['commonfuncs/validate/Init'],function(Init){
                        new Init();
                        loadValidated=true;
                    })
                }*/

            },
            onBeforeClose:function(title,index){
                var local=$('#tabs').tabs('getTab',title);
                $(local).trigger('closefn');
            }
        })
    }
    return {init:init}
})