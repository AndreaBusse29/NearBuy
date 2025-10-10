# NearBuy

A Progressive Web App that helps users track their favorite products and alerts them when they go on sale at their favorite stores.

## Features

- 📱 Progressive Web App - Install on mobile and desktop
- 💾 Offline Support - Works without internet connection
- 🔔 Price Alerts - Get notified when products reach target price
- 🛍️ Product Tracking - Monitor multiple products across stores
- 📊 Simple Interface - Clean, intuitive design
- 🔒 Type-Safe - Built with TypeScript for reliability

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NearBuy
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript files:
```bash
npm run build
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:8080
```

## Development

### Build Commands

```bash
# Build TypeScript files once
npm run build

# Build in watch mode (auto-rebuild on changes)
npm run watch

# Start production server
npm start

# Start development mode (watch + server)
npm run dev
```

### Project Structure

```
NearBuy/
├── src/
│   ├── types.ts          # TypeScript type definitions
│   ├── app.ts            # Main application logic
│   └── service-worker.ts # Service worker
├── dist/                 # Compiled JavaScript (generated)
├── css/
│   └── styles.css        # Styling
├── icons/                # PWA icons
├── index.html            # Main HTML
├── manifest.json         # PWA manifest
└── tsconfig.json         # TypeScript config
```

## Usage

1. **Add a Product**: Click the "+ Add Product" button and fill in the product details including name, URL, store, current price, and target price.

2. **View Products**: All tracked products are displayed in a grid showing current and target prices.

3. **Delete Products**: Remove products you no longer want to track.

4. **Price Alerts**: When a product reaches your target price, you'll receive a notification (requires notification permission).

## Technology Stack

- TypeScript (ES2020)
- HTML5 / CSS3
- Service Workers
- LocalStorage API
- Web Notifications API

## Future Enhancements

- Automated price checking via API integration
- Price history and trend charts
- Multi-store comparison
- User accounts and cloud sync
- Browser extension

## License

MIT