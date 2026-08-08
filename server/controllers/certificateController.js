import Certificate from '../models/Certificate.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// Get all certificates
export const getAllCertificates = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const query = {};

    if (all === 'true') {
      query.status = { $ne: 'deleted' };
    } else {
      query.status = 'published';
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const certificates = await Certificate.find(query).sort({ order: 1, issueDate: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to sanitize incoming certificate data against Mongoose Cast errors
const sanitizeCertData = (body) => {
  const data = { ...body };
  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.__v;

  data.category = data.category || 'Certification';
  if (!data.issueDate || data.issueDate === 'null' || data.issueDate === 'undefined' || data.issueDate === '') {
    data.issueDate = new Date();
  }

  if (data.deletedAt === 'null' || data.deletedAt === 'undefined' || data.deletedAt === '' || data.deletedAt === null) {
    delete data.deletedAt;
  }
  return data;
};

// Create a certificate
export const createCertificate = async (req, res, next) => {
  try {
    const certData = sanitizeCertData(req.body);

    const file = req.file || (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null) || (req.files && (
      req.files.image?.[0] || 
      req.files.certImage?.[0] || 
      req.files.certificate?.[0]
    ));

    if (file) {
      certData.image = await uploadImage(file, 'certificates');
    } else if (!certData.image) {
      return res.status(400).json({
        success: false,
        message: 'Certificate image file is required for creation',
      });
    }

    const certificate = await Certificate.create(certData);

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// Update a certificate
export const updateCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    let certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    const updateData = sanitizeCertData(req.body);

    const file = req.file || (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null) || (req.files && (
      req.files.image?.[0] || 
      req.files.certImage?.[0] || 
      req.files.certificate?.[0]
    ));

    if (file) {
      if (certificate.image) {
        await deleteImage(certificate.image);
      }
      updateData.image = await uploadImage(file, 'certificates');
    }

    certificate = await Certificate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a certificate (Soft Delete)
export const deleteCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Soft delete
    certificate.status = 'deleted';
    certificate.deletedAt = new Date();
    await certificate.save();

    res.status(200).json({
      success: true,
      message: 'Certificate moved to Trash (soft delete)',
    });
  } catch (error) {
    next(error);
  }
};
