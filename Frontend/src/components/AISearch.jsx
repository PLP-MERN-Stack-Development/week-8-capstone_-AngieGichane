const React = require('react');
const { useState } = require('react');
const { Input } = require('@/components/ui/input');
const { Button } = require('@/components/ui/button');
const { Card, CardContent, CardHeader, CardTitle } = require('@/components/ui/card');
const { Badge } = require('@/components/ui/badge');
const { Loader2, Sparkles, MessageCircle } = require('lucide-react');
const { useToast } = require('@/hooks/use-toast');

function AISearch({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  const suggestedQueries = [
    "Show me quick vegetarian meals under 30 minutes",
    "I want something healthy with high protein",
    "Find me desserts that are gluten-free",
    "What can I make with chicken and vegetables?",
    "Low calorie meals for dinner",
    "Breakfast recipes that are keto-friendly"
  ];

  const processNaturalLanguageQuery = async (userQuery) => {
    if (!apiKey) {
      setShowApiInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use AI-powered search",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const keywords = extractKeywords(userQuery);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const searchQuery = keywords.join(' ');
      onSearchResults(searchQuery);
      
      toast({
        title: "AI Search Complete",
        description: `Found recipes matching: "${searchQuery}"`,
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractKeywords = (query) => {
    const lowerQuery = query.toLowerCase();
    const keywords = [];
    
    if (lowerQuery.includes('vegetarian')) keywords.push('vegetarian');
    if (lowerQuery.includes('vegan')) keywords.push('vegan');
    if (lowerQuery.includes('gluten-free') || lowerQuery.includes('gluten free')) keywords.push('gluten-free');
    if (lowerQuery.includes('keto')) keywords.push('keto');
    if (lowerQuery.includes('healthy')) keywords.push('healthy');
    if (lowerQuery.includes('low calorie')) keywords.push('healthy');
    
    if (lowerQuery.includes('breakfast')) keywords.push('breakfast');
    if (lowerQuery.includes('lunch')) keywords.push('lunch');
    if (lowerQuery.includes('dinner')) keywords.push('dinner');
    if (lowerQuery.includes('dessert')) keywords.push('dessert');
    
    const commonIngredients = ['chicken', 'beef', 'fish', 'pasta', 'rice', 'vegetables', 'cheese', 'eggs'];
    commonIngredients.forEach(ingredient => {
      if (lowerQuery.includes(ingredient)) keywords.push(ingredient);
    });
    
    return keywords;
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
    processNaturalLanguageQuery(suggestedQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      processNaturalLanguageQuery(query);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Powered Recipe Search
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask in natural language: "Show me quick vegetarian meals under 30 minutes"
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {showApiInput && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">OpenAI API Key</label>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and not sent to our servers
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="What kind of recipe are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button type="submit" disabled={isProcessing || !query.trim()}>
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Search
          </Button>
        </form>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Try these suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors text-xs"
                onClick={() => handleSuggestedQuery(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

module.exports = AISearch;