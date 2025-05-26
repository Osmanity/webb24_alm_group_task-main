const { User } = require("../test-setup");

describe("User Model", () => {
  it("should create a user", async () => {
    const user = await User.create({ username: "testuser", email: "test@test.com" })

    expect(user).toBeDefined();
    expect(user.username).toBe("testuser");
    expect(user.email).toBe("test@test.com");
  });

  it("should validate email format", async () => {
    // Build: Create a new user instance without saving it to the database
    const user = User.build({ username: "testuser", email: "invalid-email" });
    // Validate: Check if the user instance is valid
    // rejects.toThrow() is used to check if the user instance is invalid
    await expect(user.validate()).rejects.toThrow();
  });
  
});

