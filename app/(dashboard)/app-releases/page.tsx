"use client";

import CustomInputComponent from "@/components/custom-input-component";
import ReleasesService, { IRelease } from "@/api/releases";
import ToastService from "@/utils/toast-service";
import ApiError from "@/utils/api_error";
import { Button, Form, Spinner } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  LuSmartphone,
  LuDownload,
  LuUpload,
  LuPackage,
} from "react-icons/lu";

function AppReleasesView() {
  const queryClient = useQueryClient();
  const [uploadFormKey, setUploadFormKey] = useState(0);

  const {
    files: apkFiles,
    onClick: pickApk,
    clearFiles: clearApk,
    InputComponent: ApkInput,
  } = useFileUpload({ accept: ".apk", multiple: false });

  const { data: latest, isLoading: loadingLatest } = useQuery<IRelease>({
    queryKey: ["releases", "latest"],
    queryFn: () => ReleasesService.getLatestRelease(),
  });

  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: (fd: FormData) => {
      const version = String(fd.get("version") ?? "").trim();
      const release_notes = String(fd.get("release_notes") ?? "").trim();
      return ReleasesService.uploadRelease({
        version,
        apk_file: apkFiles[0],
        release_notes: release_notes || undefined,
        is_published: true,
      });
    },
    onSuccess: () => {
      ToastService.success({ text: "APK uploaded successfully." });
      clearApk();
      setUploadFormKey((k) => k + 1);
      queryClient.invalidateQueries({ queryKey: ["releases", "latest"] });
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Upload failed." });
    },
  });

  const handleSubmit: React.ComponentProps<typeof Form>["onSubmit"] = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const version = String(fd.get("version") ?? "").trim();

    if (!version) {
      ToastService.error({ text: "Enter a version number." });
      return;
    }
    if (apkFiles.length === 0) {
      ToastService.error({ text: "Select an APK file to upload." });
      return;
    }

    upload(fd);
  };

  return (
    <div className="p-5 px-7 pb-10 max-w-xl">
      <div className="flex items-center gap-2.5 mb-6">
        <LuSmartphone className="w-5 h-5 text-primary" />
        <span className="text-lg font-gotham-black uppercase">App Releases</span>
      </div>

      {/* Current release */}
      <div className="border rounded-xl p-4 bg-gray-50 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LuPackage className="w-4 h-4 text-primary" />
          <span className="text-xs font-gotham-black text-gray-500 uppercase tracking-wide">
            Current Release
          </span>
        </div>

        {loadingLatest ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <Spinner size="sm" /> Fetching latest release…
          </div>
        ) : latest?.version ? (
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 text-xs font-gotham-bold px-2.5 py-1 rounded-full">
              <LuPackage className="w-3.5 h-3.5" />
              v{latest.version}
            </span>
            {latest.apk_url && (
              <div>
                <a
                  href={latest.apk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-gotham-bold hover:underline"
                >
                  <LuDownload className="w-3.5 h-3.5" />
                  Download APK
                </a>
              </div>
            )}
            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Download link is a presigned S3 URL valid for 1 hour. Refresh the page to get a fresh link.
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">No published release yet.</p>
        )}
      </div>

      {/* Upload new release */}
      <div className="flex items-center gap-2 mb-4">
        <LuUpload className="w-4 h-4 text-primary" />
        <span className="text-sm font-gotham-black uppercase">Upload New Release</span>
      </div>

      <Form key={uploadFormKey} onSubmit={handleSubmit}>
        <div className="space-y-4 w-full">
          <CustomInputComponent
            label="Version (e.g. 1.4.2)"
            name="version"
            className="p-0 border rounded-lg border-gray-300"
            showPreficIcon={false}
            showPlaceholder={false}
            isRequired
          />

          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-gotham-bold">APK File *</p>
            <ApkInput />
            <button
              type="button"
              onClick={pickApk}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors text-center cursor-pointer"
            >
              {apkFiles[0] ? (
                <span className="font-gotham-bold text-gray-700">{apkFiles[0].name}</span>
              ) : (
                "Click to select APK file (.apk)"
              )}
            </button>
            {apkFiles[0] && (
              <button
                type="button"
                onClick={clearApk}
                className="mt-1 text-[11px] text-red-500 hover:underline cursor-pointer"
              >
                Remove file
              </button>
            )}
          </div>

          <CustomInputComponent
            label="Release Notes (optional)"
            name="release_notes"
            className="p-0 border rounded-lg border-gray-300"
            showPreficIcon={false}
            showPlaceholder={false}
            isRequired={false}
          />

          <Button
            type="submit"
            isDisabled={uploading}
            className="w-full rounded-lg bg-primary text-white text-xs font-gotham-black mt-2"
          >
            {uploading ? <Spinner size="sm" color="current" /> : "Upload Release"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AppReleasesView;
