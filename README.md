# insta_ratio

Want to see who doesn't follow you back?

## Option 1: Use the browser app (no terminal needed)

This repo now includes a simple web page that runs completely in your browser.

1. Download this repo.
2. Open `index.html` in your browser.
3. Export Instagram data from:
   - **Settings > Accounts Center > Your information and permissions > Export your information > Create an Export > Export to Device**
   - Click **Customize Information** and leave only **Followers and following** under Connections.
   - Choose **JSON** format and **All time** range.
4. In the page, drag and drop your:
   - `following.json` file in the **Following JSON** box.
   - `followers_*.json` file in the **Followers JSON** box.
5. Click **Run Check** to get the list of people who do not follow you back.

## Option 2: Run the Python script

If you still prefer terminal usage:

```bash
python script.py following.json followers_1.json
```

The first argument should be your **following** file and the second should be your **followers** file.
