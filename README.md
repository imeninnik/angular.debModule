# Angular Debug And Logger Module


## Usage

1. Include `'debModule'` as Angular app dependency:  
`angular.module('yourApp', ['debModule']);`

2. Config in Angulars config section: 
 
 ```
 appConfigs.$inject = ['dbgProvider'];
 function appConfigs(dbgProvider) {
     dbgProvider.settings({
         enable: true,
         debugLevel: 'info',
         emitters: false,
         labels: true
     });
 } 
 ```
 
 3. Include `'dbg'` dependency to your controllers, services,directives, etc..
 
 ```
 AppController.$inject = ['dbg'];
 function AppController(dbg) {
     dbg.error('#AppController > ERROR');
     dbg.warn('#AppController > Warning');
     
     dbg.log('#AppController > LOG');
     dbg.log1('#AppController > DEBUG ');
     dbg.log2('#AppController > TRACE');
     
     dbg.yell('#AppController > yell');
     dbg.rs('dashboard.usersAccount')
     
     dbg.dlog('directives log')
 }
 ```