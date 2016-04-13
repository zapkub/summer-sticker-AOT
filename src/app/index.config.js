export function config ($logProvider, toastrConfig,FacebookProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);
  FacebookProvider.init('222857661436956')


}
