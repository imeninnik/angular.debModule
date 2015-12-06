angular.module('debModuleApp', ['debModule']).
    config(appConfigs).
    run(appRun).
    controller('AppController', AppController);


appConfigs.$inject = ['dbgProvider'];
function appConfigs(dbgProvider) {
    dbgProvider.settings({
        enable: true,
        debugLevel: 'info',
        emitters: false,
        labels: true
    });
}


appRun.$inject = ['dbg'];
function appRun(dbg) {
    dbg.log('#appRun started 0');
    dbg.log1('#appRun started 1 ');
    dbg.log2('#appRun started 2');


}


AppController.$inject = ['dbg'];
function AppController(dbg) {
    dbg.error('#AppController > ERROR');
    dbg.warn('#AppController > Warning');
    dbg.log('#AppController > LOG');
    dbg.log1('#AppController > DEBUG ');
    dbg.log2('#AppController > TRACE');
    //dbg.yell('#AppController > yell');

    dbg.rs('what?')

}