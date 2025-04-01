import User from "../../models/user.model.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../../utils/getDataUri.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    return res.status(200).json({
      message: "User profile fetched successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid User Data",
      error: true,
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const { bio, gender } = req.body;
    const { profilePicture } = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      await cloudinary.v1.uploader.upload(fileUri, (err, result) => {
        if (err) {
          return res.status(400).json({
            message: "Invalid User Data",
            error: true,
            success: false,
          });
        }
        cloudResponse = result;
      });
    }
    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if (cloudResponse) {
      user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();

    return res.status(200).json({
      message: "User profile edited successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid User Data",
      error: true,
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const suggestedUsers = await User.find({ _id: { $ne: userId } })
      .select("-password")
      .limit(5);
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "No suggested users found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Suggested users fetched successfully",
      error: false,
      success: true,
      data: suggestedUsers,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid User Data",
      error: true,
      success: false,
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const theOneWhoFollows = req.id;
    const theOneWhoIsFollowed = req.params.id;
    if (theOneWhoFollows === theOneWhoIsFollowed) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        error: true,
        success: false,
      });
    }
    const user = await User.findById(theOneWhoIsFollowed);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const isFollowing = user.followers.includes(theOneWhoFollows);
    if (isFollowing) {
      user.followers.pull(theOneWhoFollows);
      await user.save();
      return res.status(200).json({
        message: "Unfollowed successfully",
        error: false,
        success: true,
      });
    } else {
      user.followers.push(theOneWhoFollows);
      await user.save();
      return res.status(200).json({
        message: "Followed successfully",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Invalid User Data",
      error: true,
      success: false,
    });
  }
};
