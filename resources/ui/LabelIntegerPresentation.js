dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation");

dojo.require("com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation");
dojo.require("com.ibm.team.workitem.web.internal.registry.PresentationRegistry");

(function () {
    // Define aliases for some built in classes
    var PresentationRegistry = com.ibm.team.workitem.web.internal.registry.PresentationRegistry;

    // The editor presentation id
    var presentationId = "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation";

    // The label integer presentation declaration
    var LabelIntegerPresentation = dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation",
        com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation,
    {
        inputType: "number",

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
            var view = this.inherited(arguments);

            // Check if the presentation is read only
            if (context.editorPresentation.isReadOnly()) {
                this._setValueWidth(view);
                this._alignTextRight(view._value);
            } else {
                this._setInputType(view);
                this._alignTextRight(view._input);
            }

            this._addRightLabelToView(view, "Euro/€"); // TODO: Get this from a custom attribute
            // TODO: Set the right label width from a custom attribute (default: 35%)

            return view;
        },

        // Set the width of the value node for the alignment to work
        _setValueWidth: function (view) {
            dojo.style(view._value, "width", "100%");
        },

        // Set the view input to the specified type
        _setInputType: function (view) {
            view.type = this.inputType;
            view._input.type = this.inputType;
        },

        // Align the text of the specified element to the right
        _alignTextRight: function (element) {
            dojo.style(element, "textAlign", "right");
        },

        // Add the right label to the view
        _addRightLabelToView: function (view, rightLabel) {
            dojo.style(view.domNode, "display", "flex");

            var rightLabelDiv = dojo.create("div", { class: "labelIntegerPresentationRightLabel" }, view.domNode);
            var rightLabelSpan = dojo.create("span", null, rightLabelDiv);
            dojo.create("label", { innerHTML: rightLabel }, rightLabelSpan);
        }
    });

    // Set the presentation id
    LabelIntegerPresentation.ID = presentationId;

    // Register the presentation manually because custom attribute based presentations are not
    // properly supported in the web UI.
    if (typeof PresentationRegistry.getInstance().getPresentation(presentationId) === "undefined") {
        PresentationRegistry.getInstance().register(new LabelIntegerPresentation());
    }
})();