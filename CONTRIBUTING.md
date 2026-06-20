# Adding yourself to the lab website (a beginner's guide to Git)

Welcome! This guide walks you through adding yourself to the
[People page](https://lab.andrechek.com/people) of the lab website. It assumes you
have **never used Git, GitHub, or a command-line terminal before**.

There are faster ways to do this, but we're doing it "the real way" on purpose:
by the end you'll have used the exact same tools — Git, the terminal, GitHub pull
requests — that you'll rely on for the rest of your research career, especially in
bioinformatics. Take your time. You can't break anything: your work happens on your
own copy until a lab admin reviews and approves it.

**The big picture:** you'll make your own copy of the project (a *fork*), make your
change on your computer, send it back for review (a *pull request*), and once an
admin approves it, the website updates itself automatically.

> 💡 **Windows users:** the Windows Command Prompt and PowerShell work differently
> from the Mac/Linux terminal. To keep one set of instructions for everyone, we'll
> use **Git Bash**, which you'll install in Step 1. Every command below then works
> the same on Windows, Mac, and Linux.

---

## Step 0 — Make a GitHub account

If you don't already have one, go to [github.com](https://github.com) and sign up
(it's free). Use a name your labmates will recognize. Then ask Eric or Eran to add
you to the **Andrechek-Lab** organization (this isn't strictly required to
contribute, but it's good to be a member).

## Step 1 — Install Git and open a terminal

**Windows**
1. Download **Git for Windows** from [git-scm.com/download/win](https://git-scm.com/download/win). The download starts automatically.
2. Run the installer. You can click **Next** through every screen to accept the defaults — they're fine.
3. When it finishes, open the **Start menu**, type **Git Bash**, and open it. A black terminal window appears. This is where you'll type commands.

**Mac**
1. Open the **Terminal** app (press `Cmd`+`Space`, type *Terminal*, press Enter).
2. Type `git --version` and press Enter. If Git isn't installed, macOS will pop up a button to install the developer tools — click it and wait.

**Linux**
1. Open your terminal.
2. Install Git with your package manager, e.g. `sudo apt install git` (Debian/Ubuntu).

**Tell Git who you are** (do this once). In the terminal, type these two lines,
using your own name and the email tied to your GitHub account:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Step 2 — Fork the repository

A *fork* is your own personal copy of the project on GitHub.

1. Go to **https://github.com/Andrechek-Lab/Andrechek-Lab**.
2. Click the **Fork** button (top-right). On the next screen, click **Create fork**.
3. You now have a copy at `https://github.com/YOUR-USERNAME/Andrechek-Lab`.

## Step 3 — Download your fork to your computer

This is called *cloning*. In the terminal, type the following — but replace
`YOUR-USERNAME` with your actual GitHub username:

```bash
cd ~/Desktop
git clone https://github.com/YOUR-USERNAME/Andrechek-Lab.git
cd Andrechek-Lab
```

What this did: moved to your Desktop, downloaded your fork into a folder called
`Andrechek-Lab`, and moved *into* that folder. (`cd` means "change directory".)

## Step 4 — Make a branch for your change

A *branch* is a safe, separate workspace for one change. Create one named after
yourself:

```bash
git checkout -b add-jane-doe
```

(Use your own name; keep it lowercase with dashes.)

## Step 5 — Add your files

You'll add **two** files to the `src/content/people/` folder: a markdown file with
your info, and your photo.

1. **Copy the template.** There's an example file at
   `src/content/people/_example.md`. Make a copy of it named after yourself, e.g.
   `jane-doe.md`. You can do this in your computer's file explorer (open the
   `Andrechek-Lab/src/content/people/` folder), or in the terminal:

   ```bash
   cp src/content/people/_example.md src/content/people/jane-doe.md
   ```

2. **Add your photo.** Put a photo of yourself in that **same folder**
   (`src/content/people/`). A normal phone photo is fine — the website shrinks it
   automatically. Name it simply, e.g. `jane-doe.jpg`.

3. **Edit your markdown file.** Open `src/content/people/jane-doe.md` in any text
   editor (Notepad works; [VS Code](https://code.visualstudio.com) is nicer). Fill
   in your details. It should end up looking like this:

   ```markdown
   ---
   name: Jane Doe
   group: current
   title: Graduate Researcher
   photo: ./jane-doe.jpg
   order: 16
   ---

   I study how specific mutations drive metastasis in mouse models of breast cancer.
   ```

   - `photo:` must match your photo's filename exactly, with `./` in front.
   - `group:` is `current` for current lab members.
   - Write a sentence or two about your project below the second `---`.
   - The full field reference is in [docs/editing-content.md](./docs/editing-content.md).

## Step 6 — (Optional) preview it on your computer

If you'd like to see your change before sending it, install the tools and run a
local preview. (Skip this if you'd rather just submit — the automatic check will
catch any mistakes.)

```bash
# Install Node.js from https://nodejs.org first (the "LTS" version), then:
npm install -g pnpm    # one-time: install pnpm
pnpm install           # install the project's tools
pnpm dev               # open the link it prints (http://localhost:4321) in your browser
```

Press `Ctrl`+`C` in the terminal to stop the preview.

## Step 7 — Save and send your change

Back in the terminal, in the `Andrechek-Lab` folder:

```bash
git add .
git commit -m "Add Jane Doe to the People page"
git push origin add-jane-doe
```

- `git add .` stages your new files.
- `git commit` saves them with a short message (use your own name).
- `git push` uploads your branch to your fork on GitHub.

The first time you push, Git may ask you to sign in to GitHub — follow the prompts
(a browser window usually opens).

## Step 8 — Open a pull request

A *pull request* (PR) asks the lab to pull your change into the real website.

1. Go to your fork on GitHub (`https://github.com/YOUR-USERNAME/Andrechek-Lab`).
2. You'll see a banner: **"Compare & pull request."** Click it.
   (If you don't see it, click the **Pull requests** tab → **New pull request**.)
3. Add a short title like *"Add Jane Doe to People."*
4. Click **Create pull request**.

## Step 9 — What happens next

- An automatic check (a robot) builds the site to make sure your files are valid.
  In a minute or two you'll see a green ✓ (all good) or a red ✗ (something needs
  fixing).
- **If you see a red ✗:** don't worry, nothing is broken on the live site. Click
  **Details** next to the failed check to see a plain-English explanation of what's
  wrong (usually a typo or a photo filename that doesn't match). Fix the file on
  your computer, then repeat Step 7 (`git add .` → `git commit` → `git push`). The
  check re-runs automatically.
- A lab admin (Eric or Eran) will review your PR and merge it.
- Once merged, the website **rebuilds and publishes your change automatically**,
  usually within a minute. 🎉

---

## Mini-glossary

| Term | Plain meaning |
| --- | --- |
| **Repository (repo)** | The project's folder of files, tracked by Git. |
| **Fork** | Your personal copy of the repo on GitHub. |
| **Clone** | A download of a repo onto your computer. |
| **Branch** | A separate workspace for one change. |
| **Commit** | A saved snapshot of your changes, with a message. |
| **Push** | Uploading your commits to GitHub. |
| **Pull request (PR)** | A request to merge your change into the main project, where it can be reviewed. |
| **Merge** | Accepting a pull request, combining the change into the main project. |

## Common questions

**I'm stuck or got an error I don't understand.** Copy the error text and send it to
Eric — that's completely normal when learning. Errors are not failures.

**I don't want to use the terminal at all.** You *can* edit files directly on
github.com (the ✏️ pencil icon on any file) and upload a photo through the website,
then open a pull request from there. But learning the terminal steps above is worth
it — it's how you'll work with real data and code.

**Can I change someone else's entry, or fix a typo elsewhere?** Yes — the same
fork → branch → edit → pull request flow works for any change. See
[docs/editing-content.md](./docs/editing-content.md) for what each file controls.
