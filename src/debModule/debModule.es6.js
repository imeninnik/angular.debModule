/**
 * Debug And Logging Module
 *
 * Error Levels:
 *  0 - ERROR   .error()    All errors
 *  1 - WARN    .warn()     All warnings
 *  2 - INFO    .log()      Highlight the progress of the application
 *  3 - DEBUG   .log1()     Designate users and app actions
 *  4 - TRACE   .log2()     Designate app processes actions
 *
 *  Log helpers:
 *   labels: {boolean} true - show or hide labels
 *   emitters: {boolean} true - show or hide urls and line numbers where log was called
 */
(function () {
    'use strict';
    let appStartTime = new moment();
    var time = getTime;


    /**
     * Debug error Levels
     *  0 || full - full error message detail,
     *  1 || short - one line
     *  2 || dbg for dev env only
     */
    angular.module('debModule', []).provider('dbg', function () {

        var debEnabled = false;
        var debugLevel = 1;

        var settings = {
           debugModules: {
                rs: true,
                directives: true
            },
            emitters:true,
            labels:false
        };

        var self = this;

        self.protocol = window.location.protocol;
        self.fileName = 'debModule.';

        // error log always enabled
        self.enable = function (value) {
            debEnabled = value;
        };

        /**
         * Error Levels:
         *  0 - ERROR - All errors (error)
         *  1 - WARN - All warnings (warn)
         *  2 - INFO - Highlight the progress og the application (log)
         *  3 - DEBUG - Designate users and app actions (log1)
         *  4 - TRACE - Designate app processes actions (log2)
         * @param value
         */
        self.debugLevel = function (value) {
            if ( angular.isNumber(value) ) {
                settings.debugLevel = value;
            } else {
                if (value === 'ERROR' || value === 'error')debugLevel = 0;
                if (value === 'WARN' || value === 'warn') debugLevel = 1;
                if (value === 'INFO' || value === 'info') debugLevel = 2;
                if (value === 'DEBUG' || value === 'debug') debugLevel = 3;
                if (value === 'TRACE' || value === 'trace') debugLevel = 4;
            }
        };



        self.settings = function (value) {
            if (value && !angular.isObject(value)) {
                console.warn('Settings must be an object');
                return;
            }
            self.enable(value.enable);
            if (value.debugLevel) self.debugLevel(value.debugLevel);
            settings = angular.merge(settings, value);
        };

        // todo: add custom message types (example: 'log1', 'rs')
        self.addMessangers = function (messangers) {
            //{type, errorLevel, styles}
        };

        var logColors = {
            'default': 'color:black',
            'time': 'color:#555; font-size: .95em;',

            'red': 'color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%)',
            'err': 'color:hsl(0, 100%, 90%);background-color:hsl(0, 100%, 50%)',

            'wrn': 'color: white; background-color:hsl(39, 100%, 50%); font-weight: bold',

            'orangeWhite': 'padding: 0.2em; font-size: 1.2em; font-weight: 600; color:white; background-color:hsl(39, 100%, 50%)',
            'orangeBlack': 'color:black; background-color:hsl(39, 100%, 50%)',
            'yellow': 'color:hsl(60, 100%, 35%); background-color:hsl(60, 100%, 50%)',
            'green': 'color:white; background-color:rgba(0, 128, 0, 0.5);',
            'greenForDirectivesLog': 'color:white; background-color:rgba(0, 128, 118, 0.5);',
            'darkGreen': 'color:hsl(120, 100%, 60%); background-color: #222; font-weight: bold',

            'blue': 'color: white; background-color:rgba(30, 125, 248, 1); font-weight: bold',
            'blue1': 'color: white; background-color:rgba(30, 125, 248, 0.8); font-weight: bold',
            'blue2': 'color: white; background-color:rgba(30, 125, 248, 0.5); font-weight: bold',

            'purple': 'color:hsl(300, 100%, 85%); background-color:hsl(300, 100%, 25%)',
            'black': 'color:hsl(0, 0%, 80%); background-color:hsl(0, 0%, 0%)'
        };

        var publicMethods = {

            /**
             * Short output
             * For helpful app logging
             */
            error: function error() {
                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                console.error('%c%s %c ERR ', logColors.time, time(), logColors.err, output, '\t\t\t' + stk);
            },

            /**
             * Short output
             * For helpful app logging
             */
            warn: function warn() {
                if (!debEnabled || debugLevel < 1) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                console.warn('%c%s %c wrn ', logColors.time, time(), logColors.wrn, output, stkString);
            },

            /**
             * Full output
             * for general app logging
             */
            info: function info() {
                if (!debEnabled || debugLevel < 2) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');

                stk = parseStk(stk);

                console.info('%c%s %c%s %c%s ', logColors.time, '\n' + time(), logColors.blue, ' LOG', logColors['default'], ' ' + stk + ' \n ' + output + '\n\n');
            },

            /**
             * INFO - Highlight the progress of the application
             */
            log: function log() {
                if (!debEnabled || debugLevel < 2) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                console.log('%c%s %c log ', logColors.time, time(), logColors.blue, output, stkString);
            },

            /**
             * DEBUG - Designate users and app actions
             */
            log1: function log1() {
                if (!debEnabled || debugLevel < 3) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                console.log('%c%s %c log ', logColors.time, time(), logColors.blue1, output, stkString);
            },

            /**
             * TRACE - Designate app processes actions
             */
            log2: function log2() {
                if (!debEnabled || debugLevel < 4) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                console.log('%c%s %c log ', logColors.time, time(), logColors.blue2, output, stkString);
            },

            /**
             * Routs and States
             */
            rs: function rs() {
                if (!debEnabled || !settings.debugModules.rs || debugLevel < 3) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                settings.labels ? console.log('%c%s %c log #routs and states ', logColors.time, time(), logColors.green, output, stkString) : console.log('%c%s %c log ', logColors.time, time(), logColors.green, '#routs and states > ' + output, stkString);
            },

            /* log for directives */
            dlog: function dlog() {
                if (!debEnabled || !settings.debugModules.directives || debugLevel < 3) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                var stkString = settings.emitters ? '\t\t\t' + stk : '';

                settings.labels ? console.debug('%c%s %c log #directive ', logColors.time, time(), logColors.greenForDirectivesLog, output, stkString) : console.debug('%c%s %c log ', logColors.time, time(), logColors.greenForDirectivesLog, '#directive > ' + output, stkString);

                //console.log('%c%s %c log #directive ', logColors.time , time(), logColors.greenForDirectivesLog, output, '\t\t\t'+stk );
            },

            /* yell - is not to miss message in debug session or when you need some attention =) */
            yell: function yell() {
                if (!debEnabled) return;

                var output = parseInput(arguments);
                var err = new Error(arguments);
                var stk = err.stack.split('at');
                stk = parseStk(stk);

                console.log('\n\n');
                console.log('%c ATTENTION HERE! ', logColors.orangeWhite, stk, '\n\n\t', output, '\n\n ');
                console.log('%c        ^        ', logColors.orangeWhite);
            }

        };

        console.log('%c%s %c log ', logColors.time, '0.000', logColors.blue1, 'app started');

        /**
         * Parse input to nice view
         * @param args {arguments}
         */
        function parseInput(args) {
            //convert type arguments to type array
            // http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
            var input = Array.prototype.slice.call(args);
            input.sort();

            if (!angular.isArray(input)) return input;

            var output, circular;

            if (input.length == 1) {
                output = input[0];
            } else {
                for (var i = 0; i < input.length; i++) {
                    //convert [object Object] to readable string
                    if (angular.isObject(input[i])) {
                        try {
                            input[i] = JSON.stringify(input[i], censor(input[i]));
                        } catch (err) {
                            //case with circular dependency
                            input[i] = input[i];
                            circular = true;
                        }
                    }
                }

                output = input.join('  ');
            }

            if (circular) output = [output, args];
            return output;

            function censor(censor) {
                var i = 0;

                return function (key, value) {
                    if (i !== 0 && typeof censor === 'object' && typeof value == 'object' && censor == value) return '[Circular]';

                    if (i >= 10) // seems to be a harded maximum of 30 serialized objects?
                        return '[Unknown]';

                    ++i; // so we know we aren't using the original object anymore

                    return value;
                };
            }
        }

        function parseStk(rawStk) {
            var rawOutput = [];
            for (var i = 0; i < rawStk.length; i++) {
                if (rawStk[i].indexOf(self.protocol + '//') > -1) rawOutput.push(rawStk[i]);
            }
            for (var i = 0; i < rawOutput.length; i++) {
                if (rawOutput[i].indexOf(self.fileName) == -1) {

                    var output = rawOutput[i];
                    return output.slice(output.lastIndexOf('(') + 1, output.lastIndexOf(')'));
                }
            }
        }

        this.$get = function () {
            return publicMethods;
        };
    });

    function getTime(init) {
        var tmp = moment();

        if (init) {
            appStartTime = new moment();
            tmp = appStartTime;
        }

        var secs = tmp.diff(appStartTime, 'ms') / 1000 + '';
        var tmpOutput = secs.split('.');

        //to prevent disappearing of trailing zero character in number, so 2.60 won't be 2.6
        if (tmpOutput.length > 1 && tmpOutput[1].length === 1) secs = secs + '00';
        if (tmpOutput.length > 1 && tmpOutput[1].length == 2) secs = secs + '0';
        return secs;
    }
})();

