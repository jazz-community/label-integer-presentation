dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON");

dojo.require("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.library.JsonParse");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.Textarea");

(function () {
    var json_parse = com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.library.JsonParse.json_parse;
    var Dialog = dijit.Dialog;
    var Textarea = dijit.form.Textarea;

    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.EditPropertyAsJSON", null,
    {
        presentationProperties: null,
        property: null,
        dialog: null,
        jsonTextarea: null,
        error: null,

        // Initialize properties and create the dialog
        constructor: function (parameters) {
            this.presentationProperties = parameters.presentationProperties;
            this.property = parameters.property;

            // Create the dialog right away
            this.dialog = this.createDialog();
        },

        // Open the dialog and set the value
        openDialog: function () {
            var self = this;

            // Show the dialog
            this.dialog.show().then(function () {
                // Set the formatted value
                self._setTextareaValue(self.property.value);
            })
        },

        // Create the dialog and set the content
        createDialog: function () {
            // Set the z-index to start higher because the dialogs from Jazz also do
            Dialog._DialogLevelManager._beginZIndex = 10000;

            // Create the dialog widget
            var dialog = new Dialog({
                title: "Edit as JSON",
                content: this._createDialogContent()
            });

            // Add overflow auto to the node containing the dialog
            dojo.style(dialog.containerNode, "overflow", "auto");

            // Destroy the widget in the dom when it's hidden
            dialog.onHide = function () {
                this.destroyRecursive(false);
            };

            return dialog;
        },

        // Create all the dialog content
        _createDialogContent: function () {
            // Create a wrapper div for styling
            var dialogContent = dojo.create("div", {
                "class": "editPropertyAsJsonDialogContent"
            });

            // Add the property key presentation
            this._addLabelWithValue(dialogContent, "Property key: ", dojo.create("span", {
                innerHTML: this.property.key
            }));

            // Add the property value presentation
            var valueContainer = this._addLabelWithValue(dialogContent, "Property value: ", this._createValuePresentation());

            // Set the property value presentation to fill the available space
            dojo.style(valueContainer, "flex-grow", "1");

            // Add the buttons on the bottom
            this._addButtons(dialogContent);

            return dialogContent;
        },

        // Add a label/value presentation to the dialogContent
        _addLabelWithValue: function (dialogContent, labelText, valueNode) {
            // Add a container div for styling
            var valueContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);

            // Add the label text in a span
            dojo.create("span", {
                innerHTML: labelText,
                "class": "editPropertyAsJsonLabel"
            }, valueContainer);

            // Place the value node at the end of the container
            dojo.place(valueNode, valueContainer);

            // Return the container node for further use
            return valueContainer;
        },

        // Create the property value presentation
        _createValuePresentation: function () {
            // Create a dijit textarea with the initial value.
            // Disable all types of spell checking in the textarea
            // because it will be used for JSON.
            this.jsonTextarea = new Textarea({
                value: this.property.value,
                intermediateChanges: true, // Fire onChange events immediately
                "class": "editPropertyAsJsonValueContainer",
                "autocomplete": "off",
                "autocorrect": "off",
                "autocapitalize": "off",
                "spellcheck": "false",
                "data-gramm": "false"
            });
            this.jsonTextarea.startup();

            // Connect to the change and scroll events
            dojo.connect(this.jsonTextarea, "onChange", dojo.hitch(this, this._onChangeEvent));
            dojo.connect(this.jsonTextarea.domNode, "onscroll", dojo.hitch(this, this._onScrollEvent));

            // Return the domNode for placing in the view
            return this.jsonTextarea.domNode;
        },

        // Add the buttons to the dialogContent
        _addButtons: function (dialogContent) {
            // Create a container div for styling
            var buttonsContainer = dojo.create("div", {
                "class": "editPropertyAsJsonContainer"
            }, dialogContent);

            // Create the buttons with event handlers and place them
            dojo.place(this._createButton("Validate JSON", "editPropertyAsJsonButton", dojo.hitch(this, this._onValidateClick)), buttonsContainer);
            dojo.place(this._createButton("Cancel", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", dojo.hitch(this, this._onCancelClick)), buttonsContainer);
            dojo.place(this._createButton("OK", "editPropertyAsJsonButton editPropertyAsJsonButtonRight", dojo.hitch(this, this._onOkClick)), buttonsContainer);

            // Return the container div for further use
            return buttonsContainer;
        },

        // Create a button element with the specified text, css class, and on click function
        _createButton: function (text, cssClass, onClick) {
            return dojo.create("button", {
                innerHTML: text,
                "class": cssClass,
                onclick: onClick
            });
        },

        // Run when the validate button is clicked
        _onValidateClick: function () {
            // Validate and format the value, then set it again
            this._setTextareaValue(this.jsonTextarea.get("value"));
        },

        // Run when the ok button is clicked
        _onOkClick: function () {
            // Just hide the dialog for now...
            // Will need to set the property value in the presentation properties here
            this.dialog.hide();
        },

        // Run when the cancel button is clicked
        _onCancelClick: function () {
            // Just hide the dialog (it will be destroyed)
            this.dialog.hide();
        },

        // Run when the value in the textarea changes (immediate)
        _onChangeEvent: function (newValue) {
            var isValidJson = true;

            // Remove the error message so that it's not in the way when typing
            this._clearErrorMessage();

            // Check if parsing the value causes an exception
            try {
                // Just parse, we don't need the result
                json_parse(newValue);
            } catch (error) {
                // Consider the JSON invalid if there was an exception when parsing
                isValidJson = false;
            }

            // Show the error status using the textarea border color
            this._setErrorStatus(!isValidJson);
        },

        // Run when the textarea is scrolling
        _onScrollEvent: function (event) {
            // Check if there is an error message node
            if (this.error && this.error.messageNode) {
                // Reposition the error message so that it still points
                // to the right character after scrolling
                this._setErrorPosition();
            }
        },

        // Set the value of the textarea to the specified string.
        // Also format and validate with showing the error
        _setTextareaValue: function (valueToSet) {
            this.jsonTextarea.set("value", this._getFormattedValue(valueToSet));
        },

        // Format the value and show/clear the error in the view
        _getFormattedValue: function (valueToFormat) {
            var formattedValue = "";

            try {
                // Try format the value as JSON. Throws an exception when invalid
                formattedValue = this._formatValidJson(valueToFormat);

                // Clear the error if it gets this far
                this._clearError();
            } catch (error) {
                // There was an error parsing the JSON so try to format with a different method
                formattedValue = this._formatInvalidJson(valueToFormat);

                // Set the error in the view
                this._setError(error);
            }

            // Return the formatted value
            return formattedValue;
        },

        // Format a string as JSON. Assumes the JSON is valid; throws an exception otherwise
        _formatValidJson: function (jsonString) {
            // Parse the string to create a JavaScript object and stringify with pretty print
            return JSON.stringify(json_parse(jsonString), null, 2);
        },

        // Format a string of invalid JSON as JSON
        _formatInvalidJson: function (stringToFormat) {
            // Just return the same as the input for now.
            // This should use a custom function to format if the
            // value has never been formatted yet (error in initial JSON).
            // Otherwise the string has already been formatted and still
            // is readable even with the error
            return stringToFormat;
        },

        // Set the error from a JSON parse exception
        _setError: function (error) {
            // Get the position of the error in the input string from the
            // parse exception
            var errorPosition = this._getPositionFromError(error);

            // Initialize the error object if it doesn't exist
            if (!this.error) {
                this.error = {};
            }

            // Set the error message for showing in a popup
            this.error.message = error.message;

            // Set the error position in string. Could be used to set the
            // caret position to the error position when clicking the error popup
            this.error.positionInString = errorPosition;

            // Set the position relative to the textarea for positioning the error popup
            this.error.positionInInput = this._getPositionInInput(this.jsonTextarea.domNode, errorPosition);

            // Set the error status in the textarea border color
            this._setErrorStatus(true);

            // Set the error in the popup
            this._setErrorMessage();
        },

        // Change the textarea border to red if there is an error.
        // Reset to the original color (green) if there is none
        _setErrorStatus: function (hasError) {
            dojo.style(this.jsonTextarea.domNode, "border-color", hasError ? "red" : "");
        },

        // Set the error message in the popup and position it
        _setErrorMessage: function () {
            // Check if an error message node already exists
            if (!this.error.messageNode) {
                // Create a new one if it doesn't
                this.error.messageNode = dojo.create("div", {
                    innerHTML: this.error.message,
                    "class": "editPropertyAsJsonErrorMessage"
                }, this.jsonTextarea.domNode, "after");
            } else {
                // Reuse the node with the new error text if it does
                this.error.messageNode.innerHTML = this.error.message;
            }

            // Add the close button again because setting the innerHTML removed it.
            // Should probably create a new element for the error message so that this
            // can just be created once together with the positioning div
            dojo.create("span", {
                "class": "editPropertyAsJsonCloseIcon",
                onclick: dojo.hitch(this, function () {
                    // Remove the popup when the close button is clicked
                    this._clearErrorMessage();
                })
            }, this.error.messageNode);

            // Position the error message popup to be pointing at the character
            // causing the error
            this._setErrorPosition();
        },

        // Position the error message popup inside the textarea. It should point at the
        // location in the string that is causing the error. The positioning takes scrolling
        // into account and will remain at the top/bottom of the textarea if the error position
        // is outside of the visible part
        _setErrorPosition: function () {
            // Get the top and left coordinates using the position in the textarea and the
            // position of the textarea itself
            var top = this._getCoordinateInElement(this.error.positionInInput.top, this.jsonTextarea.domNode, "Top", "Height");
            var left = this._getCoordinateInElement(this.error.positionInInput.left, this.jsonTextarea.domNode, "Left", "Width");

            // Set the position using the top and left attributes (the message node has position: absolute)
            dojo.style(this.error.messageNode, "top", top + "px");
            dojo.style(this.error.messageNode, "left", left + "px");
        },

        // Calculate the final position in the visible element. Use the original
        // position in the element and account for the position of the element itself
        // and the scroll position of the element. Limit the final position to the edges
        // of the element.
        // side = "Top" | "Left"
        // dimension = "Height" | "Width"
        _getCoordinateInElement: function (positionInElement, element, side, dimension) {
            // The final position starts with the original position in the element
            var finalPosition = positionInElement;

            // Get the element offset for the specified side
            var elementOffset = element["offset" + side];

            // Get the scroll amount from the specified side
            var elementScroll = element["scroll" + side];

            // Get the offset of the specified dimension
            var elementDimensionOffset = element["offset" + dimension];

            // Add the element offset to the final position
            finalPosition += elementOffset;

            // Remove the scroll offset from the final position
            finalPosition -= elementScroll;

            // Just use the element offset if the final position would be
            // smaller (limits to the edge)
            finalPosition = Math.max(finalPosition, elementOffset);

            // Just use the element offset plus the element dimension if the final
            // position would be larger (limits to the other edge)
            finalPosition = Math.min(finalPosition, elementOffset + elementDimensionOffset);

            // Return the final position
            return finalPosition;
        },

        // Completely clear the error in the view and the instance property
        _clearError: function () {
            // Remove the error message popup
            this._clearErrorMessage();

            // Remove the error status from the textarea border
            this._setErrorStatus(false);

            // Clear the error object
            this.error = null;
        },

        // Remove the error message popup from the view
        _clearErrorMessage: function () {
            // Check if there is an error node
            if (this.error && this.error.messageNode) {
                // Destroy the error node (removes from view)
                dojo.destroy(this.error.messageNode);

                // Clear the message node object
                this.error.messageNode = null;
            }
        },

        // Get the position of the error in the original string using
        // the parse exception object
        _getPositionFromError: function (parseError) {
            // The parse exception thrown by the custom JSON parser contains the position
            // of the error in the "at" property
            return parseError.at;
        },

        // Get the position of a location in the value of a textarea relative to the
        // textarea.
        // Since it isn't possible to do this with a textarea we create a copy
        // element and use that for finding the position. To be more exact, we create a div
        // containing the text up to the location in the value and add a span containing
        // the rest of the text. All the needed computed styles are copied from the textarea
        // to the div so that they are the same size. The position where the span starts is
        // the position that we are looking for. The copy needs to be added to the dom for
        // measuring but is removed right afterwards.
        // Take a look at the original and basis for this function with more explanation on
        // GitHub: https://github.com/component/textarea-caret-position/blob/master/index.js
        _getPositionInInput: function (inputElement, positionInValue) {
            // Create an array with all the properties that need to be copied to the copy div
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

            // Get the computed styles from the textarea
            var computed = window.getComputedStyle(inputElement);

            // Create a div that will be the copy of the textarea
            var div = document.createElement("div");

            // Add the div to the dom so that styles and measuring works
            document.body.appendChild(div);

            // Set some styles needed to copy the textarea behavior
            div.style.whiteSpace = "pre-wrap";
            div.style.wordWrap = "break-word";
            div.style.position = "absolute";
            div.style.visibility = "hidden";

            // Copy all of the properties in the list from the textarea
            // and set the styles on the div
            dojo.forEach(propertiesToCopy, function (prop) {
                div.style[prop] = computed[prop];
            });

            // Fix an overflow issue for when in Firefox
            if (window.mozInnerScreenX != null) {
                if (inputElement.scrollHeight > parseInt(computed.height, 10)) {
                    div.style.overflowY = "scroll";
                }
            } else {
                // Set overflow hidden for all other browsers
                div.style.overflow = "hidden";
            }

            // Set the div text to the text up to the position in the value
            div.textContent = inputElement.value.substring(0, positionInValue);

            // Create a span element
            var span = document.createElement("span");

            // Set the span text to the text after the position in the value.
            // Don't let the span be empty otherwise it wont be rendered
            span.textContent = inputElement.value.substring(positionInValue) || ".";

            // Add the span to the div
            div.appendChild(span);

            // Get the coordinates from the span to know it's position in the div
            var coordinates = {
                top: span.offsetTop + parseInt(computed["borderTopWidth"], 10),
                left: span.offsetLeft + parseInt(computed["borderLeftWidth"], 10),
                height: parseInt(computed["lineHeight"], 10)
            };

            // Remove the div from the dom
            document.body.removeChild(div);

            // Return the coordinates "top", "left", and "height" (line height)
            return coordinates;
        }
    });
})();