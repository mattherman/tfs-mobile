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

.controller('PlaylistCtrl', function($scope, $stateParams, ProjectService) {
  $scope.project = {};
  ProjectService.getProject($stateParams.projectId)
    .then(function(result) {
      $scope.project = result;
    })
});
