export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'ctrl'
    })
    .state('process',{
      url:'/process',
      templateUrl:'app/sticker/sticker.html',
      controller:'StickerController',
      controllerAs:'ctrl'
    })
    .state('process.gender',{
      url:'/step1',
      templateUrl:'app/sticker/gender/gender-select.html',
      controller:'GenderSelectController',
      controllerAs:'select'
    })
    .state('process.theme',{
      url:'/step2/:gender',
      controller:'ThemeSelectController',
      controllerAs:'theme',
      templateUrl:'app/sticker/theme/theme.html'
    })
    .state('process.uploader',{
      url:'/step3/:gender/:type',
      controller:'UploaderController',
      controllerAs:'uploader',
      templateUrl:'app/sticker/uploader/uploader.html'
    })
    .state('process.confirm',{
      url:'/step4/confirm',
      controller:'ResultConfirmController',
      templateUrl:'app/sticker/result/confirm.html',
      controllerAs:'result'
    })
    .state('thankyou',{
      url:'/thankyou',
      templateUrl:'app/sticker/result/shared.html',
      controller:'ThankyouController',
      controllerAs:'ctrl'
    })
    ;

  $urlRouterProvider.otherwise('/');
}
