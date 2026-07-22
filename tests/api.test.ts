import { describe, expect, it } from "bun:test";

const BASE_URL = process.env.TEST_SERVER_URL || "http://localhost:3000";
const BYPASS_KEY = process.env.TEST_BYPASS_KEY || "test-bypass-secret-123";

const headersWithAuth = {
  "Content-Type": "application/json",
  "x-test-bypass": BYPASS_KEY,
};

describe("Portfolio API Integration Tests", () => {
  // ── PUBLIC API ENDPOINTS ──
  describe("Public API", () => {
    it("should fetch projects successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/public/projects`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    it("should fetch certificates successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/public/certificates`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    it("should fetch companies successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/public/companies`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  // ── AUTH ENDPOINTS ──
  describe("Auth API", () => {
    it("should reject unauthorized request to me endpoint", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`);
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
    });
  });

  // ── ADMIN API PROTECTION ──
  describe("Admin API Protection", () => {
    it("should return 401 for unauthorized projects access", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/projects`);
      expect(res.status).toBe(401);
    });

    it("should return 401 for unauthorized certificates access", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/certificates`);
      expect(res.status).toBe(401);
    });

    it("should return 401 for unauthorized companies access", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/companies`);
      expect(res.status).toBe(401);
    });
  });

  // ── ADMIN CRUD OPERATIONS (WITH BYPASS) ──
  describe("Admin API CRUD Operations (Authorized)", () => {
    // 1. Projects CRUD
    it("should manage projects (GET, POST, PATCH, DELETE)", async () => {
      // GET
      const getRes = await fetch(`${BASE_URL}/api/admin/projects`, {
        headers: headersWithAuth,
      });
      expect(getRes.status).toBe(200);
      const getBody = await getRes.json();
      expect(getBody.success).toBe(true);

      const testProjectId = "test-project-api-" + Date.now();

      // POST (Create)
      const postRes = await fetch(`${BASE_URL}/api/admin/projects`, {
        method: "POST",
        headers: headersWithAuth,
        body: JSON.stringify({
          id: testProjectId,
          title_en: "Test Project",
          title_id: "Proyek Uji Coba",
          description_en: "Test Description",
          description_id: "Deskripsi Uji Coba",
          image: "https://example.com/image.png",
          tags: ["test", "api"],
          year: 2026,
        }),
      });
      expect(postRes.status).toBe(201);
      const postBody = await postRes.json();
      expect(postBody.success).toBe(true);

      // PATCH (Update)
      const patchRes = await fetch(`${BASE_URL}/api/admin/projects`, {
        method: "PATCH",
        headers: headersWithAuth,
        body: JSON.stringify({
          id: testProjectId,
          title_en: "Test Project Updated",
        }),
      });
      expect(patchRes.status).toBe(200);
      const patchBody = await patchRes.json();
      expect(patchBody.success).toBe(true);

      // DELETE (Remove)
      const deleteRes = await fetch(`${BASE_URL}/api/admin/projects?id=${testProjectId}`, {
        method: "DELETE",
        headers: headersWithAuth,
      });
      expect(deleteRes.status).toBe(200);
      const deleteBody = await deleteRes.json();
      expect(deleteBody.success).toBe(true);
    });

    // 2. Certificates CRUD
    it("should manage certificates (GET, POST, PATCH, DELETE)", async () => {
      // GET
      const getRes = await fetch(`${BASE_URL}/api/admin/certificates`, {
        headers: headersWithAuth,
      });
      expect(getRes.status).toBe(200);

      const testCertId = "test-cert-api-" + Date.now();

      // POST (Create)
      const postRes = await fetch(`${BASE_URL}/api/admin/certificates`, {
        method: "POST",
        headers: headersWithAuth,
        body: JSON.stringify({
          id: testCertId,
          org: "Test Org",
          title: "Test Certificate",
          description: "Test description for certificate",
          thumb: "https://example.com/thumb.png",
          pages: ["https://example.com/page1.png"],
          is_pinned: true,
        }),
      });
      expect(postRes.status).toBe(201);

      // PATCH (Update)
      const patchRes = await fetch(`${BASE_URL}/api/admin/certificates`, {
        method: "PATCH",
        headers: headersWithAuth,
        body: JSON.stringify({
          id: testCertId,
          title: "Test Certificate Updated",
        }),
      });
      expect(patchRes.status).toBe(200);

      // DELETE (Remove)
      const deleteRes = await fetch(`${BASE_URL}/api/admin/certificates?id=${testCertId}`, {
        method: "DELETE",
        headers: headersWithAuth,
      });
      expect(deleteRes.status).toBe(200);
    });

    // 3. Companies CRUD
    it("should manage companies (GET, POST, PATCH, DELETE)", async () => {
      // GET
      const getRes = await fetch(`${BASE_URL}/api/admin/companies`, {
        headers: headersWithAuth,
      });
      expect(getRes.status).toBe(200);

      // POST (Create)
      const postRes = await fetch(`${BASE_URL}/api/admin/companies`, {
        method: "POST",
        headers: headersWithAuth,
        body: JSON.stringify({
          name: "Test Company",
          logo: "https://example.com/logo.png",
        }),
      });
      expect(postRes.status).toBe(201);
      const postBody = await postRes.json();
      expect(postBody.success).toBe(true);
      const createdCompanyId = postBody.data.id;

      // PATCH (Update)
      const patchRes = await fetch(`${BASE_URL}/api/admin/companies`, {
        method: "PATCH",
        headers: headersWithAuth,
        body: JSON.stringify({
          id: createdCompanyId,
          name: "Test Company Updated",
        }),
      });
      expect(patchRes.status).toBe(200);

      // DELETE (Remove)
      const deleteRes = await fetch(`${BASE_URL}/api/admin/companies?id=${createdCompanyId}`, {
        method: "DELETE",
        headers: headersWithAuth,
      });
      expect(deleteRes.status).toBe(200);
    });
  });
});
