import api from '../api/config';

async function generateUploadUrl(report_id) {
  const response = await api.post(`v1/ordem-service-attachment/upload-url/${report_id}`);

  if (response.status !== 200) {
    return {
      success: false,
      message: response.data.message || 'Erro ao gerar URL de upload',
    };
  }

  return response.data;
}

async function uploadPhoto(uploadUrl, photoUri) {
  const response = await fetch(photoUri);
  const blob = await response.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: blob,
  });

  return uploadResponse.data;
}

export async function addAttachment(photoUri, report_id) {
  const uploadUrl = await generateUploadUrl(report_id);

  if (!uploadUrl.success) {
    return {
      success: false,
      message: uploadUrl.message || 'Erro ao gerar URL de upload',
    };
  }

  const result = await uploadPhoto(uploadUrl.data.upload_url, photoUri);

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Erro ao enviar imagem',
    };
  }

  return {
    success: true,
    data: result,
  };
}
