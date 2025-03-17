
import { useState, useEffect } from "react";
import { Loader2, Rss } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  title: string;
  url: string;
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
          { title: "AI breakthrough enables more efficient language processing", url: "#" },
          { title: "New React framework promises faster rendering times", url: "#" },
          { title: "Quantum computing reaches major milestone", url: "#" },
          { title: "Tech giants announce collaboration on open-source project", url: "#" },
          { title: "New cybersecurity measures implemented across industries", url: "#" },
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
      
      <div className="h-16 overflow-hidden relative">
        {loading ? (
          <div className="space-y-2">
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
                className="text-gray-300 hover:text-white hover:underline line-clamp-2" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
