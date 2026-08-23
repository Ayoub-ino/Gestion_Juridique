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

  /** Get current admin overrides (returns array of { key, enabled }) */
  const getAdminOverrides = (adminToken: string) =>
    authed(adminToken, "GET", `${API_URL}/api/rbac/permissions/admin`).then(
      (res) => res.body.permissions as { key: string; enabled: boolean }[],
    );

  /** Save admin overrides from a snapshot (maps key→permissionKey for the PUT DTO) */
  const saveAdminOverrides = (
    adminToken: string,
    snapshot: { key: string; enabled: boolean }[],
  ) => {
    const payload = snapshot.map((p) => ({
      permissionKey: p.key,
      enabled: p.enabled,
    }));
    return authed(adminToken, "PUT", `${API_URL}/api/rbac/permissions/admin`, {
      permissions: payload,
    }).then((r) => {
      expect(r.status).to.eq(200);
    });
  };

  // ─────────────────────────────────────────────────
  //  Service-level permission toggle tests
  // ─────────────────────────────────────────────────

  it("export_excel: disable → not in /me, re-enable → restored", () => {
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
        return patchServicePerms(adminToken, serviceId, { export_excel: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.not.include("export_excel");
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.include("export_excel");
        });
      });
  });

  it("supprimer: disable → DELETE returns 403, re-enable → restored", () => {
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
        return patchServicePerms(adminToken, serviceId, { supprimer: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "DELETE", `${API_URL}/api/CourrierAdmin/1`).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "DELETE", `${API_URL}/api/CourrierAdmin/1`).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("archiver: disable → POST archive-batch returns 403, re-enable → restored", () => {
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
        return patchServicePerms(adminToken, serviceId, { archiver: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Documents/archive-batch`, { ids: [] }).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Documents/archive-batch`, { ids: [] }).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("transferer: disable → POST Transfer returns 403, re-enable → restored", () => {
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
        return patchServicePerms(adminToken, serviceId, { transferer: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Transfer`, {
          documentId: 1,
          documentType: "entrant-admin",
          serviceDestination: "Archive",
        }).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Transfer`, {
          documentId: 1,
          documentType: "entrant-admin",
          serviceDestination: "Archive",
        }).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("creer_courrier_admin: disable → POST CourrierAdmin returns 403, re-enable → restored", () => {
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
        return patchServicePerms(adminToken, serviceId, { creer_courrier_admin: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/CourrierAdmin`, {}).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/CourrierAdmin`, {}).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("accepter: disable → PUT accepter returns 403, re-enable → restored via /me", () => {
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
        return patchServicePerms(adminToken, serviceId, { accepter: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // Verify permission removed from JWT
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.not.include("accepter");
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        // Verify permission restored (use /me — the endpoint also has ownership checks)
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.include("accepter");
        });
      });
  });

  it("refuser: disable → PUT refuser returns 403, re-enable → restored via /me", () => {
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
        return patchServicePerms(adminToken, serviceId, { refuser: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.not.include("refuser");
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.include("refuser");
        });
      });
  });

  it("transferer_juridique: disable → POST juridique returns 403, re-enable → restored", () => {
    let adminToken: string;
    // fathmilafat has transferer_juridique
    let serviceId: number;
    let snapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return authed(t, "GET", `${API_URL}/api/rbac/permissions/matrix`).then((res) => {
          const svc = (res.body as { services: { id: number; code: string }[] }).services.find(
            (s) => s.code === "fathmilafat",
          );
          expect(svc, "fathmilafat service should exist").to.exist;
          return svc!.id;
        });
      })
      .then((id) => {
        serviceId = id;
        return snapshotPerms(adminToken, id);
      })
      .then((s) => {
        snapshot = s;
        return patchServicePerms(adminToken, serviceId, { transferer_juridique: false });
      })
      .then(() => login("fathmilafat", "fathmilafat123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/juridique/1/TransactionJuridique`, {}).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("fathmilafat", "fathmilafat123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/juridique/1/TransactionJuridique`, {}).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("retrait_archive: disable → POST Retrait returns 403, re-enable → restored", () => {
    let adminToken: string;
    // archive has retrait_archive
    let serviceId: number;
    let snapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return authed(t, "GET", `${API_URL}/api/rbac/permissions/matrix`).then((res) => {
          const svc = (res.body as { services: { id: number; code: string }[] }).services.find(
            (s) => s.code === "archive",
          );
          expect(svc, "archive service should exist").to.exist;
          return svc!.id;
        });
      })
      .then((id) => {
        serviceId = id;
        return snapshotPerms(adminToken, id);
      })
      .then((s) => {
        snapshot = s;
        return patchServicePerms(adminToken, serviceId, { retrait_archive: false });
      })
      .then(() => login("archive", "archive123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Retrait`, { documentId: 1 }).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("archive", "archive123"))
      .then((t) => {
        authed(t, "POST", `${API_URL}/api/Retrait`, { documentId: 1 }).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  it("recherche_avancee: disable → no longer in /me, re-enable → restored via /me", () => {
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
        return patchServicePerms(adminToken, serviceId, { recherche_avancee: false });
      })
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.not.include("recherche_avancee");
        });
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => login("bureauordre", "bureauordre123"))
      .then((t) => {
        authed(t, "GET", `${API_URL}/api/auth/me`).then((me) => {
          expect(me.body.user.permissions).to.include("recherche_avancee");
        });
      });
  });

  // ─────────────────────────────────────────────────
  //  Admin override toggle cycle
  // ─────────────────────────────────────────────────

  it("admin override: enable gerer_services for admin → access, disable → 403", () => {
    let adminToken: string;
    let adminSnapshot: { key: string; enabled: boolean }[];

    login("admin", "admin123")
      .then((t) => {
        adminToken = t;
        return getAdminOverrides(t);
      })
      .then((overrides) => {
        adminSnapshot = overrides;

        // Verify admin currently CAN access gerer_services (not overridden)
        const disabled = overrides.find((o) => o.key === "gerer_services" && !o.enabled);
        // gerer_services should NOT be in the disabled overrides (admin keeps it)
        expect(disabled, "gerer_services should not be disabled for admin").to.be.undefined;
      })
      .then(() => {
        // Now add gerer_services to admin overrides (disable it)
        const updated = [
          ...adminSnapshot.map((p) => ({ permissionKey: p.key, enabled: p.enabled })),
          { permissionKey: "gerer_services", enabled: false },
        ];
        return authed(adminToken, "PUT", `${API_URL}/api/rbac/permissions/admin`, {
          permissions: updated,
        }).then((r) => expect(r.status).to.eq(200));
      })
      .then(() => {
        // Verify admin is NOW blocked
        return authed(adminToken, "POST", `${API_URL}/api/Services`, {}).then((r) => {
          expect(r.status).to.eq(403);
        });
      })
      .then(() => {
        // Restore original overrides
        return saveAdminOverrides(adminToken, adminSnapshot);
      })
      .then(() => {
        // Verify admin can access again
        return authed(adminToken, "POST", `${API_URL}/api/Services`, {}).then((r) => {
          expect(r.status).to.not.eq(403);
        });
      });
  });

  // ─────────────────────────────────────────────────
  //  UI test
  // ─────────────────────────────────────────────────

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
        return patchServicePerms(adminToken, serviceId, { export_excel: false, export_word: false });
      })
      .then(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit("/");
        cy.waitForHydration();
        cy.get('input[type="text"]').first().type("bureauordre");
        cy.get('input[type="password"]').type("bureauordre123");
        cy.get('button[type="submit"]').click();

        cy.get("aside", { timeout: 10000 }).should("exist");

        cy.get("aside").within(() => {
          cy.contains(/Mes entités|وثائقي|وملفاتي/).click();
        });
        cy.wait(1000);

        cy.get("button").contains("export excel").should("not.exist");
        cy.get("button").contains("export word").should("not.exist");
      })
      .then(() => restorePermissions(adminToken, serviceId, snapshot))
      .then(() => {
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

        cy.get("button").contains("export excel").should("exist");
        cy.get("button").contains("export word").should("exist");
      });
  });
});
