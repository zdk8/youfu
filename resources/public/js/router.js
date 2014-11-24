/**
 * Created by jack on 13-12-31.
 */
define(function(){

    var routes = [{hash:'#menu_pension', controller:'MainViewController'},
        {hash:'#menu_qxgl',  controller:'ManagerController'}];
    var defaultRoute = '#menu_pension';
    //var defaultRoute ='';
    var currentHash = '';

    function startRouting(){
        window.location.hash = window.location.hash || defaultRoute;
        setInterval(hashCheck, 100);
    }

    function hashCheck(){
        if (window.location.hash != currentHash){
            for (var i = 0, currentRoute; currentRoute = routes[i++];){
                if (window.location.hash == currentRoute.hash)
                    loadController(currentRoute.controller);
            }
            currentHash = window.location.hash;
        }
    }

    function loadController(controllerName){
        require(['controllers/' + controllerName], function(controller){
            controller.start();
        });
    }

    return {
        startRouting:startRouting
    };
});
