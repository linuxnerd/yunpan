angular.module('yunpan.services', [])

.factory('tokenInterceptor', function($rootScope, $q, storage) {
  return {
    request: function(config) {
      // post 使用x-www-form-urlencoded传输数据
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

      // 如果存在token，在header中加入token给后台认证
      if(storage.get('user_info').token) {
        config.headers['Authorization'] = 'Token ' + storage.get('user_info').token;
      }
      return config;
    }
  }
})
.config(function($httpProvider){
  $httpProvider.interceptors.push('tokenInterceptor');
});
