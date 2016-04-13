export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'ctrl'
    })
    .state('gender',{
      url:'/gender',
      templateUrl:'app/sticker/sticker.html',
      controller:'StickerController',
      controllerAs:'ctrl'
    })
    .state('gender.select',{
      url:'/step1',
      templateUrl:'app/sticker/gender/gender-select.html',
      controller:'GenderSelectController',
      controllerAs:'select'
    })
    .state('gender.theme',{
      url:'/step2/:gender',
      controller:'ThemeSelectController',
      controllerAs:'theme',
      templateUrl:'app/sticker/theme/theme.html'
    })
    .state('gender.uploader',{
      url:'/step3/:gender/:type',
      controller:'UploaderController',
      controllerAs:'uploader',
      templateUrl:'app/sticker/uploader/uploader.html'
    })
    ;

  $urlRouterProvider.otherwise('/');
}
