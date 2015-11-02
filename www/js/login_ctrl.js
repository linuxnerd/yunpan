angular.module("LoginModule", [])
.controller('LoginCtrl', function($rootScope, $scope, storage, $http, $ionicPopup, $state, $ionicLoading) {
  $scope.login_info = {};

  $scope.show = function() {
    $ionicLoading.show({
      template: '努力加载中...'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.loginForm = function() {
    var login_url = $rootScope.base_url + 'auth-token/'
    $scope.show();
    $http({
      method  : 'POST',
      url     : login_url,
      data    : $.param($scope.login_info),
    }).success(function(data) {
      // success
      console.log(data);
      var user_info = {
        username: $scope.login_info.username,
        token: data.token
      }
      storage.set('user_info',user_info);
      $scope.hide();
      $state.go('tab.repo');

    }).error(function(data) {
      // error
      $scope.hide();
      console.log(data);
      $ionicPopup.alert({
        title: '登录失败',
        template: "用户名或密码错误",
        okText: '确认'
      });
    });

    

  }
})