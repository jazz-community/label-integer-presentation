dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd");

(function () {
    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd", null,
    {
        getPresentations() {
            var presentations = [];

            presentations.push(this._createPresentationConfig(
                "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation",
                "Label Integer",
                "integer"
            ));
            presentations.push(this._createPresentationConfig(
                "com.ibm.team.workitem.example.kind.star",
                "Star",
                "boolean"
            ));

            return presentations;
        },

        _createPresentationConfig(id, label, forAttributeTypeId) {
            return {
                id: id,
                label: label,
                forAttributeTypeId: forAttributeTypeId
            };
        }
    });
})();