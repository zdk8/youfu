define(function(){
    function render(local,option){
        var layers_points = [{PT_SHTT:[1,2,3]},{ST_DOORPLATE:[4,5,6]},{PT_FLY:[7,8,9]},{PT_JLY:[10,11,12]}]
        var layers = ["PT_SHTT","ST_DOORPLATE","PT_FLY","PT_JLY"];
        var points = [[],[],[],[]]
        for(var i=0;i<layers.length;i++){
            points[i].push(layers[i])
        }
    }

    return {
        render:render
    }

})