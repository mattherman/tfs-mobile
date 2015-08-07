// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.factories'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.projects', {
    url: '/projects',
    views: {
      'menuContent': {
        templateUrl: 'templates/projects.html',
        controller: 'ProjectsCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/projects/:projectId',
    views: {
      'menuContent': {
        templateUrl: 'templates/project.html',
        controller: 'ProjectCtrl'
      }
    }
  })

  .state('app.backlog', {
    url: '/backlog/:projectName',
    views: {
      'menuContent': {
        templateUrl: 'templates/backlog.html',
        controller: 'BacklogCtrl'
      }
    }
  })

  .state('app.workitem', {
    url: '/workitem/:workItemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/workitem.html',
        controller: 'WorkItemCtrl'
      }
    }
  })

  .state('app.createWorkItem', {
    url: '/backlog/:projectName/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/createWorkItem.html',
        controller: 'CreateWorkItemCtrl'
      }
    }
  })

  .state('app.taskBoard', {
    url: '/workItem/:projectName/:workItemId/tasks',
    views: {
      'menuContent': {
        templateUrl: 'templates/taskBoard.html',
        controller: 'TaskBoardCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
