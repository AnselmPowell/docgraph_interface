// src/app/playground/components/ResponsiveCard/mockData.js
export const cardMockData = {
    title: "Premium Plan",
    description: "Perfect for growing businesses and teams",
    features: [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration tools"
    ],
    metrics: [
      { label: "Users", value: "150+" },
      { label: "Uptime", value: "99.9%" },
      { label: "Speed", value: "2.1s" }
    ],
    price: {
      amount: 49.99,
      period: "month"
    },
    image: "/api/placeholder/400/300",
    tags: ["Popular", "Best Value"],
    ctaButton: {
      label: "Get Started",
      onClick: () => console.log("CTA clicked")
    },
    status: "active"
  };