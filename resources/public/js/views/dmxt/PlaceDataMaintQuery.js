define(function(){

    var filepath='dmxt/PlaceDataMaintQuery';

    var a = {
        render:function(local,option){
            var divisiontree = local.find(':input[opt=divisiontree]') ;                    //行政区划的树结构
            divisiontree.combotree({
                panelHeight:300,
                url:preFixUrl+'civil/getdivision',
                method: 'get',
                onLoadSuccess:function(load,data){
                    if(!this.firstloaded){
                        divisiontree.combotree('setValue', data[0].id)
                            .combotree('setText', data[0].text);
                        this.firstloaded=true;
                    }
                },
                onBeforeExpand: function (node) {
                    divisiontree.combotree("tree").tree("options").url
                        = preFixUrl+'civil/getdivision?dvhigh=' + node.id;
                },
                onHidePanel: function () {
                    divisiontree.combotree('setValue',
                            divisiontree.combotree('tree').tree('getSelected').id)
                        .combobox('setText',
                            divisiontree.combotree('tree').tree('getSelected').text);
                }
            });
            var placetype = local.find(':input[opt=placetype]') ;                               //地名代码的树结构
            placetype.combotree({
                panelHeight:300,
                url:preFixUrl+'civil/getenums',
                method: 'get',
                onLoadSuccess:function(load,data){
                    /*if(!this.firstloaded){
                        placetype.combotree('setValue', data[0].id)
                            .combotree('setText', data[0].text);
                        this.firstloaded=true;
                    }*/
                },
                onBeforeExpand: function (node) {
                    placetype.combotree("tree").tree("options").url
                        = preFixUrl+'civil/getenums?id=' + node.id;
                },
                onHidePanel: function () {
                    placetype.combotree('setValue',
                            placetype.combotree('tree').tree('getSelected').id)
                        .combobox('setText',
                            placetype.combotree('tree').tree('getSelected').text);
                },
                onClick:function(record){
                    local.find('[name=placetype]').val(record.enum_value);
                    local.find('input[name=placetype]:checkbox').attr("checked",true);
                }
            });
            /*复选框选中状态*/
            local.find('input[opt=noname]').bind('click',function(){
                local.find('input[name=noname]:checkbox').attr("checked",true);
            });
            local.find('input[opt=romepinxie]').bind('click',function(){
                local.find('input[name=romepinxie]:checkbox').attr("checked",true);
            });
            /*local.find('input[opt=placetype]').bind('click',function(){
                alert(1)
                local.find('input[name=placetype]:checkbox').attr("checked",true);
            });*/
            local.find('input[opt=dengjidanwei]').bind('click',function(){
                local.find('input[name=dengjidanwei]:checkbox').attr("checked",true);
            });
            local.find('input[opt=dengjiren]').bind('click',function(){
                local.find('input[name=dengjiren]:checkbox').attr("checked",true);
            });
            local.find('input[opt=dengjishijian]').bind('click',function(){
                local.find('input[name=dengjishijian]:checkbox').attr("checked",true);
            });
            local.find('input[opt=shujuku]').bind('click',function(){
                local.find('input[name=shujuku]:checkbox').attr("checked",true);
            });

            /*按钮样式变换*/
            local.find('input[action=changebutton]').bind("mouseover",function(){
                this.style.background="url(../../../img/button2.jpg)";
            });
            local.find('input[action=changebutton]').bind("mouseout",function(){
                this.style.background="url(../../../img/button1.jpg)";
            });

            var jsonstr = '{"total":1,"rows":' +
                '[{"biaozhunmingcheng":"检测设备","hanyu":"M000005","diming":3,"xingzheng":"1","caozuo":"系统管理员"}]}';
            var data = $.parseJSON(jsonstr);
            /*刷新*/
            local.find('input[opt=refresh]').bind("click",function(){
                local.find('table[id=placeData]').datagrid('loadData',data);
            });
            /*新增地名*/
            local.find('input[opt=addPlace]').bind('click',function(){
                require(['commonfuncs/popwin/win','text!views/dmxt/PrePlaceAdd.htm','views/dmxt/PrePlaceAdd'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'新增地名',
                            width:724,
                            html:$(htmfile).eq(0),
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {text:'保存',handler:function(html,parent){ }}
                            ],
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    submitbtn:submitbtn,
                                    act:'c',
                                    parent:parent,
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                        localDataGrid.datagrid('reload');
                                    }
                                })
                            }
                        })
                    })
            });
            /*查询*/
            local.find('input[opt=queryPlace]').bind('click',function(){
                local.find('table[opt=placeData]').datagrid({
                    url:'../../querytable',
                    method:'get',
                    onLoadSuccess:function(data){
                        console.log(data)
//                        this.datagrid("loadData",$.parseJSON(data[0]));
                    }
                });
            });
        }
    }
    return a;
})