var sdcGithub = angular.module('sdcGithub', ['ngRoute']);

sdcGithub.filter('escape', function() {
  return escape;
});

sdcGithub.controller('IndexCtrl', function ($scope) {
  debugger;
});

sdcGithub.controller('ServiceWorkerCtrl', function ($scope, $location, $filter) {
  $scope.serviceWorkerController = navigator.serviceWorker.controller;
  $scope.serviceWorkerUrl = '/sw.js';
  $scope.serviceWorkerInit = $filter('json')({'scope': '/'});
  $scope.registerServiceWorker = function() {
    navigator.serviceWorker.register(
      $scope.serviceWorkerUrl,
      JSON.parse($scope.serviceWorkerInit));
  };
  // beacon
  $scope.beaconFetch = function (beaconUrl, beaconData, beaconType) {
    navigator.sendBeacon(beaconUrl, new Blob([beaconData], {type: beaconType}));
  };
  // event source
  $scope.eventSourceFetch = function(eventSourceUrl, eventSourceWithCredentials) {
    var eventSource = new EventSource(eventSourceUrl, {withCredentials: eventSourceWithCredentials});
    eventSource.onerror = console.log.bind(console, 'EventSource.onerror');
    eventSource.onmessage = console.log.bind(console, 'EventSource.onmessage');
    eventSource.onopen = console.log.bind(console, 'EventSource.onopen');
  };
  // favicon
  $scope.faviconFetch = function(faviconUrl) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'shortcut icon');
    link.setAttribute('href', faviconUrl);
    document.getElementsByTagName('head')[0].appendChild(link);
  };
  // XMLHttpRequest
  $scope.xhrLog = [];
  function logXhrProgress(prefix, target) {
    function log(type, message) {
      message = JSON.parse($filter('json')(message));
      setTimeout(function() {
        $scope.$apply(function(scope) {
          var logEntry = {type: type, message: message};
          scope.xhrLog.push(logEntry);
          console.log(logEntry);
        });
      }, 1);
    }
    var events = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend', 'readystatechange'];
    for (var i=0; i<events.length; i++) {
      target.addEventListener(events[i], log.bind(null, prefix + events[i]));
    }
  };
  $scope.fetchXhr = function(xhrMethod, xhrUrl, xhrAsync, xhrUsername, xhrPassword, xhrHeader, xhrTimeout, xhrWithCredentials, xhrData) {
    var xhr = new XMLHttpRequest;
    xhr.open(xhrMethod, xhrUrl, xhrAsync===true, xhrUsername?xhrUsername:undefined, xhrPassword?xhrPassword:undefined);
    for (header in xhrHeader) {
      xhr.setRequestHeader(header, xhrHeader[header]);
    }
    if (xhrAsync)
      xhr.timeout = xhrTimeout * 1;
    xhr.withCredentials = xhrWithCredentials === true;
    logXhrProgress('XHR.upload.', xhr.upload);
    logXhrProgress('XHR.', xhr);
    xhr.send(xhrData);
  };
});

sdcGithub.config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index.html',
      controller: 'IndexCtrl'
    }).
    when('/service-worker', {
      templateUrl: 'partials/service-worker.html',
      controller: 'ServiceWorkerCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  // allow all URLs as resource URLs
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);
