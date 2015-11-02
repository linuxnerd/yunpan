angular.module("RepoModule", [])
.controller('RepoCtrl', function($rootScope, $scope, $http, storage) {
  $scope.repos = [];

  $scope.refreshRepo = function() {
    var refresh_url = $rootScope.base_url + "repos/"

    $http({
      method  : 'GET',
      url     : refresh_url,
    }).success(function(data) {
      // success
      console.log(data);
      var owner = "";
      var owner_change_times = 0;
      for(var i = 0; i < data.length; i++) {
        if (data[i].owner != owner) {
          var myRepo;
          if (data[i].owner == storage.get('user_info').username) {
            myRepo = "我的资料库"
          } else {
            myRepo = data[i].owner
          }

          $scope.repos.push({
            owner: myRepo,
            names: []
          });
          if (owner != "") { owner_change_times++; }
          $scope.repos[owner_change_times].names.push(data[i]);
          owner = data[i].owner;
        } else {
          if ($scope.repos[owner_change_times] != undefined) {
            $scope.repos[owner_change_times].names.push(data[i]);
          }
        }
      }

    }).error(function(data) {
      // error
      
    });
  }

  $scope.refreshRepo();

})