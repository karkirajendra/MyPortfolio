import http from "node:http";
import { connectDb, disconnectDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { ensureSeeded } from "../server/services/seed.js";

async function runTests() {
  console.log("=== Integration & Backend Verification ===");
  await connectDb();
  await ensureSeeded();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(3099, resolve));
  console.log("✓ Server listening on http://localhost:3099");

  const baseUrl = "http://localhost:3099";

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status !== 200 || !healthJson.ok) {
      throw new Error(`Health check failed: ${JSON.stringify(healthJson)}`);
    }
    console.log("✓ GET /api/health passed:", healthJson);

    // 2. Public content check
    const contentRes = await fetch(`${baseUrl}/api/content`);
    const contentJson = await contentRes.json();
    if (contentRes.status !== 200 || !Array.isArray(contentJson.skills) || !Array.isArray(contentJson.education)) {
      throw new Error("Content route failed: skills or education array missing");
    }
    console.log(`✓ GET /api/content passed: ${contentJson.skills.length} skill groups, ${contentJson.education.length} education items, ${contentJson.projects.length} projects`);

    // 3. Auth login check
    const testEmail = process.env.ADMIN_EMAIL || config.adminEmail;
    const testPassword = process.env.ADMIN_PASSWORD || config.adminPassword;
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const loginJson = await loginRes.json();
    if (loginRes.status !== 200 || !loginJson.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);
    }
    const token = loginJson.token;
    console.log("✓ POST /api/auth/login passed: Token received for", loginJson.email);

    // 4. Auth session check with Bearer token
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meJson = await meRes.json();
    if (meRes.status !== 200 || meJson.email !== testEmail) {
      throw new Error(`Auth /me failed: ${JSON.stringify(meJson)}`);
    }
    console.log("✓ GET /api/auth/me passed with Bearer token:", meJson.email);

    // 5. Admin content update (editing a skill level)
    const currentSkills = contentJson.skills;
    const testSkills = JSON.parse(JSON.stringify(currentSkills));
    if (testSkills[0]?.items?.[0]) {
      testSkills[0].items[0].level = 95;
    }
    const patchRes = await fetch(`${baseUrl}/api/admin/content`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skills: testSkills }),
    });
    const patchJson = await patchRes.json();
    if (patchRes.status !== 200 || patchJson.skills?.[0]?.items?.[0]?.level !== 95) {
      throw new Error("PATCH /api/admin/content failed to update skill level");
    }
    console.log("✓ PATCH /api/admin/content passed: Skill level updated to 95%");

    // 7. Verify Certificate CRUD and DELETE endpoint
    const newCert = {
      id: "cert-test-1",
      title: "Integration Test Certification",
      organization: "Test Org",
      issueDate: "2026-01-01",
      credentialId: "TEST-2026-XYZ",
      description: "Automated test certificate verification.",
      imageUrl: "",
      certificateUrl: "https://example.com/test",
      displayOrder: 99,
      featured: true,
    };
    const certPatchRes = await fetch(`${baseUrl}/api/admin/content`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ certificates: [newCert] }),
    });
    const certPatchJson = await certPatchRes.json();
    if (certPatchRes.status !== 200 || !certPatchJson.certificates?.find((c) => c.id === "cert-test-1")) {
      throw new Error("PATCH /api/admin/content failed for certificates");
    }
    console.log("✓ PATCH /api/admin/content certificates passed: Added new certificate");

    const deleteCertRes = await fetch(`${baseUrl}/api/admin/certificates/cert-test-1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteCertJson = await deleteCertRes.json();
    if (deleteCertRes.status !== 200 || deleteCertJson.certificates?.some((c) => c.id === "cert-test-1")) {
      throw new Error("DELETE /api/admin/certificates/:id failed");
    }
    console.log("✓ DELETE /api/admin/certificates/:id passed: Cleanly removed test certificate");

    console.log("\nAll backend, MongoDB, CMS, Certificates, and Auth tests PASSED with 100% success!");
  } finally {
    server.close();
    await disconnectDb();
    console.log("✓ Test server closed and DB disconnected cleanly.");
  }
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
