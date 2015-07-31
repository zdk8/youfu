define(function () {
/*['views/dmxt/fileupload/File-preview'],*/
    /*var preview=function(opt,r){
        Previewjs.render(opt, r);
    }*/

    return {
        render: function (local,option) {
            var pathdir =local.find('.filefolder li.filefolderli-hover span').attr('opt');
            var datagrid = local.find('.easyui-datagridnoauto');
            var refreshDatagrid = function () {
                datagrid.datagrid('reload');
            }

            datagrid.datagrid({
                url:"place/getdocmentsbyid",
                method:'post',
                queryParams:{
                    pc_id:option.queryParams.otherParams.record.pc_id,
                    filetype:pathdir
                },
                onLoadSuccess:function(data){
                    var viewbtns = local.find('[action=view]');
                    var downloadbtns = local.find('[action=download]');
                    var delbtns = local.find('[action=del]');
                    var btns_arr = [viewbtns,downloadbtns,delbtns];
                    var rows = data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function (index) {
                                var record = rows[index];
                                /*if($(btns_arr[j][i]).attr('action')=='view'){
                                    var FileExt=record.fie_path.replace(/.+\./,"").toLowerCase();   //正则表达式获取后缀
                                    var icon="dir";
                                    switch (FileExt){
                                        case "jpg":
                                            icon="jpg";break;
                                        case "png":
                                            icon="png";break;
                                        case "doc":
                                        case "docx":
                                            icon="doc";break;
                                        case "xls":
                                            icon="xls";break;
                                        case "txt":
                                            icon="txt";break;
                                        default :break;

                                    }
                                    $(btns_arr[j][i]).data('myrecord', record)
                                        .find('span.icon-nil')
                                        .removeClass('icon-nil').addClass('icon-file'+icon);

                                }*/
                                $(btns_arr[j][i]).click(function () {
                                    if($(this).attr('action') == 'view'){
                                        var FileExt=record.fie_path.replace(/.+\./,"").toLowerCase();
                                        //console.log(record)
                                        if(FileExt=='png' || FileExt=='jpg'){
                                            layer.photos({
                                                photos: {
                                                    "title": "图片预览",
                                                    //"id": 8,
                                                    //"msg": "",
                                                    "start": 0,
                                                    "status": 1,
                                                    //type: 2,
                                                    "data":[{
                                                        area: ['560px', '290px'],
                                                        "alt": record.file_name,
                                                        "pid": 109,
                                                        "src": 'get-touch?filename='+encodeURI(record.fie_path),
                                                        "thumb": ""
                                                    }]
                                                },
                                                tab: function(pic, layero){
                                                    layero.find('span.layui-layer-imguide').remove();
                                                    /*if(!this.firstloaded){
                                                        this.firstloaded = true;
                                                    }else{
                                                        layero.find('img')[0].src='get-touch?filename='+encodeURI(record.fie_path);
                                                    }*/
                                                }
                                            });
                                        }else{
                                            layer.alert('请先下载再预览', {icon: 6});
                                        }


                                        /*layer.photos({
                                            area: ['860px', '490px'],
                                            shade: [0.5, '#000'],
                                            photos: {
                                                "status": 1,
                                                "title": record.file_name,
                                                "id": 8,
                                                "start": 0,
                                                "data": [
                                                    {
                                                        "name": "越来越喜欢观察微小的事物",
                                                        "src": 'get-touch?filename='+encodeURI(record.fie_path)
                                                    }
                                                ]
                                            }
                                        });*/
                                        /*var FileExt=record.fie_path.replace(/.+\./,"").toLowerCase();   //正则表达式获取后缀
                                        var icon="dir";
                                        switch (FileExt){
                                            case "jpg":
                                                icon="jpg";break;
                                            case "png":
                                                icon="png";break;
                                            case "doc":
                                            case "docx":
                                                icon="doc";break;
                                            case "xls":
                                                icon="xls";break;
                                            case "txt":
                                                icon="txt";break;
                                            default :break;
                                        }*/
                                        //preview(option, record);
                                    }else if($(this).attr('action') == 'download'){
                                        console.log('下载')
                                        dd = $(this)
                                        var downloadurl = 'get-touch?filename='+encodeURI(record.fie_path)+"&convert=1";
                                        window.location.href=downloadurl;
                                        /*$.ajax({
                                            url:'get-touch?filename='+encodeURI(record.fie_path)+"&convert=1",
                                            type:'get',
                                           *//* data:{
                                                attach_id:record.attach_id,
                                                fie_path:record.fie_path

                                            },*//*
                                            success: function (data) {
                                                if(data == "success"){
                                                    layer.closeAll('loading');
                                                    refreshDatagrid();
                                                    layer.alert('删除完成!', {icon: 6});
                                                }else{
                                                    layer.closeAll('loading');
                                                    layer.alert('删除失败!', {icon: 5});
                                                }
                                            }
                                        })*/
                                    }else if($(this).attr('action') == 'del'){
                                        layer.confirm('确定要删除么？', {icon: 3}, function(index){
                                            layer.close(index);
                                            layer.load();
                                            $.ajax({
                                                url:'place/deletefilebyid',
                                                type:'post',
                                                data:{
                                                    attach_id:record.attach_id,
                                                    fie_path:record.fie_path

                                                },
                                                success: function (data) {
                                                    if(data == "success"){
                                                        layer.closeAll('loading');
                                                        refreshDatagrid();
                                                        layer.alert('删除完成!', {icon: 6});
                                                    }else{
                                                        layer.closeAll('loading');
                                                        layer.alert('删除失败!', {icon: 5});
                                                    }
                                                }
                                            })
                                        });
                                    }
                                })
                            })(i);
                        }
                    }
                },
                striped:true,
                toolbar:local.find('div[tb]')
            });


            /*local.find('[opt=query]').click(function () {
                var placeval = local.find('[opt=placetype]').combobox('getValue');
                var placecode = placeval.split(',')[0];
                datagrid.datagrid('load',{
                    district_id:local.find('[opt=division]').combobox('getValue'),
                    placecode:placecode,
                    bianzhunmingcheng:local.find('[opt=bianzhunmingcheng]').val()
                })
            });
            local.find('[opt=clear]').click(function () {
                local.find('[opt=division]').combobox('clear');
                local.find('[opt=placetype]').combobox('clear');
            });*/


            if(local.find('.filefolder li.filefolderli-hover')){
                var defpath ='/'+local.find('.filefolder li.filefolderli-hover').text();
                local.find('[opt=currentpath]').html(defpath);
            }

            local.find('.filefolder li').click(function () {
                $(this).addClass("filefolderli-hover").siblings().removeClass("filefolderli-hover");
                var folder = $(this).find('span').attr('opt');
                var foldertext ='/'+$(this).find('span').text();
                local.find('[opt=currentpath]').html(foldertext);
                datagrid.datagrid('load',{
                    pc_id:option.queryParams.otherParams.record.pc_id,
                    filetype:folder
                });
            })

            /*local.find('.filefolder li').bind("contextmenu", function() { return false; });//屏蔽默认右击事件
            local.find('.filefolder li').mousedown(function (e) {
                var htm = '<div style="border: 1px solid red"><a href="javaSript:;">删除</a><br><a href="javaSript:;">重命名</a></div>';
                var e = e || window.event;
                if(e.button == "2"){
                    console.log("执行右键代码");
                    layer.tips(htm, $(this),{
                        tips: [2, '#F0F8FF'],
                        success: function(layero, index){
                            //console.log(layero, index);
                        }
                    });
                }
            })*/

            /*上传文件*/
            local.find('[opt=uploadfile]').bind('click',function(){
                var filetype = local.find('.filefolder li.filefolderli-hover span').attr('opt');
                var title = '【'+local.find('.filefolder li.filefolderli-hover span').text()+'】文件上传';
                require(['commfuncs/popwin/win','text!views/dmxt/fileupload/FileForm.htm','views/dmxt/fileupload/FileForm'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:title,
                            width:588,
                            height:200,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {
                                    text:'确定',
                                    handler:function(html,parent){
                                    }
                                }
                            ],
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    submitbtn:submitbtn,
                                    parent:parent,
                                    poption:option.queryParams,
                                    filetype:filetype,
                                    refresh:refreshDatagrid,
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                    }
                                })
                            }
                        })
                    }
                )
            })

            //操作控件显示
            /*local.bind('mouseover',_.throttle(function(e){
                console.log(e)
                ee = e;
                //var $tr=$(e.target).parents('tr');
                var $tr=$(e.target).find('tr');
                if($tr.hasClass('datagrid-row')){
                    console.log($tr.hasClass('datagrid-row'))
                    var $td=$tr.find('td[field=oo]');
                    var record=$tr.find('a[action=view]').data('myrecord');
                    if(!$td.data('init')){
                        $tr.bind('myshow',function(){
                            $(this).find('td[field=oo]').children().show();
                        })
                        $tr.bind('myhide',function(){
                            $(this).find('td[field=oo]').children().hide();
                        })

                        //$td.data('init',true);
                        var $mydiv = $td.children().first();
                        var previewbtn =$('<a class="pFile-ico pFile-ico-preview" title="预览"></a>').bind('click',function(){
                            preview({},record);
                        })
                        var opcontain=$('<div class="opcontain"></div>');
                        opcontain.append(previewbtn);
                        $mydiv.append(opcontain)

                        *//*var downloadurl='mzfile/get-touch?filename='+record.filepath;

                        var downloadbtn =$('<a class="pFile-ico pFile-ico-download" title="下载"></a>').attr('href',downloadurl);
                        var morebtn =$('<a class="pFile-ico pFile-ico-more" title="更多"></a>').contextPopup({
                            items: [
                                {label:'重命名',     icon:'images/dy/change.png',
                                    action:function() {renamefile(local,{record:record,callback:function(){
                                        localDataGrid.datagrid('reload');
                                    }})} },
                                {label:'删除', icon:'images/pension01icon/del.gif',
                                    action:function() { deletefile(local,{
                                        record:record,
                                        callback:function(){
                                            localDataGrid.datagrid('reload');
                                        }
                                    }) } },
                                {label:'移动',     icon:'js/jqueryplugin/contextmenu/icons/book-open-list.png',
                                    action:function() { movefile({},record) } },
                                null, // divider
                                {label:'预览',       icon:'js/jqueryplugin/contextmenu/icons/application-table.png',
                                    action:function() { preview({},record) } }
                            ]
                        });
                        var opcontain=$('<div class="opcontain"></div>');
                        if(record.isdir!='1'){
                            opcontain.append(previewbtn);
                            opcontain.append(downloadbtn);
                        }

                        opcontain.append(morebtn);*//*
                        //$mydiv.append(opcontain)
                    }else{
                        $tr.parents('table').find('tr').trigger('myhide');
                        $tr.trigger('myshow');
                    }

                }

            },100))*/


            //初始化关键字查询控件
            /*require(['commfuncs/mysearch/renderKeyWordSearch'],function(js){
                $('#ulItems').css($('#keywordTxt').position());
                js.init();
            })*/
        }
    }
})