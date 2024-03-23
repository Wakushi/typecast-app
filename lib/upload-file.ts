export async function uploadFile(selectedFile: any) {
  let key
  let keyId
  let fileCID
  let link
  try {
    const tempKey = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/key`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const keyData = await tempKey.json()
    key = keyData.JWT
    keyId = keyData.pinata_api_key
  } catch (error) {
    console.log("error making API key:", error)
  }

  try {
    const formData = new FormData()
    formData.append("file", selectedFile)

    const metadata = JSON.stringify({
      name: `${selectedFile.name}`,
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
      cidVersion: 1,
    })
    formData.append("pinataOptions", options)

    const uploadRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
        },
        body: formData,
      }
    )
    const uploadResJson = await uploadRes.json()
    fileCID = uploadResJson.IpfsHash
    const fileExtensions: any = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }
    const selectedFileType = selectedFile.type
    const defaultExtension = "png"
    const fileExtension = fileExtensions[selectedFileType] || defaultExtension
    link = `${process.env.NEXT_PUBLIC_GATEWAY}/ipfs/${fileCID}?img-width=1080&filename=image.${fileExtension}`
  } catch (error) {
    console.log("Error uploading file:", error)
  }

  try {
    const deleteData = JSON.stringify({
      apiKey: keyId,
    })
    const deleteKey = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/key`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: deleteData,
      }
    )
    const deleteJson = await deleteKey.json()
  } catch (error) {
    console.log("Error deleting API key:", error)
  }

  return link
}
