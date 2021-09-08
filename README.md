# Electron Tab Stops Spike

## Overview

This is a proof of concept to show that we can use automation within Electron to detect certain keyboard navigation accessibility issues. Electron allows us to send native keyboard events to the browser, allowing us to simulate user input in a way that we can't achieve with the chrome extension due to the following limitation:

From https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent:

> Note: Manually firing an event does not generate the default action associated with that event. For example, manually firing a key event does not cause that letter to appear in a focused text input. In the case of UI events, this is important for security reasons, as it prevents scripts from simulating user actions that interact with the browser itself.

This POC currently demonstrates the following:

-   We can open a split pane app with the browser window on one side (and possibly in the future, the Accessibility Insights UI on the left side.)
-   We can send native keyboard events to the browser window that trigger default browser actions.
-   We can pass data between the two environments
-   We can start scans over, and even retain all information, on navigation.
