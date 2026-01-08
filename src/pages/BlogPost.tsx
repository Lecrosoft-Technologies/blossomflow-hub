import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Loader,
  Tag,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { apiService, Post as ApiPost } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured_image?: string;
  views: number;
  tags: string[];
  published_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching post with slug:", postSlug);

      // Fetch post from API
      const apiPost = await apiService.getPostBySlug(postSlug);
      console.log("API Post received:", apiPost);

      if (apiPost) {
        // Format date
        const date = new Date(apiPost.published_at || apiPost.created_at);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // Calculate read time from content length
        const wordCount = apiPost.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        const formattedPost: BlogPost = {
          id: apiPost.id,
          title: apiPost.title,
          slug: apiPost.slug,
          content: apiPost.content,
          author: apiPost.author,
          date: formattedDate,
          readTime: `${readTime} min read`,
          category: apiPost.category || "General",
          featured_image: apiPost.featured_image,
          views: apiPost.views || 0,
          tags: apiPost.tags || [],
          published_at: apiPost.published_at,
        };

        setPost(formattedPost);
      } else {
        setError("Post not found");
        toast({
          title: "Post Not Found",
          description: "The blog post you're looking for doesn't exist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      setError("Failed to load blog post. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      });

      // Fallback to mock data if API fails (for development)
      setPost(getMockPost(slug || ""));
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockPost = (postSlug: string): BlogPost | null => {
    const mockPosts: Record<string, BlogPost> = {
      "10-high-intensity-workouts-that-burn-fat-fast": {
        id: "1",
        title: "10 High-Intensity Workouts That Burn Fat Fast",
        slug: "10-high-intensity-workouts-that-burn-fat-fast",
        content: `
          <p>High-intensity interval training (HIIT) has revolutionized the fitness world, offering maximum results in minimum time. Here are the top 10 HIIT workouts that will transform your body:</p>
          
          <h2>1. Burpees</h2>
          <p>The ultimate full-body exercise that combines strength and cardio. Perform 30 seconds of burpees followed by 30 seconds of rest, repeat for 10 rounds.</p>
          
          <h2>2. Mountain Climbers</h2>
          <p>Engage your core while elevating your heart rate. These are perfect for burning calories and building endurance.</p>
          
          <h2>3. Jump Squats</h2>
          <p>Build explosive power in your legs while torching calories. Start with 3 sets of 15 reps.</p>
          
          <h2>4. Kettlebell Swings</h2>
          <p>Great for posterior chain development and cardiovascular endurance. Focus on proper form to avoid injury.</p>
          
          <h2>5. Box Jumps</h2>
          <p>Improve your vertical jump and explosive power while getting an excellent cardio workout.</p>
          
          <h2>6. Battle Ropes</h2>
          <p>Engage your entire upper body and core with this high-intensity exercise that also improves grip strength.</p>
          
          <h2>7. Sprints</h2>
          <p>Nothing burns fat faster than sprinting. Alternate between 30-second sprints and 60-second recovery walks.</p>
          
          <h2>8. Jumping Lunges</h2>
          <p>Challenge your balance and coordination while working your entire lower body.</p>
          
          <h2>9. Plank to Push-up</h2>
          <p>Combine core stability with upper body strength for a complete body workout.</p>
          
          <h2>10. Medicine Ball Slams</h2>
          <p>Release stress and build power with this explosive full-body movement.</p>
          
          <h3>Sample HIIT Workout Structure:</h3>
          <ul>
            <li>Warm-up: 5 minutes of light cardio and dynamic stretching</li>
            <li>Work: 30 seconds per exercise</li>
            <li>Rest: 15 seconds between exercises</li>
            <li>Repeat: Complete 3-4 rounds of the circuit</li>
            <li>Cool-down: 5 minutes of stretching</li>
          </ul>
          
          <p>Remember to always warm up before starting any HIIT workout and cool down afterwards. Consistency is key to seeing results! Start with 2-3 sessions per week and gradually increase as your fitness improves.</p>
          
          <h3>Safety Tips:</h3>
          <ul>
            <li>Consult with a doctor before starting any new exercise program</li>
            <li>Focus on proper form over speed</li>
            <li>Stay hydrated throughout your workout</li>
            <li>Listen to your body and rest when needed</li>
          </ul>
        `,
        author: "Dr. Blossom Maduafokwa",
        date: "Dec 15, 2024",
        readTime: "8 min read",
        category: "Workouts",
        views: 1520,
        tags: ["HIIT", "Workout", "Fat Burning", "Fitness"],
        published_at: "2024-12-15T10:00:00.000Z",
      },
      "the-science-behind-post-workout-nutrition": {
        id: "2",
        title: "The Science Behind Post-Workout Nutrition",
        slug: "the-science-behind-post-workout-nutrition",
        content: `
          <p>Proper nutrition after exercise is crucial for muscle recovery, growth, and optimal performance. Let's explore the science behind post-workout nutrition.</p>
          
          <h2>The Anabolic Window</h2>
          <p>Contrary to popular belief, the "anabolic window" isn't as narrow as once thought. Research shows you have up to 2 hours after exercise to consume nutrients for optimal recovery.</p>
          
          <h2>Protein: The Building Blocks</h2>
          <p>Protein is essential for muscle repair and growth. Aim for 20-40 grams of high-quality protein within 2 hours of your workout:</p>
          <ul>
            <li>Whey protein: Fast-absorbing and rich in leucine</li>
            <li>Casein protein: Slow-releasing for sustained amino acid delivery</li>
            <li>Plant-based options: Pea, rice, or hemp protein</li>
          </ul>
          
          <h2>Carbohydrates: Replenishing Energy Stores</h2>
          <p>Carbs replenish glycogen stores depleted during exercise. The amount needed depends on workout intensity:</p>
          <ul>
            <li>Light workout: 0.5g per kg of body weight</li>
            <li>Moderate workout: 0.5-0.7g per kg of body weight</li>
            <li>Intense workout: 0.7-1.0g per kg of body weight</li>
          </ul>
          
          <h2>Timing Matters</h2>
          <p>For optimal results, consume your post-workout meal within 2 hours of exercise. This timing maximizes muscle protein synthesis and glycogen replenishment.</p>
          
          <h2>Hydration: Often Overlooked</h2>
          <p>Rehydration is crucial. For every pound lost during exercise, drink 16-24 ounces of water. Electrolyte replacement is also important for longer or more intense workouts.</p>
          
          <h2>Sample Post-Workout Meals</h2>
          <ul>
            <li>Protein shake with banana</li>
            <li>Greek yogurt with berries</li>
            <li>Chicken breast with sweet potato</li>
            <li>Salmon with quinoa and vegetables</li>
          </ul>
          
          <p>Remember, consistency in post-workout nutrition is just as important as your workout consistency. Fuel your body properly to see optimal results!</p>
        `,
        author: "Mike Chen",
        date: "Dec 12, 2024",
        readTime: "7 min read",
        category: "Nutrition",
        views: 1280,
        tags: ["Nutrition", "Recovery", "Protein", "Carbs"],
        published_at: "2024-12-12T10:00:00.000Z",
      },
    };

    return mockPosts[postSlug] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-32 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <div className="text-xl text-primary">Loading blog post...</div>
            <p className="text-gray-600">Fetching the article content</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/blog">
            <Button className="bg-chocolate text-creamish hover:bg-chocolate/90">
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button className="bg-chocolate text-creamish hover:bg-chocolate/90">
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <span className="inline-block bg-chocolate text-creamish px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
              {post.views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()} views
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none 
                      prose-headings:text-foreground 
                      prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:my-4
                      prose-ul:text-foreground/90 prose-ul:my-4
                      prose-li:my-2
                      prose-strong:text-foreground prose-strong:font-bold
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                      prose-img:rounded-xl prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share & Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                Published on {post.date}
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
