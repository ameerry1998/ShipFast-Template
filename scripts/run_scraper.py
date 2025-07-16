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

try:
    scraper = reddit.RedditSubredditScraper(
        sub, submissions=True, comments=False, after=after_ts
    )
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

hits_iter = (
    p
    for p in scraper.get_items()
    if any(term in (p.title + " " + (getattr(p, "selftext", "") or "")).lower() for term in query_terms)
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