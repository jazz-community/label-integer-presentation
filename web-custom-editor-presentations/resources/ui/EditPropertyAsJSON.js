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
            var self = this;

            // Show the dialog
            this.dialog.show().then(function () {
                self._setTextareaValue(self.property.value);
            })
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
                intermediateChanges: true,
                "class": "editPropertyAsJsonValueContainer",
                "autocomplete": "off",
                "autocorrect": "off",
                "autocapitalize": "off",
                "spellcheck": "false",
                "data-gramm": "false"
            });
            this.jsonTextarea.startup();

            dojo.connect(this.jsonTextarea, "onChange", dojo.hitch(this, this._onChangeEvent));

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

        _onChangeEvent: function (newValue) {
            this._clearErrorMessage();
        },

        _setTextareaValue: function (valueToSet) {
            this.jsonTextarea.set("value", this._getFormattedValue(valueToSet));
        },

        _getFormattedValue: function (valueToFormat) {
            var formattedValue = "";

            try {
                formattedValue = this._formatValidJson(valueToFormat);

                // Clear the error if it gets this far
                this._clearError();
            } catch (error) {
                formattedValue = this._formatInvalidJson(valueToFormat);
                this._setError(error);
            }

            return formattedValue;
        },

        _formatValidJson: function (jsonString) {
            return JSON.stringify(JSON.parse(jsonString), null, 2);
        },

        _formatInvalidJson: function (stringToFormat) {
            return stringToFormat;
        },

        _setError: function (error) {
            var errorPosition = this._getPositionFromError(error);

            if (!this.error) {
                this.error = {};
            }

            this.error.message = error.message;
            this.error.positionInString = errorPosition;
            this.error.positionOnPage = this._getPositionInInput(this.jsonTextarea.domNode, errorPosition);

            console.log("error: ", this.error);

            // Handle the error
            this._setErrorStatus(true);
            this._setErrorMessage();
        },

        _setErrorStatus: function (hasError) {
            dojo.style(this.jsonTextarea.domNode, "border-color", hasError ? "red" : "");
        },

        _setErrorMessage: function () {
            if (!this.error.messageNode) {
                this.error.messageNode = dojo.create("div", {
                    innerHTML: this.error.message,
                    "class": "editPropertyAsJsonErrorMessage"
                }, this.jsonTextarea.domNode, "after");
            } else {
                this.error.messageNode.innerHTML = this.error.message;
            }

            dojo.create("span", {
                "class": "editPropertyAsJsonCloseIcon",
                onclick: dojo.hitch(this, function () {
                    this._clearErrorMessage();
                })
            }, this.error.messageNode);

            this._setErrorPosition();
        },

        _setErrorPosition: function () {
            dojo.style(this.error.messageNode, "top", this.error.positionOnPage.top + this.jsonTextarea.domNode.offsetTop + "px");
            dojo.style(this.error.messageNode, "left", this.error.positionOnPage.left + this.jsonTextarea.domNode.offsetLeft + "px");
        },

        _clearError: function () {
            this._clearErrorMessage();
            this._setErrorStatus(false);
            this.error = null;
        },

        _clearErrorMessage: function () {
            if (this.error && this.error.messageNode) {
                dojo.destroy(this.error.messageNode);
                this.error.messageNode = null;
            }
        },

        _getPositionFromError: function (parseError) {
            var searchText = "in JSON at position ";
            var message = parseError.message;
            var indexOfSearchText = message.indexOf(searchText);

            if (indexOfSearchText > 0) {
                var stringPosition = message.slice(indexOfSearchText + searchText.length, message.length);
                var intPosition = parseInt(stringPosition, 10);

                return isNaN(intPosition)
                    ? 0
                    : intPosition;
            }

            return 0;
        },

        // Original: https://github.com/component/textarea-caret-position/blob/master/index.js
        _getPositionInInput: function (inputElement, positionInValue) {
            var propertiesToCopy = [
                'direction',
                'boxSizing',
                'width',
                'height',
                'overflowX',
                'overflowY',
                'borderTopWidth',
                'borderRightWidth',
                'borderBottomWidth',
                'borderLeftWidth',
                'borderStyle',
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft',
                'fontStyle',
                'fontVariant',
                'fontWeight',
                'fontStretch',
                'fontSize',
                'fontSizeAdjust',
                'lineHeight',
                'fontFamily',
                'textAlign',
                'textTransform',
                'textIndent',
                'textDecoration',
                'letterSpacing',
                'wordSpacing',
                'tabSize',
                'MozTabSize'
            ];
            var computed = window.getComputedStyle(inputElement);
            var div = document.createElement("div");
            document.body.appendChild(div);
            div.style.whiteSpace = "pre-wrap";
            div.style.wordWrap = "break-word";
            div.style.position = "absolute";
            div.style.visibility = "hidden";

            dojo.forEach(propertiesToCopy, function (prop) {
                div.style[prop] = computed[prop];
            });

            if (window.mozInnerScreenX != null) {
                if (inputElement.scrollHeight > parseInt(computed.height, 10)) {
                    div.style.overflowY = "scroll";
                }
            } else {
                div.style.overflow = "hidden";
            }

            div.textContent = inputElement.value.substring(0, positionInValue);

            var span = document.createElement("span");
            span.textContent = inputElement.value.substring(positionInValue) || ".";
            div.appendChild(span);

            var coordinates = {
                top: span.offsetTop + parseInt(computed["borderTopWidth"], 10),
                left: span.offsetLeft + parseInt(computed["borderLeftWidth"], 10),
                height: parseInt(computed["lineHeight"], 10)
            };

            document.body.removeChild(div);

            return coordinates;
        }
    });
})();