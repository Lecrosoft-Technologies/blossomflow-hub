import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Clock,
  User,
  ArrowRight,
  Heart,
  Zap,
  Star,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { apiService, Post as ApiPost } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured_image?: string;
  views: number;
  tags: string[];
  published_at: string;
  featured?: boolean;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch posts from API
      const apiPosts = await apiService.getPosts();
      console.log("API Posts received:", apiPosts);

      // Transform API posts to match your component's structure
      const transformedPosts: BlogPost[] = apiPosts.map((apiPost: ApiPost) => {
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

        return {
          id: apiPost.id,
          title: apiPost.title,
          slug: apiPost.slug,
          excerpt: apiPost.excerpt || apiPost.content.substring(0, 150) + "...",
          content: apiPost.content,
          author: apiPost.author,
          date: formattedDate,
          readTime: `${readTime} min read`,
          category: apiPost.category || "General",
          featured_image: apiPost.featured_image,
          views: apiPost.views || 0,
          tags: apiPost.tags || [],
          published_at: apiPost.published_at,
          // Mark first post as featured
          featured: false,
        };
      });

      // Mark first post as featured if we have posts
      if (transformedPosts.length > 0) {
        transformedPosts[0].featured = true;
      }

      console.log("Transformed posts:", transformedPosts);
      setBlogPosts(transformedPosts);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      setError("Failed to load blog posts. Please try again later.");

      // Fallback to mock data if API fails
      setBlogPosts(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const apiCategories = await apiService.getPostCategories();
      if (apiCategories && apiCategories.length > 0) {
        setCategories(["All", ...apiCategories]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Use default categories if API fails
      setCategories([
        "All",
        "Workouts",
        "Nutrition",
        "Wellness",
        "Equipment",
        "General",
      ]);
    }
  };

  // Mock data fallback
  const getMockData = (): BlogPost[] => [
    {
      id: "1",
      title: "10 High-Intensity Workouts That Burn Fat Fast",
      slug: "10-high-intensity-workouts-that-burn-fat-fast",
      excerpt:
        "Discover the most effective HIIT routines that will transform your body and boost your metabolism in just 20 minutes a day.",
      content: "Full blog post content here...",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Workouts",
      featured: true,
      views: 1500,
      tags: ["HIIT", "Workout", "Fitness"],
      published_at: "2024-12-15T10:00:00.000Z",
    },
    {
      id: "2",
      title: "The Science Behind Post-Workout Nutrition",
      slug: "the-science-behind-post-workout-nutrition",
      excerpt:
        "Learn what to eat after your workout to maximize muscle recovery and optimize your fitness gains.",
      content: "Full blog post content here...",
      author: "Mike Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Nutrition",
      featured: false,
      views: 1200,
      tags: ["Nutrition", "Recovery"],
      published_at: "2024-12-12T10:00:00.000Z",
    },
    {
      id: "3",
      title: "Building Mental Resilience Through Fitness",
      slug: "building-mental-resilience-through-fitness",
      excerpt:
        "How regular exercise can strengthen your mind and help you overcome life's challenges with confidence.",
      content: "Full blog post content here...",
      author: "Emma Davis",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Wellness",
      featured: false,
      views: 900,
      tags: ["Mental Health", "Wellness"],
      published_at: "2024-12-10T10:00:00.000Z",
    },
    {
      id: "4",
      title: "Home Gym Setup: Essential Equipment Guide",
      slug: "home-gym-setup-essential-equipment-guide",
      excerpt:
        "Create the perfect workout space at home with our curated list of must-have fitness equipment.",
      content: "Full blog post content here...",
      author: "Sarah Johnson",
      date: "Dec 8, 2024",
      readTime: "8 min read",
      category: "Equipment",
      featured: false,
      views: 1100,
      tags: ["Equipment", "Home Gym"],
      published_at: "2024-12-08T10:00:00.000Z",
    },
    {
      id: "5",
      title: "Yoga for Athletes: Flexibility Meets Performance",
      slug: "yoga-for-athletes-flexibility-meets-performance",
      excerpt:
        "Discover how incorporating yoga into your routine can enhance athletic performance and prevent injuries.",
      content: "Full blog post content here...",
      author: "Emma Davis",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Wellness",
      featured: false,
      views: 800,
      tags: ["Yoga", "Flexibility"],
      published_at: "2024-12-05T10:00:00.000Z",
    },
    {
      id: "6",
      title: "Intermittent Fasting and Exercise: The Perfect Combo",
      slug: "intermittent-fasting-and-exercise-the-perfect-combo",
      excerpt:
        "Learn how to combine intermittent fasting with your workout routine for optimal fat loss and energy.",
      content: "Full blog post content here...",
      author: "Mike Chen",
      date: "Dec 3, 2024",
      readTime: "9 min read",
      category: "Nutrition",
      featured: false,
      views: 1300,
      tags: ["Intermittent Fasting", "Nutrition"],
      published_at: "2024-12-03T10:00:00.000Z",
    },
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    // For now, just refetch posts
    // In a real app, you would implement pagination
    fetchPosts();
    toast({
      title: "Loading more articles...",
      description: "Fetching the latest blog posts",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Nutrition":
        return <Heart className="h-12 w-12 text-chocolate" />;
      case "Wellness":
        return <Star className="h-12 w-12 text-chocolate" />;
      case "Equipment":
      case "Workouts":
        return <Zap className="h-12 w-12 text-chocolate" />;
      default:
        return <Zap className="h-12 w-12 text-chocolate" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader className="h-12 w-12 animate-spin text-primary" />
              <div className="text-xl text-primary">Loading blog posts...</div>
              <p className="text-gray-600">
                Fetching the latest articles from our blog
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error && blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white/80 backdrop-blur rounded-lg p-8 max-w-2xl mx-auto">
              <div className="text-red-500 mb-4 text-xl">⚠️ {error}</div>
              <p className="text-gray-600 mb-4">
                Showing demo blog posts instead
              </p>
              <Button
                onClick={fetchPosts}
                className="bg-chocolate text-creamish hover:bg-chocolate/90"
              >
                Retry Loading Posts
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Fitness
              </span>{" "}
              <span className="text-foreground">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert tips, workout guides, and wellness insights to fuel your
              fitness journey. Stay informed, stay motivated, stay strong.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryClick(category)}
                className={
                  selectedCategory === category
                    ? "btn-primary"
                    : "border-primary/50 hover:bg-primary/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="card-glass p-8 lg:p-12 border border-primary/20 mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                      <span className="text-primary font-semibold">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </div>
                      <span>{featuredPost.date}</span>
                    </div>
                    <Link to={`/blog/${featuredPost.slug}`}>
                      <Button className="btn-primary group">
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gradient-primary/20 rounded-2xl h-80 flex items-center justify-center">
                    {featuredPost.featured_image ? (
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <Zap className="h-20 w-20 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {regularPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-2xl text-gray-500 mb-4">
                  No blog posts found in "{selectedCategory}"
                </div>
                <Button
                  onClick={() => setSelectedCategory("All")}
                  className="bg-chocolate text-creamish hover:bg-chocolate/90"
                >
                  View All Posts
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Link to={`/blog/${post.slug}`} key={post.id}>
                      <article className="card-glass group hover:scale-105 transition-all duration-300 border border-border/50 h-full">
                        <div className="bg-creamish-dark/30 h-48 rounded-t-lg flex items-center justify-center mb-6">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                          ) : (
                            getCategoryIcon(post.category)
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-chocolate text-creamish px-3 py-1 rounded-full font-semibold text-sm">
                              {post.category}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {post.date}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 group-hover:text-chocolate transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-foreground/70 mb-4 leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
                            </div>
                          </div>
                          {post.views > 0 && (
                            <div className="mt-4 text-sm text-gray-500">
                              {post.views.toLocaleString()} views
                            </div>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10"
                    onClick={handleLoadMore}
                  >
                    Load More Articles
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
