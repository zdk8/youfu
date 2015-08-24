/**
 * Created by jack on 13-12-31.
 */
requirejs.config({

    urlArgs: "dc_=" +  (new Date()).getTime()

});
require(['../../js/router','layoutinit'], function(Router,layoutinit){

    Router.startRouting();
    layoutinit.inithead();
    layoutinit.initroutnavigation();
    layoutinit.initindextime();

});
