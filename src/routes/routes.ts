import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  createProductBatch,
} from '../controllers/ProductController';
import { createCurrency, deleteCurrency, getCurrencies, getCurrencyById, updateCurrency } from '../controllers/CurrencyController';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../controllers/CategoryController';
import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from '../controllers/BrandController';
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from '../controllers/CustomerController';

import { login, logout } from '../controllers/LoginController';
import { authenticateJWT } from '../authMiddleware';

const router = express.Router();

const defaultRoutePrefix = '/api';

/** Login Routes*/
router.post(defaultRoutePrefix + '/login', login);
router.post(defaultRoutePrefix + '/logout', logout);
//router.get(defaultRoutePrefix + '/profile', getUserProfile);

/** Purchase Routes*/
/* router.post(defaultRoutePrefix + '/purchases', authenticateJWT, createPurchase);
router.get(defaultRoutePrefix + '/purchases/search', searchProducts);
router.get(defaultRoutePrefix + '/purchases', authenticateJWT, getAllPurchaseInfo);
router.get(defaultRoutePrefix + '/purchases/:id', authenticateJWT, getPurchaseInfo);
router.put(defaultRoutePrefix + '/products/:id', updateProduct);
router.delete(defaultRoutePrefix + '/purchases/:id', authenticateJWT, deletePurchaseInfo); */

/** Product Routes*/
router.post(defaultRoutePrefix + '/products', authenticateJWT, createProduct);
router.get(defaultRoutePrefix + '/products/search',authenticateJWT, searchProducts);
router.get(defaultRoutePrefix + '/products', authenticateJWT, getProducts);
router.get(defaultRoutePrefix + '/products/:id', authenticateJWT, getProductById);
router.put(defaultRoutePrefix + '/products/:id', authenticateJWT, updateProduct);
router.delete(defaultRoutePrefix + '/products/:id', authenticateJWT, deleteProduct);

/** Product Batch */
router.post(defaultRoutePrefix + '/products/:id/productBatch', authenticateJWT, createProductBatch);

/**Import Product */
//router.post(defaultRoutePrefix + '/products/import', authenticateJWT, importDataFromExcel);

/** Currency Routes*/
router.post(defaultRoutePrefix + '/currencies', authenticateJWT, createCurrency);
router.get(defaultRoutePrefix + '/currencies', authenticateJWT, getCurrencies);
router.get(defaultRoutePrefix + '/currencies/:id',authenticateJWT, getCurrencyById);
router.put(defaultRoutePrefix + '/currencies/:id', authenticateJWT, updateCurrency);
router.delete(defaultRoutePrefix + '/currencies/:id', authenticateJWT, deleteCurrency);

/**Category Routes */
router.post(defaultRoutePrefix + '/categories', authenticateJWT, createCategory);
router.get(defaultRoutePrefix + '/categories', authenticateJWT, getCategories);
router.get(defaultRoutePrefix + '/categories/:id', authenticateJWT, getCategoryById);
router.put(defaultRoutePrefix + '/categories/:id', authenticateJWT, updateCategory);
router.delete(defaultRoutePrefix + '/categories/:id', authenticateJWT, deleteCategory);

/**Brand Routes */
router.post(defaultRoutePrefix + '/brands', authenticateJWT, createBrand);
router.get(defaultRoutePrefix + '/brands', authenticateJWT, getBrands);
router.get(defaultRoutePrefix + '/brands/:id', authenticateJWT, getBrandById);
router.put(defaultRoutePrefix + '/brands/:id', authenticateJWT, updateBrand);
router.delete(defaultRoutePrefix + '/brands/:id', authenticateJWT, deleteBrand);

/**Customer Routes */
router.post(defaultRoutePrefix + '/customers', authenticateJWT, createCustomer);
router.get(defaultRoutePrefix + '/customers', authenticateJWT, getCustomers);
router.get(defaultRoutePrefix + '/customers/:id', authenticateJWT, getCustomerById);
router.put(defaultRoutePrefix + '/customers/:id', authenticateJWT, updateCustomer);
router.delete(defaultRoutePrefix + '/customers/:id', authenticateJWT, deleteCustomer);

export default router;
