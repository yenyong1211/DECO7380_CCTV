# eufy interface + Access History prototype

An English-language coursework prototype based on the supplied eufy mobile interface screenshots. Access History is an added feature; this project does not modify or connect to the real eufy application. All new labels, buttons, messages and feature pages are in English.

Live entry: https://yenyong1211.github.io/DECO7380_CCTV/prototype/

## Navigation and reference content

The original five sections remain Home, Events, Services, Smart and Shop. The reference Events empty state, Space Status, Device Health, Modes, Automation label, shop promotion text and account-menu labels are retained, except Help, which has been removed as requested. Illustrations and product graphics are recreated with SVG/CSS rather than the proprietary app's original image assets.

Access History is integrated directly into Events as an added secondary tab: **Events → Camera Events / Access History**. Both views share the existing date arrows, calendar and time range. The original five primary navigation items remain unchanged; there is no additional standalone History item or Home shortcut.

The header's Messages button opens the Messages page. Its settings button opens Notifications, with reference states Allow Notifications: On, Email: Off, APP Notification: Off. The plus button opens Add Device, Add Favorites and Scan QR Code. The calendar supports selecting an October date and returning to the reference today (October 21, 2026).

Existing eufy actions outside the provided screens show an explanatory dialog. Device pairing, shopping, QR scanning, email subscriptions and real account notifications are not connected. This keeps the demonstrated extension separate from actual product operations.

## Indoor camera devices

Home includes two demo Indoor Cam devices: Living Room and Front Door (facing the entrance from indoors). Each device has an illustrated preview, a camera detail view, and links to Access History and the corresponding member permissions (Emma for Living Room, James for Front Door). Services shows three devices after adding the Omni C28. The Front Door camera remains a generic demo device; Living Room is now labeled Indoor Cam E30. None are connected to hardware.

## Access History interactions

- Seven days of demo logs, per-day people/visit counts, calendar/time-range filtering and an empty state.
- Expandable live-video and recording visits for Emma and James.
- Current access approval status, historical "Allowed at visit" labels, and independent camera visibility settings: Original view, Hide faces, Hide whole person, No access.
- Live illustration updates and localStorage persistence with an in-memory fallback.
- Hash navigation and browser Back, keyboard focus, accessible radio groups and reduced-motion support.
- Desktop sidebar and wide layouts at 900px and above; tablet/mobile layouts and original five-tab bottom navigation on smaller screens.

Access History uses demo data fixed at October 15–21, 2026 to align with the supplied eufy screens; the visits and privacy interactions are based on the Figma reference. Other than visits visible in the initial reference, additional events and James's default permission are illustrative. Permission changes apply to future simulated access and never rewrite prior access logs. Actual video processing, authentication and authorization require a backend.

## Run locally

From the repository root:

```sh
python3 -m http.server 7380
```

Open http://localhost:7380/prototype/ . To open on a phone, use the computer's local IP while both devices are on the same Wi-Fi. JavaScript modules require HTTP hosting, not file://. No packages or build step are required.

## Team integration

- `index.html`: shared entry point.
- `shell.js`: reference eufy shell, native screens and added feature entry points.
- `eufy.css`: eufy palette, shell and responsive adaptations.
- `history/data.js`: people, dates and visit-data adapter.
- `history/history.js`: Events access view, privacy interactions and app routing.
- `history/history.css`: base layouts, overridden by the shared eufy stylesheet.

Keep future team modules in `prototype/<feature>/`. Add routing in `history/history.js` and shell links in `shell.js`; existing routes include `#home`, `#events`, `#services`, `#smart`, `#shop`, `#messages`, `#notifications`, `#events/access`, and `#events/permissions/emma` or `james`. Legacy `#history` routes continue to work.

Privacy changes dispatch `cctv:permission-change` with `{ personId, camera, mode }`. Frontend settings are demonstrative; enforce real permissions on the server. Do not store camera credentials in frontend source.

## Hosting

GitHub Pages publishes `main` from the repository root. Changes committed to main trigger automatic deployment. The root `index.html` redirects to `prototype/`.

## Selected products and viewer face verification

The supplied products are included in Shop with product detail views: Indoor Cam E30 and eufy Omni C28 Robot Vacuum (White) and Mop with Dust Bag. The Living Room camera is labeled Indoor Cam E30; the existing Front Door demo camera is retained. Home also includes the Omni C28 as a robot vacuum, without treating it as a camera. Product prices reproduce the supplied screenshots ($199.95 and $1,229.99) and are explicitly labeled reference prices, not current offers.

Product images are loaded from the official eufy Shopify CDN and require an internet connection. Sources:
- https://www.eufy.com/au/products/indoor-cam-e30?variant=51775675367791
- https://www.eufy.com/au/products/bundle-t211ac20-1-t29yqa20-1?variant=53205557608815

`products.js` contains the reference catalog and detail views. `auth.js` implements a **simulated viewer face-verification flow**, not actual facial recognition and not recognition of people in footage. Opening a camera requires a successful demo verification and a valid permission for that camera. Direct camera links also route through verification. Verified sessions expire after five minutes, end on demand, and recheck current permissions on opening a camera. A matched identity without camera permission is denied; an unmatched face is denied. No camera, face photographs, embeddings or biometric data are used or stored.

Verification audit outcomes and successful camera visits are persisted locally and displayed in Events → Access History; seed records are illustrative demo samples. Verification does not grant an otherwise denied camera permission. This is coursework interaction logic in the browser, not production authentication or a claim that either product supports biometric access control. Real verification would require explicit enrollment, a suitable identity/liveness system and server-side enforcement.


## Optional privacy guide (eufy-8)

Open `#privacy` for Your data journey, People & access, and Keep, share or delete. Details: `#privacy/data-journey`, `#privacy/people-access`, `#privacy/keep-share-delete`. Basic policies, permissions and rights: `#privacy/basics`. Reopen from the menu via Settings → Privacy (`#settings`).

The first Home visit shows this optional guide. Continue and Skip only save `cctv.prototype.privacy-intro.v1=seen` in this browser; unavailable storage falls back to session memory. Deep links are not intercepted. The guide never changes camera permissions, verification events, notification settings or consent. Face verification remains a simulation without biometric capture. Official links explain real product management separately from browser demo data.
