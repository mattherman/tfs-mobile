angular.module('starter.services', [])

.service('ConnectionService', function($http, Base64) {
  this.authData;

  this.verifyConnection = function(loginData) {
    var authToken = Base64.encode(loginData.username + ":" + loginData.password);
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authToken;

    this.authData = {
      server: loginData.server,
      authToken: authToken
    };

    var url = 'https://' + loginData.server + '/_apis/projectcollections/DefaultCollection?api-version=1.0'
    return $http.get(url)
  }

  this.getAuthData = function() {
    return this.authData;
  }
})

.service('ProjectService', function($http, $q, ConnectionService) {
  this.getProjects = function() {
    var authData = ConnectionService.getAuthData();
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authData.authToken
    var url = 'https://' + authData.server + '/defaultcollection/_apis/projects?api-version=1.0'

    var defer = $q.defer();

    $http.get(url)
      .success(function(data) {
        defer.resolve(data.value);
      })
      .error(function(data) {
        defer.resolve([]);
      });

    return defer.promise;
  }

  this.getProject = function(projectId) {
    var authData = ConnectionService.getAuthData();
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authData.authToken
    var url = 'https://' + authData.server + '/defaultcollection/_apis/projects/' + projectId + '?api-version=1.0'

    var defer = $q.defer();

    $http.get(url)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function(data) {
        defer.resolve({});
      });

    return defer.promise;
  }
})
