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

.controller('BacklogCtrl', function($scope, $stateParams, $state, WorkItemService) {
  $scope.loading = true;
  $scope.backlogItems = [];
  $scope.$on('$ionicView.enter', function(e) {
    $scope.loading = true;
    WorkItemService.getBacklog($stateParams.projectName)
      .then(function(result) {
        $scope.backlogItems = result;
        $scope.loading = false;
      });
  });

  $scope.create = function() {
    $state.go('app.createWorkItem', { projectName: $stateParams.projectName});
  }
})

.controller('CreateWorkItemCtrl', function($scope, $stateParams, $state, $ionicPopup, WorkItemService) {
  $scope.workItemData = {};

  $scope.create = function() {
    if (formValid($scope.workItemData)) {
      WorkItemService.createWorkItem($scope.workItemData, $stateParams.projectName)
        .success(function(result) {
          $state.go('app.backlog', { projectName: $stateParams.projectName });
        })
        .error(function(result) {
          var alertPopup = $ionicPopup.alert({
            title: 'Create Failed',
          });
        });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Title and Type are required fields',
      });
    }

  }

  formValid = function(workItemData) {
      return workItemData.title && workItemData.type;
  }
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

  $scope.goToTasks = function() {
    $state.go('app.taskBoard', { workItemId: $stateParams.workItemId, projectName: $scope.workItem.fields['System.TeamProject'] });
  }
})

.controller('TaskBoardCtrl', function($scope, $state, $stateParams, TaskService) {
  $scope.tasksToDo = [];
  $scope.tasksInProgress = [];
  $scope.tasksFinished = [];
  $scope.loading = true;

  $scope.$on('$ionicView.enter', function(e) {
    TaskService.getTasksForWorkItem($stateParams.workItemId, $stateParams.projectName)
      .then(function(result) {
        $scope.tasksToDo = filterByState(result, 'To Do');
        $scope.tasksInProgress = filterByState(result, 'In Progress');
        $scope.tasksFinished = filterByState(result, 'Done');
      });
    $scope.loading = false;
  });

  $scope.create = function() {
    $state.go('app.createTask', { workItemId: $stateParams.workItemId, projectName: $stateParams.projectName });
  }

  filterByState = function(workItems, state) {
    return _.filter(workItems, function(item) { return item.fields['System.State'] == state});
  }
})

.controller('CreateTaskCtrl', function($scope, $state, $stateParams, $ionicPopup, TaskService) {
  $scope.taskData = {};

  $scope.create = function() {
    if (formValid($scope.taskData)) {
      TaskService.createTask($scope.taskData, $stateParams.workItemId, $stateParams.projectName)
        .success(function(result) {
          $state.go('app.taskBoard', { projectName: $stateParams.projectName, workItemId: $stateParams.workItemId });
        })
        .error(function(result) {
          var alertPopup = $ionicPopup.alert({
            title: 'Create Failed',
          });
        });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Title is a required field',
      });
    }

  }

  formValid = function(taskData) {
      return taskData.title;
  }
})
