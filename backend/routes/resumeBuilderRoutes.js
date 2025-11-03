import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "healthy", message: "Resume Builder API is ready" });
});

// Generate PDF resume
router.post("/generate-pdf", (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      summary,
      experience,
      education,
      skills,
      resumeTone,
      template = 'classic'
    } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fullName || 'resume'}.pdf"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Template-specific styling functions
    const getTemplateStyles = (template) => {
      switch (template) {
        case 'modern':
          return {
            primaryColor: '#4F46E5',
            secondaryColor: '#6366F1',
            headerBg: true,
            sectionStyle: 'modern'
          };
        case 'minimal':
          return {
            primaryColor: '#374151',
            secondaryColor: '#6B7280',
            headerBg: false,
            sectionStyle: 'minimal'
          };
        case 'creative':
          return {
            primaryColor: '#059669',
            secondaryColor: '#10B981',
            headerBg: true,
            sectionStyle: 'creative'
          };
        case 'executive':
          return {
            primaryColor: '#4338CA',
            secondaryColor: '#7C3AED',
            headerBg: true,
            sectionStyle: 'executive'
          };
        case 'tech':
          return {
            primaryColor: '#0891B2',
            secondaryColor: '#3B82F6',
            headerBg: true,
            sectionStyle: 'tech'
          };
        case 'academic':
          return {
            primaryColor: '#D97706',
            secondaryColor: '#EA580C',
            headerBg: true,
            sectionStyle: 'academic'
          };
        case 'designer':
          return {
            primaryColor: '#EC4899',
            secondaryColor: '#F43F5E',
            headerBg: true,
            sectionStyle: 'designer'
          };
        case 'startup':
          return {
            primaryColor: '#059669',
            secondaryColor: '#0D9488',
            headerBg: true,
            sectionStyle: 'startup'
          };
        case 'corporate':
          return {
            primaryColor: '#475569',
            secondaryColor: '#64748B',
            headerBg: true,
            sectionStyle: 'corporate'
          };
        default: // classic
          return {
            primaryColor: '#4F46E5',
            secondaryColor: '#6366F1',
            headerBg: false,
            sectionStyle: 'classic'
          };
      }
    };

    const templateStyles = getTemplateStyles(template);

    // Helper function to add section headers based on template
    const addSectionHeader = (title, y) => {
      const styles = templateStyles;
      
      if (styles.sectionStyle === 'minimal') {
        doc.fontSize(12)
           .fillColor(styles.primaryColor)
           .font('Helvetica-Bold')
           .text(title.toUpperCase(), 50, y);
        
        // Simple line
        doc.moveTo(50, y + 16)
           .lineTo(200, y + 16)
           .strokeColor(styles.secondaryColor)
           .lineWidth(0.5)
           .stroke();
        
        return y + 30;
      } else if (styles.sectionStyle === 'creative') {
        // Gradient-like effect with multiple colors
        doc.fontSize(14)
           .fillColor(styles.primaryColor)
           .font('Helvetica-Bold')
           .text(title.toUpperCase(), 50, y);
        
        // Thick colored line
        doc.moveTo(50, y + 18)
           .lineTo(550, y + 18)
           .strokeColor(styles.secondaryColor)
           .lineWidth(3)
           .stroke();
        
        return y + 35;
      } else {
        // Classic and modern styles
        doc.fontSize(14)
           .fillColor(styles.primaryColor)
           .font('Helvetica-Bold')
           .text(title.toUpperCase(), 50, y);
        
        doc.moveTo(50, y + 18)
           .lineTo(550, y + 18)
           .strokeColor(styles.primaryColor)
           .lineWidth(1)
           .stroke();
        
        return y + 35;
      }
    };

    // Helper function to add content text with bullet point support
    const addContent = (text, y, fontSize = 11) => {
      if (!text || text.trim() === '') {
        doc.fontSize(fontSize)
           .fillColor('#9CA3AF')
           .font('Helvetica-Oblique')
           .text('Not provided', 50, y);
        return doc.y + 10;
      }

      const lines = text.split('\n').filter(line => line.trim());
      let currentY = y;

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if line starts with bullet point indicators
        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
          // Add bullet point
          doc.fontSize(fontSize)
             .fillColor('#374151')
             .font('Helvetica')
             .text('•', 50, currentY);
          
          // Add bullet content with proper indentation
          doc.fontSize(fontSize)
             .fillColor('#374151')
             .font('Helvetica')
             .text(trimmedLine.substring(1).trim(), 65, currentY, {
               width: 485,
               align: 'left'
             });
        } else {
          // Regular line without bullet
          doc.fontSize(fontSize)
             .fillColor('#374151')
             .font('Helvetica')
             .text(trimmedLine, 50, currentY, {
               width: 500,
               align: 'left'
             });
        }
        
        currentY = doc.y + 5;
      });
      
      return currentY + 5;
    };

    let currentY = 50;

    // Header Section with template-specific styling
    if (templateStyles.headerBg && (template === 'modern' || template === 'creative')) {
      // Add colored header background
      doc.rect(0, 40, 612, 80)
         .fillColor(templateStyles.primaryColor)
         .fill();
      
      doc.fontSize(24)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text(fullName || 'Your Name', 50, currentY + 10, { align: 'center' });

      currentY += 35;

      // Contact Information in white
      const contactInfo = [
        email || 'your.email@example.com',
        phone || '(000) 000-0000',
        address || 'Your City, Country'
      ].filter(Boolean).join(' | ');

      doc.fontSize(11)
         .fillColor('#FFFFFF')
         .font('Helvetica')
         .text(contactInfo, 50, currentY + 10, { align: 'center' });

      currentY += 60;
    } else {
      // Standard header
      doc.fontSize(24)
         .fillColor(templateStyles.primaryColor)
         .font('Helvetica-Bold')
         .text(fullName || 'Your Name', 50, currentY, { align: 'center' });

      currentY += 35;

      // Contact Information
      const contactInfo = [
        email || 'your.email@example.com',
        phone || '(000) 000-0000',
        address || 'Your City, Country'
      ].filter(Boolean).join(' | ');

      doc.fontSize(11)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(contactInfo, 50, currentY, { align: 'center' });

      currentY += 40;
    }

    // Summary Section
    if (summary) {
      currentY = addSectionHeader('Professional Summary', currentY);
      currentY = addContent(summary, currentY);
      currentY += 15;
    }

    // Experience Section
    if (experience) {
      currentY = addSectionHeader('Professional Experience', currentY);
      currentY = addContent(experience, currentY);
      currentY += 15;
    }

    // Education Section
    if (education) {
      currentY = addSectionHeader('Education', currentY);
      currentY = addContent(education, currentY);
      currentY += 15;
    }

    // Skills Section
    if (skills) {
      currentY = addSectionHeader('Skills', currentY);
      currentY = addContent(skills, currentY);
    }

    // Footer removed - no tone information displayed

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ 
      error: "Failed to generate PDF", 
      details: error.message 
    });
  }
});

export default router;