import {
  MainController
} from '../main/main.controller.js';

export class StickerController extends MainController {
  init() {
    this.stepData = [{
      id: 1,
      name: 'เลือกเพศของคุณ',
      state: 'process.gender'
    }, {
      id: 2,
      name: 'เลือก sticker',
      state: 'process.theme'
    }, {
      id: 3,
      name: 'อัพโหลดภาพใบหน้าของคุณ',
      state: 'process.uploader'
    }, {
      id: 4,
      name: 'แชร์กันเลย',
      state:'process.confirm'
    }]
    this.getFacebookSession(() => {
      this.getUserProfile();
    })
  }
  getStep() {
    let step = this._.where(this.stepData, {
      state: this.state.$current.name
    })[0];
    if (!step) {
      return {}
    }
    let indexOf = this._.indexOf(this.stepData, step);
    step.index = indexOf;
    return step;
  }
  goToStep(index) {
    this.state.go(this.stepData[index].state, {
      gender: this.user.gender,
      type: this.user.type
    })
  }
}
export class GenderSelectController extends MainController {
  init() {

  }
  selectGender(gender) {
    this.user.gender = gender;
    this.state.go('process.theme')
  }
}
export class ThemeSelectController extends MainController {
  init() {
    if (this.params.gender) {
      this.user.gender = this.params.gender;
    }

    this.checkUserData();

  }
  selectTheme(type) {
    this.user.type = type;
    this.state.go('process.uploader', {
      gender: this.user.gender,
      type: this.user.type
    })
  }
}
export class UploaderController extends MainController {
  init() {
    if (this.params.gender && this.params.type) {
      this.user.gender = this.params.gender;
      this.user.type = this.params.type;
    }
    this.uiState.imagePosition = {
      x: 0,
      y: 0
    }
    this.uiState.dragPosition = {
      x: 0,
      y: 0
    }
    this.uiState.showUploadPicture = false;
    this.checkUserData();
    // this.demoImage();
    this.scope.zoom = 55;
    this.scope.$watch('zoom', () => {
      this.draw();
    })
    if(this.user.uploadedImage){
      angular.element('#user-picture').append(this.user.uploadedImage);
    }
  }
  uploadFile(file) {

    try {
      if (file) {
        var url = URL.createObjectURL(file);
        this.prepareImage(url);
        this.uiState.flipImage = false;
        this.uiState.showUploadPicture = true;
      }

    } catch (e) {
      console.log(e);
    }
  }
  uploadWebcam() {
    Webcam.set({flip_horiz:true})
    this.uiState.showWebcam = true;
    this.uiState.showUploadPicture = true;
    this.timeout(()=>{
      Webcam.attach('#webcam');
    },1000)
  }
  captureImageFromWebcam() {
    let that = this;
    Webcam.snap(function(dataUri, canvas, context){
      // this.uiState.flipImage = true;
      that.prepareImage(dataUri);
      Webcam.reset();
      that.uiState.showWebcam = false;
      this.scope.$applyAsync();
    }.bind(this))
  }
  reset(){
    delete this.user.uploadedImage;
    angular.element('#user-picture').empty();
  }

  goToResult(){
    this.state.go('process.confirm');
  }

/* uploader part */

  demoImage() {
    this.user.uploadedImage = new Image();
    this.user.uploadedImage.setAttribute('crossOrigin', 'anonymous');
    this.user.uploadedImage.src  = 'https://z-1-scontent.xx.fbcdn.net/v/t1.0-9/10369713_757735057590368_4288220530290263457_n.jpg?oh=50621fcaba6586240dace505a9f7b868&oe=57BCAEC3';
    angular.element('#user-picture').append(this.user.uploadedImage);
    // this.prepareImage('')
  }
  startAdjustPostition($event) {
    let e = $event || window.event;

    var target = e.target || e.srcElement,
        rect = target.getBoundingClientRect();
    $event.offsetX = e.clientX - rect.left,
    $event.offsetY = e.clientY - rect.top;
    this.uiState.adjusting = true;
    this.uiState.dragPosition = {
      x: $event.offsetX,
      y: $event.offsetY
    }

  }
  adjustPosition($event) {
    if (this.uiState.adjusting) {
      let e = $event || window.event;

      var target = e.target || e.srcElement,
          rect = target.getBoundingClientRect();
      $event.offsetX = e.clientX - rect.left,
      $event.offsetY = e.clientY - rect.top;

      // console.log($event.offsetX)
      let x = $event.offsetX;
      let y = $event.offsetY;

      let deltaX = this.uiState.dragPosition.x - x;
      let deltaY = this.uiState.dragPosition.y - y;


      if(this.uiState.flipImage){
        this.uiState.imagePosition.x += deltaX;
      }else{
        this.uiState.imagePosition.x -= deltaX;
      }
      this.uiState.imagePosition.y -= deltaY;
      this.uiState.dragPosition = {
        x: $event.offsetX,
        y: $event.offsetY
      }
      this.draw();
    }

  }
  endAdjustPosition() {
    this.uiState.adjusting = false;
  }
  prepareImage(url) {
    var img = new Image();
    // img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      this.userImage = img;
      this.uiState.imagePosition = {
        x: 0,//960/2 - this.userImage.width /2 ,
        y: 0//this.userImage.height /2 - 960/2,
      }
      this.draw();
    }
    img.src = url
  }

  draw() {
    var canvas = angular.element('#mask-canvas')[0];
    canvas.width = 960;
    canvas.height = 960;
    canvas.style.width = "480px";
    var context = canvas.getContext('2d');
    if (this.userImage) {

      var imageWidth;
      if(this.userImage.width < this.userImage.height){
        imageWidth = this.userImage.width;
      }else{
        imageWidth = this.userImage.height;
      }

      var srcWidth = imageWidth * (this.scope.zoom / 20);
      var srcHeight = srcWidth;
      var deltaX = imageWidth - srcWidth ;

      //clear context
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      //draw Upload images
      context.save();
      let srcX = this.uiState.imagePosition.x
      let srcY = this.uiState.imagePosition.y
      // if(srcX<1){
      //   srcX = 1;
      // }
      // if(srcY<1){
      //   srcY = 1;
      // }
      // if(srcWidth > this.userImage.width){
      //   srcWidth = this.userImage.width
      // }
      // if(srcHeight > this.userImage.height){
      //   srcHeight = this.userImage.hegiht;
      // }

      // console.log(`src: ${srcX} ${srcY} width: ${this.userImage.width} ${this.userImage.height} ${srcWidth}`);

      if(this.uiState.flipImage){
        context.scale(-1,1);
        context.drawImage(this.userImage, (this.uiState.imagePosition.x) - deltaX / 2, this.uiState.imagePosition.y - deltaX / 2, srcWidth, srcHeight, -500, 0, canvas.width, canvas.height);
      }else{

        context.drawImage(this.userImage, 0, 0, this.userImage.width, this.userImage.height, srcX, srcY, srcWidth, this.userImage.height/this.userImage.width * srcWidth);
      }
      context.restore();
    }
  }
  prepareResult(){
    this.uiState.showUploadPicture = false;
    let canvas = angular.element('#mask-canvas')[0];
    let context = canvas.getContext('2d');
    this.user.uploadedImage = new Image;
    this.user.uploadedImage.src = canvas.toDataURL();
    angular.element('#user-picture').empty();
    angular.element('#user-picture').append(this.user.uploadedImage);
  }
  // processResult(){
  //     let canvas = angular.element('#mask-canvas')[0];
  //     let context = canvas.getContext('2d');
  //     let userImage = new Image;
  //     let themeImage = angular.element('#selectedTheme')[0];
  //     userImage.onload = ()=>{
  //         context.clearRect(0,0,canvas.width,canvas.height);
  //         context.drawImage(userImage,0,0);
  //         context.drawImage(themeImage,0,0,500,500);
  //
  //     }
  //     userImage.src = canvas.toDataURL();
  // }
}
