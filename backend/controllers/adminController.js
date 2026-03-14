import {
  getAdminApplicationById,
  listAdminApplications,
} from "../models/applicationModel.js";
import { getResponsesByApplicationId } from "../models/responseModel.js";

export async function listApplications(req, res) {
  try {
    const allApplications = await listAdminApplications();
    return res.json(allApplications);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch applications" });
  }
}

export async function getApplicationDetails(req, res) {
  try {
    const { id } = req.params;
    const [application] = await getAdminApplicationById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const userAnswers = await getResponsesByApplicationId(id);

    return res.json({
      ...application,
      answers: userAnswers,
      fileBaseUrl: "http://localhost:3000/uploads/",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
