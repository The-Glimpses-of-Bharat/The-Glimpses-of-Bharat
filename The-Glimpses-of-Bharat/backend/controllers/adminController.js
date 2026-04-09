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
