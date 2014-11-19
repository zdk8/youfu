define(function(){
    var render = function(local,posion){
        getdivision(local); //行政区划
        getplacetype(local); //地名类型
        var placeDataQuery = local.find('table[opt=placeDataQuery]');           //datagrid
        var divisiontree = local.find('input[opt=divisiontree]');               //行政区划
        var placetype = local.find('input[opt=placetype]');                      //地名类型
        var biaozhunmingcheng = local.find('input[opt=biaozhunmingcheng]');     //标准名称
        var romepinxie = local.find('input[opt=romepinxie]');                    //罗马拼音
        var datastate = local.find('select[opt=datastate]');                     //数据库
        querybtn(local,placeDataQuery,divisiontree,placetype,biaozhunmingcheng,romepinxie,datastate);    //按条件查询
        /*复选框选中状态*/
        /*biaozhunmingcheng.bind('click',function(){
            local.find('input[name=biaozhunmingcheng]:checkbox').attr("checked",true);
        });
        romepinxie.bind('click',function(){
            local.find('input[name=romepinxie]:checkbox').attr("checked",true);
        });
        datastate.combobox({
            onSelect: function (date) {
                local.find('input[name=datastate]:checkbox').attr("checked",true);
            }
        });*/

        /*地名数据查询datagrid*/
        placeDataQuery.datagrid({
            url:preFixUrl+'jcfxs/dmcx',
            queryParams:{

            },
            onLoadSuccess:function(data){
                console.log(data)
            }
        })

    }

    /*行政区划的树结构*/
    var getdivision = function(local){
        var divisiontree = local.find(':input[opt=divisiontree]') ;
        divisiontree.combotree({
            panelHeight:300,
            url:'../../civil/getdivision',
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
                    = '../../civil/getdivision?dvhigh=' + node.id;
            },
            onHidePanel: function () {
                divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        divisiontree.combotree('tree').tree('getSelected').text);
            }
        });
    }
    /*地名类型*/
    var getplacetype = function(local){
        var placetype = local.find(':input[opt=placetype]');
        placetype.combotree({
            panelHeight:300,
            url:'../../civil/getenums?id=dmtype',       //"parent 所有业务"
            method: 'get',
            onLoadSuccess:function(load,data){
                if(!this.firstloaded){
                    placetype.combotree('setText', data[0].text);
                    this.firstloaded=true;
                }
            },
            onBeforeExpand: function (node) {
                placetype.combotree("tree").tree("options").url
                    = '../../civil/getenums';
            },
            onHidePanel: function () {
                placetype.combotree('setValue',
                        placetype.combotree('tree').tree('getSelected').id)
                    .combobox('setText',
                        placetype.combotree('tree').tree('getSelected').text);
                local.find('input[name=placetype]:checkbox').attr("checked",true);
            }
        });
    }
    /*查询*/
    var querybtn = function(local,placeDataQuery,divisiontree,placetype,biaozhunmingcheng,romepinxie,datastate){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,placeDataQuery,divisiontree,placetype,biaozhunmingcheng,romepinxie,datastate);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,placeDataQuery,divisiontree,placetype,biaozhunmingcheng,romepinxie,datastate){
        /*var dateavalue = new Array();
        local.find('input[name=divisiontree]').attr("checked") == "checked"?
            dateavalue.push({"name":"placecode","operate":"like","value":divisiontree.combotree("getValue")+"%","logic":"and"}):dateavalue;
        console.log(dateavalue)*/
        placeDataQuery.datagrid('load',{
            district_id: divisiontree.combotree("getValue"),
            placetype:placetype.combotree("getValue"),
            biaozhunmingcheng:biaozhunmingcheng.val(),
            romepinxie:romepinxie.val(),
            datastate:datastate.combotree("getValue")
        })
        console.log(placetype.combotree("getValue"))
    }

    return {
        render:render
    }
})