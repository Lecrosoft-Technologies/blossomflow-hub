import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, User, ArrowRight, Heart, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 High-Intensity Workouts That Burn Fat Fast",
      excerpt: "Discover the most effective HIIT routines that will transform your body and boost your metabolism in just 20 minutes a day.",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Workouts",
      featured: true
    },
    {
      id: 2,
      title: "The Science Behind Post-Workout Nutrition",
      excerpt: "Learn what to eat after your workout to maximize muscle recovery and optimize your fitness gains.",
      author: "Mike Chen",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      category: "Nutrition"
    },
    {
      id: 3,
      title: "Building Mental Resilience Through Fitness",
      excerpt: "How regular exercise can strengthen your mind and help you overcome life's challenges with confidence.",
      author: "Emma Davis",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Wellness"
    },
    {
      id: 4,
      title: "Home Gym Setup: Essential Equipment Guide",
      excerpt: "Create the perfect workout space at home with our curated list of must-have fitness equipment.",
      author: "Sarah Johnson",
      date: "Dec 8, 2024",
      readTime: "8 min read",
      category: "Equipment"
    },
    {
      id: 5,
      title: "Yoga for Athletes: Flexibility Meets Performance",
      excerpt: "Discover how incorporating yoga into your routine can enhance athletic performance and prevent injuries.",
      author: "Emma Davis",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      category: "Wellness"
    },
    {
      id: 6,
      title: "Intermittent Fasting and Exercise: The Perfect Combo",
      excerpt: "Learn how to combine intermittent fasting with your workout routine for optimal fat loss and energy.",
      author: "Mike Chen",
      date: "Dec 3, 2024",
      readTime: "9 min read",
      category: "Nutrition"
    }
  ];

  const categories = ["All", "Workouts", "Nutrition", "Wellness", "Equipment"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Fitness</span>{' '}
              <span className="text-foreground">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert tips, workout guides, and wellness insights to fuel your fitness journey. 
              Stay informed, stay motivated, stay strong.
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
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "btn-primary" : "border-primary/50 hover:bg-primary/10"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
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
                    <span className="text-primary font-semibold">{blogPosts[0].category}</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </div>
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <Button className="btn-primary group">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="bg-gradient-primary/20 rounded-2xl h-80 flex items-center justify-center">
                  <Zap className="h-20 w-20 text-primary" />
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="card-glass group hover:scale-105 transition-all duration-300 border border-border/50">
                  <div className="bg-gradient-secondary/20 h-48 rounded-t-lg flex items-center justify-center mb-6">
                    {post.category === "Nutrition" && <Heart className="h-12 w-12 text-secondary" />}
                    {post.category === "Wellness" && <Star className="h-12 w-12 text-primary" />}
                    {post.category === "Equipment" && <Zap className="h-12 w-12 text-cyber-blue" />}
                    {post.category === "Workouts" && <Zap className="h-12 w-12 text-energy-green" />}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-primary font-semibold text-sm">{post.category}</span>
                      <span className="text-muted-foreground text-sm">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
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
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;