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

.service('WorkItemService', function($http, $q, ConnectionService) {
  this.getBacklog = function(projectName) {
    var queryObject = {
      query: "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.TeamProject] = '" + projectName + "' AND [System.WorkItemType] = 'Product Backlog Item' AND [State] <> 'Closed' AND [State] <> 'Removed' AND [State] <> 'Done' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
    }

    var authData = ConnectionService.getAuthData();
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authData.authToken
    var url = 'https://' + authData.server + '/DefaultCollection/_apis/wit/wiql?api-version=1.0'

    var defer = $q.defer();

    var getWorkItems = this.getWorkItems;
    $http.post(url, queryObject)
      .success(function(response) {
        var identifiers = getIdentifiersFromQueryResponse(response);
        var workItems = getWorkItems(identifiers);
        defer.resolve(workItems);
      })
      .error(function(response) {
        return defer.resolve([]);
      })

      return defer.promise;
  }

  this.getWorkItems = function(identifiers) {
    if (identifiers.length == 0) {
      return [];
    }
    
    var identifierString = identifiers.join(",");

    var authData = ConnectionService.getAuthData();
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authData.authToken
    var url = 'https://' + authData.server + '/DefaultCollection/_apis/wit/WorkItems?ids=' + identifierString + '&api-version=1.0'

    var defer = $q.defer();

    $http.get(url)
      .success(function(response) {
        defer.resolve(response.value);
      })
      .error(function(response) {
        defer.resolve([]);
      })

    return defer.promise;
  }

  getIdentifiersFromQueryResponse = function(queryResult) {
    var workItems = queryResult.workItems;
    return _.map(workItems, function(item) { return item.id });
  }
})
