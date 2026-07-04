import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Photo, Project, Room } from "./types";
import type { RoomType } from "../rooms/roomTypes";
import { getRoomDefinition, type TargetFace } from "../rooms/roomDefinitions";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<Project> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data as Project;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, address }: { name: string; address?: string }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");

      const { data, error } = await supabase
        .from("projects")
        .insert({ name, address: address || null, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useProjectRooms(projectId: string | undefined) {
  return useQuery({
    queryKey: ["rooms", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<Room[]> => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: ["room", roomId],
    enabled: !!roomId,
    queryFn: async (): Promise<Room> => {
      const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single();
      if (error) throw error;
      return data as Room;
    },
  });
}

export function useAddRoom(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roomType: RoomType) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert({ project_id: projectId, room_type: roomType })
        .select()
        .single();
      if (error) throw error;
      return data as Room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", projectId] });
    },
  });
}

export function useRoomPhotos(roomId: string | undefined) {
  return useQuery({
    queryKey: ["photos", roomId],
    enabled: !!roomId,
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Photo[];
    },
  });
}

/** Signed URLs are short-lived; cached separately from the row metadata so
 * refreshing them doesn't require re-fetching photo rows. */
export function useSignedPhotoUrl(storagePath: string | undefined) {
  return useQuery({
    queryKey: ["photo-url", storagePath],
    enabled: !!storagePath,
    staleTime: 1000 * 60 * 30,
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase.storage
        .from("house-photos")
        .createSignedUrl(storagePath as string, 60 * 60);
      if (error) throw error;
      return data.signedUrl;
    },
  });
}

/** Maps a room's captured photos onto their target 3D faces (signed URLs),
 * for feeding directly into the Three.js room shell. */
export function usePhotosByFace(room: Room | undefined, photos: Photo[] | undefined) {
  const definition = room ? getRoomDefinition(room.room_type) : null;
  const entries = (definition?.vantagePoints ?? []).map((vp) => ({
    face: vp.targetFace,
    storagePath: photos?.find((p) => p.vantage_point_id === vp.id)?.storage_path,
  }));

  const results = useQueries({
    queries: entries.map((e) => ({
      queryKey: ["photo-url", e.storagePath],
      enabled: !!e.storagePath,
      staleTime: 1000 * 60 * 30,
      queryFn: async (): Promise<string> => {
        const { data, error } = await supabase.storage
          .from("house-photos")
          .createSignedUrl(e.storagePath as string, 60 * 60);
        if (error) throw error;
        return data.signedUrl;
      },
    })),
  });

  const photosByFace: Partial<Record<TargetFace, string>> = {};
  entries.forEach((e, i) => {
    const url = results[i]?.data;
    if (url) photosByFace[e.face] = url;
  });
  return photosByFace;
}
