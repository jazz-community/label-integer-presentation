dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd");

(function () {
    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd", null,
    {
        presentations: [],

        constructor: function () {
            this.presentations.push(this._createPresentationConfig(
                "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation",
                "com.siemens.bt.jazz.workitemeditor.presentation.labelIntegerPresentation.ui.LabelIntegerPresentation",
                "integer"
            ));
            this.presentations.push(this._createPresentationConfig(
                "com.ibm.team.workitem.example.kind.star",
                "com.ibm.team.workitem.example.web.ui.StarPart",
                "boolean"
            ));
        },

        getPresentations() {
            return this.presentations;
        },

        _createPresentationConfig(id, widget, forAttributeTypeId) {
            return {
                id: id,
                widget: widget,
                forAttributeTypeId: forAttributeTypeId
            };
        }
    });
})();