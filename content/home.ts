// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ...types unchanged

// ─── Defaults ───────────────────────────────────────────────────────────────

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "New",
    badgeOuter: "StreamPilot is here",
    titleBefore: "Curate your",
    titleHighlight: "Streaming",
    titleAfter: "life. Together.",
    subtitle:
      "StreamPilot helps you and your teams organize, discover, and share what to watch, review, and discuss. Plan your streaming journey—seamlessly.",
    primaryCta: { label: "Get Started Free", href: "#collections" },
    secondaryCta: { label: "See Collections", href: "#collections" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "StreamPilot dashboard preview",
  },

  sponsors: {
    heading: "Powered by industry leaders",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Sparkle", name: "OpenAI" },
      { icon: "Clapperboard", name: "TMDB" },
      { icon: "Television", name: "Netflix" },
      { icon: "Star", name: "Prime Video" },
      { icon: "Sliders", name: "Hulu" },
      { icon: "PlayCircle", name: "Disney+" },
    ],
  },

  benefits: {
    eyebrow: "Why StreamPilot",
    heading: "Team up for the ultimate streaming journey",
    description:
      "Never lose track of what to watch across all your services. StreamPilot brings all your titles into one dashboard for seamless planning and discovery with friends, family, or your team.",
    items: [
      {
        icon: "Film",
        title: "All Your Shows in One Place",
        description: "Unify your streaming across Netflix, Hulu, and more—add any show or movie, any platform.",
      },
      {
        icon: "Users",
        title: "Collaborative Watchlists",
        description: "Collections everyone can contribute to. Plan a movie night or tackle series together.",
      },
      {
        icon: "Star",
        title: "Ratings & Reviews",
        description: "Rate, review, and discuss with your team. The best picks rise to the top.",
      },
      {
        icon: "MessageCircle",
        title: "Comment & Discuss",
        description: "Every title is a conversation—start threads, share thoughts, and decide what's next.",
      },
    ],
  },

  features: {
    eyebrow: "Features",
    heading: "Everything you need to curate and track what matters",
    subtitle:
      "StreamPilot delivers collaborative entertainment management for the age of infinite streaming.",
    items: [
      { icon: "List", title: "Shared Collections", description: "Curate watchlists for the family, friends, or your project team." },
      { icon: "User", title: "Personal Watch Tracking", description: "See which member has watched each title—and what's next to watch." },
      { icon: "Stars", title: "Reviews & Ratings", description: "Every team member can add, edit, or update their verdict. Ratings are always up to date." },
      { icon: "Send", title: "Easy Recommendations", description: "Suggest shows to anyone on the team. See what’s trending internally." },
      { icon: "Filter", title: "Smart Filters", description: "Sort by platform, genre, progress, or popularity any way you like." },
      { icon: "SpeechBubble", title: "Conversations that Matter", description: "Every show and movie is a chance to share. Comment threads help you decide together." },
    ],
  },

  services: {
    eyebrow: "StreamPilot Services",
    heading: "Your streaming, your way",
    subtitle:
      "No more scattered lists or lost recommendations. StreamPilot brings order to your entertainment, with a beautiful, collaborative dashboard.",
    items: [
      { title: "Collections & Titles", description: "Easily create, manage, and share collaborative watchlists by category, interest, or event.", pro: false },
      { title: "Team Recommendations", description: "Send and manage recommendations to other users or groups—see the most suggested picks.", pro: false },
      { title: "Comment Threads", description: "Start discussions around any title, fostering team talk and shared excitement.", pro: false },
      { title: "Discovery & Browse", description: "Browse all titles, use filters, and track everyone’s progress in real time.", pro: true },
    ],
  },

  testimonials: {
    eyebrow: "What users are saying",
    heading: "Families and teams love StreamPilot",
    reviews: [
      { image: "/demo-img.jpg", name: "Ava Jordan", role: "Family Organizer", comment: "Finally a way to make movie nights fun again! StreamPilot made it easy for all of us to plan.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Liam Patel", role: "Team Lead", comment: "No more lost show notes. Our team always knows what's next. StreamPilot is a must-have.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Isabella Nguyen", role: "Student", comment: "So helpful for managing my binge list with friends. The UI is gorgeous!", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Noah Garcia", role: "Coach", comment: "Great for our group watch sessions—everyone stays in sync, and discussions are lively.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Emma Rodríguez", role: "Parent", comment: "Parental controls are easy, and the collections keep us organized. Highly recommend.", rating: 4.9 },
    ],
  },

  team: {
    eyebrow: "Team",
    heading: "Meet the StreamPilot team",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder & CEO", "Product Vision"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/chiragdodiya" },
          { name: "GitHub", url: "https://github.com/chiragdodiya" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Alex",
        lastName: "Reed",
        positions: ["Design Lead"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "Mina",
        lastName: "Lee",
        positions: ["Backend Engineer"],
        socialNetworks: [
          { name: "GitHub", url: "https://github.com/" },
        ],
      },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "One plan—yours",
    subtitle: "Free for individuals and small teams. Contact us for special needs.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Free",
        popular: true,
        price: 0,
        description: "All features, all the time. No lock-in. Try StreamPilot risk-free.",
        buttonText: "Start Free",
        benefits: [
          "Unlimited watchlists",
          "Invite friends and family",
          "Comment threads",
          "Personal and shared reviews",
          "Teams for every group",
        ],
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    heading: "Connect with StreamPilot",
    description:
      "Want tips for getting started, integration help, or have a feature idea? Reach out—we’d love to talk streaming.",
    mailtoAddress: "chirag@bidx.ai",
    info: {
      address: { label: "Find us", value: "Remote-first • Global" },
      phone: { label: "Call us", value: "" },
      email: { label: "Email us", value: "chirag@bidx.ai" },
      hours: { label: "Hours", value: ["Mon - Fri", "9AM - 6PM UTC"] },
    },
    formSubjects: ["Product Inquiry", "Feature Request", "Support", "Partnership"],
    formSubmitLabel: "Send message",
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Your questions, answered",
    items: [
      { question: "Can I invite my friends or family?", answer: "Absolutely—create your group, invite members, and plan together." },
      { question: "Is StreamPilot really free?", answer: "Yes! You can use all features for as many teams as you like at no charge." },
      { question: "Do you sell my data?", answer: "No. StreamPilot is privacy-first. Your lists are yours only, and never shared without your consent." },
      { question: "What platforms do you support?", answer: "Any platform you can type in. We’re agnostic—Netflix, Hulu, Disney+, and more." },
      { question: "How do recommendations work?", answer: "Every team member can recommend a show or movie to another user or to the whole team." },
    ],
  },

  footer: {
    brandName: "StreamPilot",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "chirag@bidx.ai", href: "mailto:chirag@bidx.ai" },
          { label: "Github", href: "https://github.com/chiragdodiya" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Collections", href: "#collections" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Support", href: "#contact" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com/chiragdodiya" },
        ],
      },
    ],
    copyright: "\u00a9 2026 StreamPilot.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  navbar: {
    brandName: "StreamPilot",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#collections", label: "Collections" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Features",
    featureImage: { src: "/hero-image-light.jpeg", alt: "StreamPilot preview" },
    features: [
      { title: "Collaborative Collections", description: "Organize, share, and track shows with teams or friends." },
      { title: "Personal & Team Progress", description: "See progress for yourself and everyone on board." },
      { title: "Discussion & Ratings", description: "Comments, reviews, and recommendations for every title." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiya", ariaLabel: "View on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}