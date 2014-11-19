/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/23/14
 * Time: 11:02 AM
 * To change this template use File | Settings | File Templates.
 */

define(function(){
    var render=function(option){
        require(['text!commonfuncs/CmWindow.htm'],function(htm){
            var id='w'+new Date().getTime();
            var jid='#'+id;
            var w=$(htm).attr('id',id);
            $('body').append(w);

            var $closebtn= $(jid).find('a[action=close]');
            var btns=option.btns;
            for(var i in btns){
                var btn=$closebtn.clone().attr('action',btns[i]['action']);
                btn.find('span[opt=text]').text(btns[i]['text']).removeClass('icon-close-pl16').addClass(btns[i]['iconCls'])
                $(jid).find('div[opt=btns]').append(btn)
            }

            var close=function(){
                $(jid).window('close');
            }

            option.addContent($(jid).find('div[opt=content]'),option,function(){

                $(jid).window({
                    title:option.title,
                    width:option.width||800,
                    height:option.height||400,
                    onClose:function(){
                        $(this).window('destroy')
                    }
                }).bind('close',close).find('a[action=close]').bind('click',close)


                $.parser.parse($(jid).parent());
            })

        })
    }


    return {
        render:render
    }
})