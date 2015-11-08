angular.module("DirectoryModule", [])
.controller('DirectoryCtrl', 
  function($rootScope, $stateParams, $scope, $http, storage, $ionicLoading, 
            $ionicActionSheet, $timeout, $ionicModal, $state, $cordovaImagePicker) {
  
  $scope.repo_name = $stateParams.repo_name;
  $scope.repo_id = $stateParams.repo_id;
  $scope.path = $stateParams.path;
  $scope.createInfo = {};
  $scope.createDirInfo = {};
  $scope.renameInfo = {};
  $scope.renameDirInfo = {};

  $scope.show = function() {
    $ionicLoading.show({
      template: '努力加载中...'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };


  // 上传本地图片
  // var options = {
  //   maximumImagesCount: 10,
  //   width: 800,
  //   height: 800,
  //   quality: 80
  // };

  // $cordovaImagePicker.getPictures(options).then(function (results) {
  //   for (var i = 0; i < results.length; i++) {
  //     console.log('Image URI: ' + results[i]);
  //   }
  // }, function(error) {
  //   // error getting photos
  // });

  // 初始化新建文件modal
  $ionicModal.fromTemplateUrl('create_file.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.create_file_modal = modal;
  });

  // 初始化新建文件夹modal
  $ionicModal.fromTemplateUrl('create_dir.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.create_dir_modal = modal;
  });

  // 初始化重命名文件modal
  $ionicModal.fromTemplateUrl('rename_file.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.rename_file_modal = modal;
  });

  // 初始化重命名文件夹modal
  $ionicModal.fromTemplateUrl('rename_dir.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.rename_dir_modal = modal;
  });

  // 进入文件夹请求
  $scope.enterDir = function(repo_id, dir) {
    $scope.show();
    var entry_url = $rootScope.base_url + "repos/" + repo_id + "/dir/"

    $http({
      method  : 'GET',
      url     : entry_url,
      params  : { p: dir }
    }).success(function(data) {
      // success
      console.log(data);
      $scope.dirs = data;
      $scope.hide();
    }).error(function(data) {
      // error
      $scope.hide();
    });
  }

  $scope.enterDir($scope.repo_id, $scope.path);

  // 格式化时间戳
  $scope.timeFormat = function(mtime) {
    var tempTime = new Date(mtime);
    var mytime = tempTime.getMonth()+1+'月'+tempTime.getDate()+'日';

    return mytime;
  }

  // 点击加号弹出ActionSheet
  $scope.showNewActionSheet = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '新建文件' },
        { text: '新建文件夹' }
      ],
      // destructiveText: 'Delete',
      titleText: '更多操作',
      cancelText: '取消',
      cancel: function() {
       // add cancel code..
      },
      buttonClicked: function(index) {
        switch(index) {
        case 0:
          $scope.create_file_modal.show();
          break;
        case 1:
          $scope.create_dir_modal.show();
          break;
        default:
          console.log("错误的输入：" + index);
        }
        return true;
      }
    });
  };

  // 长按一个文件弹出
  $scope.showFileActionSheet = function(file) {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '删除' },
        { text: '下载' },
        { text: '重命名' },
        { text: '复制链接到剪切板' }
      ],
      // destructiveText: 'Delete',
      titleText: '更多操作',
      cancelText: '取消',
      cancel: function() {
       // add cancel code..
      },
      buttonClicked: function(index) {
        switch(index) {
        case 0:
          $scope.deleteFile($scope.repo_id, $scope.path, file);
          break;
        case 1:
          $scope.downloadFile($scope.repo_id, $scope.path, file)
          break;
        case 2:
          $scope.currentFile = file;
          $scope.rename_file_modal.show();
          break;
        case 3:
          $scope.copyUrl2Clipboard($scope.repo_id, $scope.path, file);
          break;
        default:
          console.log("错误的输入：" + index);
        }
        return true;
      }
    });
  }

  // 长按一个文件夹弹出
  $scope.showDirectoryActionSheet = function(dir) {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '删除' },
        { text: '重命名' },
        { text: '复制链接到剪切板' }
      ],
      // destructiveText: 'Delete',
      titleText: '更多操作',
      cancelText: '取消',
      cancel: function() {
       // add cancel code..
      },
      buttonClicked: function(index) {
        switch(index) {
        case 0:
          $scope.deleteDir($scope.repo_id, $scope.path, dir);
          break;
        case 1:
          $scope.currentDir = dir;
          $scope.rename_dir_modal.show();
          break;
        default:
          console.log("错误的输入：" + index);
        }
        return true;
      }
    });
  }

  // 新建文件
  $scope.createFile = function() {
    console.log("新建文件：" + $scope.createInfo.filename);
    var create_file_url = $rootScope.base_url + 'repos/' + 
                          $scope.repo_id + '/file/?p=' +
                          $scope.path + '/' +
                          $scope.createInfo.filename;
    $http({
      method  : 'POST',
      url     : create_file_url,
      data    : $.param({operation: "create"})
    }).success(function(data) {
      // success
      console.log(data);
      $scope.getFileDetail($scope.repo_id, $scope.path, $scope.createInfo.filename);
      $scope.create_file_modal.hide();
    }).error(function(data) {
      // error
    });

  }

  // 新建文件夹
  $scope.createDir = function() {
    console.log("新建文件夹：" + $scope.createDirInfo.dirname);

    var create_directory_url = $rootScope.base_url + 'repos/' +
                               $scope.repo_id + '/dir/?p=' +
                               $scope.path + '/' +
                               $scope.createDirInfo.dirname;
    $http({
      method  : 'POST',
      url     : create_directory_url,
      data    : $.param({operation: "mkdir"})
    }).success(function(data) {
      // success
      console.log(data);
      $scope.enterDir($scope.repo_id, $scope.path);
      $scope.create_dir_modal.hide();
    }).error(function(data) {
      // error
    });
  }

  // 获取文件详情
  $scope.getFileDetail = function(repo_id, dir, filename) {
    console.log("获取文件详情：" + dir + filename);

    var get_file_detail_url = $rootScope.base_url + 'repos/' + repo_id + '/file/detail/';
    $http({
      method  : 'GET',
      url     : get_file_detail_url,
      params  : { p: dir + '/' + filename }
    }).success(function(data) {
      // success
      console.log(data);
      $scope.dirs.push(data);
    }).error(function(data) {
      // error

    });
  }

  // 删除文件请求
  $scope.deleteFile = function(repo_id, dir, file) {
    console.log("删除文件：" + dir + '/' + file.name);
    var delete_file_url = $rootScope.base_url + 'repos/' + repo_id + '/file/';
    $http({
      method  : 'DELETE',
      url     : delete_file_url,
      params  : { p: dir + '/' + file.name }
    }).success(function(data) {
      // success
      console.log(data);

      // 删除双向绑定的数组内容
      for (var i = 0; i < $scope.dirs.length; i++) {
        if($scope.dirs[i] == file) {
          $scope.dirs.splice(i, 1);
        }
      }

    }).error(function(data) {
      // error
    });
  }

  // 删除文件夹请求
  $scope.deleteDir = function(repo_id, dir, item) {
    console.log("删除文件文件夹：" + dir + '/' + item.name);
    var delete_dir_url = $rootScope.base_url + 'repos/' + repo_id + '/dir/';
    $http({
      method  : 'DELETE',
      url     : delete_dir_url,
      params  : { p: dir + '/' + item.name }
    }).success(function(data) {
      // success
      console.log(data);

      // 删除双向绑定的数组内容
      for (var i = 0; i < $scope.dirs.length; i++) {
        if($scope.dirs[i] == item) {
          $scope.dirs.splice(i, 1);
        }
      }
    }).error(function(data) {
      // error
    });
  }

  // 重命名文件请求
  $scope.renameFile = function() {
    console.log("重命名文件：" + $scope.currentFile.name);
    var rename_file_url = $rootScope.base_url + 'repos/' + $scope.repo_id + '/file/';

    $http({
      method  : 'POST',
      url     : rename_file_url,
      params  : { p: $scope.path + '/' + $scope.currentFile.name },
      data    : $.param({
                  operation: "rename",
                  newname: $scope.renameInfo.filename
                })
    }).success(function(data) {
      // success
      console.log(data);
      // 请求成功但是不会返回成功
      // 重新请求
      $scope.enterDir($scope.repo_id, $scope.path);
      $scope.rename_file_modal.hide();
    }).error(function(data, status) {
      // error
      // TODO：由于重命名成功也会返回301，所以按照失败处理
      $scope.enterDir($scope.repo_id, $scope.path);
      $scope.rename_file_modal.hide();
    });
  }

  // 重命名文件夹请求
  $scope.renameDir = function() {
    console.log("重命名文件夹：" + $scope.currentDir.name);
    var rename_dir_url = $rootScope.base_url + 'repos/' + $scope.repo_id + '/file/';

    $http({
      method  : 'POST',
      url     : rename_dir_url,
      params  : { p: $scope.path + '/' + $scope.currentDir.name },
      data    : $.param({
                  operation: "rename",
                  newname: $scope.renameDirInfo.dirname
                })
    }).success(function(data) {
      // success
      console.log(data);
      // 请求成功但是不会返回成功
      // 重新请求
      $scope.enterDir($scope.repo_id, $scope.path);
      $scope.rename_file_modal.hide();
    }).error(function(data, status) {
      // error
      // TODO：由于重命名成功也会返回301，所以按照失败处理
      $scope.enterDir($scope.repo_id, $scope.path);
      $scope.rename_file_modal.hide();
    });
  }

  // 下载文件请求
  $scope.downloadFile = function(repo_id, dir, file) {
    console.log("下载文件：" + file.name)
    var download_file_url = $rootScope.base_url + 'repos/' + repo_id + '/file/';

    $http({
      method  : 'GET',
      url     : download_file_url,
      params  : { p: dir + '/' + file.name }
    }).success(function(data) {
      // success
      console.log(data);
      $state.go("tab.repo-download", {url: data, file_name: file.name});
    }).error(function(data) {
      // error

    });
  }

  // 分享链接复制到剪切板
  $scope.copyUrl2Clipboard = function(repo_id, dir, file) {
    console.log("生成分享链接并复制：" + file.name);

    var create_shared_link_url = $rootScope.base_url + 'repos/' +
                                 repo_id + '/file/shared-link/';

    $http({
      method : 'PUT',
      url    : create_shared_link_url,
      data   : $.param({ p: dir + '/' + file.name })
    }).success(function(data, status, headers, config) {
      // success
      console.log(headers('Location'));
    }).error(function(data) {
      // error

    });
  }

})
