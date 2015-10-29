//date extended
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "日",
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
        "5" : "五",
        "6" : "六"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
}
//****************************************************************************************
if(!window.console){
    window.console={
        log:function(){

        }
    }
}
//****************************************************************************************
var cj=(function(){
    var pz=15;
    var dataGridAttr={ pageSize:pz, pageList: [pz, 30,50]}
    var getLoader = function(type,param,success,error){
        return function(param,success,error){
            param.q="10000";
            $.ajax({
                url: 'getenumbytype',
                dataType: 'jsonp',
                data: {
                    type:type
                },
                success: function(data){
                    var items = $.map(data, function(item){
                        return {
                            id: item.enumeratevalue,
                            text: item.enumeratelabel
                        };
                    });
                    success(items);
                },
                error: function(){
                    error.apply(this, arguments);
                }
            });
        }
    }
//***************************
    var commonj = {
        version: '1.0',
        defaultTitle: '提示',
        ajaxaSynchronous: false,
        getDataGridAttr:function(name){
            return dataGridAttr[name]
        },
        rowStyler:function(index,row){
            if(index%2==1){
                return 'background:#e7ffe7';
            }
        },dateFormatter:function(fmt){
            return function(v,r,i){
                var d=v;
                if(!d){return}
                d= new Date(d.replace(/-/g,'-'));
                //return d.pattern(fmt||'yyyy-MM-dd hh:mm')
                return d.pattern(fmt||'yyyy-MM-dd')
            }

        },getLoader:getLoader,
        /**
         * 生成工具条
         * @param btns
         */
        getFormToolBar:function(btns){
            var $btnarea=$('<div class="form-foot-btns"><ul></ul></div>');
            var $ul = $btnarea.find('ul');
            for( var i in btns){
                var btn = btns[i];
                var $li=$('<li><a>'+btn.text+'</a></li>');
                var $a = $li.find('a');
                for(var p in btn) {
                    $a.attr(p,btn[p]);
                }
                $ul.append($li);
            }
            return $btnarea;
        },getUserMsg:function(){
            return usermsg;
        },showSuccess: function (msg) {
            var index = layer.open({
                type: 1, //page层
                area: ['200px', '100px'],
                title: '温馨提示',
                offset: 'rb', //右下角弹出
                shade: false, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: 4, //0-6的动画形式，-1不开启
                content: '<div style="padding:5px;text-align: center;">'+msg+'</div>'
            });
            window.setTimeout(function () {
                layer.close(index);
            },3000);
        },showFail: function (msg) {
            var index = layer.open({
                type: 1, //page层
                area: ['200px', '100px'],
                title: '温馨提示',
                offset: 'rb', //右下角弹出
                shade: false, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: 4, //0-6的动画形式，-1不开启
                content: '<div style="padding:5px;text-align: center;color: red;">'+msg+'</div>'
            });
            window.setTimeout(function () {
                layer.close(index);
            },3000);
        },imgView: function (file,local) {      //照片预览
            var prevDiv = local.find('[opt=personimg]');
            if (file.files){
                if(file.files[0]){
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        var imghtm = '<img style="width:150px;height:120px;" src="' + evt.target.result + '" />';
                        prevDiv.html(imghtm);
                    }
                    reader.readAsDataURL(file.files[0]);
                }else{
                    var noperson = '<img name="photo" src="images/noperson.gif" value="" alt="用户照片" width="150px" height="120px">';
                    prevDiv.html(noperson);
                }
            }else{//ie下实现
                var imghtmie = '<div class="img" style="width:150px;height:120px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
                prevDiv.html(imghtmie);
            }

        },common_listFunc:function(local){  //表单动态增减行
            local.find('[opt=addlist]').click(function () {
                var $this =$(this);
                var $tr = $this.parents('.list_min').find('tbody');
                var td1 = $this.parents('tr').next().find('td').has('input');
                var td = '<td><a opt="dellist" style="cursor: pointer;"><img src="images/reduce.png"></a></td>';
                var tds = "";
                for(var i=0;i<td1.length;i++){
                    var hasdatebox = $(td1[i].outerHTML).find('span').hasClass('datebox');
                    var hascombobox = $(td1[i].outerHTML).find('input').hasClass('easyui-combobox');
                    if(hasdatebox){
                        var opt_td = $($(td1[i].outerHTML).find('input')[0]).attr('opt');
                        var width_td = $($(td1[i].outerHTML).find('input')[0]).width();
                        var datebox_td = '<td align="center"><input class="easyui-datebox" opt="'+opt_td+'" style="width: '+width_td+'px"'+'></td>';
                        tds += datebox_td;

                    }else if(hascombobox){
                        var opt_td2 = $($(td1[i].outerHTML).find('input')[0]).attr('opt');
                        var width_td2 = $($(td1[i].outerHTML).find('input')[0]).width();
                        var combobox_td = '<td align="center"><input class="easyui-combobox" opt="'+opt_td2+'" style="width: '+width_td2+'px"'+'></td>';
                        tds += combobox_td;
                    }else{
                        tds += td1[i].outerHTML.toString();
                    }
                }
                tds += td;
                $tr.append('<tr>'+tds+'</tr>');
                /*控件初始化*/
                $(tds).find('input').each(function () {
                    var $this1 = $(this);
                    if($this1.hasClass('easyui-datebox')){
                        local.find('[opt='+$this1.attr('opt')+']').last().datebox();
                    }else if($this1.hasClass('easyui-combobox')){
                        var combobox = local.find('[opt='+$this1.attr('opt')+']').last().combobox();
                        combobox.combobox({
                            loader:cj.getLoader($this1.attr('opt')),
                            editable:false,
                            valueField:'id',
                            textField:'text'
                        });
                    }
                })
                //local.find('[opt=jc_date]').datebox();
                var lasttr = $tr.find('tr')[$tr.find('tr').length-1];
                $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
                local.find('[opt=dellist]').each(function () {
                }).click(function () {
                    var _tr = $(this).parents('tr');
                    if (_tr.attr('class') != "demo") {
                        var pp_id = _tr.find('[opt=pp_id]').val()
                        if(!pp_id){
                            _tr.remove();
                        }
                    }
                })
            });
        },commonGetValue:function(local,option){  //动态表单提交时值获取
            var field = option.field;
            var arr = new Array();
            for(var i=0;i<field.length;i++){
                var arr_1 = new Array();
                var code = local.find('[opt='+field[i]+']');
                code.each(function () {
                    var $this = $(this);
                    if($this.hasClass('easyui-combobox')){
                        if($this.combobox('getValue').length>0){
                            arr_1.push($this.combobox('getValue'));
                        }
                    }else if($this.hasClass('easyui-datebox')){
                        if($this.datebox('getValue').length>0){
                            arr_1.push($this.datebox('getValue'));
                        }
                    }else{
                        if($this.val().length>0){
                            arr_1.push($this.val())
                        }
                    }
                });
                arr.push(arr_1);
            }

            var arrall = new Array();
            var arr2 = "";
            for(var a=0;a<arr.length;a++){
                if(arr[a].length>0){
                    arr2 = arr[a];
                }
            }
            for(var i=0;i<arr2.length;i++){
                var maparr = {};
                for(var j=0;j<field.length;j++){
                    if(field[j] == "politicsstatus"){
                        maparr['fm_politicalstatus']=arr[j][i];
                    }else if(field[j] == "edutype"){
                        maparr['educationtype']=arr[j][i];
                    }else{
                        maparr[field[j]]=arr[j][i];
                    }
                }
                arrall.push(maparr);
            }
            return arrall;
        },initTrData: function (local,tabopt,childdata,fields) {    //多行表单的值填充，动态加载
            var $tbody = local.find('[opt='+tabopt+'] tbody');
            var $tds = $tbody.find('tr').last().find('td').has('input');
            var td_reduce = '<td><a opt="dellist" style="cursor: pointer;"><img src="images/reduce.png"></a></td>';
            var $tr = "";
            for(var i=0;i<$tds.length;i++){
                var hasdatebox = $($tds[i].outerHTML).find('span').hasClass('datebox');
                var hascombobox = $($tds[i].outerHTML).find('input').hasClass('easyui-combobox');
                if(hasdatebox){
                    var opt_td = $($($tds[i].outerHTML).find('input')[0]).attr('opt');
                    var width_td = $($($tds[i].outerHTML).find('input')[0]).width();
                    var datebox_td = '<td align="center"><input class="easyui-datebox" opt="'+opt_td+'" style="width: '+width_td+'px"'+'></td>';
                    $tr += datebox_td;

                }else if(hascombobox){
                    var opt_td2 = $($($tds[i].outerHTML).find('input')[0]).attr('opt');
                    var width_td2 = $($($tds[i].outerHTML).find('input')[0]).width();
                    var combobox_td = '<td align="center"><input class="easyui-combobox" opt="'+opt_td2+'" style="width: '+width_td2+'px"'+'></td>';
                    $tr += combobox_td;
                }else{
                    $tr += $tds[i].outerHTML.toString();
                }
            }
            $tr += td_reduce;
            for(var i=1;i<childdata.length;i++){
                $tbody.append('<tr>'+$tr+'</tr>');
                for(var j=0;j<fields.length;j++){
                    if(local.find('[opt='+fields[j]+']').last().hasClass('easyui-datebox')){
                        local.find('[opt='+fields[j]+']').last().datebox();
                        local.find('[opt='+fields[j]+']').last().datebox('setValue',childdata[i][fields[j]]);
                    }else if(local.find('[opt='+fields[j]+']').last().hasClass('easyui-combobox')){
                        local.find('[opt='+fields[j]+']').last().combobox({
                            loader:cj.getLoader(fields[j]),
                            editable:false,
                            valueField:'id',
                            textField:'text'
                        });
                        if(fields[j] == "edutype"){
                            local.find('[opt='+fields[j]+']').last().combobox('setValue',childdata[i]["educationtype"]);
                        }else if(fields[j] == "politicsstatus"){
                            local.find('[opt='+fields[j]+']').last().combobox('setValue',childdata[i]["fm_politicalstatus"]);
                        }else{
                            local.find('[opt='+fields[j]+']').last().combobox('setValue',childdata[i][fields[j]]);
                        }
                    }else{
                        local.find('[opt='+fields[j]+']').last().val(childdata[i][fields[j]]);
                    }
                }
            }

            var lasttr = $tbody.find('tr')[$tbody.find('tr').length-1];
            $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
            local.find('[opt=dellist]').each(function () {
            }).click(function () {
                var _tr = $(this).parents('tr');
                if (_tr.attr('class') != "demo") {
                    var pp_id = _tr.find('[opt=pp_id]').val()
                    if(!pp_id){
                        _tr.remove();
                    }
                }
            })
        },getdivision: function(divisiontree){
            divisiontree.combotree({
                panelHeight:300,
                url:'getdivisiontree',
                method: 'get',
                onLoadSuccess:function(load,data){
                    /*if(!this.firstloaded){
                     divisiontree.combotree('setValue', data[0].id)
                     .combotree('setText', data[0].text);
                     this.firstloaded=true;
                     }*/
                },
                onBeforeExpand: function (node) {
                    divisiontree.combotree("tree").tree("options").url
                        = 'getdivisiontree?dvhigh=' + node.id;
                },
                onHidePanel: function () {
                    divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').id)
                        .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').totalname);
                }
            });
        },getDivisionTotalname: function(districtid){/*获取行政区划全名*/
            var name;
            $.ajax({
                url:"getdistrictname",
                type:"post",
                dataType:"json",
                async:false,
                data:{
                    districtid:districtid
                },
                success:function(data){
                    if(data.length){
                        name = data[0].totalname
                    }
                }
            })
            return name
        },addToolBar: function(local,option,li) {
            var li_func = ' <li>' +
                '<input type="button" value="取消" class="btns" opt="cancel">' +
                '</li>' +'&nbsp;'+li;

            var functool = local.find('.layui-layer-setwin');
            functool.after('<div class="funcmenu"><ul></ul></div>');
            var _toolbar = local.find('.funcmenu');
            _toolbar.css('display','block');
            _toolbar.find('ul').html(li_func);
            /*取消*/
            local.find('[opt=cancel]').click(function () {
                layer.close(option.index);
            });
        },getChildTab: function(ltab,child,option,actiontype){
            require(['text!views/shuangyong/youfuduixiang/childtables/'+child+'.htm','views/shuangyong/youfuduixiang/childtables/'+child],
                function(htmfile,jsfile){
                    var tab = ltab.tabs('getSelected');
                    ltab.tabs('update', {
                        tab: tab,
                        options: {
                            content: htmfile
                        }
                    });
                    jsfile.render(tab,{poption:option,queryParams:{actiontype:actiontype}});
                }
            )
        }
    }


    return commonj;
})()
