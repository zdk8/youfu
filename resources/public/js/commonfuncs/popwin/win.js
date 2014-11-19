/**
 * Created by Administrator on 2014/9/25.
 * 弹出一个div层，默认有title,close按钮，还可以配置底部的按钮如果需要
 * div层可以进行dragg
 */
define(function(){
    var webox=function(option){
        var id=new Date().getTime();
        var result = $(option['htmltemplate']).attr('id', id);
        $('body').append(result);
        if(navigator.userAgent.indexOf('MSIE 7')>0||navigator.userAgent.indexOf('MSIE 8')>0){
            $('.webox').css({'filter':'progid:DXImageTransform.Microsoft.gradient(startColorstr=#55000000,endColorstr=#55000000)'});
        }if(option['bgvisibel']){
            $('.background').fadeTo('slow',0.5);
        };
        var removeWebox=function(){
            result.fadeOut("slow",function(){
                $(this).remove();
            });

        }
        var screenHeight = $(window).height();
        var screenWidth = $(window).width();
        var top=(screenHeight-option['height'])/2;
        top=top>0?top:0;
        var left=(screenWidth-option['width']+200)/2;
        $('.webox').css({display:'block',left:left+"px",top:top+"px",height:option['height']+'px',width:option['width']+'px'});
        result.find('.webox').layout().draggable({
            handle:result.find('.pop-win-north-title')
        });//布局并可拖拽
        result.find('.pop-win-north-close').bind('click',removeWebox);
        result.bind('close', removeWebox);

        result.find('.pop-win-north-title').html(option['title']);
        var $html=$(option['htmlcontent']);
        result.find('.htmlcontent').html($html);


        var submitbtn=null;
        if(option.buttons&&option.buttons.length){
            var $btnarea=result.find('div.weboxbuttons ul');
            for( var i in option.buttons){
                var $li=$('<li><a>'+option.buttons[i].text+'</a></li>');
                $btnarea.append($li);
                if(option.buttons[i].text=='保存'){
                    submitbtn=$li;
                }else{
                    $li.bind('click',(function(index){
                        return function(){
                            option.buttons[index].handler(result.find('.htmlcontent').html(), result);
                        }
                    })(i));
                }
            }
        }else{//如果页面的按钮不交给容器管理，则此处不需要按钮，下方的按钮区不显示
            result.find('.webox').layout('remove', 'south');
        }

        if(option.renderHtml){
            require(['commonfuncs/genFieldTemplate'],function(js){
                $.parser.parse($html.parent());
                js.render($html);
                option.renderHtml($html.parent(),submitbtn,result);
            })
        }

    }

    var render=function(option){
        require(['text!commonfuncs/popwin/win.htm'],function(win){
            webox({
                height:option.height||350,
                width:option.width||500,
                bgvisibel:true,
                title:option.title||'标题',
                htmltemplate:win,
                htmlcontent:option.html,
                buttons:option.buttons,
                renderHtml:option.renderHtml
            });
        })
    }


    return {
        render:render
    }
})
