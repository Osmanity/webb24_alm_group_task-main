const { User, Accommodation } = require("../test-setup");

describe("Accommodation Model", () => {
  let testAnvändare;

  beforeEach(async () => {
    // Skapa en testanvändare med unika värden för varje test
    const uniqueId = Math.random().toString(36).substring(7);
    testAnvändare = await User.create({
      username: `ibrahim_${uniqueId}`,
      email: `ibrahim_${uniqueId}@osmanity.com`
    });
  });

  it("ska skapa en bostad med alla obligatoriska fält", async () => {
    const bostad = await Accommodation.create({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000.50,
      rooms: 3,
      userId: testAnvändare.id
    });

    expect(bostad).toBeDefined();
    expect(bostad.address).toBe("Testgatan 123");
    expect(bostad.city).toBe("Stockholm");
    expect(bostad.country).toBe("Sverige");
    expect(bostad.postalCode).toBe("12345");
    expect(parseFloat(bostad.rent)).toBe(15000.50);
    expect(bostad.rooms).toBe(3);
    expect(bostad.userId).toBe(testAnvändare.id);
  });

  it("ska skapa en bostad utan userId (valfritt fält)", async () => {
    const bostad = await Accommodation.create({
      address: "Annangatan 456",
      city: "Göteborg", 
      country: "Sverige",
      postalCode: "54321",
      rent: 12000,
      rooms: 2
    });

    expect(bostad).toBeDefined();
    expect(bostad.userId).toBeNull();
  });

  it("ska validera att adress är obligatoriskt", async () => {
    const bostad = Accommodation.build({
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 3
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att stad är obligatoriskt", async () => {
    const bostad = Accommodation.build({
      address: "Testgatan 123",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 3
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att land är obligatoriskt", async () => {
    const bostad = Accommodation.build({
      address: "Drottninggatan 123",
      city: "Stockholm",
      postalCode: "12345",
      rent: 15000,
      rooms: 3
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att postnummer är obligatoriskt", async () => {
    const bostad = Accommodation.build({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      rent: 15000,
      rooms: 3
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att hyra är obligatoriskt och positivt", async () => {
    const bostad = Accommodation.build({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: -1000,
      rooms: 3
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att antal rum är obligatoriskt och minst 1", async () => {
    const bostad = Accommodation.build({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 0
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska validera att antal rum måste vara ett heltal", async () => {
    const bostad = Accommodation.build({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 2.5
    });

    await expect(bostad.validate()).rejects.toThrow();
  });

  it("ska etablera relation med användare", async () => {
    const bostad = await Accommodation.create({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 3,
      userId: testAnvändare.id
    });

    const användare = await bostad.getUser();
    expect(användare).toBeDefined();
    expect(användare.id).toBe(testAnvändare.id);
    expect(användare.username).toBe(testAnvändare.username);
  });

  it("ska tillåta användare att ha flera bostäder", async () => {
    const bostad1 = await Accommodation.create({
      address: "Första gatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 3,
      userId: testAnvändare.id
    });

    const bostad2 = await Accommodation.create({
      address: "Andra gatan 456",
      city: "Göteborg",
      country: "Sverige",
      postalCode: "54321",
      rent: 12000,
      rooms: 2,
      userId: testAnvändare.id
    });

    // Hitta bostäder via userId
    const bostäder = await Accommodation.findAll({
      where: { userId: testAnvändare.id }
    });
    
    expect(bostäder).toHaveLength(2);
    expect(bostäder[0].userId).toBe(testAnvändare.id);
    expect(bostäder[1].userId).toBe(testAnvändare.id);
  });

  it("ska CASCADE-radera bostäder när användare raderas", async () => {
    // Skapa bostäder kopplade till användaren
    await Accommodation.create({
      address: "Testgatan 123",
      city: "Stockholm",
      country: "Sverige",
      postalCode: "12345",
      rent: 15000,
      rooms: 3,
      userId: testAnvändare.id
    });

    await Accommodation.create({
      address: "Andra gatan 456",
      city: "Göteborg",
      country: "Sverige",
      postalCode: "54321",
      rent: 12000,
      rooms: 2,
      userId: testAnvändare.id
    });

    // Kontrollera att bostäderna finns
    let bostäder = await Accommodation.findAll({
      where: { userId: testAnvändare.id }
    });
    expect(bostäder).toHaveLength(2);

    // Radera användaren
    await testAnvändare.destroy();

    // Kontrollera att bostäderna också raderades
    bostäder = await Accommodation.findAll({
      where: { userId: testAnvändare.id }
    });
    expect(bostäder).toHaveLength(0);
  });

  it("ska inte påverka bostäder utan userId när användare raderas", async () => {
    // Skapa bostad utan userId
    const bostad = await Accommodation.create({
      address: "Oberoende gatan 789",
      city: "Malmö",
      country: "Sverige",
      postalCode: "98765",
      rent: 10000,
      rooms: 1
    });

    // Radera användaren
    await testAnvändare.destroy();

    // Kontrollera att bostaden utan userId fortfarande finns
    const kvarstående = await Accommodation.findByPk(bostad.id);
    expect(kvarstående).toBeDefined();
    expect(kvarstående.address).toBe("Oberoende gatan 789");
  });
}); 