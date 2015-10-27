angular.module("DirectoryModule", [])
.controller('DirectoryCtrl', function($rootScope, $stateParams, $scope, $http, storage) {
  $scope.repo_name = $stateParams.repo_name;
  
  $scope.$watch('$viewContentLoaded', function() {
    $scope.enterDir($stateParams.repo_id, $stateParams.path);
  })
  
  $scope.enterDir = function(repo_id, dir) {
    var entry_url = $rootScope.base_url + "repos/" + repo_id + "/dir/"

    $http({
      method  : 'GET',
      url     : entry_url,
      params  : { p: dir }
    }).success(function(data) {
      // success
      console.log(data);

    }).error(function(data) {
      // error
      
    });
  }
})