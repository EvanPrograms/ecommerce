# My E-commerce Site

An e-commerce website made using React and Node, using a postgreSQL database. There is guest and authenticated user functionality, payments and checkout using Stripe, a functional shopping cart, and ability to leave reviews. You can create new users, log in, and there is a functional forgot password system that will email you a password reset link.

You need to set environmental variables in the frontend for VITE_API_URL and REACT_APP_GRAPHQL_URL for graphql, and use environmental variables for your Stripe key and price ID. You can create a .env.development for development mode, and .env.production for production (which you may need to set in SSH in, for example, AWS EC2, if you pull using git).

You will also need to set environmental variables for the backend, .env.development and .env.production, for your DATABASE_URL for postgres, CHOCOLATE_SHOP_EMAIL_PASSWORD and CHOCOLATE_SHOP_EMAIL for a gmail account using an app password to send out emails for the forgot password system. You will also need your STRIPE_KEY, PRICE_ID, and WEBHOOK_SECRET from stripe, HOST, and GRAPHQL_PATH, and your JWT_SECRET for jwt secret token.

Finally, you need to configure nginx as appropriate.

You can find it on passionchocolates.com, if you'd like to deploy this site on your own, you can use AWS EC2 like I did, or use something like Fly.io or heroku. You will also need to create a database initially in postgres and set the initial products, which you can find in ecommerce/frontend/src/products.js or create your own products.
