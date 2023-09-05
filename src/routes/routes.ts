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
import { createPurchase, deletePurchaseInfo, getAllPurchaseInfo, getPurchaseInfo } from '../controllers/PurchaseController';
import { importDataFromExcel } from '../controllers/ImportExcelController';
import { getUserProfile, login } from '../controllers/UserController';

const router = express.Router();

const defaultRoutePrefix = '/api';

/** Login Routes*/
router.post(defaultRoutePrefix + '/login', login);
router.get(defaultRoutePrefix + '/profile', getUserProfile);

/** Purchase Routes*/
router.post(defaultRoutePrefix + '/purchases', createPurchase);
/* router.get(defaultRoutePrefix + '/purchases/search', searchProducts); */
router.get(defaultRoutePrefix + '/purchases', getAllPurchaseInfo);
router.get(defaultRoutePrefix + '/purchases/:id', getPurchaseInfo);
/* router.put(defaultRoutePrefix + '/products/:id', updateProduct); */
router.delete(defaultRoutePrefix + '/purchases/:id', deletePurchaseInfo);

/** Product Routes*/
router.post(defaultRoutePrefix + '/products', createProduct);
router.get(defaultRoutePrefix + '/products/search', searchProducts);
router.get(defaultRoutePrefix + '/products', getProducts);
router.get(defaultRoutePrefix + '/products/:id', getProductById);
router.put(defaultRoutePrefix + '/products/:id', updateProduct);
router.delete(defaultRoutePrefix + '/products/:id', deleteProduct);

/**Import Product */
router.post(defaultRoutePrefix + '/products/import', importDataFromExcel);

/** Currency Routes*/

router.post(defaultRoutePrefix + '/currencies', createCurrency);
router.get(defaultRoutePrefix + '/currencies', getCurrencies);
router.get(defaultRoutePrefix + '/currencies/:id', getCurrencyById);
router.put(defaultRoutePrefix + '/currencies/:id', updateCurrency);
router.delete(defaultRoutePrefix + '/currencies/:id', deleteCurrency);

/**Category Routes */

router.post(defaultRoutePrefix + '/categories', createCategory);
router.get(defaultRoutePrefix + '/categories', getCategories);
router.get(defaultRoutePrefix + '/categories/:id', getCategoryById);
router.put(defaultRoutePrefix + '/categories/:id', updateCategory);
router.delete(defaultRoutePrefix + '/categories/:id', deleteCategory);

/**Brand Routes */

router.post(defaultRoutePrefix + '/brands', createBrand);
router.get(defaultRoutePrefix + '/brands', getBrands);
router.get(defaultRoutePrefix + '/brands/:id', getBrandById);
router.put(defaultRoutePrefix + '/brands/:id', updateBrand);
router.delete(defaultRoutePrefix + '/brands/:id', deleteBrand);

/**Customer Routes */
router.post(defaultRoutePrefix + '/customers', createCustomer);
router.get(defaultRoutePrefix + '/customers', getCustomers);
router.get(defaultRoutePrefix + '/customers/:id', getCustomerById);
router.put(defaultRoutePrefix + '/customers/:id', updateCustomer);
router.delete(defaultRoutePrefix + '/customers/:id', deleteCustomer);




export default router;
