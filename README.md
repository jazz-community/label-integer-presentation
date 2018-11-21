[![Build Status](https://travis-ci.org/jazz-community/label-integer-presentation.svg?branch=master)](https://travis-ci.org/jazz-community/label-integer-presentation)

# Custom Integer Attribute Presentation for RTC
This plugin provides a custom presentation that can be used for integer work item attributes.

![Overview Screenshot](https://github.com/jazz-community/label-integer-presentation/blob/master/documentation/label-integer-presentation.png)

It works mostly the same as the built-in integer presentation with a few changes:
- The integer is aligned to the right side of the input
- There is a custom label on the right side

This presentation can be used for both built-in and custom attributes. It's great for situations where you want to specify the units that the integer value represents.

## Setup

### Download
You can find the latest release on the [releases page of this repository](https://github.com/jazz-community/label-integer-presentation/releases).

### Installation and Deployment
Deploy just like any other update site. See [here](https://github.com/jazz-community/rtc-email-workitem-action#installation) for an example.

### Configuration
RTC doesn't support configuring custom attribute based presentations using the web UI (unless if you use our [pa-admin-ui-extensions](https://github.com/jazz-community/pa-admin-ui-extensions) plugin). Because of this, you'll have to use the RTC Eclipse Client.

By default, the only way to use the presentation is by editing the process XML. If you don't feel comfortable doing this, you can download this repository and copy the `eclipse-client-plugin` folder to the `plugins` folder in your eclipse client installation. Then restart eclipse and the custom presentation should be available when configuring integer attributes.

### Customization
This plugin supports customization with two presentation properties.

**Key**: *RightLabel*  
**Value**: *The label to show to the right of the integer input. This property is optional. There will simply be no label on the right if it's not set.*

**Key**: *RightLabelWidth*  
**Value**: *The width to reserve on the right for the label. This can be any unit supported by CSS (px, %, ...). This property is also optional and will default to the minimum width needed to display the specified label text.*

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/label-integer-presentation/issues) of this repository to report issues or suggest enhancements.

For general contribution guidelines, please refer to [CONTRIBUTING.md](https://github.com/jazz-community/welcome/blob/master/CONTRIBUTING.md).

## Licensing
Copyright (c) Siemens AG. All rights reserved.  
Licensed under the [MIT](https://github.com/jazz-community/label-integer-presentation/blob/master/LICENSE) License.
