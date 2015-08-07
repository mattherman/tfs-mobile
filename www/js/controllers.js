angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, ConnectionService) {
  // Form data for the login modal
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    if (loginDataValid($scope.loginData)) {
      ConnectionService.verifyConnection($scope.loginData)
        .success(function(data) {
          $state.go('app.projects')
        })
        .error(function(data) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login Failed',
          });
        });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Please fill in required fields',
      });
    }
  };

  loginDataValid = function(loginData) {
    return loginData != null &&
            loginData.username &&
            loginData.password &&
            loginData.server;
  }
})

.controller('ProjectsCtrl', function($scope, ProjectService) {
  $scope.loading = true;
  $scope.projects = [];
  ProjectService.getProjects()
    .then(function(result) {
      $scope.projects = result;
      $scope.loading = false;
    });
})

.controller('ProjectCtrl', function($scope, $stateParams, $state, ProjectService) {
  $scope.project = {};
  ProjectService.getProject($stateParams.projectId)
    .then(function(result) {
      $scope.project = result;
    })

  $scope.goToBacklog = function() {
    $state.go('app.backlog', { projectName: $scope.project.name});
  }
})

.controller('BacklogCtrl', function($scope, $stateParams, WorkItemService) {
  $scope.loading = true;
  $scope.backlogItems = [];
  WorkItemService.getBacklog($stateParams.projectName)
    .then(function(result) {
      $scope.backlogItems = result;
      $scope.loading = false;
    })
})

.controller('WorkItemCtrl', function($scope, $stateParams, $state, $ionicPopup, WorkItemService) {
  $scope.workItem = {};
  WorkItemService.getWorkItem($stateParams.workItemId)
    .then(function(result) {
      $scope.workItem = result;
    });

  $scope.updateWorkItem = function() {
    WorkItemService.updateWorkItem($scope.workItem)
      .success(function(result) {
        $state.go('app.backlog', { projectName: $scope.workItem.fields['System.TeamProject']});
      })
      .error(function(result) {
        var alertPopup = $ionicPopup.alert({
          title: 'Save Failed',
        });
      });
  }
});
