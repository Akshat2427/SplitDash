export const uploadToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "upload_preset"); // Replace with your actual preset name

  const res = await fetch("https://api.cloudinary.com/v1_1/druoyuirl/image/upload", {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    const errorDetails = await res.json();
    console.error("Cloudinary Error:", errorDetails); // Log detailed error
    throw new Error(`Failed to upload image: ${errorDetails.error.message}`);
  }

  const json = await res.json();
  console.log("Cloudinary Response:", json); // Log successful response
  return json.secure_url; // This is your image URL
};