const { register, login, getProfile } = require("../src/controllers/user.js");
const User = require("../src/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../src/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      User.findOne.mockResolvedValue(null); // Simulate no existing user
      bcrypt.hash.mockResolvedValue("hashedPassword"); // Simulate password hashing
      User.prototype.save = jest.fn().mockResolvedValue(); // Mock save function

      const req = {
        body: {
          name: "Test User2",
          mobile: "12345678978",
          email: "test1@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      jwt.sign.mockReturnValue("mockToken");

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: true,
        message: "User registered successfully",
        data: { accessToken: "mockToken", user: expect.any(Object) },
      });
    });

    it("should return 400 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      const req = { body: { email: "test@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
    });

    it("should return 500 if there is a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const req = { body: { email: "test@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        error: "Database error",
      });
    });
  });

  describe("login", () => {
    it("should login a user with correct credentials", async () => {
      const user = {
        _id: "123",
        email: "test@example.com",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true); // Password matches
      jwt.sign.mockReturnValue("mockToken"); // Simulate token creation

      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          roleType: "user",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        status: true,
        message: "Logged in successfully!",
        data: { accessToken: "mockToken", user },
      });
    });

    it("should return 401 if credentials are invalid", async () => {
      User.findOne.mockResolvedValue(null); // No user found

      const req = {
        body: {
          email: "invalid@example.com",
          password: "wrongPassword",
          roleType: "user",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return 500 if there is a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          roleType: "user",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        error: "Database error",
      });
    });
  });

  describe("getProfile", () => {
    it("should return user profile if request is authenticated", async () => {
      const req = {
        user: { _id: "123", name: "Test User", email: "test@example.com" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        user: req.user,
      });
    });

    it("should return 500 if there is a server error", async () => {
      const req = { user: null };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        error: expect.any(String),
      });
    });
  });
});
