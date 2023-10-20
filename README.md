# Tech Store Backend API
## Introduction
This repository contains the backend API for the Tech Store website. This API is built using MongoDB and Express.js, providing the necessary functionality to support the frontend of the online tech store.

API Link: https://tech-store-server-one.vercel.app


## Features
* Products management (CRUD operations).
* Cart functionality.

## API Endpoints
The API has the following endpoints:


### Brands:

* __GET /brands__ - Get a list of all brands.
* __GET /brand-products/:brandName__ - Get products of a specific brand.
* __GET /brand-products/details/:productId__ - Get details of a specific product.
* __POST /brand-products__ - Create a new product(requires both admin and user privileges).
* __PUT /brand-products/:productId__ - Update a product (requires both admin and user privileges).


### Cart:

* __GET /cart__ - Get the user's shopping cart.
* __GET /cart/:displayName__ - Get cart items by display name.
* __DELETE /cart/:productId__ - Delete a product (requires both admin and user privileges).