define(function(){
    var obj={
        load:function(option,f){
            $.ajax({
                url:option.url,
                data:option.data,
                type:'post',
                success:function(res){
                   if(f){
                       f(res)
                   }
                }
            })
        }
    }

    return obj;
})