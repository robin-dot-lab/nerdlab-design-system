# @robin-dot-lab/mail

Mail components for the **Nerdlab Candy** design system: a message list, the head of a message, a safe email viewer, attachments and disposable-address cards. Built on `@robin-dot-lab/react`; every style is in the skin (`@robin-dot-lab/css-candy`), none ships with this package.

## Install

Published on GitHub Packages. Two lines of configuration, in two places:

```ini
# .npmrc in your project (commit it): where the scope lives
@robin-dot-lab:registry=https://npm.pkg.github.com
```

```ini
# ~/.npmrc, your user-level config (never commit it): a GitHub token with the read:packages scope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```sh
pnpm add @robin-dot-lab/mail @robin-dot-lab/react @robin-dot-lab/css-candy
```

## Usage

```tsx
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import { EmailViewer, MessageHeader, MessageList } from '@robin-dot-lab/mail';

<MessageList messages={messages} selectedId={id} onSelectionChange={setId} shortcuts />
<MessageHeader subject={m.subject} from={m.from} to={m.to} date={m.date} onDelete={remove} />
<EmailViewer html={m.html} text={m.text} source={m.raw} />
```

| Component | What it does |
|---|---|
| `MessageList`, `MessageListItem` | a React Aria ListBox of messages: one selected, ↑/↓, type-ahead, optional j/k from the page (never while typing in a field), skeletons while loading, an empty state |
| `MessageHeader` | subject, From / To / Date, delete and view-source actions |
| `EmailViewer` | HTML / Text / Source tabs. The HTML renders in `<iframe srcdoc sandbox>` without `allow-scripts`, `allow-same-origin` or `allow-forms`, with a CSP injected into the document (`default-src 'none'; style-src 'unsafe-inline'; img-src data: cid:`). Remote images are not requested until “Show images”; links open in a new tab with `noopener noreferrer`. The frame's height comes from the skin: a sandboxed document cannot be measured |
| `AttachmentChip`, `AttachmentList` | icon by MIME type, size in the locale, a download link named after the file |
| `AddressCard` | a disposable address to copy, its unread count, time left and state in words, and an actions menu |

Words and formats follow React Aria's locale, like the rest of the kit: `<I18nProvider locale="fr-FR">` from `@robin-dot-lab/react` (French for French locales, English otherwise). Components that take functions (`onSelectionChange`, `onAction`…) are client components: in a React Server Component tree, render them from a client component.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
