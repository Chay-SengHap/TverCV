import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ModernRightTemplate from './templates/ModernRightTemplate';
import AcademicTemplate from './templates/AcademicTemplate';

// A4 dimensions in pixels at 96dpi
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const ResumePreview = ({ data, template, accentColor, mode, children }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-detect if we are on the public /view/:id page
  const isPublicView = window.location.pathname.includes('/view/');

  // WeakMap cache to store object URLs for raw File objects to prevent memory leaks during frequent typing updates
  const objectUrlCache = useRef(new WeakMap());

  const getObjectURL = (file) => {
    if (!file) return "";
    if (!objectUrlCache.current.has(file)) {
      objectUrlCache.current.set(file, URL.createObjectURL(file));
    }
    return objectUrlCache.current.get(file);
  };

  const renderTemplate = () => {
    // Clone and normalize data so raw local File objects render instantly in templates
    const normalizedData = { ...data };
    if (normalizedData.personal_info && normalizedData.personal_info.image_url instanceof File) {
      normalizedData.personal_info = {
        ...normalizedData.personal_info,
        image_url: getObjectURL(normalizedData.personal_info.image_url)
      };
    }

    switch (template) {
      case "modern": return <ModernTemplate data={normalizedData} accentColor={accentColor} />;
      case "minimal": return <MinimalTemplate data={normalizedData} accentColor={accentColor} />;
      case "minimal-image": return <MinimalImageTemplate data={normalizedData} accentColor={accentColor} />;
      case "classic": return <ClassicTemplate data={normalizedData} accentColor={accentColor} />;
      case "executive": return <ExecutiveTemplate data={normalizedData} accentColor={accentColor} />;
      case "creative": return <CreativeTemplate data={normalizedData} accentColor={accentColor} />;
      case "modern-right": return <ModernRightTemplate data={normalizedData} accentColor={accentColor} />;
      case "academic": return <AcademicTemplate data={normalizedData} accentColor={accentColor} />;
      default: return <ClassicTemplate data={normalizedData} accentColor={accentColor} />;
    }
  };

  // Recalculate scale when container width or viewport height changes
  useEffect(() => {
    const updateScale = () => {
      const targetElement = containerRef.current;
      if (!targetElement) return;

      // Get the width of the parent container to know how much horizontal space we have
      const parentWidth = targetElement.parentElement?.offsetWidth || targetElement.offsetWidth;
      const widthScale = parentWidth / A4_WIDTH_PX;

      if (mode === 'thumbnail') {
        setScale(widthScale);
        return;
      }

      // Get the available vertical viewport height (using less padding on desktop for a larger preview)
      const padding = window.innerWidth >= 1024 ? 110 : 160;
      const availableHeight = window.innerHeight - padding;
      const heightScale = availableHeight / A4_HEIGHT_PX;

      // Scale down to fit the smaller of the two bounds (width or height)
      let newScale = Math.min(widthScale, heightScale);

      // On desktop/laptops, don't let it shrink too much if width is available; keep it highly readable
      if (window.innerWidth >= 1024) {
        newScale = Math.max(newScale, Math.min(widthScale, 0.72));
      }

      // Ensure we don't scale down past a readable layout size on ultra-small screens
      newScale = Math.max(0.3, newScale);

      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    const element = containerRef.current;
    if (element) observer.observe(element);

    // Add a window resize listener to dynamically recalculate when resizing height
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [totalPages]); // Re-run when pages change to bind new container

  // Measure rendered content height to compute page count
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(() => {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      const pages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX));
      setTotalPages(pages);
      setCurrentPage(prev => Math.min(prev, pages));
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, template, accentColor]);

  // How many px to translate up for current page (only used in single page mode)
  const translateY = -(currentPage - 1) * A4_HEIGHT_PX;

  const printStyles = (
    <style>{`
      @page {
        size: A4;
        margin: 0;
      }

      @media print {
        /* Hide all UI elements */
        body * {
          visibility: hidden;
        }

        /* Show resume preview content */
        #resume-preview,
        #resume-preview *,
        #print-clone,
        #print-clone * {
          visibility: visible !important;
        }

        [data-print-container] {
          height: auto !important;
          overflow: visible !important;
          box-shadow: none !important;
          border: none !important;
          position: static !important;
        }

        [data-print-scaler] {
          transform: none !important;
          width: 210mm !important;
          height: auto !important;
          overflow: visible !important;
          position: static !important;
        }

        #resume-preview {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 210mm !important;
          height: auto !important;
          overflow: visible !important;
          visibility: visible !important;
        }

        #resume-preview header,
        #resume-preview aside,
        #resume-preview [style*="backgroundColor"],
        #resume-preview [style*="background-color"],
        #resume-preview span[style*="backgroundColor"] {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `}</style>
  );

  // If we are on public preview, render stacked pages of A4 sheets
  if (isPublicView) {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Hidden off-screen reference element to calculate height */}
        <div className="absolute top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ width: A4_WIDTH_PX, height: 0 }}>
          <div ref={contentRef}>
            {renderTemplate()}
          </div>
        </div>

        {/* Stack of A4 viewport pages */}
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            ref={pageIndex === 0 ? containerRef : null}
            data-print-container
            className="shadow-xl rounded-sm bg-white overflow-hidden relative"
            style={{ width: `${A4_WIDTH_PX * scale}px`, height: `${A4_HEIGHT_PX * scale}px` }}
          >
            <div
              data-print-scaler
              style={{
                width: A4_WIDTH_PX,
                transformOrigin: 'top left',
                transform: `scale(${scale}) translateY(${-pageIndex * A4_HEIGHT_PX}px)`,
              }}
            >
              <div>
                {/* Clone of template content offset for this page */}
                {renderTemplate()}
              </div>
            </div>
          </div>
        ))}
        {printStyles}
      </div>
    );
  }

  if (mode === 'thumbnail') {
    return (
      <div
        ref={containerRef}
        className="bg-white overflow-hidden relative pointer-events-none select-none rounded-sm border border-slate-200/50 shadow-sm"
        style={{ width: `${A4_WIDTH_PX * scale}px`, height: `${A4_HEIGHT_PX * scale}px` }}
      >
        <div
          style={{
            width: A4_WIDTH_PX,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          <div ref={contentRef}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render single view with paginated slide button (inside Builder editor)
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {children && (
        <div style={{ width: `${A4_WIDTH_PX * scale}px` }} className="mb-1 print:hidden">
          {children}
        </div>
      )}
      <div
        ref={containerRef}
        data-print-container
        className="shadow-xl rounded-sm bg-white overflow-hidden relative"
        style={{ width: `${A4_WIDTH_PX * scale}px`, height: `${A4_HEIGHT_PX * scale}px` }}
      >
        <div
          data-print-scaler
          style={{
            width: A4_WIDTH_PX,
            transformOrigin: 'top left',
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div id="resume-preview" ref={contentRef}>
            {renderTemplate()}
          </div>
        </div>

        {/* Visual page break dashed indicators */}
        {Array.from({ length: totalPages - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${(i + 1) * A4_HEIGHT_PX * scale}px`,
              borderTop: '2px dashed #cbd5e1',
              zIndex: 10,
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-6 mt-4 z-50 flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 shadow-2xl shadow-black/40 select-none print:hidden">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="disabled:opacity-30 hover:text-gray-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold min-w-[40px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 hover:text-gray-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {printStyles}
    </div>
  );
};

export default ResumePreview;