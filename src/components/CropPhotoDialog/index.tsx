import React, { FC, RefObject } from 'react';
import { Dialog, DialogActions, DialogContent, Button, Box} from '@mui/material';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Grid from '@mui/material/Grid2';
interface CropPhotoDialogProps {
  open: boolean;
  imgSrc: string;
  crop: Crop;
  completedCrop: PixelCrop | undefined;
  imgRef: RefObject<HTMLImageElement>;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  aspect: number;
  handleClose: () => void;
  handleCropChange: (crop: Crop, percentCrop: Crop) => void;
  handleCropComplete: (crop: PixelCrop) => void;
  handleSave: () => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  circularCrop? : boolean
}

const CropPhotoDialog: FC<CropPhotoDialogProps> = ({
  open,
  imgSrc,
  crop,
  completedCrop,
  imgRef,
  previewCanvasRef,
  aspect,
  handleClose,
  handleCropChange,
  handleCropComplete,
  handleSave,
  onImageLoad,
  circularCrop = true
}) => {
  return (
    <Dialog   fullWidth open={open} onClose={handleClose}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid
            
            size={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {imgSrc && (
              <Box
                sx={{
                  maxHeight: 'auto',
                  maxWidth: 'auto',
                  width: 'auto',
                  height:'auto',
                }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={handleCropChange}
                  onComplete={handleCropComplete}
                  aspect={aspect}
                  minWidth={500}
                  minHeight={500}
                  circularCrop={circularCrop}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{
                      transform: `scale(1) rotate(0deg)`,
                      width: '100%',
                      height: '100%',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </Box>
            )}
          </Grid>
          {completedCrop && (
            <Box display={{ xs: 'none' }}>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </Box>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          sx={{ mx: 1 }}
          size="medium"
          onClick={handleClose}
        >
          ปิด
        </Button>
        <Button
          size="medium"
          onClick={handleSave}
          sx={{ backgroundColor: 'primary.main', textTransform: 'none' }}
          variant="contained"
        >
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropPhotoDialog;
