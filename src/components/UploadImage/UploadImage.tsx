import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { axiosInstance } from "@/api/axios-config";

type FormData = {
  image: File | null;
  preview: string | null;
}

type UploadImageProps = {
  setImagePath: (url: string) => void;
}

export const UploadImage = ({ setImagePath }: UploadImageProps) => {
  const [formData, setFormData] = useState<FormData>({
    image: null,
    preview: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Очистка объекта URL при размонтировании
  useEffect(() => {
    return () => {
      if (formData.preview) {
        URL.revokeObjectURL(formData.preview);
      }
    };
  }, [formData.preview]);

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);

      const token = `bearer ${process.env.NEXT_PUBLIC_TOKEN}`;
      const headers = { Authorization: token };
      const config = { headers };

      const response = await axiosInstance.post('/set_img', formDataToSend, config);
      console.log("response", response.data.path);
      setImagePath(response.data.path)

      if (response.status !== 200) {
        throw new Error('Ошибка при загрузке');
      } else {
        if (response.data === undefined) {
          throw new Error("API returned undefined data");
        }
        console.log('Изображение успешно загружено!', response.data.result);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Произошла ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // Очищаем предыдущий preview
    if (formData.preview) {
      URL.revokeObjectURL(formData.preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData({
      image: file,
      preview: previewUrl,
    });

    // Сразу отправляем файл на сервер
    await uploadImage(file);

    // Сбрасываем значение input, чтобы можно было выбрать тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
      <div>
        <div>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md"
            disabled={isUploading}
          />
        </div>

        {formData.preview && (
          <div className="mb-4 relative mt-2">
            <div className="relative h-48 w-full border rounded-md overflow-hidden">
              <Image
                src={formData.preview}
                alt="Предпросмотр"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold">Загрузка на сервер...</span>
              </div>
            )}
          </div>
        )}
      </div>
  );
}