export function UserDataService() {
  this.data = {};
  this.gender;
  this.uploadedImage;
  this.profilePicture;
  this.getName = ()=>{
    if(this.data.name)
      return this.data.name.split(' ')[0];
    else{
      return "loading.."
    }
  }
  this.createDevData = (callback)=>{
    this.gender = 'male';
    this.uploadedImage = new Image();
    this.type = 'c';
    this.uploadedImage.onload = ()=>{
      if(callback){callback()}
    }
    this.uploadedImage.src  = 'assets/images/result/test.jpg';//'https://z-1-scontent.xx.fbcdn.net/v/t1.0-9/10369713_757735057590368_4288220530290263457_n.jpg?oh=50621fcaba6586240dace505a9f7b868&oe=57BCAEC3';
  }
}
export class MainController {
  constructor($scope,$timeout, toastr, Facebook, $state, $user, _, $stateParams,$http) {
    'ngInject';
    this.scope = $scope;
    this._ = _;
    this.user = $user;
    this.fb = Facebook;
    this.state = $state;
    this.params = $stateParams;
    this.http =$http;
    this.uiState = {
      loggedIn: false,
      loading: false
    };
    this.init();
  }
  init() {
    this.getFacebookSession(
      (res) => {
        if (res.status === 'connected') {
          this.state.go('process.gender')
        } else {

        }
      }
    );
  }
  getFacebookSession(callback) {
    this.uiState.loading = true;
    this.fb.getLoginStatus((res) => {
      this.uiState.loading = false;
      if (res.status === 'connected') {
        this.uiState.loggedIn = true;
        this.user.token = res.authResponse.accessToken;
        if (callback) {
          callback(res);
        }
      } else {
        this.uiState.loggedIn = false;
        if (this.state.$current.name != 'home') {
          this.state.go('home')
        }
        if (callback)
          callback(res)
      }
    })
  }
  loginWithFacebook() {
    this.fb.login((res) => {
      this.getFacebookSession((res) => {
        if (res.status === 'connected') {
          this.state.go('process.gender')
        } else {

        }
      });
    },{scope:'publish_actions'});
  }
  getUserProfile() {
    this.uiState.loading = true;
    this.fb.api('/me', (res) => {
      this.uiState.loading = false;
      if (res.id) {
        this.user.data = res;
        // this.user.profilePicture = `http://graph.facebook.com/${res.id}/picture?type=square`
        this.http.get(
          `https://graph.facebook.com/${res.id}?fields=picture.width(720).height(720)&access_token=${this.user.token}`
      ).then(
        (res)=>{
          this.user.profilePicture = res.data.picture.data.url;
        }
      )

      }
    });
  }
  checkUserData(callback) {
    if (!this.user.gender) {
      this.state.go('process.gender')
    } else if (!this.user.type) {
      this.state.go('process.theme')
    }else{
      if (callback){
        callback();
      }
    }

  }
  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');

  }
}
