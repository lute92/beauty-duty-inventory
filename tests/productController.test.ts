import request from 'supertest';
import { Service } from '../src/service';
import Category from '../src/models/Category';
import Brand from '../src/models/Brand';

const app = new Service(3000).getApp();


describe('Product Controller', () => {
    let app:any;
    let server:any;

    beforeAll(async () => {

        jest.mock("../src/models/Brand")
        jest.mock("../src/models/Category")

        // Create an instance of the Express app
        const service = new Service(3000);
        app = service.getApp();

        // Start the Express server
        server = service.start();

        // Wait for the server to start before running the tests
        await new Promise((resolve) => server.on('listening', resolve));
    });

    afterAll(async () => {
        // Close the server and the database connection after all tests are done
        await new Promise((resolve) => server.close(resolve));

    });

    describe('POST /products', () => {
        test('should create a new product', async () => {
            const mockBrandFindById = jest.spyOn(Brand, 'findById');
            const mockCategoryFindById = jest.spyOn(Category, 'findById');

            const brandId = '64773cebb4c5b5beb35e492f';
            const categoryId = '64773d7bb4c5b5beb35e493b';

            mockBrandFindById.mockResolvedValue({ _id: brandId, name: "Brand 1", description: "This is brand 1" });
            mockCategoryFindById.mockResolvedValue({ _id: categoryId, name: "Category 1", description: "This is category 1" });



            const reqBody = {
                name: 'Product 2',
                description: 'This is a test product',
                brand: brandId,
                category: categoryId,
                sellingPrice: 1000,
            };

            const res = await request(app)
                .post('/products')
                .send(reqBody)
                .expect(201)

            // Check the response
            expect(res.body).toEqual({
                message: 'Product created successfully',
                product: expect.objectContaining(reqBody),
            });
        });

    });


});
