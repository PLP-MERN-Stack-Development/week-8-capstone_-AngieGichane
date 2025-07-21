import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RecipeReviews = ({ 
  reviews, 
  averageRating, 
  totalReviews, 
  onAddReview 
}) => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    if (!newReview.trim() || newRating === 0) {
      toast({
        title: "Review incomplete",
        description: "Please provide both a rating and comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onAddReview({
        userId: 'current-user',
        userName: 'You',
        rating: newRating,
        comment: newReview.trim()
      });

      setNewReview('');
      setNewRating(0);
      setIsSubmitting(false);

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback",
      });
    }, 1000);
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
              <StarRating rating={averageRating} />
              <div className="text-sm text-muted-foreground mt-1">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Rating
            </label>
            <StarRating 
              rating={newRating} 
              interactive 
              onRatingChange={setNewRating}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Review
            </label>
            <Textarea
              placeholder="Share your thoughts about this recipe..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="bg-background/50"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting || !newReview.trim() || newRating === 0}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-gradient-card border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {review.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{review.userName}</span>
                    <StarRating rating={review.rating} />
                    <Badge variant="outline" className="text-xs">
                      {new Date(review.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card className="bg-background/50 border-border/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};