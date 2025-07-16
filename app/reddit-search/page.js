"use client";

import React, { useState } from "react";
import { RedditScraperForm } from "@/components/RedditScraperForm";
import { toast } from "react-hot-toast";

export default function RedditSearchPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ subreddit, keywords }) => {
    setIsLoading(true);
    setPosts([]);
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
        <ul className="mt-8 space-y-4">
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
      )}
    </div>
  );
} 