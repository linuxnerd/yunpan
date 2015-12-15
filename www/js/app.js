// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('yunpan', ['ionic', 'yunpan.services', 'angularLocalStorage', 'LoginModule', 'RepoModule',
  'DirectoryModule', 'DownloadModule', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // $rootScope.base_url= "http://198.15.0.124:8000/api2/";
    $rootScope.base_url= "http://144.131.254.19:8000/api2/";
    // $rootScope.base_url= "http://180.169.95.137:8000/api2/";

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // 登录
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    // 退出
    .state('logout', {
      url: '/login',
      controller: function($scope,storage) {
        storage.clearAll();
      }
    })

    .state('tab',{
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // 资料库
    .state('tab.repo', {
      url: '/repo',
      views: {
        'tab-repo': {
          templateUrl: 'templates/tab-repo.html',
          controller: 'RepoCtrl'
        }
      }
    })

    // 资料库详情
    .state('tab.repo-directory', {
      url: '/:repo_name/:repo_id/detail/:path',
      views: {
        'tab-repo': {
          templateUrl : 'templates/repo-directory.html',
          controller  : 'DirectoryCtrl'
        }
      }
    })

    // 下载
    .state('tab.repo-download', {
      url: '/download/:file_name/:url',
      views: {
        'tab-repo': {
          templateUrl : 'templates/repo-download.html',
          controller  : 'DownloadCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});
