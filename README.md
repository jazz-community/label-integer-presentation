[![Build Status](https://travis-ci.org/jazz-community/label-integer-presentation.svg?branch=master)](https://travis-ci.org/jazz-community/label-integer-presentation)

# label-integer-presentation
A custom work item attribute presentation for adding a label to integer presentations

The 'eclipse-client-plugin' just adds the presentation to the list of available presentations.

The 'web-client-plugin' contains the actual presentation for the web.

The 'pa-admin-ui-patches' plugin is located in a different repository. The plugin extends the project management page. It enables the custom attribute presentation to be configured using the web UI. In order for it to work it needs the tiny theme file to be uploaded as part of the theme.
