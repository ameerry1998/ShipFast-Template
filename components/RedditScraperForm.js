import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  AlertTriangle,
  Clock,
  MessageSquare,
  Calendar,
} from "lucide-react";

export const RedditScraperForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    subreddit: "",
    keywords: "",
    matchMode: "any",
    includeComments: false,
    searchOldPosts: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const willCreateJob = formData.includeComments || formData.searchOldPosts;
  const keywordCount = formData.keywords
    .split(",")
    .filter((k) => k.trim()).length;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Search className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl text-foreground">
              Reddit Scraper
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Extract posts from any subreddit
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subreddit Input */}
          <div className="space-y-2">
            <Label htmlFor="subreddit" className="text-sm font-medium text-foreground">
              Subreddit
            </Label>
            <div className="relative">
              <Input
                id="subreddit"
                type="text"
                placeholder="r/MachineLearning or MachineLearning"
                value={formData.subreddit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subreddit: e.target.value }))
                }
                className="pl-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                r/
              </div>
            </div>
          </div>

          {/* Keywords Input */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium text-foreground">
              Keywords
            </Label>
            <Input
              id="keywords"
              type="text"
              placeholder="machine learning, neural networks, AI"
              value={formData.keywords}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, keywords: e.target.value }))
              }
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple keywords with commas
              {keywordCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {keywordCount} keyword{keywordCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </p>
          </div>

          {/* Match Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Match Mode</Label>
            <RadioGroup
              value={formData.matchMode}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, matchMode: value }))
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="any"
                  id="any"
                  className="border-border text-primary"
                />
                <Label htmlFor="any" className="text-sm text-foreground cursor-pointer">
                  Any keywords (OR)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="all"
                  id="all"
                  className="border-border text-primary"
                />
                <Label htmlFor="all" className="text-sm text-foreground cursor-pointer">
                  All keywords (AND)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Advanced Options
            </h3>

            {/* Include Comments */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  <Label htmlFor="comments" className="text-sm text-foreground">
                    Include Comments
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Search within post comments for keywords
                </p>
              </div>
              <Switch
                id="comments"
                checked={formData.includeComments}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, includeComments: checked }))
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {formData.includeComments && (
              <Alert className="border-warning/20 bg-warning/5">
                <Clock className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  Including comments will significantly increase processing time
                </AlertDescription>
              </Alert>
            )}

            {/* Search Old Posts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <Label htmlFor="oldposts" className="text-sm text-foreground">
                    Search Beyond 12 Months
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Include posts older than one year
                </p>
              </div>
              <Switch
                id="oldposts"
                checked={formData.searchOldPosts}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, searchOldPosts: checked }))
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {formData.searchOldPosts && (
              <Alert className="border-warning/20 bg-warning/5">
                <Clock className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  Searching historical data will create a long-running job
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Processing Info */}
          {willCreateJob ? (
            <Alert className="border-accent/20 bg-accent/5">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-accent-foreground">
                <strong>Job Mode:</strong> This request will create a background job. You'll receive an email when processing is complete.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-primary/20 bg-primary/5">
              <Search className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary-foreground">
                <strong>Fast Mode:</strong> Results will stream in real-time
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            disabled={
              isLoading || !formData.subreddit.trim() || !formData.keywords.trim()
            }
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                {willCreateJob ? "Create Scraping Job" : "Start Real-time Search"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 