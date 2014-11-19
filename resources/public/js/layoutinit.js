/**
 * Created by jack on 14-1-6.
 */
define(function(){

    function setCookie(name,value) {//两个参数，一个是cookie的名子，一个是值
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    function getCookie(name) {//取cookies函数
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return null;
    }

    function needtodoclick(){
        require(['commonfuncs/TreeClickEvent'],function(TreeClickEvent){
            TreeClickEvent.ShowContent('text!views/dbgl/needtodopanel.htm','views/dbgl/needtodopanel','待办事务');
        });
    }
    function inithead() {
        var themes = {
            'default' : extEasyui+'themes/default/easyui.css',
            'gray' : extEasyui+'themes/gray/easyui.css',
            'black' :extEasyui+ 'themes/black/easyui.css',
            'bootstrap' :extEasyui+ 'themes/bootstrap/easyui.css',
            'metro' : extEasyui+'themes/metro/easyui.css',
            'pepper-grinder' : extEasyui+'themes/pepper-grinder/easyui.css',
            'blue' : extEasyui+'themes/default/easyui.css',
            'cupertino' : extEasyui+'themes/cupertino/easyui.css',
            'dark-hive' : extEasyui+'themes/dark-hive/easyui.css',
            'sunny' : extEasyui+'themes/sunny/easyui.css'
        };

        var skins = $('.li-skinitem span').click(function() {

            var $this = $(this);
            if($this.hasClass('cs-skin-on')) return;
            skins.removeClass('cs-skin-on');
            $this.addClass('cs-skin-on');
            var skin = $this.attr('rel');
            $('#swicth-style').attr('href', themes[skin]);
            setCookie('cs-skin', skin);
            skin == 'dark-hive' ? $('.cs-north-logo').css('color', '#FFFFFF') : $('.cs-north-logo').css('color', '#000000');
        });

        if(getCookie('cs-skin')) {
            var skin = getCookie('cs-skin');
            $('#swicth-style').attr('href', themes[skin]);
            $this = $('.li-skinitem span[rel='+skin+']');
            $this.addClass('cs-skin-on');
            skin == 'dark-hive' ? $('.cs-north-logo').css('color', '#FFFFFF') : $('.cs-north-logo').css('color', '#000000');
        }


        require(['commonfuncs/UpdateItemNum','commonfuncs/AjaxForm'],function(updateitem,ajaxform){
            $('#welcomename').text("欢迎您:"+displayname+'('+dvname+')');
            updateitem.updateitemnum($('#onlinenums'),onlinenums,"(",")");
            var params = {
                //roleid:roleid,
                userid:userid,
                //divisionpath:divisionpath,
                type:'count'
            };
            var successFunc = function(res){
                var count=res.count;
                updateitem.updateitemnum($('#domneedtodocount'),count,"(",")");
            };
           //ajaxform.ajaxsend("post","json","ajax/getneedtodos.jsp",params,successFunc,null);

        });

        $('#domneedtodocount').click(needtodoclick);

        $('#domshowalterpwd').click(function(){
            if($('#edituserpasswin').length>0){
                $('#edituserpasswin').dialog('open');
            }else{
                require(['text!views/manager/edituserpasswin.htm','views/manager/edituserpasswin'],
                    function(div,edituserjs){
                        $('body').append(div);
                        edituserjs.render();
                    });
            }

        });
        $('#domlogout').click(function(){
            $.messager.confirm('您确定要退出吗?', '你正在试图退出.你想继续么?', function(r){
                if(r){
                    location.href="logout";

                }
            });

        })

    }

    function initindextime(){
        function t(){
            var time=$("#indextime");
            var d=new Date();
            var year=d.getFullYear();// 获取4位的年份
            var day=d.getDate();
            var month=d.getMonth();// 从0-11
            var week=d.getDay();// 从0-7
            var hours=d.getHours();
            var minutes=d.getMinutes();
            var seconds=d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds();
            switch(parseInt(week)){// 零代表礼拜天
                case 0:week="星期日";break;// break省略后，代码会一直向下执行。直到结束或遇到break。
                case 1:week="星期一";break;
                case 2:week="星期二";break;
                case 3:week="星期三";break;
                case 4:week="星期四";break;
                case 5:week="星期五";break;
                case 6:week="星期六";break;
            }
            time.html(hours+":"+minutes+":"+seconds+" "
                +year+"年"+(month+1)+"月"+day+"日"+" "+week);
        }
        //setInterval(t,1000);
    }

    function initroutnavigation(){
        $('#routermenu').combobox({
            onSelect: function(rec){


                $('#westpanel').panel({
                    onLoad:function(){
                        var router='#'+rec.value;
                        window.location.hash=router;
                    }

                });
                $('#westpanel').panel('refresh','js/views/navigation/'+rec.value+'.html');


            },
            onLoadSuccess:function(){
                var data=$('#routermenu').combobox('getData');
                $('#routermenu').combobox('select',data[0].value);
                if(data.length==1)$('#routermenu + .combo').hide();
                else{
                    $('#routermenu + .combo').css('float','left');
                    $('#routermenu + .combo').css('position','absolute');
                }
            }
        });
    }

     return {
         inithead :function(){

             inithead();
         },
         initroutnavigation:function(){

             //initroutnavigation();
         },
         initindextime:function(){

             //initindextime();
         }
     }

})