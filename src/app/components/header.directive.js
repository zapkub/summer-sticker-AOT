export function HeaderDirective ($user){
  'ngInject';
  let directive = {
    restrict : "E",
    templateUrl:'app/components/header.html',
    scope:{
      loading:'='
    },
    link:function(scope,elem,attr){
      scope.user = $user;
    }
  }
  return directive;
}
