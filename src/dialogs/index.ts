// import services from './services';
import components from './components';
import * as angular from 'angular';

module dialogs {
  export const app = angular.module('miqStaticAssets.dialogs',[]);
  //services(app);
  components(app);
}
