import "./AutoScrollCards.css";

function AutoScrollCards() {
  // Sample card data - you can replace this with actual product data
  const cards = [
    {
      id: 1,
      title: "New Arrivals",
      subtitle: "Latest Collection",
      image: "🛍️",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "Flash Sale",
      subtitle: "Up to 50% Off",
      image: "⚡",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "Best Sellers",
      subtitle: "Top Rated Products",
      image: "⭐",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: 4,
      title: "Free Shipping",
      subtitle: "On Orders Over $50",
      image: "🚚",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      id: 5,
      title: "Summer Collection",
      subtitle: "Hot Deals",
      image: "☀️",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      id: 6,
      title: "Electronics",
      subtitle: "Tech Essentials",
      image: "📱",
      color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
  ];

  // Duplicate cards for seamless infinite scroll
  const duplicatedCards = [...cards, ...cards];

  return (
    <div className="auto-scroll-container">
      <div className="auto-scroll-wrapper">
        <div className="auto-scroll-content">
          {duplicatedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="scroll-card"
              style={{ background: card.color }}
            >
              <div className="card-icon">{card.image}</div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-subtitle">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutoScrollCards;
