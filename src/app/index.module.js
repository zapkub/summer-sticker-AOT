/* global malarkey:false, moment:false */

import { config } from './index.config';
import  _  from 'lodash';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController,UserDataService } from './main/main.controller';
import { StickerController , GenderSelectController ,ThemeSelectController , UploaderController} from './sticker/sticker.controller';
import { HeaderDirective } from './components/header.directive';
import { ResultController , ResultConfirmController,ThankyouController } from './sticker/result/result.controller';
angular.module('summerStickerWebapp', ['facebook','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr','ngFileUpload'])
  .constant('moment', moment)
  .config(config)
  .constant('_',_)
  .config(routerConfig)
  .run(runBlock)
  .service('$user',UserDataService)
  .directive('header',HeaderDirective)
  .controller('MainController', MainController)
  .controller('StickerController',StickerController)
  .controller('GenderSelectController',GenderSelectController)
  .controller('ThemeSelectController',ThemeSelectController)
  .controller('UploaderController',UploaderController)
  .controller('ResultController',ResultController)
  .controller('ResultConfirmController',ResultConfirmController)
  .controller('ThankyouController',ThankyouController)
