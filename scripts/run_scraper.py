#!/usr/bin/env python3
import sys, json, pathlib, importlib.util, datetime, itertools

root = pathlib.Path(__file__).resolve().parents[1]
reddit_path = root / "reddit.py"

if not reddit_path.exists():
    print(json.dumps({"error": "reddit.py not found"}))
    sys.exit(1)

spec = importlib.util.spec_from_file_location("reddit", reddit_path)
if spec is None or spec.loader is None:  # safety check
    print(json.dumps({"error": "Unable to load reddit.py"}))
    sys.exit(1)
reddit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reddit)

if len(sys.argv) < 3:
    print(json.dumps({"error": "Missing arguments"}))
    sys.exit(1)

sub = sys.argv[1]
query_terms = [k.strip().lower() for k in sys.argv[2].split(",") if k.strip()]

after_ts = int(
    (datetime.datetime.utcnow() - datetime.timedelta(days=365)).timestamp()
)

# Helper to fallback to Reddit search
def reddit_fallback(pushshift_error):
    import requests, time

    headers = {"User-Agent": "reddit-scraper-demo/0.1 (by u/yourusername)"}
    try:
        resp = requests.get(
            f"https://www.reddit.com/r/{sub}/search.json",
            params={
                "q": " OR ".join(query_terms),
                "restrict_sr": 1,
                "sort": "new",
                "limit": 200,
                "t": "all",
            },
            headers=headers,
            timeout=10,
        )
        if resp.status_code != 200:
            raise ValueError(f"Reddit search returned {resp.status_code}")

        posts_json = resp.json().get("data", {}).get("children", [])
        data = []
        for child in posts_json:
            post = child["data"]
            if post.get("created_utc", 0) < after_ts:
                continue
            text_blob = (post.get("title", "") + " " + post.get("selftext", "")).lower()
            if any(term in text_blob for term in query_terms):
                data.append(
                    {
                        "id": post.get("id"),
                        "title": post.get("title"),
                        "url": "https://www.reddit.com" + post.get("permalink", ""),
                        "date": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(post.get("created_utc", 0))),
                        "selftext": post.get("selftext", ""),
                    }
                )
            if len(data) >= 200:
                break

        print(json.dumps(data))
        sys.exit(0)
    except Exception as e2:
        print(json.dumps({"error": f"Pushshift fail: {pushshift_error}. Reddit fallback fail: {str(e2)}"}))
        sys.exit(1)

try:
    scraper = reddit.RedditSubredditScraper(sub, submissions=True, comments=False, after=after_ts)

    hits_iter = (
        p
        for p in scraper.get_items()
        if any(
            term in (p.title + " " + (getattr(p, "selftext", "") or "")).lower()
            for term in query_terms
        )
    )

    data = []
    for i, post in enumerate(hits_iter):
        if i >= 200:
            break
        data.append(
            {
                "id": post.id,
                "title": post.title,
                "url": post.url,
                "date": post.date.isoformat() if hasattr(post, "date") else None,
                "selftext": getattr(post, "selftext", ""),
            }
        )

    print(json.dumps(data))
    sys.exit(0)
except Exception as e:
    # Pushshift failed; try fallback to Reddit public search
    reddit_fallback(str(e)) 