import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/ProductController';
import { createCurrency, deleteCurrency, getCurrencies, getCurrencyById, updateCurrency } from '../controllers/CurrencyController';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../controllers/CategoryController';
import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from '../controllers/BrandController';
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from '../controllers/CustomerController';

const router = express.Router();

/** Product Routes*/
router.post('/products', createProduct);
router.get('/products/filter', searchProducts);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

/** Currency Routes*/

router.post('/currencies', createCurrency);
router.get('/currencies', getCurrencies);
router.get('/currencies/:id', getCurrencyById);
router.put('/currencies/:id', updateCurrency);
router.delete('/currencies/:id', deleteCurrency);

/**Category Routes */

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

/**Brand Routes */

router.post('/brands', createBrand);
router.get('/brands', getBrands);
router.get('/brands/:id', getBrandById);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

/**Customer Routes */
router.post('/customers', createCustomer);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);


export default router;
