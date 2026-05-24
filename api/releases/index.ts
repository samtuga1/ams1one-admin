import Axios from "@/api";
import { handleApiError } from "@/utils/api_error";

export interface IRelease {
  version: string | null;
  apk_url: string | null;
}

export interface IUploadReleasePayload {
  version: string;
  apk_file: File;
  release_notes?: string;
  is_published?: boolean;
}

class ReleasesService {
  static getLatestRelease = async (): Promise<IRelease> => {
    try {
      const response = await Axios({ url: "/api/v1/releases/latest/", method: "GET" });
      return response.data as IRelease;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static uploadRelease = async (payload: IUploadReleasePayload): Promise<IRelease> => {
    try {
      const formData = new FormData();
      formData.append("version", payload.version);
      formData.append("apk_file", payload.apk_file);
      if (payload.release_notes) formData.append("release_notes", payload.release_notes);
      if (payload.is_published !== undefined)
        formData.append("is_published", String(payload.is_published));

      const response = await Axios({
        url: "/api/v1/releases/upload/",
        method: "POST",
        data: formData,
        headers: { "Content-Type": undefined },
      });
      return response.data as IRelease;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default ReleasesService;
