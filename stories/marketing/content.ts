/**
 * Every word on happyproto.at.
 *
 * This file is the source of truth. happyproto.at/src/content.ts is a verbatim
 * copy: change it here, then copy it over. Claims are limited to HappyView
 * facts that can be checked in its docs (happyview.dev; the v3 track), the
 * owner-confirmed facts below, and the earlier owner facts (testers from the
 * waitlist, the $10 a month target, moving a self-hosted instance). Never
 * invent one.
 *
 * Owner-confirmed claims (v8, 2026-10-14; the owner's claims list, updated
 * by owner round 3 the same day):
 * - Deployment: visitors get HappyView v3 when they sign up. Every feature
 *   is stated as present (MCP included); never write "coming with v3" or
 *   date a feature to v3 in any other way.
 * - atproto spaces: v3 renames Spaces to "atproto spaces" (permissioned
 *   data) and enables them by default (the page no longer says "on by
 *   default").
 * - Languages: scripts can be written in Lua, JavaScript and TypeScript
 *   today; Rust, Go, Zig, C/C++ and more are on the way.
 * - MCP: your agents can manage your AppView through MCP.
 * - Network size: 46 million accounts, the low end of Bluesky's published
 *   figures, written "46 million".
 * - Sign-in: atproto OAuth is set up for you.
 * - Backups: a snapshot before every upgrade.
 * - Contact: support@happyproto.at (owner-provided), in the FAQ's email
 *   answer, as a mailto link; Bluesky stays the route everywhere else.
 * - Dates: an invite-only beta starts around the end of October, and
 *   launch is targeted for November.
 * - Moving: a tool to make migrating a self-hosted instance painless is in
 *   the works.
 * - Not to be said: auth plugins, Steam, Xbox or itch.io; nothing names or
 *   digs at another project. The maintainer credential and the release
 *   count are gone (the owner: they don't matter). Custom domains, an
 *   export tool and backups are never listed as "not ready".
 *
 * Owner round 3: the samples moved from Statusphere to Standard.Site, whose
 * real lexicons are site.standard.publication, site.standard.document,
 * site.standard.graph.subscription and site.standard.graph.recommend
 * (published by standard.site's lexicon authority; their fields are the
 * records' real field names: a publication's `url` and `name`; a
 * document's `site`, `title` and `publishedAt`; a subscription's
 * `publication`; a recommendation's `document`). No query exists under
 * site.standard, so the sample app's own is `com.example.listDocuments`,
 * on the sample host `your-app.hpy.at`. Every DID, key, title and count is
 * a sample.
 *
 * v8 (sell the backend, not the hosting): the page says what you can build
 * and what you get, to developers who aren't backend people and to people
 * drawn to atproto. The hero ("Build on atproto without the hard
 * parts.", one line, the form and the product stage, a sample
 * HappyView view built in HTML); then four points, one per section, like
 * slides, each a headline, one line and one `Sample` panel that proves it
 * (01 Data, 02 Sign-in, 03 Private data, 04 Your code); then a short
 * unnumbered section for the atproto crowd, the FAQ and the close. Sample
 * panels show only what HappyView really does, as documented: no customer
 * names, no performance, uptime or latency figures. The $10 target is said
 * in the FAQ and in the close's line, written "$10 a month"; the dates only
 * in the FAQ's "When will it open?".
 *
 * The voice is the product's (v3): the subject is HappyProto, HappyView or
 * "you". No "I", "me", "my", "we", "us" or "our" anywhere: not in the copy,
 * the meta, alt text or accessible names. The FAQ's questions are one
 * exception, being in the reader's voice ("Can I leave?"); the FAQ's email
 * answer is the other (owner round 3: the owner's own words, verbatim,
 * "We’ll send…"). Nothing else implies a team, and no person is named.
 *
 * v7 (the infrastructure look): each point has an `eyebrow`, a small mono
 * label above its headline, its number and its subject. Labels, not claims.
 * They are aria-hidden on the page, so they add nothing to a heading's or a
 * landmark's name. Only the four points are numbered (01 to 04): the crowd's
 * section, the FAQ and the hero carry none.
 *
 * `{name}` in a string is a slot, filled by the renderer: a link from the
 * string's `links`, or an address.
 */

export type SignupState =
  | "idle"
  | "submitting"
  | "success"
  | "invalid"
  | "unavailable";

/** What the status line can say: a form state, or one of the invalid state's other messages. */
export type SignupMessage =
  | SignupState
  | "empty"
  | "noAt"
  | "domain"
  | "rejected";

export type Link = { label: string; href: string };

const BLUESKY = {
  label: "@happyproto.at",
  href: "https://bsky.app/profile/happyproto.at",
};
/** Owner round 7: the community, linked wherever the page says where to ask or what to do next. */
const DISCORD = {
  label: "HappyProto Discord",
  href: "https://discord.gg/Cbt6EVthyQ",
};
/** Owner round 3: the contact address, in the FAQ's email answer only. */
const SUPPORT = {
  label: "support@happyproto.at",
  href: "mailto:support@happyproto.at",
};
/**
 * The next step after a join: HappyView's quickstart (owner round 3: the
 * Statusphere tutorial it replaced named the old example app in its label
 * and its address).
 */
const TUTORIAL = {
  label: "HappyView quickstart",
  href: "https://happyview.dev/getting-started/quickstart",
};

export const meta = {
  title: "HappyProto: the backend for atproto apps",
  description:
    "Build on atproto without the hard parts. HappyProto runs the backend: an API over 46 million atproto accounts, with sign-in, private data and scripting included.",
  url: "https://happyproto.at/",
  image: {
    url: "https://happyproto.at/og.png",
    width: 1200,
    height: 630,
    alt: "Build on atproto without the hard parts. Under it, a sample HappyView instance at your-app.hpy.at: three lexicons, and a listDocuments query returning a publication’s documents.",
  },
};

export const header = {
  logoAlt: "HappyProto",
  nav: "Primary",
  /** Visually hidden until focused; lands on <main id="main" tabindex="-1">. Works without JavaScript. */
  skip: { label: "Skip to content", href: "#main" },
  faq: { label: "FAQ", href: "#faq" },
  /**
   * A primary button (the form buttons' style), before FAQ, so FAQ is always at the far
   * right. Moves focus to the nearer form's email field: the hero's, until
   * the reader is past the midpoint between the two forms, then the closing
   * one's (`href` follows). Its slot is always held,
   * but it shows only while neither form is in view (counting the part under
   * the sticky header as out of view), and not after a join; hidden without
   * JavaScript, like the form. The logo, this and FAQ share one row from
   * 320px. Its accessible
   * name starts with the visible label (WCAG 2.5.3) and says where it goes.
   */
  join: {
    label: "Join the beta",
    name: "Join the beta: go to the signup form",
    href: "#join",
  },
};

export const hero = {
  /**
   * The page's one H1, at the display size (owner, 2026-10-16: the
   * tagline): one sentence, no middle punctuation (social posts write it
   * "Build on atproto… without the hard parts."). Still a `.mk-title-part`
   * via `sentences()`, balanced over two lines at 1440.
   */
  title: "Build on atproto without the hard parts.",
  /**
   * The one line of value: who does what (the old H1's "HappyProto runs
   * the backend", now that the H1 is the tagline), then what you get.
   * "46 million" is the owner's network-size claim (the low end of
   * Bluesky's published figures); the API over the network is 01's, and
   * auth (sign-in), private data and scripting are the points 02, 03 and
   * 04 prove (feedback round 1: the painkillers first, so sign-in moved up
   * to 02). Feedback round 1: the painkillers (the API, auth) lead, the
   * vitamins follow. "atproto" is left to the H1 right above it, which
   * keeps the page under its word budget.
   */
  sub: "HappyProto runs the backend: an API over 46 million accounts, auth, private data, and scripting.",
  /** The hero form's id, so the page can be linked to it. */
  anchor: "join",
  /** The hero form's accessible name (a form landmark). The hero form has no helper: its status line is empty at rest. */
  formName: "Join the beta",
  /**
   * Round 5: a small muted line right under the hero form, on the first of
   * the hero status line's reserved lines (empty at rest), so the stage
   * doesn't move; it gives way while the status line has something to say
   * (marketing.css). Critique round 10: the email promise's short form (the
   * closing helper keeps the whole sentence, so the two never repeat word
   * for word). v8: the promise alone; the maintainer credit and the
   * release count went (the owner: they don't matter). Owner round 6: the
   * whole promise, in the owner's words, with what the address is never
   * used for.
   */
  credit: {
    promise:
      "We’ll only email to let you know that HappyProto is open, or that you were chosen for the closed beta. Your email is never shared or used outside of that.",
  },
};

/**
 * A piece of sample code or UI text with its colour: `key` and `kw` in the
 * accent, `str` in the second accent's ink, `punc` and `num` (line numbers)
 * muted, `emoji` in its own colours, `plain` in the ink.
 */
export type TokenKind = "key" | "str" | "punc" | "kw" | "emoji" | "plain";
export type Token = [TokenKind, string];
/** One line of sample code: its tokens, in order (its indent is a `plain` token). */
export type Line = Token[];

/**
 * A window's code under 30rem (round 1): the lines from `from` up to (not
 * including) `to` give way to `lines`, so a phone shows fewer records, or a
 * long line set over several, instead of cutting them. Both versions are in
 * the markup; CSS shows one.
 */
export type NarrowLines = { from: number; to: number; lines: Line[] };

/**
 * Where a long value in a window may break on a phone (round 1): after
 * each `/` (a path, an at:// URI) and after the `T` of a timestamp. The
 * pieces, in order; joined, they are the text again. Wider, nothing wraps.
 */
export function softBreaks(text: string): string[] {
  return text
    .split(/(?<=.\/)(?!\/)|(?<=\dT)(?=\d)/)
    .filter((piece) => piece !== "");
}

/**
 * The sample documents in the hero's listDocuments response (owner round 3):
 * three `site.standard.document` records of one publication, each with its
 * record's real `title` and `publishedAt`. Partial DIDs and record keys: no
 * real account is named.
 */
const DOCUMENTS = [
  {
    did: "did:plc:4hm…",
    rkey: "3m3kq…",
    title: "A field guide to moss",
    publishedAt: "2026-10-13T09:41:07Z",
  },
  {
    did: "did:plc:4hm…",
    rkey: "3m3kn…",
    title: "Notes from the autumn count",
    publishedAt: "2026-10-11T16:20:44Z",
  },
  {
    did: "did:plc:4hm…",
    rkey: "3m3kf…",
    title: "Reading the tide tables",
    publishedAt: "2026-10-08T08:05:31Z",
  },
];

/** The listDocuments response as lines of tokens, in the shape HappyView's XRPC API documents for a list query: `records` (each `uri`, then the record's `title` and `publishedAt`), then `cursor`. */
function responseLines(): Line[] {
  const lines: Line[] = [
    [["punc", "{"]],
    [
      ["plain", "  "],
      ["key", '"records"'],
      ["punc", ": ["],
    ],
  ];
  DOCUMENTS.forEach((r, i) => {
    lines.push(
      [
        ["plain", "    "],
        ["punc", "{"],
      ],
      [
        ["plain", "      "],
        ["key", '"uri"'],
        ["punc", ": "],
        ["str", `"at://${r.did}/site.standard.document/${r.rkey}"`],
        ["punc", ","],
      ],
      [
        ["plain", "      "],
        ["key", '"title"'],
        ["punc", ": "],
        ["str", `"${r.title}"`],
        ["punc", ","],
      ],
      [
        ["plain", "      "],
        ["key", '"publishedAt"'],
        ["punc", ": "],
        ["str", `"${r.publishedAt}"`],
      ],
      [
        ["plain", "    "],
        ["punc", i === DOCUMENTS.length - 1 ? "}" : "},"],
      ],
    );
  });
  lines.push(
    [
      ["plain", "  "],
      ["punc", "],"],
    ],
    [
      ["plain", "  "],
      ["key", '"cursor"'],
      ["punc", ": "],
      ["str", '"MjAyNi0xMC0wOFQw…"'],
    ],
    [["punc", "}"]],
  );
  return lines;
}

/**
 * The hero's product stage: a sample HappyView instance, built in HTML (not a
 * screenshot), in a window with three dots, a URL and a `Sample` chip. Owner
 * round 3: a Standard.Site reader on the sample host `your-app.hpy.at`. Its
 * three lexicons (the dashboard's Lexicons list shows each one's NSID, its
 * type and its script's language, v8: TypeScript, as in point 04; a record
 * lexicon is backfilled): Standard.Site's publication and document record
 * lexicons and the app's own `com.example.listDocuments` query, answering
 * 200 with a publication's documents. (Its graph lexicons, subscription
 * and recommend, are left out: five rows made the list far taller than the
 * response on a tablet.) A status strip (`footer`; round 3: in the window's bar, so the
 * count ticks in the first screen): Jetstream connected (HappyView logs
 * `jetstream.connected`) and the records indexed (`total_records` in the
 * admin stats), a count that ticks up as the stage plays; it sits inside the
 * Sample window and implies no real figure.
 *
 * Round 2: the stage plays "define your data, query your API" once, in `play`'s timeline (ms from the moment it starts):
 * the lexicons arrive in the list, the documents' backfill runs
 * through its documented states (the job's `pending` stage, then the
 * dashboard's "Discovering repos" and "Fetching records" phases, see
 * features.data's sources) while the indexed count ticks, then the
 * request lands, then its 200, then the records a line at a time. Settled
 * (reduced motion, no JavaScript, print) it is the finished state.
 *
 * The whole stage is one image to assistive technology (`role="img"`, named
 * by `name`): its code is never read out line by line.
 */
export const stage = {
  name: "Sample HappyView instance at your-app.hpy.at: three lexicons, and a listDocuments query returning a publication’s documents.",
  url: "your-app.hpy.at",
  sample: "Sample",
  lexicons: {
    title: "Lexicons",
    /** Under 48rem the list becomes a strip of each NSID's last part, the queried one marked. */
    rows: [
      {
        nsid: "site.standard.publication",
        type: "record",
        meta: "Backfill complete",
        done: true,
      },
      {
        nsid: "site.standard.document",
        type: "record",
        meta: "Backfill complete",
        done: true,
        playing: ["Backfill pending", "Discovering repos", "Fetching records"],
      },
      {
        nsid: "com.example.listDocuments",
        type: "query",
        script: "TS",
        meta: "GET",
        done: false,
      },
    ] as {
      nsid: string;
      type: "record" | "query" | "procedure";
      script?: string;
      meta: string;
      done: boolean;
      playing?: string[];
    }[],
    add: "Add Lexicon",
  },
  request: {
    method: "GET",
    path: "/xrpc/com.example.listDocuments",
    status: "200",
    statusText: "OK",
  },
  response: responseLines(),
  /** Under 30rem: one record (the last), not three, so each value can be read whole. */
  responseNarrow: { from: 2, to: 12, lines: [] } as NarrowLines,
  footer: {
    jetstream: "Jetstream",
    connected: "connected",
    indexed: "Records indexed",
    /** The count the stage settles on, and where its tick starts (round 2: none yet, the backfill fills it; play.ts holds the settled width, so it never reflows). */
    count: 48_213_906,
    from: 0,
  },
  /**
   * The stage's play, in ms from its start (round 2, about 4s; round 5,
   * about 2.3s). The record lexicon's statuses (its `playing` ones, then its
   * `meta`) change at `backfill`; the indexed count ticks over `tick` (while
   * records are fetched); the request lands at `request`, its 200 at `ok`,
   * and the response's first line at `response`, the rest `gap` apart. The
   * lexicons arrive `lexicon` apart from the start (in the list; a phone's
   * strip arrives as one). Round 5: brought forward so the response pane is
   * never an empty box for long at the fold: the request lands while the
   * records are still being fetched (the backfill overlaps it), the backfill
   * completes just before the 200 (sent at 1.2s, landed by about 1.5s), the
   * first record has landed by about 1.7s, and the last line by about 2.2s.
   *
   * Critique round 8: the request at 940 (it was 950), so it has landed
   * (940 + its 260ms) by the moment its 200 is sent: at 950 the 200 began
   * its wipe 10ms before the request had finished landing. The response
   * pane is never empty: every line's number and the response's `open`
   * opening line(s), its `{`, are there from the first frame; the lines
   * after them arrive from `response`, as before.
   */
  play: {
    lexicon: 150,
    backfill: [400, 700, 1150],
    tick: [700, 1150],
    request: 940,
    ok: 1200,
    response: 1350,
    gap: 30,
    open: 1,
  },
};

/** A number as the panels write it: thousands apart by commas ("48,213,906"). Owner round 6: the samples' figures are network-sized, millions where they fit. */
export function figure(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * The four points after the hero (v8), one per section: a headline, one
 * line and one `Sample` panel that proves it, in the hero stage's window.
 * Each panel is one image to assistive technology (`role="img"`, named by
 * its `name`). Panels and lines show only documented HappyView behaviour or
 * the owner-confirmed claims (see the top of this file). The order is what
 * an app needs: data (01), private data (02), sign-in (03), your own code
 * (04).
 */
export const features = {
  /**
   * Sources (happyview.dev, guides/backfill.md and admin/backfill.md): a
   * record lexicon joins the Jetstream subscription and starts a backfill
   * job, which discovers repos through the relay and fetches their records
   * from each one's PDS. A job's `stage` is `pending`, `discovering_repos`,
   * `resolving_and_fetching`, then `completed`; its counters are
   * `total_repos`, `processed_repos` and `total_records`. The dashboard
   * names the phases "Discovering repos", "Resolving PDS" and "Fetching
   * records". The numbers are a sample. The line (owner round 3, verbatim):
   * you define your data types (lexicons) to pull in history from across
   * the network (backfill), then Jetstream brings new records as they are
   * written. Owner round 3: the job is Standard.Site's documents.
   *
   * Critique round 6: three parts, in the dashboard's words only (no raw
   * `stage` value anywhere): the job's head (its title, the collection and
   * a badge), its two working stages, and one row of counters. Jetstream,
   * connected, is said in the window's bar (as on the hero's stage). The
   * badge reads "Running" until the last stage ticks, then "Completed", on
   * the frame the counters settle. Records settle on the hero's own count
   * (`total_records`, "Records indexed" 1,284) for the same instance and
   * collection. It plays within moments of coming into view: the head lands
   * at once, the counters row at 150ms, discovery ticks at about 0.6s, the
   * counters run from then until the fetch ticks and the badge flips at
   * about 2.2s; all landed by 2.3s.
   */
  data: {
    id: "data",
    eyebrow: "01 · Data",
    title: "All the data. None of the plumbing.",
    line: "Define your data types to pull in history from across the network, then get new records in real time.",
    name: "Sample backfill job for site.standard.document: Jetstream connected, repos discovered, records fetched, and the job completed.",
    /** Round 7: the panel's bar, a breadcrumb into the instance (the dashboard's section name). A UI label, not a claim. */
    crumb: ["your-app", "Backfill"],
    jetstream: { label: "Jetstream", state: "connected" },
    job: {
      title: "Backfill",
      collection: "site.standard.document",
      /** The badge: `running` until the last stage ticks, then `done` for good (settled, only `done` shows). */
      status: { running: "Running", done: "Completed" },
      stages: [
        { id: "discovering_repos", label: "Discovering repos", at: 450 },
        {
          id: "resolving_and_fetching",
          label: "Resolving PDS, fetching records",
          at: 2050,
        },
      ],
      /** When the counters row lands, and when its figures start ticking (discovery half landed). */
      countersAt: 150,
      tickFrom: 580,
      counters: [
        {
          field: "processed_repos",
          label: "Repos",
          value: 1_284_517,
          from: 0,
          of: 1_284_517,
        },
        {
          field: "total_records",
          label: "Records",
          value: stage.footer.count,
          from: 0,
        },
      ] as {
        field: string;
        label: string;
        value: number;
        from: number;
        of?: number;
      }[],
    },
  },
  /**
   * Owner claim: v3 names Spaces "atproto spaces" (permissioned data) and
   * enables them by default. Sources for everything in the panel
   * (happyview.dev, experimental/spaces/): a space is identified by its
   * authority's DID (HappyView's service identity, so `did:web:` and the
   * instance's host), its type (an NSID) and its space key (`skey`), and has
   * a `displayName`; its read and write policies default to the member
   * list ("member-list", `memberListPolicy`); each member holds two flags,
   * `read` and `write`, and the creator is added with both; an invite
   * grants `access` (by default `read` only) up to `maxUses` times and
   * counts its `uses`, and accepting one makes the account a member; a
   * space record's at:// URI carries a `space` segment (space type, skey,
   * author, collection, rkey), apart from public records. The admin API's
   * space view lists `members` and `collections`. The flag is
   * `feature.spaces_enabled`: "enabled" in the bar is v3's default. The
   * space (owner round 3: "Editors", `com.example.editors`, where a
   * publication's editors keep a draft `site.standard.document` before it
   * is published), its members (the hero's partial DIDs) and the record are
   * a sample.
   *
   * It acts out an invite once (`play`, ms from its start): the space's
   * head, then its two members, then the invite; the invite is used (its
   * uses tick 0 to 1) and a third member lands with read access only (the
   * invite's default), the members' count ticking 2 to 3; then the record in
   * the space. All landed by about 1.9s. Settled: three members, the invite
   * used once.
   */
  spaces: {
    id: "spaces",
    eyebrow: "03 · Private data",
    title: "Private data, today.",
    line: "atproto spaces keep permissioned data next to public records.",
    name: "Sample atproto space on your-app: three members with their read and write access, an invite used once, and a draft document kept in the space.",
    /** The panel's bar, a breadcrumb into the instance. A UI label, not a claim. */
    crumb: ["your-app", "Spaces"],
    /** The bar's status: the feature's v3 name, enabled (v3's default). */
    enabled: { label: "atproto spaces", state: "enabled" },
    space: {
      name: "Editors",
      type: "com.example.editors",
      skey: "main",
      policy: "member list",
    },
    access: { read: "read", write: "write" },
    members: {
      title: "Members",
      /** The count before the invite is used; settled, the number of rows. */
      from: 2,
      rows: [
        { did: "did:plc:4hm…", read: true, write: true, creator: true },
        { did: "did:plc:q2x…", read: true, write: true },
        { did: "did:plc:z7c…", read: true, write: false, invited: true },
      ] as {
        did: string;
        read: boolean;
        write: boolean;
        creator?: boolean;
        invited?: boolean;
      }[],
      creator: "creator",
    },
    invites: {
      title: "Invites",
      label: "Invite",
      read: true,
      write: false,
      uses: 1,
      from: 0,
      maxUses: 10,
      unit: "uses",
    },
    records: {
      title: "Records",
      collection: "site.standard.document",
      /** The draft's `title` (the record's real field). */
      doc: "The winter count",
      /** The record's at:// URI, its `space` segment marked. */
      uri: {
        before: "at://did:web:your-app.hpy.at/",
        segment: "space",
        after:
          "/com.example.editors/main/did:plc:4hm…/site.standard.document/3m3kz…",
      },
    },
    play: {
      members: 120,
      invites: 420,
      used: [1000, 1150],
      joined: 1150,
      counted: [1150, 1300],
      records: 1500,
      gap: 60,
    },
  },
  /**
   * Owner claim: atproto OAuth is set up for you (owner round 3: the point
   * is how easy it is, not that it works). Sources
   * (happyview.dev, guides/api-clients.md, getting-started/authentication.md
   * and the browser SDK): an API client represents your app; each has an
   * `hvc_`-prefixed client key, a type (`confidential` or `public`), allowed
   * origins (public clients) and scopes (`atproto` always included). The
   * dashboard's API Clients page registers one. A user signs in with their
   * atproto handle (`signIn("alice.bsky.social")`, the docs' example): it is
   * resolved to a DID, the user authorizes at their own PDS, and the session
   * is registered with HappyView. The client's name, key and origin are a
   * sample (the key is the docs' `hvc_a1b2c3…`); the DID is the hero's
   * first status author's. No auth plugin and no third-party login.
   *
   * It plays once: the client and its fields, then the sign-in (the handle
   * in its field, the button), then the three steps tick in turn. All
   * landed by about 2.1s.
   */
  signin: {
    id: "sign-in",
    eyebrow: "02 · Sign-in",
    title: "Sign-in, minus the OAuth work.",
    line: "atproto OAuth is set up for you. People log in with the account they already have.",
    name: "Sample API client for your-app: a public client with its hvc_ client key, allowed origin and atproto scope, then a sign-in with an atproto handle: the handle resolved, authorized at the PDS, and the session registered.",
    /** The panel's bar, a breadcrumb (the dashboard's API Clients page). A UI label, not a claim. */
    crumb: ["your-app", "API Clients"],
    client: {
      name: "your-app web",
      type: "public",
      fields: [
        { label: "Client key", value: "hvc_a1b2c3…" },
        { label: "Allowed origins", value: "https://example.com" },
        { label: "Scopes", value: "atproto" },
      ],
    },
    signIn: {
      label: "Sign in with your atproto handle",
      handle: "alice.bsky.social",
      button: "Sign in",
    },
    steps: [
      {
        id: "resolved",
        label: "Handle resolved",
        detail: "did:plc:4hm…",
        at: 950,
      },
      { id: "authorized", label: "Authorized at their PDS", at: 1400 },
      { id: "session", label: "Session registered", at: 1850 },
    ] as { id: string; label: string; detail?: string; at: number }[],
    play: { signIn: 520 },
  },
  /**
   * Owner claim: scripts can be written in Lua, JavaScript and TypeScript
   * today; Rust, Go, Zig, C/C++ and more are on the way. Sources for the handler
   * (happyview.dev, api-reference/lua/script-contract.md, the v3 contract;
   * and the TypeScript interpreter plugin's README, which runs it): a script
   * defines one `handle(input, ctx)`, the module's default export in
   * JavaScript and TypeScript; it reaches libraries by import
   * (`happyview.db`); `ctx.collection` is the lexicon's target collection
   * and `input` a query's parameters, strings unless the lexicon types them;
   * `db.records(collection)` chains `where(field, op, value)`, `limit` and
   * `cursor` (a step given undefined is skipped) and `run()` answers
   * `{ records, cursor }` (api-reference/lua/libraries.md). Owner round 3:
   * the app's listDocuments query, its documents filtered by their `site`
   * (the publication's at:// URI, the document record's real field). Types
   * are erased, not checked; HappyView declares none, so the script names
   * the shapes it reads. Language names are written out in the line and
   * short in the panel (TS, JS), as an editor shows them.
   */
  code: {
    id: "code",
    eyebrow: "04 · Your code",
    title: "Your logic, your language.",
    line: "Write your scripts in TypeScript, JavaScript, or Lua. Rust, Go, Zig, C/C++, and many more are on the way.",
    name: "Sample TypeScript handler for com.example.listDocuments, which lists a publication’s documents with db.records, and the script languages: TypeScript, JavaScript and Lua, with Rust, Go, Zig and C/C++ coming soon.",
    /** Round 7: the panel's bar, a breadcrumb (the dashboard's Lexicons section, then the lexicon). A UI label, not a claim. */
    crumb: ["your-app", "Lexicons", "listDocuments"],
    file: { nsid: "com.example.listDocuments", type: "query", lang: "TS" },
    code: [
      [
        ["kw", "import"],
        ["plain", " db "],
        ["kw", "from"],
        ["plain", " "],
        ["str", '"happyview.db"'],
        ["punc", ";"],
      ],
      [],
      [
        ["kw", "export"],
        ["plain", " "],
        ["kw", "default"],
        ["plain", " "],
        ["kw", "function"],
        ["plain", " "],
        ["key", "handle"],
        ["punc", "("],
      ],
      [
        ["plain", "  input"],
        ["punc", ": { "],
        ["plain", "publication"],
        ["punc", ": "],
        ["kw", "string"],
        ["punc", "; "],
        ["plain", "cursor?"],
        ["punc", ": "],
        ["kw", "string"],
        ["punc", " },"],
      ],
      [
        ["plain", "  ctx"],
        ["punc", ": { "],
        ["plain", "collection"],
        ["punc", ": "],
        ["kw", "string"],
        ["punc", " },"],
      ],
      [["punc", ") {"]],
      [
        ["plain", "  "],
        ["kw", "return"],
        ["plain", " db"],
      ],
      [
        ["plain", "    "],
        ["punc", "."],
        ["plain", "records"],
        ["punc", "("],
        ["plain", "ctx.collection"],
        ["punc", ")"],
      ],
      [
        ["plain", "    "],
        ["punc", "."],
        ["plain", "where"],
        ["punc", "("],
        ["str", '"site"'],
        ["punc", ", "],
        ["str", '"="'],
        ["punc", ", "],
        ["plain", "input.publication"],
        ["punc", ")"],
      ],
      [
        ["plain", "    "],
        ["punc", "."],
        ["plain", "limit"],
        ["punc", "("],
        ["plain", "20"],
        ["punc", ")"],
      ],
      [
        ["plain", "    "],
        ["punc", "."],
        ["plain", "cursor"],
        ["punc", "("],
        ["plain", "input.cursor"],
        ["punc", ")"],
      ],
      [
        ["plain", "    "],
        ["punc", "."],
        ["plain", "run"],
        ["punc", "();"],
      ],
      [["punc", "}"]],
    ] as Line[],
    /** The languages a script can be written in: the three today, the file's own marked; then the ones on the way (owner round 3: C/C++ joins them). */
    languages: {
      title: "Languages",
      ready: ["TS", "JS", "Lua"],
      soon: ["Rust", "Go", "Zig", "C/C++"],
      soonLabel: "soon",
    },
  },
};

/**
 * Other features (v8; feedback round 1 retitled it from "For the atproto
 * crowd", which every reader already is): a short, unnumbered section after the four
 * points, framed like them but with no window, for readers who already
 * know atproto. Four terse items, a bold label and a few words each.
 * Sources: network lexicons are fetched by NSID and kept up to date through
 * the Jetstream subscription (guides/lexicons.md, "Network lexicons"); a
 * backfill can target any record lexicon, discovering repos through the
 * relay and fetching from each one's PDS (guides/backfill.md); a snapshot
 * before every upgrade (the spec claims list, once the Upgrades point); and
 * MCP for your agents (owner claim). Owner round 3: each item's words are
 * the owner's, verbatim; Backups replaces Snapshots.
 */
export const crowd = {
  id: "atproto",
  title: "Other features",
  items: [
    {
      label: "Network lexicons",
      text: "resolved from the network and kept up-to-date.",
    },
    { label: "Any collection", text: "backfill from across the network." },
    {
      label: "Backups",
      text: "snapshots before every upgrade, for peace of mind.",
    },
    { label: "MCP", text: "your agents can manage your AppView, too." },
  ],
};

/**
 * `{email}` and `{bluesky}` are slots, filled by the renderer: the address
 * with textContent only, the link as a real <a>. The button label stays the
 * same while submitting; progress is said in the status line. `empty`, `noAt`
 * and `domain` are the invalid state's messages for a blank field, an address
 * with no @, and one whose part after the @ can't be a domain; `invalid`
 * covers everything else the page itself catches (spaces, a bad part before
 * the @). `rejected` is the server turning down an address the page let
 * through (code 22023), with a way to get in touch.
 */
export const signup = {
  label: "Email address",
  placeholder: "you@example.com",
  /**
   * The follow-up, shown only after a successful join: an optional note sent
   * with the same address. `join_waitlist()` attaches it to the existing row.
   */
  note: {
    label: "Tell us about what you’re building",
    /**
     * Owner round 6: the limit is a counter under the field, right-aligned
     * ("{count}/{max}" on screen, the long form for screen readers), in
     * place of the label's "(optional, 280 characters)". join_waitlist()
     * clamps to the same length.
     */
    max: 500,
    count: "{count}/{max}",
    countName: "{count} of {max} characters",
    button: "Send",
    sending: "Sending…",
    sent: "Got it, thanks.",
    unavailable: "Your note didn’t save. Try again in a minute.",
  },
  button: "Join the beta",
  trapLabel: "Leave this empty",
  /** Shown under each form when JavaScript is off. */
  noscript:
    "The form needs JavaScript. You can follow {bluesky} on Bluesky for launch news instead.",
  links: { bluesky: BLUESKY },
  /**
   * After a join: a heading, which takes focus (the status line, a live
   * region, says the rest). Together they read "You’re on the waitlist.
   * We’ll send an email to {email} when HappyProto opens, or sooner if
   * you’re selected for the closed beta." (owner round 6, verbatim).
   */
  joined: "You’re on the waitlist.",
  /**
   * The one next step after a join, once per form: under the follow-up
   * (so under "You’re on the waitlist." while the note is unsent or
   * skipped, and right under "Got it, thanks." once it is sent).
   */
  next: {
    text: "While you wait, try the {tutorial} or join the {discord}.",
    links: { tutorial: TUTORIAL, discord: DISCORD },
  },
  /**
   * `idle` is the closing form's helper, under the button. The hero form has
   * none: its status line is empty at rest. It is the email promise (the
   * FAQ's "What happens to my email?"). Critique round 6: the $10 target,
   * added here in round 5, moved up into the close's own line (`cta.line`).
   * Owner round 6: the hero credit now says the promise in full, in the
   * owner's words; this short form stays, so the two forms never repeat
   * each other word for word.
   */
  status: {
    idle: "One email when it opens, or a beta invite sooner.",
    submitting: "Adding you to the waitlist…",
    success:
      "We’ll send an email to {email} when HappyProto opens, or sooner if you’re selected for the closed beta.",
    invalid: "Check the address for typos.",
    rejected:
      "That address couldn’t be accepted. Check it for typos, or message {bluesky} on Bluesky.",
    unavailable:
      "Your address didn’t save. It’s safe to try again, or message {bluesky} on Bluesky.",
    empty: "Enter your email address.",
    noAt: "Add an @ and a domain, like you@example.com.",
    domain: "Check the part after the @, like example.com.",
  } satisfies Record<SignupMessage, string>,
};

/** The note's counter for `count` characters typed: what it shows, and what a screen reader hears (owner round 6). */
export function noteCount(count: number): { text: string; name: string } {
  const fill = (t: string) => t.replace("{count}", String(count)).replace("{max}", String(signup.note.max));
  return { text: fill(signup.note.count), name: fill(signup.note.countName) };
}

/** One piece of a template: plain text, or the name of a `{slot}`. */
export type Part = string | { slot: string };

/** Splits a template into text and `{slot}` names, in order. */
export function parts(template: string): Part[] {
  return template
    .split(/(\{\w+\})/)
    .filter((piece) => piece !== "")
    .map((piece) =>
      /^\{\w+\}$/.test(piece) ? { slot: piece.slice(1, -1) } : piece,
    );
}

/** Splits `text` into its sentences (critique round 10: the close's headline sets each on its own line; v8: the H1 too). */
export function sentences(text: string): string[] {
  return text.split(/(?<=[.!?]) +/);
}

/** Addresses longer than this are shortened on screen; the full one is kept for screen readers. */
export const ADDRESS_MAX = 64;

/** The on-screen form of an address: in full up to ADDRESS_MAX, else the first 32 and last 24 characters. */
export function shortAddress(email: string): string {
  return email.length > ADDRESS_MAX
    ? `${email.slice(0, 32)}…${email.slice(-24)}`
    : email;
}

/** Splits a template around `{name}`: the text before it and the text after it. */
export function slot(template: string, name: string): [string, string] {
  const marker = `{${name}}`;
  const at = template.indexOf(marker);
  if (at === -1) return [template, ""];
  return [template.slice(0, at), template.slice(at + marker.length)];
}

/**
 * Short answers, in the v4 brief's order (unchanged in v5) but for round 2,
 * which moved "Can I leave?" last so the FAQ ends on a reassurance. Owner
 * round 3: every answer is the owner's, verbatim, and the second item is
 * "When will it open?" (it was "What isn’t ready yet?"). The questions are in the reader's
 * voice; the email answer is the owner's own (first person, "We’ll send…"),
 * the one answer the voice scan exempts. Answers carry `{slots}` filled from their `links`. Every item has a
 * stable `id`, so it can be linked: each question ends in a small `#`
 * permalink to its own item (`permalink`; its accessible name is `label`
 * with the question in its `{q}`, so each name says where it goes on its
 * own: WCAG 2.4.9, AAA). Where the device can hover, it is out of sight
 * until the item is hovered, the link is focused or the item is the page's
 * target; on touch it always shows, in the muted ink. One column at every
 * width, one item per row, apart by hairlines; from 64rem it sits beside
 * its heading, which stays in view (sticky) as the answers scroll.
 */
export const faq = {
  /** No label (round 2): its heading says it. */
  title: "FAQ",
  anchor: "faq",
  /**
   * Round 5: one help line under the heading, in its cell (it stays in view
   * with the heading from 64rem): where to ask what the answers don't
   * cover, the same @happyproto.at the error messages and the email answer
   * name.
   */
  help: {
    text: "Something else? Ask in the {discord} or {bluesky} on Bluesky.",
    links: { discord: DISCORD, bluesky: BLUESKY },
  },
  permalink: { text: "#", label: "Link to this question: {q}" },
  items: [
    {
      id: "cost",
      q: "What will it cost?",
      a: "The smallest plan is targeted at $10 a month, with usage included and configurable spend caps.",
    },
    {
      /** Owner round 3: the dates (owner claims), in place of "What isn’t ready yet?". */
      id: "open",
      q: "When will it open?",
      a: "An invite-only beta starts around the end of October, and launch is targeted for November.",
    },
    {
      id: "move",
      q: "Can I move my self-hosted instance?",
      /**
       * Round 4: the answer says the move is supported (owner fact: moving a
       * self-hosted instance). Owner round 3: a migration tool is in the
       * works (owner claim).
       */
      a: "Yes. A tool to make the migration painless is in the works.",
    },
    {
      id: "email",
      q: "What happens to my email?",
      /**
       * Owner round 3: the owner's own words, verbatim (first person, the
       * one exemption from the product voice), with the support address
       * (a mailto link) and @happyproto.at (the Bluesky link).
       */
      a: "We’ll send one email to beta invitees, and one email when HappyProto opens. It’s never shared or used otherwise. To delete it, send a message to {support}, or DM {bluesky} on Bluesky.",
      links: { support: SUPPORT, bluesky: BLUESKY },
    },
    {
      id: "leave",
      q: "Can I leave?",
      /** v8: where the open-source fact lives (HappyView's licence, in its repository). Owner round 3: verbatim. */
      a: "Yes. HappyView is MIT-licensed, so you can migrate to your own, self-hosted instance, and your users’ data already lives on their PDSes.",
    },
  ] as { id: string; q: string; a: string; links?: Record<string, Link> }[],
};

/**
 * The close, centred like the hero: its own headline (critique round 10;
 * it was the H1's words again), one line that sums up the page (round 1),
 * and the closing form with its own helper. Its section is a region named
 * by its heading; the form in it is a landmark of its own, named apart
 * from the hero's.
 */
export const cta = {
  /**
   * Critique round 10: the close's own headline, the page's payoff, never
   * the H1 again; it names the close's region. v8: the invitation, in the
   * page's own word for the protocol.
   */
  title: "Start building on atproto.",
  /**
   * Critique round 6: the $10 target (the FAQ's "What will it cost?") is
   * said here, in the close's own line, not in the form's helper. Critique
   * round 8: said plainly, in the FAQ's own words, 9 words.
   */
  line: "The smallest plan is targeted at $10 a month.",
  /** The closing form's id. */
  anchor: "signup",
  /** The closing form's accessible name (a form landmark), told apart from the hero's. */
  formName: "Join the beta (end of page)",
};

export type FooterIcon = "bluesky" | "discord";

/**
 * Owner round 7: the social links only, each its mark alone (`icon`: Bluesky,
 * Discord). GitHub and the docs are gone. `label` is the link's name, said
 * but not shown (visually hidden).
 */
export const footer = {
  copyright: "© HappyProto",
  links: [
    { label: "HappyProto on Bluesky", href: BLUESKY.href, icon: "bluesky" },
    { label: "HappyProto on Discord", href: DISCORD.href, icon: "discord" },
  ] as (Link & { icon: FooterIcon })[],
};

/**
 * The page head's <noscript><style>. Without the script there is nowhere to
 * post: hide each form, with its status line (the note after each form
 * says why) and the header link that leads to a form; the hero's credit
 * (round 5, the email promise) then sits in the flow, not on the hidden form's reserved
 * status line. The scroll reveal
 * and the panels' play need nothing: their pending states only apply under
 * `html.js-motion`, which only the head script sets. !important because the bundled stylesheet comes after it.
 */
export const noscriptCss =
  ".mk-signup, .mk-header-join { display: none !important; } .mk-hero-credit { margin-block-start: 0 !important; }";
