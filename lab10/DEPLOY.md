# Deploying Lab 10 on Mercury (Node + MySQL)

This app is now set up to run as **one Node process** that serves both the Vue
frontend and the `/api` routes. You build the frontend locally, copy everything
to Mercury, set up the database, and keep the server running with `pm2`.

Replace the placeholders below with your real values:

- `USER`      → your Mercury login
- `mercury.SCHOOL.edu` → the actual Mercury hostname
- `PORT`      → the port your account is allowed to use (ask your instructor/IT)
- DB name / user / password → your assigned MySQL credentials

---

## 1. Build the frontend locally

On your own machine, from the project root:

```bash
npm install          # if node_modules is missing or was disturbed
npm run build        # produces dist/
```

This creates the `dist/` folder. `server.js` serves it in production, so the
frontend's relative `/api` calls hit the same server — no proxy needed.

## 2. Copy the project to Mercury

You only need the source, `dist/`, `server.js`, `package.json`,
`package-lock.json`, and `database/`. **Do not** copy `node_modules` (the
native binaries won't match Mercury) or your local `.env`.

**Option A — SCP/rsync** (simple):

```bash
rsync -av --exclude node_modules --exclude .env \
  ./ USER@mercury.SCHOOL.edu:~/lab10/
```

**Option B — Git** (cleaner if you have a repo): push to GitHub, then on
Mercury `git clone <repo> ~/lab10`. `dist/` is gitignored, so either commit it
for this deploy or run `npm run build` on Mercury too (step 3 installs the deps
that allows that).

## 3. Install dependencies on Mercury

SSH in and install fresh (this pulls the correct Linux binaries):

```bash
ssh USER@mercury.SCHOOL.edu
cd ~/lab10
npm install --omit=dev      # only needs express, cors, dotenv, mysql2 at runtime
```

If you chose to build on Mercury instead of copying `dist/`, run a full
`npm install` then `npm run build` here.

## 4. Set up the MySQL database

Log into MySQL with your Mercury credentials and load the schema:

```bash
mysql -u DBUSER -p < database/setup.sql
```

`setup.sql` creates the `lab10_travel` database, the `destinations` table, and
seed rows. If your account can't create databases, create the table inside your
pre-assigned database instead (remove the `CREATE DATABASE` / `USE` lines and
run it against your DB).

## 5. Configure `.env` on Mercury

Create a `.env` file in `~/lab10` (never commit this):

```bash
cat > .env <<'EOF'
DB_HOST=localhost
DB_USER=DBUSER
DB_PASSWORD=DBPASSWORD
DB_NAME=lab10_travel
DB_PORT=3306
PORT=PORT
EOF
```

Use the DB host/port Mercury gives you (often `localhost:3306`).

## 6. Run the server persistently

A bare `node server.js` dies when you log out. Use `pm2` so it survives and
restarts on reboot:

```bash
npm install -g pm2            # once; if you can't install globally, see note below
pm2 start server.js --name lab10
pm2 save
pm2 startup                   # follow the printed command to enable on boot
```

Check it: `pm2 logs lab10` should show `✅ Connected to MySQL` and
`🚀 Server running at http://localhost:PORT`.

> No global install permission? Use `npx pm2 start server.js --name lab10`, or
> as a fallback: `nohup node server.js > app.log 2>&1 &`.

## 7. Access the app

- If Mercury exposes your port directly:
  `http://mercury.SCHOOL.edu:PORT`
- If there's a shared web server (Apache/nginx) in front, you'll likely have a
  path like `http://mercury.SCHOOL.edu/~USER/` reverse-proxied to your port —
  confirm the exact URL with your instructor/IT.

---

## Updating after a code change

```bash
# locally
npm run build
rsync -av --exclude node_modules --exclude .env ./ USER@mercury.SCHOOL.edu:~/lab10/
# on Mercury
pm2 restart lab10
```

## Troubleshooting

- **Page loads but data doesn't / 404 on `/api`** — make sure you're hitting
  the Node server's port, not a static-only path. The API and app must be the
  same origin.
- **`❌ DB connection failed`** — wrong `.env` credentials, MySQL not running,
  or DB host isn't `localhost`. Test with `mysql -u DBUSER -p`.
- **Port already in use / permission denied on PORT** — pick a port in your
  assigned range; ports below 1024 usually need privileges you won't have.
- **Build fails with a native binding error** — your `node_modules` came from a
  different OS. Run `rm -rf node_modules && npm install` on that machine.
