export class DialogFieldController {
     public service: any;
     public dialogValue: any;
  /*@ngInject*/
  constructor(private DialogData: any) {
      
  }

  /**
   * Load service to be able to access it form the template.
   * @memberof DialogFieldController
   * @function $onInit
   */
  public $onInit(changesObj) {
    this.service = this.DialogData;
    this.service.setData(this.field);
  }
  public $onChanges(changesObj) {
    console.log('changes happened');
  }
  public changesHappened(){
      this.onUpdate({dialogFieldName: this.field.name, value:this.dialogValue});
  }
  public validateField(){
      console.log(this.service.validateField());
  }
}
export default class dialogField {
    /*@ngInject*/
  constructor() {
      console.log('inited a dialog field')
  }
  public replace: boolean = true;
  public template = require('./dialogField.html')
  public controller: any = DialogFieldController;
  public controllerAs: string = 'vm';
  public bindings: any = {
    field: '<',
    onUpdate: '&',
    options: '=?'
  //  inputDisabled: '=?',
  };
}
