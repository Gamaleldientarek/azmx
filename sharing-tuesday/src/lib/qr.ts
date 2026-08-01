import "server-only";

import QRCode from "qrcode";

/**
 * Render a join URL as a PNG data URL, server-side.
 *
 * Sized/margined for the projection screen: scan-reliable from a phone at
 * 3-5 m. The caller renders it with a plain `<img src={dataUrl}>`.
 */
export async function joinQrDataUrl(joinUrl: string): Promise<string> {
  return QRCode.toDataURL(joinUrl, {
    type: "image/png",
    errorCorrectionLevel: "M",
    width: 640,
    margin: 2,
    color: {
      dark: "#040038", // AZMX Dark Navy on white — max scanner contrast
      light: "#FFFFFF",
    },
  });
}
