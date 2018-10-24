dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON");

dojo.require("dijit.Dialog");
dojo.require("dijit.form.Textarea");

(function () {
    var Dialog = dijit.Dialog;
    var Textarea = dijit.form.Textarea;

    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON", null,
    {
        presentationProperties: null,
        property: null,
        dialog: null,
        jsonTextarea: null,

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

            dojo.style(dialog.containerNode, "overflow", "auto");

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
            var valueContainer = this._addLabelWithValue(dialogContent, "Property value: ", this._createValuePresentation());
            dojo.style(valueContainer, "flex-grow", "1");
            this._addButtons(dialogContent);

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

            return valueContainer;
        },

        _createValuePresentation: function () {
            this.jsonTextarea = new Textarea({
                value: this.property.value,
                "class": "editPropertyAsJsonValueContainer",
                "autocomplete": "off",
                "autocorrect": "off",
                "autocapitalize": "off",
                "spellcheck": "false",
                "data-gramm": "false"
            });
            this.jsonTextarea.startup();

            return this.jsonTextarea.domNode;
        },

        _addButtons: function (dialogContent) {
            var buttonsContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);

            dojo.place(this._createButton("Verify JSON", "editPropertyAsJsonButton", this._onVerifyClick), buttonsContainer);
            dojo.place(this._createButton("Cancel", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", this._onCancelClick), buttonsContainer);
            dojo.place(this._createButton("OK", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", this._onOkClick), buttonsContainer);

            return buttonsContainer;
        },

        _createButton: function (text, cssClass, onClick) {
            return dojo.create("button", {
                innerHTML: text,
                "class": cssClass,
                onclick: onClick
            });
        },

        _onVerifyClick: function () {
            alert("verify");
        },

        _onOkClick: function () {
            alert("ok");
        },

        _onCancelClick: function () {
            alert("cancel");
        }
    });
})();