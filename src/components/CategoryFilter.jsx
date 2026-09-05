function CategoryFilter({
  selectedCategory,
  onCategoryChange
}) {
  const categories = [
    "All",
    "Music",
    "Gaming",
    "Movies",
    "News",
    "Sports",
    "Technology",
    "Education"
  ];

  return (
    <div className="category-container">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={
            selectedCategory === category
              ? "category-btn selected"
              : "category-btn"
          }
          onClick={() =>
            onCategoryChange(category)
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;