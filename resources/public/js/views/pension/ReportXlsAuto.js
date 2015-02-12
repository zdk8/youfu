define(function(){
    var render = function(local,option){
        cal = local;





        //local.find('.table_form').html(option.html);
        addRadioCssComm(local);
        addCheckCssComm(local);

    }

    return {
        render:render
    }
})