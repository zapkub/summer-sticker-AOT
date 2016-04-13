export function UserDataService (){
  this.data =  {};
  this.gender = 'male';
}
export class MainController {
  constructor ($timeout, toastr,Facebook,$state,$user,_,$stateParams) {
    'ngInject';
    this._ = _;
    this.user = $user;
    this.fb = Facebook;
    this.state = $state;
    this.params = $stateParams;
    this.uiState = { loggedIn : false ,loading:false };
    this.init();
  }
  init(){
    this.getFacebookSession(
      (res)=>{
        if(res.status === 'connected'){
          this.state.go('gender.select')
        }else{

        }
      }
    );
  }
  getFacebookSession (callback){
    this.uiState.loading = true;
    this.fb.getLoginStatus((res)=>{
      this.uiState.loading = false;
      if(res.status === 'connected'){
        this.uiState.loggedIn = true;
        if(callback){
          callback(res);
        }
      }else{
        this.uiState.loggedIn = false;
        if(this.state.$current.name != 'home'){
          this.state.go('home')
        }
        if(callback)
          callback(res)
      }
    })
  }
  loginWithFacebook(){
      this.fb.login((res)=>{
        this.getFacebookSession((res)=>{
          if(res.status === 'connected'){
            this.state.go('gender.select')
          }else{

          }
        });
      });
  }
  getUserProfile(){
    this.uiState.loading = true;
    this.fb.api('/me',(res)=>{
      this.uiState.loading = false;
      if(res.id){
          this.user.data = res;
          this.user.profilePicture = `http://graph.facebook.com/100000616414605/picture?type=square`
      }
    });
  }

  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');

  }
}
