import {
  StickerController
} from '../sticker.controller';
import stickers from '../stickerThemeData';
export class ResultController extends StickerController {
  init() {

  }
}
export class ResultConfirmController extends StickerController {
  init() {
    this.dev = true;
    this.caman = Caman;
    this.scope.brightness = 1;
    if (this.dev) {
      this.user.createDevData(() => {
        this.checkUserData(() => {
          this.sticker = stickers[this.user.gender][this.user.type];
          let that = this;
          angular.element('#brightness').change(this.drawResult.bind(this))
          this.caman.Event.listen("renderFinished", () => {
            that.drawTheme();
          })
          this.drawResult();
          this.scope.$apply();
        });
      });
    } else {
      this.checkUserData(() => {
        console.log(stickers[this.user.gender][this.user.type])
        this.sticker = stickers[this.user.gender][this.user.type];
        let that = this;
        angular.element('#brightness').change(this.drawResult.bind(this))
        // this.caman.Event.listen("renderFinished", () => {
        //
        // })
        this.drawResult();
      });
    }

  }
  drawUserImage() {
    let that = this;
    // this.caman("#canvas", function() {
    //   this.revert(false);
    //   this.exposure(that.scope.brightness).render();
    //   this.brightness(that.scope.brightness).render();
    // });
    that.drawTheme();
  }
  drawTheme() {
    let canvas = angular.element("#canvas")[0];
    let context = canvas.getContext('2d');
    let themeImage = new Image;
    console.log(this.sticker);
    themeImage.onload = () => {
      context.save();

      if(this.dev){
        context.globalAlpha = 0.8;
      }
      context.drawImage(themeImage, 0, 0, canvas.width, canvas.height);
      context.restore();
      this.uiState.showResult = true;
      this.scope.$apply();
    }
    themeImage.src = 'assets/images/result/' + this.sticker.fileName;
  }
  drawResult() {
    this.uiState.showResult = false;
    /* prepare resource */
    let userImage = this.user.uploadedImage;
    let canvas = angular.element("#canvas")[0];
    canvas.width = 960;
    canvas.height = 960;
    let context = canvas.getContext('2d');
    /* clear Rect first */
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    if(this.sticker.rotate){
      context.rotate(this.sticker.rotate * Math.PI/180);
    }
    context.drawImage(userImage, 145 * 2, 85 * 2, 215 * 2, 277 * 2, this.sticker.maskPos.x, this.sticker.maskPos.y, 215 * this.sticker.scale, 277 * this.sticker.scale);
    context.restore();
    let that = this;
    this.drawUserImage();

  }
  shareToFB() {

    this.uiState.shareDialog = true;

  }
  sendImageToFB(){
    this.uiState.sharing = true;
      PostImageToFacebook(this.user.token,this.uiState.caption,function(done){
        this.uiState.sharing = false;
        this.uiState.shareDialog = false;
        if(done){
          this.state.go("thankyou")
        }
        this.scope.$apply();
      }.bind(this));
  }
}

export class ThankyouController{
  constructor($user,$state){
      'ngInject';
      this.user = $user;
      console.log(this.user);
      if(!$user.data.name){
        // $state.go('home');
      }
  }
}



/*
  send image data to FB
  snippet from Stackoverflow
*/

function PostImageToFacebook(authToken,caption,callback) {
  var canvas = document.getElementById("canvas");
  var imageData = canvas.toDataURL("image/png");
  try {
    var blob = dataURItoBlob(imageData);
  } catch (e) {
    console.log(e);
  }
  var fd = new FormData();
  fd.append("access_token", authToken);
  fd.append("source", blob);
  fd.append("message", caption + '\n ทำสติกเกอร์หน้ามันส์ๆ คลายร้อนแบบนี้ได้ที่นี่ \nhttp://svmedia.biz/songkran/ \n#sawasdeethailand #sawasdeesticker');
  try {
    $.ajax({
      url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
      type: "POST",
      data: fd,
      processData: false,
      contentType: false,
      cache: false,
      success: function(data) {
        console.log("success " + data);
      },
      error: function(shr, status, data) {
        console.log("error " + data + " Status " + shr.status);
        callback(false);
      },
      complete: function() {
        console.log("Posted to facebook");
        callback(true);
      }
    });

  } catch (e) {
    console.log(e);
  }
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: 'image/png'
  });
}
