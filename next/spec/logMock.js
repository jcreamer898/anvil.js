// Generated by CoffeeScript 1.3.1
(function() {
  var LogMock, colors, log;

  colors = require("colors");

  LogMock = (function() {

    LogMock.name = 'LogMock';

    function LogMock() {}

    LogMock.prototype.messages = [];

    LogMock.prototype.onEvent = function(x) {
      if (!this.quiet) {
        return this.messages.push("   " + x);
      }
    };

    LogMock.prototype.onStep = function(x) {
      if (!this.quiet) {
        return this.messages.push(("" + x).blue);
      }
    };

    LogMock.prototype.onComplete = function(x) {
      return this.messages.push(("" + x).green);
    };

    LogMock.prototype.onError = function(x) {
      return this.messages.push(("!!! " + x + " !!!").red);
    };

    return LogMock;

  })();

  log = new LogMock();

  exports.log = log;

}).call(this);
