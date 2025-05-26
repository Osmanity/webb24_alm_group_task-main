/**
 * Sequelize Testing Cheat Sheet
 *
 * This file contains examples and patterns for testing Sequelize models
 * and queries. Use this as a reference when writing your tests.
 */

const { Sequelize, DataTypes } = require("sequelize");

// ==========================================
// 1. Test Database Setup
// ==========================================

// Create an in-memory SQLite database for testing
const testSequelize = new Sequelize("sqlite::memory:", {
  logging: false, // Disable logging for cleaner test output
});

// Example Product model for demonstration
const Product = testSequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Z0-9]{6}$/, // SKU format: 6 characters, uppercase letters and numbers
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  category: {
    type: DataTypes.ENUM("electronics", "clothing", "books", "food"),
    allowNull: false,
  },
});

// ==========================================
// 2. Test Setup and Teardown
// ==========================================

// Before all tests
beforeAll(async () => {
  // Sync all models with database
  await testSequelize.sync({ force: true });
});

// After all tests
afterAll(async () => {
  // Close database connection
  await testSequelize.close();
});

// Before each test
beforeEach(async () => {
  // Clean up tables before each test
  await Product.destroy({ where: {} });
});

// ==========================================
// 3. Basic CRUD Tests
// ==========================================

describe("Basic CRUD Operations", () => {
  // Create
  it("should create a new product", async () => {
    const product = await Product.create({
      name: "Laptop",
      sku: "LAP123",
      price: 999.99,
      stock: 10,
      category: "electronics",
    });

    expect(product.name).toBe("Laptop");
    expect(product.sku).toBe("LAP123");
    expect(product.price).toBe("999.99");
    expect(product.stock).toBe(10);
  });

  // Read
  it("should find a product by primary key", async () => {
    const created = await Product.create({
      name: "Smartphone",
      sku: "PHN456",
      price: 699.99,
      stock: 15,
      category: "electronics",
    });

    const found = await Product.findByPk(created.id);
    expect(found.name).toBe("Smartphone");
    expect(found.sku).toBe("PHN456");
  });

  // Update
  it("should update a product", async () => {
    const product = await Product.create({
      name: "Headphones",
      sku: "HD789",
      price: 199.99,
      stock: 20,
      category: "electronics",
    });

    await product.update({ price: 179.99, stock: 25 });
    const updated = await Product.findByPk(product.id);
    expect(updated.price).toBe("179.99");
    expect(updated.stock).toBe(25);
  });

  // Delete
  it("should delete a product", async () => {
    const product = await Product.create({
      name: "Tablet",
      sku: "TAB101",
      price: 499.99,
      stock: 5,
      category: "electronics",
    });

    await product.destroy();
    const deleted = await Product.findByPk(product.id);
    expect(deleted).toBeNull();
  });
});

// ==========================================
// 4. Validation Tests
// ==========================================

describe("Model Validations", () => {
  it("should not allow duplicate SKUs", async () => {
    await Product.create({
      name: "Camera",
      sku: "CAM202",
      price: 799.99,
      stock: 8,
      category: "electronics",
    });

    await expect(
      Product.create({
        name: "Another Camera",
        sku: "CAM202", // Duplicate SKU
        price: 899.99,
        stock: 3,
        category: "electronics",
      })
    ).rejects.toThrow();
  });

  it("should validate SKU format", async () => {
    await expect(
      Product.create({
        name: "Invalid SKU",
        sku: "abc123", // Lowercase not allowed
        price: 99.99,
        stock: 10,
        category: "electronics",
      })
    ).rejects.toThrow();
  });

  it("should validate price is non-negative", async () => {
    await expect(
      Product.create({
        name: "Negative Price",
        sku: "NEG303",
        price: -10.0,
        stock: 5,
        category: "electronics",
      })
    ).rejects.toThrow();
  });

  it("should validate stock is non-negative", async () => {
    await expect(
      Product.create({
        name: "Negative Stock",
        sku: "NEG404",
        price: 50.0,
        stock: -5,
        category: "electronics",
      })
    ).rejects.toThrow();
  });

  it("should validate category enum values", async () => {
    await expect(
      Product.create({
        name: "Invalid Category",
        sku: "CAT505",
        price: 30.0,
        stock: 10,
        category: "invalid_category", // Not in enum
      })
    ).rejects.toThrow();
  });
});

// ==========================================
// 5. Query Tests
// ==========================================

describe("Sequelize Queries", () => {
  beforeEach(async () => {
    // Create test data
    await Product.bulkCreate([
      {
        name: "Laptop",
        sku: "LAP101",
        price: 999.99,
        stock: 10,
        category: "electronics",
        isAvailable: true,
      },
      {
        name: "T-Shirt",
        sku: "TSH102",
        price: 19.99,
        stock: 50,
        category: "clothing",
        isAvailable: true,
      },
      {
        name: "Novel",
        sku: "BOK103",
        price: 14.99,
        stock: 30,
        category: "books",
        isAvailable: true,
      },
      {
        name: "Pizza",
        sku: "FD104",
        price: 9.99,
        stock: 100,
        category: "food",
        isAvailable: false,
      },
      {
        name: "Smartphone",
        sku: "PHN105",
        price: 699.99,
        stock: 15,
        category: "electronics",
        isAvailable: true,
      },
    ]);
  });

  // Find all
  it("should find all products", async () => {
    const products = await Product.findAll();
    expect(products).toHaveLength(5);
  });

  // Find with where clause
  it("should find available products", async () => {
    const availableProducts = await Product.findAll({
      where: { isAvailable: true },
    });
    expect(availableProducts).toHaveLength(4);
  });

  // Find with multiple conditions
  it("should find electronics with stock > 10", async () => {
    const products = await Product.findAll({
      where: {
        category: "electronics",
        stock: {
          [Sequelize.Op.gt]: 10,
        },
      },
    });
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe("Laptop");
  });

  // Find with attributes
  it("should find products with specific attributes", async () => {
    const products = await Product.findAll({
      attributes: ["name", "price"],
      where: { category: "electronics" },
    });
    expect(products[0].sku).toBeUndefined();
    expect(products[0].name).toBeDefined();
    expect(products[0].price).toBeDefined();
  });

  // Find with order
  it("should find products ordered by price", async () => {
    const products = await Product.findAll({
      order: [["price", "DESC"]],
    });
    expect(products[0].name).toBe("Laptop");
    expect(products[0].price).toBe("999.99");
  });

  // Find with limit
  it("should limit results", async () => {
    const products = await Product.findAll({
      limit: 2,
    });
    expect(products).toHaveLength(2);
  });

  // Find with aggregation
  it("should calculate average price by category", async () => {
    const result = await Product.findAll({
      attributes: [
        "category",
        [Sequelize.fn("AVG", Sequelize.col("price")), "avgPrice"],
      ],
      group: ["category"],
    });

    expect(result).toHaveLength(4); // 4 categories
    const electronics = result.find((r) => r.category === "electronics");
    expect(electronics.avgPrice).toBe("849.99"); // (999.99 + 699.99) / 2
  });
});

// ==========================================
// 6. Association Tests
// ==========================================

// Example: Product has many Reviews
const Review = testSequelize.define("Review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: DataTypes.TEXT,
});

Product.hasMany(Review);
Review.belongsTo(Product);

describe("Associations", () => {
  it("should create associated records", async () => {
    const product = await Product.create({
      name: "Headphones",
      sku: "HDN601",
      price: 199.99,
      stock: 10,
      category: "electronics",
    });

    const review = await Review.create({
      rating: 5,
      comment: "Great product!",
      ProductId: product.id,
    });

    const productWithReviews = await Product.findByPk(product.id, {
      include: [Review],
    });

    expect(productWithReviews.Reviews).toHaveLength(1);
    expect(productWithReviews.Reviews[0].rating).toBe(5);
  });

  it("should find products with high ratings", async () => {
    const product = await Product.create({
      name: "Camera",
      sku: "CAM602",
      price: 599.99,
      stock: 5,
      category: "electronics",
    });

    await Review.bulkCreate([
      { rating: 5, comment: "Excellent", ProductId: product.id },
      { rating: 4, comment: "Good", ProductId: product.id },
      { rating: 5, comment: "Amazing", ProductId: product.id },
    ]);

    const highRatedProducts = await Product.findAll({
      include: [
        {
          model: Review,
          where: {
            rating: {
              [Sequelize.Op.gte]: 4,
            },
          },
          required: true,
        },
      ],
      having: Sequelize.literal("COUNT(Reviews.id) >= 2"),
    });

    expect(highRatedProducts).toHaveLength(1);
    expect(highRatedProducts[0].Reviews).toHaveLength(3);
  });
});

// ==========================================
// 7. Transaction Tests
// ==========================================

describe("Transactions", () => {
  it("should rollback on error", async () => {
    const transaction = await testSequelize.transaction();

    try {
      await Product.create(
        {
          name: "Transaction Test",
          sku: "TRN701",
          price: 99.99,
          stock: 10,
          category: "electronics",
        },
        { transaction }
      );

      // This will fail and trigger rollback
      await Product.create(
        {
          name: "Invalid Product",
          sku: "TRN701", // Duplicate SKU
          price: 149.99,
          stock: 5,
          category: "electronics",
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }

    const product = await Product.findOne({
      where: { sku: "TRN701" },
    });
    expect(product).toBeNull(); // Should be rolled back
  });

  it("should handle stock updates atomically", async () => {
    const product = await Product.create({
      name: "Limited Stock",
      sku: "LMT702",
      price: 49.99,
      stock: 5,
      category: "electronics",
    });

    // Simulate multiple concurrent purchases
    const transaction1 = await testSequelize.transaction();
    const transaction2 = await testSequelize.transaction();

    try {
      // First purchase
      const product1 = await Product.findByPk(product.id, {
        transaction: transaction1,
      });
      await product1.update(
        { stock: product1.stock - 3 },
        { transaction: transaction1 }
      );

      // Second purchase (should fail if stock becomes negative)
      const product2 = await Product.findByPk(product.id, {
        transaction: transaction2,
      });
      await product2.update(
        { stock: product2.stock - 4 },
        { transaction: transaction2 }
      );

      await transaction1.commit();
      await transaction2.commit();
    } catch (error) {
      await transaction1.rollback();
      await transaction2.rollback();
    }

    const updatedProduct = await Product.findByPk(product.id);
    expect(updatedProduct.stock).toBe(5); // Should remain unchanged if second transaction failed
  });
});

// ==========================================
// 8. Hooks Tests
// ==========================================

describe("Model Hooks", () => {
  it("should execute beforeCreate hook to format SKU", async () => {
    // Add a hook to the Product model
    Product.beforeCreate((product) => {
      product.sku = product.sku.toUpperCase();
    });

    const product = await Product.create({
      name: "Hook Test",
      sku: "hok801",
      price: 29.99,
      stock: 10,
      category: "electronics",
    });

    expect(product.sku).toBe("HOK801");
  });

  it("should execute afterFind hook to calculate discount", async () => {
    // Add a hook to calculate a 10% discount for products with stock > 20
    Product.afterFind((products) => {
      if (Array.isArray(products)) {
        products.forEach((product) => {
          if (product.stock > 20) {
            product.discountedPrice = product.price * 0.9;
          }
        });
      } else if (products && products.stock > 20) {
        products.discountedPrice = products.price * 0.9;
      }
    });

    const product = await Product.create({
      name: "Bulk Item",
      sku: "BLK802",
      price: 100.0,
      stock: 25,
      category: "electronics",
    });

    const found = await Product.findByPk(product.id);
    expect(found.discountedPrice).toBe(90.0);
  });
});

/**
 * Common Testing Patterns:
 *
 * 1. Always use a separate test database
 * 2. Clean up data between tests
 * 3. Use transactions for complex operations
 * 4. Test both success and failure cases
 * 5. Test validations and constraints
 * 6. Test associations and relationships
 * 7. Test model hooks and callbacks
 * 8. Use meaningful test descriptions
 *
 * Best Practices:
 *
 * 1. Keep tests isolated and independent
 * 2. Use beforeEach/afterEach for setup/cleanup
 * 3. Test one thing per test case
 * 4. Use descriptive test names
 * 5. Assert both positive and negative cases
 * 6. Clean up resources after tests
 * 7. Use transactions for data consistency
 * 8. Mock external services when needed
 */
