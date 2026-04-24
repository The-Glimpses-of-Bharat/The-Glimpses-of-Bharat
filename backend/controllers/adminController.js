const AdminService = require("../services/adminService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await AdminService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    const user = await AdminService.updateUserRole(req.params.id, role);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ─── Contribution Management ───────────────────────────────────────────────

exports.getPendingContributions = async (req, res) => {
  try {
    const contributions = await AdminService.getPendingContributions();
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.approveContribution = async (req, res) => {
  try {
    const fighter = await AdminService.approveContribution(req.params.id);
    res.json({ message: "Contribution approved successfully", fighter });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.rejectContribution = async (req, res) => {
  try {
    const fighter = await AdminService.rejectContribution(req.params.id);
    res.json({ message: "Contribution rejected", fighter });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ─── Freedom Fighters CRUD (Admin) ─────────────────────────────────────────

exports.getAllFighters = async (req, res) => {
  try {
    const fighters = await AdminService.getAllFighters();
    res.json(fighters);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.createFighterAdmin = async (req, res) => {
  try {
    const fighter = await AdminService.createFighter(req.body, req.user.id);
    res.status(201).json(fighter);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateFighterAdmin = async (req, res) => {
  try {
    const fighter = await AdminService.updateFighter(req.params.id, req.body);
    res.json(fighter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteFighterAdmin = async (req, res) => {
  try {
    await AdminService.deleteFighterById(req.params.id);
    res.json({ message: "Fighter deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
