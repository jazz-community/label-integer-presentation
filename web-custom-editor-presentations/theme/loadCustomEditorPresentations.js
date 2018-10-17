// Add this file to your theme zip to add custom attribute based work item editor presentations to the web ui.
//
// This script requires the ajax module "com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations"
// to be published in order for it to work. This script just loads that bundle and calls the function that adds
// the custom attributes to the project area management page.
(function () {
	dojo.require("net.jazz.ajax.ui.PlatformUI");

	var currentPageId = null;

	try {
		currentPageId = net.jazz.ajax.ui.PlatformUI.getWorkbench().getCurrentPageId();
	} catch (e) {
		currentPageId = null;
	}

    // Only load the customizations when on the project area management page
	if (currentPageId === "com.ibm.team.process.ProjectAreaManagement") {
		jazz.core.loader.load_async("com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations", function() {
			com.siemens.bt.jazz.workitemeditor.presentation.customEditorPresentations.ui.CustomEditorPresentations.addCustomEditorPresentations();
		});
	}
})();