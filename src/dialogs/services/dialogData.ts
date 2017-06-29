import * as _ from 'lodash';

export default class DialogDataService {
  public data: any = {};
  constructor() {
      console.log('inited data service')
  }
  /**
   * Store data passed in parameter.
   * @memberof DialogDataService
   * @function setData
   * @param {any} nested object containing data of the dialog
   */
  public setData(data: any) {
      this.data = data;
      // console.log(data);
      if (this.data.type === 'DialogFieldDropDownList') {
          this.updateFieldSortOrder();
      }
      this.setDefaultValue();
  }
  private updateFieldSortOrder() { 
    const values:any = this.data.values;
    var sortDirection = this.data.sort_order;
    var sortByValue = 0; // These are constants that are used to refer to array positions
    var sortByDescription = 1; // These are constants that are used to refer to array positions
    var sortBy = (this.data.options.sort_by === 'value' ? sortByValue : sortByDescription);
    this.data.values = values.sort((option1, option2) => {
      let trueValue: number = -1;
      let falseValue: number = 1;
      if (sortDirection !== 'ascending') {
        trueValue = 1;
        falseValue = -1;
      }

      return option2[sortBy] > option1[sortBy]  ? trueValue : falseValue;
    });

    return this.data.values;
  }
  private setDefaultValue():any {
    let defaultValue = '';
        if (_.isObject(this.data.values)) {
      // dialogField.values = newDialogField.values;
//      if (_.isSet(newDialogField.default_value) && newDialogField.default_value !== null) {
  //      dialogField.default_value = newDialogField.default_value;
    //  } else {
        this.data.default_value = this.data.values[0][0];
      }
     else {
      if (this.data.type === 'DialogFieldDateControl' || this.data.type === 'DialogFieldDateTimeControl') {
        this.data.default_value = new Date(this.data.values);
      } else {
        if (_.isEmpty(this.data.default_value) || this.data.type === 'DialogFieldCheckBox') {
          this.data.default_value = this.data.values;
        }
      }
    }
    if (parseInt(this.data.default_value, 10)) {
      this.data.default_value = parseInt(this.data.default_value, 10);
    }
 
    return this.data.default_value;
  }
  
  public validateField(): any {
      const fieldValue = this.data.default_value;
      if (this.data.required) {
          if (fieldValue === '') {
              this.data.fieldValidation = false;
              this.data.errorMessage = __('This field is required');

              return false;
          }
          if (this.data.validator_type === 'regex') {
              const regex = new RegExp(`${this.data.validator_rule}`);
              const regexValidates = regex.test(fieldValue);
              this.data.fieldValidation = regexValidates;
              this.data.errorMessage = __("Entered text does not match required format.");

              return regexValidates;
          }
      }

      return true;
  }

}

/**
export function AutoRefreshFactory() {
  const callbacks = [];
  const service = {
    triggerAutoRefresh: triggerAutoRefresh,
    listenForAutoRefresh: listenForAutoRefresh,
    callbacks: callbacks,
  };

  function triggerAutoRefresh(data) {
    callbacks.forEach((callback) => {
      callback(data);
    });
  }

  function listenForAutoRefresh(allDialogFields, autoRefreshableDialogFields, url, resourceId, refreshCallback) {
    const nextFieldToRefresh = function(field, data, currentIndex) {
      return (field.auto_refresh === true && data.initializingIndex !== currentIndex && data.currentIndex < currentIndex);
    };

    const listenerFunction = function(data) {
      const autoRefreshOptions = {
        initializingIndex: data.initializingIndex,
      };

      const dialogFieldToRefresh = autoRefreshableDialogFields.filter(function(field, currentIndex) {
        if (nextFieldToRefresh(field, data, currentIndex)) {
          return field;
        }
      });

      if (dialogFieldToRefresh.length > 0) {
        dialogFieldToRefresh[0].beingRefreshed = true;
        dialogFieldToRefresh[0].triggerOverride = true;
        autoRefreshOptions.currentIndex = dialogFieldToRefresh[0].refreshableFieldIndex;
        refreshCallback(allDialogFields, dialogFieldToRefresh[0], url, resourceId, autoRefreshOptions);
      }
    };

    callbacks.push(listenerFunction);
  }

  return service;
}

 */
/*
export function DialogFieldRefreshFactory(CollectionsApi, EventNotifications, AutoRefresh) {
  var service = {
    refreshSingleDialogField: refreshSingleDialogField,
    setupDialogData: setupDialogData,
    triggerAutoRefresh: triggerAutoRefresh,
  };

  return service;

  function refreshSingleDialogField(allDialogFields, dialogField, url, resourceId, autoRefreshOptions) {
    function refreshSuccess(result) {
      var resultObj = result.result[dialogField.name];

      updateAttributesForDialogField(dialogField, resultObj);
      if (dialogField.type === 'DialogFieldDropDownList') {
        updateDialogSortOrder(dialogField);
      }

      triggerAutoRefresh(dialogField, false, autoRefreshOptions);
    }

    function refreshFailure(result) {
      EventNotifications.error('There was an error refreshing this dialog: ' + result);
    }

    dialogField.beingRefreshed = true;

    return fetchDialogFieldInfo(allDialogFields, [dialogField.name], url, resourceId, refreshSuccess, refreshFailure);
  }



  function setupDialogData(dialogs, allDialogFields, autoRefreshableDialogFields) {
    angular.forEach(dialogs, function(dialog) {
      angular.forEach(dialog.dialog_tabs, function(dialogTab) {
        angular.forEach(dialogTab.dialog_groups, function(dialogGroup) {
          angular.forEach(dialogGroup.dialog_fields, function(dialogField) {
            allDialogFields.push(dialogField);

            selectDefaultValue(dialogField, dialogField);

            if (dialogField.auto_refresh === true || dialogField.trigger_auto_refresh === true) {
              dialogField.refreshableFieldIndex = autoRefreshableDialogFields.push(dialogField) - 1;
            }

            dialogField.triggerAutoRefresh = function() {
              triggerAutoRefresh(dialogField, true);
            };
          });
        });
      });
    });
  }

  function triggerAutoRefresh(dialogField, initialTrigger, autoRefreshOptions) {
    if (dialogField.trigger_auto_refresh === true || dialogField.triggerOverride === true) {
      const triggerOptions = {};

      if (initialTrigger === true) {
        triggerOptions.initializingIndex = dialogField.refreshableFieldIndex;
        triggerOptions.currentIndex = 0;
      } else {
        triggerOptions.initializingIndex = autoRefreshOptions.initializingIndex;
        triggerOptions.currentIndex = autoRefreshOptions.currentIndex;
      }

      AutoRefresh.triggerAutoRefresh(triggerOptions);
    }
  }

  // Private

  function updateAttributesForDialogField(dialogField, newDialogField) {
    copyDynamicAttributes(dialogField, newDialogField);
    selectDefaultValue(dialogField, newDialogField);

    dialogField.beingRefreshed = false;

    function copyDynamicAttributes(currentDialogField, newDialogField) {
      currentDialogField.data_type = newDialogField.data_type;
      currentDialogField.options = newDialogField.options;
      currentDialogField.read_only = newDialogField.read_only;
      currentDialogField.required = newDialogField.required;
      currentDialogField.visible = newDialogField.visible;
    }
  }

  
  }

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

  function isBlank(value) {
    return angular.isUndefined(value)
      || value === null
      || value === '';
  }
}
*/
