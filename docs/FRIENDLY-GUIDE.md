# The Friendly Guide

A complete walkthrough of what this kit is, what you need before starting, and what all
the words mean. **No technical background needed.** If you already live in a terminal,
you can skip straight to the [README](../README.md) — this page is for everyone else.

## What is this, in plain words?

You may have heard that AI can now write software. That's true — but an AI coding
assistant (called an **agent**) is like a brilliant contractor with amnesia: every time
you start a new conversation, it has forgotten everything about your project. It also
tends to build whatever it thinks you meant, rather than what you actually wanted.

This kit fixes both problems. One command creates a project folder that contains, next
to your future code, a set of plain-text instruction files that any AI agent reads
automatically. Together they give the agent:

- **A rulebook** — how to behave in your project, what honesty means, when to ask you.
- **A memory** — notes it writes at the end of every work session and reads at the start
  of the next one, so nothing is ever forgotten, even if you switch to a different AI
  tool tomorrow.
- **A process** — a lightweight version of *Scrum*, a well-known way of organizing work
  into small planned rounds, so the project moves in visible, reviewable steps instead
  of one big leap of faith.

Your role: you describe what you want and decide what's good enough. The agent's role:
it plans, builds, and keeps the paperwork honest. You never have to write code — but you
stay in charge the whole time.

## What you need before starting

Five things. The first two you almost certainly have; the rest take a few minutes each.

1. **A computer** — Windows, Mac, or Linux. Nothing fancy.
2. **A terminal** — the text window where you type commands. It's already on your
   computer: on Windows press the Windows key, type `powershell`, press Enter; on a Mac
   press Cmd+Space, type `terminal`, press Enter. It looks intimidating and is not: you
   type a line, press Enter, and the computer answers in text.
3. **Node.js** (free) — a program that lets your computer run tools like this kit.
   Download the "LTS" version from https://nodejs.org and install it like any app.
4. **git** (free) — the standard tool for keeping a history of a project's files.
   Download it from https://git-scm.com and install with the default options.
5. **An AI agent tool** — the app that actually runs the AI in your terminal (we call it
   a *harness*). Pick one:
   - **Claude Code** (by Anthropic): in your terminal, run
     `npm install -g @anthropic-ai/claude-code`. You'll need a Claude account —
     the paid plans are what make the agent work, so this is the one part of the setup
     that costs money.
   - **OpenCode** (open source, many AI models): run `npm install -g opencode-ai`.
     You'll need an account or API key for whichever AI model you choose inside it.

   Not ready to spend money? See [Trying it for free](#trying-it-for-free-no-credit-card)
   below — there are real no-cost options, with real limitations.

To check steps 3 and 4 worked, type `node --version` and `git --version` in the
terminal — each should answer with a version number, not an error.

## Trying it for free (no credit card)

You can take the whole kit for a spin without paying anything. Be honest with your
expectations first: an agent spends many AI requests on a single task (every step it
takes is at least one), free plans allow only a small number of requests per day or
month, and the models offered for free are noticeably less capable than the paid ones.
Free tiers are great for *seeing how this feels*; for really building something, a
small paid plan quickly becomes worth it.

The free route uses **OpenCode** (the harness itself is free and open source — install
it with `npm install -g opencode-ai`) plus a free account at one of these providers.
As of August 2026, these work without entering a credit card:

- **Google AI Studio** — sign in at https://aistudio.google.com with a Google account
  and click "Get API key". The free key gives you a modest daily allowance of Google's
  Gemini "Flash" models. Important: *don't* enable billing on the key's project —
  keeping billing off is exactly what keeps it free.
- **OpenRouter** — sign up at https://openrouter.ai and create a key. Models whose
  name ends in `:free` cost nothing, currently up to 50 requests per day. The lineup
  of free models changes often.
- **GitHub Copilot Free** — if you have a GitHub account, the free Copilot plan
  includes a small monthly allowance of agent requests (around 50). That can be spent
  in a single session, but it's enough for a first taste.

Then, inside your project folder, run `opencode auth login`, pick the provider you
chose, and paste your key (for Copilot, it walks you through logging in with GitHub).
Start `opencode`, pick a free model, and continue with
[Your first ten minutes](#your-first-ten-minutes) as normal.

Two warnings worth their space:

- **Old advice online is stale.** Blog posts still recommend the Gemini CLI's free
  Google login and Qwen Code's free tier — both were discontinued in 2026. Free tiers
  change without notice; if one of the options above stops working, that's likely why.
- **Anthropic's Claude Code has no free tier** — it needs a paid Claude plan. If you
  end up enjoying this way of working, that (or any paid model in OpenCode) is the
  natural upgrade: more capable models make a visible difference in what the agent can
  build.

## Your first ten minutes

1. **Open a terminal** (see above) and go to the folder where you keep projects — or
   just stay where it opens.
2. **Run the kit** — type this and press Enter (replace `my-project` with any name,
   no spaces):

   ```
   npx github:vincentheimann/create-agentic-workspace my-project
   ```

3. **Answer the questions.** The kit asks a few plain questions about your project.
   Not sure? **Just press Enter every time** — the defaults are good.
4. **Enter the project and start the agent:**

   ```
   cd my-project
   claude
   ```

   (or `opencode` if that's what you installed — the first run asks you to log in.)
5. **Type `/kickoff` and press Enter.** The agent interviews you about your idea, writes
   a small plan, and builds the first working piece of it — in this same session. From
   here on, just talk to it in normal language.

Inside your new project there's a file called `GETTING-STARTED.md` that explains
everyday life with the workspace — the commands, the rhythm, the good habits. That's
your companion from day two onward.

## How the work is organized (the Scrum part)

The kit organizes the work the way good software teams have for decades — a method
called **Scrum**. Don't let the vocabulary scare you: it boils down to *working in
small rounds and checking in regularly*, instead of one giant leap of faith. One round
is called a **sprint**, the check-ins are called **ceremonies**, and in this kit every
ceremony is a slash command you type in the chat. The loop looks like this:

1. **Collect ideas** — `/backlog-refinement`. You brain-dump what you want in plain
   words; the agent turns it into a tidy, ordered wish list (the *backlog*), most
   valuable things on top.
2. **Pick a goal** — `/sprint-planning`. Together you choose one small goal from the
   top of the list. That starts a sprint.
3. **Build** — you ask the agent to implement, item by item. Each working session,
   `/standup` gives you a three-line check-in: what's done, what's next, what's stuck.
4. **Inspect** — `/sprint-review`. The agent demonstrates what was built and you accept
   or reject each piece. Only what genuinely works counts as finished — the written
   checklist for "finished" (the *Definition of Done*) protects you from wishful
   "almost done". Running the review is what ends the sprint.
5. **Improve** — `/retrospective`. A short "what should we do differently next round?",
   ending in one to three concrete changes. Then the loop starts again at step 1.

A few things that surprise people, in a good way:

- **Sprints end when the goal is done, not on a date.** With an AI agent doing the
  building, a whole round can fit in one evening — or stretch over weeks. Both are fine.
- **You never run the loop alone.** You only make the decisions: what to build, in what
  order, and whether it's good enough. The agent runs the ceremonies, writes every
  file, and keeps the paperwork in the `scrum/` folder honest.
- **Your `/kickoff` session already ran a mini version of this loop** — idea, small
  plan, first built piece. From your second session on, you use the loop directly.
- **One habit ties it together:** end every session with `/memory-update`, so the next
  session — even in a different AI tool — picks up exactly where this one stopped.

**Where this all comes from.** Scrum is the most popular practice of a bigger idea
called **Agile**, set down in 2001 by a group of software veterans as a one-page
manifesto. It rests on four value pairs — in plain words:

1. **People and conversations** matter more than processes and tools — the process
   serves you, never the other way around.
2. **Working results** matter more than piles of documentation — which is why your
   very first session ends with something running.
3. **Working together** matters more than negotiating specifications — you steer by
   looking at real results and reacting, not by writing a perfect plan upfront.
4. **Responding to change** matters more than following a plan — the wish list is
   reordered every round, as you learn what actually matters.

The original (it really is one page) lives at https://agilemanifesto.org — worth two
minutes once the vocabulary here feels familiar.

## Glossary

The words you'll meet, in the order you'll meet them.

**Around the computer**

- **Terminal** — the text window where you type commands. Also called a *console* or
  *command line*. You type a line, press Enter, the computer responds in text.
- **Command** — one line you type in the terminal, like `cd my-project`. `cd` means
  "change directory", i.e. move into a folder.
- **Node.js** — a free program that runs JavaScript tools on your computer. This kit
  needs it; many developer tools do.
- **npx / npm** — helpers that come with Node.js. `npm install` installs a tool;
  `npx` runs a tool directly without installing it first.
- **git** — the standard tool for recording a project's history: every saved state
  (*commit*) can be revisited. A project tracked by git is called a **repository**
  (or *repo*).
- **Markdown (.md files)** — plain text files with light formatting, readable by both
  humans and AI agents. Everything this kit generates is markdown.

**Around AI agents**

- **AI agent** — an AI that doesn't just chat but *acts*: it reads and writes files,
  runs commands, and works toward a goal you gave it.
- **Model** — the underlying AI "brain" (for example Claude, Gemini, or Kimi). Different
  tools can run different models; this kit works with any capable one.
- **Harness** — the tool that connects a model to your project, e.g. Claude Code or
  OpenCode. The harness is what you actually install and run in the terminal.
- **API key** — a personal password-like code you create on an AI provider's website
  and paste into your harness so it may use that provider's models on your behalf.
  Treat it like a password: never share it or put it in your project files.
- **Slash command** — a shortcut you type in the agent's chat, starting with `/`, like
  `/kickoff`. Each one triggers a predefined routine from this kit.
- **AGENTS.md** — the rulebook file at the top of your project that every compatible
  agent reads automatically. It's the "single source of truth" for how to behave.
- **Context** — everything the AI currently "has in mind" during a conversation. It's
  limited, which is why this kit writes important things down in files instead of
  hoping the agent remembers.

**Around the way of working**

- **Agile** — the philosophy behind modern software work, written down in a 2001
  manifesto (https://agilemanifesto.org): deliver working results in small steps,
  learn from them, and adapt — rather than follow one big upfront plan.
- **Scrum** — the most popular way of putting Agile into practice: work organized
  into short, planned rounds with regular check-ins. This kit uses a lightweight
  version of it.
- **Sprint** — one such round: it starts with a plan, ends with a review. With AI
  agents a sprint can fit in a single evening.
- **Backlog** — the ordered wish list of everything the project might do, most valuable
  items on top.
- **User story** — one backlog item written from the user's point of view, small enough
  to build and check.
- **Ceremony** — a recurring ritual of the process: planning, standup (a quick
  check-in), review, retrospective (what should we improve?). In this kit each one is
  a slash command.
- **Product Owner** — the person who decides what's valuable and what's accepted.
  **That's you.** The agent proposes; you decide.
- **Definition of Done** — the written checklist something must pass before it counts
  as finished. It protects you from "done except…".
- **ADR (Architecture Decision Record)** — a short note recording an important
  decision and why it was made, so nobody has to wonder later.
- **Memory** — this kit's `memory/` folder: the notes agents keep between sessions
  (current focus, decisions, progress) so every session continues where the last one
  stopped.

## Where to go next

- The [README](../README.md) — the full feature tour and reference.
- [HOW-IT-WORKS.md](HOW-IT-WORKS.md) — the same ideas as pictures (two diagrams).
- `GETTING-STARTED.md` *inside your generated project* — your day-to-day companion.

Stuck on something this guide didn't cover? That's useful feedback — please
[open an issue](https://github.com/vincentheimann/create-agentic-workspace/issues) and
say where you got lost.
