export class DialogController {
}
export default class dialog {
  public replace: boolean = true;
  public template = '';
  public controller: any = DialogController;
  public controllerAs: string = 'vm';
  public bindings: any = {
    toolbarViews: '<',
    toolbarItems: '<',
    onViewClick: '&'
  };
}
