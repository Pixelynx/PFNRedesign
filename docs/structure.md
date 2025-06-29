# PFN Redesign - React Component Hierarchy

App/
├─ Layout/
│  ├─ Header/
│  │  ├─ Logo
│  │  ├─ Navigation
│  │  ├─ SearchBar
│  │  ├─ CartIcon
│  │  └─ AuthLinks (Login/Register)
│  ├─ Footer/
│  │  ├─ SiteLinks
│  │  ├─ SocialMedia
│  │  └─ ContactInfo
│  └─ Main (content container)
├─ Pages/
│  ├─ HomePage/
│  │  ├─ HeroBanner
│  │  ├─ FeaturedProducts
│  │  ├─ CategoryHighlights
│  │  └─ Testimonials
│  ├─ ProductsPage/
│  │  ├─ FilterSidebar
│  │  ├─ ProductGrid
│  │  │  └─ ProductCard (reusable)
│  │  └─ Pagination
│  ├─ ProductDetailPage/
│  │  ├─ ImageGallery
│  │  ├─ ProductInfo
│  │  ├─ AddToCartForm
│  │  └─ RelatedProducts
│  ├─ CartPage/
│  │  ├─ CartItemList
│  │  │  └─ CartItem (reusable)
│  │  ├─ CartSummary
│  │  └─ CheckoutButton
│  ├─ CheckoutPage/
│  │  ├─ CheckoutStepper
│  │  ├─ ShippingInfoForm
│  │  ├─ PaymentForm
│  │  ├─ OrderSummary
│  │  └─ ConfirmationSection
│  ├─ AuthPages/
│  │  ├─ LoginForm
│  │  └─ RegisterForm
│  └─ OrderConfirmationPage/
│     ├─ OrderDetails
│     └─ ContinueShopping
├─ Shared/ (Reusable components)
│  ├─ UI/
│  │  ├─ Button
│  │  ├─ Input
│  │  ├─ Modal
│  │  ├─ Dropdown
│  │  ├─ Card
│  │  └─ Loader
│  ├─ Forms/
│  │  ├─ FormInput
│  │  ├─ FormSelect
│  │  └─ FormValidation
│  └─ Utilities/
│     ├─ ErrorBoundary
│     └─ NotificationSystem
└─ Context/ (State management)
   ├─ AuthContext
   ├─ CartContext
   └─ ProductContext
