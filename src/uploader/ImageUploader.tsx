import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
    onImageUploadLeft: (file: File) => void;
    onImageUploadRight: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploadLeft, onImageUploadRight }) => {
    const handleLeftImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onImageUploadLeft(e.target.files[0]);
        }
    };

    const handleRightImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onImageUploadRight(e.target.files[0]);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleLeftImageChange} />
            <input type="file" accept="image/*" onChange={handleRightImageChange} />
        </div>
    );
};

export default ImageUploader;
