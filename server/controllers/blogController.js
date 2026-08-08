import Blog from '../models/Blog.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// Get all blogs (supports pagination, category and search filtering)
export const getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, tag, all } = req.query;
    const query = {};

    // Standard client requests only show published articles. Admin requests show everything (except deleted).
    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ order: 1, createdAt: -1 })
        .limit(Number(limit))
        .skip(skipIndex),
      Blog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog post by slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Create a blog post
export const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };

    // Process tags
    if (blogData.tags) {
      if (typeof blogData.tags === 'string') {
        blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    blogData.published = blogData.published === 'true' || blogData.published === true;

    // Handle thumbnail image upload
    if (req.file) {
      blogData.thumbnail = await uploadImage(req.file, 'blogs');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail image is required',
      });
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Update blog post
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const updateData = { ...req.body };

    // Process tags
    if (updateData.tags) {
      if (typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (Array.isArray(updateData.tags)) {
        updateData.tags = updateData.tags;
      }
    }

    if (updateData.published !== undefined) {
      updateData.published = updateData.published === 'true' || updateData.published === true;
    }

    // Handle thumbnail upload update
    if (req.file) {
      await deleteImage(blog.thumbnail);
      updateData.thumbnail = await uploadImage(req.file, 'blogs');
    }

    blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog post (Soft Delete)
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Soft delete
    blog.status = 'deleted';
    blog.deletedAt = new Date();
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};

// Like blog post
export const likeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      likes: blog.likes,
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to blog post
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, content } = req.body;

    if (!username || !email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and comment content',
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    blog.comments.push({ username, email, content });
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: blog.comments[blog.comments.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment from blog post (Admin only)
export const deleteComment = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
