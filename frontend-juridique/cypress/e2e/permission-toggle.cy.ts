// Permission-toggle lifecycle E2E tests
// Tests that toggling a permission off blocks access (API + UI),
// and toggling it back on restores access.
//
// Requires: backend on :5200 with seeded DB

describe("9. Permission Toggle Lifecycle", () => {
  const API_URL = Cypress.env("API_URL") || "http://localhost:5200";

  /** Login via API and return the JWT token */
  const login = (user: string, pass: string) =>
    cy
      .request({
        method: "POST",
        url: `${API_URL}/api/auth/login`,
        body: { Login: user, Password: pass },
      })
      .then((r) => {
        expect(r.status).to.eq(200);
        return r.body.token as string;
      });

  /** Authenticated API request helper */
  const authed = (
    token: string,
    method: Cypress.HttpMethod,
    url: string,
    body?: Record<string, unknown>,
  ) =>
    cy.request({
      method,
      url,
      headers: { Authorization: `Bearer ${token}` },
      body,
      failOnStatusCode: false,
    });

  /** Get bureauordre's serviceId via the matrix endpoint */
  const getBureauOrdreServiceId = (adminToken: string) =>
    authed(adminToken, "GET", `${API_URL}/api/rbac/permissions/matrix`).then((res) => {
      const services = (res.body as { services: { id: number; code: string }[] }).services;
      const svc = services.find((s) => s.code === "bureauordre");
      expect(svc, "bureauordre service should exist in the matrix").to.exist;
      return svc!.id;
    });

  /** Save a snapshot of a service's current permissions (call BEFORE any patches) */
  const snapshotPerms = (adminToken: string, serviceId: number) =>
    authed(adminToken, "GET", `${API_URL}/api/rbac/permissions/service/${serviceId}`).then(
      (res) => res.body.permissions as { key: string; enabled: boolean }[],
    );

  /**
   * Save permissions for a service. `overrides` is a partial map:
   * keys that appear will be set to the given value; others stay unchanged.
   */
  const patchServicePerms = (
    adminToken: string,
    serviceId: number,
    overrides: Record<string, boolean>,
  ) =>
    authed(adminToken, "GET", `${API_URL}/api/rbac/permissions/service/${serviceId}`).then(
      (res) => {
        const perms = res.body.permissions as { key: string; enabled: boolean }[];
        const updated = perms.map((p) => ({
          permissionKey: p.key,
          enabled: p.key in overrides ? overrides[p.key] : p.enabled,
        }));
        return authed(
          adminToken,
          "PUT",
          `${API_URL}/api/rbac/permissions/service/${serviceId}`,
          { permissions: updated },
        ).then((saveRes) => {
          expect(saveRes.status).to.eq(200);
        });
      },
    );

  /** Restore permissions from a previously-taken snapshot */
  const restorePermissions = (
    adminToken: string,
    serviceId: number,
    snapshot: { key: string; enabled: boolean }[],
  ) => {
    const restore = snapshot.map((p) => ({
      permissionKey: p.key,
      enabled: p.enabled,
    }));
    return authed(
      adminToken,
      "PUT",
      `${API_URL}/api/rbac/permissions/service/${serviceId}`,
      { permissions: restore },
    ).then((r) => {
      expect(r.status).to.eq(200);
    });
  };

  it("export_excel: disable → not in /me permissions, re-enable → restored", () => {
    let adminToken: string;
    let serviceId: number;
    let snapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return getBureauOrdreServiceId(t);
      })
      .then((id) => {
        serviceId = id;
        return snapshotPerms(adminToken, id);
      })
      .then((s) => {
        snapshot = s;
        // Disable export_excel
        return patchServicePerms(adminToken, serviceId, { export_excel: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // Verify export_excel is gone
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.not.include("export_excel");
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // Verify export_excel is back
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.include("export_excel");
        });
      });
  });

  it("supprimer: disable → DELETE /api/CourrierAdmin returns 403, re-enable → restored", () => {
    let adminToken: string;
    let serviceId: number;
    let snapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return getBureauOrdreServiceId(t);
      })
      .then((id) => {
        serviceId = id;
        return snapshotPerms(adminToken, id);
      })
      .then((s) => {
        snapshot = s;
        // Disable supprimer
        return patchServicePerms(adminToken, serviceId, { supprimer: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // DELETE should now be 403
        authed(t, "DELETE", `${API_URL}/api/CourrierAdmin/1`).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // DELETE should no longer be 403 (could be 404 since doc doesn't exist)
        authed(t, "DELETE", `${API_URL}/api/CourrierAdmin/1`).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("UI: export buttons hidden when export_excel disabled, visible when enabled", () => {
    let adminToken: string;
    let serviceId: number;
    let snapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return getBureauOrdreServiceId(t);
      })
      .then((id) => {
        serviceId = id;
        return snapshotPerms(adminToken, id);
      })
      .then((s) => {
        snapshot = s;
        // Disable both export permissions (ExportButtons only hides when both are off)
        return patchServicePerms(adminToken, serviceId, { export_excel: false, export_word: false });
      })
      .then(() => {
        // Clear any previous session before first login
        cy.clearCookies();
        cy.clearLocalStorage();
        // Login as bureauordre in the browser
        cy.visit("/");
        cy.waitForHydration();
        cy.get('input[type="text"]').first().type("bureauordre");
        cy.get('input[type="password"]').type("bureauordre123");
        cy.get('button[type="submit"]').click();

        cy.get("aside", { timeout: 10000 }).should("exist");

        // Navigate to "Mes entités" where export buttons appear
        cy.get("aside").within(() => {
          cy.contains(/Mes entités|وثائقي|وملفاتي/).click();
        });
        cy.wait(1000);

        // Export buttons should NOT be visible
        cy.get("button").contains("export excel").should("not.exist");
        cy.get("button").contains("export word").should("not.exist");
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => {
        // Logout via the sidebar, then re-login
        cy.get("aside").within(() => {
          cy.contains(/Déconnexion|تسجيل الخروج/).click();
        });
        cy.waitForHydration();
        cy.get('input[type="text"]').first().type("bureauordre");
        cy.get('input[type="password"]').type("bureauordre123");
        cy.get('button[type="submit"]').click();

        cy.get("aside", { timeout: 10000 }).should("exist");

        cy.get("aside").within(() => {
          cy.contains(/Mes entités|وثائقي|وملفاتي/).click();
        });
        cy.wait(1000);

        // Export buttons SHOULD be visible now
        cy.get("button").contains("export excel").should("exist");
        cy.get("button").contains("export word").should("exist");
      });
  });
});
