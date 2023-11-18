# Reflector Log Library

## Version 1.0.x

This library is currently in alpha version. Keep in mind, An alpha version of a software product is a pre-release version that is typically not complete but includes most of the major features. It's often used for internal testing and development purposes.

**Here are some key points about alpha versions:**

- Not feature-complete: Some features may be missing or incomplete.
- Internal testing: Alpha versions are often used for testing within the development team or organization.
- Bugs and instability: Because it's a pre-release version, an alpha version may have bugs and could be unstable.
- Feedback and improvements: The purpose of releasing an alpha version is to gather feedback and make improvements before releasing a more stable beta version.

**IMPORTANT**

- Remember, using an alpha version in a production environment is generally not recommended due to potential instability and the presence of bugs.
- This repository and code is supported by: @github/beyondnetperu

# Features Available:

- Log Method: print entries (OnEntry, OnCall, OnException and OnExit) for a method tagged with @LogMethod

# Pending Features, working on:

- Log Property
- Log Class
- Log Parameter
- Print log to CSV, Txt, Xml file formats
- Compatibility with clients like New Relic, Logstash, etc.

# Structure

- {datetime}: Date and Time in UTC Format.
- [RequestId: {requestid}]: Each interceptor has to generate a Request ID, this id is related to a specific execution.
- [{targettype}.cs, {methodinfo}]: Target Type is the name of the main class root. Method Info contains the name of the method executed.
- [Tracking ID:{trackingid}]: This is a specific mark or tag delivered by the client to define segments of data. In case we do not give this value, the system will create internally a new one based on GUIDs strategy.
- {took}: Time in milliseconds that delay to execute the code.
- {returnedvalue}: Show the value returned after executing the logic inside the method.
- {params}: List arguments used inside the method.
