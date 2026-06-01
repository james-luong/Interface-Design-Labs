# Lab 10 — Mercury Deployment Guide (PHP + MySQL)

Mercury runs **Apache + PHP + MySQL**, not Node.js.  
The deployment is: build the Vue app locally → upload `dist/` + `api/` → set up MySQL.

Replace these placeholders throughout:
- `sXXXXXXX` → your Swinburne student ID (e.g. `s1234567`)
- `YOUR_DB_PASSWORD` → your MySQL password on Mercury

Your live URL will be:
```
https://mercury.swin.edu.au/cos30043/sXXXXXXX/lab10/
```

---

## Step 1 — Edit the database config (local)

Open `api/config.php` and fill in your credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'sXXXXXXX');           // your student ID
define('DB_PASS', 'YOUR_DB_PASSWORD');   // your Mercury MySQL password
define('DB_NAME', 'sXXXXXXX');           // usually same as your student ID
```

> **How to find your Mercury MySQL credentials:**  
> Log into Mercury, run `mysql -u sXXXXXXX -p` and enter your password.  
> If you have never set a password, run: `mysqladmin -u sXXXXXXX password 'newpassword'`

---

## Step 2 — Build the Vue frontend (local)

In your terminal, from the `lab10/` project folder:

```bash
npm install          # only needed first time
npm run build        # compiles Vue → dist/
```

This produces the `dist/` folder. The build uses relative paths (`./assets/...`)
so it works correctly inside any Mercury subdirectory.

---

## Step 3 — Upload files to Mercury

You need to upload these folders/files:

```
dist/               ← built Vue app (index.html + assets/)
api/                ← PHP backend (config.php, destinations.php, categories.php)
sql/travel.sql      ← database setup script
```

### Option A — FileZilla (easiest, GUI)

1. Download FileZilla from https://filezilla-project.org
2. Connect:
   - Host: `mercury.swin.edu.au`
   - Username: `sXXXXXXX`
   - Password: your Mercury password
   - Port: `22`  (SFTP)
3. On the remote side, navigate to:  
   `/home/cos30043/sXXXXXXX/` (or wherever your web root is — ask your tutor)
4. Create a folder called `lab10` if it doesn't exist
5. Upload:
   - Everything inside `dist/` → into `lab10/`
   - The entire `api/` folder → into `lab10/api/`
   - `sql/travel.sql` → into `lab10/sql/`

The final structure on Mercury should look like:
```
lab10/
├── index.html          ← from dist/
├── assets/             ← from dist/assets/
│   ├── index-XXXX.js
│   └── index-XXXX.css
├── api/
│   ├── config.php
│   ├── destinations.php
│   └── categories.php
└── sql/
    └── travel.sql
```

### Option B — SCP (command line)

```bash
# Upload dist contents (note the trailing slash on dist/)
scp -r dist/* sXXXXXXX@mercury.swin.edu.au:~/public_html/lab10/

# Upload the api folder
scp -r api/ sXXXXXXX@mercury.swin.edu.au:~/public_html/lab10/api/

# Upload the SQL file
scp sql/travel.sql sXXXXXXX@mercury.swin.edu.au:~/public_html/lab10/sql/
```

> **Note on the path:** The exact remote path depends on how Mercury maps your
> account. Common paths are `~/public_html/lab10/` or `~/cos30043/lab10/`.
> Confirm with your tutor or check what path maps to your Mercury URL.

---

## Step 4 — Set up the MySQL database (on Mercury)

SSH into Mercury:
```bash
ssh sXXXXXXX@mercury.swin.edu.au
```

Run the SQL setup script to create and seed the `destinations` table:
```bash
mysql -u sXXXXXXX -p sXXXXXXX < ~/public_html/lab10/sql/travel.sql
#                              ^                  ^
#               your database name           path to travel.sql
```

Enter your MySQL password when prompted. You should see no errors.

**Verify it worked:**
```bash
mysql -u sXXXXXXX -p sXXXXXXX -e "SELECT COUNT(*) FROM destinations;"
```
Should print `15`.

---

## Step 5 — Test the app

Open your browser and go to:
```
https://mercury.swin.edu.au/cos30043/sXXXXXXX/lab10/
```

You should see the Travel Destinations app with 15 records.

**Quick API test** (checks PHP is working):
```
https://mercury.swin.edu.au/cos30043/sXXXXXXX/lab10/api/destinations.php?page=1&limit=5
```
Should return JSON with a `data` array and `pagination` object.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank page / 404 on assets | Check that `index.html` is in the root of your `lab10/` folder, not inside a `dist/` subfolder |
| API returns 500 / DB error | Double-check `api/config.php` credentials. SSH in and run `mysql -u sXXXXXXX -p` to verify they work |
| "Table doesn't exist" | You haven't run `travel.sql` yet — re-do Step 4 |
| App loads but shows "Failed to load" | Open browser DevTools → Network tab, check the `/api/destinations.php` request. The URL should include your student ID in the path |
| CORS error in DevTools | Not expected since API and frontend are on the same origin. If it appears, check `api/destinations.php` has the correct `Access-Control-Allow-Origin` header |
| `mysql` command not found on Mercury | Try `mysql5` or ask IT support |

---

## Updating after changes

1. Edit your files locally
2. Rebuild: `npm run build`
3. Re-upload changed files via FileZilla or SCP
4. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)

No server restart needed — Apache + PHP handles each request fresh.
