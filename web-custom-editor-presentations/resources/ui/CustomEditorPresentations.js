dojo.provide("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations");

(function () {
    dojo.declare("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations", null,
    {
        constructor: function () {
            console.log("CustomEditorPresentations loaded");
        }
    });

    var addedPresentations = false;

    // Define a static function for adding the custom editor presentations to the project area management web ui
    com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations.addCustomEditorPresentations = function () {
        // Only add the presentations once
        if (addedPresentations) {
            return;
        } else {
            addedPresentations = true;
        }

        console.log("Adding custom editor presentations...");
    };
})();