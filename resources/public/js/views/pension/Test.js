define(function(){
    function render(local,option){
        lo = local;
        op = option
        local.find('[opt=sign]').click(function () {
            console.log(4)
        })
    }

    return {
        render:render
    }
})