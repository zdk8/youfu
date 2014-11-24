/**
 * Created by weipan on 2014/10/10.
 * desc: 预选地名代码和地名类别，以加载对应的表单
 */


define(function(){
    return {
        render:function(local,option){
            var placecommon_id_first = local.find('input[opt=placecommon_id_first]');  //地名代码1
            var placecommon_id_second = local.find('input[opt=placecommon_id_second]');  //地名代码2
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
                        if(divisiontree.combotree('getValue').length == 6){
                            placecommon_id_first.val(divisiontree.combotree('getValue')) //加载地名代码1
                            placecommon_id_second.val('000') //加载地名代码2
                        }else{
                            placecommon_id_first.val(divisiontree.combotree('getValue').substring(0,6)) //加载地名代码1
                            placecommon_id_second.val(divisiontree.combotree('getValue').substring(7,10)) //加载地名代码2
                        }
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
                    if(divisiontree.combotree('getValue').length == 6){
                        placecommon_id_first.val(divisiontree.combotree('getValue')) //加载地名代码1
                        placecommon_id_second.val('000') //加载地名代码2
                    }else{
                        placecommon_id_first.val(divisiontree.combotree('getValue').substring(0,6)) //加载地名代码1
                        placecommon_id_second.val(divisiontree.combotree('getValue').substring(7,10)) //加载地名代码2
                    }
                }
            });

            var placecommon_id_three = local.find('input[opt=placecommon_id_three]');         //地名代码3
            var placetype = local.find(':input[opt=placetype]') ;                               //行政区划的树结构

            placetype.combotree({
                panelHeight:300,
                url:preFixUrl+'civil/getenums',
                method: 'get',
                onLoadSuccess:function(load,data){
                    if(!this.firstloaded){
                        placetype.combotree('setValue', data[0].id)
                            .combotree('setText', data[0].text);
                        this.firstloaded=true;
                        placecommon_id_three.val(placetype.combotree('getValue'));              //加载地名代码3
                    }
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
                    placecommon_id_three.val(placetype.combotree('getValue'))
                },
                onClick:function(record){
                    local.find('[name=placetype]').val(record.enum_value);
                }
            });


            local.find('a[opt=newplace]').bind('click',function(){
                require(['text!views/dmxt/TypeTableMap.htm'],function(htm){
                    var tablename=$(htm).find('enum[enumvalue='+local.find('[name=placetype]').val()+']').find('databasetable').attr('en').toLocaleLowerCase().substr(2);
                    /*表名（整）*/
                    var wholename=$(htm).find('enum[enumvalue='+local.find('[name=placetype]').val()+']').find('databasetable').attr('en').toLocaleLowerCase();
                    /*表头名*/
                    var head = $(htm).find('enum[enumvalue='+local.find('[name=placetype]').val()+']').find('databasetable').attr('ch');
                    var headname = head.substring(0,head.length-3);
                    cj.showContent({
                        title:'办理',
                        htmfile:'text!views/dmxt/PlaceCommon.htm',
                        jsfile:'views/dmxt/PlaceCommon',
                        queryParams:{
                            placetype:local.find('[name=placetype]').val(),
                            tablename:tablename,
                            wholename:wholename,
                            headname:headname,
                            placecommon_id_first:local.find('input[opt=placecommon_id_first]').val(),
                            placecommon_id_second:local.find('input[opt=placecommon_id_second]').val(),
                            placecommon_id_three:local.find('input[opt=placecommon_id_three]').val(),
                            biaozhunmingcheng:local.find('input[opt=biaozhunmingcheng]').val(),
                            tongming:local.find('input[opt=tongming]').val(),
                            romezhuanming:local.find('input[opt=romezhuanming]').val(),
                            rometongming:local.find('input[opt=rometongming]').val()
                        }
                    })
                    option.parent.trigger('close');
                })
            })
        }



    }
})