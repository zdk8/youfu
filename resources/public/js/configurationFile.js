approvalProcess=['打回重审','提交未审核','审核未审批','审批通过','保存未提交'];    //流程状态
getGender=['男','女']             //性别
/*日期时间*/
var myformatter = function(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
var myparser = function(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}
/*行政区划的树结构*/
var getdivision = function(divisiontree){
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
                    divisiontree.combotree('tree').tree('getSelected').text);
        }
    });
}
/*进度框*/
var showProcess = function(isShow, title, msg) {
    if (!isShow) {
        $.messager.progress('close');
        return;
    }
    var win = $.messager.progress({
        title: title,
        msg: msg
    });
}

/*fieldset的收缩
 * pTableID 表格(table)
 * pFieldSetID 框架(fieldset)
 * pImageID 要显示的图片(image)
 * */
var FieldSetVisual = function(local, pTableID, pFieldSetID, pImageID )
{
    var objTable = local.find('[opt='+pTableID+']');
    var objFieldSet = local.find('[opt='+pFieldSetID+']');
//            var objImage = document.getElementById( pImageID) ;
    if(objTable.is(":hidden"))
    {
        objTable.show()
        var heightTable = parseInt( objTable.height())+22 ;
        objFieldSet.height(heightTable+"px");
//            objImage.src="F:\\相册\\按钮\\searchorange.jpg" ;        //打开
    }
    else
    {
        objTable.hide()
        objFieldSet.height("22px");
//            objImage.src="F:\\相册\\按钮\\hengtiao.jpg" ;       //收缩
    }
}