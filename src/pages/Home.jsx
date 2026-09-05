import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import VideoGrid from "../components/VideoGrid.jsx";

function Home() {
  const [searchParams] = useSearchParams();

  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchText = searchParams.get("search") || "";

  const sampleVideos = [
    {
      id: "sample-1",
      title: "Amazing Nature Documentary",
      thumbnail: "https://picsum.photos/400/225?random=11",
      channel: "Nature World",
      views: "1.2M",
      category: "Movies",
    },
    {
      id: "sample-2",
      title: "Top 10 Gaming Moments",
      thumbnail: "https://picsum.photos/400/225?random=12",
      channel: "Gaming Zone",
      views: "850K",
      category: "Gaming",
    },
    {
      id: "sample-3",
      title: "Latest Technology Updates",
      thumbnail: "https://picsum.photos/400/225?random=13",
      channel: "Tech Daily",
      views: "620K",
      category: "Technology",
    },
    {
      id: "sample-4",
      title: "Relaxing Music Mix",
      thumbnail: "https://picsum.photos/400/225?random=14",
      channel: "Music Station",
      views: "2.4M",
      category: "Music",
    },
    {
      id: "sample-5",
      title: "Learn JavaScript Easily",
      thumbnail: "https://picsum.photos/400/225?random=15",
      channel: "Code Academy",
      views: "450K",
      category: "Education",
    },
    {
      id: "sample-6",
      title: "Football Highlights",
      thumbnail: "https://picsum.photos/400/225?random=16",
      channel: "Sports Hub",
      views: "980K",
      category: "Sports",
    },
    {
      id: "sample-7",
      title: "Breaking News Today",
      thumbnail: "https://picsum.photos/400/225?random=17",
      channel: "News Network",
      views: "730K",
      category: "News",
    },
    {
      id: "sample-8",
      title: "Best Movie Trailers",
      thumbnail: "https://picsum.photos/400/225?random=18",
      channel: "Movie Central",
      views: "1.8M",
      category: "Movies",
    },
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/videos");

        const backendVideos =
          response.data.videos || response.data || [];

        const formattedVideos = backendVideos.map((video) => ({
          id: video._id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          channel: video.channel?.name || "Unknown Channel",
          views: video.views || 0,
          category: video.category || "Other",
          description: video.description || "",
          videoUrl: video.videoUrl,
        }));

        setVideos([...formattedVideos, ...sampleVideos]);
      } catch (error) {
        console.error("FETCH VIDEOS ERROR:", error);

        setError("Unable to load server videos.");

        setVideos(sampleVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="home-page">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {searchText && (
        <div className="search-results">
          <h2>Search results for "{searchText}"</h2>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          Loading videos...
        </div>
      )}

      {!loading && filteredVideos.length === 0 && (
        <div className="empty-message">
          <h2>No videos found</h2>
          <p>Try another search or category.</p>
        </div>
      )}

      {!loading && filteredVideos.length > 0 && (
        <VideoGrid videos={filteredVideos} />
      )}
    </main>
  );
}

export default Home;