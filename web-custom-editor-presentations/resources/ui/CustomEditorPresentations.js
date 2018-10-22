dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations");

dojo.require("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd");
dojo.require("com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.AddPresentationContent");
dojo.require("com.ibm.team.workitem.web.model.types.AttributeTypes");
dojo.require("com.ibm.team.workitem.web.process.ui.internal.view.common.TemplatedWidget");
dojo.require("com.ibm.team.workitem.web.process.ui.internal.view.presentation.parts.PartsMapping");
dojo.require("com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.PropertiesTable");

(function () {
    var PresentationsToAdd = com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.PresentationsToAdd;
    var AddPresentationContent = com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.AddPresentationContent;
    var AttributeTypes = com.ibm.team.workitem.web.model.types.AttributeTypes;
    var PartsMapping = com.ibm.team.workitem.web.process.ui.internal.view.presentation.parts.PartsMapping;
    var PropertiesTable = com.ibm.team.workitem.web.process.ui.internal.view.presentation.dialogs.PropertiesTable;

    var ENUM_TYPE= "com.ibm.team.workitem.attributeType.enumerationTypes";
    var ENUM_LIST_TYPE= "com.ibm.team.workitem.attributeType.enumerationListTypes";
    var TEMPLATED_WIDGET = "com.ibm.team.workitem.web.process.ui.internal.view.common.TemplatedWidget";

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

        // Get the custom presentations
        var customPresentations = new PresentationsToAdd().getPresentations();

        // Don't change anything if there aren't any custom presentations
        if (!customPresentations.length) {
            return;
        }

        // Add the custom presentations to the list of known kinds
        overridePopulateAttrBasedKinds(customPresentations);

        // Add presentation widgets for the custom presentations
        overrideGetDesigntimeWidget(customPresentations);

        // Add a button for adding new custom properties
        overridePropertiesTablePostCreate();

        // Load existing custom properties in the table
        overridePopulateProperties();

        // Add a custom edit property button
        overrideAddPropertyRow();
    };

    // Override the function in the prototype so that all future instances will use the
    // customized version of the function that also adds the custom presentations
    var overridePopulateAttrBasedKinds = function (customPresentations) {
        // Store the original "_populateAttrBasedKinds" function
        var originalPopulateAttrBasedKinds = AddPresentationContent.prototype._populateAttrBasedKinds;

        // Override the "_populateAttrBasedKinds" function with a new one that calls
        // the original function and also adds the custom presentations
        AddPresentationContent.prototype._populateAttrBasedKinds = function () {
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
    };

    // Override this function to add preview presentations for the custom presentations
    var overrideGetDesigntimeWidget = function (customPresentations) {
        // Store the original prototype function
        var originalGetDesigntimeWidget = PartsMapping.getDesigntimeWidget;

        // Override the function in the prototype
        PartsMapping.getDesigntimeWidget = function (presentationWidget) {
            var customDesignTimeWidget = null;

            // Check if we got a presentation widget id
            if (presentationWidget) {
                // Iterate over all custom presentations
                dojo.forEach(customPresentations, function (customPresentation) {
                    // Check if the presentation widget is a custom presentation
                    if (customPresentation.widget === presentationWidget) {
                        // Create a custom presentation widget using the name of the presentation
                        customDesignTimeWidget = {
                            widgetClass: TEMPLATED_WIDGET,
                            widgetParams: {
                                templateString: '<div class="GreyLabel" style="font-style:italic;">' + customPresentation.label + '</div>'
                            }
                        };
                    }
                }, this);
            }

            // Return either the custom widget or the result of the original function
            return customDesignTimeWidget !== null
                ? customDesignTimeWidget
                : originalGetDesigntimeWidget.apply(this, arguments);
        }
    };

    // Override the postCreate function to add a new button for creating custom
    // properties from the web ui
    var overridePropertiesTablePostCreate = function () {
        // Store the original prototype function
        var originalPostCreate = PropertiesTable.prototype.postCreate;

        // Override the function in the prototype
        PropertiesTable.prototype.postCreate = function () {
            // First call the original function
            originalPostCreate.apply(this, arguments);

            // Add a link for creating a new property
            dojo.create("a", {
                innerHTML: "Add New",
                style: {
                    "float": "right",
                    "font-weight": "bold",
                    "margin-right": "5px"
                },
                href: "#",
                onclick: dojo.hitch(this, function(e) {
                    // Prevent the default link behavior
                    dojo.stopEvent(e);

                    // Prompt for a new property name
                    var newPropertyKey = prompt("New property key", "");

                    // Add the new property to the array of properties and
                    // a new row to the table if we got a new property name
                    if (newPropertyKey) {
                        var numberOfProperties = this.presentationProperties._properties.length;
                        this.presentationProperties.addProperty(newPropertyKey, "");

                        // Only add a new row in the table if the property was added to the list of properties.
                        // When the key is the same as one of the existing properties it wont be added.
                        if (numberOfProperties + 1 === this.presentationProperties._properties.length) {
                            var newProperty = this.presentationProperties._properties[numberOfProperties];
                            this._addPropertyRow(newProperty);
                        } else {
                            alert("Property key already exists");
                        }
                    }
				})
            }, this._table.domNode, "before");
        };
    };

    // Override the populateProperties function to also add custom properties
    // to the table in the ui
    var overridePopulateProperties = function () {
        // Store the original prototype function
        var originalPopulateProperties = PropertiesTable.prototype.populateProperties;

        // Override the function in the prototype
        PropertiesTable.prototype.populateProperties = function (presentationProperties) {
            // First call the original function
            originalPopulateProperties.apply(this, arguments);

            // Get the presentation properties
            var propertyValues = presentationProperties.getValues();

            // Iterate over all the presentation properties from this presentation
            dojo.forEach(propertyValues, function (presentationProperty) {
                // Check if the presentation property is in the list of properties to show
                if (!this.propSpec.hasOwnProperty(presentationProperty.key)) {
                    // Add the presentation property if it's missing (this is for all custom properties)
                    this._addPropertyRow(presentationProperty);
                }
            }, this);
        };
    };

    // Override the _addPropertyRow function to add a custom edit button to all
    // properties in the table
    var overrideAddPropertyRow = function () {
        // Override the function in the prototype
        PropertiesTable.prototype._addPropertyRow = function (property) {
            var self = this;

            this._table.addItem({
                key: property.key,
                value: property,
                actions: [{
                    iconClass: "edit-dlg-command",
                    title: "Edit as JSON",
                    onClick: function () {
                        alert("You clicked edit");
                        console.log("Property", property);
                    }
                },
                {
                    iconClass: "delete-command",
                    title: this.messages.RemoveProperty,
                    onClick: function() {
                        if (property.key && property.key.length > 0) {
                            if (!confirm(dojo.string.substitute(self.messages.ConfirmRemoveProp, [property.key]))) {
                                return;
                            }
                        }
                        self.presentationProperties.deleteProperty(property.key);
                        self.populateProperties(self.presentationProperties);
                    }
                }]
            });
        };
    };
})();