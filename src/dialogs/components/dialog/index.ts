import Dialog from './dialog';

export default (module: ng.IModule) => {
  module.component('dialog', new Dialog);
};
