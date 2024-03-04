const express = require('express');
const { auth } = require('../middleware/auth');
const roleController = require('../controllers/roleController');

const router = new express.Router();

// Tạo mới một Role
router.post('/roles', roleController.createRole);

// Lấy danh sách tất cả Roles
router.get('/roles', roleController.getAllRoles);

// Cập nhật một Role bởi ID
router.patch('/roles/:id', roleController.updateRole);

// Xóa một Role bởi ID
router.delete('/roles/:id',roleController.deleteRole);

module.exports = router;
