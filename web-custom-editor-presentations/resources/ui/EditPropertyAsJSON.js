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
        error: null,

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
                "class": "editPropertyAsJsonValueContainer",
                "autocomplete": "off",
                "autocorrect": "off",
                "autocapitalize": "off",
                "spellcheck": "false",
                "data-gramm": "false"
            });
            this.jsonTextarea.startup();
            this._setTextareaValue(this.property.value);

            return this.jsonTextarea.domNode;
        },

        _addButtons: function (dialogContent) {
            var buttonsContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);

            dojo.place(this._createButton("Verify JSON", "editPropertyAsJsonButton", dojo.hitch(this, this._onVerifyClick)), buttonsContainer);
            dojo.place(this._createButton("Cancel", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", dojo.hitch(this, this._onCancelClick)), buttonsContainer);
            dojo.place(this._createButton("OK", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", dojo.hitch(this, this._onOkClick)), buttonsContainer);

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
            this._setTextareaValue(this.jsonTextarea.get("value"));
        },

        _onOkClick: function () {
            this.dialog.hide();
        },

        _onCancelClick: function () {
            this.dialog.hide();
        },

        _setTextareaValue: function (valueToSet) {
            this.jsonTextarea.set("value", this._getFormattedValue(valueToSet));

            if (this.error !== null) {
                // Handle the error
                dojo.style(this.jsonTextarea.domNode, "border-color", "red");
            } else {
                // Clear the error
                dojo.style(this.jsonTextarea.domNode, "border-color", "");
            }
        },

        _getFormattedValue: function (valueToFormat) {
            var formattedValue = "";

            try {
                formattedValue = this._formatValidJson(valueToFormat);

                // Clear the error if it gets this far
                this.error = null;
            } catch (error) {
                formattedValue = this._formatInvalidJson(valueToFormat, error);
            }

            return formattedValue;
        },

        _formatValidJson: function (jsonString) {
            return JSON.stringify(JSON.parse(jsonString), null, 2);
        },

        _formatInvalidJson: function (stringToFormat, error) {
            var errorPosition = this._getPositionFromError(error);
            this.error = {
                message: error.message,
                position: errorPosition
            };

            console.log("error: ", this.error);

            return stringToFormat;
        },

        _getPositionFromError: function (parseError) {
            var searchText = "in JSON at position ";
            var message = parseError.message;
            var indexOfSearchText = message.indexOf(searchText);

            if (indexOfSearchText > 0) {
                var stringPosition = message.slice(indexOfSearchText + searchText.length, message.length);
                var intPosition = parseInt(stringPosition);

                return isNaN(intPosition)
                    ? 0
                    : intPosition;
            }

            return 0;
        }
    });
})();