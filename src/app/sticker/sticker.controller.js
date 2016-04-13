import {
  MainController
} from '../main/main.controller.js';

export class StickerController extends MainController {
  init() {
    this.stepData = [{
      id: 1,
      name: 'เลือกเพศของคุณ',
      state: 'gender.select'
    }, {
      id: 2,
      name: 'เลือก sticker',
      state: 'gender.theme'
    }, {
      id: 3,
      name: 'อัพโหลดภาพใบหน้าของคุณ',
      state: 'gender.uploader'
    }, {
      id: 4,
      name: 'แชร์กันเลย'
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
    this.state.go(this.stepData[index].state,{gender:this.user.gender,type:this.user.type})
  }
}
export class GenderSelectController extends MainController {
  init() {

  }
  selectGender(gender) {
    this.user.gender = gender;
    this.state.go('gender.theme')
  }
}
export class ThemeSelectController extends MainController {
  init() {
    if (this.params.gender) {
      this.user.gender = this.params.gender;
    }
  }
  selectTheme(type) {
    this.user.type = type;
    this.state.go('gender.uploader',{gender:this.user.gender,type:this.user.type})
  }
}
export class UploaderController extends MainController {
  init() {

  }
}
