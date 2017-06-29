
import * as _ from 'lodash';

export class DialogController {
    public dialogFields: any;
    public refreshableFields: Array<string>;
    public dialogValues: any;
constructor(){
       const vm = this
       vm.dialogFields = {};
       vm.refreshableFields = [];
       vm.dialogValues = [];
       for (var dialogTabs of this.dialog.dialog_tabs){
            for (var dialogGroup of dialogTabs.dialog_groups){
                for (var dialogField of dialogGroup.dialog_fields) {
                    vm.dialogFields[dialogField.name] = dialogField; // at this point all dialog fields are stored in a object keyed by field name
                    if (dialogField.auto_refresh === true || dialogField.trigger_auto_refresh === true) {
                        vm.refreshableFields.push(dialogField.name);
                    }
                }
            }
       }
    }

    public updateDialogField(dialogFieldName, value) {
        const refreshable = _.indexOf(this.refreshableFields,dialogFieldName);
        this.dialogFields[dialogFieldName].default_value = value;

        if (refreshable > -1) {
            this.refreshField({ field: this.dialogFields[dialogFieldName] }).then((data) => {
                this.dialogFields[dialogFieldName] = this.updateDialogFieldData(dialogFieldName, data);
                this.updateRefreshableFields(dialogFieldName);
            });
        }
    }
    public updateRefreshableFields(triggerFieldName){
       const fieldsToRefresh = _.without(this.refreshableFields, triggerFieldName);
       fieldsToRefresh.forEach((field) => {
            this.refreshField({ field: this.dialogFields[field] }).then((data) => {
                this.dialogFields[field] = this.updateDialogFieldData(field, data);
            });
       });
    }

    private updateDialogFieldData(dialogName, data) {
        const dialogField = this.dialogFields[dialogName];
        dialogField.data_type = data.data_type;
        dialogField.options = data.options;
        dialogField.read_only = data.read_only;
        dialogField.required = data.required;
        dialogField.visible = data.visible;

        return dialogField;
    }
}
export default class dialog {
  public replace: boolean = true;
  public template = require('./dialog.html');
  public controller: any = DialogController;
  public controllerAs: string = 'vm';
  public bindings: any = {
    dialog: '=',
    options: '=?',
    refreshField: '&'
  //  inputDisabled: '=?',
  };
}

/*

function fetchDialogFieldInfo(allDialogFields, dialogFieldsToFetch, url, resourceId, successCallback, failureCallback) {
    return CollectionsApi.post(
      url,
      resourceId,
      {},
      angular.toJson({
        action: 'refresh_dialog_fields',
        resource: {
          dialog_fields: dialogFieldInfoToSend(allDialogFields),
          fields: dialogFieldsToFetch,
        },
      })
    ).then(successCallback, failureCallback);
  }

  function dialogFieldInfoToSend(allDialogFields) {
    var fieldValues = {};
    angular.forEach(allDialogFields, function(dialogField) {
      fieldValues[dialogField.name] = dialogField.default_value;
    });

    return fieldValues;
  }





import './_dialog-content.sass';
import templateUrl from './dialog-content.html';

export const DialogContentComponent = {
  bindings: {
    dialog: '=',
    options: '=?',
    inputDisabled: '=?',
  },
  controller: DialogContentController,
  controllerAs: 'vm',
  templateUrl,
};

function DialogContentController(API_BASE, lodash) {
  var vm = this;
  vm.$onInit = activate;
  vm.parsedOptions = {};
  vm.dateOptions = {
    initDate: new Date(),
    minDate: new Date(),
    showWeeks: false,
  };
  vm.supportedDialog = true;
  vm.API_BASE = API_BASE;

  function activate() {
    if (vm.options) {
      angular.forEach(vm.options, parseOptions);
    }
    if (angular.isDefined(vm.dialog) && angular.isArray(vm.dialog.dialog_tabs)) {
      vm.dialog.dialog_tabs.forEach(iterateBGroups);
    }
  }

  // Private functions
  function parseOptions(value, key) {
    vm.parsedOptions[key.replace('dialog_', '')] = value;
  }

  function iterateBGroups(item) {
    item.dialog_groups.forEach(iterateBFields);
  }

  function iterateBFields(item) {
    if (lodash.result(lodash.find(item.dialog_fields, {'dynamic': true}), 'name')
      || lodash.result(lodash.find(item.dialog_fields, {'type': 'DialogFieldTagControl'}), 'name')) {
      vm.supportedDialog = false;
    }
    if (Object.keys(vm.parsedOptions).length > 0) {
      item.dialog_fields.forEach(iterateDialogFields);
    }
  }

  function iterateDialogFields(item) {
    item.default_value = vm.parsedOptions[item.name];
  }
}
*/
