angular.module("DownloadModule", [])
.controller('DownloadCtrl', 
  function($rootScope, $scope, $stateParams) {
    $scope.file_name = $stateParams.file_name;
    $scope.url = $stateParams.url;
})