# Binance Trading Bot

A professional trading interface for the Binance Futures API, built with React, TypeScript, and Tailwind CSS. This application provides a user-friendly interface to manage your trading activities on Binance, supporting both mainnet and testnet environments.

## Features

- **Secure API Connection**: Securely connect to your Binance account using API and secret keys.
- **Real-time Order Management**: View your open orders in real-time. The order book is automatically refreshed every 10 seconds.
- **Place Orders**: Easily place new market or limit orders.
- **Cancel Orders**: Cancel open orders with a single click.
- **Activity Log**: Keep track of all your trading activities, including order placements, cancellations, and API connection status.
- **Responsive Design**: A clean and responsive user interface that works on different screen sizes.
- **Testnet Support**: Practice your trading strategies in a risk-free environment using the Binance Futures Testnet.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/binance-trading-bot.git
    cd binance-trading-bot
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Configuration

To connect to your Binance account, you'll need to provide your API key and secret key.

1.  Log in to your Binance account.
2.  Navigate to **API Management**.
3.  Create a new API key. Make sure to enable futures trading permissions.
4.  Copy your API key and secret key.

Enter these keys in the API Setup section of the application interface.

### Running the Application

Once the dependencies are installed and you have your API keys, you can start the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```
The application will be available at `http://localhost:5173`.

## How to Use

1.  **Connect to Binance**: Enter your API Key and Secret Key in the `ApiSetup` component and click "Test & Connect".
2.  **Place an Order**: Use the `OrderForm` to specify the symbol, quantity, price (for limit orders), and order type, then click "Place Order".
3.  **Manage Orders**: View your open orders in the `OrderHistory` table. You can cancel any open order from here.
4.  **Monitor Activity**: The `ActivityLog` will show a history of your actions within the application.
