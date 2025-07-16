"use client";

import React, { useState } from "react";
import { RedditScraperForm } from "@/components/RedditScraperForm";
import { toast } from "react-hot-toast";

export default function RedditSearchPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleSubmit = async ({ subreddit, keywords }) => {
    setIsLoading(true);
    setPosts([]);
    setDownloadUrl(null);
    try {
      const res = await fetch("/api/reddit/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subreddit, keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unexpected error");
      setPosts(data);
      // generate download link
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <RedditScraperForm onSubmit={handleSubmit} isLoading={isLoading} />

      {posts.length > 0 && (
        <>
          <div className="mt-6">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`reddit-search-${Date.now()}.json`}
                className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Download JSON ({posts.length} posts)
              </a>
            )}
          </div>
          <ul className="mt-4 space-y-4">
            {posts.map((p) => (
              <li
                key={p.id}
                className="p-4 rounded-lg border border-border bg-muted/10"
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {p.title}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(p.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 