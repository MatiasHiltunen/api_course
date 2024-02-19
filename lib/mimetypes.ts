export const supportedMimeTypes = {
    "css": {
        "ext": ".css",
        "mimetype": "text/css"
    },
    "html": {
        "ext": ".html",
        "mimetype": "text/html"
    },
    "js": {
        "ext": ".js",
        "mimetype": "application/javascript"
    },
    "json": {
        "ext": ".json",
        "mimetype": "application/json"
    },
    "jpg": {
        "ext": ".jpg",
        "mimetype": "image/jpeg"
    },
    "png": {
        "ext": ".png",
        "mimetype": "image/png"
    },
    "gif": {
        "ext": ".gif",
        "mimetype": "image/gif"
    },
    "svg": {
        "ext": ".svg",
        "mimetype": "image/svg+xml"
    },
    "pdf": {
        "ext": ".pdf",
        "mimetype": "application/pdf"
    },
    "txt": {
        "ext": ".txt",
        "mimetype": "text/plain"
    },
    "xml": {
        "ext": ".xml",
        "mimetype": "application/xml"
    },
    "zip": {
        "ext": ".zip",
        "mimetype": "application/zip"
    },
    "mp3": {
        "ext": ".mp3",
        "mimetype": "audio/mpeg"
    },
    "mp4": {
        "ext": ".mp4",
        "mimetype": "video/mp4"
    },
    "ico": {
        "ext": ".ico",
        "mimetype": "image/x-icon"
    }
} as const

export type MimeType = keyof typeof supportedMimeTypes

export function mimeTypeForFileExtension(format: MimeType) {
    const mimeType = supportedMimeTypes[format]
    
    if(!mimeType){
        throw new Error("Unsupported file extension")
    }

    return mimeType.mimetype
}
