dojo.require("com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation");

define([
    "dojo/_base/declare"
], function (declare) {
    return declare("com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation",
        com.ibm.team.workitem.web.ui.internal.view.editor.presentations.attribute.IntegerPresentation,
    {
        constructor: function () {
            console.log("Loaded: com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation");
            console.log("Constructor arguments: ", arguments);
        }
    });
});