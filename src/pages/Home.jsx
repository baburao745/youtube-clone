import { useEffect, useState } from "react";
import axios from "axios";

import CategoryFilter from "../components/CategoryFilter";
import VideoGrid from "../components/VideoGrid";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendVideos, setBackendVideos] = useState([]);

  const sampleVideos = [
    {
      id: 1,
      title: "Learn React JS in One Hour",
      channel: "Code Academy",
      views: "1.2M",
      category: "Technology",
      thumbnail: "https://picsum.photos/400/225?random=1",
    },
    {
      id: 2,
      title: "JavaScript Full Course",
      channel: "Programming Hub",
      views: "850K",
      category: "Education",
      thumbnail: "https://picsum.photos/400/225?random=2",
    },
    {
      id: 3,
      title: "Top 10 Coding Tips",
      channel: "Tech World",
      views: "620K",
      category: "Technology",
      thumbnail: "https://picsum.photos/400/225?random=3",
    },
    {
      id: 4,
      title: "MERN Stack Project",
      channel: "Developer Zone",
      views: "450K",
      category: "Education",
      thumbnail: "https://picsum.photos/400/225?random=4",
    },
    {
      id: 5,
      title: "How to Become a Software Developer",
      channel: "Career Guide",
      views: "1.8M",
      category: "Education",
      thumbnail: "https://picsum.photos/400/225?random=5",
    },
    {
      id: 6,
      title: "MongoDB Complete Tutorial",
      channel: "Database School",
      views: "390K",
      category: "Technology",
      thumbnail: "https://picsum.photos/400/225?random=6",
    },
    {
      id: 7,
      title: "Node.js Backend Tutorial",
      channel: "Web Developers",
      views: "720K",
      category: "Technology",
      thumbnail: "https://picsum.photos/400/225?random=7",
    },
    {
      id: 8,
      title: "AI and Machine Learning",
      channel: "Future Tech",
      views: "2.1M",
      category: "Education",
      thumbnail: "https://picsum.photos/400/225?random=8",
    },
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/videos"
        );

        const data = response.data.videos || response.data;

        const convertedVideos = data.map((video) => ({
          id: video._id,
          title: video.title,
          channel: video.channel?.name || "Unknown Channel",
          views: video.views,
          category: video.category || "Other",
          thumbnail: video.thumbnailUrl,
        }));

        setBackendVideos(convertedVideos);
      } catch (error) {
        console.error("Unable to load backend videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const videos = [...sampleVideos, ...backendVideos];

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="home-search">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <VideoGrid videos={filteredVideos} />

      {filteredVideos.length === 0 && (
        <p className="no-results">
          No videos found.
        </p>
      )}
    </div>
  );
}

export default Home;