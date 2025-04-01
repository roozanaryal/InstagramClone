import sharp from "sharp";
import cloudinary from "cloudinary";
import Post from "../../models/Post";
import User from "../../models/User";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        error: true,
        success: false,
      });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 1024,
        height: 1024,
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.v1.uploader.upload(
      fileUri,
      (err, result) => {
        if (err) {
          return res.status(400).json({
            message: "Invalid Post Data",
            error: true,
            success: false,
          });
        }
        return result;
      }
    );
    // const post = new Post({
    //   caption,
    //   image: cloudResponse.secure_url,
    //   author: authorId,
    // });
    // await post.save();

    const post=await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user=await User.findById(authorId);
    if(user){
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({path:"author",select:"-password"});



    return res.status(200).json({
      message: "Post created successfully",
      error: false,
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Post Data",
      error: true,
      success: false,
    });
  }
};
