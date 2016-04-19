export function config ($logProvider, toastrConfig,FacebookProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);
  let dev = false;
  if(dev){
    FacebookProvider.init('222857661436956')

  }else{
    FacebookProvider.init('667832946653119')
  }


}
