function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    "All",
    "Music",
    "Gaming",
    "Movies",
    "News",
    "Sports",
    "Technology",
    "Education",
  ];

  return (
    <div className="category-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${
            selectedCategory === category ? "selected" : ""
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;