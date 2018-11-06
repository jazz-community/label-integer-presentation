define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation",
    "com.ibm.team.workitem.web.internal.registry.PresentationRegistry",
    "dojo/domReady!"
], function (declare, domClass, domConstruct, domStyle) {
    // Note that all of the above imports of ibm classes will log an error to the console but the classes are still loaded.
    // Using dojo.require doesn't log an error but also doesn't require the module when using AMD syntax.

    // Define aliases for some built in classes
    var PresentationRegistry = com.ibm.team.workitem.web.internal.registry.PresentationRegistry;

    // The editor presentation id
    var presentationId = "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation";

    // The label integer presentation declaration
    var LabelIntegerPresentation = declare("com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation",
        com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation,
    {
        // Call the inherited constructor manually
        constructor: function () {
            this.inherited(arguments);
        },

        // Override the getId function
        getId: function () {
            return presentationId;
        },

        // Override the create view function to customize the result
        createView: function (context, params, domNode) {
            // Create the view using the inherited function
            var view = this.inherited(arguments);

            // Check if the presentation is read only
            var readOnly = context.editorPresentation.isReadOnly();

            // Get the label and width from the properties
            var rightLabel = params.editorPresentation.getProperty("RightLabel");
            var rightLabelWidth = params.editorPresentation.getProperty("RightLabelWidth");

            // Add styling to the input element
            this._styleInputElement(view, readOnly);

            // Add the right label only if it was set in the properties
            if (rightLabel) {
                this._addRightLabelToView(view, rightLabel, rightLabelWidth, readOnly);
            }

            // Return the modified view
            return view;
        },

        // Add some styling to the input element
        _styleInputElement: function (view, readOnly) {
            domClass.add(readOnly ? view._value : view._input, "labelIntegerPresentationInput");
        },

        // Add the right label to the view
        _addRightLabelToView: function (view, rightLabel, rightLabelWidth, readOnly) {
            domStyle.set(view.domNode, "display", "flex");

            // Create an element for positioning the label
            var rightLabelDiv = domConstruct.create("div", { "class": "labelIntegerPresentationRightLabel" }, view.domNode);

            // Add another css class if the presentation is editable
            if (!readOnly) {
                domClass.add(rightLabelDiv, "labelIntegerPresentationRightLabelEditable");
            }

            // Set the custom width if it was set in the properties. Default is to fit the text
            if (rightLabelWidth) {
                domStyle.set(rightLabelDiv, "width", rightLabelWidth);
            }

            // Create an element containing the label text
            domConstruct.create("span", { innerHTML: rightLabel }, rightLabelDiv);
        }
    });

    // Set the presentation id
    LabelIntegerPresentation.ID = presentationId;

    // Register the presentation manually because custom attribute based presentations are not
    // properly supported in the web UI.
    if (typeof PresentationRegistry.getInstance().getPresentation(presentationId) === "undefined") {
        PresentationRegistry.getInstance().register(new LabelIntegerPresentation());
    }
});