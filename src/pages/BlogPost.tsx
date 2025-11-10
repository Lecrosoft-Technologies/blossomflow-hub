import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock blog data - will be replaced with API
const mockBlogPosts = {
  '1': {
    title: '10 High-Intensity Workouts That Burn Fat Fast',
    content: `
      <p>High-intensity interval training (HIIT) has revolutionized the fitness world, offering maximum results in minimum time. Here are the top 10 HIIT workouts that will transform your body:</p>
      
      <h2>1. Burpees</h2>
      <p>The ultimate full-body exercise that combines strength and cardio. Perform 30 seconds of burpees followed by 30 seconds of rest, repeat for 10 rounds.</p>
      
      <h2>2. Mountain Climbers</h2>
      <p>Engage your core while elevating your heart rate. These are perfect for burning calories and building endurance.</p>
      
      <h2>3. Jump Squats</h2>
      <p>Build explosive power in your legs while torching calories. Start with 3 sets of 15 reps.</p>
      
      <p>Remember to always warm up before starting any HIIT workout and cool down afterwards. Consistency is key to seeing results!</p>
    `,
    author: 'Sarah Johnson',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    category: 'Workouts',
  },
};

const BlogPost = () => {
  const { id } = useParams();
  
  // TODO: Fetch from API based on id
  const post = mockBlogPosts[id as keyof typeof mockBlogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom mx-auto py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-chocolate text-creamish hover:bg-chocolate-light">
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
      
      <article className="section-padding pt-32">
        <div className="container-custom mx-auto max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="mb-8">
            <span className="inline-block bg-chocolate text-creamish px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-5xl font-heading font-bold mb-6 text-foreground">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
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
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
