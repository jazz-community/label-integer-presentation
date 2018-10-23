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

            this._addLabelWithValue(dialogContent, "Property key: ", dojo.create("span", {
                innerHTML: this.property.key
            }));
            this._addLabelWithValue(dialogContent, "Property value: ", this._createValuePresentation());

            return dialogContent;
        },

        _addLabelWithValue: function (dialogContent, labelText, valueNode) {
            var valueContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);
            dojo.create("span", {
                innerHTML: labelText,
                "class": "editPropertyAsJsonLabel"
            }, valueContainer);
            dojo.place(valueNode, valueContainer);
        },

        _createValuePresentation: function () {
            var valuePresentationNode = dojo.create("textarea", {
                value: this.property.value,
                "class": "editPropertyAsJsonValueContainer",
                "autocomplete": "off",
                "autocorrect": "off",
                "autocapitalize": "off",
                "spellcheck": "false",
                "data-gramm": "false"
            });

            return valuePresentationNode;
        }
    });
})();