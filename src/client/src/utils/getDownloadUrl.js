import axios from "axios";

export default async function getDownloadUrl(key, filename) {
  try {
    const { data } = await axios.get('/api/file/download', {
      params: {
        key: key,
        filename: filename,
      }
    });

    console.log(data);

    if (!data?.data.signedDownloadUrl) {
      throw new Error("Backend did not return a signed download URL");
    }

    console.log("Download URL Result:", data.data.signedDownloadUrl);

    return data.data.signedDownloadUrl;
  } catch (err) {
    console.error("Error in fetching download URL:", err);
    throw err;
  }
}
