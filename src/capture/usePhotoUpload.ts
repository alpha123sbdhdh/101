import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { downscalePhoto } from "./usePhotoDownscale";

interface UploadArgs {
  roomId: string;
  vantagePointId: string;
  file: File;
}

export function usePhotoUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, vantagePointId, file }: UploadArgs) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");

      const downscaled = await downscalePhoto(file);
      const photoId = crypto.randomUUID();
      const storagePath = `${userId}/${roomId}/${photoId}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("house-photos")
        .upload(storagePath, downscaled, { contentType: "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("photos")
        .insert({ id: photoId, room_id: roomId, vantage_point_id: vantagePointId, storage_path: storagePath })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["photos", variables.roomId] });
    },
  });
}

export function useReplacePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoId, roomId }: { photoId: string; roomId: string }) => {
      const { data: photo, error: fetchError } = await supabase
        .from("photos")
        .select("storage_path")
        .eq("id", photoId)
        .single();
      if (fetchError) throw fetchError;

      await supabase.storage.from("house-photos").remove([photo.storage_path]);
      const { error } = await supabase.from("photos").delete().eq("id", photoId);
      if (error) throw error;
      return { roomId };
    },
    onSuccess: ({ roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["photos", roomId] });
    },
  });
}
