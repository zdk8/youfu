define(function(){
    function render(local,option){
        var layers = ["PT_SHTT","ST_DOORPLATE","PT_FLY","PT_JLY"];
//        var _makers = [['PT_SHTT图层的点1','PT_SHTT图层的点2'],['ST_DOORPLATE图层的点1','ST_DOORPLATE图层的点1'],['PT_FLY图层的点1','PT_FLY图层的点1'],['PT_JLY图层的点1','PT_JLY图层的点1']];
        var _makers = [[1,2],[11,22],[111,222],[1111,2222]];
        var layers_points = []
        for(var i=0;i<layers.length;i++){
            var jsonstr = '{"'+layers[i]+'":'+'['+_makers[i]+']'+'}';
            var data = $.parseJSON(jsonstr);
            layers_points.push(data)
        }
        console.log(layers_points)

    }

    return {
        render:render
    }

})