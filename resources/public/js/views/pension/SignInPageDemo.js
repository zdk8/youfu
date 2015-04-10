define(function(){
    function render(local){
        local.find('.highcharstoolbarbutton').click(function(){
            layer.tips('tips的样式并非是固定的，您可自定义外观。', this, {
                style: ['background-color:#78BA32; color:#fff', '#78BA32'],
                maxWidth:185,
                time: 3,
                closeBtn:[0, true]
            });
        })

        var sign = local.find('.Off');
        /*<input type="button" opt="signbtn" value="签到">*/
        /*sign.mouseover(function(){
            var htm = '<a href="#">签到</a>';
            var thiss = this;
            require(['text!views/pension/Test.htm','views/pension/Test'],function(html,jsfile){
                var tip = layer.tips(html, thiss, {
                    style: ['background-color:#78BA32; color:#fff','#78BA32'],
                    maxWidth:65,
                    guide: 2,
                    closeBtn:[0, false]
                })
                if(tip){
                    jsfile.render($(html),{
                        parent:parent
                    })
                }
            })
        })*/
        /*sign.mouseout(function(){
            layer.closeTips();
        });*/
        layer.load(4)
        $.ajax({
            url:'depart/getopdsigin',
            type:'post',
            data:{
                dep_id:'',
                rows:30,
                page:1
            },
            success:function(data){
                var rows = data.rows;
                var htmarr = new Array();
                var htmtrarr = new Array();
                var htmtdarr = new Array();
                for(var i=0;i<rows.length;i++){
                    var namev = rows[i].name;
                    var htmtd = '<td class=Off><label>'+namev+'</label>' +
                        '<br>' +
                        '<input type="button" opt="sign" value="签到">' +
                        '<input type="button" opt="cancelsign" value="取消">' +
                        '</td>'
                    htmtdarr.push(htmtd);
                    //htmarr.push(htmtr);
                    htmtrarr.push('<tr>'+htmtd+'</tr>');

                    for(var j=0;j<2;j++){
                        //htmtdarr[j][i] = htmtd
                    }
                }
                local.find('[opt=signtable]').append(htmtrarr);

                /*签到*/
                local.find('[opt=sign]').click(function () {
                    //aa = $(this).prev().prev();
                    dd = this;
                    //console.log($(dd).prev().prev().context)
                    console.log($($(dd).context).prev())
                });
                /*取消*/
                local.find('[opt=cancelsign]').click(function () {
                    console.log(1)
                });
            }
        })
        /*var htm = '<tr>' +
                    '<td class=Off><label>陆阿连1</label>' +
                    '<br>' +
                    '<input type="button" opt="sign" value="签到">' +
                    '<input type="button" opt="cancelsign" value="取消">' +
                    '</td>' +
            '<td class=Off><label>陆阿连2</label>' +
            '<br>' +
            '<input type="button" opt="sign" value="签到">' +
            '<input type="button" opt="cancelsign"value="取消">' +
            '</td>' +
                  '</tr>'

        var htmarr = new Array();
        for(var i=0;i<2;i++){
            htmarr.push(htm)
        }


        local.find('[opt=signtable]').append(htmarr);*/

    }

    return {
        render:render
    }
})