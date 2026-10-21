# Current privacy guide (eufy-8)

The previous five-step confirmation workflow is retired. `privacy.js` now provides three optional educational guides plus basic privacy information. Reading or dismissing the guide does not accept terms or change permissions. Existing demo notification preferences remain readable without migration or automatic writes.

Sources: [E30 storage](https://service.eufy.com/article-description/Indoor-Cam-E30-How-Do-I-Store-Video-Recordings-on-My-Camera), [E30 product and compatibility](https://www.eufy.com/au/products/indoor-cam-e30), [storage management](https://service.eufy.com/article-description/How-to-Clear-Storage-on-eufy-Device), [official Privacy Notice](https://www.eufy.com/au/policies/privacy-policy), [Terms of Use](https://www.eufy.com/au/policies/terms-of-service). Examples are labelled and do not detect real camera settings.

The notes below document the earlier workflow only; they do not describe the current introduction.

---

# Reference sources and adaptation notes

The English startup flow was added to the repository at commit recorded in INTEGRATION.md. It adapts the supplied eufy Clean screenshots to the existing eufy Security coursework website; it is not a verbatim reproduction of every screen in a current official app.

## Supplied screenshots

The supplied eufy Clean screens show:

- A user-agreement introduction with linked agreement/privacy documents.
- “Disagree and Exit” and “Agree and Continue” actions.
- An operating-system wireless-data prompt offering Wi-Fi & Mobile Data, Wi-Fi Only and Don't Allow.

The website follows this structure in English, using responsive web dialogs rather than a phone frame. The local User Agreement and Privacy Notice describe the coursework prototype, not a substitute for an official eufy contract.

## Official eufy references consulted

1. [Setting Up Notifications on Your Phone for eufy Devices](https://service.eufy.com/article-description/Setting-Up-Notifications-on-Your-Phone-for-eufy-Devices)
   Supports notification permission, security-mode notification configuration, motion/doorbell alerts and text-only versus thumbnail content options.
2. [Privacy Commitment](https://service.eufy.com/expertsecure-system/article-description/Privacy-Commitment-1617358267456)
   Explains that thumbnail notifications can involve briefly hosting preview images in the cloud. The prototype does not make a blanket promise that all data stays local.
3. [Your Privacy is Our Priority](https://www.eufy.com/privacy-commitment)
   Provides context about access management, shared users and privacy controls.
4. [eufy Privacy Policy](https://www.eufy.com/policies/privacy-policy)
   Linked directly from the startup privacy notice and the Privacy & Permissions page.
5. [How do I enable mobile data permission for the eufy app on my smartphone?](https://beta.service.eufy.com/article-description/How-do-I-enable-mobile-data-permission-for-the-eufy-app-on-my-smartphone)
   Explains that mobile-data permissions are managed through the phone operating system.

## Deliberate web adaptations

- Network access is a saved demonstration preference. A website cannot control a device's Wi-Fi/cellular permission.
- Allow Notifications is a demonstration preference. No browser permission dialog is requested and no push delivery backend is connected.
- Important Security Alerts is a web-prototype preference. The cited sources do not verify a universal current iOS Critical Alerts capability for all eufy products. The UI makes no claim to override mute, Focus or Do Not Disturb.
- Optional analytics is a demonstration choice, off by default. No analytics library or endpoint is connected.
- All records remain in this browser's localStorage, with a session-memory fallback when storage is unavailable. This is not a production consent record or real device authorization.

