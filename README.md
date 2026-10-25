# DECO7380 CCTV Privacy Platform

Independent third-party **Smart Privacy Search / Agent**, connected to the group's existing eufy prototype. The root website is the entry experience; `prototype/` and all its current routes are preserved unchanged.

## Open

From this repository root:

```sh
python3 -m http.server 7380
```

Third-party platform: http://localhost:7380/  
Existing eufy prototype: http://localhost:7380/prototype/

GitHub Pages uses the same relative paths under `/DECO7380_CCTV/`. The root entry becomes the privacy platform after these changes are merged into the Pages publishing branch. There is no build step and no API key. ES modules require HTTP hosting.

## Platform structure

Restores the earlier conversation's gray/white card layout, green accents, sidebar search and navigation, clickable **00 ASK → 01 SEE → 02 UNDERSTAND → 03 CONTROL → 04 REVIEW** journey, Privacy Profile, two score cards, factor explanations, Evidence and interactive Data Flow. The selected profile uses the group's Living Room Indoor Cam E30 rather than presenting an unrelated S3 Pro as a connected device.

The sidebar distinguishes third-party information from **Continue in eufy** actions. Search interprets curated English questions and shows structured information, relevant local detail panels and explicit links to real group-prototype routes. It is deterministic navigation, not a live LLM or arbitrary product advice service. Unknown questions receive a bounded fallback. Reading or searching never changes settings.

| Question | Information / destination |
| --- | --- |
| Who can see my camera? | Current-permission explanation; Access History; Emma and James permissions |
| Who accessed my camera yesterday? | Seed visits for 20 Oct 2026; Access History with date-selection instruction |
| How do I stop Emma seeing my camera? | `prototype/#events/permissions/emma` |
| How do I change James permission? | `prototype/#events/permissions/james` |
| Where are my videos stored? | Data Flow and storage explanation; both camera routes and Services |
| Why is Data Access Exposure 5/10? | Five original example factors and evidence limitations |
| Show my living room / front door camera | `prototype/#device/living-room` / `#device/front-door` |
| Open Services / messages / Notification settings | `#services` / `#messages` / `#notifications` |

Search questions and selected profile views are stored in the current URL for browser Back/Forward and reload restoration. Search text is not sent to an AI or analytics service. The platform uses no new localStorage keys; existing eufy controls own their demo state. Links open in the same tab; browser Back returns to the platform.

## Ratings and evidence

**Researcher-coded prototype examples, not official certification, a security audit or live account measurements.** The five Exposure factors from the previous design are Support access, Other-user access, Cloud recording, External processing, and Secondary video use, each illustrated as 1/2, total 5/10. Unknown/conditional exposure does not establish harmful data use. User Control uses a separately disclosed illustrative rubric totaling 8/10. Both stay fixed when permissions change.

The evidence panel distinguishes observed prototype functions, illustrative assumptions and unverified real-product/account status. These codes need research-team review and product evidence before formal study use. No claim of actual manufacturer video access, encryption, processing location, cloud subscription or secondary video use is inferred. All video previews, people and visits are simulated.

The eufy demo's reference today is **21 October 2026**, so yesterday means **20 October**, not the user's wall clock. Access History opens on its existing default date: users must choose 20 October or press Previous day. Date filtering is not silently added to the existing router. Camera routes retain the group's simulated verification behavior.

## Verification

Run the meaningful routing/content tests with Node 22+:

```sh
node --test tests/search.test.mjs
```

Manual exhibit checks:

1. Search the examples above and inspect both answers and destinations.
2. Follow Continue in eufy into Access History and both member permissions; return using Back and verify the question remains.
3. Check both camera routes (including the original verification behavior), Services, Messages and Notifications.
4. Click journey stages, score cards, evidence links and Data Flow nodes. Repeat on mobile.
5. Serve from the repository root and from a parent directory under `/DECO7380_CCTV/`; links must retain the repository prefix.
6. On GitHub Pages after merge, open the root platform and its linked `prototype/#…` destinations. URL resolution tests cover the production prefix, but they do not prove deployment of unmerged code.

Implementation: `index.html`, `privacy/style.css`, `privacy/app.js`, `privacy/knowledge.js`. Existing simulated people and visits are read from `prototype/history/data.js`, not duplicated. See [the group's original prototype documentation](prototype/README.md).

## Latest eufy entry integration

Synced with main commit ff3a0e9 (animated pre-login Privacy Agreement). The general eufy entry opens agreement/; targeted action/review searches retain existing prototype hash routes. Agreement/consent questions link to the new explanation. Agreement source is preserved unchanged from the group commit. No agreement is automatically accepted.

## Visual privacy interface

Exposure uses five interactive vector scenes, a 5/10 ring and one selected-factor explanation. Controls show people and four visibility illustrations; Data Flow uses a branching local/optional-cloud/copy map; Review uses a seeded visit timeline. Evidence and extended search explanations are collapsed by default. The diagrams explain the demo without reproducing eufy controls. All settings/actions still open the existing eufy prototype. Original SVG illustrations are implemented in privacy/visuals.js.
