import { and, eq } from "drizzle-orm";

import db from "../db/index.js";
import { applications, users } from "../db/schema.js";

export function findDraftApplication(userId, formId) {
  return db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        eq(applications.formId, formId),
        eq(applications.status, "draft"),
      ),
    );
}

export function createApplication(userId, formId, status = "draft") {
  return db
    .insert(applications)
    .values({ userId, formId, status })
    .returning();
}

export function getApplicationById(applicationId) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.applicationId, applicationId));
}

export function updateApplicationStatus(applicationId, status) {
  return db
    .update(applications)
    .set({ status })
    .where(eq(applications.applicationId, applicationId))
    .returning();
}

export function listAdminApplications() {
  return db
    .select({
      applicationId: applications.applicationId,
      userId: applications.userId,
      status: applications.status,
      username: users.name,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(users, eq(applications.userId, users.userId));
}

export function getAdminApplicationById(applicationId) {
  return db
    .select({
      applicationId: applications.applicationId,
      userId: applications.userId,
      status: applications.status,
      createdAt: applications.createdAt,
      username: users.name,
    })
    .from(applications)
    .innerJoin(users, eq(applications.userId, users.userId))
    .where(eq(applications.applicationId, applicationId))
    .limit(1);
}
