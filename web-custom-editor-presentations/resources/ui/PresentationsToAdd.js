dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd");

(function () {
    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd", null,
    {
        // Get a list of all custom presentations to add to the project area management page
        getPresentations: function() {
            var presentations = [];

            presentations.push(this._createPresentationConfig(
                "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation",
                "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation",
                "Label Integer",
                "integer"
            ));
            presentations.push(this._createPresentationConfig(
                "com.ibm.team.workitem.example.kind.star",
                "com.ibm.team.workitem.example.web.ui.StarPart",
                "Star",
                "boolean"
            ));

            return presentations;
        },

        _createPresentationConfig: function(id, widget, label, forAttributeTypeId) {
            return {
                id: id,
                widget: widget,
                label: label,
                forAttributeTypeId: forAttributeTypeId
            };
        }
    });
})();