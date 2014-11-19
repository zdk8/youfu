define(function(){
    /*
    判断数据已经存在
    param 0:url,获得数据
    */
    $.extend($.fn.validatebox.defaults.rules, {
        exists: {
            validator: function(value, param){
                var dataOjb={};
                dataOjb[param[1]||"id"]=value;
                var me=this;
                var result=true;
                $.ajax({
                    url:param[0],
                    data:dataOjb,
                    async:false,
                    type:'post',
                    success:function(res){
                        obj= $.evalJSON(res);
                        if(!obj){
                            this.message="获得人员信息错误，无法判断是否存在";
                            return false;
                        }
                        if(obj.rows&&obj.rows.length>0){
                            result=false;
                        }else if(obj.rows!=0){
                            result=false;
                        }
                    }
                })
                return result;
            },
            message: '人员已存在.'
        }
    });
})
