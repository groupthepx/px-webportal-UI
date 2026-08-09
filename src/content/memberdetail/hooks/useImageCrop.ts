/**
 * Custom Hook: useImageCrop
 * จัดการการ crop รูปภาพ
 */

import { useRef, useState, useCallback } from 'react';
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import { canvasPreview } from '@/utils/canvasPreview';
import { useDebounceEffect } from '@/utils/useDebounceEffect';
import { IMAGE_CROP_CONFIG } from '../constants';

/**
 * Hook สำหรับจัดการ image cropping
 */
export const useImageCrop = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileImages, setFileImages] = useState<Blob | null>(null);
  const [openActionCrop, setOpenActionCrop] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: IMAGE_CROP_CONFIG.unit,
    x: IMAGE_CROP_CONFIG.defaultCrop.x,
    y: IMAGE_CROP_CONFIG.defaultCrop.y,
    width: IMAGE_CROP_CONFIG.defaultCrop.width,
    height: IMAGE_CROP_CONFIG.defaultCrop.height,
  });

  /**
   * เปิด crop dialog
   */
  const handleOpenCrop = useCallback(() => {
    setOpenActionCrop(true);
  }, []);

  /**
   * ปิด crop dialog
   */
  const handleCloseCrop = useCallback(() => {
    setOpenActionCrop(false);
  }, []);

  /**
   * Handle image upload
   */
  const handleImageUpload = useCallback((file: File | null) => {
    if (!file) return;

    handleOpenCrop();

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
    });
    reader.readAsDataURL(file);

    // Reset crop
    setCrop({
      unit: IMAGE_CROP_CONFIG.unit,
      x: IMAGE_CROP_CONFIG.defaultCrop.x,
      y: IMAGE_CROP_CONFIG.defaultCrop.y,
      width: IMAGE_CROP_CONFIG.defaultCrop.width,
      height: IMAGE_CROP_CONFIG.defaultCrop.height,
    });

    setCompletedCrop({
      unit: IMAGE_CROP_CONFIG.unit,
      x: IMAGE_CROP_CONFIG.defaultCrop.x,
      y: IMAGE_CROP_CONFIG.defaultCrop.y,
      width: IMAGE_CROP_CONFIG.defaultCrop.width,
      height: IMAGE_CROP_CONFIG.defaultCrop.height,
    });
  }, [handleOpenCrop]);

  /**
   * Handle image load
   */
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialPercentCrop = centerAspectCrop(width, height, IMAGE_CROP_CONFIG.aspect);

    // Convert PercentCrop to PixelCrop
    const initialPixelCrop: PixelCrop = {
      unit: 'px',
      x: (initialPercentCrop.x / 100) * width,
      y: (initialPercentCrop.y / 100) * height,
      width: (initialPercentCrop.width / 100) * width,
      height: (initialPercentCrop.height / 100) * height,
    };

    setCrop(initialPixelCrop);
    setCompletedCrop(initialPixelCrop);
  }, []);

  /**
   * Center aspect crop
   */
  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  /**
   * Save cropped image
   */
  const handleSaveCrop = useCallback(async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: IMAGE_CROP_CONFIG.type,
      quality: IMAGE_CROP_CONFIG.quality,
    });

    if (blob) {
      const file = new File([blob], 'cropped-image.jpg', { type: blob.type });
      setFileImages(file);
    }

    setSelectedImage(URL.createObjectURL(blob));
    handleCloseCrop();
  }, [completedCrop, handleCloseCrop]);

  // Debounced canvas preview
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, 1, 0);
      }
    },
    100,
    [completedCrop]
  );

  return {
    // States
    imgSrc,
    selectedImage,
    fileImages,
    openActionCrop,
    crop,
    completedCrop,
    
    // Refs
    imgRef,
    previewCanvasRef,
    
    // Functions
    setCrop,
    setCompletedCrop,
    setFileImages,
    handleOpenCrop,
    handleCloseCrop,
    handleImageUpload,
    onImageLoad,
    handleSaveCrop,
  };
};

