# insta_ratio
Want to see who doesn't follow you back?

## Option 1: Use the original Python script
First download this directory to your laptop and make sure you have Python installed.

Then, follow these steps:

Go to **Settings > Accounts Center > Your information and permissions > Export your information > Create an Export > Export to Device > Customize Information** (clear everything except **Followers and following** in the Connections section), then:
- Change format to **JSON**
- Change date range to **All Time**

Once you download your information, you should have one JSON file for your **following** and one JSON file for your **followers**. Add both files to the same folder where `script.py` is located.

Run:

```bash
python script.py followers_1.json following.json
```

> Note: file names may vary. Pass the followers file first and following file second.

## Option 2: Run the new standalone front end
A browser-based UI is included in `frontend/` so you can run this as a separate local app.

### Start locally
From the repo root:

```bash
python -m http.server 8000
```

Then open: `http://localhost:8000/frontend/`

### Use it
1. Upload your **Following JSON** file.
2. Upload your **Followers JSON** file.
3. Click **Analyze files**.
4. Review the list and optionally download it as `not_following_back.txt`.

Your files are processed locally in the browser.
