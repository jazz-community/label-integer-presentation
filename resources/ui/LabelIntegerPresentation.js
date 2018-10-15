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