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
        constructor: function () {
            this.inherited(arguments);
            console.log("Loaded: com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation");
        },

        getId: function () {
            return presentationId;
        },

        // Override the create view function to customize the result
        createView: function (context, params, domNode) {
            console.log("createView arguments", arguments);
            var view = this.inherited(arguments);

            if (context.editorPresentation.isReadOnly()) {
                console.log("view is readonly");
                this._alignTextRight(view._value);
            } else {
                console.log("view is editable");
                this._setInputType(view, "number");
                this._alignTextRight(view._input);
            }

            console.log("view", view);
            return view;
        },

        // Set the view input to the specified type
        _setInputType: function (view, inputType) {
            view.type = inputType;
            view._input.type = inputType;
        },

        // Align the text of the specified element to the right
        _alignTextRight: function (element) {
            dojo.style(element, "textAlign", "right");
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