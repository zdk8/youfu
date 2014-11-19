/**
 * Created by jack on 13-12-31.
 */
define(['views/ManagerTree','commonfuncs/LoadingMask'], function(ManagerTree,LoadingMask){

    function start(){
        ManagerTree.render({LoadingMask:LoadingMask});

    }

    return {
        start:start
    };
});
