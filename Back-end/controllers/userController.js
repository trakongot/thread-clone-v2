import mongoose from 'mongoose';
import Report from '../models/reportModel.js';
import User from '../models/userModel.js';

import Thread from '../models/threadModel.js';
import {
  updateUserOnboardedService,
  updateUserService,
} from '../services/userService.js';

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) res.status(404).json({ error: 'Vui lòng điền đầy đủ id user' });
  try {
    const user = await User.findById(id).select('-password -updatedAt');
    // const user = getUserByIdService(id);
    res.status(200).json({
      _id: user._id,
      name: user.name || 'Welcome to UTC Threads',
      email: user.email,
      username: user.username || 'user_' + user._id?.toString().slice(-6),
      bio: user.bio || 'New member at UTC Threads',
      profilePic:
        user.profilePic ||
        'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png',
      onboarded: user.onboarded || false,
      followers: user.followers || [],
      following: user.following || [],
      role: user.role || 'user',
      accountStatus: user.accountStatus || 'active',
      banExpiration: user.banExpiration || null,
      viewedThreads: user.viewedThreads || [],
      saves: user.saves || [],
      reposts: user.reposts || [],
      blockedUsers: user.blockedUsers || [],
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in getUserById: ', err.message);
  }
};

/**
 * Lấy thông tin người dùng từ cookies (JWT) - trường hợp user đã đăng nhập thì ko cần đăng nhập lại nữa
 */
export const getUserByCookies = (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const defaultProfilePic =
      'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png';
    const _idSuffix = user._id?.toString().slice(-6) || 'unknown';

    res.status(200).json({
      _id: user._id,
      name: user.name || 'Welcome to UTC Threads',
      email: user.email,
      username: user.username || `user_${_idSuffix}`,
      bio: user.bio || 'New member at UTC Threads',
      profilePic: user.profilePic || defaultProfilePic,
      onboarded: user.onboarded,
      followers: user.followers || [],
      following: user.following || [],
      role: user.role || 'user',
      accountStatus: user.accountStatus || 'active',
      banExpiration: user.banExpiration || null,
      viewedThreads: user.viewedThreads || [],
      saves: user.saves || [],
      reposts: user.reposts || [],
      blockedUsers: user.blockedUsers || [],
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error in getUserByCookies:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Theo dõi hoặc huỷ theo dõi người dùng
 */
export const followUnFollowUser = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    // Gọi service để thực hiện hành động theo dõi/huỷ theo dõi
    const message = followUnFollowUserService(userId, id);

    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in followUnFollowUser: ', err.message);
  }
};

/**
 * Cập nhật thông tin người dùng khi onboarded
 */
export const updateUserOnboarded = (req, res) => {
  try {
    const userId = req.user._id;
    const userData = req.body;
    const img = req.file;

    const updatedUser = updateUserOnboardedService(userId, {
      ...userData,
      img,
    });

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name || 'Welcome to UTC Threads',
      email: updatedUser.email,
      username:
        updatedUser.username || 'user_' + updatedUser._id?.toString().slice(-6),
      bio: updatedUser.bio || 'New member at UTC Threads',
      profilePic:
        updatedUser.profilePic ||
        'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png',
      onboarded: updatedUser.onboarded || false,
      followers: updatedUser.followers || [],
      following: updatedUser.following || [],
      role: updatedUser.role || 'user',
      accountStatus: updatedUser.accountStatus || 'active',
      banExpiration: updatedUser.banExpiration || null,
      viewedThreads: updatedUser.viewedThreads || [],
      saves: updatedUser.saves || [],
      reposts: updatedUser.reposts || [],
      blockedUsers: updatedUser.blockedUsers || [],
      createdAt: updatedUser.createdAt || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in updateUserOnboarded: ', err.message);
  }
};
/**
 * Cập nhật thông tin người dùng
 */
export const updateUser = (req, res) => {
  try {
    const userId = req.user._id;
    const userData = req.body;
    const img = req.file;

    const updatedUser = updateUserService(userId, {
      ...userData,
      img,
    });

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name || 'Welcome to UTC Threads',
      email: updatedUser.email,
      username:
        updatedUser.username || 'user_' + updatedUser._id?.toString().slice(-6),
      bio: updatedUser.bio || 'New member at UTC Threads',
      profilePic:
        updatedUser.profilePic ||
        'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png',
      onboarded: updatedUser.onboarded || false,
      followers: updatedUser.followers || [],
      following: updatedUser.following || [],
      role: updatedUser.role || 'user',
      accountStatus: updatedUser.accountStatus || 'active',
      banExpiration: updatedUser.banExpiration || null,
      viewedThreads: updatedUser.viewedThreads || [],
      saves: updatedUser.saves || [],
      reposts: updatedUser.reposts || [],
      blockedUsers: updatedUser.blockedUsers || [],
      createdAt: updatedUser.createdAt || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in updateUser: ', err.message);
  }
};

export const getSuggestedUsers = (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByYou = User.findById(userId).select('following');

    const users = User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id),
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const freezeAccount = (req, res) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    user.isFrozen = true;
    user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsersIAmFollowing = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId).populate(
      'following',
      'name username profilePic',
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.following.length === 0) {
      return res
        .status(404)
        .json({ message: 'You are not following anyone yet' });
    }

    res.status(200).json({ success: true, following: user.following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'System error' });
  }
};

export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newReport = await Report.create({
      reportedBy: req.user._id, // Lấy user hiện tại từ middleware `authorize`
      contentType: 'Account', // Đặt contentType là "Account" để báo cáo người dùng
      content: new mongoose.Types.ObjectId(reportedUserId), // Sử dụng new để khởi tạo ObjectId
      reason,
      description,
      status: 'pending',
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'Report successfully created',
      report: newReport,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
};
export const getAllThreads = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Phân trang
    const threads = await Thread.find()
      .populate('postedBy', 'username') // Hiển thị thông tin người đăng
      .skip((page - 1) * limit)
      // .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.status(200).json({ success: true, threads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
};
