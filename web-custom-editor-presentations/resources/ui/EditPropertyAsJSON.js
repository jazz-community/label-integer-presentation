dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON");

dojo.require("dijit.Dialog");

(function () {
    var Dialog = dijit.Dialog;

    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON", null,
    {
        presentationProperties: null,
        property: null,
        dialog: null,

        constructor: function (parameters) {
            this.presentationProperties = parameters.presentationProperties;
            this.property = parameters.property;
            this.dialog = this.createDialog();
        },

        openDialog: function () {
            // Show the dialog
            this.dialog.show();
        },

        createDialog: function () {
            // Set the z-index to start higher because the dialogs from Jazz also do
            Dialog._DialogLevelManager._beginZIndex = 10000;

            // Create the dialog widget
            var dialog = new Dialog({
                title: "Edit as JSON",
                content: this._createDialogContent()
            });

            // Destroy the widget in the dom when it's hidden
            dialog.onHide = function () {
                this.destroyRecursive(false);
            };

            return dialog;
        },

        _createDialogContent: function () {
            var dialogContent = dojo.create("div", {
                "class": "editPropertyAsJsonDialogContent"
            });

            this._addKeyContainer(dialogContent);
            this._addValueContainer(dialogContent);

            return dialogContent;
        },

        _addKeyContainer: function (dialogContent) {
            var keyContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);
            dojo.create("span", {
                innerHTML: "Property key: ",
                "class": "editPropertyAsJsonLabel"
            }, keyContainer);
            dojo.create("span", {
                innerHTML: this.property.key
            }, keyContainer);
        },

        _addValueContainer: function (dialogContent) {
            var valueContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);
            dojo.create("span", {
                innerHTML: "Property value: ",
                "class": "editPropertyAsJsonLabel"
            }, valueContainer);
            dojo.create("div", {
                innerHTML: this.property.value
            }, valueContainer);
        }
    });
})();