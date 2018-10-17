dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations");

dojo.require("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd");
dojo.require("com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.AddPresentationContent");
dojo.require("com.ibm.team.workitem.web.model.types.AttributeTypes");

(function () {
    var PresentationsToAdd = com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd;
    var AddPresentationContent = com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.AddPresentationContent;
    var AttributeTypes = com.ibm.team.workitem.web.model.types.AttributeTypes;

    var ENUM_TYPE= "com.ibm.team.workitem.attributeType.enumerationTypes";
    var ENUM_LIST_TYPE= "com.ibm.team.workitem.attributeType.enumerationListTypes";

    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations", null,
    {
        // Empty. Don't instantiate.
    });

    // Keep track of whether the presentations have already been added or not
    var addedPresentations = false;

    // Define a static function for adding the custom editor presentations to the project area management web ui
    com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations.addCustomEditorPresentations = function () {
        // Only add the presentations once
        if (addedPresentations) {
            return;
        } else {
            addedPresentations = true;
        }

        var customPresentations = new PresentationsToAdd().getPresentations();

        // Don't change anything if there aren't any custom presentations
        if (!customPresentations.length) {
            return;
        }

        // Store the original "_populateAttrBasedKinds" function
        var originalPopulateAttrBasedKinds = AddPresentationContent.prototype._populateAttrBasedKinds;

        // Override the "_populateAttrBasedKinds" function with a new one that calls
        // the original function and also adds the custom presentations
        AddPresentationContent.prototype._populateAttrBasedKinds = function () {
            console.log("this from populate attr based kinds", this);
            console.log("arguments", arguments);

            // First run the original function
            originalPopulateAttrBasedKinds.apply(this, arguments);

            // Get the selected kind (can be an empty string)
            var selectedKind = (this.kind && this.kind.length > 0)
                ? this.kind
                : this.getKind();
            var attributeTypeId = null;

            // Look for the current attribute in the list of all attributes
            for (var i = this.attributes.length - 1; i >= 0; i--) {
                // Get the attribute identifier
                var targetId = this.attributes[i].stringIdentifier || this.attributes[i].id;

                // Check if this is the attribute that we want
                if (targetId == this.attributeId) {
                    if (this.attributes[i].isEnumeration === true) {
                        // Special handling for the enumeration type
                        attributeTypeId = ENUM_TYPE;
                    } else if (AttributeTypes.isEnumerationListType(this.attributes[i].typeId)) {
                        // Special handling for the enumeration list type
                        attributeTypeId = ENUM_LIST_TYPE;
                    } else {
                        // Get the type id from the attribute
                        attributeTypeId = this.attributes[i].typeId;
                    }

                    break;
                }
            }

            // Only continue if we found the attribute type id
            if (attributeTypeId) {
                console.log("current attributeTypeId", attributeTypeId);

                // Iterate over all custom presentations
                dojo.forEach(customPresentations, function (customPresentation) {
                    // Check if the custom presentation is meant for this type of attribute
                    if (customPresentation.forAttributeTypeId === attributeTypeId) {
                        // Check if this custom presentation is the selected option
                        var selected = selectedKind && selectedKind.length > 0 && customPresentation.id == selectedKind;

                        // Create a new list option for the custom presentation
                        var newOption = new Option(customPresentation.label, customPresentation.id, false, selected);

                        // Add the new option to the select list
                        this.kindField_attr.options.add(newOption);
                    }
                }, this);
            }
        };

        console.log("Adding custom editor presentations...");
    };
})();