const { User } = require("../test-setup");

describe("User Model", () => {
  
  it("ska skapa en användare", async () => {
    const användare = await User.create({ 
      username: "testanvändare", 
      email: "test@test.com" 
    });

    expect(användare).toBeDefined();
    expect(användare.username).toBe("testanvändare");
    expect(användare.email).toBe("test@test.com");
  });

  it("ska validera e-postformat", async () => {
    const användare = User.build({ 
      username: "testanvändare", 
      email: "ogiltig-epost" 
    });
    
    await expect(användare.validate()).rejects.toThrow();
  });

  it("ska kräva unikt användarnamn", async () => {
    // Skapa första användaren
    await User.create({ 
      username: "uniknamn", 
      email: "forsta@test.com" 
    });

    // Försök skapa andra användaren med samma användarnamn
    await expect(User.create({ 
      username: "uniknamn", 
      email: "andra@test.com" 
    })).rejects.toThrow();
  });

  it("ska kräva unik e-postadress", async () => {
    // Skapa första användaren
    await User.create({ 
      username: "forstaanvandare", 
      email: "unik@test.com" 
    });

    // Försök skapa andra användaren med samma e-post
    await expect(User.create({ 
      username: "andraanvandare", 
      email: "unik@test.com" 
    })).rejects.toThrow();
  });

  it("ska validera att användarnamn inte är tomt", async () => {
    const användare = User.build({ 
      username: "", 
      email: "test@test.com" 
    });
    
    await expect(användare.validate()).rejects.toThrow();
  });

  it("ska validera att e-post inte är tom", async () => {
    const användare = User.build({ 
      username: "testanvändare", 
      email: "" 
    });
    
    await expect(användare.validate()).rejects.toThrow();
  });

  it("ska validera att användarnamn är obligatoriskt", async () => {
    const användare = User.build({ 
      email: "test@test.com" 
    });
    
    await expect(användare.validate()).rejects.toThrow();
  });

  it("ska validera att e-post är obligatorisk", async () => {
    const användare = User.build({ 
      username: "testanvändare" 
    });
    
    await expect(användare.validate()).rejects.toThrow();
  });

  it("ska acceptera giltig e-postadress", async () => {
    const giltiga_epost = [
      "test@example.com",
      "användare.namn@domain.se",
      "test123@test-domain.org",
      "user+tag@example.co.uk"
    ];

    for (const epost of giltiga_epost) {
      const användare = User.build({ 
        username: `användare_${Math.random()}`, 
        email: epost 
      });
      
      await expect(användare.validate()).resolves.not.toThrow();
    }
  });

  it("ska avvisa ogiltiga e-postformat", async () => {
    const ogiltiga_epost = [
      "ogiltig-epost",
      "@domain.com",
      "test@",
      "test..test@domain.com",
      "test@domain",
      "test space@domain.com"
    ];

    for (const epost of ogiltiga_epost) {
      const användare = User.build({ 
        username: `användare_${Math.random()}`, 
        email: epost 
      });
      
      await expect(användare.validate()).rejects.toThrow();
    }
  });
});

