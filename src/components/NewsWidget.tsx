
import { useState, useEffect } from "react";
import { Rss } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NewsItem {
  title: string;
  url: string;
  imageUrl: string;
}

export const NewsWidget = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // This is a mock fetch - in a real app, you would replace this with an 
        // actual API call to a news service with proper error handling
        // Example: const response = await fetch('https://some-news-api.com/tech-news');
        
        // Simulating API response with mock data
        const mockNews: NewsItem[] = [
          { 
            title: "AI breakthrough enables more efficient language processing", 
            url: "#",
            imageUrl: "https://images.unsplash.com/photo-1677442135144-61c28a4d8cb1?q=80&w=300&auto=format&fit=crop"
          },
          { 
            title: "New React framework promises faster rendering times", 
            url: "#",
            imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop"
          },
          { 
            title: "Quantum computing reaches major milestone", 
            url: "#",
            imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=300&auto=format&fit=crop"
          },
          { 
            title: "Tech giants announce collaboration on open-source project", 
            url: "#",
            imageUrl: "https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?q=80&w=300&auto=format&fit=crop"
          },
          { 
            title: "New cybersecurity measures implemented across industries", 
            url: "#",
            imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=300&auto=format&fit=crop"
          },
        ];
        
        setTimeout(() => {
          setNews(mockNews);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load tech news");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Rotate through news headlines
  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [news]);

  if (error) {
    return <div className="text-red-400 flex items-center"><Rss className="mr-2" size={16} /> {error}</div>;
  }

  return (
    <div className="mt-4 text-left">
      <div className="flex items-center text-blue-400 mb-2">
        <Rss className="mr-2" size={16} />
        <span className="text-sm font-semibold">TECH NEWS</span>
      </div>
      
      <div className="h-48 overflow-hidden relative">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-28 w-full bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-2/3 bg-gray-700" />
          </div>
        ) : (
          news.map((item, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-1000 w-full ${
                index === currentNewsIndex 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
            >
              <a 
                href={item.url} 
                className="block hover:opacity-90 transition-opacity" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="mb-2">
                  <AspectRatio ratio={16/9} className="bg-gray-800 rounded-md overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <p className="text-gray-300 hover:text-white hover:underline line-clamp-2">
                  {item.title}
                </p>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
